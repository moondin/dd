---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 318
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 318 of 552)

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

---[FILE: src/vs/workbench/api/node/extHostSearch.ts]---
Location: vscode-main/src/vs/workbench/api/node/extHostSearch.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import { URI } from '../../../base/common/uri.js';
import * as pfs from '../../../base/node/pfs.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { IExtHostConfiguration } from '../common/extHostConfiguration.js';
import { IExtHostInitDataService } from '../common/extHostInitDataService.js';
import { IExtHostRpcService } from '../common/extHostRpcService.js';
import { ExtHostSearch, reviveQuery } from '../common/extHostSearch.js';
import { IURITransformerService } from '../common/extHostUriTransformerService.js';
import { IFileQuery, IRawFileQuery, ISearchCompleteStats, ISerializedSearchProgressItem, isSerializedFileMatch, ITextQuery } from '../../services/search/common/search.js';
import { TextSearchManager } from '../../services/search/common/textSearchManager.js';
import { SearchService } from '../../services/search/node/rawSearchService.js';
import { RipgrepSearchProvider } from '../../services/search/node/ripgrepSearchProvider.js';
import { OutputChannel } from '../../services/search/node/ripgrepSearchUtils.js';
import { NativeTextSearchManager } from '../../services/search/node/textSearchManager.js';
import type * as vscode from 'vscode';

export class NativeExtHostSearch extends ExtHostSearch implements IDisposable {

	protected _pfs: typeof pfs = pfs; // allow extending for tests

	private _internalFileSearchHandle: number = -1;
	private _internalFileSearchProvider: SearchService | null = null;

	private _registeredEHSearchProvider = false;

	private _numThreadsPromise: Promise<number | undefined> | undefined;

	private readonly _disposables = new DisposableStore();

	private isDisposed = false;

	constructor(
		@IExtHostRpcService extHostRpc: IExtHostRpcService,
		@IExtHostInitDataService initData: IExtHostInitDataService,
		@IURITransformerService _uriTransformer: IURITransformerService,
		@IExtHostConfiguration private readonly configurationService: IExtHostConfiguration,
		@ILogService _logService: ILogService,
	) {
		super(extHostRpc, _uriTransformer, _logService);
		this.getNumThreads = this.getNumThreads.bind(this);
		this.getNumThreadsCached = this.getNumThreadsCached.bind(this);
		this.handleConfigurationChanged = this.handleConfigurationChanged.bind(this);
		const outputChannel = new OutputChannel('RipgrepSearchUD', this._logService);
		this._disposables.add(this.registerTextSearchProvider(Schemas.vscodeUserData, new RipgrepSearchProvider(outputChannel, this.getNumThreadsCached)));
		if (initData.remote.isRemote && initData.remote.authority) {
			this._registerEHSearchProviders();
		}

		configurationService.getConfigProvider().then(provider => {
			if (this.isDisposed) {
				return;
			}
			this._disposables.add(provider.onDidChangeConfiguration(this.handleConfigurationChanged));
		});
	}

	private handleConfigurationChanged(event: vscode.ConfigurationChangeEvent) {
		if (!event.affectsConfiguration('search')) {
			return;
		}
		this._numThreadsPromise = undefined;
	}

	async getNumThreads(): Promise<number | undefined> {
		const configProvider = await this.configurationService.getConfigProvider();
		const numThreads = configProvider.getConfiguration('search').get<number>('ripgrep.maxThreads');
		return numThreads;
	}

	async getNumThreadsCached(): Promise<number | undefined> {
		if (!this._numThreadsPromise) {
			this._numThreadsPromise = this.getNumThreads();
		}
		return this._numThreadsPromise;
	}

	dispose(): void {
		this.isDisposed = true;
		this._disposables.dispose();
	}

	override $enableExtensionHostSearch(): void {
		this._registerEHSearchProviders();
	}

	private _registerEHSearchProviders(): void {
		if (this._registeredEHSearchProvider) {
			return;
		}

		this._registeredEHSearchProvider = true;
		const outputChannel = new OutputChannel('RipgrepSearchEH', this._logService);
		this._disposables.add(this.registerTextSearchProvider(Schemas.file, new RipgrepSearchProvider(outputChannel, this.getNumThreadsCached)));
		this._disposables.add(this.registerInternalFileSearchProvider(Schemas.file, new SearchService('fileSearchProvider', this.getNumThreadsCached)));
	}

	private registerInternalFileSearchProvider(scheme: string, provider: SearchService): IDisposable {
		const handle = this._handlePool++;
		this._internalFileSearchProvider = provider;
		this._internalFileSearchHandle = handle;
		this._proxy.$registerFileSearchProvider(handle, this._transformScheme(scheme));
		return toDisposable(() => {
			this._internalFileSearchProvider = null;
			this._proxy.$unregisterProvider(handle);
		});
	}

	override $provideFileSearchResults(handle: number, session: number, rawQuery: IRawFileQuery, token: vscode.CancellationToken): Promise<ISearchCompleteStats> {
		const query = reviveQuery(rawQuery);
		if (handle === this._internalFileSearchHandle) {
			const start = Date.now();
			return this.doInternalFileSearch(handle, session, query, token).then(result => {
				const elapsed = Date.now() - start;
				this._logService.debug(`Ext host file search time: ${elapsed}ms`);
				return result;
			});
		}

		return super.$provideFileSearchResults(handle, session, rawQuery, token);
	}

	override async doInternalFileSearchWithCustomCallback(rawQuery: IFileQuery, token: vscode.CancellationToken, handleFileMatch: (data: URI[]) => void): Promise<ISearchCompleteStats> {
		const onResult = (ev: ISerializedSearchProgressItem) => {
			if (isSerializedFileMatch(ev)) {
				ev = [ev];
			}

			if (Array.isArray(ev)) {
				handleFileMatch(ev.map(m => URI.file(m.path)));
				return;
			}

			if (ev.message) {
				this._logService.debug('ExtHostSearch', ev.message);
			}
		};

		if (!this._internalFileSearchProvider) {
			throw new Error('No internal file search handler');
		}
		const numThreads = await this.getNumThreadsCached();
		return <Promise<ISearchCompleteStats>>this._internalFileSearchProvider.doFileSearch(rawQuery, numThreads, onResult, token);
	}

	private async doInternalFileSearch(handle: number, session: number, rawQuery: IFileQuery, token: vscode.CancellationToken): Promise<ISearchCompleteStats> {
		return this.doInternalFileSearchWithCustomCallback(rawQuery, token, (data) => {
			this._proxy.$handleFileMatch(handle, session, data);
		});
	}

	override $clearCache(cacheKey: string): Promise<void> {
		this._internalFileSearchProvider?.clearCache(cacheKey);

		return super.$clearCache(cacheKey);
	}

	protected override createTextSearchManager(query: ITextQuery, provider: vscode.TextSearchProvider2): TextSearchManager {
		return new NativeTextSearchManager(query, provider, undefined, 'textSearchProvider');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/node/extHostStoragePaths.ts]---
Location: vscode-main/src/vs/workbench/api/node/extHostStoragePaths.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import * as path from '../../../base/common/path.js';
import { URI } from '../../../base/common/uri.js';
import { ExtensionStoragePaths as CommonExtensionStoragePaths } from '../common/extHostStoragePaths.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import { IntervalTimer, timeout } from '../../../base/common/async.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { Promises } from '../../../base/node/pfs.js';

export class ExtensionStoragePaths extends CommonExtensionStoragePaths {

	private _workspaceStorageLock: Lock | null = null;

	protected override async _getWorkspaceStorageURI(storageName: string): Promise<URI> {
		const workspaceStorageURI = await super._getWorkspaceStorageURI(storageName);
		if (workspaceStorageURI.scheme !== Schemas.file) {
			return workspaceStorageURI;
		}

		if (this._environment.skipWorkspaceStorageLock) {
			this._logService.info(`Skipping acquiring lock for ${workspaceStorageURI.fsPath}.`);
			return workspaceStorageURI;
		}

		const workspaceStorageBase = workspaceStorageURI.fsPath;
		let attempt = 0;
		do {
			let workspaceStoragePath: string;
			if (attempt === 0) {
				workspaceStoragePath = workspaceStorageBase;
			} else {
				workspaceStoragePath = (
					/[/\\]$/.test(workspaceStorageBase)
						? `${workspaceStorageBase.substr(0, workspaceStorageBase.length - 1)}-${attempt}`
						: `${workspaceStorageBase}-${attempt}`
				);
			}

			await mkdir(workspaceStoragePath);

			const lockfile = path.join(workspaceStoragePath, 'vscode.lock');
			const lock = await tryAcquireLock(this._logService, lockfile, false);
			if (lock) {
				this._workspaceStorageLock = lock;
				process.on('exit', () => {
					lock.dispose();
				});
				return URI.file(workspaceStoragePath);
			}

			attempt++;
		} while (attempt < 10);

		// just give up
		return workspaceStorageURI;
	}

	override onWillDeactivateAll(): void {
		// the lock will be released soon
		this._workspaceStorageLock?.setWillRelease(6000);
	}
}

async function mkdir(dir: string): Promise<void> {
	try {
		await fs.promises.stat(dir);
		return;
	} catch {
		// doesn't exist, that's OK
	}

	try {
		await fs.promises.mkdir(dir, { recursive: true });
	} catch {
	}
}

const MTIME_UPDATE_TIME = 1000; // 1s
const STALE_LOCK_TIME = 10 * 60 * 1000; // 10 minutes

class Lock extends Disposable {

	private readonly _timer: IntervalTimer;

	constructor(
		private readonly logService: ILogService,
		private readonly filename: string
	) {
		super();

		this._timer = this._register(new IntervalTimer());
		this._timer.cancelAndSet(async () => {
			const contents = await readLockfileContents(logService, filename);
			if (!contents || contents.pid !== process.pid) {
				// we don't hold the lock anymore ...
				logService.info(`Lock '${filename}': The lock was lost unexpectedly.`);
				this._timer.cancel();
			}
			try {
				await fs.promises.utimes(filename, new Date(), new Date());
			} catch (err) {
				logService.error(err);
				logService.info(`Lock '${filename}': Could not update mtime.`);
			}
		}, MTIME_UPDATE_TIME);
	}

	public override dispose(): void {
		super.dispose();
		try { fs.unlinkSync(this.filename); } catch (err) { }
	}

	public async setWillRelease(timeUntilReleaseMs: number): Promise<void> {
		this.logService.info(`Lock '${this.filename}': Marking the lockfile as scheduled to be released in ${timeUntilReleaseMs} ms.`);
		try {
			const contents: ILockfileContents = {
				pid: process.pid,
				willReleaseAt: Date.now() + timeUntilReleaseMs
			};
			await Promises.writeFile(this.filename, JSON.stringify(contents), { flag: 'w' });
		} catch (err) {
			this.logService.error(err);
		}
	}
}

/**
 * Attempt to acquire a lock on a directory.
 * This does not use the real `flock`, but uses a file.
 * @returns a disposable if the lock could be acquired or null if it could not.
 */
async function tryAcquireLock(logService: ILogService, filename: string, isSecondAttempt: boolean): Promise<Lock | null> {
	try {
		const contents: ILockfileContents = {
			pid: process.pid,
			willReleaseAt: 0
		};
		await Promises.writeFile(filename, JSON.stringify(contents), { flag: 'wx' });
	} catch (err) {
		logService.error(err);
	}

	// let's see if we got the lock
	const contents = await readLockfileContents(logService, filename);
	if (!contents || contents.pid !== process.pid) {
		// we didn't get the lock
		if (isSecondAttempt) {
			logService.info(`Lock '${filename}': Could not acquire lock, giving up.`);
			return null;
		}
		logService.info(`Lock '${filename}': Could not acquire lock, checking if the file is stale.`);
		return checkStaleAndTryAcquireLock(logService, filename);
	}

	// we got the lock
	logService.info(`Lock '${filename}': Lock acquired.`);
	return new Lock(logService, filename);
}

interface ILockfileContents {
	pid: number;
	willReleaseAt: number | undefined;
}

/**
 * @returns 0 if the pid cannot be read
 */
async function readLockfileContents(logService: ILogService, filename: string): Promise<ILockfileContents | null> {
	let contents: Buffer;
	try {
		contents = await fs.promises.readFile(filename);
	} catch (err) {
		// cannot read the file
		logService.error(err);
		return null;
	}

	try {
		return JSON.parse(String(contents));
	} catch (err) {
		// cannot parse the file
		logService.error(err);
		return null;
	}
}

/**
 * @returns 0 if the mtime cannot be read
 */
async function readmtime(logService: ILogService, filename: string): Promise<number> {
	let stats: fs.Stats;
	try {
		stats = await fs.promises.stat(filename);
	} catch (err) {
		// cannot read the file stats to check if it is stale or not
		logService.error(err);
		return 0;
	}
	return stats.mtime.getTime();
}

function processExists(pid: number): boolean {
	try {
		process.kill(pid, 0); // throws an exception if the process doesn't exist anymore.
		return true;
	} catch (e) {
		return false;
	}
}

async function checkStaleAndTryAcquireLock(logService: ILogService, filename: string): Promise<Lock | null> {
	const contents = await readLockfileContents(logService, filename);
	if (!contents) {
		logService.info(`Lock '${filename}': Could not read pid of lock holder.`);
		return tryDeleteAndAcquireLock(logService, filename);
	}

	if (contents.willReleaseAt) {
		let timeUntilRelease = contents.willReleaseAt - Date.now();
		if (timeUntilRelease < 5000) {
			if (timeUntilRelease > 0) {
				logService.info(`Lock '${filename}': The lockfile is scheduled to be released in ${timeUntilRelease} ms.`);
			} else {
				logService.info(`Lock '${filename}': The lockfile is scheduled to have been released.`);
			}

			while (timeUntilRelease > 0) {
				await timeout(Math.min(100, timeUntilRelease));
				const mtime = await readmtime(logService, filename);
				if (mtime === 0) {
					// looks like the lock was released
					return tryDeleteAndAcquireLock(logService, filename);
				}
				timeUntilRelease = contents.willReleaseAt - Date.now();
			}

			return tryDeleteAndAcquireLock(logService, filename);
		}
	}

	if (!processExists(contents.pid)) {
		logService.info(`Lock '${filename}': The pid ${contents.pid} appears to be gone.`);
		return tryDeleteAndAcquireLock(logService, filename);
	}

	const mtime1 = await readmtime(logService, filename);
	const elapsed1 = Date.now() - mtime1;
	if (elapsed1 <= STALE_LOCK_TIME) {
		// the lock does not look stale
		logService.info(`Lock '${filename}': The lock does not look stale, elapsed: ${elapsed1} ms, giving up.`);
		return null;
	}

	// the lock holder updates the mtime every 1s.
	// let's give it a chance to update the mtime
	// in case of a wake from sleep or something similar
	logService.info(`Lock '${filename}': The lock looks stale, waiting for 2s.`);
	await timeout(2000);

	const mtime2 = await readmtime(logService, filename);
	const elapsed2 = Date.now() - mtime2;
	if (elapsed2 <= STALE_LOCK_TIME) {
		// the lock does not look stale
		logService.info(`Lock '${filename}': The lock does not look stale, elapsed: ${elapsed2} ms, giving up.`);
		return null;
	}

	// the lock looks stale
	logService.info(`Lock '${filename}': The lock looks stale even after waiting for 2s.`);
	return tryDeleteAndAcquireLock(logService, filename);
}

async function tryDeleteAndAcquireLock(logService: ILogService, filename: string): Promise<Lock | null> {
	logService.info(`Lock '${filename}': Deleting a stale lock.`);
	try {
		await fs.promises.unlink(filename);
	} catch (err) {
		// cannot delete the file
		// maybe the file is already deleted
	}
	return tryAcquireLock(logService, filename, true);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/node/extHostTask.ts]---
Location: vscode-main/src/vs/workbench/api/node/extHostTask.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from '../../../base/common/path.js';

import { URI, UriComponents } from '../../../base/common/uri.js';
import { findExecutable } from '../../../base/node/processes.js';
import * as types from '../common/extHostTypes.js';
import { IExtHostWorkspace } from '../common/extHostWorkspace.js';
import type * as vscode from 'vscode';
import * as tasks from '../common/shared/tasks.js';
import { IExtHostDocumentsAndEditors } from '../common/extHostDocumentsAndEditors.js';
import { IExtHostConfiguration } from '../common/extHostConfiguration.js';
import { IWorkspaceFolder, WorkspaceFolder } from '../../../platform/workspace/common/workspace.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { IExtHostTerminalService } from '../common/extHostTerminalService.js';
import { IExtHostRpcService } from '../common/extHostRpcService.js';
import { IExtHostInitDataService } from '../common/extHostInitDataService.js';
import { ExtHostTaskBase, TaskHandleDTO, TaskDTO, CustomExecutionDTO, HandlerData } from '../common/extHostTask.js';
import { Schemas } from '../../../base/common/network.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { IExtHostApiDeprecationService } from '../common/extHostApiDeprecationService.js';
import * as resources from '../../../base/common/resources.js';
import { homedir } from 'os';
import { IExtHostVariableResolverProvider } from '../common/extHostVariableResolverService.js';

export class ExtHostTask extends ExtHostTaskBase {
	constructor(
		@IExtHostRpcService extHostRpc: IExtHostRpcService,
		@IExtHostInitDataService initData: IExtHostInitDataService,
		@IExtHostWorkspace private readonly workspaceService: IExtHostWorkspace,
		@IExtHostDocumentsAndEditors editorService: IExtHostDocumentsAndEditors,
		@IExtHostConfiguration configurationService: IExtHostConfiguration,
		@IExtHostTerminalService extHostTerminalService: IExtHostTerminalService,
		@ILogService logService: ILogService,
		@IExtHostApiDeprecationService deprecationService: IExtHostApiDeprecationService,
		@IExtHostVariableResolverProvider private readonly variableResolver: IExtHostVariableResolverProvider,
	) {
		super(extHostRpc, initData, workspaceService, editorService, configurationService, extHostTerminalService, logService, deprecationService);
		if (initData.remote.isRemote && initData.remote.authority) {
			this.registerTaskSystem(Schemas.vscodeRemote, {
				scheme: Schemas.vscodeRemote,
				authority: initData.remote.authority,
				platform: process.platform
			});
		} else {
			this.registerTaskSystem(Schemas.file, {
				scheme: Schemas.file,
				authority: '',
				platform: process.platform
			});
		}
		this._proxy.$registerSupportedExecutions(true, true, true);
	}

	public async executeTask(extension: IExtensionDescription, task: vscode.Task): Promise<vscode.TaskExecution> {
		const tTask = (task as types.Task);

		if (!task.execution && (tTask._id === undefined)) {
			throw new Error('Tasks to execute must include an execution');
		}

		// We have a preserved ID. So the task didn't change.
		if (tTask._id !== undefined) {
			// Always get the task execution first to prevent timing issues when retrieving it later
			const handleDto = TaskHandleDTO.from(tTask, this.workspaceService);
			const executionDTO = await this._proxy.$getTaskExecution(handleDto);
			if (executionDTO.task === undefined) {
				throw new Error('Task from execution DTO is undefined');
			}
			const execution = await this.getTaskExecution(executionDTO, task);
			this._proxy.$executeTask(handleDto).catch(() => { /* The error here isn't actionable. */ });
			return execution;
		} else {
			const dto = TaskDTO.from(task, extension);
			if (dto === undefined) {
				return Promise.reject(new Error('Task is not valid'));
			}

			// If this task is a custom execution, then we need to save it away
			// in the provided custom execution map that is cleaned up after the
			// task is executed.
			if (CustomExecutionDTO.is(dto.execution)) {
				await this.addCustomExecution(dto, task, false);
			}
			// Always get the task execution first to prevent timing issues when retrieving it later
			const execution = await this.getTaskExecution(await this._proxy.$getTaskExecution(dto), task);
			this._proxy.$executeTask(dto).catch(() => { /* The error here isn't actionable. */ });
			return execution;
		}
	}

	protected provideTasksInternal(validTypes: { [key: string]: boolean }, taskIdPromises: Promise<void>[], handler: HandlerData, value: vscode.Task[] | null | undefined): { tasks: tasks.ITaskDTO[]; extension: IExtensionDescription } {
		const taskDTOs: tasks.ITaskDTO[] = [];
		if (value) {
			for (const task of value) {
				this.checkDeprecation(task, handler);

				if (!task.definition || !validTypes[task.definition.type]) {
					this._logService.warn(`The task [${task.source}, ${task.name}] uses an undefined task type. The task will be ignored in the future.`);
				}

				const taskDTO: tasks.ITaskDTO | undefined = TaskDTO.from(task, handler.extension);
				if (taskDTO) {
					taskDTOs.push(taskDTO);

					if (CustomExecutionDTO.is(taskDTO.execution)) {
						// The ID is calculated on the main thread task side, so, let's call into it here.
						// We need the task id's pre-computed for custom task executions because when OnDidStartTask
						// is invoked, we have to be able to map it back to our data.
						taskIdPromises.push(this.addCustomExecution(taskDTO, task, true));
					}
				}
			}
		}
		return {
			tasks: taskDTOs,
			extension: handler.extension
		};
	}

	protected async resolveTaskInternal(resolvedTaskDTO: tasks.ITaskDTO): Promise<tasks.ITaskDTO | undefined> {
		return resolvedTaskDTO;
	}

	private async getAFolder(workspaceFolders: vscode.WorkspaceFolder[] | undefined): Promise<IWorkspaceFolder> {
		let folder = (workspaceFolders && workspaceFolders.length > 0) ? workspaceFolders[0] : undefined;
		if (!folder) {
			const userhome = URI.file(homedir());
			folder = new WorkspaceFolder({ uri: userhome, name: resources.basename(userhome), index: 0 });
		}
		return {
			uri: folder.uri,
			name: folder.name,
			index: folder.index,
			toResource: () => {
				throw new Error('Not implemented');
			}
		};
	}

	public async $resolveVariables(uriComponents: UriComponents, toResolve: { process?: { name: string; cwd?: string; path?: string }; variables: string[] }): Promise<{ process?: string; variables: { [key: string]: string } }> {
		const uri: URI = URI.revive(uriComponents);
		const result = {
			process: undefined as string | undefined,
			variables: Object.create(null)
		};
		const workspaceFolder = await this._workspaceProvider.resolveWorkspaceFolder(uri);
		const workspaceFolders = (await this._workspaceProvider.getWorkspaceFolders2()) ?? [];

		const resolver = await this.variableResolver.getResolver();
		const ws: IWorkspaceFolder = workspaceFolder ? {
			uri: workspaceFolder.uri,
			name: workspaceFolder.name,
			index: workspaceFolder.index,
			toResource: () => {
				throw new Error('Not implemented');
			}
		} : await this.getAFolder(workspaceFolders);

		for (const variable of toResolve.variables) {
			result.variables[variable] = await resolver.resolveAsync(ws, variable);
		}
		if (toResolve.process !== undefined) {
			let paths: string[] | undefined = undefined;
			if (toResolve.process.path !== undefined) {
				paths = toResolve.process.path.split(path.delimiter);
				for (let i = 0; i < paths.length; i++) {
					paths[i] = await resolver.resolveAsync(ws, paths[i]);
				}
			}
			const processName = await resolver.resolveAsync(ws, toResolve.process.name);
			const cwd = toResolve.process.cwd !== undefined ? await resolver.resolveAsync(ws, toResolve.process.cwd) : undefined;
			const foundExecutable = await findExecutable(processName, cwd, paths);
			if (foundExecutable) {
				result.process = foundExecutable;
			} else if (path.isAbsolute(processName)) {
				result.process = processName;
			} else {
				result.process = path.join(cwd ?? '', processName);
			}
		}
		return result;
	}

