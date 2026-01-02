---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 196
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 196 of 552)

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

---[FILE: src/vs/code/electron-utility/sharedProcess/contrib/languagePackCachedDataCleaner.ts]---
Location: vscode-main/src/vs/code/electron-utility/sharedProcess/contrib/languagePackCachedDataCleaner.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { promises } from 'fs';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { join } from '../../../../base/common/path.js';
import { Promises } from '../../../../base/node/pfs.js';
import { INativeEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IProductService } from '../../../../platform/product/common/productService.js';

interface IExtensionEntry {
	version: string;
	extensionIdentifier: {
		id: string;
		uuid: string;
	};
}

interface ILanguagePackEntry {
	hash: string;
	extensions: IExtensionEntry[];
}

interface ILanguagePackFile {
	[locale: string]: ILanguagePackEntry;
}

export class LanguagePackCachedDataCleaner extends Disposable {

	private readonly dataMaxAge: number;

	constructor(
		@INativeEnvironmentService private readonly environmentService: INativeEnvironmentService,
		@ILogService private readonly logService: ILogService,
		@IProductService productService: IProductService
	) {
		super();

		this.dataMaxAge = productService.quality !== 'stable'
			? 1000 * 60 * 60 * 24 * 7 		// roughly 1 week (insiders)
			: 1000 * 60 * 60 * 24 * 30 * 3; // roughly 3 months (stable)

		// We have no Language pack support for dev version (run from source)
		// So only cleanup when we have a build version.
		if (this.environmentService.isBuilt) {
			const scheduler = this._register(new RunOnceScheduler(() => {
				this.cleanUpLanguagePackCache();
			}, 40 * 1000 /* after 40s */));
			scheduler.schedule();
		}
	}

