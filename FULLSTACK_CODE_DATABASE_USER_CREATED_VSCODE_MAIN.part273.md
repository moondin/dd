---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 273
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 273 of 552)

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

---[FILE: src/vs/platform/files/node/watcher/nodejs/nodejsWatcherLib.ts]---
Location: vscode-main/src/vs/platform/files/node/watcher/nodejs/nodejsWatcherLib.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { watch, promises } from 'fs';
import { RunOnceWorker, ThrottledWorker } from '../../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { isEqual, isEqualOrParent } from '../../../../../base/common/extpath.js';
import { Disposable, DisposableStore, IDisposable, thenRegisterOrDispose, toDisposable } from '../../../../../base/common/lifecycle.js';
import { normalizeNFC } from '../../../../../base/common/normalization.js';
import { basename, dirname, join } from '../../../../../base/common/path.js';
import { isLinux, isMacintosh } from '../../../../../base/common/platform.js';
import { joinPath } from '../../../../../base/common/resources.js';
import { URI } from '../../../../../base/common/uri.js';
import { Promises } from '../../../../../base/node/pfs.js';
import { FileChangeFilter, FileChangeType, IFileChange } from '../../../common/files.js';
import { ILogMessage, coalesceEvents, INonRecursiveWatchRequest, parseWatcherPatterns, IRecursiveWatcherWithSubscribe, isFiltered, isWatchRequestWithCorrelation } from '../../../common/watcher.js';
import { Lazy } from '../../../../../base/common/lazy.js';
import { ParsedPattern } from '../../../../../base/common/glob.js';

export class NodeJSFileWatcherLibrary extends Disposable {

	// A delay in reacting to file deletes to support
	// atomic save operations where a tool may chose
	// to delete a file before creating it again for
	// an update.
	private static readonly FILE_DELETE_HANDLER_DELAY = 100;

	// A delay for collecting file changes from node.js
	// before collecting them for coalescing and emitting
	// Same delay as used for the recursive watcher.
	private static readonly FILE_CHANGES_HANDLER_DELAY = 75;

	// Reduce likelyhood of spam from file events via throttling.
	// These numbers are a bit more aggressive compared to the
	// recursive watcher because we can have many individual
	// node.js watchers per request.
	// (https://github.com/microsoft/vscode/issues/124723)
	private readonly throttledFileChangesEmitter = this._register(new ThrottledWorker<IFileChange>(
		{
			maxWorkChunkSize: 100,	// only process up to 100 changes at once before...
			throttleDelay: 200,	  	// ...resting for 200ms until we process events again...
			maxBufferedWork: 10000 	// ...but never buffering more than 10000 events in memory
		},
		events => this.onDidFilesChange(events)
	));

	// Aggregate file changes over FILE_CHANGES_HANDLER_DELAY
	// to coalesce events and reduce spam.
	private readonly fileChangesAggregator = this._register(new RunOnceWorker<IFileChange>(events => this.handleFileChanges(events), NodeJSFileWatcherLibrary.FILE_CHANGES_HANDLER_DELAY));

	private readonly excludes: ParsedPattern[];
	private readonly includes: ParsedPattern[] | undefined;
	private readonly filter: FileChangeFilter | undefined;

	private readonly cts = new CancellationTokenSource();

	private readonly realPath = new Lazy(async () => {

		// This property is intentionally `Lazy` and not using `realcase()` as the counterpart
		// in the recursive watcher because of the amount of paths this watcher is dealing with.
		// We try as much as possible to avoid even needing `realpath()` if we can because even
		// that method does an `lstat()` per segment of the path.

		let result = this.request.path;

		try {
			result = await Promises.realpath(this.request.path);

			if (this.request.path !== result) {
				this.trace(`correcting a path to watch that seems to be a symbolic link (original: ${this.request.path}, real: ${result})`);
			}
		} catch (error) {
			// ignore
		}

		return result;
	});

	readonly ready: Promise<void>;

	private _isReusingRecursiveWatcher = false;
	get isReusingRecursiveWatcher(): boolean { return this._isReusingRecursiveWatcher; }

	private didFail = false;
	get failed(): boolean { return this.didFail; }

	constructor(
		private readonly request: INonRecursiveWatchRequest,
		private readonly recursiveWatcher: IRecursiveWatcherWithSubscribe | undefined,
		private readonly onDidFilesChange: (changes: IFileChange[]) => void,
		private readonly onDidWatchFail?: () => void,
		private readonly onLogMessage?: (msg: ILogMessage) => void,
		private verboseLogging?: boolean
	) {
		super();

		const ignoreCase = !isLinux;
		this.excludes = parseWatcherPatterns(this.request.path, this.request.excludes, ignoreCase);
		this.includes = this.request.includes ? parseWatcherPatterns(this.request.path, this.request.includes, ignoreCase) : undefined;
		this.filter = isWatchRequestWithCorrelation(this.request) ? this.request.filter : undefined; // filtering is only enabled when correlating because watchers are otherwise potentially reused

		this.ready = this.watch();
	}

	private async watch(): Promise<void> {
		try {
			const stat = await promises.stat(this.request.path);

			if (this.cts.token.isCancellationRequested) {
				return;
			}

			this._register(await this.doWatch(stat.isDirectory()));
		} catch (error) {
			if (error.code !== 'ENOENT') {
				this.error(error);
			} else {
				this.trace(`ignoring a path for watching who's stat info failed to resolve: ${this.request.path} (error: ${error})`);
			}

			this.notifyWatchFailed();
		}
	}

	private notifyWatchFailed(): void {
		this.didFail = true;

		this.onDidWatchFail?.();
	}

	private async doWatch(isDirectory: boolean): Promise<IDisposable> {
		const disposables = new DisposableStore();

		if (this.doWatchWithExistingWatcher(isDirectory, disposables)) {
			this.trace(`reusing an existing recursive watcher for ${this.request.path}`);
			this._isReusingRecursiveWatcher = true;
		} else {
			this._isReusingRecursiveWatcher = false;
			await this.doWatchWithNodeJS(isDirectory, disposables);
		}

		return disposables;
	}

	private doWatchWithExistingWatcher(isDirectory: boolean, disposables: DisposableStore): boolean {
		if (isDirectory) {
			// Recursive watcher re-use is currently not enabled for when
			// folders are watched. this is because the dispatching in the
			// recursive watcher for non-recurive requests is optimized for
			// file changes  where we really only match on the exact path
			// and not child paths.
			return false;
		}

		const resource = URI.file(this.request.path);
		const subscription = this.recursiveWatcher?.subscribe(this.request.path, async (error, change) => {
			if (disposables.isDisposed) {
				return; // return early if already disposed
			}

			if (error) {
				await thenRegisterOrDispose(this.doWatch(isDirectory), disposables);
			} else if (change) {
				if (typeof change.cId === 'number' || typeof this.request.correlationId === 'number') {
					// Re-emit this change with the correlation id of the request
					// so that the client can correlate the event with the request
					// properly. Without correlation, we do not have to do that
					// because the event will appear on the global listener already.
					this.onFileChange({ resource, type: change.type, cId: this.request.correlationId }, true /* skip excludes/includes (file is explicitly watched) */);
				}
			}
		});

		if (subscription) {
			disposables.add(subscription);

			return true;
		}

		return false;
	}

	private async doWatchWithNodeJS(isDirectory: boolean, disposables: DisposableStore): Promise<void> {
		const realPath = await this.realPath.value;

		if (this.cts.token.isCancellationRequested) {
			return;
		}

		// macOS: watching samba shares can crash VSCode so we do
		// a simple check for the file path pointing to /Volumes
		// (https://github.com/microsoft/vscode/issues/106879)
		// TODO@electron this needs a revisit when the crash is
		// fixed or mitigated upstream.
		if (isMacintosh && isEqualOrParent(realPath, '/Volumes/', true)) {
			this.error(`Refusing to watch ${realPath} for changes using fs.watch() for possibly being a network share where watching is unreliable and unstable.`);

			return;
		}

		const cts = new CancellationTokenSource(this.cts.token);
		disposables.add(toDisposable(() => cts.dispose(true)));

		const watcherDisposables = new DisposableStore(); // we need a separate disposable store because we re-create the watcher from within in some cases
		disposables.add(watcherDisposables);

		try {
			const requestResource = URI.file(this.request.path);
			const pathBasename = basename(realPath);

			// Creating watcher can fail with an exception
			const watcher = watch(realPath);
			watcherDisposables.add(toDisposable(() => {
				watcher.removeAllListeners();
				watcher.close();
			}));

			this.trace(`Started watching: '${realPath}'`);

			// Folder: resolve children to emit proper events
			const folderChildren = new Set<string>();
			if (isDirectory) {
				try {
					for (const child of await Promises.readdir(realPath)) {
						folderChildren.add(child);
					}
				} catch (error) {
					this.error(error);
				}
			}

			if (cts.token.isCancellationRequested) {
				return;
			}

			const mapPathToStatDisposable = new Map<string, IDisposable>();
			watcherDisposables.add(toDisposable(() => {
				for (const [, disposable] of mapPathToStatDisposable) {
					disposable.dispose();
				}
				mapPathToStatDisposable.clear();
			}));

			watcher.on('error', (code: number, signal: string) => {
				if (cts.token.isCancellationRequested) {
					return;
				}

				this.error(`Failed to watch ${realPath} for changes using fs.watch() (${code}, ${signal})`);

				this.notifyWatchFailed();
			});

			watcher.on('change', (type, raw) => {
				if (cts.token.isCancellationRequested) {
					return; // ignore if already disposed
				}

				if (this.verboseLogging) {
					this.traceWithCorrelation(`[raw] ["${type}"] ${raw}`);
				}

				// Normalize file name
				let changedFileName = '';
				if (raw) { // https://github.com/microsoft/vscode/issues/38191
					changedFileName = raw.toString();
					if (isMacintosh) {
						// Mac: uses NFD unicode form on disk, but we want NFC
						// See also https://github.com/nodejs/node/issues/2165
						changedFileName = normalizeNFC(changedFileName);
					}
				}

				if (!changedFileName || (type !== 'change' && type !== 'rename')) {
					return; // ignore unexpected events
				}

				// Folder
				if (isDirectory) {

					// Folder child added/deleted
					if (type === 'rename') {

						// Cancel any previous stats for this file if existing
						mapPathToStatDisposable.get(changedFileName)?.dispose();

						// Wait a bit and try see if the file still exists on disk
						// to decide on the resulting event
						const timeoutHandle = setTimeout(async () => {
							mapPathToStatDisposable.delete(changedFileName);

							// Depending on the OS the watcher runs on, there
							// is different behaviour for when the watched
							// folder path is being deleted:
							//
							// -   macOS: not reported but events continue to
							//            work even when the folder is brought
							//            back, though it seems every change
							//            to a file is reported as "rename"
							// -   Linux: "rename" event is reported with the
							//            name of the folder and events stop
							//            working
							// - Windows: an EPERM error is thrown that we
							//            handle from the `on('error')` event
							//
							// We do not re-attach the watcher after timeout
							// though as we do for file watches because for
							// file watching specifically we want to handle
							// the atomic-write cases where the file is being
							// deleted and recreated with different contents.
							if (isEqual(changedFileName, pathBasename, !isLinux) && !await Promises.exists(realPath)) {
								this.onWatchedPathDeleted(requestResource);

								return;
							}

							if (cts.token.isCancellationRequested) {
								return;
							}

							// In order to properly detect renames on a case-insensitive
							// file system, we need to use `existsChildStrictCase` helper
							// because otherwise we would wrongly assume a file exists
							// when it was renamed to same name but different case.
							const fileExists = await this.existsChildStrictCase(join(realPath, changedFileName));

							if (cts.token.isCancellationRequested) {
								return; // ignore if disposed by now
							}

							// Figure out the correct event type:
							// File Exists: either 'added' or 'updated' if known before
							// File Does not Exist: always 'deleted'
							let type: FileChangeType;
							if (fileExists) {
								if (folderChildren.has(changedFileName)) {
									type = FileChangeType.UPDATED;
								} else {
									type = FileChangeType.ADDED;
									folderChildren.add(changedFileName);
								}
							} else {
								folderChildren.delete(changedFileName);
								type = FileChangeType.DELETED;
							}

							this.onFileChange({ resource: joinPath(requestResource, changedFileName), type, cId: this.request.correlationId });
						}, NodeJSFileWatcherLibrary.FILE_DELETE_HANDLER_DELAY);

						mapPathToStatDisposable.set(changedFileName, toDisposable(() => clearTimeout(timeoutHandle)));
					}

					// Folder child changed
					else {

						// Figure out the correct event type: if this is the
						// first time we see this child, it can only be added
						let type: FileChangeType;
						if (folderChildren.has(changedFileName)) {
							type = FileChangeType.UPDATED;
						} else {
							type = FileChangeType.ADDED;
							folderChildren.add(changedFileName);
						}

						this.onFileChange({ resource: joinPath(requestResource, changedFileName), type, cId: this.request.correlationId });
					}
				}

				// File
				else {

					// File added/deleted
					if (type === 'rename' || !isEqual(changedFileName, pathBasename, !isLinux)) {

						// Depending on the OS the watcher runs on, there
						// is different behaviour for when the watched
						// file path is being deleted:
						//
						// -   macOS: "rename" event is reported and events
						//            stop working
						// -   Linux: "rename" event is reported and events
						//            stop working
						// - Windows: "rename" event is reported and events
						//            continue to work when file is restored
						//
						// As opposed to folder watching, we re-attach the
						// watcher after brief timeout to support "atomic save"
						// operations where a tool may decide to delete a file
						// and then create it with the updated contents.
						//
						// Different to folder watching, we emit a delete event
						// though we never detect when the file is brought back
						// because the watcher is disposed then.

						const timeoutHandle = setTimeout(async () => {
							const fileExists = await Promises.exists(realPath);

							if (cts.token.isCancellationRequested) {
								return; // ignore if disposed by now
							}

							// File still exists, so emit as change event and reapply the watcher
							if (fileExists) {
								this.onFileChange({ resource: requestResource, type: FileChangeType.UPDATED, cId: this.request.correlationId }, true /* skip excludes/includes (file is explicitly watched) */);

								watcherDisposables.add(await this.doWatch(false));
							}

							// File seems to be really gone, so emit a deleted and failed event
							else {
								this.onWatchedPathDeleted(requestResource);
							}
						}, NodeJSFileWatcherLibrary.FILE_DELETE_HANDLER_DELAY);

						// Very important to dispose the watcher which now points to a stale inode
						// and wire in a new disposable that tracks our timeout that is installed
						watcherDisposables.clear();
						watcherDisposables.add(toDisposable(() => clearTimeout(timeoutHandle)));
					}

					// File changed
					else {
						this.onFileChange({ resource: requestResource, type: FileChangeType.UPDATED, cId: this.request.correlationId }, true /* skip excludes/includes (file is explicitly watched) */);
					}
				}
			});
		} catch (error) {
			if (cts.token.isCancellationRequested) {
				return;
			}

			this.error(`Failed to watch ${realPath} for changes using fs.watch() (${error.toString()})`);

			this.notifyWatchFailed();
		}
	}

	private onWatchedPathDeleted(resource: URI): void {
		this.warn('Watcher shutdown because watched path got deleted');

		// Emit events and flush in case the watcher gets disposed
		this.onFileChange({ resource, type: FileChangeType.DELETED, cId: this.request.correlationId }, true /* skip excludes/includes (file is explicitly watched) */);
		this.fileChangesAggregator.flush();

		this.notifyWatchFailed();
	}

