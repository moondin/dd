---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 463
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 463 of 552)

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

---[FILE: src/vs/workbench/contrib/terminal/common/remote/remoteTerminalChannel.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/remote/remoteTerminalChannel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../../base/common/event.js';
import { URI, UriComponents } from '../../../../../base/common/uri.js';
import { IChannel } from '../../../../../base/parts/ipc/common/ipc.js';
import { IWorkbenchConfigurationService } from '../../../../services/configuration/common/configuration.js';
import { IRemoteAuthorityResolverService } from '../../../../../platform/remote/common/remoteAuthorityResolver.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { serializeEnvironmentDescriptionMap, serializeEnvironmentVariableCollection } from '../../../../../platform/terminal/common/environmentVariableShared.js';
import { IConfigurationResolverService } from '../../../../services/configurationResolver/common/configurationResolver.js';
import { SideBySideEditor, EditorResourceAccessor } from '../../../../common/editor.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { Schemas } from '../../../../../base/common/network.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { IEnvironmentVariableService } from '../environmentVariable.js';
import { IProcessDataEvent, IRequestResolveVariablesEvent, IShellLaunchConfigDto, ITerminalLaunchError, ITerminalProfile, ITerminalsLayoutInfo, ITerminalsLayoutInfoById, TerminalIcon, IProcessProperty, ProcessPropertyType, IProcessPropertyMap, TitleEventSource, ISerializedTerminalState, IPtyHostController, ITerminalProcessOptions, IProcessReadyEvent, ITerminalLogService, IPtyHostLatencyMeasurement, ITerminalLaunchResult } from '../../../../../platform/terminal/common/terminal.js';
import { IGetTerminalLayoutInfoArgs, IProcessDetails, ISetTerminalLayoutInfoArgs } from '../../../../../platform/terminal/common/terminalProcess.js';
import { IProcessEnvironment, OperatingSystem } from '../../../../../base/common/platform.js';
import { ICompleteTerminalConfiguration } from '../terminal.js';
import { IPtyHostProcessReplayEvent } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { ISerializableEnvironmentDescriptionMap as ISerializableEnvironmentDescriptionMap, ISerializableEnvironmentVariableCollection } from '../../../../../platform/terminal/common/environmentVariable.js';
import type * as performance from '../../../../../base/common/performance.js';
import { RemoteTerminalChannelEvent, RemoteTerminalChannelRequest } from './terminal.js';
import { ConfigurationResolverExpression } from '../../../../services/configurationResolver/common/configurationResolverExpression.js';

export const REMOTE_TERMINAL_CHANNEL_NAME = 'remoteterminal';

export type ITerminalEnvironmentVariableCollections = [string, ISerializableEnvironmentVariableCollection, ISerializableEnvironmentDescriptionMap][];

export interface IWorkspaceFolderData {
	uri: UriComponents;
	name: string;
	index: number;
}

export interface ICreateTerminalProcessArguments {
	configuration: ICompleteTerminalConfiguration;
	resolvedVariables: { [name: string]: string };
	envVariableCollections: ITerminalEnvironmentVariableCollections;
	shellLaunchConfig: IShellLaunchConfigDto;
	workspaceId: string;
	workspaceName: string;
	workspaceFolders: IWorkspaceFolderData[];
	activeWorkspaceFolder: IWorkspaceFolderData | null;
	activeFileResource: UriComponents | undefined;
	shouldPersistTerminal: boolean;
	options: ITerminalProcessOptions;
	cols: number;
	rows: number;
	unicodeVersion: '6' | '11';
	resolverEnv: { [key: string]: string | null } | undefined;
}

export interface ICreateTerminalProcessResult {
	persistentTerminalId: number;
	resolvedShellLaunchConfig: IShellLaunchConfigDto;
}

export class RemoteTerminalChannelClient implements IPtyHostController {
	get onPtyHostExit(): Event<number> {
		return this._channel.listen<number>(RemoteTerminalChannelEvent.OnPtyHostExitEvent);
	}
	get onPtyHostStart(): Event<void> {
		return this._channel.listen<void>(RemoteTerminalChannelEvent.OnPtyHostStartEvent);
	}
	get onPtyHostUnresponsive(): Event<void> {
		return this._channel.listen<void>(RemoteTerminalChannelEvent.OnPtyHostUnresponsiveEvent);
	}
	get onPtyHostResponsive(): Event<void> {
		return this._channel.listen<void>(RemoteTerminalChannelEvent.OnPtyHostResponsiveEvent);
	}
	get onPtyHostRequestResolveVariables(): Event<IRequestResolveVariablesEvent> {
		return this._channel.listen<IRequestResolveVariablesEvent>(RemoteTerminalChannelEvent.OnPtyHostRequestResolveVariablesEvent);
	}
	get onProcessData(): Event<{ id: number; event: IProcessDataEvent | string }> {
		return this._channel.listen<{ id: number; event: IProcessDataEvent | string }>(RemoteTerminalChannelEvent.OnProcessDataEvent);
	}
	get onProcessExit(): Event<{ id: number; event: number | undefined }> {
		return this._channel.listen<{ id: number; event: number | undefined }>(RemoteTerminalChannelEvent.OnProcessExitEvent);
	}
	get onProcessReady(): Event<{ id: number; event: IProcessReadyEvent }> {
		return this._channel.listen<{ id: number; event: IProcessReadyEvent }>(RemoteTerminalChannelEvent.OnProcessReadyEvent);
	}
	get onProcessReplay(): Event<{ id: number; event: IPtyHostProcessReplayEvent }> {
		return this._channel.listen<{ id: number; event: IPtyHostProcessReplayEvent }>(RemoteTerminalChannelEvent.OnProcessReplayEvent);
	}
	get onProcessOrphanQuestion(): Event<{ id: number }> {
		return this._channel.listen<{ id: number }>(RemoteTerminalChannelEvent.OnProcessOrphanQuestion);
	}
	get onExecuteCommand(): Event<{ reqId: number; persistentProcessId: number; commandId: string; commandArgs: unknown[] }> {
		return this._channel.listen<{ reqId: number; persistentProcessId: number; commandId: string; commandArgs: unknown[] }>(RemoteTerminalChannelEvent.OnExecuteCommand);
	}
	get onDidRequestDetach(): Event<{ requestId: number; workspaceId: string; instanceId: number }> {
		return this._channel.listen<{ requestId: number; workspaceId: string; instanceId: number }>(RemoteTerminalChannelEvent.OnDidRequestDetach);
	}
	get onDidChangeProperty(): Event<{ id: number; property: IProcessProperty }> {
		return this._channel.listen<{ id: number; property: IProcessProperty }>(RemoteTerminalChannelEvent.OnDidChangeProperty);
	}

	constructor(
		private readonly _remoteAuthority: string,
		private readonly _channel: IChannel,
		@IWorkbenchConfigurationService private readonly _configurationService: IWorkbenchConfigurationService,
		@IWorkspaceContextService private readonly _workspaceContextService: IWorkspaceContextService,
		@IConfigurationResolverService private readonly _resolverService: IConfigurationResolverService,
		@IEnvironmentVariableService private readonly _environmentVariableService: IEnvironmentVariableService,
		@IRemoteAuthorityResolverService private readonly _remoteAuthorityResolverService: IRemoteAuthorityResolverService,
		@ITerminalLogService private readonly _logService: ITerminalLogService,
		@IEditorService private readonly _editorService: IEditorService,
		@ILabelService private readonly _labelService: ILabelService,
	) { }

	restartPtyHost(): Promise<void> {
		return this._channel.call(RemoteTerminalChannelRequest.RestartPtyHost, []);
	}

	async createProcess(
		shellLaunchConfig: IShellLaunchConfigDto,
		configuration: ICompleteTerminalConfiguration,
		activeWorkspaceRootUri: URI | undefined,
		options: ITerminalProcessOptions,
		shouldPersistTerminal: boolean,
		cols: number,
		rows: number,
		unicodeVersion: '6' | '11'
	): Promise<ICreateTerminalProcessResult> {
		// Be sure to first wait for the remote configuration
		await this._configurationService.whenRemoteConfigurationLoaded();

		// We will use the resolver service to resolve all the variables in the config / launch config
		// But then we will keep only some variables, since the rest need to be resolved on the remote side
		const resolvedVariables = Object.create(null);
		const lastActiveWorkspace = activeWorkspaceRootUri ? this._workspaceContextService.getWorkspaceFolder(activeWorkspaceRootUri) ?? undefined : undefined;
		const expr = ConfigurationResolverExpression.parse({ shellLaunchConfig, configuration });
		try {
			await this._resolverService.resolveAsync(lastActiveWorkspace, expr);
		} catch (err) {
			this._logService.error(err);
		}
		for (const [{ inner }, resolved] of expr.resolved()) {
			if (/^config:/.test(inner) || inner === 'selectedText' || inner === 'lineNumber') {
				resolvedVariables[inner] = resolved.value;
			}
		}

		const envVariableCollections: ITerminalEnvironmentVariableCollections = [];
		for (const [k, v] of this._environmentVariableService.collections.entries()) {
			envVariableCollections.push([k, serializeEnvironmentVariableCollection(v.map), serializeEnvironmentDescriptionMap(v.descriptionMap)]);
		}

		const resolverResult = await this._remoteAuthorityResolverService.resolveAuthority(this._remoteAuthority);
		const resolverEnv = resolverResult.options && resolverResult.options.extensionHostEnv;

		const workspace = this._workspaceContextService.getWorkspace();
		const workspaceFolders = workspace.folders;
		const activeWorkspaceFolder = activeWorkspaceRootUri ? this._workspaceContextService.getWorkspaceFolder(activeWorkspaceRootUri) : null;

		const activeFileResource = EditorResourceAccessor.getOriginalUri(this._editorService.activeEditor, {
			supportSideBySide: SideBySideEditor.PRIMARY,
			filterByScheme: [Schemas.file, Schemas.vscodeUserData, Schemas.vscodeRemote]
		});

		const args: ICreateTerminalProcessArguments = {
			configuration,
			resolvedVariables,
			envVariableCollections,
			shellLaunchConfig,
			workspaceId: workspace.id,
			workspaceName: this._labelService.getWorkspaceLabel(workspace),
			workspaceFolders,
			activeWorkspaceFolder,
			activeFileResource,
			shouldPersistTerminal,
			options,
			cols,
			rows,
			unicodeVersion,
			resolverEnv
		};
		return await this._channel.call<ICreateTerminalProcessResult>(RemoteTerminalChannelRequest.CreateProcess, args);
	}

	requestDetachInstance(workspaceId: string, instanceId: number): Promise<IProcessDetails | undefined> {
		return this._channel.call(RemoteTerminalChannelRequest.RequestDetachInstance, [workspaceId, instanceId]);
	}
	acceptDetachInstanceReply(requestId: number, persistentProcessId: number): Promise<void> {
		return this._channel.call(RemoteTerminalChannelRequest.AcceptDetachInstanceReply, [requestId, persistentProcessId]);
	}
	attachToProcess(id: number): Promise<void> {
		return this._channel.call(RemoteTerminalChannelRequest.AttachToProcess, [id]);
	}
	detachFromProcess(id: number, forcePersist?: boolean): Promise<void> {
		return this._channel.call(RemoteTerminalChannelRequest.DetachFromProcess, [id, forcePersist]);
	}
	listProcesses(): Promise<IProcessDetails[]> {
		return this._channel.call(RemoteTerminalChannelRequest.ListProcesses);
	}
	getLatency(): Promise<IPtyHostLatencyMeasurement[]> {
		return this._channel.call(RemoteTerminalChannelRequest.GetLatency);
	}
	getPerformanceMarks(): Promise<performance.PerformanceMark[]> {
		return this._channel.call(RemoteTerminalChannelRequest.GetPerformanceMarks);
	}
	reduceConnectionGraceTime(): Promise<void> {
		return this._channel.call(RemoteTerminalChannelRequest.ReduceConnectionGraceTime);
	}
	processBinary(id: number, data: string): Promise<void> {
		return this._channel.call(RemoteTerminalChannelRequest.ProcessBinary, [id, data]);
	}
	start(id: number): Promise<ITerminalLaunchError | ITerminalLaunchResult | undefined> {
		return this._channel.call(RemoteTerminalChannelRequest.Start, [id]);
	}
	input(id: number, data: string): Promise<void> {
		return this._channel.call(RemoteTerminalChannelRequest.Input, [id, data]);
	}
	sendSignal(id: number, signal: string): Promise<void> {
		return this._channel.call(RemoteTerminalChannelRequest.SendSignal, [id, signal]);
	}
	acknowledgeDataEvent(id: number, charCount: number): Promise<void> {
		return this._channel.call(RemoteTerminalChannelRequest.AcknowledgeDataEvent, [id, charCount]);
	}
	setUnicodeVersion(id: number, version: '6' | '11'): Promise<void> {
		return this._channel.call(RemoteTerminalChannelRequest.SetUnicodeVersion, [id, version]);
	}
	setNextCommandId(id: number, commandLine: string, commandId: string): Promise<void> {
		return this._channel.call(RemoteTerminalChannelRequest.SetNextCommandId, [id, commandLine, commandId]);
	}
	shutdown(id: number, immediate: boolean): Promise<void> {
		return this._channel.call(RemoteTerminalChannelRequest.Shutdown, [id, immediate]);
	}
	resize(id: number, cols: number, rows: number): Promise<void> {
		return this._channel.call(RemoteTerminalChannelRequest.Resize, [id, cols, rows]);
	}
	clearBuffer(id: number): Promise<void> {
		return this._channel.call(RemoteTerminalChannelRequest.ClearBuffer, [id]);
	}
	getInitialCwd(id: number): Promise<string> {
		return this._channel.call(RemoteTerminalChannelRequest.GetInitialCwd, [id]);
	}
	getCwd(id: number): Promise<string> {
		return this._channel.call(RemoteTerminalChannelRequest.GetCwd, [id]);
	}
	orphanQuestionReply(id: number): Promise<void> {
		return this._channel.call(RemoteTerminalChannelRequest.OrphanQuestionReply, [id]);
	}
	sendCommandResult(reqId: number, isError: boolean, payload: unknown): Promise<void> {
		return this._channel.call(RemoteTerminalChannelRequest.SendCommandResult, [reqId, isError, payload]);
	}
	freePortKillProcess(port: string): Promise<{ port: string; processId: string }> {
		return this._channel.call(RemoteTerminalChannelRequest.FreePortKillProcess, [port]);
	}
	getDefaultSystemShell(osOverride?: OperatingSystem): Promise<string> {
		return this._channel.call(RemoteTerminalChannelRequest.GetDefaultSystemShell, [osOverride]);
	}
	getProfiles(profiles: unknown, defaultProfile: unknown, includeDetectedProfiles?: boolean): Promise<ITerminalProfile[]> {
		return this._channel.call(RemoteTerminalChannelRequest.GetProfiles, [this._workspaceContextService.getWorkspace().id, profiles, defaultProfile, includeDetectedProfiles]);
	}
	acceptPtyHostResolvedVariables(requestId: number, resolved: string[]): Promise<void> {
		return this._channel.call(RemoteTerminalChannelRequest.AcceptPtyHostResolvedVariables, [requestId, resolved]);
	}

	getEnvironment(): Promise<IProcessEnvironment> {
		return this._channel.call(RemoteTerminalChannelRequest.GetEnvironment);
	}

	getWslPath(original: string, direction: 'unix-to-win' | 'win-to-unix'): Promise<string> {
		return this._channel.call(RemoteTerminalChannelRequest.GetWslPath, [original, direction]);
	}

	setTerminalLayoutInfo(layout?: ITerminalsLayoutInfoById): Promise<void> {
		const workspace = this._workspaceContextService.getWorkspace();
		const args: ISetTerminalLayoutInfoArgs = {
			workspaceId: workspace.id,
			tabs: layout ? layout.tabs : [],
			background: layout ? layout.background : null
		};
		return this._channel.call<void>(RemoteTerminalChannelRequest.SetTerminalLayoutInfo, args);
	}

	updateTitle(id: number, title: string, titleSource: TitleEventSource): Promise<string> {
		return this._channel.call(RemoteTerminalChannelRequest.UpdateTitle, [id, title, titleSource]);
	}

	updateIcon(id: number, userInitiated: boolean, icon: TerminalIcon, color?: string): Promise<string> {
		return this._channel.call(RemoteTerminalChannelRequest.UpdateIcon, [id, userInitiated, icon, color]);
	}

	refreshProperty<T extends ProcessPropertyType>(id: number, property: T): Promise<IProcessPropertyMap[T]> {
		return this._channel.call(RemoteTerminalChannelRequest.RefreshProperty, [id, property]);
	}

	updateProperty<T extends ProcessPropertyType>(id: number, property: T, value: IProcessPropertyMap[T]): Promise<void> {
		return this._channel.call(RemoteTerminalChannelRequest.UpdateProperty, [id, property, value]);
	}

	getTerminalLayoutInfo(): Promise<ITerminalsLayoutInfo | undefined> {
		const workspace = this._workspaceContextService.getWorkspace();
		const args: IGetTerminalLayoutInfoArgs = {
			workspaceId: workspace.id,
		};
		return this._channel.call<ITerminalsLayoutInfo>(RemoteTerminalChannelRequest.GetTerminalLayoutInfo, args);
	}

	reviveTerminalProcesses(workspaceId: string, state: ISerializedTerminalState[], dateTimeFormatLocate: string): Promise<void> {
		return this._channel.call(RemoteTerminalChannelRequest.ReviveTerminalProcesses, [workspaceId, state, dateTimeFormatLocate]);
	}

	getRevivedPtyNewId(id: number): Promise<number | undefined> {
		return this._channel.call(RemoteTerminalChannelRequest.GetRevivedPtyNewId, [id]);
	}

	serializeTerminalState(ids: number[]): Promise<string> {
		return this._channel.call(RemoteTerminalChannelRequest.SerializeTerminalState, [ids]);
	}

	// #region Pty service contribution RPC calls

	installAutoReply(match: string, reply: string): Promise<void> {
		return this._channel.call(RemoteTerminalChannelRequest.InstallAutoReply, [match, reply]);
	}
	uninstallAllAutoReplies(): Promise<void> {
		return this._channel.call(RemoteTerminalChannelRequest.UninstallAllAutoReplies, []);
	}

	// #endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/remote/terminal.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/remote/terminal.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { UriComponents } from '../../../../../base/common/uri.js';
import { IShellLaunchConfigDto, ITerminalProcessOptions } from '../../../../../platform/terminal/common/terminal.js';
import { ICompleteTerminalConfiguration } from '../terminal.js';
import { ISerializableEnvironmentDescriptionMap as ISerializableEnvironmentDescriptionMap, ISerializableEnvironmentVariableCollection } from '../../../../../platform/terminal/common/environmentVariable.js';

export const REMOTE_TERMINAL_CHANNEL_NAME = 'remoteterminal';

export type ITerminalEnvironmentVariableCollections = [string, ISerializableEnvironmentVariableCollection, ISerializableEnvironmentDescriptionMap][];

export interface IWorkspaceFolderData {
	uri: UriComponents;
	name: string;
	index: number;
}

export interface ICreateTerminalProcessArguments {
	configuration: ICompleteTerminalConfiguration;
	resolvedVariables: { [name: string]: string };
	envVariableCollections: ITerminalEnvironmentVariableCollections;
	shellLaunchConfig: IShellLaunchConfigDto;
	workspaceId: string;
	workspaceName: string;
	workspaceFolders: IWorkspaceFolderData[];
	activeWorkspaceFolder: IWorkspaceFolderData | null;
	activeFileResource: UriComponents | undefined;
	shouldPersistTerminal: boolean;
	options: ITerminalProcessOptions;
	cols: number;
	rows: number;
	unicodeVersion: '6' | '11';
	resolverEnv: { [key: string]: string | null } | undefined;
}

export interface ICreateTerminalProcessResult {
	persistentTerminalId: number;
	resolvedShellLaunchConfig: IShellLaunchConfigDto;
}

export const enum RemoteTerminalChannelEvent {
	OnPtyHostExitEvent = '$onPtyHostExitEvent',
	OnPtyHostStartEvent = '$onPtyHostStartEvent',
	OnPtyHostUnresponsiveEvent = '$onPtyHostUnresponsiveEvent',
	OnPtyHostResponsiveEvent = '$onPtyHostResponsiveEvent',
	OnPtyHostRequestResolveVariablesEvent = '$onPtyHostRequestResolveVariablesEvent',
	OnProcessDataEvent = '$onProcessDataEvent',
	OnProcessReadyEvent = '$onProcessReadyEvent',
	OnProcessExitEvent = '$onProcessExitEvent',
	OnProcessReplayEvent = '$onProcessReplayEvent',
	OnProcessOrphanQuestion = '$onProcessOrphanQuestion',
	OnExecuteCommand = '$onExecuteCommand',
	OnDidRequestDetach = '$onDidRequestDetach',
	OnDidChangeProperty = '$onDidChangeProperty',
}

export const enum RemoteTerminalChannelRequest {
	RestartPtyHost = '$restartPtyHost',
	CreateProcess = '$createProcess',
	AttachToProcess = '$attachToProcess',
	DetachFromProcess = '$detachFromProcess',
	ListProcesses = '$listProcesses',
	GetLatency = '$getLatency',
	GetPerformanceMarks = '$getPerformanceMarks',
	OrphanQuestionReply = '$orphanQuestionReply',
	AcceptPtyHostResolvedVariables = '$acceptPtyHostResolvedVariables',
	Start = '$start',
	Input = '$input',
	SendSignal = '$sendSignal',
	AcknowledgeDataEvent = '$acknowledgeDataEvent',
	Shutdown = '$shutdown',
	Resize = '$resize',
	ClearBuffer = '$clearBuffer',
	GetInitialCwd = '$getInitialCwd',
	GetCwd = '$getCwd',
	ProcessBinary = '$processBinary',
	SendCommandResult = '$sendCommandResult',
	InstallAutoReply = '$installAutoReply',
	UninstallAllAutoReplies = '$uninstallAllAutoReplies',
	GetDefaultSystemShell = '$getDefaultSystemShell',
	GetProfiles = '$getProfiles',
	GetEnvironment = '$getEnvironment',
	GetWslPath = '$getWslPath',
	GetTerminalLayoutInfo = '$getTerminalLayoutInfo',
	SetTerminalLayoutInfo = '$setTerminalLayoutInfo',
	SerializeTerminalState = '$serializeTerminalState',
	ReviveTerminalProcesses = '$reviveTerminalProcesses',
	GetRevivedPtyNewId = '$getRevivedPtyNewId',
	SetUnicodeVersion = '$setUnicodeVersion',
	SetNextCommandId = '$setNextCommandId',
	ReduceConnectionGraceTime = '$reduceConnectionGraceTime',
	UpdateIcon = '$updateIcon',
	UpdateTitle = '$updateTitle',
	UpdateProperty = '$updateProperty',
	RefreshProperty = '$refreshProperty',
	RequestDetachInstance = '$requestDetachInstance',
	AcceptDetachInstanceReply = '$acceptDetachInstanceReply',
	AcceptDetachedInstance = '$acceptDetachedInstance',
	FreePortKillProcess = '$freePortKillProcess',
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/scripts/cgmanifest.json]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/scripts/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "other",
				"other": {
					"name": "posh-git",
					"downloadUrl": "https://github.com/dahlbyk/posh-git",
					"version": "70e44dc0c2cdaf10c0cc8eb9ef5a9ca65ab63dcf"
				}
			},
			"licenseDetail": [
				"Oniguruma LICENSE",
				"-----------------",
				"",
				"Copyright (c) 2002-2020  K.Kosako  <kkosako0@gmail.com>",
				"All rights reserved.",
				"",
				"The BSD License",
				"",
				"Redistribution and use in source and binary forms, with or without",
				"modification, are permitted provided that the following conditions",
				"are met:",
				"1. Redistributions of source code must retain the above copyright",
				"   notice, this list of conditions and the following disclaimer.",
				"2. Redistributions in binary form must reproduce the above copyright",
				"   notice, this list of conditions and the following disclaimer in the",
				"   documentation and/or other materials provided with the distribution.",
				"",
				"THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND",
				"ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE",
				"IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE",
				"ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE",
				"FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL",
				"DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS",
				"OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)",
				"HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT",
				"LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY",
				"OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF",
				"SUCH DAMAGE."
			],
			"isOnlyProductionDependency": true,
			"license": "MIT",
			"version": "70e44dc0c2cdaf10c0cc8eb9ef5a9ca65ab63dcf"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/scripts/shellIntegration-bash.sh]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/scripts/shellIntegration-bash.sh