	private async cleanUpLanguagePackCache(): Promise<void> {
		this.logService.trace('[language pack cache cleanup]: Starting to clean up unused language packs.');

		try {
			const installed: IStringDictionary<boolean> = Object.create(null);
			const metaData: ILanguagePackFile = JSON.parse(await promises.readFile(join(this.environmentService.userDataPath, 'languagepacks.json'), 'utf8'));
			for (const locale of Object.keys(metaData)) {
				const entry = metaData[locale];
				installed[`${entry.hash}.${locale}`] = true;
			}

			// Cleanup entries for language packs that aren't installed anymore
			const cacheDir = join(this.environmentService.userDataPath, 'clp');
			const cacheDirExists = await Promises.exists(cacheDir);
			if (!cacheDirExists) {
				return;
			}

			const entries = await Promises.readdir(cacheDir);
			for (const entry of entries) {
				if (installed[entry]) {
					this.logService.trace(`[language pack cache cleanup]: Skipping folder ${entry}. Language pack still in use.`);
					continue;
				}

				this.logService.trace(`[language pack cache cleanup]: Removing unused language pack: ${entry}`);

				await Promises.rm(join(cacheDir, entry));
			}

			const now = Date.now();
			for (const packEntry of Object.keys(installed)) {
				const folder = join(cacheDir, packEntry);
				const entries = await Promises.readdir(folder);
				for (const entry of entries) {
					if (entry === 'tcf.json') {
						continue;
					}

					const candidate = join(folder, entry);
					const stat = await promises.stat(candidate);
					if (stat.isDirectory() && (now - stat.mtime.getTime()) > this.dataMaxAge) {
						this.logService.trace(`[language pack cache cleanup]: Removing language pack cache folder: ${join(packEntry, entry)}`);

						await Promises.rm(candidate);
					}
				}
			}
		} catch (error) {
			onUnexpectedError(error);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/code/electron-utility/sharedProcess/contrib/localizationsUpdater.ts]---
Location: vscode-main/src/vs/code/electron-utility/sharedProcess/contrib/localizationsUpdater.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { ILanguagePackService } from '../../../../platform/languagePacks/common/languagePacks.js';
import { NativeLanguagePackService } from '../../../../platform/languagePacks/node/languagePacks.js';

export class LocalizationsUpdater extends Disposable {

	constructor(
		@ILanguagePackService private readonly localizationsService: NativeLanguagePackService
	) {
		super();

		this.updateLocalizations();
	}

	private updateLocalizations(): void {
		this.localizationsService.update();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/code/electron-utility/sharedProcess/contrib/logsDataCleaner.ts]---
Location: vscode-main/src/vs/code/electron-utility/sharedProcess/contrib/logsDataCleaner.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RunOnceScheduler } from '../../../../base/common/async.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { join } from '../../../../base/common/path.js';
import { basename, dirname } from '../../../../base/common/resources.js';
import { Promises } from '../../../../base/node/pfs.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { ILogService } from '../../../../platform/log/common/log.js';

export class LogsDataCleaner extends Disposable {

	constructor(
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@ILogService private readonly logService: ILogService
	) {
		super();

		const scheduler = this._register(new RunOnceScheduler(() => {
			this.cleanUpOldLogs();
		}, 10 * 1000 /* after 10s */));
		scheduler.schedule();
	}

	private async cleanUpOldLogs(): Promise<void> {
		this.logService.trace('[logs cleanup]: Starting to clean up old logs.');

		try {
			const currentLog = basename(this.environmentService.logsHome);
			const logsRoot = dirname(this.environmentService.logsHome.with({ scheme: Schemas.file })).fsPath;
			const logFiles = await Promises.readdir(logsRoot);

			const allSessions = logFiles.filter(logFile => /^\d{8}T\d{6}$/.test(logFile));
			const oldSessions = allSessions.sort().filter(session => session !== currentLog);
			const sessionsToDelete = oldSessions.slice(0, Math.max(0, oldSessions.length - 9));

			if (sessionsToDelete.length > 0) {
				this.logService.trace(`[logs cleanup]: Removing log folders '${sessionsToDelete.join(', ')}'`);

				await Promise.all(sessionsToDelete.map(sessionToDelete => Promises.rm(join(logsRoot, sessionToDelete))));
			}
		} catch (error) {
			onUnexpectedError(error);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/code/electron-utility/sharedProcess/contrib/storageDataCleaner.ts]---
Location: vscode-main/src/vs/code/electron-utility/sharedProcess/contrib/storageDataCleaner.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RunOnceScheduler } from '../../../../base/common/async.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { join } from '../../../../base/common/path.js';
import { Promises } from '../../../../base/node/pfs.js';
import { INativeEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { StorageClient } from '../../../../platform/storage/common/storageIpc.js';
import { EXTENSION_DEVELOPMENT_EMPTY_WINDOW_WORKSPACE } from '../../../../platform/workspace/common/workspace.js';
import { NON_EMPTY_WORKSPACE_ID_LENGTH } from '../../../../platform/workspaces/node/workspaces.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { IMainProcessService } from '../../../../platform/ipc/common/mainProcessService.js';
import { Schemas } from '../../../../base/common/network.js';

export class UnusedWorkspaceStorageDataCleaner extends Disposable {

	constructor(
		@INativeEnvironmentService private readonly environmentService: INativeEnvironmentService,
		@ILogService private readonly logService: ILogService,
		@INativeHostService private readonly nativeHostService: INativeHostService,
		@IMainProcessService private readonly mainProcessService: IMainProcessService
	) {
		super();

		const scheduler = this._register(new RunOnceScheduler(() => {
			this.cleanUpStorage();
		}, 30 * 1000 /* after 30s */));
		scheduler.schedule();
	}

	private async cleanUpStorage(): Promise<void> {
		this.logService.trace('[storage cleanup]: Starting to clean up workspace storage folders for unused empty workspaces.');

		try {
			const workspaceStorageHome = this.environmentService.workspaceStorageHome.with({ scheme: Schemas.file }).fsPath;
			const workspaceStorageFolders = await Promises.readdir(workspaceStorageHome);
			const storageClient = new StorageClient(this.mainProcessService.getChannel('storage'));

			await Promise.all(workspaceStorageFolders.map(async workspaceStorageFolder => {
				const workspaceStoragePath = join(workspaceStorageHome, workspaceStorageFolder);

				if (workspaceStorageFolder.length === NON_EMPTY_WORKSPACE_ID_LENGTH) {
					return; // keep workspace storage for folders/workspaces that can be accessed still
				}

				if (workspaceStorageFolder === EXTENSION_DEVELOPMENT_EMPTY_WINDOW_WORKSPACE.id) {
					return; // keep workspace storage for empty extension development workspaces
				}

				const windows = await this.nativeHostService.getWindows({ includeAuxiliaryWindows: false });
				if (windows.some(window => window.workspace?.id === workspaceStorageFolder)) {
					return; // keep workspace storage for empty workspaces opened as window
				}

				const isStorageUsed = await storageClient.isUsed(workspaceStoragePath);
				if (isStorageUsed) {
					return; // keep workspace storage for empty workspaces that are in use
				}

				this.logService.trace(`[storage cleanup]: Deleting workspace storage folder ${workspaceStorageFolder} as it seems to be an unused empty workspace.`);

				await Promises.rm(workspaceStoragePath);
			}));
		} catch (error) {
			onUnexpectedError(error);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/code/electron-utility/sharedProcess/contrib/userDataProfilesCleaner.ts]---
Location: vscode-main/src/vs/code/electron-utility/sharedProcess/contrib/userDataProfilesCleaner.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RunOnceScheduler } from '../../../../base/common/async.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';

export class UserDataProfilesCleaner extends Disposable {

	constructor(
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService
	) {
		super();

		const scheduler = this._register(new RunOnceScheduler(() => {
			userDataProfilesService.cleanUp();
		}, 10 * 1000 /* after 10s */));
		scheduler.schedule();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/code/node/cli.ts]---
Location: vscode-main/src/vs/code/node/cli.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ChildProcess, spawn, SpawnOptions, StdioOptions } from 'child_process';
import { chmodSync, existsSync, readFileSync, statSync, truncateSync, unlinkSync } from 'fs';
import { homedir, tmpdir } from 'os';
import type { ProfilingSession, Target } from 'v8-inspect-profiler';
import { Event } from '../../base/common/event.js';
import { isAbsolute, resolve, join, dirname } from '../../base/common/path.js';
import { IProcessEnvironment, isMacintosh, isWindows } from '../../base/common/platform.js';
import { randomPort } from '../../base/common/ports.js';
import { whenDeleted, writeFileSync } from '../../base/node/pfs.js';
import { findFreePort } from '../../base/node/ports.js';
import { watchFileContents } from '../../platform/files/node/watcher/nodejs/nodejsWatcherLib.js';
import { NativeParsedArgs } from '../../platform/environment/common/argv.js';
import { buildHelpMessage, buildStdinMessage, buildVersionMessage, NATIVE_CLI_COMMANDS, OPTIONS } from '../../platform/environment/node/argv.js';
import { addArg, parseCLIProcessArgv } from '../../platform/environment/node/argvHelper.js';
import { getStdinFilePath, hasStdinWithoutTty, readFromStdin, stdinDataListener } from '../../platform/environment/node/stdin.js';
import { createWaitMarkerFileSync } from '../../platform/environment/node/wait.js';
import product from '../../platform/product/common/product.js';
import { CancellationTokenSource } from '../../base/common/cancellation.js';
import { isUNC, randomPath } from '../../base/common/extpath.js';
import { Utils } from '../../platform/profiling/common/profiling.js';
import { FileAccess } from '../../base/common/network.js';
import { cwd } from '../../base/common/process.js';
import { addUNCHostToAllowlist } from '../../base/node/unc.js';
import { URI } from '../../base/common/uri.js';
import { DeferredPromise } from '../../base/common/async.js';

function shouldSpawnCliProcess(argv: NativeParsedArgs): boolean {
	return !!argv['install-source']
		|| !!argv['list-extensions']
		|| !!argv['install-extension']
		|| !!argv['uninstall-extension']
		|| !!argv['update-extensions']
		|| !!argv['locate-extension']
		|| !!argv['add-mcp']
		|| !!argv['telemetry'];
}

export async function main(argv: string[]): Promise<void> {
	let args: NativeParsedArgs;

	try {
		args = parseCLIProcessArgv(argv);
	} catch (err) {
		console.error(err.message);
		return;
	}

	for (const subcommand of NATIVE_CLI_COMMANDS) {
		if (args[subcommand]) {
			if (!product.tunnelApplicationName) {
				console.error(`'${subcommand}' command not supported in ${product.applicationName}`);
				return;
			}
			const env: IProcessEnvironment = {
				...process.env
			};
			// bootstrap-esm.js determines the electron environment based
			// on the following variable. For the server we need to unset
			// it to prevent importing any electron specific modules.
			// Refs https://github.com/microsoft/vscode/issues/221883
			delete env['ELECTRON_RUN_AS_NODE'];

			const tunnelArgs = argv.slice(argv.indexOf(subcommand) + 1); // all arguments behind `tunnel`
			return new Promise((resolve, reject) => {
				let tunnelProcess: ChildProcess;
				const stdio: StdioOptions = ['ignore', 'pipe', 'pipe'];
				if (process.env['VSCODE_DEV']) {
					tunnelProcess = spawn('cargo', ['run', '--', subcommand, ...tunnelArgs], { cwd: join(getAppRoot(), 'cli'), stdio, env });
				} else {
					const appPath = process.platform === 'darwin'
						// ./Contents/MacOS/Electron => ./Contents/Resources/app/bin/code-tunnel-insiders
						? join(dirname(dirname(process.execPath)), 'Resources', 'app')
						: dirname(process.execPath);
					const tunnelCommand = join(appPath, 'bin', `${product.tunnelApplicationName}${isWindows ? '.exe' : ''}`);
					tunnelProcess = spawn(tunnelCommand, [subcommand, ...tunnelArgs], { cwd: cwd(), stdio, env });
				}

				tunnelProcess.stdout!.pipe(process.stdout);
				tunnelProcess.stderr!.pipe(process.stderr);
				tunnelProcess.on('exit', resolve);
				tunnelProcess.on('error', reject);
			});
		}
	}

	// Help (general)
	if (args.help) {
		const executable = `${product.applicationName}${isWindows ? '.exe' : ''}`;
		console.log(buildHelpMessage(product.nameLong, executable, product.version, OPTIONS));
	}

	// Help (chat)
	else if (args.chat?.help) {
		const executable = `${product.applicationName}${isWindows ? '.exe' : ''}`;
		console.log(buildHelpMessage(product.nameLong, executable, product.version, OPTIONS.chat.options, { isChat: true }));
	}

	// Version Info
	else if (args.version) {
		console.log(buildVersionMessage(product.version, product.commit));
	}

	// Shell integration
	else if (args['locate-shell-integration-path']) {
		let file: string;
		switch (args['locate-shell-integration-path']) {
			// Usage: `[[ "$TERM_PROGRAM" == "vscode" ]] && . "$(code --locate-shell-integration-path bash)"`
			case 'bash': file = 'shellIntegration-bash.sh'; break;
			// Usage: `if ($env:TERM_PROGRAM -eq "vscode") { . "$(code --locate-shell-integration-path pwsh)" }`
			case 'pwsh': file = 'shellIntegration.ps1'; break;
			// Usage: `[[ "$TERM_PROGRAM" == "vscode" ]] && . "$(code --locate-shell-integration-path zsh)"`
			case 'zsh': file = 'shellIntegration-rc.zsh'; break;
			// Usage: `string match -q "$TERM_PROGRAM" "vscode"; and . (code --locate-shell-integration-path fish)`
			case 'fish': file = 'shellIntegration.fish'; break;
			default: throw new Error('Error using --locate-shell-integration-path: Invalid shell type');
		}
		console.log(join(getAppRoot(), 'out', 'vs', 'workbench', 'contrib', 'terminal', 'common', 'scripts', file));
	}

	// Extensions Management
	else if (shouldSpawnCliProcess(args)) {

		// We do not bundle `cliProcessMain.js` into this file because
		// it is rather large and only needed for very few CLI operations.
		// This has the downside that we need to know if we run OSS or
		// built, because our location on disk is different if built.

		let cliProcessMain: string;
		if (process.env['VSCODE_DEV']) {
			cliProcessMain = './cliProcessMain.js';
		} else {
			cliProcessMain = './vs/code/node/cliProcessMain.js';
		}

		const cli = await import(cliProcessMain);
		await cli.main(args);

		return;
	}

	// Write File
	else if (args['file-write']) {
		const argsFile = args._[0];
		if (!argsFile || !isAbsolute(argsFile) || !existsSync(argsFile) || !statSync(argsFile).isFile()) {
			throw new Error('Using --file-write with invalid arguments.');
		}

		let source: string | undefined;
		let target: string | undefined;
		try {
			const argsContents: { source: string; target: string } = JSON.parse(readFileSync(argsFile, 'utf8'));
			source = argsContents.source;
			target = argsContents.target;
		} catch (error) {
			throw new Error('Using --file-write with invalid arguments.');
		}

		// Windows: set the paths as allowed UNC paths given
		// they are explicitly provided by the user as arguments
		if (isWindows) {
			for (const path of [source, target]) {
				if (typeof path === 'string' && isUNC(path)) {
					addUNCHostToAllowlist(URI.file(path).authority);
				}
			}
		}

		// Validate
		if (
			!source || !target || source === target ||				// make sure source and target are provided and are not the same
			!isAbsolute(source) || !isAbsolute(target) ||			// make sure both source and target are absolute paths
			!existsSync(source) || !statSync(source).isFile() ||	// make sure source exists as file
			!existsSync(target) || !statSync(target).isFile()		// make sure target exists as file
		) {
			throw new Error('Using --file-write with invalid arguments.');
		}

		try {

			// Check for readonly status and chmod if so if we are told so
			let targetMode = 0;
			let restoreMode = false;
			if (args['file-chmod']) {
				targetMode = statSync(target).mode;
				if (!(targetMode & 0o200 /* File mode indicating writable by owner */)) {
					chmodSync(target, targetMode | 0o200);
					restoreMode = true;
				}
			}

			// Write source to target
			const data = readFileSync(source);
			if (isWindows) {
				// On Windows we use a different strategy of saving the file
				// by first truncating the file and then writing with r+ mode.
				// This helps to save hidden files on Windows
				// (see https://github.com/microsoft/vscode/issues/931) and
				// prevent removing alternate data streams
				// (see https://github.com/microsoft/vscode/issues/6363)
				truncateSync(target, 0);
				writeFileSync(target, data, { flag: 'r+' });
			} else {
				writeFileSync(target, data);
			}

			// Restore previous mode as needed
			if (restoreMode) {
				chmodSync(target, targetMode);
			}
		} catch (error) {
			error.message = `Error using --file-write: ${error.message}`;
			throw error;
		}
	}

	// Just Code
	else {
		const env: IProcessEnvironment = {
			...process.env,
			'ELECTRON_NO_ATTACH_CONSOLE': '1'
		};

		delete env['ELECTRON_RUN_AS_NODE'];

		const processCallbacks: ((child: ChildProcess) => Promise<void>)[] = [];

		if (args.verbose) {
			env['ELECTRON_ENABLE_LOGGING'] = '1';
		}

		if (args.verbose || args.status) {
			processCallbacks.push(async child => {
				child.stdout?.on('data', (data: Buffer) => console.log(data.toString('utf8').trim()));
				child.stderr?.on('data', (data: Buffer) => console.log(data.toString('utf8').trim()));

				await Event.toPromise(Event.fromNodeEventEmitter(child, 'exit'));
			});
		}

		// Handle --transient option
		if (args['transient']) {
			const tempParentDir = randomPath(tmpdir(), 'vscode');
			const tempUserDataDir = join(tempParentDir, 'data');
			const tempExtensionsDir = join(tempParentDir, 'extensions');

			addArg(argv, '--user-data-dir', tempUserDataDir);
			addArg(argv, '--extensions-dir', tempExtensionsDir);

			console.log(`State is temporarily stored. Relaunch this state with: ${product.applicationName} --user-data-dir "${tempUserDataDir}" --extensions-dir "${tempExtensionsDir}"`);
		}

		const hasReadStdinArg = args._.some(arg => arg === '-') || args.chat?._.some(arg => arg === '-');
		if (hasReadStdinArg) {
			// remove the "-" argument when we read from stdin
			args._ = args._.filter(a => a !== '-');
			argv = argv.filter(a => a !== '-');
		}

		let stdinFilePath: string | undefined;
		if (hasStdinWithoutTty()) {

			// Read from stdin: we require a single "-" argument to be passed in order to start reading from
			// stdin. We do this because there is no reliable way to find out if data is piped to stdin. Just
			// checking for stdin being connected to a TTY is not enough (https://github.com/microsoft/vscode/issues/40351)

			if (hasReadStdinArg) {
				stdinFilePath = getStdinFilePath();

				try {
					const readFromStdinDone = new DeferredPromise<void>();
					await readFromStdin(stdinFilePath, !!args.verbose, () => readFromStdinDone.complete());
					if (!args.wait) {

						// if `--wait` is not provided, we keep this process alive
						// for at least as long as the stdin stream is open to
						// ensure that we read all the data.
						// the downside is that the Code CLI process will then not
						// terminate until stdin is closed, but users can always
						// pass `--wait` to prevent that from happening (this is
						// actually what we enforced until v1.85.x but then was
						// changed to not enforce it anymore).
						// a solution in the future would possibly be to exit, when
						// the Code process exits. this would require some careful
						// solution though in case Code is already running and this
						// is a second instance telling the first instance what to
						// open.

						processCallbacks.push(() => readFromStdinDone.p);
					}

					if (args.chat) {
						// Make sure to add tmp file as context to chat
						addArg(argv, '--add-file', stdinFilePath);
					} else {
						// Make sure to open tmp file as editor but ignore
						// it in the "recently open" list
						addArg(argv, stdinFilePath);
						addArg(argv, '--skip-add-to-recently-opened');
					}

					console.log(`Reading from stdin via: ${stdinFilePath}`);
				} catch (e) {
					console.log(`Failed to create file to read via stdin: ${e.toString()}`);
					stdinFilePath = undefined;
				}
			} else {

				// If the user pipes data via stdin but forgot to add the "-" argument, help by printing a message
				// if we detect that data flows into via stdin after a certain timeout.
				processCallbacks.push(_ => stdinDataListener(1000).then(dataReceived => {
					if (dataReceived) {
						console.log(buildStdinMessage(product.applicationName, !!args.chat));
					}
				}));
			}
		}

		// If we are started with --wait create a random temporary file
		// and pass it over to the starting instance. We can use this file
		// to wait for it to be deleted to monitor that the edited file
		// is closed and then exit the waiting process.
		let waitMarkerFilePath: string | undefined;
		if (args.wait) {
			waitMarkerFilePath = createWaitMarkerFileSync(args.verbose);
			if (waitMarkerFilePath) {
				addArg(argv, '--waitMarkerFilePath', waitMarkerFilePath);
			}

			// When running with --wait, we want to continue running CLI process
			// until either:
			// - the wait marker file has been deleted (e.g. when closing the editor)
			// - the launched process terminates (e.g. due to a crash)
			processCallbacks.push(async child => {
				let childExitPromise;
				if (isMacintosh) {
					// On macOS, we resolve the following promise only when the child,
					// i.e. the open command, exited with a signal or error. Otherwise, we
					// wait for the marker file to be deleted or for the child to error.
					childExitPromise = new Promise<void>(resolve => {
						// Only resolve this promise if the child (i.e. open) exited with an error
						child.on('exit', (code, signal) => {
							if (code !== 0 || signal) {
								resolve();
							}
						});
					});
				} else {
					// On other platforms, we listen for exit in case the child exits before the
					// marker file is deleted.
					childExitPromise = Event.toPromise(Event.fromNodeEventEmitter(child, 'exit'));
				}
				try {
					await Promise.race([
						whenDeleted(waitMarkerFilePath!),
						Event.toPromise(Event.fromNodeEventEmitter(child, 'error')),
						childExitPromise
					]);
				} finally {
					if (stdinFilePath) {
						unlinkSync(stdinFilePath); // Make sure to delete the tmp stdin file if we have any
					}
				}
			});
		}

		// If we have been started with `--prof-startup` we need to find free ports to profile
		// the main process, the renderer, and the extension host. We also disable v8 cached data
		// to get better profile traces. Last, we listen on stdout for a signal that tells us to
		// stop profiling.
		if (args['prof-startup']) {
			const profileHost = '127.0.0.1';
			const portMain = await findFreePort(randomPort(), 10, 3000);
			const portRenderer = await findFreePort(portMain + 1, 10, 3000);
			const portExthost = await findFreePort(portRenderer + 1, 10, 3000);

			// fail the operation when one of the ports couldn't be acquired.
			if (portMain * portRenderer * portExthost === 0) {
				throw new Error('Failed to find free ports for profiler. Make sure to shutdown all instances of the editor first.');
			}

			const filenamePrefix = randomPath(homedir(), 'prof');

			addArg(argv, `--inspect-brk=${profileHost}:${portMain}`);
			addArg(argv, `--remote-debugging-port=${profileHost}:${portRenderer}`);
			addArg(argv, `--inspect-brk-extensions=${profileHost}:${portExthost}`);
			addArg(argv, `--prof-startup-prefix`, filenamePrefix);
			addArg(argv, `--no-cached-data`);

			writeFileSync(filenamePrefix, argv.slice(-6).join('|'));

			processCallbacks.push(async _child => {

				class Profiler {
					static async start(name: string, filenamePrefix: string, opts: { port: number; tries?: number; target?: (targets: Target[]) => Target }) {
						const profiler = await import('v8-inspect-profiler');

						let session: ProfilingSession;
						try {
							session = await profiler.startProfiling({ ...opts, host: profileHost });
						} catch (err) {
							console.error(`FAILED to start profiling for '${name}' on port '${opts.port}'`);
						}

						return {
							async stop() {
								if (!session) {
									return;
								}
								let suffix = '';
								const result = await session.stop();
								if (!process.env['VSCODE_DEV']) {
									// when running from a not-development-build we remove
									// absolute filenames because we don't want to reveal anything
									// about users. We also append the `.txt` suffix to make it
									// easier to attach these files to GH issues
									result.profile = Utils.rewriteAbsolutePaths(result.profile, 'piiRemoved');
									suffix = '.txt';
								}

								writeFileSync(`${filenamePrefix}.${name}.cpuprofile${suffix}`, JSON.stringify(result.profile, undefined, 4));
							}
						};
					}
				}

				try {
					// load and start profiler
					const mainProfileRequest = Profiler.start('main', filenamePrefix, { port: portMain });
					const extHostProfileRequest = Profiler.start('extHost', filenamePrefix, { port: portExthost, tries: 300 });
					const rendererProfileRequest = Profiler.start('renderer', filenamePrefix, {
						port: portRenderer,
						tries: 200,
						target: function (targets) {
							return targets.filter(target => {
								if (!target.webSocketDebuggerUrl) {
									return false;
								}
								if (target.type === 'page') {
									return target.url.indexOf('workbench/workbench.html') > 0 || target.url.indexOf('workbench/workbench-dev.html') > 0;
								} else {
									return true;
								}
							})[0];
						}
					});

					const main = await mainProfileRequest;
					const extHost = await extHostProfileRequest;
					const renderer = await rendererProfileRequest;

					// wait for the renderer to delete the marker file
					await whenDeleted(filenamePrefix);

					// stop profiling
					await main.stop();
					await renderer.stop();
					await extHost.stop();

					// re-create the marker file to signal that profiling is done
					writeFileSync(filenamePrefix, '');

				} catch (e) {
					console.error('Failed to profile startup. Make sure to quit Code first.');
				}
			});
		}

		const options: SpawnOptions = {
			detached: true,
			env
		};

		if (!args.verbose) {
			options['stdio'] = 'ignore';
		}

		let child: ChildProcess;
		if (!isMacintosh) {
			if (!args.verbose && args.status) {
				options['stdio'] = ['ignore', 'pipe', 'ignore']; // restore ability to see output when --status is used
			}
			// We spawn process.execPath directly
			child = spawn(process.execPath, argv.slice(2), options);
		} else {
			// On macOS, we spawn using the open command to obtain behavior
			// similar to if the app was launched from the dock
			// https://github.com/microsoft/vscode/issues/102975

			// The following args are for the open command itself, rather than for VS Code:
			// -n creates a new instance.
			//    Without -n, the open command re-opens the existing instance as-is.
			// -g starts the new instance in the background.
			//    Later, Electron brings the instance to the foreground.
			//    This way, Mac does not automatically try to foreground the new instance, which causes
			//    focusing issues when the new instance only sends data to a previous instance and then closes.
			const spawnArgs = ['-n', '-g'];
			// -a opens the given application.
			spawnArgs.push('-a', process.execPath); // -a: opens a specific application

			if (args.verbose || args.status) {
				spawnArgs.push('--wait-apps'); // `open --wait-apps`: blocks until the launched app is closed (even if they were already running)

				// The open command only allows for redirecting stderr and stdout to files,
				// so we make it redirect those to temp files, and then use a logger to
				// redirect the file output to the console
				for (const outputType of args.verbose ? ['stdout', 'stderr'] : ['stdout']) {

					// Tmp file to target output to
					const tmpName = randomPath(tmpdir(), `code-${outputType}`);
					writeFileSync(tmpName, '');
					spawnArgs.push(`--${outputType}`, tmpName);

					// Listener to redirect content to stdout/stderr
					processCallbacks.push(async child => {
						try {
							const stream = outputType === 'stdout' ? process.stdout : process.stderr;

							const cts = new CancellationTokenSource();
							child.on('close', () => {
								// We must dispose the token to stop watching,
								// but the watcher might still be reading data.
								setTimeout(() => cts.dispose(true), 200);
							});
							await watchFileContents(tmpName, chunk => stream.write(chunk), () => { /* ignore */ }, cts.token);
						} finally {
							unlinkSync(tmpName);
						}
					});
				}
			}

			for (const e in env) {
				// Ignore the _ env var, because the open command
				// ignores it anyway.
				// Pass the rest of the env vars in to fix
				// https://github.com/microsoft/vscode/issues/134696.
				if (e !== '_') {
					spawnArgs.push('--env');
					spawnArgs.push(`${e}=${env[e]}`);
				}
			}

			spawnArgs.push('--args', ...argv.slice(2)); // pass on our arguments

			if (env['VSCODE_DEV']) {
				// If we're in development mode, replace the . arg with the
				// vscode source arg. Because the OSS app isn't bundled,
				// it needs the full vscode source arg to launch properly.
				const curdir = '.';
				const launchDirIndex = spawnArgs.indexOf(curdir);
				if (launchDirIndex !== -1) {
					spawnArgs[launchDirIndex] = resolve(curdir);
				}
			}

			// We already passed over the env variables
			// using the --env flags, so we can leave them out here.
			// Also, we don't need to pass env._, which is different from argv._
			child = spawn('open', spawnArgs, { ...options, env: {} });
		}

		await Promise.all(processCallbacks.map(callback => callback(child)));
	}
}

function getAppRoot() {
	return dirname(FileAccess.asFileUri('').fsPath);
}

function eventuallyExit(code: number): void {
	setTimeout(() => process.exit(code), 0);
}

main(process.argv)
	.then(() => eventuallyExit(0))
	.then(null, err => {
		console.error(err.message || err.stack || err);
		eventuallyExit(1);
	});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/code/node/cliProcessMain.ts]---
Location: vscode-main/src/vs/code/node/cliProcessMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { setDefaultResultOrder } from 'dns';
import * as fs from 'fs';
import { hostname, release } from 'os';
import { raceTimeout } from '../../base/common/async.js';
import { toErrorMessage } from '../../base/common/errorMessage.js';
import { isSigPipeError, onUnexpectedError, setUnexpectedErrorHandler } from '../../base/common/errors.js';
import { Disposable } from '../../base/common/lifecycle.js';
import { Schemas } from '../../base/common/network.js';
import { isAbsolute, join } from '../../base/common/path.js';
import { isWindows, isMacintosh, isLinux } from '../../base/common/platform.js';
import { cwd } from '../../base/common/process.js';
import { URI } from '../../base/common/uri.js';
import { IConfigurationService } from '../../platform/configuration/common/configuration.js';
import { ConfigurationService } from '../../platform/configuration/common/configurationService.js';
import { IDownloadService } from '../../platform/download/common/download.js';
import { DownloadService } from '../../platform/download/common/downloadService.js';
import { NativeParsedArgs } from '../../platform/environment/common/argv.js';
import { INativeEnvironmentService } from '../../platform/environment/common/environment.js';
import { NativeEnvironmentService } from '../../platform/environment/node/environmentService.js';
import { ExtensionGalleryServiceWithNoStorageService } from '../../platform/extensionManagement/common/extensionGalleryService.js';
import { IAllowedExtensionsService, IExtensionGalleryService, InstallOptions } from '../../platform/extensionManagement/common/extensionManagement.js';
import { ExtensionSignatureVerificationService, IExtensionSignatureVerificationService } from '../../platform/extensionManagement/node/extensionSignatureVerificationService.js';
import { ExtensionManagementCLI } from '../../platform/extensionManagement/common/extensionManagementCLI.js';
import { IExtensionsProfileScannerService } from '../../platform/extensionManagement/common/extensionsProfileScannerService.js';
import { IExtensionsScannerService } from '../../platform/extensionManagement/common/extensionsScannerService.js';
import { ExtensionManagementService, INativeServerExtensionManagementService } from '../../platform/extensionManagement/node/extensionManagementService.js';
import { ExtensionsScannerService } from '../../platform/extensionManagement/node/extensionsScannerService.js';
import { IFileService } from '../../platform/files/common/files.js';
import { FileService } from '../../platform/files/common/fileService.js';
import { DiskFileSystemProvider } from '../../platform/files/node/diskFileSystemProvider.js';
import { SyncDescriptor } from '../../platform/instantiation/common/descriptors.js';
import { IInstantiationService } from '../../platform/instantiation/common/instantiation.js';
import { InstantiationService } from '../../platform/instantiation/common/instantiationService.js';
import { ServiceCollection } from '../../platform/instantiation/common/serviceCollection.js';
import { ILanguagePackService } from '../../platform/languagePacks/common/languagePacks.js';
import { NativeLanguagePackService } from '../../platform/languagePacks/node/languagePacks.js';
import { ConsoleLogger, getLogLevel, ILogger, ILoggerService, ILogService, LogLevel } from '../../platform/log/common/log.js';
import { FilePolicyService } from '../../platform/policy/common/filePolicyService.js';
import { IPolicyService, NullPolicyService } from '../../platform/policy/common/policy.js';
import { NativePolicyService } from '../../platform/policy/node/nativePolicyService.js';
import product from '../../platform/product/common/product.js';
import { IProductService } from '../../platform/product/common/productService.js';
import { IRequestService } from '../../platform/request/common/request.js';
import { RequestService } from '../../platform/request/node/requestService.js';
import { SaveStrategy, StateReadonlyService } from '../../platform/state/node/stateService.js';
import { resolveCommonProperties } from '../../platform/telemetry/common/commonProperties.js';
import { ITelemetryService } from '../../platform/telemetry/common/telemetry.js';
import { ITelemetryServiceConfig, TelemetryService } from '../../platform/telemetry/common/telemetryService.js';
import { supportsTelemetry, NullTelemetryService, getPiiPathsFromEnvironment, isInternalTelemetry, ITelemetryAppender } from '../../platform/telemetry/common/telemetryUtils.js';
import { OneDataSystemAppender } from '../../platform/telemetry/node/1dsAppender.js';
import { buildTelemetryMessage } from '../../platform/telemetry/node/telemetry.js';
import { IUriIdentityService } from '../../platform/uriIdentity/common/uriIdentity.js';
import { UriIdentityService } from '../../platform/uriIdentity/common/uriIdentityService.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../platform/userDataProfile/common/userDataProfile.js';
import { UserDataProfilesReadonlyService } from '../../platform/userDataProfile/node/userDataProfile.js';
import { resolveMachineId, resolveSqmId, resolveDevDeviceId } from '../../platform/telemetry/node/telemetryUtils.js';
import { ExtensionsProfileScannerService } from '../../platform/extensionManagement/node/extensionsProfileScannerService.js';
import { LogService } from '../../platform/log/common/logService.js';
import { LoggerService } from '../../platform/log/node/loggerService.js';
import { localize } from '../../nls.js';
import { FileUserDataProvider } from '../../platform/userData/common/fileUserDataProvider.js';
import { addUNCHostToAllowlist, getUNCHost } from '../../base/node/unc.js';
import { AllowedExtensionsService } from '../../platform/extensionManagement/common/allowedExtensionsService.js';
import { McpManagementCli } from '../../platform/mcp/common/mcpManagementCli.js';
import { IExtensionGalleryManifestService } from '../../platform/extensionManagement/common/extensionGalleryManifest.js';
import { ExtensionGalleryManifestService } from '../../platform/extensionManagement/common/extensionGalleryManifestService.js';
import { IAllowedMcpServersService, IMcpGalleryService, IMcpManagementService } from '../../platform/mcp/common/mcpManagement.js';
import { McpManagementService } from '../../platform/mcp/node/mcpManagementService.js';
import { IMcpResourceScannerService, McpResourceScannerService } from '../../platform/mcp/common/mcpResourceScannerService.js';
import { McpGalleryService } from '../../platform/mcp/common/mcpGalleryService.js';
import { AllowedMcpServersService } from '../../platform/mcp/common/allowedMcpServersService.js';
import { IMcpGalleryManifestService } from '../../platform/mcp/common/mcpGalleryManifest.js';
import { McpGalleryManifestService } from '../../platform/mcp/common/mcpGalleryManifestService.js';
import { LINUX_SYSTEM_POLICY_FILE_PATH } from '../../base/common/policy.js';

class CliMain extends Disposable {

	constructor(
		private argv: NativeParsedArgs
	) {
		super();

		this.registerListeners();
	}

	private registerListeners(): void {

		// Dispose on exit
		process.once('exit', () => this.dispose());
	}

	async run(): Promise<void> {

		// Services
		const [instantiationService, appenders] = await this.initServices();

		return instantiationService.invokeFunction(async accessor => {
			const logService = accessor.get(ILogService);
			const fileService = accessor.get(IFileService);
			const environmentService = accessor.get(INativeEnvironmentService);
			const userDataProfilesService = accessor.get(IUserDataProfilesService);

			// Log info
			logService.info('CLI main', this.argv);

			// Error handler
			this.registerErrorHandler(logService);

			// DNS result order
			// Refs https://github.com/microsoft/vscode/issues/264136
			setDefaultResultOrder('ipv4first');

			// Run based on argv
			await this.doRun(environmentService, fileService, userDataProfilesService, instantiationService);

			// Flush the remaining data in AI adapter (with 1s timeout)
			await Promise.all(appenders.map(a => {
				raceTimeout(a.flush(), 1000);
			}));
			return;
		});
	}

	private async initServices(): Promise<[IInstantiationService, ITelemetryAppender[]]> {
		const services = new ServiceCollection();

		// Product
		const productService = { _serviceBrand: undefined, ...product };
		services.set(IProductService, productService);

		// Environment
		const environmentService = new NativeEnvironmentService(this.argv, productService);
		services.set(INativeEnvironmentService, environmentService);

		// Init folders
		await Promise.all([
			this.allowWindowsUNCPath(environmentService.appSettingsHome.with({ scheme: Schemas.file }).fsPath),
			this.allowWindowsUNCPath(environmentService.extensionsPath)
		].map(path => path ? fs.promises.mkdir(path, { recursive: true }) : undefined));

		// Logger
		const loggerService = new LoggerService(getLogLevel(environmentService), environmentService.logsHome);
		services.set(ILoggerService, loggerService);

		// Log
		const logger = this._register(loggerService.createLogger('cli', { name: localize('cli', "CLI") }));
		const otherLoggers: ILogger[] = [];
		if (loggerService.getLogLevel() === LogLevel.Trace) {
			otherLoggers.push(new ConsoleLogger(loggerService.getLogLevel()));
		}

		const logService = this._register(new LogService(logger, otherLoggers));
		services.set(ILogService, logService);

		// Files
		const fileService = this._register(new FileService(logService));
		services.set(IFileService, fileService);

		const diskFileSystemProvider = this._register(new DiskFileSystemProvider(logService));
		fileService.registerProvider(Schemas.file, diskFileSystemProvider);

		// Uri Identity
		const uriIdentityService = new UriIdentityService(fileService);
		services.set(IUriIdentityService, uriIdentityService);

		// User Data Profiles
		const stateService = new StateReadonlyService(SaveStrategy.DELAYED, environmentService, logService, fileService);
		const userDataProfilesService = new UserDataProfilesReadonlyService(stateService, uriIdentityService, environmentService, fileService, logService);
		services.set(IUserDataProfilesService, userDataProfilesService);

		// Use FileUserDataProvider for user data to
		// enable atomic read / write operations.
		fileService.registerProvider(Schemas.vscodeUserData, new FileUserDataProvider(Schemas.file, diskFileSystemProvider, Schemas.vscodeUserData, userDataProfilesService, uriIdentityService, logService));

		// Policy
		let policyService: IPolicyService | undefined;
		if (isWindows && productService.win32RegValueName) {
			policyService = this._register(new NativePolicyService(logService, productService.win32RegValueName));
		} else if (isMacintosh && productService.darwinBundleIdentifier) {
			policyService = this._register(new NativePolicyService(logService, productService.darwinBundleIdentifier));
		} else if (isLinux) {
			policyService = this._register(new FilePolicyService(URI.file(LINUX_SYSTEM_POLICY_FILE_PATH), fileService, logService));
		} else if (environmentService.policyFile) {
			policyService = this._register(new FilePolicyService(environmentService.policyFile, fileService, logService));
		} else {
			policyService = new NullPolicyService();
		}
		services.set(IPolicyService, policyService);

		// Configuration
		const configurationService = this._register(new ConfigurationService(userDataProfilesService.defaultProfile.settingsResource, fileService, policyService, logService));
		services.set(IConfigurationService, configurationService);

		// Initialize
		await Promise.all([
			stateService.init(),
			configurationService.initialize()
		]);

		// Get machine ID
		let machineId: string | undefined = undefined;
		try {
			machineId = await resolveMachineId(stateService, logService);
		} catch (error) {
			if (error.code !== 'ENOENT') {
				logService.error(error);
			}
		}
		const sqmId = await resolveSqmId(stateService, logService);
		const devDeviceId = await resolveDevDeviceId(stateService, logService);

		// Initialize user data profiles after initializing the state
		userDataProfilesService.init();

		// URI Identity
		services.set(IUriIdentityService, new UriIdentityService(fileService));

		// Request
		const requestService = new RequestService('local', configurationService, environmentService, logService);
		services.set(IRequestService, requestService);

		// Download Service
		services.set(IDownloadService, new SyncDescriptor(DownloadService, undefined, true));

		// Extensions
		services.set(IExtensionsProfileScannerService, new SyncDescriptor(ExtensionsProfileScannerService, undefined, true));
		services.set(IExtensionsScannerService, new SyncDescriptor(ExtensionsScannerService, undefined, true));
		services.set(IExtensionSignatureVerificationService, new SyncDescriptor(ExtensionSignatureVerificationService, undefined, true));
		services.set(IAllowedExtensionsService, new SyncDescriptor(AllowedExtensionsService, undefined, true));
		services.set(INativeServerExtensionManagementService, new SyncDescriptor(ExtensionManagementService, undefined, true));
		services.set(IExtensionGalleryManifestService, new SyncDescriptor(ExtensionGalleryManifestService));
		services.set(IExtensionGalleryService, new SyncDescriptor(ExtensionGalleryServiceWithNoStorageService, undefined, true));

		// Localizations
		services.set(ILanguagePackService, new SyncDescriptor(NativeLanguagePackService, undefined, false));

		// MCP
		services.set(IAllowedMcpServersService, new SyncDescriptor(AllowedMcpServersService, undefined, true));
		services.set(IMcpResourceScannerService, new SyncDescriptor(McpResourceScannerService, undefined, true));
		services.set(IMcpGalleryManifestService, new SyncDescriptor(McpGalleryManifestService, undefined, true));
		services.set(IMcpGalleryService, new SyncDescriptor(McpGalleryService, undefined, true));
		services.set(IMcpManagementService, new SyncDescriptor(McpManagementService, undefined, true));

		// Telemetry
		const appenders: ITelemetryAppender[] = [];
		const isInternal = isInternalTelemetry(productService, configurationService);
		if (supportsTelemetry(productService, environmentService)) {
			if (productService.aiConfig?.ariaKey) {
				appenders.push(new OneDataSystemAppender(requestService, isInternal, 'monacoworkbench', null, productService.aiConfig.ariaKey));
			}

			const config: ITelemetryServiceConfig = {
				appenders,
				sendErrorTelemetry: false,
				commonProperties: resolveCommonProperties(release(), hostname(), process.arch, productService.commit, productService.version, machineId, sqmId, devDeviceId, isInternal, productService.date),
				piiPaths: getPiiPathsFromEnvironment(environmentService)
			};

			services.set(ITelemetryService, new SyncDescriptor(TelemetryService, [config], false));

		} else {
			services.set(ITelemetryService, NullTelemetryService);
		}

		return [new InstantiationService(services), appenders];
	}

	private allowWindowsUNCPath(path: string): string {
		if (isWindows) {
			const host = getUNCHost(path);
			if (host) {
				addUNCHostToAllowlist(host);
			}
		}

		return path;
	}

	private registerErrorHandler(logService: ILogService): void {

		// Install handler for unexpected errors
		setUnexpectedErrorHandler(error => {
			const message = toErrorMessage(error, true);
			if (!message) {
				return;
			}

			logService.error(`[uncaught exception in CLI]: ${message}`);
		});

		// Handle unhandled errors that can occur
		process.on('uncaughtException', err => {
			if (!isSigPipeError(err)) {
				onUnexpectedError(err);
			}
		});
		process.on('unhandledRejection', (reason: unknown) => onUnexpectedError(reason));
	}

	private async doRun(environmentService: INativeEnvironmentService, fileService: IFileService, userDataProfilesService: IUserDataProfilesService, instantiationService: IInstantiationService): Promise<void> {
		let profile: IUserDataProfile | undefined = undefined;
		if (environmentService.args.profile) {
			profile = userDataProfilesService.profiles.find(p => p.name === environmentService.args.profile);
			if (!profile) {
				throw new Error(`Profile '${environmentService.args.profile}' not found.`);
			}
		}
		const profileLocation = (profile ?? userDataProfilesService.defaultProfile).extensionsResource;

		// List Extensions
		if (this.argv['list-extensions']) {
			return instantiationService.createInstance(ExtensionManagementCLI, new ConsoleLogger(LogLevel.Info, false)).listExtensions(!!this.argv['show-versions'], this.argv['category'], profileLocation);
		}

		// Install Extension
		else if (this.argv['install-extension'] || this.argv['install-builtin-extension']) {
			const installOptions: InstallOptions = { isMachineScoped: !!this.argv['do-not-sync'], installPreReleaseVersion: !!this.argv['pre-release'], donotIncludePackAndDependencies: !!this.argv['do-not-include-pack-dependencies'], profileLocation };
			return instantiationService.createInstance(ExtensionManagementCLI, new ConsoleLogger(LogLevel.Info, false)).installExtensions(this.asExtensionIdOrVSIX(this.argv['install-extension'] || []), this.asExtensionIdOrVSIX(this.argv['install-builtin-extension'] || []), installOptions, !!this.argv['force']);
		}

		// Uninstall Extension
		else if (this.argv['uninstall-extension']) {
			return instantiationService.createInstance(ExtensionManagementCLI, new ConsoleLogger(LogLevel.Info, false)).uninstallExtensions(this.asExtensionIdOrVSIX(this.argv['uninstall-extension']), !!this.argv['force'], profileLocation);
		}

		else if (this.argv['update-extensions']) {
			return instantiationService.createInstance(ExtensionManagementCLI, new ConsoleLogger(LogLevel.Info, false)).updateExtensions(profileLocation);
		}

		// Locate Extension
		else if (this.argv['locate-extension']) {
			return instantiationService.createInstance(ExtensionManagementCLI, new ConsoleLogger(LogLevel.Info, false)).locateExtension(this.argv['locate-extension']);
		}

		// Install MCP server
		else if (this.argv['add-mcp']) {
			return instantiationService.createInstance(McpManagementCli, new ConsoleLogger(LogLevel.Info, false)).addMcpDefinitions(this.argv['add-mcp']);
		}

		// Telemetry
		else if (this.argv['telemetry']) {
			console.log(await buildTelemetryMessage(environmentService.appRoot, environmentService.extensionsPath));
		}
	}

	private asExtensionIdOrVSIX(inputs: string[]): (string | URI)[] {
		return inputs.map(input => /\.vsix$/i.test(input) ? URI.file(isAbsolute(input) ? input : join(cwd(), input)) : input);
	}
}

export async function main(argv: NativeParsedArgs): Promise<void> {
	const cliMain = new CliMain(argv);

	try {
		await cliMain.run();
	} finally {
		cliMain.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/editor.all.ts]---
Location: vscode-main/src/vs/editor/editor.all.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './browser/coreCommands.js';
import './browser/widget/codeEditor/codeEditorWidget.js';
import './browser/widget/diffEditor/diffEditor.contribution.js';
import './contrib/anchorSelect/browser/anchorSelect.js';
import './contrib/bracketMatching/browser/bracketMatching.js';
import './contrib/caretOperations/browser/caretOperations.js';
import './contrib/caretOperations/browser/transpose.js';
import './contrib/clipboard/browser/clipboard.js';
import './contrib/codeAction/browser/codeActionContributions.js';
import './contrib/codelens/browser/codelensController.js';
import './contrib/colorPicker/browser/colorPickerContribution.js';
import './contrib/comment/browser/comment.js';
import './contrib/contextmenu/browser/contextmenu.js';
import './contrib/cursorUndo/browser/cursorUndo.js';
import './contrib/dnd/browser/dnd.js';
import './contrib/dropOrPasteInto/browser/copyPasteContribution.js';
import './contrib/dropOrPasteInto/browser/dropIntoEditorContribution.js';
import './contrib/find/browser/findController.js';
import './contrib/folding/browser/folding.js';
import './contrib/fontZoom/browser/fontZoom.js';
import './contrib/format/browser/formatActions.js';
import './contrib/documentSymbols/browser/documentSymbols.js';
import './contrib/inlineCompletions/browser/inlineCompletions.contribution.js';
import './contrib/inlineProgress/browser/inlineProgress.js';
import './contrib/gotoSymbol/browser/goToCommands.js';
import './contrib/gotoSymbol/browser/link/goToDefinitionAtPosition.js';
import './contrib/gotoError/browser/gotoError.js';
import './contrib/gpu/browser/gpuActions.js';
import './contrib/hover/browser/hoverContribution.js';
import './contrib/indentation/browser/indentation.js';
import './contrib/inlayHints/browser/inlayHintsContribution.js';
import './contrib/inPlaceReplace/browser/inPlaceReplace.js';
import './contrib/insertFinalNewLine/browser/insertFinalNewLine.js';
import './contrib/lineSelection/browser/lineSelection.js';
import './contrib/linesOperations/browser/linesOperations.js';
import './contrib/linkedEditing/browser/linkedEditing.js';
import './contrib/links/browser/links.js';
import './contrib/longLinesHelper/browser/longLinesHelper.js';
import './contrib/middleScroll/browser/middleScroll.contribution.js';
import './contrib/multicursor/browser/multicursor.js';
import './contrib/parameterHints/browser/parameterHints.js';
import './contrib/placeholderText/browser/placeholderText.contribution.js';
import './contrib/rename/browser/rename.js';
import './contrib/sectionHeaders/browser/sectionHeaders.js';
import './contrib/semanticTokens/browser/documentSemanticTokens.js';
import './contrib/semanticTokens/browser/viewportSemanticTokens.js';
import './contrib/smartSelect/browser/smartSelect.js';
import './contrib/snippet/browser/snippetController2.js';
import './contrib/stickyScroll/browser/stickyScrollContribution.js';
import './contrib/suggest/browser/suggestController.js';
import './contrib/suggest/browser/suggestInlineCompletions.js';
import './contrib/tokenization/browser/tokenization.js';
import './contrib/toggleTabFocusMode/browser/toggleTabFocusMode.js';
import './contrib/unicodeHighlighter/browser/unicodeHighlighter.js';
import './contrib/unusualLineTerminators/browser/unusualLineTerminators.js';
import './contrib/wordHighlighter/browser/wordHighlighter.js';
import './contrib/wordOperations/browser/wordOperations.js';
import './contrib/wordPartOperations/browser/wordPartOperations.js';
import './contrib/readOnlyMessage/browser/contribution.js';
import './contrib/diffEditorBreadcrumbs/browser/contribution.js';
import './contrib/floatingMenu/browser/floatingMenu.contribution.js';
import './browser/services/contribution.js';

// Load up these strings even in VSCode, even if they are not used
// in order to get them translated
import './common/standaloneStrings.js';

import '../base/browser/ui/codicons/codiconStyles.js'; // The codicons are defined here and must be loaded
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/editor.api.ts]---
Location: vscode-main/src/vs/editor/editor.api.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EditorOptions, WrappingIndent, EditorAutoIndentStrategy } from './common/config/editorOptions.js';
import { createMonacoBaseAPI } from './common/services/editorBaseApi.js';
import { createMonacoEditorAPI } from './standalone/browser/standaloneEditor.js';
import { createMonacoLanguagesAPI } from './standalone/browser/standaloneLanguages.js';
import { FormattingConflicts } from './contrib/format/browser/format.js';
import { getMonacoEnvironment } from '../base/browser/browser.js';

// Set defaults for standalone editor
EditorOptions.wrappingIndent.defaultValue = WrappingIndent.None;
EditorOptions.glyphMargin.defaultValue = false;
EditorOptions.autoIndent.defaultValue = EditorAutoIndentStrategy.Advanced;
EditorOptions.overviewRulerLanes.defaultValue = 2;

// We need to register a formatter selector which simply picks the first available formatter.
// See https://github.com/microsoft/monaco-editor/issues/2327
FormattingConflicts.setFormatterSelector((formatter, document, mode) => Promise.resolve(formatter[0]));

const api = createMonacoBaseAPI();
api.editor = createMonacoEditorAPI();
api.languages = createMonacoLanguagesAPI();
export const CancellationTokenSource = api.CancellationTokenSource;
export const Emitter = api.Emitter;
export const KeyCode = api.KeyCode;
export const KeyMod = api.KeyMod;
export const Position = api.Position;
export const Range = api.Range;
export const Selection = api.Selection;
export const SelectionDirection = api.SelectionDirection;
export const MarkerSeverity = api.MarkerSeverity;
export const MarkerTag = api.MarkerTag;
export const Uri = api.Uri;
export const Token = api.Token;
export const editor = api.editor;
export const languages = api.languages;

interface IFunctionWithAMD extends Function {
	amd?: boolean;
}

interface GlobalWithAMD {
	define?: IFunctionWithAMD;
	require?: { config?: (options: { ignoreDuplicateModules: string[] }) => void };
	monaco?: typeof api;
}

const monacoEnvironment = getMonacoEnvironment();
const globalWithAMD = globalThis as GlobalWithAMD;
if (monacoEnvironment?.globalAPI || (typeof globalWithAMD.define === 'function' && globalWithAMD.define.amd)) {
	globalWithAMD.monaco = api;
}

if (typeof globalWithAMD.require !== 'undefined' && typeof globalWithAMD.require.config === 'function') {
	globalWithAMD.require.config({
		ignoreDuplicateModules: [
			'vscode-languageserver-types',
			'vscode-languageserver-types/main',
			'vscode-languageserver-textdocument',
			'vscode-languageserver-textdocument/main',
			'vscode-nls',
			'vscode-nls/vscode-nls',
			'jsonc-parser',
			'jsonc-parser/main',
			'vscode-uri',
			'vscode-uri/index',
			'vs/basic-languages/typescript/typescript'
		]
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/editor.main.ts]---
Location: vscode-main/src/vs/editor/editor.main.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './editor.all.js';
import './standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js';
import './standalone/browser/inspectTokens/inspectTokens.js';
import './standalone/browser/quickAccess/standaloneHelpQuickAccess.js';
import './standalone/browser/quickAccess/standaloneGotoLineQuickAccess.js';
import './standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.js';
import './standalone/browser/quickAccess/standaloneCommandsQuickAccess.js';
import './standalone/browser/referenceSearch/standaloneReferenceSearch.js';
import './standalone/browser/toggleHighContrast/toggleHighContrast.js';

export * from './editor.api.js';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/editor.worker.start.ts]---
Location: vscode-main/src/vs/editor/editor.worker.start.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { initialize } from '../base/common/worker/webWorkerBootstrap.js';
import { EditorWorker, IWorkerContext } from './common/services/editorWebWorker.js';
import { EditorWorkerHost } from './common/services/editorWorkerHost.js';

/**
 * Used by `monaco-editor` to hook up web worker rpc.
 * @skipMangle
 * @internal
 */
export function start<THost extends object, TClient extends object>(createClient: (ctx: IWorkerContext<THost>) => TClient): TClient {
	let client: TClient | undefined;
	const webWorkerServer = initialize((workerServer) => {
		const editorWorkerHost = EditorWorkerHost.getChannel(workerServer);

		const host = new Proxy({}, {
			get(target, prop, receiver) {
				if (prop === 'then') {
					// Don't forward the call when the proxy is returned in an async function and the runtime tries to .then it.
					return undefined;
				}
				if (typeof prop !== 'string') {
					throw new Error(`Not supported`);
				}
				return (...args: unknown[]) => {
					return editorWorkerHost.$fhr(prop, args);
				};
			}
		});

		const ctx: IWorkerContext<THost> = {
			host: host as THost,
			getMirrorModels: () => {
				return webWorkerServer.requestHandler.getModels();
			}
		};

		client = createClient(ctx);

		return new EditorWorker(client);
	});

	return client!;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/coreCommands.ts]---
Location: vscode-main/src/vs/editor/browser/coreCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../nls.js';
import { isFirefox } from '../../base/browser/browser.js';
import { KeyCode, KeyMod } from '../../base/common/keyCodes.js';
import * as types from '../../base/common/types.js';
import { status } from '../../base/browser/ui/aria/aria.js';
import { ICodeEditor } from './editorBrowser.js';
import { Command, EditorCommand, ICommandOptions, registerEditorCommand, MultiCommand, UndoCommand, RedoCommand, SelectAllCommand } from './editorExtensions.js';
import { ICodeEditorService } from './services/codeEditorService.js';
import { ColumnSelection, IColumnSelectResult } from '../common/cursor/cursorColumnSelection.js';
import { CursorState, EditOperationType, IColumnSelectData, PartialCursorState } from '../common/cursorCommon.js';
import { DeleteOperations } from '../common/cursor/cursorDeleteOperations.js';
import { CursorChangeReason } from '../common/cursorEvents.js';
import { CursorMove as CursorMove_, CursorMoveCommands } from '../common/cursor/cursorMoveCommands.js';
import { TypeOperations } from '../common/cursor/cursorTypeOperations.js';
import { IPosition, Position } from '../common/core/position.js';
import { Range } from '../common/core/range.js';
import { Handler, ScrollType } from '../common/editorCommon.js';
import { EditorContextKeys } from '../common/editorContextKeys.js';
import { VerticalRevealType } from '../common/viewEvents.js';
import { ICommandMetadata } from '../../platform/commands/common/commands.js';
import { ContextKeyExpr } from '../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight, KeybindingsRegistry } from '../../platform/keybinding/common/keybindingsRegistry.js';
import { EditorOption } from '../common/config/editorOptions.js';
import { IViewModel } from '../common/viewModel.js';
import { ISelection } from '../common/core/selection.js';
import { getActiveElement, isEditableElement } from '../../base/browser/dom.js';
import { EnterOperation } from '../common/cursor/cursorTypeEditOperations.js';
import { TextEditorSelectionSource } from '../../platform/editor/common/editor.js';

const CORE_WEIGHT = KeybindingWeight.EditorCore;

export abstract class CoreEditorCommand<T> extends EditorCommand {
	public runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, args?: Partial<T> | null): void {
		const viewModel = editor._getViewModel();
		if (!viewModel) {
			// the editor has no view => has no cursors
			return;
		}
		this.runCoreEditorCommand(viewModel, args || {});
	}

	public abstract runCoreEditorCommand(viewModel: IViewModel, args: Partial<T>): void;
}

export namespace EditorScroll_ {

	const isEditorScrollArgs = function (arg: unknown): boolean {
		if (!types.isObject(arg)) {
			return false;
		}

		const scrollArg: RawArguments = arg as RawArguments;

		if (!types.isString(scrollArg.to)) {
			return false;
		}

		if (!types.isUndefined(scrollArg.by) && !types.isString(scrollArg.by)) {
			return false;
		}

		if (!types.isUndefined(scrollArg.value) && !types.isNumber(scrollArg.value)) {
			return false;
		}

		if (!types.isUndefined(scrollArg.revealCursor) && !types.isBoolean(scrollArg.revealCursor)) {
			return false;
		}

		return true;
	};

	export const metadata: ICommandMetadata = {
		description: 'Scroll editor in the given direction',
		args: [
			{
				name: 'Editor scroll argument object',
				description: `Property-value pairs that can be passed through this argument:
					* 'to': A mandatory direction value.
						\`\`\`
						'up', 'down'
						\`\`\`
					* 'by': Unit to move. Default is computed based on 'to' value.
						\`\`\`
						'line', 'wrappedLine', 'page', 'halfPage', 'editor'
						\`\`\`
					* 'value': Number of units to move. Default is '1'.
					* 'revealCursor': If 'true' reveals the cursor if it is outside view port.
				`,
				constraint: isEditorScrollArgs,
				schema: {
					'type': 'object',
					'required': ['to'],
					'properties': {
						'to': {
							'type': 'string',
							'enum': ['up', 'down']
						},
						'by': {
							'type': 'string',
							'enum': ['line', 'wrappedLine', 'page', 'halfPage', 'editor']
						},
						'value': {
							'type': 'number',
							'default': 1
						},
						'revealCursor': {
							'type': 'boolean',
						}
					}
				}
			}
		]
	};

	/**
	 * Directions in the view for editor scroll command.
	 */
	export const RawDirection = {
		Up: 'up',
		Right: 'right',
		Down: 'down',
		Left: 'left'
	};

	/**
	 * Units for editor scroll 'by' argument
	 */
	export const RawUnit = {
		Line: 'line',
		WrappedLine: 'wrappedLine',
		Page: 'page',
		HalfPage: 'halfPage',
		Editor: 'editor',
		Column: 'column'
	};

	/**
	 * Arguments for editor scroll command
	 */
	export interface RawArguments {
		to: string;
		by?: string;
		value?: number;
		revealCursor?: boolean;
		select?: boolean;
	}

	export function parse(args: Partial<RawArguments>): ParsedArguments | null {
		let direction: Direction;
		switch (args.to) {
			case RawDirection.Up:
				direction = Direction.Up;
				break;
			case RawDirection.Right:
				direction = Direction.Right;
				break;
			case RawDirection.Down:
				direction = Direction.Down;
				break;
			case RawDirection.Left:
				direction = Direction.Left;
				break;
			default:
				// Illegal arguments
				return null;
		}

		let unit: Unit;
		switch (args.by) {
			case RawUnit.Line:
				unit = Unit.Line;
				break;
			case RawUnit.WrappedLine:
				unit = Unit.WrappedLine;
				break;
			case RawUnit.Page:
				unit = Unit.Page;
				break;
			case RawUnit.HalfPage:
				unit = Unit.HalfPage;
				break;
			case RawUnit.Editor:
				unit = Unit.Editor;
				break;
			case RawUnit.Column:
				unit = Unit.Column;
				break;
			default:
				unit = Unit.WrappedLine;
		}

		const value = Math.floor(args.value || 1);
		const revealCursor = !!args.revealCursor;

		return {
			direction: direction,
			unit: unit,
			value: value,
			revealCursor: revealCursor,
			select: (!!args.select)
		};
	}

	export interface ParsedArguments {
		direction: Direction;
		unit: Unit;
		value: number;
		revealCursor: boolean;
		select: boolean;
	}


	export const enum Direction {
		Up = 1,
		Right = 2,
		Down = 3,
		Left = 4
	}

	export const enum Unit {
		Line = 1,
		WrappedLine = 2,
		Page = 3,
		HalfPage = 4,
		Editor = 5,
		Column = 6
	}
}

export namespace RevealLine_ {

	const isRevealLineArgs = function (arg: unknown): boolean {
		if (!types.isObject(arg)) {
			return false;
		}

		const reveaLineArg: RawArguments = arg as RawArguments;

		if (!types.isNumber(reveaLineArg.lineNumber) && !types.isString(reveaLineArg.lineNumber)) {
			return false;
		}

		if (!types.isUndefined(reveaLineArg.at) && !types.isString(reveaLineArg.at)) {
			return false;
		}

		return true;
	};

	export const metadata: ICommandMetadata = {
		description: 'Reveal the given line at the given logical position',
		args: [
			{
				name: 'Reveal line argument object',
				description: `Property-value pairs that can be passed through this argument:
					* 'lineNumber': A mandatory line number value.
					* 'at': Logical position at which line has to be revealed.
						\`\`\`
						'top', 'center', 'bottom'
						\`\`\`
				`,
				constraint: isRevealLineArgs,
				schema: {
					'type': 'object',
					'required': ['lineNumber'],
					'properties': {
						'lineNumber': {
							'type': ['number', 'string'],
						},
						'at': {
							'type': 'string',
							'enum': ['top', 'center', 'bottom']
						}
					}
				}
			}
		]
	};

	/**
	 * Arguments for reveal line command
	 */
	export interface RawArguments {
		lineNumber?: number | string;
		at?: string;
	}

	/**
	 * Values for reveal line 'at' argument
	 */
	export const RawAtArgument = {
		Top: 'top',
		Center: 'center',
		Bottom: 'bottom'
	};
}

abstract class EditorOrNativeTextInputCommand {

	constructor(target: MultiCommand) {
		// 1. handle case when focus is in editor.
		target.addImplementation(10000, 'code-editor', (accessor: ServicesAccessor, args: unknown) => {
			// Only if editor text focus (i.e. not if editor has widget focus).
			const focusedEditor = accessor.get(ICodeEditorService).getFocusedCodeEditor();
			if (focusedEditor && focusedEditor.hasTextFocus()) {
				return this._runEditorCommand(accessor, focusedEditor, args);
			}
			return false;
		});

		// 2. handle case when focus is in some other `input` / `textarea`.
		target.addImplementation(1000, 'generic-dom-input-textarea', (accessor: ServicesAccessor, args: unknown) => {
			// Only if focused on an element that allows for entering text
			const activeElement = getActiveElement();
			if (activeElement && isEditableElement(activeElement)) {
				this.runDOMCommand(activeElement);
				return true;
			}
			return false;
		});

		// 3. (default) handle case when focus is somewhere else.
		target.addImplementation(0, 'generic-dom', (accessor: ServicesAccessor, args: unknown) => {
			// Redirecting to active editor
			const activeEditor = accessor.get(ICodeEditorService).getActiveCodeEditor();
			if (activeEditor) {
				activeEditor.focus();
				return this._runEditorCommand(accessor, activeEditor, args);
			}
			return false;
		});
	}

	public _runEditorCommand(accessor: ServicesAccessor | null, editor: ICodeEditor, args: unknown): boolean | Promise<void> {
		const result = this.runEditorCommand(accessor, editor, args);
		if (result) {
			return result;
		}
		return true;
	}

	public abstract runDOMCommand(activeElement: Element): void;
	public abstract runEditorCommand(accessor: ServicesAccessor | null, editor: ICodeEditor, args: unknown): void | Promise<void>;
}

export const enum NavigationCommandRevealType {
	/**
	 * Do regular revealing.
	 */
	Regular = 0,
	/**
	 * Do only minimal revealing.
	 */
	Minimal = 1,
	/**
	 * Do not reveal the position.
	 */
	None = 2
}

export namespace CoreNavigationCommands {

	export interface BaseCommandOptions {
		source?: 'mouse' | 'keyboard' | string;
	}

	export interface MoveCommandOptions extends BaseCommandOptions {
		position: IPosition;
		viewPosition?: IPosition;
		revealType: NavigationCommandRevealType;
	}

	class BaseMoveToCommand extends CoreEditorCommand<MoveCommandOptions> {

		private readonly _inSelectionMode: boolean;

		constructor(opts: ICommandOptions & { inSelectionMode: boolean }) {
			super(opts);
			this._inSelectionMode = opts.inSelectionMode;
		}

		public runCoreEditorCommand(viewModel: IViewModel, args: Partial<MoveCommandOptions>): void {
			if (!args.position) {
				return;
			}
			viewModel.model.pushStackElement();
			const cursorStateChanged = viewModel.setCursorStates(
				args.source,
				CursorChangeReason.Explicit,
				[
					CursorMoveCommands.moveTo(viewModel, viewModel.getPrimaryCursorState(), this._inSelectionMode, args.position, args.viewPosition)
				]
			);
			if (cursorStateChanged && args.revealType !== NavigationCommandRevealType.None) {
				viewModel.revealAllCursors(args.source, true, true);
			}
		}
	}

	export const MoveTo: CoreEditorCommand<MoveCommandOptions> = registerEditorCommand(new BaseMoveToCommand({
		id: '_moveTo',
		inSelectionMode: false,
		precondition: undefined
	}));

	export const MoveToSelect: CoreEditorCommand<MoveCommandOptions> = registerEditorCommand(new BaseMoveToCommand({
		id: '_moveToSelect',
		inSelectionMode: true,
		precondition: undefined
	}));

	abstract class ColumnSelectCommand<T extends BaseCommandOptions = BaseCommandOptions> extends CoreEditorCommand<T> {
		public runCoreEditorCommand(viewModel: IViewModel, args: Partial<T>): void {
			viewModel.model.pushStackElement();
			const result = this._getColumnSelectResult(viewModel, viewModel.getPrimaryCursorState(), viewModel.getCursorColumnSelectData(), args);
			if (result === null) {
				// invalid arguments
				return;
			}
			viewModel.setCursorStates(args.source, CursorChangeReason.Explicit, result.viewStates.map((viewState) => CursorState.fromViewState(viewState)));
			viewModel.setCursorColumnSelectData({
				isReal: true,
				fromViewLineNumber: result.fromLineNumber,
				fromViewVisualColumn: result.fromVisualColumn,
				toViewLineNumber: result.toLineNumber,
				toViewVisualColumn: result.toVisualColumn
			});
			if (result.reversed) {
				viewModel.revealTopMostCursor(args.source);
			} else {
				viewModel.revealBottomMostCursor(args.source);
			}
		}

		protected abstract _getColumnSelectResult(viewModel: IViewModel, primary: CursorState, prevColumnSelectData: IColumnSelectData, args: Partial<T>): IColumnSelectResult | null;

	}

	export interface ColumnSelectCommandOptions extends BaseCommandOptions {
		position: IPosition;
		viewPosition: IPosition;
		mouseColumn: number;
		doColumnSelect: boolean;
	}

	export const ColumnSelect: CoreEditorCommand<ColumnSelectCommandOptions> = registerEditorCommand(new class extends ColumnSelectCommand<ColumnSelectCommandOptions> {
		constructor() {
			super({
				id: 'columnSelect',
				precondition: undefined
			});
		}

		protected _getColumnSelectResult(viewModel: IViewModel, primary: CursorState, prevColumnSelectData: IColumnSelectData, args: Partial<ColumnSelectCommandOptions>): IColumnSelectResult | null {
			if (typeof args.position === 'undefined' || typeof args.viewPosition === 'undefined' || typeof args.mouseColumn === 'undefined') {
				return null;
			}
			// validate `args`
			const validatedPosition = viewModel.model.validatePosition(args.position);
			const validatedViewPosition = viewModel.coordinatesConverter.validateViewPosition(new Position(args.viewPosition.lineNumber, args.viewPosition.column), validatedPosition);

			const fromViewLineNumber = args.doColumnSelect ? prevColumnSelectData.fromViewLineNumber : validatedViewPosition.lineNumber;
			const fromViewVisualColumn = args.doColumnSelect ? prevColumnSelectData.fromViewVisualColumn : args.mouseColumn - 1;
			return ColumnSelection.columnSelect(viewModel.cursorConfig, viewModel, fromViewLineNumber, fromViewVisualColumn, validatedViewPosition.lineNumber, args.mouseColumn - 1);
		}
	});

	export const CursorColumnSelectLeft: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new class extends ColumnSelectCommand {
		constructor() {
			super({
				id: 'cursorColumnSelectLeft',
				precondition: undefined,
				kbOpts: {
					weight: CORE_WEIGHT,
					kbExpr: EditorContextKeys.textInputFocus,
					primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyCode.LeftArrow,
					linux: { primary: 0 }
				}
			});
		}

		protected _getColumnSelectResult(viewModel: IViewModel, primary: CursorState, prevColumnSelectData: IColumnSelectData, args: Partial<BaseCommandOptions>): IColumnSelectResult {
			return ColumnSelection.columnSelectLeft(viewModel.cursorConfig, viewModel, prevColumnSelectData);
		}
	});

	export const CursorColumnSelectRight: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new class extends ColumnSelectCommand {
		constructor() {
			super({
				id: 'cursorColumnSelectRight',
				precondition: undefined,
				kbOpts: {
					weight: CORE_WEIGHT,
					kbExpr: EditorContextKeys.textInputFocus,
					primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyCode.RightArrow,
					linux: { primary: 0 }
				}
			});
		}

		protected _getColumnSelectResult(viewModel: IViewModel, primary: CursorState, prevColumnSelectData: IColumnSelectData, args: Partial<BaseCommandOptions>): IColumnSelectResult {
			return ColumnSelection.columnSelectRight(viewModel.cursorConfig, viewModel, prevColumnSelectData);
		}
	});

	class ColumnSelectUpCommand extends ColumnSelectCommand {

		private readonly _isPaged: boolean;

		constructor(opts: ICommandOptions & { isPaged: boolean }) {
			super(opts);
			this._isPaged = opts.isPaged;
		}

		protected _getColumnSelectResult(viewModel: IViewModel, primary: CursorState, prevColumnSelectData: IColumnSelectData, args: Partial<BaseCommandOptions>): IColumnSelectResult {
			return ColumnSelection.columnSelectUp(viewModel.cursorConfig, viewModel, prevColumnSelectData, this._isPaged);
		}
	}

	export const CursorColumnSelectUp: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new ColumnSelectUpCommand({
		isPaged: false,
		id: 'cursorColumnSelectUp',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyCode.UpArrow,
			linux: { primary: 0 }
		}
	}));

	export const CursorColumnSelectPageUp: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new ColumnSelectUpCommand({
		isPaged: true,
		id: 'cursorColumnSelectPageUp',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyCode.PageUp,
			linux: { primary: 0 }
		}
	}));

	class ColumnSelectDownCommand extends ColumnSelectCommand {

		private readonly _isPaged: boolean;

		constructor(opts: ICommandOptions & { isPaged: boolean }) {
			super(opts);
			this._isPaged = opts.isPaged;
		}

		protected _getColumnSelectResult(viewModel: IViewModel, primary: CursorState, prevColumnSelectData: IColumnSelectData, args: Partial<BaseCommandOptions>): IColumnSelectResult {
			return ColumnSelection.columnSelectDown(viewModel.cursorConfig, viewModel, prevColumnSelectData, this._isPaged);
		}
	}

	export const CursorColumnSelectDown: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new ColumnSelectDownCommand({
		isPaged: false,
		id: 'cursorColumnSelectDown',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyCode.DownArrow,
			linux: { primary: 0 }
		}
	}));

	export const CursorColumnSelectPageDown: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new ColumnSelectDownCommand({
		isPaged: true,
		id: 'cursorColumnSelectPageDown',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyCode.PageDown,
			linux: { primary: 0 }
		}
	}));

	export class CursorMoveImpl extends CoreEditorCommand<CursorMove_.RawArguments> {
		constructor() {
			super({
				id: 'cursorMove',
				precondition: undefined,
				metadata: CursorMove_.metadata
			});
		}

		public runCoreEditorCommand(viewModel: IViewModel, args: Partial<BaseCommandOptions & CursorMove_.RawArguments>): void {
			const parsed = CursorMove_.parse(args);
			if (!parsed) {
				// illegal arguments
				return;
			}
			this._runCursorMove(viewModel, args.source, parsed);
		}

		private _runCursorMove(viewModel: IViewModel, source: string | null | undefined, args: CursorMove_.ParsedArguments): void {
			// If noHistory is true, use PROGRAMMATIC source to prevent adding to navigation history
			const effectiveSource = args.noHistory ? TextEditorSelectionSource.PROGRAMMATIC : source;

			viewModel.model.pushStackElement();
			viewModel.setCursorStates(
				effectiveSource,
				CursorChangeReason.Explicit,
				CursorMoveImpl._move(viewModel, viewModel.getCursorStates(), args)
			);
			viewModel.revealAllCursors(effectiveSource, true);
		}

		private static _move(viewModel: IViewModel, cursors: CursorState[], args: CursorMove_.ParsedArguments): PartialCursorState[] | null {
			const inSelectionMode = args.select;
			const value = args.value;

			switch (args.direction) {
				case CursorMove_.Direction.Left:
				case CursorMove_.Direction.Right:
				case CursorMove_.Direction.Up:
				case CursorMove_.Direction.Down:
				case CursorMove_.Direction.PrevBlankLine:
				case CursorMove_.Direction.NextBlankLine:
				case CursorMove_.Direction.WrappedLineStart:
				case CursorMove_.Direction.WrappedLineFirstNonWhitespaceCharacter:
				case CursorMove_.Direction.WrappedLineColumnCenter:
				case CursorMove_.Direction.WrappedLineEnd:
				case CursorMove_.Direction.WrappedLineLastNonWhitespaceCharacter:
					return CursorMoveCommands.simpleMove(viewModel, cursors, args.direction, inSelectionMode, value, args.unit);

				case CursorMove_.Direction.ViewPortTop:
				case CursorMove_.Direction.ViewPortBottom:
				case CursorMove_.Direction.ViewPortCenter:
				case CursorMove_.Direction.ViewPortIfOutside:
					return CursorMoveCommands.viewportMove(viewModel, cursors, args.direction, inSelectionMode, value);
				default:
					return null;
			}
		}
	}

	export const CursorMove: CursorMoveImpl = registerEditorCommand(new CursorMoveImpl());

	const enum Constants {
		PAGE_SIZE_MARKER = -1
	}

	export interface CursorMoveCommandOptions extends BaseCommandOptions {
		pageSize?: number;
	}

	class CursorMoveBasedCommand extends CoreEditorCommand<CursorMoveCommandOptions> {

		private readonly _staticArgs: CursorMove_.SimpleMoveArguments;

		constructor(opts: ICommandOptions & { args: CursorMove_.SimpleMoveArguments }) {
			super(opts);
			this._staticArgs = opts.args;
		}

		public runCoreEditorCommand(viewModel: IViewModel, dynamicArgs: Partial<CursorMoveCommandOptions>): void {
			let args = this._staticArgs;
			if (this._staticArgs.value === Constants.PAGE_SIZE_MARKER) {
				// -1 is a marker for page size
				args = {
					direction: this._staticArgs.direction,
					unit: this._staticArgs.unit,
					select: this._staticArgs.select,
					value: dynamicArgs.pageSize || viewModel.cursorConfig.pageSize
				};
			}

			viewModel.model.pushStackElement();
			viewModel.setCursorStates(
				dynamicArgs.source,
				CursorChangeReason.Explicit,
				CursorMoveCommands.simpleMove(viewModel, viewModel.getCursorStates(), args.direction, args.select, args.value, args.unit)
			);
			viewModel.revealAllCursors(dynamicArgs.source, true);
		}
	}

	export const CursorLeft: CoreEditorCommand<CursorMoveCommandOptions> = registerEditorCommand(new CursorMoveBasedCommand({
		args: {
			direction: CursorMove_.Direction.Left,
			unit: CursorMove_.Unit.None,
			select: false,
			value: 1
		},
		id: 'cursorLeft',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: KeyCode.LeftArrow,
			mac: { primary: KeyCode.LeftArrow, secondary: [KeyMod.WinCtrl | KeyCode.KeyB] }
		}
	}));

	export const CursorLeftSelect: CoreEditorCommand<CursorMoveCommandOptions> = registerEditorCommand(new CursorMoveBasedCommand({
		args: {
			direction: CursorMove_.Direction.Left,
			unit: CursorMove_.Unit.None,
			select: true,
			value: 1
		},
		id: 'cursorLeftSelect',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: KeyMod.Shift | KeyCode.LeftArrow
		}
	}));

	export const CursorRight: CoreEditorCommand<CursorMoveCommandOptions> = registerEditorCommand(new CursorMoveBasedCommand({
		args: {
			direction: CursorMove_.Direction.Right,
			unit: CursorMove_.Unit.None,
			select: false,
			value: 1
		},
		id: 'cursorRight',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: KeyCode.RightArrow,
			mac: { primary: KeyCode.RightArrow, secondary: [KeyMod.WinCtrl | KeyCode.KeyF] }
		}
	}));

	export const CursorRightSelect: CoreEditorCommand<CursorMoveCommandOptions> = registerEditorCommand(new CursorMoveBasedCommand({
		args: {
			direction: CursorMove_.Direction.Right,
			unit: CursorMove_.Unit.None,
			select: true,
			value: 1
		},
		id: 'cursorRightSelect',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: KeyMod.Shift | KeyCode.RightArrow
		}
	}));

	export const CursorUp: CoreEditorCommand<CursorMoveCommandOptions> = registerEditorCommand(new CursorMoveBasedCommand({
		args: {
			direction: CursorMove_.Direction.Up,
			unit: CursorMove_.Unit.WrappedLine,
			select: false,
			value: 1
		},
		id: 'cursorUp',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: KeyCode.UpArrow,
			mac: { primary: KeyCode.UpArrow, secondary: [KeyMod.WinCtrl | KeyCode.KeyP] }
		}
	}));

	export const CursorUpSelect: CoreEditorCommand<CursorMoveCommandOptions> = registerEditorCommand(new CursorMoveBasedCommand({
		args: {
			direction: CursorMove_.Direction.Up,
			unit: CursorMove_.Unit.WrappedLine,
			select: true,
			value: 1
		},
		id: 'cursorUpSelect',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: KeyMod.Shift | KeyCode.UpArrow,
			secondary: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.UpArrow],
			mac: { primary: KeyMod.Shift | KeyCode.UpArrow },
			linux: { primary: KeyMod.Shift | KeyCode.UpArrow }
		}
	}));

	export const CursorPageUp: CoreEditorCommand<CursorMoveCommandOptions> = registerEditorCommand(new CursorMoveBasedCommand({
		args: {
			direction: CursorMove_.Direction.Up,
			unit: CursorMove_.Unit.WrappedLine,
			select: false,
			value: Constants.PAGE_SIZE_MARKER
		},
		id: 'cursorPageUp',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: KeyCode.PageUp
		}
	}));

	export const CursorPageUpSelect: CoreEditorCommand<CursorMoveCommandOptions> = registerEditorCommand(new CursorMoveBasedCommand({
		args: {
			direction: CursorMove_.Direction.Up,
			unit: CursorMove_.Unit.WrappedLine,
			select: true,
			value: Constants.PAGE_SIZE_MARKER
		},
		id: 'cursorPageUpSelect',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: KeyMod.Shift | KeyCode.PageUp
		}
	}));

	export const CursorDown: CoreEditorCommand<CursorMoveCommandOptions> = registerEditorCommand(new CursorMoveBasedCommand({
		args: {
			direction: CursorMove_.Direction.Down,
			unit: CursorMove_.Unit.WrappedLine,
			select: false,
			value: 1
		},
		id: 'cursorDown',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: KeyCode.DownArrow,
			mac: { primary: KeyCode.DownArrow, secondary: [KeyMod.WinCtrl | KeyCode.KeyN] }
		}
	}));

	export const CursorDownSelect: CoreEditorCommand<CursorMoveCommandOptions> = registerEditorCommand(new CursorMoveBasedCommand({
		args: {
			direction: CursorMove_.Direction.Down,
			unit: CursorMove_.Unit.WrappedLine,
			select: true,
			value: 1
		},
		id: 'cursorDownSelect',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: KeyMod.Shift | KeyCode.DownArrow,
			secondary: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.DownArrow],
			mac: { primary: KeyMod.Shift | KeyCode.DownArrow },
			linux: { primary: KeyMod.Shift | KeyCode.DownArrow }
		}
	}));

	export const CursorPageDown: CoreEditorCommand<CursorMoveCommandOptions> = registerEditorCommand(new CursorMoveBasedCommand({
		args: {
			direction: CursorMove_.Direction.Down,
			unit: CursorMove_.Unit.WrappedLine,
			select: false,
			value: Constants.PAGE_SIZE_MARKER
		},
		id: 'cursorPageDown',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: KeyCode.PageDown
		}
	}));

	export const CursorPageDownSelect: CoreEditorCommand<CursorMoveCommandOptions> = registerEditorCommand(new CursorMoveBasedCommand({
		args: {
			direction: CursorMove_.Direction.Down,
			unit: CursorMove_.Unit.WrappedLine,
			select: true,
			value: Constants.PAGE_SIZE_MARKER
		},
		id: 'cursorPageDownSelect',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: KeyMod.Shift | KeyCode.PageDown
		}
	}));

	export interface CreateCursorCommandOptions extends MoveCommandOptions {
		wholeLine?: boolean;
	}

	export const CreateCursor: CoreEditorCommand<CreateCursorCommandOptions> = registerEditorCommand(new class extends CoreEditorCommand<CreateCursorCommandOptions> {
		constructor() {
			super({
				id: 'createCursor',
				precondition: undefined
			});
		}

		public runCoreEditorCommand(viewModel: IViewModel, args: Partial<CreateCursorCommandOptions>): void {
			if (!args.position) {
				return;
			}
			let newState: PartialCursorState;
			if (args.wholeLine) {
				newState = CursorMoveCommands.line(viewModel, viewModel.getPrimaryCursorState(), false, args.position, args.viewPosition);
			} else {
				newState = CursorMoveCommands.moveTo(viewModel, viewModel.getPrimaryCursorState(), false, args.position, args.viewPosition);
			}

			const states: PartialCursorState[] = viewModel.getCursorStates();

			// Check if we should remove a cursor (sort of like a toggle)
			if (states.length > 1) {
				const newModelPosition = (newState.modelState ? newState.modelState.position : null);
				const newViewPosition = (newState.viewState ? newState.viewState.position : null);

				for (let i = 0, len = states.length; i < len; i++) {
					const state = states[i];

					if (newModelPosition && !state.modelState!.selection.containsPosition(newModelPosition)) {
						continue;
					}

					if (newViewPosition && !state.viewState!.selection.containsPosition(newViewPosition)) {
						continue;
					}

					// => Remove the cursor
					states.splice(i, 1);

					viewModel.model.pushStackElement();
					viewModel.setCursorStates(
						args.source,
						CursorChangeReason.Explicit,
						states
					);
					return;
				}
			}

			// => Add the new cursor
			states.push(newState);

			viewModel.model.pushStackElement();
			viewModel.setCursorStates(
				args.source,
				CursorChangeReason.Explicit,
				states
			);
		}
	});

	export const LastCursorMoveToSelect: CoreEditorCommand<MoveCommandOptions> = registerEditorCommand(new class extends CoreEditorCommand<MoveCommandOptions> {
		constructor() {
			super({
				id: '_lastCursorMoveToSelect',
				precondition: undefined
			});
		}

		public runCoreEditorCommand(viewModel: IViewModel, args: Partial<MoveCommandOptions>): void {
			if (!args.position) {
				return;
			}
			const lastAddedCursorIndex = viewModel.getLastAddedCursorIndex();

			const states = viewModel.getCursorStates();
			const newStates: PartialCursorState[] = states.slice(0);
			newStates[lastAddedCursorIndex] = CursorMoveCommands.moveTo(viewModel, states[lastAddedCursorIndex], true, args.position, args.viewPosition);

			viewModel.model.pushStackElement();
			viewModel.setCursorStates(
				args.source,
				CursorChangeReason.Explicit,
				newStates
			);
		}
	});

	class HomeCommand extends CoreEditorCommand<BaseCommandOptions> {

		private readonly _inSelectionMode: boolean;

		constructor(opts: ICommandOptions & { inSelectionMode: boolean }) {
			super(opts);
			this._inSelectionMode = opts.inSelectionMode;
		}

		public runCoreEditorCommand(viewModel: IViewModel, args: Partial<BaseCommandOptions>): void {
			viewModel.model.pushStackElement();
			viewModel.setCursorStates(
				args.source,
				CursorChangeReason.Explicit,
				CursorMoveCommands.moveToBeginningOfLine(viewModel, viewModel.getCursorStates(), this._inSelectionMode)
			);
			viewModel.revealAllCursors(args.source, true);
		}
	}

	export const CursorHome: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new HomeCommand({
		inSelectionMode: false,
		id: 'cursorHome',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: KeyCode.Home,
			mac: { primary: KeyCode.Home, secondary: [KeyMod.CtrlCmd | KeyCode.LeftArrow] }
		}
	}));

	export const CursorHomeSelect: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new HomeCommand({
		inSelectionMode: true,
		id: 'cursorHomeSelect',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: KeyMod.Shift | KeyCode.Home,
			mac: { primary: KeyMod.Shift | KeyCode.Home, secondary: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.LeftArrow] }
		}
	}));

	class LineStartCommand extends CoreEditorCommand<BaseCommandOptions> {

		private readonly _inSelectionMode: boolean;

		constructor(opts: ICommandOptions & { inSelectionMode: boolean }) {
			super(opts);
			this._inSelectionMode = opts.inSelectionMode;
		}

		public runCoreEditorCommand(viewModel: IViewModel, args: Partial<BaseCommandOptions>): void {
			viewModel.model.pushStackElement();
			viewModel.setCursorStates(
				args.source,
				CursorChangeReason.Explicit,
				this._exec(viewModel.getCursorStates())
			);
			viewModel.revealAllCursors(args.source, true);
		}

		private _exec(cursors: CursorState[]): PartialCursorState[] {
			const result: PartialCursorState[] = [];
			for (let i = 0, len = cursors.length; i < len; i++) {
				const cursor = cursors[i];
				const lineNumber = cursor.modelState.position.lineNumber;
				result[i] = CursorState.fromModelState(cursor.modelState.move(this._inSelectionMode, lineNumber, 1, 0));
			}
			return result;
		}
	}

	export const CursorLineStart: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new LineStartCommand({
		inSelectionMode: false,
		id: 'cursorLineStart',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: 0,
			mac: { primary: KeyMod.WinCtrl | KeyCode.KeyA }
		}
	}));

	export const CursorLineStartSelect: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new LineStartCommand({
		inSelectionMode: true,
		id: 'cursorLineStartSelect',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: 0,
			mac: { primary: KeyMod.WinCtrl | KeyMod.Shift | KeyCode.KeyA }
		}
	}));

	export interface EndCommandOptions extends BaseCommandOptions {
		sticky?: boolean;
	}

	class EndCommand extends CoreEditorCommand<EndCommandOptions> {

		private readonly _inSelectionMode: boolean;

		constructor(opts: ICommandOptions & { inSelectionMode: boolean }) {
			super(opts);
			this._inSelectionMode = opts.inSelectionMode;
		}

		public runCoreEditorCommand(viewModel: IViewModel, args: Partial<EndCommandOptions>): void {
			viewModel.model.pushStackElement();
			viewModel.setCursorStates(
				args.source,
				CursorChangeReason.Explicit,
				CursorMoveCommands.moveToEndOfLine(viewModel, viewModel.getCursorStates(), this._inSelectionMode, args.sticky || false)
			);
			viewModel.revealAllCursors(args.source, true);
		}
	}

	export const CursorEnd: CoreEditorCommand<EndCommandOptions> = registerEditorCommand(new EndCommand({
		inSelectionMode: false,
		id: 'cursorEnd',
		precondition: undefined,
		kbOpts: {
			args: { sticky: false },
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: KeyCode.End,
			mac: { primary: KeyCode.End, secondary: [KeyMod.CtrlCmd | KeyCode.RightArrow] }
		},
		metadata: {
			description: `Go to End`,
			args: [{
				name: 'args',
				schema: {
					type: 'object',
					properties: {
						'sticky': {
							description: nls.localize('stickydesc', "Stick to the end even when going to longer lines"),
							type: 'boolean',
							default: false
						}
					}
				}
			}]
		}
	}));

	export const CursorEndSelect: CoreEditorCommand<EndCommandOptions> = registerEditorCommand(new EndCommand({
		inSelectionMode: true,
		id: 'cursorEndSelect',
		precondition: undefined,
		kbOpts: {
			args: { sticky: false },
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: KeyMod.Shift | KeyCode.End,
			mac: { primary: KeyMod.Shift | KeyCode.End, secondary: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.RightArrow] }
		},
		metadata: {
			description: `Select to End`,
			args: [{
				name: 'args',
				schema: {
					type: 'object',
					properties: {
						'sticky': {
							description: nls.localize('stickydesc', "Stick to the end even when going to longer lines"),
							type: 'boolean',
							default: false
						}
					}
				}
			}]
		}
	}));

	class LineEndCommand extends CoreEditorCommand<BaseCommandOptions> {

		private readonly _inSelectionMode: boolean;

		constructor(opts: ICommandOptions & { inSelectionMode: boolean }) {
			super(opts);
			this._inSelectionMode = opts.inSelectionMode;
		}

		public runCoreEditorCommand(viewModel: IViewModel, args: Partial<BaseCommandOptions>): void {
			viewModel.model.pushStackElement();
			viewModel.setCursorStates(
				args.source,
				CursorChangeReason.Explicit,
				this._exec(viewModel, viewModel.getCursorStates())
			);
			viewModel.revealAllCursors(args.source, true);
		}

		private _exec(viewModel: IViewModel, cursors: CursorState[]): PartialCursorState[] {
			const result: PartialCursorState[] = [];
			for (let i = 0, len = cursors.length; i < len; i++) {
				const cursor = cursors[i];
				const lineNumber = cursor.modelState.position.lineNumber;
				const maxColumn = viewModel.model.getLineMaxColumn(lineNumber);
				result[i] = CursorState.fromModelState(cursor.modelState.move(this._inSelectionMode, lineNumber, maxColumn, 0));
			}
			return result;
		}
	}

	export const CursorLineEnd: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new LineEndCommand({
		inSelectionMode: false,
		id: 'cursorLineEnd',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: 0,
			mac: { primary: KeyMod.WinCtrl | KeyCode.KeyE }
		}
	}));

	export const CursorLineEndSelect: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new LineEndCommand({
		inSelectionMode: true,
		id: 'cursorLineEndSelect',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: 0,
			mac: { primary: KeyMod.WinCtrl | KeyMod.Shift | KeyCode.KeyE }
		}
	}));

	class TopCommand extends CoreEditorCommand<BaseCommandOptions> {

		private readonly _inSelectionMode: boolean;

		constructor(opts: ICommandOptions & { inSelectionMode: boolean }) {
			super(opts);
			this._inSelectionMode = opts.inSelectionMode;
		}

		public runCoreEditorCommand(viewModel: IViewModel, args: Partial<BaseCommandOptions>): void {
			viewModel.model.pushStackElement();
			viewModel.setCursorStates(
				args.source,
				CursorChangeReason.Explicit,
				CursorMoveCommands.moveToBeginningOfBuffer(viewModel, viewModel.getCursorStates(), this._inSelectionMode)
			);
			viewModel.revealAllCursors(args.source, true);
		}
	}

	export const CursorTop: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new TopCommand({
		inSelectionMode: false,
		id: 'cursorTop',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: KeyMod.CtrlCmd | KeyCode.Home,
			mac: { primary: KeyMod.CtrlCmd | KeyCode.UpArrow }
		}
	}));

	export const CursorTopSelect: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new TopCommand({
		inSelectionMode: true,
		id: 'cursorTopSelect',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Home,
			mac: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.UpArrow }
		}
	}));

	class BottomCommand extends CoreEditorCommand<BaseCommandOptions> {

		private readonly _inSelectionMode: boolean;

		constructor(opts: ICommandOptions & { inSelectionMode: boolean }) {
			super(opts);
			this._inSelectionMode = opts.inSelectionMode;
		}

		public runCoreEditorCommand(viewModel: IViewModel, args: Partial<BaseCommandOptions>): void {
			viewModel.model.pushStackElement();
			viewModel.setCursorStates(
				args.source,
				CursorChangeReason.Explicit,
				CursorMoveCommands.moveToEndOfBuffer(viewModel, viewModel.getCursorStates(), this._inSelectionMode)
			);
			viewModel.revealAllCursors(args.source, true);
		}
	}

	export const CursorBottom: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new BottomCommand({
		inSelectionMode: false,
		id: 'cursorBottom',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: KeyMod.CtrlCmd | KeyCode.End,
			mac: { primary: KeyMod.CtrlCmd | KeyCode.DownArrow }
		}
	}));

	export const CursorBottomSelect: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new BottomCommand({
		inSelectionMode: true,
		id: 'cursorBottomSelect',
		precondition: undefined,
		kbOpts: {
			weight: CORE_WEIGHT,
			kbExpr: EditorContextKeys.textInputFocus,
			primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.End,
			mac: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.DownArrow }
		}
	}));

	export type EditorScrollCommandOptions = EditorScroll_.RawArguments & BaseCommandOptions;

	export class EditorScrollImpl extends CoreEditorCommand<EditorScrollCommandOptions> {
		constructor() {
			super({
				id: 'editorScroll',
				precondition: undefined,
				metadata: EditorScroll_.metadata
			});
		}

		determineScrollMethod(args: EditorScroll_.ParsedArguments) {
			const horizontalUnits = [EditorScroll_.Unit.Column];
			const verticalUnits = [
				EditorScroll_.Unit.Line,
				EditorScroll_.Unit.WrappedLine,
				EditorScroll_.Unit.Page,
				EditorScroll_.Unit.HalfPage,
				EditorScroll_.Unit.Editor
			];
			const horizontalDirections = [EditorScroll_.Direction.Left, EditorScroll_.Direction.Right];
			const verticalDirections = [EditorScroll_.Direction.Up, EditorScroll_.Direction.Down];

			if (horizontalUnits.includes(args.unit) && horizontalDirections.includes(args.direction)) {
				return this._runHorizontalEditorScroll.bind(this);
			}
			if (verticalUnits.includes(args.unit) && verticalDirections.includes(args.direction)) {
				return this._runVerticalEditorScroll.bind(this);
			}
			return null;
		}

		public runCoreEditorCommand(viewModel: IViewModel, args: Partial<EditorScrollCommandOptions>): void {
			const parsed = EditorScroll_.parse(args);
			if (!parsed) {
				// illegal arguments
				return;
			}
			const runEditorScroll = this.determineScrollMethod(parsed);
			if (!runEditorScroll) {
				// Incompatible unit and direction
				return;
			}
			runEditorScroll(viewModel, args.source, parsed);
		}

		_runVerticalEditorScroll(viewModel: IViewModel, source: string | null | undefined, args: EditorScroll_.ParsedArguments): void {

			const desiredScrollTop = this._computeDesiredScrollTop(viewModel, args);

			if (args.revealCursor) {
				// must ensure cursor is in new visible range
				const desiredVisibleViewRange = viewModel.getCompletelyVisibleViewRangeAtScrollTop(desiredScrollTop);
				viewModel.setCursorStates(
					source,
					CursorChangeReason.Explicit,
					[
						CursorMoveCommands.findPositionInViewportIfOutside(viewModel, viewModel.getPrimaryCursorState(), desiredVisibleViewRange, args.select)
					]
				);
			}

			viewModel.viewLayout.setScrollPosition({ scrollTop: desiredScrollTop }, ScrollType.Smooth);
		}

		private _computeDesiredScrollTop(viewModel: IViewModel, args: EditorScroll_.ParsedArguments): number {

			if (args.unit === EditorScroll_.Unit.Line) {
				// scrolling by model lines
				const futureViewport = viewModel.viewLayout.getFutureViewport();
				const visibleViewRange = viewModel.getCompletelyVisibleViewRangeAtScrollTop(futureViewport.top);
				const visibleModelRange = viewModel.coordinatesConverter.convertViewRangeToModelRange(visibleViewRange);

				let desiredTopModelLineNumber: number;
				if (args.direction === EditorScroll_.Direction.Up) {
					// must go x model lines up
					desiredTopModelLineNumber = Math.max(1, visibleModelRange.startLineNumber - args.value);
				} else {
					// must go x model lines down
					desiredTopModelLineNumber = Math.min(viewModel.model.getLineCount(), visibleModelRange.startLineNumber + args.value);
				}

				const viewPosition = viewModel.coordinatesConverter.convertModelPositionToViewPosition(new Position(desiredTopModelLineNumber, 1));
				return viewModel.viewLayout.getVerticalOffsetForLineNumber(viewPosition.lineNumber);
			}

			if (args.unit === EditorScroll_.Unit.Editor) {
				let desiredTopModelLineNumber = 0;
				if (args.direction === EditorScroll_.Direction.Down) {
					desiredTopModelLineNumber = viewModel.model.getLineCount() - viewModel.cursorConfig.pageSize;
				}
				return viewModel.viewLayout.getVerticalOffsetForLineNumber(desiredTopModelLineNumber);
			}

			let noOfLines: number;
			if (args.unit === EditorScroll_.Unit.Page) {
				noOfLines = viewModel.cursorConfig.pageSize * args.value;
			} else if (args.unit === EditorScroll_.Unit.HalfPage) {
				noOfLines = Math.round(viewModel.cursorConfig.pageSize / 2) * args.value;
			} else {
				noOfLines = args.value;
			}
			const deltaLines = (args.direction === EditorScroll_.Direction.Up ? -1 : 1) * noOfLines;
			return viewModel.viewLayout.getCurrentScrollTop() + deltaLines * viewModel.cursorConfig.lineHeight;
		}

		_runHorizontalEditorScroll(viewModel: IViewModel, source: string | null | undefined, args: EditorScroll_.ParsedArguments): void {
			const desiredScrollLeft = this._computeDesiredScrollLeft(viewModel, args);
			viewModel.viewLayout.setScrollPosition({ scrollLeft: desiredScrollLeft }, ScrollType.Smooth);
		}

		_computeDesiredScrollLeft(viewModel: IViewModel, args: EditorScroll_.ParsedArguments) {
			const deltaColumns = (args.direction === EditorScroll_.Direction.Left ? -1 : 1) * args.value;
			return viewModel.viewLayout.getCurrentScrollLeft() + deltaColumns * viewModel.cursorConfig.typicalHalfwidthCharacterWidth;
		}
	}

	export const EditorScroll: EditorScrollImpl = registerEditorCommand(new EditorScrollImpl());

	export const ScrollLineUp: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new class extends CoreEditorCommand<BaseCommandOptions> {
		constructor() {
			super({
				id: 'scrollLineUp',
				precondition: undefined,
				kbOpts: {
					weight: CORE_WEIGHT,
					kbExpr: EditorContextKeys.textInputFocus,
					primary: KeyMod.CtrlCmd | KeyCode.UpArrow,
					mac: { primary: KeyMod.WinCtrl | KeyCode.PageUp }
				}
			});
		}

		runCoreEditorCommand(viewModel: IViewModel, args: Partial<BaseCommandOptions>): void {
			EditorScroll.runCoreEditorCommand(viewModel, {
				to: EditorScroll_.RawDirection.Up,
				by: EditorScroll_.RawUnit.WrappedLine,
				value: 1,
				revealCursor: false,
				select: false,
				source: args.source
			});
		}
	});

	export const ScrollPageUp: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new class extends CoreEditorCommand<BaseCommandOptions> {
		constructor() {
			super({
				id: 'scrollPageUp',
				precondition: undefined,
				kbOpts: {
					weight: CORE_WEIGHT,
					kbExpr: EditorContextKeys.textInputFocus,
					primary: KeyMod.CtrlCmd | KeyCode.PageUp,
					win: { primary: KeyMod.Alt | KeyCode.PageUp },
					linux: { primary: KeyMod.Alt | KeyCode.PageUp }
				}
			});
		}

		runCoreEditorCommand(viewModel: IViewModel, args: Partial<BaseCommandOptions>): void {
			EditorScroll.runCoreEditorCommand(viewModel, {
				to: EditorScroll_.RawDirection.Up,
				by: EditorScroll_.RawUnit.Page,
				value: 1,
				revealCursor: false,
				select: false,
				source: args.source
			});
		}
	});

	export const ScrollEditorTop: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new class extends CoreEditorCommand<BaseCommandOptions> {
		constructor() {
			super({
				id: 'scrollEditorTop',
				precondition: undefined,
				kbOpts: {
					weight: CORE_WEIGHT,
					kbExpr: EditorContextKeys.textInputFocus,
				}
			});
		}

		runCoreEditorCommand(viewModel: IViewModel, args: Partial<BaseCommandOptions>): void {
			EditorScroll.runCoreEditorCommand(viewModel, {
				to: EditorScroll_.RawDirection.Up,
				by: EditorScroll_.RawUnit.Editor,
				value: 1,
				revealCursor: false,
				select: false,
				source: args.source
			});
		}
	});

	export const ScrollLineDown: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new class extends CoreEditorCommand<BaseCommandOptions> {
		constructor() {
			super({
				id: 'scrollLineDown',
				precondition: undefined,
				kbOpts: {
					weight: CORE_WEIGHT,
					kbExpr: EditorContextKeys.textInputFocus,
					primary: KeyMod.CtrlCmd | KeyCode.DownArrow,
					mac: { primary: KeyMod.WinCtrl | KeyCode.PageDown }
				}
			});
		}

		runCoreEditorCommand(viewModel: IViewModel, args: Partial<BaseCommandOptions>): void {
			EditorScroll.runCoreEditorCommand(viewModel, {
				to: EditorScroll_.RawDirection.Down,
				by: EditorScroll_.RawUnit.WrappedLine,
				value: 1,
				revealCursor: false,
				select: false,
				source: args.source
			});
		}
	});

	export const ScrollPageDown: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new class extends CoreEditorCommand<BaseCommandOptions> {
		constructor() {
			super({
				id: 'scrollPageDown',
				precondition: undefined,
				kbOpts: {
					weight: CORE_WEIGHT,
					kbExpr: EditorContextKeys.textInputFocus,
					primary: KeyMod.CtrlCmd | KeyCode.PageDown,
					win: { primary: KeyMod.Alt | KeyCode.PageDown },
					linux: { primary: KeyMod.Alt | KeyCode.PageDown }
				}
			});
		}

		runCoreEditorCommand(viewModel: IViewModel, args: Partial<BaseCommandOptions>): void {
			EditorScroll.runCoreEditorCommand(viewModel, {
				to: EditorScroll_.RawDirection.Down,
				by: EditorScroll_.RawUnit.Page,
				value: 1,
				revealCursor: false,
				select: false,
				source: args.source
			});
		}
	});

	export const ScrollEditorBottom: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new class extends CoreEditorCommand<BaseCommandOptions> {
		constructor() {
			super({
				id: 'scrollEditorBottom',
				precondition: undefined,
				kbOpts: {
					weight: CORE_WEIGHT,
					kbExpr: EditorContextKeys.textInputFocus,
				}
			});
		}

		runCoreEditorCommand(viewModel: IViewModel, args: Partial<BaseCommandOptions>): void {
			EditorScroll.runCoreEditorCommand(viewModel, {
				to: EditorScroll_.RawDirection.Down,
				by: EditorScroll_.RawUnit.Editor,
				value: 1,
				revealCursor: false,
				select: false,
				source: args.source
			});
		}
	});

	export const ScrollLeft: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new class extends CoreEditorCommand<BaseCommandOptions> {
		constructor() {
			super({
				id: 'scrollLeft',
				precondition: undefined,
				kbOpts: {
					weight: CORE_WEIGHT,
					kbExpr: EditorContextKeys.textInputFocus,
				}
			});
		}

		runCoreEditorCommand(viewModel: IViewModel, args: Partial<BaseCommandOptions>): void {
			EditorScroll.runCoreEditorCommand(viewModel, {
				to: EditorScroll_.RawDirection.Left,
				by: EditorScroll_.RawUnit.Column,
				value: 2,
				revealCursor: false,
				select: false,
				source: args.source
			});
		}
	});

	export const ScrollRight: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new class extends CoreEditorCommand<BaseCommandOptions> {
		constructor() {
			super({
				id: 'scrollRight',
				precondition: undefined,
				kbOpts: {
					weight: CORE_WEIGHT,
					kbExpr: EditorContextKeys.textInputFocus,
				}
			});
		}

		runCoreEditorCommand(viewModel: IViewModel, args: Partial<BaseCommandOptions>): void {
			EditorScroll.runCoreEditorCommand(viewModel, {
				to: EditorScroll_.RawDirection.Right,
				by: EditorScroll_.RawUnit.Column,
				value: 2,
				revealCursor: false,
				select: false,
				source: args.source
			});
		}
	});

	class WordCommand extends CoreEditorCommand<MoveCommandOptions> {

		private readonly _inSelectionMode: boolean;

		constructor(opts: ICommandOptions & { inSelectionMode: boolean }) {
			super(opts);
			this._inSelectionMode = opts.inSelectionMode;
		}

		public runCoreEditorCommand(viewModel: IViewModel, args: Partial<MoveCommandOptions>): void {
			if (!args.position) {
				return;
			}
			viewModel.model.pushStackElement();
			viewModel.setCursorStates(
				args.source,
				CursorChangeReason.Explicit,
				[
					CursorMoveCommands.word(viewModel, viewModel.getPrimaryCursorState(), this._inSelectionMode, args.position)
				]
			);
			if (args.revealType !== NavigationCommandRevealType.None) {
				viewModel.revealAllCursors(args.source, true, true);
			}
		}
	}

	export const WordSelect: CoreEditorCommand<MoveCommandOptions> = registerEditorCommand(new WordCommand({
		inSelectionMode: false,
		id: '_wordSelect',
		precondition: undefined
	}));

	export const WordSelectDrag: CoreEditorCommand<MoveCommandOptions> = registerEditorCommand(new WordCommand({
		inSelectionMode: true,
		id: '_wordSelectDrag',
		precondition: undefined
	}));

	export const LastCursorWordSelect: CoreEditorCommand<MoveCommandOptions> = registerEditorCommand(new class extends CoreEditorCommand<MoveCommandOptions> {
		constructor() {
			super({
				id: 'lastCursorWordSelect',
				precondition: undefined
			});
		}

		public runCoreEditorCommand(viewModel: IViewModel, args: Partial<MoveCommandOptions>): void {
			if (!args.position) {
				return;
			}
			const lastAddedCursorIndex = viewModel.getLastAddedCursorIndex();

			const states = viewModel.getCursorStates();
			const newStates: PartialCursorState[] = states.slice(0);
			const lastAddedState = states[lastAddedCursorIndex];
			newStates[lastAddedCursorIndex] = CursorMoveCommands.word(viewModel, lastAddedState, lastAddedState.modelState.hasSelection(), args.position);

			viewModel.model.pushStackElement();
			viewModel.setCursorStates(
				args.source,
				CursorChangeReason.Explicit,
				newStates
			);
		}
	});

	class LineCommand extends CoreEditorCommand<MoveCommandOptions> {
		private readonly _inSelectionMode: boolean;

		constructor(opts: ICommandOptions & { inSelectionMode: boolean }) {
			super(opts);
			this._inSelectionMode = opts.inSelectionMode;
		}

		public runCoreEditorCommand(viewModel: IViewModel, args: Partial<MoveCommandOptions>): void {
			if (!args.position) {
				return;
			}
			viewModel.model.pushStackElement();
			viewModel.setCursorStates(
				args.source,
				CursorChangeReason.Explicit,
				[
					CursorMoveCommands.line(viewModel, viewModel.getPrimaryCursorState(), this._inSelectionMode, args.position, args.viewPosition)
				]
			);
			if (args.revealType !== NavigationCommandRevealType.None) {
				viewModel.revealAllCursors(args.source, false, true);
			}
		}
	}

	export const LineSelect: CoreEditorCommand<MoveCommandOptions> = registerEditorCommand(new LineCommand({
		inSelectionMode: false,
		id: '_lineSelect',
		precondition: undefined
	}));

	export const LineSelectDrag: CoreEditorCommand<MoveCommandOptions> = registerEditorCommand(new LineCommand({
		inSelectionMode: true,
		id: '_lineSelectDrag',
		precondition: undefined
	}));

	class LastCursorLineCommand extends CoreEditorCommand<MoveCommandOptions> {
		private readonly _inSelectionMode: boolean;

		constructor(opts: ICommandOptions & { inSelectionMode: boolean }) {
			super(opts);
			this._inSelectionMode = opts.inSelectionMode;
		}

		public runCoreEditorCommand(viewModel: IViewModel, args: Partial<MoveCommandOptions>): void {
			if (!args.position) {
				return;
			}
			const lastAddedCursorIndex = viewModel.getLastAddedCursorIndex();

			const states = viewModel.getCursorStates();
			const newStates: PartialCursorState[] = states.slice(0);
			newStates[lastAddedCursorIndex] = CursorMoveCommands.line(viewModel, states[lastAddedCursorIndex], this._inSelectionMode, args.position, args.viewPosition);

			viewModel.model.pushStackElement();
			viewModel.setCursorStates(
				args.source,
				CursorChangeReason.Explicit,
				newStates
			);
		}
	}

	export const LastCursorLineSelect: CoreEditorCommand<MoveCommandOptions> = registerEditorCommand(new LastCursorLineCommand({
		inSelectionMode: false,
		id: 'lastCursorLineSelect',
		precondition: undefined
	}));

	export const LastCursorLineSelectDrag: CoreEditorCommand<MoveCommandOptions> = registerEditorCommand(new LastCursorLineCommand({
		inSelectionMode: true,
		id: 'lastCursorLineSelectDrag',
		precondition: undefined
	}));

	export const CancelSelection: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new class extends CoreEditorCommand<BaseCommandOptions> {
		constructor() {
			super({
				id: 'cancelSelection',
				precondition: EditorContextKeys.hasNonEmptySelection,
				kbOpts: {
					weight: CORE_WEIGHT,
					kbExpr: EditorContextKeys.textInputFocus,
					primary: KeyCode.Escape,
					secondary: [KeyMod.Shift | KeyCode.Escape]
				}
			});
		}

		public runCoreEditorCommand(viewModel: IViewModel, args: Partial<BaseCommandOptions>): void {
			viewModel.model.pushStackElement();
			viewModel.setCursorStates(
				args.source,
				CursorChangeReason.Explicit,
				[
					CursorMoveCommands.cancelSelection(viewModel, viewModel.getPrimaryCursorState())
				]
			);
			viewModel.revealAllCursors(args.source, true);
		}
	});

	export const RemoveSecondaryCursors: CoreEditorCommand<BaseCommandOptions> = registerEditorCommand(new class extends CoreEditorCommand<BaseCommandOptions> {
		constructor() {
			super({
				id: 'removeSecondaryCursors',
				precondition: EditorContextKeys.hasMultipleSelections,
				kbOpts: {
					weight: CORE_WEIGHT + 1,
					kbExpr: EditorContextKeys.textInputFocus,
					primary: KeyCode.Escape,
					secondary: [KeyMod.Shift | KeyCode.Escape]
				}
			});
		}

		public runCoreEditorCommand(viewModel: IViewModel, args: Partial<BaseCommandOptions>): void {
			viewModel.model.pushStackElement();
			viewModel.setCursorStates(
				args.source,
				CursorChangeReason.Explicit,
				[
					viewModel.getPrimaryCursorState()
				]
			);
			viewModel.revealAllCursors(args.source, true);
			status(nls.localize('removedCursor', "Removed secondary cursors"));
		}
	});

	export type RevealLineCommandOptions = RevealLine_.RawArguments & BaseCommandOptions;

	export const RevealLine: CoreEditorCommand<RevealLineCommandOptions> = registerEditorCommand(new class extends CoreEditorCommand<RevealLineCommandOptions> {
		constructor() {
			super({
				id: 'revealLine',
				precondition: undefined,
				metadata: RevealLine_.metadata
			});
		}

		public runCoreEditorCommand(viewModel: IViewModel, args: Partial<RevealLineCommandOptions>): void {
			const revealLineArg = args;
			const lineNumberArg = revealLineArg.lineNumber || 0;
			let lineNumber = typeof lineNumberArg === 'number' ? (lineNumberArg + 1) : (parseInt(lineNumberArg) + 1);
			if (lineNumber < 1) {
				lineNumber = 1;
			}
			const lineCount = viewModel.model.getLineCount();
			if (lineNumber > lineCount) {
				lineNumber = lineCount;
			}

			const range = new Range(
				lineNumber, 1,
				lineNumber, viewModel.model.getLineMaxColumn(lineNumber)
			);

			let revealAt = VerticalRevealType.Simple;
			if (revealLineArg.at) {
				switch (revealLineArg.at) {
					case RevealLine_.RawAtArgument.Top:
						revealAt = VerticalRevealType.Top;
						break;
					case RevealLine_.RawAtArgument.Center:
						revealAt = VerticalRevealType.Center;
						break;
					case RevealLine_.RawAtArgument.Bottom:
						revealAt = VerticalRevealType.Bottom;
						break;
					default:
						break;
				}
			}

			const viewRange = viewModel.coordinatesConverter.convertModelRangeToViewRange(range);

			viewModel.revealRange(args.source, false, viewRange, revealAt, ScrollType.Smooth);
		}
	});

	export const SelectAll = new class extends EditorOrNativeTextInputCommand {
		constructor() {
			super(SelectAllCommand);
		}
		public runDOMCommand(activeElement: Element): void {
			if (isFirefox) {
				(<HTMLInputElement>activeElement).focus();
				(<HTMLInputElement>activeElement).select();
			}

			activeElement.ownerDocument.execCommand('selectAll');
		}
		public runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, args: unknown): void {
			const viewModel = editor._getViewModel();
			if (!viewModel) {
				// the editor has no view => has no cursors
				return;
			}
			this.runCoreEditorCommand(viewModel, args);
		}
		public runCoreEditorCommand(viewModel: IViewModel, args: unknown): void {
			viewModel.model.pushStackElement();
			viewModel.setCursorStates(
				'keyboard',
				CursorChangeReason.Explicit,
				[
					CursorMoveCommands.selectAll(viewModel, viewModel.getPrimaryCursorState())
				]
			);
		}
	}();

	export interface SetSelectionCommandOptions extends BaseCommandOptions {
		selection: ISelection;
	}

	export const SetSelection: CoreEditorCommand<SetSelectionCommandOptions> = registerEditorCommand(new class extends CoreEditorCommand<SetSelectionCommandOptions> {
		constructor() {
			super({
				id: 'setSelection',
				precondition: undefined
			});
		}

		public runCoreEditorCommand(viewModel: IViewModel, args: Partial<SetSelectionCommandOptions>): void {
			if (!args.selection) {
				return;
			}
			viewModel.model.pushStackElement();
			viewModel.setCursorStates(
				args.source,
				CursorChangeReason.Explicit,
				[
					CursorState.fromModelSelection(args.selection)
				]
			);
		}
	});
}

