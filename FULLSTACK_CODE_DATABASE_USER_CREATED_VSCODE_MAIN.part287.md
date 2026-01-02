---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 287
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 287 of 552)

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

---[FILE: src/vs/platform/terminal/node/ptyService.ts]---
Location: vscode-main/src/vs/platform/terminal/node/ptyService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { execFile, exec } from 'child_process';
import { AutoOpenBarrier, ProcessTimeRunOnceScheduler, Promises, Queue, timeout } from '../../../base/common/async.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, toDisposable } from '../../../base/common/lifecycle.js';
import { IProcessEnvironment, isWindows, OperatingSystem, OS } from '../../../base/common/platform.js';
import { URI } from '../../../base/common/uri.js';
import { getSystemShell } from '../../../base/node/shell.js';
import { ILogService, LogLevel } from '../../log/common/log.js';
import { RequestStore } from '../common/requestStore.js';
import { IProcessDataEvent, IProcessReadyEvent, IPtyService, IRawTerminalInstanceLayoutInfo, IReconnectConstants, IShellLaunchConfig, ITerminalInstanceLayoutInfoById, ITerminalLaunchError, ITerminalsLayoutInfo, ITerminalTabLayoutInfoById, TerminalIcon, IProcessProperty, TitleEventSource, ProcessPropertyType, IProcessPropertyMap, IFixedTerminalDimensions, IPersistentTerminalProcessLaunchConfig, ICrossVersionSerializedTerminalState, ISerializedTerminalState, ITerminalProcessOptions, IPtyHostLatencyMeasurement, type IPtyServiceContribution, PosixShellType, ITerminalLaunchResult } from '../common/terminal.js';
import { TerminalDataBufferer } from '../common/terminalDataBuffering.js';
import { escapeNonWindowsPath } from '../common/terminalEnvironment.js';
import type { ISerializeOptions, SerializeAddon as XtermSerializeAddon } from '@xterm/addon-serialize';
import type { Unicode11Addon as XtermUnicode11Addon } from '@xterm/addon-unicode11';
import { IGetTerminalLayoutInfoArgs, IProcessDetails, ISetTerminalLayoutInfoArgs, ITerminalTabLayoutInfoDto } from '../common/terminalProcess.js';
import { getWindowsBuildNumber } from './terminalEnvironment.js';
import { TerminalProcess } from './terminalProcess.js';
import { localize } from '../../../nls.js';
import { ignoreProcessNames } from './childProcessMonitor.js';
import { ErrorNoTelemetry } from '../../../base/common/errors.js';
import { ShellIntegrationAddon } from '../common/xterm/shellIntegrationAddon.js';
import { formatMessageForTerminal } from '../common/terminalStrings.js';
import { IPtyHostProcessReplayEvent } from '../common/capabilities/capabilities.js';
import { IProductService } from '../../product/common/productService.js';
import { join } from '../../../base/common/path.js';
import { memoize } from '../../../base/common/decorators.js';
import * as performance from '../../../base/common/performance.js';
import pkg from '@xterm/headless';
import { AutoRepliesPtyServiceContribution } from './terminalContrib/autoReplies/autoRepliesContribController.js';
import { hasKey, isFunction, isNumber, isString } from '../../../base/common/types.js';

type XtermTerminal = pkg.Terminal;
const { Terminal: XtermTerminal } = pkg;

interface ITraceRpcArgs {
	logService: ILogService;
	simulatedLatency: number;
}

export function traceRpc(_target: Object, key: string, descriptor: PropertyDescriptor) {
	if (!isFunction(descriptor.value)) {
		throw new Error('not supported');
	}
	const fnKey = 'value';
	const fn = descriptor.value;
	descriptor[fnKey] = async function <TThis extends { traceRpcArgs: ITraceRpcArgs }>(this: TThis, ...args: unknown[]) {
		if (this.traceRpcArgs.logService.getLevel() === LogLevel.Trace) {
			this.traceRpcArgs.logService.trace(`[RPC Request] PtyService#${fn.name}(${args.map(e => JSON.stringify(e)).join(', ')})`);
		}
		if (this.traceRpcArgs.simulatedLatency) {
			await timeout(this.traceRpcArgs.simulatedLatency);
		}
		let result: unknown;
		try {
			result = await fn.apply(this, args);
		} catch (e) {
			this.traceRpcArgs.logService.error(`[RPC Response] PtyService#${fn.name}`, e);
			throw e;
		}
		if (this.traceRpcArgs.logService.getLevel() === LogLevel.Trace) {
			this.traceRpcArgs.logService.trace(`[RPC Response] PtyService#${fn.name}`, result);
		}
		return result;
	};
}

type WorkspaceId = string;

let SerializeAddon: typeof XtermSerializeAddon;
let Unicode11Addon: typeof XtermUnicode11Addon;

export class PtyService extends Disposable implements IPtyService {
	declare readonly _serviceBrand: undefined;

	private readonly _ptys: Map<number, PersistentTerminalProcess> = new Map();
	private readonly _workspaceLayoutInfos = new Map<WorkspaceId, ISetTerminalLayoutInfoArgs>();
	private readonly _detachInstanceRequestStore: RequestStore<IProcessDetails | undefined, { workspaceId: string; instanceId: number }>;
	private readonly _revivedPtyIdMap: Map<string, { newId: number; state: ISerializedTerminalState }> = new Map();

	// #region Pty service contribution RPC calls

	private readonly _autoRepliesContribution: AutoRepliesPtyServiceContribution;
	@traceRpc
	async installAutoReply(match: string, reply: string) {
		await this._autoRepliesContribution.installAutoReply(match, reply);
	}
	@traceRpc
	async uninstallAllAutoReplies() {
		await this._autoRepliesContribution.uninstallAllAutoReplies();
	}

	// #endregion

	private readonly _contributions: IPtyServiceContribution[];

	private _lastPtyId: number = 0;

	private readonly _onHeartbeat = this._register(new Emitter<void>());
	readonly onHeartbeat = this._traceEvent('_onHeartbeat', this._onHeartbeat.event);

	private readonly _onProcessData = this._register(new Emitter<{ id: number; event: IProcessDataEvent | string }>());
	readonly onProcessData = this._traceEvent('_onProcessData', this._onProcessData.event);
	private readonly _onProcessReplay = this._register(new Emitter<{ id: number; event: IPtyHostProcessReplayEvent }>());
	readonly onProcessReplay = this._traceEvent('_onProcessReplay', this._onProcessReplay.event);
	private readonly _onProcessReady = this._register(new Emitter<{ id: number; event: IProcessReadyEvent }>());
	readonly onProcessReady = this._traceEvent('_onProcessReady', this._onProcessReady.event);
	private readonly _onProcessExit = this._register(new Emitter<{ id: number; event: number | undefined }>());
	readonly onProcessExit = this._traceEvent('_onProcessExit', this._onProcessExit.event);
	private readonly _onProcessOrphanQuestion = this._register(new Emitter<{ id: number }>());
	readonly onProcessOrphanQuestion = this._traceEvent('_onProcessOrphanQuestion', this._onProcessOrphanQuestion.event);
	private readonly _onDidRequestDetach = this._register(new Emitter<{ requestId: number; workspaceId: string; instanceId: number }>());
	readonly onDidRequestDetach = this._traceEvent('_onDidRequestDetach', this._onDidRequestDetach.event);
	private readonly _onDidChangeProperty = this._register(new Emitter<{ id: number; property: IProcessProperty }>());
	readonly onDidChangeProperty = this._traceEvent('_onDidChangeProperty', this._onDidChangeProperty.event);

	private _traceEvent<T>(name: string, event: Event<T>): Event<T> {
		event(e => {
			if (this._logService.getLevel() === LogLevel.Trace) {
				this._logService.trace(`[RPC Event] PtyService#${name}.fire(${JSON.stringify(e)})`);
			}
		});
		return event;
	}

	@memoize
	get traceRpcArgs(): ITraceRpcArgs {
		return {
			logService: this._logService,
			simulatedLatency: this._simulatedLatency
		};
	}

	constructor(
		private readonly _logService: ILogService,
		private readonly _productService: IProductService,
		private readonly _reconnectConstants: IReconnectConstants,
		private readonly _simulatedLatency: number
	) {
		super();

		this._register(toDisposable(() => {
			for (const pty of this._ptys.values()) {
				pty.shutdown(true);
			}
			this._ptys.clear();
		}));

		this._detachInstanceRequestStore = this._register(new RequestStore(undefined, this._logService));
		this._detachInstanceRequestStore.onCreateRequest(this._onDidRequestDetach.fire, this._onDidRequestDetach);

		this._autoRepliesContribution = new AutoRepliesPtyServiceContribution(this._logService);

		this._contributions = [this._autoRepliesContribution];

	}

	@traceRpc
	async refreshIgnoreProcessNames(names: string[]): Promise<void> {
		ignoreProcessNames.length = 0;
		ignoreProcessNames.push(...names);
	}

	@traceRpc
	async requestDetachInstance(workspaceId: string, instanceId: number): Promise<IProcessDetails | undefined> {
		return this._detachInstanceRequestStore.createRequest({ workspaceId, instanceId });
	}

	@traceRpc
	async acceptDetachInstanceReply(requestId: number, persistentProcessId: number): Promise<void> {
		let processDetails: IProcessDetails | undefined = undefined;
		const pty = this._ptys.get(persistentProcessId);
		if (pty) {
			processDetails = await this._buildProcessDetails(persistentProcessId, pty);
		}
		this._detachInstanceRequestStore.acceptReply(requestId, processDetails);
	}

	@traceRpc
	async freePortKillProcess(port: string): Promise<{ port: string; processId: string }> {
		const stdout = await new Promise<string>((resolve, reject) => {
			exec(isWindows ? `netstat -ano | findstr "${port}"` : `lsof -nP -iTCP -sTCP:LISTEN | grep ${port}`, {}, (err, stdout) => {
				if (err) {
					return reject('Problem occurred when listing active processes');
				}
				resolve(stdout);
			});
		});
		const processesForPort = stdout.split(/\r?\n/).filter(s => !!s.trim());
		if (processesForPort.length >= 1) {
			const capturePid = /\s+(\d+)(?:\s+|$)/;
			const processId = processesForPort[0].match(capturePid)?.[1];
			if (processId) {
				try {
					process.kill(Number.parseInt(processId));
				} catch { }
			} else {
				throw new Error(`Processes for port ${port} were not found`);
			}
			return { port, processId };
		}
		throw new Error(`Could not kill process with port ${port}`);
	}

	@traceRpc
	async serializeTerminalState(ids: number[]): Promise<string> {
		const promises: Promise<ISerializedTerminalState>[] = [];
		for (const [persistentProcessId, persistentProcess] of this._ptys.entries()) {
			// Only serialize persistent processes that have had data written or performed a replay
			if (persistentProcess.hasWrittenData && ids.indexOf(persistentProcessId) !== -1) {
				promises.push(Promises.withAsyncBody<ISerializedTerminalState>(async r => {
					r({
						id: persistentProcessId,
						shellLaunchConfig: persistentProcess.shellLaunchConfig,
						processDetails: await this._buildProcessDetails(persistentProcessId, persistentProcess),
						processLaunchConfig: persistentProcess.processLaunchOptions,
						unicodeVersion: persistentProcess.unicodeVersion,
						replayEvent: await persistentProcess.serializeNormalBuffer(),
						timestamp: Date.now()
					});
				}));
			}
		}
		const serialized: ICrossVersionSerializedTerminalState = {
			version: 1,
			state: await Promise.all(promises)
		};
		return JSON.stringify(serialized);
	}

	@traceRpc
	async reviveTerminalProcesses(workspaceId: string, state: ISerializedTerminalState[], dateTimeFormatLocale: string) {
		const promises: Promise<void>[] = [];
		for (const terminal of state) {
			promises.push(this._reviveTerminalProcess(workspaceId, terminal));
		}
		await Promise.all(promises);
	}

	private async _reviveTerminalProcess(workspaceId: string, terminal: ISerializedTerminalState): Promise<void> {
		const restoreMessage = localize('terminal-history-restored', "History restored");

		// Conpty v1.22+ uses passthrough and doesn't reprint the buffer often, this means that when
		// the terminal is revived, the cursor would be at the bottom of the buffer then when
		// PSReadLine requests `GetConsoleCursorInfo` it will be handled by conpty itself by design.
		// This causes the cursor to move to the top into the replayed terminal contents. To avoid
		// this, the post restore message will print new lines to get a clear viewport and put the
		// cursor back at to top left.
		let postRestoreMessage = '';
		if (isWindows) {
			const lastReplayEvent = terminal.replayEvent.events.length > 0 ? terminal.replayEvent.events.at(-1) : undefined;
			if (lastReplayEvent) {
				postRestoreMessage += '\r\n'.repeat(lastReplayEvent.rows - 1) + `\x1b[H`;
			}
		}

		// TODO: We may at some point want to show date information in a hover via a custom sequence:
		//   new Date(terminal.timestamp).toLocaleDateString(dateTimeFormatLocale)
		//   new Date(terminal.timestamp).toLocaleTimeString(dateTimeFormatLocale)
		const newId = await this.createProcess(
			{
				...terminal.shellLaunchConfig,
				cwd: terminal.processDetails.cwd,
				color: terminal.processDetails.color,
				icon: terminal.processDetails.icon,
				name: terminal.processDetails.titleSource === TitleEventSource.Api ? terminal.processDetails.title : undefined,
				initialText: terminal.replayEvent.events[0].data + formatMessageForTerminal(restoreMessage, { loudFormatting: true }) + postRestoreMessage
			},
			terminal.processDetails.cwd,
			terminal.replayEvent.events[0].cols,
			terminal.replayEvent.events[0].rows,
			terminal.unicodeVersion,
			terminal.processLaunchConfig.env,
			terminal.processLaunchConfig.executableEnv,
			terminal.processLaunchConfig.options,
			true,
			terminal.processDetails.workspaceId,
			terminal.processDetails.workspaceName,
			true,
			terminal.replayEvent.events[0].data
		);
		// Don't start the process here as there's no terminal to answer CPR
		const oldId = this._getRevivingProcessId(workspaceId, terminal.id);
		this._revivedPtyIdMap.set(oldId, { newId, state: terminal });
		this._logService.info(`Revived process, old id ${oldId} -> new id ${newId}`);
	}

	@traceRpc
	async shutdownAll(): Promise<void> {
		this.dispose();
	}

	@traceRpc
	async createProcess(
		shellLaunchConfig: IShellLaunchConfig,
		cwd: string,
		cols: number,
		rows: number,
		unicodeVersion: '6' | '11',
		env: IProcessEnvironment,
		executableEnv: IProcessEnvironment,
		options: ITerminalProcessOptions,
		shouldPersist: boolean,
		workspaceId: string,
		workspaceName: string,
		isReviving?: boolean,
		rawReviveBuffer?: string
	): Promise<number> {
		if (shellLaunchConfig.attachPersistentProcess) {
			throw new Error('Attempt to create a process when attach object was provided');
		}
		const id = ++this._lastPtyId;
		const process = new TerminalProcess(shellLaunchConfig, cwd, cols, rows, env, executableEnv, options, this._logService, this._productService);
		const processLaunchOptions: IPersistentTerminalProcessLaunchConfig = {
			env,
			executableEnv,
			options
		};
		const persistentProcess = new PersistentTerminalProcess(id, process, workspaceId, workspaceName, shouldPersist, cols, rows, processLaunchOptions, unicodeVersion, this._reconnectConstants, this._logService, isReviving && isString(shellLaunchConfig.initialText) ? shellLaunchConfig.initialText : undefined, rawReviveBuffer, shellLaunchConfig.icon, shellLaunchConfig.color, shellLaunchConfig.name, shellLaunchConfig.fixedDimensions);
		process.onProcessExit(event => {
			for (const contrib of this._contributions) {
				contrib.handleProcessDispose(id);
			}
			persistentProcess.dispose();
			this._ptys.delete(id);
			this._onProcessExit.fire({ id, event });
		});
		persistentProcess.onProcessData(event => this._onProcessData.fire({ id, event }));
		persistentProcess.onProcessReplay(event => this._onProcessReplay.fire({ id, event }));
		persistentProcess.onProcessReady(event => this._onProcessReady.fire({ id, event }));
		persistentProcess.onProcessOrphanQuestion(() => this._onProcessOrphanQuestion.fire({ id }));
		persistentProcess.onDidChangeProperty(property => this._onDidChangeProperty.fire({ id, property }));
		persistentProcess.onPersistentProcessReady(() => {
			for (const contrib of this._contributions) {
				contrib.handleProcessReady(id, process);
			}
		});
		this._ptys.set(id, persistentProcess);
		return id;
	}

	@traceRpc
	async attachToProcess(id: number): Promise<void> {
		try {
			await this._throwIfNoPty(id).attach();
			this._logService.info(`Persistent process reconnection "${id}"`);
		} catch (e) {
			this._logService.warn(`Persistent process reconnection "${id}" failed`, e.message);
			throw e;
		}
	}

	@traceRpc
	async updateTitle(id: number, title: string, titleSource: TitleEventSource): Promise<void> {
		this._throwIfNoPty(id).setTitle(title, titleSource);
	}

	@traceRpc
	async updateIcon(id: number, userInitiated: boolean, icon: URI | { light: URI; dark: URI } | { id: string; color?: { id: string } }, color?: string): Promise<void> {
		this._throwIfNoPty(id).setIcon(userInitiated, icon, color);
	}

	@traceRpc
	async clearBuffer(id: number): Promise<void> {
		this._throwIfNoPty(id).clearBuffer();
	}

	@traceRpc
	async refreshProperty<T extends ProcessPropertyType>(id: number, type: T): Promise<IProcessPropertyMap[T]> {
		return this._throwIfNoPty(id).refreshProperty(type);
	}

	@traceRpc
	async updateProperty<T extends ProcessPropertyType>(id: number, type: T, value: IProcessPropertyMap[T]): Promise<void> {
		return this._throwIfNoPty(id).updateProperty(type, value);
	}

	@traceRpc
	async detachFromProcess(id: number, forcePersist?: boolean): Promise<void> {
		return this._throwIfNoPty(id).detach(forcePersist);
	}

	@traceRpc
	async reduceConnectionGraceTime(): Promise<void> {
		for (const pty of this._ptys.values()) {
			pty.reduceGraceTime();
		}
	}

	@traceRpc
	async listProcesses(): Promise<IProcessDetails[]> {
		const persistentProcesses = Array.from(this._ptys.entries()).filter(([_, pty]) => pty.shouldPersistTerminal);

		this._logService.info(`Listing ${persistentProcesses.length} persistent terminals, ${this._ptys.size} total terminals`);
		const promises = persistentProcesses.map(async ([id, terminalProcessData]) => this._buildProcessDetails(id, terminalProcessData));
		const allTerminals = await Promise.all(promises);
		return allTerminals.filter(entry => entry.isOrphan);
	}

	@traceRpc
	async getPerformanceMarks(): Promise<performance.PerformanceMark[]> {
		return performance.getMarks();
	}

	@traceRpc
	async start(id: number): Promise<ITerminalLaunchError | ITerminalLaunchResult | undefined> {
		const pty = this._ptys.get(id);
		return pty ? pty.start() : { message: `Could not find pty with id "${id}"` };
	}

	@traceRpc
	async shutdown(id: number, immediate: boolean): Promise<void> {
		// Don't throw if the pty is already shutdown
		return this._ptys.get(id)?.shutdown(immediate);
	}
	@traceRpc
	async input(id: number, data: string): Promise<void> {
		const pty = this._throwIfNoPty(id);
		if (pty) {
			for (const contrib of this._contributions) {
				contrib.handleProcessInput(id, data);
			}
			pty.input(data);
		}
	}
	@traceRpc
	async sendSignal(id: number, signal: string): Promise<void> {
		return this._throwIfNoPty(id).sendSignal(signal);
	}
	@traceRpc
	async processBinary(id: number, data: string): Promise<void> {
		return this._throwIfNoPty(id).writeBinary(data);
	}
	@traceRpc
	async resize(id: number, cols: number, rows: number): Promise<void> {
		const pty = this._throwIfNoPty(id);
		if (pty) {
			for (const contrib of this._contributions) {
				contrib.handleProcessResize(id, cols, rows);
			}
			pty.resize(cols, rows);
		}
	}
	@traceRpc
	async getInitialCwd(id: number): Promise<string> {
		return this._throwIfNoPty(id).getInitialCwd();
	}
	@traceRpc
	async getCwd(id: number): Promise<string> {
		return this._throwIfNoPty(id).getCwd();
	}
	@traceRpc
	async acknowledgeDataEvent(id: number, charCount: number): Promise<void> {
		return this._throwIfNoPty(id).acknowledgeDataEvent(charCount);
	}
	@traceRpc
	async setUnicodeVersion(id: number, version: '6' | '11'): Promise<void> {
		return this._throwIfNoPty(id).setUnicodeVersion(version);
	}

	@traceRpc
	async setNextCommandId(id: number, commandLine: string, commandId: string): Promise<void> {
		return this._throwIfNoPty(id).setNextCommandId(commandLine, commandId);
	}
	@traceRpc
	async getLatency(): Promise<IPtyHostLatencyMeasurement[]> {
		return [];
	}
	@traceRpc
	async orphanQuestionReply(id: number): Promise<void> {
		return this._throwIfNoPty(id).orphanQuestionReply();
	}

	@traceRpc
	async getDefaultSystemShell(osOverride: OperatingSystem = OS): Promise<string> {
		return getSystemShell(osOverride, process.env);
	}

	@traceRpc
	async getEnvironment(): Promise<IProcessEnvironment> {
		return { ...process.env };
	}

	@traceRpc
	async getWslPath(original: string, direction: 'unix-to-win' | 'win-to-unix' | unknown): Promise<string> {
		if (direction === 'win-to-unix') {
			if (!isWindows) {
				return original;
			}
			if (getWindowsBuildNumber() < 17063) {
				return original.replace(/\\/g, '/');
			}
			const wslExecutable = this._getWSLExecutablePath();
			if (!wslExecutable) {
				return original;
			}
			return new Promise<string>(c => {
				const proc = execFile(wslExecutable, ['-e', 'wslpath', original], {}, (error, stdout, stderr) => {
					c(error ? original : escapeNonWindowsPath(stdout.trim(), PosixShellType.Bash));
				});
				proc.stdin!.end();
			});
		}
		if (direction === 'unix-to-win') {
			// The backend is Windows, for example a local Windows workspace with a wsl session in
			// the terminal.
			if (isWindows) {
				if (getWindowsBuildNumber() < 17063) {
					return original;
				}
				const wslExecutable = this._getWSLExecutablePath();
				if (!wslExecutable) {
					return original;
				}
				return new Promise<string>(c => {
					const proc = execFile(wslExecutable, ['-e', 'wslpath', '-w', original], {}, (error, stdout, stderr) => {
						c(error ? original : stdout.trim());
					});
					proc.stdin!.end();
				});
			}
		}
		// Fallback just in case
		return original;
	}

	private _getWSLExecutablePath(): string | undefined {
		const useWSLexe = getWindowsBuildNumber() >= 16299;
		const is32ProcessOn64Windows = process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432');
		const systemRoot = process.env['SystemRoot'];
		if (systemRoot) {
			return join(systemRoot, is32ProcessOn64Windows ? 'Sysnative' : 'System32', useWSLexe ? 'wsl.exe' : 'bash.exe');
		}
		return undefined;
	}