```bash
# ---------------------------------------------------------------------------------------------
#   Copyright (c) Microsoft Corporation. All rights reserved.
#   Licensed under the MIT License. See License.txt in the project root for license information.
# ---------------------------------------------------------------------------------------------

# Prevent the script recursing when setting up
if [[ -n "${VSCODE_SHELL_INTEGRATION:-}" ]]; then
	builtin return
fi

VSCODE_SHELL_INTEGRATION=1

vsc_env_keys=()
vsc_env_values=()
use_associative_array=0
bash_major_version=${BASH_VERSINFO[0]}

__vscode_shell_env_reporting="${VSCODE_SHELL_ENV_REPORTING:-}"
unset VSCODE_SHELL_ENV_REPORTING

envVarsToReport=()
IFS=',' read -ra envVarsToReport <<< "$__vscode_shell_env_reporting"

if (( BASH_VERSINFO[0] >= 4 )); then
	use_associative_array=1
	# Associative arrays are only available in bash 4.0+
	declare -A vsc_aa_env
fi

# Run relevant rc/profile only if shell integration has been injected, not when run manually
if [ "$VSCODE_INJECTION" == "1" ]; then
	if [ -z "$VSCODE_SHELL_LOGIN" ]; then
		if [ -r ~/.bashrc ]; then
			. ~/.bashrc
		fi
	else
		# Imitate -l because --init-file doesn't support it:
		# run the first of these files that exists
		if [ -r /etc/profile ]; then
			. /etc/profile
		fi
		# execute the first that exists
		if [ -r ~/.bash_profile ]; then
			. ~/.bash_profile
		elif [ -r ~/.bash_login ]; then
			. ~/.bash_login
		elif [ -r ~/.profile ]; then
			. ~/.profile
		fi
		builtin unset VSCODE_SHELL_LOGIN

		# Apply any explicit path prefix (see #99878)
		if [ -n "${VSCODE_PATH_PREFIX:-}" ]; then
			export PATH="$VSCODE_PATH_PREFIX$PATH"
			builtin unset VSCODE_PATH_PREFIX
		fi
	fi
	builtin unset VSCODE_INJECTION
fi

if [ -z "$VSCODE_SHELL_INTEGRATION" ]; then
	builtin return
fi

# Apply EnvironmentVariableCollections if needed
if [ -n "${VSCODE_ENV_REPLACE:-}" ]; then
	IFS=':' read -ra ADDR <<< "$VSCODE_ENV_REPLACE"
	for ITEM in "${ADDR[@]}"; do
		VARNAME="$(echo $ITEM | cut -d "=" -f 1)"
		VALUE="$(echo -e "$ITEM" | cut -d "=" -f 2-)"
		export $VARNAME="$VALUE"
	done
	builtin unset VSCODE_ENV_REPLACE
fi
if [ -n "${VSCODE_ENV_PREPEND:-}" ]; then
	IFS=':' read -ra ADDR <<< "$VSCODE_ENV_PREPEND"
	for ITEM in "${ADDR[@]}"; do
		VARNAME="$(echo $ITEM | cut -d "=" -f 1)"
		VALUE="$(echo -e "$ITEM" | cut -d "=" -f 2-)"
		export $VARNAME="$VALUE${!VARNAME}"
	done
	builtin unset VSCODE_ENV_PREPEND
fi
if [ -n "${VSCODE_ENV_APPEND:-}" ]; then
	IFS=':' read -ra ADDR <<< "$VSCODE_ENV_APPEND"
	for ITEM in "${ADDR[@]}"; do
		VARNAME="$(echo $ITEM | cut -d "=" -f 1)"
		VALUE="$(echo -e "$ITEM" | cut -d "=" -f 2-)"
		export $VARNAME="${!VARNAME}$VALUE"
	done
	builtin unset VSCODE_ENV_APPEND
fi

# Register Python shell activate hooks
# Prevent multiple activation with guard
if [ -z "${VSCODE_PYTHON_AUTOACTIVATE_GUARD:-}" ]; then
	export VSCODE_PYTHON_AUTOACTIVATE_GUARD=1
	if [ -n "${VSCODE_PYTHON_BASH_ACTIVATE:-}" ] && [ "$TERM_PROGRAM" = "vscode" ]; then
		# Prevent crashing by negating exit code
		if ! builtin eval "$VSCODE_PYTHON_BASH_ACTIVATE"; then
			__vsc_activation_status=$?
			builtin printf '\x1b[0m\x1b[7m * \x1b[0;103m VS Code Python bash activation failed with exit code %d \x1b[0m' "$__vsc_activation_status"
		fi
	fi
fi

__vsc_get_trap() {
	# 'trap -p DEBUG' outputs a shell command like `trap -- '…shellcode…' DEBUG`.
	# The terms are quoted literals, but are not guaranteed to be on a single line.
	# (Consider a trap like $'echo foo\necho \'bar\'').
	# To parse, we splice those terms into an expression capturing them into an array.
	# This preserves the quoting of those terms: when we `eval` that expression, they are preserved exactly.
	# This is different than simply exploding the string, which would split everything on IFS, oblivious to quoting.
	builtin local -a terms
	builtin eval "terms=( $(trap -p "${1:-DEBUG}") )"
	#                    |________________________|
	#                            |
	#        \-------------------*--------------------/
	# terms=( trap  --  '…arbitrary shellcode…'  DEBUG )
	#        |____||__| |_____________________| |_____|
	#          |    |            |                |
	#          0    1            2                3
	#                            |
	#                   \--------*----/
	builtin printf '%s' "${terms[2]:-}"
}

__vsc_escape_value_fast() {
	builtin local LC_ALL=C out
	out=${1//\\/\\\\}
	out=${out//;/\\x3b}
	builtin printf '%s\n' "${out}"
}

# The property (P) and command (E) codes embed values which require escaping.
# Backslashes are doubled. Non-alphanumeric characters are converted to escaped hex.
__vsc_escape_value() {
	# If the input being too large, switch to the faster function
	if [ "${#1}" -ge 2000 ]; then
		__vsc_escape_value_fast "$1"
		builtin return
	fi

	# Process text byte by byte, not by codepoint.
	builtin local -r LC_ALL=C
	builtin local -r str="${1}"
	builtin local -ir len="${#str}"

	builtin local -i i
	builtin local -i val
	builtin local byte
	builtin local token
	builtin local out=''

	for (( i=0; i < "${#str}"; ++i )); do
		# Escape backslashes, semi-colons specially, then special ASCII chars below space (0x20).
		byte="${str:$i:1}"
		builtin printf -v val '%d' "'$byte"
		if  (( val < 31 )); then
			builtin printf -v token '\\x%02x' "'$byte"
		elif (( val == 92 )); then # \
			token="\\\\"
		elif (( val == 59 )); then # ;
			token="\\x3b"
		else
			token="$byte"
		fi

		out+="$token"
	done

	builtin printf '%s\n' "$out"
}

# Send the IsWindows property if the environment looks like Windows
__vsc_regex_environment="^CYGWIN*|MINGW*|MSYS*"
if [[ "$(uname -s)" =~ $__vsc_regex_environment ]]; then
	builtin printf '\e]633;P;IsWindows=True\a'
	__vsc_is_windows=1
else
	__vsc_is_windows=0
fi

# Allow verifying $BASH_COMMAND doesn't have aliases resolved via history when the right HISTCONTROL
# configuration is used
__vsc_regex_histcontrol=".*(erasedups|ignoreboth|ignoredups).*"
if [[ "${HISTCONTROL:-}" =~ $__vsc_regex_histcontrol ]]; then
	__vsc_history_verify=0
else
	__vsc_history_verify=1
fi

builtin unset __vsc_regex_environment
builtin unset __vsc_regex_histcontrol

__vsc_initialized=0
__vsc_original_PS1="$PS1"
__vsc_original_PS2="$PS2"
__vsc_custom_PS1=""
__vsc_custom_PS2=""
__vsc_in_command_execution="1"
__vsc_current_command=""

# It's fine this is in the global scope as it getting at it requires access to the shell environment
__vsc_nonce="$VSCODE_NONCE"
unset VSCODE_NONCE

# Some features should only work in Insiders
__vsc_stable="$VSCODE_STABLE"
unset VSCODE_STABLE

# Report continuation prompt
if [ "$__vsc_stable" = "0" ]; then
	builtin printf "\e]633;P;ContinuationPrompt=$(echo "$PS2" | sed 's/\x1b/\\\\x1b/g')\a"
fi

if [ -n "$STARSHIP_SESSION_KEY" ]; then
	builtin printf '\e]633;P;PromptType=starship\a'
elif [ -n "$POSH_SESSION_ID" ]; then
	builtin printf '\e]633;P;PromptType=oh-my-posh\a'
fi

# Report this shell supports rich command detection
builtin printf '\e]633;P;HasRichCommandDetection=True\a'

__vsc_report_prompt() {
	# Expand the original PS1 similarly to how bash would normally
	# See https://stackoverflow.com/a/37137981 for technique
	if ((BASH_VERSINFO[0] >= 5 || (BASH_VERSINFO[0] == 4 && BASH_VERSINFO[1] >= 4))); then
		__vsc_prompt=${__vsc_original_PS1@P}
	else
		__vsc_prompt=${__vsc_original_PS1}
	fi

	__vsc_prompt="$(builtin printf "%s" "${__vsc_prompt//[$'\001'$'\002']}")"
	builtin printf "\e]633;P;Prompt=%s\a" "$(__vsc_escape_value "${__vsc_prompt}")"
}

__vsc_prompt_start() {
	builtin printf '\e]633;A\a'
}

__vsc_prompt_end() {
	builtin printf '\e]633;B\a'
}

__vsc_update_cwd() {
	if [ "$__vsc_is_windows" = "1" ]; then
		__vsc_cwd="$(cygpath -m "$PWD")"
	else
		__vsc_cwd="$PWD"
	fi
	builtin printf '\e]633;P;Cwd=%s\a' "$(__vsc_escape_value "$__vsc_cwd")"
}

__updateEnvCacheAA() {
	local key="$1"
	local value="$2"
	if [ "$use_associative_array" = 1 ]; then
		if [[ "${vsc_aa_env[$key]}" != "$value" ]]; then
			vsc_aa_env["$key"]="$value"
			builtin printf '\e]633;EnvSingleEntry;%s;%s;%s\a' "$key" "$(__vsc_escape_value "$value")" "$__vsc_nonce"
		fi
	fi
}

__updateEnvCache() {
	local key="$1"
	local value="$2"

	for i in "${!vsc_env_keys[@]}"; do
		if [[ "${vsc_env_keys[$i]}" == "$key" ]]; then
			if [[ "${vsc_env_values[$i]}" != "$value" ]]; then
				vsc_env_values[$i]="$value"
				builtin printf '\e]633;EnvSingleEntry;%s;%s;%s\a' "$key" "$(__vsc_escape_value "$value")" "$__vsc_nonce"
			fi
			return
		fi
	done

	vsc_env_keys+=("$key")
	vsc_env_values+=("$value")
	builtin printf '\e]633;EnvSingleEntry;%s;%s;%s\a' "$key" "$(__vsc_escape_value "$value")" "$__vsc_nonce"
}

__vsc_update_env() {
	if [[ ${#envVarsToReport[@]} -gt 0 ]]; then
		builtin printf '\e]633;EnvSingleStart;%s;%s\a' 0 $__vsc_nonce

		if [ "$use_associative_array" = 1 ]; then
			if [ ${#vsc_aa_env[@]} -eq 0 ]; then
				# Associative array is empty, do not diff, just add
				for key in "${envVarsToReport[@]}"; do
					if [ -n "${!key+x}" ]; then
						local value="${!key}"
						vsc_aa_env["$key"]="$value"
						builtin printf '\e]633;EnvSingleEntry;%s;%s;%s\a' "$key" "$(__vsc_escape_value "$value")" "$__vsc_nonce"
					fi
				done
			else
				# Diff approach for associative array
				for key in "${envVarsToReport[@]}"; do
					if [ -n "${!key+x}" ]; then
						local value="${!key}"
						__updateEnvCacheAA "$key" "$value"
					fi
				done
				# Track missing env vars not needed for now, as we are only tracking pre-defined env var from terminalEnvironment.
			fi

		else
			if [[ -z ${vsc_env_keys[@]} ]] && [[ -z ${vsc_env_values[@]} ]]; then
				# Non associative arrays are both empty, do not diff, just add
				for key in "${envVarsToReport[@]}"; do
					if [ -n "${!key+x}" ]; then
						local value="${!key}"
						vsc_env_keys+=("$key")
						vsc_env_values+=("$value")
						builtin printf '\e]633;EnvSingleEntry;%s;%s;%s\a' "$key" "$(__vsc_escape_value "$value")" "$__vsc_nonce"
					fi
				done
			else
				# Diff approach for non-associative arrays
				for key in "${envVarsToReport[@]}"; do
					if [ -n "${!key+x}" ]; then
						local value="${!key}"
						__updateEnvCache "$key" "$value"
					fi
				done
				# Track missing env vars not needed for now, as we are only tracking pre-defined env var from terminalEnvironment.
			fi
		fi
		builtin printf '\e]633;EnvSingleEnd;%s;\a' $__vsc_nonce
	fi
}

__vsc_command_output_start() {
	if [[ -z "${__vsc_first_prompt-}" ]]; then
		builtin return
	fi
	builtin printf '\e]633;E;%s;%s\a' "$(__vsc_escape_value "${__vsc_current_command}")" $__vsc_nonce
	builtin printf '\e]633;C\a'
}

__vsc_continuation_start() {
	builtin printf '\e]633;F\a'
}

__vsc_continuation_end() {
	builtin printf '\e]633;G\a'
}

__vsc_command_complete() {
	if [[ -z "${__vsc_first_prompt-}" ]]; then
		__vsc_update_cwd
		builtin return
	fi
	if [ "$__vsc_current_command" = "" ]; then
		builtin printf '\e]633;D\a'
	else
		builtin printf '\e]633;D;%s\a' "$__vsc_status"
	fi
	__vsc_update_cwd
}
__vsc_update_prompt() {
	# in command execution
	if [ "$__vsc_in_command_execution" = "1" ]; then
		# Wrap the prompt if it is not yet wrapped, if the PS1 changed this this was last set it
		# means the user re-exported the PS1 so we should re-wrap it
		if [[ "$__vsc_custom_PS1" == "" || "$__vsc_custom_PS1" != "$PS1" ]]; then
			__vsc_original_PS1=$PS1
			__vsc_custom_PS1="\[$(__vsc_prompt_start)\]$__vsc_original_PS1\[$(__vsc_prompt_end)\]"
			PS1="$__vsc_custom_PS1"
		fi
		if [[ "$__vsc_custom_PS2" == "" || "$__vsc_custom_PS2" != "$PS2" ]]; then
			__vsc_original_PS2=$PS2
			__vsc_custom_PS2="\[$(__vsc_continuation_start)\]$__vsc_original_PS2\[$(__vsc_continuation_end)\]"
			PS2="$__vsc_custom_PS2"
		fi
		__vsc_in_command_execution="0"
	fi
}

__vsc_precmd() {
	__vsc_command_complete "$__vsc_status"
	__vsc_current_command=""
	# Report prompt is a work in progress, currently encoding is too slow
	if [ "$__vsc_stable" = "0" ]; then
		__vsc_report_prompt
	fi
	__vsc_first_prompt=1
	__vsc_update_prompt
	__vsc_update_env
}

__vsc_preexec() {
	__vsc_initialized=1
	if [[ ! $BASH_COMMAND == __vsc_prompt* ]]; then
		# Use history if it's available to verify the command as BASH_COMMAND comes in with aliases
		# resolved
		if [ "$__vsc_history_verify" = "1" ]; then
			__vsc_current_command="$(builtin history 1 | sed 's/ *[0-9]* *//')"
		else
			__vsc_current_command=$BASH_COMMAND
		fi
	else
		__vsc_current_command=""
	fi
	__vsc_command_output_start
}

# Debug trapping/preexec inspired by starship (ISC)
if [[ -n "${bash_preexec_imported:-}" ]]; then
	__vsc_preexec_only() {
		if [ "$__vsc_in_command_execution" = "0" ]; then
			__vsc_in_command_execution="1"
			__vsc_preexec
		fi
	}
	precmd_functions+=(__vsc_prompt_cmd)
	preexec_functions+=(__vsc_preexec_only)
else
	__vsc_dbg_trap="$(__vsc_get_trap DEBUG)"

	if [[ -z "$__vsc_dbg_trap" ]]; then
		__vsc_preexec_only() {
			if [ "$__vsc_in_command_execution" = "0" ]; then
				__vsc_in_command_execution="1"
				__vsc_preexec
			fi
		}
		trap '__vsc_preexec_only "$_"' DEBUG
	elif [[ "$__vsc_dbg_trap" != '__vsc_preexec "$_"' && "$__vsc_dbg_trap" != '__vsc_preexec_all "$_"' ]]; then
		__vsc_preexec_all() {
			if [ "$__vsc_in_command_execution" = "0" ]; then
				__vsc_in_command_execution="1"
				__vsc_preexec
				builtin eval "${__vsc_dbg_trap}"
			fi
		}
		trap '__vsc_preexec_all "$_"' DEBUG
	fi
fi

__vsc_update_prompt

__vsc_restore_exit_code() {
	return "$1"
}

__vsc_prompt_cmd_original() {
	__vsc_status="$?"
	builtin local cmd
	__vsc_restore_exit_code "${__vsc_status}"
	# Evaluate the original PROMPT_COMMAND similarly to how bash would normally
	# See https://unix.stackexchange.com/a/672843 for technique
	for cmd in "${__vsc_original_prompt_command[@]}"; do
		eval "${cmd:-}"
	done
	__vsc_precmd
}

__vsc_prompt_cmd() {
	__vsc_status="$?"
	__vsc_precmd
}

# PROMPT_COMMAND arrays and strings seem to be handled the same (handling only the first entry of
# the array?)
__vsc_original_prompt_command=${PROMPT_COMMAND:-}

if [[ -z "${bash_preexec_imported:-}" ]]; then
	if [[ -n "${__vsc_original_prompt_command:-}" && "${__vsc_original_prompt_command:-}" != "__vsc_prompt_cmd" ]]; then
		PROMPT_COMMAND=__vsc_prompt_cmd_original
	else
		PROMPT_COMMAND=__vsc_prompt_cmd
	fi
fi
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/scripts/shellIntegration-env.zsh]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/scripts/shellIntegration-env.zsh

```text
# ---------------------------------------------------------------------------------------------
#   Copyright (c) Microsoft Corporation. All rights reserved.
#   Licensed under the MIT License. See License.txt in the project root for license information.
# ---------------------------------------------------------------------------------------------
if [[ -f $USER_ZDOTDIR/.zshenv ]]; then
	VSCODE_ZDOTDIR=$ZDOTDIR
	ZDOTDIR=$USER_ZDOTDIR

	# prevent recursion
	if [[ $USER_ZDOTDIR != $VSCODE_ZDOTDIR ]]; then
		. $USER_ZDOTDIR/.zshenv
	fi

	USER_ZDOTDIR=$ZDOTDIR
	ZDOTDIR=$VSCODE_ZDOTDIR
fi
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/scripts/shellIntegration-login.zsh]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/scripts/shellIntegration-login.zsh

```text
# ---------------------------------------------------------------------------------------------
#   Copyright (c) Microsoft Corporation. All rights reserved.
#   Licensed under the MIT License. See License.txt in the project root for license information.
# ---------------------------------------------------------------------------------------------

# Prevent recursive sourcing
if [[ -n "$VSCODE_LOGIN_INITIALIZED" ]]; then
	return
fi
export VSCODE_LOGIN_INITIALIZED=1

ZDOTDIR=$USER_ZDOTDIR
if [[ $options[norcs] = off && -o "login" &&  -f $ZDOTDIR/.zlogin ]]; then
	. $ZDOTDIR/.zlogin
fi
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/scripts/shellIntegration-profile.zsh]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/scripts/shellIntegration-profile.zsh

```text
# ---------------------------------------------------------------------------------------------
#   Copyright (c) Microsoft Corporation. All rights reserved.
#   Licensed under the MIT License. See License.txt in the project root for license information.
# ---------------------------------------------------------------------------------------------