const columnSelectionCondition = ContextKeyExpr.and(
	EditorContextKeys.textInputFocus,
	EditorContextKeys.columnSelection
);
function registerColumnSelection(id: string, keybinding: number): void {
	KeybindingsRegistry.registerKeybindingRule({
		id: id,
		primary: keybinding,
		when: columnSelectionCondition,
		weight: CORE_WEIGHT + 1
	});
}

registerColumnSelection(CoreNavigationCommands.CursorColumnSelectLeft.id, KeyMod.Shift | KeyCode.LeftArrow);
registerColumnSelection(CoreNavigationCommands.CursorColumnSelectRight.id, KeyMod.Shift | KeyCode.RightArrow);
registerColumnSelection(CoreNavigationCommands.CursorColumnSelectUp.id, KeyMod.Shift | KeyCode.UpArrow);
registerColumnSelection(CoreNavigationCommands.CursorColumnSelectPageUp.id, KeyMod.Shift | KeyCode.PageUp);
registerColumnSelection(CoreNavigationCommands.CursorColumnSelectDown.id, KeyMod.Shift | KeyCode.DownArrow);
registerColumnSelection(CoreNavigationCommands.CursorColumnSelectPageDown.id, KeyMod.Shift | KeyCode.PageDown);

function registerCommand<T extends Command>(command: T): T {
	command.register();
	return command;
}