	@traceRpc
	async getRevivedPtyNewId(workspaceId: string, id: number): Promise<number | undefined> {
		try {
			return this._revivedPtyIdMap.get(this._getRevivingProcessId(workspaceId, id))?.newId;
		} catch (e) {
			this._logService.warn(`Couldn't find terminal ID ${workspaceId}-${id}`, e.message);
		}
		return undefined;
	}

	@traceRpc
	async setTerminalLayoutInfo(args: ISetTerminalLayoutInfoArgs): Promise<void> {
		this._workspaceLayoutInfos.set(args.workspaceId, args);
	}

	@traceRpc
	async getTerminalLayoutInfo(args: IGetTerminalLayoutInfoArgs): Promise<ITerminalsLayoutInfo | undefined> {
		performance.mark('code/willGetTerminalLayoutInfo');
		const layout = this._workspaceLayoutInfos.get(args.workspaceId);
		if (layout) {
			const doneSet: Set<number> = new Set();
			const expandedTabs = await Promise.all(layout.tabs.map(async tab => this._expandTerminalTab(args.workspaceId, tab, doneSet)));
			const tabs = expandedTabs.filter(t => t.terminals.length > 0);
			const expandedBackground = (await Promise.all(layout.background?.map(b => this._expandTerminalInstance(args.workspaceId, b, doneSet)) ?? [])).filter(b => b.terminal !== null).map(b => b.terminal);
			performance.mark('code/didGetTerminalLayoutInfo');
			return { tabs, background: expandedBackground };
		}
		performance.mark('code/didGetTerminalLayoutInfo');
		return undefined;
	}

	private async _expandTerminalTab(workspaceId: string, tab: ITerminalTabLayoutInfoById, doneSet: Set<number>): Promise<ITerminalTabLayoutInfoDto> {
		const expandedTerminals = (await Promise.all(tab.terminals.map(t => this._expandTerminalInstance(workspaceId, t, doneSet))));
		const filtered = expandedTerminals.filter(term => term.terminal !== null) as IRawTerminalInstanceLayoutInfo<IProcessDetails>[];
		return {
			isActive: tab.isActive,
			activePersistentProcessId: tab.activePersistentProcessId,
			terminals: filtered
		};
	}

	private async _expandTerminalInstance(workspaceId: string, t: ITerminalInstanceLayoutInfoById | number, doneSet: Set<number>): Promise<IRawTerminalInstanceLayoutInfo<IProcessDetails | null>> {
		const hasLayout = !isNumber(t);
		const ptyId = hasLayout ? t.terminal : t;
		try {
			const oldId = this._getRevivingProcessId(workspaceId, ptyId);
			const revivedPtyId = this._revivedPtyIdMap.get(oldId)?.newId;
			this._logService.info(`Expanding terminal instance, old id ${oldId} -> new id ${revivedPtyId}`);
			this._revivedPtyIdMap.delete(oldId);
			const persistentProcessId = revivedPtyId ?? ptyId;
			if (doneSet.has(persistentProcessId)) {
				throw new Error(`Terminal ${persistentProcessId} has already been expanded`);
			}
			doneSet.add(persistentProcessId);
			const persistentProcess = this._throwIfNoPty(persistentProcessId);
			const processDetails = persistentProcess && await this._buildProcessDetails(ptyId, persistentProcess, revivedPtyId !== undefined);
			return {
				terminal: { ...processDetails, id: persistentProcessId },
				relativeSize: hasLayout ? t.relativeSize : 0
			};
		} catch (e) {
			this._logService.warn(`Couldn't get layout info, a terminal was probably disconnected`, e.message);
			this._logService.debug('Reattach to wrong terminal debug info - layout info by id', t);
			this._logService.debug('Reattach to wrong terminal debug info - _revivePtyIdMap', Array.from(this._revivedPtyIdMap.values()));
			this._logService.debug('Reattach to wrong terminal debug info - _ptys ids', Array.from(this._ptys.keys()));
			// this will be filtered out and not reconnected
			return {
				terminal: null,
				relativeSize: hasLayout ? t.relativeSize : 0
			};
		}
	}

	private _getRevivingProcessId(workspaceId: string, ptyId: number): string {
		return `${workspaceId}-${ptyId}`;
	}

	private async _buildProcessDetails(id: number, persistentProcess: PersistentTerminalProcess, wasRevived: boolean = false): Promise<IProcessDetails> {
		performance.mark(`code/willBuildProcessDetails/${id}`);
		// If the process was just revived, don't do the orphan check as it will
		// take some time
		const [cwd, isOrphan] = await Promise.all([persistentProcess.getCwd(), wasRevived ? true : persistentProcess.isOrphaned()]);
		const result = {
			id,
			title: persistentProcess.title,
			titleSource: persistentProcess.titleSource,
			pid: persistentProcess.pid,
			workspaceId: persistentProcess.workspaceId,
			workspaceName: persistentProcess.workspaceName,
			cwd,
			isOrphan,
			icon: persistentProcess.icon,
			color: persistentProcess.color,
			fixedDimensions: persistentProcess.fixedDimensions,
			environmentVariableCollections: persistentProcess.processLaunchOptions.options.environmentVariableCollections,
			reconnectionProperties: persistentProcess.shellLaunchConfig.reconnectionProperties,
			waitOnExit: persistentProcess.shellLaunchConfig.waitOnExit,
			hideFromUser: persistentProcess.shellLaunchConfig.hideFromUser,
			isFeatureTerminal: persistentProcess.shellLaunchConfig.isFeatureTerminal,
			type: persistentProcess.shellLaunchConfig.type,
			hasChildProcesses: persistentProcess.hasChildProcesses,
			shellIntegrationNonce: persistentProcess.processLaunchOptions.options.shellIntegration.nonce,
			tabActions: persistentProcess.shellLaunchConfig.tabActions
		};
		performance.mark(`code/didBuildProcessDetails/${id}`);
		return result;
	}

	private _throwIfNoPty(id: number): PersistentTerminalProcess {
		const pty = this._ptys.get(id);
		if (!pty) {
			throw new ErrorNoTelemetry(`Could not find pty ${id} on pty host`);
		}
		return pty;
	}
}

const enum InteractionState {
	/** The terminal has not been interacted with. */
	None = 'None',
	/** The terminal has only been interacted with by the replay mechanism. */
	ReplayOnly = 'ReplayOnly',
	/** The terminal has been directly interacted with this session. */
	Session = 'Session'
}

class PersistentTerminalProcess extends Disposable {

	private readonly _bufferer: TerminalDataBufferer;

	private readonly _pendingCommands = new Map<number, { resolve: (data: unknown) => void; reject: (err: unknown) => void }>();

	private _isStarted: boolean = false;
	private _interactionState: MutationLogger<InteractionState>;

	private _orphanQuestionBarrier: AutoOpenBarrier | null;
	private _orphanQuestionReplyTime: number;
	private _orphanRequestQueue = new Queue<boolean>();
	private _disconnectRunner1: ProcessTimeRunOnceScheduler;
	private _disconnectRunner2: ProcessTimeRunOnceScheduler;

	private readonly _onProcessReplay = this._register(new Emitter<IPtyHostProcessReplayEvent>());
	readonly onProcessReplay = this._onProcessReplay.event;
	private readonly _onProcessReady = this._register(new Emitter<IProcessReadyEvent>());
	readonly onProcessReady = this._onProcessReady.event;
	private readonly _onPersistentProcessReady = this._register(new Emitter<void>());
	/** Fired when the persistent process has a ready process and has finished its replay. */
	readonly onPersistentProcessReady = this._onPersistentProcessReady.event;
	private readonly _onProcessData = this._register(new Emitter<string>());
	readonly onProcessData = this._onProcessData.event;
	private readonly _onProcessOrphanQuestion = this._register(new Emitter<void>());
	readonly onProcessOrphanQuestion = this._onProcessOrphanQuestion.event;
	private readonly _onDidChangeProperty = this._register(new Emitter<IProcessProperty>());
	readonly onDidChangeProperty = this._onDidChangeProperty.event;

	private _inReplay = false;

	private _pid = -1;
	private _cwd = '';
	private _title: string | undefined;
	private _titleSource: TitleEventSource = TitleEventSource.Process;
	private _serializer: ITerminalSerializer;
	private _wasRevived: boolean;
	private _fixedDimensions: IFixedTerminalDimensions | undefined;

	get pid(): number { return this._pid; }
	get shellLaunchConfig(): IShellLaunchConfig { return this._terminalProcess.shellLaunchConfig; }
	get hasWrittenData(): boolean { return this._interactionState.value !== InteractionState.None; }
	get title(): string { return this._title || this._terminalProcess.currentTitle; }
	get titleSource(): TitleEventSource { return this._titleSource; }
	get icon(): TerminalIcon | undefined { return this._icon; }
	get color(): string | undefined { return this._color; }
	get fixedDimensions(): IFixedTerminalDimensions | undefined { return this._fixedDimensions; }
	get hasChildProcesses(): boolean { return this._terminalProcess.hasChildProcesses; }

	setTitle(title: string, titleSource: TitleEventSource): void {
		if (titleSource === TitleEventSource.Api) {
			this._interactionState.setValue(InteractionState.Session, 'setTitle');
			this._serializer.freeRawReviveBuffer();
		}
		this._title = title;
		this._titleSource = titleSource;
	}

	setIcon(userInitiated: boolean, icon: TerminalIcon, color?: string): void {
		if (!this._icon || hasKey(icon, { id: true }) && hasKey(this._icon, { id: true }) && icon.id !== this._icon.id ||
			!this.color || color !== this._color) {

			this._serializer.freeRawReviveBuffer();
			if (userInitiated) {
				this._interactionState.setValue(InteractionState.Session, 'setIcon');
			}
		}
		this._icon = icon;
		this._color = color;
	}

	private _setFixedDimensions(fixedDimensions?: IFixedTerminalDimensions): void {
		this._fixedDimensions = fixedDimensions;
	}

	constructor(
		private _persistentProcessId: number,
		private readonly _terminalProcess: TerminalProcess,
		readonly workspaceId: string,
		readonly workspaceName: string,
		readonly shouldPersistTerminal: boolean,
		cols: number,
		rows: number,
		readonly processLaunchOptions: IPersistentTerminalProcessLaunchConfig,
		public unicodeVersion: '6' | '11',
		reconnectConstants: IReconnectConstants,
		private readonly _logService: ILogService,
		reviveBuffer: string | undefined,
		rawReviveBuffer: string | undefined,
		private _icon?: TerminalIcon,
		private _color?: string,
		name?: string,
		fixedDimensions?: IFixedTerminalDimensions
	) {
		super();
		this._interactionState = new MutationLogger(`Persistent process "${this._persistentProcessId}" interaction state`, InteractionState.None, this._logService);
		this._wasRevived = reviveBuffer !== undefined;
		this._serializer = new XtermSerializer(
			cols,
			rows,
			reconnectConstants.scrollback,
			unicodeVersion,
			reviveBuffer,
			processLaunchOptions.options.shellIntegration.nonce,
			shouldPersistTerminal ? rawReviveBuffer : undefined,
			this._logService
		);
		if (name) {
			this.setTitle(name, TitleEventSource.Api);
		}
		this._fixedDimensions = fixedDimensions;
		this._orphanQuestionBarrier = null;
		this._orphanQuestionReplyTime = 0;
		this._disconnectRunner1 = this._register(new ProcessTimeRunOnceScheduler(() => {
			this._logService.info(`Persistent process "${this._persistentProcessId}": The reconnection grace time of ${printTime(reconnectConstants.graceTime)} has expired, shutting down pid "${this._pid}"`);
			this.shutdown(true);
		}, reconnectConstants.graceTime));
		this._disconnectRunner2 = this._register(new ProcessTimeRunOnceScheduler(() => {
			this._logService.info(`Persistent process "${this._persistentProcessId}": The short reconnection grace time of ${printTime(reconnectConstants.shortGraceTime)} has expired, shutting down pid ${this._pid}`);
			this.shutdown(true);
		}, reconnectConstants.shortGraceTime));
		this._register(this._terminalProcess.onProcessExit(() => this._bufferer.stopBuffering(this._persistentProcessId)));
		this._register(this._terminalProcess.onProcessReady(e => {
			this._pid = e.pid;
			this._cwd = e.cwd;
			this._onProcessReady.fire(e);
		}));
		this._register(this._terminalProcess.onDidChangeProperty(e => {
			this._onDidChangeProperty.fire(e);
		}));

		// Data buffering to reduce the amount of messages going to the renderer
		this._bufferer = new TerminalDataBufferer((_, data) => this._onProcessData.fire(data));
		this._register(this._bufferer.startBuffering(this._persistentProcessId, this._terminalProcess.onProcessData));

		// Data recording for reconnect
		this._register(this.onProcessData(e => this._serializer.handleData(e)));
	}

	async attach(): Promise<void> {
		if (!this._disconnectRunner1.isScheduled() && !this._disconnectRunner2.isScheduled()) {
			this._logService.warn(`Persistent process "${this._persistentProcessId}": Process had no disconnect runners but was an orphan`);
		}
		this._disconnectRunner1.cancel();
		this._disconnectRunner2.cancel();
	}

	async detach(forcePersist?: boolean): Promise<void> {
		// Keep the process around if it was indicated to persist and it has had some iteraction or
		// was replayed
		if (this.shouldPersistTerminal && (this._interactionState.value !== InteractionState.None || forcePersist)) {
			this._disconnectRunner1.schedule();
		} else {
			this.shutdown(true);
		}
	}

	serializeNormalBuffer(): Promise<IPtyHostProcessReplayEvent> {
		return this._serializer.generateReplayEvent(true, this._interactionState.value !== InteractionState.Session);
	}

	async refreshProperty<T extends ProcessPropertyType>(type: T): Promise<IProcessPropertyMap[T]> {
		return this._terminalProcess.refreshProperty(type);
	}

	async updateProperty<T extends ProcessPropertyType>(type: T, value: IProcessPropertyMap[T]): Promise<void> {
		if (type === ProcessPropertyType.FixedDimensions) {
			return this._setFixedDimensions(value as IProcessPropertyMap[ProcessPropertyType.FixedDimensions]);
		}
	}

	async start(): Promise<ITerminalLaunchError | ITerminalLaunchResult | undefined> {
		if (!this._isStarted) {
			const result = await this._terminalProcess.start();
			if (result && hasKey(result, { message: true })) {
				// it's a terminal launch error
				return result;
			}
			this._isStarted = true;

			// If the process was revived, trigger a replay on first start. An alternative approach
			// could be to start it on the pty host before attaching but this fails on Windows as
			// conpty's inherit cursor option which is required, ends up sending DSR CPR which
			// causes conhost to hang when no response is received from the terminal (which wouldn't
			// be attached yet). https://github.com/microsoft/terminal/issues/11213
			if (this._wasRevived) {
				this.triggerReplay();
			} else {
				this._onPersistentProcessReady.fire();
			}
			return result;
		}

		this._onProcessReady.fire({ pid: this._pid, cwd: this._cwd, windowsPty: this._terminalProcess.getWindowsPty() });
		this._onDidChangeProperty.fire({ type: ProcessPropertyType.Title, value: this._terminalProcess.currentTitle });
		this._onDidChangeProperty.fire({ type: ProcessPropertyType.ShellType, value: this._terminalProcess.shellType });
		this.triggerReplay();
		return undefined;
	}
	shutdown(immediate: boolean): void {
		return this._terminalProcess.shutdown(immediate);
	}
	input(data: string): void {
		this._interactionState.setValue(InteractionState.Session, 'input');
		this._serializer.freeRawReviveBuffer();
		if (this._inReplay) {
			return;
		}
		return this._terminalProcess.input(data);
	}
	sendSignal(signal: string): void {
		if (this._inReplay) {
			return;
		}
		return this._terminalProcess.sendSignal(signal);
	}
	writeBinary(data: string): Promise<void> {
		return this._terminalProcess.processBinary(data);
	}
	resize(cols: number, rows: number): void {
		if (this._inReplay) {
			return;
		}
		this._serializer.handleResize(cols, rows);

		// Buffered events should flush when a resize occurs
		this._bufferer.flushBuffer(this._persistentProcessId);

		return this._terminalProcess.resize(cols, rows);
	}
	async clearBuffer(): Promise<void> {
		this._serializer.clearBuffer();
		this._terminalProcess.clearBuffer();
	}
	setUnicodeVersion(version: '6' | '11'): void {
		this.unicodeVersion = version;
		this._serializer.setUnicodeVersion?.(version);
		// TODO: Pass in unicode version in ctor
	}

	async setNextCommandId(commandLine: string, commandId: string): Promise<void> {
		this._serializer.setNextCommandId?.(commandLine, commandId);
	}

	acknowledgeDataEvent(charCount: number): void {
		if (this._inReplay) {
			return;
		}
		return this._terminalProcess.acknowledgeDataEvent(charCount);
	}
	getInitialCwd(): Promise<string> {
		return this._terminalProcess.getInitialCwd();
	}
	getCwd(): Promise<string> {
		return this._terminalProcess.getCwd();
	}

	async triggerReplay(): Promise<void> {
		if (this._interactionState.value === InteractionState.None) {
			this._interactionState.setValue(InteractionState.ReplayOnly, 'triggerReplay');
		}
		const ev = await this._serializer.generateReplayEvent();
		let dataLength = 0;
		for (const e of ev.events) {
			dataLength += e.data.length;
		}
		this._logService.info(`Persistent process "${this._persistentProcessId}": Replaying ${dataLength} chars and ${ev.events.length} size events`);
		this._onProcessReplay.fire(ev);
		this._terminalProcess.clearUnacknowledgedChars();
		this._onPersistentProcessReady.fire();
	}

	sendCommandResult(reqId: number, isError: boolean, serializedPayload: unknown): void {
		const data = this._pendingCommands.get(reqId);
		if (!data) {
			return;
		}
		this._pendingCommands.delete(reqId);
	}

	orphanQuestionReply(): void {
		this._orphanQuestionReplyTime = Date.now();
		if (this._orphanQuestionBarrier) {
			const barrier = this._orphanQuestionBarrier;
			this._orphanQuestionBarrier = null;
			barrier.open();
		}
	}

	reduceGraceTime(): void {
		if (this._disconnectRunner2.isScheduled()) {
			// we are disconnected and already running the short reconnection timer
			return;
		}
		if (this._disconnectRunner1.isScheduled()) {
			// we are disconnected and running the long reconnection timer
			this._disconnectRunner2.schedule();
		}
	}

	async isOrphaned(): Promise<boolean> {
		return await this._orphanRequestQueue.queue(async () => this._isOrphaned());
	}

	private async _isOrphaned(): Promise<boolean> {
		// The process is already known to be orphaned
		if (this._disconnectRunner1.isScheduled() || this._disconnectRunner2.isScheduled()) {
			return true;
		}

		// Ask whether the renderer(s) whether the process is orphaned and await the reply
		if (!this._orphanQuestionBarrier) {
			// the barrier opens after 4 seconds with or without a reply
			this._orphanQuestionBarrier = new AutoOpenBarrier(4000);
			this._orphanQuestionReplyTime = 0;
			this._onProcessOrphanQuestion.fire();
		}

		await this._orphanQuestionBarrier.wait();
		return (Date.now() - this._orphanQuestionReplyTime > 500);
	}
}

class MutationLogger<T> {
	get value(): T { return this._value; }
	setValue(value: T, reason: string) {
		if (this._value !== value) {
			this._value = value;
			this._log(reason);
		}
	}

	constructor(
		private readonly _name: string,
		private _value: T,
		private readonly _logService: ILogService
	) {
		this._log('initialized');
	}

	private _log(reason: string): void {
		this._logService.debug(`MutationLogger "${this._name}" set to "${this._value}", reason: ${reason}`);
	}
}

class XtermSerializer implements ITerminalSerializer {
	private readonly _xterm: XtermTerminal;
	private readonly _shellIntegrationAddon: ShellIntegrationAddon;
	private _unicodeAddon?: XtermUnicode11Addon;

	constructor(
		cols: number,
		rows: number,
		scrollback: number,
		unicodeVersion: '6' | '11',
		reviveBufferWithRestoreMessage: string | undefined,
		shellIntegrationNonce: string,
		private _rawReviveBuffer: string | undefined,
		logService: ILogService
	) {
		this._xterm = new XtermTerminal({
			cols,
			rows,
			scrollback,
			allowProposedApi: true
		});
		if (reviveBufferWithRestoreMessage) {
			this._xterm.writeln(reviveBufferWithRestoreMessage);
		}
		this.setUnicodeVersion(unicodeVersion);
		this._shellIntegrationAddon = new ShellIntegrationAddon(shellIntegrationNonce, true, undefined, undefined, logService);
		this._xterm.loadAddon(this._shellIntegrationAddon);
	}

	freeRawReviveBuffer(): void {
		// Free the memory of the terminal if it will need to be re-serialized
		this._rawReviveBuffer = undefined;
	}

	handleData(data: string): void {
		this._xterm.write(data);
	}

	handleResize(cols: number, rows: number): void {
		this._xterm.resize(cols, rows);
	}

	clearBuffer(): void {
		this._xterm.clear();
	}

	setNextCommandId(commandLine: string, commandId: string): void {
		this._shellIntegrationAddon.setNextCommandId(commandLine, commandId);
	}

	async generateReplayEvent(normalBufferOnly?: boolean, restoreToLastReviveBuffer?: boolean): Promise<IPtyHostProcessReplayEvent> {
		const serialize = new (await this._getSerializeConstructor());
		this._xterm.loadAddon(serialize);
		const options: ISerializeOptions = {
			scrollback: this._xterm.options.scrollback
		};
		if (normalBufferOnly) {
			options.excludeAltBuffer = true;
			options.excludeModes = true;
		}
		let serialized: string;
		if (restoreToLastReviveBuffer && this._rawReviveBuffer) {
			serialized = this._rawReviveBuffer;
		} else {
			serialized = serialize.serialize(options);
		}
		return {
			events: [
				{
					cols: this._xterm.cols,
					rows: this._xterm.rows,
					data: serialized
				}
			],
			commands: this._shellIntegrationAddon.serialize()
		};
	}

	async setUnicodeVersion(version: '6' | '11'): Promise<void> {
		if (this._xterm.unicode.activeVersion === version) {
			return;
		}
		if (version === '11') {
			this._unicodeAddon = new (await this._getUnicode11Constructor());
			this._xterm.loadAddon(this._unicodeAddon);
		} else {
			this._unicodeAddon?.dispose();
			this._unicodeAddon = undefined;
		}
		this._xterm.unicode.activeVersion = version;
	}

	async _getUnicode11Constructor(): Promise<typeof Unicode11Addon> {
		if (!Unicode11Addon) {
			Unicode11Addon = (await import('@xterm/addon-unicode11')).Unicode11Addon;
		}
		return Unicode11Addon;
	}

	async _getSerializeConstructor(): Promise<typeof SerializeAddon> {
		if (!SerializeAddon) {
			SerializeAddon = (await import('@xterm/addon-serialize')).SerializeAddon;
		}
		return SerializeAddon;
	}
}

function printTime(ms: number): string {
	let h = 0;
	let m = 0;
	let s = 0;
	if (ms >= 1000) {
		s = Math.floor(ms / 1000);
		ms -= s * 1000;
	}
	if (s >= 60) {
		m = Math.floor(s / 60);
		s -= m * 60;
	}
	if (m >= 60) {
		h = Math.floor(m / 60);
		m -= h * 60;
	}
	const _h = h ? `${h}h` : ``;
	const _m = m ? `${m}m` : ``;
	const _s = s ? `${s}s` : ``;
	const _ms = ms ? `${ms}ms` : ``;
	return `${_h}${_m}${_s}${_ms}`;
}