# Prevent recursive sourcing
if [[ -n "$VSCODE_PROFILE_INITIALIZED" ]]; then
	return
fi
export VSCODE_PROFILE_INITIALIZED=1

if [[ $options[norcs] = off && -o "login" ]]; then
	if [[ -f $USER_ZDOTDIR/.zprofile ]]; then
		VSCODE_ZDOTDIR=$ZDOTDIR
		ZDOTDIR=$USER_ZDOTDIR
		. $USER_ZDOTDIR/.zprofile
		ZDOTDIR=$VSCODE_ZDOTDIR
	fi

	# Apply any explicit path prefix (see #99878)
	if (( ${+VSCODE_PATH_PREFIX} )); then
		export PATH="$VSCODE_PATH_PREFIX$PATH"
	fi
	builtin unset VSCODE_PATH_PREFIX
fi
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/scripts/shellIntegration-rc.zsh]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/scripts/shellIntegration-rc.zsh

```text
# ---------------------------------------------------------------------------------------------
#   Copyright (c) Microsoft Corporation. All rights reserved.
#   Licensed under the MIT License. See License.txt in the project root for license information.
# ---------------------------------------------------------------------------------------------
builtin autoload -Uz add-zsh-hook is-at-least

# Prevent the script recursing when setting up
if [ -n "$VSCODE_SHELL_INTEGRATION" ]; then
	ZDOTDIR=$USER_ZDOTDIR
	builtin return
fi

# This variable allows the shell to both detect that VS Code's shell integration is enabled as well
# as disable it by unsetting the variable.
VSCODE_SHELL_INTEGRATION=1

# By default, zsh will set the $HISTFILE to the $ZDOTDIR location automatically. In the case of the
# shell integration being injected, this means that the terminal will use a different history file
# to other terminals. To fix this issue, set $HISTFILE back to the default location before ~/.zshrc
# is called as that may depend upon the value.
if [[  "$VSCODE_INJECTION" == "1" ]]; then
	HISTFILE=$USER_ZDOTDIR/.zsh_history
fi

# Only fix up ZDOTDIR if shell integration was injected (not manually installed) and has not been called yet
if [[ "$VSCODE_INJECTION" == "1" ]]; then
	if [[ $options[norcs] = off  && -f $USER_ZDOTDIR/.zshrc ]]; then
		VSCODE_ZDOTDIR=$ZDOTDIR
		ZDOTDIR=$USER_ZDOTDIR
		# A user's custom HISTFILE location might be set when their .zshrc file is sourced below
		. $USER_ZDOTDIR/.zshrc
	fi
fi

__vsc_use_aa=0
__vsc_env_keys=()
__vsc_env_values=()

# Associative array are only available in zsh 4.3 or later
if is-at-least 4.3; then
	__vsc_use_aa=1
	typeset -A vsc_aa_env
fi

# Apply EnvironmentVariableCollections if needed
if [ -n "${VSCODE_ENV_REPLACE:-}" ]; then
	IFS=':' read -rA ADDR <<< "$VSCODE_ENV_REPLACE"
	for ITEM in "${ADDR[@]}"; do
		VARNAME="$(echo ${ITEM%%=*})"
		export $VARNAME="$(echo -e ${ITEM#*=})"
	done
	unset VSCODE_ENV_REPLACE
fi
if [ -n "${VSCODE_ENV_PREPEND:-}" ]; then
	IFS=':' read -rA ADDR <<< "$VSCODE_ENV_PREPEND"
	for ITEM in "${ADDR[@]}"; do
		VARNAME="$(echo ${ITEM%%=*})"
		export $VARNAME="$(echo -e ${ITEM#*=})${(P)VARNAME}"
	done
	unset VSCODE_ENV_PREPEND
fi
if [ -n "${VSCODE_ENV_APPEND:-}" ]; then
	IFS=':' read -rA ADDR <<< "$VSCODE_ENV_APPEND"
	for ITEM in "${ADDR[@]}"; do
		VARNAME="$(echo ${ITEM%%=*})"
		export $VARNAME="${(P)VARNAME}$(echo -e ${ITEM#*=})"
	done
	unset VSCODE_ENV_APPEND
fi

# Register Python shell activate hooks
# Prevent multiple activation with guard
if [ -z "${VSCODE_PYTHON_AUTOACTIVATE_GUARD:-}" ]; then
	export VSCODE_PYTHON_AUTOACTIVATE_GUARD=1
	if [ -n "${VSCODE_PYTHON_ZSH_ACTIVATE:-}" ] && [ "$TERM_PROGRAM" = "vscode" ]; then
		# Prevent crashing by negating exit code
		if ! builtin eval "$VSCODE_PYTHON_ZSH_ACTIVATE"; then
			__vsc_activation_status=$?
			builtin printf '\x1b[0m\x1b[7m * \x1b[0;103m VS Code Python zsh activation failed with exit code %d \x1b[0m' "$__vsc_activation_status"
		fi
	fi
fi

# Report prompt type
if [ -n "${P9K_SSH:-}" ] || [ -n "${P9K_TTY:-}" ]; then
	builtin printf '\e]633;P;PromptType=p10k\a'
	# Force shell integration on for p10k
	# typeset -g POWERLEVEL9K_TERM_SHELL_INTEGRATION=true
elif [ -n "${ZSH:-}" ] && [ -n "$ZSH_VERSION" ] && (( ${+functions[omz]} )); then
	builtin printf '\e]633;P;PromptType=oh-my-zsh\a'
elif [ -n "${STARSHIP_SESSION_KEY:-}" ]; then
	builtin printf '\e]633;P;PromptType=starship\a'
fi

# Shell integration was disabled by the shell, exit without warning assuming either the shell has
# explicitly disabled shell integration as it's incompatible or it implements the protocol.
if [ -z "$VSCODE_SHELL_INTEGRATION" ]; then
	builtin return
fi

# The property (P) and command (E) codes embed values which require escaping.
# Backslashes are doubled. Non-alphanumeric characters are converted to escaped hex.
__vsc_escape_value() {
	builtin emulate -L zsh

	# Process text byte by byte, not by codepoint.
	builtin local LC_ALL=C str="$1" i byte token out='' val

	for (( i = 0; i < ${#str}; ++i )); do
	# Escape backslashes, semi-colons specially, then special ASCII chars below space (0x20).
		byte="${str:$i:1}"
		val=$(printf "%d" "'$byte")
		if (( val < 31 )); then
			# For control characters, use hex encoding
			token=$(printf "\\\\x%02x" "'$byte")
		elif [ "$byte" = "\\" ]; then
			token="\\\\"
		elif [ "$byte" = ";" ]; then
			token="\\x3b"
		else
			token="$byte"
		fi

		out+="$token"
	done

	builtin print -r -- "$out"
}

__vsc_in_command_execution="1"
__vsc_current_command=""

# It's fine this is in the global scope as it getting at it requires access to the shell environment
__vsc_nonce="$VSCODE_NONCE"
unset VSCODE_NONCE

__vscode_shell_env_reporting="${VSCODE_SHELL_ENV_REPORTING:-}"
unset VSCODE_SHELL_ENV_REPORTING

envVarsToReport=()
IFS=',' read -rA envVarsToReport <<< "$__vscode_shell_env_reporting"

builtin printf "\e]633;P;ContinuationPrompt=%s\a" "$(echo "$PS2" | sed 's/\x1b/\\\\x1b/g')"

# Report this shell supports rich command detection
builtin printf '\e]633;P;HasRichCommandDetection=True\a'

__vsc_prompt_start() {
	builtin printf '\e]633;A\a'
}

__vsc_prompt_end() {
	builtin printf '\e]633;B\a'
}

__vsc_update_cwd() {
	builtin printf '\e]633;P;Cwd=%s\a' "$(__vsc_escape_value "${PWD}")"
}

__update_env_cache_aa() {
	local key="$1"
	local value="$2"
	if [ $__vsc_use_aa -eq 1 ]; then
		if [[ "${vsc_aa_env["$key"]}" != "$value" ]]; then
			vsc_aa_env["$key"]="$value"
			builtin printf '\e]633;EnvSingleEntry;%s;%s;%s\a' "$key" "$(__vsc_escape_value "$value")" "$__vsc_nonce"
		fi
	fi
}

__update_env_cache() {
	local key="$1"
	local value="$2"

	for (( i=1; i <= $#__vsc_env_keys; i++ )); do
		if [[ "${__vsc_env_keys[$i]}" == "$key" ]]; then
			if [[ "${__vsc_env_values[$i]}" != "$value" ]]; then
				__vsc_env_values[$i]="$value"
				builtin printf '\e]633;EnvSingleEntry;%s;%s;%s\a' "$key" "$(__vsc_escape_value "$value")" "$__vsc_nonce"
			fi
			return
		fi
	done

		# Key does not exist so add key, value pair
		__vsc_env_keys+=("$key")
		__vsc_env_values+=("$value")
		builtin printf '\e]633;EnvSingleEntry;%s;%s;%s\a' "$key" "$(__vsc_escape_value "$value")" "$__vsc_nonce"
}

__vsc_update_env() {
	if [[ ${#envVarsToReport[@]} -gt 0 ]]; then
		builtin printf '\e]633;EnvSingleStart;%s;%s;\a' 0 $__vsc_nonce
		if [ $__vsc_use_aa -eq 1 ]; then
			if [[ ${#vsc_aa_env[@]} -eq 0 ]]; then
				# Associative array is empty, do not diff, just add
				for key in "${envVarsToReport[@]}"; do
					if [[ -n "$key" && -n "${(P)key+_}" ]]; then
						vsc_aa_env["$key"]="${(P)key}"
						builtin printf '\e]633;EnvSingleEntry;%s;%s;%s\a' "$key" "$(__vsc_escape_value "${(P)key}")" "$__vsc_nonce"
					fi
				done
			else
				# Diff approach for associative array
				for var in "${envVarsToReport[@]}"; do
					if [[ -n "$var" && -n "${(P)var+_}" ]]; then
						value="${(P)var}"
						__update_env_cache_aa "$var" "$value"
					fi
				done
				# Track missing env vars not needed for now, as we are only tracking pre-defined env var from terminalEnvironment.
			fi
		else
			# Two arrays approach
			if [[ ${#__vsc_env_keys[@]} -eq 0 ]] && [[ ${#__vsc_env_values[@]} -eq 0 ]]; then
				# Non-associative arrays are both empty, do not diff, just add
				for key in "${envVarsToReport[@]}"; do
					if [[ -n "$key" && -n "${(P)key+_}" ]]; then
						value="${(P)key}"
						__vsc_env_keys+=("$key")
						__vsc_env_values+=("$value")
						builtin printf '\e]633;EnvSingleEntry;%s;%s;%s\a' "$key" "$(__vsc_escape_value "$value")" "$__vsc_nonce"
					fi
				done
			else
				# Diff approach for non-associative arrays
				for var in "${envVarsToReport[@]}"; do
					if [[ -n "$var" && -n "${(P)var+_}" ]]; then
						value="${(P)var}"
						__update_env_cache "$var" "$value"
					fi
				done
				# Track missing env vars not needed for now, as we are only tracking pre-defined env var from terminalEnvironment.
			fi
		fi

		builtin printf '\e]633;EnvSingleEnd;%s;\a' $__vsc_nonce
	fi
}

__vsc_command_output_start() {
	builtin printf '\e]633;E;%s;%s\a' "$(__vsc_escape_value "${__vsc_current_command}")" $__vsc_nonce
	builtin printf '\e]633;C\a'
}

__vsc_continuation_start() {
	builtin printf '\e]633;F\a'
}

__vsc_continuation_end() {
	builtin printf '\e]633;G\a'
}

__vsc_right_prompt_start() {
	builtin printf '\e]633;H\a'
}

__vsc_right_prompt_end() {
	builtin printf '\e]633;I\a'
}

__vsc_command_complete() {
	if [[ "$__vsc_current_command" == "" ]]; then
		builtin printf '\e]633;D\a'
	else
		builtin printf '\e]633;D;%s\a' "$__vsc_status"
	fi
	__vsc_update_cwd
}

if [[ -o NOUNSET ]]; then
	if [ -z "${RPROMPT-}" ]; then
		RPROMPT=""
	fi
fi
__vsc_update_prompt() {
	__vsc_prior_prompt="$PS1"
	__vsc_prior_prompt2="$PS2"
	__vsc_in_command_execution=""
	PS1="%{$(__vsc_prompt_start)%}$PS1%{$(__vsc_prompt_end)%}"
	PS2="%{$(__vsc_continuation_start)%}$PS2%{$(__vsc_continuation_end)%}"
	if [ -n "$RPROMPT" ]; then
		__vsc_prior_rprompt="$RPROMPT"
		RPROMPT="%{$(__vsc_right_prompt_start)%}$RPROMPT%{$(__vsc_right_prompt_end)%}"
	fi
}

__vsc_precmd() {
	builtin local __vsc_status="$?"
	if [ -z "${__vsc_in_command_execution-}" ]; then
		# not in command execution
		__vsc_command_output_start
	fi

	__vsc_command_complete "$__vsc_status"
	__vsc_current_command=""

	# in command execution
	if [ -n "$__vsc_in_command_execution" ]; then
		# non null
		__vsc_update_prompt
	fi
	__vsc_update_env
}

__vsc_preexec() {
	PS1="$__vsc_prior_prompt"
	PS2="$__vsc_prior_prompt2"
	if [ -n "$RPROMPT" ]; then
		RPROMPT="$__vsc_prior_rprompt"
	fi
	__vsc_in_command_execution="1"
	__vsc_current_command=$1
	__vsc_command_output_start
}
add-zsh-hook precmd __vsc_precmd
add-zsh-hook preexec __vsc_preexec

if [[ $options[login] = off && $USER_ZDOTDIR != $VSCODE_ZDOTDIR ]]; then
	ZDOTDIR=$USER_ZDOTDIR
fi
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/scripts/shellIntegration.fish]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/scripts/shellIntegration.fish

```text
# ---------------------------------------------------------------------------------------------
#   Copyright (c) Microsoft Corporation. All rights reserved.
#   Licensed under the MIT License. See License.txt in the project root for license information.
# ---------------------------------------------------------------------------------------------
#
# Visual Studio Code terminal integration for fish
#
# Manual installation:
#
#   (1) Add the following to the end of `$__fish_config_dir/config.fish`:
#
#         string match -q "$TERM_PROGRAM" "vscode"
#         and . (code --locate-shell-integration-path fish)
#
#   (2) Restart fish.

# Don't run in scripts, other terminals, or more than once per session.
status is-interactive
and string match --quiet "$TERM_PROGRAM" "vscode"
and ! set --query VSCODE_SHELL_INTEGRATION
or exit

set --global VSCODE_SHELL_INTEGRATION 1
set --global __vscode_shell_env_reporting $VSCODE_SHELL_ENV_REPORTING
set -e VSCODE_SHELL_ENV_REPORTING
set -g envVarsToReport
if test -n "$__vscode_shell_env_reporting"
	set envVarsToReport (string split "," "$__vscode_shell_env_reporting")
end

# Apply any explicit path prefix (see #99878)
# On fish, '$fish_user_paths' is always prepended to the PATH, for both login and non-login shells, so we need
# to apply the path prefix fix always, not only for login shells (see #232291)
if set -q VSCODE_PATH_PREFIX
	set -gx PATH "$VSCODE_PATH_PREFIX$PATH"
end
set -e VSCODE_PATH_PREFIX

set -g vsc_env_keys
set -g vsc_env_values

# Tracks if the shell has been initialized, this prevents
set -g vsc_initialized 0

set -g __vsc_applied_env_vars 0
function __vsc_apply_env_vars
	if test $__vsc_applied_env_vars -eq 1;
		return
	end
	set -l __vsc_applied_env_vars 1
	# Apply EnvironmentVariableCollections if needed
	if test -n "$VSCODE_ENV_REPLACE"
		set ITEMS (string split : $VSCODE_ENV_REPLACE)
		for B in $ITEMS
			set split (string split -m1 = $B)
			set -gx "$split[1]" (echo -e "$split[2]")
		end
		set -e VSCODE_ENV_REPLACE
	end
	if test -n "$VSCODE_ENV_PREPEND"
		set ITEMS (string split : $VSCODE_ENV_PREPEND)
		for B in $ITEMS
			set split (string split -m1 = $B)
			set -gx "$split[1]" (echo -e "$split[2]")"$$split[1]" # avoid -p as it adds a space
		end
		set -e VSCODE_ENV_PREPEND
	end
	if test -n "$VSCODE_ENV_APPEND"
		set ITEMS (string split : $VSCODE_ENV_APPEND)
		for B in $ITEMS
			set split (string split -m1 = $B)
			set -gx "$split[1]" "$$split[1]"(echo -e "$split[2]") # avoid -a as it adds a space
		end
		set -e VSCODE_ENV_APPEND
	end
end

# Register Python shell activate hooks
# Prevent multiple activation with guard
if not set -q VSCODE_PYTHON_AUTOACTIVATE_GUARD
	set -gx VSCODE_PYTHON_AUTOACTIVATE_GUARD 1
	if test -n "$VSCODE_PYTHON_FISH_ACTIVATE"; and test "$TERM_PROGRAM" = "vscode"
		# Fish does not crash on eval failure, so don't need negation.
		eval $VSCODE_PYTHON_FISH_ACTIVATE
		set __vsc_activation_status $status

		if test $__vsc_activation_status -ne 0
			builtin printf '\x1b[0m\x1b[7m * \x1b[0;103m VS Code Python fish activation failed with exit code %d \x1b[0m \n' "$__vsc_activation_status"
		end
	end
end

# Handle the shell integration nonce
if set -q VSCODE_NONCE
	set -l __vsc_nonce $VSCODE_NONCE
	set -e VSCODE_NONCE
end

# Helper function
function __vsc_esc -d "Emit escape sequences for VS Code shell integration"
	builtin printf "\e]633;%s\a" (string join ";" -- $argv)
end

# Sent right before executing an interactive command.
# Marks the beginning of command output.
function __vsc_cmd_executed --on-event fish_preexec
	__vsc_esc E (__vsc_escape_value "$argv") $__vsc_nonce
	__vsc_esc C

	# Creates a marker to indicate a command was run.
	set --global _vsc_has_cmd
end


# Escape a value for use in the 'P' ("Property") or 'E' ("Command Line") sequences.
# Backslashes are doubled and non-alphanumeric characters are hex encoded.
function __vsc_escape_value
	# Escape backslashes and semi-colons
	echo $argv \
	| string replace --all '\\' '\\\\' \
	| string replace --all ';' '\\x3b' \
	;
end

# Sent right after an interactive command has finished executing.
# Marks the end of command output.
function __vsc_cmd_finished --on-event fish_postexec
	__vsc_esc D $status
end

# Sent when a command line is cleared or reset, but no command was run.
# Marks the cleared line with neither success nor failure.
function __vsc_cmd_clear --on-event fish_cancel
	if test $vsc_initialized -eq 0;
		return
	end
	__vsc_esc E "" $__vsc_nonce
	__vsc_esc C
	__vsc_esc D
end

# Preserve the user's existing prompt, to wrap in our escape sequences.
function __preserve_fish_prompt --on-event fish_prompt
	if functions --query fish_prompt
		if functions --query __vsc_fish_prompt
			# Erase the fallback so it can be set to the user's prompt
			functions --erase __vsc_fish_prompt
		end
		functions --copy fish_prompt __vsc_fish_prompt
		functions --erase __preserve_fish_prompt
		# Now __vsc_fish_prompt is guaranteed to be defined
		__init_vscode_shell_integration
	else
		if functions --query __vsc_fish_prompt
			functions --erase __preserve_fish_prompt
			__init_vscode_shell_integration
		else
			# There is no fish_prompt set, so stick with the default
			# Now __vsc_fish_prompt is guaranteed to be defined
			function __vsc_fish_prompt
				echo -n (whoami)@(prompt_hostname) (prompt_pwd) '~> '
			end
		end
	end
end

# Sent whenever a new fish prompt is about to be displayed.
# Updates the current working directory.
function __vsc_update_cwd --on-event fish_prompt
	__vsc_esc P Cwd=(__vsc_escape_value "$PWD")

	# If a command marker exists, remove it.
	# Otherwise, the commandline is empty and no command was run.
	if set --query _vsc_has_cmd
		set --erase _vsc_has_cmd
	else
		__vsc_cmd_clear
	end
end

if test -n "$__vscode_shell_env_reporting"
	function __vsc_update_env --on-event fish_prompt
		if test (count $envVarsToReport) -gt 0
			__vsc_esc EnvSingleStart 1

			for key in $envVarsToReport
				if set -q $key
					set -l value $$key
					__vsc_esc EnvSingleEntry $key (__vsc_escape_value "$value")
				end
			end

			__vsc_esc EnvSingleEnd
		end
	end
end

# Sent at the start of the prompt.
# Marks the beginning of the prompt (and, implicitly, a new line).
function __vsc_fish_prompt_start
	# Applying environment variables is deferred to after config.fish has been
	# evaluated
	__vsc_apply_env_vars
	__vsc_esc A
	set -g vsc_initialized 1
end

# Sent at the end of the prompt.
# Marks the beginning of the user's command input.
function __vsc_fish_cmd_start
	__vsc_esc B
end

function __vsc_fish_has_mode_prompt -d "Returns true if fish_mode_prompt is defined and not empty"
	functions fish_mode_prompt | string match -rvq '^ *(#|function |end$|$)'
end

# Preserve and wrap fish_mode_prompt (which appears to the left of the regular
# prompt), but only if it's not defined as an empty function (which is the
# officially documented way to disable that feature).
function __init_vscode_shell_integration
	if __vsc_fish_has_mode_prompt
		functions --copy fish_mode_prompt __vsc_fish_mode_prompt

		function fish_mode_prompt
			__vsc_fish_prompt_start
			__vsc_fish_mode_prompt
		end

		function fish_prompt
			__vsc_fish_prompt
			__vsc_fish_cmd_start
		end
	else
		# No fish_mode_prompt, so put everything in fish_prompt.
		function fish_prompt
			__vsc_fish_prompt_start
			__vsc_fish_prompt
			__vsc_fish_cmd_start
		end
	end
end

# Report prompt type
if set -q POSH_SESSION_ID
	__vsc_esc P PromptType=oh-my-posh