export namespace CoreEditingCommands {

	export abstract class CoreEditingCommand extends EditorCommand {
		public runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, args: unknown): void {
			const viewModel = editor._getViewModel();
			if (!viewModel) {
				// the editor has no view => has no cursors
				return;
			}
			this.runCoreEditingCommand(editor, viewModel, args || {});
		}

		public abstract runCoreEditingCommand(editor: ICodeEditor, viewModel: IViewModel, args: unknown): void;
	}

	export const LineBreakInsert: EditorCommand = registerEditorCommand(new class extends CoreEditingCommand {
		constructor() {
			super({
				id: 'lineBreakInsert',
				precondition: EditorContextKeys.writable,
				kbOpts: {
					weight: CORE_WEIGHT,
					kbExpr: EditorContextKeys.textInputFocus,
					primary: 0,
					mac: { primary: KeyMod.WinCtrl | KeyCode.KeyO }
				}
			});
		}

		public runCoreEditingCommand(editor: ICodeEditor, viewModel: IViewModel, args: unknown): void {
			editor.pushUndoStop();
			editor.executeCommands(this.id, EnterOperation.lineBreakInsert(viewModel.cursorConfig, viewModel.model, viewModel.getCursorStates().map(s => s.modelState.selection)));
		}
	});

	export const Outdent: EditorCommand = registerEditorCommand(new class extends CoreEditingCommand {
		constructor() {
			super({
				id: 'outdent',
				precondition: EditorContextKeys.writable,
				kbOpts: {
					weight: CORE_WEIGHT,
					kbExpr: ContextKeyExpr.and(
						EditorContextKeys.editorTextFocus,
						EditorContextKeys.tabDoesNotMoveFocus
					),
					primary: KeyMod.Shift | KeyCode.Tab
				}
			});
		}

		public runCoreEditingCommand(editor: ICodeEditor, viewModel: IViewModel, args: unknown): void {
			editor.pushUndoStop();
			editor.executeCommands(this.id, TypeOperations.outdent(viewModel.cursorConfig, viewModel.model, viewModel.getCursorStates().map(s => s.modelState.selection)));
			editor.pushUndoStop();
		}
	});

	export const Tab: EditorCommand = registerEditorCommand(new class extends CoreEditingCommand {
		constructor() {
			super({
				id: 'tab',
				precondition: EditorContextKeys.writable,
				kbOpts: {
					weight: CORE_WEIGHT,
					kbExpr: ContextKeyExpr.and(
						EditorContextKeys.editorTextFocus,
						EditorContextKeys.tabDoesNotMoveFocus
					),
					primary: KeyCode.Tab
				}
			});
		}

		public runCoreEditingCommand(editor: ICodeEditor, viewModel: IViewModel, args: unknown): void {
			editor.pushUndoStop();
			editor.executeCommands(this.id, TypeOperations.tab(viewModel.cursorConfig, viewModel.model, viewModel.getCursorStates().map(s => s.modelState.selection)));
			editor.pushUndoStop();
		}
	});

	export const DeleteLeft: EditorCommand = registerEditorCommand(new class extends CoreEditingCommand {
		constructor() {
			super({
				id: 'deleteLeft',
				precondition: undefined,
				kbOpts: {
					weight: CORE_WEIGHT,
					kbExpr: EditorContextKeys.textInputFocus,
					primary: KeyCode.Backspace,
					secondary: [KeyMod.Shift | KeyCode.Backspace],
					mac: { primary: KeyCode.Backspace, secondary: [KeyMod.Shift | KeyCode.Backspace, KeyMod.WinCtrl | KeyCode.KeyH, KeyMod.WinCtrl | KeyCode.Backspace] }
				}
			});
		}

		public runCoreEditingCommand(editor: ICodeEditor, viewModel: IViewModel, args: unknown): void {
			const [shouldPushStackElementBefore, commands] = DeleteOperations.deleteLeft(viewModel.getPrevEditOperationType(), viewModel.cursorConfig, viewModel.model, viewModel.getCursorStates().map(s => s.modelState.selection), viewModel.getCursorAutoClosedCharacters());
			if (shouldPushStackElementBefore) {
				editor.pushUndoStop();
			}
			editor.executeCommands(this.id, commands);
			viewModel.setPrevEditOperationType(EditOperationType.DeletingLeft);
		}
	});

	export const DeleteRight: EditorCommand = registerEditorCommand(new class extends CoreEditingCommand {
		constructor() {
			super({
				id: 'deleteRight',
				precondition: undefined,
				kbOpts: {
					weight: CORE_WEIGHT,
					kbExpr: EditorContextKeys.textInputFocus,
					primary: KeyCode.Delete,
					mac: { primary: KeyCode.Delete, secondary: [KeyMod.WinCtrl | KeyCode.KeyD, KeyMod.WinCtrl | KeyCode.Delete] }
				}
			});
		}

		public runCoreEditingCommand(editor: ICodeEditor, viewModel: IViewModel, args: unknown): void {
			const [shouldPushStackElementBefore, commands] = DeleteOperations.deleteRight(viewModel.getPrevEditOperationType(), viewModel.cursorConfig, viewModel.model, viewModel.getCursorStates().map(s => s.modelState.selection));
			if (shouldPushStackElementBefore) {
				editor.pushUndoStop();
			}
			editor.executeCommands(this.id, commands);
			viewModel.setPrevEditOperationType(EditOperationType.DeletingRight);
		}
	});

	export const Undo = new class extends EditorOrNativeTextInputCommand {
		constructor() {
			super(UndoCommand);
		}
		public runDOMCommand(activeElement: Element): void {
			activeElement.ownerDocument.execCommand('undo');
		}
		public runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, args: unknown): void | Promise<void> {
			if (!editor.hasModel() || editor.getOption(EditorOption.readOnly) === true) {
				return;
			}
			return editor.getModel().undo();
		}
	}();

	export const Redo = new class extends EditorOrNativeTextInputCommand {
		constructor() {
			super(RedoCommand);
		}
		public runDOMCommand(activeElement: Element): void {
			activeElement.ownerDocument.execCommand('redo');
		}
		public runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, args: unknown): void | Promise<void> {
			if (!editor.hasModel() || editor.getOption(EditorOption.readOnly) === true) {
				return;
			}
			return editor.getModel().redo();
		}
	}();
}