interface ITerminalSerializer {
	handleData(data: string): void;
	freeRawReviveBuffer(): void;
	handleResize(cols: number, rows: number): void;
	clearBuffer(): void;
	generateReplayEvent(normalBufferOnly?: boolean, restoreToLastReviveBuffer?: boolean): Promise<IPtyHostProcessReplayEvent>;
	setUnicodeVersion?(version: '6' | '11'): void;
	setNextCommandId?(commandLine: string, commandId: string): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/node/terminalEnvironment.ts]---
Location: vscode-main/src/vs/platform/terminal/node/terminalEnvironment.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as os from 'os';
import { FileAccess } from '../../../base/common/network.js';
import * as path from '../../../base/common/path.js';
import { IProcessEnvironment, isMacintosh, isWindows } from '../../../base/common/platform.js';
import * as process from '../../../base/common/process.js';
import { format } from '../../../base/common/strings.js';
import { ILogService } from '../../log/common/log.js';
import { IProductService } from '../../product/common/productService.js';
import { IShellLaunchConfig, ITerminalEnvironment, ITerminalProcessOptions, ShellIntegrationInjectionFailureReason } from '../common/terminal.js';
import { EnvironmentVariableMutatorType } from '../common/environmentVariable.js';
import { deserializeEnvironmentVariableCollections } from '../common/environmentVariableShared.js';
import { MergedEnvironmentVariableCollection } from '../common/environmentVariableCollection.js';
import { chmod, realpathSync, mkdirSync } from 'fs';
import { promisify } from 'util';
import { isString, SingleOrMany } from '../../../base/common/types.js';

export function getWindowsBuildNumber(): number {
	const osVersion = (/(\d+)\.(\d+)\.(\d+)/g).exec(os.release());
	let buildNumber: number = 0;
	if (osVersion && osVersion.length === 4) {
		buildNumber = parseInt(osVersion[3]);
	}
	return buildNumber;
}

export interface IShellIntegrationConfigInjection {
	readonly type: 'injection';
	/**
	 * A new set of arguments to use.
	 */
	readonly newArgs: string[] | undefined;
	/**
	 * An optional environment to mixing to the real environment.
	 */
	readonly envMixin?: IProcessEnvironment;
	/**
	 * An optional array of files to copy from `source` to `dest`.
	 */
	readonly filesToCopy?: {
		source: string;
		dest: string;
	}[];
}

export interface IShellIntegrationInjectionFailure {
	readonly type: 'failure';
	readonly reason: ShellIntegrationInjectionFailureReason;
}

/**
 * For a given shell launch config, returns arguments to replace and an optional environment to
 * mixin to the SLC's environment to enable shell integration. This must be run within the context
 * that creates the process to ensure accuracy. Returns undefined if shell integration cannot be
 * enabled.
 */
export async function getShellIntegrationInjection(
	shellLaunchConfig: IShellLaunchConfig,
	options: ITerminalProcessOptions,
	env: ITerminalEnvironment | undefined,
	logService: ILogService,
	productService: IProductService,
	skipStickyBit: boolean = false
): Promise<IShellIntegrationConfigInjection | IShellIntegrationInjectionFailure> {
	// The global setting is disabled
	if (!options.shellIntegration.enabled) {
		return { type: 'failure', reason: ShellIntegrationInjectionFailureReason.InjectionSettingDisabled };
	}
	// There is no executable (so there's no way to determine how to inject)
	if (!shellLaunchConfig.executable) {
		return { type: 'failure', reason: ShellIntegrationInjectionFailureReason.NoExecutable };
	}
	// It's a feature terminal (tasks, debug), unless it's explicitly being forced
	if (shellLaunchConfig.isFeatureTerminal && !shellLaunchConfig.forceShellIntegration) {
		return { type: 'failure', reason: ShellIntegrationInjectionFailureReason.FeatureTerminal };
	}
	// The ignoreShellIntegration flag is passed (eg. relaunching without shell integration)
	if (shellLaunchConfig.ignoreShellIntegration) {
		return { type: 'failure', reason: ShellIntegrationInjectionFailureReason.IgnoreShellIntegrationFlag };
	}
	// Shell integration doesn't work with winpty
	if (isWindows && (!options.windowsEnableConpty || getWindowsBuildNumber() < 18309)) {
		return { type: 'failure', reason: ShellIntegrationInjectionFailureReason.Winpty };
	}

	const originalArgs = shellLaunchConfig.args;
	const shell = process.platform === 'win32' ? path.basename(shellLaunchConfig.executable).toLowerCase() : path.basename(shellLaunchConfig.executable);
	const appRoot = path.dirname(FileAccess.asFileUri('').fsPath);
	const type = 'injection';
	let newArgs: string[] | undefined;
	const envMixin: IProcessEnvironment = {
		'VSCODE_INJECTION': '1'
	};

	if (options.shellIntegration.nonce) {
		envMixin['VSCODE_NONCE'] = options.shellIntegration.nonce;
	}
	// Temporarily pass list of hardcoded env vars for shell env api
	const scopedDownShellEnvs = ['PATH', 'VIRTUAL_ENV', 'HOME', 'SHELL', 'PWD'];
	if (shellLaunchConfig.shellIntegrationEnvironmentReporting) {
		if (isWindows) {
			const enableWindowsEnvReporting = options.windowsUseConptyDll || options.windowsEnableConpty && getWindowsBuildNumber() >= 22631 && shell !== 'bash.exe';
			if (enableWindowsEnvReporting) {
				envMixin['VSCODE_SHELL_ENV_REPORTING'] = scopedDownShellEnvs.join(',');
			}
		} else {
			envMixin['VSCODE_SHELL_ENV_REPORTING'] = scopedDownShellEnvs.join(',');
		}
	}

	// Windows
	if (isWindows) {
		if (shell === 'pwsh.exe' || shell === 'powershell.exe') {
			envMixin['VSCODE_A11Y_MODE'] = options.isScreenReaderOptimized ? '1' : '0';

			if (!originalArgs || arePwshImpliedArgs(originalArgs)) {
				newArgs = shellIntegrationArgs.get(ShellIntegrationExecutable.WindowsPwsh);
			} else if (arePwshLoginArgs(originalArgs)) {
				newArgs = shellIntegrationArgs.get(ShellIntegrationExecutable.WindowsPwshLogin);
			}
			if (!newArgs) {
				return { type: 'failure', reason: ShellIntegrationInjectionFailureReason.UnsupportedArgs };
			}
			newArgs[newArgs.length - 1] = format(newArgs[newArgs.length - 1], appRoot, '');
			envMixin['VSCODE_STABLE'] = productService.quality === 'stable' ? '1' : '0';
			return { type, newArgs, envMixin };
		} else if (shell === 'bash.exe') {
			if (!originalArgs || originalArgs.length === 0) {
				newArgs = shellIntegrationArgs.get(ShellIntegrationExecutable.Bash);
			} else if (areZshBashFishLoginArgs(originalArgs)) {
				envMixin['VSCODE_SHELL_LOGIN'] = '1';
				addEnvMixinPathPrefix(options, envMixin, shell);
				newArgs = shellIntegrationArgs.get(ShellIntegrationExecutable.Bash);
			}
			if (!newArgs) {
				return { type: 'failure', reason: ShellIntegrationInjectionFailureReason.UnsupportedArgs };
			}
			newArgs = [...newArgs]; // Shallow clone the array to avoid setting the default array
			newArgs[newArgs.length - 1] = format(newArgs[newArgs.length - 1], appRoot);
			envMixin['VSCODE_STABLE'] = productService.quality === 'stable' ? '1' : '0';
			return { type, newArgs, envMixin };
		}
		logService.warn(`Shell integration cannot be enabled for executable "${shellLaunchConfig.executable}" and args`, shellLaunchConfig.args);
		return { type: 'failure', reason: ShellIntegrationInjectionFailureReason.UnsupportedShell };
	}

	// Linux & macOS
	switch (shell) {
		case 'bash': {
			if (!originalArgs || originalArgs.length === 0) {
				newArgs = shellIntegrationArgs.get(ShellIntegrationExecutable.Bash);
			} else if (areZshBashFishLoginArgs(originalArgs)) {
				envMixin['VSCODE_SHELL_LOGIN'] = '1';
				addEnvMixinPathPrefix(options, envMixin, shell);
				newArgs = shellIntegrationArgs.get(ShellIntegrationExecutable.Bash);
			}
			if (!newArgs) {
				return { type: 'failure', reason: ShellIntegrationInjectionFailureReason.UnsupportedArgs };
			}
			newArgs = [...newArgs]; // Shallow clone the array to avoid setting the default array
			newArgs[newArgs.length - 1] = format(newArgs[newArgs.length - 1], appRoot);
			envMixin['VSCODE_STABLE'] = productService.quality === 'stable' ? '1' : '0';
			return { type, newArgs, envMixin };
		}
		case 'fish': {
			if (!originalArgs || originalArgs.length === 0) {
				newArgs = shellIntegrationArgs.get(ShellIntegrationExecutable.Fish);
			} else if (areZshBashFishLoginArgs(originalArgs)) {
				newArgs = shellIntegrationArgs.get(ShellIntegrationExecutable.FishLogin);
			} else if (originalArgs === shellIntegrationArgs.get(ShellIntegrationExecutable.Fish) || originalArgs === shellIntegrationArgs.get(ShellIntegrationExecutable.FishLogin)) {
				newArgs = originalArgs;
			}
			if (!newArgs) {
				return { type: 'failure', reason: ShellIntegrationInjectionFailureReason.UnsupportedArgs };
			}

			// On fish, '$fish_user_paths' is always prepended to the PATH, for both login and non-login shells, so we need
			// to apply the path prefix fix always, not only for login shells (see #232291)
			addEnvMixinPathPrefix(options, envMixin, shell);

			newArgs = [...newArgs]; // Shallow clone the array to avoid setting the default array
			newArgs[newArgs.length - 1] = format(newArgs[newArgs.length - 1], appRoot);
			return { type, newArgs, envMixin };
		}
		case 'pwsh': {
			if (!originalArgs || arePwshImpliedArgs(originalArgs)) {
				newArgs = shellIntegrationArgs.get(ShellIntegrationExecutable.Pwsh);
			} else if (arePwshLoginArgs(originalArgs)) {
				newArgs = shellIntegrationArgs.get(ShellIntegrationExecutable.PwshLogin);
			}
			if (!newArgs) {
				return { type: 'failure', reason: ShellIntegrationInjectionFailureReason.UnsupportedArgs };
			}
			newArgs = [...newArgs]; // Shallow clone the array to avoid setting the default array
			newArgs[newArgs.length - 1] = format(newArgs[newArgs.length - 1], appRoot, '');
			envMixin['VSCODE_STABLE'] = productService.quality === 'stable' ? '1' : '0';
			return { type, newArgs, envMixin };
		}
		case 'zsh': {
			if (!originalArgs || originalArgs.length === 0) {
				newArgs = shellIntegrationArgs.get(ShellIntegrationExecutable.Zsh);
			} else if (areZshBashFishLoginArgs(originalArgs)) {
				newArgs = shellIntegrationArgs.get(ShellIntegrationExecutable.ZshLogin);
				addEnvMixinPathPrefix(options, envMixin, shell);
			} else if (originalArgs === shellIntegrationArgs.get(ShellIntegrationExecutable.Zsh) || originalArgs === shellIntegrationArgs.get(ShellIntegrationExecutable.ZshLogin)) {
				newArgs = originalArgs;
			}
			if (!newArgs) {
				return { type: 'failure', reason: ShellIntegrationInjectionFailureReason.UnsupportedArgs };
			}
			newArgs = [...newArgs]; // Shallow clone the array to avoid setting the default array
			newArgs[newArgs.length - 1] = format(newArgs[newArgs.length - 1], appRoot);

			// Move .zshrc into $ZDOTDIR as the way to activate the script
			let username: string;
			try {
				username = os.userInfo().username;
			} catch {
				username = 'unknown';
			}

			// Resolve the actual tmp directory so we can set the sticky bit
			const realTmpDir = realpathSync(os.tmpdir());
			const zdotdir = path.join(realTmpDir, `${username}-${productService.applicationName}-zsh`);

			// Set directory permissions using octal notation:
			// - 0o1700:
			// - Sticky bit is set, preventing non-owners from deleting or renaming files within this directory (1)
			// - Owner has full read (4), write (2), execute (1) permissions
			// - Group has no permissions (0)
			// - Others have no permissions (0)
			if (!skipStickyBit) {
				// skip for tests
				try {
					const chmodAsync = promisify(chmod);
					await chmodAsync(zdotdir, 0o1700);
				} catch (err) {
					if (err.message.includes('ENOENT')) {
						try {
							mkdirSync(zdotdir);
						} catch (err) {
							logService.error(`Failed to create zdotdir at ${zdotdir}: ${err}`);
							return { type: 'failure', reason: ShellIntegrationInjectionFailureReason.FailedToCreateTmpDir };
						}
						try {
							const chmodAsync = promisify(chmod);
							await chmodAsync(zdotdir, 0o1700);
						} catch {
							logService.error(`Failed to set sticky bit on ${zdotdir}: ${err}`);
							return { type: 'failure', reason: ShellIntegrationInjectionFailureReason.FailedToSetStickyBit };
						}
					}
					logService.error(`Failed to set sticky bit on ${zdotdir}: ${err}`);
					return { type: 'failure', reason: ShellIntegrationInjectionFailureReason.FailedToSetStickyBit };
				}
			}
			envMixin['ZDOTDIR'] = zdotdir;
			const userZdotdir = env?.ZDOTDIR ?? os.homedir() ?? `~`;
			envMixin['USER_ZDOTDIR'] = userZdotdir;
			const filesToCopy: IShellIntegrationConfigInjection['filesToCopy'] = [];
			filesToCopy.push({
				source: path.join(appRoot, 'out/vs/workbench/contrib/terminal/common/scripts/shellIntegration-rc.zsh'),
				dest: path.join(zdotdir, '.zshrc')
			});
			filesToCopy.push({
				source: path.join(appRoot, 'out/vs/workbench/contrib/terminal/common/scripts/shellIntegration-profile.zsh'),
				dest: path.join(zdotdir, '.zprofile')
			});
			filesToCopy.push({
				source: path.join(appRoot, 'out/vs/workbench/contrib/terminal/common/scripts/shellIntegration-env.zsh'),
				dest: path.join(zdotdir, '.zshenv')
			});
			filesToCopy.push({
				source: path.join(appRoot, 'out/vs/workbench/contrib/terminal/common/scripts/shellIntegration-login.zsh'),
				dest: path.join(zdotdir, '.zlogin')
			});
			return { type, newArgs, envMixin, filesToCopy };
		}
	}
	logService.warn(`Shell integration cannot be enabled for executable "${shellLaunchConfig.executable}" and args`, shellLaunchConfig.args);
	return { type: 'failure', reason: ShellIntegrationInjectionFailureReason.UnsupportedShell };
}

/**
 * There are a few situations where some directories are added to the beginning of the PATH.
 * 1. On macOS when the profile calls path_helper.
 * 2. For fish terminals, which always prepend "$fish_user_paths" to the PATH.
 *
 * This causes significant problems for the environment variable
 * collection API as the custom paths added to the end will now be somewhere in the middle of
 * the PATH. To combat this, VSCODE_PATH_PREFIX is used to re-apply any prefix after the profile
 * has run. This will cause duplication in the PATH but should fix the issue.
 *
 * See #99878 for more information.
 */
function addEnvMixinPathPrefix(options: ITerminalProcessOptions, envMixin: IProcessEnvironment, shell: string): void {
	if ((isMacintosh || shell === 'fish') && options.environmentVariableCollections) {
		// Deserialize and merge
		const deserialized = deserializeEnvironmentVariableCollections(options.environmentVariableCollections);
		const merged = new MergedEnvironmentVariableCollection(deserialized);

		// Get all prepend PATH entries
		const pathEntry = merged.getVariableMap({ workspaceFolder: options.workspaceFolder }).get('PATH');
		const prependToPath: string[] = [];
		if (pathEntry) {
			for (const mutator of pathEntry) {
				if (mutator.type === EnvironmentVariableMutatorType.Prepend) {
					prependToPath.push(mutator.value);
				}
			}
		}

		// Add to the environment mixin to be applied in the shell integration script
		if (prependToPath.length > 0) {
			envMixin['VSCODE_PATH_PREFIX'] = prependToPath.join('');
		}
	}
}

enum ShellIntegrationExecutable {
	WindowsPwsh = 'windows-pwsh',
	WindowsPwshLogin = 'windows-pwsh-login',
	Pwsh = 'pwsh',
	PwshLogin = 'pwsh-login',
	Zsh = 'zsh',
	ZshLogin = 'zsh-login',
	Bash = 'bash',
	Fish = 'fish',
	FishLogin = 'fish-login',
}

const shellIntegrationArgs: Map<ShellIntegrationExecutable, string[]> = new Map();
// The try catch swallows execution policy errors in the case of the archive distributable
shellIntegrationArgs.set(ShellIntegrationExecutable.WindowsPwsh, ['-noexit', '-command', 'try { . \"{0}\\out\\vs\\workbench\\contrib\\terminal\\common\\scripts\\shellIntegration.ps1\" } catch {}{1}']);
shellIntegrationArgs.set(ShellIntegrationExecutable.WindowsPwshLogin, ['-l', '-noexit', '-command', 'try { . \"{0}\\out\\vs\\workbench\\contrib\\terminal\\common\\scripts\\shellIntegration.ps1\" } catch {}{1}']);
shellIntegrationArgs.set(ShellIntegrationExecutable.Pwsh, ['-noexit', '-command', '. "{0}/out/vs/workbench/contrib/terminal/common/scripts/shellIntegration.ps1"{1}']);
shellIntegrationArgs.set(ShellIntegrationExecutable.PwshLogin, ['-l', '-noexit', '-command', '. "{0}/out/vs/workbench/contrib/terminal/common/scripts/shellIntegration.ps1"']);
shellIntegrationArgs.set(ShellIntegrationExecutable.Zsh, ['-i']);
shellIntegrationArgs.set(ShellIntegrationExecutable.ZshLogin, ['-il']);
shellIntegrationArgs.set(ShellIntegrationExecutable.Bash, ['--init-file', '{0}/out/vs/workbench/contrib/terminal/common/scripts/shellIntegration-bash.sh']);
shellIntegrationArgs.set(ShellIntegrationExecutable.Fish, ['--init-command', 'source "{0}/out/vs/workbench/contrib/terminal/common/scripts/shellIntegration.fish"']);
shellIntegrationArgs.set(ShellIntegrationExecutable.FishLogin, ['-l', '--init-command', 'source "{0}/out/vs/workbench/contrib/terminal/common/scripts/shellIntegration.fish"']);
const pwshLoginArgs = ['-login', '-l'];
const shLoginArgs = ['--login', '-l'];
const shInteractiveArgs = ['-i', '--interactive'];
const pwshImpliedArgs = ['-nol', '-nologo'];

function arePwshLoginArgs(originalArgs: SingleOrMany<string>): boolean {
	if (isString(originalArgs)) {
		return pwshLoginArgs.includes(originalArgs.toLowerCase());
	} else {
		return originalArgs.length === 1 && pwshLoginArgs.includes(originalArgs[0].toLowerCase()) ||
			(originalArgs.length === 2 &&
				(((pwshLoginArgs.includes(originalArgs[0].toLowerCase())) || pwshLoginArgs.includes(originalArgs[1].toLowerCase())))
				&& ((pwshImpliedArgs.includes(originalArgs[0].toLowerCase())) || pwshImpliedArgs.includes(originalArgs[1].toLowerCase())));
	}
}

function arePwshImpliedArgs(originalArgs: SingleOrMany<string>): boolean {
	if (isString(originalArgs)) {
		return pwshImpliedArgs.includes(originalArgs.toLowerCase());
	} else {
		return originalArgs.length === 0 || originalArgs?.length === 1 && pwshImpliedArgs.includes(originalArgs[0].toLowerCase());
	}
}

function areZshBashFishLoginArgs(originalArgs: SingleOrMany<string>): boolean {
	if (!isString(originalArgs)) {
		originalArgs = originalArgs.filter(arg => !shInteractiveArgs.includes(arg.toLowerCase()));
	}
	return isString(originalArgs) && shLoginArgs.includes(originalArgs.toLowerCase())
		|| !isString(originalArgs) && originalArgs.length === 1 && shLoginArgs.includes(originalArgs[0].toLowerCase());
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/node/terminalProcess.ts]---
Location: vscode-main/src/vs/platform/terminal/node/terminalProcess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import { exec } from 'child_process';
import { timeout } from '../../../base/common/async.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, toDisposable } from '../../../base/common/lifecycle.js';
import * as path from '../../../base/common/path.js';
import { IProcessEnvironment, isLinux, isMacintosh, isWindows } from '../../../base/common/platform.js';
import { findExecutable } from '../../../base/node/processes.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { ILogService, LogLevel } from '../../log/common/log.js';
import { IProductService } from '../../product/common/productService.js';
import { FlowControlConstants, IShellLaunchConfig, ITerminalChildProcess, ITerminalLaunchError, IProcessProperty, IProcessPropertyMap as IProcessPropertyMap, ProcessPropertyType, TerminalShellType, IProcessReadyEvent, ITerminalProcessOptions, PosixShellType, IProcessReadyWindowsPty, GeneralShellType, ITerminalLaunchResult } from '../common/terminal.js';
import { ChildProcessMonitor } from './childProcessMonitor.js';
import { getShellIntegrationInjection, getWindowsBuildNumber, IShellIntegrationConfigInjection } from './terminalEnvironment.js';
import { WindowsShellHelper } from './windowsShellHelper.js';
import { IPty, IPtyForkOptions, IWindowsPtyForkOptions, spawn } from 'node-pty';
import { isNumber } from '../../../base/common/types.js';

const enum ShutdownConstants {
	/**
	 * The amount of ms that must pass between data events after exit is queued before the actual
	 * kill call is triggered. This data flush mechanism works around an [issue in node-pty][1]
	 * where not all data is flushed which causes problems for task problem matchers. Additionally
	 * on Windows under conpty, killing a process while data is being output will cause the [conhost
	 * flush to hang the pty host][2] because [conhost should be hosted on another thread][3].
	 *
	 * [1]: https://github.com/Tyriar/node-pty/issues/72
	 * [2]: https://github.com/microsoft/vscode/issues/71966
	 * [3]: https://github.com/microsoft/node-pty/pull/415
	 */
	DataFlushTimeout = 250,
	/**
	 * The maximum ms to allow after dispose is called because forcefully killing the process.
	 */
	MaximumShutdownTime = 5000
}

const enum Constants {
	/**
	 * The minimum duration between kill and spawn calls on Windows/conpty as a mitigation for a
	 * hang issue. See:
	 * - https://github.com/microsoft/vscode/issues/71966
	 * - https://github.com/microsoft/vscode/issues/117956
	 * - https://github.com/microsoft/vscode/issues/121336
	 */
	KillSpawnThrottleInterval = 250,
	/**
	 * The amount of time to wait when a call is throttled beyond the exact amount, this is used to
	 * try prevent early timeouts causing a kill/spawn call to happen at double the regular
	 * interval.
	 */
	KillSpawnSpacingDuration = 50,
}

const posixShellTypeMap = new Map<string, PosixShellType>([
	['bash', PosixShellType.Bash],
	['csh', PosixShellType.Csh],
	['fish', PosixShellType.Fish],
	['ksh', PosixShellType.Ksh],
	['sh', PosixShellType.Sh],
	['zsh', PosixShellType.Zsh]
]);