	private onFileChange(event: IFileChange, skipIncludeExcludeChecks = false): void {
		if (this.cts.token.isCancellationRequested) {
			return;
		}

		// Logging
		if (this.verboseLogging) {
			this.traceWithCorrelation(`${event.type === FileChangeType.ADDED ? '[ADDED]' : event.type === FileChangeType.DELETED ? '[DELETED]' : '[CHANGED]'} ${event.resource.fsPath}`);
		}

		// Add to aggregator unless excluded or not included (not if explicitly disabled)
		if (!skipIncludeExcludeChecks && this.excludes.some(exclude => exclude(event.resource.fsPath))) {
			if (this.verboseLogging) {
				this.traceWithCorrelation(` >> ignored (excluded) ${event.resource.fsPath}`);
			}
		} else if (!skipIncludeExcludeChecks && this.includes && this.includes.length > 0 && !this.includes.some(include => include(event.resource.fsPath))) {
			if (this.verboseLogging) {
				this.traceWithCorrelation(` >> ignored (not included) ${event.resource.fsPath}`);
			}
		} else {
			this.fileChangesAggregator.work(event);
		}
	}

	private handleFileChanges(fileChanges: IFileChange[]): void {

		// Coalesce events: merge events of same kind
		const coalescedFileChanges = coalesceEvents(fileChanges);

		// Filter events: based on request filter property
		const filteredEvents: IFileChange[] = [];
		for (const event of coalescedFileChanges) {
			if (isFiltered(event, this.filter)) {
				if (this.verboseLogging) {
					this.traceWithCorrelation(` >> ignored (filtered) ${event.resource.fsPath}`);
				}

				continue;
			}

			filteredEvents.push(event);
		}

		if (filteredEvents.length === 0) {
			return;
		}

		// Logging
		if (this.verboseLogging) {
			for (const event of filteredEvents) {
				this.traceWithCorrelation(` >> normalized ${event.type === FileChangeType.ADDED ? '[ADDED]' : event.type === FileChangeType.DELETED ? '[DELETED]' : '[CHANGED]'} ${event.resource.fsPath}`);
			}
		}

		// Broadcast to clients via throttled emitter
		const worked = this.throttledFileChangesEmitter.work(filteredEvents);

		// Logging
		if (!worked) {
			this.warn(`started ignoring events due to too many file change events at once (incoming: ${filteredEvents.length}, most recent change: ${filteredEvents[0].resource.fsPath}). Use 'files.watcherExclude' setting to exclude folders with lots of changing files (e.g. compilation output).`);
		} else {
			if (this.throttledFileChangesEmitter.pending > 0) {
				this.trace(`started throttling events due to large amount of file change events at once (pending: ${this.throttledFileChangesEmitter.pending}, most recent change: ${filteredEvents[0].resource.fsPath}). Use 'files.watcherExclude' setting to exclude folders with lots of changing files (e.g. compilation output).`);
			}
		}
	}

	private async existsChildStrictCase(path: string): Promise<boolean> {
		if (isLinux) {
			return Promises.exists(path);
		}

		try {
			const pathBasename = basename(path);
			const children = await Promises.readdir(dirname(path));

			return children.some(child => child === pathBasename);
		} catch (error) {
			this.trace(error);

			return false;
		}
	}

	setVerboseLogging(verboseLogging: boolean): void {
		this.verboseLogging = verboseLogging;
	}

	private error(error: string): void {
		if (!this.cts.token.isCancellationRequested) {
			this.onLogMessage?.({ type: 'error', message: `[File Watcher (node.js)] ${error}` });
		}
	}

	private warn(message: string): void {
		if (!this.cts.token.isCancellationRequested) {
			this.onLogMessage?.({ type: 'warn', message: `[File Watcher (node.js)] ${message}` });
		}
	}

	private trace(message: string): void {
		if (!this.cts.token.isCancellationRequested && this.verboseLogging) {
			this.onLogMessage?.({ type: 'trace', message: `[File Watcher (node.js)] ${message}` });
		}
	}

	private traceWithCorrelation(message: string): void {
		if (!this.cts.token.isCancellationRequested && this.verboseLogging) {
			this.trace(`${message}${typeof this.request.correlationId === 'number' ? ` <${this.request.correlationId}> ` : ``}`);
		}
	}

	override dispose(): void {
		this.cts.dispose(true);

		super.dispose();
	}
}

/**
 * Watch the provided `path` for changes and return
 * the data in chunks of `Uint8Array` for further use.
 */