/**
 * A command that will invoke a command on the focused editor.
 */
class EditorHandlerCommand extends Command {

	private readonly _handlerId: string;

	constructor(id: string, handlerId: string, metadata?: ICommandMetadata) {
		super({
			id: id,
			precondition: undefined,
			metadata
		});
		this._handlerId = handlerId;
	}

	public runCommand(accessor: ServicesAccessor, args: unknown): void {
		const editor = accessor.get(ICodeEditorService).getFocusedCodeEditor();
		if (!editor) {
			return;
		}

		editor.trigger('keyboard', this._handlerId, args);
	}
}

function registerOverwritableCommand(handlerId: string, metadata?: ICommandMetadata): void {
	registerCommand(new EditorHandlerCommand('default:' + handlerId, handlerId));
	registerCommand(new EditorHandlerCommand(handlerId, handlerId, metadata));
}

registerOverwritableCommand(Handler.Type, {
	description: `Type`,
	args: [{
		name: 'args',
		schema: {
			'type': 'object',
			'required': ['text'],
			'properties': {
				'text': {
					'type': 'string'
				}
			},
		}
	}]
});
registerOverwritableCommand(Handler.ReplacePreviousChar);
registerOverwritableCommand(Handler.CompositionType);
registerOverwritableCommand(Handler.CompositionStart);
registerOverwritableCommand(Handler.CompositionEnd);
registerOverwritableCommand(Handler.Paste);
registerOverwritableCommand(Handler.Cut);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/dataTransfer.ts]---
Location: vscode-main/src/vs/editor/browser/dataTransfer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DataTransfers } from '../../base/browser/dnd.js';
import { createFileDataTransferItem, createStringDataTransferItem, IDataTransferItem, UriList, VSDataTransfer } from '../../base/common/dataTransfer.js';
import { Mimes } from '../../base/common/mime.js';
import { URI } from '../../base/common/uri.js';
import { CodeDataTransfers, getPathForFile } from '../../platform/dnd/browser/dnd.js';