const generalShellTypeMap = new Map<string, GeneralShellType>([
	['pwsh', GeneralShellType.PowerShell],
	['powershell', GeneralShellType.PowerShell],
	['python', GeneralShellType.Python],
	['julia', GeneralShellType.Julia],
	['nu', GeneralShellType.NuShell],
	['node', GeneralShellType.Node],

]);
export class TerminalProcess extends Disposable implements ITerminalChildProcess {
	readonly id = 0;
	readonly shouldPersist = false;

	private _properties: IProcessPropertyMap = {
		cwd: '',
		initialCwd: '',
		fixedDimensions: { cols: undefined, rows: undefined },
		title: '',
		shellType: undefined,
		hasChildProcesses: true,
		resolvedShellLaunchConfig: {},
		overrideDimensions: undefined,
		failedShellIntegrationActivation: false,
		usedShellIntegrationInjection: undefined,
		shellIntegrationInjectionFailureReason: undefined,
	};
	private static _lastKillOrStart = 0;
	private _exitCode: number | undefined;
	private _exitMessage: string | undefined;
	private _closeTimeout: Timeout | undefined;
	private _ptyProcess: IPty | undefined;
	private _currentTitle: string = '';
	private _processStartupComplete: Promise<void> | undefined;
	private _windowsShellHelper: WindowsShellHelper | undefined;
	private _childProcessMonitor: ChildProcessMonitor | undefined;
	private _titleInterval: Timeout | undefined;
	private _delayedResizer: DelayedResizer | undefined;
	private readonly _initialCwd: string;
	private readonly _ptyOptions: IPtyForkOptions | IWindowsPtyForkOptions;

	private _isPtyPaused: boolean = false;
	private _unacknowledgedCharCount: number = 0;
	get exitMessage(): string | undefined { return this._exitMessage; }

	get currentTitle(): string { return this._windowsShellHelper?.shellTitle || this._currentTitle; }
	get shellType(): TerminalShellType | undefined { return isWindows ? this._windowsShellHelper?.shellType : posixShellTypeMap.get(this._currentTitle) || generalShellTypeMap.get(this._currentTitle); }
	get hasChildProcesses(): boolean { return this._childProcessMonitor?.hasChildProcesses || false; }

	private readonly _onProcessData = this._register(new Emitter<string>());
	readonly onProcessData = this._onProcessData.event;
	private readonly _onProcessReady = this._register(new Emitter<IProcessReadyEvent>());
	readonly onProcessReady = this._onProcessReady.event;
	private readonly _onDidChangeProperty = this._register(new Emitter<IProcessProperty>());
	readonly onDidChangeProperty = this._onDidChangeProperty.event;
	private readonly _onProcessExit = this._register(new Emitter<number>());
	readonly onProcessExit = this._onProcessExit.event;

	constructor(
		readonly shellLaunchConfig: IShellLaunchConfig,
		cwd: string,
		cols: number,
		rows: number,
		env: IProcessEnvironment,
		/**
		 * environment used for `findExecutable`
		 */
		private readonly _executableEnv: IProcessEnvironment,
		private readonly _options: ITerminalProcessOptions,
		@ILogService private readonly _logService: ILogService,
		@IProductService private readonly _productService: IProductService
	) {
		super();
		let name: string;
		if (isWindows) {
			name = path.basename(this.shellLaunchConfig.executable || '');
		} else {
			// Using 'xterm-256color' here helps ensure that the majority of Linux distributions will use a
			// color prompt as defined in the default ~/.bashrc file.
			name = 'xterm-256color';
		}
		this._initialCwd = cwd;
		this._properties[ProcessPropertyType.InitialCwd] = this._initialCwd;
		this._properties[ProcessPropertyType.Cwd] = this._initialCwd;
		const useConpty = this._options.windowsEnableConpty && process.platform === 'win32' && getWindowsBuildNumber() >= 18309;
		const useConptyDll = useConpty && this._options.windowsUseConptyDll;
		this._ptyOptions = {
			name,
			cwd,
			// TODO: When node-pty is updated this cast can be removed
			env: env as { [key: string]: string },
			cols,
			rows,
			useConpty,
			useConptyDll,
			// This option will force conpty to not redraw the whole viewport on launch
			conptyInheritCursor: useConpty && !!shellLaunchConfig.initialText
		};
		// Delay resizes to avoid conpty not respecting very early resize calls
		if (isWindows) {
			if (useConpty && cols === 0 && rows === 0 && this.shellLaunchConfig.executable?.endsWith('Git\\bin\\bash.exe')) {
				this._delayedResizer = new DelayedResizer();
				this._register(this._delayedResizer.onTrigger(dimensions => {
					this._delayedResizer?.dispose();
					this._delayedResizer = undefined;
					if (dimensions.cols && dimensions.rows) {
						this.resize(dimensions.cols, dimensions.rows);
					}
				}));
			}
			// WindowsShellHelper is used to fetch the process title and shell type
			this.onProcessReady(e => {
				this._windowsShellHelper = this._register(new WindowsShellHelper(e.pid));
				this._register(this._windowsShellHelper.onShellTypeChanged(e => this._onDidChangeProperty.fire({ type: ProcessPropertyType.ShellType, value: e })));
				this._register(this._windowsShellHelper.onShellNameChanged(e => this._onDidChangeProperty.fire({ type: ProcessPropertyType.Title, value: e })));
			});
		}
		this._register(toDisposable(() => {
			if (this._titleInterval) {
				clearInterval(this._titleInterval);
				this._titleInterval = undefined;
			}
		}));
		this._register(toDisposable(() => {
			this._ptyProcess = undefined;
			this._processStartupComplete = undefined;
		}));
	}

	async start(): Promise<ITerminalLaunchError | ITerminalLaunchResult | undefined> {
		const results = await Promise.all([this._validateCwd(), this._validateExecutable()]);
		const firstError = results.find(r => r !== undefined);
		if (firstError) {
			return firstError;
		}

		const injection = await getShellIntegrationInjection(this.shellLaunchConfig, this._options, this._ptyOptions.env, this._logService, this._productService);
		if (injection.type === 'injection') {
			this._onDidChangeProperty.fire({ type: ProcessPropertyType.UsedShellIntegrationInjection, value: true });
			if (injection.envMixin) {
				for (const [key, value] of Object.entries(injection.envMixin)) {
					this._ptyOptions.env ||= {};
					this._ptyOptions.env[key] = value;
				}
			}
			if (injection.filesToCopy) {
				for (const f of injection.filesToCopy) {
					try {
						await fs.promises.mkdir(path.dirname(f.dest), { recursive: true });
						await fs.promises.copyFile(f.source, f.dest);
					} catch {
						// Swallow error, this should only happen when multiple users are on the same
						// machine. Since the shell integration scripts rarely change, plus the other user
						// should be using the same version of the server in this case, assume the script is
						// fine if copy fails and swallow the error.
					}
				}
			}
		} else {
			this._onDidChangeProperty.fire({ type: ProcessPropertyType.FailedShellIntegrationActivation, value: true });
			this._onDidChangeProperty.fire({ type: ProcessPropertyType.ShellIntegrationInjectionFailureReason, value: injection.reason });
			// Even if shell integration injection failed, still set the nonce if one was provided
			// This allows extensions to use shell integration with custom shells
			if (this._options.shellIntegration.nonce) {
				this._ptyOptions.env ||= {};
				this._ptyOptions.env['VSCODE_NONCE'] = this._options.shellIntegration.nonce;
			}
		}

		try {
			const injectionConfig: IShellIntegrationConfigInjection | undefined = injection.type === 'injection' ? injection : undefined;
			await this.setupPtyProcess(this.shellLaunchConfig, this._ptyOptions, injectionConfig);
			if (injectionConfig?.newArgs) {
				return { injectedArgs: injectionConfig.newArgs };
			}
			return undefined;
		} catch (err) {
			this._logService.trace('node-pty.node-pty.IPty#spawn native exception', err);
			return { message: `A native exception occurred during launch (${err.message})` };
		}
	}

	private async _validateCwd(): Promise<undefined | ITerminalLaunchError> {
		try {
			const result = await fs.promises.stat(this._initialCwd);
			if (!result.isDirectory()) {
				return { message: localize('launchFail.cwdNotDirectory', "Starting directory (cwd) \"{0}\" is not a directory", this._initialCwd.toString()) };
			}
		} catch (err) {
			if (err?.code === 'ENOENT') {
				return { message: localize('launchFail.cwdDoesNotExist', "Starting directory (cwd) \"{0}\" does not exist", this._initialCwd.toString()) };
			}
		}
		this._onDidChangeProperty.fire({ type: ProcessPropertyType.InitialCwd, value: this._initialCwd });
		return undefined;
	}

	private async _validateExecutable(): Promise<undefined | ITerminalLaunchError> {
		const slc = this.shellLaunchConfig;
		if (!slc.executable) {
			throw new Error('IShellLaunchConfig.executable not set');
		}

		const cwd = slc.cwd instanceof URI ? slc.cwd.path : slc.cwd;
		const envPaths: string[] | undefined = (slc.env && slc.env.PATH) ? slc.env.PATH.split(path.delimiter) : undefined;
		const executable = await findExecutable(slc.executable, cwd, envPaths, this._executableEnv);
		if (!executable) {
			return { message: localize('launchFail.executableDoesNotExist', "Path to shell executable \"{0}\" does not exist", slc.executable) };
		}

		try {
			const result = await fs.promises.stat(executable);
			if (!result.isFile() && !result.isSymbolicLink()) {
				return { message: localize('launchFail.executableIsNotFileOrSymlink', "Path to shell executable \"{0}\" is not a file or a symlink", slc.executable) };
			}
			// Set the executable explicitly here so that node-pty doesn't need to search the
			// $PATH too.
			slc.executable = executable;
		} catch (err) {
			if (err?.code === 'EACCES') {
				// Swallow
			} else {
				throw err;
			}
		}
		return undefined;
	}

	private async setupPtyProcess(
		shellLaunchConfig: IShellLaunchConfig,
		options: IPtyForkOptions,
		shellIntegrationInjection: IShellIntegrationConfigInjection | undefined
	): Promise<void> {
		const args = shellIntegrationInjection?.newArgs || shellLaunchConfig.args || [];
		await this._throttleKillSpawn();
		this._logService.trace('node-pty.IPty#spawn', shellLaunchConfig.executable, args, options);
		const ptyProcess = spawn(shellLaunchConfig.executable!, args, options);
		this._ptyProcess = ptyProcess;
		this._childProcessMonitor = this._register(new ChildProcessMonitor(ptyProcess.pid, this._logService));
		this._register(this._childProcessMonitor.onDidChangeHasChildProcesses(value => this._onDidChangeProperty.fire({ type: ProcessPropertyType.HasChildProcesses, value })));
		this._processStartupComplete = new Promise<void>(c => {
			this._register(this.onProcessReady(() => c()));
		});
		this._register(ptyProcess.onData(data => {
			// Handle flow control
			this._unacknowledgedCharCount += data.length;
			if (!this._isPtyPaused && this._unacknowledgedCharCount > FlowControlConstants.HighWatermarkChars) {
				this._logService.trace(`Flow control: Pause (${this._unacknowledgedCharCount} > ${FlowControlConstants.HighWatermarkChars})`);
				this._isPtyPaused = true;
				ptyProcess.pause();
			}

			// Refire the data event
			this._logService.trace('node-pty.IPty#onData', data);
			this._onProcessData.fire(data);
			if (this._closeTimeout) {
				this._queueProcessExit();
			}
			this._windowsShellHelper?.checkShell();
			this._childProcessMonitor?.handleOutput();
		}));
		this._register(ptyProcess.onExit(e => {
			this._exitCode = e.exitCode;
			this._queueProcessExit();
		}));
		this._sendProcessId(ptyProcess.pid);
		this._setupTitlePolling(ptyProcess);
	}

	private _setupTitlePolling(ptyProcess: IPty) {
		// Send initial timeout async to give event listeners a chance to init
		setTimeout(() => this._sendProcessTitle(ptyProcess));
		// Setup polling for non-Windows, for Windows `process` doesn't change
		if (!isWindows) {
			this._titleInterval = setInterval(() => {
				if (this._currentTitle !== ptyProcess.process) {
					this._sendProcessTitle(ptyProcess);
				}
			}, 200);
		}
	}

	// Allow any trailing data events to be sent before the exit event is sent.
	// See https://github.com/Tyriar/node-pty/issues/72
	private _queueProcessExit() {
		if (this._logService.getLevel() === LogLevel.Trace) {
			this._logService.trace('TerminalProcess#_queueProcessExit', new Error().stack?.replace(/^Error/, ''));
		}
		if (this._closeTimeout) {
			clearTimeout(this._closeTimeout);
		}
		this._closeTimeout = setTimeout(() => {
			this._closeTimeout = undefined;
			this._kill();
		}, ShutdownConstants.DataFlushTimeout);
	}

	private async _kill(): Promise<void> {
		// Wait to kill to process until the start up code has run. This prevents us from firing a process exit before a
		// process start.
		await this._processStartupComplete;
		if (this._store.isDisposed) {
			return;
		}
		// Attempt to kill the pty, it may have already been killed at this
		// point but we want to make sure
		try {
			if (this._ptyProcess) {
				await this._throttleKillSpawn();
				this._logService.trace('node-pty.IPty#kill');
				this._ptyProcess.kill();
			}
		} catch (ex) {
			// Swallow, the pty has already been killed
		}
		this._onProcessExit.fire(this._exitCode || 0);
		this.dispose();
	}

	private async _throttleKillSpawn(): Promise<void> {
		// Only throttle on Windows/conpty
		if (!isWindows || !hasConptyOption(this._ptyOptions) || !this._ptyOptions.useConpty) {
			return;
		}
		// Don't throttle when using conpty.dll as it seems to have been fixed in later versions
		if (this._ptyOptions.useConptyDll) {
			return;
		}
		// Use a loop to ensure multiple calls in a single interval space out
		while (Date.now() - TerminalProcess._lastKillOrStart < Constants.KillSpawnThrottleInterval) {
			this._logService.trace('Throttling kill/spawn call');
			await timeout(Constants.KillSpawnThrottleInterval - (Date.now() - TerminalProcess._lastKillOrStart) + Constants.KillSpawnSpacingDuration);
		}
		TerminalProcess._lastKillOrStart = Date.now();
	}

	private _sendProcessId(pid: number) {
		this._onProcessReady.fire({
			pid,
			cwd: this._initialCwd,
			windowsPty: this.getWindowsPty()
		});
	}

	private _sendProcessTitle(ptyProcess: IPty): void {
		if (this._store.isDisposed) {
			return;
		}
		// HACK: The node-pty API can return undefined somehow https://github.com/microsoft/vscode/issues/222323
		this._currentTitle = (ptyProcess.process ?? '');
		this._onDidChangeProperty.fire({ type: ProcessPropertyType.Title, value: this._currentTitle });
		// If fig is installed it may change the title of the process
		let sanitizedTitle = this.currentTitle.replace(/ \(figterm\)$/g, '');
		// Ensure any prefixed path is removed so that the executable name since we use this to
		// detect the shell type
		if (!isWindows) {
			sanitizedTitle = path.basename(sanitizedTitle);
		}

		if (sanitizedTitle.toLowerCase().startsWith('python')) {
			this._onDidChangeProperty.fire({ type: ProcessPropertyType.ShellType, value: GeneralShellType.Python });
		} else if (sanitizedTitle.toLowerCase().startsWith('julia')) {
			this._onDidChangeProperty.fire({ type: ProcessPropertyType.ShellType, value: GeneralShellType.Julia });
		} else {
			const shellTypeValue = posixShellTypeMap.get(sanitizedTitle) || generalShellTypeMap.get(sanitizedTitle);
			this._onDidChangeProperty.fire({ type: ProcessPropertyType.ShellType, value: shellTypeValue });
		}
	}

	shutdown(immediate: boolean): void {
		if (this._logService.getLevel() === LogLevel.Trace) {
			this._logService.trace('TerminalProcess#shutdown', new Error().stack?.replace(/^Error/, ''));
		}
		// don't force immediate disposal of the terminal processes on Windows as an additional
		// mitigation for https://github.com/microsoft/vscode/issues/71966 which causes the pty host
		// to become unresponsive, disconnecting all terminals across all windows.
		if (immediate && !isWindows) {
			this._kill();
		} else {
			if (!this._closeTimeout && !this._store.isDisposed) {
				this._queueProcessExit();
				// Allow a maximum amount of time for the process to exit, otherwise force kill it
				setTimeout(() => {
					if (this._closeTimeout && !this._store.isDisposed) {
						this._closeTimeout = undefined;
						this._kill();
					}
				}, ShutdownConstants.MaximumShutdownTime);
			}
		}
	}

	input(data: string, isBinary: boolean = false): void {
		this._logService.trace('node-pty.IPty#write', data, isBinary);
		if (isBinary) {
			this._ptyProcess!.write(Buffer.from(data, 'binary'));
		} else {
			this._ptyProcess!.write(data);
		}
		this._childProcessMonitor?.handleInput();
	}

	sendSignal(signal: string): void {
		if (this._store.isDisposed || !this._ptyProcess) {
			return;
		}
		this._ptyProcess.kill(signal);
	}

	async processBinary(data: string): Promise<void> {
		this.input(data, true);
	}

	async refreshProperty<T extends ProcessPropertyType>(type: T): Promise<IProcessPropertyMap[T]> {
		switch (type) {
			case ProcessPropertyType.Cwd: {
				const newCwd = await this.getCwd();
				if (newCwd !== this._properties.cwd) {
					this._properties.cwd = newCwd;
					this._onDidChangeProperty.fire({ type: ProcessPropertyType.Cwd, value: this._properties.cwd });
				}
				return newCwd as IProcessPropertyMap[T];
			}
			case ProcessPropertyType.InitialCwd: {
				const initialCwd = await this.getInitialCwd();
				if (initialCwd !== this._properties.initialCwd) {
					this._properties.initialCwd = initialCwd;
					this._onDidChangeProperty.fire({ type: ProcessPropertyType.InitialCwd, value: this._properties.initialCwd });
				}
				return initialCwd as IProcessPropertyMap[T];
			}
			case ProcessPropertyType.Title:
				return this.currentTitle as IProcessPropertyMap[T];
			default:
				return this.shellType as IProcessPropertyMap[T];
		}
	}

	async updateProperty<T extends ProcessPropertyType>(type: T, value: IProcessPropertyMap[T]): Promise<void> {
		if (type === ProcessPropertyType.FixedDimensions) {
			this._properties.fixedDimensions = value as IProcessPropertyMap[ProcessPropertyType.FixedDimensions];
		}
	}

	resize(cols: number, rows: number): void {
		if (this._store.isDisposed) {
			return;
		}
		if (!isNumber(cols) || !isNumber(rows)) {
			return;
		}
		// Ensure that cols and rows are always >= 1, this prevents a native
		// exception in winpty.
		if (this._ptyProcess) {
			cols = Math.max(cols, 1);
			rows = Math.max(rows, 1);

			// Delay resize if needed
			if (this._delayedResizer) {
				this._delayedResizer.cols = cols;
				this._delayedResizer.rows = rows;
				return;
			}

			this._logService.trace('node-pty.IPty#resize', cols, rows);
			try {
				this._ptyProcess.resize(cols, rows);
			} catch (e) {
				// Swallow error if the pty has already exited
				this._logService.trace('node-pty.IPty#resize exception ' + e.message);
				if (this._exitCode !== undefined &&
					e.message !== 'ioctl(2) failed, EBADF' &&
					e.message !== 'Cannot resize a pty that has already exited') {
					throw e;
				}
			}
		}
	}

	clearBuffer(): void {
		this._ptyProcess?.clear();
	}

	acknowledgeDataEvent(charCount: number): void {
		// Prevent lower than 0 to heal from errors
		this._unacknowledgedCharCount = Math.max(this._unacknowledgedCharCount - charCount, 0);
		this._logService.trace(`Flow control: Ack ${charCount} chars (unacknowledged: ${this._unacknowledgedCharCount})`);
		if (this._isPtyPaused && this._unacknowledgedCharCount < FlowControlConstants.LowWatermarkChars) {
			this._logService.trace(`Flow control: Resume (${this._unacknowledgedCharCount} < ${FlowControlConstants.LowWatermarkChars})`);
			this._ptyProcess?.resume();
			this._isPtyPaused = false;
		}
	}

	clearUnacknowledgedChars(): void {
		this._unacknowledgedCharCount = 0;
		this._logService.trace(`Flow control: Cleared all unacknowledged chars, forcing resume`);
		if (this._isPtyPaused) {
			this._ptyProcess?.resume();
			this._isPtyPaused = false;
		}
	}

	async setUnicodeVersion(version: '6' | '11'): Promise<void> {
		// No-op
	}

	getInitialCwd(): Promise<string> {
		return Promise.resolve(this._initialCwd);
	}

	async getCwd(): Promise<string> {
		if (isMacintosh) {
			// From Big Sur (darwin v20) there is a spawn blocking thread issue on Electron,
			// this is fixed in VS Code's internal Electron.
			// https://github.com/Microsoft/vscode/issues/105446
			return new Promise<string>(resolve => {
				if (!this._ptyProcess) {
					resolve(this._initialCwd);
					return;
				}
				this._logService.trace('node-pty.IPty#pid');
				exec('lsof -OPln -p ' + this._ptyProcess.pid + ' | grep cwd', { env: { ...process.env, LANG: 'en_US.UTF-8' } }, (error, stdout, stderr) => {
					if (!error && stdout !== '') {
						resolve(stdout.substring(stdout.indexOf('/'), stdout.length - 1));
					} else {
						this._logService.error('lsof did not run successfully, it may not be on the $PATH?', error, stdout, stderr);
						resolve(this._initialCwd);
					}
				});
			});
		}

		if (isLinux) {
			if (!this._ptyProcess) {
				return this._initialCwd;
			}
			this._logService.trace('node-pty.IPty#pid');
			try {
				return await fs.promises.readlink(`/proc/${this._ptyProcess.pid}/cwd`);
			} catch (error) {
				return this._initialCwd;
			}
		}

		return this._initialCwd;
	}

	getWindowsPty(): IProcessReadyWindowsPty | undefined {
		return isWindows ? {
			backend: hasConptyOption(this._ptyOptions) && this._ptyOptions.useConpty ? 'conpty' : 'winpty',
			buildNumber: getWindowsBuildNumber()
		} : undefined;
	}
}

/**
 * Tracks the latest resize event to be trigger at a later point.
 */
class DelayedResizer extends Disposable {
	rows: number | undefined;
	cols: number | undefined;
	private _timeout: Timeout;

	private readonly _onTrigger = this._register(new Emitter<{ rows?: number; cols?: number }>());
	get onTrigger(): Event<{ rows?: number; cols?: number }> { return this._onTrigger.event; }

	constructor() {
		super();
		this._timeout = setTimeout(() => {
			this._onTrigger.fire({ rows: this.rows, cols: this.cols });
		}, 1000);
		this._register(toDisposable(() => clearTimeout(this._timeout)));
	}
}

function hasConptyOption(obj: IPtyForkOptions | IWindowsPtyForkOptions): obj is IWindowsPtyForkOptions {
	return 'useConpty' in obj;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/node/terminalProfiles.ts]---