export async function watchFileContents(path: string, onData: (chunk: Uint8Array) => void, onReady: () => void, token: CancellationToken, bufferSize = 512): Promise<void> {
	const handle = await Promises.open(path, 'r');
	const buffer = Buffer.allocUnsafe(bufferSize);

	const cts = new CancellationTokenSource(token);

	let error: Error | undefined = undefined;
	let isReading = false;

	const request: INonRecursiveWatchRequest = { path, excludes: [], recursive: false };
	const watcher = new NodeJSFileWatcherLibrary(request, undefined, changes => {
		(async () => {
			for (const { type } of changes) {
				if (type === FileChangeType.UPDATED) {

					if (isReading) {
						return; // return early if we are already reading the output
					}

					isReading = true;

					try {
						// Consume the new contents of the file until finished
						// everytime there is a change event signalling a change
						while (!cts.token.isCancellationRequested) {
							const { bytesRead } = await Promises.read(handle, buffer, 0, bufferSize, null);
							if (!bytesRead || cts.token.isCancellationRequested) {
								break;
							}

							onData(buffer.slice(0, bytesRead));
						}
					} catch (err) {
						error = new Error(err);
						cts.dispose(true);
					} finally {
						isReading = false;
					}
				}
			}
		})();
	});

	await watcher.ready;
	onReady();

	return new Promise<void>((resolve, reject) => {
		cts.token.onCancellationRequested(async () => {
			watcher.dispose();

			try {
				await Promises.close(handle);
			} catch (err) {
				error = new Error(err);
			}

			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/node/watcher/parcel/parcelWatcher.ts]---
Location: vscode-main/src/vs/platform/files/node/watcher/parcel/parcelWatcher.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import parcelWatcher from '@parcel/watcher';
import { promises } from 'fs';
import { tmpdir, homedir } from 'os';
import { URI } from '../../../../../base/common/uri.js';
import { DeferredPromise, RunOnceScheduler, RunOnceWorker, ThrottledWorker } from '../../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { toErrorMessage } from '../../../../../base/common/errorMessage.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { randomPath, isEqual, isEqualOrParent } from '../../../../../base/common/extpath.js';
import { GLOBSTAR, ParsedPattern, patternsEquals } from '../../../../../base/common/glob.js';
import { BaseWatcher } from '../baseWatcher.js';
import { TernarySearchTree } from '../../../../../base/common/ternarySearchTree.js';
import { normalizeNFC } from '../../../../../base/common/normalization.js';
import { normalize, join } from '../../../../../base/common/path.js';
import { isLinux, isMacintosh, isWindows } from '../../../../../base/common/platform.js';
import { Promises, realcase } from '../../../../../base/node/pfs.js';
import { FileChangeType, IFileChange } from '../../../common/files.js';
import { coalesceEvents, IRecursiveWatchRequest, parseWatcherPatterns, IRecursiveWatcherWithSubscribe, isFiltered, IWatcherErrorEvent } from '../../../common/watcher.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';

export class ParcelWatcherInstance extends Disposable {

	private readonly _onDidStop = this._register(new Emitter<{ joinRestart?: Promise<void> }>());
	readonly onDidStop = this._onDidStop.event;

	private readonly _onDidFail = this._register(new Emitter<void>());
	readonly onDidFail = this._onDidFail.event;

	private didFail = false;
	get failed(): boolean { return this.didFail; }

	private didStop = false;
	get stopped(): boolean { return this.didStop; }

	private readonly includes: ParsedPattern[] | undefined;
	private readonly excludes: ParsedPattern[] | undefined;

	private readonly subscriptions = new Map<string, Set<(change: IFileChange) => void>>();

	constructor(
		/**
		 * Signals when the watcher is ready to watch.
		 */
		readonly ready: Promise<unknown>,
		readonly request: IRecursiveWatchRequest,
		/**
		 * How often this watcher has been restarted in case of an unexpected
		 * shutdown.
		 */
		readonly restarts: number,
		/**
		 * The cancellation token associated with the lifecycle of the watcher.
		 */
		readonly token: CancellationToken,
		/**
		 * An event aggregator to coalesce events and reduce duplicates.
		 */
		readonly worker: RunOnceWorker<IFileChange>,
		private readonly stopFn: () => Promise<void>
	) {
		super();

		const ignoreCase = !isLinux;
		this.includes = this.request.includes ? parseWatcherPatterns(this.request.path, this.request.includes, ignoreCase) : undefined;
		this.excludes = this.request.excludes ? parseWatcherPatterns(this.request.path, this.request.excludes, ignoreCase) : undefined;

		this._register(toDisposable(() => this.subscriptions.clear()));
	}

	subscribe(path: string, callback: (change: IFileChange) => void): IDisposable {
		path = URI.file(path).fsPath; // make sure to store the path in `fsPath` form to match it with events later

		let subscriptions = this.subscriptions.get(path);
		if (!subscriptions) {
			subscriptions = new Set();
			this.subscriptions.set(path, subscriptions);
		}

		subscriptions.add(callback);

		return toDisposable(() => {
			const subscriptions = this.subscriptions.get(path);
			if (subscriptions) {
				subscriptions.delete(callback);

				if (subscriptions.size === 0) {
					this.subscriptions.delete(path);
				}
			}
		});
	}

	get subscriptionsCount(): number {
		return this.subscriptions.size;
	}

	notifyFileChange(path: string, change: IFileChange): void {
		const subscriptions = this.subscriptions.get(path);
		if (subscriptions) {
			for (const subscription of subscriptions) {
				subscription(change);
			}
		}
	}

	notifyWatchFailed(): void {
		this.didFail = true;

		this._onDidFail.fire();
	}

	include(path: string): boolean {
		if (!this.includes || this.includes.length === 0) {
			return true; // no specific includes defined, include all
		}

		return this.includes.some(include => include(path));
	}

	exclude(path: string): boolean {
		return Boolean(this.excludes?.some(exclude => exclude(path)));
	}

	async stop(joinRestart: Promise<void> | undefined): Promise<void> {
		this.didStop = true;

		try {
			await this.stopFn();
		} finally {
			this._onDidStop.fire({ joinRestart });
			this.dispose();
		}
	}
}

export class ParcelWatcher extends BaseWatcher implements IRecursiveWatcherWithSubscribe {

	private static readonly MAP_PARCEL_WATCHER_ACTION_TO_FILE_CHANGE = new Map<parcelWatcher.EventType, number>(
		[
			['create', FileChangeType.ADDED],
			['update', FileChangeType.UPDATED],
			['delete', FileChangeType.DELETED]
		]
	);

	private static readonly PREDEFINED_EXCLUDES: { [platform: string]: string[] } = {
		'win32': [],
		'darwin': [
			join(homedir(), 'Library', 'Containers') // Triggers access dialog from macOS 14 (https://github.com/microsoft/vscode/issues/208105)
		],
		'linux': []
	};

	private static readonly PARCEL_WATCHER_BACKEND = isWindows ? 'windows' : isLinux ? 'inotify' : 'fs-events';

	private readonly _onDidError = this._register(new Emitter<IWatcherErrorEvent>());
	readonly onDidError = this._onDidError.event;

	private readonly _watchers = new Map<string /* path */ | number /* correlation ID */, ParcelWatcherInstance>();
	get watchers() { return this._watchers.values(); }

	// A delay for collecting file changes from Parcel
	// before collecting them for coalescing and emitting.
	// Parcel internally uses 50ms as delay, so we use 75ms,
	// to schedule sufficiently after Parcel.
	//
	// Note: since Parcel 2.0.7, the very first event is
	// emitted without delay if no events occured over a
	// duration of 500ms. But we always want to aggregate
	// events to apply our coleasing logic.
	//
	private static readonly FILE_CHANGES_HANDLER_DELAY = 75;

	// Reduce likelyhood of spam from file events via throttling.
	// (https://github.com/microsoft/vscode/issues/124723)
	private readonly throttledFileChangesEmitter = this._register(new ThrottledWorker<IFileChange>(
		{
			maxWorkChunkSize: 500,	// only process up to 500 changes at once before...
			throttleDelay: 200,	  	// ...resting for 200ms until we process events again...
			maxBufferedWork: 30000 	// ...but never buffering more than 30000 events in memory
		},
		events => this._onDidChangeFile.fire(events)
	));

	private enospcErrorLogged = false;

	constructor() {
		super();

		this.registerListeners();
	}

	private registerListeners(): void {
		const onUncaughtException = (error: unknown) => this.onUnexpectedError(error);
		const onUnhandledRejection = (error: unknown) => this.onUnexpectedError(error);

		process.on('uncaughtException', onUncaughtException);
		process.on('unhandledRejection', onUnhandledRejection);

		this._register(toDisposable(() => {
			process.off('uncaughtException', onUncaughtException);
			process.off('unhandledRejection', onUnhandledRejection);
		}));
	}

	protected override async doWatch(requests: IRecursiveWatchRequest[]): Promise<void> {

		// Figure out duplicates to remove from the requests
		requests = await this.removeDuplicateRequests(requests);

		// Figure out which watchers to start and which to stop
		const requestsToStart: IRecursiveWatchRequest[] = [];
		const watchersToStop = new Set(Array.from(this.watchers));
		for (const request of requests) {
			const watcher = this._watchers.get(this.requestToWatcherKey(request));
			if (watcher && patternsEquals(watcher.request.excludes, request.excludes) && patternsEquals(watcher.request.includes, request.includes) && watcher.request.pollingInterval === request.pollingInterval) {
				watchersToStop.delete(watcher); // keep watcher
			} else {
				requestsToStart.push(request); // start watching
			}
		}

		// Logging
		if (requestsToStart.length) {
			this.trace(`Request to start watching: ${requestsToStart.map(request => this.requestToString(request)).join(',')}`);
		}

		if (watchersToStop.size) {
			this.trace(`Request to stop watching: ${Array.from(watchersToStop).map(watcher => this.requestToString(watcher.request)).join(',')}`);
		}

		// Stop watching as instructed
		for (const watcher of watchersToStop) {
			await this.stopWatching(watcher);
		}

		// Start watching as instructed
		for (const request of requestsToStart) {
			if (request.pollingInterval) {
				await this.startPolling(request, request.pollingInterval);
			} else {
				await this.startWatching(request);
			}
		}
	}

	private requestToWatcherKey(request: IRecursiveWatchRequest): string | number {
		return typeof request.correlationId === 'number' ? request.correlationId : this.pathToWatcherKey(request.path);
	}

	private pathToWatcherKey(path: string): string {
		return isLinux ? path : path.toLowerCase() /* ignore path casing */;
	}

	private async startPolling(request: IRecursiveWatchRequest, pollingInterval: number, restarts = 0): Promise<void> {
		const cts = new CancellationTokenSource();

		const instance = new DeferredPromise<void>();

		const snapshotFile = randomPath(tmpdir(), 'vscode-watcher-snapshot');

		// Remember as watcher instance
		const watcher: ParcelWatcherInstance = new ParcelWatcherInstance(
			instance.p,
			request,
			restarts,
			cts.token,
			new RunOnceWorker<IFileChange>(events => this.handleParcelEvents(events, watcher), ParcelWatcher.FILE_CHANGES_HANDLER_DELAY),
			async () => {
				cts.dispose(true);

				watcher.worker.flush();
				watcher.worker.dispose();

				pollingWatcher.dispose();
				await promises.unlink(snapshotFile);
			}
		);
		this._watchers.set(this.requestToWatcherKey(request), watcher);

		// Path checks for symbolic links / wrong casing
		const { realPath, realPathDiffers, realPathLength } = await this.normalizePath(request);

		this.trace(`Started watching: '${realPath}' with polling interval '${pollingInterval}'`);

		let counter = 0;

		const pollingWatcher = new RunOnceScheduler(async () => {
			counter++;

			if (cts.token.isCancellationRequested) {
				return;
			}

			// We already ran before, check for events since
			const parcelWatcherLib = parcelWatcher;
			try {
				if (counter > 1) {
					const parcelEvents = await parcelWatcherLib.getEventsSince(realPath, snapshotFile, { ignore: this.addPredefinedExcludes(request.excludes), backend: ParcelWatcher.PARCEL_WATCHER_BACKEND });

					if (cts.token.isCancellationRequested) {
						return;
					}

					// Handle & emit events
					this.onParcelEvents(parcelEvents, watcher, realPathDiffers, realPathLength);
				}

				// Store a snapshot of files to the snapshot file
				await parcelWatcherLib.writeSnapshot(realPath, snapshotFile, { ignore: this.addPredefinedExcludes(request.excludes), backend: ParcelWatcher.PARCEL_WATCHER_BACKEND });
			} catch (error) {
				this.onUnexpectedError(error, request);
			}

			// Signal we are ready now when the first snapshot was written
			if (counter === 1) {
				instance.complete();
			}

			if (cts.token.isCancellationRequested) {
				return;
			}

			// Schedule again at the next interval
			pollingWatcher.schedule();
		}, pollingInterval);
		pollingWatcher.schedule(0);
	}

	private async startWatching(request: IRecursiveWatchRequest, restarts = 0): Promise<void> {
		const cts = new CancellationTokenSource();

		const instance = new DeferredPromise<parcelWatcher.AsyncSubscription | undefined>();

		// Remember as watcher instance
		const watcher: ParcelWatcherInstance = new ParcelWatcherInstance(
			instance.p,
			request,
			restarts,
			cts.token,
			new RunOnceWorker<IFileChange>(events => this.handleParcelEvents(events, watcher), ParcelWatcher.FILE_CHANGES_HANDLER_DELAY),
			async () => {
				cts.dispose(true);

				watcher.worker.flush();
				watcher.worker.dispose();

				const watcherInstance = await instance.p;
				await watcherInstance?.unsubscribe();
			}
		);
		this._watchers.set(this.requestToWatcherKey(request), watcher);

		// Path checks for symbolic links / wrong casing
		const { realPath, realPathDiffers, realPathLength } = await this.normalizePath(request);

		try {
			const parcelWatcherLib = parcelWatcher;
			const parcelWatcherInstance = await parcelWatcherLib.subscribe(realPath, (error, parcelEvents) => {
				if (watcher.token.isCancellationRequested) {
					return; // return early when disposed
				}

				// In any case of an error, treat this like a unhandled exception
				// that might require the watcher to restart. We do not really know
				// the state of parcel at this point and as such will try to restart
				// up to our maximum of restarts.
				if (error) {
					this.onUnexpectedError(error, request);
				}

				// Handle & emit events
				this.onParcelEvents(parcelEvents, watcher, realPathDiffers, realPathLength);
			}, {
				backend: ParcelWatcher.PARCEL_WATCHER_BACKEND,
				ignore: this.addPredefinedExcludes(watcher.request.excludes)
			});

			this.trace(`Started watching: '${realPath}' with backend '${ParcelWatcher.PARCEL_WATCHER_BACKEND}'`);

			instance.complete(parcelWatcherInstance);
		} catch (error) {
			this.onUnexpectedError(error, request);

			instance.complete(undefined);

			watcher.notifyWatchFailed();
			this._onDidWatchFail.fire(request);
		}
	}

	private addPredefinedExcludes(initialExcludes: string[]): string[] {
		const excludes = [...initialExcludes];

		const predefinedExcludes = ParcelWatcher.PREDEFINED_EXCLUDES[process.platform];
		if (Array.isArray(predefinedExcludes)) {
			for (const exclude of predefinedExcludes) {
				if (!excludes.includes(exclude)) {
					excludes.push(exclude);
				}
			}
		}

		return excludes;
	}

	private onParcelEvents(parcelEvents: parcelWatcher.Event[], watcher: ParcelWatcherInstance, realPathDiffers: boolean, realPathLength: number): void {
		if (parcelEvents.length === 0) {
			return;
		}

		// Normalize events: handle NFC normalization and symlinks
		// It is important to do this before checking for includes
		// to check on the original path.
		this.normalizeEvents(parcelEvents, watcher.request, realPathDiffers, realPathLength);

		// Check for includes
		const includedEvents = this.handleIncludes(watcher, parcelEvents);

		// Add to event aggregator for later processing
		for (const includedEvent of includedEvents) {
			watcher.worker.work(includedEvent);
		}
	}

	private handleIncludes(watcher: ParcelWatcherInstance, parcelEvents: parcelWatcher.Event[]): IFileChange[] {
		const events: IFileChange[] = [];

		for (const { path, type: parcelEventType } of parcelEvents) {
			const type = ParcelWatcher.MAP_PARCEL_WATCHER_ACTION_TO_FILE_CHANGE.get(parcelEventType)!;
			if (this.verboseLogging) {
				this.traceWithCorrelation(`${type === FileChangeType.ADDED ? '[ADDED]' : type === FileChangeType.DELETED ? '[DELETED]' : '[CHANGED]'} ${path}`, watcher.request);
			}

			// Apply include filter if any
			if (!watcher.include(path)) {
				if (this.verboseLogging) {
					this.traceWithCorrelation(` >> ignored (not included) ${path}`, watcher.request);
				}
			} else {
				events.push({ type, resource: URI.file(path), cId: watcher.request.correlationId });
			}
		}

		return events;
	}

	private handleParcelEvents(parcelEvents: IFileChange[], watcher: ParcelWatcherInstance): void {

		// Coalesce events: merge events of same kind
		const coalescedEvents = coalesceEvents(parcelEvents);

		// Filter events: check for specific events we want to exclude
		const { events: filteredEvents, rootDeleted } = this.filterEvents(coalescedEvents, watcher);

		// Broadcast to clients
		this.emitEvents(filteredEvents, watcher);

		// Handle root path deletes
		if (rootDeleted) {
			this.onWatchedPathDeleted(watcher);
		}
	}

	private emitEvents(events: IFileChange[], watcher: ParcelWatcherInstance): void {
		if (events.length === 0) {
			return;
		}

		// Broadcast to clients via throttler
		const worked = this.throttledFileChangesEmitter.work(events);

		// Logging
		if (!worked) {
			this.warn(`started ignoring events due to too many file change events at once (incoming: ${events.length}, most recent change: ${events[0].resource.fsPath}). Use 'files.watcherExclude' setting to exclude folders with lots of changing files (e.g. compilation output).`);
		} else {
			if (this.throttledFileChangesEmitter.pending > 0) {
				this.trace(`started throttling events due to large amount of file change events at once (pending: ${this.throttledFileChangesEmitter.pending}, most recent change: ${events[0].resource.fsPath}). Use 'files.watcherExclude' setting to exclude folders with lots of changing files (e.g. compilation output).`, watcher);
			}
		}
	}

	private async normalizePath(request: IRecursiveWatchRequest): Promise<{ realPath: string; realPathDiffers: boolean; realPathLength: number }> {
		let realPath = request.path;
		let realPathDiffers = false;
		let realPathLength = request.path.length;

		try {

			// First check for symbolic link
			realPath = await Promises.realpath(request.path);

			// Second check for casing difference
			// Note: this will be a no-op on Linux platforms
			if (request.path === realPath) {
				realPath = await realcase(request.path) ?? request.path;
			}

			// Correct watch path as needed
			if (request.path !== realPath) {
				realPathLength = realPath.length;
				realPathDiffers = true;

				this.trace(`correcting a path to watch that seems to be a symbolic link or wrong casing (original: ${request.path}, real: ${realPath})`);
			}
		} catch (error) {
			// ignore
		}

		return { realPath, realPathDiffers, realPathLength };
	}

	private normalizeEvents(events: parcelWatcher.Event[], request: IRecursiveWatchRequest, realPathDiffers: boolean, realPathLength: number): void {
		for (const event of events) {

			// Mac uses NFD unicode form on disk, but we want NFC
			if (isMacintosh) {
				event.path = normalizeNFC(event.path);
			}

			// Workaround for https://github.com/parcel-bundler/watcher/issues/68
			// where watching root drive letter adds extra backslashes.
			if (isWindows) {
				if (request.path.length <= 3) { // for ex. c:, C:\
					event.path = normalize(event.path);
				}
			}

			// Convert paths back to original form in case it differs
			if (realPathDiffers) {
				event.path = request.path + event.path.substr(realPathLength);
			}
		}
	}

	private filterEvents(events: IFileChange[], watcher: ParcelWatcherInstance): { events: IFileChange[]; rootDeleted?: boolean } {
		const filteredEvents: IFileChange[] = [];
		let rootDeleted = false;

		const filter = this.isCorrelated(watcher.request) ? watcher.request.filter : undefined; // filtering is only enabled when correlating because watchers are otherwise potentially reused
		for (const event of events) {

			// Emit to instance subscriptions if any before filtering
			if (watcher.subscriptionsCount > 0) {
				watcher.notifyFileChange(event.resource.fsPath, event);
			}

			// Filtering
			rootDeleted = event.type === FileChangeType.DELETED && isEqual(event.resource.fsPath, watcher.request.path, !isLinux);
			if (isFiltered(event, filter)) {
				if (this.verboseLogging) {
					this.traceWithCorrelation(` >> ignored (filtered) ${event.resource.fsPath}`, watcher.request);
				}

				continue;
			}

			// Logging
			this.traceEvent(event, watcher.request);

			filteredEvents.push(event);
		}

		return { events: filteredEvents, rootDeleted };
	}

	private onWatchedPathDeleted(watcher: ParcelWatcherInstance): void {
		this.warn('Watcher shutdown because watched path got deleted', watcher);

		watcher.notifyWatchFailed();
		this._onDidWatchFail.fire(watcher.request);
	}

	private onUnexpectedError(error: unknown, request?: IRecursiveWatchRequest): void {
		const msg = toErrorMessage(error);

		// Specially handle ENOSPC errors that can happen when
		// the watcher consumes so many file descriptors that
		// we are running into a limit. We only want to warn
		// once in this case to avoid log spam.
		// See https://github.com/microsoft/vscode/issues/7950
		if (msg.indexOf('No space left on device') !== -1) {
			if (!this.enospcErrorLogged) {
				this.error('Inotify limit reached (ENOSPC)', request);

				this.enospcErrorLogged = true;
			}
		}

		// Version 2.5.1 introduces 3 new errors on macOS
		// via https://github.dev/parcel-bundler/watcher/pull/196
		else if (msg.indexOf('File system must be re-scanned') !== -1) {
			this.error(msg, request);
		}

		// Any other error is unexpected and we should try to
		// restart the watcher as a result to get into healthy
		// state again if possible and if not attempted too much
		else {
			this.error(`Unexpected error: ${msg} (EUNKNOWN)`, request);

			this._onDidError.fire({ request, error: msg });
		}
	}

	override async stop(): Promise<void> {
		await super.stop();

		for (const watcher of this.watchers) {
			await this.stopWatching(watcher);
		}
	}

	protected restartWatching(watcher: ParcelWatcherInstance, delay = 800): void {

		// Restart watcher delayed to accomodate for
		// changes on disk that have triggered the
		// need for a restart in the first place.
		const scheduler = new RunOnceScheduler(async () => {
			if (watcher.token.isCancellationRequested) {
				return; // return early when disposed
			}

			const restartPromise = new DeferredPromise<void>();
			try {

				// Await the watcher having stopped, as this is
				// needed to properly re-watch the same path
				await this.stopWatching(watcher, restartPromise.p);

				// Start watcher again counting the restarts
				if (watcher.request.pollingInterval) {
					await this.startPolling(watcher.request, watcher.request.pollingInterval, watcher.restarts + 1);
				} else {
					await this.startWatching(watcher.request, watcher.restarts + 1);
				}
			} finally {
				restartPromise.complete();
			}
		}, delay);

		scheduler.schedule();
		watcher.token.onCancellationRequested(() => scheduler.dispose());
	}

	private async stopWatching(watcher: ParcelWatcherInstance, joinRestart?: Promise<void>): Promise<void> {
		this.trace(`stopping file watcher`, watcher);

		this._watchers.delete(this.requestToWatcherKey(watcher.request));

		try {
			await watcher.stop(joinRestart);
		} catch (error) {
			this.error(`Unexpected error stopping watcher: ${toErrorMessage(error)}`, watcher.request);
		}
	}

	protected async removeDuplicateRequests(requests: IRecursiveWatchRequest[], validatePaths = true): Promise<IRecursiveWatchRequest[]> {

		// Sort requests by path length to have shortest first
		// to have a way to prevent children to be watched if
		// parents exist.
		requests.sort((requestA, requestB) => requestA.path.length - requestB.path.length);

		// Ignore requests for the same paths that have the same correlation
		const mapCorrelationtoRequests = new Map<number | undefined /* correlation */, Map<string, IRecursiveWatchRequest>>();
		for (const request of requests) {
			if (request.excludes.includes(GLOBSTAR)) {
				continue; // path is ignored entirely (via `**` glob exclude)
			}


			let requestsForCorrelation = mapCorrelationtoRequests.get(request.correlationId);
			if (!requestsForCorrelation) {
				requestsForCorrelation = new Map<string, IRecursiveWatchRequest>();
				mapCorrelationtoRequests.set(request.correlationId, requestsForCorrelation);
			}

			const path = this.pathToWatcherKey(request.path);
			if (requestsForCorrelation.has(path)) {
				this.trace(`ignoring a request for watching who's path is already watched: ${this.requestToString(request)}`);
			}

			requestsForCorrelation.set(path, request);
		}

		const normalizedRequests: IRecursiveWatchRequest[] = [];

		for (const requestsForCorrelation of mapCorrelationtoRequests.values()) {

			// Only consider requests for watching that are not
			// a child of an existing request path to prevent
			// duplication. In addition, drop any request where
			// everything is excluded (via `**` glob).
			//
			// However, allow explicit requests to watch folders
			// that are symbolic links because the Parcel watcher
			// does not allow to recursively watch symbolic links.

			const requestTrie = TernarySearchTree.forPaths<IRecursiveWatchRequest>(!isLinux);

			for (const request of requestsForCorrelation.values()) {

				// Check for overlapping request paths (but preserve symbolic links)
				if (requestTrie.findSubstr(request.path)) {
					if (requestTrie.has(request.path)) {
						this.trace(`ignoring a request for watching who's path is already watched: ${this.requestToString(request)}`);
					} else {
						try {
							if (!(await promises.lstat(request.path)).isSymbolicLink()) {
								this.trace(`ignoring a request for watching who's parent is already watched: ${this.requestToString(request)}`);

								continue;
							}
						} catch (error) {
							this.trace(`ignoring a request for watching who's lstat failed to resolve: ${this.requestToString(request)} (error: ${error})`);

							this._onDidWatchFail.fire(request);

							continue;
						}
					}
				}

				// Check for invalid paths
				if (validatePaths && !(await this.isPathValid(request.path))) {
					this._onDidWatchFail.fire(request);

					continue;
				}

				requestTrie.set(request.path, request);
			}

			normalizedRequests.push(...Array.from(requestTrie).map(([, request]) => request));
		}

		return normalizedRequests;
	}

	private async isPathValid(path: string): Promise<boolean> {
		try {
			const stat = await promises.stat(path);
			if (!stat.isDirectory()) {
				this.trace(`ignoring a path for watching that is a file and not a folder: ${path}`);

				return false;
			}
		} catch (error) {
			this.trace(`ignoring a path for watching who's stat info failed to resolve: ${path} (error: ${error})`);

			return false;
		}

		return true;
	}

	subscribe(path: string, callback: (error: true | null, change?: IFileChange) => void): IDisposable | undefined {
		for (const watcher of this.watchers) {
			if (watcher.failed) {
				continue; // watcher has already failed
			}

			if (!isEqualOrParent(path, watcher.request.path, !isLinux)) {
				continue; // watcher does not consider this path
			}

			if (
				watcher.exclude(path) ||
				!watcher.include(path)
			) {
				continue; // parcel instance does not consider this path
			}

			const disposables = new DisposableStore();

			disposables.add(Event.once(watcher.onDidStop)(async e => {
				await e.joinRestart; // if we are restarting, await that so that we can possibly reuse this watcher again
				if (disposables.isDisposed) {
					return;
				}

				callback(true /* error */);
			}));
			disposables.add(Event.once(watcher.onDidFail)(() => callback(true /* error */)));
			disposables.add(watcher.subscribe(path, change => callback(null, change)));

			return disposables;
		}

		return undefined;
	}

	protected trace(message: string, watcher?: ParcelWatcherInstance): void {
		if (this.verboseLogging) {
			this._onDidLogMessage.fire({ type: 'trace', message: this.toMessage(message, watcher?.request) });
		}
	}

	protected warn(message: string, watcher?: ParcelWatcherInstance) {
		this._onDidLogMessage.fire({ type: 'warn', message: this.toMessage(message, watcher?.request) });
	}

	private error(message: string, request?: IRecursiveWatchRequest) {
		this._onDidLogMessage.fire({ type: 'error', message: this.toMessage(message, request) });
	}

	private toMessage(message: string, request?: IRecursiveWatchRequest): string {
		return request ? `[File Watcher ('parcel')] ${message} (path: ${request.path})` : `[File Watcher ('parcel')] ${message}`;
	}

	protected get recursiveWatcher() { return this; }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/test/browser/fileService.test.ts]---
Location: vscode-main/src/vs/platform/files/test/browser/fileService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DeferredPromise, timeout } from '../../../../base/common/async.js';
import { bufferToReadable, bufferToStream, VSBuffer } from '../../../../base/common/buffer.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { isEqual } from '../../../../base/common/resources.js';
import { consumeStream, newWriteableStream, ReadableStreamEvents } from '../../../../base/common/stream.js';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IFileOpenOptions, IFileReadStreamOptions, FileSystemProviderCapabilities, FileType, IFileSystemProviderCapabilitiesChangeEvent, IFileSystemProviderRegistrationEvent, IStat, IFileAtomicReadOptions, IFileAtomicWriteOptions, IFileAtomicDeleteOptions, IFileSystemProviderWithFileAtomicReadCapability, IFileSystemProviderWithFileAtomicDeleteCapability, IFileSystemProviderWithFileAtomicWriteCapability, IFileAtomicOptions, IFileChange, isFileSystemWatcher, FileChangesEvent, FileChangeType } from '../../common/files.js';
import { FileService } from '../../common/fileService.js';
import { NullFileSystemProvider } from '../common/nullFileSystemProvider.js';
import { NullLogService } from '../../../log/common/log.js';

suite('File Service', () => {

	const disposables = new DisposableStore();

	teardown(() => {
		disposables.clear();
	});

	test('provider registration', async () => {
		const service = disposables.add(new FileService(new NullLogService()));
		const resource = URI.parse('test://foo/bar');
		const provider = new NullFileSystemProvider();

		assert.strictEqual(await service.canHandleResource(resource), false);
		assert.strictEqual(service.hasProvider(resource), false);
		assert.strictEqual(service.getProvider(resource.scheme), undefined);

		const registrations: IFileSystemProviderRegistrationEvent[] = [];
		disposables.add(service.onDidChangeFileSystemProviderRegistrations(e => {
			registrations.push(e);
		}));

		const capabilityChanges: IFileSystemProviderCapabilitiesChangeEvent[] = [];
		disposables.add(service.onDidChangeFileSystemProviderCapabilities(e => {
			capabilityChanges.push(e);
		}));

		let registrationDisposable: IDisposable | undefined;
		let callCount = 0;
		disposables.add(service.onWillActivateFileSystemProvider(e => {
			callCount++;

			if (e.scheme === 'test' && callCount === 1) {
				e.join(new Promise(resolve => {
					registrationDisposable = service.registerProvider('test', provider);

					resolve();
				}));
			}
		}));

		assert.strictEqual(await service.canHandleResource(resource), true);
		assert.strictEqual(service.hasProvider(resource), true);
		assert.strictEqual(service.getProvider(resource.scheme), provider);

		assert.strictEqual(registrations.length, 1);
		assert.strictEqual(registrations[0].scheme, 'test');
		assert.strictEqual(registrations[0].added, true);
		assert.ok(registrationDisposable);

		assert.strictEqual(capabilityChanges.length, 0);

		provider.setCapabilities(FileSystemProviderCapabilities.FileFolderCopy);
		assert.strictEqual(capabilityChanges.length, 1);
		provider.setCapabilities(FileSystemProviderCapabilities.Readonly);
		assert.strictEqual(capabilityChanges.length, 2);

		await service.activateProvider('test');
		assert.strictEqual(callCount, 2); // activation is called again

		assert.strictEqual(service.hasCapability(resource, FileSystemProviderCapabilities.Readonly), true);
		assert.strictEqual(service.hasCapability(resource, FileSystemProviderCapabilities.FileOpenReadWriteClose), false);

		registrationDisposable.dispose();

		assert.strictEqual(await service.canHandleResource(resource), false);
		assert.strictEqual(service.hasProvider(resource), false);

		assert.strictEqual(registrations.length, 2);
		assert.strictEqual(registrations[1].scheme, 'test');
		assert.strictEqual(registrations[1].added, false);
	});

	test('watch', async () => {
		const service = disposables.add(new FileService(new NullLogService()));

		let disposeCounter = 0;
		disposables.add(service.registerProvider('test', new NullFileSystemProvider(() => {
			return toDisposable(() => {
				disposeCounter++;
			});
		})));
		await service.activateProvider('test');

		const resource1 = URI.parse('test://foo/bar1');
		const watcher1Disposable = service.watch(resource1);

		await timeout(0); // service.watch() is async
		assert.strictEqual(disposeCounter, 0);
		watcher1Disposable.dispose();
		assert.strictEqual(disposeCounter, 1);

		disposeCounter = 0;
		const resource2 = URI.parse('test://foo/bar2');
		const watcher2Disposable1 = service.watch(resource2);
		const watcher2Disposable2 = service.watch(resource2);
		const watcher2Disposable3 = service.watch(resource2);

		await timeout(0); // service.watch() is async
		assert.strictEqual(disposeCounter, 0);
		watcher2Disposable1.dispose();
		assert.strictEqual(disposeCounter, 0);
		watcher2Disposable2.dispose();
		assert.strictEqual(disposeCounter, 0);
		watcher2Disposable3.dispose();
		assert.strictEqual(disposeCounter, 1);

		disposeCounter = 0;
		const resource3 = URI.parse('test://foo/bar3');
		const watcher3Disposable1 = service.watch(resource3);
		const watcher3Disposable2 = service.watch(resource3, { recursive: true, excludes: [] });
		const watcher3Disposable3 = service.watch(resource3, { recursive: false, excludes: [], includes: [] });

		await timeout(0); // service.watch() is async
		assert.strictEqual(disposeCounter, 0);
		watcher3Disposable1.dispose();
		assert.strictEqual(disposeCounter, 1);
		watcher3Disposable2.dispose();
		assert.strictEqual(disposeCounter, 2);
		watcher3Disposable3.dispose();
		assert.strictEqual(disposeCounter, 3);

		service.dispose();
	});

	test('watch - with corelation', async () => {
		const service = disposables.add(new FileService(new NullLogService()));

		const provider = new class extends NullFileSystemProvider {
			private readonly _testOnDidChangeFile = new Emitter<readonly IFileChange[]>();
			override readonly onDidChangeFile: Event<readonly IFileChange[]> = this._testOnDidChangeFile.event;

			fireFileChange(changes: readonly IFileChange[]) {
				this._testOnDidChangeFile.fire(changes);
			}
		};

		disposables.add(service.registerProvider('test', provider));
		await service.activateProvider('test');

		const globalEvents: FileChangesEvent[] = [];
		disposables.add(service.onDidFilesChange(e => {
			globalEvents.push(e);
		}));

		const watcher0 = disposables.add(service.watch(URI.parse('test://watch/folder1'), { recursive: true, excludes: [], includes: [] }));
		assert.strictEqual(isFileSystemWatcher(watcher0), false);
		const watcher1 = disposables.add(service.watch(URI.parse('test://watch/folder2'), { recursive: true, excludes: [], includes: [], correlationId: 100 }));
		assert.strictEqual(isFileSystemWatcher(watcher1), true);
		const watcher2 = disposables.add(service.watch(URI.parse('test://watch/folder3'), { recursive: true, excludes: [], includes: [], correlationId: 200 }));
		assert.strictEqual(isFileSystemWatcher(watcher2), true);

		const watcher1Events: FileChangesEvent[] = [];
		disposables.add(watcher1.onDidChange(e => {
			watcher1Events.push(e);
		}));

		const watcher2Events: FileChangesEvent[] = [];
		disposables.add(watcher2.onDidChange(e => {
			watcher2Events.push(e);
		}));

		provider.fireFileChange([{ resource: URI.parse('test://watch/folder1'), type: FileChangeType.ADDED }]);
		provider.fireFileChange([{ resource: URI.parse('test://watch/folder2'), type: FileChangeType.ADDED, cId: 100 }]);
		provider.fireFileChange([{ resource: URI.parse('test://watch/folder2'), type: FileChangeType.ADDED, cId: 100 }]);
		provider.fireFileChange([{ resource: URI.parse('test://watch/folder3/file'), type: FileChangeType.UPDATED, cId: 200 }]);
		provider.fireFileChange([{ resource: URI.parse('test://watch/folder3'), type: FileChangeType.UPDATED, cId: 200 }]);

		provider.fireFileChange([{ resource: URI.parse('test://watch/folder4'), type: FileChangeType.ADDED, cId: 50 }]);
		provider.fireFileChange([{ resource: URI.parse('test://watch/folder4'), type: FileChangeType.ADDED, cId: 60 }]);
		provider.fireFileChange([{ resource: URI.parse('test://watch/folder4'), type: FileChangeType.ADDED, cId: 70 }]);

		assert.strictEqual(globalEvents.length, 1);
		assert.strictEqual(watcher1Events.length, 2);
		assert.strictEqual(watcher2Events.length, 2);
	});

	test('error from readFile bubbles through (https://github.com/microsoft/vscode/issues/118060) - async', async () => {
		testReadErrorBubbles(true);
	});

	test('error from readFile bubbles through (https://github.com/microsoft/vscode/issues/118060)', async () => {
		testReadErrorBubbles(false);
	});

	async function testReadErrorBubbles(async: boolean) {
		const service = disposables.add(new FileService(new NullLogService()));

		const provider = new class extends NullFileSystemProvider {
			override async stat(resource: URI): Promise<IStat> {
				return {
					mtime: Date.now(),
					ctime: Date.now(),
					size: 100,
					type: FileType.File
				};
			}

			override readFile(resource: URI): Promise<Uint8Array> {
				if (async) {
					return timeout(5, CancellationToken.None).then(() => { throw new Error('failed'); });
				}

				throw new Error('failed');
			}

			override open(resource: URI, opts: IFileOpenOptions): Promise<number> {
				if (async) {
					return timeout(5, CancellationToken.None).then(() => { throw new Error('failed'); });
				}

				throw new Error('failed');
			}

			override readFileStream(resource: URI, opts: IFileReadStreamOptions, token: CancellationToken): ReadableStreamEvents<Uint8Array> {
				if (async) {
					const stream = newWriteableStream<Uint8Array>(chunk => chunk[0]);
					timeout(5, CancellationToken.None).then(() => stream.error(new Error('failed')));

					return stream;

				}

				throw new Error('failed');
			}
		};

		disposables.add(service.registerProvider('test', provider));

		for (const capabilities of [FileSystemProviderCapabilities.FileReadWrite, FileSystemProviderCapabilities.FileReadStream, FileSystemProviderCapabilities.FileOpenReadWriteClose]) {
			provider.setCapabilities(capabilities);

			let e1;
			try {
				await service.readFile(URI.parse('test://foo/bar'));
			} catch (error) {
				e1 = error;
			}

			assert.ok(e1);

			let e2;
			try {
				const stream = await service.readFileStream(URI.parse('test://foo/bar'));
				await consumeStream(stream.value, chunk => chunk[0]);
			} catch (error) {
				e2 = error;
			}

			assert.ok(e2);
		}
	}

	test('readFile/readFileStream supports cancellation (https://github.com/microsoft/vscode/issues/138805)', async () => {
		const service = disposables.add(new FileService(new NullLogService()));

		let readFileStreamReady: DeferredPromise<void> | undefined = undefined;

		const provider = new class extends NullFileSystemProvider {

			override async stat(resource: URI): Promise<IStat> {
				return {
					mtime: Date.now(),
					ctime: Date.now(),
					size: 100,
					type: FileType.File
				};
			}

			override readFileStream(resource: URI, opts: IFileReadStreamOptions, token: CancellationToken): ReadableStreamEvents<Uint8Array> {
				const stream = newWriteableStream<Uint8Array>(chunk => chunk[0]);
				disposables.add(token.onCancellationRequested(() => {
					stream.error(new Error('Expected cancellation'));
					stream.end();
				}));

				readFileStreamReady!.complete();

				return stream;
			}
		};

		disposables.add(service.registerProvider('test', provider));

		provider.setCapabilities(FileSystemProviderCapabilities.FileReadStream);

		let e1;
		try {
			const cts = new CancellationTokenSource();
			readFileStreamReady = new DeferredPromise();
			const promise = service.readFile(URI.parse('test://foo/bar'), undefined, cts.token);
			await Promise.all([readFileStreamReady.p.then(() => cts.cancel()), promise]);
		} catch (error) {
			e1 = error;
		}

		assert.ok(e1);

		let e2;
		try {
			const cts = new CancellationTokenSource();
			readFileStreamReady = new DeferredPromise();
			const stream = await service.readFileStream(URI.parse('test://foo/bar'), undefined, cts.token);
			await Promise.all([readFileStreamReady.p.then(() => cts.cancel()), consumeStream(stream.value, chunk => chunk[0])]);
		} catch (error) {
			e2 = error;
		}

		assert.ok(e2);
	});

	test('enforced atomic read/write/delete', async () => {
		const service = disposables.add(new FileService(new NullLogService()));

		const atomicResource = URI.parse('test://foo/bar/atomic');
		const nonAtomicResource = URI.parse('test://foo/nonatomic');

		let atomicReadCounter = 0;
		let atomicWriteCounter = 0;
		let atomicDeleteCounter = 0;

		const provider = new class extends NullFileSystemProvider implements IFileSystemProviderWithFileAtomicReadCapability, IFileSystemProviderWithFileAtomicWriteCapability, IFileSystemProviderWithFileAtomicDeleteCapability {

			override async stat(resource: URI): Promise<IStat> {
				return {
					type: FileType.File,
					ctime: Date.now(),
					mtime: Date.now(),
					size: 0
				};
			}

			override async readFile(resource: URI, opts?: IFileAtomicReadOptions): Promise<Uint8Array> {
				if (opts?.atomic) {
					atomicReadCounter++;
				}
				return new Uint8Array();
			}

			override readFileStream(resource: URI, opts: IFileReadStreamOptions, token: CancellationToken): ReadableStreamEvents<Uint8Array> {
				return newWriteableStream<Uint8Array>(chunk => chunk[0]);
			}

			enforceAtomicReadFile(resource: URI): boolean {
				return isEqual(resource, atomicResource);
			}

			override async writeFile(resource: URI, content: Uint8Array, opts: IFileAtomicWriteOptions): Promise<void> {
				if (opts.atomic) {
					atomicWriteCounter++;
				}
			}

			enforceAtomicWriteFile(resource: URI): IFileAtomicOptions | false {
				return isEqual(resource, atomicResource) ? { postfix: '.tmp' } : false;
			}

			override async delete(resource: URI, opts: IFileAtomicDeleteOptions): Promise<void> {
				if (opts.atomic) {
					atomicDeleteCounter++;
				}
			}

			enforceAtomicDelete(resource: URI): IFileAtomicOptions | false {
				return isEqual(resource, atomicResource) ? { postfix: '.tmp' } : false;
			}
		};

		provider.setCapabilities(
			FileSystemProviderCapabilities.FileReadWrite |
			FileSystemProviderCapabilities.FileOpenReadWriteClose |
			FileSystemProviderCapabilities.FileReadStream |
			FileSystemProviderCapabilities.FileAtomicRead |
			FileSystemProviderCapabilities.FileAtomicWrite |
			FileSystemProviderCapabilities.FileAtomicDelete
		);

		disposables.add(service.registerProvider('test', provider));

		await service.readFile(atomicResource);
		await service.readFile(nonAtomicResource);
		await service.readFileStream(atomicResource);
		await service.readFileStream(nonAtomicResource);

		await service.writeFile(atomicResource, VSBuffer.fromString(''));
		await service.writeFile(nonAtomicResource, VSBuffer.fromString(''));

		await service.writeFile(atomicResource, bufferToStream(VSBuffer.fromString('')));
		await service.writeFile(nonAtomicResource, bufferToStream(VSBuffer.fromString('')));

		await service.writeFile(atomicResource, bufferToReadable(VSBuffer.fromString('')));
		await service.writeFile(nonAtomicResource, bufferToReadable(VSBuffer.fromString('')));

		await service.del(atomicResource);
		await service.del(nonAtomicResource);

		assert.strictEqual(atomicReadCounter, 2);
		assert.strictEqual(atomicWriteCounter, 3);
		assert.strictEqual(atomicDeleteCounter, 1);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/test/browser/indexedDBFileService.integrationTest.ts]---
Location: vscode-main/src/vs/platform/files/test/browser/indexedDBFileService.integrationTest.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IndexedDB } from '../../../../base/browser/indexedDB.js';
import { bufferToReadable, bufferToStream, VSBuffer, VSBufferReadable, VSBufferReadableStream } from '../../../../base/common/buffer.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { basename, joinPath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { flakySuite } from '../../../../base/test/common/testUtils.js';
import { IndexedDBFileSystemProvider } from '../../browser/indexedDBFileSystemProvider.js';
import { FileOperation, FileOperationError, FileOperationEvent, FileOperationResult, FileSystemProviderError, FileSystemProviderErrorCode, FileType } from '../../common/files.js';
import { FileService } from '../../common/fileService.js';
import { NullLogService } from '../../../log/common/log.js';

flakySuite('IndexedDBFileSystemProvider', function () {

	let service: FileService;
	let userdataFileProvider: IndexedDBFileSystemProvider;
	const testDir = '/';

	const userdataURIFromPaths = (paths: readonly string[]) => joinPath(URI.from({ scheme: Schemas.vscodeUserData, path: testDir }), ...paths);

	const disposables = new DisposableStore();

	const initFixtures = async () => {
		await Promise.all(
			[['fixtures', 'resolver', 'examples'],
			['fixtures', 'resolver', 'other', 'deep'],
			['fixtures', 'service', 'deep'],
			['batched']]
				.map(path => userdataURIFromPaths(path))
				.map(uri => service.createFolder(uri)));
		await Promise.all(
			([
				[['fixtures', 'resolver', 'examples', 'company.js'], 'class company {}'],
				[['fixtures', 'resolver', 'examples', 'conway.js'], 'export function conway() {}'],
				[['fixtures', 'resolver', 'examples', 'employee.js'], 'export const employee = "jax"'],
				[['fixtures', 'resolver', 'examples', 'small.js'], ''],
				[['fixtures', 'resolver', 'other', 'deep', 'company.js'], 'class company {}'],
				[['fixtures', 'resolver', 'other', 'deep', 'conway.js'], 'export function conway() {}'],
				[['fixtures', 'resolver', 'other', 'deep', 'employee.js'], 'export const employee = "jax"'],
				[['fixtures', 'resolver', 'other', 'deep', 'small.js'], ''],
				[['fixtures', 'resolver', 'index.html'], '<p>p</p>'],
				[['fixtures', 'resolver', 'site.css'], '.p {color: red;}'],
				[['fixtures', 'service', 'deep', 'company.js'], 'class company {}'],
				[['fixtures', 'service', 'deep', 'conway.js'], 'export function conway() {}'],
				[['fixtures', 'service', 'deep', 'employee.js'], 'export const employee = "jax"'],
				[['fixtures', 'service', 'deep', 'small.js'], ''],
				[['fixtures', 'service', 'binary.txt'], '<p>p</p>'],
			] as const)
				.map(([path, contents]) => [userdataURIFromPaths(path), contents] as const)
				.map(([uri, contents]) => service.createFile(uri, VSBuffer.fromString(contents)))
		);
	};

	const reload = async () => {
		const logService = new NullLogService();

		service = new FileService(logService);
		disposables.add(service);

		const indexedDB = await IndexedDB.create('vscode-web-db-test', 1, ['vscode-userdata-store', 'vscode-logs-store']);

		userdataFileProvider = new IndexedDBFileSystemProvider(Schemas.vscodeUserData, indexedDB, 'vscode-userdata-store', true);
		disposables.add(service.registerProvider(Schemas.vscodeUserData, userdataFileProvider));
		disposables.add(userdataFileProvider);
	};

	setup(async function () {
		this.timeout(15000);
		await reload();
	});

	teardown(async () => {
		await userdataFileProvider.reset();
		disposables.clear();
	});

	test('root is always present', async () => {
		assert.strictEqual((await userdataFileProvider.stat(userdataURIFromPaths([]))).type, FileType.Directory);
		await userdataFileProvider.delete(userdataURIFromPaths([]), { recursive: true, useTrash: false, atomic: false });
		assert.strictEqual((await userdataFileProvider.stat(userdataURIFromPaths([]))).type, FileType.Directory);
	});

	test('createFolder', async () => {
		let event: FileOperationEvent | undefined;
		disposables.add(service.onDidRunOperation(e => event = e));

		const parent = await service.resolve(userdataURIFromPaths([]));
		const newFolderResource = joinPath(parent.resource, 'newFolder');

		assert.strictEqual((await userdataFileProvider.readdir(parent.resource)).length, 0);
		const newFolder = await service.createFolder(newFolderResource);
		assert.strictEqual(newFolder.name, 'newFolder');
		assert.strictEqual((await userdataFileProvider.readdir(parent.resource)).length, 1);
		assert.strictEqual((await userdataFileProvider.stat(newFolderResource)).type, FileType.Directory);

		assert.ok(event);
		assert.strictEqual(event.resource.path, newFolderResource.path);
		assert.strictEqual(event.operation, FileOperation.CREATE);
		assert.strictEqual(event.target!.resource.path, newFolderResource.path);
		assert.strictEqual(event.target!.isDirectory, true);
	});

	test('createFolder: creating multiple folders at once', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const multiFolderPaths = ['a', 'couple', 'of', 'folders'];
		const parent = await service.resolve(userdataURIFromPaths([]));
		const newFolderResource = joinPath(parent.resource, ...multiFolderPaths);

		const newFolder = await service.createFolder(newFolderResource);

		const lastFolderName = multiFolderPaths[multiFolderPaths.length - 1];
		assert.strictEqual(newFolder.name, lastFolderName);
		assert.strictEqual((await userdataFileProvider.stat(newFolderResource)).type, FileType.Directory);

		assert.ok(event!);
		assert.strictEqual(event!.resource.path, newFolderResource.path);
		assert.strictEqual(event!.operation, FileOperation.CREATE);
		assert.strictEqual(event!.target!.resource.path, newFolderResource.path);
		assert.strictEqual(event!.target!.isDirectory, true);
	});

	test('exists', async () => {
		let exists = await service.exists(userdataURIFromPaths([]));
		assert.strictEqual(exists, true);

		exists = await service.exists(userdataURIFromPaths(['hello']));
		assert.strictEqual(exists, false);
	});

	test('resolve - file', async () => {
		await initFixtures();

		const resource = userdataURIFromPaths(['fixtures', 'resolver', 'index.html']);
		const resolved = await service.resolve(resource);

		assert.strictEqual(resolved.name, 'index.html');
		assert.strictEqual(resolved.isFile, true);
		assert.strictEqual(resolved.isDirectory, false);
		assert.strictEqual(resolved.isSymbolicLink, false);
		assert.strictEqual(resolved.resource.toString(), resource.toString());
		assert.strictEqual(resolved.children, undefined);
		assert.ok(resolved.size! > 0);
	});

	test('resolve - directory', async () => {
		await initFixtures();

		const testsElements = ['examples', 'other', 'index.html', 'site.css'];

		const resource = userdataURIFromPaths(['fixtures', 'resolver']);
		const result = await service.resolve(resource);

		assert.ok(result);
		assert.strictEqual(result.resource.toString(), resource.toString());
		assert.strictEqual(result.name, 'resolver');
		assert.ok(result.children);
		assert.ok(result.children.length > 0);
		assert.ok(result.isDirectory);
		assert.strictEqual(result.children.length, testsElements.length);

		assert.ok(result.children.every(entry => {
			return testsElements.some(name => {
				return basename(entry.resource) === name;
			});
		}));

		result.children.forEach(value => {
			assert.ok(basename(value.resource));
			if (['examples', 'other'].indexOf(basename(value.resource)) >= 0) {
				assert.ok(value.isDirectory);
				assert.strictEqual(value.mtime, undefined);
				assert.strictEqual(value.ctime, undefined);
			} else if (basename(value.resource) === 'index.html') {
				assert.ok(!value.isDirectory);
				assert.ok(!value.children);
				assert.strictEqual(value.mtime, undefined);
				assert.strictEqual(value.ctime, undefined);
			} else if (basename(value.resource) === 'site.css') {
				assert.ok(!value.isDirectory);
				assert.ok(!value.children);
				assert.strictEqual(value.mtime, undefined);
				assert.strictEqual(value.ctime, undefined);
			} else {
				assert.fail('Unexpected value ' + basename(value.resource));
			}
		});
	});

	test('createFile', async () => {
		return assertCreateFile(contents => VSBuffer.fromString(contents));
	});

	test('createFile (readable)', async () => {
		return assertCreateFile(contents => bufferToReadable(VSBuffer.fromString(contents)));
	});

	test('createFile (stream)', async () => {
		return assertCreateFile(contents => bufferToStream(VSBuffer.fromString(contents)));
	});

	async function assertCreateFile(converter: (content: string) => VSBuffer | VSBufferReadable | VSBufferReadableStream): Promise<void> {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const contents = 'Hello World';
		const resource = userdataURIFromPaths(['test.txt']);

		assert.strictEqual(await service.canCreateFile(resource), true);
		const fileStat = await service.createFile(resource, converter(contents));
		assert.strictEqual(fileStat.name, 'test.txt');
		assert.strictEqual((await userdataFileProvider.stat(fileStat.resource)).type, FileType.File);
		assert.strictEqual(new TextDecoder().decode(await userdataFileProvider.readFile(fileStat.resource)), contents);

		assert.ok(event!);
		assert.strictEqual(event!.resource.path, resource.path);
		assert.strictEqual(event!.operation, FileOperation.CREATE);
		assert.strictEqual(event!.target!.resource.path, resource.path);
	}

	const fileCreateBatchTester = (size: number, name: string) => {
		const batch = Array.from({ length: size }).map((_, i) => ({ contents: `Hello${i}`, resource: userdataURIFromPaths(['batched', name, `Hello${i}.txt`]) }));
		let creationPromises: Promise<any> | undefined = undefined;
		return {
			async create() {
				return creationPromises = Promise.all(batch.map(entry => userdataFileProvider.writeFile(entry.resource, VSBuffer.fromString(entry.contents).buffer, { create: true, overwrite: true, unlock: false, atomic: false })));
			},
			async assertContentsCorrect() {
				if (!creationPromises) { throw Error('read called before create'); }
				await creationPromises;
				await Promise.all(batch.map(async (entry, i) => {
					assert.strictEqual((await userdataFileProvider.stat(entry.resource)).type, FileType.File);
					assert.strictEqual(new TextDecoder().decode(await userdataFileProvider.readFile(entry.resource)), entry.contents);
				}));
			}
		};
	};

	test('createFile - batch', async () => {
		const tester = fileCreateBatchTester(20, 'batch');
		await tester.create();
		await tester.assertContentsCorrect();
	});

	test('createFile - batch (mixed parallel/sequential)', async () => {
		const batch1 = fileCreateBatchTester(1, 'batch1');
		const batch2 = fileCreateBatchTester(20, 'batch2');
		const batch3 = fileCreateBatchTester(1, 'batch3');
		const batch4 = fileCreateBatchTester(20, 'batch4');

		batch1.create();
		batch2.create();
		await Promise.all([batch1.assertContentsCorrect(), batch2.assertContentsCorrect()]);
		batch3.create();
		batch4.create();
		await Promise.all([batch3.assertContentsCorrect(), batch4.assertContentsCorrect()]);
		await Promise.all([batch1.assertContentsCorrect(), batch2.assertContentsCorrect()]);
	});

	test('rename not existing resource', async () => {
		const parent = await service.resolve(userdataURIFromPaths([]));
		const sourceFile = joinPath(parent.resource, 'sourceFile');
		const targetFile = joinPath(parent.resource, 'targetFile');

		try {
			await service.move(sourceFile, targetFile, false);
		} catch (error) {
			assert.deepStrictEqual((<FileSystemProviderError>error).code, FileSystemProviderErrorCode.FileNotFound);
			return;
		}

		assert.fail('This should fail with error');
	});

	test('rename to an existing file without overwrite', async () => {
		const parent = await service.resolve(userdataURIFromPaths([]));
		const sourceFile = joinPath(parent.resource, 'sourceFile');
		await service.writeFile(sourceFile, VSBuffer.fromString('This is source file'));

		const targetFile = joinPath(parent.resource, 'targetFile');
		await service.writeFile(targetFile, VSBuffer.fromString('This is target file'));

		try {
			await service.move(sourceFile, targetFile, false);
		} catch (error) {
			assert.deepStrictEqual((<FileOperationError>error).fileOperationResult, FileOperationResult.FILE_MOVE_CONFLICT);
			return;
		}

		assert.fail('This should fail with error');
	});

	test('rename folder to an existing folder without overwrite', async () => {
		const parent = await service.resolve(userdataURIFromPaths([]));
		const sourceFolder = joinPath(parent.resource, 'sourceFolder');
		await service.createFolder(sourceFolder);
		const targetFolder = joinPath(parent.resource, 'targetFolder');
		await service.createFolder(targetFolder);

		try {
			await service.move(sourceFolder, targetFolder, false);
		} catch (error) {
			assert.deepStrictEqual((<FileOperationError>error).fileOperationResult, FileOperationResult.FILE_MOVE_CONFLICT);
			return;
		}

		assert.fail('This should fail with cannot overwrite error');
	});

	test('rename file to a folder', async () => {
		const parent = await service.resolve(userdataURIFromPaths([]));
		const sourceFile = joinPath(parent.resource, 'sourceFile');
		await service.writeFile(sourceFile, VSBuffer.fromString('This is source file'));

		const targetFolder = joinPath(parent.resource, 'targetFolder');
		await service.createFolder(targetFolder);

		try {
			await service.move(sourceFile, targetFolder, false);
		} catch (error) {
			assert.deepStrictEqual((<FileOperationError>error).fileOperationResult, FileOperationResult.FILE_MOVE_CONFLICT);
			return;
		}

		assert.fail('This should fail with error');
	});

	test('rename folder to a file', async () => {
		const parent = await service.resolve(userdataURIFromPaths([]));
		const sourceFolder = joinPath(parent.resource, 'sourceFile');
		await service.createFolder(sourceFolder);

		const targetFile = joinPath(parent.resource, 'targetFile');
		await service.writeFile(targetFile, VSBuffer.fromString('This is target file'));

		try {
			await service.move(sourceFolder, targetFile, false);
		} catch (error) {
			assert.deepStrictEqual((<FileOperationError>error).fileOperationResult, FileOperationResult.FILE_MOVE_CONFLICT);
			return;
		}

		assert.fail('This should fail with error');
	});

	test('rename file', async () => {
		const parent = await service.resolve(userdataURIFromPaths([]));
		const sourceFile = joinPath(parent.resource, 'sourceFile');
		await service.writeFile(sourceFile, VSBuffer.fromString('This is source file'));

		const targetFile = joinPath(parent.resource, 'targetFile');
		await service.move(sourceFile, targetFile, false);

		const content = await service.readFile(targetFile);
		assert.strictEqual(await service.exists(sourceFile), false);
		assert.strictEqual(content.value.toString(), 'This is source file');
	});

	test('rename to an existing file with overwrite', async () => {
		const parent = await service.resolve(userdataURIFromPaths([]));
		const sourceFile = joinPath(parent.resource, 'sourceFile');
		const targetFile = joinPath(parent.resource, 'targetFile');

		await Promise.all([
			service.writeFile(sourceFile, VSBuffer.fromString('This is source file')),
			service.writeFile(targetFile, VSBuffer.fromString('This is target file'))
		]);

		await service.move(sourceFile, targetFile, true);

		const content = await service.readFile(targetFile);
		assert.strictEqual(await service.exists(sourceFile), false);
		assert.strictEqual(content.value.toString(), 'This is source file');
	});

	test('rename folder to a new folder', async () => {
		const parent = await service.resolve(userdataURIFromPaths([]));
		const sourceFolder = joinPath(parent.resource, 'sourceFolder');
		await service.createFolder(sourceFolder);

		const targetFolder = joinPath(parent.resource, 'targetFolder');
		await service.move(sourceFolder, targetFolder, false);

		assert.deepStrictEqual(await service.exists(sourceFolder), false);
		assert.deepStrictEqual(await service.exists(targetFolder), true);
	});

	test('rename folder to an existing folder', async () => {
		const parent = await service.resolve(userdataURIFromPaths([]));
		const sourceFolder = joinPath(parent.resource, 'sourceFolder');
		await service.createFolder(sourceFolder);
		const targetFolder = joinPath(parent.resource, 'targetFolder');
		await service.createFolder(targetFolder);

		await service.move(sourceFolder, targetFolder, true);

		assert.deepStrictEqual(await service.exists(sourceFolder), false);
		assert.deepStrictEqual(await service.exists(targetFolder), true);
	});

	test('rename a folder that has multiple files and folders', async () => {
		const parent = await service.resolve(userdataURIFromPaths([]));

		const sourceFolder = joinPath(parent.resource, 'sourceFolder');
		const sourceFile1 = joinPath(sourceFolder, 'folder1', 'file1');
		const sourceFile2 = joinPath(sourceFolder, 'folder2', 'file1');
		const sourceEmptyFolder = joinPath(sourceFolder, 'folder3');

		await Promise.all([
			service.writeFile(sourceFile1, VSBuffer.fromString('Source File 1')),
			service.writeFile(sourceFile2, VSBuffer.fromString('Source File 2')),
			service.createFolder(sourceEmptyFolder)
		]);

		const targetFolder = joinPath(parent.resource, 'targetFolder');
		const targetFile1 = joinPath(targetFolder, 'folder1', 'file1');
		const targetFile2 = joinPath(targetFolder, 'folder2', 'file1');
		const targetEmptyFolder = joinPath(targetFolder, 'folder3');

		await service.move(sourceFolder, targetFolder, false);

		assert.deepStrictEqual(await service.exists(sourceFolder), false);
		assert.deepStrictEqual(await service.exists(targetFolder), true);
		assert.strictEqual((await service.readFile(targetFile1)).value.toString(), 'Source File 1');
		assert.strictEqual((await service.readFile(targetFile2)).value.toString(), 'Source File 2');
		assert.deepStrictEqual(await service.exists(targetEmptyFolder), true);
	});

	test('rename a folder to another folder that has some files', async () => {
		const parent = await service.resolve(userdataURIFromPaths([]));

		const sourceFolder = joinPath(parent.resource, 'sourceFolder');
		const sourceFile1 = joinPath(sourceFolder, 'folder1', 'file1');

		const targetFolder = joinPath(parent.resource, 'targetFolder');
		const targetFile1 = joinPath(targetFolder, 'folder1', 'file1');
		const targetFile2 = joinPath(targetFolder, 'folder1', 'file2');
		const targetFile3 = joinPath(targetFolder, 'folder2', 'file1');

		await Promise.all([
			service.writeFile(sourceFile1, VSBuffer.fromString('Source File 1')),
			service.writeFile(targetFile2, VSBuffer.fromString('Target File 2')),
			service.writeFile(targetFile3, VSBuffer.fromString('Target File 3'))
		]);

		await service.move(sourceFolder, targetFolder, true);

		assert.deepStrictEqual(await service.exists(sourceFolder), false);
		assert.deepStrictEqual(await service.exists(targetFolder), true);
		assert.strictEqual((await service.readFile(targetFile1)).value.toString(), 'Source File 1');
		assert.strictEqual(await service.exists(targetFile2), false);
		assert.strictEqual(await service.exists(targetFile3), false);
	});

	test('deleteFile', async () => {
		await initFixtures();

		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const anotherResource = userdataURIFromPaths(['fixtures', 'service', 'deep', 'company.js']);
		const resource = userdataURIFromPaths(['fixtures', 'service', 'deep', 'conway.js']);
		const source = await service.resolve(resource);

		assert.strictEqual(await service.canDelete(source.resource, { useTrash: false }), true);
		await service.del(source.resource, { useTrash: false });

		assert.strictEqual(await service.exists(source.resource), false);
		assert.strictEqual(await service.exists(anotherResource), true);

		assert.ok(event!);
		assert.strictEqual(event!.resource.path, resource.path);
		assert.strictEqual(event!.operation, FileOperation.DELETE);

		{
			let error: Error | undefined = undefined;
			try {
				await service.del(source.resource, { useTrash: false });
			} catch (e) {
				error = e;
			}

			assert.ok(error);
			assert.strictEqual((<FileOperationError>error).fileOperationResult, FileOperationResult.FILE_NOT_FOUND);
		}
		await reload();
		{
			let error: Error | undefined = undefined;
			try {
				await service.del(source.resource, { useTrash: false });
			} catch (e) {
				error = e;
			}

			assert.ok(error);
			assert.strictEqual((<FileOperationError>error).fileOperationResult, FileOperationResult.FILE_NOT_FOUND);
		}
	});

	test('deleteFolder (recursive)', async () => {
		await initFixtures();
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const resource = userdataURIFromPaths(['fixtures', 'service', 'deep']);
		const subResource1 = userdataURIFromPaths(['fixtures', 'service', 'deep', 'company.js']);
		const subResource2 = userdataURIFromPaths(['fixtures', 'service', 'deep', 'conway.js']);
		assert.strictEqual(await service.exists(subResource1), true);
		assert.strictEqual(await service.exists(subResource2), true);

		const source = await service.resolve(resource);

		assert.strictEqual(await service.canDelete(source.resource, { recursive: true, useTrash: false }), true);
		await service.del(source.resource, { recursive: true, useTrash: false });

		assert.strictEqual(await service.exists(source.resource), false);
		assert.strictEqual(await service.exists(subResource1), false);
		assert.strictEqual(await service.exists(subResource2), false);
		assert.ok(event!);
		assert.strictEqual(event!.resource.fsPath, resource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.DELETE);
	});

	test('deleteFolder (non recursive)', async () => {
		await initFixtures();
		const resource = userdataURIFromPaths(['fixtures', 'service', 'deep']);
		const source = await service.resolve(resource);

		assert.ok((await service.canDelete(source.resource)) instanceof Error);

		let error;
		try {
			await service.del(source.resource);
		} catch (e) {
			error = e;
		}
		assert.ok(error);
	});

	test('delete empty folder', async () => {
		const parent = await service.resolve(userdataURIFromPaths([]));
		const folder = joinPath(parent.resource, 'folder');
		await service.createFolder(folder);

		await service.del(folder);

		assert.deepStrictEqual(await service.exists(folder), false);
	});

	test('delete empty folder with reccursive', async () => {
		const parent = await service.resolve(userdataURIFromPaths([]));
		const folder = joinPath(parent.resource, 'folder');
		await service.createFolder(folder);

		await service.del(folder, { recursive: true });

		assert.deepStrictEqual(await service.exists(folder), false);
	});

	test('deleteFolder with folders and files (recursive)', async () => {
		const parent = await service.resolve(userdataURIFromPaths([]));

		const targetFolder = joinPath(parent.resource, 'targetFolder');
		const file1 = joinPath(targetFolder, 'folder1', 'file1');
		await service.createFile(file1);
		const file2 = joinPath(targetFolder, 'folder2', 'file1');
		await service.createFile(file2);
		const emptyFolder = joinPath(targetFolder, 'folder3');
		await service.createFolder(emptyFolder);

		await service.del(targetFolder, { recursive: true });

		assert.deepStrictEqual(await service.exists(targetFolder), false);
		assert.deepStrictEqual(await service.exists(joinPath(targetFolder, 'folder1')), false);
		assert.deepStrictEqual(await service.exists(joinPath(targetFolder, 'folder2')), false);
		assert.deepStrictEqual(await service.exists(file1), false);
		assert.deepStrictEqual(await service.exists(file2), false);
		assert.deepStrictEqual(await service.exists(emptyFolder), false);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/test/common/files.test.ts]---
Location: vscode-main/src/vs/platform/files/test/common/files.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { isEqual, isEqualOrParent } from '../../../../base/common/extpath.js';
import { isLinux, isMacintosh, isWindows } from '../../../../base/common/platform.js';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite, toResource } from '../../../../base/test/common/utils.js';
import { FileChangesEvent, FileChangeType, IFileChange, isParent } from '../../common/files.js';

suite('Files', () => {

	test('FileChangesEvent - basics', function () {
		const changes = [
			{ resource: toResource.call(this, '/foo/updated.txt'), type: FileChangeType.UPDATED },
			{ resource: toResource.call(this, '/foo/otherupdated.txt'), type: FileChangeType.UPDATED },
			{ resource: toResource.call(this, '/added.txt'), type: FileChangeType.ADDED },
			{ resource: toResource.call(this, '/bar/deleted.txt'), type: FileChangeType.DELETED },
			{ resource: toResource.call(this, '/bar/folder'), type: FileChangeType.DELETED },
			{ resource: toResource.call(this, '/BAR/FOLDER'), type: FileChangeType.DELETED }
		];

		for (const ignorePathCasing of [false, true]) {
			const event = new FileChangesEvent(changes, ignorePathCasing);

			assert(!event.contains(toResource.call(this, '/foo'), FileChangeType.UPDATED));
			assert(event.affects(toResource.call(this, '/foo'), FileChangeType.UPDATED));
			assert(event.contains(toResource.call(this, '/foo/updated.txt'), FileChangeType.UPDATED));
			assert(event.affects(toResource.call(this, '/foo/updated.txt'), FileChangeType.UPDATED));
			assert(event.contains(toResource.call(this, '/foo/updated.txt'), FileChangeType.UPDATED, FileChangeType.ADDED));
			assert(event.affects(toResource.call(this, '/foo/updated.txt'), FileChangeType.UPDATED, FileChangeType.ADDED));
			assert(event.contains(toResource.call(this, '/foo/updated.txt'), FileChangeType.UPDATED, FileChangeType.ADDED, FileChangeType.DELETED));
			assert(!event.contains(toResource.call(this, '/foo/updated.txt'), FileChangeType.ADDED, FileChangeType.DELETED));
			assert(!event.contains(toResource.call(this, '/foo/updated.txt'), FileChangeType.ADDED));
			assert(!event.contains(toResource.call(this, '/foo/updated.txt'), FileChangeType.DELETED));
			assert(!event.affects(toResource.call(this, '/foo/updated.txt'), FileChangeType.DELETED));

			assert(event.contains(toResource.call(this, '/bar/folder'), FileChangeType.DELETED));
			assert(event.contains(toResource.call(this, '/BAR/FOLDER'), FileChangeType.DELETED));
			assert(event.affects(toResource.call(this, '/BAR'), FileChangeType.DELETED));
			if (ignorePathCasing) {
				assert(event.contains(toResource.call(this, '/BAR/folder'), FileChangeType.DELETED));
				assert(event.affects(toResource.call(this, '/bar'), FileChangeType.DELETED));
			} else {
				assert(!event.contains(toResource.call(this, '/BAR/folder'), FileChangeType.DELETED));
				assert(event.affects(toResource.call(this, '/bar'), FileChangeType.DELETED));
			}
			assert(event.contains(toResource.call(this, '/bar/folder/somefile'), FileChangeType.DELETED));
			assert(event.contains(toResource.call(this, '/bar/folder/somefile/test.txt'), FileChangeType.DELETED));
			assert(event.contains(toResource.call(this, '/BAR/FOLDER/somefile/test.txt'), FileChangeType.DELETED));
			if (ignorePathCasing) {
				assert(event.contains(toResource.call(this, '/BAR/folder/somefile/test.txt'), FileChangeType.DELETED));
			} else {
				assert(!event.contains(toResource.call(this, '/BAR/folder/somefile/test.txt'), FileChangeType.DELETED));
			}
			assert(!event.contains(toResource.call(this, '/bar/folder2/somefile'), FileChangeType.DELETED));

			assert.strictEqual(1, event.rawAdded.length);
			assert.strictEqual(2, event.rawUpdated.length);
			assert.strictEqual(3, event.rawDeleted.length);
			assert.strictEqual(true, event.gotAdded());
			assert.strictEqual(true, event.gotUpdated());
			assert.strictEqual(true, event.gotDeleted());
		}
	});

	test('FileChangesEvent - supports multiple changes on file tree', function () {
		for (const type of [FileChangeType.ADDED, FileChangeType.UPDATED, FileChangeType.DELETED]) {
			const changes = [
				{ resource: toResource.call(this, '/foo/bar/updated.txt'), type },
				{ resource: toResource.call(this, '/foo/bar/otherupdated.txt'), type },
				{ resource: toResource.call(this, '/foo/bar'), type },
				{ resource: toResource.call(this, '/foo'), type },
				{ resource: toResource.call(this, '/bar'), type },
				{ resource: toResource.call(this, '/bar/foo'), type },
				{ resource: toResource.call(this, '/bar/foo/updated.txt'), type },
				{ resource: toResource.call(this, '/bar/foo/otherupdated.txt'), type }
			];

			for (const ignorePathCasing of [false, true]) {
				const event = new FileChangesEvent(changes, ignorePathCasing);

				for (const change of changes) {
					assert(event.contains(change.resource, type));
					assert(event.affects(change.resource, type));
				}

				assert(event.affects(toResource.call(this, '/foo'), type));
				assert(event.affects(toResource.call(this, '/bar'), type));
				assert(event.affects(toResource.call(this, '/'), type));
				assert(!event.affects(toResource.call(this, '/foobar'), type));

				assert(!event.contains(toResource.call(this, '/some/foo/bar'), type));
				assert(!event.affects(toResource.call(this, '/some/foo/bar'), type));
				assert(!event.contains(toResource.call(this, '/some/bar'), type));
				assert(!event.affects(toResource.call(this, '/some/bar'), type));

				switch (type) {
					case FileChangeType.ADDED:
						assert.strictEqual(8, event.rawAdded.length);
						break;
					case FileChangeType.DELETED:
						assert.strictEqual(8, event.rawDeleted.length);
						break;
				}
			}
		}
	});

	test('FileChangesEvent - correlation', function () {
		let changes: IFileChange[] = [
			{ resource: toResource.call(this, '/foo/updated.txt'), type: FileChangeType.UPDATED },
			{ resource: toResource.call(this, '/foo/otherupdated.txt'), type: FileChangeType.UPDATED },
			{ resource: toResource.call(this, '/added.txt'), type: FileChangeType.ADDED },
		];

		let event: FileChangesEvent = new FileChangesEvent(changes, true);
		assert.strictEqual(event.hasCorrelation(), false);
		assert.strictEqual(event.correlates(100), false);

		changes = [
			{ resource: toResource.call(this, '/foo/updated.txt'), type: FileChangeType.UPDATED, cId: 100 },
			{ resource: toResource.call(this, '/foo/otherupdated.txt'), type: FileChangeType.UPDATED, cId: 100 },
			{ resource: toResource.call(this, '/added.txt'), type: FileChangeType.ADDED, cId: 100 },
		];

		event = new FileChangesEvent(changes, true);
		assert.strictEqual(event.hasCorrelation(), true);
		assert.strictEqual(event.correlates(100), true);
		assert.strictEqual(event.correlates(120), false);

		changes = [
			{ resource: toResource.call(this, '/foo/updated.txt'), type: FileChangeType.UPDATED, cId: 100 },
			{ resource: toResource.call(this, '/foo/otherupdated.txt'), type: FileChangeType.UPDATED },
			{ resource: toResource.call(this, '/added.txt'), type: FileChangeType.ADDED, cId: 100 },
		];

		event = new FileChangesEvent(changes, true);
		assert.strictEqual(event.hasCorrelation(), false);
		assert.strictEqual(event.correlates(100), false);
		assert.strictEqual(event.correlates(120), false);

		changes = [
			{ resource: toResource.call(this, '/foo/updated.txt'), type: FileChangeType.UPDATED, cId: 100 },
			{ resource: toResource.call(this, '/foo/otherupdated.txt'), type: FileChangeType.UPDATED, cId: 120 },
			{ resource: toResource.call(this, '/added.txt'), type: FileChangeType.ADDED, cId: 100 },
		];

		event = new FileChangesEvent(changes, true);
		assert.strictEqual(event.hasCorrelation(), false);
		assert.strictEqual(event.correlates(100), false);
		assert.strictEqual(event.correlates(120), false);
	});

	function testIsEqual(testMethod: (pA: string, pB: string, ignoreCase: boolean) => boolean): void {

		// corner cases
		assert(testMethod('', '', true));
		assert(!testMethod(null!, '', true));
		assert(!testMethod(undefined!, '', true));

		// basics (string)
		assert(testMethod('/', '/', true));
		assert(testMethod('/some', '/some', true));
		assert(testMethod('/some/path', '/some/path', true));

		assert(testMethod('c:\\', 'c:\\', true));
		assert(testMethod('c:\\some', 'c:\\some', true));
		assert(testMethod('c:\\some\\path', 'c:\\some\\path', true));

		assert(testMethod('/someöäü/path', '/someöäü/path', true));
		assert(testMethod('c:\\someöäü\\path', 'c:\\someöäü\\path', true));

		assert(!testMethod('/some/path', '/some/other/path', true));
		assert(!testMethod('c:\\some\\path', 'c:\\some\\other\\path', true));
		assert(!testMethod('c:\\some\\path', 'd:\\some\\path', true));

		assert(testMethod('/some/path', '/some/PATH', true));
		assert(testMethod('/someöäü/path', '/someÖÄÜ/PATH', true));
		assert(testMethod('c:\\some\\path', 'c:\\some\\PATH', true));
		assert(testMethod('c:\\someöäü\\path', 'c:\\someÖÄÜ\\PATH', true));
		assert(testMethod('c:\\some\\path', 'C:\\some\\PATH', true));
	}

	test('isEqual (ignoreCase)', function () {
		testIsEqual(isEqual);

		// basics (uris)
		assert(isEqual(URI.file('/some/path').fsPath, URI.file('/some/path').fsPath, true));
		assert(isEqual(URI.file('c:\\some\\path').fsPath, URI.file('c:\\some\\path').fsPath, true));

		assert(isEqual(URI.file('/someöäü/path').fsPath, URI.file('/someöäü/path').fsPath, true));
		assert(isEqual(URI.file('c:\\someöäü\\path').fsPath, URI.file('c:\\someöäü\\path').fsPath, true));

		assert(!isEqual(URI.file('/some/path').fsPath, URI.file('/some/other/path').fsPath, true));
		assert(!isEqual(URI.file('c:\\some\\path').fsPath, URI.file('c:\\some\\other\\path').fsPath, true));

		assert(isEqual(URI.file('/some/path').fsPath, URI.file('/some/PATH').fsPath, true));
		assert(isEqual(URI.file('/someöäü/path').fsPath, URI.file('/someÖÄÜ/PATH').fsPath, true));
		assert(isEqual(URI.file('c:\\some\\path').fsPath, URI.file('c:\\some\\PATH').fsPath, true));
		assert(isEqual(URI.file('c:\\someöäü\\path').fsPath, URI.file('c:\\someÖÄÜ\\PATH').fsPath, true));
		assert(isEqual(URI.file('c:\\some\\path').fsPath, URI.file('C:\\some\\PATH').fsPath, true));
	});

	test('isParent (ignorecase)', function () {
		if (isWindows) {
			assert(isParent('c:\\some\\path', 'c:\\', true));
			assert(isParent('c:\\some\\path', 'c:\\some', true));
			assert(isParent('c:\\some\\path', 'c:\\some\\', true));
			assert(isParent('c:\\someöäü\\path', 'c:\\someöäü', true));
			assert(isParent('c:\\someöäü\\path', 'c:\\someöäü\\', true));
			assert(isParent('c:\\foo\\bar\\test.ts', 'c:\\foo\\bar', true));
			assert(isParent('c:\\foo\\bar\\test.ts', 'c:\\foo\\bar\\', true));

			assert(isParent('c:\\some\\path', 'C:\\', true));
			assert(isParent('c:\\some\\path', 'c:\\SOME', true));
			assert(isParent('c:\\some\\path', 'c:\\SOME\\', true));

			assert(!isParent('c:\\some\\path', 'd:\\', true));
			assert(!isParent('c:\\some\\path', 'c:\\some\\path', true));
			assert(!isParent('c:\\some\\path', 'd:\\some\\path', true));
			assert(!isParent('c:\\foo\\bar\\test.ts', 'c:\\foo\\barr', true));
			assert(!isParent('c:\\foo\\bar\\test.ts', 'c:\\foo\\bar\\test', true));
		}

		if (isMacintosh || isLinux) {
			assert(isParent('/some/path', '/', true));
			assert(isParent('/some/path', '/some', true));
			assert(isParent('/some/path', '/some/', true));
			assert(isParent('/someöäü/path', '/someöäü', true));
			assert(isParent('/someöäü/path', '/someöäü/', true));
			assert(isParent('/foo/bar/test.ts', '/foo/bar', true));
			assert(isParent('/foo/bar/test.ts', '/foo/bar/', true));

			assert(isParent('/some/path', '/SOME', true));
			assert(isParent('/some/path', '/SOME/', true));
			assert(isParent('/someöäü/path', '/SOMEÖÄÜ', true));
			assert(isParent('/someöäü/path', '/SOMEÖÄÜ/', true));

			assert(!isParent('/some/path', '/some/path', true));
			assert(!isParent('/foo/bar/test.ts', '/foo/barr', true));
			assert(!isParent('/foo/bar/test.ts', '/foo/bar/test', true));
		}
	});

	test('isEqualOrParent (ignorecase)', function () {

		// same assertions apply as with isEqual()
		testIsEqual(isEqualOrParent); //

		if (isWindows) {
			assert(isEqualOrParent('c:\\some\\path', 'c:\\', true));
			assert(isEqualOrParent('c:\\some\\path', 'c:\\some', true));
			assert(isEqualOrParent('c:\\some\\path', 'c:\\some\\', true));
			assert(isEqualOrParent('c:\\someöäü\\path', 'c:\\someöäü', true));
			assert(isEqualOrParent('c:\\someöäü\\path', 'c:\\someöäü\\', true));
			assert(isEqualOrParent('c:\\foo\\bar\\test.ts', 'c:\\foo\\bar', true));
			assert(isEqualOrParent('c:\\foo\\bar\\test.ts', 'c:\\foo\\bar\\', true));
			assert(isEqualOrParent('c:\\some\\path', 'c:\\some\\path', true));
			assert(isEqualOrParent('c:\\foo\\bar\\test.ts', 'c:\\foo\\bar\\test.ts', true));

			assert(isEqualOrParent('c:\\some\\path', 'C:\\', true));
			assert(isEqualOrParent('c:\\some\\path', 'c:\\SOME', true));
			assert(isEqualOrParent('c:\\some\\path', 'c:\\SOME\\', true));

			assert(!isEqualOrParent('c:\\some\\path', 'd:\\', true));
			assert(!isEqualOrParent('c:\\some\\path', 'd:\\some\\path', true));
			assert(!isEqualOrParent('c:\\foo\\bar\\test.ts', 'c:\\foo\\barr', true));
			assert(!isEqualOrParent('c:\\foo\\bar\\test.ts', 'c:\\foo\\bar\\test', true));
			assert(!isEqualOrParent('c:\\foo\\bar\\test.ts', 'c:\\foo\\bar\\test.', true));
			assert(!isEqualOrParent('c:\\foo\\bar\\test.ts', 'c:\\foo\\BAR\\test.', true));
		}

		if (isMacintosh || isLinux) {
			assert(isEqualOrParent('/some/path', '/', true));
			assert(isEqualOrParent('/some/path', '/some', true));
			assert(isEqualOrParent('/some/path', '/some/', true));
			assert(isEqualOrParent('/someöäü/path', '/someöäü', true));
			assert(isEqualOrParent('/someöäü/path', '/someöäü/', true));
			assert(isEqualOrParent('/foo/bar/test.ts', '/foo/bar', true));
			assert(isEqualOrParent('/foo/bar/test.ts', '/foo/bar/', true));
			assert(isEqualOrParent('/some/path', '/some/path', true));

			assert(isEqualOrParent('/some/path', '/SOME', true));
			assert(isEqualOrParent('/some/path', '/SOME/', true));
			assert(isEqualOrParent('/someöäü/path', '/SOMEÖÄÜ', true));
			assert(isEqualOrParent('/someöäü/path', '/SOMEÖÄÜ/', true));

			assert(!isEqualOrParent('/foo/bar/test.ts', '/foo/barr', true));
			assert(!isEqualOrParent('/foo/bar/test.ts', '/foo/bar/test', true));
			assert(!isEqualOrParent('foo/bar/test.ts', 'foo/bar/test.', true));
			assert(!isEqualOrParent('foo/bar/test.ts', 'foo/BAR/test.', true));
		}
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/test/common/nullFileSystemProvider.ts]---
Location: vscode-main/src/vs/platform/files/test/common/nullFileSystemProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { ReadableStreamEvents } from '../../../../base/common/stream.js';
import { URI } from '../../../../base/common/uri.js';
import { IFileDeleteOptions, IFileOpenOptions, IFileOverwriteOptions, FileSystemProviderCapabilities, FileType, IFileWriteOptions, IFileChange, IFileSystemProvider, IStat, IWatchOptions, IFileReadStreamOptions } from '../../common/files.js';

export class NullFileSystemProvider implements IFileSystemProvider {

	capabilities: FileSystemProviderCapabilities = FileSystemProviderCapabilities.Readonly;

	private readonly _onDidChangeCapabilities = new Emitter<void>();
	readonly onDidChangeCapabilities: Event<void> = this._onDidChangeCapabilities.event;

	private readonly _onDidChangeFile = new Emitter<readonly IFileChange[]>();
	readonly onDidChangeFile: Event<readonly IFileChange[]> = this._onDidChangeFile.event;

	constructor(private disposableFactory: () => IDisposable = () => Disposable.None) { }

	emitFileChangeEvents(changes: IFileChange[]): void {
		this._onDidChangeFile.fire(changes);
	}

	setCapabilities(capabilities: FileSystemProviderCapabilities): void {
		this.capabilities = capabilities;

		this._onDidChangeCapabilities.fire();
	}

	watch(resource: URI, opts: IWatchOptions): IDisposable { return this.disposableFactory(); }
	async stat(resource: URI): Promise<IStat> { return undefined!; }
	async mkdir(resource: URI): Promise<void> { return undefined; }
	async readdir(resource: URI): Promise<[string, FileType][]> { return undefined!; }
	async delete(resource: URI, opts: IFileDeleteOptions): Promise<void> { return undefined; }
	async rename(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void> { return undefined; }
	async copy(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void> { return undefined; }
	async readFile(resource: URI): Promise<Uint8Array> { return undefined!; }
	readFileStream(resource: URI, opts: IFileReadStreamOptions, token: CancellationToken): ReadableStreamEvents<Uint8Array> { return undefined!; }
	async writeFile(resource: URI, content: Uint8Array, opts: IFileWriteOptions): Promise<void> { return undefined; }
	async open(resource: URI, opts: IFileOpenOptions): Promise<number> { return undefined!; }
	async close(fd: number): Promise<void> { return undefined; }
	async read(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> { return undefined!; }
	async write(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> { return undefined!; }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/test/common/watcher.test.ts]---
Location: vscode-main/src/vs/platform/files/test/common/watcher.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { isLinux, isWindows } from '../../../../base/common/platform.js';
import { isEqual } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { FileChangeFilter, FileChangesEvent, FileChangeType, IFileChange } from '../../common/files.js';
import { coalesceEvents, reviveFileChanges, parseWatcherPatterns, isFiltered } from '../../common/watcher.js';

class TestFileWatcher extends Disposable {
	private readonly _onDidFilesChange: Emitter<{ raw: IFileChange[]; event: FileChangesEvent }>;

	constructor() {
		super();

		this._onDidFilesChange = this._register(new Emitter<{ raw: IFileChange[]; event: FileChangesEvent }>());
	}

	get onDidFilesChange(): Event<{ raw: IFileChange[]; event: FileChangesEvent }> {
		return this._onDidFilesChange.event;
	}

	report(changes: IFileChange[]): void {
		this.onRawFileEvents(changes);
	}

	private onRawFileEvents(events: IFileChange[]): void {

		// Coalesce
		const coalescedEvents = coalesceEvents(events);

		// Emit through event emitter
		if (coalescedEvents.length > 0) {
			this._onDidFilesChange.fire({ raw: reviveFileChanges(coalescedEvents), event: this.toFileChangesEvent(coalescedEvents) });
		}
	}

	private toFileChangesEvent(changes: IFileChange[]): FileChangesEvent {
		return new FileChangesEvent(reviveFileChanges(changes), !isLinux);
	}
}

enum Path {
	UNIX,
	WINDOWS,
	UNC
}

suite('Watcher', () => {

	(isWindows ? test.skip : test)('parseWatcherPatterns - posix', () => {
		const path = '/users/data/src';
		let parsedPattern = parseWatcherPatterns(path, ['*.js'], false)[0];

		assert.strictEqual(parsedPattern('/users/data/src/foo.js'), true);
		assert.strictEqual(parsedPattern('/users/data/src/foo.ts'), false);
		assert.strictEqual(parsedPattern('/users/data/src/bar/foo.js'), false);

		parsedPattern = parseWatcherPatterns(path, ['/users/data/src/*.js'], false)[0];

		assert.strictEqual(parsedPattern('/users/data/src/foo.js'), true);
		assert.strictEqual(parsedPattern('/users/data/src/foo.ts'), false);
		assert.strictEqual(parsedPattern('/users/data/src/bar/foo.js'), false);

		parsedPattern = parseWatcherPatterns(path, ['/users/data/src/bar/*.js'], false)[0];

		assert.strictEqual(parsedPattern('/users/data/src/foo.js'), false);
		assert.strictEqual(parsedPattern('/users/data/src/foo.ts'), false);
		assert.strictEqual(parsedPattern('/users/data/src/bar/foo.js'), true);

		parsedPattern = parseWatcherPatterns(path, ['**/*.js'], false)[0];

		assert.strictEqual(parsedPattern('/users/data/src/foo.js'), true);
		assert.strictEqual(parsedPattern('/users/data/src/foo.ts'), false);
		assert.strictEqual(parsedPattern('/users/data/src/bar/foo.js'), true);
	});

	(!isWindows ? test.skip : test)('parseWatcherPatterns - windows', () => {
		const path = 'c:\\users\\data\\src';
		let parsedPattern = parseWatcherPatterns(path, ['*.js'], true)[0];

		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\foo.js'), true);
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\foo.ts'), false);
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\bar/foo.js'), false);

		parsedPattern = parseWatcherPatterns(path, ['c:\\users\\data\\src\\*.js'], true)[0];

		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\foo.js'), true);
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\foo.ts'), false);
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\bar\\foo.js'), false);

		parsedPattern = parseWatcherPatterns(path, ['c:\\users\\data\\src\\bar/*.js'], true)[0];

		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\foo.js'), false);
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\foo.ts'), false);
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\bar\\foo.js'), true);

		parsedPattern = parseWatcherPatterns(path, ['**/*.js'], true)[0];

		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\foo.js'), true);
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\foo.ts'), false);
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\bar\\foo.js'), true);
	});

	(isWindows ? test.skip : test)('parseWatcherPatterns - posix (case insensitive)', () => {
		const path = '/users/data/src';
		let parsedPattern = parseWatcherPatterns(path, ['*.JS'], false)[0];

		// Case sensitive by default on posix
		assert.strictEqual(parsedPattern('/users/data/src/foo.js'), false);
		assert.strictEqual(parsedPattern('/users/data/src/foo.JS'), true);
		assert.strictEqual(parsedPattern('/users/data/src/foo.Js'), false);

		// Now test with GlobCaseSensitivity.caseInsensitive
		parsedPattern = parseWatcherPatterns(path, ['*.JS'], true)[0];

		assert.strictEqual(parsedPattern('/users/data/src/foo.js'), true);
		assert.strictEqual(parsedPattern('/users/data/src/foo.JS'), true);
		assert.strictEqual(parsedPattern('/users/data/src/foo.Js'), true);
		assert.strictEqual(parsedPattern('/users/data/src/foo.ts'), false);

		parsedPattern = parseWatcherPatterns(path, ['/users/data/src/*.JS'], true)[0];

		assert.strictEqual(parsedPattern('/users/data/src/foo.js'), true);
		assert.strictEqual(parsedPattern('/users/data/src/foo.JS'), true);
		assert.strictEqual(parsedPattern('/users/data/src/foo.ts'), false);
		assert.strictEqual(parsedPattern('/users/data/src/bar/foo.js'), false);

		parsedPattern = parseWatcherPatterns(path, ['**/Test*.JS'], true)[0];

		assert.strictEqual(parsedPattern('/users/data/src/test1.js'), true);
		assert.strictEqual(parsedPattern('/users/data/src/Test1.js'), true);
		assert.strictEqual(parsedPattern('/users/data/src/TEST1.JS'), true);
		assert.strictEqual(parsedPattern('/users/data/src/bar/test2.js'), true);
		assert.strictEqual(parsedPattern('/users/data/src/bar/TEST2.JS'), true);
		assert.strictEqual(parsedPattern('/users/data/src/foo.js'), false);
	});

	(!isWindows ? test.skip : test)('parseWatcherPatterns - windows (case insensitive)', () => {
		const path = 'c:\\users\\data\\src';
		let parsedPattern = parseWatcherPatterns(path, ['*.JS'], true)[0];

		// Windows is case insensitive by default
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\foo.js'), true);
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\foo.JS'), true);
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\foo.Js'), true);
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\foo.ts'), false);

		// Explicit GlobCaseSensitivity.caseInsensitive should work the same
		parsedPattern = parseWatcherPatterns(path, ['*.JS'], true)[0];

		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\foo.js'), true);
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\foo.JS'), true);
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\foo.Js'), true);
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\foo.ts'), false);

		parsedPattern = parseWatcherPatterns(path, ['c:\\users\\data\\src\\*.JS'], true)[0];

		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\foo.js'), true);
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\foo.JS'), true);
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\foo.ts'), false);
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\bar\\foo.js'), false);

		parsedPattern = parseWatcherPatterns(path, ['**/Test*.JS'], true)[0];

		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\test1.js'), true);
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\Test1.js'), true);
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\TEST1.JS'), true);
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\bar\\test2.js'), true);
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\bar\\TEST2.JS'), true);
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\foo.js'), false);

		// Test with case sensitive mode explicitly
		parsedPattern = parseWatcherPatterns(path, ['*.JS'], false)[0];

		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\foo.js'), false);
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\foo.JS'), true);
		assert.strictEqual(parsedPattern('c:\\users\\data\\src\\foo.Js'), false);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});

suite('Watcher Events Normalizer', () => {

	const disposables = new DisposableStore();

	teardown(() => {
		disposables.clear();
	});

	test('simple add/update/delete', done => {
		const watch = disposables.add(new TestFileWatcher());

		const added = URI.file('/users/data/src/added.txt');
		const updated = URI.file('/users/data/src/updated.txt');
		const deleted = URI.file('/users/data/src/deleted.txt');

		const raw: IFileChange[] = [
			{ resource: added, type: FileChangeType.ADDED },
			{ resource: updated, type: FileChangeType.UPDATED },
			{ resource: deleted, type: FileChangeType.DELETED },
		];

		disposables.add(watch.onDidFilesChange(({ event, raw }) => {
			assert.ok(event);
			assert.strictEqual(raw.length, 3);
			assert.ok(event.contains(added, FileChangeType.ADDED));
			assert.ok(event.contains(updated, FileChangeType.UPDATED));
			assert.ok(event.contains(deleted, FileChangeType.DELETED));

			done();
		}));

		watch.report(raw);
	});

	(isWindows ? [Path.WINDOWS, Path.UNC] : [Path.UNIX]).forEach(path => {
		test(`delete only reported for top level folder (${path})`, done => {
			const watch = disposables.add(new TestFileWatcher());

			const deletedFolderA = URI.file(path === Path.UNIX ? '/users/data/src/todelete1' : path === Path.WINDOWS ? 'C:\\users\\data\\src\\todelete1' : '\\\\localhost\\users\\data\\src\\todelete1');
			const deletedFolderB = URI.file(path === Path.UNIX ? '/users/data/src/todelete2' : path === Path.WINDOWS ? 'C:\\users\\data\\src\\todelete2' : '\\\\localhost\\users\\data\\src\\todelete2');
			const deletedFolderBF1 = URI.file(path === Path.UNIX ? '/users/data/src/todelete2/file.txt' : path === Path.WINDOWS ? 'C:\\users\\data\\src\\todelete2\\file.txt' : '\\\\localhost\\users\\data\\src\\todelete2\\file.txt');
			const deletedFolderBF2 = URI.file(path === Path.UNIX ? '/users/data/src/todelete2/more/test.txt' : path === Path.WINDOWS ? 'C:\\users\\data\\src\\todelete2\\more\\test.txt' : '\\\\localhost\\users\\data\\src\\todelete2\\more\\test.txt');
			const deletedFolderBF3 = URI.file(path === Path.UNIX ? '/users/data/src/todelete2/super/bar/foo.txt' : path === Path.WINDOWS ? 'C:\\users\\data\\src\\todelete2\\super\\bar\\foo.txt' : '\\\\localhost\\users\\data\\src\\todelete2\\super\\bar\\foo.txt');
			const deletedFileA = URI.file(path === Path.UNIX ? '/users/data/src/deleteme.txt' : path === Path.WINDOWS ? 'C:\\users\\data\\src\\deleteme.txt' : '\\\\localhost\\users\\data\\src\\deleteme.txt');

			const addedFile = URI.file(path === Path.UNIX ? '/users/data/src/added.txt' : path === Path.WINDOWS ? 'C:\\users\\data\\src\\added.txt' : '\\\\localhost\\users\\data\\src\\added.txt');
			const updatedFile = URI.file(path === Path.UNIX ? '/users/data/src/updated.txt' : path === Path.WINDOWS ? 'C:\\users\\data\\src\\updated.txt' : '\\\\localhost\\users\\data\\src\\updated.txt');

			const raw: IFileChange[] = [
				{ resource: deletedFolderA, type: FileChangeType.DELETED },
				{ resource: deletedFolderB, type: FileChangeType.DELETED },
				{ resource: deletedFolderBF1, type: FileChangeType.DELETED },
				{ resource: deletedFolderBF2, type: FileChangeType.DELETED },
				{ resource: deletedFolderBF3, type: FileChangeType.DELETED },
				{ resource: deletedFileA, type: FileChangeType.DELETED },
				{ resource: addedFile, type: FileChangeType.ADDED },
				{ resource: updatedFile, type: FileChangeType.UPDATED }
			];

			disposables.add(watch.onDidFilesChange(({ event, raw }) => {
				assert.ok(event);
				assert.strictEqual(raw.length, 5);

				assert.ok(event.contains(deletedFolderA, FileChangeType.DELETED));
				assert.ok(event.contains(deletedFolderB, FileChangeType.DELETED));
				assert.ok(event.contains(deletedFileA, FileChangeType.DELETED));
				assert.ok(event.contains(addedFile, FileChangeType.ADDED));
				assert.ok(event.contains(updatedFile, FileChangeType.UPDATED));

				done();
			}));

			watch.report(raw);
		});
	});

	test('event coalescer: ignore CREATE followed by DELETE', done => {
		const watch = disposables.add(new TestFileWatcher());

		const created = URI.file('/users/data/src/related');
		const deleted = URI.file('/users/data/src/related');
		const unrelated = URI.file('/users/data/src/unrelated');

		const raw: IFileChange[] = [
			{ resource: created, type: FileChangeType.ADDED },
			{ resource: deleted, type: FileChangeType.DELETED },
			{ resource: unrelated, type: FileChangeType.UPDATED },
		];

		disposables.add(watch.onDidFilesChange(({ event, raw }) => {
			assert.ok(event);
			assert.strictEqual(raw.length, 1);

			assert.ok(event.contains(unrelated, FileChangeType.UPDATED));

			done();
		}));

		watch.report(raw);
	});

	test('event coalescer: flatten DELETE followed by CREATE into CHANGE', done => {
		const watch = disposables.add(new TestFileWatcher());

		const deleted = URI.file('/users/data/src/related');
		const created = URI.file('/users/data/src/related');
		const unrelated = URI.file('/users/data/src/unrelated');

		const raw: IFileChange[] = [
			{ resource: deleted, type: FileChangeType.DELETED },
			{ resource: created, type: FileChangeType.ADDED },
			{ resource: unrelated, type: FileChangeType.UPDATED },
		];

		disposables.add(watch.onDidFilesChange(({ event, raw }) => {
			assert.ok(event);
			assert.strictEqual(raw.length, 2);

			assert.ok(event.contains(deleted, FileChangeType.UPDATED));
			assert.ok(event.contains(unrelated, FileChangeType.UPDATED));

			done();
		}));

		watch.report(raw);
	});

	test('event coalescer: ignore UPDATE when CREATE received', done => {
		const watch = disposables.add(new TestFileWatcher());

		const created = URI.file('/users/data/src/related');
		const updated = URI.file('/users/data/src/related');
		const unrelated = URI.file('/users/data/src/unrelated');

		const raw: IFileChange[] = [
			{ resource: created, type: FileChangeType.ADDED },
			{ resource: updated, type: FileChangeType.UPDATED },
			{ resource: unrelated, type: FileChangeType.UPDATED },
		];

		disposables.add(watch.onDidFilesChange(({ event, raw }) => {
			assert.ok(event);
			assert.strictEqual(raw.length, 2);

			assert.ok(event.contains(created, FileChangeType.ADDED));
			assert.ok(!event.contains(created, FileChangeType.UPDATED));
			assert.ok(event.contains(unrelated, FileChangeType.UPDATED));

			done();
		}));

		watch.report(raw);
	});

	test('event coalescer: apply DELETE', done => {
		const watch = disposables.add(new TestFileWatcher());

		const updated = URI.file('/users/data/src/related');
		const updated2 = URI.file('/users/data/src/related');
		const deleted = URI.file('/users/data/src/related');
		const unrelated = URI.file('/users/data/src/unrelated');

		const raw: IFileChange[] = [
			{ resource: updated, type: FileChangeType.UPDATED },
			{ resource: updated2, type: FileChangeType.UPDATED },
			{ resource: unrelated, type: FileChangeType.UPDATED },
			{ resource: updated, type: FileChangeType.DELETED }
		];

		disposables.add(watch.onDidFilesChange(({ event, raw }) => {
			assert.ok(event);
			assert.strictEqual(raw.length, 2);

			assert.ok(event.contains(deleted, FileChangeType.DELETED));
			assert.ok(!event.contains(updated, FileChangeType.UPDATED));
			assert.ok(event.contains(unrelated, FileChangeType.UPDATED));

			done();
		}));

		watch.report(raw);
	});

	test('event coalescer: track case renames', done => {
		const watch = disposables.add(new TestFileWatcher());

		const oldPath = URI.file('/users/data/src/added');
		const newPath = URI.file('/users/data/src/ADDED');

		const raw: IFileChange[] = [
			{ resource: newPath, type: FileChangeType.ADDED },
			{ resource: oldPath, type: FileChangeType.DELETED }
		];

		disposables.add(watch.onDidFilesChange(({ event, raw }) => {
			assert.ok(event);
			assert.strictEqual(raw.length, 2);

			for (const r of raw) {
				if (isEqual(r.resource, oldPath)) {
					assert.strictEqual(r.type, FileChangeType.DELETED);
				} else if (isEqual(r.resource, newPath)) {
					assert.strictEqual(r.type, FileChangeType.ADDED);
				} else {
					assert.fail();
				}
			}

			done();
		}));

		watch.report(raw);
	});

	test('event type filter', () => {
		const resource = URI.file('/users/data/src/related');

		assert.strictEqual(isFiltered({ resource, type: FileChangeType.ADDED }, undefined), false);
		assert.strictEqual(isFiltered({ resource, type: FileChangeType.UPDATED }, undefined), false);
		assert.strictEqual(isFiltered({ resource, type: FileChangeType.DELETED }, undefined), false);

		assert.strictEqual(isFiltered({ resource, type: FileChangeType.ADDED }, FileChangeFilter.UPDATED), true);
		assert.strictEqual(isFiltered({ resource, type: FileChangeType.ADDED }, FileChangeFilter.UPDATED | FileChangeFilter.DELETED), true);

		assert.strictEqual(isFiltered({ resource, type: FileChangeType.ADDED }, FileChangeFilter.ADDED), false);
		assert.strictEqual(isFiltered({ resource, type: FileChangeType.ADDED }, FileChangeFilter.ADDED | FileChangeFilter.UPDATED), false);
		assert.strictEqual(isFiltered({ resource, type: FileChangeType.ADDED }, FileChangeFilter.ADDED | FileChangeFilter.UPDATED | FileChangeFilter.DELETED), false);

		assert.strictEqual(isFiltered({ resource, type: FileChangeType.DELETED }, FileChangeFilter.UPDATED), true);
		assert.strictEqual(isFiltered({ resource, type: FileChangeType.DELETED }, FileChangeFilter.UPDATED | FileChangeFilter.ADDED), true);

		assert.strictEqual(isFiltered({ resource, type: FileChangeType.DELETED }, FileChangeFilter.DELETED), false);
		assert.strictEqual(isFiltered({ resource, type: FileChangeType.DELETED }, FileChangeFilter.DELETED | FileChangeFilter.UPDATED), false);
		assert.strictEqual(isFiltered({ resource, type: FileChangeType.DELETED }, FileChangeFilter.ADDED | FileChangeFilter.DELETED | FileChangeFilter.UPDATED), false);

		assert.strictEqual(isFiltered({ resource, type: FileChangeType.UPDATED }, FileChangeFilter.ADDED), true);
		assert.strictEqual(isFiltered({ resource, type: FileChangeType.UPDATED }, FileChangeFilter.DELETED | FileChangeFilter.ADDED), true);

		assert.strictEqual(isFiltered({ resource, type: FileChangeType.UPDATED }, FileChangeFilter.UPDATED), false);
		assert.strictEqual(isFiltered({ resource, type: FileChangeType.UPDATED }, FileChangeFilter.DELETED | FileChangeFilter.UPDATED), false);
		assert.strictEqual(isFiltered({ resource, type: FileChangeType.UPDATED }, FileChangeFilter.ADDED | FileChangeFilter.DELETED | FileChangeFilter.UPDATED), false);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

````