export function toVSDataTransfer(dataTransfer: DataTransfer): VSDataTransfer {
	const vsDataTransfer = new VSDataTransfer();
	for (const item of dataTransfer.items) {
		const type = item.type;
		if (item.kind === 'string') {
			const asStringValue = new Promise<string>(resolve => item.getAsString(resolve));
			vsDataTransfer.append(type, createStringDataTransferItem(asStringValue));
		} else if (item.kind === 'file') {
			const file = item.getAsFile();
			if (file) {
				vsDataTransfer.append(type, createFileDataTransferItemFromFile(file));
			}
		}
	}
	return vsDataTransfer;
}

function createFileDataTransferItemFromFile(file: File): IDataTransferItem {
	const path = getPathForFile(file);
	const uri = path ? URI.parse(path) : undefined;
	return createFileDataTransferItem(file.name, uri, async () => {
		return new Uint8Array(await file.arrayBuffer());
	});
}

const INTERNAL_DND_MIME_TYPES = Object.freeze([
	CodeDataTransfers.EDITORS,
	CodeDataTransfers.FILES,
	DataTransfers.RESOURCES,
	DataTransfers.INTERNAL_URI_LIST,
]);

export function toExternalVSDataTransfer(sourceDataTransfer: DataTransfer, overwriteUriList = false): VSDataTransfer {
	const vsDataTransfer = toVSDataTransfer(sourceDataTransfer);

	// Try to expose the internal uri-list type as the standard type
	const uriList = vsDataTransfer.get(DataTransfers.INTERNAL_URI_LIST);
	if (uriList) {
		vsDataTransfer.replace(Mimes.uriList, uriList);
	} else {
		if (overwriteUriList || !vsDataTransfer.has(Mimes.uriList)) {
			// Otherwise, fallback to adding dragged resources to the uri list
			const editorData: string[] = [];
			for (const item of sourceDataTransfer.items) {
				const file = item.getAsFile();
				if (file) {
					const path = getPathForFile(file);
					try {
						if (path) {
							editorData.push(URI.file(path).toString());
						} else {
							editorData.push(URI.parse(file.name, true).toString());
						}
					} catch {
						// Parsing failed. Leave out from list
					}
				}
			}

			if (editorData.length) {
				vsDataTransfer.replace(Mimes.uriList, createStringDataTransferItem(UriList.create(editorData)));
			}
		}
	}

	for (const internal of INTERNAL_DND_MIME_TYPES) {
		vsDataTransfer.delete(internal);
	}

	return vsDataTransfer;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/editorBrowser.ts]---