	public async $jsonTasksSupported(): Promise<boolean> {
		return true;
	}

	public async $findExecutable(command: string, cwd?: string, paths?: string[]): Promise<string | undefined> {
		return findExecutable(command, cwd, paths);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/node/extHostTerminalService.ts]---
Location: vscode-main/src/vs/workbench/api/node/extHostTerminalService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { generateUuid } from '../../../base/common/uuid.js';
import { IExtHostRpcService } from '../common/extHostRpcService.js';
import { BaseExtHostTerminalService, ExtHostTerminal, ITerminalInternalOptions } from '../common/extHostTerminalService.js';
import type * as vscode from 'vscode';
import { IExtHostCommands } from '../common/extHostCommands.js';

export class ExtHostTerminalService extends BaseExtHostTerminalService {

	constructor(
		@IExtHostCommands extHostCommands: IExtHostCommands,
		@IExtHostRpcService extHostRpc: IExtHostRpcService
	) {
		super(true, extHostCommands, extHostRpc);
	}

	public createTerminal(name?: string, shellPath?: string, shellArgs?: string[] | string): vscode.Terminal {
		return this.createTerminalFromOptions({ name, shellPath, shellArgs });
	}

	public createTerminalFromOptions(options: vscode.TerminalOptions, internalOptions?: ITerminalInternalOptions): vscode.Terminal {
		const terminal = new ExtHostTerminal(this._proxy, generateUuid(), options, options.name);
		this._terminals.push(terminal);
		terminal.create(options, this._serializeParentTerminal(options, internalOptions));
		return terminal.value;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/node/extHostTunnelService.ts]---
Location: vscode-main/src/vs/workbench/api/node/extHostTunnelService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import { exec } from 'child_process';
import { VSBuffer } from '../../../base/common/buffer.js';
import { Emitter } from '../../../base/common/event.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { MovingAverage } from '../../../base/common/numbers.js';
import { isLinux } from '../../../base/common/platform.js';
import * as resources from '../../../base/common/resources.js';
import { URI } from '../../../base/common/uri.js';
import * as pfs from '../../../base/node/pfs.js';
import { ISocket, SocketCloseEventType } from '../../../base/parts/ipc/common/ipc.net.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { ManagedSocket, RemoteSocketHalf, connectManagedSocket } from '../../../platform/remote/common/managedSocket.js';
import { ManagedRemoteConnection } from '../../../platform/remote/common/remoteAuthorityResolver.js';
import { ISignService } from '../../../platform/sign/common/sign.js';
import { isAllInterfaces, isLocalhost } from '../../../platform/tunnel/common/tunnel.js';
import { NodeRemoteTunnel } from '../../../platform/tunnel/node/tunnelService.js';
import { IExtHostInitDataService } from '../common/extHostInitDataService.js';
import { IExtHostRpcService } from '../common/extHostRpcService.js';
import { ExtHostTunnelService } from '../common/extHostTunnelService.js';
import { CandidatePort, parseAddress } from '../../services/remote/common/tunnelModel.js';
import * as vscode from 'vscode';
import { IExtHostConfiguration } from '../common/extHostConfiguration.js';

export function getSockets(stdout: string): Record<string, { pid: number; socket: number }> {
	const lines = stdout.trim().split('\n');
	const mapped: { pid: number; socket: number }[] = [];
	lines.forEach(line => {
		const match = /\/proc\/(\d+)\/fd\/\d+ -> socket:\[(\d+)\]/.exec(line)!;
		if (match && match.length >= 3) {
			mapped.push({
				pid: parseInt(match[1], 10),
				socket: parseInt(match[2], 10)
			});
		}
	});
	const socketMap = mapped.reduce((m: Record<string, typeof mapped[0]>, socket) => {
		m[socket.socket] = socket;
		return m;
	}, {});
	return socketMap;
}

export function loadListeningPorts(...stdouts: string[]): { socket: number; ip: string; port: number }[] {
	const table = ([] as Record<string, string>[]).concat(...stdouts.map(loadConnectionTable));
	return [
		...new Map(
			table.filter(row => row.st === '0A')
				.map(row => {
					const address = row.local_address.split(':');
					return {
						socket: parseInt(row.inode, 10),
						ip: parseIpAddress(address[0]),
						port: parseInt(address[1], 16)
					};
				}).map(port => [port.ip + ':' + port.port, port])
		).values()
	];
}

export function parseIpAddress(hex: string): string {
	let result = '';
	if (hex.length === 8) {
		for (let i = hex.length - 2; i >= 0; i -= 2) {
			result += parseInt(hex.substr(i, 2), 16);
			if (i !== 0) {
				result += '.';
			}
		}
	} else {
		// Nice explanation of host format in tcp6 file: https://serverfault.com/questions/592574/why-does-proc-net-tcp6-represents-1-as-1000
		for (let i = 0; i < hex.length; i += 8) {
			const word = hex.substring(i, i + 8);
			let subWord = '';
			for (let j = 8; j >= 2; j -= 2) {
				subWord += word.substring(j - 2, j);
				if ((j === 6) || (j === 2)) {
					// Trim leading zeros
					subWord = parseInt(subWord, 16).toString(16);
					result += `${subWord}`;
					subWord = '';
					if (i + j !== hex.length - 6) {
						result += ':';
					}
				}
			}
		}
	}
	return result;
}

export function loadConnectionTable(stdout: string): Record<string, string>[] {
	const lines = stdout.trim().split('\n');
	const names = lines.shift()!.trim().split(/\s+/)
		.filter(name => name !== 'rx_queue' && name !== 'tm->when');
	const table = lines.map(line => line.trim().split(/\s+/).reduce((obj: Record<string, string>, value, i) => {
		obj[names[i] || i] = value;
		return obj;
	}, {}));
	return table;
}

function knownExcludeCmdline(command: string): boolean {
	if (command.length > 500) {
		return false;
	}
	return !!command.match(/.*\.vscode-server-[a-zA-Z]+\/bin.*/)
		|| (command.indexOf('out/server-main.js') !== -1)
		|| (command.indexOf('_productName=VSCode') !== -1);
}

export function getRootProcesses(stdout: string) {
	const lines = stdout.trim().split('\n');
	const mapped: { pid: number; cmd: string; ppid: number }[] = [];
	lines.forEach(line => {
		const match = /^\d+\s+\D+\s+root\s+(\d+)\s+(\d+).+\d+\:\d+\:\d+\s+(.+)$/.exec(line)!;
		if (match && match.length >= 4) {
			mapped.push({
				pid: parseInt(match[1], 10),
				ppid: parseInt(match[2]),
				cmd: match[3]
			});
		}
	});
	return mapped;
}

export async function findPorts(connections: { socket: number; ip: string; port: number }[], socketMap: Record<string, { pid: number; socket: number }>, processes: { pid: number; cwd: string; cmd: string }[]): Promise<CandidatePort[]> {
	const processMap = processes.reduce((m: Record<string, typeof processes[0]>, process) => {
		m[process.pid] = process;
		return m;
	}, {});

	const ports: CandidatePort[] = [];
	connections.forEach(({ socket, ip, port }) => {
		const pid = socketMap[socket] ? socketMap[socket].pid : undefined;
		const command: string | undefined = pid ? processMap[pid]?.cmd : undefined;
		if (pid && command && !knownExcludeCmdline(command)) {
			ports.push({ host: ip, port, detail: command, pid });
		}
	});
	return ports;
}

export function tryFindRootPorts(connections: { socket: number; ip: string; port: number }[], rootProcessesStdout: string, previousPorts: Map<number, CandidatePort & { ppid: number }>): Map<number, CandidatePort & { ppid: number }> {
	const ports: Map<number, CandidatePort & { ppid: number }> = new Map();
	const rootProcesses = getRootProcesses(rootProcessesStdout);

	for (const connection of connections) {
		const previousPort = previousPorts.get(connection.port);
		if (previousPort) {
			ports.set(connection.port, previousPort);
			continue;
		}
		const rootProcessMatch = rootProcesses.find((value) => value.cmd.includes(`${connection.port}`));
		if (rootProcessMatch) {
			let bestMatch = rootProcessMatch;
			// There are often several processes that "look" like they could match the port.
			// The one we want is usually the child of the other. Find the most child process.
			let mostChild: { pid: number; cmd: string; ppid: number } | undefined;
			do {
				mostChild = rootProcesses.find(value => value.ppid === bestMatch.pid);
				if (mostChild) {
					bestMatch = mostChild;
				}
			} while (mostChild);
			ports.set(connection.port, { host: connection.ip, port: connection.port, pid: bestMatch.pid, detail: bestMatch.cmd, ppid: bestMatch.ppid });
		} else {
			ports.set(connection.port, { host: connection.ip, port: connection.port, ppid: Number.MAX_VALUE });
		}
	}

	return ports;
}

export class NodeExtHostTunnelService extends ExtHostTunnelService {
	private _initialCandidates: CandidatePort[] | undefined = undefined;
	private _foundRootPorts: Map<number, CandidatePort & { ppid: number }> = new Map();
	private _candidateFindingEnabled: boolean = false;

	constructor(
		@IExtHostRpcService extHostRpc: IExtHostRpcService,
		@IExtHostInitDataService private readonly initData: IExtHostInitDataService,
		@ILogService logService: ILogService,
		@ISignService private readonly signService: ISignService,
		@IExtHostConfiguration private readonly configurationService: IExtHostConfiguration,
	) {
		super(extHostRpc, initData, logService);
		if (isLinux && initData.remote.isRemote && initData.remote.authority) {
			this._proxy.$setRemoteTunnelService(process.pid);
			this.setInitialCandidates();
		}
	}

	override async $registerCandidateFinder(enable: boolean): Promise<void> {
		if (enable && this._candidateFindingEnabled) {
			// already enabled
			return;
		}

		this._candidateFindingEnabled = enable;
		let oldPorts: { host: string; port: number; detail?: string }[] | undefined = undefined;

		// If we already have found initial candidates send those immediately.
		if (this._initialCandidates) {
			oldPorts = this._initialCandidates;
			await this._proxy.$onFoundNewCandidates(this._initialCandidates);
		}

		// Regularly scan to see if the candidate ports have changed.
		const movingAverage = new MovingAverage();
		let scanCount = 0;
		while (this._candidateFindingEnabled) {
			const startTime = new Date().getTime();
			const newPorts = (await this.findCandidatePorts()).filter(candidate => (isLocalhost(candidate.host) || isAllInterfaces(candidate.host)));
			this.logService.trace(`ForwardedPorts: (ExtHostTunnelService) found candidate ports ${newPorts.map(port => port.port).join(', ')}`);
			const timeTaken = new Date().getTime() - startTime;
			this.logService.trace(`ForwardedPorts: (ExtHostTunnelService) candidate port scan took ${timeTaken} ms.`);
			// Do not count the first few scans towards the moving average as they are likely to be slower.
			if (scanCount++ > 3) {
				movingAverage.update(timeTaken);
			}
			if (!oldPorts || (JSON.stringify(oldPorts) !== JSON.stringify(newPorts))) {
				oldPorts = newPorts;
				await this._proxy.$onFoundNewCandidates(oldPorts);
			}
			const delay = this.calculateDelay(movingAverage.value);
			this.logService.trace(`ForwardedPorts: (ExtHostTunnelService) next candidate port scan in ${delay} ms.`);
			await (new Promise<void>(resolve => setTimeout(() => resolve(), delay)));
		}
	}

	private calculateDelay(movingAverage: number) {
		// Some local testing indicated that the moving average might be between 50-100 ms.
		return Math.max(movingAverage * 20, 2000);
	}

	private async setInitialCandidates(): Promise<void> {
		this._initialCandidates = await this.findCandidatePorts();
		this.logService.trace(`ForwardedPorts: (ExtHostTunnelService) Initial candidates found: ${this._initialCandidates.map(c => c.port).join(', ')}`);
	}

	private async findCandidatePorts(): Promise<CandidatePort[]> {
		let tcp: string = '';
		let tcp6: string = '';
		try {
			tcp = await fs.promises.readFile('/proc/net/tcp', 'utf8');
			tcp6 = await fs.promises.readFile('/proc/net/tcp6', 'utf8');
		} catch (e) {
			// File reading error. No additional handling needed.
		}
		const connections: { socket: number; ip: string; port: number }[] = loadListeningPorts(tcp, tcp6);

		const procSockets: string = await (new Promise(resolve => {
			exec('ls -l /proc/[0-9]*/fd/[0-9]* | grep socket:', (error, stdout, stderr) => {
				resolve(stdout);
			});
		}));
		const socketMap = getSockets(procSockets);

		const procChildren = await pfs.Promises.readdir('/proc');
		const processes: {
			pid: number; cwd: string; cmd: string;
		}[] = [];
		for (const childName of procChildren) {
			try {
				const pid: number = Number(childName);
				const childUri = resources.joinPath(URI.file('/proc'), childName);
				const childStat = await fs.promises.stat(childUri.fsPath);
				if (childStat.isDirectory() && !isNaN(pid)) {
					const cwd = await fs.promises.readlink(resources.joinPath(childUri, 'cwd').fsPath);
					const cmd = await fs.promises.readFile(resources.joinPath(childUri, 'cmdline').fsPath, 'utf8');
					processes.push({ pid, cwd, cmd });
				}
			} catch (e) {
				//
			}
		}

		const unFoundConnections: { socket: number; ip: string; port: number }[] = [];
		const filteredConnections = connections.filter((connection => {
			const foundConnection = socketMap[connection.socket];
			if (!foundConnection) {
				unFoundConnections.push(connection);
			}
			return foundConnection;
		}));

		const foundPorts = findPorts(filteredConnections, socketMap, processes);
		let heuristicPorts: CandidatePort[] | undefined;
		this.logService.trace(`ForwardedPorts: (ExtHostTunnelService) number of possible root ports ${unFoundConnections.length}`);
		if (unFoundConnections.length > 0) {
			const rootProcesses: string = await (new Promise(resolve => {
				exec('ps -F -A -l | grep root', (error, stdout, stderr) => {
					resolve(stdout);
				});
			}));
			this._foundRootPorts = tryFindRootPorts(unFoundConnections, rootProcesses, this._foundRootPorts);
			heuristicPorts = Array.from(this._foundRootPorts.values());
			this.logService.trace(`ForwardedPorts: (ExtHostTunnelService) heuristic ports ${heuristicPorts.map(heuristicPort => heuristicPort.port).join(', ')}`);

		}
		return foundPorts.then(foundCandidates => {
			if (heuristicPorts) {
				return foundCandidates.concat(heuristicPorts);
			} else {
				return foundCandidates;
			}
		});
	}

	private async defaultTunnelHost(): Promise<string> {
		const settingValue = (await this.configurationService.getConfigProvider()).getConfiguration('remote').get('localPortHost');
		return (!settingValue || settingValue === 'localhost') ? '127.0.0.1' : '0.0.0.0';
	}

	protected override makeManagedTunnelFactory(authority: vscode.ManagedResolvedAuthority): vscode.RemoteAuthorityResolver['tunnelFactory'] {
		return async (tunnelOptions) => {
			const t = new NodeRemoteTunnel(
				{
					commit: this.initData.commit,
					quality: this.initData.quality,
					logService: this.logService,
					ipcLogger: null,
					// services and address providers have stubs since we don't need
					// the connection identification that the renderer process uses
					remoteSocketFactoryService: {
						_serviceBrand: undefined,
						async connect(_connectTo: ManagedRemoteConnection, path: string, query: string, debugLabel: string): Promise<ISocket> {
							const result = await authority.makeConnection();
							return ExtHostManagedSocket.connect(result, path, query, debugLabel);
						},
						register() {
							throw new Error('not implemented');
						},
					},
					addressProvider: {
						getAddress() {
							return Promise.resolve({
								connectTo: new ManagedRemoteConnection(0),
								connectionToken: authority.connectionToken,
							});
						},
					},
					signService: this.signService,
				},
				await this.defaultTunnelHost(),
				tunnelOptions.remoteAddress.host || 'localhost',
				tunnelOptions.remoteAddress.port,
				tunnelOptions.localAddressPort,
			);

			await t.waitForReady();

			const disposeEmitter = new Emitter<void>();

			return {
				localAddress: parseAddress(t.localAddress) ?? t.localAddress,
				remoteAddress: { port: t.tunnelRemotePort, host: t.tunnelRemoteHost },
				onDidDispose: disposeEmitter.event,
				dispose: () => {
					t.dispose();
					disposeEmitter.fire();
					disposeEmitter.dispose();
				},
			};
		};
	}
}

class ExtHostManagedSocket extends ManagedSocket {
	public static connect(
		passing: vscode.ManagedMessagePassing,
		path: string, query: string, debugLabel: string,
	): Promise<ExtHostManagedSocket> {
		const d = new DisposableStore();
		const half: RemoteSocketHalf = {
			onClose: d.add(new Emitter()),
			onData: d.add(new Emitter()),
			onEnd: d.add(new Emitter()),
		};

		d.add(passing.onDidReceiveMessage(d => half.onData.fire(VSBuffer.wrap(d))));
		d.add(passing.onDidEnd(() => half.onEnd.fire()));
		d.add(passing.onDidClose(error => half.onClose.fire({
			type: SocketCloseEventType.NodeSocketCloseEvent,
			error,
			hadError: !!error
		})));

		const socket = new ExtHostManagedSocket(passing, debugLabel, half);
		socket._register(d);
		return connectManagedSocket(socket, path, query, debugLabel, half);
	}

	constructor(
		private readonly passing: vscode.ManagedMessagePassing,
		debugLabel: string,
		half: RemoteSocketHalf,
	) {
		super(debugLabel, half);
	}

	public override write(buffer: VSBuffer): void {
		this.passing.send(buffer.buffer);
	}
	protected override closeRemote(): void {
		this.passing.end();
	}

	public override async drain(): Promise<void> {
		await this.passing.drain?.();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/node/extHostVariableResolverService.ts]---
Location: vscode-main/src/vs/workbench/api/node/extHostVariableResolverService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { homedir } from 'os';
import { ExtHostVariableResolverProviderService } from '../common/extHostVariableResolverService.js';

export class NodeExtHostVariableResolverProviderService extends ExtHostVariableResolverProviderService {
	protected override homeDir(): string | undefined {
		return homedir();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/node/loopbackServer.ts]---
Location: vscode-main/src/vs/workbench/api/node/loopbackServer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { randomBytes } from 'crypto';
import * as http from 'http';
import { URL } from 'url';
import { DeferredPromise } from '../../../base/common/async.js';
import { DEFAULT_AUTH_FLOW_PORT } from '../../../base/common/oauth.js';
import { URI } from '../../../base/common/uri.js';
import { ILogger } from '../../../platform/log/common/log.js';

export interface IOAuthResult {
	code: string;
	state: string;
}

export interface ILoopbackServer {
	/**
	 * The state parameter used in the OAuth flow.
	 */
	readonly state: string;

	/**
	 * Starts the server.
	 * @throws If the server fails to start.
	 * @throws If the server is already started.
	 */
	start(): Promise<void>;

	/**
	 * Stops the server.
	 * @throws If the server is not started.
	 * @throws If the server fails to stop.
	 */
	stop(): Promise<void>;

	/**
	 * Returns a promise that resolves to the result of the OAuth flow.
	 */
	waitForOAuthResponse(): Promise<IOAuthResult>;
}

export class LoopbackAuthServer implements ILoopbackServer {
	private readonly _server: http.Server;
	private readonly _resultPromise: Promise<IOAuthResult>;

	private _state = randomBytes(16).toString('base64');
	private _port: number | undefined;

	constructor(
		private readonly _logger: ILogger,
		private readonly _appUri: URI,
		private readonly _appName: string
	) {
		const deferredPromise = new DeferredPromise<IOAuthResult>();
		this._resultPromise = deferredPromise.p;

		this._server = http.createServer((req, res) => {
			const reqUrl = new URL(req.url!, `http://${req.headers.host}`);
			switch (reqUrl.pathname) {
				case '/': {
					const code = reqUrl.searchParams.get('code') ?? undefined;
					const state = reqUrl.searchParams.get('state') ?? undefined;
					const error = reqUrl.searchParams.get('error') ?? undefined;
					if (error) {
						res.writeHead(302, { location: `/done?error=${reqUrl.searchParams.get('error_description') || error}` });
						res.end();
						deferredPromise.error(new Error(error));
						break;
					}
					if (!code || !state) {
						res.writeHead(400);
						res.end();
						break;
					}
					if (this.state !== state) {
						res.writeHead(302, { location: `/done?error=${encodeURIComponent('State does not match.')}` });
						res.end();
						deferredPromise.error(new Error('State does not match.'));
						break;
					}
					deferredPromise.complete({ code, state });
					res.writeHead(302, { location: '/done' });
					res.end();
					break;
				}
				// Serve the static files
				case '/done':
					this._sendPage(res);
					break;
				default:
					res.writeHead(404);
					res.end();
					break;
			}
		});
	}

	get state(): string { return this._state; }
	get redirectUri(): string {
		if (this._port === undefined) {
			throw new Error('Server is not started yet');
		}
		return `http://127.0.0.1:${this._port}/`;
	}

	private _sendPage(res: http.ServerResponse): void {
		const html = this.getHtml();
		res.writeHead(200, {
			'Content-Type': 'text/html',
			'Content-Length': Buffer.byteLength(html, 'utf8')
		});
		res.end(html);
	}

	start(): Promise<void> {
		const deferredPromise = new DeferredPromise<void>();
		if (this._server.listening) {
			throw new Error('Server is already started');
		}
		const portTimeout = setTimeout(() => {
			deferredPromise.error(new Error('Timeout waiting for port'));
		}, 5000);
		this._server.on('listening', () => {
			const address = this._server.address();
			if (typeof address === 'string') {
				this._port = parseInt(address);
			} else if (address instanceof Object) {
				this._port = address.port;
			} else {
				throw new Error('Unable to determine port');
			}

			clearTimeout(portTimeout);
			deferredPromise.complete();
		});
		this._server.on('error', err => {
			if ('code' in err && err.code === 'EADDRINUSE') {
				this._logger.error('Address in use, retrying with a different port...');
				// Best effort to use a specific port, but fallback to a random one if it is in use
				this._server.listen(0, '127.0.0.1');
				return;
			}
			clearTimeout(portTimeout);
			deferredPromise.error(new Error(`Error listening to server: ${err}`));
		});
		this._server.on('close', () => {
			deferredPromise.error(new Error('Closed'));
		});
		// Best effort to use a specific port, but fallback to a random one if it is in use
		this._server.listen(DEFAULT_AUTH_FLOW_PORT, '127.0.0.1');
		return deferredPromise.p;
	}

	stop(): Promise<void> {
		const deferredPromise = new DeferredPromise<void>();
		if (!this._server.listening) {
			deferredPromise.complete();
			return deferredPromise.p;
		}
		this._server.close((err) => {
			if (err) {
				deferredPromise.error(err);
			} else {
				deferredPromise.complete();
			}
		});
		// If the server is not closed within 5 seconds, reject the promise
		setTimeout(() => {
			if (!deferredPromise.isResolved) {
				deferredPromise.error(new Error('Timeout waiting for server to close'));
			}
		}, 5000);
		return deferredPromise.p;
	}