Location: vscode-main/src/vs/platform/terminal/node/terminalProfiles.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import * as cp from 'child_process';
import { Codicon } from '../../../base/common/codicons.js';
import { basename, delimiter, normalize, dirname, resolve } from '../../../base/common/path.js';
import { isLinux, isWindows } from '../../../base/common/platform.js';
import { findExecutable } from '../../../base/node/processes.js';
import { hasKey, isObject, isString } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import * as pfs from '../../../base/node/pfs.js';
import { enumeratePowerShellInstallations } from '../../../base/node/powershell.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { ILogService } from '../../log/common/log.js';
import { ITerminalEnvironment, ITerminalExecutable, ITerminalProfile, ITerminalProfileSource, ITerminalUnsafePath, ProfileSource, TerminalIcon, TerminalSettingId } from '../common/terminal.js';
import { getWindowsBuildNumber } from './terminalEnvironment.js';
import { ThemeIcon } from '../../../base/common/themables.js';

const enum Constants {
	UnixShellsPath = '/etc/shells'
}

let profileSources: Map<string, IPotentialTerminalProfile> | undefined;
let logIfWslNotInstalled: boolean = true;

export function detectAvailableProfiles(
	profiles: unknown,
	defaultProfile: unknown,
	includeDetectedProfiles: boolean,
	configurationService: IConfigurationService,
	shellEnv: typeof process.env = process.env,
	fsProvider?: IFsProvider,
	logService?: ILogService,
	variableResolver?: (text: string[]) => Promise<string[]>,
	testPwshSourcePaths?: string[]
): Promise<ITerminalProfile[]> {
	fsProvider = fsProvider || {
		existsFile: pfs.SymlinkSupport.existsFile,
		readFile: fs.promises.readFile
	};
	if (isWindows) {
		return detectAvailableWindowsProfiles(
			includeDetectedProfiles,
			fsProvider,
			shellEnv,
			logService,
			configurationService.getValue(TerminalSettingId.UseWslProfiles) !== false,
			profiles && isObject(profiles) ? { ...profiles } : configurationService.getValue<{ [key: string]: IUnresolvedTerminalProfile }>(TerminalSettingId.ProfilesWindows),
			isString(defaultProfile) ? defaultProfile : configurationService.getValue<string>(TerminalSettingId.DefaultProfileWindows),
			testPwshSourcePaths,
			variableResolver
		);
	}
	return detectAvailableUnixProfiles(
		fsProvider,
		logService,
		includeDetectedProfiles,
		profiles && isObject(profiles) ? { ...profiles } : configurationService.getValue<{ [key: string]: IUnresolvedTerminalProfile }>(isLinux ? TerminalSettingId.ProfilesLinux : TerminalSettingId.ProfilesMacOs),
		isString(defaultProfile) ? defaultProfile : configurationService.getValue<string>(isLinux ? TerminalSettingId.DefaultProfileLinux : TerminalSettingId.DefaultProfileMacOs),
		testPwshSourcePaths,
		variableResolver,
		shellEnv
	);
}

async function detectAvailableWindowsProfiles(
	includeDetectedProfiles: boolean,
	fsProvider: IFsProvider,
	shellEnv: typeof process.env,
	logService?: ILogService,
	useWslProfiles?: boolean,
	configProfiles?: { [key: string]: IUnresolvedTerminalProfile },
	defaultProfileName?: string,
	testPwshSourcePaths?: string[],
	variableResolver?: (text: string[]) => Promise<string[]>
): Promise<ITerminalProfile[]> {
	// Determine the correct System32 path. We want to point to Sysnative
	// when the 32-bit version of VS Code is running on a 64-bit machine.
	// The reason for this is because PowerShell's important PSReadline
	// module doesn't work if this is not the case. See #27915.
	const is32ProcessOn64Windows = process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432');
	const system32Path = `${process.env['windir']}\\${is32ProcessOn64Windows ? 'Sysnative' : 'System32'}`;

	// WSL 2 released in the May 2020 Update, this is where the `-d` flag was added that we depend
	// upon
	const allowWslDiscovery = getWindowsBuildNumber() >= 19041;

	await initializeWindowsProfiles(testPwshSourcePaths);

	const detectedProfiles: Map<string, IUnresolvedTerminalProfile> = new Map();

	// Add auto detected profiles
	if (includeDetectedProfiles) {
		detectedProfiles.set('PowerShell', {
			source: ProfileSource.Pwsh,
			icon: Codicon.terminalPowershell,
			isAutoDetected: true
		});
		detectedProfiles.set('Windows PowerShell', {
			path: `${system32Path}\\WindowsPowerShell\\v1.0\\powershell.exe`,
			icon: Codicon.terminalPowershell,
			isAutoDetected: true
		});
		detectedProfiles.set('Git Bash', {
			source: ProfileSource.GitBash,
			icon: Codicon.terminalGitBash,
			isAutoDetected: true
		});
		detectedProfiles.set('Command Prompt', {
			path: `${system32Path}\\cmd.exe`,
			icon: Codicon.terminalCmd,
			isAutoDetected: true
		});
		detectedProfiles.set('Cygwin', {
			path: [
				{ path: `${process.env['HOMEDRIVE']}\\cygwin64\\bin\\bash.exe`, isUnsafe: true },
				{ path: `${process.env['HOMEDRIVE']}\\cygwin\\bin\\bash.exe`, isUnsafe: true }
			],
			args: ['--login'],
			isAutoDetected: true
		});
		detectedProfiles.set('bash (MSYS2)', {
			path: [
				{ path: `${process.env['HOMEDRIVE']}\\msys64\\usr\\bin\\bash.exe`, isUnsafe: true },
			],
			args: ['--login', '-i'],
			// CHERE_INVOKING retains current working directory
			env: { CHERE_INVOKING: '1' },
			icon: Codicon.terminalBash,
			isAutoDetected: true
		});
		const cmderPath = `${process.env['CMDER_ROOT'] || `${process.env['HOMEDRIVE']}\\cmder`}\\vendor\\bin\\vscode_init.cmd`;
		detectedProfiles.set('Cmder', {
			path: `${system32Path}\\cmd.exe`,
			args: ['/K', cmderPath],
			// The path is safe if it was derived from CMDER_ROOT
			requiresPath: process.env['CMDER_ROOT'] ? cmderPath : { path: cmderPath, isUnsafe: true },
			isAutoDetected: true
		});
	}

	applyConfigProfilesToMap(configProfiles, detectedProfiles);

	const resultProfiles: ITerminalProfile[] = await transformToTerminalProfiles(detectedProfiles.entries(), defaultProfileName, fsProvider, shellEnv, logService, variableResolver);

	if (includeDetectedProfiles && useWslProfiles && allowWslDiscovery) {
		try {
			const result = await getWslProfiles(`${system32Path}\\wsl.exe`, defaultProfileName);
			for (const wslProfile of result) {
				if (!configProfiles || !Object.prototype.hasOwnProperty.call(configProfiles, wslProfile.profileName)) {
					resultProfiles.push(wslProfile);
				}
			}
		} catch (e) {
			if (logIfWslNotInstalled) {
				logService?.trace('WSL is not installed, so could not detect WSL profiles');
				logIfWslNotInstalled = false;
			}
		}
	}

	return resultProfiles;
}

async function transformToTerminalProfiles(
	entries: IterableIterator<[string, IUnresolvedTerminalProfile]>,
	defaultProfileName: string | undefined,
	fsProvider: IFsProvider,
	shellEnv: typeof process.env = process.env,
	logService?: ILogService,
	variableResolver?: (text: string[]) => Promise<string[]>,
): Promise<ITerminalProfile[]> {
	const promises: Promise<ITerminalProfile | undefined>[] = [];
	for (const [profileName, profile] of entries) {
		promises.push(getValidatedProfile(profileName, profile, defaultProfileName, fsProvider, shellEnv, logService, variableResolver));
	}
	return (await Promise.all(promises)).filter(e => !!e);
}

async function getValidatedProfile(
	profileName: string,
	profile: IUnresolvedTerminalProfile,
	defaultProfileName: string | undefined,
	fsProvider: IFsProvider,
	shellEnv: typeof process.env = process.env,
	logService?: ILogService,
	variableResolver?: (text: string[]) => Promise<string[]>
): Promise<ITerminalProfile | undefined> {
	if (profile === null) {
		return undefined;
	}
	let originalPaths: (string | ITerminalUnsafePath)[];
	let args: string[] | string | undefined;
	let icon: ThemeIcon | URI | { light: URI; dark: URI } | undefined = undefined;
	// use calculated values if path is not specified
	if (hasKey(profile, { source: true })) {
		const source = profileSources?.get(profile.source);
		if (!source) {
			return undefined;
		}
		originalPaths = source.paths;

		// if there are configured args, override the default ones
		args = profile.args || source.args;
		if (profile.icon) {
			icon = validateIcon(profile.icon);
		} else if (source.icon) {
			icon = source.icon;
		}
	} else {
		originalPaths = Array.isArray(profile.path) ? profile.path : [profile.path];
		args = isWindows ? profile.args : Array.isArray(profile.args) ? profile.args : undefined;
		icon = validateIcon(profile.icon);
	}

	let paths: (string | ITerminalUnsafePath)[];
	if (variableResolver) {
		// Convert to string[] for resolve
		const mapped = originalPaths.map(e => isString(e) ? e : e.path);

		const resolved = await variableResolver(mapped);
		// Convert resolved back to (T | string)[]
		paths = new Array(originalPaths.length);
		for (let i = 0; i < originalPaths.length; i++) {
			if (isString(originalPaths[i])) {
				paths[i] = resolved[i];
			} else {
				paths[i] = {
					path: resolved[i],
					isUnsafe: true
				};
			}
		}
	} else {
		paths = originalPaths.slice();
	}

	let requiresUnsafePath: string | undefined;
	if (profile.requiresPath) {
		// Validate requiresPath exists
		let actualRequiredPath: string;
		if (isString(profile.requiresPath)) {
			actualRequiredPath = profile.requiresPath;
		} else {
			actualRequiredPath = profile.requiresPath.path;
			if (profile.requiresPath.isUnsafe) {
				requiresUnsafePath = actualRequiredPath;
			}
		}
		const result = await fsProvider.existsFile(actualRequiredPath);
		if (!result) {
			return;
		}
	}

	const validatedProfile = await validateProfilePaths(profileName, defaultProfileName, paths, fsProvider, shellEnv, args, profile.env, profile.overrideName, profile.isAutoDetected, requiresUnsafePath);
	if (!validatedProfile) {
		logService?.debug('Terminal profile not validated', profileName, originalPaths);
		return undefined;
	}

	validatedProfile.isAutoDetected = profile.isAutoDetected;
	validatedProfile.icon = icon;
	validatedProfile.color = profile.color;
	return validatedProfile;
}

function validateIcon(icon: string | TerminalIcon | undefined): TerminalIcon | undefined {
	if (isString(icon)) {
		return { id: icon };
	}
	return icon;
}

async function initializeWindowsProfiles(testPwshSourcePaths?: string[]): Promise<void> {
	if (profileSources && !testPwshSourcePaths) {
		return;
	}

	const [gitBashPaths, pwshPaths] = await Promise.all([getGitBashPaths(), testPwshSourcePaths || getPowershellPaths()]);

	profileSources = new Map();
	profileSources.set(
		ProfileSource.GitBash, {
		profileName: 'Git Bash',
		paths: gitBashPaths,
		args: ['--login', '-i']
	});
	profileSources.set(ProfileSource.Pwsh, {
		profileName: 'PowerShell',
		paths: pwshPaths,
		icon: Codicon.terminalPowershell
	});
}

async function getGitBashPaths(): Promise<string[]> {
	const gitDirs: Set<string> = new Set();

	// Look for git.exe on the PATH and use that if found. git.exe is located at
	// `<installdir>/cmd/git.exe`. This is not an unsafe location because the git executable is
	// located on the PATH which is only controlled by the user/admin.
	const gitExePath = await findExecutable('git.exe');
	if (gitExePath) {
		const gitExeDir = dirname(gitExePath);
		gitDirs.add(resolve(gitExeDir, '../..'));
	}
	function addTruthy<T>(set: Set<T>, value: T | undefined): void {
		if (value) {
			set.add(value);
		}
	}

	// Add common git install locations
	addTruthy(gitDirs, process.env['ProgramW6432']);
	addTruthy(gitDirs, process.env['ProgramFiles']);
	addTruthy(gitDirs, process.env['ProgramFiles(X86)']);
	addTruthy(gitDirs, `${process.env['LocalAppData']}\\Program`);

	const gitBashPaths: string[] = [];
	for (const gitDir of gitDirs) {
		gitBashPaths.push(
			`${gitDir}\\Git\\bin\\bash.exe`,
			`${gitDir}\\Git\\usr\\bin\\bash.exe`,
			`${gitDir}\\usr\\bin\\bash.exe` // using Git for Windows SDK
		);
	}

	// Add special installs that don't follow the standard directory structure
	gitBashPaths.push(`${process.env['UserProfile']}\\scoop\\apps\\git\\current\\bin\\bash.exe`);
	gitBashPaths.push(`${process.env['UserProfile']}\\scoop\\apps\\git-with-openssh\\current\\bin\\bash.exe`);

	return gitBashPaths;
}

async function getPowershellPaths(): Promise<string[]> {
	const paths: string[] = [];
	// Add all of the different kinds of PowerShells
	for await (const pwshExe of enumeratePowerShellInstallations()) {
		paths.push(pwshExe.exePath);
	}
	return paths;
}

async function getWslProfiles(wslPath: string, defaultProfileName: string | undefined): Promise<ITerminalProfile[]> {
	const profiles: ITerminalProfile[] = [];
	const distroOutput = await new Promise<string>((resolve, reject) => {
		// wsl.exe output is encoded in utf16le (ie. A -> 0x4100) by default, force it in case the
		// user changed https://github.com/microsoft/vscode/issues/276253
		cp.exec('wsl.exe -l -q', { encoding: 'utf16le', env: { ...process.env, WSL_UTF8: '0' }, timeout: 1000 }, (err, stdout) => {
			if (err) {
				return reject('Problem occurred when getting wsl distros');
			}
			resolve(stdout);
		});
	});
	if (!distroOutput) {
		return [];
	}
	const regex = new RegExp(/[\r?\n]/);
	const distroNames = distroOutput.split(regex).filter(t => t.trim().length > 0 && t !== '');
	for (const distroName of distroNames) {
		// Skip empty lines
		if (distroName === '') {
			continue;
		}

		// docker-desktop and docker-desktop-data are treated as implementation details of
		// Docker Desktop for Windows and therefore not exposed
		if (distroName.startsWith('docker-desktop')) {
			continue;
		}

		// Create the profile, adding the icon depending on the distro
		const profileName = `${distroName} (WSL)`;
		const profile: ITerminalProfile = {
			profileName,
			path: wslPath,
			args: [`-d`, `${distroName}`],
			isDefault: profileName === defaultProfileName,
			icon: getWslIcon(distroName),
			isAutoDetected: false
		};
		// Add the profile
		profiles.push(profile);
	}
	return profiles;
}

function getWslIcon(distroName: string): ThemeIcon {
	if (distroName.includes('Ubuntu')) {
		return Codicon.terminalUbuntu;
	} else if (distroName.includes('Debian')) {
		return Codicon.terminalDebian;
	} else {
		return Codicon.terminalLinux;
	}
}

async function detectAvailableUnixProfiles(
	fsProvider: IFsProvider,
	logService?: ILogService,
	includeDetectedProfiles?: boolean,
	configProfiles?: { [key: string]: IUnresolvedTerminalProfile },
	defaultProfileName?: string,
	testPaths?: string[],
	variableResolver?: (text: string[]) => Promise<string[]>,
	shellEnv?: typeof process.env
): Promise<ITerminalProfile[]> {
	const detectedProfiles: Map<string, IUnresolvedTerminalProfile> = new Map();

	// Add non-quick launch profiles
	if (includeDetectedProfiles && await fsProvider.existsFile(Constants.UnixShellsPath)) {
		const contents = (await fsProvider.readFile(Constants.UnixShellsPath)).toString();
		const profiles = (
			(testPaths || contents.split('\n'))
				.map(e => {
					const index = e.indexOf('#');
					return index === -1 ? e : e.substring(0, index);
				})
				.filter(e => e.trim().length > 0)
		);
		const counts: Map<string, number> = new Map();
		for (const profile of profiles) {
			let profileName = basename(profile);
			let count = counts.get(profileName) || 0;
			count++;
			if (count > 1) {
				profileName = `${profileName} (${count})`;
			}
			counts.set(profileName, count);
			detectedProfiles.set(profileName, { path: profile, isAutoDetected: true });
		}
	}

	applyConfigProfilesToMap(configProfiles, detectedProfiles);

	return await transformToTerminalProfiles(detectedProfiles.entries(), defaultProfileName, fsProvider, shellEnv, logService, variableResolver);
}

function applyConfigProfilesToMap(configProfiles: { [key: string]: IUnresolvedTerminalProfile } | undefined, profilesMap: Map<string, IUnresolvedTerminalProfile>) {
	if (!configProfiles) {
		return;
	}
	for (const [profileName, value] of Object.entries(configProfiles)) {
		if (value === null || !isObject(value) || (!hasKey(value, { path: true }) && !hasKey(value, { source: true }))) {
			profilesMap.delete(profileName);
		} else {
			value.icon = value.icon || profilesMap.get(profileName)?.icon;
			profilesMap.set(profileName, value);
		}
	}
}

async function validateProfilePaths(profileName: string, defaultProfileName: string | undefined, potentialPaths: (string | ITerminalUnsafePath)[], fsProvider: IFsProvider, shellEnv: typeof process.env, args?: string[] | string, env?: ITerminalEnvironment, overrideName?: boolean, isAutoDetected?: boolean, requiresUnsafePath?: string): Promise<ITerminalProfile | undefined> {
	if (potentialPaths.length === 0) {
		return Promise.resolve(undefined);
	}
	const path = potentialPaths.shift()!;
	if (path === '') {
		return validateProfilePaths(profileName, defaultProfileName, potentialPaths, fsProvider, shellEnv, args, env, overrideName, isAutoDetected);
	}
	const isUnsafePath = !isString(path) && path.isUnsafe;
	const actualPath = isString(path) ? path : path.path;

	const profile: ITerminalProfile = {
		profileName,
		path: actualPath,
		args,
		env,
		overrideName,
		isAutoDetected,
		isDefault: profileName === defaultProfileName,
		isUnsafePath,
		requiresUnsafePath
	};

	// For non-absolute paths, check if it's available on $PATH
	if (basename(actualPath) === actualPath) {
		// The executable isn't an absolute path, try find it on the PATH
		const envPaths: string[] | undefined = shellEnv.PATH ? shellEnv.PATH.split(delimiter) : undefined;
		const executable = await findExecutable(actualPath, undefined, envPaths, undefined, fsProvider.existsFile);
		if (!executable) {
			return validateProfilePaths(profileName, defaultProfileName, potentialPaths, fsProvider, shellEnv, args);
		}
		profile.path = executable;
		profile.isFromPath = true;
		return profile;
	}

	const result = await fsProvider.existsFile(normalize(actualPath));
	if (result) {
		return profile;
	}

	return validateProfilePaths(profileName, defaultProfileName, potentialPaths, fsProvider, shellEnv, args, env, overrideName, isAutoDetected);
}

export interface IFsProvider {
	existsFile(path: string): Promise<boolean>;
	readFile(path: string): Promise<Buffer>;
}

interface IPotentialTerminalProfile {
	profileName: string;
	paths: string[];
	args?: string[];
	icon?: ThemeIcon | URI | { light: URI; dark: URI };
}

export type IUnresolvedTerminalProfile = ITerminalExecutable | ITerminalProfileSource | null;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/node/windowsShellHelper.ts]---
Location: vscode-main/src/vs/platform/terminal/node/windowsShellHelper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { timeout } from '../../../base/common/async.js';
import { debounce } from '../../../base/common/decorators.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';
import { isWindows, platform } from '../../../base/common/platform.js';
import { GeneralShellType, TerminalShellType, WindowsShellType } from '../common/terminal.js';
import type * as WindowsProcessTreeType from '@vscode/windows-process-tree';

export interface IWindowsShellHelper extends IDisposable {
	readonly onShellNameChanged: Event<string>;
	readonly onShellTypeChanged: Event<TerminalShellType | undefined>;
	getShellType(title: string): TerminalShellType | undefined;
	getShellName(): Promise<string>;
}

const SHELL_EXECUTABLES = [
	'cmd.exe',
	'powershell.exe',
	'pwsh.exe',
	'bash.exe',
	'git-cmd.exe',
	'wsl.exe',
	'ubuntu.exe',
	'ubuntu1804.exe',
	'kali.exe',
	'debian.exe',
	'opensuse-42.exe',
	'sles-12.exe',
	'julia.exe',
	'nu.exe',
	'node.exe',
];

const SHELL_EXECUTABLE_REGEXES = [
	/^python(\d(\.\d{0,2})?)?\.exe$/,
];

let windowsProcessTree: typeof WindowsProcessTreeType;

export class WindowsShellHelper extends Disposable implements IWindowsShellHelper {
	private _currentRequest: Promise<string> | undefined;
	private _shellType: TerminalShellType | undefined;
	get shellType(): TerminalShellType | undefined { return this._shellType; }
	private _shellTitle: string = '';
	get shellTitle(): string { return this._shellTitle; }
	private readonly _onShellNameChanged = new Emitter<string>();
	get onShellNameChanged(): Event<string> { return this._onShellNameChanged.event; }
	private readonly _onShellTypeChanged = new Emitter<TerminalShellType | undefined>();
	get onShellTypeChanged(): Event<TerminalShellType | undefined> { return this._onShellTypeChanged.event; }

	constructor(
		private _rootProcessId: number
	) {
		super();

		if (!isWindows) {
			throw new Error(`WindowsShellHelper cannot be instantiated on ${platform}`);
		}

		this._startMonitoringShell();
	}

	private async _startMonitoringShell(): Promise<void> {
		if (this._store.isDisposed) {
			return;
		}
		this.checkShell();
	}

	@debounce(500)
	async checkShell(): Promise<void> {
		if (isWindows) {
			// Wait to give the shell some time to actually launch a process, this
			// could lead to a race condition but it would be recovered from when
			// data stops and should cover the majority of cases
			await timeout(300);
			this.getShellName().then(title => {
				const type = this.getShellType(title);
				if (type !== this._shellType) {
					this._onShellTypeChanged.fire(type);
					this._onShellNameChanged.fire(title);
					this._shellType = type;
					this._shellTitle = title;
				}
			});
		}
	}

	private traverseTree(tree: WindowsProcessTreeType.IProcessTreeNode | undefined): string {
		if (!tree) {
			return '';
		}
		if (SHELL_EXECUTABLES.indexOf(tree.name) === -1) {
			return tree.name;
		}
		for (const regex of SHELL_EXECUTABLE_REGEXES) {
			if (tree.name.match(regex)) {
				return tree.name;
			}
		}
		if (!tree.children || tree.children.length === 0) {
			return tree.name;
		}
		let favouriteChild = 0;
		for (; favouriteChild < tree.children.length; favouriteChild++) {
			const child = tree.children[favouriteChild];
			if (!child.children || child.children.length === 0) {
				break;
			}
			if (child.children[0].name !== 'conhost.exe') {
				break;
			}
		}
		if (favouriteChild >= tree.children.length) {
			return tree.name;
		}
		return this.traverseTree(tree.children[favouriteChild]);
	}

	/**
	 * Returns the innermost shell executable running in the terminal
	 */
	async getShellName(): Promise<string> {
		if (this._store.isDisposed) {
			return Promise.resolve('');
		}
		// Prevent multiple requests at once, instead return current request
		if (this._currentRequest) {
			return this._currentRequest;
		}
		if (!windowsProcessTree) {
			windowsProcessTree = await import('@vscode/windows-process-tree');
		}
		this._currentRequest = new Promise<string>(resolve => {
			windowsProcessTree.getProcessTree(this._rootProcessId, tree => {
				const name = this.traverseTree(tree);
				this._currentRequest = undefined;
				resolve(name);
			});
		});
		return this._currentRequest;
	}