end

# Report this shell supports rich command detection
__vsc_esc P HasRichCommandDetection=True

__preserve_fish_prompt
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/scripts/shellIntegration.ps1]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/scripts/shellIntegration.ps1

```powershell
# ---------------------------------------------------------------------------------------------
#   Copyright (c) Microsoft Corporation. All rights reserved.
#   Licensed under the MIT License. See License.txt in the project root for license information.
# ---------------------------------------------------------------------------------------------

# Prevent installing more than once per session
if ((Test-Path variable:global:__VSCodeState) -and $null -ne $Global:__VSCodeState.OriginalPrompt) {
	return;
}

# Disable shell integration when the language mode is restricted
if ($ExecutionContext.SessionState.LanguageMode -ne "FullLanguage") {
	return;
}

$Global:__VSCodeState = @{
	OriginalPrompt = $function:Prompt
	LastHistoryId = -1
	IsInExecution = $false
	EnvVarsToReport = @()
	Nonce = $null
	IsStable = $null
	IsA11yMode = $null
	IsWindows10 = $false
}

# Store the nonce in a regular variable and unset the environment variable. It's by design that
# anything that can execute PowerShell code can read the nonce, as it's basically impossible to hide
# in PowerShell. The most important thing is getting it out of the environment.
$Global:__VSCodeState.Nonce = $env:VSCODE_NONCE
$env:VSCODE_NONCE = $null

$Global:__VSCodeState.IsStable = $env:VSCODE_STABLE
$env:VSCODE_STABLE = $null

$Global:__VSCodeState.IsA11yMode = $env:VSCODE_A11Y_MODE
$env:VSCODE_A11Y_MODE = $null

$__vscode_shell_env_reporting = $env:VSCODE_SHELL_ENV_REPORTING
$env:VSCODE_SHELL_ENV_REPORTING = $null
if ($__vscode_shell_env_reporting) {
	$Global:__VSCodeState.EnvVarsToReport = $__vscode_shell_env_reporting.Split(',')
}
Remove-Variable -Name __vscode_shell_env_reporting -ErrorAction SilentlyContinue

$osVersion = [System.Environment]::OSVersion.Version
$Global:__VSCodeState.IsWindows10 = $IsWindows -and $osVersion.Major -eq 10 -and $osVersion.Minor -eq 0 -and $osVersion.Build -lt 22000
Remove-Variable -Name osVersion -ErrorAction SilentlyContinue

if ($env:VSCODE_ENV_REPLACE) {
	$Split = $env:VSCODE_ENV_REPLACE.Split(":")
	foreach ($Item in $Split) {
		$Inner = $Item.Split('=', 2)
		[Environment]::SetEnvironmentVariable($Inner[0], $Inner[1].Replace('\x3a', ':'))
	}
	$env:VSCODE_ENV_REPLACE = $null
}
if ($env:VSCODE_ENV_PREPEND) {
	$Split = $env:VSCODE_ENV_PREPEND.Split(":")
	foreach ($Item in $Split) {
		$Inner = $Item.Split('=', 2)
		[Environment]::SetEnvironmentVariable($Inner[0], $Inner[1].Replace('\x3a', ':') + [Environment]::GetEnvironmentVariable($Inner[0]))
	}
	$env:VSCODE_ENV_PREPEND = $null
}
if ($env:VSCODE_ENV_APPEND) {
	$Split = $env:VSCODE_ENV_APPEND.Split(":")
	foreach ($Item in $Split) {
		$Inner = $Item.Split('=', 2)
		[Environment]::SetEnvironmentVariable($Inner[0], [Environment]::GetEnvironmentVariable($Inner[0]) + $Inner[1].Replace('\x3a', ':'))
	}
	$env:VSCODE_ENV_APPEND = $null
}

# Register Python shell activate hooks
# Prevent multiple activation with guard
if (-not $env:VSCODE_PYTHON_AUTOACTIVATE_GUARD) {
	$env:VSCODE_PYTHON_AUTOACTIVATE_GUARD = '1'
	if ($env:VSCODE_PYTHON_PWSH_ACTIVATE -and $env:TERM_PROGRAM -eq 'vscode') {
		$activateScript = $env:VSCODE_PYTHON_PWSH_ACTIVATE
		Remove-Item Env:VSCODE_PYTHON_PWSH_ACTIVATE

		try {
			Invoke-Expression $activateScript
			$Global:__VSCodeState.OriginalPrompt = $function:Prompt
		}
		catch {
			$activationError = $_
			Write-Host "`e[0m`e[7m * `e[0;103m VS Code Python powershell activation failed with exit code $($activationError.Exception.Message) `e[0m"
		}
	}
}

function Global:__VSCode-Escape-Value([string]$value) {
	# NOTE: In PowerShell v6.1+, this can be written `$value -replace '…', { … }` instead of `[regex]::Replace`.
	# Replace any non-alphanumeric characters.
	[regex]::Replace($value, "[$([char]0x00)-$([char]0x1f)\\\n;]", { param($match)
			# Encode the (ascii) matches as `\x<hex>`
			-Join (
				[System.Text.Encoding]::UTF8.GetBytes($match.Value) | ForEach-Object { '\x{0:x2}' -f $_ }
			)
		})
}

function Global:Prompt() {
	$FakeCode = [int]!$global:?
	# NOTE: We disable strict mode for the scope of this function because it unhelpfully throws an
	# error when $LastHistoryEntry is null, and is not otherwise useful.
	Set-StrictMode -Off
	$LastHistoryEntry = Get-History -Count 1
	$Result = ""
	# Skip finishing the command if the first command has not yet started or an execution has not
	# yet begun
	if ($Global:__VSCodeState.LastHistoryId -ne -1 -and ($Global:__VSCodeState.HasPSReadLine -eq $false -or $Global:__VSCodeState.IsInExecution -eq $true)) {
		$Global:__VSCodeState.IsInExecution = $false
		if ($LastHistoryEntry.Id -eq $Global:__VSCodeState.LastHistoryId) {
			# Don't provide a command line or exit code if there was no history entry (eg. ctrl+c, enter on no command)
			$Result += "$([char]0x1b)]633;D`a"
		}
		else {
			# Command finished exit code
			# OSC 633 ; D [; <ExitCode>] ST
			$Result += "$([char]0x1b)]633;D;$FakeCode`a"
		}
	}
	# Prompt started
	# OSC 633 ; A ST
	$Result += "$([char]0x1b)]633;A`a"
	# Current working directory
	# OSC 633 ; <Property>=<Value> ST
	$Result += if ($pwd.Provider.Name -eq 'FileSystem') { "$([char]0x1b)]633;P;Cwd=$(__VSCode-Escape-Value $pwd.ProviderPath)`a" }

	# Send current environment variables as JSON
	# OSC 633 ; EnvJson ; <Environment> ; <Nonce>
	if ($Global:__VSCodeState.EnvVarsToReport.Count -gt 0) {
		$envMap = @{}
        foreach ($varName in $Global:__VSCodeState.EnvVarsToReport) {
            if (Test-Path "env:$varName") {
                $envMap[$varName] = (Get-Item "env:$varName").Value
            }
        }
        $envJson = $envMap | ConvertTo-Json -Compress
        $Result += "$([char]0x1b)]633;EnvJson;$(__VSCode-Escape-Value $envJson);$($Global:__VSCodeState.Nonce)`a"
	}

	# Before running the original prompt, put $? back to what it was:
	if ($FakeCode -ne 0) {
		Write-Error "failure" -ea ignore
	}
	# Run the original prompt
	$OriginalPrompt += $Global:__VSCodeState.OriginalPrompt.Invoke()
	$Result += $OriginalPrompt

	# Prompt
	# OSC 633 ; <Property>=<Value> ST
	if ($Global:__VSCodeState.IsStable -eq "0") {
		$Result += "$([char]0x1b)]633;P;Prompt=$(__VSCode-Escape-Value $OriginalPrompt)`a"
	}

	# Write command started
	$Result += "$([char]0x1b)]633;B`a"
	$Global:__VSCodeState.LastHistoryId = $LastHistoryEntry.Id
	return $Result
}

# Report prompt type
if ($env:STARSHIP_SESSION_KEY) {
	[Console]::Write("$([char]0x1b)]633;P;PromptType=starship`a")
}
elseif ($env:POSH_SESSION_ID) {
	[Console]::Write("$([char]0x1b)]633;P;PromptType=oh-my-posh`a")
}
elseif ((Test-Path variable:global:GitPromptSettings) -and $Global:GitPromptSettings) {
	[Console]::Write("$([char]0x1b)]633;P;PromptType=posh-git`a")
}

if ($Global:__VSCodeState.IsA11yMode -eq "1") {
	if (-not (Get-Module -Name PSReadLine)) {
		$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
		$specialPsrlPath = Join-Path $scriptRoot 'psreadline'
		Import-Module $specialPsrlPath
		if (Get-Module -Name PSReadLine) {
			Set-PSReadLineOption -EnableScreenReaderMode
		}
	}
}

# Only send the command executed sequence when PSReadLine is loaded, if not shell integration should
# still work thanks to the command line sequence
$Global:__VSCodeState.HasPSReadLine = $false
if (Get-Module -Name PSReadLine) {
	$Global:__VSCodeState.HasPSReadLine = $true
	[Console]::Write("$([char]0x1b)]633;P;HasRichCommandDetection=True`a")

	$Global:__VSCodeState.OriginalPSConsoleHostReadLine = $function:PSConsoleHostReadLine
	function Global:PSConsoleHostReadLine {
		$CommandLine = $Global:__VSCodeState.OriginalPSConsoleHostReadLine.Invoke()
		$Global:__VSCodeState.IsInExecution = $true

		# Command line
		# OSC 633 ; E [; <CommandLine> [; <Nonce>]] ST
		$Result = "$([char]0x1b)]633;E;"
		$Result += $(__VSCode-Escape-Value $CommandLine)
		# Only send the nonce if the OS is not Windows 10 as it seems to echo to the terminal
		# sometimes
		if ($Global:__VSCodeState.IsWindows10 -eq $false) {
			$Result += ";$($Global:__VSCodeState.Nonce)"
		}
		$Result += "`a"

		# Command executed
		# OSC 633 ; C ST
		$Result += "$([char]0x1b)]633;C`a"

		# Write command executed sequence directly to Console to avoid the new line from Write-Host
		[Console]::Write($Result)

		$CommandLine
	}

	# Set ContinuationPrompt property
	$Global:__VSCodeState.ContinuationPrompt = (Get-PSReadLineOption).ContinuationPrompt
	if ($Global:__VSCodeState.ContinuationPrompt) {
		[Console]::Write("$([char]0x1b)]633;P;ContinuationPrompt=$(__VSCode-Escape-Value $Global:__VSCodeState.ContinuationPrompt)`a")
	}
}

# Set IsWindows property
if ($PSVersionTable.PSVersion -lt "6.0") {
	# Windows PowerShell is only available on Windows
	[Console]::Write("$([char]0x1b)]633;P;IsWindows=$true`a")
}
else {
	[Console]::Write("$([char]0x1b)]633;P;IsWindows=$IsWindows`a")
}

# Set always on key handlers which map to default VS Code keybindings
function Set-MappedKeyHandler {
	param ([string[]] $Chord, [string[]]$Sequence)
	try {
		$Handler = Get-PSReadLineKeyHandler -Chord $Chord | Select-Object -First 1
	}
 catch [System.Management.Automation.ParameterBindingException] {
		# PowerShell 5.1 ships with PSReadLine 2.0.0 which does not have -Chord,
		# so we check what's bound and filter it.
		$Handler = Get-PSReadLineKeyHandler -Bound | Where-Object -FilterScript { $_.Key -eq $Chord } | Select-Object -First 1
	}
	if ($Handler) {
		Set-PSReadLineKeyHandler -Chord $Sequence -Function $Handler.Function
	}
}

function Set-MappedKeyHandlers {
	Set-MappedKeyHandler -Chord Ctrl+Spacebar -Sequence 'F12,a'
	Set-MappedKeyHandler -Chord Alt+Spacebar -Sequence 'F12,b'
	Set-MappedKeyHandler -Chord Shift+Enter -Sequence 'F12,c'
	Set-MappedKeyHandler -Chord Shift+End -Sequence 'F12,d'
}

if ($Global:__VSCodeState.HasPSReadLine) {
	Set-MappedKeyHandlers
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/scripts/psreadline/cgmanifest.json]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/scripts/psreadline/cgmanifest.json

```json
{
  "version": 1,
  "registrations": [
    {
      "component": {
        "type": "git",
        "git": {
          "name": "PSReadLine",
          "repositoryUrl": "https://github.com/PowerShell/PSReadLine",
          "commitHash": "b5aac30d26ce777497e85203dc59989296b73f8e"
        }
      },
      "version": "2.4.4-beta4",
      "licenseDetail": [
        "Copyright (c) 2013, Jason Shirk",
        "All rights reserved.",
        "",
        "Redistribution and use in source and binary forms, with or without",
        "modification, are permitted provided that the following conditions are met: ",
        "",
        "1. Redistributions of source code must retain the above copyright notice, this",
        "   list of conditions and the following disclaimer. ",
        "2. Redistributions in binary form must reproduce the above copyright notice,",
        "   this list of conditions and the following disclaimer in the documentation",
        "   and/or other materials provided with the distribution. ",
        "",
        "THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\" AND",
        "ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED",
        "WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE",
        "DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR",
        "ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES",
        "(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;",
        "LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND",
        "ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT",
        "(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS",
        "SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE."
      ]
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/scripts/psreadline/PSReadLine.format.ps1xml]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/scripts/psreadline/PSReadLine.format.ps1xml

```text
<Configuration>
  <ViewDefinitions>
    <View>
      <Name>PSReadLine-KeyBindings</Name>
      <ViewSelectedBy>
        <TypeName>Microsoft.PowerShell.KeyHandler</TypeName>
      </ViewSelectedBy>
      <GroupBy>
        <PropertyName>Group</PropertyName>
        <CustomControl>
          <CustomEntries>
            <CustomEntry>
              <CustomItem>
                <ExpressionBinding>
                  <ScriptBlock>
$d = [Microsoft.PowerShell.KeyHandler]::GetGroupingDescription($_.Group)
"{0}`n{1}" -f $d,('='*$d.Length)
</ScriptBlock>
                </ExpressionBinding>
              </CustomItem>
            </CustomEntry>
          </CustomEntries>
        </CustomControl>
      </GroupBy>
      <TableControl>
        <TableHeaders>
          <TableColumnHeader>
            <Label>Key</Label>
          </TableColumnHeader>
          <TableColumnHeader>
            <Label>Function</Label>
          </TableColumnHeader>
          <TableColumnHeader>
            <Label>Description</Label>
          </TableColumnHeader>
        </TableHeaders>
        <TableRowEntries>
          <TableRowEntry>
            <Wrap/>
            <TableColumnItems>
              <TableColumnItem>
                <PropertyName>Key</PropertyName>
              </TableColumnItem>
              <TableColumnItem>
                <PropertyName>Function</PropertyName>
              </TableColumnItem>
              <TableColumnItem>
                <PropertyName>Description</PropertyName>
              </TableColumnItem>
            </TableColumnItems>
          </TableRowEntry>
        </TableRowEntries>
      </TableControl>
    </View>
    <View>
      <Name>PSReadLine-HistoryItem</Name>
      <ViewSelectedBy>
        <TypeName>Microsoft.PowerShell.PSConsoleReadLine+HistoryItem</TypeName>
      </ViewSelectedBy>
      <ListControl>
        <ListEntries>
          <ListEntry>
            <ListItems>
              <ListItem>
                <PropertyName>CommandLine</PropertyName>
              </ListItem>
              <ListItem>
                <ItemSelectionCondition><ScriptBlock>$_.StartTime.Ticks -ne 0</ScriptBlock></ItemSelectionCondition>
                <Label>StartTime</Label>
                <ScriptBlock>$_.StartTime.ToLocalTime()</ScriptBlock>
              </ListItem>
              <ListItem>
                <ItemSelectionCondition><ScriptBlock>$_.ApproximateElapsedTime.Ticks -ne 0</ScriptBlock></ItemSelectionCondition>
                <PropertyName>ApproximateElapsedTime</PropertyName>
              </ListItem>
            </ListItems>
          </ListEntry>
        </ListEntries>
      </ListControl>
    </View>
    <View>
      <Name>PSReadLine-Options</Name>
      <ViewSelectedBy>
        <TypeName>Microsoft.PowerShell.PSConsoleReadLineOptions</TypeName>
      </ViewSelectedBy>
      <ListControl>
        <ListEntries>
          <ListEntry>
            <ListItems>
              <ListItem>
                <PropertyName>EditMode</PropertyName>
              </ListItem>
              <ListItem>
                <PropertyName>AddToHistoryHandler</PropertyName>
              </ListItem>
              <ListItem>
                <PropertyName>HistoryNoDuplicates</PropertyName>
              </ListItem>
              <ListItem>
                <PropertyName>HistorySavePath</PropertyName>
              </ListItem>
              <ListItem>
                <PropertyName>HistorySaveStyle</PropertyName>
              </ListItem>
              <ListItem>
                <PropertyName>HistorySearchCaseSensitive</PropertyName>
              </ListItem>
              <ListItem>
                <PropertyName>HistorySearchCursorMovesToEnd</PropertyName>
              </ListItem>
              <ListItem>
                <PropertyName>MaximumHistoryCount</PropertyName>
              </ListItem>
              <ListItem>
                <PropertyName>ContinuationPrompt</PropertyName>
              </ListItem>
              <ListItem>
                <PropertyName>ExtraPromptLineCount</PropertyName>
              </ListItem>
              <ListItem>
                <PropertyName>PromptText</PropertyName>
              </ListItem>
              <ListItem>
                <PropertyName>BellStyle</PropertyName>
              </ListItem>
              <ListItem>
                <PropertyName>DingDuration</PropertyName>
              </ListItem>
              <ListItem>
                <PropertyName>DingTone</PropertyName>
              </ListItem>
              <ListItem>
                <PropertyName>CommandsToValidateScriptBlockArguments</PropertyName>
              </ListItem>
              <ListItem>
                <PropertyName>CommandValidationHandler</PropertyName>
              </ListItem>
              <ListItem>
                <PropertyName>CompletionQueryItems</PropertyName>
              </ListItem>
              <ListItem>
                <PropertyName>MaximumKillRingCount</PropertyName>
              </ListItem>
              <ListItem>
                <PropertyName>ShowToolTips</PropertyName>
              </ListItem>
              <ListItem>
                <PropertyName>ViModeIndicator</PropertyName>
              </ListItem>
              <ListItem>
                  <Label>ViModeChangeHandler</Label>
                  <ItemSelectionCondition><ScriptBlock>$null -ne $_.ViModeChangeHandler</ScriptBlock></ItemSelectionCondition>
                  <PropertyName>ViModeChangeHandler</PropertyName>
              </ListItem>
              <ListItem>
                <PropertyName>WordDelimiters</PropertyName>
              </ListItem>
              <ListItem>
                <PropertyName>AnsiEscapeTimeout</PropertyName>
              </ListItem>
              <ListItem>
                <PropertyName>PredictionSource</PropertyName>
              </ListItem>
              <ListItem>
                <PropertyName>PredictionViewStyle</PropertyName>
              </ListItem>
              <ListItem>
                <PropertyName>TerminateOrphanedConsoleApps</PropertyName>
              </ListItem>
              <ListItem>
                <Label>CommandColor</Label>
                <ScriptBlock>[Microsoft.PowerShell.VTColorUtils]::FormatColor($_.CommandColor)</ScriptBlock>
              </ListItem>
              <ListItem>
                <Label>CommentColor</Label>
                <ScriptBlock>[Microsoft.PowerShell.VTColorUtils]::FormatColor($_.CommentColor)</ScriptBlock>
              </ListItem>
              <ListItem>
                <Label>ContinuationPromptColor</Label>
                <ScriptBlock>[Microsoft.PowerShell.VTColorUtils]::FormatColor($_.ContinuationPromptColor)</ScriptBlock>
              </ListItem>
              <ListItem>
                <Label>DefaultTokenColor</Label>
                <ScriptBlock>[Microsoft.PowerShell.VTColorUtils]::FormatColor($_.DefaultTokenColor)</ScriptBlock>
              </ListItem>
              <ListItem>
                <Label>EmphasisColor</Label>
                <ScriptBlock>[Microsoft.PowerShell.VTColorUtils]::FormatColor($_.EmphasisColor)</ScriptBlock>
              </ListItem>
              <ListItem>
                <Label>ErrorColor</Label>
                <ScriptBlock>[Microsoft.PowerShell.VTColorUtils]::FormatColor($_.ErrorColor)</ScriptBlock>
              </ListItem>
              <ListItem>
                <Label>InlinePredictionColor</Label>
                <ScriptBlock>[Microsoft.PowerShell.VTColorUtils]::FormatColor($_.InlinePredictionColor)</ScriptBlock>
              </ListItem>
              <ListItem>
                <Label>KeywordColor</Label>
                <ScriptBlock>[Microsoft.PowerShell.VTColorUtils]::FormatColor($_.KeywordColor)</ScriptBlock>
              </ListItem>
              <ListItem>
                <Label>ListPredictionColor</Label>
                <ScriptBlock>[Microsoft.PowerShell.VTColorUtils]::FormatColor($_.ListPredictionColor)</ScriptBlock>
              </ListItem>
              <ListItem>
                <Label>ListPredictionSelectedColor</Label>
                <ScriptBlock>[Microsoft.PowerShell.VTColorUtils]::FormatColor($_.ListPredictionSelectedColor)</ScriptBlock>
              </ListItem>
              <ListItem>
                <Label>ListPredictionTooltipColor</Label>
                <ScriptBlock>[Microsoft.PowerShell.VTColorUtils]::FormatColor($_.ListPredictionTooltipColor)</ScriptBlock>
              </ListItem>
              <ListItem>
                <Label>MemberColor</Label>
                <ScriptBlock>[Microsoft.PowerShell.VTColorUtils]::FormatColor($_.MemberColor)</ScriptBlock>
              </ListItem>
              <ListItem>
                <Label>NumberColor</Label>
                <ScriptBlock>[Microsoft.PowerShell.VTColorUtils]::FormatColor($_.NumberColor)</ScriptBlock>
              </ListItem>
              <ListItem>
                <Label>OperatorColor</Label>
                <ScriptBlock>[Microsoft.PowerShell.VTColorUtils]::FormatColor($_.OperatorColor)</ScriptBlock>
              </ListItem>
              <ListItem>
                <Label>ParameterColor</Label>
                <ScriptBlock>[Microsoft.PowerShell.VTColorUtils]::FormatColor($_.ParameterColor)</ScriptBlock>
              </ListItem>
              <ListItem>
                <Label>SelectionColor</Label>
                <ScriptBlock>[Microsoft.PowerShell.VTColorUtils]::FormatColor($_.SelectionColor)</ScriptBlock>
              </ListItem>
              <ListItem>
                <Label>StringColor</Label>
                <ScriptBlock>[Microsoft.PowerShell.VTColorUtils]::FormatColor($_.StringColor)</ScriptBlock>
              </ListItem>
              <ListItem>
                <Label>TypeColor</Label>
                <ScriptBlock>[Microsoft.PowerShell.VTColorUtils]::FormatColor($_.TypeColor)</ScriptBlock>
              </ListItem>
              <ListItem>
                <Label>VariableColor</Label>
                <ScriptBlock>[Microsoft.PowerShell.VTColorUtils]::FormatColor($_.VariableColor)</ScriptBlock>
              </ListItem>
            </ListItems>
          </ListEntry>
        </ListEntries>
      </ListControl>
    </View>
  </ViewDefinitions>