Location: vscode-main/src/vs/editor/browser/editorBrowser.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IKeyboardEvent } from '../../base/browser/keyboardEvent.js';
import { IMouseEvent, IMouseWheelEvent } from '../../base/browser/mouseEvent.js';
import { IBoundarySashes } from '../../base/browser/ui/sash/sash.js';
import { Event } from '../../base/common/event.js';
import { MenuId } from '../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../platform/instantiation/common/instantiation.js';
import { ConfigurationChangedEvent, EditorLayoutInfo, EditorOption, FindComputedEditorOptionValueById, IComputedEditorOptions, IDiffEditorOptions, IEditorOptions, OverviewRulerPosition } from '../common/config/editorOptions.js';
import { IDimension } from '../common/core/2d/dimension.js';
import { TextEdit } from '../common/core/edits/textEdit.js';
import { IPosition, Position } from '../common/core/position.js';
import { IRange, Range } from '../common/core/range.js';
import { Selection } from '../common/core/selection.js';
import { IWordAtPosition } from '../common/core/wordHelper.js';
import { ICursorPositionChangedEvent, ICursorSelectionChangedEvent } from '../common/cursorEvents.js';
import { IDiffComputationResult, ILineChange } from '../common/diff/legacyLinesDiffComputer.js';
import * as editorCommon from '../common/editorCommon.js';
import { GlyphMarginLane, ICursorStateComputer, IIdentifiedSingleEditOperation, IModelDecoration, IModelDecorationsChangeAccessor, IModelDeltaDecoration, ITextModel, PositionAffinity } from '../common/model.js';
import { InjectedText } from '../common/modelLineProjectionData.js';
import { TextModelEditSource } from '../common/textModelEditSource.js';
import { IModelContentChangedEvent, IModelDecorationsChangedEvent, IModelLanguageChangedEvent, IModelLanguageConfigurationChangedEvent, IModelOptionsChangedEvent, IModelTokensChangedEvent, ModelFontChangedEvent, ModelLineHeightChangedEvent } from '../common/textModelEvents.js';
import { IEditorWhitespace, IViewModel } from '../common/viewModel.js';
import { OverviewRulerZone } from '../common/viewModel/overviewZoneManager.js';
import { IEditorConstructionOptions } from './config/editorConfiguration.js';

/**
 * A view zone is a full horizontal rectangle that 'pushes' text down.
 * The editor reserves space for view zones when rendering.
 */
export interface IViewZone {
	/**
	 * The line number after which this zone should appear.
	 * Use 0 to place a view zone before the first line number.
	 */
	afterLineNumber: number;
	/**
	 * The column after which this zone should appear.
	 * If not set, the maxLineColumn of `afterLineNumber` will be used.
	 * This is relevant for wrapped lines.
	 */
	afterColumn?: number;
	/**
	 * If the `afterColumn` has multiple view columns, the affinity specifies which one to use. Defaults to `none`.
	*/
	afterColumnAffinity?: PositionAffinity;
	/**
	 * Render the zone even when its line is hidden.
	 */
	showInHiddenAreas?: boolean;
	/**
	 * Tiebreaker that is used when multiple view zones want to be after the same line.
	 * Defaults to `afterColumn` otherwise 10000;
	 */
	ordinal?: number;
	/**
	 * Suppress mouse down events.
	 * If set, the editor will attach a mouse down listener to the view zone and .preventDefault on it.
	 * Defaults to false
	 */
	suppressMouseDown?: boolean;
	/**
	 * The height in lines of the view zone.
	 * If specified, `heightInPx` will be used instead of this.
	 * If neither `heightInPx` nor `heightInLines` is specified, a default of `heightInLines` = 1 will be chosen.
	 */
	heightInLines?: number;
	/**
	 * The height in px of the view zone.
	 * If this is set, the editor will give preference to it rather than `heightInLines` above.
	 * If neither `heightInPx` nor `heightInLines` is specified, a default of `heightInLines` = 1 will be chosen.
	 */
	heightInPx?: number;
	/**
	 * The minimum width in px of the view zone.
	 * If this is set, the editor will ensure that the scroll width is >= than this value.
	 */
	minWidthInPx?: number;
	/**
	 * The dom node of the view zone
	 */
	domNode: HTMLElement;
	/**
	 * An optional dom node for the view zone that will be placed in the margin area.
	 */
	marginDomNode?: HTMLElement | null;
	/**
	 * Callback which gives the relative top of the view zone as it appears (taking scrolling into account).
	 */
	onDomNodeTop?: (top: number) => void;
	/**
	 * Callback which gives the height in pixels of the view zone.
	 */
	onComputedHeight?: (height: number) => void;
}
/**
 * An accessor that allows for zones to be added or removed.
 */
export interface IViewZoneChangeAccessor {
	/**
	 * Create a new view zone.
	 * @param zone Zone to create
	 * @return A unique identifier to the view zone.
	 */
	addZone(zone: IViewZone): string;
	/**
	 * Remove a zone
	 * @param id A unique identifier to the view zone, as returned by the `addZone` call.
	 */
	removeZone(id: string): void;
	/**
	 * Change a zone's position.
	 * The editor will rescan the `afterLineNumber` and `afterColumn` properties of a view zone.
	 */
	layoutZone(id: string): void;
}

/**
 * A positioning preference for rendering content widgets.
 */
export const enum ContentWidgetPositionPreference {
	/**
	 * Place the content widget exactly at a position
	 */
	EXACT,
	/**
	 * Place the content widget above a position
	 */
	ABOVE,
	/**
	 * Place the content widget below a position
	 */
	BELOW
}
/**
 * A position for rendering content widgets.
 */
export interface IContentWidgetPosition {
	/**
	 * Desired position which serves as an anchor for placing the content widget.
	 * The widget will be placed above, at, or below the specified position, based on the
	 * provided preference. The widget will always touch this position.
	 *
	 * Given sufficient horizontal space, the widget will be placed to the right of the
	 * passed in position. This can be tweaked by providing a `secondaryPosition`.
	 *
	 * @see preference
	 * @see secondaryPosition
	 */
	position: IPosition | null;
	/**
	 * Optionally, a secondary position can be provided to further define the placing of
	 * the content widget. The secondary position must have the same line number as the
	 * primary position. If possible, the widget will be placed such that it also touches
	 * the secondary position.
	 */
	secondaryPosition?: IPosition | null;
	/**
	 * Placement preference for position, in order of preference.
	 */
	preference: ContentWidgetPositionPreference[];

	/**
	 * Placement preference when multiple view positions refer to the same (model) position.
	 * This plays a role when injected text is involved.
	*/
	positionAffinity?: PositionAffinity;
}
/**
 * A content widget renders inline with the text and can be easily placed 'near' an editor position.
 */
export interface IContentWidget {
	/**
	 * Render this content widget in a location where it could overflow the editor's view dom node.
	 */
	allowEditorOverflow?: boolean;

	/**
	 * If true, this widget doesn't have a visual representation.
	 * The element will have display set to 'none'.
	*/
	useDisplayNone?: boolean;

	/**
	 * Call preventDefault() on mousedown events that target the content widget.
	 */
	suppressMouseDown?: boolean;
	/**
	 * Get a unique identifier of the content widget.
	 */
	getId(): string;
	/**
	 * Get the dom node of the content widget.
	 */
	getDomNode(): HTMLElement;
	/**
	 * Get the placement of the content widget.
	 * If null is returned, the content widget will be placed off screen.
	 */
	getPosition(): IContentWidgetPosition | null;
	/**
	 * Optional function that is invoked before rendering
	 * the content widget. If a dimension is returned the editor will
	 * attempt to use it.
	 */
	beforeRender?(): IDimension | null;
	/**
	 * Optional function that is invoked after rendering the content
	 * widget. Is being invoked with the selected position preference
	 * or `null` if not rendered.
	 */
	afterRender?(position: ContentWidgetPositionPreference | null, coordinate: IContentWidgetRenderedCoordinate | null): void;
}

/**
 * Coordinatees passed in {@link IContentWidget.afterRender}
 */
export interface IContentWidgetRenderedCoordinate {
	/**
	 * Top position relative to the editor content.
	 */
	readonly top: number;

	/**
	 * Left position relative to the editor content.
	 */
	readonly left: number;
}

/**
 * A positioning preference for rendering overlay widgets.
 */
export const enum OverlayWidgetPositionPreference {
	/**
	 * Position the overlay widget in the top right corner
	 */
	TOP_RIGHT_CORNER,

	/**
	 * Position the overlay widget in the bottom right corner
	 */
	BOTTOM_RIGHT_CORNER,

	/**
	 * Position the overlay widget in the top center
	 */
	TOP_CENTER
}


/**
 * Represents editor-relative coordinates of an overlay widget.
 */
export interface IOverlayWidgetPositionCoordinates {
	/**
	 * The top position for the overlay widget, relative to the editor.
	 */
	top: number;
	/**
	 * The left position for the overlay widget, relative to the editor.
	 */
	left: number;
}

/**
 * A position for rendering overlay widgets.
 */
export interface IOverlayWidgetPosition {
	/**
	 * The position preference for the overlay widget.
	 */
	preference: OverlayWidgetPositionPreference | IOverlayWidgetPositionCoordinates | null;

	/**
	 * When set, stacks with other overlay widgets with the same preference,
	 * in an order determined by the ordinal value.
	 */
	stackOrdinal?: number;
}
/**
 * An overlay widgets renders on top of the text.
 */
export interface IOverlayWidget {
	/**
	 * Event fired when the widget layout changes.
	 */
	readonly onDidLayout?: Event<void>;
	/**
	 * Render this overlay widget in a location where it could overflow the editor's view dom node.
	 */
	allowEditorOverflow?: boolean;
	/**
	 * Get a unique identifier of the overlay widget.
	 */
	getId(): string;
	/**
	 * Get the dom node of the overlay widget.
	 */
	getDomNode(): HTMLElement;
	/**
	 * Get the placement of the overlay widget.
	 * If null is returned, the overlay widget is responsible to place itself.
	 */
	getPosition(): IOverlayWidgetPosition | null;
	/**
	 * The editor will ensure that the scroll width is >= than this value.
	 */
	getMinContentWidthInPx?(): number;
}

/**
 * A glyph margin widget renders in the editor glyph margin.
 */
export interface IGlyphMarginWidget {
	/**
	 * Get a unique identifier of the glyph widget.
	 */
	getId(): string;
	/**
	 * Get the dom node of the glyph widget.
	 */
	getDomNode(): HTMLElement;
	/**
	 * Get the placement of the glyph widget.
	 */
	getPosition(): IGlyphMarginWidgetPosition;
}

/**
 * A position for rendering glyph margin widgets.
 */
export interface IGlyphMarginWidgetPosition {
	/**
	 * The glyph margin lane where the widget should be shown.
	 */
	lane: GlyphMarginLane;
	/**
	 * The priority order of the widget, used for determining which widget
	 * to render when there are multiple.
	 */
	zIndex: number;
	/**
	 * The editor range that this widget applies to.
	 */
	range: IRange;
}

/**
 * Type of hit element with the mouse in the editor.
 */
export const enum MouseTargetType {
	/**
	 * Mouse is on top of an unknown element.
	 */
	UNKNOWN,
	/**
	 * Mouse is on top of the textarea used for input.
	 */
	TEXTAREA,
	/**
	 * Mouse is on top of the glyph margin
	 */
	GUTTER_GLYPH_MARGIN,
	/**
	 * Mouse is on top of the line numbers
	 */
	GUTTER_LINE_NUMBERS,
	/**
	 * Mouse is on top of the line decorations
	 */
	GUTTER_LINE_DECORATIONS,
	/**
	 * Mouse is on top of the whitespace left in the gutter by a view zone.
	 */
	GUTTER_VIEW_ZONE,
	/**
	 * Mouse is on top of text in the content.
	 */
	CONTENT_TEXT,
	/**
	 * Mouse is on top of empty space in the content (e.g. after line text or below last line)
	 */
	CONTENT_EMPTY,
	/**
	 * Mouse is on top of a view zone in the content.
	 */
	CONTENT_VIEW_ZONE,
	/**
	 * Mouse is on top of a content widget.
	 */
	CONTENT_WIDGET,
	/**
	 * Mouse is on top of the decorations overview ruler.
	 */
	OVERVIEW_RULER,
	/**
	 * Mouse is on top of a scrollbar.
	 */
	SCROLLBAR,
	/**
	 * Mouse is on top of an overlay widget.
	 */
	OVERLAY_WIDGET,
	/**
	 * Mouse is outside of the editor.
	 */
	OUTSIDE_EDITOR,
}
export interface IBaseMouseTarget {
	/**
	 * The target element
	 */
	readonly element: HTMLElement | null;
	/**
	 * The 'approximate' editor position
	 */
	readonly position: Position | null;
	/**
	 * Desired mouse column (e.g. when position.column gets clamped to text length -- clicking after text on a line).
	 */
	readonly mouseColumn: number;
	/**
	 * The 'approximate' editor range
	 */
	readonly range: Range | null;
}
export interface IMouseTargetUnknown extends IBaseMouseTarget {
	readonly type: MouseTargetType.UNKNOWN;
}
export interface IMouseTargetTextarea extends IBaseMouseTarget {
	readonly type: MouseTargetType.TEXTAREA;
	readonly position: null;
	readonly range: null;
}
export interface IMouseTargetMarginData {
	readonly isAfterLines: boolean;
	readonly glyphMarginLeft: number;
	readonly glyphMarginWidth: number;
	readonly glyphMarginLane?: GlyphMarginLane;
	readonly lineNumbersWidth: number;
	readonly offsetX: number;
}
export interface IMouseTargetMargin extends IBaseMouseTarget {
	readonly type: MouseTargetType.GUTTER_GLYPH_MARGIN | MouseTargetType.GUTTER_LINE_NUMBERS | MouseTargetType.GUTTER_LINE_DECORATIONS;
	readonly position: Position;
	readonly range: Range;
	readonly detail: IMouseTargetMarginData;
}
export interface IMouseTargetViewZoneData {
	readonly viewZoneId: string;
	readonly positionBefore: Position | null;
	readonly positionAfter: Position | null;
	readonly position: Position;
	readonly afterLineNumber: number;
}
export interface IMouseTargetViewZone extends IBaseMouseTarget {
	readonly type: MouseTargetType.GUTTER_VIEW_ZONE | MouseTargetType.CONTENT_VIEW_ZONE;
	readonly position: Position;
	readonly range: Range;
	readonly detail: IMouseTargetViewZoneData;
}
export interface IMouseTargetContentTextData {
	readonly mightBeForeignElement: boolean;
	/**
	 * @internal
	 */
	readonly injectedText: InjectedText | null;
}
export interface IMouseTargetContentText extends IBaseMouseTarget {
	readonly type: MouseTargetType.CONTENT_TEXT;
	readonly position: Position;
	readonly range: Range;
	readonly detail: IMouseTargetContentTextData;
}
export interface IMouseTargetContentEmptyData {
	readonly isAfterLines: boolean;
	readonly horizontalDistanceToText?: number;
}
export interface IMouseTargetContentEmpty extends IBaseMouseTarget {
	readonly type: MouseTargetType.CONTENT_EMPTY;
	readonly position: Position;
	readonly range: Range;
	readonly detail: IMouseTargetContentEmptyData;
}
export interface IMouseTargetContentWidget extends IBaseMouseTarget {
	readonly type: MouseTargetType.CONTENT_WIDGET;
	readonly position: null;
	readonly range: null;
	readonly detail: string;
}
export interface IMouseTargetOverlayWidget extends IBaseMouseTarget {
	readonly type: MouseTargetType.OVERLAY_WIDGET;
	readonly position: null;
	readonly range: null;
	readonly detail: string;
}
export interface IMouseTargetScrollbar extends IBaseMouseTarget {
	readonly type: MouseTargetType.SCROLLBAR;
	readonly position: Position;
	readonly range: Range;
}
export interface IMouseTargetOverviewRuler extends IBaseMouseTarget {
	readonly type: MouseTargetType.OVERVIEW_RULER;
}
export interface IMouseTargetOutsideEditor extends IBaseMouseTarget {
	readonly type: MouseTargetType.OUTSIDE_EDITOR;
	readonly outsidePosition: 'above' | 'below' | 'left' | 'right';
	readonly outsideDistance: number;
}
/**
 * Target hit with the mouse in the editor.
 */
export type IMouseTarget = (
	IMouseTargetUnknown
	| IMouseTargetTextarea
	| IMouseTargetMargin
	| IMouseTargetViewZone
	| IMouseTargetContentText
	| IMouseTargetContentEmpty
	| IMouseTargetContentWidget
	| IMouseTargetOverlayWidget
	| IMouseTargetScrollbar
	| IMouseTargetOverviewRuler
	| IMouseTargetOutsideEditor
);
/**
 * A mouse event originating from the editor.
 */
export interface IEditorMouseEvent {
	readonly event: IMouseEvent;
	readonly target: IMouseTarget;
}
export interface IPartialEditorMouseEvent {
	readonly event: IMouseEvent;
	readonly target: IMouseTarget | null;
}

/**
 * A paste event originating from the editor.
 */
export interface IPasteEvent {
	readonly range: Range;
	readonly languageId: string | null;
	readonly clipboardEvent?: ClipboardEvent;
}

/**
 * @internal
 */
export interface PastePayload {
	text: string;
	pasteOnNewLine: boolean;
	multicursorText: string[] | null;
	mode: string | null;
	clipboardEvent?: ClipboardEvent;
}

/**
 * An overview ruler
 * @internal
 */
export interface IOverviewRuler {
	getDomNode(): HTMLElement;
	dispose(): void;
	setZones(zones: OverviewRulerZone[]): void;
	setLayout(position: OverviewRulerPosition): void;
}

/**
 * Editor aria options.
 * @internal
 */
export interface IEditorAriaOptions {
	activeDescendant: string | undefined;
	role?: string;
}

export interface IDiffEditorConstructionOptions extends IDiffEditorOptions, IEditorConstructionOptions {
	/**
	 * Place overflow widgets inside an external DOM node.
	 * Defaults to an internal DOM node.
	 */
	overflowWidgetsDomNode?: HTMLElement;

	/**
	 * Aria label for original editor.
	 */
	originalAriaLabel?: string;

	/**
	 * Aria label for modified editor.
	 */
	modifiedAriaLabel?: string;
}

/**
 * A rich code editor.
 */
export interface ICodeEditor extends editorCommon.IEditor {
	/**
	 * This editor is used as an alternative to an <input> box, i.e. as a simple widget.
	 * @internal
	 */
	readonly isSimpleWidget: boolean;
	/**
	 * The context menu ID that should be used to lookup context menu actions.
	 * @internal
	 */
	readonly contextMenuId: MenuId;
	/**
	 * The editor's scoped context key service.
	 * @internal
	 */
	readonly contextKeyService: IContextKeyService;
	/**
	 * An event emitted when the content of the current model has changed.
	 * @event
	 */
	readonly onDidChangeModelContent: Event<IModelContentChangedEvent>;
	/**
	 * An event emitted when the language of the current model has changed.
	 * @event
	 */
	readonly onDidChangeModelLanguage: Event<IModelLanguageChangedEvent>;
	/**
	 * An event emitted when the language configuration of the current model has changed.
	 * @event
	 */
	readonly onDidChangeModelLanguageConfiguration: Event<IModelLanguageConfigurationChangedEvent>;
	/**
	 * An event emitted when the options of the current model has changed.
	 * @event
	 */
	readonly onDidChangeModelOptions: Event<IModelOptionsChangedEvent>;
	/**
	 * An event emitted when the configuration of the editor has changed. (e.g. `editor.updateOptions()`)
	 * @event
	 */
	readonly onDidChangeConfiguration: Event<ConfigurationChangedEvent>;
	/**
	 * An event emitted when the cursor position has changed.
	 * @event
	 */
	readonly onDidChangeCursorPosition: Event<ICursorPositionChangedEvent>;
	/**
	 * An event emitted when the cursor selection has changed.
	 * @event
	 */
	readonly onDidChangeCursorSelection: Event<ICursorSelectionChangedEvent>;
	/**
	 * An event emitted when the model of this editor is about to change (e.g. from `editor.setModel()`).
	 * @event
	 */
	readonly onWillChangeModel: Event<editorCommon.IModelChangedEvent>;
	/**
	 * An event emitted when the model of this editor has changed (e.g. `editor.setModel()`).
	 * @event
	 */
	readonly onDidChangeModel: Event<editorCommon.IModelChangedEvent>;
	/**
	 * An event emitted when the decorations of the current model have changed.
	 * @event
	 */
	readonly onDidChangeModelDecorations: Event<IModelDecorationsChangedEvent>;
	/**
	 * An event emitted when the tokens of the current model have changed.
	 * @internal
	 */
	readonly onDidChangeModelTokens: Event<IModelTokensChangedEvent>;
	/**
	 * An event emitted when the text inside this editor gained focus (i.e. cursor starts blinking).
	 * @event
	 */
	readonly onDidFocusEditorText: Event<void>;
	/**
	 * An event emitted when the text inside this editor lost focus (i.e. cursor stops blinking).
	 * @event
	 */
	readonly onDidBlurEditorText: Event<void>;
	/**
	 * An event emitted when the text inside this editor or an editor widget gained focus.
	 * @event
	 */
	readonly onDidFocusEditorWidget: Event<void>;
	/**
	 * An event emitted when the text inside this editor or an editor widget lost focus.
	 * @event
	 */
	readonly onDidBlurEditorWidget: Event<void>;
	/**
	 * An event emitted before interpreting typed characters (on the keyboard).
	 * @event
	 * @internal
	 */
	readonly onWillType: Event<string>;
	/**
	 * An event emitted after interpreting typed characters (on the keyboard).
	 * @event
	 * @internal
	 */
	readonly onDidType: Event<string>;
	/**
	 * Boolean indicating whether input is in composition
	 */
	readonly inComposition: boolean;
	/**
	 * An event emitted after composition has started.
	 */
	readonly onDidCompositionStart: Event<void>;
	/**
	 * An event emitted after composition has ended.
	 */
	readonly onDidCompositionEnd: Event<void>;
	/**
	 * An event emitted when editing failed because the editor is read-only.
	 * @event
	 */
	readonly onDidAttemptReadOnlyEdit: Event<void>;
	/**
	 * An event emitted when users paste text in the editor.
	 * @event
	 */
	readonly onDidPaste: Event<IPasteEvent>;
	/**
	 * An event emitted on a "mouseup".
	 * @event
	 */
	readonly onMouseUp: Event<IEditorMouseEvent>;
	/**
	 * An event emitted on a "mousedown".
	 * @event
	 */
	readonly onMouseDown: Event<IEditorMouseEvent>;
	/**
	 * An event emitted on a "mousedrag".
	 * @internal
	 * @event
	 */
	readonly onMouseDrag: Event<IEditorMouseEvent>;
	/**
	 * An event emitted on a "mousedrop".
	 * @internal
	 * @event
	 */
	readonly onMouseDrop: Event<IPartialEditorMouseEvent>;
	/**
	 * An event emitted on a "mousedropcanceled".
	 * @internal
	 * @event
	 */
	readonly onMouseDropCanceled: Event<void>;
	/**
	 * An event emitted when content is dropped into the editor.
	 * @internal
	 * @event
	 */
	readonly onDropIntoEditor: Event<{ readonly position: IPosition; readonly event: DragEvent }>;
	/**
	 * An event emitted on a "contextmenu".
	 * @event
	 */
	readonly onContextMenu: Event<IEditorMouseEvent>;
	/**
	 * An event emitted on a "mousemove".
	 * @event
	 */
	readonly onMouseMove: Event<IEditorMouseEvent>;
	/**
	 * An event emitted on a "mouseleave".
	 * @event
	 */
	readonly onMouseLeave: Event<IPartialEditorMouseEvent>;
	/**
	 * An event emitted on a "mousewheel"
	 * @event
	 * @internal
	 */
	readonly onMouseWheel: Event<IMouseWheelEvent>;
	/**
	 * An event emitted on a "keyup".
	 * @event
	 */
	readonly onKeyUp: Event<IKeyboardEvent>;
	/**
	 * An event emitted on a "keydown".
	 * @event
	 */
	readonly onKeyDown: Event<IKeyboardEvent>;
	/**
	 * An event emitted when the layout of the editor has changed.
	 * @event
	 */
	readonly onDidLayoutChange: Event<EditorLayoutInfo>;
	/**
	 * An event emitted when the content width or content height in the editor has changed.
	 * @event
	 */
	readonly onDidContentSizeChange: Event<editorCommon.IContentSizeChangedEvent>;
	/**
	 * An event emitted when the scroll in the editor has changed.
	 * @event
	 */
	readonly onDidScrollChange: Event<editorCommon.IScrollEvent>;