	getShellType(executable: string): TerminalShellType | undefined {
		switch (executable.toLowerCase()) {
			case 'cmd.exe':
				return WindowsShellType.CommandPrompt;
			case 'powershell.exe':
			case 'pwsh.exe':
				return GeneralShellType.PowerShell;
			case 'bash.exe':
			case 'git-cmd.exe':
				return WindowsShellType.GitBash;
			case 'julia.exe':
				return GeneralShellType.Julia;
			case 'node.exe':
				return GeneralShellType.Node;
			case 'nu.exe':
				return GeneralShellType.NuShell;
			case 'wsl.exe':
			case 'ubuntu.exe':
			case 'ubuntu1804.exe':
			case 'kali.exe':
			case 'debian.exe':
			case 'opensuse-42.exe':
			case 'sles-12.exe':
				return WindowsShellType.Wsl;
			default:
				if (executable.match(/python(\d(\.\d{0,2})?)?\.exe/)) {
					return GeneralShellType.Python;
				}
				return undefined;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/node/terminalContrib/autoReplies/autoRepliesContribController.ts]---
Location: vscode-main/src/vs/platform/terminal/node/terminalContrib/autoReplies/autoRepliesContribController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILogService } from '../../../../log/common/log.js';
import type { IPtyServiceContribution, ITerminalChildProcess } from '../../../common/terminal.js';
import { TerminalAutoResponder } from './terminalAutoResponder.js';

export class AutoRepliesPtyServiceContribution implements IPtyServiceContribution {
	private readonly _autoReplies: Map<string, string> = new Map();
	private readonly _terminalProcesses: Map<number, ITerminalChildProcess> = new Map();
	private readonly _autoResponders: Map<number, Map<string, TerminalAutoResponder>> = new Map();

	constructor(
		@ILogService private readonly _logService: ILogService
	) {
	}

	async installAutoReply(match: string, reply: string) {
		this._autoReplies.set(match, reply);
		// If the auto reply exists on any existing terminals it will be overridden
		for (const persistentProcessId of this._autoResponders.keys()) {
			const process = this._terminalProcesses.get(persistentProcessId);
			if (!process) {
				this._logService.error('Could not find terminal process to install auto reply');
				continue;
			}
			this._processInstallAutoReply(persistentProcessId, process, match, reply);
		}
	}

	async uninstallAllAutoReplies() {
		for (const match of this._autoReplies.keys()) {
			for (const processAutoResponders of this._autoResponders.values()) {
				processAutoResponders.get(match)?.dispose();
				processAutoResponders.delete(match);
			}
		}
	}

	handleProcessReady(persistentProcessId: number, process: ITerminalChildProcess): void {
		this._terminalProcesses.set(persistentProcessId, process);
		this._autoResponders.set(persistentProcessId, new Map());
		for (const [match, reply] of this._autoReplies.entries()) {
			this._processInstallAutoReply(persistentProcessId, process, match, reply);
		}
	}

	handleProcessDispose(persistentProcessId: number): void {
		const processAutoResponders = this._autoResponders.get(persistentProcessId);
		if (processAutoResponders) {
			for (const e of processAutoResponders.values()) {
				e.dispose();
			}
			processAutoResponders.clear();
		}
	}

	handleProcessInput(persistentProcessId: number, data: string) {
		const processAutoResponders = this._autoResponders.get(persistentProcessId);
		if (processAutoResponders) {
			for (const listener of processAutoResponders.values()) {
				listener.handleInput();
			}
		}
	}

	handleProcessResize(persistentProcessId: number, cols: number, rows: number) {
		const processAutoResponders = this._autoResponders.get(persistentProcessId);
		if (processAutoResponders) {
			for (const listener of processAutoResponders.values()) {
				listener.handleResize();
			}
		}
	}