</Configuration>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/scripts/psreadline/PSReadLine.psd1]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/scripts/psreadline/PSReadLine.psd1

```text
@{
RootModule = 'PSReadLine.psm1'
NestedModules = @("Microsoft.PowerShell.PSReadLine.dll")
ModuleVersion = '2.4.3'
GUID = '5714753b-2afd-4492-a5fd-01d9e2cff8b5'
Author = 'Microsoft Corporation'
CompanyName = 'Microsoft Corporation'
Copyright = '(c) Microsoft Corporation. All rights reserved.'
Description = 'Great command line editing in the PowerShell console host'
PowerShellVersion = '5.1'
FormatsToProcess = 'PSReadLine.format.ps1xml'
AliasesToExport = @()
FunctionsToExport = 'PSConsoleHostReadLine'
CmdletsToExport = 'Get-PSReadLineKeyHandler','Set-PSReadLineKeyHandler','Remove-PSReadLineKeyHandler',
                  'Get-PSReadLineOption','Set-PSReadLineOption'
HelpInfoURI = 'https://aka.ms/powershell75-help'
PrivateData = @{ PSData = @{ Prerelease = 'beta3'; ProjectUri = 'https://github.com/PowerShell/PSReadLine' } }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/scripts/psreadline/PSReadLine.psm1]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/scripts/psreadline/PSReadLine.psm1

```text
function PSConsoleHostReadLine
{
    [System.Diagnostics.DebuggerHidden()]
    param()

    ## Get the execution status of the last accepted user input.
    ## This needs to be done as the first thing because any script run will flush $?.
    $lastRunStatus = $?
    Microsoft.PowerShell.Core\Set-StrictMode -Off
    [Microsoft.PowerShell.PSConsoleReadLine]::ReadLine($host.Runspace, $ExecutionContext, $lastRunStatus)
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/electron-browser/localPty.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/electron-browser/localPty.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITerminalLaunchResult, IProcessPropertyMap, IPtyService, ITerminalChildProcess, ITerminalLaunchError, ProcessPropertyType } from '../../../../platform/terminal/common/terminal.js';
import { BasePty } from '../common/basePty.js';

/**
 * Responsible for establishing and maintaining a connection with an existing terminal process
 * created on the local pty host.
 */
export class LocalPty extends BasePty implements ITerminalChildProcess {
	constructor(
		id: number,
		shouldPersist: boolean,
		private readonly _proxy: IPtyService
	) {
		super(id, shouldPersist);
	}

	start(): Promise<ITerminalLaunchError | ITerminalLaunchResult | undefined> {
		return this._proxy.start(this.id);
	}

	detach(forcePersist?: boolean): Promise<void> {
		return this._proxy.detachFromProcess(this.id, forcePersist);
	}

	shutdown(immediate: boolean): void {
		this._proxy.shutdown(this.id, immediate);
	}

	async processBinary(data: string): Promise<void> {
		if (this._inReplay) {
			return;
		}
		return this._proxy.processBinary(this.id, data);
	}

	input(data: string): void {
		if (this._inReplay) {
			return;
		}
		this._proxy.input(this.id, data);
	}

	sendSignal(signal: string): void {
		if (this._inReplay) {
			return;
		}
		this._proxy.sendSignal(this.id, signal);
	}

	resize(cols: number, rows: number): void {
		if (this._inReplay || this._lastDimensions.cols === cols && this._lastDimensions.rows === rows) {
			return;
		}
		this._lastDimensions.cols = cols;
		this._lastDimensions.rows = rows;
		this._proxy.resize(this.id, cols, rows);
	}

	async clearBuffer(): Promise<void> {
		this._proxy.clearBuffer?.(this.id);
	}

	freePortKillProcess(port: string): Promise<{ port: string; processId: string }> {
		if (!this._proxy.freePortKillProcess) {
			throw new Error('freePortKillProcess does not exist on the local pty service');
		}
		return this._proxy.freePortKillProcess(port);
	}

	async refreshProperty<T extends ProcessPropertyType>(type: T): Promise<IProcessPropertyMap[T]> {
		return this._proxy.refreshProperty(this.id, type);
	}

	async updateProperty<T extends ProcessPropertyType>(type: T, value: IProcessPropertyMap[T]): Promise<void> {
		return this._proxy.updateProperty(this.id, type, value);
	}

	acknowledgeDataEvent(charCount: number): void {
		if (this._inReplay) {
			return;
		}
		this._proxy.acknowledgeDataEvent(this.id, charCount);
	}

	setUnicodeVersion(version: '6' | '11'): Promise<void> {
		return this._proxy.setUnicodeVersion(this.id, version);
	}