	waitForOAuthResponse(): Promise<IOAuthResult> {
		return this._resultPromise;
	}

	getHtml(): string {
		// TODO: Bring this in via mixin. Skipping exploration for now.
		let backgroundImage = 'url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAQABAMAAACNMzawAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAJ1BMVEUAAAD///9Qm8+ozed8tNsWer+Lvd9trNfF3u9Ck8slgsMzi8eZxeM/Qa6mAAAAAXRSTlMAQObYZgAAAAFiS0dEAf8CLd4AAAAHdElNRQfiCwYULRt0g+ZLAAAJRUlEQVR42u3SUY0CQRREUSy0hSZtBA+wfOwv4wAPYwAJSMAfAthkB6YD79HnKqikzmYjSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIk6cmKhg4AAASAABAAAkAACAABIAAEgAAQAAJAAAgAAaBvBVAjtV2wfFe1ogcA+0gdFgBoe60IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnAjAP/1MkWoAvBvAsUTqBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJAAgAASAABIAAEAACQAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKA7gDlbFwC6AijZagAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQDM2boA0BXAqAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIATARAAAkAAvF7N1hWArgBKthoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfBrAlK0bAF0BjBoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4EQABIAAEwOtN2boB0BVAyVYDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgE8DqNm6AtAVwKgBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAEwEQAAJAAPzd7xypMwDvBnAskToBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAIAAkAACAABIAAEgAAQAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBKBGarsAwK5qRQ8ANGYAACAABIAAEAACQAAIAAEgAASAABAAAkDfCUCSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJC3uDtO80OSql+i8AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTExLTA2VDIwOjQ1OjI3KzAwOjAwEjLurQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0xMS0wNlQyMDo0NToyNyswMDowMGNvVhEAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC\')';
		if (this._appName === 'Visual Studio Code') {
			backgroundImage = 'url(\'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxtYXNrIGlkPSJtYXNrMCIgbWFzay10eXBlPSJhbHBoYSIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE4MS41MzQgMjU0LjI1MkMxODUuNTY2IDI1NS44MjMgMTkwLjE2NCAyNTUuNzIyIDE5NC4yMzQgMjUzLjc2NEwyNDYuOTQgMjI4LjQwM0MyNTIuNDc4IDIyNS43MzggMjU2IDIyMC4xMzIgMjU2IDIxMy45ODNWNDIuMDE4MUMyNTYgMzUuODY4OSAyNTIuNDc4IDMwLjI2MzggMjQ2Ljk0IDI3LjU5ODhMMTk0LjIzNCAyLjIzNjgxQzE4OC44OTMgLTAuMzMzMTMyIDE4Mi42NDIgMC4yOTYzNDQgMTc3Ljk1NSAzLjcwNDE4QzE3Ny4yODUgNC4xOTEgMTc2LjY0NyA0LjczNDU0IDE3Ni4wNDkgNS4zMzM1NEw3NS4xNDkgOTcuMzg2MkwzMS4xOTkyIDY0LjAyNDdDMjcuMTA3OSA2MC45MTkxIDIxLjM4NTMgNjEuMTczNSAxNy41ODU1IDY0LjYzTDMuNDg5MzYgNzcuNDUyNUMtMS4xNTg1MyA4MS42ODA1IC0xLjE2Mzg2IDg4Ljk5MjYgMy40Nzc4NSA5My4yMjc0TDQxLjU5MjYgMTI4TDMuNDc3ODUgMTYyLjc3M0MtMS4xNjM4NiAxNjcuMDA4IC0xLjE1ODUzIDE3NC4zMiAzLjQ4OTM2IDE3OC41NDhMMTcuNTg1NSAxOTEuMzdDMjEuMzg1MyAxOTQuODI3IDI3LjEwNzkgMTk1LjA4MSAzMS4xOTkyIDE5MS45NzZMNzUuMTQ5IDE1OC42MTRMMTc2LjA0OSAyNTAuNjY3QzE3Ny42NDUgMjUyLjI2NCAxNzkuNTE5IDI1My40NjcgMTgxLjUzNCAyNTQuMjUyWk0xOTIuMDM5IDY5Ljg4NTNMMTE1LjQ3OSAxMjhMMTkyLjAzOSAxODYuMTE1VjY5Ljg4NTNaIiBmaWxsPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazApIj4KPHBhdGggZD0iTTI0Ni45NCAyNy42MzgzTDE5NC4xOTMgMi4yNDEzOEMxODguMDg4IC0wLjY5ODMwMiAxODAuNzkxIDAuNTQxNzIxIDE3NS45OTkgNS4zMzMzMkwzLjMyMzcxIDE2Mi43NzNDLTEuMzIwODIgMTY3LjAwOCAtMS4zMTU0OCAxNzQuMzIgMy4zMzUyMyAxNzguNTQ4TDE3LjQzOTkgMTkxLjM3QzIxLjI0MjEgMTk0LjgyNyAyNi45NjgyIDE5NS4wODEgMzEuMDYxOSAxOTEuOTc2TDIzOS4wMDMgMzQuMjI2OUMyNDUuOTc5IDI4LjkzNDcgMjU1Ljk5OSAzMy45MTAzIDI1NS45OTkgNDIuNjY2N1Y0Mi4wNTQzQzI1NS45OTkgMzUuOTA3OCAyNTIuNDc4IDMwLjMwNDcgMjQ2Ljk0IDI3LjYzODNaIiBmaWxsPSIjMDA2NUE5Ii8+CjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIwX2QpIj4KPHBhdGggZD0iTTI0Ni45NCAyMjguMzYyTDE5NC4xOTMgMjUzLjc1OUMxODguMDg4IDI1Ni42OTggMTgwLjc5MSAyNTUuNDU4IDE3NS45OTkgMjUwLjY2N0wzLjMyMzcxIDkzLjIyNzJDLTEuMzIwODIgODguOTkyNSAtMS4zMTU0OCA4MS42ODAyIDMuMzM1MjMgNzcuNDUyM0wxNy40Mzk5IDY0LjYyOThDMjEuMjQyMSA2MS4xNzMzIDI2Ljk2ODIgNjAuOTE4OCAzMS4wNjE5IDY0LjAyNDVMMjM5LjAwMyAyMjEuNzczQzI0NS45NzkgMjI3LjA2NSAyNTUuOTk5IDIyMi4wOSAyNTUuOTk5IDIxMy4zMzNWMjEzLjk0NkMyNTUuOTk5IDIyMC4wOTIgMjUyLjQ3OCAyMjUuNjk1IDI0Ni45NCAyMjguMzYyWiIgZmlsbD0iIzAwN0FDQyIvPgo8L2c+CjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIxX2QpIj4KPHBhdGggZD0iTTE5NC4xOTYgMjUzLjc2M0MxODguMDg5IDI1Ni43IDE4MC43OTIgMjU1LjQ1OSAxNzYgMjUwLjY2N0MxODEuOTA0IDI1Ni41NzEgMTkyIDI1Mi4zODkgMTkyIDI0NC4wMzlWMTEuOTYwNkMxOTIgMy42MTA1NyAxODEuOTA0IC0wLjU3MTE3NSAxNzYgNS4zMzMyMUMxODAuNzkyIDAuNTQxMTY2IDE4OC4wODkgLTAuNzAwNjA3IDE5NC4xOTYgMi4yMzY0OEwyNDYuOTM0IDI3LjU5ODVDMjUyLjQ3NiAzMC4yNjM1IDI1NiAzNS44Njg2IDI1NiA0Mi4wMTc4VjIxMy45ODNDMjU2IDIyMC4xMzIgMjUyLjQ3NiAyMjUuNzM3IDI0Ni45MzQgMjI4LjQwMkwxOTQuMTk2IDI1My43NjNaIiBmaWxsPSIjMUY5Q0YwIi8+CjwvZz4KPGcgc3R5bGU9Im1peC1ibGVuZC1tb2RlOm92ZXJsYXkiIG9wYWNpdHk9IjAuMjUiPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE4MS4zNzggMjU0LjI1MkMxODUuNDEgMjU1LjgyMiAxOTAuMDA4IDI1NS43MjIgMTk0LjA3NyAyNTMuNzY0TDI0Ni43ODMgMjI4LjQwMkMyNTIuMzIyIDIyNS43MzcgMjU1Ljg0NCAyMjAuMTMyIDI1NS44NDQgMjEzLjk4M1Y0Mi4wMTc5QzI1NS44NDQgMzUuODY4NyAyNTIuMzIyIDMwLjI2MzYgMjQ2Ljc4NCAyNy41OTg2TDE5NC4wNzcgMi4yMzY2NUMxODguNzM3IC0wLjMzMzI5OSAxODIuNDg2IDAuMjk2MTc3IDE3Ny43OTggMy43MDQwMUMxNzcuMTI5IDQuMTkwODMgMTc2LjQ5MSA0LjczNDM3IDE3NS44OTIgNS4zMzMzN0w3NC45OTI3IDk3LjM4NkwzMS4wNDI5IDY0LjAyNDVDMjYuOTUxNyA2MC45MTg5IDIxLjIyOSA2MS4xNzM0IDE3LjQyOTIgNjQuNjI5OEwzLjMzMzExIDc3LjQ1MjNDLTEuMzE0NzggODEuNjgwMyAtMS4zMjAxMSA4OC45OTI1IDMuMzIxNiA5My4yMjczTDQxLjQzNjQgMTI4TDMuMzIxNiAxNjIuNzczQy0xLjMyMDExIDE2Ny4wMDggLTEuMzE0NzggMTc0LjMyIDMuMzMzMTEgMTc4LjU0OEwxNy40MjkyIDE5MS4zN0MyMS4yMjkgMTk0LjgyNyAyNi45NTE3IDE5NS4wODEgMzEuMDQyOSAxOTEuOTc2TDc0Ljk5MjcgMTU4LjYxNEwxNzUuODkyIDI1MC42NjdDMTc3LjQ4OCAyNTIuMjY0IDE3OS4zNjMgMjUzLjQ2NyAxODEuMzc4IDI1NC4yNTJaTTE5MS44ODMgNjkuODg1MUwxMTUuMzIzIDEyOEwxOTEuODgzIDE4Ni4xMTVWNjkuODg1MVoiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcikiLz4KPC9nPgo8L2c+CjxkZWZzPgo8ZmlsdGVyIGlkPSJmaWx0ZXIwX2QiIHg9Ii0yMS40ODk2IiB5PSI0MC41MjI1IiB3aWR0aD0iMjk4LjgyMiIgaGVpZ2h0PSIyMzYuMTQ5IiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CjxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIi8+CjxmZU9mZnNldC8+CjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEwLjY2NjciLz4KPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMjUgMCIvPgo8ZmVCbGVuZCBtb2RlPSJvdmVybGF5IiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJlZmZlY3QxX2Ryb3BTaGFkb3ciLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3ciIHJlc3VsdD0ic2hhcGUiLz4KPC9maWx0ZXI+CjxmaWx0ZXIgaWQ9ImZpbHRlcjFfZCIgeD0iMTU0LjY2NyIgeT0iLTIwLjY3MzUiIHdpZHRoPSIxMjIuNjY3IiBoZWlnaHQ9IjI5Ny4zNDciIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiLz4KPGZlT2Zmc2V0Lz4KPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMTAuNjY2NyIvPgo8ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC4yNSAwIi8+CjxmZUJsZW5kIG1vZGU9Im92ZXJsYXkiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvdyIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9ImVmZmVjdDFfZHJvcFNoYWRvdyIgcmVzdWx0PSJzaGFwZSIvPgo8L2ZpbHRlcj4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyIiB4MT0iMTI3Ljg0NCIgeTE9IjAuNjU5OTg4IiB4Mj0iMTI3Ljg0NCIgeTI9IjI1NS4zNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSJ3aGl0ZSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IndoaXRlIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K\')';
		} else if (this._appName === 'Visual Studio Code - Insiders') {
			backgroundImage = 'url(\'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxtYXNrIGlkPSJtYXNrMCIgbWFzay10eXBlPSJhbHBoYSIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiPgo8cGF0aCBkPSJNMTc2LjA0OSAyNTAuNjY5QzE4MC44MzggMjU1LjQ1OSAxODguMTMgMjU2LjcgMTk0LjIzNCAyNTMuNzY0TDI0Ni45NCAyMjguNDE5QzI1Mi40NzggMjI1Ljc1NSAyNTYgMjIwLjE1NCAyNTYgMjE0LjAwOFY0Mi4xNDc5QzI1NiAzNi4wMDI1IDI1Mi40NzggMzAuNDAwOCAyNDYuOTQgMjcuNzM3NEwxOTQuMjM0IDIuMzkwODlDMTg4LjEzIC0wLjU0NDQxNiAxODAuODM4IDAuNjk2NjA3IDE3Ni4wNDkgNS40ODU3MkMxODEuOTUgLTAuNDE1MDYgMTkyLjAzOSAzLjc2NDEzIDE5Mi4wMzkgMTIuMTA5MVYyNDQuMDQ2QzE5Mi4wMzkgMjUyLjM5MSAxODEuOTUgMjU2LjU3IDE3Ni4wNDkgMjUwLjY2OVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xODEuMzc5IDE4MC42NDZMMTE0LjMzIDEyOC42MzNMMTgxLjM3OSA3NS41MTE0VjE3Ljc5NEMxODEuMzc5IDEwLjg0NzcgMTczLjEyOCA3LjIwNjczIDE2Ny45OTYgMTEuODg2Mkw3NC42NTE0IDk3Ljg1MThMMzEuMTk5NCA2NC4xNDM4QzI3LjEwODEgNjEuMDM5IDIxLjM4NTEgNjEuMjk0IDE3LjU4NTMgNjQuNzQ3NkwzLjQ4OTc0IDc3LjU2MjdDLTEuMTU4NDcgODEuNzg5MyAtMS4xNjM2NyA4OS4wOTQ4IDMuNDc2NzIgOTMuMzI5MkwxNjcuOTggMjQ0LjE4NUMxNzMuMTA3IDI0OC44ODcgMTgxLjM3OSAyNDUuMjQ5IDE4MS4zNzkgMjM4LjI5MlYxODAuNjQ2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTM2LjY5MzcgMTM0LjE5NUwzLjQ3NjcyIDE2Mi44MjhDLTEuMTYzNjcgMTY3LjA2MiAtMS4xNTg0NyAxNzQuMzcgMy40ODk3NCAxNzguNTk0TDE3LjU4NTMgMTkxLjQwOUMyMS4zODUxIDE5NC44NjMgMjcuMTA4MSAxOTUuMTE4IDMxLjE5OTQgMTkyLjAxM0w2OS40NDcyIDE2NC4wNTdMMzYuNjkzNyAxMzQuMTk1WiIgZmlsbD0id2hpdGUiLz4KPC9tYXNrPgo8ZyBtYXNrPSJ1cmwoI21hc2swKSI+CjxwYXRoIGQ9Ik0xNjcuOTk2IDExLjg4NTdDMTczLjEyOCA3LjIwNjI3IDE4MS4zNzkgMTAuODQ3MyAxODEuMzc5IDE3Ljc5MzZWNzUuNTEwOUwxMDQuOTM4IDEzNi4wNzNMNjUuNTc0MiAxMDYuMjExTDE2Ny45OTYgMTEuODg1N1oiIGZpbGw9IiMwMDlBN0MiLz4KPHBhdGggZD0iTTM2LjY5MzcgMTM0LjE5NEwzLjQ3NjcyIDE2Mi44MjdDLTEuMTYzNjcgMTY3LjA2MiAtMS4xNTg0NyAxNzQuMzcgMy40ODk3NCAxNzguNTk0TDE3LjU4NTMgMTkxLjQwOUMyMS4zODUxIDE5NC44NjMgMjcuMTA4MSAxOTUuMTE4IDMxLjE5OTQgMTkyLjAxM0w2OS40NDcyIDE2NC4wNTZMMzYuNjkzNyAxMzQuMTk0WiIgZmlsbD0iIzAwOUE3QyIvPgo8ZyBmaWx0ZXI9InVybCgjZmlsdGVyMF9kKSI+CjxwYXRoIGQ9Ik0xODEuMzc5IDE4MC42NDVMMzEuMTk5NCA2NC4xNDI3QzI3LjEwODEgNjEuMDM3OSAyMS4zODUxIDYxLjI5MjkgMTcuNTg1MyA2NC43NDY1TDMuNDg5NzQgNzcuNTYxNkMtMS4xNTg0NyA4MS43ODgyIC0xLjE2MzY3IDg5LjA5MzcgMy40NzY3MiA5My4zMjgxTDE2Ny45NzIgMjQ0LjE3NkMxNzMuMTAyIDI0OC44ODEgMTgxLjM3OSAyNDUuMjQxIDE4MS4zNzkgMjM4LjI4VjE4MC42NDVaIiBmaWxsPSIjMDBCMjk0Ii8+CjwvZz4KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjFfZCkiPgo8cGF0aCBkPSJNMTk0LjIzMyAyNTMuNzY2QzE4OC4xMyAyNTYuNzAxIDE4MC44MzcgMjU1LjQ2IDE3Ni4wNDggMjUwLjY3MUMxODEuOTQ5IDI1Ni41NzEgMTkyLjAzOSAyNTIuMzkyIDE5Mi4wMzkgMjQ0LjA0N1YxMi4xMTAzQzE5Mi4wMzkgMy43NjUzNSAxODEuOTQ5IC0wLjQxMzgzOSAxNzYuMDQ4IDUuNDg2OTRDMTgwLjgzNyAwLjY5NzgyNCAxODguMTI5IC0wLjU0MzE5MSAxOTQuMjMzIDIuMzkyMUwyNDYuOTM5IDI3LjczODZDMjUyLjQ3OCAzMC40MDIgMjU2IDM2LjAwMzcgMjU2IDQyLjE0OTFWMjE0LjAwOUMyNTYgMjIwLjE1NSAyNTIuNDc4IDIyNS43NTcgMjQ2LjkzOSAyMjguNDJMMTk0LjIzMyAyNTMuNzY2WiIgZmlsbD0iIzI0QkZBNSIvPgo8L2c+CjwvZz4KPGRlZnM+CjxmaWx0ZXIgaWQ9ImZpbHRlcjBfZCIgeD0iLTIxLjMzMzMiIHk9IjQwLjY0MTMiIHdpZHRoPSIyMjQuMDQ1IiBoZWlnaHQ9IjIyNi45ODgiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiLz4KPGZlT2Zmc2V0Lz4KPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMTAuNjY2NyIvPgo8ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC4xNSAwIi8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0iZWZmZWN0MV9kcm9wU2hhZG93Ii8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iZWZmZWN0MV9kcm9wU2hhZG93IiByZXN1bHQ9InNoYXBlIi8+CjwvZmlsdGVyPgo8ZmlsdGVyIGlkPSJmaWx0ZXIxX2QiIHg9IjE1NC43MTUiIHk9Ii0yMC41MTY5IiB3aWR0aD0iMTIyLjYxOCIgaGVpZ2h0PSIyOTcuMTkxIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CjxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIi8+CjxmZU9mZnNldC8+CjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEwLjY2NjciLz4KPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMjUgMCIvPgo8ZmVCbGVuZCBtb2RlPSJvdmVybGF5IiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJlZmZlY3QxX2Ryb3BTaGFkb3ciLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3ciIHJlc3VsdD0ic2hhcGUiLz4KPC9maWx0ZXI+CjwvZGVmcz4KPC9zdmc+Cg==\')';
		}
		return `<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8" />
	<title>GitHub Authentication - Sign In</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<style>
		html {
			height: 100%;
		}

		body {
			box-sizing: border-box;
			min-height: 100%;
			margin: 0;
			padding: 15px 30px;
			display: flex;
			flex-direction: column;
			color: white;
			font-family: "Segoe UI","Helvetica Neue","Helvetica",Arial,sans-serif;
			background-color: #2C2C32;
		}

		.branding {
			background-image: ${backgroundImage};
			background-size: 24px;
			background-repeat: no-repeat;
			background-position: left center;
			padding-left: 36px;
			font-size: 20px;
			letter-spacing: -0.04rem;
			font-weight: 400;
			color: white;
			text-decoration: none;
		}

		.message-container {
			flex-grow: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0 30px;
		}

		.message {
			font-weight: 300;
			font-size: 1.4rem;
		}

		body.error .message {
			display: none;
		}

		body.error .error-message {
			display: block;
		}

		.error-message {
			display: none;
			font-weight: 300;
			font-size: 1.3rem;
		}

		.error-text {
			color: red;
			font-size: 1rem;
		}

		@font-face {
			font-family: 'Segoe UI';
			src: url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.eot"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.eot?#iefix") format("embedded-opentype");
			src: local("Segoe UI Light"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.woff2") format("woff2"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.woff") format("woff"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.ttf") format("truetype"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.svg#web") format("svg");
			font-weight: 200
		}

		@font-face {
			font-family: 'Segoe UI';
			src: url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.eot"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.eot?#iefix") format("embedded-opentype");
			src: local("Segoe UI Semilight"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.woff2") format("woff2"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.woff") format("woff"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.ttf") format("truetype"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.svg#web") format("svg");
			font-weight: 300
		}

		@font-face {
			font-family: 'Segoe UI';
			src: url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.eot"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.eot?#iefix") format("embedded-opentype");
			src: local("Segoe UI"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.woff2") format("woff"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.woff") format("woff"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.ttf") format("truetype"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.svg#web") format("svg");
			font-weight: 400
		}

		@font-face {
			font-family: 'Segoe UI';
			src: url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.eot"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.eot?#iefix") format("embedded-opentype");
			src: local("Segoe UI Semibold"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.woff2") format("woff"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.woff") format("woff"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.ttf") format("truetype"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.svg#web") format("svg");
			font-weight: 600
		}

		@font-face {
			font-family: 'Segoe UI';
			src: url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.eot"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.eot?#iefix") format("embedded-opentype");
			src: local("Segoe UI Bold"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.woff2") format("woff"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.woff") format("woff"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.ttf") format("truetype"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.svg#web") format("svg");
			font-weight: 700
		}
	</style>
</head>

<body>
	<a class="branding" href="https://code.visualstudio.com/">
		${this._appName}
	</a>
	<div class="message-container">
		<div class="message">
			Sign-in successful! Returning to ${this._appName}...
			<br><br>
			If you're not redirected automatically, <a href="${this._appUri.toString(true)}" style="color: #85CEFF;">click here</a> or close this page.
		</div>
		<div class="error-message">
			An error occurred while signing in:
			<div class="error-text"></div>
		</div>
	</div>
	<script>
		const search = window.location.search;
		const error = (/[?&^]error=([^&]+)/.exec(search) || [])[1];
		if (error) {
			document.querySelector('.error-text')
				.textContent = decodeURIComponent(error);
			document.querySelector('body')
				.classList.add('error');
		} else {
			// Redirect to the app URI after a 1-second delay to allow page to load
			setTimeout(function() {
				window.location.href = '${this._appUri.toString(true)}';
			}, 1000);
		}
	</script>
</body>
</html>`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/node/proxyResolver.ts]---
Location: vscode-main/src/vs/workbench/api/node/proxyResolver.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IExtHostWorkspaceProvider } from '../common/extHostWorkspace.js';
import { ConfigurationInspect, ExtHostConfigProvider } from '../common/extHostConfiguration.js';
import { MainThreadTelemetryShape } from '../common/extHost.protocol.js';
import { IExtensionHostInitData } from '../../services/extensions/common/extensionHostProtocol.js';
import { ExtHostExtensionService } from './extHostExtensionService.js';
import { URI } from '../../../base/common/uri.js';
import { ILogService, LogLevel as LogServiceLevel } from '../../../platform/log/common/log.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { LogLevel, createHttpPatch, createProxyResolver, createTlsPatch, ProxySupportSetting, ProxyAgentParams, createNetPatch, loadSystemCertificates, ResolveProxyWithRequest } from '@vscode/proxy-agent';
import { AuthInfo, systemCertificatesNodeDefault } from '../../../platform/request/common/request.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { createRequire } from 'node:module';
import type * as undiciType from 'undici-types';
import type * as tlsType from 'tls';
import { lookupKerberosAuthorization } from '../../../platform/request/node/requestService.js';
import * as proxyAgent from '@vscode/proxy-agent';

const require = createRequire(import.meta.url);
const http = require('http');
const https = require('https');
const tls: typeof tlsType = require('tls');
const net = require('net');

const systemCertificatesV2Default = false;
const useElectronFetchDefault = false;

export function connectProxyResolver(
	extHostWorkspace: IExtHostWorkspaceProvider,
	configProvider: ExtHostConfigProvider,
	extensionService: ExtHostExtensionService,
	extHostLogService: ILogService,
	mainThreadTelemetry: MainThreadTelemetryShape,
	initData: IExtensionHostInitData,
	disposables: DisposableStore,
) {

	const isRemote = initData.remote.isRemote;
	const useHostProxyDefault = initData.environment.useHostProxy ?? !isRemote;
	const fallbackToLocalKerberos = useHostProxyDefault;
	const loadLocalCertificates = useHostProxyDefault;
	const isUseHostProxyEnabled = () => !isRemote || configProvider.getConfiguration('http').get<boolean>('useLocalProxyConfiguration', useHostProxyDefault);
	const timedResolveProxy = createTimedResolveProxy(extHostWorkspace, mainThreadTelemetry);
	const params: ProxyAgentParams = {
		resolveProxy: timedResolveProxy,
		lookupProxyAuthorization: lookupProxyAuthorization.bind(undefined, extHostWorkspace, extHostLogService, mainThreadTelemetry, configProvider, {}, {}, initData.remote.isRemote, fallbackToLocalKerberos),
		getProxyURL: () => getExtHostConfigValue<string>(configProvider, isRemote, 'http.proxy'),
		getProxySupport: () => getExtHostConfigValue<ProxySupportSetting>(configProvider, isRemote, 'http.proxySupport') || 'off',
		getNoProxyConfig: () => getExtHostConfigValue<string[]>(configProvider, isRemote, 'http.noProxy') || [],
		isAdditionalFetchSupportEnabled: () => getExtHostConfigValue<boolean>(configProvider, isRemote, 'http.fetchAdditionalSupport', true),
		addCertificatesV1: () => certSettingV1(configProvider, isRemote),
		addCertificatesV2: () => certSettingV2(configProvider, isRemote),
		loadSystemCertificatesFromNode: () => getExtHostConfigValue<boolean>(configProvider, isRemote, 'http.systemCertificatesNode', systemCertificatesNodeDefault),
		log: extHostLogService,
		getLogLevel: () => {
			const level = extHostLogService.getLevel();
			switch (level) {
				case LogServiceLevel.Trace: return LogLevel.Trace;
				case LogServiceLevel.Debug: return LogLevel.Debug;
				case LogServiceLevel.Info: return LogLevel.Info;
				case LogServiceLevel.Warning: return LogLevel.Warning;
				case LogServiceLevel.Error: return LogLevel.Error;
				case LogServiceLevel.Off: return LogLevel.Off;
				default: return never(level);
			}
			function never(level: never) {
				extHostLogService.error('Unknown log level', level);
				return LogLevel.Debug;
			}
		},
		proxyResolveTelemetry: () => { },
		isUseHostProxyEnabled,
		getNetworkInterfaceCheckInterval: () => {
			const intervalSeconds = getExtHostConfigValue<number>(configProvider, isRemote, 'http.experimental.networkInterfaceCheckInterval', 300);
			return intervalSeconds * 1000;
		},
		loadAdditionalCertificates: async () => {
			const useNodeSystemCerts = getExtHostConfigValue<boolean>(configProvider, isRemote, 'http.systemCertificatesNode', systemCertificatesNodeDefault);
			const promises: Promise<string[]>[] = [];
			if (isRemote) {
				promises.push(loadSystemCertificates({
					loadSystemCertificatesFromNode: () => useNodeSystemCerts,
					log: extHostLogService,
				}));
			}
			if (loadLocalCertificates) {
				if (!isRemote && useNodeSystemCerts) {
					promises.push(loadSystemCertificates({
						loadSystemCertificatesFromNode: () => useNodeSystemCerts,
						log: extHostLogService,
					}));
				} else {
					extHostLogService.trace('ProxyResolver#loadAdditionalCertificates: Loading certificates from main process');
					const certs = extHostWorkspace.loadCertificates(); // Loading from main process to share cache.
					certs.then(certs => extHostLogService.trace('ProxyResolver#loadAdditionalCertificates: Loaded certificates from main process', certs.length));
					promises.push(certs);
				}
			}
			// Using https.globalAgent because it is shared with proxy.test.ts and mutable.
			if (initData.environment.extensionTestsLocationURI && https.globalAgent.testCertificates?.length) {
				extHostLogService.trace('ProxyResolver#loadAdditionalCertificates: Loading test certificates');
				promises.push(Promise.resolve(https.globalAgent.testCertificates as string[]));
			}
			return (await Promise.all(promises)).flat();
		},
		env: process.env,
	};
	const { resolveProxyWithRequest, resolveProxyURL } = createProxyResolver(params);
	// eslint-disable-next-line local/code-no-any-casts
	const target = (proxyAgent as any).default || proxyAgent;
	target.resolveProxyURL = resolveProxyURL;

	patchGlobalFetch(params, configProvider, mainThreadTelemetry, initData, resolveProxyURL, disposables);

	const lookup = createPatchedModules(params, resolveProxyWithRequest);
	return configureModuleLoading(extensionService, lookup);
}

const unsafeHeaders = [
	'content-length',
	'host',
	'trailer',
	'te',
	'upgrade',
	'cookie2',
	'keep-alive',
	'transfer-encoding',
	'set-cookie',
];

function patchGlobalFetch(params: ProxyAgentParams, configProvider: ExtHostConfigProvider, mainThreadTelemetry: MainThreadTelemetryShape, initData: IExtensionHostInitData, resolveProxyURL: (url: string) => Promise<string | undefined>, disposables: DisposableStore) {
	// eslint-disable-next-line local/code-no-any-casts
	if (!(globalThis as any).__vscodeOriginalFetch) {
		const originalFetch = globalThis.fetch;
		// eslint-disable-next-line local/code-no-any-casts
		(globalThis as any).__vscodeOriginalFetch = originalFetch;
		const patchedFetch = proxyAgent.createFetchPatch(params, originalFetch, resolveProxyURL);
		// eslint-disable-next-line local/code-no-any-casts
		(globalThis as any).__vscodePatchedFetch = patchedFetch;
		let useElectronFetch = false;
		if (!initData.remote.isRemote) {
			useElectronFetch = configProvider.getConfiguration('http').get<boolean>('electronFetch', useElectronFetchDefault);
			disposables.add(configProvider.onDidChangeConfiguration(e => {
				if (e.affectsConfiguration('http.electronFetch')) {
					useElectronFetch = configProvider.getConfiguration('http').get<boolean>('electronFetch', useElectronFetchDefault);
				}
			}));
		}
		// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
		globalThis.fetch = async function fetch(input: string | URL | Request, init?: RequestInit) {
			function getRequestProperty(name: keyof Request & keyof RequestInit) {
				return init && name in init ? init[name] : typeof input === 'object' && 'cache' in input ? input[name] : undefined;
			}
			// Limitations: https://github.com/electron/electron/pull/36733#issuecomment-1405615494
			// net.fetch fails on manual redirect: https://github.com/electron/electron/issues/43715
			const urlString = typeof input === 'string' ? input : 'cache' in input ? input.url : input.toString();
			const isDataUrl = urlString.startsWith('data:');
			if (isDataUrl) {
				recordFetchFeatureUse(mainThreadTelemetry, 'data');
			}
			const isBlobUrl = urlString.startsWith('blob:');
			if (isBlobUrl) {
				recordFetchFeatureUse(mainThreadTelemetry, 'blob');
			}
			const isManualRedirect = getRequestProperty('redirect') === 'manual';
			if (isManualRedirect) {
				recordFetchFeatureUse(mainThreadTelemetry, 'manualRedirect');
			}
			const integrity = getRequestProperty('integrity');
			if (integrity) {
				recordFetchFeatureUse(mainThreadTelemetry, 'integrity');
			}
			if (!useElectronFetch || isDataUrl || isBlobUrl || isManualRedirect || integrity) {
				const response = await patchedFetch(input, init);
				monitorResponseProperties(mainThreadTelemetry, response, urlString);
				return response;
			}
			// Unsupported headers: https://source.chromium.org/chromium/chromium/src/+/main:services/network/public/cpp/header_util.cc;l=32;drc=ee7299f8961a1b05a3554efcc496b6daa0d7f6e1
			if (init?.headers) {
				const headers = new Headers(init.headers);
				for (const header of unsafeHeaders) {
					headers.delete(header);
				}
				init = { ...init, headers };
			}
			// Support for URL: https://github.com/electron/electron/issues/43712
			const electronInput = input instanceof URL ? input.toString() : input;
			const electron = require('electron');
			const response = await electron.net.fetch(electronInput, init);
			monitorResponseProperties(mainThreadTelemetry, response, urlString);
			return response;
		};
	}
}

function monitorResponseProperties(mainThreadTelemetry: MainThreadTelemetryShape, response: Response, urlString: string) {
	const originalUrl = response.url;
	Object.defineProperty(response, 'url', {
		get() {
			recordFetchFeatureUse(mainThreadTelemetry, 'url');
			return originalUrl || urlString;
		}
	});
	const originalType = response.type;
	Object.defineProperty(response, 'type', {
		get() {
			recordFetchFeatureUse(mainThreadTelemetry, 'typeProperty');
			return originalType !== 'default' ? originalType : 'basic';
		}
	});
}

type FetchFeatureUseClassification = {
	owner: 'chrmarti';
	comment: 'Data about fetch API use';
	url: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the url property was used.' };
	typeProperty: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the type property was used.' };
	data: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether a data URL was used.' };
	blob: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether a blob URL was used.' };
	integrity: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the integrity property was used.' };
	manualRedirect: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether a manual redirect was used.' };
};

type FetchFeatureUseEvent = {
	url: number;
	typeProperty: number;
	data: number;
	blob: number;
	integrity: number;
	manualRedirect: number;
};

const fetchFeatureUse: FetchFeatureUseEvent = {
	url: 0,
	typeProperty: 0,
	data: 0,
	blob: 0,
	integrity: 0,
	manualRedirect: 0,
};

let timer: Timeout | undefined;
const enableFeatureUseTelemetry = false;
function recordFetchFeatureUse(mainThreadTelemetry: MainThreadTelemetryShape, feature: keyof typeof fetchFeatureUse) {
	if (enableFeatureUseTelemetry && !fetchFeatureUse[feature]++) {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			mainThreadTelemetry.$publicLog2<FetchFeatureUseEvent, FetchFeatureUseClassification>('fetchFeatureUse', fetchFeatureUse);
		}, 10000); // collect additional features for 10 seconds
		(timer as unknown as NodeJS.Timeout).unref?.();
	}
}

type ProxyResolveStatsClassification = {
	owner: 'chrmarti';
	comment: 'Performance statistics for proxy resolution';
	count: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Number of proxy resolution calls' };
	totalDuration: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Total time spent in proxy resolution (ms)' };
	minDuration: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Minimum resolution time (ms)' };
	maxDuration: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Maximum resolution time (ms)' };
	avgDuration: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Average resolution time (ms)' };
};

type ProxyResolveStatsEvent = {
	count: number;
	totalDuration: number;
	minDuration: number;
	maxDuration: number;
	avgDuration: number;
};

const proxyResolveStats = {
	count: 0,
	totalDuration: 0,
	minDuration: Number.MAX_SAFE_INTEGER,
	maxDuration: 0,
	lastSentTime: 0,
};

const telemetryInterval = 60 * 60 * 1000; // 1 hour

function sendProxyResolveStats(mainThreadTelemetry: MainThreadTelemetryShape) {
	if (proxyResolveStats.count > 0) {
		const avgDuration = proxyResolveStats.totalDuration / proxyResolveStats.count;
		mainThreadTelemetry.$publicLog2<ProxyResolveStatsEvent, ProxyResolveStatsClassification>('proxyResolveStats', {
			count: proxyResolveStats.count,
			totalDuration: proxyResolveStats.totalDuration,
			minDuration: proxyResolveStats.minDuration,
			maxDuration: proxyResolveStats.maxDuration,
			avgDuration,
		});
		// Reset stats after sending
		proxyResolveStats.count = 0;
		proxyResolveStats.totalDuration = 0;
		proxyResolveStats.minDuration = Number.MAX_SAFE_INTEGER;
		proxyResolveStats.maxDuration = 0;
	}
	proxyResolveStats.lastSentTime = Date.now();
}

function createTimedResolveProxy(extHostWorkspace: IExtHostWorkspaceProvider, mainThreadTelemetry: MainThreadTelemetryShape) {
	return async (url: string): Promise<string | undefined> => {
		const startTime = performance.now();
		try {
			return await extHostWorkspace.resolveProxy(url);
		} finally {
			const duration = performance.now() - startTime;
			proxyResolveStats.count++;
			proxyResolveStats.totalDuration += duration;
			proxyResolveStats.minDuration = Math.min(proxyResolveStats.minDuration, duration);
			proxyResolveStats.maxDuration = Math.max(proxyResolveStats.maxDuration, duration);

			// Send telemetry if at least an hour has passed since last send
			const now = Date.now();
			if (now - proxyResolveStats.lastSentTime >= telemetryInterval) {
				sendProxyResolveStats(mainThreadTelemetry);
			}
		}
	};
}

function createPatchedModules(params: ProxyAgentParams, resolveProxy: ResolveProxyWithRequest) {

	function mergeModules(module: any, patch: any) {
		const target = module.default || module;
		target.__vscodeOriginal = Object.assign({}, target);
		return Object.assign(target, patch);
	}

	return {
		http: mergeModules(http, createHttpPatch(params, http, resolveProxy)),
		https: mergeModules(https, createHttpPatch(params, https, resolveProxy)),
		net: mergeModules(net, createNetPatch(params, net)),
		tls: mergeModules(tls, createTlsPatch(params, tls))
	};
}

function certSettingV1(configProvider: ExtHostConfigProvider, isRemote: boolean) {
	return !getExtHostConfigValue<boolean>(configProvider, isRemote, 'http.experimental.systemCertificatesV2', systemCertificatesV2Default) && !!getExtHostConfigValue<boolean>(configProvider, isRemote, 'http.systemCertificates');
}

function certSettingV2(configProvider: ExtHostConfigProvider, isRemote: boolean) {
	return !!getExtHostConfigValue<boolean>(configProvider, isRemote, 'http.experimental.systemCertificatesV2', systemCertificatesV2Default) && !!getExtHostConfigValue<boolean>(configProvider, isRemote, 'http.systemCertificates');
}

const modulesCache = new Map<IExtensionDescription | undefined, { http?: typeof http; https?: typeof https; undici?: typeof undiciType }>();
function configureModuleLoading(extensionService: ExtHostExtensionService, lookup: ReturnType<typeof createPatchedModules>): Promise<void> {
	return extensionService.getExtensionPathIndex()
		.then(extensionPaths => {
			const node_module = require('module');
			const original = node_module._load;
			node_module._load = function load(request: string, parent: { filename: string }, isMain: boolean) {
				if (request === 'net') {
					return lookup.net;
				}

				if (request === 'tls') {
					return lookup.tls;
				}

				if (request !== 'http' && request !== 'https' && request !== 'undici') {
					return original.apply(this, arguments);
				}

				const ext = extensionPaths.findSubstr(URI.file(parent.filename));
				let cache = modulesCache.get(ext);
				if (!cache) {
					modulesCache.set(ext, cache = {});
				}
				if (!cache[request]) {
					if (request === 'undici') {
						const undici = original.apply(this, arguments);
						proxyAgent.patchUndici(undici);
						cache[request] = undici;
					} else {
						const mod = lookup[request];
						cache[request] = { ...mod }; // Copy to work around #93167.
					}
				}
				return cache[request];
			};
		});
}

async function lookupProxyAuthorization(
	extHostWorkspace: IExtHostWorkspaceProvider,
	extHostLogService: ILogService,
	mainThreadTelemetry: MainThreadTelemetryShape,
	configProvider: ExtHostConfigProvider,
	proxyAuthenticateCache: Record<string, string | string[] | undefined>,
	basicAuthCache: Record<string, string | undefined>,
	isRemote: boolean,
	fallbackToLocalKerberos: boolean,
	proxyURL: string,
	proxyAuthenticate: string | string[] | undefined,
	state: { kerberosRequested?: boolean; basicAuthCacheUsed?: boolean; basicAuthAttempt?: number }
): Promise<string | undefined> {
	const cached = proxyAuthenticateCache[proxyURL];
	if (proxyAuthenticate) {
		proxyAuthenticateCache[proxyURL] = proxyAuthenticate;
	}
	extHostLogService.trace('ProxyResolver#lookupProxyAuthorization callback', `proxyURL:${proxyURL}`, `proxyAuthenticate:${proxyAuthenticate}`, `proxyAuthenticateCache:${cached}`);
	const header = proxyAuthenticate || cached;
	const authenticate = Array.isArray(header) ? header : typeof header === 'string' ? [header] : [];
	sendTelemetry(mainThreadTelemetry, authenticate, isRemote);
	if (authenticate.some(a => /^(Negotiate|Kerberos)( |$)/i.test(a)) && !state.kerberosRequested) {
		state.kerberosRequested = true;

		try {
			const spnConfig = getExtHostConfigValue<string>(configProvider, isRemote, 'http.proxyKerberosServicePrincipal');
			const response = await lookupKerberosAuthorization(proxyURL, spnConfig, extHostLogService, 'ProxyResolver#lookupProxyAuthorization');
			return 'Negotiate ' + response;
		} catch (err) {
			extHostLogService.debug('ProxyResolver#lookupProxyAuthorization Kerberos authentication failed', err);
		}

		if (isRemote && fallbackToLocalKerberos) {
			extHostLogService.debug('ProxyResolver#lookupProxyAuthorization Kerberos authentication lookup on host', `proxyURL:${proxyURL}`);
			const auth = await extHostWorkspace.lookupKerberosAuthorization(proxyURL);
			if (auth) {
				return 'Negotiate ' + auth;
			}
		}
	}
	const basicAuthHeader = authenticate.find(a => /^Basic( |$)/i.test(a));
	if (basicAuthHeader) {
		try {
			const cachedAuth = basicAuthCache[proxyURL];
			if (cachedAuth) {
				if (state.basicAuthCacheUsed) {
					extHostLogService.debug('ProxyResolver#lookupProxyAuthorization Basic authentication deleting cached credentials', `proxyURL:${proxyURL}`);
					delete basicAuthCache[proxyURL];
				} else {
					extHostLogService.debug('ProxyResolver#lookupProxyAuthorization Basic authentication using cached credentials', `proxyURL:${proxyURL}`);
					state.basicAuthCacheUsed = true;
					return cachedAuth;
				}
			}
			state.basicAuthAttempt = (state.basicAuthAttempt || 0) + 1;
			const realm = / realm="([^"]+)"/i.exec(basicAuthHeader)?.[1];
			extHostLogService.debug('ProxyResolver#lookupProxyAuthorization Basic authentication lookup', `proxyURL:${proxyURL}`, `realm:${realm}`);
			const url = new URL(proxyURL);
			const authInfo: AuthInfo = {
				scheme: 'basic',
				host: url.hostname,
				port: Number(url.port),
				realm: realm || '',
				isProxy: true,
				attempt: state.basicAuthAttempt,
			};
			const credentials = await extHostWorkspace.lookupAuthorization(authInfo);
			if (credentials) {
				extHostLogService.debug('ProxyResolver#lookupProxyAuthorization Basic authentication received credentials', `proxyURL:${proxyURL}`, `realm:${realm}`);
				const auth = 'Basic ' + Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');
				basicAuthCache[proxyURL] = auth;
				return auth;
			} else {
				extHostLogService.debug('ProxyResolver#lookupProxyAuthorization Basic authentication received no credentials', `proxyURL:${proxyURL}`, `realm:${realm}`);
			}
		} catch (err) {
			extHostLogService.error('ProxyResolver#lookupProxyAuthorization Basic authentication failed', err);
		}
	}
	return undefined;
}

type ProxyAuthenticationClassification = {
	owner: 'chrmarti';
	comment: 'Data about proxy authentication requests';
	authenticationType: { classification: 'PublicNonPersonalData'; purpose: 'FeatureInsight'; comment: 'Type of the authentication requested' };
	extensionHostType: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Type of the extension host' };
};

type ProxyAuthenticationEvent = {
	authenticationType: string;
	extensionHostType: string;
};

let telemetrySent = false;
const enableProxyAuthenticationTelemetry = false;
function sendTelemetry(mainThreadTelemetry: MainThreadTelemetryShape, authenticate: string[], isRemote: boolean) {
	if (!enableProxyAuthenticationTelemetry || telemetrySent || !authenticate.length) {
		return;
	}
	telemetrySent = true;

	mainThreadTelemetry.$publicLog2<ProxyAuthenticationEvent, ProxyAuthenticationClassification>('proxyAuthenticationRequest', {
		authenticationType: authenticate.map(a => a.split(' ')[0]).join(','),
		extensionHostType: isRemote ? 'remote' : 'local',
	});
}

function getExtHostConfigValue<T>(configProvider: ExtHostConfigProvider, isRemote: boolean, key: string, fallback: T): T;
function getExtHostConfigValue<T>(configProvider: ExtHostConfigProvider, isRemote: boolean, key: string): T | undefined;
function getExtHostConfigValue<T>(configProvider: ExtHostConfigProvider, isRemote: boolean, key: string, fallback?: T): T | undefined {
	if (isRemote) {
		return configProvider.getConfiguration().get<T>(key) ?? fallback;
	}
	const values: ConfigurationInspect<T> | undefined = configProvider.getConfiguration().inspect<T>(key);
	return values?.globalLocalValue ?? values?.defaultValue ?? fallback;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/extHost.api.impl.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHost.api.impl.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../base/common/uri.js';
import { originalFSPath } from '../../../../base/common/resources.js';
import { isWindows } from '../../../../base/common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

suite('ExtHost API', function () {
	test('issue #51387: originalFSPath', function () {
		if (isWindows) {
			assert.strictEqual(originalFSPath(URI.file('C:\\test')).charAt(0), 'C');
			assert.strictEqual(originalFSPath(URI.file('c:\\test')).charAt(0), 'c');

			assert.strictEqual(originalFSPath(URI.revive(JSON.parse(JSON.stringify(URI.file('C:\\test'))))).charAt(0), 'C');
			assert.strictEqual(originalFSPath(URI.revive(JSON.parse(JSON.stringify(URI.file('c:\\test'))))).charAt(0), 'c');
		}
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/extHostApiCommands.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostApiCommands.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import '../../../../editor/contrib/codeAction/browser/codeAction.js';
import '../../../../editor/contrib/codelens/browser/codelens.js';
import '../../../../editor/contrib/colorPicker/browser/colorPickerContribution.js';
import '../../../../editor/contrib/format/browser/format.js';
import '../../../../editor/contrib/gotoSymbol/browser/goToCommands.js';
import '../../../../editor/contrib/documentSymbols/browser/documentSymbols.js';
import '../../../../editor/contrib/hover/browser/getHover.js';
import '../../../../editor/contrib/links/browser/getLinks.js';
import '../../../../editor/contrib/parameterHints/browser/provideSignatureHelp.js';
import '../../../../editor/contrib/smartSelect/browser/smartSelect.js';
import '../../../../editor/contrib/suggest/browser/suggest.js';
import '../../../../editor/contrib/rename/browser/rename.js';
import '../../../../editor/contrib/inlayHints/browser/inlayHintsController.js';

import assert from 'assert';
import { setUnexpectedErrorHandler, errorHandler } from '../../../../base/common/errors.js';
import { URI } from '../../../../base/common/uri.js';
import { Event } from '../../../../base/common/event.js';
import * as types from '../../common/extHostTypes.js';
import { createTextModel } from '../../../../editor/test/common/testTextModel.js';
import { TestRPCProtocol } from '../common/testRPCProtocol.js';
import { MarkerService } from '../../../../platform/markers/common/markerService.js';
import { IMarkerService } from '../../../../platform/markers/common/markers.js';
import { ICommandService, CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ExtHostLanguageFeatures } from '../../common/extHostLanguageFeatures.js';
import { MainThreadLanguageFeatures } from '../../browser/mainThreadLanguageFeatures.js';
import { ExtHostApiCommands } from '../../common/extHostApiCommands.js';
import { ExtHostCommands } from '../../common/extHostCommands.js';
import { MainThreadCommands } from '../../browser/mainThreadCommands.js';
import { ExtHostDocuments } from '../../common/extHostDocuments.js';
import { ExtHostDocumentsAndEditors } from '../../common/extHostDocumentsAndEditors.js';
import { MainContext, ExtHostContext } from '../../common/extHost.protocol.js';
import { ExtHostDiagnostics } from '../../common/extHostDiagnostics.js';
import type * as vscode from 'vscode';
import '../../../contrib/search/browser/search.contribution.js';
import { ILogService, NullLogService } from '../../../../platform/log/common/log.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { nullExtensionDescription, IExtensionService } from '../../../services/extensions/common/extensions.js';
import { dispose, ImmortalReference } from '../../../../base/common/lifecycle.js';
import { IEditorWorkerService } from '../../../../editor/common/services/editorWorker.js';
import { mock } from '../../../../base/test/common/mock.js';
import { NullApiDeprecationService } from '../../common/extHostApiDeprecationService.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { IResolvedTextEditorModel, ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { IExtHostFileSystemInfo } from '../../common/extHostFileSystemInfo.js';
import { URITransformerService } from '../../common/extHostUriTransformerService.js';
import { IOutlineModelService, OutlineModelService } from '../../../../editor/contrib/documentSymbols/browser/outlineModel.js';
import { ILanguageFeatureDebounceService, LanguageFeatureDebounceService } from '../../../../editor/common/services/languageFeatureDebounce.js';
import { ILanguageFeaturesService } from '../../../../editor/common/services/languageFeatures.js';
import { LanguageFeaturesService } from '../../../../editor/common/services/languageFeaturesService.js';
import { assertType } from '../../../../base/common/types.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IExtHostTelemetry } from '../../common/extHostTelemetry.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../platform/configuration/test/common/testConfigurationService.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { TestInstantiationService } from '../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { runWithFakedTimers } from '../../../../base/test/common/timeTravelScheduler.js';
import { timeout } from '../../../../base/common/async.js';
import { FormattingOptions } from '../../../../editor/common/languages.js';

function assertRejects(fn: () => Promise<any>, message: string = 'Expected rejection') {
	return fn().then(() => assert.ok(false, message), _err => assert.ok(true));
}

function isLocation(value: vscode.Location | vscode.LocationLink): value is vscode.Location {
	const candidate = value as vscode.Location;
	return candidate && candidate.uri instanceof URI && candidate.range instanceof types.Range;
}

suite('ExtHostLanguageFeatureCommands', function () {
	const defaultSelector = { scheme: 'far' };
	let model: ITextModel;

	let insta: TestInstantiationService;
	let rpcProtocol: TestRPCProtocol;
	let extHost: ExtHostLanguageFeatures;
	let mainThread: MainThreadLanguageFeatures;
	let commands: ExtHostCommands;
	let disposables: vscode.Disposable[] = [];

	let originalErrorHandler: (e: any) => any;

	suiteSetup(() => {
		model = createTextModel(
			[
				'This is the first line',
				'This is the second line',
				'This is the third line',
			].join('\n'),
			undefined,
			undefined,
			URI.parse('far://testing/file.b'));
		originalErrorHandler = errorHandler.getUnexpectedErrorHandler();
		setUnexpectedErrorHandler(() => { });

		// Use IInstantiationService to get typechecking when instantiating
		rpcProtocol = new TestRPCProtocol();
		const services = new ServiceCollection();
		services.set(IUriIdentityService, new class extends mock<IUriIdentityService>() {
			override asCanonicalUri(uri: URI): URI {
				return uri;
			}
		});
		services.set(ILanguageFeaturesService, new SyncDescriptor(LanguageFeaturesService));
		services.set(IExtensionService, new class extends mock<IExtensionService>() {
			override async activateByEvent() {

			}
			override activationEventIsDone(activationEvent: string): boolean {
				return true;
			}
		});
		services.set(ICommandService, new SyncDescriptor(class extends mock<ICommandService>() {

			override executeCommand(id: string, ...args: any): any {
				const command = CommandsRegistry.getCommands().get(id);
				if (!command) {
					return Promise.reject(new Error(id + ' NOT known'));
				}
				const { handler } = command;
				return Promise.resolve(insta.invokeFunction(handler, ...args));
			}
		}));
		services.set(IEnvironmentService, new class extends mock<IEnvironmentService>() {
			override isBuilt: boolean = true;
			override isExtensionDevelopment: boolean = false;
		});
		services.set(IMarkerService, new MarkerService());
		services.set(ILogService, new SyncDescriptor(NullLogService));
		services.set(ILanguageFeatureDebounceService, new SyncDescriptor(LanguageFeatureDebounceService));
		services.set(IModelService, new class extends mock<IModelService>() {
			override getModel() { return model; }
			override onModelRemoved = Event.None;
		});
		services.set(ITextModelService, new class extends mock<ITextModelService>() {
			override async createModelReference() {
				return new ImmortalReference<IResolvedTextEditorModel>(new class extends mock<IResolvedTextEditorModel>() {
					override textEditorModel = model;
				});
			}
		});
		services.set(IEditorWorkerService, new class extends mock<IEditorWorkerService>() {
			override async computeMoreMinimalEdits(_uri: any, edits: any) {
				return edits || undefined;
			}
		});
		services.set(ILanguageFeatureDebounceService, new SyncDescriptor(LanguageFeatureDebounceService));
		services.set(IOutlineModelService, new SyncDescriptor(OutlineModelService));
		services.set(IConfigurationService, new TestConfigurationService());

		insta = new TestInstantiationService(services);

		const extHostDocumentsAndEditors = new ExtHostDocumentsAndEditors(rpcProtocol, new NullLogService());
		extHostDocumentsAndEditors.$acceptDocumentsAndEditorsDelta({
			addedDocuments: [{
				isDirty: false,
				versionId: model.getVersionId(),
				languageId: model.getLanguageId(),
				uri: model.uri,
				lines: model.getValue().split(model.getEOL()),
				EOL: model.getEOL(),
				encoding: 'utf8'
			}]
		});
		const extHostDocuments = new ExtHostDocuments(rpcProtocol, extHostDocumentsAndEditors);
		rpcProtocol.set(ExtHostContext.ExtHostDocuments, extHostDocuments);

		commands = new ExtHostCommands(rpcProtocol, new NullLogService(), new class extends mock<IExtHostTelemetry>() {
			override onExtensionError(): boolean {
				return true;
			}
		});
		rpcProtocol.set(ExtHostContext.ExtHostCommands, commands);
		rpcProtocol.set(MainContext.MainThreadCommands, insta.createInstance(MainThreadCommands, rpcProtocol));
		ExtHostApiCommands.register(commands);

		const diagnostics = new ExtHostDiagnostics(rpcProtocol, new NullLogService(), new class extends mock<IExtHostFileSystemInfo>() { }, extHostDocumentsAndEditors);
		rpcProtocol.set(ExtHostContext.ExtHostDiagnostics, diagnostics);

		extHost = new ExtHostLanguageFeatures(rpcProtocol, new URITransformerService(null), extHostDocuments, commands, diagnostics, new NullLogService(), NullApiDeprecationService, new class extends mock<IExtHostTelemetry>() {
			override onExtensionError(): boolean {
				return true;
			}
		});
		rpcProtocol.set(ExtHostContext.ExtHostLanguageFeatures, extHost);

		mainThread = rpcProtocol.set(MainContext.MainThreadLanguageFeatures, insta.createInstance(MainThreadLanguageFeatures, rpcProtocol));

		// forcefully create the outline service so that `ensureNoDisposablesAreLeakedInTestSuite` doesn't bark
		insta.get(IOutlineModelService);

		return rpcProtocol.sync();
	});

	suiteTeardown(() => {
		setUnexpectedErrorHandler(originalErrorHandler);
		model.dispose();
		mainThread.dispose();

		(<OutlineModelService>insta.get(IOutlineModelService)).dispose();
		insta.dispose();
	});

	teardown(() => {
		disposables = dispose(disposables);
		return rpcProtocol.sync();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	// --- workspace symbols

	function testApiCmd(name: string, fn: () => Promise<any>) {
		test(name, async function () {
			await runWithFakedTimers({}, async () => {
				await fn();
				await timeout(10000); 	// API commands for things that allow commands dispose their result delay. This is to be nice
				// because otherwise properties like command are disposed too early
			});
		});

	}

	test('WorkspaceSymbols, invalid arguments', function () {
		const promises = [
			assertRejects(() => commands.executeCommand('vscode.executeWorkspaceSymbolProvider')),
			assertRejects(() => commands.executeCommand('vscode.executeWorkspaceSymbolProvider', null)),
			assertRejects(() => commands.executeCommand('vscode.executeWorkspaceSymbolProvider', undefined)),
			assertRejects(() => commands.executeCommand('vscode.executeWorkspaceSymbolProvider', true))
		];
		return Promise.all(promises);
	});

	test('WorkspaceSymbols, back and forth', function () {

		disposables.push(extHost.registerWorkspaceSymbolProvider(nullExtensionDescription, <vscode.WorkspaceSymbolProvider>{
			provideWorkspaceSymbols(query): any {
				return [
					new types.SymbolInformation(query, types.SymbolKind.Array, new types.Range(0, 0, 1, 1), URI.parse('far://testing/first')),
					new types.SymbolInformation(query, types.SymbolKind.Array, new types.Range(0, 0, 1, 1), URI.parse('far://testing/second'))
				];
			}
		}));

		disposables.push(extHost.registerWorkspaceSymbolProvider(nullExtensionDescription, <vscode.WorkspaceSymbolProvider>{
			provideWorkspaceSymbols(query): any {
				return [
					new types.SymbolInformation(query, types.SymbolKind.Array, new types.Range(0, 0, 1, 1), URI.parse('far://testing/first'))
				];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.SymbolInformation[]>('vscode.executeWorkspaceSymbolProvider', 'testing').then(value => {

				assert.strictEqual(value.length, 2); // de-duped
				for (const info of value) {
					assert.strictEqual(info instanceof types.SymbolInformation, true);
					assert.strictEqual(info.name, 'testing');
					assert.strictEqual(info.kind, types.SymbolKind.Array);
				}
			});
		});
	});

	test('executeWorkspaceSymbolProvider should accept empty string, #39522', async function () {

		disposables.push(extHost.registerWorkspaceSymbolProvider(nullExtensionDescription, {
			provideWorkspaceSymbols(): vscode.SymbolInformation[] {
				return [new types.SymbolInformation('hello', types.SymbolKind.Array, new types.Range(0, 0, 0, 0), URI.parse('foo:bar')) as vscode.SymbolInformation];
			}
		}));

		await rpcProtocol.sync();
		let symbols = await commands.executeCommand<vscode.SymbolInformation[]>('vscode.executeWorkspaceSymbolProvider', '');
		assert.strictEqual(symbols.length, 1);

		await rpcProtocol.sync();
		symbols = await commands.executeCommand<vscode.SymbolInformation[]>('vscode.executeWorkspaceSymbolProvider', '*');
		assert.strictEqual(symbols.length, 1);
	});

	// --- formatting
	test('executeFormatDocumentProvider, back and forth', async function () {

		disposables.push(extHost.registerDocumentFormattingEditProvider(nullExtensionDescription, defaultSelector, new class implements vscode.DocumentFormattingEditProvider {
			provideDocumentFormattingEdits() {
				return [types.TextEdit.insert(new types.Position(0, 0), '42')];
			}
		}));

		await rpcProtocol.sync();
		const edits = await commands.executeCommand<vscode.SymbolInformation[]>('vscode.executeFormatDocumentProvider', model.uri, {
			insertSpaces: false,
			tabSize: 4,
		} satisfies FormattingOptions);
		assert.strictEqual(edits.length, 1);
	});


	// --- rename
	test('vscode.prepareRename', async function () {
		disposables.push(extHost.registerRenameProvider(nullExtensionDescription, defaultSelector, new class implements vscode.RenameProvider {

			prepareRename(document: vscode.TextDocument, position: vscode.Position) {
				return {
					range: new types.Range(0, 12, 0, 24),
					placeholder: 'foooPlaceholder'
				};
			}

			provideRenameEdits(document: vscode.TextDocument, position: vscode.Position, newName: string) {
				const edit = new types.WorkspaceEdit();
				edit.insert(document.uri, <types.Position>position, newName);
				return edit;
			}
		}));

		await rpcProtocol.sync();

		const data = await commands.executeCommand<{ range: vscode.Range; placeholder: string }>('vscode.prepareRename', model.uri, new types.Position(0, 12));

		assert.ok(data);
		assert.strictEqual(data.placeholder, 'foooPlaceholder');
		assert.strictEqual(data.range.start.line, 0);
		assert.strictEqual(data.range.start.character, 12);
		assert.strictEqual(data.range.end.line, 0);
		assert.strictEqual(data.range.end.character, 24);

	});

	test('vscode.executeDocumentRenameProvider', async function () {
		disposables.push(extHost.registerRenameProvider(nullExtensionDescription, defaultSelector, new class implements vscode.RenameProvider {
			provideRenameEdits(document: vscode.TextDocument, position: vscode.Position, newName: string) {
				const edit = new types.WorkspaceEdit();
				edit.insert(document.uri, <types.Position>position, newName);
				return edit;
			}
		}));

		await rpcProtocol.sync();

		const edit = await commands.executeCommand<vscode.WorkspaceEdit>('vscode.executeDocumentRenameProvider', model.uri, new types.Position(0, 12), 'newNameOfThis');

		assert.ok(edit);
		assert.strictEqual(edit.has(model.uri), true);
		const textEdits = edit.get(model.uri);
		assert.strictEqual(textEdits.length, 1);
		assert.strictEqual(textEdits[0].newText, 'newNameOfThis');
	});

	// --- definition

	test('Definition, invalid arguments', function () {
		const promises = [
			assertRejects(() => commands.executeCommand('vscode.executeDefinitionProvider')),
			assertRejects(() => commands.executeCommand('vscode.executeDefinitionProvider', null)),
			assertRejects(() => commands.executeCommand('vscode.executeDefinitionProvider', undefined)),
			assertRejects(() => commands.executeCommand('vscode.executeDefinitionProvider', true, false))
		];

		return Promise.all(promises);
	});

	test('Definition, back and forth', function () {

		disposables.push(extHost.registerDefinitionProvider(nullExtensionDescription, defaultSelector, <vscode.DefinitionProvider>{
			provideDefinition(doc: any): any {
				return new types.Location(doc.uri, new types.Range(1, 0, 0, 0));
			}
		}));
		disposables.push(extHost.registerDefinitionProvider(nullExtensionDescription, defaultSelector, <vscode.DefinitionProvider>{
			provideDefinition(doc: any): any {
				// duplicate result will get removed
				return new types.Location(doc.uri, new types.Range(1, 0, 0, 0));
			}
		}));
		disposables.push(extHost.registerDefinitionProvider(nullExtensionDescription, defaultSelector, <vscode.DefinitionProvider>{
			provideDefinition(doc: any): any {
				return [
					new types.Location(doc.uri, new types.Range(2, 0, 0, 0)),
					new types.Location(doc.uri, new types.Range(3, 0, 0, 0)),
					new types.Location(doc.uri, new types.Range(4, 0, 0, 0)),
				];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.Location[]>('vscode.executeDefinitionProvider', model.uri, new types.Position(0, 0)).then(values => {
				assert.strictEqual(values.length, 4);
				for (const v of values) {
					assert.ok(v.uri instanceof URI);
					assert.ok(v.range instanceof types.Range);
				}
			});
		});
	});


	test('Definition, back and forth (sorting & de-deduping)', function () {

		disposables.push(extHost.registerDefinitionProvider(nullExtensionDescription, defaultSelector, <vscode.DefinitionProvider>{
			provideDefinition(doc: any): any {
				return new types.Location(URI.parse('file:///b'), new types.Range(1, 0, 0, 0));
			}
		}));
		disposables.push(extHost.registerDefinitionProvider(nullExtensionDescription, defaultSelector, <vscode.DefinitionProvider>{
			provideDefinition(doc: any): any {
				// duplicate result will get removed
				return new types.Location(URI.parse('file:///b'), new types.Range(1, 0, 0, 0));
			}
		}));
		disposables.push(extHost.registerDefinitionProvider(nullExtensionDescription, defaultSelector, <vscode.DefinitionProvider>{
			provideDefinition(doc: any): any {
				return [
					new types.Location(URI.parse('file:///a'), new types.Range(2, 0, 0, 0)),
					new types.Location(URI.parse('file:///c'), new types.Range(3, 0, 0, 0)),
					new types.Location(URI.parse('file:///d'), new types.Range(4, 0, 0, 0)),
				];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.Location[]>('vscode.executeDefinitionProvider', model.uri, new types.Position(0, 0)).then(values => {
				assert.strictEqual(values.length, 4);

				assert.strictEqual(values[0].uri.path, '/a');
				assert.strictEqual(values[1].uri.path, '/b');
				assert.strictEqual(values[2].uri.path, '/c');
				assert.strictEqual(values[3].uri.path, '/d');
			});
		});
	});

	test('Definition Link', () => {
		disposables.push(extHost.registerDefinitionProvider(nullExtensionDescription, defaultSelector, <vscode.DefinitionProvider>{
			provideDefinition(doc: any): (vscode.Location | vscode.LocationLink)[] {
				return [
					new types.Location(doc.uri, new types.Range(0, 0, 0, 0)),
					{ targetUri: doc.uri, targetRange: new types.Range(1, 0, 0, 0), targetSelectionRange: new types.Range(1, 1, 1, 1), originSelectionRange: new types.Range(2, 2, 2, 2) }
				];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<(vscode.Location | vscode.LocationLink)[]>('vscode.executeDefinitionProvider', model.uri, new types.Position(0, 0)).then(values => {
				assert.strictEqual(values.length, 2);
				for (const v of values) {
					if (isLocation(v)) {
						assert.ok(v.uri instanceof URI);
						assert.ok(v.range instanceof types.Range);
					} else {
						assert.ok(v.targetUri instanceof URI);
						assert.ok(v.targetRange instanceof types.Range);
						assert.ok(v.targetSelectionRange instanceof types.Range);
						assert.ok(v.originSelectionRange instanceof types.Range);
					}
				}
			});
		});
	});

	// --- declaration

	test('Declaration, back and forth', function () {

		disposables.push(extHost.registerDeclarationProvider(nullExtensionDescription, defaultSelector, <vscode.DeclarationProvider>{
			provideDeclaration(doc: any): any {
				return new types.Location(doc.uri, new types.Range(1, 0, 0, 0));
			}
		}));
		disposables.push(extHost.registerDeclarationProvider(nullExtensionDescription, defaultSelector, <vscode.DeclarationProvider>{
			provideDeclaration(doc: any): any {
				// duplicate result will get removed
				return new types.Location(doc.uri, new types.Range(1, 0, 0, 0));
			}
		}));
		disposables.push(extHost.registerDeclarationProvider(nullExtensionDescription, defaultSelector, <vscode.DeclarationProvider>{
			provideDeclaration(doc: any): any {
				return [
					new types.Location(doc.uri, new types.Range(2, 0, 0, 0)),
					new types.Location(doc.uri, new types.Range(3, 0, 0, 0)),
					new types.Location(doc.uri, new types.Range(4, 0, 0, 0)),
				];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.Location[]>('vscode.executeDeclarationProvider', model.uri, new types.Position(0, 0)).then(values => {
				assert.strictEqual(values.length, 4);
				for (const v of values) {
					assert.ok(v.uri instanceof URI);
					assert.ok(v.range instanceof types.Range);
				}
			});
		});
	});

	test('Declaration Link', () => {
		disposables.push(extHost.registerDeclarationProvider(nullExtensionDescription, defaultSelector, <vscode.DeclarationProvider>{
			provideDeclaration(doc: any): (vscode.Location | vscode.LocationLink)[] {
				return [
					new types.Location(doc.uri, new types.Range(0, 0, 0, 0)),
					{ targetUri: doc.uri, targetRange: new types.Range(1, 0, 0, 0), targetSelectionRange: new types.Range(1, 1, 1, 1), originSelectionRange: new types.Range(2, 2, 2, 2) }
				];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<(vscode.Location | vscode.LocationLink)[]>('vscode.executeDeclarationProvider', model.uri, new types.Position(0, 0)).then(values => {
				assert.strictEqual(values.length, 2);
				for (const v of values) {
					if (isLocation(v)) {
						assert.ok(v.uri instanceof URI);
						assert.ok(v.range instanceof types.Range);
					} else {
						assert.ok(v.targetUri instanceof URI);
						assert.ok(v.targetRange instanceof types.Range);
						assert.ok(v.targetSelectionRange instanceof types.Range);
						assert.ok(v.originSelectionRange instanceof types.Range);
					}
				}
			});
		});
	});

	// --- type definition

	test('Type Definition, invalid arguments', function () {
		const promises = [
			assertRejects(() => commands.executeCommand('vscode.executeTypeDefinitionProvider')),
			assertRejects(() => commands.executeCommand('vscode.executeTypeDefinitionProvider', null)),
			assertRejects(() => commands.executeCommand('vscode.executeTypeDefinitionProvider', undefined)),
			assertRejects(() => commands.executeCommand('vscode.executeTypeDefinitionProvider', true, false))
		];

		return Promise.all(promises);
	});

	test('Type Definition, back and forth', function () {

		disposables.push(extHost.registerTypeDefinitionProvider(nullExtensionDescription, defaultSelector, <vscode.TypeDefinitionProvider>{
			provideTypeDefinition(doc: any): any {
				return new types.Location(doc.uri, new types.Range(1, 0, 0, 0));
			}
		}));
		disposables.push(extHost.registerTypeDefinitionProvider(nullExtensionDescription, defaultSelector, <vscode.TypeDefinitionProvider>{
			provideTypeDefinition(doc: any): any {
				// duplicate result will get removed
				return new types.Location(doc.uri, new types.Range(1, 0, 0, 0));
			}
		}));
		disposables.push(extHost.registerTypeDefinitionProvider(nullExtensionDescription, defaultSelector, <vscode.TypeDefinitionProvider>{
			provideTypeDefinition(doc: any): any {
				return [
					new types.Location(doc.uri, new types.Range(2, 0, 0, 0)),
					new types.Location(doc.uri, new types.Range(3, 0, 0, 0)),
					new types.Location(doc.uri, new types.Range(4, 0, 0, 0)),
				];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.Location[]>('vscode.executeTypeDefinitionProvider', model.uri, new types.Position(0, 0)).then(values => {
				assert.strictEqual(values.length, 4);
				for (const v of values) {
					assert.ok(v.uri instanceof URI);
					assert.ok(v.range instanceof types.Range);
				}
			});
		});
	});

	test('Type Definition Link', () => {
		disposables.push(extHost.registerTypeDefinitionProvider(nullExtensionDescription, defaultSelector, <vscode.TypeDefinitionProvider>{
			provideTypeDefinition(doc: any): (vscode.Location | vscode.LocationLink)[] {
				return [
					new types.Location(doc.uri, new types.Range(0, 0, 0, 0)),
					{ targetUri: doc.uri, targetRange: new types.Range(1, 0, 0, 0), targetSelectionRange: new types.Range(1, 1, 1, 1), originSelectionRange: new types.Range(2, 2, 2, 2) }
				];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<(vscode.Location | vscode.LocationLink)[]>('vscode.executeTypeDefinitionProvider', model.uri, new types.Position(0, 0)).then(values => {
				assert.strictEqual(values.length, 2);
				for (const v of values) {
					if (isLocation(v)) {
						assert.ok(v.uri instanceof URI);
						assert.ok(v.range instanceof types.Range);
					} else {
						assert.ok(v.targetUri instanceof URI);
						assert.ok(v.targetRange instanceof types.Range);
						assert.ok(v.targetSelectionRange instanceof types.Range);
						assert.ok(v.originSelectionRange instanceof types.Range);
					}
				}
			});
		});
	});

	// --- implementation

	test('Implementation, invalid arguments', function () {
		const promises = [
			assertRejects(() => commands.executeCommand('vscode.executeImplementationProvider')),
			assertRejects(() => commands.executeCommand('vscode.executeImplementationProvider', null)),
			assertRejects(() => commands.executeCommand('vscode.executeImplementationProvider', undefined)),
			assertRejects(() => commands.executeCommand('vscode.executeImplementationProvider', true, false))
		];

		return Promise.all(promises);
	});

	test('Implementation, back and forth', function () {

		disposables.push(extHost.registerImplementationProvider(nullExtensionDescription, defaultSelector, <vscode.ImplementationProvider>{
			provideImplementation(doc: any): any {
				return new types.Location(doc.uri, new types.Range(1, 0, 0, 0));
			}
		}));
		disposables.push(extHost.registerImplementationProvider(nullExtensionDescription, defaultSelector, <vscode.ImplementationProvider>{
			provideImplementation(doc: any): any {
				// duplicate result will get removed
				return new types.Location(doc.uri, new types.Range(1, 0, 0, 0));
			}
		}));
		disposables.push(extHost.registerImplementationProvider(nullExtensionDescription, defaultSelector, <vscode.ImplementationProvider>{
			provideImplementation(doc: any): any {
				return [
					new types.Location(doc.uri, new types.Range(2, 0, 0, 0)),
					new types.Location(doc.uri, new types.Range(3, 0, 0, 0)),
					new types.Location(doc.uri, new types.Range(4, 0, 0, 0)),
				];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.Location[]>('vscode.executeImplementationProvider', model.uri, new types.Position(0, 0)).then(values => {
				assert.strictEqual(values.length, 4);
				for (const v of values) {
					assert.ok(v.uri instanceof URI);
					assert.ok(v.range instanceof types.Range);
				}
			});
		});
	});

	test('Implementation Definition Link', () => {
		disposables.push(extHost.registerImplementationProvider(nullExtensionDescription, defaultSelector, <vscode.ImplementationProvider>{
			provideImplementation(doc: any): (vscode.Location | vscode.LocationLink)[] {
				return [
					new types.Location(doc.uri, new types.Range(0, 0, 0, 0)),
					{ targetUri: doc.uri, targetRange: new types.Range(1, 0, 0, 0), targetSelectionRange: new types.Range(1, 1, 1, 1), originSelectionRange: new types.Range(2, 2, 2, 2) }
				];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<(vscode.Location | vscode.LocationLink)[]>('vscode.executeImplementationProvider', model.uri, new types.Position(0, 0)).then(values => {
				assert.strictEqual(values.length, 2);
				for (const v of values) {
					if (isLocation(v)) {
						assert.ok(v.uri instanceof URI);
						assert.ok(v.range instanceof types.Range);
					} else {
						assert.ok(v.targetUri instanceof URI);
						assert.ok(v.targetRange instanceof types.Range);
						assert.ok(v.targetSelectionRange instanceof types.Range);
						assert.ok(v.originSelectionRange instanceof types.Range);
					}
				}
			});
		});
	});

	// --- references

	test('reference search, back and forth', function () {

		disposables.push(extHost.registerReferenceProvider(nullExtensionDescription, defaultSelector, <vscode.ReferenceProvider>{
			provideReferences() {
				return [
					new types.Location(URI.parse('some:uri/path'), new types.Range(0, 1, 0, 5))
				];
			}
		}));

		return commands.executeCommand<vscode.Location[]>('vscode.executeReferenceProvider', model.uri, new types.Position(0, 0)).then(values => {
			assert.strictEqual(values.length, 1);
			const [first] = values;
			assert.strictEqual(first.uri.toString(), 'some:uri/path');
			assert.strictEqual(first.range.start.line, 0);
			assert.strictEqual(first.range.start.character, 1);
			assert.strictEqual(first.range.end.line, 0);
			assert.strictEqual(first.range.end.character, 5);
		});
	});

	// --- document highlights

	test('"vscode.executeDocumentHighlights" API has stopped returning DocumentHighlight[]#200056', async function () {


		disposables.push(extHost.registerDocumentHighlightProvider(nullExtensionDescription, defaultSelector, <vscode.DocumentHighlightProvider>{
			provideDocumentHighlights() {
				return [
					new types.DocumentHighlight(new types.Range(0, 17, 0, 25), types.DocumentHighlightKind.Read)
				];
			}
		}));

		await rpcProtocol.sync();

		return commands.executeCommand<vscode.DocumentHighlight[]>('vscode.executeDocumentHighlights', model.uri, new types.Position(0, 0)).then(values => {
			assert.ok(Array.isArray(values));
			assert.strictEqual(values.length, 1);
			const [first] = values;
			assert.strictEqual(first.range.start.line, 0);
			assert.strictEqual(first.range.start.character, 17);
			assert.strictEqual(first.range.end.line, 0);
			assert.strictEqual(first.range.end.character, 25);
		});

	});

	// --- outline

	test('Outline, back and forth', function () {
		disposables.push(extHost.registerDocumentSymbolProvider(nullExtensionDescription, defaultSelector, <vscode.DocumentSymbolProvider>{
			provideDocumentSymbols(): any {
				return [
					new types.SymbolInformation('testing1', types.SymbolKind.Enum, new types.Range(1, 0, 1, 0)),
					new types.SymbolInformation('testing2', types.SymbolKind.Enum, new types.Range(0, 1, 0, 3)),
				];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.SymbolInformation[]>('vscode.executeDocumentSymbolProvider', model.uri).then(values => {
				assert.strictEqual(values.length, 2);
				const [first, second] = values;
				assert.strictEqual(first instanceof types.SymbolInformation, true);
				assert.strictEqual(second instanceof types.SymbolInformation, true);
				assert.strictEqual(first.name, 'testing2');
				assert.strictEqual(second.name, 'testing1');
			});
		});
	});

	test('vscode.executeDocumentSymbolProvider command only returns SymbolInformation[] rather than DocumentSymbol[] #57984', function () {
		disposables.push(extHost.registerDocumentSymbolProvider(nullExtensionDescription, defaultSelector, <vscode.DocumentSymbolProvider>{
			provideDocumentSymbols(): any {
				return [
					new types.SymbolInformation('SymbolInformation', types.SymbolKind.Enum, new types.Range(1, 0, 1, 0))
				];
			}
		}));
		disposables.push(extHost.registerDocumentSymbolProvider(nullExtensionDescription, defaultSelector, <vscode.DocumentSymbolProvider>{
			provideDocumentSymbols(): any {
				const root = new types.DocumentSymbol('DocumentSymbol', 'DocumentSymbol#detail', types.SymbolKind.Enum, new types.Range(1, 0, 1, 0), new types.Range(1, 0, 1, 0));
				root.children = [new types.DocumentSymbol('DocumentSymbol#child', 'DocumentSymbol#detail#child', types.SymbolKind.Enum, new types.Range(1, 0, 1, 0), new types.Range(1, 0, 1, 0))];
				return [root];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<(vscode.SymbolInformation & vscode.DocumentSymbol)[]>('vscode.executeDocumentSymbolProvider', model.uri).then(values => {
				assert.strictEqual(values.length, 2);
				const [first, second] = values;
				assert.strictEqual(first instanceof types.SymbolInformation, true);
				assert.strictEqual(first instanceof types.DocumentSymbol, false);
				assert.strictEqual(second instanceof types.SymbolInformation, true);
				assert.strictEqual(first.name, 'DocumentSymbol');
				assert.strictEqual(first.children.length, 1);
				assert.strictEqual(second.name, 'SymbolInformation');
			});
		});
	});

	// --- suggest

	testApiCmd('triggerCharacter is null when completion provider is called programmatically #159914', async function () {

		let actualContext: vscode.CompletionContext | undefined;

		disposables.push(extHost.registerCompletionItemProvider(nullExtensionDescription, defaultSelector, <vscode.CompletionItemProvider>{
			provideCompletionItems(_doc, _pos, _tok, context): any {
				actualContext = context;
				return [];
			}
		}, []));

		await rpcProtocol.sync();

		await commands.executeCommand<vscode.CompletionList>('vscode.executeCompletionItemProvider', model.uri, new types.Position(0, 4));

		assert.ok(actualContext);
		assert.deepStrictEqual(actualContext, { triggerKind: types.CompletionTriggerKind.Invoke, triggerCharacter: undefined });

	});

	testApiCmd('Suggest, back and forth', async function () {

		disposables.push(extHost.registerCompletionItemProvider(nullExtensionDescription, defaultSelector, <vscode.CompletionItemProvider>{
			provideCompletionItems(): any {
				const a = new types.CompletionItem('item1');
				a.documentation = new types.MarkdownString('hello_md_string');
				const b = new types.CompletionItem('item2');
				b.textEdit = types.TextEdit.replace(new types.Range(0, 4, 0, 8), 'foo'); // overwite after
				const c = new types.CompletionItem('item3');
				c.textEdit = types.TextEdit.replace(new types.Range(0, 1, 0, 6), 'foobar'); // overwite before & after

				// snippet string!
				const d = new types.CompletionItem('item4');
				d.range = new types.Range(0, 1, 0, 4);// overwite before
				d.insertText = new types.SnippetString('foo$0bar');
				return [a, b, c, d];
			}
		}, []));

		await rpcProtocol.sync();

		const list = await commands.executeCommand<vscode.CompletionList>('vscode.executeCompletionItemProvider', model.uri, new types.Position(0, 4));
		assert.ok(list instanceof types.CompletionList);
		const values = list.items;
		assert.ok(Array.isArray(values));
		assert.strictEqual(values.length, 4);
		const [first, second, third, fourth] = values;
		assert.strictEqual(first.label, 'item1');
		assert.strictEqual(first.textEdit, undefined); // no text edit, default ranges
		assert.ok(!types.Range.isRange(first.range));
		assert.strictEqual((<types.MarkdownString>first.documentation).value, 'hello_md_string');
		assert.strictEqual(second.label, 'item2');
		assert.strictEqual(second.textEdit!.newText, 'foo');
		assert.strictEqual(second.textEdit!.range.start.line, 0);
		assert.strictEqual(second.textEdit!.range.start.character, 4);
		assert.strictEqual(second.textEdit!.range.end.line, 0);
		assert.strictEqual(second.textEdit!.range.end.character, 8);
		assert.strictEqual(third.label, 'item3');
		assert.strictEqual(third.textEdit!.newText, 'foobar');
		assert.strictEqual(third.textEdit!.range.start.line, 0);
		assert.strictEqual(third.textEdit!.range.start.character, 1);
		assert.strictEqual(third.textEdit!.range.end.line, 0);
		assert.strictEqual(third.textEdit!.range.end.character, 6);
		assert.strictEqual(fourth.label, 'item4');
		assert.strictEqual(fourth.textEdit, undefined);
		const range: any = fourth.range!;
		assert.ok(types.Range.isRange(range));
		assert.strictEqual(range.start.line, 0);
		assert.strictEqual(range.start.character, 1);
		assert.strictEqual(range.end.line, 0);
		assert.strictEqual(range.end.character, 4);
		assert.ok(fourth.insertText instanceof types.SnippetString);
		assert.strictEqual((<types.SnippetString>fourth.insertText).value, 'foo$0bar');

	});

	testApiCmd('Suggest, return CompletionList !array', async function () {

		disposables.push(extHost.registerCompletionItemProvider(nullExtensionDescription, defaultSelector, <vscode.CompletionItemProvider>{
			provideCompletionItems(): any {
				const a = new types.CompletionItem('item1');
				const b = new types.CompletionItem('item2');
				// eslint-disable-next-line local/code-no-any-casts
				return new types.CompletionList(<any>[a, b], true);
			}
		}, []));

		await rpcProtocol.sync();

		const list = await commands.executeCommand<vscode.CompletionList>('vscode.executeCompletionItemProvider', model.uri, new types.Position(0, 4));

		assert.ok(list instanceof types.CompletionList);
		assert.strictEqual(list.isIncomplete, true);
	});

	testApiCmd('Suggest, resolve completion items', async function () {


		let resolveCount = 0;

		disposables.push(extHost.registerCompletionItemProvider(nullExtensionDescription, defaultSelector, <vscode.CompletionItemProvider>{
			provideCompletionItems(): any {
				const a = new types.CompletionItem('item1');
				const b = new types.CompletionItem('item2');
				const c = new types.CompletionItem('item3');
				const d = new types.CompletionItem('item4');
				return new types.CompletionList([a, b, c, d], false);
			},
			resolveCompletionItem(item) {
				resolveCount += 1;
				return item;
			}
		}, []));

		await rpcProtocol.sync();

		const list = await commands.executeCommand<vscode.CompletionList>(
			'vscode.executeCompletionItemProvider',
			model.uri,
			new types.Position(0, 4),
			undefined,
			2 // maxItemsToResolve
		);

		assert.ok(list instanceof types.CompletionList);
		assert.strictEqual(resolveCount, 2);

	});

	testApiCmd('"vscode.executeCompletionItemProvider" doesnot return a preselect field #53749', async function () {



		disposables.push(extHost.registerCompletionItemProvider(nullExtensionDescription, defaultSelector, <vscode.CompletionItemProvider>{
			provideCompletionItems(): any {
				const a = new types.CompletionItem('item1');
				a.preselect = true;
				const b = new types.CompletionItem('item2');
				const c = new types.CompletionItem('item3');
				c.preselect = true;
				const d = new types.CompletionItem('item4');
				return new types.CompletionList([a, b, c, d], false);
			}
		}, []));

		await rpcProtocol.sync();

		const list = await commands.executeCommand<vscode.CompletionList>(
			'vscode.executeCompletionItemProvider',
			model.uri,
			new types.Position(0, 4),
			undefined
		);

		assert.ok(list instanceof types.CompletionList);
		assert.strictEqual(list.items.length, 4);

		const [a, b, c, d] = list.items;
		assert.strictEqual(a.preselect, true);
		assert.strictEqual(b.preselect, undefined);
		assert.strictEqual(c.preselect, true);
		assert.strictEqual(d.preselect, undefined);
	});

	testApiCmd('executeCompletionItemProvider doesn\'t capture commitCharacters #58228', async function () {
		disposables.push(extHost.registerCompletionItemProvider(nullExtensionDescription, defaultSelector, <vscode.CompletionItemProvider>{
			provideCompletionItems(): any {
				const a = new types.CompletionItem('item1');
				a.commitCharacters = ['a', 'b'];
				const b = new types.CompletionItem('item2');
				return new types.CompletionList([a, b], false);
			}
		}, []));

		await rpcProtocol.sync();

		const list = await commands.executeCommand<vscode.CompletionList>(
			'vscode.executeCompletionItemProvider',
			model.uri,
			new types.Position(0, 4),
			undefined
		);

		assert.ok(list instanceof types.CompletionList);
		assert.strictEqual(list.items.length, 2);

		const [a, b] = list.items;
		assert.deepStrictEqual(a.commitCharacters, ['a', 'b']);
		assert.strictEqual(b.commitCharacters, undefined);
	});

	testApiCmd('vscode.executeCompletionItemProvider returns the wrong CompletionItemKinds in insiders #95715', async function () {
		disposables.push(extHost.registerCompletionItemProvider(nullExtensionDescription, defaultSelector, <vscode.CompletionItemProvider>{
			provideCompletionItems(): any {
				return [
					new types.CompletionItem('My Method', types.CompletionItemKind.Method),
					new types.CompletionItem('My Property', types.CompletionItemKind.Property),
				];
			}
		}, []));

		await rpcProtocol.sync();

		const list = await commands.executeCommand<vscode.CompletionList>(
			'vscode.executeCompletionItemProvider',
			model.uri,
			new types.Position(0, 4),
			undefined
		);

		assert.ok(list instanceof types.CompletionList);
		assert.strictEqual(list.items.length, 2);

		const [a, b] = list.items;
		assert.strictEqual(a.kind, types.CompletionItemKind.Method);
		assert.strictEqual(b.kind, types.CompletionItemKind.Property);
	});

	// --- signatureHelp

	test('Parameter Hints, back and forth', async () => {
		disposables.push(extHost.registerSignatureHelpProvider(nullExtensionDescription, defaultSelector, new class implements vscode.SignatureHelpProvider {
			provideSignatureHelp(_document: vscode.TextDocument, _position: vscode.Position, _token: vscode.CancellationToken, context: vscode.SignatureHelpContext): vscode.SignatureHelp {
				return {
					activeSignature: 0,
					activeParameter: 1,
					signatures: [
						{
							label: 'abc',
							documentation: `${context.triggerKind === 1 /* vscode.SignatureHelpTriggerKind.Invoke */ ? 'invoked' : 'unknown'} ${context.triggerCharacter}`,
							parameters: []
						}
					]
				};
			}
		}, []));

		await rpcProtocol.sync();

		const firstValue = await commands.executeCommand<vscode.SignatureHelp>('vscode.executeSignatureHelpProvider', model.uri, new types.Position(0, 1), ',');
		assert.strictEqual(firstValue.activeSignature, 0);
		assert.strictEqual(firstValue.activeParameter, 1);
		assert.strictEqual(firstValue.signatures.length, 1);
		assert.strictEqual(firstValue.signatures[0].label, 'abc');
		assert.strictEqual(firstValue.signatures[0].documentation, 'invoked ,');
	});

	// --- quickfix

	testApiCmd('QuickFix, back and forth', function () {
		disposables.push(extHost.registerCodeActionProvider(nullExtensionDescription, defaultSelector, {
			provideCodeActions(): vscode.Command[] {
				return [{ command: 'testing', title: 'Title', arguments: [1, 2, true] }];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.Command[]>('vscode.executeCodeActionProvider', model.uri, new types.Range(0, 0, 1, 1)).then(value => {
				assert.strictEqual(value.length, 1);
				const [first] = value;
				assert.strictEqual(first.title, 'Title');
				assert.strictEqual(first.command, 'testing');
				assert.deepStrictEqual(first.arguments, [1, 2, true]);
			});
		});
	});

	testApiCmd('vscode.executeCodeActionProvider results seem to be missing their `command` property #45124', function () {
		disposables.push(extHost.registerCodeActionProvider(nullExtensionDescription, defaultSelector, {
			provideCodeActions(document, range): vscode.CodeAction[] {
				return [{
					command: {
						arguments: [document, range],
						command: 'command',
						title: 'command_title',
					},
					kind: types.CodeActionKind.Empty.append('foo'),
					title: 'title',
				}];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.CodeAction[]>('vscode.executeCodeActionProvider', model.uri, new types.Range(0, 0, 1, 1)).then(value => {
				assert.strictEqual(value.length, 1);
				const [first] = value;
				assert.ok(first.command);
				assert.strictEqual(first.command.command, 'command');
				assert.strictEqual(first.command.title, 'command_title');
				assert.strictEqual(first.kind!.value, 'foo');
				assert.strictEqual(first.title, 'title');

			});
		});
	});

	testApiCmd('vscode.executeCodeActionProvider passes Range to provider although Selection is passed in #77997', function () {
		disposables.push(extHost.registerCodeActionProvider(nullExtensionDescription, defaultSelector, {
			provideCodeActions(document, rangeOrSelection): vscode.CodeAction[] {
				return [{
					command: {
						arguments: [document, rangeOrSelection],
						command: 'command',
						title: 'command_title',
					},
					kind: types.CodeActionKind.Empty.append('foo'),
					title: 'title',
				}];
			}
		}));

		const selection = new types.Selection(0, 0, 1, 1);

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.CodeAction[]>('vscode.executeCodeActionProvider', model.uri, selection).then(value => {
				assert.strictEqual(value.length, 1);
				const [first] = value;
				assert.ok(first.command);
				assert.ok(first.command.arguments![1] instanceof types.Selection);
				assert.ok(first.command.arguments![1].isEqual(selection));
			});
		});
	});

	testApiCmd('vscode.executeCodeActionProvider results seem to be missing their `isPreferred` property #78098', function () {
		disposables.push(extHost.registerCodeActionProvider(nullExtensionDescription, defaultSelector, {
			provideCodeActions(document, rangeOrSelection): vscode.CodeAction[] {
				return [{
					command: {
						arguments: [document, rangeOrSelection],
						command: 'command',
						title: 'command_title',
					},
					kind: types.CodeActionKind.Empty.append('foo'),
					title: 'title',
					isPreferred: true
				}];
			}
		}));

		const selection = new types.Selection(0, 0, 1, 1);

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.CodeAction[]>('vscode.executeCodeActionProvider', model.uri, selection).then(value => {
				assert.strictEqual(value.length, 1);
				const [first] = value;
				assert.strictEqual(first.isPreferred, true);
			});
		});
	});

	testApiCmd('resolving code action', async function () {

		let didCallResolve = 0;
		class MyAction extends types.CodeAction { }

		disposables.push(extHost.registerCodeActionProvider(nullExtensionDescription, defaultSelector, {
			provideCodeActions(document, rangeOrSelection): vscode.CodeAction[] {
				return [new MyAction('title', types.CodeActionKind.Empty.append('foo'))];
			},
			resolveCodeAction(action): vscode.CodeAction {
				assert.ok(action instanceof MyAction);

				didCallResolve += 1;
				action.title = 'resolved title';
				action.edit = new types.WorkspaceEdit();
				return action;
			}
		}));

		const selection = new types.Selection(0, 0, 1, 1);

		await rpcProtocol.sync();

		const value = await commands.executeCommand<vscode.CodeAction[]>('vscode.executeCodeActionProvider', model.uri, selection, undefined, 1000);
		assert.strictEqual(didCallResolve, 1);
		assert.strictEqual(value.length, 1);

		const [first] = value;
		assert.strictEqual(first.title, 'title'); // does NOT change
		assert.ok(first.edit); // is set
	});

	// --- code lens

	testApiCmd('CodeLens, back and forth', function () {

		const complexArg = {
			foo() { },
			bar() { },
			big: extHost
		};

		disposables.push(extHost.registerCodeLensProvider(nullExtensionDescription, defaultSelector, <vscode.CodeLensProvider>{
			provideCodeLenses(): any {
				return [new types.CodeLens(new types.Range(0, 0, 1, 1), { title: 'Title', command: 'cmd', arguments: [1, true, complexArg] })];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.CodeLens[]>('vscode.executeCodeLensProvider', model.uri).then(value => {
				assert.strictEqual(value.length, 1);
				const [first] = value;

				assert.strictEqual(first.command!.title, 'Title');
				assert.strictEqual(first.command!.command, 'cmd');
				assert.strictEqual(first.command!.arguments![0], 1);
				assert.strictEqual(first.command!.arguments![1], true);
				assert.strictEqual(first.command!.arguments![2], complexArg);
			});
		});
	});

	testApiCmd('CodeLens, resolve', async function () {

		let resolveCount = 0;

		disposables.push(extHost.registerCodeLensProvider(nullExtensionDescription, defaultSelector, <vscode.CodeLensProvider>{
			provideCodeLenses(): any {
				return [
					new types.CodeLens(new types.Range(0, 0, 1, 1)),
					new types.CodeLens(new types.Range(0, 0, 1, 1)),
					new types.CodeLens(new types.Range(0, 0, 1, 1)),
					new types.CodeLens(new types.Range(0, 0, 1, 1), { title: 'Already resolved', command: 'fff' })
				];
			},
			resolveCodeLens(codeLens: types.CodeLens) {
				codeLens.command = { title: resolveCount.toString(), command: 'resolved' };
				resolveCount += 1;
				return codeLens;
			}
		}));

		await rpcProtocol.sync();

		let value = await commands.executeCommand<vscode.CodeLens[]>('vscode.executeCodeLensProvider', model.uri, 2);

		assert.strictEqual(value.length, 3); // the resolve argument defines the number of results being returned
		assert.strictEqual(resolveCount, 2);

		resolveCount = 0;
		value = await commands.executeCommand<vscode.CodeLens[]>('vscode.executeCodeLensProvider', model.uri);

		assert.strictEqual(value.length, 4);
		assert.strictEqual(resolveCount, 0);
	});

	testApiCmd('Links, back and forth', function () {

		disposables.push(extHost.registerDocumentLinkProvider(nullExtensionDescription, defaultSelector, <vscode.DocumentLinkProvider>{
			provideDocumentLinks(): any {
				return [new types.DocumentLink(new types.Range(0, 0, 0, 20), URI.parse('foo:bar'))];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.DocumentLink[]>('vscode.executeLinkProvider', model.uri).then(value => {
				assert.strictEqual(value.length, 1);
				const [first] = value;

				assert.strictEqual(first.target + '', 'foo:bar');
				assert.strictEqual(first.range.start.line, 0);
				assert.strictEqual(first.range.start.character, 0);
				assert.strictEqual(first.range.end.line, 0);
				assert.strictEqual(first.range.end.character, 20);
			});
		});
	});

	testApiCmd('What\'s the condition for DocumentLink target to be undefined? #106308', async function () {
		disposables.push(extHost.registerDocumentLinkProvider(nullExtensionDescription, defaultSelector, <vscode.DocumentLinkProvider>{
			provideDocumentLinks(): any {
				return [new types.DocumentLink(new types.Range(0, 0, 0, 20), undefined)];
			},
			resolveDocumentLink(link) {
				link.target = URI.parse('foo:bar');
				return link;
			}
		}));

		await rpcProtocol.sync();

		const links1 = await commands.executeCommand<vscode.DocumentLink[]>('vscode.executeLinkProvider', model.uri);
		assert.strictEqual(links1.length, 1);
		assert.strictEqual(links1[0].target, undefined);

		const links2 = await commands.executeCommand<vscode.DocumentLink[]>('vscode.executeLinkProvider', model.uri, 1000);
		assert.strictEqual(links2.length, 1);
		assert.strictEqual(links2[0].target!.toString(), URI.parse('foo:bar').toString());

	});

	testApiCmd('DocumentLink[] vscode.executeLinkProvider returns lack tooltip #213970', async function () {
		disposables.push(extHost.registerDocumentLinkProvider(nullExtensionDescription, defaultSelector, <vscode.DocumentLinkProvider>{
			provideDocumentLinks(): any {
				const link = new types.DocumentLink(new types.Range(0, 0, 0, 20), URI.parse('foo:bar'));
				link.tooltip = 'Link Tooltip';
				return [link];
			}
		}));

		await rpcProtocol.sync();

		const links1 = await commands.executeCommand<vscode.DocumentLink[]>('vscode.executeLinkProvider', model.uri);
		assert.strictEqual(links1.length, 1);
		assert.strictEqual(links1[0].tooltip, 'Link Tooltip');
	});


	test('Color provider', function () {

		disposables.push(extHost.registerColorProvider(nullExtensionDescription, defaultSelector, <vscode.DocumentColorProvider>{
			provideDocumentColors(): vscode.ColorInformation[] {
				return [new types.ColorInformation(new types.Range(0, 0, 0, 20), new types.Color(0.1, 0.2, 0.3, 0.4))];
			},
			provideColorPresentations(): vscode.ColorPresentation[] {
				const cp = new types.ColorPresentation('#ABC');
				cp.textEdit = types.TextEdit.replace(new types.Range(1, 0, 1, 20), '#ABC');
				cp.additionalTextEdits = [types.TextEdit.insert(new types.Position(2, 20), '*')];
				return [cp];
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.ColorInformation[]>('vscode.executeDocumentColorProvider', model.uri).then(value => {
				assert.strictEqual(value.length, 1);
				const [first] = value;

				assert.strictEqual(first.color.red, 0.1);
				assert.strictEqual(first.color.green, 0.2);
				assert.strictEqual(first.color.blue, 0.3);
				assert.strictEqual(first.color.alpha, 0.4);
				assert.strictEqual(first.range.start.line, 0);
				assert.strictEqual(first.range.start.character, 0);
				assert.strictEqual(first.range.end.line, 0);
				assert.strictEqual(first.range.end.character, 20);
			});
		}).then(() => {
			const color = new types.Color(0.5, 0.6, 0.7, 0.8);
			const range = new types.Range(0, 0, 0, 20);
			return commands.executeCommand<vscode.ColorPresentation[]>('vscode.executeColorPresentationProvider', color, { uri: model.uri, range }).then(value => {
				assert.strictEqual(value.length, 1);
				const [first] = value;

				assert.strictEqual(first.label, '#ABC');
				assert.strictEqual(first.textEdit!.newText, '#ABC');
				assert.strictEqual(first.textEdit!.range.start.line, 1);
				assert.strictEqual(first.textEdit!.range.start.character, 0);
				assert.strictEqual(first.textEdit!.range.end.line, 1);
				assert.strictEqual(first.textEdit!.range.end.character, 20);
				assert.strictEqual(first.additionalTextEdits!.length, 1);
				assert.strictEqual(first.additionalTextEdits![0].range.start.line, 2);
				assert.strictEqual(first.additionalTextEdits![0].range.start.character, 20);
				assert.strictEqual(first.additionalTextEdits![0].range.end.line, 2);
				assert.strictEqual(first.additionalTextEdits![0].range.end.character, 20);
			});
		});
	});

	test('"TypeError: e.onCancellationRequested is not a function" calling hover provider in Insiders #54174', function () {

		disposables.push(extHost.registerHoverProvider(nullExtensionDescription, defaultSelector, <vscode.HoverProvider>{
			provideHover(): any {
				return new types.Hover('fofofofo');
			}
		}));

		return rpcProtocol.sync().then(() => {
			return commands.executeCommand<vscode.Hover[]>('vscode.executeHoverProvider', model.uri, new types.Position(1, 1)).then(value => {
				assert.strictEqual(value.length, 1);
				assert.strictEqual(value[0].contents.length, 1);
			});
		});
	});

	// --- inline hints

	testApiCmd('Inlay Hints, back and forth', async function () {
		disposables.push(extHost.registerInlayHintsProvider(nullExtensionDescription, defaultSelector, <vscode.InlayHintsProvider>{
			provideInlayHints() {
				return [new types.InlayHint(new types.Position(0, 1), 'Foo')];
			}
		}));

		await rpcProtocol.sync();

		const value = await commands.executeCommand<vscode.InlayHint[]>('vscode.executeInlayHintProvider', model.uri, new types.Range(0, 0, 20, 20));
		assert.strictEqual(value.length, 1);

		const [first] = value;
		assert.strictEqual(first.label, 'Foo');
		assert.strictEqual(first.position.line, 0);
		assert.strictEqual(first.position.character, 1);
	});

	testApiCmd('Inline Hints, merge', async function () {
		disposables.push(extHost.registerInlayHintsProvider(nullExtensionDescription, defaultSelector, <vscode.InlayHintsProvider>{
			provideInlayHints() {
				const part = new types.InlayHintLabelPart('Bar');
				part.tooltip = 'part_tooltip';
				part.command = { command: 'cmd', title: 'part' };
				const hint = new types.InlayHint(new types.Position(10, 11), [part]);
				hint.tooltip = 'hint_tooltip';
				hint.paddingLeft = true;
				hint.paddingRight = false;
				return [hint];
			}
		}));

		disposables.push(extHost.registerInlayHintsProvider(nullExtensionDescription, defaultSelector, <vscode.InlayHintsProvider>{
			provideInlayHints() {
				const hint = new types.InlayHint(new types.Position(0, 1), 'Foo', types.InlayHintKind.Parameter);
				hint.textEdits = [types.TextEdit.insert(new types.Position(0, 0), 'Hello')];
				return [hint];
			}
		}));

		await rpcProtocol.sync();

		const value = await commands.executeCommand<vscode.InlayHint[]>('vscode.executeInlayHintProvider', model.uri, new types.Range(0, 0, 20, 20));
		assert.strictEqual(value.length, 2);

		const [first, second] = value;
		assert.strictEqual(first.label, 'Foo');
		assert.strictEqual(first.position.line, 0);
		assert.strictEqual(first.position.character, 1);
		assert.strictEqual(first.textEdits?.length, 1);
		assert.strictEqual(first.textEdits[0].newText, 'Hello');

		assert.strictEqual(second.position.line, 10);
		assert.strictEqual(second.position.character, 11);
		assert.strictEqual(second.paddingLeft, true);
		assert.strictEqual(second.paddingRight, false);
		assert.strictEqual(second.tooltip, 'hint_tooltip');

		const label = (<types.InlayHintLabelPart[]>second.label)[0];
		assertType(label instanceof types.InlayHintLabelPart);
		assert.strictEqual(label.value, 'Bar');
		assert.strictEqual(label.tooltip, 'part_tooltip');
		assert.strictEqual(label.command?.command, 'cmd');
		assert.strictEqual(label.command?.title, 'part');
	});

	testApiCmd('Inline Hints, bad provider', async function () {
		disposables.push(extHost.registerInlayHintsProvider(nullExtensionDescription, defaultSelector, <vscode.InlayHintsProvider>{
			provideInlayHints() {
				return [new types.InlayHint(new types.Position(0, 1), 'Foo')];
			}
		}));
		disposables.push(extHost.registerInlayHintsProvider(nullExtensionDescription, defaultSelector, <vscode.InlayHintsProvider>{
			provideInlayHints() {
				throw new Error();
			}
		}));

		await rpcProtocol.sync();

		const value = await commands.executeCommand<vscode.InlayHint[]>('vscode.executeInlayHintProvider', model.uri, new types.Range(0, 0, 20, 20));
		assert.strictEqual(value.length, 1);

		const [first] = value;
		assert.strictEqual(first.label, 'Foo');
		assert.strictEqual(first.position.line, 0);
		assert.strictEqual(first.position.character, 1);
	});

	// --- selection ranges

	test('Selection Range, back and forth', async function () {

		disposables.push(extHost.registerSelectionRangeProvider(nullExtensionDescription, defaultSelector, <vscode.SelectionRangeProvider>{
			provideSelectionRanges() {
				return [
					new types.SelectionRange(new types.Range(0, 10, 0, 18), new types.SelectionRange(new types.Range(0, 2, 0, 20))),
				];
			}
		}));

		await rpcProtocol.sync();
		const value = await commands.executeCommand<vscode.SelectionRange[]>('vscode.executeSelectionRangeProvider', model.uri, [new types.Position(0, 10)]);
		assert.strictEqual(value.length, 1);
		assert.ok(value[0].parent);
	});

	// --- call hierarchy

	test('CallHierarchy, back and forth', async function () {

		disposables.push(extHost.registerCallHierarchyProvider(nullExtensionDescription, defaultSelector, new class implements vscode.CallHierarchyProvider {

			prepareCallHierarchy(document: vscode.TextDocument, position: vscode.Position,): vscode.ProviderResult<vscode.CallHierarchyItem> {
				return new types.CallHierarchyItem(types.SymbolKind.Constant, 'ROOT', 'ROOT', document.uri, new types.Range(0, 0, 0, 0), new types.Range(0, 0, 0, 0));
			}

			provideCallHierarchyIncomingCalls(item: vscode.CallHierarchyItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CallHierarchyIncomingCall[]> {

				return [new types.CallHierarchyIncomingCall(
					new types.CallHierarchyItem(types.SymbolKind.Constant, 'INCOMING', 'INCOMING', item.uri, new types.Range(0, 0, 0, 0), new types.Range(0, 0, 0, 0)),
					[new types.Range(0, 0, 0, 0)]
				)];
			}

			provideCallHierarchyOutgoingCalls(item: vscode.CallHierarchyItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CallHierarchyOutgoingCall[]> {
				return [new types.CallHierarchyOutgoingCall(
					new types.CallHierarchyItem(types.SymbolKind.Constant, 'OUTGOING', 'OUTGOING', item.uri, new types.Range(0, 0, 0, 0), new types.Range(0, 0, 0, 0)),
					[new types.Range(0, 0, 0, 0)]
				)];
			}
		}));

		await rpcProtocol.sync();

		const root = await commands.executeCommand<vscode.CallHierarchyItem[]>('vscode.prepareCallHierarchy', model.uri, new types.Position(0, 0));

		assert.ok(Array.isArray(root));
		assert.strictEqual(root.length, 1);
		assert.strictEqual(root[0].name, 'ROOT');

		const incoming = await commands.executeCommand<vscode.CallHierarchyIncomingCall[]>('vscode.provideIncomingCalls', root[0]);
		assert.strictEqual(incoming.length, 1);
		assert.strictEqual(incoming[0].from.name, 'INCOMING');

		const outgoing = await commands.executeCommand<vscode.CallHierarchyOutgoingCall[]>('vscode.provideOutgoingCalls', root[0]);
		assert.strictEqual(outgoing.length, 1);
		assert.strictEqual(outgoing[0].to.name, 'OUTGOING');
	});

	test('prepareCallHierarchy throws TypeError if clangd returns empty result #137415', async function () {

		disposables.push(extHost.registerCallHierarchyProvider(nullExtensionDescription, defaultSelector, new class implements vscode.CallHierarchyProvider {
			prepareCallHierarchy(document: vscode.TextDocument, position: vscode.Position,): vscode.ProviderResult<vscode.CallHierarchyItem[]> {
				return [];
			}
			provideCallHierarchyIncomingCalls(item: vscode.CallHierarchyItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CallHierarchyIncomingCall[]> {
				return [];
			}
			provideCallHierarchyOutgoingCalls(item: vscode.CallHierarchyItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CallHierarchyOutgoingCall[]> {
				return [];
			}
		}));

		await rpcProtocol.sync();

		const root = await commands.executeCommand<vscode.CallHierarchyItem[]>('vscode.prepareCallHierarchy', model.uri, new types.Position(0, 0));

		assert.ok(Array.isArray(root));
		assert.strictEqual(root.length, 0);
	});

	// --- type hierarchy

	test('TypeHierarchy, back and forth', async function () {


		disposables.push(extHost.registerTypeHierarchyProvider(nullExtensionDescription, defaultSelector, new class implements vscode.TypeHierarchyProvider {
			prepareTypeHierarchy(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TypeHierarchyItem[]> {
				return [new types.TypeHierarchyItem(types.SymbolKind.Constant, 'ROOT', 'ROOT', document.uri, new types.Range(0, 0, 0, 0), new types.Range(0, 0, 0, 0))];
			}
			provideTypeHierarchySupertypes(item: vscode.TypeHierarchyItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TypeHierarchyItem[]> {
				return [new types.TypeHierarchyItem(types.SymbolKind.Constant, 'SUPER', 'SUPER', item.uri, new types.Range(0, 0, 0, 0), new types.Range(0, 0, 0, 0))];
			}
			provideTypeHierarchySubtypes(item: vscode.TypeHierarchyItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TypeHierarchyItem[]> {
				return [new types.TypeHierarchyItem(types.SymbolKind.Constant, 'SUB', 'SUB', item.uri, new types.Range(0, 0, 0, 0), new types.Range(0, 0, 0, 0))];
			}
		}));

		await rpcProtocol.sync();

		const root = await commands.executeCommand<vscode.TypeHierarchyItem[]>('vscode.prepareTypeHierarchy', model.uri, new types.Position(0, 0));

		assert.ok(Array.isArray(root));
		assert.strictEqual(root.length, 1);
		assert.strictEqual(root[0].name, 'ROOT');

		const incoming = await commands.executeCommand<vscode.TypeHierarchyItem[]>('vscode.provideSupertypes', root[0]);
		assert.strictEqual(incoming.length, 1);
		assert.strictEqual(incoming[0].name, 'SUPER');

		const outgoing = await commands.executeCommand<vscode.TypeHierarchyItem[]>('vscode.provideSubtypes', root[0]);
		assert.strictEqual(outgoing.length, 1);
		assert.strictEqual(outgoing[0].name, 'SUB');
	});

	test('selectionRangeProvider on inner array always returns outer array #91852', async function () {

		disposables.push(extHost.registerSelectionRangeProvider(nullExtensionDescription, defaultSelector, <vscode.SelectionRangeProvider>{
			provideSelectionRanges(_doc, positions) {
				const [first] = positions;
				return [
					new types.SelectionRange(new types.Range(first.line, first.character, first.line, first.character)),
				];
			}
		}));

		await rpcProtocol.sync();
		const value = await commands.executeCommand<vscode.SelectionRange[]>('vscode.executeSelectionRangeProvider', model.uri, [new types.Position(0, 10)]);
		assert.strictEqual(value.length, 1);
		assert.strictEqual(value[0].range.start.line, 0);
		assert.strictEqual(value[0].range.start.character, 10);
		assert.strictEqual(value[0].range.end.line, 0);
		assert.strictEqual(value[0].range.end.character, 10);
	});

	test('more element test of selectionRangeProvider on inner array always returns outer array #91852', async function () {

		disposables.push(extHost.registerSelectionRangeProvider(nullExtensionDescription, defaultSelector, <vscode.SelectionRangeProvider>{
			provideSelectionRanges(_doc, positions) {
				const [first, second] = positions;
				return [
					new types.SelectionRange(new types.Range(first.line, first.character, first.line, first.character)),
					new types.SelectionRange(new types.Range(second.line, second.character, second.line, second.character)),
				];
			}
		}));

		await rpcProtocol.sync();
		const value = await commands.executeCommand<vscode.SelectionRange[]>(
			'vscode.executeSelectionRangeProvider',
			model.uri,
			[new types.Position(0, 0), new types.Position(0, 10)]
		);
		assert.strictEqual(value.length, 2);
		assert.strictEqual(value[0].range.start.line, 0);
		assert.strictEqual(value[0].range.start.character, 0);
		assert.strictEqual(value[0].range.end.line, 0);
		assert.strictEqual(value[0].range.end.character, 0);
		assert.strictEqual(value[1].range.start.line, 0);
		assert.strictEqual(value[1].range.start.character, 10);
		assert.strictEqual(value[1].range.end.line, 0);
		assert.strictEqual(value[1].range.end.character, 10);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/extHostAuthentication.integrationTest.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostAuthentication.integrationTest.ts

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
import { IQuickInputHideEvent, IQuickInputService, IQuickPickDidAcceptEvent, IQuickPickItem, QuickInputHideReason } from '../../../../platform/quickinput/common/quickInput.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { NullTelemetryService } from '../../../../platform/telemetry/common/telemetryUtils.js';
import { MainThreadAuthentication } from '../../browser/mainThreadAuthentication.js';
import { ExtHostContext, MainContext } from '../../common/extHost.protocol.js';
import { ExtHostAuthentication } from '../../common/extHostAuthentication.js';
import { IActivityService } from '../../../services/activity/common/activity.js';
import { AuthenticationService } from '../../../services/authentication/browser/authenticationService.js';
import { IAuthenticationExtensionsService, IAuthenticationService } from '../../../services/authentication/common/authentication.js';
import { IExtensionService, nullExtensionDescription as extensionDescription } from '../../../services/extensions/common/extensions.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';
import { TestRPCProtocol } from '../common/testRPCProtocol.js';
import { TestEnvironmentService, TestHostService, TestQuickInputService, TestRemoteAgentService } from '../../../test/browser/workbenchTestServices.js';
import { TestActivityService, TestExtensionService, TestLoggerService, TestProductService, TestStorageService } from '../../../test/common/workbenchTestServices.js';
import type { AuthenticationProvider, AuthenticationSession } from 'vscode';
import { IBrowserWorkbenchEnvironmentService } from '../../../services/environment/browser/environmentService.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { AuthenticationAccessService, IAuthenticationAccessService } from '../../../services/authentication/browser/authenticationAccessService.js';
import { IAccountUsage, IAuthenticationUsageService } from '../../../services/authentication/browser/authenticationUsageService.js';
import { AuthenticationExtensionsService } from '../../../services/authentication/browser/authenticationExtensionsService.js';
import { ILogService, NullLogService } from '../../../../platform/log/common/log.js';
import { IExtHostInitDataService } from '../../common/extHostInitDataService.js';
import { ExtHostWindow } from '../../common/extHostWindow.js';
import { MainThreadWindow } from '../../browser/mainThreadWindow.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IUserActivityService, UserActivityService } from '../../../services/userActivity/common/userActivityService.js';
import { ExtHostUrls } from '../../common/extHostUrls.js';
import { ISecretStorageService } from '../../../../platform/secrets/common/secrets.js';
import { TestSecretStorageService } from '../../../../platform/secrets/test/common/testSecretStorageService.js';
import { IDynamicAuthenticationProviderStorageService } from '../../../services/authentication/common/dynamicAuthenticationProviderStorage.js';
import { DynamicAuthenticationProviderStorageService } from '../../../services/authentication/browser/dynamicAuthenticationProviderStorageService.js';
import { ExtHostProgress } from '../../common/extHostProgress.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';

class AuthQuickPick {
	private accept: ((e: IQuickPickDidAcceptEvent) => any) | undefined;
	private hide: ((e: IQuickInputHideEvent) => any) | undefined;
	public items = [];
	public get selectedItems(): IQuickPickItem[] {
		return this.items;
	}

	onDidAccept(listener: (e: IQuickPickDidAcceptEvent) => any) {
		this.accept = listener;
	}
	onDidHide(listener: (e: IQuickInputHideEvent) => any) {
		this.hide = listener;
	}

	dispose() {

	}
	show() {
		this.accept?.({ inBackground: false });
		this.hide?.({ reason: QuickInputHideReason.Other });
	}
}
class AuthTestQuickInputService extends TestQuickInputService {
	override createQuickPick() {
		// eslint-disable-next-line local/code-no-any-casts
		return <any>new AuthQuickPick();
	}
}

class TestAuthUsageService implements IAuthenticationUsageService {
	_serviceBrand: undefined;
	initializeExtensionUsageCache(): Promise<void> { return Promise.resolve(); }
	extensionUsesAuth(extensionId: string): Promise<boolean> { return Promise.resolve(false); }
	readAccountUsages(providerId: string, accountName: string): IAccountUsage[] { return []; }
	removeAccountUsage(providerId: string, accountName: string): void { }
	addAccountUsage(providerId: string, accountName: string, scopes: ReadonlyArray<string>, extensionId: string, extensionName: string): void { }
}

class TestAuthProvider implements AuthenticationProvider {
	private id = 1;
	private sessions = new Map<string, AuthenticationSession>();
	onDidChangeSessions = () => { return { dispose() { } }; };
	constructor(private readonly authProviderName: string) { }
	async getSessions(scopes?: readonly string[]): Promise<AuthenticationSession[]> {
		if (!scopes) {
			return [...this.sessions.values()];
		}

		if (scopes[0] === 'return multiple') {
			return [...this.sessions.values()];
		}
		const sessions = this.sessions.get(scopes.join(' '));
		return sessions ? [sessions] : [];
	}
	async createSession(scopes: readonly string[]): Promise<AuthenticationSession> {
		const scopesStr = scopes.join(' ');
		const session = {
			scopes,
			id: `${this.id}`,
			account: {
				label: this.authProviderName,
				id: `${this.id}`,
			},
			accessToken: Math.random() + '',
		};
		this.sessions.set(scopesStr, session);
		this.id++;
		return session;
	}
	async removeSession(sessionId: string): Promise<void> {
		this.sessions.delete(sessionId);
	}

}

suite('ExtHostAuthentication', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	let extHostAuthentication: ExtHostAuthentication;
	let mainInstantiationService: TestInstantiationService;

	setup(async () => {
		// services
		const services = new ServiceCollection();
		services.set(ILogService, new SyncDescriptor(NullLogService));
		services.set(IDialogService, new SyncDescriptor(TestDialogService, [{ confirmed: true }]));
		services.set(IStorageService, new SyncDescriptor(TestStorageService));
		services.set(ISecretStorageService, new SyncDescriptor(TestSecretStorageService));
		services.set(IDynamicAuthenticationProviderStorageService, new SyncDescriptor(DynamicAuthenticationProviderStorageService));
		services.set(IQuickInputService, new SyncDescriptor(AuthTestQuickInputService));
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
		mainInstantiationService = disposables.add(new TestInstantiationService(services, undefined, undefined, true));

		// stubs
		// eslint-disable-next-line local/code-no-dangerous-type-assertions
		mainInstantiationService.stub(IOpenerService, {} as Partial<IOpenerService>);
		mainInstantiationService.stub(ITelemetryService, NullTelemetryService);
		mainInstantiationService.stub(IBrowserWorkbenchEnvironmentService, TestEnvironmentService);
		mainInstantiationService.stub(IProductService, TestProductService);

		const rpcProtocol = disposables.add(new TestRPCProtocol());

		rpcProtocol.set(MainContext.MainThreadAuthentication, disposables.add(mainInstantiationService.createInstance(MainThreadAuthentication, rpcProtocol)));
		rpcProtocol.set(MainContext.MainThreadWindow, disposables.add(mainInstantiationService.createInstance(MainThreadWindow, rpcProtocol)));
		// eslint-disable-next-line local/code-no-any-casts
		const initData: IExtHostInitDataService = {
			environment: {
				appUriScheme: 'test',
				appName: 'Test'
			}
		} as any;
		extHostAuthentication = new ExtHostAuthentication(
			rpcProtocol,
			// eslint-disable-next-line local/code-no-any-casts
			{
				environment: {
					appUriScheme: 'test',
					appName: 'Test'
				}
			} as any,
			new ExtHostWindow(initData, rpcProtocol),
			new ExtHostUrls(rpcProtocol),
			new ExtHostProgress(rpcProtocol),
			disposables.add(new TestLoggerService()),
			new NullLogService()
		);
		rpcProtocol.set(ExtHostContext.ExtHostAuthentication, extHostAuthentication);
		disposables.add(extHostAuthentication.registerAuthenticationProvider('test', 'test provider', new TestAuthProvider('test')));
		disposables.add(extHostAuthentication.registerAuthenticationProvider(
			'test-multiple',
			'test multiple provider',
			new TestAuthProvider('test-multiple'),
			{ supportsMultipleAccounts: true }));
	});

	test('createIfNone - true', async () => {
		const scopes = ['foo'];
		const session = await extHostAuthentication.getSession(
			extensionDescription,
			'test',
			scopes,
			{
				createIfNone: true
			});
		assert.strictEqual(session?.id, '1');
		assert.strictEqual(session?.scopes[0], 'foo');
	});

	test('createIfNone - false', async () => {
		const scopes = ['foo'];
		const nosession = await extHostAuthentication.getSession(
			extensionDescription,
			'test',
			scopes,
			{});
		assert.strictEqual(nosession, undefined);

		// Now create the session
		const session = await extHostAuthentication.getSession(
			extensionDescription,
			'test',
			scopes,
			{
				createIfNone: true
			});

		assert.strictEqual(session?.id, '1');
		assert.strictEqual(session?.scopes[0], 'foo');

		const session2 = await extHostAuthentication.getSession(
			extensionDescription,
			'test',
			scopes,
			{});

		assert.strictEqual(session2?.id, session.id);
		assert.strictEqual(session2?.scopes[0], session.scopes[0]);
		assert.strictEqual(session2?.accessToken, session.accessToken);
	});

	// should behave the same as createIfNone: false
	test('silent - true', async () => {
		const scopes = ['foo'];
		const nosession = await extHostAuthentication.getSession(
			extensionDescription,
			'test',
			scopes,
			{
				silent: true
			});
		assert.strictEqual(nosession, undefined);

		// Now create the session
		const session = await extHostAuthentication.getSession(
			extensionDescription,
			'test',
			scopes,
			{
				createIfNone: true
			});

		assert.strictEqual(session?.id, '1');
		assert.strictEqual(session?.scopes[0], 'foo');

		const session2 = await extHostAuthentication.getSession(
			extensionDescription,
			'test',
			scopes,
			{
				silent: true
			});

		assert.strictEqual(session.id, session2?.id);
		assert.strictEqual(session.scopes[0], session2?.scopes[0]);
	});

	test('forceNewSession - true - existing session', async () => {
		const scopes = ['foo'];
		const session1 = await extHostAuthentication.getSession(
			extensionDescription,
			'test',
			scopes,
			{
				createIfNone: true
			});

		// Now create the session
		const session2 = await extHostAuthentication.getSession(
			extensionDescription,
			'test',
			scopes,
			{
				forceNewSession: true
			});

		assert.strictEqual(session2?.id, '2');
		assert.strictEqual(session2?.scopes[0], 'foo');
		assert.notStrictEqual(session1.accessToken, session2?.accessToken);
	});

	// Should behave like createIfNone: true
	test('forceNewSession - true - no existing session', async () => {
		const scopes = ['foo'];
		const session = await extHostAuthentication.getSession(
			extensionDescription,
			'test',
			scopes,
			{
				forceNewSession: true
			});
		assert.strictEqual(session?.id, '1');
		assert.strictEqual(session?.scopes[0], 'foo');
	});

	test('forceNewSession - detail', async () => {
		const scopes = ['foo'];
		const session1 = await extHostAuthentication.getSession(
			extensionDescription,
			'test',
			scopes,
			{
				createIfNone: true
			});

		// Now create the session
		const session2 = await extHostAuthentication.getSession(
			extensionDescription,
			'test',
			scopes,
			{
				forceNewSession: { detail: 'bar' }
			});

		assert.strictEqual(session2?.id, '2');
		assert.strictEqual(session2?.scopes[0], 'foo');
		assert.notStrictEqual(session1.accessToken, session2?.accessToken);
	});

	//#region Multi-Account AuthProvider

	test('clearSessionPreference - true', async () => {
		const scopes = ['foo'];
		// Now create the session
		const session = await extHostAuthentication.getSession(
			extensionDescription,
			'test-multiple',
			scopes,
			{
				createIfNone: true
			});

		assert.strictEqual(session?.id, '1');
		assert.strictEqual(session?.scopes[0], scopes[0]);

		const scopes2 = ['bar'];
		const session2 = await extHostAuthentication.getSession(
			extensionDescription,
			'test-multiple',
			scopes2,
			{
				createIfNone: true
			});
		assert.strictEqual(session2?.id, '2');
		assert.strictEqual(session2?.scopes[0], scopes2[0]);

		const session3 = await extHostAuthentication.getSession(
			extensionDescription,
			'test-multiple',
			['return multiple'],
			{
				clearSessionPreference: true,
				createIfNone: true
			});

		// clearing session preference causes us to get the first session
		// because it would normally show a quick pick for the user to choose
		assert.strictEqual(session3?.id, session.id);
		assert.strictEqual(session3?.scopes[0], session.scopes[0]);
		assert.strictEqual(session3?.accessToken, session.accessToken);
	});

	test('silently getting session should return a session (if any) regardless of preference - fixes #137819', async () => {
		const scopes = ['foo'];
		// Now create the session
		const session = await extHostAuthentication.getSession(
			extensionDescription,
			'test-multiple',
			scopes,
			{
				createIfNone: true
			});

		assert.strictEqual(session?.id, '1');
		assert.strictEqual(session?.scopes[0], scopes[0]);

		const scopes2 = ['bar'];
		const session2 = await extHostAuthentication.getSession(
			extensionDescription,
			'test-multiple',
			scopes2,
			{
				createIfNone: true
			});
		assert.strictEqual(session2?.id, '2');
		assert.strictEqual(session2?.scopes[0], scopes2[0]);

		const shouldBeSession1 = await extHostAuthentication.getSession(
			extensionDescription,
			'test-multiple',
			scopes,
			{});
		assert.strictEqual(shouldBeSession1?.id, session.id);
		assert.strictEqual(shouldBeSession1?.scopes[0], session.scopes[0]);
		assert.strictEqual(shouldBeSession1?.accessToken, session.accessToken);

		const shouldBeSession2 = await extHostAuthentication.getSession(
			extensionDescription,
			'test-multiple',
			scopes2,
			{});
		assert.strictEqual(shouldBeSession2?.id, session2.id);
		assert.strictEqual(shouldBeSession2?.scopes[0], session2.scopes[0]);
		assert.strictEqual(shouldBeSession2?.accessToken, session2.accessToken);
	});

	//#endregion

	//#region error cases

	test('createIfNone and forceNewSession', async () => {
		try {
			await extHostAuthentication.getSession(
				extensionDescription,
				'test',
				['foo'],
				{
					createIfNone: true,
					forceNewSession: true
				});
			assert.fail('should have thrown an Error.');
		} catch (e) {
			assert.ok(e);
		}
	});

	test('forceNewSession and silent', async () => {
		try {
			await extHostAuthentication.getSession(
				extensionDescription,
				'test',
				['foo'],
				{
					forceNewSession: true,
					silent: true
				});
			assert.fail('should have thrown an Error.');
		} catch (e) {
			assert.ok(e);
		}
	});

	test('createIfNone and silent', async () => {
		try {
			await extHostAuthentication.getSession(
				extensionDescription,
				'test',
				['foo'],
				{
					createIfNone: true,
					silent: true
				});
			assert.fail('should have thrown an Error.');
		} catch (e) {
			assert.ok(e);
		}
	});

	test('Can get multiple sessions (with different scopes) in one extension', async () => {
		let session: AuthenticationSession | undefined = await extHostAuthentication.getSession(
			extensionDescription,
			'test-multiple',
			['foo'],
			{
				createIfNone: true
			});
		session = await extHostAuthentication.getSession(
			extensionDescription,
			'test-multiple',
			['bar'],
			{
				createIfNone: true
			});
		assert.strictEqual(session?.id, '2');
		assert.strictEqual(session?.scopes[0], 'bar');

		session = await extHostAuthentication.getSession(
			extensionDescription,
			'test-multiple',
			['foo'],
			{
				createIfNone: false
			});
		assert.strictEqual(session?.id, '1');
		assert.strictEqual(session?.scopes[0], 'foo');
	});

	test('Can get multiple sessions (from different providers) in one extension', async () => {
		let session: AuthenticationSession | undefined = await extHostAuthentication.getSession(
			extensionDescription,
			'test-multiple',
			['foo'],
			{
				createIfNone: true
			});
		session = await extHostAuthentication.getSession(
			extensionDescription,
			'test',
			['foo'],
			{
				createIfNone: true
			});
		assert.strictEqual(session?.id, '1');
		assert.strictEqual(session?.scopes[0], 'foo');
		assert.strictEqual(session?.account.label, 'test');

		const session2 = await extHostAuthentication.getSession(
			extensionDescription,
			'test-multiple',
			['foo'],
			{
				createIfNone: false
			});
		assert.strictEqual(session2?.id, '1');
		assert.strictEqual(session2?.scopes[0], 'foo');
		assert.strictEqual(session2?.account.label, 'test-multiple');
	});

	test('Can get multiple sessions (from different providers) in one extension at the same time', async () => {
		const sessionP: Promise<AuthenticationSession | undefined> = extHostAuthentication.getSession(
			extensionDescription,
			'test',
			['foo'],
			{
				createIfNone: true
			});
		const session2P: Promise<AuthenticationSession | undefined> = extHostAuthentication.getSession(
			extensionDescription,
			'test-multiple',
			['foo'],
			{
				createIfNone: true
			});
		const session = await sessionP;
		assert.strictEqual(session?.id, '1');
		assert.strictEqual(session?.scopes[0], 'foo');
		assert.strictEqual(session?.account.label, 'test');

		const session2 = await session2P;
		assert.strictEqual(session2?.id, '1');
		assert.strictEqual(session2?.scopes[0], 'foo');
		assert.strictEqual(session2?.account.label, 'test-multiple');
	});


	//#endregion

	//#region Race Condition and Sequencing Tests

	test('concurrent operations on same provider are serialized', async () => {
		const provider = new TestAuthProvider('concurrent-test');
		const operationOrder: string[] = [];

		// Mock the provider methods to track operation order
		const originalCreateSession = provider.createSession.bind(provider);
		const originalGetSessions = provider.getSessions.bind(provider);

		provider.createSession = async (scopes) => {
			operationOrder.push(`create-start-${scopes[0]}`);
			await new Promise(resolve => setTimeout(resolve, 20)); // Simulate async work
			const result = await originalCreateSession(scopes);
			operationOrder.push(`create-end-${scopes[0]}`);
			return result;
		};

		provider.getSessions = async (scopes) => {
			const scopeKey = scopes ? scopes[0] : 'all';
			operationOrder.push(`get-start-${scopeKey}`);
			await new Promise(resolve => setTimeout(resolve, 10)); // Simulate async work
			const result = await originalGetSessions(scopes);
			operationOrder.push(`get-end-${scopeKey}`);
			return result;
		};

		const disposable = extHostAuthentication.registerAuthenticationProvider('concurrent-test', 'Concurrent Test', provider);
		disposables.add(disposable);

		// Start multiple operations simultaneously on the same provider
		const promises = [
			extHostAuthentication.getSession(extensionDescription, 'concurrent-test', ['scope1'], { createIfNone: true }),
			extHostAuthentication.getSession(extensionDescription, 'concurrent-test', ['scope2'], { createIfNone: true }),
			extHostAuthentication.getSession(extensionDescription, 'concurrent-test', ['scope1'], {}) // This should get the existing session
		];

		await Promise.all(promises);

		// Verify that operations were serialized - no overlapping operations
		// Build a map of operation starts to their corresponding ends
		const operationPairs: Array<{ start: number; end: number; operation: string }> = [];

		for (let i = 0; i < operationOrder.length; i++) {
			const current = operationOrder[i];
			if (current.includes('-start-')) {
				const scope = current.split('-start-')[1];
				const operationType = current.split('-start-')[0];
				const endOperation = `${operationType}-end-${scope}`;
				const endIndex = operationOrder.indexOf(endOperation, i + 1);

				if (endIndex !== -1) {
					operationPairs.push({
						start: i,
						end: endIndex,
						operation: `${operationType}-${scope}`
					});
				}
			}
		}

		// Verify no operations overlap (serialization)
		for (let i = 0; i < operationPairs.length; i++) {
			for (let j = i + 1; j < operationPairs.length; j++) {
				const op1 = operationPairs[i];
				const op2 = operationPairs[j];

				// Operations should not overlap - one should completely finish before the other starts
				const op1EndsBeforeOp2Starts = op1.end < op2.start;
				const op2EndsBeforeOp1Starts = op2.end < op1.start;

				assert.ok(op1EndsBeforeOp2Starts || op2EndsBeforeOp1Starts,
					`Operations ${op1.operation} and ${op2.operation} should not overlap. ` +
					`Op1: ${op1.start}-${op1.end}, Op2: ${op2.start}-${op2.end}. ` +
					`Order: [${operationOrder.join(', ')}]`);
			}
		}

		// Verify we have the expected operations
		assert.ok(operationOrder.includes('create-start-scope1'), 'Should have created session for scope1');
		assert.ok(operationOrder.includes('create-end-scope1'), 'Should have completed creating session for scope1');
		assert.ok(operationOrder.includes('create-start-scope2'), 'Should have created session for scope2');
		assert.ok(operationOrder.includes('create-end-scope2'), 'Should have completed creating session for scope2');

		// The third call should use getSessions to find the existing scope1 session
		assert.ok(operationOrder.includes('get-start-scope1'), 'Should have called getSessions for existing scope1 session');
		assert.ok(operationOrder.includes('get-end-scope1'), 'Should have completed getSessions for existing scope1 session');
	});

	test('provider registration and immediate disposal race condition', async () => {
		const provider = new TestAuthProvider('race-test');

		// Register and immediately dispose
		const disposable = extHostAuthentication.registerAuthenticationProvider('race-test', 'Race Test', provider);
		disposable.dispose();

		// Try to use the provider after disposal - should fail gracefully
		try {
			await extHostAuthentication.getSession(extensionDescription, 'race-test', ['scope'], { createIfNone: true });
			assert.fail('Should have thrown an error for non-existent provider');
		} catch (error) {
			// Expected - provider should be unavailable
			assert.ok(error);
		}
	});

	test('provider re-registration after proper disposal', async () => {
		const provider1 = new TestAuthProvider('reregister-test-1');
		const provider2 = new TestAuthProvider('reregister-test-2');

		// First registration
		const disposable1 = extHostAuthentication.registerAuthenticationProvider('reregister-test', 'Provider 1', provider1);

		// Create a session with first provider
		const session1 = await extHostAuthentication.getSession(extensionDescription, 'reregister-test', ['scope'], { createIfNone: true });
		assert.strictEqual(session1?.account.label, 'reregister-test-1');

		// Dispose first provider
		disposable1.dispose();

		// Re-register with different provider
		const disposable2 = extHostAuthentication.registerAuthenticationProvider('reregister-test', 'Provider 2', provider2);
		disposables.add(disposable2);

		// Create session with second provider
		const session2 = await extHostAuthentication.getSession(extensionDescription, 'reregister-test', ['scope'], { createIfNone: true });
		assert.strictEqual(session2?.account.label, 'reregister-test-2');
		assert.notStrictEqual(session1?.accessToken, session2?.accessToken);
	});

	test('session operations during provider lifecycle changes', async () => {
		const provider = new TestAuthProvider('lifecycle-test');
		const disposable = extHostAuthentication.registerAuthenticationProvider('lifecycle-test', 'Lifecycle Test', provider);

		// Start a session creation
		const sessionPromise = extHostAuthentication.getSession(extensionDescription, 'lifecycle-test', ['scope'], { createIfNone: true });

		// Don't dispose immediately - let the session creation start
		await new Promise(resolve => setTimeout(resolve, 5));

		// Dispose the provider while the session creation is likely still in progress
		disposable.dispose();

		// The session creation should complete successfully even if we dispose during the operation
		const session = await sessionPromise;
		assert.ok(session);
		assert.strictEqual(session.account.label, 'lifecycle-test');
	});

	test('operations on different providers run concurrently', async () => {
		const provider1 = new TestAuthProvider('concurrent-1');
		const provider2 = new TestAuthProvider('concurrent-2');

		let provider1Started = false;
		let provider2Started = false;
		let provider1Finished = false;
		let provider2Finished = false;
		let concurrencyVerified = false;

		// Override createSession to track timing
		const originalCreate1 = provider1.createSession.bind(provider1);
		const originalCreate2 = provider2.createSession.bind(provider2);

		provider1.createSession = async (scopes) => {
			provider1Started = true;
			await new Promise(resolve => setTimeout(resolve, 20));
			const result = await originalCreate1(scopes);
			provider1Finished = true;
			return result;
		};

		provider2.createSession = async (scopes) => {
			provider2Started = true;
			// Provider 2 should start before provider 1 finishes (concurrent execution)
			if (provider1Started && !provider1Finished) {
				concurrencyVerified = true;
			}
			await new Promise(resolve => setTimeout(resolve, 10));
			const result = await originalCreate2(scopes);
			provider2Finished = true;
			return result;
		};

		const disposable1 = extHostAuthentication.registerAuthenticationProvider('concurrent-1', 'Concurrent 1', provider1);
		const disposable2 = extHostAuthentication.registerAuthenticationProvider('concurrent-2', 'Concurrent 2', provider2);
		disposables.add(disposable1);
		disposables.add(disposable2);

		// Start operations on both providers simultaneously
		const [session1, session2] = await Promise.all([
			extHostAuthentication.getSession(extensionDescription, 'concurrent-1', ['scope'], { createIfNone: true }),
			extHostAuthentication.getSession(extensionDescription, 'concurrent-2', ['scope'], { createIfNone: true })
		]);

		// Verify both operations completed successfully
		assert.ok(session1);
		assert.ok(session2);
		assert.ok(provider1Started, 'Provider 1 should have started');
		assert.ok(provider2Started, 'Provider 2 should have started');
		assert.ok(provider1Finished, 'Provider 1 should have finished');
		assert.ok(provider2Finished, 'Provider 2 should have finished');
		assert.strictEqual(session1.account.label, 'concurrent-1');
		assert.strictEqual(session2.account.label, 'concurrent-2');

		// Verify that operations ran concurrently (provider 2 started while provider 1 was still running)
		assert.ok(concurrencyVerified, 'Operations should have run concurrently - provider 2 should start while provider 1 is still running');
	});

	//#endregion
});
```

--------------------------------------------------------------------------------

````