	private _processInstallAutoReply(persistentProcessId: number, terminalProcess: ITerminalChildProcess, match: string, reply: string) {
		const processAutoResponders = this._autoResponders.get(persistentProcessId);
		if (processAutoResponders) {
			processAutoResponders.get(match)?.dispose();
			processAutoResponders.set(match, new TerminalAutoResponder(terminalProcess, match, reply, this._logService));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/node/terminalContrib/autoReplies/terminalAutoResponder.ts]---
Location: vscode-main/src/vs/platform/terminal/node/terminalContrib/autoReplies/terminalAutoResponder.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { timeout } from '../../../../../base/common/async.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { isString } from '../../../../../base/common/types.js';
import { isWindows } from '../../../../../base/common/platform.js';
import { ILogService } from '../../../../log/common/log.js';
import { ITerminalChildProcess } from '../../../common/terminal.js';

/**
 * Tracks a terminal process's data stream and responds immediately when a matching string is
 * received. This is done in a low overhead way and is ideally run on the same process as the
 * where the process is handled to minimize latency.
 */
export class TerminalAutoResponder extends Disposable {
	private _pointer = 0;
	private _paused = false;

	/**
	 * Each reply is throttled by a second to avoid resource starvation and responding to screen
	 * reprints on Winodws.
	 */
	private _throttled = false;

	constructor(
		proc: ITerminalChildProcess,
		matchWord: string,
		response: string,
		logService: ILogService
	) {
		super();

		this._register(proc.onProcessData(e => {
			if (this._paused || this._throttled) {
				return;
			}
			const data = isString(e) ? e : e.data;
			for (let i = 0; i < data.length; i++) {
				if (data[i] === matchWord[this._pointer]) {
					this._pointer++;
				} else {
					this._reset();
				}
				// Auto reply and reset
				if (this._pointer === matchWord.length) {
					logService.debug(`Auto reply match: "${matchWord}", response: "${response}"`);
					proc.input(response);
					this._throttled = true;
					timeout(1000).then(() => this._throttled = false);
					this._reset();
				}
			}
		}));
	}

	private _reset() {
		this._pointer = 0;
	}

	/**
	 * No auto response will happen after a resize on Windows in case the resize is a result of
	 * reprinting the screen.
	 */
	handleResize() {
		if (isWindows) {
			this._paused = true;
		}
	}

	handleInput() {
		this._paused = false;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/test/common/requestStore.test.ts]---
Location: vscode-main/src/vs/platform/terminal/test/common/requestStore.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { fail, strictEqual } from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { TestInstantiationService } from '../../../instantiation/test/common/instantiationServiceMock.js';
import { ConsoleLogger, ILogService } from '../../../log/common/log.js';
import { LogService } from '../../../log/common/logService.js';
import { RequestStore } from '../../common/requestStore.js';

suite('RequestStore', () => {
	let instantiationService: TestInstantiationService;

	setup(() => {
		instantiationService = new TestInstantiationService();
		instantiationService.stub(ILogService, new LogService(new ConsoleLogger()));
	});

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	test('should resolve requests', async () => {
		const requestStore: RequestStore<{ data: string }, { arg: string }> = store.add(instantiationService.createInstance(RequestStore<{ data: string }, { arg: string }>, undefined));
		let eventArgs: { requestId: number; arg: string } | undefined;
		store.add(requestStore.onCreateRequest(e => eventArgs = e));
		const request = requestStore.createRequest({ arg: 'foo' });
		strictEqual(typeof eventArgs?.requestId, 'number');
		strictEqual(eventArgs?.arg, 'foo');
		requestStore.acceptReply(eventArgs.requestId, { data: 'bar' });
		const result = await request;
		strictEqual(result.data, 'bar');
	});

	test('should reject the promise when the request times out', async () => {
		const requestStore: RequestStore<{ data: string }, { arg: string }> = store.add(instantiationService.createInstance(RequestStore<{ data: string }, { arg: string }>, 1));
		const request = requestStore.createRequest({ arg: 'foo' });
		let threw = false;
		try {
			await request;
		} catch (e) {
			threw = true;
		}
		if (!threw) {
			fail();
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/test/common/terminalEnvironment.test.ts]---
Location: vscode-main/src/vs/platform/terminal/test/common/terminalEnvironment.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { strictEqual } from 'assert';
import { OperatingSystem, OS } from '../../../../base/common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { collapseTildePath, sanitizeCwd, escapeNonWindowsPath } from '../../common/terminalEnvironment.js';
import { PosixShellType, WindowsShellType, GeneralShellType } from '../../common/terminal.js';

suite('terminalEnvironment', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('collapseTildePath', () => {
		test('should return empty string for a falsy path', () => {
			strictEqual(collapseTildePath('', '/foo', '/'), '');
			strictEqual(collapseTildePath(undefined, '/foo', '/'), '');
		});
		test('should return path for a falsy user home', () => {
			strictEqual(collapseTildePath('/foo', '', '/'), '/foo');
			strictEqual(collapseTildePath('/foo', undefined, '/'), '/foo');
		});
		test('should not collapse when user home isn\'t present', () => {
			strictEqual(collapseTildePath('/foo', '/bar', '/'), '/foo');
			strictEqual(collapseTildePath('C:\\foo', 'C:\\bar', '\\'), 'C:\\foo');
		});
		test('should collapse with Windows separators', () => {
			strictEqual(collapseTildePath('C:\\foo\\bar', 'C:\\foo', '\\'), '~\\bar');
			strictEqual(collapseTildePath('C:\\foo\\bar', 'C:\\foo\\', '\\'), '~\\bar');
			strictEqual(collapseTildePath('C:\\foo\\bar\\baz', 'C:\\foo\\', '\\'), '~\\bar\\baz');
			strictEqual(collapseTildePath('C:\\foo\\bar\\baz', 'C:\\foo', '\\'), '~\\bar\\baz');
		});
		test('should collapse mixed case with Windows separators', () => {
			strictEqual(collapseTildePath('c:\\foo\\bar', 'C:\\foo', '\\'), '~\\bar');
			strictEqual(collapseTildePath('C:\\foo\\bar\\baz', 'c:\\foo', '\\'), '~\\bar\\baz');
		});
		test('should collapse with Posix separators', () => {
			strictEqual(collapseTildePath('/foo/bar', '/foo', '/'), '~/bar');
			strictEqual(collapseTildePath('/foo/bar', '/foo/', '/'), '~/bar');
			strictEqual(collapseTildePath('/foo/bar/baz', '/foo', '/'), '~/bar/baz');
			strictEqual(collapseTildePath('/foo/bar/baz', '/foo/', '/'), '~/bar/baz');
		});
	});
	suite('sanitizeCwd', () => {
		if (OS === OperatingSystem.Windows) {
			test('should make the Windows drive letter uppercase', () => {
				strictEqual(sanitizeCwd('c:\\foo\\bar'), 'C:\\foo\\bar');
			});
		}
		test('should remove any wrapping quotes', () => {
			strictEqual(sanitizeCwd('\'/foo/bar\''), '/foo/bar');
			strictEqual(sanitizeCwd('"/foo/bar"'), '/foo/bar');
		});
	});

	suite('escapeNonWindowsPath', () => {
		test('should escape for bash/sh/zsh shells', () => {
			strictEqual(escapeNonWindowsPath('/foo/bar', PosixShellType.Bash), '\'/foo/bar\'');
			strictEqual(escapeNonWindowsPath('/foo/bar\'baz', PosixShellType.Bash), '\'/foo/bar\\\'baz\'');
			strictEqual(escapeNonWindowsPath('/foo/bar"baz', PosixShellType.Bash), '\'/foo/bar"baz\'');
			strictEqual(escapeNonWindowsPath('/foo/bar\'baz"qux', PosixShellType.Bash), '$\'/foo/bar\\\'baz"qux\'');
			strictEqual(escapeNonWindowsPath('/foo/bar', PosixShellType.Sh), '\'/foo/bar\'');
			strictEqual(escapeNonWindowsPath('/foo/bar\'baz', PosixShellType.Sh), '\'/foo/bar\\\'baz\'');
			strictEqual(escapeNonWindowsPath('/foo/bar', PosixShellType.Zsh), '\'/foo/bar\'');
			strictEqual(escapeNonWindowsPath('/foo/bar\'baz', PosixShellType.Zsh), '\'/foo/bar\\\'baz\'');
		});

		test('should escape for git bash', () => {
			strictEqual(escapeNonWindowsPath('/foo/bar', WindowsShellType.GitBash), '\'/foo/bar\'');
			strictEqual(escapeNonWindowsPath('/foo/bar\'baz', WindowsShellType.GitBash), '\'/foo/bar\\\'baz\'');
			strictEqual(escapeNonWindowsPath('/foo/bar"baz', WindowsShellType.GitBash), '\'/foo/bar"baz\'');
		});

		test('should escape for fish shell', () => {
			strictEqual(escapeNonWindowsPath('/foo/bar', PosixShellType.Fish), '\'/foo/bar\'');
			strictEqual(escapeNonWindowsPath('/foo/bar\'baz', PosixShellType.Fish), '\'/foo/bar\\\'baz\'');
			strictEqual(escapeNonWindowsPath('/foo/bar"baz', PosixShellType.Fish), '\'/foo/bar"baz\'');
			strictEqual(escapeNonWindowsPath('/foo/bar\'baz"qux', PosixShellType.Fish), '"/foo/bar\'baz\\"qux"');
		});

		test('should escape for PowerShell', () => {
			strictEqual(escapeNonWindowsPath('/foo/bar', GeneralShellType.PowerShell), '\'/foo/bar\'');
			strictEqual(escapeNonWindowsPath('/foo/bar\'baz', GeneralShellType.PowerShell), '\'/foo/bar\'\'baz\'');
			strictEqual(escapeNonWindowsPath('/foo/bar"baz', GeneralShellType.PowerShell), '\'/foo/bar"baz\'');
			strictEqual(escapeNonWindowsPath('/foo/bar\'baz"qux', GeneralShellType.PowerShell), '"/foo/bar\'baz`"qux"');
		});

		test('should default to POSIX escaping for unknown shells', () => {
			strictEqual(escapeNonWindowsPath('/foo/bar'), '\'/foo/bar\'');
			strictEqual(escapeNonWindowsPath('/foo/bar\'baz'), '\'/foo/bar\\\'baz\'');
		});

		test('should remove dangerous characters', () => {
			strictEqual(escapeNonWindowsPath('/foo/bar$(echo evil)', PosixShellType.Bash), '\'/foo/bar(echo evil)\'');
			strictEqual(escapeNonWindowsPath('/foo/bar`whoami`', PosixShellType.Bash), '\'/foo/barwhoami\'');
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/test/common/terminalProfiles.test.ts]---
Location: vscode-main/src/vs/platform/terminal/test/common/terminalProfiles.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual } from 'assert';
import { Codicon } from '../../../../base/common/codicons.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ITerminalProfile } from '../../common/terminal.js';
import { createProfileSchemaEnums } from '../../common/terminalProfiles.js';

suite('terminalProfiles', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('createProfileSchemaEnums', () => {
		test('should return an empty array when there are no profiles', () => {
			deepStrictEqual(createProfileSchemaEnums([]), {
				values: [
					null
				],
				markdownDescriptions: [
					'Automatically detect the default'
				]
			});
		});
		test('should return a single entry when there is one profile', () => {
			const profile: ITerminalProfile = {
				profileName: 'name',
				path: 'path',
				isDefault: true
			};
			deepStrictEqual(createProfileSchemaEnums([profile]), {
				values: [
					null,
					'name'
				],
				markdownDescriptions: [
					'Automatically detect the default',
					'$(terminal) name\n- path: path'
				]
			});
		});
		test('should show all profile information', () => {
			const profile: ITerminalProfile = {
				profileName: 'name',
				path: 'path',
				isDefault: true,
				args: ['a', 'b'],
				color: 'terminal.ansiRed',
				env: {
					c: 'd',
					e: 'f'
				},
				icon: Codicon.zap,
				overrideName: true
			};
			deepStrictEqual(createProfileSchemaEnums([profile]), {
				values: [
					null,
					'name'
				],
				markdownDescriptions: [
					'Automatically detect the default',
					`$(zap) name\n- path: path\n- args: ['a','b']\n- overrideName: true\n- color: terminal.ansiRed\n- env: {\"c\":\"d\",\"e\":\"f\"}`
				]
			});
		});
		test('should return a multiple entries when there are multiple profiles', () => {
			const profile1: ITerminalProfile = {
				profileName: 'name',
				path: 'path',
				isDefault: true
			};
			const profile2: ITerminalProfile = {
				profileName: 'foo',
				path: 'bar',
				isDefault: false
			};
			deepStrictEqual(createProfileSchemaEnums([profile1, profile2]), {
				values: [
					null,
					'name',
					'foo'
				],
				markdownDescriptions: [
					'Automatically detect the default',
					'$(terminal) name\n- path: path',
					'$(terminal) foo\n- path: bar'
				]
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/test/common/terminalRecorder.test.ts]---
Location: vscode-main/src/vs/platform/terminal/test/common/terminalRecorder.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ReplayEntry } from '../../common/terminalProcess.js';
import { TerminalRecorder } from '../../common/terminalRecorder.js';

async function eventsEqual(recorder: TerminalRecorder, expected: ReplayEntry[]) {
	const actual = (await recorder.generateReplayEvent()).events;
	for (let i = 0; i < expected.length; i++) {
		assert.deepStrictEqual(actual[i], expected[i]);
	}
}

suite('TerminalRecorder', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('should record dimensions', async () => {
		const recorder = new TerminalRecorder(1, 2);
		await eventsEqual(recorder, [
			{ cols: 1, rows: 2, data: '' }
		]);
		recorder.handleData('a');
		recorder.handleResize(3, 4);
		await eventsEqual(recorder, [
			{ cols: 1, rows: 2, data: 'a' },
			{ cols: 3, rows: 4, data: '' }
		]);
	});
	test('should ignore resize events without data', async () => {
		const recorder = new TerminalRecorder(1, 2);
		await eventsEqual(recorder, [
			{ cols: 1, rows: 2, data: '' }
		]);
		recorder.handleResize(3, 4);
		await eventsEqual(recorder, [
			{ cols: 3, rows: 4, data: '' }
		]);
	});
	test('should record data and combine it into the previous resize event', async () => {
		const recorder = new TerminalRecorder(1, 2);
		recorder.handleData('a');
		recorder.handleData('b');
		recorder.handleResize(3, 4);
		recorder.handleData('c');
		recorder.handleData('d');
		await eventsEqual(recorder, [
			{ cols: 1, rows: 2, data: 'ab' },
			{ cols: 3, rows: 4, data: 'cd' }
		]);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/test/common/capabilities/commandDetection/promptInputModel.test.ts]---
Location: vscode-main/src/vs/platform/terminal/test/common/capabilities/commandDetection/promptInputModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Terminal } from '@xterm/headless';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { NullLogService } from '../../../../../log/common/log.js';
import { PromptInputModel, type IPromptInputModelState } from '../../../../common/capabilities/commandDetection/promptInputModel.js';
import { Emitter } from '../../../../../../base/common/event.js';
import type { ITerminalCommand } from '../../../../common/capabilities/capabilities.js';
import { ok, notDeepStrictEqual, strictEqual } from 'assert';
import { timeout } from '../../../../../../base/common/async.js';
import { importAMDNodeModule } from '../../../../../../amdX.js';
import { GeneralShellType, PosixShellType } from '../../../../common/terminal.js';
import { runWithFakedTimers } from '../../../../../../base/test/common/timeTravelScheduler.js';

suite('PromptInputModel', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let promptInputModel: PromptInputModel;
	let xterm: Terminal;
	let onCommandStart: Emitter<ITerminalCommand>;
	let onCommandStartChanged: Emitter<void>;
	let onCommandExecuted: Emitter<ITerminalCommand>;

	async function writePromise(data: string) {
		await new Promise<void>(r => xterm.write(data, r));
	}

	function fireCommandStart() {
		onCommandStart.fire({ marker: xterm.registerMarker() } as ITerminalCommand);
	}

	function fireCommandExecuted() {
		onCommandExecuted.fire(null!);
	}

	function setContinuationPrompt(prompt: string) {
		promptInputModel.setContinuationPrompt(prompt);
	}

	async function assertPromptInput(valueWithCursor: string) {
		await timeout(0);

		if (promptInputModel.cursorIndex !== -1 && !valueWithCursor.includes('|')) {
			throw new Error('assertPromptInput must contain | character');
		}

		const actualValueWithCursor = promptInputModel.getCombinedString();
		strictEqual(
			actualValueWithCursor,
			valueWithCursor.replaceAll('\n', '\u23CE')
		);

		// This is required to ensure the cursor index is correctly resolved for non-ascii characters
		const value = valueWithCursor.replace(/[\|\[\]]/g, '');
		const cursorIndex = valueWithCursor.indexOf('|');
		strictEqual(promptInputModel.value, value);
		strictEqual(promptInputModel.cursorIndex, cursorIndex, `value=${promptInputModel.value}`);
		ok(promptInputModel.ghostTextIndex === -1 || cursorIndex <= promptInputModel.ghostTextIndex, `cursorIndex (${cursorIndex}) must be before ghostTextIndex (${promptInputModel.ghostTextIndex})`);
	}

	setup(async () => {
		const TerminalCtor = (await importAMDNodeModule<typeof import('@xterm/xterm')>('@xterm/xterm', 'lib/xterm.js')).Terminal;
		xterm = store.add(new TerminalCtor({ allowProposedApi: true }));
		onCommandStart = store.add(new Emitter());
		onCommandStartChanged = store.add(new Emitter());
		onCommandExecuted = store.add(new Emitter());
		promptInputModel = store.add(new PromptInputModel(xterm, onCommandStart.event, onCommandStartChanged.event, onCommandExecuted.event, new NullLogService));
	});

	test('basic input and execute', async () => {
		await writePromise('$ ');
		fireCommandStart();
		await assertPromptInput('|');

		await writePromise('foo bar');
		await assertPromptInput('foo bar|');

		await writePromise('\r\n');
		fireCommandExecuted();
		await assertPromptInput('foo bar');

		await writePromise('(command output)\r\n$ ');
		fireCommandStart();
		await assertPromptInput('|');
	});

	test('should not fire onDidChangeInput events when nothing changes', async () => {
		const events: IPromptInputModelState[] = [];
		store.add(promptInputModel.onDidChangeInput(e => events.push(e)));

		await writePromise('$ ');
		fireCommandStart();
		await assertPromptInput('|');

		await writePromise('foo');
		await assertPromptInput('foo|');

		await writePromise(' bar');
		await assertPromptInput('foo bar|');

		await writePromise('\r\n');
		fireCommandExecuted();
		await assertPromptInput('foo bar');

		await writePromise('$ ');
		fireCommandStart();
		await assertPromptInput('|');

		await writePromise('foo bar');
		await assertPromptInput('foo bar|');

		for (let i = 0; i < events.length - 1; i++) {
			notDeepStrictEqual(events[i], events[i + 1], 'not adjacent events should fire with the same value');
		}
	});

	test('should fire onDidInterrupt followed by onDidFinish when ctrl+c is pressed', async () => {
		await writePromise('$ ');
		fireCommandStart();
		await assertPromptInput('|');

		await writePromise('foo');
		await assertPromptInput('foo|');

		await new Promise<void>(r => {
			store.add(promptInputModel.onDidInterrupt(() => {
				// Fire onDidFinishInput immediately after onDidInterrupt
				store.add(promptInputModel.onDidFinishInput(() => {
					r();
				}));
			}));
			xterm.input('\x03');
			writePromise('^C').then(() => fireCommandExecuted());
		});
	});

	test('cursor navigation', async () => {
		await writePromise('$ ');
		fireCommandStart();
		await assertPromptInput('|');

		await writePromise('foo bar');
		await assertPromptInput('foo bar|');

		await writePromise('\x1b[3D');
		await assertPromptInput('foo |bar');

		await writePromise('\x1b[4D');
		await assertPromptInput('|foo bar');

		await writePromise('\x1b[3C');
		await assertPromptInput('foo| bar');

		await writePromise('\x1b[4C');
		await assertPromptInput('foo bar|');

		await writePromise('\x1b[D');
		await assertPromptInput('foo ba|r');

		await writePromise('\x1b[C');
		await assertPromptInput('foo bar|');
	});

	suite('ghost text', () => {
		test('basic ghost text', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise('foo\x1b[2m bar\x1b[0m\x1b[4D');
			await assertPromptInput('foo|[ bar]');

			await writePromise('\x1b[2D');
			await assertPromptInput('f|oo[ bar]');
		});
		test('trailing whitespace', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');
			await writePromise('foo    ');
			await writePromise('\x1b[4D');
			await assertPromptInput('foo|    ');
		});
		test('basic ghost text one word', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise('pw\x1b[2md\x1b[1D');
			await assertPromptInput('pw|[d]');
		});
		test('ghost text with cursor navigation', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise('foo\x1b[2m bar\x1b[0m\x1b[4D');
			await assertPromptInput('foo|[ bar]');

			await writePromise('\x1b[2D');
			await assertPromptInput('f|oo[ bar]');

			await writePromise('\x1b[C');
			await assertPromptInput('fo|o[ bar]');

			await writePromise('\x1b[C');
			await assertPromptInput('foo|[ bar]');
		});
		test('ghost text with different foreground colors only', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise('foo\x1b[38;2;255;0;0m bar\x1b[0m\x1b[4D');
			await assertPromptInput('foo|[ bar]');

			await writePromise('\x1b[2D');
			await assertPromptInput('f|oo[ bar]');
		});
		test('no ghost text when foreground color matches earlier text', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise(
				'\x1b[38;2;255;0;0mred1\x1b[0m ' +  // Red "red1"
				'\x1b[38;2;0;255;0mgreen\x1b[0m ' + // Green "green"
				'\x1b[38;2;255;0;0mred2\x1b[0m'     // Red "red2" (same as red1)
			);

			await assertPromptInput('red1 green red2|'); // No ghost text expected
		});

		test('ghost text detected when foreground color is unique at the end', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise(
				'\x1b[38;2;255;0;0mcmd\x1b[0m ' +   // Red "cmd"
				'\x1b[38;2;0;255;0marg\x1b[0m ' +   // Green "arg"
				'\x1b[38;2;0;0;255mfinal\x1b[5D'    // Blue "final" (ghost text)
			);

			await assertPromptInput('cmd arg |[final]');
		});

		test('no ghost text when background color matches earlier text', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise(
				'\x1b[48;2;255;0;0mred_bg1\x1b[0m ' +  // Red background
				'\x1b[48;2;0;255;0mgreen_bg\x1b[0m ' + // Green background
				'\x1b[48;2;255;0;0mred_bg2\x1b[0m'     // Red background again
			);

			await assertPromptInput('red_bg1 green_bg red_bg2|'); // No ghost text expected
		});

		test('ghost text detected when background color is unique at the end', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise(
				'\x1b[48;2;255;0;0mred_bg\x1b[0m ' +  // Red background
				'\x1b[48;2;0;255;0mgreen_bg\x1b[0m ' + // Green background
				'\x1b[48;2;0;0;255mblue_bg\x1b[7D'     // Blue background (ghost text)
			);

			await assertPromptInput('red_bg green_bg |[blue_bg]');
		});

		test('ghost text detected when bold style is unique at the end', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise(
				'text ' +
				'\x1b[1mBOLD\x1b[4D' // Bold "BOLD" (ghost text)
			);

			await assertPromptInput('text |[BOLD]');
		});

		test('no ghost text when earlier text has the same bold style', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise(
				'\x1b[1mBOLD1\x1b[0m ' + // Bold "BOLD1"
				'normal ' +
				'\x1b[1mBOLD2\x1b[0m'    // Bold "BOLD2" (same style as "BOLD1")
			);

			await assertPromptInput('BOLD1 normal BOLD2|'); // No ghost text expected
		});

		test('ghost text detected when italic style is unique at the end', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise(
				'text ' +
				'\x1b[3mITALIC\x1b[6D' // Italic "ITALIC" (ghost text)
			);

			await assertPromptInput('text |[ITALIC]');
		});

		test('no ghost text when earlier text has the same italic style', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise(
				'\x1b[3mITALIC1\x1b[0m ' + // Italic "ITALIC1"
				'normal ' +
				'\x1b[3mITALIC2\x1b[0m'    // Italic "ITALIC2" (same style as "ITALIC1")
			);

			await assertPromptInput('ITALIC1 normal ITALIC2|'); // No ghost text expected
		});

		test('ghost text detected when underline style is unique at the end', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise(
				'text ' +
				'\x1b[4mUNDERLINE\x1b[9D' // Underlined "UNDERLINE" (ghost text)
			);

			await assertPromptInput('text |[UNDERLINE]');
		});

		test('no ghost text when earlier text has the same underline style', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise(
				'\x1b[4mUNDERLINE1\x1b[0m ' + // Underlined "UNDERLINE1"
				'normal ' +
				'\x1b[4mUNDERLINE2\x1b[0m'    // Underlined "UNDERLINE2" (same style as "UNDERLINE1")
			);

			await assertPromptInput('UNDERLINE1 normal UNDERLINE2|'); // No ghost text expected
		});

		test('ghost text detected when strikethrough style is unique at the end', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise(
				'text ' +
				'\x1b[9mSTRIKE\x1b[6D' // Strikethrough "STRIKE" (ghost text)
			);

			await assertPromptInput('text |[STRIKE]');
		});

		test('no ghost text when earlier text has the same strikethrough style', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise(
				'\x1b[9mSTRIKE1\x1b[0m ' + // Strikethrough "STRIKE1"
				'normal ' +
				'\x1b[9mSTRIKE2\x1b[0m'    // Strikethrough "STRIKE2" (same style as "STRIKE1")
			);

			await assertPromptInput('STRIKE1 normal STRIKE2|'); // No ghost text expected
		});
		suite('With wrapping', () => {
			test('Fish ghost text in long line with wrapped content', async () => {
				promptInputModel.setShellType(PosixShellType.Fish);
				await writePromise('$ ');
				fireCommandStart();
				await assertPromptInput('|');

				// Write a command with ghost text that will wrap
				await writePromise('find . -name');
				await assertPromptInput(`find . -name|`);

				// Add ghost text with dim style
				await writePromise('\x1b[2m test\x1b[0m\x1b[4D');
				await assertPromptInput(`find . -name |[test]`);

				// Move cursor within the ghost text
				await writePromise('\x1b[C');
				await assertPromptInput(`find . -name t|[est]`);

				// Accept ghost text
				await writePromise('\x1b[C\x1b[C\x1b[C\x1b[C\x1b[C');
				await assertPromptInput(`find . -name test|`);
			});
			test('Pwsh ghost text in long line with wrapped content', async () => {
				promptInputModel.setShellType(GeneralShellType.PowerShell);
				await writePromise('$ ');
				fireCommandStart();
				await assertPromptInput('|');

				// Write a command with ghost text that will wrap
				await writePromise('find . -name');
				await assertPromptInput(`find . -name|`);

				// Add ghost text with dim style
				await writePromise('\x1b[2m test\x1b[0m\x1b[4D');
				await assertPromptInput(`find . -name |[test]`);

				// Move cursor within the ghost text
				await writePromise('\x1b[C');
				await assertPromptInput(`find . -name t|[est]`);

				// Accept ghost text
				await writePromise('\x1b[C\x1b[C\x1b[C\x1b[C\x1b[C');
				await assertPromptInput(`find . -name test|`);
			});
		});
		test('Does not detect right prompt as ghost text', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');
			await writePromise('cmd' + ' '.repeat(6) + '\x1b[38;2;255;0;0mRP\x1b[0m\x1b[8D');
			await assertPromptInput('cmd|' + ' '.repeat(6) + 'RP');
		});
	});

	test('wide input (Korean)', async () => {
		await writePromise('$ ');
		fireCommandStart();
		await assertPromptInput('|');

		await writePromise('안영');
		await assertPromptInput('안영|');

		await writePromise('\r\n컴퓨터');
		await assertPromptInput('안영\n컴퓨터|');

		await writePromise('\r\n사람');
		await assertPromptInput('안영\n컴퓨터\n사람|');

		await writePromise('\x1b[G');
		await assertPromptInput('안영\n컴퓨터\n|사람');

		await writePromise('\x1b[A');
		await assertPromptInput('안영\n|컴퓨터\n사람');

		await writePromise('\x1b[4C');
		await assertPromptInput('안영\n컴퓨|터\n사람');

		await writePromise('\x1b[1;4H');
		await assertPromptInput('안|영\n컴퓨터\n사람');

		await writePromise('\x1b[D');
		await assertPromptInput('|안영\n컴퓨터\n사람');
	});

	test('emoji input', async () => {
		await writePromise('$ ');
		fireCommandStart();
		await assertPromptInput('|');

		await writePromise('✌️👍');
		await assertPromptInput('✌️👍|');

		await writePromise('\r\n😎😕😅');
		await assertPromptInput('✌️👍\n😎😕😅|');

		await writePromise('\r\n🤔🤷😩');
		await assertPromptInput('✌️👍\n😎😕😅\n🤔🤷😩|');

		await writePromise('\x1b[G');
		await assertPromptInput('✌️👍\n😎😕😅\n|🤔🤷😩');

		await writePromise('\x1b[A');
		await assertPromptInput('✌️👍\n|😎😕😅\n🤔🤷😩');

		await writePromise('\x1b[2C');
		await assertPromptInput('✌️👍\n😎😕|😅\n🤔🤷😩');

		await writePromise('\x1b[1;4H');
		await assertPromptInput('✌️|👍\n😎😕😅\n🤔🤷😩');

		await writePromise('\x1b[D');
		await assertPromptInput('|✌️👍\n😎😕😅\n🤔🤷😩');
	});

	suite('trailing whitespace', () => {
		test('cursor index calculation with whitespace', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise('echo   ');
			await assertPromptInput('echo   |');

			await writePromise('\x1b[3D');
			await assertPromptInput('echo|   ');

			await writePromise('\x1b[C');
			await assertPromptInput('echo |  ');

			await writePromise('\x1b[C');
			await assertPromptInput('echo  | ');

			await writePromise('\x1b[C');
			await assertPromptInput('echo   |');
		});

		test('cursor index should not exceed command line length', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise('cmd');
			await assertPromptInput('cmd|');

			await writePromise('\x1b[10C');
			await assertPromptInput('cmd|');
		});

		test('whitespace preservation in cursor calculation', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise('ls   -la');
			await assertPromptInput('ls   -la|');

			await writePromise('\x1b[3D');
			await assertPromptInput('ls   |-la');

			await writePromise('\x1b[3D');
			await assertPromptInput('ls|   -la');

			await writePromise('\x1b[2C');
			await assertPromptInput('ls  | -la');
		});

		test('delete whitespace with backspace', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise(' ');
			await assertPromptInput(` |`);

			xterm.input('\x7F', true); // Backspace
			await writePromise('\x1b[D');
			await assertPromptInput('|');

			xterm.input(' '.repeat(4), true);
			await writePromise(' '.repeat(4));
			await assertPromptInput(`    |`);

			xterm.input('\x1b[D'.repeat(2), true); // Left
			await writePromise('\x1b[2D');
			await assertPromptInput(`  |  `);

			xterm.input('\x7F', true); // Backspace
			await writePromise('\x1b[D');
			await assertPromptInput(` |  `);

			xterm.input('\x7F', true); // Backspace
			await writePromise('\x1b[D');
			await assertPromptInput(`|  `);

			xterm.input(' ', true);
			await writePromise(' ');
			await assertPromptInput(` |  `);

			xterm.input(' ', true);
			await writePromise(' ');
			await assertPromptInput(`  |  `);

			xterm.input('\x1b[C', true); // Right
			await writePromise('\x1b[C');
			await assertPromptInput(`   | `);

			xterm.input('a', true);
			await writePromise('a');
			await assertPromptInput(`   a| `);

			xterm.input('\x7F', true); // Backspace
			await writePromise('\x1b[D\x1b[K');
			await assertPromptInput(`   | `);

			xterm.input('\x1b[D'.repeat(2), true); // Left
			await writePromise('\x1b[2D');
			await assertPromptInput(` |   `);

			xterm.input('\x1b[3~', true); // Delete
			await writePromise('');
			await assertPromptInput(` |  `);
		});

		// TODO: This doesn't work correctly but it doesn't matter too much as it only happens when
		// there is a lot of whitespace at the end of a prompt input
		test.skip('track whitespace when ConPTY deletes whitespace unexpectedly', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			xterm.input('ls', true);
			await writePromise('ls');
			await assertPromptInput(`ls|`);

			xterm.input(' '.repeat(4), true);
			await writePromise(' '.repeat(4));
			await assertPromptInput(`ls    |`);

			xterm.input(' ', true);
			await writePromise('\x1b[4D\x1b[5X\x1b[5C'); // Cursor left x(N-1), delete xN, cursor right xN
			await assertPromptInput(`ls     |`);
		});

		test('track whitespace beyond cursor', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise(' '.repeat(8));
			await assertPromptInput(`${' '.repeat(8)}|`);

			await writePromise('\x1b[4D');
			await assertPromptInput(`${' '.repeat(4)}|${' '.repeat(4)}`);
		});
	});

	suite('multi-line', () => {
		test('basic 2 line', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise('echo "a');
			await assertPromptInput(`echo "a|`);

			await writePromise('\n\r\∙ ');
			setContinuationPrompt('∙ ');
			await assertPromptInput(`echo "a\n|`);

			await writePromise('b');
			await assertPromptInput(`echo "a\nb|`);
		});

		test('basic 3 line', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise('echo "a');
			await assertPromptInput(`echo "a|`);

			await writePromise('\n\r\∙ ');
			setContinuationPrompt('∙ ');
			await assertPromptInput(`echo "a\n|`);

			await writePromise('b');
			await assertPromptInput(`echo "a\nb|`);

			await writePromise('\n\r\∙ ');
			setContinuationPrompt('∙ ');
			await assertPromptInput(`echo "a\nb\n|`);

			await writePromise('c');
			await assertPromptInput(`echo "a\nb\nc|`);
		});

		test('navigate left in multi-line', async () => {
			return runWithFakedTimers({}, async () => {
				await writePromise('$ ');
				fireCommandStart();
				await assertPromptInput('|');

				await writePromise('echo "a');
				await assertPromptInput(`echo "a|`);

				await writePromise('\n\r\∙ ');
				setContinuationPrompt('∙ ');
				await assertPromptInput(`echo "a\n|`);

				await writePromise('b');
				await assertPromptInput(`echo "a\nb|`);

				await writePromise('\x1b[D');
				await assertPromptInput(`echo "a\n|b`);

				await writePromise('\x1b[@c');
				await assertPromptInput(`echo "a\nc|b`);

				await writePromise('\x1b[K\n\r\∙ ');
				await assertPromptInput(`echo "a\nc\n|`);

				await writePromise('b');
				await assertPromptInput(`echo "a\nc\nb|`);

				await writePromise(' foo');
				await assertPromptInput(`echo "a\nc\nb foo|`);

				await writePromise('\x1b[3D');
				await assertPromptInput(`echo "a\nc\nb |foo`);
			});
		});

		test('navigate up in multi-line', async () => {
			return runWithFakedTimers({}, async () => {
				await writePromise('$ ');
				fireCommandStart();
				await assertPromptInput('|');

				await writePromise('echo "foo');
				await assertPromptInput(`echo "foo|`);

				await writePromise('\n\r\∙ ');
				setContinuationPrompt('∙ ');
				await assertPromptInput(`echo "foo\n|`);

				await writePromise('bar');
				await assertPromptInput(`echo "foo\nbar|`);

				await writePromise('\n\r\∙ ');
				setContinuationPrompt('∙ ');
				await assertPromptInput(`echo "foo\nbar\n|`);

				await writePromise('baz');
				await assertPromptInput(`echo "foo\nbar\nbaz|`);

				await writePromise('\x1b[A');
				await assertPromptInput(`echo "foo\nbar|\nbaz`);

				await writePromise('\x1b[D');
				await assertPromptInput(`echo "foo\nba|r\nbaz`);

				await writePromise('\x1b[D');
				await assertPromptInput(`echo "foo\nb|ar\nbaz`);

				await writePromise('\x1b[D');
				await assertPromptInput(`echo "foo\n|bar\nbaz`);

				await writePromise('\x1b[1;9H');
				await assertPromptInput(`echo "|foo\nbar\nbaz`);

				await writePromise('\x1b[C');
				await assertPromptInput(`echo "f|oo\nbar\nbaz`);

				await writePromise('\x1b[C');
				await assertPromptInput(`echo "fo|o\nbar\nbaz`);

				await writePromise('\x1b[C');
				await assertPromptInput(`echo "foo|\nbar\nbaz`);
			});
		});

		test('navigating up when first line contains invalid/stale trailing whitespace', async () => {
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise('echo "foo      \x1b[6D');
			await assertPromptInput(`echo "foo|`);

			await writePromise('\n\r\∙ ');
			setContinuationPrompt('∙ ');
			await assertPromptInput(`echo "foo\n|`);

			await writePromise('bar');
			await assertPromptInput(`echo "foo\nbar|`);

			await writePromise('\x1b[D');
			await assertPromptInput(`echo "foo\nba|r`);

			await writePromise('\x1b[D');
			await assertPromptInput(`echo "foo\nb|ar`);

			await writePromise('\x1b[D');
			await assertPromptInput(`echo "foo\n|bar`);
		});
	});

	suite('multi-line wrapped (no continuation prompt)', () => {
		test('basic wrapped line', async () => {
			return runWithFakedTimers({}, async () => {
				xterm.resize(5, 10);

				await writePromise('$ ');
				fireCommandStart();
				await assertPromptInput('|');

				await writePromise('ech');
				await assertPromptInput(`ech|`);

				await writePromise('o ');
				await assertPromptInput(`echo |`);

				await writePromise('"a"');
				// HACK: Trailing whitespace is due to flaky detection in wrapped lines (but it doesn't matter much)
				await assertPromptInput(`echo "a"| `);
				await writePromise('\n\r\ b');
				await assertPromptInput(`echo "a"\n b|`);
				await writePromise('\n\r\ c');
				await assertPromptInput(`echo "a"\n b\n c|`);
			});
		});
	});
	suite('multi-line wrapped (continuation prompt)', () => {
		test('basic wrapped line', async () => {
			xterm.resize(5, 10);
			promptInputModel.setContinuationPrompt('∙ ');
			await writePromise('$ ');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise('ech');
			await assertPromptInput(`ech|`);

			await writePromise('o ');
			await assertPromptInput(`echo |`);

			await writePromise('"a"');
			// HACK: Trailing whitespace is due to flaky detection in wrapped lines (but it doesn't matter much)
			await assertPromptInput(`echo "a"| `);
			await writePromise('\n\r\∙ ');
			await assertPromptInput(`echo "a"\n|`);
			await writePromise('b');
			await assertPromptInput(`echo "a"\nb|`);
			await writePromise('\n\r\∙ ');
			await assertPromptInput(`echo "a"\nb\n|`);
			await writePromise('c');
			await assertPromptInput(`echo "a"\nb\nc|`);
			await writePromise('\n\r\∙ ');
			await assertPromptInput(`echo "a"\nb\nc\n|`);
		});
	});
	suite('multi-line wrapped fish', () => {
		test('forward slash continuation', async () => {
			promptInputModel.setShellType(PosixShellType.Fish);
			await writePromise('$ ');
			await assertPromptInput('|');
			await writePromise('[I] meganrogge@Megans-MacBook-Pro ~ (main|BISECTING)>');
			fireCommandStart();

			await writePromise('ech\\');
			await assertPromptInput(`ech\\|`);
			await writePromise('\no bye');
			await assertPromptInput(`echo bye|`);
		});
		test('newline with no continuation', async () => {
			promptInputModel.setShellType(PosixShellType.Fish);
			await writePromise('$ ');
			await assertPromptInput('|');
			await writePromise('[I] meganrogge@Megans-MacBook-Pro ~ (main|BISECTING)>');
			fireCommandStart();
			await assertPromptInput('|');

			await writePromise('echo "hi');
			await assertPromptInput(`echo "hi|`);
			await writePromise('\nand bye\nwhy"');
			await assertPromptInput(`echo "hi\nand bye\nwhy"|`);
		});
	});

	// To "record a session" for these tests:
	// - Enable debug logging
	// - Open and clear Terminal output channel
	// - Open terminal and perform the test
	// - Extract all "parsing data" lines from the terminal
	suite('recorded sessions', () => {
		async function replayEvents(events: string[]) {
			for (const data of events) {
				await writePromise(data);
			}
		}

		suite('Windows 11 (10.0.22621.3447), pwsh 7.4.2, starship prompt 1.10.2', () => {
			test('input with ignored ghost text', async () => {
				return runWithFakedTimers({}, async () => {
					await replayEvents([
						'[?25l[2J[m[H]0;C:\\Program Files\\WindowsApps\\Microsoft.PowerShell_7.4.2.0_x64__8wekyb3d8bbwe\\pwsh.exe[?25h',
						'[?25l[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K[H[?25h',
						']633;P;IsWindows=True',
						']633;P;ContinuationPrompt=\x1b[38\x3b5\x3b8m∙\x1b[0m ',
						']633;A]633;P;Cwd=C:\x5cGithub\x5cmicrosoft\x5cvscode]633;B',
						'[34m\r\n[38;2;17;17;17m[44m03:13:47 [34m[41m [38;2;17;17;17mvscode [31m[43m [38;2;17;17;17m tyriar/prompt_input_model [33m[46m [38;2;17;17;17m$⇡ [36m[49m [mvia [32m[1m v18.18.2 \r\n❯[m ',
					]);
					fireCommandStart();
					await assertPromptInput('|');

					await replayEvents([
						'[?25l[93mf[97m[2m[3makecommand[3;4H[?25h',
						'[m',
						'[93mfo[9X',
						'[m',
						'[?25l[93m[3;3Hfoo[?25h',
						'[m',
					]);
					await assertPromptInput('foo|');
				});
			});
			test('input with accepted and run ghost text', async () => {
				return runWithFakedTimers({}, async () => {
					await replayEvents([
						'[?25l[2J[m[H]0;C:\\Program Files\\WindowsApps\\Microsoft.PowerShell_7.4.2.0_x64__8wekyb3d8bbwe\\pwsh.exe[?25h',
						'[?25l[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K[H[?25h',
						']633;P;IsWindows=True',
						']633;P;ContinuationPrompt=\x1b[38\x3b5\x3b8m∙\x1b[0m ',
						']633;A]633;P;Cwd=C:\x5cGithub\x5cmicrosoft\x5cvscode]633;B',
						'[34m\r\n[38;2;17;17;17m[44m03:41:36 [34m[41m [38;2;17;17;17mvscode [31m[43m [38;2;17;17;17m tyriar/prompt_input_model [33m[46m [38;2;17;17;17m$ [36m[49m [mvia [32m[1m v18.18.2 \r\n❯[m ',
					]);
					promptInputModel.setContinuationPrompt('∙ ');
					fireCommandStart();
					await assertPromptInput('|');

					await replayEvents([
						'[?25l[93me[97m[2m[3mcho "hello world"[3;4H[?25h',
						'[m',
					]);
					await assertPromptInput('e|[cho "hello world"]');

					await replayEvents([
						'[?25l[93mec[97m[2m[3mho "hello world"[3;5H[?25h',
						'[m',
					]);
					await assertPromptInput('ec|[ho "hello world"]');

					await replayEvents([
						'[?25l[93m[3;3Hech[97m[2m[3mo "hello world"[3;6H[?25h',
						'[m',
					]);
					await assertPromptInput('ech|[o "hello world"]');

					await replayEvents([
						'[?25l[93m[3;3Hecho[97m[2m[3m "hello world"[3;7H[?25h',
						'[m',
					]);
					await assertPromptInput('echo|[ "hello world"]');

					await replayEvents([
						'[?25l[93m[3;3Hecho [97m[2m[3m"hello world"[3;8H[?25h',
						'[m',
					]);
					await assertPromptInput('echo |["hello world"]');

					await replayEvents([
						'[?25l[93m[3;3Hecho [36m"hello world"[?25h',
						'[m',
					]);
					await assertPromptInput('echo "hello world"|');

					await replayEvents([
						']633;E;echo "hello world";ff464d39-bc80-4bae-9ead-b1cafc4adf6f]633;C',
					]);
					fireCommandExecuted();
					await assertPromptInput('echo "hello world"');

					await replayEvents([
						'\r\n',
						'hello world\r\n',
					]);
					await assertPromptInput('echo "hello world"');

					await replayEvents([
						']633;D;0]633;A]633;P;Cwd=C:\x5cGithub\x5cmicrosoft\x5cvscode]633;B',
						'[34m\r\n[38;2;17;17;17m[44m03:41:42 [34m[41m [38;2;17;17;17mvscode [31m[43m [38;2;17;17;17m tyriar/prompt_input_model [33m[46m [38;2;17;17;17m$ [36m[49m [mvia [32m[1m v18.18.2 \r\n❯[m ',
					]);
					fireCommandStart();
					await assertPromptInput('|');
				});
			});

			test('input, go to start (ctrl+home), delete word in front (ctrl+delete)', async () => {
				return runWithFakedTimers({}, async () => {
					await replayEvents([
						'[?25l[2J[m[H]0;C:\Program Files\WindowsApps\Microsoft.PowerShell_7.4.2.0_x64__8wekyb3d8bbwe\pwsh.exe[?25h',
						'[?25l[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K\r\n[K[H[?25h',
						']633;P;IsWindows=True',
						']633;P;ContinuationPrompt=\x1b[38\x3b5\x3b8m∙\x1b[0m ',
						']633;A]633;P;Cwd=C:\x5cGithub\x5cmicrosoft\x5cvscode]633;B',
						'[34m\r\n[38;2;17;17;17m[44m16:07:06 [34m[41m [38;2;17;17;17mvscode [31m[43m [38;2;17;17;17m tyriar/210662 [33m[46m [38;2;17;17;17m$! [36m[49m [mvia [32m[1m v18.18.2 \r\n❯[m ',
					]);
					fireCommandStart();
					await assertPromptInput('|');

					await replayEvents([
						'[?25l[93mG[97m[2m[3mit push[3;4H[?25h',
						'[m',
						'[?25l[93mGe[97m[2m[3mt-ChildItem -Path a[3;5H[?25h',
						'[m',
						'[?25l[93m[3;3HGet[97m[2m[3m-ChildItem -Path a[3;6H[?25h',
					]);
					await assertPromptInput('Get|[-ChildItem -Path a]');

					await replayEvents([
						'[m',
						'[?25l[3;3H[?25h',
						'[21X',
					]);

					// Don't force a sync, the prompt input model should update by itself
					await timeout(0);
					const actualValueWithCursor = promptInputModel.getCombinedString();
					strictEqual(
						actualValueWithCursor,
						'|'.replaceAll('\n', '\u23CE')
					);
				});
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/test/node/terminalEnvironment.test.ts]---
Location: vscode-main/src/vs/platform/terminal/test/node/terminalEnvironment.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable local/code-no-test-async-suite */
import { deepStrictEqual, ok, strictEqual } from 'assert';
import { homedir, userInfo } from 'os';
import { isWindows } from '../../../../base/common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { NullLogService } from '../../../log/common/log.js';
import { IProductService } from '../../../product/common/productService.js';
import { ITerminalProcessOptions } from '../../common/terminal.js';
import { getShellIntegrationInjection, getWindowsBuildNumber, IShellIntegrationConfigInjection, type IShellIntegrationInjectionFailure } from '../../node/terminalEnvironment.js';

const enabledProcessOptions: ITerminalProcessOptions = { shellIntegration: { enabled: true, suggestEnabled: false, nonce: '' }, windowsEnableConpty: true, windowsUseConptyDll: false, environmentVariableCollections: undefined, workspaceFolder: undefined, isScreenReaderOptimized: false };
const disabledProcessOptions: ITerminalProcessOptions = { shellIntegration: { enabled: false, suggestEnabled: false, nonce: '' }, windowsEnableConpty: true, windowsUseConptyDll: false, environmentVariableCollections: undefined, workspaceFolder: undefined, isScreenReaderOptimized: false };
const winptyProcessOptions: ITerminalProcessOptions = { shellIntegration: { enabled: true, suggestEnabled: false, nonce: '' }, windowsEnableConpty: false, windowsUseConptyDll: false, environmentVariableCollections: undefined, workspaceFolder: undefined, isScreenReaderOptimized: false };
const pwshExe = process.platform === 'win32' ? 'pwsh.exe' : 'pwsh';
const repoRoot = process.platform === 'win32' ? process.cwd()[0].toLowerCase() + process.cwd().substring(1) : process.cwd();
const logService = new NullLogService();
const productService = { applicationName: 'vscode' } as IProductService;
const defaultEnvironment = {};

function deepStrictEqualIgnoreStableVar(actual: IShellIntegrationConfigInjection | IShellIntegrationInjectionFailure | undefined, expected: IShellIntegrationConfigInjection) {
	if (actual?.type === 'injection' && actual.envMixin) {
		delete actual.envMixin['VSCODE_STABLE'];
	}
	deepStrictEqual(actual, expected);
}

suite('platform - terminalEnvironment', async () => {
	ensureNoDisposablesAreLeakedInTestSuite();
	suite('getShellIntegrationInjection', async () => {
		suite('should not enable', async () => {
			// This test is only expected to work on Windows 10 build 18309 and above
			(getWindowsBuildNumber() < 18309 ? test.skip : test)('when isFeatureTerminal or when no executable is provided', async () => {
				strictEqual((await getShellIntegrationInjection({ executable: pwshExe, args: ['-l', '-NoLogo'], isFeatureTerminal: true }, enabledProcessOptions, defaultEnvironment, logService, productService, true)).type, 'failure');
				strictEqual((await getShellIntegrationInjection({ executable: pwshExe, args: ['-l', '-NoLogo'], isFeatureTerminal: false }, enabledProcessOptions, defaultEnvironment, logService, productService, true)).type, 'injection');
			});
			if (isWindows) {
				test('when on windows with conpty false', async () => {
					strictEqual((await getShellIntegrationInjection({ executable: pwshExe, args: ['-l'], isFeatureTerminal: false }, winptyProcessOptions, defaultEnvironment, logService, productService, true)).type, 'failure');
				});
			}
		});

		// These tests are only expected to work on Windows 10 build 18309 and above
		(getWindowsBuildNumber() < 18309 ? suite.skip : suite)('pwsh', async () => {
			const expectedPs1 = process.platform === 'win32'
				? `try { . "${repoRoot}\\out\\vs\\workbench\\contrib\\terminal\\common\\scripts\\shellIntegration.ps1" } catch {}`
				: `. "${repoRoot}/out/vs/workbench/contrib/terminal/common/scripts/shellIntegration.ps1"`;
			suite('should override args', async () => {
				const enabledExpectedResult = Object.freeze<IShellIntegrationConfigInjection>({
					type: 'injection',
					newArgs: [
						'-noexit',
						'-command',
						expectedPs1
					],
					envMixin: {
						VSCODE_A11Y_MODE: '0',
						VSCODE_INJECTION: '1'
					}
				});
				test('when undefined, []', async () => {
					deepStrictEqualIgnoreStableVar(await getShellIntegrationInjection({ executable: pwshExe, args: [] }, enabledProcessOptions, defaultEnvironment, logService, productService, true), enabledExpectedResult);
					deepStrictEqualIgnoreStableVar(await getShellIntegrationInjection({ executable: pwshExe, args: undefined }, enabledProcessOptions, defaultEnvironment, logService, productService, true), enabledExpectedResult);
				});
				suite('when no logo', async () => {
					test('array - case insensitive', async () => {
						deepStrictEqualIgnoreStableVar(await getShellIntegrationInjection({ executable: pwshExe, args: ['-NoLogo'] }, enabledProcessOptions, defaultEnvironment, logService, productService, true), enabledExpectedResult);
						deepStrictEqualIgnoreStableVar(await getShellIntegrationInjection({ executable: pwshExe, args: ['-NOLOGO'] }, enabledProcessOptions, defaultEnvironment, logService, productService, true), enabledExpectedResult);
						deepStrictEqualIgnoreStableVar(await getShellIntegrationInjection({ executable: pwshExe, args: ['-nol'] }, enabledProcessOptions, defaultEnvironment, logService, productService, true), enabledExpectedResult);
						deepStrictEqualIgnoreStableVar(await getShellIntegrationInjection({ executable: pwshExe, args: ['-NOL'] }, enabledProcessOptions, defaultEnvironment, logService, productService, true), enabledExpectedResult);
					});
					test('string - case insensitive', async () => {
						deepStrictEqualIgnoreStableVar(await getShellIntegrationInjection({ executable: pwshExe, args: '-NoLogo' }, enabledProcessOptions, defaultEnvironment, logService, productService, true), enabledExpectedResult);
						deepStrictEqualIgnoreStableVar(await getShellIntegrationInjection({ executable: pwshExe, args: '-NOLOGO' }, enabledProcessOptions, defaultEnvironment, logService, productService, true), enabledExpectedResult);
						deepStrictEqualIgnoreStableVar(await getShellIntegrationInjection({ executable: pwshExe, args: '-nol' }, enabledProcessOptions, defaultEnvironment, logService, productService, true), enabledExpectedResult);
						deepStrictEqualIgnoreStableVar(await getShellIntegrationInjection({ executable: pwshExe, args: '-NOL' }, enabledProcessOptions, defaultEnvironment, logService, productService, true), enabledExpectedResult);
					});
				});
			});
			suite('should incorporate login arg', async () => {
				const enabledExpectedResult = Object.freeze<IShellIntegrationConfigInjection>({
					type: 'injection',
					newArgs: [
						'-l',
						'-noexit',
						'-command',
						expectedPs1
					],
					envMixin: {
						VSCODE_A11Y_MODE: '0',
						VSCODE_INJECTION: '1'
					}
				});
				test('when array contains no logo and login', async () => {
					deepStrictEqualIgnoreStableVar(await getShellIntegrationInjection({ executable: pwshExe, args: ['-l', '-NoLogo'] }, enabledProcessOptions, defaultEnvironment, logService, productService, true), enabledExpectedResult);
				});
				test('when string', async () => {
					deepStrictEqualIgnoreStableVar(await getShellIntegrationInjection({ executable: pwshExe, args: '-l' }, enabledProcessOptions, defaultEnvironment, logService, productService, true), enabledExpectedResult);
				});
			});
			suite('should not modify args', async () => {
				test('when shell integration is disabled', async () => {
					strictEqual((await getShellIntegrationInjection({ executable: pwshExe, args: ['-l'] }, disabledProcessOptions, defaultEnvironment, logService, productService, true)).type, 'failure');
					strictEqual((await getShellIntegrationInjection({ executable: pwshExe, args: '-l' }, disabledProcessOptions, defaultEnvironment, logService, productService, true)).type, 'failure');
					strictEqual((await getShellIntegrationInjection({ executable: pwshExe, args: undefined }, disabledProcessOptions, defaultEnvironment, logService, productService, true)).type, 'failure');
				});
				test('when using unrecognized arg', async () => {
					strictEqual((await getShellIntegrationInjection({ executable: pwshExe, args: ['-l', '-NoLogo', '-i'] }, disabledProcessOptions, defaultEnvironment, logService, productService, true)).type, 'failure');
				});
				test('when using unrecognized arg (string)', async () => {
					strictEqual((await getShellIntegrationInjection({ executable: pwshExe, args: '-i' }, disabledProcessOptions, defaultEnvironment, logService, productService, true)).type, 'failure');
				});
			});
		});

		if (process.platform !== 'win32') {
			suite('zsh', async () => {
				suite('should override args', async () => {
					const username = userInfo().username;
					const expectedDir = new RegExp(`.+\/${username}-vscode-zsh`);
					const customZdotdir = '/custom/zsh/dotdir';
					const expectedDests = [
						new RegExp(`.+\\/${username}-vscode-zsh\\/\\.zshrc`),
						new RegExp(`.+\\/${username}-vscode-zsh\\/\\.zprofile`),
						new RegExp(`.+\\/${username}-vscode-zsh\\/\\.zshenv`),
						new RegExp(`.+\\/${username}-vscode-zsh\\/\\.zlogin`)
					];
					const expectedSources = [
						/.+\/out\/vs\/workbench\/contrib\/terminal\/common\/scripts\/shellIntegration-rc.zsh/,
						/.+\/out\/vs\/workbench\/contrib\/terminal\/common\/scripts\/shellIntegration-profile.zsh/,
						/.+\/out\/vs\/workbench\/contrib\/terminal\/common\/scripts\/shellIntegration-env.zsh/,
						/.+\/out\/vs\/workbench\/contrib\/terminal\/common\/scripts\/shellIntegration-login.zsh/
					];
					function assertIsEnabled(result: IShellIntegrationConfigInjection, globalZdotdir = homedir()) {
						strictEqual(Object.keys(result.envMixin!).length, 3);
						ok(result.envMixin!['ZDOTDIR']?.match(expectedDir));
						strictEqual(result.envMixin!['USER_ZDOTDIR'], globalZdotdir);
						ok(result.envMixin!['VSCODE_INJECTION']?.match('1'));
						strictEqual(result.filesToCopy?.length, 4);
						ok(result.filesToCopy[0].dest.match(expectedDests[0]));
						ok(result.filesToCopy[1].dest.match(expectedDests[1]));
						ok(result.filesToCopy[2].dest.match(expectedDests[2]));
						ok(result.filesToCopy[3].dest.match(expectedDests[3]));
						ok(result.filesToCopy[0].source.match(expectedSources[0]));
						ok(result.filesToCopy[1].source.match(expectedSources[1]));
						ok(result.filesToCopy[2].source.match(expectedSources[2]));
						ok(result.filesToCopy[3].source.match(expectedSources[3]));
					}
					test('when undefined, []', async () => {
						const result1 = await getShellIntegrationInjection({ executable: 'zsh', args: [] }, enabledProcessOptions, defaultEnvironment, logService, productService, true) as IShellIntegrationConfigInjection;
						deepStrictEqual(result1?.newArgs, ['-i']);
						assertIsEnabled(result1);
						const result2 = await getShellIntegrationInjection({ executable: 'zsh', args: undefined }, enabledProcessOptions, defaultEnvironment, logService, productService, true) as IShellIntegrationConfigInjection;
						deepStrictEqual(result2?.newArgs, ['-i']);
						assertIsEnabled(result2);
					});
					suite('should incorporate login arg', async () => {
						test('when array', async () => {
							const result = await getShellIntegrationInjection({ executable: 'zsh', args: ['-l'] }, enabledProcessOptions, defaultEnvironment, logService, productService, true) as IShellIntegrationConfigInjection;
							deepStrictEqual(result?.newArgs, ['-il']);
							assertIsEnabled(result);
						});
					});
					suite('should not modify args', async () => {
						test('when shell integration is disabled', async () => {
							strictEqual((await getShellIntegrationInjection({ executable: 'zsh', args: ['-l'] }, disabledProcessOptions, defaultEnvironment, logService, productService, true)).type, 'failure');
							strictEqual((await getShellIntegrationInjection({ executable: 'zsh', args: undefined }, disabledProcessOptions, defaultEnvironment, logService, productService, true)).type, 'failure');
						});
						test('when using unrecognized arg', async () => {
							strictEqual((await getShellIntegrationInjection({ executable: 'zsh', args: ['-l', '-fake'] }, disabledProcessOptions, defaultEnvironment, logService, productService, true)).type, 'failure');
						});
					});
					suite('should incorporate global ZDOTDIR env variable', async () => {
						test('when custom ZDOTDIR', async () => {
							const result1 = await getShellIntegrationInjection({ executable: 'zsh', args: [] }, enabledProcessOptions, { ...defaultEnvironment, ZDOTDIR: customZdotdir }, logService, productService, true) as IShellIntegrationConfigInjection;
							deepStrictEqual(result1?.newArgs, ['-i']);
							assertIsEnabled(result1, customZdotdir);
						});
						test('when undefined', async () => {
							const result1 = await getShellIntegrationInjection({ executable: 'zsh', args: [] }, enabledProcessOptions, undefined, logService, productService, true) as IShellIntegrationConfigInjection;
							deepStrictEqual(result1?.newArgs, ['-i']);
							assertIsEnabled(result1);
						});
					});
				});
			});
			suite('bash', async () => {
				suite('should override args', async () => {
					test('when undefined, [], empty string', async () => {
						const enabledExpectedResult = Object.freeze<IShellIntegrationConfigInjection>({
							type: 'injection',
							newArgs: [
								'--init-file',
								`${repoRoot}/out/vs/workbench/contrib/terminal/common/scripts/shellIntegration-bash.sh`
							],
							envMixin: {
								VSCODE_INJECTION: '1'
							}
						});
						deepStrictEqualIgnoreStableVar(await getShellIntegrationInjection({ executable: 'bash', args: [] }, enabledProcessOptions, defaultEnvironment, logService, productService, true), enabledExpectedResult);
						deepStrictEqualIgnoreStableVar(await getShellIntegrationInjection({ executable: 'bash', args: '' }, enabledProcessOptions, defaultEnvironment, logService, productService, true), enabledExpectedResult);
						deepStrictEqualIgnoreStableVar(await getShellIntegrationInjection({ executable: 'bash', args: undefined }, enabledProcessOptions, defaultEnvironment, logService, productService, true), enabledExpectedResult);
					});
					suite('should set login env variable and not modify args', async () => {
						const enabledExpectedResult = Object.freeze<IShellIntegrationConfigInjection>({
							type: 'injection',
							newArgs: [
								'--init-file',
								`${repoRoot}/out/vs/workbench/contrib/terminal/common/scripts/shellIntegration-bash.sh`
							],
							envMixin: {
								VSCODE_INJECTION: '1',
								VSCODE_SHELL_LOGIN: '1'
							}
						});
						test('when array', async () => {
							deepStrictEqualIgnoreStableVar(await getShellIntegrationInjection({ executable: 'bash', args: ['-l'] }, enabledProcessOptions, defaultEnvironment, logService, productService, true), enabledExpectedResult);
						});
					});
					suite('should not modify args', async () => {
						test('when shell integration is disabled', async () => {
							strictEqual((await getShellIntegrationInjection({ executable: 'bash', args: ['-l'] }, disabledProcessOptions, defaultEnvironment, logService, productService, true)).type, 'failure');
							strictEqual((await getShellIntegrationInjection({ executable: 'bash', args: undefined }, disabledProcessOptions, defaultEnvironment, logService, productService, true)).type, 'failure');
						});
						test('when custom array entry', async () => {
							strictEqual((await getShellIntegrationInjection({ executable: 'bash', args: ['-l', '-i'] }, disabledProcessOptions, defaultEnvironment, logService, productService, true)).type, 'failure');
						});
					});
				});
			});
		}

		suite('custom shell integration nonce', async () => {
			test('should fail for unsupported shell but nonce should still be available', async () => {
				const customProcessOptions: ITerminalProcessOptions = {
					shellIntegration: { enabled: true, suggestEnabled: false, nonce: 'custom-nonce-12345' },
					windowsEnableConpty: true,
					windowsUseConptyDll: false,
					environmentVariableCollections: undefined,
					workspaceFolder: undefined,
					isScreenReaderOptimized: false
				};

				// Test with an unsupported shell (julia)
				const result = await getShellIntegrationInjection(
					{ executable: 'julia', args: ['-i'] },
					customProcessOptions,
					defaultEnvironment,
					logService,
					productService,
					true
				);

				// Should fail due to unsupported shell
				strictEqual(result.type, 'failure');

				// But the nonce should be available in the process options for the terminal process to use
				strictEqual(customProcessOptions.shellIntegration.nonce, 'custom-nonce-12345');
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/test/electron-main/workbenchTestServices.ts]---
Location: vscode-main/src/vs/platform/test/electron-main/workbenchTestServices.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Promises } from '../../../base/common/async.js';
import { Event, Emitter } from '../../../base/common/event.js';
import { IAuxiliaryWindow } from '../../auxiliaryWindow/electron-main/auxiliaryWindow.js';
import { NativeParsedArgs } from '../../environment/common/argv.js';
import { ILifecycleMainService, IRelaunchHandler, LifecycleMainPhase, ShutdownEvent, ShutdownReason } from '../../lifecycle/electron-main/lifecycleMainService.js';
import { IStateService } from '../../state/node/state.js';
import { ICodeWindow, UnloadReason } from '../../window/electron-main/window.js';

export class TestLifecycleMainService implements ILifecycleMainService {

	_serviceBrand: undefined;

	onBeforeShutdown = Event.None;

	private readonly _onWillShutdown = new Emitter<ShutdownEvent>();
	readonly onWillShutdown = this._onWillShutdown.event;

	async fireOnWillShutdown(): Promise<void> {
		const joiners: Promise<void>[] = [];

		this._onWillShutdown.fire({
			reason: ShutdownReason.QUIT,
			join(id, promise) {
				joiners.push(promise);
			}
		});

		await Promises.settled(joiners);
	}

	onWillLoadWindow = Event.None;
	onBeforeCloseWindow = Event.None;

	wasRestarted = false;
	quitRequested = false;

	phase = LifecycleMainPhase.Ready;

	registerWindow(window: ICodeWindow): void { }
	registerAuxWindow(auxWindow: IAuxiliaryWindow): void { }
	async reload(window: ICodeWindow, cli?: NativeParsedArgs): Promise<void> { }
	async unload(window: ICodeWindow, reason: UnloadReason): Promise<boolean> { return true; }
	setRelaunchHandler(handler: IRelaunchHandler): void { }
	async relaunch(options?: { addArgs?: string[] | undefined; removeArgs?: string[] | undefined }): Promise<void> { }
	async quit(willRestart?: boolean): Promise<boolean> { return true; }
	async kill(code?: number): Promise<void> { }
	async when(phase: LifecycleMainPhase): Promise<void> { }
}

export class InMemoryTestStateMainService implements IStateService {

	_serviceBrand: undefined;

	private readonly data = new Map<string, object | string | number | boolean | undefined | null>();

	setItem(key: string, data?: object | string | number | boolean | undefined | null): void {
		this.data.set(key, data);
	}

	setItems(items: readonly { key: string; data?: object | string | number | boolean | undefined | null }[]): void {
		for (const { key, data } of items) {
			this.data.set(key, data);
		}
	}

	getItem<T>(key: string): T | undefined {
		return this.data.get(key) as T | undefined;
	}

	removeItem(key: string): void {
		this.data.delete(key);
	}

	async close(): Promise<void> { }
}
```

--------------------------------------------------------------------------------

````