	handleOrphanQuestion() {
		this._proxy.orphanQuestionReply(this.id);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/electron-browser/localTerminalBackend.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/electron-browser/localTerminalBackend.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';
import { IProcessEnvironment, isMacintosh, isWindows, OperatingSystem } from '../../../../base/common/platform.js';
import { URI } from '../../../../base/common/uri.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ILocalPtyService, IProcessPropertyMap, IPtyHostLatencyMeasurement, IPtyService, IShellLaunchConfig, ITerminalBackend, ITerminalBackendRegistry, ITerminalChildProcess, ITerminalEnvironment, ITerminalLogService, ITerminalProcessOptions, ITerminalsLayoutInfo, ITerminalsLayoutInfoById, ProcessPropertyType, TerminalExtensions, TerminalIpcChannels, TerminalSettingId, TitleEventSource } from '../../../../platform/terminal/common/terminal.js';
import { IGetTerminalLayoutInfoArgs, IProcessDetails, ISetTerminalLayoutInfoArgs } from '../../../../platform/terminal/common/terminalProcess.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { ITerminalInstanceService } from '../browser/terminal.js';
import { ITerminalProfileResolverService } from '../common/terminal.js';
import { TerminalStorageKeys } from '../common/terminalStorageKeys.js';
import { LocalPty } from './localPty.js';
import { IConfigurationResolverService } from '../../../services/configurationResolver/common/configurationResolver.js';
import { IShellEnvironmentService } from '../../../services/environment/electron-browser/shellEnvironmentService.js';
import { IHistoryService } from '../../../services/history/common/history.js';
import * as terminalEnvironment from '../common/terminalEnvironment.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IEnvironmentVariableService } from '../common/environmentVariable.js';
import { BaseTerminalBackend } from '../browser/baseTerminalBackend.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { Client as MessagePortClient } from '../../../../base/parts/ipc/common/ipc.mp.js';
import { acquirePort } from '../../../../base/parts/ipc/electron-browser/ipc.mp.js';
import { getDelayedChannel, ProxyChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { mark, PerformanceMark } from '../../../../base/common/performance.js';
import { ILifecycleService, LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { DeferredPromise } from '../../../../base/common/async.js';
import { IStatusbarService } from '../../../services/statusbar/browser/statusbar.js';
import { memoize } from '../../../../base/common/decorators.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';
import { shouldUseEnvironmentVariableCollection } from '../../../../platform/terminal/common/terminalEnvironment.js';
import { DisposableStore, MutableDisposable } from '../../../../base/common/lifecycle.js';

export class LocalTerminalBackendContribution implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.localTerminalBackend';

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@ITerminalInstanceService terminalInstanceService: ITerminalInstanceService
	) {
		const backend = instantiationService.createInstance(LocalTerminalBackend);
		Registry.as<ITerminalBackendRegistry>(TerminalExtensions.Backend).registerTerminalBackend(backend);
		terminalInstanceService.didRegisterBackend(backend);
	}
}

class LocalTerminalBackend extends BaseTerminalBackend implements ITerminalBackend {
	readonly remoteAuthority = undefined;

	private readonly _ptys: Map<number, LocalPty> = new Map();

	private _directProxyClientEventually: DeferredPromise<MessagePortClient> | undefined;
	private _directProxy: IPtyService | undefined;
	private readonly _directProxyDisposables = this._register(new MutableDisposable());

	/**
	 * Communicate to the direct proxy (renderer<->ptyhost) if it's available, otherwise use the
	 * indirect proxy (renderer<->main<->ptyhost). The latter may not need to actually launch the
	 * pty host, for example when detecting profiles.
	 */
	private get _proxy(): IPtyService { return this._directProxy || this._localPtyService; }

	private readonly _whenReady = new DeferredPromise<void>();
	get whenReady(): Promise<void> { return this._whenReady.p; }
	setReady(): void { this._whenReady.complete(); }

	private readonly _onDidRequestDetach = this._register(new Emitter<{ requestId: number; workspaceId: string; instanceId: number }>());
	readonly onDidRequestDetach = this._onDidRequestDetach.event;

	constructor(
		@IWorkspaceContextService workspaceContextService: IWorkspaceContextService,
		@ILifecycleService private readonly _lifecycleService: ILifecycleService,
		@ITerminalLogService logService: ITerminalLogService,
		@ILocalPtyService private readonly _localPtyService: ILocalPtyService,
		@ILabelService private readonly _labelService: ILabelService,
		@IShellEnvironmentService private readonly _shellEnvironmentService: IShellEnvironmentService,
		@IStorageService private readonly _storageService: IStorageService,
		@IConfigurationResolverService private readonly _configurationResolverService: IConfigurationResolverService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IProductService private readonly _productService: IProductService,
		@IHistoryService private readonly _historyService: IHistoryService,
		@ITerminalProfileResolverService private readonly _terminalProfileResolverService: ITerminalProfileResolverService,
		@IEnvironmentVariableService private readonly _environmentVariableService: IEnvironmentVariableService,
		@IHistoryService historyService: IHistoryService,
		@INativeHostService private readonly _nativeHostService: INativeHostService,
		@IStatusbarService statusBarService: IStatusbarService,
		@IRemoteAgentService private readonly _remoteAgentService: IRemoteAgentService,
	) {
		super(_localPtyService, logService, historyService, _configurationResolverService, statusBarService, workspaceContextService);

		this._register(this.onPtyHostRestart(() => {
			this._directProxy = undefined;
			this._directProxyClientEventually = undefined;
			this._connectToDirectProxy();
		}));
	}

	/**
	 * Request a direct connection to the pty host, this will launch the pty host process if necessary.
	 */
	private async _connectToDirectProxy(): Promise<void> {
		// Check if connecting is in progress
		if (this._directProxyClientEventually) {
			await this._directProxyClientEventually.p;
			return;
		}

		this._logService.debug('Starting pty host');
		const directProxyClientEventually = new DeferredPromise<MessagePortClient>();
		this._directProxyClientEventually = directProxyClientEventually;
		const directProxy = ProxyChannel.toService<IPtyService>(getDelayedChannel(this._directProxyClientEventually.p.then(client => client.getChannel(TerminalIpcChannels.PtyHostWindow))));
		this._directProxy = directProxy;
		this._directProxyDisposables.clear();

		// The pty host should not get launched until at least the window restored phase
		// if remote auth exists, don't await
		if (!this._remoteAgentService.getConnection()?.remoteAuthority) {
			await this._lifecycleService.when(LifecyclePhase.Restored);
		}

		mark('code/terminal/willConnectPtyHost');
		this._logService.trace('Renderer->PtyHost#connect: before acquirePort');
		acquirePort('vscode:createPtyHostMessageChannel', 'vscode:createPtyHostMessageChannelResult').then(port => {
			mark('code/terminal/didConnectPtyHost');
			this._logService.trace('Renderer->PtyHost#connect: connection established');

			const store = new DisposableStore();
			this._directProxyDisposables.value = store;

			// There are two connections to the pty host; one to the regular shared process
			// _localPtyService, and one directly via message port _ptyHostDirectProxy. The former is
			// used for pty host management messages, it would make sense in the future to use a
			// separate interface/service for this one.
			const client = store.add(new MessagePortClient(port, `window:${this._nativeHostService.windowId}`));
			directProxyClientEventually.complete(client);
			this._onPtyHostConnected.fire();

			// Attach process listeners
			store.add(directProxy.onProcessData(e => this._ptys.get(e.id)?.handleData(e.event)));
			store.add(directProxy.onDidChangeProperty(e => this._ptys.get(e.id)?.handleDidChangeProperty(e.property)));
			store.add(directProxy.onProcessExit(e => {
				const pty = this._ptys.get(e.id);
				if (pty) {
					pty.handleExit(e.event);
					pty.dispose();
					this._ptys.delete(e.id);
				}
			}));
			store.add(directProxy.onProcessReady(e => this._ptys.get(e.id)?.handleReady(e.event)));
			store.add(directProxy.onProcessReplay(e => this._ptys.get(e.id)?.handleReplay(e.event)));
			store.add(directProxy.onProcessOrphanQuestion(e => this._ptys.get(e.id)?.handleOrphanQuestion()));
			store.add(directProxy.onDidRequestDetach(e => this._onDidRequestDetach.fire(e)));

			// Eagerly fetch the backend's environment for memoization
			this.getEnvironment();
		});
	}

	async requestDetachInstance(workspaceId: string, instanceId: number): Promise<IProcessDetails | undefined> {
		return this._proxy.requestDetachInstance(workspaceId, instanceId);
	}

	async acceptDetachInstanceReply(requestId: number, persistentProcessId?: number): Promise<void> {
		if (!persistentProcessId) {
			this._logService.warn('Cannot attach to feature terminals, custom pty terminals, or those without a persistentProcessId');
			return;
		}
		return this._proxy.acceptDetachInstanceReply(requestId, persistentProcessId);
	}

	async persistTerminalState(): Promise<void> {
		const ids = Array.from(this._ptys.keys());
		const serialized = await this._proxy.serializeTerminalState(ids);
		this._storageService.store(TerminalStorageKeys.TerminalBufferState, serialized, StorageScope.WORKSPACE, StorageTarget.MACHINE);
	}

	async updateTitle(id: number, title: string, titleSource: TitleEventSource): Promise<void> {
		await this._proxy.updateTitle(id, title, titleSource);
	}

	async updateIcon(id: number, userInitiated: boolean, icon: URI | { light: URI; dark: URI } | { id: string; color?: { id: string } }, color?: string): Promise<void> {
		await this._proxy.updateIcon(id, userInitiated, icon, color);
	}

	async setNextCommandId(id: number, commandLine: string, commandId: string): Promise<void> {
		await this._proxy.setNextCommandId(id, commandLine, commandId);
	}

	async updateProperty<T extends ProcessPropertyType>(id: number, property: ProcessPropertyType, value: IProcessPropertyMap[T]): Promise<void> {
		return this._proxy.updateProperty(id, property, value);
	}

	async createProcess(
		shellLaunchConfig: IShellLaunchConfig,
		cwd: string,
		cols: number,
		rows: number,
		unicodeVersion: '6' | '11',
		env: IProcessEnvironment,
		options: ITerminalProcessOptions,
		shouldPersist: boolean
	): Promise<ITerminalChildProcess> {
		await this._connectToDirectProxy();
		const executableEnv = await this._shellEnvironmentService.getShellEnv();
		const id = await this._proxy.createProcess(shellLaunchConfig, cwd, cols, rows, unicodeVersion, env, executableEnv, options, shouldPersist, this._getWorkspaceId(), this._getWorkspaceName());
		const pty = new LocalPty(id, shouldPersist, this._proxy);
		this._ptys.set(id, pty);
		return pty;
	}

	async attachToProcess(id: number): Promise<ITerminalChildProcess | undefined> {
		await this._connectToDirectProxy();
		try {
			await this._proxy.attachToProcess(id);
			const pty = new LocalPty(id, true, this._proxy);
			this._ptys.set(id, pty);
			return pty;
		} catch (e) {
			this._logService.warn(`Couldn't attach to process ${e.message}`);
		}
		return undefined;
	}

	async attachToRevivedProcess(id: number): Promise<ITerminalChildProcess | undefined> {
		await this._connectToDirectProxy();
		try {
			const newId = await this._proxy.getRevivedPtyNewId(this._getWorkspaceId(), id) ?? id;
			return await this.attachToProcess(newId);
		} catch (e) {
			this._logService.warn(`Couldn't attach to process ${e.message}`);
		}
		return undefined;
	}

	async listProcesses(): Promise<IProcessDetails[]> {
		await this._connectToDirectProxy();
		return this._proxy.listProcesses();
	}

	async getLatency(): Promise<IPtyHostLatencyMeasurement[]> {
		const measurements: IPtyHostLatencyMeasurement[] = [];
		const sw = new StopWatch();
		if (this._directProxy) {
			await this._directProxy.getLatency();
			sw.stop();
			measurements.push({
				label: 'window<->ptyhost (message port)',
				latency: sw.elapsed()
			});
			sw.reset();
		}
		const results = await this._localPtyService.getLatency();
		sw.stop();
		measurements.push({
			label: 'window<->ptyhostservice<->ptyhost',
			latency: sw.elapsed()
		});
		return [
			...measurements,
			...results
		];
	}

	async getPerformanceMarks(): Promise<PerformanceMark[]> {
		return this._proxy.getPerformanceMarks();
	}

	async reduceConnectionGraceTime(): Promise<void> {
		this._proxy.reduceConnectionGraceTime();
	}

	async getDefaultSystemShell(osOverride?: OperatingSystem): Promise<string> {
		return this._proxy.getDefaultSystemShell(osOverride);
	}

	async getProfiles(profiles: unknown, defaultProfile: unknown, includeDetectedProfiles?: boolean) {
		return this._localPtyService.getProfiles(this._workspaceContextService.getWorkspace().id, profiles, defaultProfile, includeDetectedProfiles) || [];
	}

	@memoize
	async getEnvironment(): Promise<IProcessEnvironment> {
		return this._proxy.getEnvironment();
	}

	@memoize
	async getShellEnvironment(): Promise<IProcessEnvironment> {
		return this._shellEnvironmentService.getShellEnv();
	}

	async getWslPath(original: string, direction: 'unix-to-win' | 'win-to-unix'): Promise<string> {
		return this._proxy.getWslPath(original, direction);
	}

	async setTerminalLayoutInfo(layoutInfo?: ITerminalsLayoutInfoById): Promise<void> {
		const args: ISetTerminalLayoutInfoArgs = {
			workspaceId: this._getWorkspaceId(),
			tabs: layoutInfo ? layoutInfo.tabs : [],
			background: layoutInfo ? layoutInfo.background : null
		};
		await this._proxy.setTerminalLayoutInfo(args);
		// Store in the storage service as well to be used when reviving processes as normally this
		// is stored in memory on the pty host
		this._storageService.store(TerminalStorageKeys.TerminalLayoutInfo, JSON.stringify(args), StorageScope.WORKSPACE, StorageTarget.MACHINE);
	}

	async getTerminalLayoutInfo(): Promise<ITerminalsLayoutInfo | undefined> {
		const workspaceId = this._getWorkspaceId();
		const layoutArgs: IGetTerminalLayoutInfoArgs = { workspaceId };

		// Revive processes if needed
		const serializedState = this._storageService.get(TerminalStorageKeys.TerminalBufferState, StorageScope.WORKSPACE);
		const reviveBufferState = this._deserializeTerminalState(serializedState);
		if (reviveBufferState && reviveBufferState.length > 0) {
			try {
				// Create variable resolver
				const activeWorkspaceRootUri = this._historyService.getLastActiveWorkspaceRoot();
				const lastActiveWorkspace = activeWorkspaceRootUri ? this._workspaceContextService.getWorkspaceFolder(activeWorkspaceRootUri) ?? undefined : undefined;
				const variableResolver = terminalEnvironment.createVariableResolver(lastActiveWorkspace, await this._terminalProfileResolverService.getEnvironment(this.remoteAuthority), this._configurationResolverService);

				// Re-resolve the environments and replace it on the state so local terminals use a fresh
				// environment
				mark('code/terminal/willGetReviveEnvironments');
				await Promise.all(reviveBufferState.map(state => new Promise<void>(r => {
					this._resolveEnvironmentForRevive(variableResolver, state.shellLaunchConfig).then(freshEnv => {
						state.processLaunchConfig.env = freshEnv;
						r();
					});
				})));
				mark('code/terminal/didGetReviveEnvironments');

				mark('code/terminal/willReviveTerminalProcesses');
				await this._proxy.reviveTerminalProcesses(workspaceId, reviveBufferState, Intl.DateTimeFormat().resolvedOptions().locale);
				mark('code/terminal/didReviveTerminalProcesses');
				this._storageService.remove(TerminalStorageKeys.TerminalBufferState, StorageScope.WORKSPACE);
				// If reviving processes, send the terminal layout info back to the pty host as it
				// will not have been persisted on application exit
				const layoutInfo = this._storageService.get(TerminalStorageKeys.TerminalLayoutInfo, StorageScope.WORKSPACE);
				if (layoutInfo) {
					mark('code/terminal/willSetTerminalLayoutInfo');
					await this._proxy.setTerminalLayoutInfo(JSON.parse(layoutInfo));
					mark('code/terminal/didSetTerminalLayoutInfo');
					this._storageService.remove(TerminalStorageKeys.TerminalLayoutInfo, StorageScope.WORKSPACE);
				}
			} catch (e: unknown) {
				this._logService.warn('LocalTerminalBackend#getTerminalLayoutInfo Error', (<{ message?: string }>e).message ?? e);
			}
		}

		return this._proxy.getTerminalLayoutInfo(layoutArgs);
	}

	private async _resolveEnvironmentForRevive(variableResolver: terminalEnvironment.VariableResolver | undefined, shellLaunchConfig: IShellLaunchConfig): Promise<IProcessEnvironment> {
		const platformKey = isWindows ? 'windows' : (isMacintosh ? 'osx' : 'linux');
		const envFromConfigValue = this._configurationService.getValue<ITerminalEnvironment | undefined>(`terminal.integrated.env.${platformKey}`);
		const baseEnv = await (shellLaunchConfig.useShellEnvironment ? this.getShellEnvironment() : this.getEnvironment());
		const env = await terminalEnvironment.createTerminalEnvironment(shellLaunchConfig, envFromConfigValue, variableResolver, this._productService.version, this._configurationService.getValue(TerminalSettingId.DetectLocale), baseEnv);
		if (shouldUseEnvironmentVariableCollection(shellLaunchConfig)) {
			const workspaceFolder = terminalEnvironment.getWorkspaceForTerminal(shellLaunchConfig.cwd, this._workspaceContextService, this._historyService);
			await this._environmentVariableService.mergedCollection.applyToProcessEnvironment(env, { workspaceFolder }, variableResolver);
		}
		return env;
	}

	private _getWorkspaceName(): string {
		return this._labelService.getWorkspaceLabel(this._workspaceContextService.getWorkspace());
	}

	// #region Pty service contribution RPC calls

	installAutoReply(match: string, reply: string): Promise<void> {
		return this._proxy.installAutoReply(match, reply);
	}
	uninstallAllAutoReplies(): Promise<void> {
		return this._proxy.uninstallAllAutoReplies();
	}

	// #endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/electron-browser/terminal.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/electron-browser/terminal.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { registerMainProcessRemoteService } from '../../../../platform/ipc/electron-browser/services.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ILocalPtyService, TerminalIpcChannels } from '../../../../platform/terminal/common/terminal.js';
import { IWorkbenchContributionsRegistry, WorkbenchPhase, Extensions as WorkbenchExtensions, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { ITerminalProfileResolverService } from '../common/terminal.js';
import { TerminalNativeContribution } from './terminalNativeContribution.js';
import { ElectronTerminalProfileResolverService } from './terminalProfileResolverService.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { LocalTerminalBackendContribution } from './localTerminalBackend.js';

// Register services
registerMainProcessRemoteService(ILocalPtyService, TerminalIpcChannels.LocalPty);
registerSingleton(ITerminalProfileResolverService, ElectronTerminalProfileResolverService, InstantiationType.Delayed);

// Register workbench contributions
const workbenchRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);

// This contribution needs to be active during the Startup phase to be available when a remote resolver tries to open a local
// terminal while connecting to the remote.
registerWorkbenchContribution2(LocalTerminalBackendContribution.ID, LocalTerminalBackendContribution, WorkbenchPhase.BlockStartup);
workbenchRegistry.registerWorkbenchContribution(TerminalNativeContribution, LifecyclePhase.Restored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/electron-browser/terminalNativeContribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/electron-browser/terminalNativeContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ipcRenderer } from '../../../../base/parts/sandbox/electron-browser/globals.js';
import { INativeOpenFileRequest } from '../../../../platform/window/common/window.js';
import { URI } from '../../../../base/common/uri.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { registerRemoteContributions } from './terminalRemote.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ITerminalService } from '../browser/terminal.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { disposableWindowInterval, getActiveWindow } from '../../../../base/browser/dom.js';

export class TerminalNativeContribution extends Disposable implements IWorkbenchContribution {
	declare _serviceBrand: undefined;

	constructor(
		@IFileService private readonly _fileService: IFileService,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@INativeHostService nativeHostService: INativeHostService
	) {
		super();

		ipcRenderer.on('vscode:openFiles', (_: unknown, ...args: unknown[]) => { this._onOpenFileRequest(args[0] as INativeOpenFileRequest); });
		this._register(nativeHostService.onDidResumeOS(() => this._onOsResume()));

		this._terminalService.setNativeDelegate({
			getWindowCount: () => nativeHostService.getWindowCount()
		});

		const connection = remoteAgentService.getConnection();
		if (connection && connection.remoteAuthority) {
			registerRemoteContributions();
		}
	}

	private _onOsResume(): void {
		for (const instance of this._terminalService.instances) {
			instance.xterm?.forceRedraw();
		}
	}

	private async _onOpenFileRequest(request: INativeOpenFileRequest): Promise<void> {
		// if the request to open files is coming in from the integrated terminal (identified though
		// the termProgram variable) and we are instructed to wait for editors close, wait for the
		// marker file to get deleted and then focus back to the integrated terminal.
		if (request.termProgram === 'vscode' && request.filesToWait) {
			const waitMarkerFileUri = URI.revive(request.filesToWait.waitMarkerFileUri);
			await this._whenFileDeleted(waitMarkerFileUri);

			// Focus active terminal
			this._terminalService.activeInstance?.focus();
		}
	}

	private _whenFileDeleted(path: URI): Promise<void> {
		// Complete when wait marker file is deleted
		return new Promise<void>(resolve => {
			let running = false;
			const interval = disposableWindowInterval(getActiveWindow(), async () => {
				if (!running) {
					running = true;
					const exists = await this._fileService.exists(path);
					running = false;

					if (!exists) {
						interval.dispose();
						resolve(undefined);
					}
				}
			}, 1000);
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/electron-browser/terminalProfileResolverService.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/electron-browser/terminalProfileResolverService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ErrorNoTelemetry } from '../../../../base/common/errors.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ITerminalLogService } from '../../../../platform/terminal/common/terminal.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { ITerminalInstanceService } from '../browser/terminal.js';
import { BaseTerminalProfileResolverService } from '../browser/terminalProfileResolverService.js';
import { ITerminalProfileService } from '../common/terminal.js';
import { IConfigurationResolverService } from '../../../services/configurationResolver/common/configurationResolver.js';
import { IHistoryService } from '../../../services/history/common/history.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';

export class ElectronTerminalProfileResolverService extends BaseTerminalProfileResolverService {

	constructor(
		@IConfigurationResolverService configurationResolverService: IConfigurationResolverService,
		@IConfigurationService configurationService: IConfigurationService,
		@IHistoryService historyService: IHistoryService,
		@ITerminalLogService logService: ITerminalLogService,
		@IWorkspaceContextService workspaceContextService: IWorkspaceContextService,
		@ITerminalProfileService terminalProfileService: ITerminalProfileService,
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@ITerminalInstanceService terminalInstanceService: ITerminalInstanceService
	) {
		super(
			{
				getDefaultSystemShell: async (remoteAuthority, platform) => {
					const backend = await terminalInstanceService.getBackend(remoteAuthority);
					if (!backend) {
						throw new ErrorNoTelemetry(`Cannot get default system shell when there is no backend for remote authority '${remoteAuthority}'`);
					}
					return backend.getDefaultSystemShell(platform);
				},
				getEnvironment: async (remoteAuthority) => {
					const backend = await terminalInstanceService.getBackend(remoteAuthority);
					if (!backend) {
						throw new ErrorNoTelemetry(`Cannot get environment when there is no backend for remote authority '${remoteAuthority}'`);
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

---[FILE: src/vs/workbench/contrib/terminal/electron-browser/terminalRemote.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/electron-browser/terminalRemote.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import { localize2 } from '../../../../nls.js';
import { INativeEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IRemoteAuthorityResolverService } from '../../../../platform/remote/common/remoteAuthorityResolver.js';
import { registerTerminalAction } from '../browser/terminalActions.js';
import { TerminalCommandId } from '../common/terminal.js';
import { IHistoryService } from '../../../services/history/common/history.js';

export function registerRemoteContributions() {
	registerTerminalAction({
		id: TerminalCommandId.NewLocal,
		title: localize2('workbench.action.terminal.newLocal', 'Create New Integrated Terminal (Local)'),
		run: async (c, accessor) => {
			const historyService = accessor.get(IHistoryService);
			const remoteAuthorityResolverService = accessor.get(IRemoteAuthorityResolverService);
			const nativeEnvironmentService = accessor.get(INativeEnvironmentService);
			let cwd: URI | undefined;
			try {
				const activeWorkspaceRootUri = historyService.getLastActiveWorkspaceRoot(Schemas.vscodeRemote);
				if (activeWorkspaceRootUri) {
					const canonicalUri = await remoteAuthorityResolverService.getCanonicalURI(activeWorkspaceRootUri);
					if (canonicalUri.scheme === Schemas.file) {
						cwd = canonicalUri;
					}
				}
			} catch { }
			if (!cwd) {
				cwd = nativeEnvironmentService.userHome;
			}
			const instance = await c.service.createTerminal({ cwd });
			if (!instance) {
				return Promise.resolve(undefined);
			}

			c.service.setActiveInstance(instance);
			return c.groupService.showPanel(true);
		}
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/browser/terminalActions.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/terminalActions.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual } from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IWorkspaceFolder } from '../../../../../platform/workspace/common/workspace.js';
import { WorkspaceFolderCwdPair, shrinkWorkspaceFolderCwdPairs } from '../../browser/terminalActions.js';

function makeFakeFolder(name: string, uri: URI): IWorkspaceFolder {
	return {
		name,
		uri,
		index: 0,
		toResource: () => uri,
	};
}

function makePair(folder: IWorkspaceFolder, cwd?: URI | IWorkspaceFolder, isAbsolute?: boolean): WorkspaceFolderCwdPair {
	return {
		folder,
		cwd: !cwd ? folder.uri : (cwd instanceof URI ? cwd : cwd.uri),
		isAbsolute: !!isAbsolute,
		isOverridden: !!cwd && cwd.toString() !== folder.uri.toString(),
	};
}

suite('terminalActions', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	const root: URI = URI.file('/some-root');
	const a = makeFakeFolder('a', URI.joinPath(root, 'a'));
	const b = makeFakeFolder('b', URI.joinPath(root, 'b'));
	const c = makeFakeFolder('c', URI.joinPath(root, 'c'));
	const d = makeFakeFolder('d', URI.joinPath(root, 'd'));

	suite('shrinkWorkspaceFolderCwdPairs', () => {
		test('should return empty when given array is empty', () => {
			deepStrictEqual(shrinkWorkspaceFolderCwdPairs([]), []);
		});

		test('should return the only single pair when given argument is a single element array', () => {
			const pairs = [makePair(a)];
			deepStrictEqual(shrinkWorkspaceFolderCwdPairs(pairs), pairs);
		});

		test('should return all pairs when no repeated cwds', () => {
			const pairs = [makePair(a), makePair(b), makePair(c)];
			deepStrictEqual(shrinkWorkspaceFolderCwdPairs(pairs), pairs);
		});

		suite('should select the pair that has the same URI when repeated cwds exist', () => {
			test('all repeated', () => {
				const pairA = makePair(a);
				const pairB = makePair(b, a); // CWD points to A
				const pairC = makePair(c, a); // CWD points to A
				deepStrictEqual(shrinkWorkspaceFolderCwdPairs([pairA, pairB, pairC]), [pairA]);
			});

			test('two repeated + one different', () => {
				const pairA = makePair(a);
				const pairB = makePair(b, a); // CWD points to A
				const pairC = makePair(c);
				deepStrictEqual(shrinkWorkspaceFolderCwdPairs([pairA, pairB, pairC]), [pairA, pairC]);
			});

			test('two repeated + two repeated', () => {
				const pairA = makePair(a);
				const pairB = makePair(b, a); // CWD points to A
				const pairC = makePair(c);
				const pairD = makePair(d, c);
				deepStrictEqual(shrinkWorkspaceFolderCwdPairs([pairA, pairB, pairC, pairD]), [pairA, pairC]);
			});

			test('two repeated + two repeated (reverse order)', () => {
				const pairB = makePair(b, a); // CWD points to A
				const pairA = makePair(a);
				const pairD = makePair(d, c);
				const pairC = makePair(c);
				deepStrictEqual(shrinkWorkspaceFolderCwdPairs([pairA, pairB, pairC, pairD]), [pairA, pairC]);
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/browser/terminalConfigurationService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/terminalConfigurationService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { notStrictEqual, ok, strictEqual } from 'assert';
import { getActiveWindow } from '../../../../../base/browser/dom.js';
import { mainWindow } from '../../../../../base/browser/window.js';
import { isLinux } from '../../../../../base/common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { EDITOR_FONT_DEFAULTS } from '../../../../../editor/common/config/fontInfo.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ITerminalConfigurationService, LinuxDistro } from '../../browser/terminal.js';
import { TestTerminalConfigurationService, workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';

suite('Workbench - TerminalConfigurationService', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let configurationService: TestConfigurationService;
	let terminalConfigurationService: ITerminalConfigurationService;

	setup(() => {
		const instantiationService = workbenchInstantiationService(undefined, store);
		configurationService = instantiationService.get(IConfigurationService) as TestConfigurationService;
		terminalConfigurationService = instantiationService.get(ITerminalConfigurationService);
	});

	suite('config', () => {
		test('should update on any change to terminal.integrated', () => {
			const originalConfig = terminalConfigurationService.config;
			configurationService.onDidChangeConfigurationEmitter.fire({
				affectsConfiguration: configuration => configuration.startsWith('terminal.integrated'),
				affectedKeys: new Set(['terminal.integrated.fontWeight']),
				change: null!,
				source: ConfigurationTarget.USER
			});
			notStrictEqual(terminalConfigurationService.config, originalConfig, 'Object reference must change');
		});

		suite('onConfigChanged', () => {
			test('should fire on any change to terminal.integrated', async () => {
				await new Promise<void>(r => {
					store.add(terminalConfigurationService.onConfigChanged(() => r()));
					configurationService.onDidChangeConfigurationEmitter.fire({
						affectsConfiguration: configuration => configuration.startsWith('terminal.integrated'),
						affectedKeys: new Set(['terminal.integrated.fontWeight']),
						change: null!,
						source: ConfigurationTarget.USER
					});
				});
			});
		});
	});

	function createTerminalConfigationService(config: any, linuxDistro?: LinuxDistro): ITerminalConfigurationService {
		const instantiationService = new TestInstantiationService();
		instantiationService.set(IConfigurationService, new TestConfigurationService(config));
		const terminalConfigurationService = store.add(instantiationService.createInstance(TestTerminalConfigurationService));
		instantiationService.set(ITerminalConfigurationService, terminalConfigurationService);
		terminalConfigurationService.setPanelContainer(mainWindow.document.body);
		if (linuxDistro) {
			terminalConfigurationService.fontMetrics.linuxDistro = linuxDistro;
		}
		return terminalConfigurationService;
	}

	suite('getFont', () => {
		test('fontFamily', () => {
			const terminalConfigurationService = createTerminalConfigationService({
				editor: { fontFamily: 'foo' },
				terminal: { integrated: { fontFamily: 'bar' } }
			});
			ok(terminalConfigurationService.getFont(getActiveWindow()).fontFamily.startsWith('bar'), 'terminal.integrated.fontFamily should be selected over editor.fontFamily');
		});

		test('fontFamily (Linux Fedora)', () => {
			const terminalConfigurationService = createTerminalConfigationService({
				editor: { fontFamily: 'foo' },
				terminal: { integrated: { fontFamily: null } }
			}, LinuxDistro.Fedora);
			ok(terminalConfigurationService.getFont(getActiveWindow()).fontFamily.startsWith('\'DejaVu Sans Mono\''), 'Fedora should have its font overridden when terminal.integrated.fontFamily not set');
		});

		test('fontFamily (Linux Ubuntu)', () => {
			const terminalConfigurationService = createTerminalConfigationService({
				editor: { fontFamily: 'foo' },
				terminal: { integrated: { fontFamily: null } }
			}, LinuxDistro.Ubuntu);
			ok(terminalConfigurationService.getFont(getActiveWindow()).fontFamily.startsWith('\'Ubuntu Mono\''), 'Ubuntu should have its font overridden when terminal.integrated.fontFamily not set');
		});

		test('fontFamily (Linux Unknown)', () => {
			const terminalConfigurationService = createTerminalConfigationService({
				editor: { fontFamily: 'foo' },
				terminal: { integrated: { fontFamily: null } }
			});
			ok(terminalConfigurationService.getFont(getActiveWindow()).fontFamily.startsWith('foo'), 'editor.fontFamily should be the fallback when terminal.integrated.fontFamily not set');
		});

		test('fontSize 10', () => {
			const terminalConfigurationService = createTerminalConfigationService({
				editor: {
					fontFamily: 'foo',
					fontSize: 9
				},
				terminal: {
					integrated: {
						fontFamily: 'bar',
						fontSize: 10
					}
				}
			});
			strictEqual(terminalConfigurationService.getFont(getActiveWindow()).fontSize, 10, 'terminal.integrated.fontSize should be selected over editor.fontSize');
		});

		test('fontSize 0', () => {
			let terminalConfigurationService = createTerminalConfigationService({
				editor: {
					fontFamily: 'foo'
				},
				terminal: {
					integrated: {
						fontFamily: null,
						fontSize: 0
					}
				}
			}, LinuxDistro.Ubuntu);
			strictEqual(terminalConfigurationService.getFont(getActiveWindow()).fontSize, 8, 'The minimum terminal font size (with adjustment) should be used when terminal.integrated.fontSize less than it');

			terminalConfigurationService = createTerminalConfigationService({
				editor: {
					fontFamily: 'foo'
				},
				terminal: {
					integrated: {
						fontFamily: null,
						fontSize: 0
					}
				}
			});
			strictEqual(terminalConfigurationService.getFont(getActiveWindow()).fontSize, 6, 'The minimum terminal font size should be used when terminal.integrated.fontSize less than it');
		});

		test('fontSize 1500', () => {
			const terminalConfigurationService = createTerminalConfigationService({
				editor: {
					fontFamily: 'foo'
				},
				terminal: {
					integrated: {
						fontFamily: 0,
						fontSize: 1500
					}
				}
			});
			strictEqual(terminalConfigurationService.getFont(getActiveWindow()).fontSize, 100, 'The maximum terminal font size should be used when terminal.integrated.fontSize more than it');
		});

		test('fontSize null', () => {
			let terminalConfigurationService = createTerminalConfigationService({
				editor: {
					fontFamily: 'foo'
				},
				terminal: {
					integrated: {
						fontFamily: 0,
						fontSize: null
					}
				}
			}, LinuxDistro.Ubuntu);
			strictEqual(terminalConfigurationService.getFont(getActiveWindow()).fontSize, EDITOR_FONT_DEFAULTS.fontSize + 2, 'The default editor font size (with adjustment) should be used when terminal.integrated.fontSize is not set');

			terminalConfigurationService = createTerminalConfigationService({
				editor: {
					fontFamily: 'foo'
				},
				terminal: {
					integrated: {
						fontFamily: 0,
						fontSize: null
					}
				}
			});
			strictEqual(terminalConfigurationService.getFont(getActiveWindow()).fontSize, EDITOR_FONT_DEFAULTS.fontSize, 'The default editor font size should be used when terminal.integrated.fontSize is not set');
		});

		test('lineHeight 2', () => {
			const terminalConfigurationService = createTerminalConfigationService({
				editor: {
					fontFamily: 'foo',
					lineHeight: 1
				},
				terminal: {
					integrated: {
						fontFamily: 0,
						lineHeight: 2
					}
				}
			});
			strictEqual(terminalConfigurationService.getFont(getActiveWindow()).lineHeight, 2, 'terminal.integrated.lineHeight should be selected over editor.lineHeight');
		});

		test('lineHeight 0', () => {
			const terminalConfigurationService = createTerminalConfigationService({
				editor: {
					fontFamily: 'foo',
					lineHeight: 1
				},
				terminal: {
					integrated: {
						fontFamily: 0,
						lineHeight: 0
					}
				}
			});
			strictEqual(terminalConfigurationService.getFont(getActiveWindow()).lineHeight, isLinux ? 1.1 : 1, 'editor.lineHeight should be the default when terminal.integrated.lineHeight not set');
		});
	});

	suite('configFontIsMonospace', () => {
		test('isMonospace monospace', () => {
			const terminalConfigurationService = createTerminalConfigationService({
				terminal: {
					integrated: {
						fontFamily: 'monospace'
					}
				}
			});

			strictEqual(terminalConfigurationService.configFontIsMonospace(), true, 'monospace is monospaced');
		});

		test('isMonospace sans-serif', () => {
			const terminalConfigurationService = createTerminalConfigationService({
				terminal: {
					integrated: {
						fontFamily: 'sans-serif'
					}
				}
			});
			strictEqual(terminalConfigurationService.configFontIsMonospace(), false, 'sans-serif is not monospaced');
		});

		test('isMonospace serif', () => {
			const terminalConfigurationService = createTerminalConfigationService({
				terminal: {
					integrated: {
						fontFamily: 'serif'
					}
				}
			});
			strictEqual(terminalConfigurationService.configFontIsMonospace(), false, 'serif is not monospaced');
		});

		test('isMonospace monospace falls back to editor.fontFamily', () => {
			const terminalConfigurationService = createTerminalConfigationService({
				editor: {
					fontFamily: 'monospace'
				},
				terminal: {
					integrated: {
						fontFamily: null
					}
				}
			});
			strictEqual(terminalConfigurationService.configFontIsMonospace(), true, 'monospace is monospaced');
		});

		test('isMonospace sans-serif falls back to editor.fontFamily', () => {
			const terminalConfigurationService = createTerminalConfigationService({
				editor: {
					fontFamily: 'sans-serif'
				},
				terminal: {
					integrated: {
						fontFamily: null
					}
				}
			});
			strictEqual(terminalConfigurationService.configFontIsMonospace(), false, 'sans-serif is not monospaced');
		});

		test('isMonospace serif falls back to editor.fontFamily', () => {
			const terminalConfigurationService = createTerminalConfigationService({
				editor: {
					fontFamily: 'serif'
				},
				terminal: {
					integrated: {
						fontFamily: null
					}
				}
			});
			strictEqual(terminalConfigurationService.configFontIsMonospace(), false, 'serif is not monospaced');
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/browser/terminalEvents.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/terminalEvents.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { strictEqual } from 'assert';
import { Emitter } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ICwdDetectionCapability, TerminalCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { TerminalCapabilityStore } from '../../../../../platform/terminal/common/capabilities/terminalCapabilityStore.js';
import { createInstanceCapabilityEventMultiplexer } from '../../browser/terminalEvents.js';
import { ITerminalInstance } from '../../browser/terminal.js';

// Mock implementations for testing
class MockCwdDetectionCapability implements ICwdDetectionCapability {
	readonly type = TerminalCapability.CwdDetection;
	readonly cwds: string[] = [];

	private readonly _onDidChangeCwd = new Emitter<string>();
	readonly onDidChangeCwd = this._onDidChangeCwd.event;

	getCwd(): string {
		return this.cwds[this.cwds.length - 1] || '';
	}

	updateCwd(cwd: string): void {
		this.cwds.push(cwd);
		this._onDidChangeCwd.fire(cwd);
	}

	fireEvent(cwd: string): void {
		this.updateCwd(cwd);
	}

	dispose(): void {
		this._onDidChangeCwd.dispose();
	}
}



function createMockTerminalInstance(instanceId: number, capabilities: TerminalCapabilityStore): ITerminalInstance {
	const instance = {
		instanceId,
		capabilities
	} as unknown as ITerminalInstance;
	return instance;
}

suite('Terminal Events', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	suite('createInstanceCapabilityEventMultiplexer', () => {
		test('should handle existing instances with capabilities', () => {
			const capability = store.add(new MockCwdDetectionCapability());
			const capabilities = store.add(new TerminalCapabilityStore());
			capabilities.add(TerminalCapability.CwdDetection, capability);
			const instance = createMockTerminalInstance(1, capabilities);

			const onAddInstance = store.add(new Emitter<ITerminalInstance>());
			const onRemoveInstance = store.add(new Emitter<ITerminalInstance>());

			const multiplexer = store.add(createInstanceCapabilityEventMultiplexer(
				[instance],
				onAddInstance.event,
				onRemoveInstance.event,
				TerminalCapability.CwdDetection,
				(cap) => cap.onDidChangeCwd
			));

			let eventFired = false;
			let capturedData: { instance: ITerminalInstance; data: string } | undefined;

			store.add(multiplexer.event(e => {
				eventFired = true;
				capturedData = e;
			}));

			capability.fireEvent('test-data');

			strictEqual(eventFired, true, 'Event should be fired');
			strictEqual(capturedData?.instance, instance, 'Event should contain correct instance');
			strictEqual(capturedData?.data, 'test-data', 'Event should contain correct data');
		});

		test('should handle instances without capabilities', () => {
			const capabilities = store.add(new TerminalCapabilityStore());
			const instance = createMockTerminalInstance(1, capabilities);
			const onAddInstance = store.add(new Emitter<ITerminalInstance>());
			const onRemoveInstance = store.add(new Emitter<ITerminalInstance>());

			const multiplexer = store.add(createInstanceCapabilityEventMultiplexer(
				[instance],
				onAddInstance.event,
				onRemoveInstance.event,
				TerminalCapability.CwdDetection,
				(cap) => cap.onDidChangeCwd
			));

			let eventFired = false;
			store.add(multiplexer.event(() => {
				eventFired = true;
			}));

			strictEqual(eventFired, false, 'No event should be fired for instances without capabilities');
		});

		test('should handle adding new instances', () => {
			const onAddInstance = store.add(new Emitter<ITerminalInstance>());
			const onRemoveInstance = store.add(new Emitter<ITerminalInstance>());

			const multiplexer = store.add(createInstanceCapabilityEventMultiplexer(
				[],
				onAddInstance.event,
				onRemoveInstance.event,
				TerminalCapability.CwdDetection,
				(cap) => cap.onDidChangeCwd
			));

			let eventFired = false;
			let capturedData: { instance: ITerminalInstance; data: string } | undefined;

			store.add(multiplexer.event(e => {
				eventFired = true;
				capturedData = e;
			}));

			// Add a new instance with capability
			const capability = store.add(new MockCwdDetectionCapability());
			const capabilities = store.add(new TerminalCapabilityStore());
			const instance = createMockTerminalInstance(2, capabilities);

			onAddInstance.fire(instance);

			// Add capability to the instance after it's added to the multiplexer
			capabilities.add(TerminalCapability.CwdDetection, capability);

			// Fire an event from the capability
			capability.fireEvent('new-instance-data');

			strictEqual(eventFired, true, 'Event should be fired from new instance');
			strictEqual(capturedData?.instance, instance, 'Event should contain correct new instance');
			strictEqual(capturedData?.data, 'new-instance-data', 'Event should contain correct data');
		});

		test('should handle removing instances', () => {
			const capability = store.add(new MockCwdDetectionCapability());
			const capabilities = store.add(new TerminalCapabilityStore());
			capabilities.add(TerminalCapability.CwdDetection, capability);
			const instance = createMockTerminalInstance(3, capabilities);

			const onAddInstance = store.add(new Emitter<ITerminalInstance>());
			const onRemoveInstance = store.add(new Emitter<ITerminalInstance>());

			const multiplexer = store.add(createInstanceCapabilityEventMultiplexer(
				[instance],
				onAddInstance.event,
				onRemoveInstance.event,
				TerminalCapability.CwdDetection,
				(cap) => cap.onDidChangeCwd
			));

			let eventCount = 0;
			store.add(multiplexer.event(() => {
				eventCount++;
			}));

			// Fire event before removal
			capability.fireEvent('before-removal');
			strictEqual(eventCount, 1, 'Event should be fired before removal');

			// Remove the instance
			onRemoveInstance.fire(instance);

			// Fire event after removal - should not be received
			capability.fireEvent('after-removal');
			strictEqual(eventCount, 1, 'Event should not be fired after instance removal');
		});

		test('should handle adding capabilities to existing instances', () => {
			const capabilities = store.add(new TerminalCapabilityStore());
			const instance = createMockTerminalInstance(4, capabilities);
			const onAddInstance = store.add(new Emitter<ITerminalInstance>());
			const onRemoveInstance = store.add(new Emitter<ITerminalInstance>());

			const multiplexer = store.add(createInstanceCapabilityEventMultiplexer(
				[instance],
				onAddInstance.event,
				onRemoveInstance.event,
				TerminalCapability.CwdDetection,
				(cap) => cap.onDidChangeCwd
			));

			let eventFired = false;
			let capturedData: { instance: ITerminalInstance; data: string } | undefined;

			store.add(multiplexer.event(e => {
				eventFired = true;
				capturedData = e;
			}));

			// Add capability to existing instance
			const capability = store.add(new MockCwdDetectionCapability());
			capabilities.add(TerminalCapability.CwdDetection, capability);

			// Fire an event from the newly added capability
			capability.fireEvent('added-capability-data');

			strictEqual(eventFired, true, 'Event should be fired from newly added capability');
			strictEqual(capturedData?.instance, instance, 'Event should contain correct instance');
			strictEqual(capturedData?.data, 'added-capability-data', 'Event should contain correct data');
		});

		test('should handle removing capabilities from existing instances', () => {
			const capability = store.add(new MockCwdDetectionCapability());
			const capabilities = store.add(new TerminalCapabilityStore());
			capabilities.add(TerminalCapability.CwdDetection, capability);
			const instance = createMockTerminalInstance(5, capabilities);

			const onAddInstance = store.add(new Emitter<ITerminalInstance>());
			const onRemoveInstance = store.add(new Emitter<ITerminalInstance>());

			const multiplexer = store.add(createInstanceCapabilityEventMultiplexer(
				[instance],
				onAddInstance.event,
				onRemoveInstance.event,
				TerminalCapability.CwdDetection,
				(cap) => cap.onDidChangeCwd
			));

			let eventCount = 0;
			store.add(multiplexer.event(() => {
				eventCount++;
			}));

			// Fire event before removing capability
			capability.fireEvent('before-capability-removal');
			strictEqual(eventCount, 1, 'Event should be fired before capability removal');

			// Remove the capability
			capabilities.remove(TerminalCapability.CwdDetection);			// Fire event after capability removal - should not be received
			capability.fireEvent('after-capability-removal');
			strictEqual(eventCount, 1, 'Event should not be fired after capability removal');
		});

		test('should handle multiple instances with same capability', () => {
			const capability1 = store.add(new MockCwdDetectionCapability());
			const capability2 = store.add(new MockCwdDetectionCapability());
			const capabilities1 = store.add(new TerminalCapabilityStore());
			const capabilities2 = store.add(new TerminalCapabilityStore());
			capabilities1.add(TerminalCapability.CwdDetection, capability1);
			capabilities2.add(TerminalCapability.CwdDetection, capability2);
			const instance1 = createMockTerminalInstance(6, capabilities1);
			const instance2 = createMockTerminalInstance(7, capabilities2);

			const onAddInstance = store.add(new Emitter<ITerminalInstance>());
			const onRemoveInstance = store.add(new Emitter<ITerminalInstance>());

			const multiplexer = store.add(createInstanceCapabilityEventMultiplexer(
				[instance1, instance2],
				onAddInstance.event,
				onRemoveInstance.event,
				TerminalCapability.CwdDetection,
				(cap) => cap.onDidChangeCwd
			));

			const events: Array<{ instance: ITerminalInstance; data: string }> = [];
			store.add(multiplexer.event(e => {
				events.push(e);
			}));

			// Fire events from both capabilities
			capability1.fireEvent('data-from-instance1');
			capability2.fireEvent('data-from-instance2');

			strictEqual(events.length, 2, 'Both events should be received');
			strictEqual(events[0].instance, instance1, 'First event should be from instance1');
			strictEqual(events[0].data, 'data-from-instance1', 'First event should have correct data');
			strictEqual(events[1].instance, instance2, 'Second event should be from instance2');
			strictEqual(events[1].data, 'data-from-instance2', 'Second event should have correct data');
		});

		test('should properly dispose all resources', () => {
			const testStore = new DisposableStore();
			const capability = testStore.add(new MockCwdDetectionCapability());
			const capabilities = testStore.add(new TerminalCapabilityStore());
			capabilities.add(TerminalCapability.CwdDetection, capability);
			const instance = createMockTerminalInstance(8, capabilities);

			const onAddInstance = testStore.add(new Emitter<ITerminalInstance>());
			const onRemoveInstance = testStore.add(new Emitter<ITerminalInstance>());

			const multiplexer = testStore.add(createInstanceCapabilityEventMultiplexer(
				[instance],
				onAddInstance.event,
				onRemoveInstance.event,
				TerminalCapability.CwdDetection,
				(cap) => cap.onDidChangeCwd
			));

			let eventCount = 0;
			testStore.add(multiplexer.event(() => {
				eventCount++;
			}));

			// Fire event before disposal
			capability.fireEvent('before-disposal');
			strictEqual(eventCount, 1, 'Event should be fired before disposal');

			// Dispose everything
			testStore.dispose();

			// Fire event after disposal - should not be received
			capability.fireEvent('after-disposal');
			strictEqual(eventCount, 1, 'Event should not be fired after disposal');
		});

		test('should handle empty current instances array', () => {
			const onAddInstance = store.add(new Emitter<ITerminalInstance>());
			const onRemoveInstance = store.add(new Emitter<ITerminalInstance>());

			const multiplexer = store.add(createInstanceCapabilityEventMultiplexer(
				[],
				onAddInstance.event,
				onRemoveInstance.event,
				TerminalCapability.CwdDetection,
				(cap) => cap.onDidChangeCwd
			));

			let eventFired = false;
			store.add(multiplexer.event(() => {
				eventFired = true;
			}));

			// No instances, so no events should be fired initially
			strictEqual(eventFired, false, 'No events should be fired with empty instances array');
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/browser/terminalInstance.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/terminalInstance.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual, strictEqual } from 'assert';
import { Event } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import { isWindows, type IProcessEnvironment } from '../../../../../base/common/platform.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { TerminalCapability, type ICwdDetectionCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { TerminalCapabilityStore } from '../../../../../platform/terminal/common/capabilities/terminalCapabilityStore.js';
import { GeneralShellType, ITerminalChildProcess, ITerminalProfile, TitleEventSource, type IShellLaunchConfig, type ITerminalBackend, type ITerminalProcessOptions } from '../../../../../platform/terminal/common/terminal.js';
import { IWorkspaceFolder } from '../../../../../platform/workspace/common/workspace.js';
import { IViewDescriptorService } from '../../../../common/views.js';
import { ITerminalConfigurationService, ITerminalInstance, ITerminalInstanceService, ITerminalService } from '../../browser/terminal.js';
import { TerminalConfigurationService } from '../../browser/terminalConfigurationService.js';
import { parseExitResult, TerminalInstance, TerminalLabelComputer } from '../../browser/terminalInstance.js';
import { IEnvironmentVariableService } from '../../common/environmentVariable.js';
import { EnvironmentVariableService } from '../../common/environmentVariableService.js';
import { ITerminalProfileResolverService, ProcessState } from '../../common/terminal.js';
import { TestViewDescriptorService } from './xterm/xtermTerminal.test.js';
import { fixPath } from '../../../../services/search/test/browser/queryBuilder.test.js';
import { TestTerminalProfileResolverService, workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';

const root1 = '/foo/root1';
const ROOT_1 = fixPath(root1);
const root2 = '/foo/root2';
const ROOT_2 = fixPath(root2);

class MockTerminalProfileResolverService extends TestTerminalProfileResolverService {
	override async getDefaultProfile(): Promise<ITerminalProfile> {
		return {
			profileName: 'my-sh',
			path: '/usr/bin/zsh',
			env: {
				TEST: 'TEST',
			},
			isDefault: true,
			isUnsafePath: false,
			isFromPath: true,
			icon: {
				id: 'terminal-linux',
			},
			color: 'terminal.ansiYellow',
		};
	}
}

const terminalShellTypeContextKey = {
	set: () => { },
	reset: () => { },
	get: () => undefined
};

class TestTerminalChildProcess extends Disposable implements ITerminalChildProcess {
	id: number = 0;
	get capabilities() { return []; }
	constructor(
		readonly shouldPersist: boolean
	) {
		super();
	}
	updateProperty(property: any, value: any): Promise<void> {
		throw new Error('Method not implemented.');
	}

	readonly onProcessOverrideDimensions?: Event<any> | undefined;
	readonly onProcessResolvedShellLaunchConfig?: Event<any> | undefined;
	readonly onDidChangeHasChildProcesses?: Event<any> | undefined;

	onDidChangeProperty = Event.None;
	onProcessData = Event.None;
	onProcessExit = Event.None;
	onProcessReady = Event.None;
	onProcessTitleChanged = Event.None;
	onProcessShellTypeChanged = Event.None;
	async start(): Promise<undefined> { return undefined; }
	shutdown(immediate: boolean): void { }
	input(data: string): void { }
	sendSignal(signal: string): void { }
	resize(cols: number, rows: number): void { }
	clearBuffer(): void { }
	acknowledgeDataEvent(charCount: number): void { }
	async setUnicodeVersion(version: '6' | '11'): Promise<void> { }
	async getInitialCwd(): Promise<string> { return ''; }
	async getCwd(): Promise<string> { return ''; }
	async processBinary(data: string): Promise<void> { }
	refreshProperty(property: any): Promise<any> { return Promise.resolve(''); }
}

class TestTerminalInstanceService extends Disposable implements Partial<ITerminalInstanceService> {
	async getBackend() {
		return {
			onPtyHostExit: Event.None,
			onPtyHostUnresponsive: Event.None,
			onPtyHostResponsive: Event.None,
			onPtyHostRestart: Event.None,
			onDidMoveWindowInstance: Event.None,
			onDidRequestDetach: Event.None,
			createProcess: async (
				shellLaunchConfig: IShellLaunchConfig,
				cwd: string,
				cols: number,
				rows: number,
				unicodeVersion: '6' | '11',
				env: IProcessEnvironment,
				options: ITerminalProcessOptions,
				shouldPersist: boolean
			) => this._register(new TestTerminalChildProcess(shouldPersist)),
			getLatency: () => Promise.resolve([])
		} as unknown as ITerminalBackend;
	}
}

suite('Workbench - TerminalInstance', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	suite('TerminalInstance', () => {
		let terminalInstance: ITerminalInstance;
		test('should create an instance of TerminalInstance with env from default profile', async () => {
			const instantiationService = workbenchInstantiationService({
				configurationService: () => new TestConfigurationService({
					files: {},
					terminal: {
						integrated: {
							fontFamily: 'monospace',
							scrollback: 1000,
							fastScrollSensitivity: 2,
							mouseWheelScrollSensitivity: 1,
							unicodeVersion: '6',
							shellIntegration: {
								enabled: true
							}
						}
					},
				})
			}, store);
			instantiationService.set(ITerminalProfileResolverService, new MockTerminalProfileResolverService());
			instantiationService.stub(IViewDescriptorService, new TestViewDescriptorService());
			instantiationService.stub(IEnvironmentVariableService, store.add(instantiationService.createInstance(EnvironmentVariableService)));
			instantiationService.stub(ITerminalInstanceService, store.add(new TestTerminalInstanceService()));
			instantiationService.stub(ITerminalService, { setNextCommandId: async () => { } } as Partial<ITerminalService>);
			terminalInstance = store.add(instantiationService.createInstance(TerminalInstance, terminalShellTypeContextKey, {}));
			// //Wait for the teminalInstance._xtermReadyPromise to resolve
			await new Promise(resolve => setTimeout(resolve, 100));
			deepStrictEqual(terminalInstance.shellLaunchConfig.env, { TEST: 'TEST' });
		});

		test('should preserve title for task terminals', async () => {
			const instantiationService = workbenchInstantiationService({
				configurationService: () => new TestConfigurationService({
					files: {},
					terminal: {
						integrated: {
							fontFamily: 'monospace',
							scrollback: 1000,
							fastScrollSensitivity: 2,
							mouseWheelScrollSensitivity: 1,
							unicodeVersion: '6',
							shellIntegration: {
								enabled: true
							}
						}
					},
				})
			}, store);
			instantiationService.set(ITerminalProfileResolverService, new MockTerminalProfileResolverService());
			instantiationService.stub(IViewDescriptorService, new TestViewDescriptorService());
			instantiationService.stub(IEnvironmentVariableService, store.add(instantiationService.createInstance(EnvironmentVariableService)));
			instantiationService.stub(ITerminalInstanceService, store.add(new TestTerminalInstanceService()));
			instantiationService.stub(ITerminalService, { setNextCommandId: async () => { } } as Partial<ITerminalService>);

			const taskTerminal = store.add(instantiationService.createInstance(TerminalInstance, terminalShellTypeContextKey, {
				type: 'Task',
				name: 'Test Task Name'
			}));


			// Simulate setting the title via API (as the task system would do)
			await taskTerminal.rename('Test Task Name');
			strictEqual(taskTerminal.title, 'Test Task Name');

			// Simulate a process title change (which happens when task completes)
			await taskTerminal.rename('some-process-name', TitleEventSource.Process);

			// Verify that the task name is preserved
			strictEqual(taskTerminal.title, 'Test Task Name', 'Task terminal should preserve API-set title');
		});
	});
	suite('parseExitResult', () => {
		test('should return no message for exit code = undefined', () => {
			deepStrictEqual(
				parseExitResult(undefined, {}, ProcessState.KilledDuringLaunch, undefined),
				{ code: undefined, message: undefined }
			);
			deepStrictEqual(
				parseExitResult(undefined, {}, ProcessState.KilledByUser, undefined),
				{ code: undefined, message: undefined }
			);
			deepStrictEqual(
				parseExitResult(undefined, {}, ProcessState.KilledByProcess, undefined),
				{ code: undefined, message: undefined }
			);
		});
		test('should return no message for exit code = 0', () => {
			deepStrictEqual(
				parseExitResult(0, {}, ProcessState.KilledDuringLaunch, undefined),
				{ code: 0, message: undefined }
			);
			deepStrictEqual(
				parseExitResult(0, {}, ProcessState.KilledByUser, undefined),
				{ code: 0, message: undefined }
			);
			deepStrictEqual(
				parseExitResult(0, {}, ProcessState.KilledDuringLaunch, undefined),
				{ code: 0, message: undefined }
			);
		});
		test('should return friendly message when executable is specified for non-zero exit codes', () => {
			deepStrictEqual(
				parseExitResult(1, { executable: 'foo' }, ProcessState.KilledDuringLaunch, undefined),
				{ code: 1, message: 'The terminal process "foo" failed to launch (exit code: 1).' }
			);
			deepStrictEqual(
				parseExitResult(1, { executable: 'foo' }, ProcessState.KilledByUser, undefined),
				{ code: 1, message: 'The terminal process "foo" terminated with exit code: 1.' }
			);
			deepStrictEqual(
				parseExitResult(1, { executable: 'foo' }, ProcessState.KilledByProcess, undefined),
				{ code: 1, message: 'The terminal process "foo" terminated with exit code: 1.' }
			);
		});
		test('should return friendly message when executable and args are specified for non-zero exit codes', () => {
			deepStrictEqual(
				parseExitResult(1, { executable: 'foo', args: ['bar', 'baz'] }, ProcessState.KilledDuringLaunch, undefined),
				{ code: 1, message: `The terminal process "foo 'bar', 'baz'" failed to launch (exit code: 1).` }
			);
			deepStrictEqual(
				parseExitResult(1, { executable: 'foo', args: ['bar', 'baz'] }, ProcessState.KilledByUser, undefined),
				{ code: 1, message: `The terminal process "foo 'bar', 'baz'" terminated with exit code: 1.` }
			);
			deepStrictEqual(
				parseExitResult(1, { executable: 'foo', args: ['bar', 'baz'] }, ProcessState.KilledByProcess, undefined),
				{ code: 1, message: `The terminal process "foo 'bar', 'baz'" terminated with exit code: 1.` }
			);
		});
		test('should return friendly message when executable and arguments are omitted for non-zero exit codes', () => {
			deepStrictEqual(
				parseExitResult(1, {}, ProcessState.KilledDuringLaunch, undefined),
				{ code: 1, message: `The terminal process failed to launch (exit code: 1).` }
			);
			deepStrictEqual(
				parseExitResult(1, {}, ProcessState.KilledByUser, undefined),
				{ code: 1, message: `The terminal process terminated with exit code: 1.` }
			);
			deepStrictEqual(
				parseExitResult(1, {}, ProcessState.KilledByProcess, undefined),
				{ code: 1, message: `The terminal process terminated with exit code: 1.` }
			);
		});
		test('should ignore pty host-related errors', () => {
			deepStrictEqual(
				parseExitResult({ message: 'Could not find pty with id 16' }, {}, ProcessState.KilledDuringLaunch, undefined),
				{ code: undefined, message: undefined }
			);
		});
		test('should format conpty failure code 5', () => {
			deepStrictEqual(
				parseExitResult({ code: 5, message: 'A native exception occurred during launch (Cannot create process, error code: 5)' }, { executable: 'foo' }, ProcessState.KilledDuringLaunch, undefined),
				{ code: 5, message: `The terminal process failed to launch: Access was denied to the path containing your executable "foo". Manage and change your permissions to get this to work.` }
			);
		});
		test('should format conpty failure code 267', () => {
			deepStrictEqual(
				parseExitResult({ code: 267, message: 'A native exception occurred during launch (Cannot create process, error code: 267)' }, {}, ProcessState.KilledDuringLaunch, '/foo'),
				{ code: 267, message: `The terminal process failed to launch: Invalid starting directory "/foo", review your terminal.integrated.cwd setting.` }
			);
		});
		test('should format conpty failure code 1260', () => {
			deepStrictEqual(
				parseExitResult({ code: 1260, message: 'A native exception occurred during launch (Cannot create process, error code: 1260)' }, { executable: 'foo' }, ProcessState.KilledDuringLaunch, undefined),
				{ code: 1260, message: `The terminal process failed to launch: Windows cannot open this program because it has been prevented by a software restriction policy. For more information, open Event Viewer or contact your system Administrator.` }
			);
		});
		test('should format generic failures', () => {
			deepStrictEqual(
				parseExitResult({ code: 123, message: 'A native exception occurred during launch (Cannot create process, error code: 123)' }, {}, ProcessState.KilledDuringLaunch, undefined),
				{ code: 123, message: `The terminal process failed to launch: A native exception occurred during launch (Cannot create process, error code: 123).` }
			);
			deepStrictEqual(
				parseExitResult({ code: 123, message: 'foo' }, {}, ProcessState.KilledDuringLaunch, undefined),
				{ code: 123, message: `The terminal process failed to launch: foo.` }
			);
		});
	});
	suite('TerminalLabelComputer', () => {
		let instantiationService: TestInstantiationService;
		let capabilities: TerminalCapabilityStore;

		function createInstance(partial?: Partial<ITerminalInstance>): Pick<ITerminalInstance, 'shellLaunchConfig' | 'shellType' | 'userHome' | 'cwd' | 'initialCwd' | 'processName' | 'sequence' | 'workspaceFolder' | 'staticTitle' | 'capabilities' | 'title' | 'description'> {
			const capabilities = store.add(new TerminalCapabilityStore());
			if (!isWindows) {
				capabilities.add(TerminalCapability.NaiveCwdDetection, null!);
			}
			return {
				shellLaunchConfig: {},
				shellType: GeneralShellType.PowerShell,
				cwd: 'cwd',
				initialCwd: undefined,
				processName: '',
				sequence: undefined,
				workspaceFolder: undefined,
				staticTitle: undefined,
				capabilities,
				title: '',
				description: '',
				userHome: undefined,
				...partial
			};
		}

		setup(async () => {
			instantiationService = workbenchInstantiationService(undefined, store);
			capabilities = store.add(new TerminalCapabilityStore());
			if (!isWindows) {
				capabilities.add(TerminalCapability.NaiveCwdDetection, null!);
			}
		});

		function createLabelComputer(configuration: any) {
			instantiationService.set(IConfigurationService, new TestConfigurationService(configuration));
			instantiationService.set(ITerminalConfigurationService, store.add(instantiationService.createInstance(TerminalConfigurationService)));
			return store.add(instantiationService.createInstance(TerminalLabelComputer));
		}

		test('should resolve to "" when the template variables are empty', () => {
			const terminalLabelComputer = createLabelComputer({ terminal: { integrated: { tabs: { separator: ' - ', title: '', description: '' } } } });
			terminalLabelComputer.refreshLabel(createInstance({ capabilities, processName: '' }));
			// TODO:
			// terminalLabelComputer.onLabelChanged(e => {
			// 	strictEqual(e.title, '');
			// 	strictEqual(e.description, '');
			// });
			strictEqual(terminalLabelComputer.title, '');
			strictEqual(terminalLabelComputer.description, '');
		});
		test('should resolve cwd', () => {
			const terminalLabelComputer = createLabelComputer({ terminal: { integrated: { tabs: { separator: ' - ', title: '${cwd}', description: '${cwd}' } } } });
			terminalLabelComputer.refreshLabel(createInstance({ capabilities, cwd: ROOT_1 }));
			strictEqual(terminalLabelComputer.title, ROOT_1);
			strictEqual(terminalLabelComputer.description, ROOT_1);
		});
		test('should resolve workspaceFolder', () => {
			const terminalLabelComputer = createLabelComputer({ terminal: { integrated: { tabs: { separator: ' - ', title: '${workspaceFolder}', description: '${workspaceFolder}' } } } });
			terminalLabelComputer.refreshLabel(createInstance({ capabilities, processName: 'zsh', workspaceFolder: { uri: URI.from({ scheme: Schemas.file, path: 'folder' }) } as IWorkspaceFolder }));
			strictEqual(terminalLabelComputer.title, 'folder');
			strictEqual(terminalLabelComputer.description, 'folder');
		});
		test('should resolve local', () => {
			const terminalLabelComputer = createLabelComputer({ terminal: { integrated: { tabs: { separator: ' - ', title: '${local}', description: '${local}' } } } });
			terminalLabelComputer.refreshLabel(createInstance({ capabilities, processName: 'zsh', shellLaunchConfig: { type: 'Local' } }));
			strictEqual(terminalLabelComputer.title, 'Local');
			strictEqual(terminalLabelComputer.description, 'Local');
		});
		test('should resolve process', () => {
			const terminalLabelComputer = createLabelComputer({ terminal: { integrated: { tabs: { separator: ' - ', title: '${process}', description: '${process}' } } } });
			terminalLabelComputer.refreshLabel(createInstance({ capabilities, processName: 'zsh' }));
			strictEqual(terminalLabelComputer.title, 'zsh');
			strictEqual(terminalLabelComputer.description, 'zsh');
		});
		test('should resolve sequence', () => {
			const terminalLabelComputer = createLabelComputer({ terminal: { integrated: { tabs: { separator: ' - ', title: '${sequence}', description: '${sequence}' } } } });
			terminalLabelComputer.refreshLabel(createInstance({ capabilities, sequence: 'sequence' }));
			strictEqual(terminalLabelComputer.title, 'sequence');
			strictEqual(terminalLabelComputer.description, 'sequence');
		});
		test('should resolve task', () => {
			const terminalLabelComputer = createLabelComputer({ terminal: { integrated: { tabs: { separator: ' ~ ', title: '${process}${separator}${task}', description: '${task}' } } } });
			terminalLabelComputer.refreshLabel(createInstance({ capabilities, processName: 'zsh', shellLaunchConfig: { type: 'Task' } }));
			strictEqual(terminalLabelComputer.title, 'zsh ~ Task');
			strictEqual(terminalLabelComputer.description, 'Task');
		});
		test('should resolve separator', () => {
			const terminalLabelComputer = createLabelComputer({ terminal: { integrated: { tabs: { separator: ' ~ ', title: '${separator}', description: '${separator}' } } } });
			terminalLabelComputer.refreshLabel(createInstance({ capabilities, processName: 'zsh', shellLaunchConfig: { type: 'Task' } }));
			strictEqual(terminalLabelComputer.title, 'zsh');
			strictEqual(terminalLabelComputer.description, '');
		});
		test('should always return static title when specified', () => {
			const terminalLabelComputer = createLabelComputer({ terminal: { integrated: { tabs: { separator: ' ~ ', title: '${process}', description: '${workspaceFolder}' } } } });
			terminalLabelComputer.refreshLabel(createInstance({ capabilities, processName: 'process', workspaceFolder: { uri: URI.from({ scheme: Schemas.file, path: 'folder' }) } as IWorkspaceFolder, staticTitle: 'my-title' }));
			strictEqual(terminalLabelComputer.title, 'my-title');
			strictEqual(terminalLabelComputer.description, 'folder');
		});
		test('should provide cwdFolder for all cwds only when in multi-root', () => {
			const terminalLabelComputer = createLabelComputer({ terminal: { integrated: { tabs: { separator: ' ~ ', title: '${process}${separator}${cwdFolder}', description: '${cwdFolder}' } } } });
			terminalLabelComputer.refreshLabel(createInstance({ capabilities, processName: 'process', workspaceFolder: { uri: URI.from({ scheme: Schemas.file, path: ROOT_1 }) } as IWorkspaceFolder, cwd: ROOT_1 }));
			// single-root, cwd is same as root
			strictEqual(terminalLabelComputer.title, 'process');
			strictEqual(terminalLabelComputer.description, '');
			// multi-root
			terminalLabelComputer.refreshLabel(createInstance({ capabilities, processName: 'process', workspaceFolder: { uri: URI.from({ scheme: Schemas.file, path: ROOT_1 }) } as IWorkspaceFolder, cwd: ROOT_2 }));
			if (isWindows) {
				strictEqual(terminalLabelComputer.title, 'process');
				strictEqual(terminalLabelComputer.description, '');
			} else {
				strictEqual(terminalLabelComputer.title, 'process ~ root2');
				strictEqual(terminalLabelComputer.description, 'root2');
			}
		});
		test('should hide cwdFolder in single folder workspaces when cwd matches the workspace\'s default cwd even when slashes differ', async () => {
			let terminalLabelComputer = createLabelComputer({ terminal: { integrated: { tabs: { separator: ' ~ ', title: '${process}${separator}${cwdFolder}', description: '${cwdFolder}' } } } });
			terminalLabelComputer.refreshLabel(createInstance({ capabilities, processName: 'process', workspaceFolder: { uri: URI.from({ scheme: Schemas.file, path: ROOT_1 }) } as IWorkspaceFolder, cwd: ROOT_1 }));
			strictEqual(terminalLabelComputer.title, 'process');
			strictEqual(terminalLabelComputer.description, '');
			if (!isWindows) {
				terminalLabelComputer = createLabelComputer({ terminal: { integrated: { tabs: { separator: ' ~ ', title: '${process}${separator}${cwdFolder}', description: '${cwdFolder}' } } } });
				terminalLabelComputer.refreshLabel(createInstance({ capabilities, processName: 'process', workspaceFolder: { uri: URI.from({ scheme: Schemas.file, path: ROOT_1 }) } as IWorkspaceFolder, cwd: ROOT_2 }));
				strictEqual(terminalLabelComputer.title, 'process ~ root2');
				strictEqual(terminalLabelComputer.description, 'root2');
			}
		});
	});

	suite('getCwdResource', () => {
		let mockFileService: any;
		let mockPathService: any;

		function createMockTerminalInstance(options: {
			cwd?: string;
			remoteAuthority?: string;
			fileExists?: boolean;
		}): Pick<ITerminalInstance, 'getCwdResource' | 'capabilities' | 'remoteAuthority'> {
			const capabilities = store.add(new TerminalCapabilityStore());

			if (options.cwd) {
				const mockCwdDetection = {
					getCwd: () => options.cwd
				};
				capabilities.add(TerminalCapability.CwdDetection, mockCwdDetection as unknown as ICwdDetectionCapability);
			}

			// Mock file service
			mockFileService = {
				exists: async (resource: URI) => options.fileExists !== false
			};

			// Mock path service
			mockPathService = {
				fileURI: async (path: string) => {
					if (options.remoteAuthority) {
						return URI.parse(`vscode-remote://${options.remoteAuthority}${path}`);
					}
					return URI.file(path);
				}
			};

			return {
				capabilities,
				remoteAuthority: options.remoteAuthority,
				async getCwdResource(): Promise<URI | undefined> {
					const cwd = this.capabilities.get(TerminalCapability.CwdDetection)?.getCwd();
					if (!cwd) {
						return undefined;
					}
					let resource: URI;
					if (this.remoteAuthority) {
						resource = await mockPathService.fileURI(cwd);
					} else {
						resource = URI.file(cwd);
					}
					if (await mockFileService.exists(resource)) {
						return resource;
					}
					return undefined;
				}
			};
		}

		test('should return undefined when no CwdDetection capability', async () => {
			const instance = createMockTerminalInstance({});

			const result = await instance.getCwdResource();
			strictEqual(result, undefined);
		});

		test('should return undefined when CwdDetection capability returns no cwd', async () => {
			const instance = createMockTerminalInstance({ cwd: undefined });

			const result = await instance.getCwdResource();
			strictEqual(result, undefined);
		});

		test('should return URI.file for local terminal when file exists', async () => {
			const testCwd = '/test/path';
			const instance = createMockTerminalInstance({ cwd: testCwd, fileExists: true });

			const result = await instance.getCwdResource();
			strictEqual(result?.scheme, 'file');
			strictEqual(result?.path, testCwd);
		});

		test('should return undefined when file does not exist', async () => {
			const testCwd = '/test/nonexistent';
			const instance = createMockTerminalInstance({ cwd: testCwd, fileExists: false });

			const result = await instance.getCwdResource();
			strictEqual(result, undefined);
		});

		test('should use pathService.fileURI for remote terminal', async () => {
			const testCwd = '/test/remote/path';
			const instance = createMockTerminalInstance({
				cwd: testCwd,
				remoteAuthority: 'test-remote',
				fileExists: true
			});

			const result = await instance.getCwdResource();
			strictEqual(result?.scheme, 'vscode-remote');
			strictEqual(result?.authority, 'test-remote');
			strictEqual(result?.path, testCwd);
		});

		test('should handle Windows paths correctly', async () => {
			const testCwd = isWindows ? 'C:\\test\\path' : '/test/path';
			const instance = createMockTerminalInstance({ cwd: testCwd, fileExists: true });

			const result = await instance.getCwdResource();
			strictEqual(result?.scheme, 'file');
			if (isWindows) {
				strictEqual(result?.path, '/C:/test/path');
			} else {
				strictEqual(result?.path, testCwd);
			}
		});

		test('should handle empty cwd string', async () => {
			const instance = createMockTerminalInstance({ cwd: '' });

			const result = await instance.getCwdResource();
			strictEqual(result, undefined);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/browser/terminalInstanceService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/terminalInstanceService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual } from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ITerminalProfile } from '../../../../../platform/terminal/common/terminal.js';
import { ITerminalInstanceService } from '../../browser/terminal.js';
import { TerminalInstanceService } from '../../browser/terminalInstanceService.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';

suite('Workbench - TerminalInstanceService', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let terminalInstanceService: ITerminalInstanceService;

	setup(async () => {
		const instantiationService = workbenchInstantiationService(undefined, store);
		terminalInstanceService = store.add(instantiationService.createInstance(TerminalInstanceService));
	});

	suite('convertProfileToShellLaunchConfig', () => {
		test('should return an empty shell launch config when undefined is provided', () => {
			deepStrictEqual(terminalInstanceService.convertProfileToShellLaunchConfig(), {});
			deepStrictEqual(terminalInstanceService.convertProfileToShellLaunchConfig(undefined), {});
		});
		test('should return the same shell launch config when provided', () => {
			deepStrictEqual(
				terminalInstanceService.convertProfileToShellLaunchConfig({}),
				{}
			);
			deepStrictEqual(
				terminalInstanceService.convertProfileToShellLaunchConfig({ executable: '/foo' }),
				{ executable: '/foo' }
			);
			deepStrictEqual(
				terminalInstanceService.convertProfileToShellLaunchConfig({ executable: '/foo', cwd: '/bar', args: ['a', 'b'] }),
				{ executable: '/foo', cwd: '/bar', args: ['a', 'b'] }
			);
			deepStrictEqual(
				terminalInstanceService.convertProfileToShellLaunchConfig({ executable: '/foo' }, '/bar'),
				{ executable: '/foo', cwd: '/bar' }
			);
			deepStrictEqual(
				terminalInstanceService.convertProfileToShellLaunchConfig({ executable: '/foo', cwd: '/bar' }, '/baz'),
				{ executable: '/foo', cwd: '/baz' }
			);
		});
		test('should convert a provided profile to a shell launch config', () => {
			deepStrictEqual(
				terminalInstanceService.convertProfileToShellLaunchConfig({
					profileName: 'abc',
					path: '/foo',
					isDefault: true
				}),
				{
					args: undefined,
					color: undefined,
					cwd: undefined,
					env: undefined,
					executable: '/foo',
					icon: undefined,
					name: undefined
				}
			);
			const icon = URI.file('/icon');
			deepStrictEqual(
				terminalInstanceService.convertProfileToShellLaunchConfig({
					profileName: 'abc',
					path: '/foo',
					isDefault: true,
					args: ['a', 'b'],
					color: 'color',
					env: { test: 'TEST' },
					icon
				} as ITerminalProfile, '/bar'),
				{
					args: ['a', 'b'],
					color: 'color',
					cwd: '/bar',
					env: { test: 'TEST' },
					executable: '/foo',
					icon,
					name: undefined
				}
			);
		});
		test('should respect overrideName in profile', () => {
			deepStrictEqual(
				terminalInstanceService.convertProfileToShellLaunchConfig({
					profileName: 'abc',
					path: '/foo',
					isDefault: true,
					overrideName: true
				}),
				{
					args: undefined,
					color: undefined,
					cwd: undefined,
					env: undefined,
					executable: '/foo',
					icon: undefined,
					name: 'abc'
				}
			);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/browser/terminalProcessManager.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/terminalProcessManager.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { strictEqual } from 'assert';
import { Event } from '../../../../../base/common/event.js';
import { Schemas } from '../../../../../base/common/network.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IConfigurationService, type IConfigurationChangeEvent } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { ITerminalChildProcess, type ITerminalBackend } from '../../../../../platform/terminal/common/terminal.js';
import { ITerminalInstanceService, ITerminalService } from '../../browser/terminal.js';
import { TerminalProcessManager } from '../../browser/terminalProcessManager.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';

class TestTerminalChildProcess implements ITerminalChildProcess {
	id: number = 0;
	get capabilities() { return []; }
	constructor(
		readonly shouldPersist: boolean
	) {
	}
	updateProperty(property: any, value: any): Promise<void> {
		throw new Error('Method not implemented.');
	}

	readonly onProcessOverrideDimensions?: Event<any> | undefined;
	readonly onProcessResolvedShellLaunchConfig?: Event<any> | undefined;
	readonly onDidChangeHasChildProcesses?: Event<any> | undefined;

	onDidChangeProperty = Event.None;
	onProcessData = Event.None;
	onProcessExit = Event.None;
	onProcessReady = Event.None;
	onProcessTitleChanged = Event.None;
	onProcessShellTypeChanged = Event.None;
	async start(): Promise<undefined> { return undefined; }
	shutdown(immediate: boolean): void { }
	input(data: string): void { }
	sendSignal(signal: string): void { }
	resize(cols: number, rows: number): void { }
	clearBuffer(): void { }
	acknowledgeDataEvent(charCount: number): void { }
	async setUnicodeVersion(version: '6' | '11'): Promise<void> { }
	async getInitialCwd(): Promise<string> { return ''; }
	async getCwd(): Promise<string> { return ''; }
	async processBinary(data: string): Promise<void> { }
	refreshProperty(property: any): Promise<any> { return Promise.resolve(''); }
}

class TestTerminalInstanceService implements Partial<ITerminalInstanceService> {
	async getBackend() {
		return {
			onPtyHostExit: Event.None,
			onPtyHostUnresponsive: Event.None,
			onPtyHostResponsive: Event.None,
			onPtyHostRestart: Event.None,
			onDidMoveWindowInstance: Event.None,
			onDidRequestDetach: Event.None,
			createProcess: (
				shellLaunchConfig: any,
				cwd: string,
				cols: number,
				rows: number,
				unicodeVersion: '6' | '11',
				env: any,
				windowsEnableConpty: boolean,
				shouldPersist: boolean
			) => new TestTerminalChildProcess(shouldPersist),
			getLatency: () => Promise.resolve([])
		} as unknown as ITerminalBackend;
	}
}

suite('Workbench - TerminalProcessManager', () => {
	let manager: TerminalProcessManager;

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async () => {
		const instantiationService = workbenchInstantiationService(undefined, store);
		const configurationService = instantiationService.get(IConfigurationService) as TestConfigurationService;
		await configurationService.setUserConfiguration('editor', { fontFamily: 'foo' });
		await configurationService.setUserConfiguration('terminal', {
			integrated: {
				fontFamily: 'bar',
				enablePersistentSessions: true,
				shellIntegration: {
					enabled: false
				}
			}
		});
		configurationService.onDidChangeConfigurationEmitter.fire({
			affectsConfiguration: () => true,
		} satisfies Partial<IConfigurationChangeEvent> as unknown as IConfigurationChangeEvent);
		instantiationService.stub(ITerminalInstanceService, new TestTerminalInstanceService());
		instantiationService.stub(ITerminalService, { setNextCommandId: async () => { } } as Partial<ITerminalService>);

		manager = store.add(instantiationService.createInstance(TerminalProcessManager, 1, undefined, undefined, undefined));
	});

	suite('process persistence', () => {
		suite('local', () => {
			test('regular terminal should persist', async () => {
				const p = await manager.createProcess({
				}, 1, 1, false);
				strictEqual(p, undefined);
				strictEqual(manager.shouldPersist, true);
			});
			test('task terminal should not persist', async () => {
				const p = await manager.createProcess({
					isFeatureTerminal: true
				}, 1, 1, false);
				strictEqual(p, undefined);
				strictEqual(manager.shouldPersist, false);
			});
		});
		suite('remote', () => {
			const remoteCwd = URI.from({
				scheme: Schemas.vscodeRemote,
				path: 'test/cwd'
			});

			test('regular terminal should persist', async () => {
				const p = await manager.createProcess({
					cwd: remoteCwd
				}, 1, 1, false);
				strictEqual(p, undefined);
				strictEqual(manager.shouldPersist, true);
			});
			test('task terminal should not persist', async () => {
				const p = await manager.createProcess({
					isFeatureTerminal: true,
					cwd: remoteCwd
				}, 1, 1, false);
				strictEqual(p, undefined);
				strictEqual(manager.shouldPersist, false);
			});
		});
	});
});
```

--------------------------------------------------------------------------------

````