	/**
	 * An event emitted when hidden areas change in the editor (e.g. due to folding).
	 * @event
	 */
	readonly onDidChangeHiddenAreas: Event<void>;

	/**
	 * An event emitted before an editor
	 * @internal
	 */
	readonly onWillTriggerEditorOperationEvent: Event<editorCommon.ITriggerEditorOperationEvent>;

	/**
	 * Some editor operations fire multiple events at once.
	 * To allow users to react to multiple events fired by a single operation,
	 * the editor fires a begin update before the operation and an end update after the operation.
	 * Whenever the editor fires `onBeginUpdate`, it will also fire `onEndUpdate` once the operation finishes.
	 * Note that not all operations are bracketed by `onBeginUpdate` and `onEndUpdate`.
	*/
	readonly onBeginUpdate: Event<void>;

	/**
	 * Fires after the editor completes the operation it fired `onBeginUpdate` for.
	*/
	readonly onEndUpdate: Event<void>;

	readonly onDidChangeViewZones: Event<void>;

	/**
	 * Saves current view state of the editor in a serializable object.
	 */
	saveViewState(): editorCommon.ICodeEditorViewState | null;

	/**
	 * Restores the view state of the editor from a serializable object generated by `saveViewState`.
	 */
	restoreViewState(state: editorCommon.ICodeEditorViewState | null): void;

	/**
	 * Returns true if the text inside this editor or an editor widget has focus.
	 */
	hasWidgetFocus(): boolean;

	/**
	 * Get a contribution of this editor.
	 * @id Unique identifier of the contribution.
	 * @return The contribution or null if contribution not found.
	 */
	getContribution<T extends editorCommon.IEditorContribution>(id: string): T | null;

	/**
	 * Execute `fn` with the editor's services.
	 * @internal
	 */
	invokeWithinContext<T>(fn: (accessor: ServicesAccessor) => T): T;

	/**
	 * Type the getModel() of IEditor.
	 */
	getModel(): ITextModel | null;

	/**
	 * Sets the current model attached to this editor.
	 * If the previous model was created by the editor via the value key in the options
	 * literal object, it will be destroyed. Otherwise, if the previous model was set
	 * via setModel, or the model key in the options literal object, the previous model
	 * will not be destroyed.
	 * It is safe to call setModel(null) to simply detach the current model from the editor.
	 */
	setModel(model: ITextModel | null): void;

	/**
	 * Gets all the editor computed options.
	 */
	getOptions(): IComputedEditorOptions;

	/**
	 * Gets a specific editor option.
	 */
	getOption<T extends EditorOption>(id: T): FindComputedEditorOptionValueById<T>;

	/**
	 * Returns the editor's configuration (without any validation or defaults).
	 */
	getRawOptions(): IEditorOptions;

	/**
	 * @internal
	 */
	getOverflowWidgetsDomNode(): HTMLElement | undefined;

	/**
	 * @internal
	 */
	getConfiguredWordAtPosition(position: Position): IWordAtPosition | null;

	/**
	 * An event emitted when line heights from decorations change
	 * @internal
	 * @event
	 */
	readonly onDidChangeLineHeight: Event<ModelLineHeightChangedEvent>;

	/**
	 * An event emitted when the font of the editor has changed.
	 * @internal
	 * @event
	 */
	readonly onDidChangeFont: Event<ModelFontChangedEvent>;

	/**
	 * Get value of the current model attached to this editor.
	 * @see {@link ITextModel.getValue}
	 */
	getValue(options?: { preserveBOM: boolean; lineEnding: string }): string;

	/**
	 * Set the value of the current model attached to this editor.
	 * @see {@link ITextModel.setValue}
	 */
	setValue(newValue: string): void;

	/**
	 * Get the width of the editor's content.
	 * This is information that is "erased" when computing `scrollWidth = Math.max(contentWidth, width)`
	 */
	getContentWidth(): number;
	/**
	 * Get the scrollWidth of the editor's viewport.
	 */
	getScrollWidth(): number;
	/**
	 * Get the scrollLeft of the editor's viewport.
	 */
	getScrollLeft(): number;

	/**
	 * Get the height of the editor's content.
	 * This is information that is "erased" when computing `scrollHeight = Math.max(contentHeight, height)`
	 */
	getContentHeight(): number;
	/**
	 * Get the scrollHeight of the editor's viewport.
	 */
	getScrollHeight(): number;
	/**
	 * Get the scrollTop of the editor's viewport.
	 */
	getScrollTop(): number;

	/**
	 * Change the scrollLeft of the editor's viewport.
	 */
	setScrollLeft(newScrollLeft: number, scrollType?: editorCommon.ScrollType): void;
	/**
	 * Change the scrollTop of the editor's viewport.
	 */
	setScrollTop(newScrollTop: number, scrollType?: editorCommon.ScrollType): void;
	/**
	 * Change the scroll position of the editor's viewport.
	 */
	setScrollPosition(position: editorCommon.INewScrollPosition, scrollType?: editorCommon.ScrollType): void;
	/**
	 * Check if the editor is currently scrolling towards a different scroll position.
	 */
	hasPendingScrollAnimation(): boolean;

	/**
	 * Get an action that is a contribution to this editor.
	 * @id Unique identifier of the contribution.
	 * @return The action or null if action not found.
	 */
	getAction(id: string): editorCommon.IEditorAction | null;

	/**
	 * Execute a command on the editor.
	 * The edits will land on the undo-redo stack, but no "undo stop" will be pushed.
	 * @param source The source of the call.
	 * @param command The command to execute
	 */
	executeCommand(source: string | null | undefined, command: editorCommon.ICommand): void;

	/**
	 * Create an "undo stop" in the undo-redo stack.
	 */
	pushUndoStop(): boolean;

	/**
	 * Remove the "undo stop" in the undo-redo stack.
	 */
	popUndoStop(): boolean;

	/**
	 * Execute edits on the editor.
	 * The edits will land on the undo-redo stack, but no "undo stop" will be pushed.
	 * @param source The source of the call.
	 * @param edits The edits to execute.
	 * @param endCursorState Cursor state after the edits were applied.
	 */
	executeEdits(source: string | null | undefined, edits: IIdentifiedSingleEditOperation[], endCursorState?: ICursorStateComputer | Selection[]): boolean;
	/** @internal */
	executeEdits(source: TextModelEditSource | undefined, edits: IIdentifiedSingleEditOperation[], endCursorState?: ICursorStateComputer | Selection[]): boolean;

	/**
	 * @internal
	*/
	edit(edit: TextEdit, reason: TextModelEditSource): void;

	/**
	 * Execute multiple (concomitant) commands on the editor.
	 * @param source The source of the call.
	 * @param command The commands to execute
	 */
	executeCommands(source: string | null | undefined, commands: (editorCommon.ICommand | null)[]): void;

	/**
	 * Scroll vertically or horizontally as necessary and reveal the current cursors.
	 */
	revealAllCursors(revealHorizontal: boolean, minimalReveal?: boolean): void;

	/**
	 * @internal
	 */
	_getViewModel(): IViewModel | null;

	/**
	 * Get all the decorations on a line (filtering out decorations from other editors).
	 */
	getLineDecorations(lineNumber: number): IModelDecoration[] | null;

	/**
	 * Get all the decorations for a range (filtering out decorations from other editors).
	 */
	getDecorationsInRange(range: Range): IModelDecoration[] | null;

	/**
	 * Get the font size at a given position
	 * @param position the position for which to fetch the font size
	 */
	getFontSizeAtPosition(position: IPosition): string | null;

	/**
	 * All decorations added through this call will get the ownerId of this editor.
	 * @deprecated Use `createDecorationsCollection`
	 * @see createDecorationsCollection
	 */
	deltaDecorations(oldDecorations: string[], newDecorations: IModelDeltaDecoration[]): string[];

	/**
	 * Remove previously added decorations.
	 */
	removeDecorations(decorationIds: string[]): void;

	/**
	 * @internal
	 */
	setDecorationsByType(description: string, decorationTypeKey: string, ranges: editorCommon.IDecorationOptions[]): readonly string[];

	/**
	 * @internal
	 */
	setDecorationsByTypeFast(decorationTypeKey: string, ranges: IRange[]): void;

	/**
	 * @internal
	 */
	removeDecorationsByType(decorationTypeKey: string): void;

	/**
	 * Get the layout info for the editor.
	 */
	getLayoutInfo(): EditorLayoutInfo;

	/**
	 * Returns the ranges that are currently visible.
	 * Does not account for horizontal scrolling.
	 */
	getVisibleRanges(): Range[];

	/**
	 * @internal
	 */
	getVisibleRangesPlusViewportAboveBelow(): Range[];

	/**
	 * Get the view zones.
	 * @internal
	 */
	getWhitespaces(): IEditorWhitespace[];

	/**
	 * Get the vertical position (top offset) for the line's top w.r.t. to the first line.
	 */
	getTopForLineNumber(lineNumber: number, includeViewZones?: boolean): number;

	/**
	 * Get the vertical position (top offset) for the line's bottom w.r.t. to the first line.
	 */
	getBottomForLineNumber(lineNumber: number): number;

	/**
	 * Get the vertical position (top offset) for the position w.r.t. to the first line.
	 */
	getTopForPosition(lineNumber: number, column: number): number;

	/**
	 * Get the line height for a model position.
	 */
	getLineHeightForPosition(position: IPosition): number;

	/**
	 * Set the model ranges that will be hidden in the view.
	 * Hidden areas are stored per source.
	 * @internal
	 */
	setHiddenAreas(ranges: IRange[], source?: unknown): void;

	/**
	 * Sets the editor aria options, primarily the active descendent.
	 * @internal
	 */
	setAriaOptions(options: IEditorAriaOptions): void;

	/**
	 * Write the screen reader content to be the current selection
	 */
	writeScreenReaderContent(reason: string): void;

	/**
	 * @internal
	 */
	getTelemetryData(): object | undefined;

	/**
	 * Returns the editor's container dom node
	 */
	getContainerDomNode(): HTMLElement;

	/**
	 * Returns the editor's dom node
	 */
	getDomNode(): HTMLElement | null;

	/**
	 * Add a content widget. Widgets must have unique ids, otherwise they will be overwritten.
	 */
	addContentWidget(widget: IContentWidget): void;
	/**
	 * Layout/Reposition a content widget. This is a ping to the editor to call widget.getPosition()
	 * and update appropriately.
	 */
	layoutContentWidget(widget: IContentWidget): void;
	/**
	 * Remove a content widget.
	 */
	removeContentWidget(widget: IContentWidget): void;

	/**
	 * Add an overlay widget. Widgets must have unique ids, otherwise they will be overwritten.
	 */
	addOverlayWidget(widget: IOverlayWidget): void;
	/**
	 * Layout/Reposition an overlay widget. This is a ping to the editor to call widget.getPosition()
	 * and update appropriately.
	 */
	layoutOverlayWidget(widget: IOverlayWidget): void;
	/**
	 * Remove an overlay widget.
	 */
	removeOverlayWidget(widget: IOverlayWidget): void;

	/**
	 * Add a glyph margin widget. Widgets must have unique ids, otherwise they will be overwritten.
	 */
	addGlyphMarginWidget(widget: IGlyphMarginWidget): void;
	/**
	 * Layout/Reposition a glyph margin widget. This is a ping to the editor to call widget.getPosition()
	 * and update appropriately.
	 */
	layoutGlyphMarginWidget(widget: IGlyphMarginWidget): void;
	/**
	 * Remove a glyph margin widget.
	 */
	removeGlyphMarginWidget(widget: IGlyphMarginWidget): void;

	/**
	 * Change the view zones. View zones are lost when a new model is attached to the editor.
	 */
	changeViewZones(callback: (accessor: IViewZoneChangeAccessor) => void): void;

	/**
	 * Get the horizontal position (left offset) for the column w.r.t to the beginning of the line.
	 * This method works only if the line `lineNumber` is currently rendered (in the editor's viewport).
	 * Use this method with caution.
	 */
	getOffsetForColumn(lineNumber: number, column: number): number;

	getWidthOfLine(lineNumber: number): number;

	/**
	 * Force an editor render now.
	 */
	render(forceRedraw?: boolean): void;

	/**
	 * Get the hit test target at coordinates `clientX` and `clientY`.
	 * The coordinates are relative to the top-left of the viewport.
	 *
	 * @returns Hit test target or null if the coordinates fall outside the editor or the editor has no model.
	 */
	getTargetAtClientPoint(clientX: number, clientY: number): IMouseTarget | null;

	/**
	 * Get the visible position for `position`.
	 * The result position takes scrolling into account and is relative to the top left corner of the editor.
	 * Explanation 1: the results of this method will change for the same `position` if the user scrolls the editor.
	 * Explanation 2: the results of this method will not change if the container of the editor gets repositioned.
	 * Warning: the results of this method are inaccurate for positions that are outside the current editor viewport.
	 */
	getScrolledVisiblePosition(position: IPosition): { top: number; left: number; height: number } | null;

	/**
	 * Apply the same font settings as the editor to `target`.
	 */
	applyFontInfo(target: HTMLElement): void;

	/**
	 * Check if the current instance has a model attached.
	 * @internal
	 */
	hasModel(): this is IActiveCodeEditor;

	setBanner(bannerDomNode: HTMLElement | null, height: number): void;

	/**
	 * Is called when the model has been set, view state was restored and options are updated.
	 * This is the best place to compute data for the viewport (such as tokens).
	 */
	handleInitialized?(): void;
}

/**
 * @internal
 */
export interface IActiveCodeEditor extends ICodeEditor {
	/**
	 * Returns the primary position of the cursor.
	 */
	getPosition(): Position;

	/**
	 * Returns the primary selection of the editor.
	 */
	getSelection(): Selection;

	/**
	 * Returns all the selections of the editor.
	 */
	getSelections(): Selection[];

	/**
	 * Saves current view state of the editor in a serializable object.
	 */
	saveViewState(): editorCommon.ICodeEditorViewState;

	/**
	 * Type the getModel() of IEditor.
	 */
	getModel(): ITextModel;

	/**
	 * @internal
	 */
	_getViewModel(): IViewModel;

	/**
	 * Get all the decorations on a line (filtering out decorations from other editors).
	 */
	getLineDecorations(lineNumber: number): IModelDecoration[];

	/**
	 * Returns the editor's dom node
	 */
	getDomNode(): HTMLElement;

	/**
	 * Get the visible position for `position`.
	 * The result position takes scrolling into account and is relative to the top left corner of the editor.
	 * Explanation 1: the results of this method will change for the same `position` if the user scrolls the editor.
	 * Explanation 2: the results of this method will not change if the container of the editor gets repositioned.
	 * Warning: the results of this method are inaccurate for positions that are outside the current editor viewport.
	 */
	getScrolledVisiblePosition(position: IPosition): { top: number; left: number; height: number };

	/**
	 * Change the decorations. All decorations added through this changeAccessor
	 * will get the ownerId of the editor (meaning they will not show up in other
	 * editors).
	 * @see {@link ITextModel.changeDecorations}
	 * @internal
	 */
	changeDecorations<T>(callback: (changeAccessor: IModelDecorationsChangeAccessor) => T): T;
}

/**
 * @internal
 */
export const enum DiffEditorState {
	Idle,
	ComputingDiff,
	DiffComputed
}

/**
 * A rich diff editor.
 */
export interface IDiffEditor extends editorCommon.IEditor {

	/**
	 * Returns whether the diff editor is ignoring trim whitespace or not.
	 * @internal
	 */
	readonly ignoreTrimWhitespace: boolean;
	/**
	 * Returns whether the diff editor is rendering side by side or inline.
	 * @internal
	 */
	readonly renderSideBySide: boolean;
	/**
	 * Timeout in milliseconds after which diff computation is cancelled.
	 * @internal
	 */
	readonly maxComputationTime: number;

	/**
	 * @see {@link ICodeEditor.getContainerDomNode}
	 */
	getContainerDomNode(): HTMLElement;

	/**
	 * An event emitted when the diff information computed by this diff editor has been updated.
	 * @event
	 */
	readonly onDidUpdateDiff: Event<void>;

	/**
	 * An event emitted when the diff model is changed (i.e. the diff editor shows new content).
	 * @event
	 */
	readonly onDidChangeModel: Event<void>;

	/**
	 * Saves current view state of the editor in a serializable object.
	 */
	saveViewState(): editorCommon.IDiffEditorViewState | null;

	/**
	 * Restores the view state of the editor from a serializable object generated by `saveViewState`.
	 */
	restoreViewState(state: editorCommon.IDiffEditorViewState | null): void;

	/**
	 * Type the getModel() of IEditor.
	 */
	getModel(): editorCommon.IDiffEditorModel | null;

	createViewModel(model: editorCommon.IDiffEditorModel): editorCommon.IDiffEditorViewModel;

	/**
	 * Sets the current model attached to this editor.
	 * If the previous model was created by the editor via the value key in the options
	 * literal object, it will be destroyed. Otherwise, if the previous model was set
	 * via setModel, or the model key in the options literal object, the previous model
	 * will not be destroyed.
	 * It is safe to call setModel(null) to simply detach the current model from the editor.
	 */
	setModel(model: editorCommon.IDiffEditorModel | editorCommon.IDiffEditorViewModel | null): void;

	/**
	 * Get the `original` editor.
	 */
	getOriginalEditor(): ICodeEditor;

	/**
	 * Get the `modified` editor.
	 */
	getModifiedEditor(): ICodeEditor;

	/**
	 * Get the computed diff information.
	 */
	getLineChanges(): ILineChange[] | null;

	/**
	 * Get the computed diff information.
	 * @internal
	 */
	getDiffComputationResult(): IDiffComputationResult | null;

	/**
	 * Update the editor's options after the editor has been created.
	 */
	updateOptions(newOptions: IDiffEditorOptions): void;

	/**
	 * @internal
	 */
	setBoundarySashes(sashes: IBoundarySashes): void;

	/**
	 * Jumps to the next or previous diff.
	 */
	goToDiff(target: 'next' | 'previous'): void;

	/**
	 * Scrolls to the first diff.
	 * (Waits until the diff computation finished.)
	 */
	revealFirstDiff(): unknown;

	accessibleDiffViewerNext(): void;

	accessibleDiffViewerPrev(): void;

	handleInitialized(): void;
}

/**
 *@internal
 */
export function isCodeEditor(thing: unknown): thing is ICodeEditor {
	if (thing && typeof (<ICodeEditor>thing).getEditorType === 'function') {
		return (<ICodeEditor>thing).getEditorType() === editorCommon.EditorType.ICodeEditor;
	} else {
		return false;
	}
}

/**
 *@internal
 */
export function isDiffEditor(thing: unknown): thing is IDiffEditor {
	if (thing && typeof (<IDiffEditor>thing).getEditorType === 'function') {
		return (<IDiffEditor>thing).getEditorType() === editorCommon.EditorType.IDiffEditor;
	} else {
		return false;
	}
}

/**
 *@internal
 */
export function isCompositeEditor(thing: unknown): thing is editorCommon.ICompositeCodeEditor {
	return !!thing
		&& typeof thing === 'object'
		&& typeof (<editorCommon.ICompositeCodeEditor>thing).onDidChangeActiveEditor === 'function';

}

/**
 *@internal
 */
export function getCodeEditor(thing: unknown): ICodeEditor | null {
	if (isCodeEditor(thing)) {
		return thing;
	}

	if (isDiffEditor(thing)) {
		return thing.getModifiedEditor();
	}

	if (isCompositeEditor(thing) && isCodeEditor(thing.activeCodeEditor)) {
		return thing.activeCodeEditor;
	}

	return null;
}

/**
 *@internal
 */
export function getIEditor(thing: unknown): editorCommon.IEditor | null {
	if (isCodeEditor(thing) || isDiffEditor(thing)) {
		return thing;
	}

	return null;
}
```

--------------------------------------------------------------------------------

````
