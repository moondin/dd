---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 460
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 460 of 552)

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

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalProcessManager.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalProcessManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, dispose, IDisposable, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { IProcessEnvironment, isMacintosh, isWindows, OperatingSystem, OS } from '../../../../base/common/platform.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { formatMessageForTerminal } from '../../../../platform/terminal/common/terminalStrings.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { getRemoteAuthority } from '../../../../platform/remote/common/remoteHosts.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { ISerializedCommandDetectionCapability, TerminalCapability } from '../../../../platform/terminal/common/capabilities/capabilities.js';
import { NaiveCwdDetectionCapability } from '../../../../platform/terminal/common/capabilities/naiveCwdDetectionCapability.js';
import { TerminalCapabilityStore } from '../../../../platform/terminal/common/capabilities/terminalCapabilityStore.js';
import { FlowControlConstants, ITerminalLaunchResult, IProcessDataEvent, IProcessProperty, IProcessPropertyMap, IProcessReadyEvent, IReconnectionProperties, IShellLaunchConfig, ITerminalBackend, ITerminalChildProcess, ITerminalDimensions, ITerminalEnvironment, ITerminalLaunchError, ITerminalLogService, ITerminalProcessOptions, ProcessPropertyType, TerminalSettingId } from '../../../../platform/terminal/common/terminal.js';
import { TerminalRecorder } from '../../../../platform/terminal/common/terminalRecorder.js';
import { IWorkspaceContextService, IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { EnvironmentVariableInfoChangesActive, EnvironmentVariableInfoStale } from './environmentVariableInfo.js';
import { ITerminalConfigurationService, ITerminalInstanceService, ITerminalService } from './terminal.js';
import { IEnvironmentVariableInfo, IEnvironmentVariableService } from '../common/environmentVariable.js';
import { MergedEnvironmentVariableCollection } from '../../../../platform/terminal/common/environmentVariableCollection.js';
import { serializeEnvironmentVariableCollections } from '../../../../platform/terminal/common/environmentVariableShared.js';
import { IBeforeProcessDataEvent, ITerminalProcessManager, ITerminalProfileResolverService, ProcessState } from '../common/terminal.js';
import * as terminalEnvironment from '../common/terminalEnvironment.js';
import { IConfigurationResolverService } from '../../../services/configurationResolver/common/configurationResolver.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IHistoryService } from '../../../services/history/common/history.js';
import { IPathService } from '../../../services/path/common/pathService.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';
import { TaskSettingId } from '../../tasks/common/tasks.js';
import Severity from '../../../../base/common/severity.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IEnvironmentVariableCollection, IMergedEnvironmentVariableCollection } from '../../../../platform/terminal/common/environmentVariable.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { getActiveWindow, runWhenWindowIdle } from '../../../../base/browser/dom.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { shouldUseEnvironmentVariableCollection } from '../../../../platform/terminal/common/terminalEnvironment.js';
import { TerminalContribSettingId } from '../terminalContribExports.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { BugIndicatingError } from '../../../../base/common/errors.js';
import type { MaybePromise } from '../../../../base/common/async.js';
import { isString } from '../../../../base/common/types.js';

const enum ProcessConstants {
	/**
	 * The amount of time to consider terminal errors to be related to the launch.
	 */
	ErrorLaunchThresholdDuration = 500,
	/**
	 * The minimum amount of time between latency requests.
	 */
	LatencyMeasuringInterval = 1000,
}

const enum ProcessType {
	Process,
	PsuedoTerminal
}

/**
 * Holds all state related to the creation and management of terminal processes.
 *
 * Internal definitions:
 * - Process: The process launched with the terminalProcess.ts file, or the pty as a whole
 * - Pty Process: The pseudoterminal parent process (or the conpty/winpty agent process)
 * - Shell Process: The pseudoterminal child process (ie. the shell)
 */
export class TerminalProcessManager extends Disposable implements ITerminalProcessManager {
	processState: ProcessState = ProcessState.Uninitialized;
	ptyProcessReady: Promise<void>;
	shellProcessId: number | undefined;
	readonly remoteAuthority: string | undefined;
	os: OperatingSystem | undefined;
	userHome: string | undefined;
	environmentVariableInfo: IEnvironmentVariableInfo | undefined;
	backend: ITerminalBackend | undefined;
	readonly capabilities = this._register(new TerminalCapabilityStore());
	readonly shellIntegrationNonce: string;
	processReadyTimestamp: number = 0;

	private _isDisposed: boolean = false;
	private _process: ITerminalChildProcess | null = null;
	private _processType: ProcessType = ProcessType.Process;
	private _preLaunchInputQueue: string[] = [];
	private _initialCwd: string | undefined;
	private _extEnvironmentVariableCollection: IMergedEnvironmentVariableCollection | undefined;
	private _ackDataBufferer: AckDataBufferer;
	private _hasWrittenData: boolean = false;
	private _hasChildProcesses: boolean = false;
	private _ptyResponsiveListener: IDisposable | undefined;
	private _ptyListenersAttached: boolean = false;
	private _dataFilter: SeamlessRelaunchDataFilter;
	private _processListeners?: IDisposable[];
	private _isDisconnected: boolean = false;

	private _processTraits: IProcessReadyEvent | undefined;
	private _shellLaunchConfig?: IShellLaunchConfig;
	private _dimensions: ITerminalDimensions = { cols: 0, rows: 0 };

	private readonly _onPtyDisconnect = this._register(new Emitter<void>());
	readonly onPtyDisconnect = this._onPtyDisconnect.event;
	private readonly _onPtyReconnect = this._register(new Emitter<void>());
	readonly onPtyReconnect = this._onPtyReconnect.event;

	private readonly _onProcessReady = this._register(new Emitter<IProcessReadyEvent>());
	readonly onProcessReady = this._onProcessReady.event;
	private readonly _onProcessStateChange = this._register(new Emitter<void>());
	readonly onProcessStateChange = this._onProcessStateChange.event;
	private readonly _onBeforeProcessData = this._register(new Emitter<IBeforeProcessDataEvent>());
	readonly onBeforeProcessData = this._onBeforeProcessData.event;
	private readonly _onProcessData = this._register(new Emitter<IProcessDataEvent>());
	readonly onProcessData = this._onProcessData.event;
	private readonly _onProcessReplayComplete = this._register(new Emitter<void>());
	readonly onProcessReplayComplete = this._onProcessReplayComplete.event;
	private readonly _onDidChangeProperty = this._register(new Emitter<IProcessProperty>());
	readonly onDidChangeProperty = this._onDidChangeProperty.event;
	private readonly _onEnvironmentVariableInfoChange = this._register(new Emitter<IEnvironmentVariableInfo>());
	readonly onEnvironmentVariableInfoChanged = this._onEnvironmentVariableInfoChange.event;
	private readonly _onProcessExit = this._register(new Emitter<number | undefined>());
	readonly onProcessExit = this._onProcessExit.event;
	private readonly _onRestoreCommands = this._register(new Emitter<ISerializedCommandDetectionCapability>());
	readonly onRestoreCommands = this._onRestoreCommands.event;
	private _cwdWorkspaceFolder: IWorkspaceFolder | undefined;

	get persistentProcessId(): number | undefined { return this._process?.id; }
	get shouldPersist(): boolean { return !!this.reconnectionProperties || (this._process ? this._process.shouldPersist : false); }
	get hasWrittenData(): boolean { return this._hasWrittenData; }
	get hasChildProcesses(): boolean { return this._hasChildProcesses; }
	get reconnectionProperties(): IReconnectionProperties | undefined { return this._shellLaunchConfig?.attachPersistentProcess?.reconnectionProperties || this._shellLaunchConfig?.reconnectionProperties || undefined; }
	get extEnvironmentVariableCollection(): IMergedEnvironmentVariableCollection | undefined { return this._extEnvironmentVariableCollection; }
	get processTraits(): IProcessReadyEvent | undefined { return this._processTraits; }

	constructor(
		private readonly _instanceId: number,
		cwd: string | URI | undefined,
		environmentVariableCollections: ReadonlyMap<string, IEnvironmentVariableCollection> | undefined,
		shellIntegrationNonce: string | undefined,
		@IHistoryService private readonly _historyService: IHistoryService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ITerminalLogService private readonly _logService: ITerminalLogService,
		@IWorkspaceContextService private readonly _workspaceContextService: IWorkspaceContextService,
		@IConfigurationResolverService private readonly _configurationResolverService: IConfigurationResolverService,
		@IWorkbenchEnvironmentService private readonly _workbenchEnvironmentService: IWorkbenchEnvironmentService,
		@IProductService private readonly _productService: IProductService,
		@IRemoteAgentService private readonly _remoteAgentService: IRemoteAgentService,
		@IPathService private readonly _pathService: IPathService,
		@IEnvironmentVariableService private readonly _environmentVariableService: IEnvironmentVariableService,
		@ITerminalConfigurationService private readonly _terminalConfigurationService: ITerminalConfigurationService,
		@ITerminalProfileResolverService private readonly _terminalProfileResolverService: ITerminalProfileResolverService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ITerminalInstanceService private readonly _terminalInstanceService: ITerminalInstanceService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@INotificationService private readonly _notificationService: INotificationService,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService,
		@ITerminalService private readonly _terminalService: ITerminalService
	) {
		super();
		this._cwdWorkspaceFolder = terminalEnvironment.getWorkspaceForTerminal(cwd, this._workspaceContextService, this._historyService);
		this.ptyProcessReady = this._createPtyProcessReadyPromise();
		this._ackDataBufferer = new AckDataBufferer(e => this._process?.acknowledgeDataEvent(e));
		this._dataFilter = this._register(this._instantiationService.createInstance(SeamlessRelaunchDataFilter));
		this._register(this._dataFilter.onProcessData(ev => {
			const data = (isString(ev) ? ev : ev.data);
			const beforeProcessDataEvent: IBeforeProcessDataEvent = { data };
			this._onBeforeProcessData.fire(beforeProcessDataEvent);
			if (beforeProcessDataEvent.data && beforeProcessDataEvent.data.length > 0) {
				// This event is used by the caller so the object must be reused
				if (!isString(ev)) {
					ev.data = beforeProcessDataEvent.data;
				}
				this._onProcessData.fire(!isString(ev) ? ev : { data: beforeProcessDataEvent.data, trackCommit: false });
			}
		}));

		if (cwd && typeof cwd === 'object') {
			this.remoteAuthority = getRemoteAuthority(cwd);
		} else {
			this.remoteAuthority = this._workbenchEnvironmentService.remoteAuthority;
		}

		if (environmentVariableCollections) {
			this._extEnvironmentVariableCollection = new MergedEnvironmentVariableCollection(environmentVariableCollections);
			this._register(this._environmentVariableService.onDidChangeCollections(newCollection => this._onEnvironmentVariableCollectionChange(newCollection)));
			this.environmentVariableInfo = this._instantiationService.createInstance(EnvironmentVariableInfoChangesActive, this._extEnvironmentVariableCollection);
			this._onEnvironmentVariableInfoChange.fire(this.environmentVariableInfo);
		}

		this.shellIntegrationNonce = shellIntegrationNonce ?? generateUuid();
	}

	async freePortKillProcess(port: string): Promise<void> {
		try {
			if (this._process?.freePortKillProcess) {
				await this._process?.freePortKillProcess(port);
			}
		} catch (e) {
			this._notificationService.notify({ message: localize('killportfailure', 'Could not kill process listening on port {0}, command exited with error {1}', port, e), severity: Severity.Warning });
		}
	}

	override dispose(immediate: boolean = false): void {
		this._isDisposed = true;
		if (this._process) {
			// If the process was still connected this dispose came from
			// within VS Code, not the process, so mark the process as
			// killed by the user.
			this._setProcessState(ProcessState.KilledByUser);
			this._process.shutdown(immediate);
			this._process = null;
		}
		if (this._processListeners) {
			dispose(this._processListeners);
			this._processListeners = undefined;
		}
		super.dispose();
	}

	private _createPtyProcessReadyPromise(): Promise<void> {

		return new Promise<void>(c => {
			const listener = Event.once(this.onProcessReady)(() => {
				this._logService.debug(`Terminal process ready (shellProcessId: ${this.shellProcessId})`);
				this._store.delete(listener);
				c(undefined);
			});
			this._store.add(listener);
		});
	}

	async detachFromProcess(forcePersist?: boolean): Promise<void> {
		await this._process?.detach?.(forcePersist);
		this._process = null;
	}

	async createProcess(
		shellLaunchConfig: IShellLaunchConfig,
		cols: number,
		rows: number,
		reset: boolean = true
	): Promise<ITerminalLaunchError | ITerminalLaunchResult | undefined> {
		this._shellLaunchConfig = shellLaunchConfig;
		this._dimensions.cols = cols;
		this._dimensions.rows = rows;

		let newProcess: ITerminalChildProcess | undefined;

		if (shellLaunchConfig.customPtyImplementation) {
			this._processType = ProcessType.PsuedoTerminal;
			newProcess = shellLaunchConfig.customPtyImplementation(this._instanceId, cols, rows);
		} else {
			const backend = await this._terminalInstanceService.getBackend(this.remoteAuthority);
			if (!backend) {
				throw new Error(`No terminal backend registered for remote authority '${this.remoteAuthority}'`);
			}
			this.backend = backend;

			// Create variable resolver
			const variableResolver = terminalEnvironment.createVariableResolver(this._cwdWorkspaceFolder, await this._terminalProfileResolverService.getEnvironment(this.remoteAuthority), this._configurationResolverService);

			// resolvedUserHome is needed here as remote resolvers can launch local terminals before
			// they're connected to the remote.
			this.userHome = this._pathService.resolvedUserHome?.fsPath;
			this.os = OS;
			if (!!this.remoteAuthority) {

				const userHomeUri = await this._pathService.userHome();
				this.userHome = userHomeUri.path;
				const remoteEnv = await this._remoteAgentService.getEnvironment();
				if (!remoteEnv) {
					throw new Error(`Failed to get remote environment for remote authority "${this.remoteAuthority}"`);
				}
				this.userHome = remoteEnv.userHome.path;
				this.os = remoteEnv.os;

				// this is a copy of what the merged environment collection is on the remote side
				const env = await this._resolveEnvironment(backend, variableResolver, shellLaunchConfig);
				const shouldPersist = ((this._configurationService.getValue(TaskSettingId.Reconnection) && shellLaunchConfig.reconnectionProperties) || !shellLaunchConfig.isFeatureTerminal) && this._terminalConfigurationService.config.enablePersistentSessions && !shellLaunchConfig.isTransient;
				if (shellLaunchConfig.attachPersistentProcess) {
					const result = await backend.attachToProcess(shellLaunchConfig.attachPersistentProcess.id);
					if (result) {
						newProcess = result;
					} else {
						// Warn and just create a new terminal if attach failed for some reason
						this._logService.warn(`Attach to process failed for terminal`, shellLaunchConfig.attachPersistentProcess);
						shellLaunchConfig.attachPersistentProcess = undefined;
					}
				}
				if (!newProcess) {
					await this._terminalProfileResolverService.resolveShellLaunchConfig(shellLaunchConfig, {
						remoteAuthority: this.remoteAuthority,
						os: this.os
					});
					const options: ITerminalProcessOptions = {
						shellIntegration: {
							enabled: this._configurationService.getValue(TerminalSettingId.ShellIntegrationEnabled),
							suggestEnabled: this._configurationService.getValue(TerminalContribSettingId.SuggestEnabled),
							nonce: this.shellIntegrationNonce
						},
						windowsEnableConpty: this._terminalConfigurationService.config.windowsEnableConpty,
						windowsUseConptyDll: this._terminalConfigurationService.config.windowsUseConptyDll ?? false,
						environmentVariableCollections: this._extEnvironmentVariableCollection?.collections ? serializeEnvironmentVariableCollections(this._extEnvironmentVariableCollection.collections) : undefined,
						workspaceFolder: this._cwdWorkspaceFolder,
						isScreenReaderOptimized: this._accessibilityService.isScreenReaderOptimized()
					};
					try {
						newProcess = await backend.createProcess(
							shellLaunchConfig,
							'', // TODO: Fix cwd
							cols,
							rows,
							this._terminalConfigurationService.config.unicodeVersion,
							env, // TODO:
							options,
							shouldPersist
						);
					} catch (e) {
						if (e?.message === 'Could not fetch remote environment') {
							this._logService.trace(`Could not fetch remote environment, silently failing`);
							return undefined;
						}
						throw e;
					}
				}
				if (!this._isDisposed) {
					this._setupPtyHostListeners(backend);
				}
			} else {
				if (shellLaunchConfig.attachPersistentProcess) {
					const result = shellLaunchConfig.attachPersistentProcess.findRevivedId ? await backend.attachToRevivedProcess(shellLaunchConfig.attachPersistentProcess.id) : await backend.attachToProcess(shellLaunchConfig.attachPersistentProcess.id);
					if (result) {
						newProcess = result;
					} else {
						// Warn and just create a new terminal if attach failed for some reason
						this._logService.warn(`Attach to process failed for terminal`, shellLaunchConfig.attachPersistentProcess);
						shellLaunchConfig.attachPersistentProcess = undefined;
					}
				}
				if (!newProcess) {
					newProcess = await this._launchLocalProcess(backend, shellLaunchConfig, cols, rows, this.userHome, variableResolver);
				}
				if (!this._isDisposed) {
					this._setupPtyHostListeners(backend);
				}
			}
		}

		// If the process was disposed during its creation, shut it down and return failure
		if (this._isDisposed) {
			newProcess.shutdown(false);
			return undefined;
		}

		this._process = newProcess;
		this._setProcessState(ProcessState.Launching);

		// Add any capabilities inherent to the backend
		if (this.os === OperatingSystem.Linux || this.os === OperatingSystem.Macintosh) {
			this.capabilities.add(TerminalCapability.NaiveCwdDetection, new NaiveCwdDetectionCapability(this._process));
		}

		this._dataFilter.newProcess(this._process, reset);

		if (this._processListeners) {
			dispose(this._processListeners);
		}
		this._processListeners = [
			newProcess.onProcessReady((e: IProcessReadyEvent) => {
				this._processTraits = e;
				this.shellProcessId = e.pid;
				this._initialCwd = e.cwd;
				this.processReadyTimestamp = Date.now();
				this._onDidChangeProperty.fire({ type: ProcessPropertyType.InitialCwd, value: this._initialCwd });
				this._onProcessReady.fire(e);

				if (this._preLaunchInputQueue.length > 0 && this._process) {
					// Send any queued data that's waiting
					newProcess.input(this._preLaunchInputQueue.join(''));
					this._preLaunchInputQueue.length = 0;
				}
			}),
			newProcess.onProcessExit(exitCode => this._onExit(exitCode)),
			newProcess.onDidChangeProperty(({ type, value }) => {
				switch (type) {
					case ProcessPropertyType.HasChildProcesses:
						this._hasChildProcesses = value as IProcessPropertyMap[ProcessPropertyType.HasChildProcesses];
						break;
					case ProcessPropertyType.FailedShellIntegrationActivation:
						this._telemetryService?.publicLog2<{}, { owner: 'meganrogge'; comment: 'Indicates shell integration was not activated because of custom args' }>('terminal/shellIntegrationActivationFailureCustomArgs');
						break;
				}
				this._onDidChangeProperty.fire({ type, value });
			})
		];
		if (newProcess.onProcessReplayComplete) {
			this._processListeners.push(newProcess.onProcessReplayComplete(() => this._onProcessReplayComplete.fire()));
		}
		if (newProcess.onRestoreCommands) {
			this._processListeners.push(newProcess.onRestoreCommands(e => this._onRestoreCommands.fire(e)));
		}
		setTimeout(() => {
			if (this.processState === ProcessState.Launching) {
				this._setProcessState(ProcessState.Running);
			}
		}, ProcessConstants.ErrorLaunchThresholdDuration);

		const result = await newProcess.start();
		if (result) {
			// Error
			return result;
		}

		// Report the latency to the pty host when idle
		runWhenWindowIdle(getActiveWindow(), () => {
			this.backend?.getLatency().then(measurements => {
				this._logService.info(`Latency measurements for ${this.remoteAuthority ?? 'local'} backend\n${measurements.map(e => `${e.label}: ${e.latency.toFixed(2)}ms`).join('\n')}`);
			});
		});

		return undefined;
	}

	async relaunch(shellLaunchConfig: IShellLaunchConfig, cols: number, rows: number, reset: boolean): Promise<ITerminalLaunchError | ITerminalLaunchResult | undefined> {
		this.ptyProcessReady = this._createPtyProcessReadyPromise();
		this._logService.trace(`Relaunching terminal instance ${this._instanceId}`);

		// Fire reconnect if needed to ensure the terminal is usable again
		if (this._isDisconnected) {
			this._isDisconnected = false;
			this._onPtyReconnect.fire();
		}

		// Clear data written flag to re-enable seamless relaunch if this relaunch was manually
		// triggered
		this._hasWrittenData = false;

		return this.createProcess(shellLaunchConfig, cols, rows, reset);
	}

	// Fetch any extension environment additions and apply them
	private async _resolveEnvironment(backend: ITerminalBackend, variableResolver: terminalEnvironment.VariableResolver | undefined, shellLaunchConfig: IShellLaunchConfig): Promise<IProcessEnvironment> {
		const workspaceFolder = terminalEnvironment.getWorkspaceForTerminal(shellLaunchConfig.cwd, this._workspaceContextService, this._historyService);
		const platformKey = isWindows ? 'windows' : (isMacintosh ? 'osx' : 'linux');
		const envFromConfigValue = this._configurationService.getValue<ITerminalEnvironment | undefined>(`terminal.integrated.env.${platformKey}`);

		let baseEnv: IProcessEnvironment;
		if (shellLaunchConfig.useShellEnvironment) {
			const shellEnv = await backend.getShellEnvironment();
			if (!shellEnv) {
				throw new BugIndicatingError('Cannot fetch shell environment to use');
			}
			baseEnv = shellEnv;
		} else {
			baseEnv = await this._terminalProfileResolverService.getEnvironment(this.remoteAuthority);
		}
		const env = await terminalEnvironment.createTerminalEnvironment(shellLaunchConfig, envFromConfigValue, variableResolver, this._productService.version, this._terminalConfigurationService.config.detectLocale, baseEnv);
		if (!this._isDisposed && shouldUseEnvironmentVariableCollection(shellLaunchConfig)) {
			this._extEnvironmentVariableCollection = this._environmentVariableService.mergedCollection;

			this._register(this._environmentVariableService.onDidChangeCollections(newCollection => this._onEnvironmentVariableCollectionChange(newCollection)));
			// For remote terminals, this is a copy of the mergedEnvironmentCollection created on
			// the remote side. Since the environment collection is synced between the remote and
			// local sides immediately this is a fairly safe way of enabling the env var diffing and
			// info widget. While technically these could differ due to the slight change of a race
			// condition, the chance is minimal plus the impact on the user is also not that great
			// if it happens - it's not worth adding plumbing to sync back the resolved collection.
			await this._extEnvironmentVariableCollection.applyToProcessEnvironment(env, { workspaceFolder }, variableResolver);
			if (this._extEnvironmentVariableCollection.getVariableMap({ workspaceFolder }).size) {
				this.environmentVariableInfo = this._instantiationService.createInstance(EnvironmentVariableInfoChangesActive, this._extEnvironmentVariableCollection);
				this._onEnvironmentVariableInfoChange.fire(this.environmentVariableInfo);
			}
		}
		return env;
	}

	private async _launchLocalProcess(
		backend: ITerminalBackend,
		shellLaunchConfig: IShellLaunchConfig,
		cols: number,
		rows: number,
		userHome: string | undefined,
		variableResolver: terminalEnvironment.VariableResolver | undefined
	): Promise<ITerminalChildProcess> {
		await this._terminalProfileResolverService.resolveShellLaunchConfig(shellLaunchConfig, {
			remoteAuthority: undefined,
			os: OS
		});
		const activeWorkspaceRootUri = this._historyService.getLastActiveWorkspaceRoot(Schemas.file);

		const initialCwd = await terminalEnvironment.getCwd(
			shellLaunchConfig,
			userHome,
			variableResolver,
			activeWorkspaceRootUri,
			this._terminalConfigurationService.config.cwd,
			this._logService
		);

		const env = await this._resolveEnvironment(backend, variableResolver, shellLaunchConfig);

		const options: ITerminalProcessOptions = {
			shellIntegration: {
				enabled: this._configurationService.getValue(TerminalSettingId.ShellIntegrationEnabled),
				suggestEnabled: this._configurationService.getValue(TerminalContribSettingId.SuggestEnabled),
				nonce: this.shellIntegrationNonce
			},
			windowsEnableConpty: this._terminalConfigurationService.config.windowsEnableConpty,
			windowsUseConptyDll: this._terminalConfigurationService.config.windowsUseConptyDll ?? false,
			environmentVariableCollections: this._extEnvironmentVariableCollection ? serializeEnvironmentVariableCollections(this._extEnvironmentVariableCollection.collections) : undefined,
			workspaceFolder: this._cwdWorkspaceFolder,
			isScreenReaderOptimized: this._accessibilityService.isScreenReaderOptimized()
		};
		const shouldPersist = ((this._configurationService.getValue(TaskSettingId.Reconnection) && shellLaunchConfig.reconnectionProperties) || !shellLaunchConfig.isFeatureTerminal) && this._terminalConfigurationService.config.enablePersistentSessions && !shellLaunchConfig.isTransient;
		return await backend.createProcess(shellLaunchConfig, initialCwd, cols, rows, this._terminalConfigurationService.config.unicodeVersion, env, options, shouldPersist);
	}

	private _setupPtyHostListeners(backend: ITerminalBackend) {
		if (this._ptyListenersAttached) {
			return;
		}
		this._ptyListenersAttached = true;

		// Mark the process as disconnected is the pty host is unresponsive, the responsive event
		// will fire only when the pty host was already unresponsive
		this._register(backend.onPtyHostUnresponsive(() => {
			this._isDisconnected = true;
			this._onPtyDisconnect.fire();
		}));
		this._ptyResponsiveListener = backend.onPtyHostResponsive(() => {
			this._isDisconnected = false;
			this._onPtyReconnect.fire();
		});
		this._register(toDisposable(() => this._ptyResponsiveListener?.dispose()));

		// When the pty host restarts, reconnect is no longer possible so dispose the responsive
		// listener
		this._register(backend.onPtyHostRestart(async () => {
			// When the pty host restarts, reconnect is no longer possible
			if (!this._isDisconnected) {
				this._isDisconnected = true;
				this._onPtyDisconnect.fire();
			}
			this._ptyResponsiveListener?.dispose();
			this._ptyResponsiveListener = undefined;
			if (this._shellLaunchConfig) {
				if (this._shellLaunchConfig.isFeatureTerminal && !this.reconnectionProperties) {
					// Indicate the process is exited (and gone forever) only for feature terminals
					// so they can react to the exit, this is particularly important for tasks so
					// that it knows that the process is not still active. Note that this is not
					// done for regular terminals because otherwise the terminal instance would be
					// disposed.
					this._onExit(-1);
				} else {
					// For normal terminals write a message indicating what happened and relaunch
					// using the previous shellLaunchConfig
					const message = localize('ptyHostRelaunch', "Restarting the terminal because the connection to the shell process was lost...");
					this._onProcessData.fire({ data: formatMessageForTerminal(message, { loudFormatting: true }), trackCommit: false });
					await this.relaunch(this._shellLaunchConfig, this._dimensions.cols, this._dimensions.rows, false);
				}
			}
		}));
	}

	async getBackendOS(): Promise<OperatingSystem> {
		let os = OS;
		if (!!this.remoteAuthority) {
			const remoteEnv = await this._remoteAgentService.getEnvironment();
			if (!remoteEnv) {
				throw new Error(`Failed to get remote environment for remote authority "${this.remoteAuthority}"`);
			}
			os = remoteEnv.os;
		}
		return os;
	}

	setDimensions(cols: number, rows: number): Promise<void>;
	setDimensions(cols: number, rows: number, sync: false): Promise<void>;
	setDimensions(cols: number, rows: number, sync: true): void;
	setDimensions(cols: number, rows: number, sync?: boolean): MaybePromise<void> {
		if (sync) {
			this._resize(cols, rows);
			return;
		}

		return this.ptyProcessReady.then(() => this._resize(cols, rows));
	}

	async setUnicodeVersion(version: '6' | '11'): Promise<void> {
		return this._process?.setUnicodeVersion(version);
	}

	async setNextCommandId(commandLine: string, commandId: string): Promise<void> {
		await this.ptyProcessReady;
		const process = this._process;
		if (!process?.id) {
			return;
		}
		await this._terminalService.setNextCommandId(process.id, commandLine, commandId);
	}

	private _resize(cols: number, rows: number) {
		if (!this._process) {
			return;
		}
		// The child process could already be terminated
		try {
			this._process.resize(cols, rows);
		} catch (error) {
			// We tried to write to a closed pipe / channel.
			if (error.code !== 'EPIPE' && error.code !== 'ERR_IPC_CHANNEL_CLOSED') {
				throw (error);
			}
		}
		this._dimensions.cols = cols;
		this._dimensions.rows = rows;
	}

	async write(data: string): Promise<void> {
		await this.ptyProcessReady;
		this._dataFilter.disableSeamlessRelaunch();
		this._hasWrittenData = true;
		if (this.shellProcessId || this._processType === ProcessType.PsuedoTerminal) {
			if (this._process) {
				// Send data if the pty is ready
				this._process.input(data);
			}
		} else {
			// If the pty is not ready, queue the data received to send later
			this._preLaunchInputQueue.push(data);
		}
	}

	async sendSignal(signal: string): Promise<void> {
		await this.ptyProcessReady;
		if (this._process) {
			this._process.sendSignal(signal);
		}
	}

	async processBinary(data: string): Promise<void> {
		await this.ptyProcessReady;
		this._dataFilter.disableSeamlessRelaunch();
		this._hasWrittenData = true;
		this._process?.processBinary(data);
	}

	get initialCwd(): string {
		return this._initialCwd ?? '';
	}

	async refreshProperty<T extends ProcessPropertyType>(type: T): Promise<IProcessPropertyMap[T]> {
		if (!this._process) {
			throw new Error('Cannot refresh property when process is not set');
		}
		return this._process.refreshProperty(type);
	}

	async updateProperty<T extends ProcessPropertyType>(type: T, value: IProcessPropertyMap[T]): Promise<void> {
		return this._process?.updateProperty(type, value);
	}

	acknowledgeDataEvent(charCount: number): void {
		this._ackDataBufferer.ack(charCount);
	}

	private _onExit(exitCode: number | undefined): void {
		this._process = null;
		// If the process is marked as launching then mark the process as killed
		// during launch. This typically means that there is a problem with the
		// shell and args.
		if (this.processState === ProcessState.Launching) {
			this._setProcessState(ProcessState.KilledDuringLaunch);
		}

		// If TerminalInstance did not know about the process exit then it was
		// triggered by the process, not on VS Code's side.
		if (this.processState === ProcessState.Running) {
			this._setProcessState(ProcessState.KilledByProcess);
		}

		this._onProcessExit.fire(exitCode);
	}

	private _setProcessState(state: ProcessState) {
		this.processState = state;
		this._onProcessStateChange.fire();
	}

	private _onEnvironmentVariableCollectionChange(newCollection: IMergedEnvironmentVariableCollection): void {
		const diff = this._extEnvironmentVariableCollection!.diff(newCollection, { workspaceFolder: this._cwdWorkspaceFolder });
		if (diff === undefined) {
			// If there are no longer differences, remove the stale info indicator
			if (this.environmentVariableInfo instanceof EnvironmentVariableInfoStale) {
				this.environmentVariableInfo = this._instantiationService.createInstance(EnvironmentVariableInfoChangesActive, this._extEnvironmentVariableCollection!);
				this._onEnvironmentVariableInfoChange.fire(this.environmentVariableInfo);
			}
			return;
		}
		this.environmentVariableInfo = this._instantiationService.createInstance(EnvironmentVariableInfoStale, diff, this._instanceId, newCollection);
		this._onEnvironmentVariableInfoChange.fire(this.environmentVariableInfo);
	}

	async clearBuffer(): Promise<void> {
		this._process?.clearBuffer?.();
	}
}

class AckDataBufferer {
	private _unsentCharCount: number = 0;

	constructor(
		private readonly _callback: (charCount: number) => void
	) {
	}

	ack(charCount: number) {
		this._unsentCharCount += charCount;
		while (this._unsentCharCount > FlowControlConstants.CharCountAckSize) {
			this._unsentCharCount -= FlowControlConstants.CharCountAckSize;
			this._callback(FlowControlConstants.CharCountAckSize);
		}
	}
}

const enum SeamlessRelaunchConstants {
	/**
	 * How long to record data events for new terminals.
	 */
	RecordTerminalDuration = 10000,
	/**
	 * The maximum duration after a relaunch occurs to trigger a swap.
	 */
	SwapWaitMaximumDuration = 3000
}

/**
 * Filters data events from the process and supports seamlessly restarting swapping out the process
 * with another, delaying the swap in output in order to minimize flickering/clearing of the
 * terminal.
 */
class SeamlessRelaunchDataFilter extends Disposable {
	private _firstRecorder?: TerminalRecorder;
	private _secondRecorder?: TerminalRecorder;
	private readonly _firstDisposable = this._register(new MutableDisposable());
	private readonly _secondDisposable = this._register(new MutableDisposable());
	private readonly _dataListener = this._register(new MutableDisposable());
	private _activeProcess?: ITerminalChildProcess;
	private _disableSeamlessRelaunch: boolean = false;

	private _swapTimeout?: number;

	private readonly _onProcessData = this._register(new Emitter<string | IProcessDataEvent>());
	get onProcessData(): Event<string | IProcessDataEvent> { return this._onProcessData.event; }

	constructor(
		@ITerminalLogService private readonly _logService: ITerminalLogService
	) {
		super();
	}

	newProcess(process: ITerminalChildProcess, reset: boolean) {
		// Stop listening to the old process and trigger delayed shutdown (for hang issue #71966)
		this._dataListener.clear();
		this._activeProcess?.shutdown(false);

		this._activeProcess = process;

		// Start firing events immediately if:
		// - there's no recorder, which means it's a new terminal
		// - this is not a reset, so seamless relaunch isn't necessary
		// - seamless relaunch is disabled because the terminal has accepted input
		if (!this._firstRecorder || !reset || this._disableSeamlessRelaunch) {
			[this._firstRecorder, this._firstDisposable.value] = this._createRecorder(process);
			if (this._disableSeamlessRelaunch && reset) {
				this._onProcessData.fire('\x1bc');
			}
			this._dataListener.value = process.onProcessData(e => this._onProcessData.fire(e));
			this._disableSeamlessRelaunch = false;
			return;
		}

		// Trigger a swap if there was a recent relaunch
		if (this._secondRecorder) {
			this.triggerSwap();
		}

		this._swapTimeout = mainWindow.setTimeout(() => this.triggerSwap(), SeamlessRelaunchConstants.SwapWaitMaximumDuration);

		// Pause all outgoing data events
		this._dataListener.clear();

		this._firstDisposable.clear();
		const recorder = this._createRecorder(process);
		[this._secondRecorder, this._secondDisposable.value] = recorder;
	}

	/**
	 * Disables seamless relaunch for the active process
	 */
	disableSeamlessRelaunch() {
		this._disableSeamlessRelaunch = true;
		this._stopRecording();
		this.triggerSwap();
	}

	/**
	 * Trigger the swap of the processes if needed (eg. timeout, input)
	 */
	triggerSwap() {
		// Clear the swap timeout if it exists
		if (this._swapTimeout) {
			mainWindow.clearTimeout(this._swapTimeout);
			this._swapTimeout = undefined;
		}

		// Do nothing if there's nothing being recorder
		if (!this._firstRecorder) {
			return;
		}
		// Clear the first recorder if no second process was attached before the swap trigger
		if (!this._secondRecorder) {
			this._firstRecorder = undefined;
			this._firstDisposable.clear();
			return;
		}

		// Generate data for each recorder
		const firstData = this._getDataFromRecorder(this._firstRecorder);
		const secondData = this._getDataFromRecorder(this._secondRecorder);

		// Re-write the terminal if the data differs
		if (firstData === secondData) {
			this._logService.trace(`Seamless terminal relaunch - identical content`);
		} else {
			this._logService.trace(`Seamless terminal relaunch - resetting content`);
			// Fire full reset (RIS) followed by the new data so the update happens in the same frame
			this._onProcessData.fire({ data: `\x1bc${secondData}`, trackCommit: false });
		}

		// Set up the new data listener
		this._dataListener.value = this._activeProcess!.onProcessData(e => this._onProcessData.fire(e));

		// Replace first recorder with second
		this._firstRecorder = this._secondRecorder;
		this._firstDisposable.value = this._secondDisposable.value;
		this._secondRecorder = undefined;
	}

	private _stopRecording() {
		// Continue recording if a swap is coming
		if (this._swapTimeout) {
			return;
		}
		// Stop recording
		this._firstRecorder = undefined;
		this._firstDisposable.clear();
		this._secondRecorder = undefined;
		this._secondDisposable.clear();
	}

	private _createRecorder(process: ITerminalChildProcess): [TerminalRecorder, IDisposable] {
		const recorder = new TerminalRecorder(0, 0);
		const disposable = process.onProcessData(e => recorder.handleData(isString(e) ? e : e.data));
		return [recorder, disposable];
	}

	private _getDataFromRecorder(recorder: TerminalRecorder): string {
		return recorder.generateReplayEventSync().events.filter(e => !!e.data).map(e => e.data).join('');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalProfileQuickpick.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalProfileQuickpick.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IQuickInputService, IKeyMods, IPickOptions, IQuickPickSeparator, IQuickInputButton, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { IExtensionTerminalProfile, ITerminalProfile, ITerminalProfileObject, TerminalSettingPrefix, type ITerminalExecutable } from '../../../../platform/terminal/common/terminal.js';
import { getUriClasses, getColorClass, createColorStyleElement } from './terminalIcon.js';
import { configureTerminalProfileIcon } from './terminalIcons.js';
import * as nls from '../../../../nls.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { ITerminalProfileResolverService, ITerminalProfileService } from '../common/terminal.js';
import { IQuickPickTerminalObject, ITerminalInstance } from './terminal.js';
import { IPickerQuickAccessItem } from '../../../../platform/quickinput/browser/pickerQuickAccess.js';
import { getIconRegistry } from '../../../../platform/theme/common/iconRegistry.js';
import { basename } from '../../../../base/common/path.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { hasKey, isString } from '../../../../base/common/types.js';


type DefaultProfileName = string;
export class TerminalProfileQuickpick {
	constructor(
		@ITerminalProfileService private readonly _terminalProfileService: ITerminalProfileService,
		@ITerminalProfileResolverService private readonly _terminalProfileResolverService: ITerminalProfileResolverService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
		@IThemeService private readonly _themeService: IThemeService,
		@INotificationService private readonly _notificationService: INotificationService
	) { }

	async showAndGetResult(type: 'setDefault' | 'createInstance'): Promise<IQuickPickTerminalObject | DefaultProfileName | undefined> {
		const platformKey = await this._terminalProfileService.getPlatformKey();
		const profilesKey = TerminalSettingPrefix.Profiles + platformKey;
		const result = await this._createAndShow(type);
		const defaultProfileKey = `${TerminalSettingPrefix.DefaultProfile}${platformKey}`;
		if (!result) {
			return;
		}
		if (type === 'setDefault') {
			if (hasKey(result.profile, { id: true })) {
				// extension contributed profile
				await this._configurationService.updateValue(defaultProfileKey, result.profile.title, ConfigurationTarget.USER);
				return {
					config: {
						extensionIdentifier: result.profile.extensionIdentifier,
						id: result.profile.id,
						title: result.profile.title,
						options: {
							color: result.profile.color,
							icon: result.profile.icon
						}
					},
					keyMods: result.keyMods
				};
			}

			// Add the profile to settings if necessary
			if (hasKey(result.profile, { profileName: true })) {
				const profilesConfig = await this._configurationService.getValue(profilesKey);
				if (typeof profilesConfig === 'object') {
					const newProfile: ITerminalProfileObject = {
						path: result.profile.path
					};
					if (result.profile.args) {
						newProfile.args = result.profile.args;
					}
					(profilesConfig as { [key: string]: ITerminalProfileObject })[result.profile.profileName] = this._createNewProfileConfig(result.profile);
					await this._configurationService.updateValue(profilesKey, profilesConfig, ConfigurationTarget.USER);
				}
			}
			// Set the default profile
			await this._configurationService.updateValue(defaultProfileKey, result.profileName, ConfigurationTarget.USER);
		} else if (type === 'createInstance') {
			if (hasKey(result.profile, { id: true })) {
				return {
					config: {
						extensionIdentifier: result.profile.extensionIdentifier,
						id: result.profile.id,
						title: result.profile.title,
						options: {
							icon: result.profile.icon,
							color: result.profile.color,
						}
					},
					keyMods: result.keyMods
				};
			} else {
				return { config: result.profile, keyMods: result.keyMods };
			}
		}
		// for tests
		return hasKey(result.profile, { profileName: true }) ? result.profile.profileName : result.profile.title;
	}

	private async _createAndShow(type: 'setDefault' | 'createInstance'): Promise<IProfileQuickPickItem | undefined> {
		const platformKey = await this._terminalProfileService.getPlatformKey();
		const profiles = this._terminalProfileService.availableProfiles;
		const profilesKey = TerminalSettingPrefix.Profiles + platformKey;
		const defaultProfileName = this._terminalProfileService.getDefaultProfileName();
		let keyMods: IKeyMods | undefined;
		const options: IPickOptions<IProfileQuickPickItem> = {
			placeHolder: type === 'createInstance' ? nls.localize('terminal.integrated.selectProfileToCreate', "Select the terminal profile to create") : nls.localize('terminal.integrated.chooseDefaultProfile', "Select your default terminal profile"),
			onDidTriggerItemButton: async (context) => {
				// Get the user's explicit permission to use a potentially unsafe path
				if (!await this._isProfileSafe(context.item.profile)) {
					return;
				}
				if (hasKey(context.item.profile, { id: true })) {
					return;
				}
				const configProfiles: { [key: string]: ITerminalExecutable | null | undefined } = this._configurationService.getValue(TerminalSettingPrefix.Profiles + platformKey);
				const existingProfiles = !!configProfiles ? Object.keys(configProfiles) : [];
				const name = await this._quickInputService.input({
					prompt: nls.localize('enterTerminalProfileName', "Enter terminal profile name"),
					value: context.item.profile.profileName,
					validateInput: async input => {
						if (existingProfiles.includes(input)) {
							return nls.localize('terminalProfileAlreadyExists', "A terminal profile already exists with that name");
						}
						return undefined;
					}
				});
				if (!name) {
					return;
				}
				const newConfigValue: { [key: string]: ITerminalExecutable | null | undefined } = {
					...configProfiles,
					[name]: this._createNewProfileConfig(context.item.profile)
				};
				await this._configurationService.updateValue(profilesKey, newConfigValue, ConfigurationTarget.USER);
			},
			onKeyMods: mods => keyMods = mods
		};

		// Build quick pick items
		const quickPickItems: (IProfileQuickPickItem | IQuickPickSeparator)[] = [];
		const configProfiles = profiles.filter(e => !e.isAutoDetected);
		const autoDetectedProfiles = profiles.filter(e => e.isAutoDetected);

		if (configProfiles.length > 0) {
			quickPickItems.push({ type: 'separator', label: nls.localize('terminalProfiles', "profiles") });
			quickPickItems.push(...this._sortProfileQuickPickItems(configProfiles.map(e => this._createProfileQuickPickItem(e)), defaultProfileName!));
		}

		quickPickItems.push({ type: 'separator', label: nls.localize('ICreateContributedTerminalProfileOptions', "contributed") });
		const contributedProfiles: IProfileQuickPickItem[] = [];
		for (const contributed of this._terminalProfileService.contributedProfiles) {
			let icon: ThemeIcon | undefined;
			if (isString(contributed.icon)) {
				if (contributed.icon.startsWith('$(')) {
					icon = ThemeIcon.fromString(contributed.icon);
				} else {
					icon = ThemeIcon.fromId(contributed.icon);
				}
			}
			if (!icon || !getIconRegistry().getIcon(icon.id)) {
				icon = this._terminalProfileResolverService.getDefaultIcon();
			}
			const uriClasses = getUriClasses(contributed, this._themeService.getColorTheme().type, true);
			const colorClass = getColorClass(contributed);
			const iconClasses = [];
			if (uriClasses) {
				iconClasses.push(...uriClasses);
			}
			if (colorClass) {
				iconClasses.push(colorClass);
			}
			contributedProfiles.push({
				label: `$(${icon.id}) ${contributed.title}`,
				profile: {
					extensionIdentifier: contributed.extensionIdentifier,
					title: contributed.title,
					icon: contributed.icon,
					id: contributed.id,
					color: contributed.color
				},
				profileName: contributed.title,
				iconClasses
			});
		}

		if (contributedProfiles.length > 0) {
			quickPickItems.push(...this._sortProfileQuickPickItems(contributedProfiles, defaultProfileName!));
		}

		if (autoDetectedProfiles.length > 0) {
			quickPickItems.push({ type: 'separator', label: nls.localize('terminalProfiles.detected', "detected") });
			quickPickItems.push(...this._sortProfileQuickPickItems(autoDetectedProfiles.map(e => this._createProfileQuickPickItem(e)), defaultProfileName!));
		}
		const colorStyleDisposable = createColorStyleElement(this._themeService.getColorTheme());

		const result = await this._quickInputService.pick(quickPickItems, options);
		colorStyleDisposable.dispose();
		if (!result) {
			return undefined;
		}
		if (!await this._isProfileSafe(result.profile)) {
			return undefined;
		}
		if (keyMods) {
			result.keyMods = keyMods;
		}
		return result;
	}

	private _createNewProfileConfig(profile: ITerminalProfile): ITerminalExecutable {
		const result: ITerminalExecutable = { path: profile.path };
		if (profile.args) {
			result.args = profile.args;
		}
		if (profile.env) {
			result.env = profile.env;
		}
		return result;
	}

	private async _isProfileSafe(profile: ITerminalProfile | IExtensionTerminalProfile): Promise<boolean> {
		const isUnsafePath = hasKey(profile, { profileName: true }) && profile.isUnsafePath;
		const requiresUnsafePath = hasKey(profile, { profileName: true }) && profile.requiresUnsafePath;
		if (!isUnsafePath && !requiresUnsafePath) {
			return true;
		}

		// Get the user's explicit permission to use a potentially unsafe path
		return await new Promise<boolean>(r => {
			const unsafePaths = [];
			if (isUnsafePath) {
				unsafePaths.push(profile.path);
			}
			if (requiresUnsafePath) {
				unsafePaths.push(requiresUnsafePath);
			}
			// Notify about unsafe path(s). At the time of writing, multiple unsafe paths isn't
			// possible so the message is optimized for a single path.
			const handle = this._notificationService.prompt(
				Severity.Warning,
				nls.localize('unsafePathWarning', 'This terminal profile uses a potentially unsafe path that can be modified by another user: {0}. Are you sure you want to use it?', `"${unsafePaths.join(',')}"`),
				[{
					label: nls.localize('yes', 'Yes'),
					run: () => r(true)
				}, {
					label: nls.localize('cancel', 'Cancel'),
					run: () => r(false)
				}]
			);
			handle.onDidClose(() => r(false));
		});
	}

	private _createProfileQuickPickItem(profile: ITerminalProfile): IProfileQuickPickItem {
		const buttons: IQuickInputButton[] = [{
			iconClass: ThemeIcon.asClassName(configureTerminalProfileIcon),
			tooltip: nls.localize('createQuickLaunchProfile', "Configure Terminal Profile")
		}];
		const icon = (profile.icon && ThemeIcon.isThemeIcon(profile.icon)) ? profile.icon : Codicon.terminal;
		const label = `$(${icon.id}) ${profile.profileName}`;
		const friendlyPath = profile.isFromPath ? basename(profile.path) : profile.path;
		const colorClass = getColorClass(profile);
		const iconClasses = [];
		if (colorClass) {
			iconClasses.push(colorClass);
		}

		if (profile.args) {
			if (isString(profile.args)) {
				return { label, description: `${profile.path} ${profile.args}`, profile, profileName: profile.profileName, buttons, iconClasses };
			}
			const argsString = profile.args.map(e => {
				if (e.includes(' ')) {
					return `"${e.replace(/"/g, '\\"')}"`; // CodeQL [SM02383] js/incomplete-sanitization This is only used as a label on the UI so this isn't a problem
				}
				return e;
			}).join(' ');
			return { label, description: `${friendlyPath} ${argsString}`, profile, profileName: profile.profileName, buttons, iconClasses };
		}
		return { label, description: friendlyPath, profile, profileName: profile.profileName, buttons, iconClasses };
	}

	private _sortProfileQuickPickItems(items: IProfileQuickPickItem[], defaultProfileName: string) {
		return items.sort((a, b) => {
			if (b.profileName === defaultProfileName) {
				return 1;
			}
			if (a.profileName === defaultProfileName) {
				return -1;
			}
			return a.profileName.localeCompare(b.profileName);
		});
	}
}

export interface IProfileQuickPickItem extends IQuickPickItem {
	profile: ITerminalProfile | IExtensionTerminalProfile;
	profileName: string;
	keyMods?: IKeyMods | undefined;
}

export interface ITerminalQuickPickItem extends IPickerQuickAccessItem {
	terminal: ITerminalInstance;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalProfileResolverService.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalProfileResolverService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../../../../base/common/network.js';
import { env } from '../../../../base/common/process.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IWorkspaceContextService, IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { IConfigurationResolverService } from '../../../services/configurationResolver/common/configurationResolver.js';
import { IHistoryService } from '../../../services/history/common/history.js';
import { IProcessEnvironment, OperatingSystem, OS } from '../../../../base/common/platform.js';
import { IShellLaunchConfig, ITerminalLogService, ITerminalProfile, TerminalIcon, TerminalSettingId } from '../../../../platform/terminal/common/terminal.js';
import { IShellLaunchConfigResolveOptions, ITerminalProfileResolverService, ITerminalProfileService } from '../common/terminal.js';
import * as path from '../../../../base/common/path.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { getIconRegistry, IIconRegistry } from '../../../../platform/theme/common/iconRegistry.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';
import { debounce } from '../../../../base/common/decorators.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { isUriComponents, URI } from '../../../../base/common/uri.js';
import { deepClone } from '../../../../base/common/objects.js';
import { ITerminalInstanceService } from './terminal.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { isString, type SingleOrMany } from '../../../../base/common/types.js';

export interface IProfileContextProvider {
	getDefaultSystemShell(remoteAuthority: string | undefined, os: OperatingSystem): Promise<string>;
	getEnvironment(remoteAuthority: string | undefined): Promise<IProcessEnvironment>;
}

const generatedProfileName = 'Generated';

/*
 * Resolves terminal shell launch config and terminal profiles for the given operating system,
 * environment, and user configuration.
 */
export abstract class BaseTerminalProfileResolverService extends Disposable implements ITerminalProfileResolverService {
	declare _serviceBrand: undefined;

	private _primaryBackendOs: OperatingSystem | undefined;

	private readonly _iconRegistry: IIconRegistry = getIconRegistry();

	private _defaultProfileName: string | undefined;
	get defaultProfileName(): string | undefined { return this._defaultProfileName; }

	constructor(
		private readonly _context: IProfileContextProvider,
		private readonly _configurationService: IConfigurationService,
		private readonly _configurationResolverService: IConfigurationResolverService,
		private readonly _historyService: IHistoryService,
		private readonly _logService: ITerminalLogService,
		private readonly _terminalProfileService: ITerminalProfileService,
		private readonly _workspaceContextService: IWorkspaceContextService,
		private readonly _remoteAgentService: IRemoteAgentService
	) {
		super();

		if (this._remoteAgentService.getConnection()) {
			this._remoteAgentService.getEnvironment().then(env => this._primaryBackendOs = env?.os || OS);
		} else {
			this._primaryBackendOs = OS;
		}
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TerminalSettingId.DefaultProfileWindows) ||
				e.affectsConfiguration(TerminalSettingId.DefaultProfileMacOs) ||
				e.affectsConfiguration(TerminalSettingId.DefaultProfileLinux)) {
				this._refreshDefaultProfileName();
			}
		}));
		this._register(this._terminalProfileService.onDidChangeAvailableProfiles(() => this._refreshDefaultProfileName()));
	}

	@debounce(200)
	private async _refreshDefaultProfileName() {
		if (this._primaryBackendOs) {
			this._defaultProfileName = (await this.getDefaultProfile({
				remoteAuthority: this._remoteAgentService.getConnection()?.remoteAuthority,
				os: this._primaryBackendOs
			}))?.profileName;
		}
	}

	resolveIcon(shellLaunchConfig: IShellLaunchConfig, os: OperatingSystem): void {
		if (shellLaunchConfig.icon) {
			shellLaunchConfig.icon = this._getCustomIcon(shellLaunchConfig.icon) || this.getDefaultIcon();
			return;
		}
		if (shellLaunchConfig.customPtyImplementation) {
			shellLaunchConfig.icon = this.getDefaultIcon();
			return;
		}
		if (shellLaunchConfig.executable) {
			return;
		}
		const defaultProfile = this._getUnresolvedRealDefaultProfile(os);
		if (defaultProfile) {
			shellLaunchConfig.icon = defaultProfile.icon;
		}
		if (!shellLaunchConfig.icon) {
			shellLaunchConfig.icon = this.getDefaultIcon();
		}
	}

	getDefaultIcon(resource?: URI): TerminalIcon & ThemeIcon {
		return this._iconRegistry.getIcon(this._configurationService.getValue(TerminalSettingId.TabsDefaultIcon, { resource })) || Codicon.terminal;
	}

	async resolveShellLaunchConfig(shellLaunchConfig: IShellLaunchConfig, options: IShellLaunchConfigResolveOptions): Promise<void> {
		// Resolve the shell and shell args
		let resolvedProfile: ITerminalProfile;
		if (shellLaunchConfig.executable) {
			resolvedProfile = await this._resolveProfile({
				path: shellLaunchConfig.executable,
				args: shellLaunchConfig.args,
				profileName: generatedProfileName,
				isDefault: false
			}, options);
		} else {
			resolvedProfile = await this.getDefaultProfile(options);
		}
		shellLaunchConfig.executable = resolvedProfile.path;
		shellLaunchConfig.args = resolvedProfile.args;
		if (resolvedProfile.env) {
			if (shellLaunchConfig.env) {
				shellLaunchConfig.env = { ...shellLaunchConfig.env, ...resolvedProfile.env };
			} else {
				shellLaunchConfig.env = resolvedProfile.env;
			}
		}

		// Verify the icon is valid, and fallback correctly to the generic terminal id if there is
		// an issue
		const resource = shellLaunchConfig === undefined || isString(shellLaunchConfig.cwd) ? undefined : shellLaunchConfig.cwd;
		shellLaunchConfig.icon = this._getCustomIcon(shellLaunchConfig.icon)
			|| this._getCustomIcon(resolvedProfile.icon)
			|| this.getDefaultIcon(resource);

		// Override the name if specified
		if (resolvedProfile.overrideName) {
			shellLaunchConfig.name = resolvedProfile.profileName;
		}

		// Apply the color
		shellLaunchConfig.color = shellLaunchConfig.color
			|| resolvedProfile.color
			|| this._configurationService.getValue(TerminalSettingId.TabsDefaultColor, { resource });

		// Resolve useShellEnvironment based on the setting if it's not set
		if (shellLaunchConfig.useShellEnvironment === undefined) {
			shellLaunchConfig.useShellEnvironment = this._configurationService.getValue(TerminalSettingId.InheritEnv);
		}
	}

	async getDefaultShell(options: IShellLaunchConfigResolveOptions): Promise<string> {
		return (await this.getDefaultProfile(options)).path;
	}

	async getDefaultShellArgs(options: IShellLaunchConfigResolveOptions): Promise<SingleOrMany<string>> {
		return (await this.getDefaultProfile(options)).args || [];
	}

	async getDefaultProfile(options: IShellLaunchConfigResolveOptions): Promise<ITerminalProfile> {
		return this._resolveProfile(await this._getUnresolvedDefaultProfile(options), options);
	}

	getEnvironment(remoteAuthority: string | undefined): Promise<IProcessEnvironment> {
		return this._context.getEnvironment(remoteAuthority);
	}

	private _getCustomIcon(icon?: TerminalIcon): TerminalIcon | undefined {
		if (!icon) {
			return undefined;
		}
		if (isString(icon)) {
			return ThemeIcon.fromId(icon);
		}
		if (ThemeIcon.isThemeIcon(icon)) {
			return icon;
		}
		if (URI.isUri(icon) || isUriComponents(icon)) {
			return URI.revive(icon);
		}
		if ((URI.isUri(icon.light) || isUriComponents(icon.light)) && (URI.isUri(icon.dark) || isUriComponents(icon.dark))) {
			return { light: URI.revive(icon.light), dark: URI.revive(icon.dark) };
		}
		return undefined;
	}

	private async _getUnresolvedDefaultProfile(options: IShellLaunchConfigResolveOptions): Promise<ITerminalProfile> {
		// If automation shell is allowed, prefer that
		if (options.allowAutomationShell) {
			const automationShellProfile = this._getUnresolvedAutomationShellProfile(options);
			if (automationShellProfile) {
				return automationShellProfile;
			}
		}

		// Return the real default profile if it exists and is valid, wait for profiles to be ready
		// if the window just opened
		await this._terminalProfileService.profilesReady;
		const defaultProfile = this._getUnresolvedRealDefaultProfile(options.os);
		if (defaultProfile) {
			return this._setIconForAutomation(options, defaultProfile);
		}

		// If there is no real default profile, create a fallback default profile based on the shell
		// and shellArgs settings in addition to the current environment.
		return this._setIconForAutomation(options, await this._getUnresolvedFallbackDefaultProfile(options));
	}

	private _setIconForAutomation(options: IShellLaunchConfigResolveOptions, profile: ITerminalProfile): ITerminalProfile {
		if (options.allowAutomationShell) {
			const profileClone = deepClone(profile);
			profileClone.icon = Codicon.tools;
			return profileClone;
		}
		return profile;
	}

	private _getUnresolvedRealDefaultProfile(os: OperatingSystem): ITerminalProfile | undefined {
		return this._terminalProfileService.getDefaultProfile(os);
	}

	private async _getUnresolvedFallbackDefaultProfile(options: IShellLaunchConfigResolveOptions): Promise<ITerminalProfile> {
		const executable = await this._context.getDefaultSystemShell(options.remoteAuthority, options.os);

		// Try select an existing profile to fallback to, based on the default system shell, only do
		// this when it is NOT a local terminal in a remote window where the front and back end OS
		// differs (eg. Windows -> WSL, Mac -> Linux)
		if (options.os === OS) {
			let existingProfile = this._terminalProfileService.availableProfiles.find(e => path.parse(e.path).name === path.parse(executable).name);
			if (existingProfile) {
				if (options.allowAutomationShell) {
					existingProfile = deepClone(existingProfile);
					existingProfile.icon = Codicon.tools;
				}
				return existingProfile;
			}
		}

		// Finally fallback to a generated profile
		let args: SingleOrMany<string> | undefined;
		if (options.os === OperatingSystem.Macintosh && path.parse(executable).name.match(/(zsh|bash)/)) {
			// macOS should launch a login shell by default
			args = ['--login'];
		} else {
			// Resolve undefined to []
			args = [];
		}

		const icon = this._guessProfileIcon(executable);

		return {
			profileName: generatedProfileName,
			path: executable,
			args,
			icon,
			isDefault: false
		};
	}

	private _getUnresolvedAutomationShellProfile(options: IShellLaunchConfigResolveOptions): ITerminalProfile | undefined {
		const automationProfile = this._configurationService.getValue(`terminal.integrated.automationProfile.${this._getOsKey(options.os)}`);
		if (this._isValidAutomationProfile(automationProfile, options.os)) {
			automationProfile.icon = this._getCustomIcon(automationProfile.icon) || Codicon.tools;
			return automationProfile;
		}

		return undefined;
	}

	private async _resolveProfile(profile: ITerminalProfile, options: IShellLaunchConfigResolveOptions): Promise<ITerminalProfile> {
		const env = await this._context.getEnvironment(options.remoteAuthority);

		if (options.os === OperatingSystem.Windows) {
			// Change Sysnative to System32 if the OS is Windows but NOT WoW64. It's
			// safe to assume that this was used by accident as Sysnative does not
			// exist and will break the terminal in non-WoW64 environments.
			const isWoW64 = !!env.hasOwnProperty('PROCESSOR_ARCHITEW6432');
			const windir = env.windir;
			if (!isWoW64 && windir) {
				const sysnativePath = path.join(windir, 'Sysnative').replace(/\//g, '\\').toLowerCase();
				if (profile.path && profile.path.toLowerCase().indexOf(sysnativePath) === 0) {
					profile.path = path.join(windir, 'System32', profile.path.substr(sysnativePath.length + 1));
				}
			}

			// Convert / to \ on Windows for convenience
			if (profile.path) {
				profile.path = profile.path.replace(/\//g, '\\');
			}
		}

		// Resolve path variables
		const activeWorkspaceRootUri = this._historyService.getLastActiveWorkspaceRoot(options.remoteAuthority ? Schemas.vscodeRemote : Schemas.file);
		const lastActiveWorkspace = activeWorkspaceRootUri ? this._workspaceContextService.getWorkspaceFolder(activeWorkspaceRootUri) ?? undefined : undefined;
		profile.path = await this._resolveVariables(profile.path, env, lastActiveWorkspace);

		// Resolve args variables
		if (profile.args) {
			if (isString(profile.args)) {
				profile.args = await this._resolveVariables(profile.args, env, lastActiveWorkspace);
			} else {
				profile.args = await Promise.all(profile.args.map(arg => this._resolveVariables(arg, env, lastActiveWorkspace)));
			}
		}

		return profile;
	}

	private async _resolveVariables(value: string, env: IProcessEnvironment, lastActiveWorkspace: IWorkspaceFolder | undefined) {
		try {
			value = await this._configurationResolverService.resolveWithEnvironment(env, lastActiveWorkspace, value);
		} catch (e) {
			this._logService.error(`Could not resolve shell`, e);
		}
		return value;
	}

	private _getOsKey(os: OperatingSystem): string {
		switch (os) {
			case OperatingSystem.Linux: return 'linux';
			case OperatingSystem.Macintosh: return 'osx';
			case OperatingSystem.Windows: return 'windows';
		}
	}

	private _guessProfileIcon(shell: string): ThemeIcon | undefined {
		const file = path.parse(shell).name;
		switch (file) {
			case 'bash':
				return Codicon.terminalBash;
			case 'pwsh':
			case 'powershell':
				return Codicon.terminalPowershell;
			case 'tmux':
				return Codicon.terminalTmux;
			case 'cmd':
				return Codicon.terminalCmd;
			default:
				return undefined;
		}
	}

	private _isValidAutomationProfile(profile: unknown, os: OperatingSystem): profile is ITerminalProfile {
		if (profile === null || profile === undefined || typeof profile !== 'object') {
			return false;
		}
		if ('path' in profile && isString((profile as { path: unknown }).path)) {
			return true;
		}
		return false;
	}
}

export class BrowserTerminalProfileResolverService extends BaseTerminalProfileResolverService {

	constructor(
		@IConfigurationResolverService configurationResolverService: IConfigurationResolverService,
		@IConfigurationService configurationService: IConfigurationService,
		@IHistoryService historyService: IHistoryService,
		@ITerminalLogService logService: ITerminalLogService,
		@ITerminalInstanceService terminalInstanceService: ITerminalInstanceService,
		@ITerminalProfileService terminalProfileService: ITerminalProfileService,
		@IWorkspaceContextService workspaceContextService: IWorkspaceContextService,
		@IRemoteAgentService remoteAgentService: IRemoteAgentService
	) {
		super(
			{
				getDefaultSystemShell: async (remoteAuthority, os) => {
					const backend = await terminalInstanceService.getBackend(remoteAuthority);
					if (!remoteAuthority || !backend) {
						// Just return basic values, this is only for serverless web and wouldn't be used
						return os === OperatingSystem.Windows ? 'pwsh' : 'bash';
					}
					return backend.getDefaultSystemShell(os);
				},
				getEnvironment: async (remoteAuthority) => {
					const backend = await terminalInstanceService.getBackend(remoteAuthority);
					if (!remoteAuthority || !backend) {
						return env;
					}
					return backend.getEnvironment();
				}
			},
			configurationService,
			configurationResolverService,
			historyService,
			logService,
			terminalProfileService,
			workspaceContextService,
			remoteAgentService
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalProfileService.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalProfileService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as arrays from '../../../../base/common/arrays.js';
import * as objects from '../../../../base/common/objects.js';
import { AutoOpenBarrier } from '../../../../base/common/async.js';
import { throttle } from '../../../../base/common/decorators.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, IDisposable, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { isMacintosh, isWeb, isWindows, OperatingSystem, OS } from '../../../../base/common/platform.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ITerminalProfile, IExtensionTerminalProfile, TerminalSettingPrefix, TerminalSettingId, ITerminalProfileObject, IShellLaunchConfig, ITerminalExecutable } from '../../../../platform/terminal/common/terminal.js';
import { registerTerminalDefaultProfileConfiguration } from '../../../../platform/terminal/common/terminalPlatformConfiguration.js';
import { terminalIconsEqual, terminalProfileArgsMatch } from '../../../../platform/terminal/common/terminalProfiles.js';
import { ITerminalInstanceService } from './terminal.js';
import { refreshTerminalActions } from './terminalActions.js';
import { IRegisterContributedProfileArgs, ITerminalProfileProvider, ITerminalProfileService } from '../common/terminal.js';
import { TerminalContextKeys } from '../common/terminalContextKey.js';
import { ITerminalContributionService } from '../common/terminalExtensionPoints.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';
import { hasKey, isString } from '../../../../base/common/types.js';

/*
 * Links TerminalService with TerminalProfileResolverService
 * and keeps the available terminal profiles updated
 */
export class TerminalProfileService extends Disposable implements ITerminalProfileService {
	declare _serviceBrand: undefined;

	private _webExtensionContributedProfileContextKey: IContextKey<boolean>;
	private _profilesReadyBarrier: AutoOpenBarrier | undefined;
	private _profilesReadyPromise: Promise<void>;
	private _availableProfiles: ITerminalProfile[] | undefined;
	private _automationProfile: unknown;
	private _contributedProfiles: IExtensionTerminalProfile[] = [];
	private _defaultProfileName?: string;
	private _platformConfigJustRefreshed = false;
	private readonly _refreshTerminalActionsDisposable = this._register(new MutableDisposable());
	private readonly _profileProviders: Map</*ext id*/string, Map</*provider id*/string, ITerminalProfileProvider>> = new Map();

	private readonly _onDidChangeAvailableProfiles = this._register(new Emitter<ITerminalProfile[]>());
	get onDidChangeAvailableProfiles(): Event<ITerminalProfile[]> { return this._onDidChangeAvailableProfiles.event; }

	get profilesReady(): Promise<void> { return this._profilesReadyPromise; }
	get availableProfiles(): ITerminalProfile[] {
		if (!this._platformConfigJustRefreshed) {
			this.refreshAvailableProfiles();
		}
		return this._availableProfiles || [];
	}
	get contributedProfiles(): IExtensionTerminalProfile[] {
		const userConfiguredProfileNames = this._availableProfiles?.map(p => p.profileName) || [];
		// Allow a user defined profile to override an extension contributed profile with the same name
		return this._contributedProfiles?.filter(p => !userConfiguredProfileNames.includes(p.title)) || [];
	}

	constructor(
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ITerminalContributionService private readonly _terminalContributionService: ITerminalContributionService,
		@IExtensionService private readonly _extensionService: IExtensionService,
		@IRemoteAgentService private _remoteAgentService: IRemoteAgentService,
		@IWorkbenchEnvironmentService private readonly _environmentService: IWorkbenchEnvironmentService,
		@ITerminalInstanceService private readonly _terminalInstanceService: ITerminalInstanceService
	) {
		super();

		// in web, we don't want to show the dropdown unless there's a web extension
		// that contributes a profile
		this._register(this._extensionService.onDidChangeExtensions(() => this.refreshAvailableProfiles()));

		this._webExtensionContributedProfileContextKey = TerminalContextKeys.webExtensionContributedProfile.bindTo(this._contextKeyService);
		this._updateWebContextKey();
		this._profilesReadyPromise = this._remoteAgentService.getEnvironment()
			.then(() => {
				// Wait up to 20 seconds for profiles to be ready so it's assured that we know the actual
				// default terminal before launching the first terminal. This isn't expected to ever take
				// this long.
				this._profilesReadyBarrier = new AutoOpenBarrier(20000);
				return this._profilesReadyBarrier.wait().then(() => { });
			});
		this.refreshAvailableProfiles();
		this._setupConfigListener();
	}

	private async _setupConfigListener(): Promise<void> {
		const platformKey = await this.getPlatformKey();

		this._register(this._configurationService.onDidChangeConfiguration(async e => {
			if (e.affectsConfiguration(TerminalSettingPrefix.AutomationProfile + platformKey) ||
				e.affectsConfiguration(TerminalSettingPrefix.DefaultProfile + platformKey) ||
				e.affectsConfiguration(TerminalSettingPrefix.Profiles + platformKey) ||
				e.affectsConfiguration(TerminalSettingId.UseWslProfiles)) {
				if (e.source !== ConfigurationTarget.DEFAULT) {
					// when _refreshPlatformConfig is called within refreshAvailableProfiles
					// on did change configuration is fired. this can lead to an infinite recursion
					this.refreshAvailableProfiles();
					this._platformConfigJustRefreshed = false;
				} else {
					this._platformConfigJustRefreshed = true;
				}
			}
		}));
	}

	getDefaultProfileName(): string | undefined {
		return this._defaultProfileName;
	}

	getDefaultProfile(os?: OperatingSystem): ITerminalProfile | undefined {
		let defaultProfileName: string | undefined;
		if (os) {
			defaultProfileName = this._configurationService.getValue(`${TerminalSettingPrefix.DefaultProfile}${this._getOsKey(os)}`);
			if (!defaultProfileName || !isString(defaultProfileName)) {
				return undefined;
			}
		} else {
			defaultProfileName = this._defaultProfileName;
		}
		if (!defaultProfileName) {
			return undefined;
		}

		// IMPORTANT: Only allow the default profile name to find non-auto detected profiles as
		// to avoid unsafe path profiles being picked up.
		return this.availableProfiles.find(e => e.profileName === defaultProfileName && !e.isAutoDetected);
	}

	private _getOsKey(os: OperatingSystem): string {
		switch (os) {
			case OperatingSystem.Linux: return 'linux';
			case OperatingSystem.Macintosh: return 'osx';
			case OperatingSystem.Windows: return 'windows';
		}
	}


	@throttle(2000)
	refreshAvailableProfiles(): void {
		this._refreshAvailableProfilesNow();
	}

	protected async _refreshAvailableProfilesNow(): Promise<void> {
		// Profiles
		const profiles = await this._detectProfiles(true);
		const profilesChanged = !arrays.equals(profiles, this._availableProfiles, profilesEqual);
		// Contributed profiles
		const contributedProfilesChanged = await this._updateContributedProfiles();
		// Automation profiles
		const platform = await this.getPlatformKey();
		const automationProfile = this._configurationService.getValue<ITerminalExecutable | null | undefined>(`${TerminalSettingPrefix.AutomationProfile}${platform}`);
		const automationProfileChanged = !objects.equals(automationProfile, this._automationProfile);
		// Update
		if (profilesChanged || contributedProfilesChanged || automationProfileChanged) {
			this._availableProfiles = profiles;
			this._automationProfile = automationProfile;
			this._onDidChangeAvailableProfiles.fire(this._availableProfiles);
			this._profilesReadyBarrier!.open();
			this._updateWebContextKey();
			await this._refreshPlatformConfig(this._availableProfiles);
		}
	}

	private async _updateContributedProfiles(): Promise<boolean> {
		const platformKey = await this.getPlatformKey();
		const excludedContributedProfiles: string[] = [];
		const configProfiles: { [key: string]: ITerminalExecutable | null | undefined } = this._configurationService.getValue(TerminalSettingPrefix.Profiles + platformKey);
		for (const [profileName, value] of Object.entries(configProfiles)) {
			if (value === null) {
				excludedContributedProfiles.push(profileName);
			}
		}
		const filteredContributedProfiles = Array.from(this._terminalContributionService.terminalProfiles.filter(p => !excludedContributedProfiles.includes(p.title)));
		const contributedProfilesChanged = !arrays.equals(filteredContributedProfiles, this._contributedProfiles, contributedProfilesEqual);
		this._contributedProfiles = filteredContributedProfiles;
		return contributedProfilesChanged;
	}

	getContributedProfileProvider(extensionIdentifier: string, id: string): ITerminalProfileProvider | undefined {
		const extMap = this._profileProviders.get(extensionIdentifier);
		return extMap?.get(id);
	}

	private async _detectProfiles(includeDetectedProfiles?: boolean): Promise<ITerminalProfile[]> {
		const primaryBackend = await this._terminalInstanceService.getBackend(this._environmentService.remoteAuthority);
		if (!primaryBackend) {
			return this._availableProfiles || [];
		}
		const platform = await this.getPlatformKey();
		this._defaultProfileName = this._configurationService.getValue(`${TerminalSettingPrefix.DefaultProfile}${platform}`) ?? undefined;
		return primaryBackend.getProfiles(this._configurationService.getValue(`${TerminalSettingPrefix.Profiles}${platform}`), this._defaultProfileName, includeDetectedProfiles);
	}

	private _updateWebContextKey(): void {
		this._webExtensionContributedProfileContextKey.set(isWeb && this._contributedProfiles.length > 0);
	}

	private async _refreshPlatformConfig(profiles: ITerminalProfile[]) {
		const env = await this._remoteAgentService.getEnvironment();
		registerTerminalDefaultProfileConfiguration({ os: env?.os || OS, profiles }, this._contributedProfiles);
		this._refreshTerminalActionsDisposable.value = refreshTerminalActions(profiles);
	}

	async getPlatformKey(): Promise<string> {
		const env = await this._remoteAgentService.getEnvironment();
		if (env) {
			return env.os === OperatingSystem.Windows ? 'windows' : (env.os === OperatingSystem.Macintosh ? 'osx' : 'linux');
		}
		return isWindows ? 'windows' : (isMacintosh ? 'osx' : 'linux');
	}

	registerTerminalProfileProvider(extensionIdentifier: string, id: string, profileProvider: ITerminalProfileProvider): IDisposable {
		let extMap = this._profileProviders.get(extensionIdentifier);
		if (!extMap) {
			extMap = new Map();
			this._profileProviders.set(extensionIdentifier, extMap);
		}
		extMap.set(id, profileProvider);
		return toDisposable(() => this._profileProviders.delete(id));
	}

	async registerContributedProfile(args: IRegisterContributedProfileArgs): Promise<void> {
		const platformKey = await this.getPlatformKey();
		const profilesConfig = await this._configurationService.getValue(`${TerminalSettingPrefix.Profiles}${platformKey}`);
		if (typeof profilesConfig === 'object') {
			const newProfile: IExtensionTerminalProfile = {
				extensionIdentifier: args.extensionIdentifier,
				icon: args.options.icon,
				id: args.id,
				title: args.title,
				color: args.options.color
			};

			(profilesConfig as { [key: string]: ITerminalProfileObject })[args.title] = newProfile;
		}
		await this._configurationService.updateValue(`${TerminalSettingPrefix.Profiles}${platformKey}`, profilesConfig, ConfigurationTarget.USER);
		return;
	}

	async getContributedDefaultProfile(shellLaunchConfig: IShellLaunchConfig): Promise<IExtensionTerminalProfile | undefined> {
		// prevents recursion with the MainThreadTerminalService call to create terminal
		// and defers to the provided launch config when an executable is provided
		if (shellLaunchConfig && !shellLaunchConfig.extHostTerminalId && !hasKey(shellLaunchConfig, { executable: true })) {
			const key = await this.getPlatformKey();
			const defaultProfileName = this._configurationService.getValue(`${TerminalSettingPrefix.DefaultProfile}${key}`);
			const contributedDefaultProfile = this.contributedProfiles.find(p => p.title === defaultProfileName);
			return contributedDefaultProfile;
		}
		return undefined;
	}
}

function profilesEqual(one: ITerminalProfile, other: ITerminalProfile) {
	return one.profileName === other.profileName &&
		terminalProfileArgsMatch(one.args, other.args) &&
		one.color === other.color &&
		terminalIconsEqual(one.icon, other.icon) &&
		one.isAutoDetected === other.isAutoDetected &&
		one.isDefault === other.isDefault &&
		one.overrideName === other.overrideName &&
		one.path === other.path;
}

function contributedProfilesEqual(one: IExtensionTerminalProfile, other: IExtensionTerminalProfile) {
	return one.extensionIdentifier === other.extensionIdentifier &&
		one.color === other.color &&
		one.icon === other.icon &&
		one.id === other.id &&
		one.title === other.title;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalResizeDebouncer.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalResizeDebouncer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getWindow, runWhenWindowIdle } from '../../../../base/browser/dom.js';
import { debounce } from '../../../../base/common/decorators.js';
import { Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import type { XtermTerminal } from './xterm/xtermTerminal.js';

const enum Constants {
	/**
	 * The _normal_ buffer length threshold at which point resizing starts being debounced.
	 */
	StartDebouncingThreshold = 200,
}

export class TerminalResizeDebouncer extends Disposable {
	private _latestX: number = 0;
	private _latestY: number = 0;

	private readonly _resizeXJob = this._register(new MutableDisposable());
	private readonly _resizeYJob = this._register(new MutableDisposable());

	constructor(
		private readonly _isVisible: () => boolean,
		private readonly _getXterm: () => XtermTerminal | undefined,
		private readonly _resizeBothCallback: (cols: number, rows: number) => void,
		private readonly _resizeXCallback: (cols: number) => void,
		private readonly _resizeYCallback: (rows: number) => void,
	) {
		super();
	}

	async resize(cols: number, rows: number, immediate: boolean): Promise<void> {
		this._latestX = cols;
		this._latestY = rows;

		// Resize immediately if requested explicitly or if the buffer is small
		if (immediate || this._getXterm()!.raw.buffer.normal.length < Constants.StartDebouncingThreshold) {
			this._resizeXJob.clear();
			this._resizeYJob.clear();
			this._resizeBothCallback(cols, rows);
			return;
		}

		// Resize in an idle callback if the terminal is not visible
		const win = getWindow(this._getXterm()!.raw.element);
		if (win && !this._isVisible()) {
			if (!this._resizeXJob.value) {
				this._resizeXJob.value = runWhenWindowIdle(win, async () => {
					this._resizeXCallback(this._latestX);
					this._resizeXJob.clear();
				});
			}
			if (!this._resizeYJob.value) {
				this._resizeYJob.value = runWhenWindowIdle(win, async () => {
					this._resizeYCallback(this._latestY);
					this._resizeYJob.clear();
				});
			}
			return;
		}

		// Update dimensions independently as vertical resize is cheap and horizontal resize is
		// expensive due to reflow.
		this._resizeYCallback(rows);
		this._latestX = cols;
		this._debounceResizeX(cols);
	}

	flush(): void {
		if (this._resizeXJob.value || this._resizeYJob.value) {
			this._resizeXJob.clear();
			this._resizeYJob.clear();
			this._resizeBothCallback(this._latestX, this._latestY);
		}
	}

	@debounce(100)
	private _debounceResizeX(cols: number) {
		this._resizeXCallback(cols);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalService.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as domStylesheets from '../../../../base/browser/domStylesheets.js';
import * as cssValue from '../../../../base/browser/cssValue.js';
import { DeferredPromise, timeout, type MaybePromise } from '../../../../base/common/async.js';
import { debounce, memoize } from '../../../../base/common/decorators.js';
import { DynamicListEventMultiplexer, Emitter, Event, IDynamicListEventMultiplexer } from '../../../../base/common/event.js';
import { Disposable, DisposableStore, dispose, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { isMacintosh, isWeb } from '../../../../base/common/platform.js';
import { URI } from '../../../../base/common/uri.js';
import { IKeyMods } from '../../../../platform/quickinput/common/quickInput.js';
import * as nls from '../../../../nls.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { ICreateContributedTerminalProfileOptions, IExtensionTerminalProfile, IPtyHostAttachTarget, IRawTerminalInstanceLayoutInfo, IRawTerminalTabLayoutInfo, IShellLaunchConfig, ITerminalBackend, ITerminalLaunchError, ITerminalLogService, ITerminalsLayoutInfo, ITerminalsLayoutInfoById, TerminalExitReason, TerminalLocation, TitleEventSource } from '../../../../platform/terminal/common/terminal.js';
import { formatMessageForTerminal } from '../../../../platform/terminal/common/terminalStrings.js';
import { iconForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { getIconRegistry } from '../../../../platform/theme/common/iconRegistry.js';
import { isDark } from '../../../../platform/theme/common/theme.js';
import { IThemeService, Themable } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { VirtualWorkspaceContext } from '../../../common/contextkeys.js';
import { ICreateTerminalOptions, IDetachedTerminalInstance, IDetachedXTermOptions, IRequestAddInstanceToGroupEvent, ITerminalConfigurationService, ITerminalEditorService, ITerminalGroup, ITerminalGroupService, ITerminalInstance, ITerminalInstanceHost, ITerminalInstanceService, ITerminalLocationOptions, ITerminalService, ITerminalServiceNativeDelegate, TerminalConnectionState, TerminalEditorLocation } from './terminal.js';
import { getCwdForSplit } from './terminalActions.js';
import { TerminalEditorInput } from './terminalEditorInput.js';
import { getColorStyleContent, getUriClasses } from './terminalIcon.js';
import { TerminalProfileQuickpick } from './terminalProfileQuickpick.js';
import { getInstanceFromResource, getTerminalUri, parseTerminalUri } from './terminalUri.js';
import { IRemoteTerminalAttachTarget, IStartExtensionTerminalRequest, ITerminalProcessExtHostProxy, ITerminalProfileService } from '../common/terminal.js';
import { TerminalContextKeys } from '../common/terminalContextKey.js';
import { columnToEditorGroup } from '../../../services/editor/common/editorGroupColumn.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { ACTIVE_GROUP, ACTIVE_GROUP_TYPE, AUX_WINDOW_GROUP, AUX_WINDOW_GROUP_TYPE, IEditorService, SIDE_GROUP, SIDE_GROUP_TYPE } from '../../../services/editor/common/editorService.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { ILifecycleService, ShutdownReason, StartupKind, WillShutdownEvent } from '../../../services/lifecycle/common/lifecycle.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';
import { XtermTerminal } from './xterm/xtermTerminal.js';
import { TerminalInstance } from './terminalInstance.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { TerminalCapabilityStore } from '../../../../platform/terminal/common/capabilities/terminalCapabilityStore.js';
import { ITimerService } from '../../../services/timer/browser/timerService.js';
import { mark } from '../../../../base/common/performance.js';
import { DetachedTerminal } from './detachedTerminal.js';
import { ITerminalCapabilityImplMap, TerminalCapability } from '../../../../platform/terminal/common/capabilities/capabilities.js';
import { createInstanceCapabilityEventMultiplexer } from './terminalEvents.js';
import { isAuxiliaryWindow, mainWindow } from '../../../../base/browser/window.js';
import { GroupIdentifier } from '../../../common/editor.js';
import { getActiveWindow } from '../../../../base/browser/dom.js';
import { hasKey, isString } from '../../../../base/common/types.js';

interface IBackgroundTerminal {
	instance: ITerminalInstance;
	terminalLocationOptions?: ITerminalLocationOptions;
}

export class TerminalService extends Disposable implements ITerminalService {
	declare _serviceBrand: undefined;

	private _hostActiveTerminals: Map<ITerminalInstanceHost, ITerminalInstance | undefined> = new Map();

	private _detachedXterms = new Set<IDetachedTerminalInstance>();
	private _terminalEditorActive: IContextKey<boolean>;
	private readonly _terminalShellTypeContextKey: IContextKey<string>;

	private _isShuttingDown: boolean = false;
	private _backgroundedTerminalInstances: IBackgroundTerminal[] = [];
	private _backgroundedTerminalDisposables: Map<number, IDisposable[]> = new Map();
	private _processSupportContextKey: IContextKey<boolean>;

	private _primaryBackend?: ITerminalBackend;
	private _terminalHasBeenCreated: IContextKey<boolean>;
	private _terminalCountContextKey: IContextKey<number>;
	private _nativeDelegate?: ITerminalServiceNativeDelegate;
	private _shutdownWindowCount?: number;

	get isProcessSupportRegistered(): boolean { return !!this._processSupportContextKey.get(); }

	private _connectionState: TerminalConnectionState = TerminalConnectionState.Connecting;
	get connectionState(): TerminalConnectionState { return this._connectionState; }

	private readonly _whenConnected = new DeferredPromise<void>();
	get whenConnected(): Promise<void> { return this._whenConnected.p; }

	private _restoredGroupCount: number = 0;
	get restoredGroupCount(): number { return this._restoredGroupCount; }

	get instances(): ITerminalInstance[] {
		return this._terminalGroupService.instances.concat(this._terminalEditorService.instances).concat(this._backgroundedTerminalInstances.map(bg => bg.instance));
	}
	/** Gets all non-background terminals. */
	get foregroundInstances(): ITerminalInstance[] {
		return this._terminalGroupService.instances.concat(this._terminalEditorService.instances);
	}
	get detachedInstances(): Iterable<IDetachedTerminalInstance> {
		return this._detachedXterms;
	}

	private _reconnectedTerminalGroups: Promise<ITerminalGroup[]> | undefined;

	private _reconnectedTerminals: Map<string, ITerminalInstance[]> = new Map();
	getReconnectedTerminals(reconnectionOwner: string): ITerminalInstance[] | undefined {
		return this._reconnectedTerminals.get(reconnectionOwner);
	}

	private _activeInstance: ITerminalInstance | undefined;
	get activeInstance(): ITerminalInstance | undefined {
		// Check if either an editor or panel terminal has focus and return that, regardless of the
		// value of _activeInstance. This avoids terminals created in the panel for example stealing
		// the active status even when it's not focused.
		for (const activeHostTerminal of this._hostActiveTerminals.values()) {
			if (activeHostTerminal?.hasFocus) {
				return activeHostTerminal;
			}
		}
		// Fallback to the last recorded active terminal if neither have focus
		return this._activeInstance;
	}

	private readonly _onDidCreateInstance = this._register(new Emitter<ITerminalInstance>());
	get onDidCreateInstance(): Event<ITerminalInstance> { return this._onDidCreateInstance.event; }
	private readonly _onDidChangeInstanceDimensions = this._register(new Emitter<ITerminalInstance>());
	get onDidChangeInstanceDimensions(): Event<ITerminalInstance> { return this._onDidChangeInstanceDimensions.event; }
	private readonly _onDidRegisterProcessSupport = this._register(new Emitter<void>());
	get onDidRegisterProcessSupport(): Event<void> { return this._onDidRegisterProcessSupport.event; }
	private readonly _onDidChangeConnectionState = this._register(new Emitter<void>());
	get onDidChangeConnectionState(): Event<void> { return this._onDidChangeConnectionState.event; }
	private readonly _onDidRequestStartExtensionTerminal = this._register(new Emitter<IStartExtensionTerminalRequest>());
	get onDidRequestStartExtensionTerminal(): Event<IStartExtensionTerminalRequest> { return this._onDidRequestStartExtensionTerminal.event; }

	// ITerminalInstanceHost events
	private readonly _onDidDisposeInstance = this._register(new Emitter<ITerminalInstance>());
	get onDidDisposeInstance(): Event<ITerminalInstance> { return this._onDidDisposeInstance.event; }
	private readonly _onDidFocusInstance = this._register(new Emitter<ITerminalInstance>());
	get onDidFocusInstance(): Event<ITerminalInstance> { return this._onDidFocusInstance.event; }
	private readonly _onDidChangeActiveInstance = this._register(new Emitter<ITerminalInstance | undefined>());
	get onDidChangeActiveInstance(): Event<ITerminalInstance | undefined> { return this._onDidChangeActiveInstance.event; }
	private readonly _onDidChangeInstances = this._register(new Emitter<void>());
	get onDidChangeInstances(): Event<void> { return this._onDidChangeInstances.event; }
	private readonly _onDidChangeInstanceCapability = this._register(new Emitter<ITerminalInstance>());
	get onDidChangeInstanceCapability(): Event<ITerminalInstance> { return this._onDidChangeInstanceCapability.event; }

	// Terminal view events
	private readonly _onDidChangeActiveGroup = this._register(new Emitter<ITerminalGroup | undefined>());
	get onDidChangeActiveGroup(): Event<ITerminalGroup | undefined> { return this._onDidChangeActiveGroup.event; }

	// Lazily initialized events that fire when the specified event fires on _any_ terminal
	// TODO: Batch events
	@memoize get onAnyInstanceData() { return this._register(this.createOnInstanceEvent(instance => Event.map(instance.onData, data => ({ instance, data })))).event; }
	@memoize get onAnyInstanceDataInput() { return this._register(this.createOnInstanceEvent(e => Event.map(e.onDidInputData, () => e, e.store))).event; }
	@memoize get onAnyInstanceIconChange() { return this._register(this.createOnInstanceEvent(e => e.onIconChanged)).event; }
	@memoize get onAnyInstanceMaximumDimensionsChange() { return this._register(this.createOnInstanceEvent(e => Event.map(e.onMaximumDimensionsChanged, () => e, e.store))).event; }
	@memoize get onAnyInstancePrimaryStatusChange() { return this._register(this.createOnInstanceEvent(e => Event.map(e.statusList.onDidChangePrimaryStatus, () => e, e.store))).event; }
	@memoize get onAnyInstanceProcessIdReady() { return this._register(this.createOnInstanceEvent(e => e.onProcessIdReady)).event; }
	@memoize get onAnyInstanceSelectionChange() { return this._register(this.createOnInstanceEvent(e => e.onDidChangeSelection)).event; }
	@memoize get onAnyInstanceTitleChange() { return this._register(this.createOnInstanceEvent(e => e.onTitleChanged)).event; }
	@memoize get onAnyInstanceShellTypeChanged() { return this._register(this.createOnInstanceEvent(e => Event.map(e.onDidChangeShellType, () => e))).event; }
	@memoize get onAnyInstanceAddedCapabilityType() { return this._register(this.createOnInstanceEvent(e => Event.map(e.capabilities.onDidAddCapability, e => e.id))).event; }

	constructor(
		@IContextKeyService private _contextKeyService: IContextKeyService,
		@ILifecycleService private readonly _lifecycleService: ILifecycleService,
		@ITerminalLogService private readonly _logService: ITerminalLogService,
		@IDialogService private _dialogService: IDialogService,
		@IInstantiationService private _instantiationService: IInstantiationService,
		@IRemoteAgentService private _remoteAgentService: IRemoteAgentService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IWorkbenchEnvironmentService private readonly _environmentService: IWorkbenchEnvironmentService,
		@ITerminalConfigurationService private readonly _terminalConfigurationService: ITerminalConfigurationService,
		@ITerminalEditorService private readonly _terminalEditorService: ITerminalEditorService,
		@ITerminalGroupService private readonly _terminalGroupService: ITerminalGroupService,
		@ITerminalInstanceService private readonly _terminalInstanceService: ITerminalInstanceService,
		@IEditorGroupsService private readonly _editorGroupsService: IEditorGroupsService,
		@ITerminalProfileService private readonly _terminalProfileService: ITerminalProfileService,
		@IExtensionService private readonly _extensionService: IExtensionService,
		@INotificationService private readonly _notificationService: INotificationService,
		@IWorkspaceContextService private readonly _workspaceContextService: IWorkspaceContextService,
		@ICommandService private readonly _commandService: ICommandService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@ITimerService private readonly _timerService: ITimerService
	) {
		super();

		// the below avoids having to poll routinely.
		// we update detected profiles when an instance is created so that,
		// for example, we detect if you've installed a pwsh
		this._register(this.onDidCreateInstance(() => this._terminalProfileService.refreshAvailableProfiles()));
		this._forwardInstanceHostEvents(this._terminalGroupService);
		this._forwardInstanceHostEvents(this._terminalEditorService);
		this._register(this._terminalGroupService.onDidChangeActiveGroup(this._onDidChangeActiveGroup.fire, this._onDidChangeActiveGroup));
		this._register(this._terminalInstanceService.onDidCreateInstance(instance => {
			this._initInstanceListeners(instance);
			this._onDidCreateInstance.fire(instance);
		}));

		// Hide the panel if there are no more instances, provided that VS Code is not shutting
		// down. When shutting down the panel is locked in place so that it is restored upon next
		// launch.
		this._register(this._terminalGroupService.onDidChangeActiveInstance(instance => {
			if (!instance && !this._isShuttingDown && this._terminalConfigurationService.config.hideOnLastClosed) {
				this._terminalGroupService.hidePanel();
			}
			if (instance?.shellType) {
				this._terminalShellTypeContextKey.set(instance.shellType.toString());
			} else if (!instance || !(instance.shellType)) {
				this._terminalShellTypeContextKey.reset();
			}
		}));

		this._handleInstanceContextKeys();
		this._terminalShellTypeContextKey = TerminalContextKeys.shellType.bindTo(this._contextKeyService);
		this._processSupportContextKey = TerminalContextKeys.processSupported.bindTo(this._contextKeyService);
		this._processSupportContextKey.set(!isWeb || this._remoteAgentService.getConnection() !== null);
		this._terminalHasBeenCreated = TerminalContextKeys.terminalHasBeenCreated.bindTo(this._contextKeyService);
		this._terminalCountContextKey = TerminalContextKeys.count.bindTo(this._contextKeyService);
		this._terminalEditorActive = TerminalContextKeys.terminalEditorActive.bindTo(this._contextKeyService);

		this._register(this.onDidChangeActiveInstance(instance => {
			this._terminalEditorActive.set(!!instance?.target && instance.target === TerminalLocation.Editor);
		}));

		this._register(_lifecycleService.onBeforeShutdown(async e => e.veto(this._onBeforeShutdown(e.reason), 'veto.terminal')));
		this._register(_lifecycleService.onWillShutdown(e => this._onWillShutdown(e)));

		this._initializePrimaryBackend();

		// Create async as the class depends on `this`
		timeout(0).then(() => this._register(this._instantiationService.createInstance(TerminalEditorStyle, mainWindow.document.head)));
	}

	async showProfileQuickPick(type: 'setDefault' | 'createInstance', cwd?: string | URI): Promise<ITerminalInstance | undefined> {
		const quickPick = this._instantiationService.createInstance(TerminalProfileQuickpick);
		const result = await quickPick.showAndGetResult(type);
		if (!result) {
			return;
		}
		if (isString(result)) {
			return;
		}
		const keyMods: IKeyMods | undefined = result.keyMods;
		if (type === 'createInstance') {
			const activeInstance = this.getDefaultInstanceHost().activeInstance;
			const defaultLocation = this._terminalConfigurationService.defaultLocation;
			let instance;

			if (result.config && hasKey(result.config, { id: true })) {
				await this.createContributedTerminalProfile(result.config.extensionIdentifier, result.config.id, {
					icon: result.config.options?.icon,
					color: result.config.options?.color,
					location: !!(keyMods?.alt && activeInstance) ? { splitActiveTerminal: true } : defaultLocation
				});
				return;
			} else if (result.config && hasKey(result.config, { profileName: true })) {
				if (keyMods?.alt && activeInstance) {
					// create split, only valid if there's an active instance
					instance = await this.createTerminal({ location: { parentTerminal: activeInstance }, config: result.config, cwd });
				} else {
					instance = await this.createTerminal({ location: defaultLocation, config: result.config, cwd });
				}
			}

			if (instance && defaultLocation !== TerminalLocation.Editor) {
				this._terminalGroupService.showPanel(true);
				this.setActiveInstance(instance);
				return instance;
			}
		}
		return undefined;
	}

	private async _initializePrimaryBackend() {
		mark('code/terminal/willGetTerminalBackend');
		this._primaryBackend = await this._terminalInstanceService.getBackend(this._environmentService.remoteAuthority);
		mark('code/terminal/didGetTerminalBackend');
		const enableTerminalReconnection = this._terminalConfigurationService.config.enablePersistentSessions;

		// Connect to the extension host if it's there, set the connection state to connected when
		// it's done. This should happen even when there is no extension host.
		this._connectionState = TerminalConnectionState.Connecting;

		const isPersistentRemote = !!this._environmentService.remoteAuthority && enableTerminalReconnection;

		if (this._primaryBackend) {
			this._register(this._primaryBackend.onDidRequestDetach(async (e) => {
				const instanceToDetach = this.getInstanceFromResource(getTerminalUri(e.workspaceId, e.instanceId));
				if (instanceToDetach) {
					const persistentProcessId = instanceToDetach?.persistentProcessId;
					if (persistentProcessId && !instanceToDetach.shellLaunchConfig.isFeatureTerminal && !instanceToDetach.shellLaunchConfig.customPtyImplementation) {
						if (instanceToDetach.target === TerminalLocation.Editor) {
							this._terminalEditorService.detachInstance(instanceToDetach);
						} else {
							this._terminalGroupService.getGroupForInstance(instanceToDetach)?.removeInstance(instanceToDetach);
						}
						await instanceToDetach.detachProcessAndDispose(TerminalExitReason.User);
						await this._primaryBackend?.acceptDetachInstanceReply(e.requestId, persistentProcessId);
					} else {
						// will get rejected without a persistentProcessId to attach to
						await this._primaryBackend?.acceptDetachInstanceReply(e.requestId, undefined);
					}
				}
			}));
		}

		mark('code/terminal/willReconnect');
		let reconnectedPromise: Promise<unknown>;
		if (isPersistentRemote) {
			reconnectedPromise = this._reconnectToRemoteTerminals();
		} else if (enableTerminalReconnection) {
			reconnectedPromise = this._reconnectToLocalTerminals();
		} else {
			reconnectedPromise = Promise.resolve();
		}
		reconnectedPromise.then(async () => {
			this._setConnected();
			mark('code/terminal/didReconnect');
			mark('code/terminal/willReplay');
			const instances = await this._reconnectedTerminalGroups?.then(groups => groups.map(e => e.terminalInstances).flat()) ?? [];
			await Promise.all(instances.map(e => new Promise<void>(r => Event.once(e.onProcessReplayComplete)(r))));
			mark('code/terminal/didReplay');
			mark('code/terminal/willGetPerformanceMarks');
			await Promise.all(Array.from(this._terminalInstanceService.getRegisteredBackends()).map(async backend => {
				this._timerService.setPerformanceMarks(backend.remoteAuthority === undefined ? 'localPtyHost' : 'remotePtyHost', await backend.getPerformanceMarks());
				backend.setReady();
			}));
			mark('code/terminal/didGetPerformanceMarks');
			this._whenConnected.complete();
		});
	}

	getPrimaryBackend(): ITerminalBackend | undefined {
		return this._primaryBackend;
	}

	async setNextCommandId(id: number, commandLine: string, commandId: string): Promise<void> {
		if (!this._primaryBackend || id <= 0) {
			return;
		}
		await this._primaryBackend.setNextCommandId(id, commandLine, commandId);
	}

	private _forwardInstanceHostEvents(host: ITerminalInstanceHost) {
		this._register(host.onDidChangeInstances(this._onDidChangeInstances.fire, this._onDidChangeInstances));
		this._register(host.onDidDisposeInstance(this._onDidDisposeInstance.fire, this._onDidDisposeInstance));
		this._register(host.onDidChangeActiveInstance(instance => this._evaluateActiveInstance(host, instance)));
		this._register(host.onDidFocusInstance(instance => {
			this._onDidFocusInstance.fire(instance);
			this._evaluateActiveInstance(host, instance);
		}));
		this._register(host.onDidChangeInstanceCapability((instance) => {
			this._onDidChangeInstanceCapability.fire(instance);
		}));
		this._hostActiveTerminals.set(host, undefined);
	}

	private _evaluateActiveInstance(host: ITerminalInstanceHost, instance: ITerminalInstance | undefined) {
		// Track the latest active terminal for each host so that when one becomes undefined, the
		// TerminalService's active terminal is set to the last active terminal from the other host.
		// This means if the last terminal editor is closed such that it becomes undefined, the last
		// active group's terminal will be used as the active terminal if available.
		this._hostActiveTerminals.set(host, instance);
		if (instance === undefined) {
			for (const active of this._hostActiveTerminals.values()) {
				if (active) {
					instance = active;
				}
			}
		}
		this._activeInstance = instance;
		this._onDidChangeActiveInstance.fire(instance);
	}

	setActiveInstance(value: ITerminalInstance | undefined) {
		// TODO@meganrogge: Is this the right logic for when instance is undefined?
		if (!value) {
			return;
		}
		// If this was a hideFromUser terminal created by the API this was triggered by show,
		// in which case we need to create the terminal group
		if (value.shellLaunchConfig.hideFromUser) {
			this.showBackgroundTerminal(value);
		}
		if (value.target === TerminalLocation.Editor) {
			this._terminalEditorService.setActiveInstance(value);
		} else {
			this._terminalGroupService.setActiveInstance(value);
		}
	}

	async focusInstance(instance: ITerminalInstance): Promise<void> {
		if (instance.target === TerminalLocation.Editor) {
			return this._terminalEditorService.focusInstance(instance);
		}
		return this._terminalGroupService.focusInstance(instance);
	}

	async focusActiveInstance(): Promise<void> {
		if (!this._activeInstance) {
			return;
		}
		return this.focusInstance(this._activeInstance);
	}

	async createContributedTerminalProfile(extensionIdentifier: string, id: string, options: ICreateContributedTerminalProfileOptions): Promise<void> {
		await this._extensionService.activateByEvent(`onTerminalProfile:${id}`);

		const profileProvider = this._terminalProfileService.getContributedProfileProvider(extensionIdentifier, id);
		if (!profileProvider) {
			this._notificationService.error(`No terminal profile provider registered for id "${id}"`);
			return;
		}
		try {
			await profileProvider.createContributedTerminalProfile(options);
			this._terminalGroupService.setActiveInstanceByIndex(this._terminalGroupService.instances.length - 1);
			await this._terminalGroupService.activeInstance?.focusWhenReady();
		} catch (e) {
			this._notificationService.error(e.message);
		}
	}

	async safeDisposeTerminal(instance: ITerminalInstance): Promise<void> {
		// Confirm on kill in the editor is handled by the editor input
		if (instance.target !== TerminalLocation.Editor &&
			instance.hasChildProcesses &&
			(this._terminalConfigurationService.config.confirmOnKill === 'panel' || this._terminalConfigurationService.config.confirmOnKill === 'always')) {
			const veto = await this._showTerminalCloseConfirmation(true);
			if (veto) {
				return;
			}
		}
		return new Promise<void>(r => {
			Event.once(instance.onExit)(() => r());
			instance.dispose(TerminalExitReason.User);
		});
	}

	private _setConnected() {
		this._connectionState = TerminalConnectionState.Connected;
		this._onDidChangeConnectionState.fire();
		this._logService.trace('Pty host ready');
	}

	private async _reconnectToRemoteTerminals(): Promise<void> {
		const remoteAuthority = this._environmentService.remoteAuthority;
		if (!remoteAuthority) {
			return;
		}
		const backend = await this._terminalInstanceService.getBackend(remoteAuthority);
		if (!backend) {
			return;
		}
		mark('code/terminal/willGetTerminalLayoutInfo');
		const layoutInfo = await backend.getTerminalLayoutInfo();
		mark('code/terminal/didGetTerminalLayoutInfo');
		backend.reduceConnectionGraceTime();
		mark('code/terminal/willRecreateTerminalGroups');
		await this._recreateTerminalGroups(layoutInfo);
		mark('code/terminal/didRecreateTerminalGroups');
		// now that terminals have been restored,
		// attach listeners to update remote when terminals are changed
		this._attachProcessLayoutListeners();

		this._logService.trace('Reconnected to remote terminals');
	}

	private async _reconnectToLocalTerminals(): Promise<void> {
		const localBackend = await this._terminalInstanceService.getBackend();
		if (!localBackend) {
			return;
		}
		mark('code/terminal/willGetTerminalLayoutInfo');
		const layoutInfo = await localBackend.getTerminalLayoutInfo();
		mark('code/terminal/didGetTerminalLayoutInfo');
		if (layoutInfo && (layoutInfo.tabs.length > 0 || layoutInfo?.background?.length)) {
			mark('code/terminal/willRecreateTerminalGroups');
			this._reconnectedTerminalGroups = this._recreateTerminalGroups(layoutInfo);
			const revivedInstances = await this._reviveBackgroundTerminalInstances(layoutInfo.background || []);
			this._backgroundedTerminalInstances = revivedInstances.map(instance => ({ instance }));
			mark('code/terminal/didRecreateTerminalGroups');
		}
		// now that terminals have been restored,
		// attach listeners to update local state when terminals are changed
		this._attachProcessLayoutListeners();

		this._logService.trace('Reconnected to local terminals');
	}

	private _recreateTerminalGroups(layoutInfo?: ITerminalsLayoutInfo): Promise<ITerminalGroup[]> {
		const groupPromises: Promise<ITerminalGroup | undefined>[] = [];
		let activeGroup: Promise<ITerminalGroup | undefined> | undefined;
		if (layoutInfo) {
			for (const tabLayout of layoutInfo.tabs) {
				const terminalLayouts = tabLayout.terminals.filter(t => t.terminal && t.terminal.isOrphan);
				if (terminalLayouts.length) {
					this._restoredGroupCount += terminalLayouts.length;
					const promise = this._recreateTerminalGroup(tabLayout, terminalLayouts);
					groupPromises.push(promise);
					if (tabLayout.isActive) {
						activeGroup = promise;
					}
					const activeInstance = this.instances.find(t => t.shellLaunchConfig.attachPersistentProcess?.id === tabLayout.activePersistentProcessId);
					if (activeInstance) {
						this.setActiveInstance(activeInstance);
					}
				}
			}
			if (layoutInfo.tabs.length) {
				activeGroup?.then(group => this._terminalGroupService.activeGroup = group);
			}
		}
		return Promise.all(groupPromises).then(result => result.filter(e => !!e) as ITerminalGroup[]);
	}

	private async _reviveBackgroundTerminalInstances(bgTerminals: (IPtyHostAttachTarget | null)[]): Promise<ITerminalInstance[]> {
		const instances: ITerminalInstance[] = [];
		for (const bg of bgTerminals) {
			const attachPersistentProcess = bg;
			if (!attachPersistentProcess) {
				continue;
			}
			const instance = await this.createTerminal({ config: { attachPersistentProcess, hideFromUser: true, forcePersist: true }, location: TerminalLocation.Panel });
			instances.push(instance);
		}
		return instances;
	}

	private async _recreateTerminalGroup(tabLayout: IRawTerminalTabLayoutInfo<IPtyHostAttachTarget | null>, terminalLayouts: IRawTerminalInstanceLayoutInfo<IPtyHostAttachTarget | null>[]): Promise<ITerminalGroup | undefined> {
		let lastInstance: Promise<ITerminalInstance> | undefined;
		for (const terminalLayout of terminalLayouts) {
			const attachPersistentProcess = terminalLayout.terminal!;
			if (this._lifecycleService.startupKind !== StartupKind.ReloadedWindow && attachPersistentProcess.type === 'Task') {
				continue;
			}
			mark(`code/terminal/willRecreateTerminal/${attachPersistentProcess.id}-${attachPersistentProcess.pid}`);
			lastInstance = this.createTerminal({
				config: { attachPersistentProcess },
				location: lastInstance ? { parentTerminal: lastInstance } : TerminalLocation.Panel
			});
			lastInstance.then(() => mark(`code/terminal/didRecreateTerminal/${attachPersistentProcess.id}-${attachPersistentProcess.pid}`));
		}
		const group = lastInstance?.then(instance => {
			const g = this._terminalGroupService.getGroupForInstance(instance);
			g?.resizePanes(tabLayout.terminals.map(terminal => terminal.relativeSize));
			return g;
		});
		return group;
	}

	private _attachProcessLayoutListeners(): void {
		this._register(this.onDidChangeActiveGroup(() => this._saveState()));
		this._register(this.onDidChangeActiveInstance(() => this._saveState()));
		this._register(this.onDidChangeInstances(() => this._saveState()));
		// The state must be updated when the terminal is relaunched, otherwise the persistent
		// terminal ID will be stale and the process will be leaked.
		this._register(this.onAnyInstanceProcessIdReady(() => this._saveState()));
		this._register(this.onAnyInstanceTitleChange(instance => this._updateTitle(instance)));
		this._register(this.onAnyInstanceIconChange(e => this._updateIcon(e.instance, e.userInitiated)));
	}

	private _handleInstanceContextKeys(): void {
		const terminalIsOpenContext = TerminalContextKeys.isOpen.bindTo(this._contextKeyService);
		const updateTerminalContextKeys = () => {
			terminalIsOpenContext.set(this.instances.length > 0);
			this._terminalCountContextKey.set(this.instances.length);
		};
		this._register(this.onDidChangeInstances(() => updateTerminalContextKeys()));
	}

	async getActiveOrCreateInstance(options?: { acceptsInput?: boolean }): Promise<ITerminalInstance> {
		const activeInstance = this.activeInstance;
		// No instance, create
		if (!activeInstance) {
			return this.createTerminal();
		}
		// Active instance, ensure accepts input
		if (!options?.acceptsInput || activeInstance.xterm?.isStdinDisabled !== true) {
			return activeInstance;
		}
		// Active instance doesn't accept input, create and focus
		const instance = await this.createTerminal();
		this.setActiveInstance(instance);
		await this.revealActiveTerminal();
		return instance;
	}

	async revealTerminal(source: ITerminalInstance, preserveFocus?: boolean): Promise<void> {
		if (source.target === TerminalLocation.Editor) {
			await this._terminalEditorService.revealActiveEditor(preserveFocus);
		} else {
			await this._terminalGroupService.showPanel();
		}
	}

	async revealActiveTerminal(preserveFocus?: boolean): Promise<void> {
		const instance = this.activeInstance;
		if (!instance) {
			return;
		}
		await this.revealTerminal(instance, preserveFocus);
	}



	requestStartExtensionTerminal(proxy: ITerminalProcessExtHostProxy, cols: number, rows: number): Promise<ITerminalLaunchError | undefined> {
		// The initial request came from the extension host, no need to wait for it
		return new Promise<ITerminalLaunchError | undefined>(callback => {
			this._onDidRequestStartExtensionTerminal.fire({ proxy, cols, rows, callback });
		});
	}

	private _onBeforeShutdown(reason: ShutdownReason): MaybePromise<boolean> {
		// Never veto on web as this would block all windows from being closed. This disables
		// process revive as we can't handle it on shutdown.
		if (isWeb) {
			this._isShuttingDown = true;
			return false;
		}
		return this._onBeforeShutdownAsync(reason);
	}

	private async _onBeforeShutdownAsync(reason: ShutdownReason): Promise<boolean> {
		if (this.instances.length === 0) {
			// No terminal instances, don't veto
			return false;
		}

		// Persist terminal _buffer state_, note that even if this happens the dirty terminal prompt
		// still shows as that cannot be revived
		try {
			this._shutdownWindowCount = await this._nativeDelegate?.getWindowCount();
			const shouldReviveProcesses = this._shouldReviveProcesses(reason);
			if (shouldReviveProcesses) {
				// Attempt to persist the terminal state but only allow 2000ms as we can't block
				// shutdown. This can happen when in a remote workspace but the other side has been
				// suspended and is in the process of reconnecting, the message will be put in a
				// queue in this case for when the connection is back up and running. Aborting the
				// process is preferable in this case.
				await Promise.race([
					this._primaryBackend?.persistTerminalState(),
					timeout(2000)
				]);
			}

			// Persist terminal _processes_
			const shouldPersistProcesses = this._terminalConfigurationService.config.enablePersistentSessions && reason === ShutdownReason.RELOAD;
			if (!shouldPersistProcesses) {
				const hasDirtyInstances = (
					(this._terminalConfigurationService.config.confirmOnExit === 'always' && this.foregroundInstances.length > 0) ||
					(this._terminalConfigurationService.config.confirmOnExit === 'hasChildProcesses' && this.foregroundInstances.some(e => e.hasChildProcesses))
				);
				if (hasDirtyInstances) {
					return this._onBeforeShutdownConfirmation(reason);
				}
			}
		} catch (err: unknown) {
			// Swallow as exceptions should not cause a veto to prevent shutdown
			this._logService.warn('Exception occurred during terminal shutdown', err);
		}

		this._isShuttingDown = true;

		return false;
	}

	setNativeDelegate(nativeDelegate: ITerminalServiceNativeDelegate): void {
		this._nativeDelegate = nativeDelegate;
	}

	private _shouldReviveProcesses(reason: ShutdownReason): boolean {
		if (!this._terminalConfigurationService.config.enablePersistentSessions) {
			return false;
		}
		switch (this._terminalConfigurationService.config.persistentSessionReviveProcess) {
			case 'onExit': {
				// Allow on close if it's the last window on Windows or Linux
				if (reason === ShutdownReason.CLOSE && (this._shutdownWindowCount === 1 && !isMacintosh)) {
					return true;
				}
				return reason === ShutdownReason.LOAD || reason === ShutdownReason.QUIT;
			}
			case 'onExitAndWindowClose': return reason !== ShutdownReason.RELOAD;
			default: return false;
		}
	}

	private async _onBeforeShutdownConfirmation(reason: ShutdownReason): Promise<boolean> {
		// veto if configured to show confirmation and the user chose not to exit
		const veto = await this._showTerminalCloseConfirmation();
		if (!veto) {
			this._isShuttingDown = true;
		}

		return veto;
	}

	private _onWillShutdown(e: WillShutdownEvent): void {
		// Don't touch processes if the shutdown was a result of reload as they will be reattached
		const shouldPersistTerminals = this._terminalConfigurationService.config.enablePersistentSessions && e.reason === ShutdownReason.RELOAD;

		for (const instance of [...this._terminalGroupService.instances, ...this._backgroundedTerminalInstances.map(bg => bg.instance)]) {
			if (shouldPersistTerminals && instance.shouldPersist) {
				instance.detachProcessAndDispose(TerminalExitReason.Shutdown);
			} else {
				instance.dispose(TerminalExitReason.Shutdown);
			}
		}

		// Clear terminal layout info only when not persisting
		if (!shouldPersistTerminals && !this._shouldReviveProcesses(e.reason)) {
			this._primaryBackend?.setTerminalLayoutInfo(undefined);
		}
	}

	@debounce(500)
	private _saveState(): void {
		// Avoid saving state when shutting down as that would override process state to be revived
		if (this._isShuttingDown) {
			return;
		}
		if (!this._terminalConfigurationService.config.enablePersistentSessions) {
			return;
		}
		const tabs = this._terminalGroupService.groups.map(g => g.getLayoutInfo(g === this._terminalGroupService.activeGroup));
		const state: ITerminalsLayoutInfoById = { tabs, background: this._backgroundedTerminalInstances.map(bg => bg.instance).filter(i => i.shellLaunchConfig.forcePersist).map(i => i.persistentProcessId).filter((e): e is number => e !== undefined) };
		this._primaryBackend?.setTerminalLayoutInfo(state);
	}

	@debounce(500)
	private _updateTitle(instance: ITerminalInstance | undefined): void {
		if (!this._terminalConfigurationService.config.enablePersistentSessions || !instance || !instance.persistentProcessId || !instance.title || instance.isDisposed) {
			return;
		}
		if (instance.staticTitle) {
			this._primaryBackend?.updateTitle(instance.persistentProcessId, instance.staticTitle, TitleEventSource.Api);
		} else {
			this._primaryBackend?.updateTitle(instance.persistentProcessId, instance.title, instance.titleSource);
		}
	}

	@debounce(500)
	private _updateIcon(instance: ITerminalInstance, userInitiated: boolean): void {
		if (!this._terminalConfigurationService.config.enablePersistentSessions || !instance || !instance.persistentProcessId || !instance.icon || instance.isDisposed) {
			return;
		}
		this._primaryBackend?.updateIcon(instance.persistentProcessId, userInitiated, instance.icon, instance.color);
	}

	refreshActiveGroup(): void {
		this._onDidChangeActiveGroup.fire(this._terminalGroupService.activeGroup);
	}

	getInstanceFromId(terminalId: number): ITerminalInstance | undefined {
		let bgIndex = -1;
		this._backgroundedTerminalInstances.forEach((bg, i) => {
			if (bg.instance.instanceId === terminalId) {
				bgIndex = i;
			}
		});
		if (bgIndex !== -1) {
			return this._backgroundedTerminalInstances[bgIndex].instance;
		}
		try {
			return this.instances[this._getIndexFromId(terminalId)];
		} catch {
			return undefined;
		}
	}

	getInstanceFromResource(resource: URI | undefined): ITerminalInstance | undefined {
		return getInstanceFromResource(this.instances, resource);
	}

	openResource(resource: URI): void {
		const instance = this.getInstanceFromResource(resource);
		if (instance) {
			this.setActiveInstance(instance);
			this.revealTerminal(instance);
			const commands = instance.capabilities.get(TerminalCapability.CommandDetection)?.commands;
			const params = new URLSearchParams(resource.query);
			const relevantCommand = commands?.find(c => c.id === params.get('command'));
			if (relevantCommand) {
				instance.xterm?.markTracker.revealCommand(relevantCommand);
			}
		}
	}

	isAttachedToTerminal(remoteTerm: IRemoteTerminalAttachTarget): boolean {
		return this.instances.some(term => term.processId === remoteTerm.pid);
	}

	moveToEditor(source: ITerminalInstance, group?: GroupIdentifier | SIDE_GROUP_TYPE | ACTIVE_GROUP_TYPE | AUX_WINDOW_GROUP_TYPE): void {
		if (source.target === TerminalLocation.Editor) {
			return;
		}
		const sourceGroup = this._terminalGroupService.getGroupForInstance(source);
		if (!sourceGroup) {
			return;
		}
		sourceGroup.removeInstance(source);
		this._terminalEditorService.openEditor(source, group ? { viewColumn: group } : undefined);

	}

	moveIntoNewEditor(source: ITerminalInstance): void {
		this.moveToEditor(source, AUX_WINDOW_GROUP);
	}

	async moveToTerminalView(source?: ITerminalInstance | URI, target?: ITerminalInstance, side?: 'before' | 'after'): Promise<void> {
		if (URI.isUri(source)) {
			source = this.getInstanceFromResource(source);
		}

		if (!source) {
			return;
		}

		this._terminalEditorService.detachInstance(source);

		if (source.target !== TerminalLocation.Editor) {
			await this._terminalGroupService.showPanel(true);
			return;
		}
		source.target = TerminalLocation.Panel;

		let group: ITerminalGroup | undefined;
		if (target) {
			group = this._terminalGroupService.getGroupForInstance(target);
		}

		if (!group) {
			group = this._terminalGroupService.createGroup();
		}

		group.addInstance(source);
		this.setActiveInstance(source);
		await this._terminalGroupService.showPanel(true);

		if (target && side) {
			const index = group.terminalInstances.indexOf(target) + (side === 'after' ? 1 : 0);
			group.moveInstance(source, index, side);
		}

		// Fire events
		this._onDidChangeInstances.fire();
		this._onDidChangeActiveGroup.fire(this._terminalGroupService.activeGroup);
	}

	protected _initInstanceListeners(instance: ITerminalInstance): void {
		const instanceDisposables = new DisposableStore();
		instanceDisposables.add(instance.onDimensionsChanged(() => {
			this._onDidChangeInstanceDimensions.fire(instance);
			if (this._terminalConfigurationService.config.enablePersistentSessions && this.isProcessSupportRegistered) {
				this._saveState();
			}
		}));
		instanceDisposables.add(instance.onDidFocus(this._onDidChangeActiveInstance.fire, this._onDidChangeActiveInstance));
		instanceDisposables.add(instance.onRequestAddInstanceToGroup(async e => await this._addInstanceToGroup(instance, e)));
		instanceDisposables.add(instance.onDidChangeShellType(() => this._extensionService.activateByEvent(`onTerminal:${instance.shellType}`)));
		instanceDisposables.add(Event.runAndSubscribe(instance.capabilities.onDidAddCapability, (() => {
			if (instance.capabilities.has(TerminalCapability.CommandDetection)) {
				this._extensionService.activateByEvent(`onTerminalShellIntegration:${instance.shellType}`);
			}
		})));
		const disposeListener = this._register(instance.onDisposed(() => {
			instanceDisposables.dispose();
			this._store.delete(disposeListener);
		}));
	}

	private async _addInstanceToGroup(instance: ITerminalInstance, e: IRequestAddInstanceToGroupEvent): Promise<void> {
		const terminalIdentifier = parseTerminalUri(e.uri);
		if (terminalIdentifier.instanceId === undefined) {
			return;
		}

		let sourceInstance: ITerminalInstance | undefined = this.getInstanceFromResource(e.uri);

		// Terminal from a different window
		if (!sourceInstance) {
			const attachPersistentProcess = await this._primaryBackend?.requestDetachInstance(terminalIdentifier.workspaceId, terminalIdentifier.instanceId);
			if (attachPersistentProcess) {
				sourceInstance = await this.createTerminal({ config: { attachPersistentProcess }, resource: e.uri });
				this._terminalGroupService.moveInstance(sourceInstance, instance, e.side);
				return;
			}
		}

		// View terminals
		sourceInstance = this._terminalGroupService.getInstanceFromResource(e.uri);
		if (sourceInstance) {
			this._terminalGroupService.moveInstance(sourceInstance, instance, e.side);
			return;
		}

		// Terminal editors
		sourceInstance = this._terminalEditorService.getInstanceFromResource(e.uri);
		if (sourceInstance) {
			this.moveToTerminalView(sourceInstance, instance, e.side);
			return;
		}
		return;
	}

	registerProcessSupport(isSupported: boolean): void {
		if (!isSupported) {
			return;
		}
		this._processSupportContextKey.set(isSupported);
		this._onDidRegisterProcessSupport.fire();
	}

	// TODO: Remove this, it should live in group/editor servioce
	private _getIndexFromId(terminalId: number): number {
		let terminalIndex = -1;
		this.instances.forEach((terminalInstance, i) => {
			if (terminalInstance.instanceId === terminalId) {
				terminalIndex = i;
			}
		});
		if (terminalIndex === -1) {
			throw new Error(`Terminal with ID ${terminalId} does not exist (has it already been disposed?)`);
		}
		return terminalIndex;
	}

	protected async _showTerminalCloseConfirmation(singleTerminal?: boolean): Promise<boolean> {
		let message: string;
		const foregroundInstances = this.foregroundInstances;
		if (foregroundInstances.length === 1 || singleTerminal) {
			message = nls.localize('terminalService.terminalCloseConfirmationSingular', "Do you want to terminate the active terminal session?");
		} else {
			message = nls.localize('terminalService.terminalCloseConfirmationPlural', "Do you want to terminate the {0} active terminal sessions?", foregroundInstances.length);
		}
		const { confirmed } = await this._dialogService.confirm({
			type: 'warning',
			message,
			primaryButton: nls.localize({ key: 'terminate', comment: ['&& denotes a mnemonic'] }, "&&Terminate")
		});
		return !confirmed;
	}

	getDefaultInstanceHost(): ITerminalInstanceHost {
		if (this._terminalConfigurationService.defaultLocation === TerminalLocation.Editor) {
			return this._terminalEditorService;
		}
		return this._terminalGroupService;
	}

	async getInstanceHost(location: ITerminalLocationOptions | undefined): Promise<ITerminalInstanceHost> {
		if (location) {
			if (location === TerminalLocation.Editor) {
				return this._terminalEditorService;
			} else if (typeof location === 'object') {
				if (hasKey(location, { viewColumn: true })) {
					return this._terminalEditorService;
				} else if (hasKey(location, { parentTerminal: true })) {
					return (await location.parentTerminal).target === TerminalLocation.Editor ? this._terminalEditorService : this._terminalGroupService;
				}
			} else {
				return this._terminalGroupService;
			}
		}
		return this;
	}

	async createTerminal(options?: ICreateTerminalOptions): Promise<ITerminalInstance> {
		// Await the initialization of available profiles as long as this is not a pty terminal or a
		// local terminal in a remote workspace as profile won't be used in those cases and these
		// terminals need to be launched before remote connections are established.
		const isLocalInRemoteTerminal = this._remoteAgentService.getConnection() && URI.isUri(options?.cwd) && options?.cwd.scheme === Schemas.file;
		if (this._terminalProfileService.availableProfiles.length === 0) {
			const isPtyTerminal = options?.config && hasKey(options.config, { customPtyImplementation: true });
			if (!isPtyTerminal && !isLocalInRemoteTerminal) {
				if (this._connectionState === TerminalConnectionState.Connecting) {
					mark(`code/terminal/willGetProfiles`);
				}
				await this._terminalProfileService.profilesReady;
				if (this._connectionState === TerminalConnectionState.Connecting) {
					mark(`code/terminal/didGetProfiles`);
				}
			}
		}

		let config = options?.config;
		if (!config && isLocalInRemoteTerminal) {
			const backend = await this._terminalInstanceService.getBackend(undefined);
			const executable = await backend?.getDefaultSystemShell();
			if (executable) {
				config = { executable };
			}
		}

		if (!config) {
			config = this._terminalProfileService.getDefaultProfile();
		}
		const shellLaunchConfig = config && hasKey(config, { extensionIdentifier: true }) ? {} : this._terminalInstanceService.convertProfileToShellLaunchConfig(config || {});

		// Get the contributed profile if it was provided
		const contributedProfile = options?.skipContributedProfileCheck ? undefined : await this._getContributedProfile(shellLaunchConfig, options);

		const splitActiveTerminal = typeof options?.location === 'object' && hasKey(options.location, { splitActiveTerminal: true })
			? options.location.splitActiveTerminal
			: typeof options?.location === 'object' ? hasKey(options.location, { parentTerminal: true }) : false;

		await this._resolveCwd(shellLaunchConfig, splitActiveTerminal, options);

		// Launch the contributed profile
		// If it's a custom pty implementation, we did not await the profiles ready, so
		// we cannot launch the contributed profile and doing so would cause an error
		if (!shellLaunchConfig.customPtyImplementation && contributedProfile) {
			const resolvedLocation = await this.resolveLocation(options?.location);
			let location: TerminalLocation | { viewColumn: number; preserveState?: boolean } | { splitActiveTerminal: boolean } | undefined;
			if (splitActiveTerminal) {
				location = resolvedLocation === TerminalLocation.Editor ? { viewColumn: SIDE_GROUP } : { splitActiveTerminal: true };
			} else {
				location = typeof options?.location === 'object' && hasKey(options.location, { viewColumn: true }) ? options.location : resolvedLocation;
			}
			await this.createContributedTerminalProfile(contributedProfile.extensionIdentifier, contributedProfile.id, {
				icon: contributedProfile.icon,
				color: contributedProfile.color,
				location,
				cwd: shellLaunchConfig.cwd,
			});
			const instanceHost = resolvedLocation === TerminalLocation.Editor ? this._terminalEditorService : this._terminalGroupService;
			// TODO@meganrogge: This returns undefined in the remote & web smoke tests but the function
			// does not return undefined. This should be handled correctly.
			const instance = instanceHost.instances[instanceHost.instances.length - 1];
			await instance?.focusWhenReady();
			this._terminalHasBeenCreated.set(true);
			return instance;
		}

		if (!shellLaunchConfig.customPtyImplementation && !this.isProcessSupportRegistered) {
			throw new Error('Could not create terminal when process support is not registered');
		}

		this._evaluateLocalCwd(shellLaunchConfig);
		const location = await this.resolveLocation(options?.location) || this._terminalConfigurationService.defaultLocation;

		if (shellLaunchConfig.hideFromUser) {
			const instance = this._terminalInstanceService.createInstance(shellLaunchConfig, location);
			this._backgroundedTerminalInstances.push({ instance, terminalLocationOptions: options?.location });
			this._backgroundedTerminalDisposables.set(instance.instanceId, [
				instance.onDisposed(instance => {
					const idx = this._backgroundedTerminalInstances.findIndex(bg => bg.instance === instance);
					if (idx !== -1) {
						this._backgroundedTerminalInstances.splice(idx, 1);
					}
					this._onDidDisposeInstance.fire(instance);
				})
			]);
			this._onDidChangeInstances.fire();
			return instance;
		}

		const parent = await this._getSplitParent(options?.location);
		this._terminalHasBeenCreated.set(true);
		this._extensionService.activateByEvent('onTerminal:*');
		let instance;
		if (parent) {
			instance = this._splitTerminal(shellLaunchConfig, location, parent);
		} else {
			instance = this._createTerminal(shellLaunchConfig, location, options);
		}
		if (instance.shellType) {
			this._extensionService.activateByEvent(`onTerminal:${instance.shellType}`);
		}

		return instance;
	}

	async createAndFocusTerminal(options?: ICreateTerminalOptions): Promise<ITerminalInstance> {
		const instance = await this.createTerminal(options);
		this.setActiveInstance(instance);
		await instance.focusWhenReady();
		return instance;
	}

	private async _getContributedProfile(shellLaunchConfig: IShellLaunchConfig, options?: ICreateTerminalOptions): Promise<IExtensionTerminalProfile | undefined> {
		if (options?.config && hasKey(options.config, { extensionIdentifier: true })) {
			return options.config;
		}

		return this._terminalProfileService.getContributedDefaultProfile(shellLaunchConfig);
	}

	async createDetachedTerminal(options: IDetachedXTermOptions): Promise<IDetachedTerminalInstance> {
		const ctor = await TerminalInstance.getXtermConstructor(this._keybindingService, this._contextKeyService);
		const xterm = this._instantiationService.createInstance(XtermTerminal, undefined, ctor, {
			cols: options.cols,
			rows: options.rows,
			xtermColorProvider: options.colorProvider,
			capabilities: options.capabilities || new TerminalCapabilityStore(),
			disableOverviewRuler: options.disableOverviewRuler,
		}, undefined);

		if (options.readonly) {
			xterm.raw.attachCustomKeyEventHandler(() => false);
		}

		const instance = new DetachedTerminal(xterm, options, this._instantiationService);
		this._detachedXterms.add(instance);
		const l = xterm.onDidDispose(() => {
			this._detachedXterms.delete(instance);
			l.dispose();
		});

		return instance;
	}

	private async _resolveCwd(shellLaunchConfig: IShellLaunchConfig, splitActiveTerminal: boolean, options?: ICreateTerminalOptions): Promise<void> {
		const cwd = shellLaunchConfig.cwd;
		if (!cwd) {
			if (options?.cwd) {
				shellLaunchConfig.cwd = options.cwd;
			} else if (splitActiveTerminal && options?.location) {
				let parent = this.activeInstance;
				if (typeof options.location === 'object' && hasKey(options.location, { parentTerminal: true })) {
					parent = await options.location.parentTerminal;
				}
				if (!parent) {
					throw new Error('Cannot split without an active instance');
				}
				shellLaunchConfig.cwd = await getCwdForSplit(parent, this._workspaceContextService.getWorkspace().folders, this._commandService, this._terminalConfigurationService);
			}
		}
	}

	private _splitTerminal(shellLaunchConfig: IShellLaunchConfig, location: TerminalLocation, parent: ITerminalInstance): ITerminalInstance {
		let instance;
		// Use the URI from the base instance if it exists, this will correctly split local terminals
		if (typeof shellLaunchConfig.cwd !== 'object' && typeof parent.shellLaunchConfig.cwd === 'object') {
			shellLaunchConfig.cwd = URI.from({
				scheme: parent.shellLaunchConfig.cwd.scheme,
				authority: parent.shellLaunchConfig.cwd.authority,
				path: shellLaunchConfig.cwd || parent.shellLaunchConfig.cwd.path
			});
		}
		if (location === TerminalLocation.Editor || parent.target === TerminalLocation.Editor) {
			instance = this._terminalEditorService.splitInstance(parent, shellLaunchConfig);
		} else {
			const group = this._terminalGroupService.getGroupForInstance(parent);
			if (!group) {
				throw new Error(`Cannot split a terminal without a group (instanceId: ${parent.instanceId}, title: ${parent.title})`);
			}
			shellLaunchConfig.parentTerminalId = parent.instanceId;
			instance = group.split(shellLaunchConfig);
		}
		return instance;
	}

	private _createTerminal(shellLaunchConfig: IShellLaunchConfig, location: TerminalLocation, options?: ICreateTerminalOptions): ITerminalInstance {
		let instance;
		if (location === TerminalLocation.Editor) {
			instance = this._terminalInstanceService.createInstance(shellLaunchConfig, TerminalLocation.Editor);
			if (!shellLaunchConfig.hideFromUser) {
				const editorOptions = this._getEditorOptions(options?.location);
				this._terminalEditorService.openEditor(instance, editorOptions);
			}
		} else {
			// TODO: pass resource?
			const group = this._terminalGroupService.createGroup(shellLaunchConfig);
			instance = group.terminalInstances[0];
		}
		return instance;
	}

	async resolveLocation(location?: ITerminalLocationOptions): Promise<TerminalLocation | undefined> {
		if (location && typeof location === 'object') {
			if (hasKey(location, { parentTerminal: true })) {
				// since we don't set the target unless it's an editor terminal, this is necessary
				const parentTerminal = await location.parentTerminal;
				return !parentTerminal.target ? TerminalLocation.Panel : parentTerminal.target;
			} else if (hasKey(location, { viewColumn: true })) {
				return TerminalLocation.Editor;
			} else if (hasKey(location, { splitActiveTerminal: true })) {
				// since we don't set the target unless it's an editor terminal, this is necessary
				return !this._activeInstance?.target ? TerminalLocation.Panel : this._activeInstance?.target;
			}
		}
		return location;
	}

	private async _getSplitParent(location?: ITerminalLocationOptions): Promise<ITerminalInstance | undefined> {
		if (location && typeof location === 'object' && hasKey(location, { parentTerminal: true })) {
			return location.parentTerminal;
		} else if (location && typeof location === 'object' && hasKey(location, { splitActiveTerminal: true })) {
			return this.activeInstance;
		}
		return undefined;
	}

	private _getEditorOptions(location?: ITerminalLocationOptions): TerminalEditorLocation | undefined {
		if (location && typeof location === 'object' && hasKey(location, { viewColumn: true })) {
			// Terminal-specific workaround to resolve the active group in auxiliary windows to
			// override the locked editor behavior.
			if (location.viewColumn === ACTIVE_GROUP && isAuxiliaryWindow(getActiveWindow())) {
				location.viewColumn = this._editorGroupsService.activeGroup.id;
				return location;
			}
			location.viewColumn = columnToEditorGroup(this._editorGroupsService, this._configurationService, location.viewColumn);
			return location;
		}
		return undefined;
	}

	private _evaluateLocalCwd(shellLaunchConfig: IShellLaunchConfig) {
		// Add welcome message and title annotation for local terminals launched within remote or
		// virtual workspaces
		if (!isString(shellLaunchConfig.cwd) && shellLaunchConfig.cwd?.scheme === Schemas.file) {
			if (VirtualWorkspaceContext.getValue(this._contextKeyService)) {
				shellLaunchConfig.initialText = formatMessageForTerminal(nls.localize('localTerminalVirtualWorkspace', "This shell is open to a {0}local{1} folder, NOT to the virtual folder", '\x1b[3m', '\x1b[23m'), { excludeLeadingNewLine: true, loudFormatting: true });
				shellLaunchConfig.type = 'Local';
			} else if (this._remoteAgentService.getConnection()) {
				shellLaunchConfig.initialText = formatMessageForTerminal(nls.localize('localTerminalRemote', "This shell is running on your {0}local{1} machine, NOT on the connected remote machine", '\x1b[3m', '\x1b[23m'), { excludeLeadingNewLine: true, loudFormatting: true });
				shellLaunchConfig.type = 'Local';
			}
		}
	}

	public async showBackgroundTerminal(instance: ITerminalInstance, suppressSetActive?: boolean): Promise<void> {
		const index = this._backgroundedTerminalInstances.findIndex(bg => bg.instance === instance);
		if (index === -1) {
			return;
		}
		const backgroundTerminal = this._backgroundedTerminalInstances[index];
		this._backgroundedTerminalInstances.splice(index, 1);
		const disposables = this._backgroundedTerminalDisposables.get(instance.instanceId);
		if (disposables) {
			dispose(disposables);
		}
		this._backgroundedTerminalDisposables.delete(instance.instanceId);
		if (instance.target === TerminalLocation.Panel) {
			this._terminalGroupService.createGroup(instance);

			// Make active automatically if it's the first instance
			if (this.instances.length === 1 && !suppressSetActive) {
				this._terminalGroupService.setActiveInstanceByIndex(0);
			}
		} else {
			const editorOptions = backgroundTerminal.terminalLocationOptions ? this._getEditorOptions(backgroundTerminal.terminalLocationOptions) : this._getEditorOptions(instance.target);
			this._terminalEditorService.openEditor(instance, editorOptions);
		}

		this._onDidChangeInstances.fire();
	}

	async setContainers(panelContainer: HTMLElement, terminalContainer: HTMLElement): Promise<void> {
		this._terminalConfigurationService.setPanelContainer(panelContainer);
		this._terminalGroupService.setContainer(terminalContainer);
	}



	createOnInstanceEvent<T>(getEvent: (instance: ITerminalInstance) => Event<T>): DynamicListEventMultiplexer<ITerminalInstance, T> {
		return new DynamicListEventMultiplexer(this.instances, this.onDidCreateInstance, this.onDidDisposeInstance, getEvent);
	}

	createOnInstanceCapabilityEvent<T extends TerminalCapability, K>(capabilityId: T, getEvent: (capability: ITerminalCapabilityImplMap[T]) => Event<K>): IDynamicListEventMultiplexer<{ instance: ITerminalInstance; data: K }> {
		return createInstanceCapabilityEventMultiplexer(this.instances, this.onDidCreateInstance, this.onDidDisposeInstance, capabilityId, getEvent);
	}
}

class TerminalEditorStyle extends Themable {
	private _styleElement: HTMLElement;

	constructor(
		container: HTMLElement,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@IThemeService private readonly _themeService: IThemeService,
		@ITerminalProfileService private readonly _terminalProfileService: ITerminalProfileService,
		@IEditorService private readonly _editorService: IEditorService
	) {
		super(_themeService);
		this._registerListeners();
		this._styleElement = domStylesheets.createStyleSheet(container);
		this._register(toDisposable(() => this._styleElement.remove()));
		this.updateStyles();
	}

	private _registerListeners(): void {
		this._register(this._terminalService.onAnyInstanceIconChange(() => this.updateStyles()));
		this._register(this._terminalService.onDidCreateInstance(() => this.updateStyles()));
		this._register(this._editorService.onDidActiveEditorChange(() => {
			if (this._editorService.activeEditor instanceof TerminalEditorInput) {
				this.updateStyles();
			}
		}));
		this._register(this._editorService.onDidCloseEditor(() => {
			if (this._editorService.activeEditor instanceof TerminalEditorInput) {
				this.updateStyles();
			}
		}));
		this._register(this._terminalProfileService.onDidChangeAvailableProfiles(() => this.updateStyles()));
	}

	override updateStyles(): void {
		super.updateStyles();
		const colorTheme = this._themeService.getColorTheme();

		// TODO: add a rule collector to avoid duplication
		let css = '';

		const productIconTheme = this._themeService.getProductIconTheme();

		// Add icons
		for (const instance of this._terminalService.instances) {
			const icon = instance.icon;
			if (!icon) {
				continue;
			}
			let uri = undefined;
			if (icon instanceof URI) {
				uri = icon;
			} else if (icon instanceof Object && hasKey(icon, { light: true, dark: true })) {
				uri = isDark(colorTheme.type) ? icon.dark : icon.light;
			}
			const iconClasses = getUriClasses(instance, colorTheme.type);
			if (uri instanceof URI && iconClasses && iconClasses.length > 1) {
				css += (
					cssValue.inline`.monaco-workbench .terminal-tab.${cssValue.className(iconClasses[0])}::before
					{content: ''; background-image: ${cssValue.asCSSUrl(uri)};}`
				);
			}
			if (ThemeIcon.isThemeIcon(icon)) {
				const iconRegistry = getIconRegistry();
				const iconContribution = iconRegistry.getIcon(icon.id);
				if (iconContribution) {
					const def = productIconTheme.getIcon(iconContribution);
					if (def) {
						css += cssValue.inline`.monaco-workbench .terminal-tab.codicon-${cssValue.className(icon.id)}::before
							{content: ${cssValue.stringValue(def.fontCharacter)} !important; font-family: ${cssValue.stringValue(def.font?.id ?? 'codicon')} !important;}`;
					}
				}
			}
		}

		// Add colors
		const iconForegroundColor = colorTheme.getColor(iconForeground);
		if (iconForegroundColor) {
			css += cssValue.inline`.monaco-workbench .show-file-icons .file-icon.terminal-tab::before { color: ${iconForegroundColor}; }`;
		}

		css += getColorStyleContent(colorTheme, true);
		this._styleElement.textContent = css;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalStatusList.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalStatusList.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import Severity from '../../../../base/common/severity.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { TerminalSettingId } from '../../../../platform/terminal/common/terminal.js';
import { listErrorForeground, listWarningForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { spinningLoading } from '../../../../platform/theme/common/iconRegistry.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { ITerminalStatus } from '../common/terminal.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { isString } from '../../../../base/common/types.js';

/**
 * The set of _internal_ terminal statuses, other components building on the terminal should put
 * their statuses within their component.
 */
export const enum TerminalStatus {
	Bell = 'bell',
	Disconnected = 'disconnected',
	RelaunchNeeded = 'relaunch-needed',
	EnvironmentVariableInfoChangesActive = 'env-var-info-changes-active',
	ShellIntegrationInfo = 'shell-integration-info',
	ShellIntegrationAttentionNeeded = 'shell-integration-attention-needed'
}

export interface ITerminalStatusList {
	/** Gets the most recent, highest severity status. */
	readonly primary: ITerminalStatus | undefined;
	/** Gets all active statues. */
	readonly statuses: ITerminalStatus[];

	readonly onDidAddStatus: Event<ITerminalStatus>;
	readonly onDidRemoveStatus: Event<ITerminalStatus>;
	readonly onDidChangePrimaryStatus: Event<ITerminalStatus | undefined>;

	/**
	 * Adds a status to the list.
	 * @param status The status object. Ideally a single status object that does not change will be
	 * shared as this call will no-op if the status is already set (checked by by object reference).
	 * @param duration An optional duration in milliseconds of the status, when specified the status
	 * will remove itself when the duration elapses unless the status gets re-added.
	 */
	add(status: ITerminalStatus, duration?: number): void;
	remove(status: ITerminalStatus): void;
	remove(statusId: string): void;
	toggle(status: ITerminalStatus, value: boolean): void;
}

export class TerminalStatusList extends Disposable implements ITerminalStatusList {
	private readonly _statuses: Map<string, ITerminalStatus> = new Map();
	private readonly _statusTimeouts: Map<string, number> = new Map();

	private readonly _onDidAddStatus = this._register(new Emitter<ITerminalStatus>());
	get onDidAddStatus(): Event<ITerminalStatus> { return this._onDidAddStatus.event; }
	private readonly _onDidRemoveStatus = this._register(new Emitter<ITerminalStatus>());
	get onDidRemoveStatus(): Event<ITerminalStatus> { return this._onDidRemoveStatus.event; }
	private readonly _onDidChangePrimaryStatus = this._register(new Emitter<ITerminalStatus | undefined>());
	get onDidChangePrimaryStatus(): Event<ITerminalStatus | undefined> { return this._onDidChangePrimaryStatus.event; }

	constructor(
		@IConfigurationService private readonly _configurationService: IConfigurationService
	) {
		super();
	}

	get primary(): ITerminalStatus | undefined {
		let result: ITerminalStatus | undefined;
		for (const s of this._statuses.values()) {
			if (!result || s.severity >= result.severity) {
				if (s.icon || !result?.icon) {
					result = s;
				}
			}
		}
		return result;
	}

	get statuses(): ITerminalStatus[] { return Array.from(this._statuses.values()); }

	add(status: ITerminalStatus, duration?: number) {
		status = this._applyAnimationSetting(status);
		const outTimeout = this._statusTimeouts.get(status.id);
		if (outTimeout) {
			mainWindow.clearTimeout(outTimeout);
			this._statusTimeouts.delete(status.id);
		}
		if (duration && duration > 0) {
			const timeout = mainWindow.setTimeout(() => this.remove(status), duration);
			this._statusTimeouts.set(status.id, timeout);
		}
		const existingStatus = this._statuses.get(status.id);
		if (existingStatus && existingStatus !== status) {
			this._onDidRemoveStatus.fire(existingStatus);
			this._statuses.delete(existingStatus.id);
		}
		if (!this._statuses.has(status.id)) {
			const oldPrimary = this.primary;
			this._statuses.set(status.id, status);
			this._onDidAddStatus.fire(status);
			const newPrimary = this.primary;
			if (oldPrimary !== newPrimary) {
				this._onDidChangePrimaryStatus.fire(newPrimary);
			}
		}
	}

	remove(status: ITerminalStatus): void;
	remove(statusId: string): void;
	remove(statusOrId: ITerminalStatus | string): void {
		const status = isString(statusOrId) ? this._statuses.get(statusOrId) : statusOrId;
		// Verify the status is the same as the one passed in
		if (status && this._statuses.get(status.id)) {
			const wasPrimary = this.primary?.id === status.id;
			this._statuses.delete(status.id);
			this._onDidRemoveStatus.fire(status);
			if (wasPrimary) {
				this._onDidChangePrimaryStatus.fire(this.primary);
			}
		}
	}

	toggle(status: ITerminalStatus, value: boolean) {
		if (value) {
			this.add(status);
		} else {
			this.remove(status);
		}
	}

	private _applyAnimationSetting(status: ITerminalStatus): ITerminalStatus {
		if (!status.icon || ThemeIcon.getModifier(status.icon) !== 'spin' || this._configurationService.getValue(TerminalSettingId.TabsEnableAnimation)) {
			return status;
		}
		let icon;
		// Loading without animation is just a curved line that doesn't mean anything
		if (status.icon.id === spinningLoading.id) {
			icon = Codicon.play;
		} else {
			icon = ThemeIcon.modify(status.icon, undefined);
		}
		// Clone the status when changing the icon so that setting changes are applied without a
		// reload being needed
		return {
			...status,
			icon
		};
	}
}

export function getColorForSeverity(severity: Severity): string {
	switch (severity) {
		case Severity.Error:
			return listErrorForeground;
		case Severity.Warning:
			return listWarningForeground;
		default:
			return '';
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalTabbedView.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalTabbedView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LayoutPriority, Orientation, Sizing, SplitView } from '../../../../base/browser/ui/splitview/splitview.js';
import { Disposable, dispose, IDisposable } from '../../../../base/common/lifecycle.js';
import { Event } from '../../../../base/common/event.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ITerminalChatService, ITerminalConfigurationService, ITerminalGroupService, ITerminalInstance, ITerminalService, TerminalConnectionState, TerminalDataTransfers } from './terminal.js';
import { TerminalTabsListSizes, TerminalTabList } from './terminalTabsList.js';
import * as dom from '../../../../base/browser/dom.js';
import { Action, IAction, Separator } from '../../../../base/common/actions.js';
import { IMenu, IMenuService, MenuId } from '../../../../platform/actions/common/actions.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { TerminalSettingId } from '../../../../platform/terminal/common/terminal.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { localize } from '../../../../nls.js';
import { openContextMenu } from './terminalContextMenu.js';
import { TerminalStorageKeys } from '../common/terminalStorageKeys.js';
import { TerminalContextKeys } from '../common/terminalContextKey.js';
import { getInstanceHoverInfo } from './terminalTooltip.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { TerminalTabsChatEntry } from './terminalTabsChatEntry.js';
import { containsDragType } from '../../../../platform/dnd/browser/dnd.js';
import { getTerminalResourcesFromDragEvent, parseTerminalUri } from './terminalUri.js';
import type { IProcessDetails } from '../../../../platform/terminal/common/terminalProcess.js';
import { TerminalContribContextKeyStrings } from '../terminalContribExports.js';

const $ = dom.$;

const enum CssClass {
	ViewIsVertical = 'terminal-side-view',
}

const enum WidthConstants {
	StatusIcon = 30,
	SplitAnnotation = 30
}

export class TerminalTabbedView extends Disposable {

	private _splitView: SplitView;

	private _terminalContainer: HTMLElement;
	private _tabListElement: HTMLElement;
	private _tabContainer: HTMLElement;

	private _tabList: TerminalTabList;
	private _tabListContainer: HTMLElement;
	private _tabListDomElement: HTMLElement;
	private _sashDisposables: IDisposable[] | undefined;

	private _plusButton: HTMLElement | undefined;
	private _chatEntry: TerminalTabsChatEntry | undefined;

	private _tabTreeIndex: number;
	private _terminalContainerIndex: number;

	private _height: number | undefined;
	private _width: number | undefined;

	private _cancelContextMenu: boolean = false;
	private _instanceMenu: IMenu;
	private _tabsListMenu: IMenu;
	private _tabsListEmptyMenu: IMenu;

	private _terminalIsTabsNarrowContextKey: IContextKey<boolean>;
	private _terminalTabsFocusContextKey: IContextKey<boolean>;
	private _terminalTabsMouseContextKey: IContextKey<boolean>;

	private _panelOrientation: Orientation | undefined;
	private _emptyAreaDropTargetCount = 0;

	constructor(
		parentElement: HTMLElement,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@ITerminalChatService private readonly _terminalChatService: ITerminalChatService,
		@ITerminalConfigurationService private readonly _terminalConfigurationService: ITerminalConfigurationService,
		@ITerminalGroupService private readonly _terminalGroupService: ITerminalGroupService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IContextMenuService private readonly _contextMenuService: IContextMenuService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IMenuService menuService: IMenuService,
		@IStorageService private readonly _storageService: IStorageService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IHoverService private readonly _hoverService: IHoverService,
	) {
		super();

		this._tabContainer = $('.tabs-container');
		const tabListContainer = $('.tabs-list-container');
		this._tabListContainer = tabListContainer;
		this._tabListElement = $('.tabs-list');
		tabListContainer.appendChild(this._tabListElement);
		this._tabContainer.appendChild(tabListContainer);

		this._instanceMenu = this._register(menuService.createMenu(MenuId.TerminalInstanceContext, contextKeyService));
		this._tabsListMenu = this._register(menuService.createMenu(MenuId.TerminalTabContext, contextKeyService));
		this._tabsListEmptyMenu = this._register(menuService.createMenu(MenuId.TerminalTabEmptyAreaContext, contextKeyService));

		this._tabList = this._register(this._instantiationService.createInstance(TerminalTabList, this._tabListElement));
		this._tabListDomElement = this._tabList.getHTMLElement();
		this._chatEntry = this._register(this._instantiationService.createInstance(TerminalTabsChatEntry, tabListContainer, this._tabContainer));

		const terminalOuterContainer = $('.terminal-outer-container');
		this._terminalContainer = $('.terminal-groups-container');
		terminalOuterContainer.appendChild(this._terminalContainer);

		this._terminalService.setContainers(parentElement, this._terminalContainer);

		this._terminalIsTabsNarrowContextKey = TerminalContextKeys.tabsNarrow.bindTo(contextKeyService);
		this._terminalTabsFocusContextKey = TerminalContextKeys.tabsFocus.bindTo(contextKeyService);
		this._terminalTabsMouseContextKey = TerminalContextKeys.tabsMouse.bindTo(contextKeyService);

		this._tabTreeIndex = this._terminalConfigurationService.config.tabs.location === 'left' ? 0 : 1;
		this._terminalContainerIndex = this._terminalConfigurationService.config.tabs.location === 'left' ? 1 : 0;

		this._register(_configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TerminalSettingId.TabsEnabled) ||
				e.affectsConfiguration(TerminalSettingId.TabsHideCondition)) {
				this._refreshShowTabs();
			} else if (e.affectsConfiguration(TerminalSettingId.TabsLocation)) {
				this._tabTreeIndex = this._terminalConfigurationService.config.tabs.location === 'left' ? 0 : 1;
				this._terminalContainerIndex = this._terminalConfigurationService.config.tabs.location === 'left' ? 1 : 0;
				if (this._shouldShowTabs()) {
					this._splitView.swapViews(0, 1);
					this._removeSashListener();
					this._addSashListener();
					this._splitView.resizeView(this._tabTreeIndex, this._getLastListWidth());
				}
			}
		}));
		this._register(Event.any(this._terminalGroupService.onDidChangeInstances, this._terminalGroupService.onDidChangeGroups)(() => {
			this._refreshShowTabs();
			this._updateChatTerminalsEntry();
		}));

		this._register(Event.any(this._terminalChatService.onDidRegisterTerminalInstanceWithToolSession, this._terminalService.onDidChangeInstances)(() => {
			this._refreshShowTabs();
			this._updateChatTerminalsEntry();
		}));

		this._register(contextKeyService.onDidChangeContext(e => {
			if (e.affectsSome(new Set([TerminalContribContextKeyStrings.ChatHasHiddenTerminals]))) {
				this._refreshShowTabs();
				this._updateChatTerminalsEntry();
			}
		}));
		this._attachEventListeners(parentElement, this._terminalContainer);

		this._register(this._terminalGroupService.onDidChangePanelOrientation((orientation) => {
			this._panelOrientation = orientation;
			if (this._panelOrientation === Orientation.VERTICAL) {
				this._terminalContainer.classList.add(CssClass.ViewIsVertical);
			} else {
				this._terminalContainer.classList.remove(CssClass.ViewIsVertical);
			}
		}));

		this._splitView = new SplitView(parentElement, { orientation: Orientation.HORIZONTAL, proportionalLayout: false });
		this._setupSplitView(terminalOuterContainer);
		this._updateChatTerminalsEntry();
	}

	private _shouldShowTabs(): boolean {
		const enabled = this._terminalConfigurationService.config.tabs.enabled;
		const hide = this._terminalConfigurationService.config.tabs.hideCondition;
		const hiddenChatTerminals = this._terminalChatService.getToolSessionTerminalInstances(true);
		if (!enabled) {
			return false;
		}
		if (hiddenChatTerminals.length > 0) {
			return true;
		}

		switch (hide) {
			case 'never':
				return true;
			case 'singleTerminal':
				if (this._terminalGroupService.instances.length > 1) {
					return true;
				}
				break;
			case 'singleGroup':
				if (this._terminalGroupService.groups.length > 1) {
					return true;
				}
				break;
		}
		return false;
	}

	private _refreshShowTabs() {
		if (this._shouldShowTabs()) {
			if (this._splitView.length === 1) {
				this._addTabTree();
				this._addSashListener();
				this._splitView.resizeView(this._tabTreeIndex, this._getLastListWidth());
				this.rerenderTabs();
			}
		} else {
			if (this._splitView.length === 2 && !this._terminalTabsMouseContextKey.get()) {
				this._splitView.removeView(this._tabTreeIndex);
				this._plusButton?.remove();
				this._removeSashListener();
			}
		}
	}

	private _updateChatTerminalsEntry(): void {
		this._chatEntry?.update();
	}

	private _getLastListWidth(): number {
		const widthKey = this._panelOrientation === Orientation.VERTICAL ? TerminalStorageKeys.TabsListWidthVertical : TerminalStorageKeys.TabsListWidthHorizontal;
		const storedValue = this._storageService.get(widthKey, StorageScope.PROFILE);

		if (!storedValue || !parseInt(storedValue)) {
			// we want to use the min width by default for the vertical orientation bc
			// there is such a limited width for the terminal panel to begin w there.
			return this._panelOrientation === Orientation.VERTICAL ? TerminalTabsListSizes.NarrowViewWidth : TerminalTabsListSizes.DefaultWidth;
		}
		return parseInt(storedValue);
	}

	private _handleOnDidSashReset(): void {
		// Calculate ideal size of list to display all text based on its contents
		let idealWidth = TerminalTabsListSizes.WideViewMinimumWidth;
		const offscreenCanvas = document.createElement('canvas');
		offscreenCanvas.width = 1;
		offscreenCanvas.height = 1;
		const ctx = offscreenCanvas.getContext('2d');
		if (ctx) {
			const style = dom.getWindow(this._tabListElement).getComputedStyle(this._tabListElement);
			ctx.font = `${style.fontStyle} ${style.fontSize} ${style.fontFamily}`;
			const maxInstanceWidth = this._terminalGroupService.instances.reduce((p, c) => {
				return Math.max(p, ctx.measureText(c.title + (c.description || '')).width + this._getAdditionalWidth(c));
			}, 0);
			idealWidth = Math.ceil(Math.max(maxInstanceWidth, TerminalTabsListSizes.WideViewMinimumWidth));
		}
		// If the size is already ideal, toggle to collapsed
		const currentWidth = Math.ceil(this._splitView.getViewSize(this._tabTreeIndex));
		if (currentWidth === idealWidth) {
			idealWidth = TerminalTabsListSizes.NarrowViewWidth;
		}
		this._splitView.resizeView(this._tabTreeIndex, idealWidth);
		this._updateListWidth(idealWidth);
	}

	private _getAdditionalWidth(instance: ITerminalInstance): number {
		// Size to include padding, icon, status icon (if any), split annotation (if any), + a little more
		const additionalWidth = 40;
		const statusIconWidth = instance.statusList.statuses.length > 0 ? WidthConstants.StatusIcon : 0;
		const splitAnnotationWidth = (this._terminalGroupService.getGroupForInstance(instance)?.terminalInstances.length || 0) > 1 ? WidthConstants.SplitAnnotation : 0;
		return additionalWidth + splitAnnotationWidth + statusIconWidth;
	}

	private _handleOnDidSashChange(): void {
		const listWidth = this._splitView.getViewSize(this._tabTreeIndex);
		if (!this._width || listWidth <= 0) {
			return;
		}
		this._updateListWidth(listWidth);
	}

	private _updateListWidth(width: number): void {
		if (width < TerminalTabsListSizes.MidpointViewWidth && width >= TerminalTabsListSizes.NarrowViewWidth) {
			width = TerminalTabsListSizes.NarrowViewWidth;
			this._splitView.resizeView(this._tabTreeIndex, width);
		} else if (width >= TerminalTabsListSizes.MidpointViewWidth && width < TerminalTabsListSizes.WideViewMinimumWidth) {
			width = TerminalTabsListSizes.WideViewMinimumWidth;
			this._splitView.resizeView(this._tabTreeIndex, width);
		}
		this.rerenderTabs();
		const widthKey = this._panelOrientation === Orientation.VERTICAL ? TerminalStorageKeys.TabsListWidthVertical : TerminalStorageKeys.TabsListWidthHorizontal;
		this._storageService.store(widthKey, width, StorageScope.PROFILE, StorageTarget.USER);
	}

	private _setupSplitView(terminalOuterContainer: HTMLElement): void {
		this._register(this._splitView.onDidSashReset(() => this._handleOnDidSashReset()));
		this._register(this._splitView.onDidSashChange(() => this._handleOnDidSashChange()));

		if (this._shouldShowTabs()) {
			this._addTabTree();
		}
		this._splitView.addView({
			element: terminalOuterContainer,
			layout: width => this._terminalGroupService.groups.forEach(tab => tab.layout(width, this._height || 0)),
			minimumSize: 120,
			maximumSize: Number.POSITIVE_INFINITY,
			onDidChange: () => Disposable.None,
			priority: LayoutPriority.High
		}, Sizing.Distribute, this._terminalContainerIndex);

		if (this._shouldShowTabs()) {
			this._addSashListener();
		}
	}

	private _addTabTree() {
		this._splitView.addView({
			element: this._tabContainer,
			layout: width => this._tabList.layout(this._height || 0, width),
			minimumSize: TerminalTabsListSizes.NarrowViewWidth,
			maximumSize: TerminalTabsListSizes.MaximumWidth,
			onDidChange: () => Disposable.None,
			priority: LayoutPriority.Low
		}, Sizing.Distribute, this._tabTreeIndex);
		this.rerenderTabs();
	}

	rerenderTabs() {
		this._updateHasText();
		this._tabList.refresh();
	}

	private _addSashListener() {
		let interval: IDisposable;
		this._sashDisposables = [
			this._splitView.sashes[0].onDidStart(e => {
				interval = dom.disposableWindowInterval(dom.getWindow(this._splitView.el), () => {
					this.rerenderTabs();
				}, 100);
			}),
			this._splitView.sashes[0].onDidEnd(e => {
				interval.dispose();
			})
		];
	}

	private _removeSashListener() {
		if (this._sashDisposables) {
			dispose(this._sashDisposables);
			this._sashDisposables = undefined;
		}
	}

	private _updateHasText() {
		const hasText = this._tabListElement.clientWidth > TerminalTabsListSizes.MidpointViewWidth;
		this._tabContainer.classList.toggle('has-text', hasText);
		this._terminalIsTabsNarrowContextKey.set(!hasText);
		this._updateChatTerminalsEntry();
	}

	layout(width: number, height: number): void {
		const chatItemHeight = this._chatEntry?.element.style.display === 'none' ? 0 : this._chatEntry?.element.clientHeight;
		this._height = height - (chatItemHeight ?? 0);
		this._width = width;
		this._splitView.layout(width);
		if (this._shouldShowTabs()) {
			this._splitView.resizeView(this._tabTreeIndex, this._getLastListWidth());
		}
		this._updateHasText();
	}


	private _attachEventListeners(parentDomElement: HTMLElement, terminalContainer: HTMLElement): void {
		this._register(dom.addDisposableListener(this._tabContainer, 'mouseleave', async (event: MouseEvent) => {
			this._terminalTabsMouseContextKey.set(false);
			this._refreshShowTabs();
			event.stopPropagation();
		}));
		this._register(dom.addDisposableListener(this._tabContainer, 'mouseenter', async (event: MouseEvent) => {
			this._terminalTabsMouseContextKey.set(true);
			event.stopPropagation();
		}));
		this._register(dom.addDisposableListener(this._tabContainer, 'dragenter', (event: DragEvent) => {
			if (!this._shouldHandleEmptyAreaDrop(event)) {
				this._resetEmptyAreaDropState();
				return;
			}
			this._emptyAreaDropTargetCount++;
			this._setEmptyAreaDropState(true);
		}));
		this._register(dom.addDisposableListener(this._tabContainer, 'dragover', (event: DragEvent) => {
			if (!this._shouldHandleEmptyAreaDrop(event)) {
				this._resetEmptyAreaDropState();
				return;
			}
			event.preventDefault();
			this._setEmptyAreaDropState(true);
			if (event.dataTransfer) {
				event.dataTransfer.dropEffect = 'move';
			}
		}));
		this._register(dom.addDisposableListener(this._tabContainer, 'dragleave', (event: DragEvent) => {
			if (!this._shouldHandleEmptyAreaDrop(event)) {
				if (!this._tabContainer.contains(event.relatedTarget as Node | null)) {
					this._resetEmptyAreaDropState();
				}
				return;
			}
			if (this._tabContainer.contains(event.relatedTarget as Node | null)) {
				return;
			}
			this._emptyAreaDropTargetCount = Math.max(0, this._emptyAreaDropTargetCount - 1);
			if (this._emptyAreaDropTargetCount === 0) {
				this._resetEmptyAreaDropState();
			}
		}));
		this._register(dom.addDisposableListener(this._tabContainer, 'drop', (event: DragEvent) => {
			if (!this._shouldHandleEmptyAreaDrop(event)) {
				return;
			}
			void this._handleContainerDrop(event);
		}));
		this._register(dom.addDisposableListener(terminalContainer, 'mousedown', async (event: MouseEvent) => {
			const terminal = this._terminalGroupService.activeInstance;
			if (this._terminalGroupService.instances.length > 0 && terminal) {
				const result = await terminal.handleMouseEvent(event, this._instanceMenu);
				if (typeof result === 'object' && result.cancelContextMenu) {
					this._cancelContextMenu = true;
				}
			}
		}));
		this._register(dom.addDisposableListener(terminalContainer, 'contextmenu', (event: MouseEvent) => {
			const rightClickBehavior = this._terminalConfigurationService.config.rightClickBehavior;
			if (rightClickBehavior === 'nothing' && !event.shiftKey) {
				this._cancelContextMenu = true;
			}
			terminalContainer.focus();
			if (!this._cancelContextMenu) {
				openContextMenu(dom.getWindow(terminalContainer), event, this._terminalGroupService.activeInstance, this._instanceMenu, this._contextMenuService);
			}
			event.preventDefault();
			event.stopImmediatePropagation();
			this._cancelContextMenu = false;
		}));
		this._register(dom.addDisposableListener(this._tabContainer, 'contextmenu', (event: MouseEvent) => {
			const rightClickBehavior = this._terminalConfigurationService.config.rightClickBehavior;
			if (rightClickBehavior === 'nothing' && !event.shiftKey) {
				this._cancelContextMenu = true;
			}
			if (!this._cancelContextMenu) {
				const emptyList = this._tabList.getFocus().length === 0;
				if (!emptyList) {
					this._terminalGroupService.lastAccessedMenu = 'tab-list';
				}

				// Put the focused item first as it's used as the first positional argument
				const selectedInstances = this._tabList.getSelectedElements();
				const focusedInstance = this._tabList.getFocusedElements()?.[0];
				if (focusedInstance) {
					selectedInstances.splice(selectedInstances.findIndex(e => e.instanceId === focusedInstance.instanceId), 1);
					selectedInstances.unshift(focusedInstance);
				}

				openContextMenu(dom.getWindow(this._tabContainer), event, selectedInstances, emptyList ? this._tabsListEmptyMenu : this._tabsListMenu, this._contextMenuService, emptyList ? this._getTabActions() : undefined);
			}
			event.preventDefault();
			event.stopImmediatePropagation();
			this._cancelContextMenu = false;
		}));
		this._register(dom.addDisposableListener(terminalContainer.ownerDocument, 'keydown', (event: KeyboardEvent) => {
			terminalContainer.classList.toggle('alt-active', !!event.altKey);
		}));
		this._register(dom.addDisposableListener(terminalContainer.ownerDocument, 'keyup', (event: KeyboardEvent) => {
			terminalContainer.classList.toggle('alt-active', !!event.altKey);
		}));
		this._register(dom.addDisposableListener(parentDomElement, 'keyup', (event: KeyboardEvent) => {
			if (event.keyCode === 27) {
				// Keep terminal open on escape
				event.stopPropagation();
			}
		}));
		this._register(dom.addDisposableListener(this._tabContainer, dom.EventType.FOCUS_IN, () => {
			this._terminalTabsFocusContextKey.set(true);
		}));
		this._register(dom.addDisposableListener(this._tabContainer, dom.EventType.FOCUS_OUT, () => {
			this._terminalTabsFocusContextKey.set(false);
		}));
	}

	private _shouldHandleEmptyAreaDrop(event: DragEvent): boolean {
		const targetNode = event.target as Node | null;
		if (targetNode && (this._tabListDomElement.contains(targetNode) || this._tabListElement.contains(targetNode))) {
			return false;
		}
		return !!event.dataTransfer && containsDragType(event, TerminalDataTransfers.Terminals);
	}

	private _setEmptyAreaDropState(active: boolean): void {
		this._tabListContainer.classList.toggle('drop-target', active);
		this._tabContainer.classList.toggle('drop-target', active);
		this._chatEntry?.element.classList.toggle('drop-target', active);
	}

	private _resetEmptyAreaDropState(): void {
		this._emptyAreaDropTargetCount = 0;
		this._setEmptyAreaDropState(false);
	}

	private async _handleContainerDrop(event: DragEvent): Promise<void> {
		event.preventDefault();
		event.stopPropagation();
		this._resetEmptyAreaDropState();
		const primaryBackend = this._terminalService.getPrimaryBackend();
		const resources = getTerminalResourcesFromDragEvent(event);
		let sourceInstances: ITerminalInstance[] | undefined;
		const promises: Promise<IProcessDetails | undefined>[] = [];
		if (resources) {
			for (const uri of resources) {
				const instance = this._terminalService.getInstanceFromResource(uri);
				if (instance) {
					if (sourceInstances) {
						sourceInstances.push(instance);
					} else {
						sourceInstances = [instance];
					}
					this._terminalService.moveToTerminalView(instance);
				} else if (primaryBackend) {
					const terminalIdentifier = parseTerminalUri(uri);
					if (terminalIdentifier.instanceId) {
						promises.push(primaryBackend.requestDetachInstance(terminalIdentifier.workspaceId, terminalIdentifier.instanceId));
					}
				}
			}
		}
		if (promises.length) {
			const processes = (await Promise.all(promises)).filter((process): process is IProcessDetails => !!process);
			let lastInstance: ITerminalInstance | undefined;
			for (const attachPersistentProcess of processes) {
				lastInstance = await this._terminalService.createTerminal({ config: { attachPersistentProcess } });
			}
			if (lastInstance) {
				this._terminalService.setActiveInstance(lastInstance);
			}
			return;
		}
		if (!sourceInstances || !sourceInstances.length) {
			sourceInstances = this._tabList.getSelectedElements();
			if (!sourceInstances.length) {
				return;
			}
		}
		this._terminalGroupService.moveGroupToEnd(sourceInstances);
		this._terminalService.setActiveInstance(sourceInstances[0]);
		const indexes = sourceInstances
			.map(instance => this._terminalGroupService.instances.indexOf(instance))
			.filter(index => index >= 0);
		if (indexes.length) {
			this._tabList.setSelection(indexes);
			this._tabList.setFocus([indexes[0]]);
		}
	}

	private _getTabActions(): IAction[] {
		return [
			new Separator(),
			this._configurationService.inspect(TerminalSettingId.TabsLocation).userValue === 'left' ?
				new Action('moveRight', localize('moveTabsRight', "Move Tabs Right"), undefined, undefined, async () => {
					this._configurationService.updateValue(TerminalSettingId.TabsLocation, 'right');
				}) :
				new Action('moveLeft', localize('moveTabsLeft', "Move Tabs Left"), undefined, undefined, async () => {
					this._configurationService.updateValue(TerminalSettingId.TabsLocation, 'left');
				}),
			new Action('hideTabs', localize('hideTabs', "Hide Tabs"), undefined, undefined, async () => {
				this._configurationService.updateValue(TerminalSettingId.TabsEnabled, false);
			})
		];
	}

	setEditable(isEditing: boolean): void {
		if (!isEditing) {
			this._tabList.domFocus();
		}
		this._tabList.refresh(false);
	}

	focusTabs(): void {
		if (!this._shouldShowTabs()) {
			return;
		}
		this._terminalTabsFocusContextKey.set(true);
		const selected = this._tabList.getSelection();
		this._tabList.domFocus();
		if (selected) {
			this._tabList.setFocus(selected);
		}
	}

	focus() {
		if (this._terminalService.connectionState === TerminalConnectionState.Connected) {
			this._focus();
			return;
		}

		// If the terminal is waiting to reconnect to remote terminals, then there is no TerminalInstance yet that can
		// be focused. So wait for connection to finish, then focus.
		const previousActiveElement = this._tabListElement.ownerDocument.activeElement;
		if (previousActiveElement) {
			// TODO: Improve lifecycle management this event should be disposed after first fire
			this._register(this._terminalService.onDidChangeConnectionState(() => {
				// Only focus the terminal if the activeElement has not changed since focus() was called
				// TODO: Hack
				if (dom.isActiveElement(previousActiveElement)) {
					this._focus();
				}
			}));
		}
	}

	focusHover() {
		if (this._shouldShowTabs()) {
			this._tabList.focusHover();
			return;
		}
		const instance = this._terminalGroupService.activeInstance;
		if (!instance) {
			return;
		}
		this._hoverService.showInstantHover({
			...getInstanceHoverInfo(instance, this._storageService),
			target: this._terminalContainer,
			trapFocus: true
		}, true);
	}

	private _focus() {
		this._terminalGroupService.activeInstance?.focusWhenReady();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalTabsChatEntry.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalTabsChatEntry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ThemeIcon } from '../../../../base/common/themables.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { $ } from '../../../../base/browser/dom.js';
import { localize } from '../../../../nls.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { ITerminalChatService } from './terminal.js';
import * as dom from '../../../../base/browser/dom.js';

export class TerminalTabsChatEntry extends Disposable {

	private readonly _entry: HTMLElement;
	private readonly _label: HTMLElement;

	override dispose(): void {
		this._entry.remove();
		this._label.remove();
		super.dispose();
	}

	constructor(
		container: HTMLElement,
		private readonly _tabContainer: HTMLElement,
		@ICommandService private readonly _commandService: ICommandService,
		@ITerminalChatService private readonly _terminalChatService: ITerminalChatService,
	) {
		super();

		this._entry = dom.append(container, $('.terminal-tabs-chat-entry'));
		this._entry.tabIndex = 0;
		this._entry.setAttribute('role', 'button');

		const entry = dom.append(this._entry, $('.terminal-tabs-entry'));
		const icon = dom.append(entry, $('.terminal-tabs-chat-entry-icon'));
		icon.classList.add(...ThemeIcon.asClassNameArray(Codicon.commentDiscussionSparkle));
		this._label = dom.append(entry, $('.terminal-tabs-chat-entry-label'));

		const runChatTerminalsCommand = () => {
			void this._commandService.executeCommand('workbench.action.terminal.chat.viewHiddenChatTerminals');
		};
		this._register(dom.addDisposableListener(this._entry, dom.EventType.CLICK, e => {
			e.preventDefault();
			runChatTerminalsCommand();
		}));
		this._register(dom.addDisposableListener(this._entry, dom.EventType.KEY_DOWN, e => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				runChatTerminalsCommand();
			}
		}));
		this.update();
	}

	get element(): HTMLElement {
		return this._entry;
	}

	update(): void {
		const hiddenChatTerminalCount = this._terminalChatService.getToolSessionTerminalInstances(true).length;
		if (hiddenChatTerminalCount <= 0) {
			this._entry.style.display = 'none';
			this._label.textContent = '';
			this._entry.removeAttribute('aria-label');
			this._entry.removeAttribute('title');

			return;
		}

		this._entry.style.display = '';
		const tooltip = localize('terminal.tabs.chatEntryTooltip', "Show hidden chat terminals");
		this._entry.setAttribute('title', tooltip);
		const hasText = this._tabContainer.classList.contains('has-text');
		if (hasText) {
			this._label.textContent = hiddenChatTerminalCount === 1
				? localize('terminal.tabs.chatEntryLabelSingle', "{0} Hidden Terminal", hiddenChatTerminalCount)
				: localize('terminal.tabs.chatEntryLabelPlural', "{0} Hidden Terminals", hiddenChatTerminalCount);
		} else {
			this._label.textContent = `${hiddenChatTerminalCount}`;
		}

		const ariaLabel = hiddenChatTerminalCount === 1
			? localize('terminal.tabs.chatEntryAriaLabelSingle', "Show 1 hidden chat terminal")
			: localize('terminal.tabs.chatEntryAriaLabelPlural', "Show {0} hidden chat terminals", hiddenChatTerminalCount);
		this._entry.setAttribute('aria-label', ariaLabel);
	}
}
```

--------------------------------------------------------------------------------

````
