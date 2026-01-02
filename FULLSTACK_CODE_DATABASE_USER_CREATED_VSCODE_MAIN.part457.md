---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 457
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 457 of 552)

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

---[FILE: src/vs/workbench/contrib/terminal/browser/chatTerminalCommandMirror.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/chatTerminalCommandMirror.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import type { IMarker as IXtermMarker } from '@xterm/xterm';
import type { ITerminalCommand } from '../../../../platform/terminal/common/capabilities/capabilities.js';
import { ITerminalService, type IDetachedTerminalInstance } from './terminal.js';
import { DetachedProcessInfo } from './detachedTerminal.js';
import { TerminalCapabilityStore } from '../../../../platform/terminal/common/capabilities/terminalCapabilityStore.js';
import { XtermTerminal } from './xterm/xtermTerminal.js';
import { TERMINAL_BACKGROUND_COLOR } from '../common/terminalColorRegistry.js';
import { PANEL_BACKGROUND } from '../../../common/theme.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ChatContextKeys } from '../../chat/common/chatContextKeys.js';
import { editorBackground } from '../../../../platform/theme/common/colorRegistry.js';
import { Color } from '../../../../base/common/color.js';
import type { IChatTerminalToolInvocationData } from '../../chat/common/chatService.js';
import type { IColorTheme } from '../../../../platform/theme/common/themeService.js';

function getChatTerminalBackgroundColor(theme: IColorTheme, contextKeyService: IContextKeyService, storedBackground?: string): Color | undefined {
	if (storedBackground) {
		const color = Color.fromHex(storedBackground);
		if (color) {
			return color;
		}
	}

	const terminalBackground = theme.getColor(TERMINAL_BACKGROUND_COLOR);
	if (terminalBackground) {
		return terminalBackground;
	}

	const isInEditor = ChatContextKeys.inChatEditor.getValue(contextKeyService);
	return theme.getColor(isInEditor ? editorBackground : PANEL_BACKGROUND);
}

/**
 * Base class for detached terminal mirrors.
 * Handles attaching to containers and managing the detached terminal instance.
 */
abstract class DetachedTerminalMirror extends Disposable {
	private _detachedTerminal: Promise<IDetachedTerminalInstance> | undefined;
	private _attachedContainer: HTMLElement | undefined;

	protected _setDetachedTerminal(detachedTerminal: Promise<IDetachedTerminalInstance>): void {
		this._detachedTerminal = detachedTerminal.then(terminal => this._register(terminal));
	}

	protected async _getTerminal(): Promise<IDetachedTerminalInstance> {
		if (!this._detachedTerminal) {
			throw new Error('Detached terminal not initialized');
		}
		return this._detachedTerminal;
	}

	protected async _attachToContainer(container: HTMLElement): Promise<IDetachedTerminalInstance> {
		const terminal = await this._getTerminal();
		container.classList.add('chat-terminal-output-terminal');
		const needsAttach = this._attachedContainer !== container || container.firstChild === null;
		if (needsAttach) {
			terminal.attachToElement(container);
			this._attachedContainer = container;
		}
		return terminal;
	}
}

export async function getCommandOutputSnapshot(
	xtermTerminal: XtermTerminal,
	command: ITerminalCommand,
	log?: (reason: 'fallback' | 'primary', error: unknown) => void
): Promise<{ text: string; lineCount: number } | undefined> {
	const executedMarker = command.executedMarker;
	const endMarker = command.endMarker;

	if (!endMarker || endMarker.isDisposed) {
		return undefined;
	}

	if (!executedMarker || executedMarker.isDisposed) {
		const raw = xtermTerminal.raw;
		const buffer = raw.buffer.active;
		const offsets = [
			-(buffer.baseY + buffer.cursorY),
			-buffer.baseY,
			0
		];
		let startMarker: IXtermMarker | undefined;
		for (const offset of offsets) {
			startMarker = raw.registerMarker(offset);
			if (startMarker) {
				break;
			}
		}
		if (!startMarker || startMarker.isDisposed) {
			return { text: '', lineCount: 0 };
		}
		const startLine = startMarker.line;
		let text: string | undefined;
		try {
			text = await xtermTerminal.getRangeAsVT(startMarker, endMarker, true);
		} catch (error) {
			log?.('fallback', error);
			return undefined;
		} finally {
			startMarker.dispose();
		}
		if (!text) {
			return { text: '', lineCount: 0 };
		}
		const endLine = endMarker.line - 1;
		const lineCount = Math.max(endLine - startLine + 1, 0);
		return { text, lineCount };
	}

	const startLine = executedMarker.line;
	const endLine = endMarker.line - 1;
	const lineCount = Math.max(endLine - startLine + 1, 0);

	let text: string | undefined;
	try {
		text = await xtermTerminal.getRangeAsVT(executedMarker, endMarker, true);
	} catch (error) {
		log?.('primary', error);
		return undefined;
	}
	if (!text) {
		return { text: '', lineCount: 0 };
	}

	return { text, lineCount };
}

interface IDetachedTerminalCommandMirror {
	attach(container: HTMLElement): Promise<void>;
	renderCommand(): Promise<{ lineCount?: number } | undefined>;
}

/**
 * Mirrors a terminal command's output into a detached terminal instance.
 * Used in the chat terminal tool progress part to show command output for example.
 */
export class DetachedTerminalCommandMirror extends DetachedTerminalMirror implements IDetachedTerminalCommandMirror {
	constructor(
		private readonly _xtermTerminal: XtermTerminal,
		private readonly _command: ITerminalCommand,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
	) {
		super();
		const processInfo = this._register(new DetachedProcessInfo({ initialCwd: '' }));
		const capabilities = this._register(new TerminalCapabilityStore());
		this._setDetachedTerminal(this._terminalService.createDetachedTerminal({
			cols: this._xtermTerminal.raw!.cols,
			rows: 10,
			readonly: true,
			processInfo,
			disableOverviewRuler: true,
			capabilities,
			colorProvider: {
				getBackgroundColor: theme => getChatTerminalBackgroundColor(theme, this._contextKeyService),
			},
		}));
	}

	async attach(container: HTMLElement): Promise<void> {
		await this._attachToContainer(container);
	}

	async renderCommand(): Promise<{ lineCount?: number } | undefined> {
		const vt = await getCommandOutputSnapshot(this._xtermTerminal, this._command);
		if (!vt) {
			return undefined;
		}
		if (!vt.text) {
			return { lineCount: 0 };
		}
		const detached = await this._getTerminal();
		detached.xterm.clearBuffer();
		detached.xterm.clearSearchDecorations?.();
		await new Promise<void>(resolve => {
			detached.xterm.write(vt.text, () => resolve());
		});
		return { lineCount: vt.lineCount };
	}
}

/**
 * Mirrors a terminal output snapshot into a detached terminal instance.
 * Used when the terminal has been disposed of but we still want to show the output.
 */
export class DetachedTerminalSnapshotMirror extends DetachedTerminalMirror {
	private _output: IChatTerminalToolInvocationData['terminalCommandOutput'] | undefined;
	private _container: HTMLElement | undefined;
	private _dirty = true;
	private _lastRenderedLineCount: number | undefined;

	constructor(
		output: IChatTerminalToolInvocationData['terminalCommandOutput'] | undefined,
		private readonly _getTheme: () => IChatTerminalToolInvocationData['terminalTheme'] | undefined,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
	) {
		super();
		this._output = output;
		const processInfo = this._register(new DetachedProcessInfo({ initialCwd: '' }));
		this._setDetachedTerminal(this._terminalService.createDetachedTerminal({
			cols: 80,
			rows: 10,
			readonly: true,
			processInfo,
			disableOverviewRuler: true,
			colorProvider: {
				getBackgroundColor: theme => {
					const storedBackground = this._getTheme()?.background;
					return getChatTerminalBackgroundColor(theme, this._contextKeyService, storedBackground);
				}
			}
		}));
	}

	public setOutput(output: IChatTerminalToolInvocationData['terminalCommandOutput'] | undefined): void {
		this._output = output;
		this._dirty = true;
	}

	public async attach(container: HTMLElement): Promise<void> {
		await this._attachToContainer(container);
		this._container = container;
		this._applyTheme(container);
	}

	public async render(): Promise<{ lineCount?: number } | undefined> {
		const output = this._output;
		if (!output) {
			return undefined;
		}
		if (!this._dirty) {
			return { lineCount: this._lastRenderedLineCount ?? output.lineCount };
		}
		const terminal = await this._getTerminal();
		terminal.xterm.clearBuffer();
		terminal.xterm.clearSearchDecorations?.();
		if (this._container) {
			this._applyTheme(this._container);
		}
		const text = output.text ?? '';
		const lineCount = output.lineCount ?? this._estimateLineCount(text);
		if (!text) {
			this._dirty = false;
			this._lastRenderedLineCount = lineCount;
			return { lineCount: 0 };
		}
		await new Promise<void>(resolve => terminal.xterm.write(text, resolve));
		this._dirty = false;
		this._lastRenderedLineCount = lineCount;
		return { lineCount };
	}

	private _estimateLineCount(text: string): number {
		if (!text) {
			return 0;
		}
		const sanitized = text.replace(/\r/g, '');
		const segments = sanitized.split('\n');
		const count = sanitized.endsWith('\n') ? segments.length - 1 : segments.length;
		return Math.max(count, 1);
	}

	private _applyTheme(container: HTMLElement): void {
		const theme = this._getTheme();
		if (!theme) {
			container.style.removeProperty('background-color');
			container.style.removeProperty('color');
			return;
		}
		if (theme.background) {
			container.style.backgroundColor = theme.background;
		}
		if (theme.foreground) {
			container.style.color = theme.foreground;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/detachedTerminal.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/detachedTerminal.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { Delayer } from '../../../../base/common/async.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Disposable, DisposableStore, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { OperatingSystem } from '../../../../base/common/platform.js';
import { MicrotaskDelay } from '../../../../base/common/symbols.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ITerminalCapabilityStore } from '../../../../platform/terminal/common/capabilities/capabilities.js';
import { TerminalCapabilityStore } from '../../../../platform/terminal/common/capabilities/terminalCapabilityStore.js';
import { IMergedEnvironmentVariableCollection } from '../../../../platform/terminal/common/environmentVariable.js';
import { ITerminalBackend } from '../../../../platform/terminal/common/terminal.js';
import { IDetachedTerminalInstance, IDetachedXTermOptions, IDetachedXtermTerminal, ITerminalContribution, IXtermAttachToElementOptions } from './terminal.js';
import { TerminalExtensionsRegistry } from './terminalExtensions.js';
import { TerminalWidgetManager } from './widgets/widgetManager.js';
import { XtermTerminal } from './xterm/xtermTerminal.js';
import { IEnvironmentVariableInfo } from '../common/environmentVariable.js';
import { ITerminalProcessInfo, ProcessState } from '../common/terminal.js';

export class DetachedTerminal extends Disposable implements IDetachedTerminalInstance {
	private readonly _widgets = this._register(new TerminalWidgetManager());
	public readonly capabilities: ITerminalCapabilityStore;
	private readonly _contributions: Map<string, ITerminalContribution> = new Map();
	private readonly _attachDisposables = this._register(new MutableDisposable<DisposableStore>());

	public domElement?: HTMLElement;

	public get xterm(): IDetachedXtermTerminal {
		return this._xterm;
	}

	constructor(
		private readonly _xterm: XtermTerminal,
		options: IDetachedXTermOptions,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super();
		this.capabilities = this._register(new TerminalCapabilityStore());
		this._register(_xterm);

		// Initialize contributions
		const contributionDescs = TerminalExtensionsRegistry.getTerminalContributions();
		for (const desc of contributionDescs) {
			if (this._contributions.has(desc.id)) {
				onUnexpectedError(new Error(`Cannot have two terminal contributions with the same id ${desc.id}`));
				continue;
			}
			if (desc.canRunInDetachedTerminals === false) {
				continue;
			}

			let contribution: ITerminalContribution;
			try {
				contribution = instantiationService.createInstance(desc.ctor, {
					instance: this,
					processManager: options.processInfo,
					widgetManager: this._widgets
				});
				this._contributions.set(desc.id, contribution);
				this._register(contribution);
			} catch (err) {
				onUnexpectedError(err);
			}
		}

		// xterm is already by the time DetachedTerminal is created, so trigger everything
		// on the next microtask, allowing the caller to do any extra initialization
		this._register(new Delayer(MicrotaskDelay)).trigger(() => {
			for (const contr of this._contributions.values()) {
				contr.xtermReady?.(this._xterm);
			}
		});
	}

	get selection(): string | undefined {
		return this._xterm && this.hasSelection() ? this._xterm.raw.getSelection() : undefined;
	}

	hasSelection(): boolean {
		return this._xterm.hasSelection();
	}

	clearSelection(): void {
		this._xterm.clearSelection();
	}

	focus(force?: boolean): void {
		if (force || !dom.getActiveWindow().getSelection()?.toString()) {
			this.xterm.focus();
		}
	}

	attachToElement(container: HTMLElement, options?: Partial<IXtermAttachToElementOptions> | undefined): void {
		this.domElement = container;
		const screenElement = this._xterm.attachToElement(container, options);
		this._widgets.attachToElement(screenElement);

		const attachStore = new DisposableStore();
		const scheduleFocus = () => {
			// Defer so scrollable containers can handle focus first; ensures textarea focus sticks
			setTimeout(() => this.focus(true), 0);
		};
		attachStore.add(dom.addDisposableListener(container, dom.EventType.MOUSE_DOWN, scheduleFocus));
		this._attachDisposables.value = attachStore;
	}

	forceScrollbarVisibility(): void {
		this.domElement?.classList.add('force-scrollbar');
	}

	resetScrollbarVisibility(): void {
		this.domElement?.classList.remove('force-scrollbar');
	}

	getContribution<T extends ITerminalContribution>(id: string): T | null {
		return this._contributions.get(id) as T | null;
	}
}

/**
 * Implements {@link ITerminalProcessInfo} for a detached terminal where most
 * properties are stubbed. Properties are mutable and can be updated by
 * the instantiator.
 */
export class DetachedProcessInfo extends Disposable implements ITerminalProcessInfo {
	processState = ProcessState.Running;
	ptyProcessReady = Promise.resolve();
	shellProcessId: number | undefined;
	remoteAuthority: string | undefined;
	os: OperatingSystem | undefined;
	userHome: string | undefined;
	initialCwd = '';
	environmentVariableInfo: IEnvironmentVariableInfo | undefined;
	persistentProcessId: number | undefined;
	shouldPersist = false;
	hasWrittenData = false;
	hasChildProcesses = false;
	backend: ITerminalBackend | undefined;
	capabilities: ITerminalCapabilityStore;
	shellIntegrationNonce = '';
	extEnvironmentVariableCollection: IMergedEnvironmentVariableCollection | undefined;

	constructor(initialValues: Partial<ITerminalProcessInfo>) {
		super();
		Object.assign(this, initialValues);
		this.capabilities = this._register(new TerminalCapabilityStore());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/environmentVariableInfo.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/environmentVariableInfo.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IEnvironmentVariableInfo } from '../common/environmentVariable.js';
import { ITerminalStatus, ITerminalStatusHoverAction, TerminalCommandId } from '../common/terminal.js';
import { ITerminalService } from './terminal.js';
import { localize } from '../../../../nls.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { EnvironmentVariableScope, IExtensionOwnedEnvironmentVariableMutator, IMergedEnvironmentVariableCollection, IMergedEnvironmentVariableCollectionDiff } from '../../../../platform/terminal/common/environmentVariable.js';
import { TerminalStatus } from './terminalStatusList.js';
import Severity from '../../../../base/common/severity.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';

export class EnvironmentVariableInfoStale implements IEnvironmentVariableInfo {
	readonly requiresAction = true;

	constructor(
		private readonly _diff: IMergedEnvironmentVariableCollectionDiff,
		private readonly _terminalId: number,
		private readonly _collection: IMergedEnvironmentVariableCollection,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@IExtensionService private readonly _extensionService: IExtensionService
	) {
	}

	private _getInfo(scope: EnvironmentVariableScope | undefined): string {
		const extSet: Set<string> = new Set();
		addExtensionIdentifiers(extSet, this._diff.added.values());
		addExtensionIdentifiers(extSet, this._diff.removed.values());
		addExtensionIdentifiers(extSet, this._diff.changed.values());

		let message = localize('extensionEnvironmentContributionInfoStale', "The following extensions want to relaunch the terminal to contribute to its environment:");
		message += getMergedDescription(this._collection, scope, this._extensionService, extSet);
		return message;
	}

	private _getActions(): ITerminalStatusHoverAction[] {
		return [{
			label: localize('relaunchTerminalLabel', "Relaunch Terminal"),
			run: () => this._terminalService.getInstanceFromId(this._terminalId)?.relaunch(),
			commandId: TerminalCommandId.Relaunch
		}];
	}

	getStatus(scope: EnvironmentVariableScope | undefined): ITerminalStatus {
		return {
			id: TerminalStatus.RelaunchNeeded,
			severity: Severity.Warning,
			icon: Codicon.warning,
			tooltip: this._getInfo(scope),
			hoverActions: this._getActions()
		};
	}
}

export class EnvironmentVariableInfoChangesActive implements IEnvironmentVariableInfo {
	readonly requiresAction = false;

	constructor(
		private readonly _collection: IMergedEnvironmentVariableCollection,
		@ICommandService private readonly _commandService: ICommandService,
		@IExtensionService private readonly _extensionService: IExtensionService
	) {
	}

	private _getInfo(scope: EnvironmentVariableScope | undefined): string {
		const extSet: Set<string> = new Set();
		addExtensionIdentifiers(extSet, this._collection.getVariableMap(scope).values());

		let message = localize('extensionEnvironmentContributionInfoActive', "The following extensions have contributed to this terminal's environment:");
		message += getMergedDescription(this._collection, scope, this._extensionService, extSet);
		return message;
	}

	private _getActions(scope: EnvironmentVariableScope | undefined): ITerminalStatusHoverAction[] {
		return [{
			label: localize('showEnvironmentContributions', "Show Environment Contributions"),
			run: () => this._commandService.executeCommand(TerminalCommandId.ShowEnvironmentContributions, scope),
			commandId: TerminalCommandId.ShowEnvironmentContributions
		}];
	}

	getStatus(scope: EnvironmentVariableScope | undefined): ITerminalStatus {
		return {
			id: TerminalStatus.EnvironmentVariableInfoChangesActive,
			severity: Severity.Info,
			tooltip: undefined, // The action is present when details aren't shown
			detailedTooltip: this._getInfo(scope),
			hoverActions: this._getActions(scope)
		};
	}
}

function getMergedDescription(collection: IMergedEnvironmentVariableCollection, scope: EnvironmentVariableScope | undefined, extensionService: IExtensionService, extSet: Set<string>): string {
	const message = ['\n'];
	const globalDescriptions = collection.getDescriptionMap(undefined);
	const workspaceDescriptions = collection.getDescriptionMap(scope);
	for (const ext of extSet) {
		const globalDescription = globalDescriptions.get(ext);
		if (globalDescription) {
			message.push(`\n- \`${getExtensionName(ext, extensionService)}\``);
			message.push(`: ${globalDescription}`);
		}
		const workspaceDescription = workspaceDescriptions.get(ext);
		if (workspaceDescription) {
			// Only show '(workspace)' suffix if there is already a description for the extension.
			const workspaceSuffix = globalDescription ? ` (${localize('ScopedEnvironmentContributionInfo', 'workspace')})` : '';
			message.push(`\n- \`${getExtensionName(ext, extensionService)}${workspaceSuffix}\``);
			message.push(`: ${workspaceDescription}`);
		}
		if (!globalDescription && !workspaceDescription) {
			message.push(`\n- \`${getExtensionName(ext, extensionService)}\``);
		}
	}
	return message.join('');
}

function addExtensionIdentifiers(extSet: Set<string>, diff: IterableIterator<IExtensionOwnedEnvironmentVariableMutator[]>): void {
	for (const mutators of diff) {
		for (const mutator of mutators) {
			extSet.add(mutator.extensionIdentifier);
		}
	}
}

function getExtensionName(id: string, extensionService: IExtensionService): string {
	return extensionService.extensions.find(e => e.id === id)?.displayName || id;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/remotePty.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/remotePty.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Barrier } from '../../../../base/common/async.js';
import { ITerminalLaunchResult, IProcessPropertyMap, ITerminalChildProcess, ITerminalLaunchError, ITerminalLogService, ProcessPropertyType } from '../../../../platform/terminal/common/terminal.js';
import { BasePty } from '../common/basePty.js';
import { RemoteTerminalChannelClient } from '../common/remote/remoteTerminalChannel.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';
import { hasKey } from '../../../../base/common/types.js';

export class RemotePty extends BasePty implements ITerminalChildProcess {
	private readonly _startBarrier: Barrier;

	constructor(
		id: number,
		shouldPersist: boolean,
		private readonly _remoteTerminalChannel: RemoteTerminalChannelClient,
		@IRemoteAgentService private readonly _remoteAgentService: IRemoteAgentService,
		@ITerminalLogService private readonly _logService: ITerminalLogService
	) {
		super(id, shouldPersist);
		this._startBarrier = new Barrier();
	}

	async start(): Promise<ITerminalLaunchError | ITerminalLaunchResult | undefined> {
		// Fetch the environment to check shell permissions
		const env = await this._remoteAgentService.getEnvironment();
		if (!env) {
			// Extension host processes are only allowed in remote extension hosts currently
			throw new Error('Could not fetch remote environment');
		}

		this._logService.trace('Spawning remote agent process', { terminalId: this.id });

		const startResult = await this._remoteTerminalChannel.start(this.id);

		if (startResult && hasKey(startResult, { message: true })) {
			// An error occurred
			return startResult;
		}

		this._startBarrier.open();
		return startResult;
	}

	async detach(forcePersist?: boolean): Promise<void> {
		await this._startBarrier.wait();
		return this._remoteTerminalChannel.detachFromProcess(this.id, forcePersist);
	}

	shutdown(immediate: boolean): void {
		this._startBarrier.wait().then(_ => {
			this._remoteTerminalChannel.shutdown(this.id, immediate);
		});
	}

	input(data: string): void {
		if (this._inReplay) {
			return;
		}

		this._startBarrier.wait().then(_ => {
			this._remoteTerminalChannel.input(this.id, data);
		});
	}

	sendSignal(signal: string): void {
		if (this._inReplay) {
			return;
		}

		this._startBarrier.wait().then(_ => {
			this._remoteTerminalChannel.sendSignal(this.id, signal);
		});
	}

	processBinary(e: string): Promise<void> {
		return this._remoteTerminalChannel.processBinary(this.id, e);
	}

	resize(cols: number, rows: number): void {
		if (this._inReplay || this._lastDimensions.cols === cols && this._lastDimensions.rows === rows) {
			return;
		}
		this._startBarrier.wait().then(_ => {
			this._lastDimensions.cols = cols;
			this._lastDimensions.rows = rows;
			this._remoteTerminalChannel.resize(this.id, cols, rows);
		});
	}

	async clearBuffer(): Promise<void> {
		await this._remoteTerminalChannel.clearBuffer(this.id);
	}

	freePortKillProcess(port: string): Promise<{ port: string; processId: string }> {
		if (!this._remoteTerminalChannel.freePortKillProcess) {
			throw new Error('freePortKillProcess does not exist on the local pty service');
		}
		return this._remoteTerminalChannel.freePortKillProcess(port);
	}

	acknowledgeDataEvent(charCount: number): void {
		// Support flow control for server spawned processes
		if (this._inReplay) {
			return;
		}

		this._startBarrier.wait().then(_ => {
			this._remoteTerminalChannel.acknowledgeDataEvent(this.id, charCount);
		});
	}

	async setUnicodeVersion(version: '6' | '11'): Promise<void> {
		return this._remoteTerminalChannel.setUnicodeVersion(this.id, version);
	}

	async refreshProperty<T extends ProcessPropertyType>(type: T): Promise<IProcessPropertyMap[T]> {
		return this._remoteTerminalChannel.refreshProperty(this.id, type);
	}

	async updateProperty<T extends ProcessPropertyType>(type: T, value: IProcessPropertyMap[T]): Promise<void> {
		return this._remoteTerminalChannel.updateProperty(this.id, type, value);
	}

	handleOrphanQuestion() {
		this._remoteTerminalChannel.orphanQuestionReply(this.id);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/remoteTerminalBackend.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/remoteTerminalBackend.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DeferredPromise } from '../../../../base/common/async.js';
import { Emitter } from '../../../../base/common/event.js';
import { revive } from '../../../../base/common/marshalling.js';
import { PerformanceMark, mark } from '../../../../base/common/performance.js';
import { IProcessEnvironment, OperatingSystem } from '../../../../base/common/platform.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IRemoteAuthorityResolverService } from '../../../../platform/remote/common/remoteAuthorityResolver.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ISerializedTerminalCommand } from '../../../../platform/terminal/common/capabilities/capabilities.js';
import { IPtyHostLatencyMeasurement, IShellLaunchConfig, IShellLaunchConfigDto, ITerminalBackend, ITerminalBackendRegistry, ITerminalChildProcess, ITerminalEnvironment, ITerminalLogService, ITerminalProcessOptions, ITerminalProfile, ITerminalsLayoutInfo, ITerminalsLayoutInfoById, ProcessPropertyType, TerminalExtensions, TerminalIcon, TerminalSettingId, TitleEventSource, type IProcessPropertyMap } from '../../../../platform/terminal/common/terminal.js';
import { IProcessDetails } from '../../../../platform/terminal/common/terminalProcess.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { BaseTerminalBackend } from './baseTerminalBackend.js';
import { RemotePty } from './remotePty.js';
import { ITerminalInstanceService } from './terminal.js';
import { RemoteTerminalChannelClient, REMOTE_TERMINAL_CHANNEL_NAME } from '../common/remote/remoteTerminalChannel.js';
import { ICompleteTerminalConfiguration, ITerminalConfiguration, TERMINAL_CONFIG_SECTION } from '../common/terminal.js';
import { TerminalStorageKeys } from '../common/terminalStorageKeys.js';
import { IConfigurationResolverService } from '../../../services/configurationResolver/common/configurationResolver.js';
import { IHistoryService } from '../../../services/history/common/history.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';
import { IStatusbarService } from '../../../services/statusbar/browser/statusbar.js';

export class RemoteTerminalBackendContribution implements IWorkbenchContribution {
	static ID = 'remoteTerminalBackend';

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@ITerminalInstanceService terminalInstanceService: ITerminalInstanceService
	) {
		const connection = remoteAgentService.getConnection();
		if (connection?.remoteAuthority) {
			const channel = instantiationService.createInstance(RemoteTerminalChannelClient, connection.remoteAuthority, connection.getChannel(REMOTE_TERMINAL_CHANNEL_NAME));
			const backend = instantiationService.createInstance(RemoteTerminalBackend, connection.remoteAuthority, channel);
			Registry.as<ITerminalBackendRegistry>(TerminalExtensions.Backend).registerTerminalBackend(backend);
			terminalInstanceService.didRegisterBackend(backend);
		}
	}
}

class RemoteTerminalBackend extends BaseTerminalBackend implements ITerminalBackend {
	private readonly _ptys: Map<number, RemotePty> = new Map();

	private readonly _whenConnected = new DeferredPromise<void>();
	get whenReady(): Promise<void> { return this._whenConnected.p; }
	setReady(): void { this._whenConnected.complete(); }

	private readonly _onDidRequestDetach = this._register(new Emitter<{ requestId: number; workspaceId: string; instanceId: number }>());
	readonly onDidRequestDetach = this._onDidRequestDetach.event;
	private readonly _onRestoreCommands = this._register(new Emitter<{ id: number; commands: ISerializedTerminalCommand[] }>());
	readonly onRestoreCommands = this._onRestoreCommands.event;

	constructor(
		readonly remoteAuthority: string | undefined,
		private readonly _remoteTerminalChannel: RemoteTerminalChannelClient,
		@IRemoteAgentService private readonly _remoteAgentService: IRemoteAgentService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ITerminalLogService logService: ITerminalLogService,
		@ICommandService private readonly _commandService: ICommandService,
		@IStorageService private readonly _storageService: IStorageService,
		@IRemoteAuthorityResolverService private readonly _remoteAuthorityResolverService: IRemoteAuthorityResolverService,
		@IWorkspaceContextService workspaceContextService: IWorkspaceContextService,
		@IConfigurationResolverService configurationResolverService: IConfigurationResolverService,
		@IHistoryService private readonly _historyService: IHistoryService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IStatusbarService statusBarService: IStatusbarService
	) {
		super(_remoteTerminalChannel, logService, _historyService, configurationResolverService, statusBarService, workspaceContextService);

		this._remoteTerminalChannel.onProcessData(e => this._ptys.get(e.id)?.handleData(e.event));
		this._remoteTerminalChannel.onProcessReplay(e => {
			this._ptys.get(e.id)?.handleReplay(e.event);
			if (e.event.commands.commands.length > 0) {
				this._onRestoreCommands.fire({ id: e.id, commands: e.event.commands.commands });
			}
		});
		this._remoteTerminalChannel.onProcessOrphanQuestion(e => this._ptys.get(e.id)?.handleOrphanQuestion());
		this._remoteTerminalChannel.onDidRequestDetach(e => this._onDidRequestDetach.fire(e));
		this._remoteTerminalChannel.onProcessReady(e => this._ptys.get(e.id)?.handleReady(e.event));
		this._remoteTerminalChannel.onDidChangeProperty(e => this._ptys.get(e.id)?.handleDidChangeProperty(e.property));
		this._remoteTerminalChannel.onProcessExit(e => {
			const pty = this._ptys.get(e.id);
			if (pty) {
				pty.handleExit(e.event);
				pty.dispose();
				this._ptys.delete(e.id);
			}
		});

		const allowedCommands = ['_remoteCLI.openExternal', '_remoteCLI.windowOpen', '_remoteCLI.getSystemStatus', '_remoteCLI.manageExtensions'];
		this._remoteTerminalChannel.onExecuteCommand(async e => {
			// Ensure this request for for this window
			const pty = this._ptys.get(e.persistentProcessId);
			if (!pty) {
				return;
			}
			const reqId = e.reqId;
			const commandId = e.commandId;
			if (!allowedCommands.includes(commandId)) {
				this._remoteTerminalChannel.sendCommandResult(reqId, true, 'Invalid remote cli command: ' + commandId);
				return;
			}
			const commandArgs = e.commandArgs.map(arg => revive(arg));
			try {
				const result = await this._commandService.executeCommand(e.commandId, ...commandArgs);
				this._remoteTerminalChannel.sendCommandResult(reqId, false, result);
			} catch (err) {
				this._remoteTerminalChannel.sendCommandResult(reqId, true, err);
			}
		});

		this._onPtyHostConnected.fire();
	}

	async requestDetachInstance(workspaceId: string, instanceId: number): Promise<IProcessDetails | undefined> {
		if (!this._remoteTerminalChannel) {
			throw new Error(`Cannot request detach instance when there is no remote!`);
		}
		return this._remoteTerminalChannel.requestDetachInstance(workspaceId, instanceId);
	}

	async acceptDetachInstanceReply(requestId: number, persistentProcessId?: number): Promise<void> {
		if (!this._remoteTerminalChannel) {
			throw new Error(`Cannot accept detached instance when there is no remote!`);
		} else if (!persistentProcessId) {
			this._logService.warn('Cannot attach to feature terminals, custom pty terminals, or those without a persistentProcessId');
			return;
		}

		return this._remoteTerminalChannel.acceptDetachInstanceReply(requestId, persistentProcessId);
	}

	async persistTerminalState(): Promise<void> {
		if (!this._remoteTerminalChannel) {
			throw new Error(`Cannot persist terminal state when there is no remote!`);
		}
		const ids = Array.from(this._ptys.keys());
		const serialized = await this._remoteTerminalChannel.serializeTerminalState(ids);
		this._storageService.store(TerminalStorageKeys.TerminalBufferState, serialized, StorageScope.WORKSPACE, StorageTarget.MACHINE);
	}

	async createProcess(
		shellLaunchConfig: IShellLaunchConfig,
		cwd: string, // TODO: This is ignored
		cols: number,
		rows: number,
		unicodeVersion: '6' | '11',
		env: IProcessEnvironment, // TODO: This is ignored
		options: ITerminalProcessOptions,
		shouldPersist: boolean
	): Promise<ITerminalChildProcess> {
		if (!this._remoteTerminalChannel) {
			throw new Error(`Cannot create remote terminal when there is no remote!`);
		}

		// Fetch the environment to check shell permissions
		const remoteEnv = await this._remoteAgentService.getEnvironment();
		if (!remoteEnv) {
			// Extension host processes are only allowed in remote extension hosts currently
			throw new Error('Could not fetch remote environment');
		}

		const terminalConfig = this._configurationService.getValue<ITerminalConfiguration>(TERMINAL_CONFIG_SECTION);
		const configuration: ICompleteTerminalConfiguration = {
			'terminal.integrated.env.windows': this._configurationService.getValue(TerminalSettingId.EnvWindows) as ITerminalEnvironment,
			'terminal.integrated.env.osx': this._configurationService.getValue(TerminalSettingId.EnvMacOs) as ITerminalEnvironment,
			'terminal.integrated.env.linux': this._configurationService.getValue(TerminalSettingId.EnvLinux) as ITerminalEnvironment,
			'terminal.integrated.cwd': this._configurationService.getValue(TerminalSettingId.Cwd) as string,
			'terminal.integrated.detectLocale': terminalConfig.detectLocale
		};

		const shellLaunchConfigDto: IShellLaunchConfigDto = {
			name: shellLaunchConfig.name,
			executable: shellLaunchConfig.executable,
			args: shellLaunchConfig.args,
			cwd: shellLaunchConfig.cwd,
			env: shellLaunchConfig.env,
			useShellEnvironment: shellLaunchConfig.useShellEnvironment,
			reconnectionProperties: shellLaunchConfig.reconnectionProperties,
			type: shellLaunchConfig.type,
			isFeatureTerminal: shellLaunchConfig.isFeatureTerminal,
			tabActions: shellLaunchConfig.tabActions,
			shellIntegrationEnvironmentReporting: shellLaunchConfig.shellIntegrationEnvironmentReporting,
		};
		const activeWorkspaceRootUri = this._historyService.getLastActiveWorkspaceRoot();

		const result = await this._remoteTerminalChannel.createProcess(
			shellLaunchConfigDto,
			configuration,
			activeWorkspaceRootUri,
			options,
			shouldPersist,
			cols,
			rows,
			unicodeVersion
		);
		const pty = this._instantiationService.createInstance(RemotePty, result.persistentTerminalId, shouldPersist, this._remoteTerminalChannel);
		this._ptys.set(result.persistentTerminalId, pty);
		return pty;
	}

	async attachToProcess(id: number): Promise<ITerminalChildProcess | undefined> {
		if (!this._remoteTerminalChannel) {
			throw new Error(`Cannot create remote terminal when there is no remote!`);
		}

		try {
			await this._remoteTerminalChannel.attachToProcess(id);
			const pty = this._instantiationService.createInstance(RemotePty, id, true, this._remoteTerminalChannel);
			this._ptys.set(id, pty);
			return pty;
		} catch (e) {
			this._logService.trace(`Couldn't attach to process ${e.message}`);
		}
		return undefined;
	}

	async attachToRevivedProcess(id: number): Promise<ITerminalChildProcess | undefined> {
		if (!this._remoteTerminalChannel) {
			throw new Error(`Cannot create remote terminal when there is no remote!`);
		}

		try {
			const newId = await this._remoteTerminalChannel.getRevivedPtyNewId(id) ?? id;
			return await this.attachToProcess(newId);
		} catch (e) {
			this._logService.trace(`Couldn't attach to process ${e.message}`);
		}
		return undefined;
	}

	async listProcesses(): Promise<IProcessDetails[]> {
		return this._remoteTerminalChannel.listProcesses();
	}

	async getLatency(): Promise<IPtyHostLatencyMeasurement[]> {
		const sw = new StopWatch();
		const results = await this._remoteTerminalChannel.getLatency();
		sw.stop();
		return [
			{
				label: 'window<->ptyhostservice<->ptyhost',
				latency: sw.elapsed()
			},
			...results
		];
	}

	async updateProperty<T extends ProcessPropertyType>(id: number, property: T, value: IProcessPropertyMap[T]): Promise<void> {
		await this._remoteTerminalChannel.updateProperty(id, property, value);
	}

	async updateTitle(id: number, title: string, titleSource: TitleEventSource): Promise<void> {
		await this._remoteTerminalChannel.updateTitle(id, title, titleSource);
	}

	async updateIcon(id: number, userInitiated: boolean, icon: TerminalIcon, color?: string): Promise<void> {
		await this._remoteTerminalChannel.updateIcon(id, userInitiated, icon, color);
	}

	async setNextCommandId(id: number, commandLine: string, commandId: string): Promise<void> {
		await this._remoteTerminalChannel.setNextCommandId(id, commandLine, commandId);
	}

	async getDefaultSystemShell(osOverride?: OperatingSystem): Promise<string> {
		return this._remoteTerminalChannel.getDefaultSystemShell(osOverride) || '';
	}

	async getProfiles(profiles: unknown, defaultProfile: unknown, includeDetectedProfiles?: boolean): Promise<ITerminalProfile[]> {
		return this._remoteTerminalChannel.getProfiles(profiles, defaultProfile, includeDetectedProfiles) || [];
	}

	async getEnvironment(): Promise<IProcessEnvironment> {
		return this._remoteTerminalChannel.getEnvironment() || {};
	}

	async getShellEnvironment(): Promise<IProcessEnvironment | undefined> {
		const connection = this._remoteAgentService.getConnection();
		if (!connection) {
			return undefined;
		}
		const resolverResult = await this._remoteAuthorityResolverService.resolveAuthority(connection.remoteAuthority);
		const envResult: IProcessEnvironment = {};
		if (resolverResult.options?.extensionHostEnv) {
			for (const [key, value] of Object.entries(resolverResult.options.extensionHostEnv)) {
				if (value !== null) {
					envResult[key] = value;
				}
			}
		}
		return envResult;
	}

	async getWslPath(original: string, direction: 'unix-to-win' | 'win-to-unix'): Promise<string> {
		const env = await this._remoteAgentService.getEnvironment();
		if (env?.os !== OperatingSystem.Windows) {
			return original;
		}
		return this._remoteTerminalChannel.getWslPath(original, direction) || original;
	}

	async setTerminalLayoutInfo(layout?: ITerminalsLayoutInfoById): Promise<void> {
		if (!this._remoteTerminalChannel) {
			throw new Error(`Cannot call setActiveInstanceId when there is no remote`);
		}

		return this._remoteTerminalChannel.setTerminalLayoutInfo(layout);
	}

	async reduceConnectionGraceTime(): Promise<void> {
		if (!this._remoteTerminalChannel) {
			throw new Error('Cannot reduce grace time when there is no remote');
		}
		return this._remoteTerminalChannel.reduceConnectionGraceTime();
	}

	async getTerminalLayoutInfo(): Promise<ITerminalsLayoutInfo | undefined> {
		if (!this._remoteTerminalChannel) {
			throw new Error(`Cannot call getActiveInstanceId when there is no remote`);
		}

		const workspaceId = this._getWorkspaceId();

		// Revive processes if needed
		const serializedState = this._storageService.get(TerminalStorageKeys.TerminalBufferState, StorageScope.WORKSPACE);
		const reviveBufferState = this._deserializeTerminalState(serializedState);
		if (reviveBufferState && reviveBufferState.length > 0) {
			try {
				// Note that remote terminals do not get their environment re-resolved unlike in local terminals

				mark('code/terminal/willReviveTerminalProcessesRemote');
				await this._remoteTerminalChannel.reviveTerminalProcesses(workspaceId, reviveBufferState, Intl.DateTimeFormat().resolvedOptions().locale);
				mark('code/terminal/didReviveTerminalProcessesRemote');
				this._storageService.remove(TerminalStorageKeys.TerminalBufferState, StorageScope.WORKSPACE);
				// If reviving processes, send the terminal layout info back to the pty host as it
				// will not have been persisted on application exit
				const layoutInfo = this._storageService.get(TerminalStorageKeys.TerminalLayoutInfo, StorageScope.WORKSPACE);
				if (layoutInfo) {
					mark('code/terminal/willSetTerminalLayoutInfoRemote');
					await this._remoteTerminalChannel.setTerminalLayoutInfo(JSON.parse(layoutInfo));
					mark('code/terminal/didSetTerminalLayoutInfoRemote');
					this._storageService.remove(TerminalStorageKeys.TerminalLayoutInfo, StorageScope.WORKSPACE);
				}
			} catch (e: unknown) {
				this._logService.warn('RemoteTerminalBackend#getTerminalLayoutInfo Error', (<{ message?: string }>e).message ?? e);
			}
		}

		return this._remoteTerminalChannel.getTerminalLayoutInfo();
	}

	async getPerformanceMarks(): Promise<PerformanceMark[]> {
		return this._remoteTerminalChannel.getPerformanceMarks();
	}

	installAutoReply(match: string, reply: string): Promise<void> {
		return this._remoteTerminalChannel.installAutoReply(match, reply);
	}

	uninstallAllAutoReplies(): Promise<void> {
		return this._remoteTerminalChannel.uninstallAllAutoReplies();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminal.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminal.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getFontSnippets } from '../../../../base/browser/fonts.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import * as nls from '../../../../nls.js';
import { Extensions as DragAndDropExtensions, IDragAndDropContributionRegistry, IDraggedResourceEditorInput } from '../../../../platform/dnd/browser/dnd.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ITerminalLogService } from '../../../../platform/terminal/common/terminal.js';
import { TerminalLogService } from '../../../../platform/terminal/common/terminalLogService.js';
import { registerTerminalPlatformConfiguration } from '../../../../platform/terminal/common/terminalPlatformConfiguration.js';
import { EditorPaneDescriptor, IEditorPaneRegistry } from '../../../browser/editor.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';
import { WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { EditorExtensions, IEditorFactoryRegistry } from '../../../common/editor.js';
import { IViewContainersRegistry, IViewsRegistry, Extensions as ViewContainerExtensions, ViewContainerLocation } from '../../../common/views.js';
import { ITerminalProfileService, TERMINAL_VIEW_ID, TerminalCommandId } from '../common/terminal.js';
import { TerminalEditingService } from './terminalEditingService.js';
import { registerColors } from '../common/terminalColorRegistry.js';
import { registerTerminalConfiguration } from '../common/terminalConfiguration.js';
import { terminalStrings } from '../common/terminalStrings.js';
import './media/terminal.css';
import './media/terminalVoice.css';
import './media/widgets.css';
import './media/xterm.css';
import { RemoteTerminalBackendContribution } from './remoteTerminalBackend.js';
import { ITerminalConfigurationService, ITerminalEditingService, ITerminalEditorService, ITerminalGroupService, ITerminalInstanceService, ITerminalService, TerminalDataTransfers, terminalEditorId } from './terminal.js';
import { registerTerminalActions } from './terminalActions.js';
import { setupTerminalCommands } from './terminalCommands.js';
import { TerminalConfigurationService } from './terminalConfigurationService.js';
import { TerminalEditor } from './terminalEditor.js';
import { TerminalEditorInput } from './terminalEditorInput.js';
import { TerminalInputSerializer } from './terminalEditorSerializer.js';
import { TerminalEditorService } from './terminalEditorService.js';
import { TerminalGroupService } from './terminalGroupService.js';
import { terminalViewIcon } from './terminalIcons.js';
import { TerminalInstanceService } from './terminalInstanceService.js';
import { TerminalMainContribution } from './terminalMainContribution.js';
import { setupTerminalMenus } from './terminalMenus.js';
import { TerminalProfileService } from './terminalProfileService.js';
import { TerminalService } from './terminalService.js';
import { TerminalTelemetryContribution } from './terminalTelemetry.js';
import { TerminalViewPane } from './terminalView.js';

// Register services
registerSingleton(ITerminalLogService, TerminalLogService, InstantiationType.Delayed);
registerSingleton(ITerminalConfigurationService, TerminalConfigurationService, InstantiationType.Delayed);
registerSingleton(ITerminalService, TerminalService, InstantiationType.Delayed);
registerSingleton(ITerminalEditorService, TerminalEditorService, InstantiationType.Delayed);
registerSingleton(ITerminalEditingService, TerminalEditingService, InstantiationType.Delayed);
registerSingleton(ITerminalGroupService, TerminalGroupService, InstantiationType.Delayed);
registerSingleton(ITerminalInstanceService, TerminalInstanceService, InstantiationType.Delayed);
registerSingleton(ITerminalProfileService, TerminalProfileService, InstantiationType.Delayed);

// Register workbench contributions
// This contribution blocks startup as it's critical to enable the web embedder window.createTerminal API
registerWorkbenchContribution2(TerminalMainContribution.ID, TerminalMainContribution, WorkbenchPhase.BlockStartup);
registerWorkbenchContribution2(RemoteTerminalBackendContribution.ID, RemoteTerminalBackendContribution, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(TerminalTelemetryContribution.ID, TerminalTelemetryContribution, WorkbenchPhase.AfterRestored);

// Register configurations
registerTerminalPlatformConfiguration();
registerTerminalConfiguration(getFontSnippets);

// Register editor/dnd contributions
Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(TerminalEditorInput.ID, TerminalInputSerializer);
Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		TerminalEditor,
		terminalEditorId,
		terminalStrings.terminal
	),
	[
		new SyncDescriptor(TerminalEditorInput)
	]
);
Registry.as<IDragAndDropContributionRegistry>(DragAndDropExtensions.DragAndDropContribution).register({
	dataFormatKey: TerminalDataTransfers.Terminals,
	getEditorInputs(data) {
		const editors: IDraggedResourceEditorInput[] = [];
		try {
			const terminalEditors: string[] = JSON.parse(data);
			for (const terminalEditor of terminalEditors) {
				editors.push({ resource: URI.parse(terminalEditor) });
			}
		} catch (error) {
			// Invalid transfer
		}
		return editors;
	},
	setData(resources, event) {
		const terminalResources = resources.filter(({ resource }) => resource.scheme === Schemas.vscodeTerminal);
		if (terminalResources.length) {
			event.dataTransfer?.setData(TerminalDataTransfers.Terminals, JSON.stringify(terminalResources.map(({ resource }) => resource.toString())));
		}
	}
});

// Register views
const VIEW_CONTAINER = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry).registerViewContainer({
	id: TERMINAL_VIEW_ID,
	title: nls.localize2('terminal', "Terminal"),
	icon: terminalViewIcon,
	ctorDescriptor: new SyncDescriptor(ViewPaneContainer, [TERMINAL_VIEW_ID, { mergeViewWithContainerWhenSingleView: true }]),
	storageId: TERMINAL_VIEW_ID,
	hideIfEmpty: true,
	order: 3,
}, ViewContainerLocation.Panel, { doNotRegisterOpenCommand: true, isDefault: true });
Registry.as<IViewsRegistry>(ViewContainerExtensions.ViewsRegistry).registerViews([{
	id: TERMINAL_VIEW_ID,
	name: nls.localize2('terminal', "Terminal"),
	containerIcon: terminalViewIcon,
	canToggleVisibility: true,
	canMoveView: true,
	ctorDescriptor: new SyncDescriptor(TerminalViewPane),
	openCommandActionDescriptor: {
		id: TerminalCommandId.Toggle,
		mnemonicTitle: nls.localize({ key: 'miToggleIntegratedTerminal', comment: ['&& denotes a mnemonic'] }, "&&Terminal"),
		keybindings: {
			primary: KeyMod.CtrlCmd | KeyCode.Backquote,
			mac: { primary: KeyMod.WinCtrl | KeyCode.Backquote }
		},
		order: 3
	}
}], VIEW_CONTAINER);

registerTerminalActions();

setupTerminalCommands();

setupTerminalMenus();

registerColors();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminal.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminal.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDimension } from '../../../../base/browser/dom.js';
import { Orientation } from '../../../../base/browser/ui/splitview/splitview.js';
import { Color } from '../../../../base/common/color.js';
import { Event, IDynamicListEventMultiplexer, type DynamicListEventMultiplexer } from '../../../../base/common/event.js';
import { DisposableStore, IDisposable, type IReference } from '../../../../base/common/lifecycle.js';
import { OperatingSystem } from '../../../../base/common/platform.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeyMods } from '../../../../platform/quickinput/common/quickInput.js';
import { IMarkProperties, ITerminalCapabilityImplMap, ITerminalCapabilityStore, ITerminalCommand, TerminalCapability } from '../../../../platform/terminal/common/capabilities/capabilities.js';
import { IMergedEnvironmentVariableCollection } from '../../../../platform/terminal/common/environmentVariable.js';
import { IExtensionTerminalProfile, IReconnectionProperties, IShellIntegration, IShellLaunchConfig, ITerminalBackend, ITerminalDimensions, ITerminalLaunchError, ITerminalProfile, ITerminalTabLayoutInfoById, TerminalExitReason, TerminalIcon, TerminalLocation, TerminalShellType, TerminalType, TitleEventSource, WaitOnExitValue, type IDecorationAddon, type ShellIntegrationInjectionFailureReason } from '../../../../platform/terminal/common/terminal.js';
import { IColorTheme } from '../../../../platform/theme/common/themeService.js';
import { IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IEditableData } from '../../../common/views.js';
import { ITerminalStatusList } from './terminalStatusList.js';
import { XtermTerminal } from './xterm/xtermTerminal.js';
import { IRegisterContributedProfileArgs, IRemoteTerminalAttachTarget, IStartExtensionTerminalRequest, ITerminalConfiguration, ITerminalFont, ITerminalProcessExtHostProxy, ITerminalProcessInfo } from '../common/terminal.js';
import type { IMarker, ITheme, Terminal as RawXtermTerminal, IBufferRange, IMarker as IXtermMarker } from '@xterm/xterm';
import { ScrollPosition } from './xterm/markNavigationAddon.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { GroupIdentifier } from '../../../common/editor.js';
import { ACTIVE_GROUP_TYPE, AUX_WINDOW_GROUP_TYPE, SIDE_GROUP_TYPE } from '../../../services/editor/common/editorService.js';
import type { ICurrentPartialCommand } from '../../../../platform/terminal/common/capabilities/commandDetection/terminalCommand.js';
import type { IXtermCore } from './xterm-private.js';
import type { IMenu } from '../../../../platform/actions/common/actions.js';
import type { IProgressState } from '@xterm/addon-progress';
import type { IEditorOptions } from '../../../../platform/editor/common/editor.js';
import type { TerminalEditorInput } from './terminalEditorInput.js';
import type { MaybePromise } from '../../../../base/common/async.js';
import { isNumber, type SingleOrMany } from '../../../../base/common/types.js';

export const ITerminalService = createDecorator<ITerminalService>('terminalService');
export const ITerminalConfigurationService = createDecorator<ITerminalConfigurationService>('terminalConfigurationService');
export const ITerminalEditorService = createDecorator<ITerminalEditorService>('terminalEditorService');
export const ITerminalEditingService = createDecorator<ITerminalEditingService>('terminalEditingService');
export const ITerminalGroupService = createDecorator<ITerminalGroupService>('terminalGroupService');
export const ITerminalInstanceService = createDecorator<ITerminalInstanceService>('terminalInstanceService');
export const ITerminalChatService = createDecorator<ITerminalChatService>('terminalChatService');

/**
 * A terminal contribution that gets created whenever a terminal is created. A contribution has
 * access to the process manager through the constructor and provides a method for when xterm.js has
 * been initialized.
 */
export interface ITerminalContribution extends IDisposable {
	layout?(xterm: IXtermTerminal & { raw: RawXtermTerminal }, dimension: IDimension): void;
	xtermOpen?(xterm: IXtermTerminal & { raw: RawXtermTerminal }): void;
	xtermReady?(xterm: IXtermTerminal & { raw: RawXtermTerminal }): void;

	handleMouseEvent?(event: MouseEvent): MaybePromise<{ handled: boolean } | void>;
}

/**
 * A service used to create instances or fetch backends, this services allows services that
 * ITerminalService depends on to also create instances.
 *
 * **This service is intended to only be used within the terminal contrib.**
 */
export interface ITerminalInstanceService {
	readonly _serviceBrand: undefined;

	/**
	 * An event that's fired when a terminal instance is created.
	 */
	readonly onDidCreateInstance: Event<ITerminalInstance>;

	/**
	 * An event that's fired when a new backend is registered.
	 */
	readonly onDidRegisterBackend: Event<ITerminalBackend>;

	/**
	 * Helper function to convert a shell launch config, a profile or undefined into its equivalent
	 * shell launch config.
	 * @param shellLaunchConfigOrProfile A shell launch config, a profile or undefined
	 * @param cwd A cwd to override.
	 */
	convertProfileToShellLaunchConfig(shellLaunchConfigOrProfile?: IShellLaunchConfig | ITerminalProfile, cwd?: string | URI): IShellLaunchConfig;

	/**
	 * Create a new terminal instance.
	 * @param launchConfig The shell launch config.
	 * @param target The target of the terminal.
	 */
	createInstance(launchConfig: IShellLaunchConfig, target: TerminalLocation, editorOptions?: TerminalEditorLocation): ITerminalInstance;

	/**
	 * Gets the registered backend for a remote authority (undefined = local). This is a convenience
	 * method to avoid using the more verbose fetching from the registry.
	 * @param remoteAuthority The remote authority of the backend.
	 */
	getBackend(remoteAuthority?: string): Promise<ITerminalBackend | undefined>;

	getRegisteredBackends(): IterableIterator<ITerminalBackend>;
	didRegisterBackend(backend: ITerminalBackend): void;
}

/**
 * Service enabling communication between the chat tool implementation in terminal contrib and workbench contribs.
 * Acts as a communication mechanism for chat-related terminal features.
 */
export interface IChatTerminalToolProgressPart {
	readonly elementIndex: number;
	readonly contentIndex: number;
	focusTerminal(): Promise<void>;
	toggleOutputFromKeyboard(): Promise<void>;
	focusOutput(): void;
	getCommandAndOutputAsText(): string | undefined;
}

export interface ITerminalChatService {
	readonly _serviceBrand: undefined;

	/**
	 * Fired when a terminal instance is registered for a tool session id. This can happen after
	 * the chat UI first renders, enabling late binding of the focus action.
	 */
	readonly onDidRegisterTerminalInstanceWithToolSession: Event<ITerminalInstance>;

	/**
	 * Associate a tool session id with a terminal instance. The association is automatically
	 * cleared when the instance is disposed.
	 */
	registerTerminalInstanceWithToolSession(terminalToolSessionId: string | undefined, instance: ITerminalInstance): void;

	/**
	 * Resolve a terminal instance by its tool session id.
	 * @param terminalToolSessionId The tool session id provided in toolSpecificData.
	 * If no tool session ID is provided, we do nothing.
	 */
	getTerminalInstanceByToolSessionId(terminalToolSessionId: string): Promise<ITerminalInstance | undefined>;

	/**
	 * Returns the list of terminal instances that have been registered with a tool session id.
	 * This is used for surfacing tool-driven/background terminals in UI (eg. quick picks).
	 */
	getToolSessionTerminalInstances(hiddenOnly?: boolean): readonly ITerminalInstance[];

	/**
	 * Returns the tool session ID for a given terminal instance, if it has been registered.
	 * @param instance The terminal instance to look up
	 * @returns The tool session ID if found, undefined otherwise
	 */
	getToolSessionIdForInstance(instance: ITerminalInstance): string | undefined;

	/**
	 * Associate a chat session ID with a terminal instance. This is used to retrieve the chat
	 * session title for display purposes.
	 * @param chatSessionId The chat session ID
	 * @param instance The terminal instance
	 */
	registerTerminalInstanceWithChatSession(chatSessionId: string, instance: ITerminalInstance): void;

	/**
	 * Returns the chat session ID for a given terminal instance, if it has been registered.
	 * @param instance The terminal instance to look up
	 * @returns The chat session ID if found, undefined otherwise
	 */
	getChatSessionIdForInstance(instance: ITerminalInstance): string | undefined;

	/**
	 * Check if a terminal is a background terminal (tool-driven terminal that may be hidden from
	 * normal UI).
	 * @param terminalToolSessionId The tool session ID to check, if provided
	 * @returns True if the terminal is a background terminal, false otherwise
	 */
	isBackgroundTerminal(terminalToolSessionId?: string): boolean;

	/**
	 * Register a chat terminal tool progress part for tracking and focus management.
	 * @param part The progress part to register
	 * @returns A disposable that unregisters the progress part when disposed
	 */
	registerProgressPart(part: IChatTerminalToolProgressPart): IDisposable;

	/**
	 * Set the currently focused progress part.
	 * @param part The progress part to focus
	 */
	setFocusedProgressPart(part: IChatTerminalToolProgressPart): void;

	/**
	 * Clear the focused state from a progress part.
	 * @param part The progress part to clear focus from
	 */
	clearFocusedProgressPart(part: IChatTerminalToolProgressPart): void;

	/**
	 * Get the currently focused progress part, if any.
	 * @returns The focused progress part or undefined if none is focused
	 */
	getFocusedProgressPart(): IChatTerminalToolProgressPart | undefined;

	/**
	 * Get the most recently registered progress part, if any.
	 * @returns The most recent progress part or undefined if none exist
	 */
	getMostRecentProgressPart(): IChatTerminalToolProgressPart | undefined;

	/**
	 * Enable or disable auto approval for all commands in a specific session.
	 * @param chatSessionId The chat session ID
	 * @param enabled Whether to enable or disable session auto approval
	 */
	setChatSessionAutoApproval(chatSessionId: string, enabled: boolean): void;

	/**
	 * Check if a session has auto approval enabled for all commands.
	 * @param chatSessionId The chat session ID
	 * @returns True if the session has auto approval enabled
	 */
	hasChatSessionAutoApproval(chatSessionId: string): boolean;
}

/**
 * A service responsible for managing terminal editing state and functionality. This includes
 * tracking which terminal is currently being edited and managing editable data associated with
 * terminal instances.
 */
export interface ITerminalEditingService {
	readonly _serviceBrand: undefined;

	/**
	 * Get the editable data for a terminal instance.
	 * @param instance The terminal instance.
	 * @returns The editable data if the instance is editable, undefined otherwise.
	 */
	getEditableData(instance: ITerminalInstance): IEditableData | undefined;

	/**
	 * Set the editable data for a terminal instance.
	 * @param instance The terminal instance.
	 * @param data The editable data to set, or null to clear.
	 */
	setEditable(instance: ITerminalInstance, data: IEditableData | null): void;

	/**
	 * Check if a terminal instance is currently editable.
	 * @param instance The terminal instance to check.
	 * @returns True if the instance is editable, false otherwise.
	 */
	isEditable(instance: ITerminalInstance | undefined): boolean;

	/**
	 * Get the terminal instance that is currently being edited.
	 * @returns The terminal instance being edited, or undefined if none.
	 */
	getEditingTerminal(): ITerminalInstance | undefined;

	/**
	 * Set the terminal instance that is currently being edited.
	 * @param instance The terminal instance to set as editing, or undefined to clear.
	 */
	setEditingTerminal(instance: ITerminalInstance | undefined): void;
}

export const enum Direction {
	Left = 0,
	Right = 1,
	Up = 2,
	Down = 3
}

export interface IQuickPickTerminalObject {
	config: IRegisterContributedProfileArgs | ITerminalProfile | { profile: IExtensionTerminalProfile; options: { icon?: string; color?: string } } | undefined;
	keyMods: IKeyMods | undefined;
}

export interface IMarkTracker {
	scrollToPreviousMark(scrollPosition?: ScrollPosition, retainSelection?: boolean, skipEmptyCommands?: boolean): void;
	scrollToNextMark(): void;
	selectToPreviousMark(): void;
	selectToNextMark(): void;
	selectToPreviousLine(): void;
	selectToNextLine(): void;
	clear(): void;
	scrollToClosestMarker(startMarkerId: string, endMarkerId?: string, highlight?: boolean | undefined): void;

	scrollToLine(line: number, position: ScrollPosition): void;
	revealCommand(command: ITerminalCommand | ICurrentPartialCommand | URI, position?: ScrollPosition): void;
	revealRange(range: IBufferRange): void;
	registerTemporaryDecoration(marker: IMarker, endMarker: IMarker | undefined, showOutline: boolean): void;
	showCommandGuide(command: ITerminalCommand | undefined): void;

	saveScrollState(): void;
	restoreScrollState(): void;
}

export interface ITerminalGroup {
	activeInstance: ITerminalInstance | undefined;
	terminalInstances: ITerminalInstance[];
	title: string;
	readonly hadFocusOnExit: boolean;

	readonly onDidDisposeInstance: Event<ITerminalInstance>;
	readonly onDisposed: Event<ITerminalGroup>;
	readonly onInstancesChanged: Event<void>;
	readonly onPanelOrientationChanged: Event<Orientation>;

	focusPreviousPane(): void;
	focusNextPane(): void;
	resizePane(direction: Direction): void;
	resizePanes(relativeSizes: number[]): void;
	setActiveInstanceByIndex(index: number, force?: boolean): void;
	attachToElement(element: HTMLElement): void;
	addInstance(instance: ITerminalInstance): void;
	removeInstance(instance: ITerminalInstance): void;
	moveInstance(instances: SingleOrMany<ITerminalInstance>, index: number, position: 'before' | 'after'): void;
	setVisible(visible: boolean): void;
	layout(width: number, height: number): void;
	addDisposable(disposable: IDisposable): void;
	split(shellLaunchConfig: IShellLaunchConfig): ITerminalInstance;
	getLayoutInfo(isActive: boolean): ITerminalTabLayoutInfoById;
}

export const enum TerminalConnectionState {
	Connecting,
	Connected
}

export interface IDetachedXTermOptions {
	cols: number;
	rows: number;
	colorProvider: IXtermColorProvider;
	capabilities?: ITerminalCapabilityStore;
	readonly?: boolean;
	processInfo: ITerminalProcessInfo;
	disableOverviewRuler?: boolean;
}

/**
 * A generic interface implemented in both the {@link ITerminalInstance} (an
 * interface used for terminals attached to the terminal panel or editor) and
 * {@link IDetachedTerminalInstance} (a terminal used elsewhere in VS Code UI).
 */
export interface IBaseTerminalInstance {
	readonly capabilities: ITerminalCapabilityStore;

	/**
	 * DOM element the terminal is mounted in.
	 */
	readonly domElement?: HTMLElement;

	/**
	 * Current selection in the terminal.
	 */
	readonly selection: string | undefined;

	/**
	 * Check if anything is selected in terminal.
	 */
	hasSelection(): boolean;

	/**
	 * Clear current selection.
	 */
	clearSelection(): void;

	/**
	 * Focuses the terminal instance if it's able to (the xterm.js instance must exist).
	 *
	 * @param force Force focus even if there is a selection.
	 */
	focus(force?: boolean): void;

	/**
	 * Force the scroll bar to be visible until {@link resetScrollbarVisibility} is called.
	 */
	forceScrollbarVisibility(): void;

	/**
	 * Resets the scroll bar to only be visible when needed, this does nothing unless
	 * {@link forceScrollbarVisibility} was called.
	 */
	resetScrollbarVisibility(): void;

	/**
	 * Gets a terminal contribution by its ID.
	 */
	getContribution<T extends ITerminalContribution>(id: string): T | null;
}

/**
 * A {@link ITerminalInstance}-like object that emulates a subset of
 * capabilities. This instance is returned from {@link ITerminalService.createDetachedTerminal}
 * to represent terminals that appear in other parts of the VS Code UI outside
 * of the "Terminal" view or editors.
 */
export interface IDetachedTerminalInstance extends IDisposable, IBaseTerminalInstance {
	readonly xterm: IDetachedXtermTerminal;

	/**
	 * Attached the terminal to the given element. This should be preferred over
	 * calling {@link IXtermTerminal.attachToElement} so that extra DOM elements
	 * for contributions are initialized.
	 *
	 * @param container Container the terminal will be rendered in
	 * @param options Additional options for mounting the terminal in an element
	 */
	attachToElement(container: HTMLElement, options?: Partial<IXtermAttachToElementOptions>): void;
}

export const isDetachedTerminalInstance = (t: ITerminalInstance | IDetachedTerminalInstance): t is IDetachedTerminalInstance => !isNumber((t as ITerminalInstance).instanceId);

export interface ITerminalService extends ITerminalInstanceHost {
	readonly _serviceBrand: undefined;

	/** Gets all terminal instances, including editor, terminal view (group), and background instances. */
	readonly instances: readonly ITerminalInstance[];

	readonly foregroundInstances: readonly ITerminalInstance[];

	/** Gets detached terminal instances created via {@link createDetachedXterm}. */
	readonly detachedInstances: Iterable<IDetachedTerminalInstance>;

	readonly isProcessSupportRegistered: boolean;
	readonly connectionState: TerminalConnectionState;
	readonly whenConnected: Promise<void>;
	/** The number of restored terminal groups on startup. */
	readonly restoredGroupCount: number;

	readonly onDidCreateInstance: Event<ITerminalInstance>;
	readonly onDidChangeInstanceDimensions: Event<ITerminalInstance>;
	readonly onDidRequestStartExtensionTerminal: Event<IStartExtensionTerminalRequest>;
	readonly onDidRegisterProcessSupport: Event<void>;
	readonly onDidChangeConnectionState: Event<void>;

	// Group events
	readonly onDidChangeActiveGroup: Event<ITerminalGroup | undefined>;

	// Multiplexed events
	readonly onAnyInstanceData: Event<{ instance: ITerminalInstance; data: string }>;
	readonly onAnyInstanceDataInput: Event<ITerminalInstance>;
	readonly onAnyInstanceIconChange: Event<{ instance: ITerminalInstance; userInitiated: boolean }>;
	readonly onAnyInstanceMaximumDimensionsChange: Event<ITerminalInstance>;
	readonly onAnyInstancePrimaryStatusChange: Event<ITerminalInstance>;
	readonly onAnyInstanceProcessIdReady: Event<ITerminalInstance>;
	readonly onAnyInstanceSelectionChange: Event<ITerminalInstance>;
	readonly onAnyInstanceTitleChange: Event<ITerminalInstance>;
	readonly onAnyInstanceShellTypeChanged: Event<ITerminalInstance>;
	readonly onAnyInstanceAddedCapabilityType: Event<TerminalCapability>;

	/**
	 * Creates a terminal.
	 * @param options The options to create the terminal with, when not specified the default
	 * profile will be used at the default target.
	 */
	createTerminal(options?: ICreateTerminalOptions): Promise<ITerminalInstance>;

	/**
	 * Creates and focuses a terminal.
	 * @param options The options to create the terminal with, when not specified the default
	 * profile will be used at the default target.
	 */
	createAndFocusTerminal(options?: ICreateTerminalOptions): Promise<ITerminalInstance>;

	/**
	 * Creates a detached xterm instance which is not attached to the DOM or
	 * tracked as a terminal instance.
	 * @params options The options to create the terminal with
	 */
	createDetachedTerminal(options: IDetachedXTermOptions): Promise<IDetachedTerminalInstance>;

	/**
	 * Creates a raw terminal instance, this should not be used outside of the terminal part.
	 */
	getInstanceFromId(terminalId: number): ITerminalInstance | undefined;

	/**
	 * An owner of terminals might be created after reconnection has occurred,
	 * so store them to be requested/adopted later
	 * @deprecated Use {@link onDidReconnectToSession}
	 */
	getReconnectedTerminals(reconnectionOwner: string): ITerminalInstance[] | undefined;

	getActiveOrCreateInstance(options?: { acceptsInput?: boolean }): Promise<ITerminalInstance>;
	revealTerminal(source: ITerminalInstance, preserveFocus?: boolean): Promise<void>;
	/**
	 * @param instance
	 * @param suppressSetActive Do not set the active instance when there is only one terminal
	 * @param forceSaveState Used when the window is shutting down and we need to reveal and save hideFromUser terminals
	 */
	showBackgroundTerminal(instance: ITerminalInstance, suppressSetActive?: boolean): Promise<void>;
	revealActiveTerminal(preserveFocus?: boolean): Promise<void>;
	moveToEditor(source: ITerminalInstance, group?: GroupIdentifier | SIDE_GROUP_TYPE | ACTIVE_GROUP_TYPE | AUX_WINDOW_GROUP_TYPE): void;
	moveIntoNewEditor(source: ITerminalInstance): void;
	moveToTerminalView(source: ITerminalInstance | URI): Promise<void>;
	getPrimaryBackend(): ITerminalBackend | undefined;
	setNextCommandId(id: number, commandLine: string, commandId: string): Promise<void>;

	/**
	 * Fire the onActiveTabChanged event, this will trigger the terminal dropdown to be updated,
	 * among other things.
	 */
	refreshActiveGroup(): void;

	registerProcessSupport(isSupported: boolean): void;

	showProfileQuickPick(type: 'setDefault' | 'createInstance', cwd?: string | URI): Promise<ITerminalInstance | undefined>;

	setContainers(panelContainer: HTMLElement, terminalContainer: HTMLElement): void;

	requestStartExtensionTerminal(proxy: ITerminalProcessExtHostProxy, cols: number, rows: number): Promise<ITerminalLaunchError | undefined>;
	isAttachedToTerminal(remoteTerm: IRemoteTerminalAttachTarget): boolean;
	safeDisposeTerminal(instance: ITerminalInstance): Promise<void>;

	getDefaultInstanceHost(): ITerminalInstanceHost;
	getInstanceHost(target: ITerminalLocationOptions | undefined): Promise<ITerminalInstanceHost>;

	resolveLocation(location?: ITerminalLocationOptions): Promise<TerminalLocation | undefined>;
	setNativeDelegate(nativeCalls: ITerminalServiceNativeDelegate): void;

	/**
	 * Creates an instance event listener that listens to all instances, dynamically adding new
	 * instances and removing old instances as needed.
	 * @param getEvent Maps the instance to the event.
	 */
	createOnInstanceEvent<T>(getEvent: (instance: ITerminalInstance) => Event<T>): DynamicListEventMultiplexer<ITerminalInstance, T>;

	/**
	 * Creates a capability event listener that listens to capabilities on all instances,
	 * dynamically adding and removing instances and capabilities as needed.
	 * @param capabilityId The capability type to listen to an event on.
	 * @param getEvent Maps the capability to the event.
	 */
	createOnInstanceCapabilityEvent<T extends TerminalCapability, K>(capabilityId: T, getEvent: (capability: ITerminalCapabilityImplMap[T]) => Event<K>): IDynamicListEventMultiplexer<{ instance: ITerminalInstance; data: K }>;

	/**
	 * Reveals the terminal and, if provided, scrolls to the command mark.
	 * @param resource the terminal resource
	 */
	openResource(resource: URI): void;
}

/**
 * A service that provides convenient access to the terminal configuration and derived values.
 */
export interface ITerminalConfigurationService {
	readonly _serviceBrand: undefined;

	/**
	 * A typed and partially validated representation of the terminal configuration.
	 */
	readonly config: Readonly<ITerminalConfiguration>;

	/**
	 * The default location for terminals.
	 */
	readonly defaultLocation: TerminalLocation;

	/**
	 * Fires when something within the terminal configuration changes.
	 */
	readonly onConfigChanged: Event<void>;

	setPanelContainer(panelContainer: HTMLElement): void;
	configFontIsMonospace(): boolean;
	getFont(w: Window, xtermCore?: IXtermCore, excludeDimensions?: boolean): ITerminalFont;
}

export class TerminalLinkQuickPickEvent extends MouseEvent {

}
export interface ITerminalServiceNativeDelegate {
	getWindowCount(): Promise<number>;
}

/**
 * This service is responsible for integrating with the editor service and managing terminal
 * editors.
 */
export interface ITerminalEditorService extends ITerminalInstanceHost {
	readonly _serviceBrand: undefined;

	/** Gets all _terminal editor_ instances. */
	readonly instances: readonly ITerminalInstance[];

	openEditor(instance: ITerminalInstance, editorOptions?: TerminalEditorLocation): Promise<void>;
	detachInstance(instance: ITerminalInstance): void;
	splitInstance(instanceToSplit: ITerminalInstance, shellLaunchConfig?: IShellLaunchConfig): ITerminalInstance;
	revealActiveEditor(preserveFocus?: boolean): Promise<void>;
	resolveResource(instance: ITerminalInstance): URI;
	reviveInput(deserializedInput: IDeserializedTerminalEditorInput): EditorInput;
	getInputFromResource(resource: URI): TerminalEditorInput;
}

export const terminalEditorId = 'terminalEditor';

interface ITerminalEditorInputObject {
	readonly id: number;
	readonly pid: number;
	readonly title: string;
	readonly titleSource: TitleEventSource;
	readonly cwd: string;
	readonly icon: TerminalIcon | undefined;
	readonly color: string | undefined;
	readonly hasChildProcesses?: boolean;
	readonly type?: TerminalType;
	readonly isFeatureTerminal?: boolean;
	readonly hideFromUser?: boolean;
	readonly reconnectionProperties?: IReconnectionProperties;
	readonly shellIntegrationNonce: string;
}

export interface ISerializedTerminalEditorInput extends ITerminalEditorInputObject {
}

export interface IDeserializedTerminalEditorInput extends ITerminalEditorInputObject {
}

export type ITerminalLocationOptions = TerminalLocation | TerminalEditorLocation | { parentTerminal: MaybePromise<ITerminalInstance> } | { splitActiveTerminal: boolean };

export interface ICreateTerminalOptions {
	/**
	 * The shell launch config or profile to launch with, when not specified the default terminal
	 * profile will be used.
	 */
	config?: IShellLaunchConfig | ITerminalProfile | IExtensionTerminalProfile;
	/**
	 * The current working directory to start with, this will override IShellLaunchConfig.cwd if
	 * specified.
	 */
	cwd?: string | URI;
	/**
	 * The terminal's resource, passed when the terminal has moved windows.
	 */
	resource?: URI;

	/**
	 * The terminal's location (editor or panel), it's terminal parent (split to the right), or editor group
	 */
	location?: ITerminalLocationOptions;

	/**
	 * This terminal will not wait for contributed profiles to resolve which means it will proceed
	 * when the workbench is not yet loaded.
	 */
	skipContributedProfileCheck?: boolean;
}

export interface TerminalEditorLocation {
	viewColumn: GroupIdentifier | SIDE_GROUP_TYPE | ACTIVE_GROUP_TYPE | AUX_WINDOW_GROUP_TYPE;
	preserveFocus?: boolean;
	auxiliary?: IEditorOptions['auxiliary'];
}

/**
 * This service is responsible for managing terminal groups, that is the terminals that are hosted
 * within the terminal panel, not in an editor.
 */
export interface ITerminalGroupService extends ITerminalInstanceHost {
	readonly _serviceBrand: undefined;

	/** Gets all _terminal view_ instances, ie. instances contained within terminal groups. */
	readonly instances: readonly ITerminalInstance[];
	readonly groups: readonly ITerminalGroup[];
	activeGroup: ITerminalGroup | undefined;
	readonly activeGroupIndex: number;
	/**
	 * Gets or sets the last accessed menu, this is used to select the instance(s) for menu actions.
	 */
	lastAccessedMenu: 'inline-tab' | 'tab-list';

	readonly onDidChangeActiveGroup: Event<ITerminalGroup | undefined>;
	readonly onDidDisposeGroup: Event<ITerminalGroup>;
	/** Fires when a group is created, disposed of, or shown (in the case of a background group). */
	readonly onDidChangeGroups: Event<void>;
	/** Fires when the panel has been shown and expanded, so has non-zero dimensions. */
	readonly onDidShow: Event<void>;
	readonly onDidChangePanelOrientation: Event<Orientation>;

	createGroup(shellLaunchConfig?: IShellLaunchConfig): ITerminalGroup;
	createGroup(instance?: ITerminalInstance): ITerminalGroup;
	getGroupForInstance(instance: ITerminalInstance): ITerminalGroup | undefined;

	/**
	 * Moves a terminal instance's group to the target instance group's position.
	 * @param source The source instance to move.
	 * @param target The target instance to move the source instance to.
	 */
	moveGroup(source: SingleOrMany<ITerminalInstance>, target: ITerminalInstance): void;
	moveGroupToEnd(source: SingleOrMany<ITerminalInstance>): void;

	moveInstance(source: ITerminalInstance, target: ITerminalInstance, side: 'before' | 'after'): void;
	unsplitInstance(instance: ITerminalInstance): void;
	joinInstances(instances: ITerminalInstance[]): void;
	instanceIsSplit(instance: ITerminalInstance): boolean;

	getGroupLabels(): string[];
	setActiveGroupByIndex(index: number): void;
	setActiveGroupToNext(): void;
	setActiveGroupToPrevious(): void;

	setActiveInstanceByIndex(terminalIndex: number): void;

	setContainer(container: HTMLElement): void;

	showPanel(focus?: boolean): Promise<void>;
	hidePanel(): void;
	focusTabs(): void;
	focusHover(): void;
	updateVisibility(): void;
}

/**
 * An interface that indicates the implementer hosts terminal instances, exposing a common set of
 * properties and events.
 */
export interface ITerminalInstanceHost {
	readonly activeInstance: ITerminalInstance | undefined;
	readonly instances: readonly ITerminalInstance[];

	readonly onDidDisposeInstance: Event<ITerminalInstance>;
	readonly onDidFocusInstance: Event<ITerminalInstance>;
	readonly onDidChangeActiveInstance: Event<ITerminalInstance | undefined>;
	readonly onDidChangeInstances: Event<void>;
	readonly onDidChangeInstanceCapability: Event<ITerminalInstance>;

	setActiveInstance(instance: ITerminalInstance): void;
	/**
	 * Reveal and focus the instance, regardless of its location.
	 */
	focusInstance(instance: ITerminalInstance): void;
	/**
	 * Reveal and focus the active instance, regardless of its location.
	 */
	focusActiveInstance(): Promise<void>;
	/**
	 * Gets an instance from a resource if it exists. This MUST be used instead of getInstanceFromId
	 * when you only know about a terminal's URI. (a URI's instance ID may not be this window's instance ID)
	 */
	getInstanceFromResource(resource: UriComponents | undefined): ITerminalInstance | undefined;
}

/**
 * Similar to xterm.js' ILinkProvider but using promises and hides xterm.js internals (like buffer
 * positions, decorations, etc.) from the rest of vscode. This is the interface to use for
 * workbench integrations.
 */
export interface ITerminalExternalLinkProvider {
	provideLinks(instance: ITerminalInstance, line: string): Promise<ITerminalLink[] | undefined>;
}

export interface ITerminalLink {
	/** The startIndex of the link in the line. */
	startIndex: number;
	/** The length of the link in the line. */
	length: number;
	/** The descriptive label for what the link does when activated. */
	label?: string;
	/**
	 * Activates the link.
	 * @param text The text of the link.
	 */
	activate(text: string): void;
}

export interface ISearchOptions {
	/** Whether the find should be done as a regex. */
	regex?: boolean;
	/** Whether only whole words should match. */
	wholeWord?: boolean;
	/** Whether find should pay attention to case. */
	caseSensitive?: boolean;
	/** Whether the search should start at the current search position (not the next row). */
	incremental?: boolean;
}

export interface ITerminalInstance extends IBaseTerminalInstance {
	/**
	 * The ID of the terminal instance, this is an arbitrary number only used to uniquely identify
	 * terminal instances within a window.
	 */
	readonly instanceId: number;
	/**
	 * A unique URI for this terminal instance with the following encoding:
	 * path: /<workspace ID>/<instance ID>
	 * fragment: Title
	 * Note that when dragging terminals across windows, this will retain the original workspace ID /instance ID
	 * from the other window.
	 */
	readonly resource: URI;

	readonly cols: number;
	readonly rows: number;
	readonly maxCols: number;
	readonly maxRows: number;
	readonly fixedCols?: number;
	readonly fixedRows?: number;
	readonly domElement: HTMLElement;
	readonly icon?: TerminalIcon;
	readonly color?: string;
	readonly reconnectionProperties?: IReconnectionProperties;
	readonly processName: string;
	readonly sequence?: string;
	readonly staticTitle?: string;
	readonly progressState?: IProgressState;
	readonly workspaceFolder?: IWorkspaceFolder;
	readonly cwd?: string;
	readonly initialCwd?: string;
	readonly os?: OperatingSystem;
	readonly usedShellIntegrationInjection: boolean;
	readonly shellIntegrationInjectionFailureReason: ShellIntegrationInjectionFailureReason | undefined;
	readonly injectedArgs: string[] | undefined;
	readonly extEnvironmentVariableCollection: IMergedEnvironmentVariableCollection | undefined;

	/**
	 * The underlying disposable store, allowing objects who share the same lifecycle as the
	 * terminal instance but are created externally to be managed by the instance.
	 */
	readonly store: DisposableStore;

	readonly statusList: ITerminalStatusList;

	/**
	 * The process ID of the shell process, this is undefined when there is no process associated
	 * with this terminal.
	 */
	processId: number | undefined;

	/**
	 * The position of the terminal.
	 */
	target: TerminalLocation | undefined;
	targetRef: IReference<TerminalLocation | undefined>;

	/**
	 * The id of a persistent process. This is defined if this is a terminal created by a pty host
	 * that supports reconnection.
	 */
	readonly persistentProcessId: number | undefined;

	/**
	 * Whether the process should be persisted across reloads.
	 */
	readonly shouldPersist: boolean;

	/*
	 * Whether this terminal has been disposed of
	 */
	readonly isDisposed: boolean;

	/**
	 * Whether the terminal's pty is hosted on a remote.
	 */
	readonly hasRemoteAuthority: boolean;

	/**
	 * The remote authority of the terminal's pty.
	 */
	readonly remoteAuthority: string | undefined;

	/**
	 * Whether an element within this terminal is focused.
	 */
	readonly hasFocus: boolean;

	/**
	 * The ID of the session that this terminal is connected to
	 */
	readonly sessionId: string;

	/**
	 * Get or set the behavior of the terminal when it closes. This was indented only to be called
	 * after reconnecting to a terminal.
	 */
	waitOnExit: WaitOnExitValue | undefined;

	/**
	 * An event that fires when the terminal instance's title changes.
	 */
	readonly onTitleChanged: Event<ITerminalInstance>;

	/**
	 * An event that fires when the terminal instance's icon changes.
	 */
	readonly onIconChanged: Event<{ instance: ITerminalInstance; userInitiated: boolean }>;

	/**
	 * An event that fires when the terminal instance is disposed.
	 */
	readonly onDisposed: Event<ITerminalInstance>;

	readonly onProcessIdReady: Event<ITerminalInstance>;
	readonly onProcessReplayComplete: Event<void>;
	readonly onRequestExtHostProcess: Event<ITerminalInstance>;
	readonly onDimensionsChanged: Event<void>;
	readonly onMaximumDimensionsChanged: Event<void>;
	readonly onDidChangeHasChildProcesses: Event<boolean>;

	readonly onDidFocus: Event<ITerminalInstance>;
	readonly onDidRequestFocus: Event<void>;
	readonly onDidBlur: Event<ITerminalInstance>;
	readonly onDidInputData: Event<string>;
	readonly onDidChangeSelection: Event<ITerminalInstance>;
	readonly onDidExecuteText: Event<void>;
	readonly onDidChangeTarget: Event<TerminalLocation | undefined>;
	readonly onDidSendText: Event<string>;
	readonly onDidChangeShellType: Event<TerminalShellType>;
	readonly onDidChangeVisibility: Event<boolean>;

	/**
	 * An event that fires when a terminal is dropped on this instance via drag and drop.
	 */
	readonly onRequestAddInstanceToGroup: Event<IRequestAddInstanceToGroupEvent>;

	/**
	 * Attach a listener to the raw data stream coming from the pty, including ANSI escape
	 * sequences.
	 */
	readonly onData: Event<string>;
	readonly onWillData: Event<string>;

	/**
	 * Attach a listener to the binary data stream coming from xterm and going to pty
	 */
	readonly onBinary: Event<string>;

	/**
	 * Attach a listener to listen for new lines added to this terminal instance.
	 *
	 * @param listener The listener function which takes new line strings added to the terminal,
	 * excluding ANSI escape sequences. The line event will fire when an LF character is added to
	 * the terminal (ie. the line is not wrapped). Note that this means that the line data will
	 * not fire for the last line, until either the line is ended with a LF character of the process
	 * is exited. The lineData string will contain the fully wrapped line, not containing any LF/CR
	 * characters.
	 */
	readonly onLineData: Event<string>;

	/**
	 * Attach a listener that fires when the terminal's pty process exits. The number in the event
	 * is the processes' exit code, an exit code of undefined means the process was killed as a result of
	 * the ITerminalInstance being disposed.
	 */
	readonly onExit: Event<number | ITerminalLaunchError | undefined>;

	/**
	 * The exit code or undefined when the terminal process hasn't yet exited or
	 * the process exit code could not be determined. Use {@link exitReason} to see
	 * why the process has exited.
	 */
	readonly exitCode: number | undefined;

	/**
	 * The reason the terminal process exited, this will be undefined if the process is still
	 * running.
	 */
	readonly exitReason: TerminalExitReason | undefined;

	/**
	 * The xterm.js instance for this terminal.
	 */
	readonly xterm?: XtermTerminal;

	/**
	 * Resolves when the xterm.js instance for this terminal is ready.
	 */
	readonly xtermReadyPromise: Promise<XtermTerminal | undefined>;

	/**
	 * Returns an array of data events that have fired within the first 10 seconds. If this is
	 * called 10 seconds after the terminal has existed the result will be undefined. This is useful
	 * when objects that depend on the data events have delayed initialization, like extension
	 * hosts.
	 */
	readonly initialDataEvents: string[] | undefined;

	/** A promise that resolves when the terminal's pty/process have been created. */
	readonly processReady: Promise<void>;

	/** Whether the terminal's process has child processes (ie. is dirty/busy). */
	readonly hasChildProcesses: boolean;

	/**
	 * The title of the terminal. This is either title or the process currently running or an
	 * explicit name given to the terminal instance through the extension API.
	 */
	readonly title: string;

	/**
	 * How the current title was set.
	 */
	readonly titleSource: TitleEventSource;

	/**
	 * The shell type of the terminal.
	 */
	readonly shellType: TerminalShellType | undefined;

	/**
	 * The focus state of the terminal before exiting.
	 */
	readonly hadFocusOnExit: boolean;

	/**
	 * False when the title is set by an API or the user. We check this to make sure we
	 * do not override the title when the process title changes in the terminal.
	 */
	isTitleSetByProcess: boolean;

	/**
	 * The shell launch config used to launch the shell.
	 */
	readonly shellLaunchConfig: IShellLaunchConfig;

	/**
	 * Whether to disable layout for the terminal. This is useful when the size of the terminal is
	 * being manipulating (e.g. adding a split pane) and we want the terminal to ignore particular
	 * resize events.
	 */
	disableLayout: boolean;

	/**
	 * The description of the terminal, this is typically displayed next to {@link title}.
	 */
	description: string | undefined;

	/**
	 * The remote-aware $HOME directory (or Windows equivalent) of the terminal.
	 */
	userHome: string | undefined;

	/**
	 * The nonce used to verify commands coming from shell integration.
	 */
	shellIntegrationNonce: string;

	/**
	 * Registers and returns a marker
	 * @param the y offset from the cursor
	 */
	registerMarker(offset?: number): IMarker | undefined;

	/**
	 * Adds a marker to the buffer, mapping it to an ID if provided.
	 */
	addBufferMarker(properties: IMarkProperties): void;

	/**
	 *
	 * @param startMarkId The ID for the start marker
	 * @param endMarkId The ID for the end marker
	 * @param highlight Whether the buffer from startMarker to endMarker
	 * should be highlighted
	 */
	scrollToMark(startMarkId: string, endMarkId?: string, highlight?: boolean): void;

	/**
	 * Dispose the terminal instance, removing it from the panel/service and freeing up resources.
	 *
	 * @param reason The reason why the terminal is being disposed
	 */
	dispose(reason?: TerminalExitReason): void;

	/**
	 * Informs the process that the terminal is now detached and
	 * then disposes the terminal.
	 *
	 * @param reason The reason why the terminal is being disposed
	 */
	detachProcessAndDispose(reason: TerminalExitReason): Promise<void>;

	/**
	 * When the panel is hidden or a terminal in the editor area becomes inactive, reset the focus context key
	 * to avoid issues like #147180.
	 */
	resetFocusContextKey(): void;

	/**
	 * Focuses the terminal instance when it's ready (the xterm.js instance much exist). This is the
	 * best focus call when the terminal is being shown for example.
	 * when the terminal is being shown.
	 *
	 * @param force Force focus even if there is a selection.
	 */
	focusWhenReady(force?: boolean): Promise<void>;

	/**
	 * Send text to the terminal instance. The text is written to the stdin of the underlying pty
	 * process (shell) of the terminal instance.
	 *
	 * @param text The text to send.
	 * @param shouldExecute Indicates that the text being sent should be executed rather than just inserted in the terminal.
	 * The character(s) added are \n or \r\n, depending on the platform. This defaults to `true`.
	 * @param bracketedPasteMode Whether to wrap the text in the bracketed paste mode sequence when
	 * it's enabled. When true, the shell will treat the text as if it were pasted into the shell,
	 * this may for example select the text and it will also ensure that the text will not be
	 * interpreted as a shell keybinding.
	 */
	sendText(text: string, shouldExecute: boolean, bracketedPasteMode?: boolean): Promise<void>;

	/**
	 * Sends a signal to the terminal instance's process.
	 *
	 * @param signal The signal to send (e.g., 'SIGTERM', 'SIGINT', 'SIGKILL').
	 */
	sendSignal(signal: string): Promise<void>;

	/**
	 * Sends a path to the terminal instance, preparing it as needed based on the detected shell
	 * running within the terminal. The text is written to the stdin of the underlying pty process
	 * (shell) of the terminal instance.
	 *
	 * @param originalPath The path to send.
	 * @param shouldExecute Indicates that the text being sent should be executed rather than just inserted in the terminal.
	 * The character(s) added are \n or \r\n, depending on the platform. This defaults to `true`.
	 */
	sendPath(originalPath: string | URI, shouldExecute: boolean): Promise<void>;

	runCommand(command: string, shouldExecute?: boolean, commandId?: string): Promise<void>;

	/**
	 * Takes a path and returns the properly escaped path to send to a given shell. On Windows, this
	 * includes trying to prepare the path for WSL if needed.
	 *
	 * @param originalPath The path to be escaped and formatted.
	 */
	preparePathForShell(originalPath: string): Promise<string>;

	/**
	 * Formats a file system URI for display in UI so that it appears in the terminal shell's format.
	 * @param uri The URI to format.
	 */
	getUriLabelForShell(uri: URI): Promise<string>;

	/** Scroll the terminal buffer down 1 line. */   scrollDownLine(): void;
	/** Scroll the terminal buffer down 1 page. */   scrollDownPage(): void;
	/** Scroll the terminal buffer to the bottom. */ scrollToBottom(): void;
	/** Scroll the terminal buffer up 1 line. */     scrollUpLine(): void;
	/** Scroll the terminal buffer up 1 page. */     scrollUpPage(): void;
	/** Scroll the terminal buffer to the top. */    scrollToTop(): void;

	/**
	 * Clears the terminal buffer, leaving only the prompt line and moving it to the top of the
	 * viewport.
	 */
	clearBuffer(): void;

	/**
	 * Attaches the terminal instance to an element on the DOM, before this is called the terminal
	 * instance process may run in the background but cannot be displayed on the UI.
	 *
	 * @param container The element to attach the terminal instance to.
	 */
	attachToElement(container: HTMLElement): void;

	/**
	 * Detaches the terminal instance from the terminal editor DOM element.
	 */
	detachFromElement(): void;

	/**
	 * Layout the terminal instance.
	 *
	 * @param dimension The dimensions of the container.
	 */
	layout(dimension: { width: number; height: number }): void;

	/**
	 * Sets whether the terminal instance's element is visible in the DOM.
	 *
	 * @param visible Whether the element is visible.
	 */
	setVisible(visible: boolean): void;

	/**
	 * Immediately kills the terminal's current pty process and launches a new one to replace it.
	 *
	 * @param shell The new launch configuration.
	 */
	reuseTerminal(shell: IShellLaunchConfig): Promise<void>;

	/**
	 * Relaunches the terminal, killing it and reusing the launch config used initially. Any
	 * environment variable changes will be recalculated when this happens.
	 */
	relaunch(): void;

	/**
	 * Sets the terminal instance's dimensions to the values provided via the onDidOverrideDimensions event,
	 * which allows overriding the regular dimensions (fit to the size of the panel).
	 */
	setOverrideDimensions(dimensions: ITerminalDimensions): void;

	/**
	 * Sets the terminal instance's dimensions to the values provided via quick input.
	 */
	setFixedDimensions(): Promise<void>;

	/**
	 * Toggles terminal line wrapping.
	 */
	toggleSizeToContentWidth(): Promise<void>;

	/**
	 * Gets the initial current working directory, fetching it from the backend if required.
	 */
	getInitialCwd(): Promise<string>;

	/**
	 * Gets the current working directory from cwd detection capabilities if available, otherwise
	 * from the backend. This will return the initial cwd if cwd detection is not available (ie.
	 * on Windows when shell integration is disabled).
	 */
	getSpeculativeCwd(): Promise<string>;

	/**
	 * Gets the cwd as a URI that has been validated to exist.
	 */
	getCwdResource(): Promise<URI | undefined>;

	/**
	 * Sets the title of the terminal to the provided string. If no title is provided, it will reset
	 * to the terminal's title if it was not explicitly set by the user or API.
	 * @param title The new title.
	 */
	rename(title?: string): Promise<void>;

	/**
	 * Sets or triggers a quick pick to change the icon of this terminal.
	 */
	changeIcon(icon?: TerminalIcon): Promise<TerminalIcon | undefined>;

	/**
	 * Sets or triggers a quick pick to change the color of the associated terminal tab icon.
	 */
	changeColor(color?: string, skipQuickPick?: boolean): Promise<string | undefined>;

	/**
	 * Attempts to detect and kill the process listening on specified port.
	 * If successful, places commandToRun on the command line
	 */
	freePortKillProcess(port: string, commandToRun: string): Promise<void>;

	/**
	 * Update the parent context key service to use for this terminal instance.
	 */
	setParentContextKeyService(parentContextKeyService: IContextKeyService): void;

	/**
	 * Handles a mouse event for the terminal, this may happen on an anscestor of the terminal
	 * instance's element.
	 * @param event The mouse event.
	 * @param contextMenu The context menu to show if needed.
	 * @returns Whether the context menu should be suppressed.
	 */
	handleMouseEvent(event: MouseEvent, contextMenu: IMenu): Promise<{ cancelContextMenu: boolean } | void>;
}

export const enum XtermTerminalConstants {
	SearchHighlightLimit = 20000
}

export interface IXtermAttachToElementOptions {
	/**
	 * Whether GPU rendering should be enabled for this element, defaults to true.
	 */
	enableGpu: boolean;
}

export interface IXtermTerminal extends IDisposable {
	/**
	 * An object that tracks when commands are run and enables navigating and selecting between
	 * them.
	 */
	readonly markTracker: IMarkTracker;

	/**
	 * Reports the status of shell integration and fires events relating to it.
	 */
	readonly shellIntegration: IShellIntegration;

	readonly decorationAddon: IDecorationAddon;

	readonly onDidChangeSelection: Event<void>;
	readonly onDidChangeFindResults: Event<{ resultIndex: number; resultCount: number }>;
	readonly onDidRequestRunCommand: Event<{ command: ITerminalCommand; noNewLine?: boolean }>;
	readonly onDidRequestCopyAsHtml: Event<{ command: ITerminalCommand }>;

	/**
	 * Event fired when focus enters (fires with true) or leaves (false) the terminal.
	 */
	readonly onDidChangeFocus: Event<boolean>;

	/**
	 * Gets a view of the current texture atlas used by the renderers.
	 */
	readonly textureAtlas: Promise<ImageBitmap> | undefined;

	/**
	 * Whether the `disableStdin` option in xterm.js is set.
	 */
	readonly isStdinDisabled: boolean;

	/**
	 * Whether the terminal is currently focused.
	 */
	readonly isFocused: boolean;

	/**
	 * Whether a canvas-based renderer is being used.
	 */
	readonly isGpuAccelerated: boolean;

	/**
	 * The last `onData` input event fired by {@link RawXtermTerminal.onData}.
	 */
	readonly lastInputEvent: string | undefined;

	/**
	 * Attached the terminal to the given element
	 * @param container Container the terminal will be rendered in
	 * @param options Additional options for mounting the terminal in an element
	 */
	attachToElement(container: HTMLElement, options?: Partial<IXtermAttachToElementOptions>): void;

	findResult?: { resultIndex: number; resultCount: number };

	/**
	 * Find the next instance of the term
	*/
	findNext(term: string, searchOptions: ISearchOptions): Promise<boolean>;

	/**
	 * Find the previous instance of the term
	 */
	findPrevious(term: string, searchOptions: ISearchOptions): Promise<boolean>;

	/**
	 * Forces the terminal to redraw its viewport.
	 */
	forceRedraw(): void;

	/**
	 * Gets the font metrics of this xterm.js instance.
	 */
	getFont(): ITerminalFont;

	/**
	 * Gets the content between two markers as VT sequences.
	 * @param startMarker The marker to start from.
	 * @param endMarker The marker to end at.
	 * @param skipLastLine Whether the last line should be skipped (e.g. when it's the prompt line)
	 */
	getRangeAsVT(startMarker: IXtermMarker, endMarker?: IXtermMarker, skipLastLine?: boolean): Promise<string>;

	/**
	 * Gets whether there's any terminal selection.
	 */
	hasSelection(): boolean;

	/**
	 * Clears any terminal selection.
	 */
	clearSelection(): void;

	/**
	 * Selects all terminal contents/
	 */
	selectAll(): void;

	/**
	 * Selects the content between the two markers by their VS Code OSC `SetMarker`
	 * ID. It's a no-op if either of the two markers are not found.
	 *
	 * @param fromMarkerId Start marker ID
	 * @param toMarkerId End marker ID
	 * @param scrollIntoView Whether the terminal should scroll to the start of
	 * the range, defaults tof alse
	 */
	selectMarkedRange(fromMarkerId: string, toMarkerId: string, scrollIntoView?: boolean): void;

	/**
	 * Copies the terminal selection.
	 * @param copyAsHtml Whether to copy selection as HTML, defaults to false.
	 */
	copySelection(copyAsHtml?: boolean, command?: ITerminalCommand): void;
	/**
	 * Focuses the terminal. Warning: {@link ITerminalInstance.focus} should be
	 * preferred when dealing with terminal instances in order to get
	 * accessibility triggers.
	 */
	focus(): void;

	/** Scroll the terminal buffer down 1 line.   */ scrollDownLine(): void;
	/** Scroll the terminal buffer down 1 page.   */ scrollDownPage(): void;
	/** Scroll the terminal buffer to the bottom. */ scrollToBottom(): void;
	/** Scroll the terminal buffer up 1 line.     */ scrollUpLine(): void;
	/** Scroll the terminal buffer up 1 page.     */ scrollUpPage(): void;
	/** Scroll the terminal buffer to the top.    */ scrollToTop(): void;
	/** Scroll the terminal buffer to a set line  */ scrollToLine(line: number, position?: ScrollPosition): void;

	/**
	 * Clears the terminal buffer, leaving only the prompt line and moving it to the top of the
	 * viewport.
	 */
	clearBuffer(): void;

	/**
	 * Clears the search result decorations
	 */
	clearSearchDecorations(): void;

	/**
	 * Clears the active search result decorations
	 */
	clearActiveSearchDecoration(): void;

	/**
	 * Returns a reverse iterator of buffer lines as strings
	 */
	getBufferReverseIterator(): IterableIterator<string>;

	/**
	 * Gets the contents of the buffer from a start marker (or line 0) to the end marker (or the
	 * last line).
	 */
	getContentsAsText(startMarker?: IXtermMarker, endMarker?: IXtermMarker): string;

	/**
	 * Gets the buffer contents as HTML.
	 */
	getContentsAsHtml(): Promise<string>;

	/**
	 * Refreshes the terminal after it has been moved.
	 */
	refresh(): void;

	getXtermTheme(theme?: IColorTheme): ITheme;
}

export interface IDetachedXtermTerminal extends IXtermTerminal {
	/**
	 * Writes data to the terminal.
	 * @param data data to write
	 * @param callback Optional callback that fires when the data was processed
	 * by the parser.
	 */
	write(data: string | Uint8Array, callback?: () => void): void;

	/**
	 * Resizes the terminal.
	 */
	resize(columns: number, rows: number): void;
}

export interface IInternalXtermTerminal {
	/**
	 * Writes text directly to the terminal, bypassing the process.
	 *
	 * **WARNING:** This should never be used outside of the terminal component and only for
	 * developer purposed inside the terminal component.
	 */
	_writeText(data: string): void; // eslint-disable-line @typescript-eslint/naming-convention
}

export interface IXtermColorProvider {
	getBackgroundColor(theme: IColorTheme): Color | undefined;
}

export interface IRequestAddInstanceToGroupEvent {
	uri: URI;
	side: 'before' | 'after';
}

export const enum LinuxDistro {
	Unknown = 1,
	Fedora = 2,
	Ubuntu = 3,
}

export const enum TerminalDataTransfers {
	Terminals = 'Terminals'
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminal.web.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminal.web.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { KeybindingWeight, KeybindingsRegistry } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ITerminalProfileResolverService, TerminalCommandId } from '../common/terminal.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { BrowserTerminalProfileResolverService } from './terminalProfileResolverService.js';
import { TerminalContextKeys } from '../common/terminalContextKey.js';

registerSingleton(ITerminalProfileResolverService, BrowserTerminalProfileResolverService, InstantiationType.Delayed);

// Register standard external terminal keybinding as integrated terminal when in web as the
// external terminal is not available
KeybindingsRegistry.registerKeybindingRule({
	id: TerminalCommandId.New,
	weight: KeybindingWeight.WorkbenchContrib,
	when: TerminalContextKeys.notFocus,
	primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyC
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isKeyboardEvent, isMouseEvent, isPointerEvent, getActiveWindow } from '../../../../base/browser/dom.js';
import { Action } from '../../../../base/common/actions.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { isAbsolute } from '../../../../base/common/path.js';
import { isWindows } from '../../../../base/common/platform.js';
import { dirname } from '../../../../base/common/resources.js';
import { hasKey, isObject, isString } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { EndOfLinePreference } from '../../../../editor/common/model.js';
import { getIconClasses } from '../../../../editor/common/services/getIconClasses.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { localize, localize2 } from '../../../../nls.js';
import { AccessibleViewProviderId } from '../../../../platform/accessibility/browser/accessibleView.js';
import { CONTEXT_ACCESSIBILITY_MODE_ENABLED } from '../../../../platform/accessibility/common/accessibility.js';
import { Action2, IAction2Options, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { FileKind } from '../../../../platform/files/common/files.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IListService } from '../../../../platform/list/browser/listService.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IPickOptions, IQuickInputService, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { TerminalCapability } from '../../../../platform/terminal/common/capabilities/capabilities.js';
import { ITerminalProfile, TerminalExitReason, TerminalIcon, TerminalLocation, TerminalSettingId } from '../../../../platform/terminal/common/terminal.js';
import { createProfileSchemaEnums } from '../../../../platform/terminal/common/terminalProfiles.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IWorkspaceContextService, IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { PICK_WORKSPACE_FOLDER_COMMAND_ID } from '../../../browser/actions/workspaceCommands.js';
import { CLOSE_EDITOR_COMMAND_ID } from '../../../browser/parts/editor/editorCommands.js';
import { IConfigurationResolverService } from '../../../services/configurationResolver/common/configurationResolver.js';
import { ConfigurationResolverExpression } from '../../../services/configurationResolver/common/configurationResolverExpression.js';
import { editorGroupToColumn } from '../../../services/editor/common/editorGroupColumn.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { ACTIVE_GROUP, AUX_WINDOW_GROUP, SIDE_GROUP } from '../../../services/editor/common/editorService.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';
import { accessibleViewCurrentProviderId, accessibleViewIsShown, accessibleViewOnLastLine } from '../../accessibility/browser/accessibilityConfiguration.js';
import { IRemoteTerminalAttachTarget, ITerminalProfileResolverService, ITerminalProfileService, TERMINAL_VIEW_ID, TerminalCommandId } from '../common/terminal.js';
import { TerminalContextKeys } from '../common/terminalContextKey.js';
import { terminalStrings } from '../common/terminalStrings.js';
import { Direction, ICreateTerminalOptions, IDetachedTerminalInstance, ITerminalConfigurationService, ITerminalEditorService, ITerminalEditingService, ITerminalGroupService, ITerminalInstance, ITerminalInstanceService, ITerminalService, IXtermTerminal } from './terminal.js';
import { isAuxiliaryWindow } from '../../../../base/browser/window.js';
import { InstanceContext } from './terminalContextMenu.js';
import { getColorClass, getIconId, getUriClasses } from './terminalIcon.js';
import { killTerminalIcon, newTerminalIcon } from './terminalIcons.js';
import { ITerminalQuickPickItem } from './terminalProfileQuickpick.js';
import { TerminalTabList } from './terminalTabsList.js';
import { ResourceContextKey } from '../../../common/contextkeys.js';
import { SeparatorSelectOption } from '../../../../base/browser/ui/selectBox/selectBox.js';

export const switchTerminalShowTabsTitle = localize('showTerminalTabs', "Show Tabs");

const category = terminalStrings.actionCategory;

// Some terminal context keys get complicated. Since normalizing and/or context keys can be
// expensive this is done once per context key and shared.
export const sharedWhenClause = (() => {
	const terminalAvailable = ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated);
	return {
		terminalAvailable,
		terminalAvailable_and_opened: ContextKeyExpr.and(terminalAvailable, TerminalContextKeys.isOpen),
		terminalAvailable_and_editorActive: ContextKeyExpr.and(terminalAvailable, TerminalContextKeys.terminalEditorActive),
		terminalAvailable_and_singularSelection: ContextKeyExpr.and(terminalAvailable, TerminalContextKeys.tabsSingularSelection),
		focusInAny_and_normalBuffer: ContextKeyExpr.and(TerminalContextKeys.focusInAny, TerminalContextKeys.altBufferActive.negate())
	};
})();

export interface WorkspaceFolderCwdPair {
	folder: IWorkspaceFolder;
	cwd: URI;
	isAbsolute: boolean;
	isOverridden: boolean;
}

export async function getCwdForSplit(
	instance: ITerminalInstance,
	folders: IWorkspaceFolder[] | undefined,
	commandService: ICommandService,
	configService: ITerminalConfigurationService
): Promise<string | URI | undefined> {
	switch (configService.config.splitCwd) {
		case 'workspaceRoot':
			if (folders !== undefined && commandService !== undefined) {
				if (folders.length === 1) {
					return folders[0].uri;
				} else if (folders.length > 1) {
					// Only choose a path when there's more than 1 folder
					const options: IPickOptions<IQuickPickItem> = {
						placeHolder: localize('workbench.action.terminal.newWorkspacePlaceholder', "Select current working directory for new terminal")
					};
					const workspace = await commandService.executeCommand<IWorkspaceFolder>(PICK_WORKSPACE_FOLDER_COMMAND_ID, [options]);
					if (!workspace) {
						// Don't split the instance if the workspace picker was canceled
						return undefined;
					}
					return Promise.resolve(workspace.uri);
				}
			}
			return '';
		case 'initial':
			return instance.getInitialCwd();
		case 'inherited':
			return instance.getSpeculativeCwd();
	}
}

export class TerminalLaunchHelpAction extends Action {

	constructor(
		@IOpenerService private readonly _openerService: IOpenerService
	) {
		super('workbench.action.terminal.launchHelp', localize('terminalLaunchHelp', "Open Help"));
	}

	override async run(): Promise<void> {
		this._openerService.open('https://aka.ms/vscode-troubleshoot-terminal-launch');
	}
}

/**
 * A wrapper function around registerAction2 to help make registering terminal actions more concise.
 * The following default options are used if undefined:
 *
 * - `f1`: true
 * - `category`: Terminal
 * - `precondition`: TerminalContextKeys.processSupported
 */
export function registerTerminalAction(
	options: IAction2Options & { run: (c: ITerminalServicesCollection, accessor: ServicesAccessor, args?: unknown, args2?: unknown) => void | Promise<unknown> }
): IDisposable {
	// Set defaults
	options.f1 = options.f1 ?? true;
	options.category = options.category ?? category;
	options.precondition = options.precondition ?? TerminalContextKeys.processSupported;
	// Remove run function from options so it's not passed through to registerAction2
	const runFunc = options.run;
	const strictOptions: IAction2Options & { run?: (c: ITerminalServicesCollection, accessor: ServicesAccessor, args?: unknown) => void | Promise<unknown> } = options;
	delete (strictOptions as IAction2Options & { run?: (c: ITerminalServicesCollection, accessor: ServicesAccessor, args?: unknown) => void | Promise<unknown> })['run'];
	// Register
	return registerAction2(class extends Action2 {
		constructor() {
			super(strictOptions as IAction2Options);
		}
		run(accessor: ServicesAccessor, args?: unknown, args2?: unknown) {
			return runFunc(getTerminalServices(accessor), accessor, args, args2);
		}
	});
}

function parseActionArgs(args?: unknown): InstanceContext[] | undefined {
	if (Array.isArray(args)) {
		if (args.every(e => e instanceof InstanceContext)) {
			return args as InstanceContext[];
		}
	} else if (args instanceof InstanceContext) {
		return [args];
	}
	return undefined;
}
/**
 * A wrapper around {@link registerTerminalAction} that runs a callback for all currently selected
 * instances provided in the action context. This falls back to the active instance if there are no
 * contextual instances provided.
 */
export function registerContextualInstanceAction(
	options: IAction2Options & {
		/**
		 * When specified, only this type of active instance will be used when there are no
		 * contextual instances.
		 */
		activeInstanceType?: 'view' | 'editor';
		run: (instance: ITerminalInstance, c: ITerminalServicesCollection, accessor: ServicesAccessor, args?: unknown) => void | Promise<unknown>;
		/**
		 * A callback to run after the `run` callbacks have completed.
		 * @param instances The selected instance(s) that the command was run on.
		 */
		runAfter?: (instances: ITerminalInstance[], c: ITerminalServicesCollection, accessor: ServicesAccessor, args?: unknown) => void | Promise<unknown>;
	}
): IDisposable {
	const originalRun = options.run;
	return registerTerminalAction({
		...options,
		run: async (c, accessor, focusedInstanceArgs, allInstanceArgs) => {
			let instances = getSelectedViewInstances2(accessor, allInstanceArgs);
			if (!instances) {
				const activeInstance = (
					options.activeInstanceType === 'view'
						? c.groupService
						: options.activeInstanceType === 'editor' ?
							c.editorService
							: c.service
				).activeInstance;
				if (!activeInstance) {
					return;
				}
				instances = [activeInstance];
			}
			const results: (Promise<unknown> | void)[] = [];
			for (const instance of instances) {
				results.push(originalRun(instance, c, accessor, focusedInstanceArgs));
			}
			await Promise.all(results);
			if (options.runAfter) {
				options.runAfter(instances, c, accessor, focusedInstanceArgs);
			}
		}
	});
}

/**
 * A wrapper around {@link registerTerminalAction} that ensures an active instance exists and
 * provides it to the run function.
 */
export function registerActiveInstanceAction(
	options: IAction2Options & { run: (activeInstance: ITerminalInstance, c: ITerminalServicesCollection, accessor: ServicesAccessor, args?: unknown) => void | Promise<unknown> }
): IDisposable {
	const originalRun = options.run;
	return registerTerminalAction({
		...options,
		run: (c, accessor, args) => {
			const activeInstance = c.service.activeInstance;
			if (activeInstance) {
				return originalRun(activeInstance, c, accessor, args);
			}
		}
	});
}

/**
 * A wrapper around {@link registerTerminalAction} that ensures an active terminal
 * exists and provides it to the run function.
 *
 * This includes detached xterm terminals that are not managed by an {@link ITerminalInstance}.
 */
export function registerActiveXtermAction(
	options: IAction2Options & { run: (activeTerminal: IXtermTerminal, accessor: ServicesAccessor, instance: ITerminalInstance | IDetachedTerminalInstance, args?: unknown) => void | Promise<unknown> }
): IDisposable {
	const originalRun = options.run;
	return registerTerminalAction({
		...options,
		run: (c, accessor, args) => {
			const activeDetached = Iterable.find(c.service.detachedInstances, d => d.xterm.isFocused);
			if (activeDetached) {
				return originalRun(activeDetached.xterm, accessor, activeDetached, args);
			}

			const activeInstance = c.service.activeInstance;
			if (activeInstance?.xterm) {
				return originalRun(activeInstance.xterm, accessor, activeInstance, args);
			}
		}
	});
}

export interface ITerminalServicesCollection {
	service: ITerminalService;
	configService: ITerminalConfigurationService;
	groupService: ITerminalGroupService;
	instanceService: ITerminalInstanceService;
	editorService: ITerminalEditorService;
	editingService: ITerminalEditingService;
	profileService: ITerminalProfileService;
	profileResolverService: ITerminalProfileResolverService;
}

function getTerminalServices(accessor: ServicesAccessor): ITerminalServicesCollection {
	return {
		service: accessor.get(ITerminalService),
		configService: accessor.get(ITerminalConfigurationService),
		groupService: accessor.get(ITerminalGroupService),
		instanceService: accessor.get(ITerminalInstanceService),
		editorService: accessor.get(ITerminalEditorService),
		editingService: accessor.get(ITerminalEditingService),
		profileService: accessor.get(ITerminalProfileService),
		profileResolverService: accessor.get(ITerminalProfileResolverService)
	};
}

export function registerTerminalActions() {
	registerTerminalAction({
		id: TerminalCommandId.NewInActiveWorkspace,
		title: localize2('workbench.action.terminal.newInActiveWorkspace', 'Create New Terminal (In Active Workspace)'),
		run: async (c) => {
			if (c.service.isProcessSupportRegistered) {
				const instance = await c.service.createTerminal({ location: c.configService.defaultLocation });
				if (!instance) {
					return;
				}
				c.service.setActiveInstance(instance);
				await focusActiveTerminal(instance, c);
			}
		}
	});

	// Register new with profile command
	refreshTerminalActions([]);

	registerTerminalAction({
		id: TerminalCommandId.CreateTerminalEditor,
		title: localize2('workbench.action.terminal.createTerminalEditor', 'Create New Terminal in Editor Area'),
		run: async (c, _, args) => {
			function isCreateTerminalOptions(obj: unknown): obj is ICreateTerminalOptions {
				return isObject(obj) && 'location' in obj;
			}
			const options = isCreateTerminalOptions(args) ? args : { location: { viewColumn: ACTIVE_GROUP } };
			const instance = await c.service.createTerminal(options);
			await instance.focusWhenReady();
		}
	});

	registerTerminalAction({
		id: TerminalCommandId.CreateTerminalEditorSameGroup,
		title: localize2('workbench.action.terminal.createTerminalEditor', 'Create New Terminal in Editor Area'),
		f1: false,
		run: async (c, accessor, args) => {
			// Force the editor into the same editor group if it's locked. This command is only ever
			// called when a terminal is the active editor
			const editorGroupsService = accessor.get(IEditorGroupsService);
			const instance = await c.service.createTerminal({
				location: {
					viewColumn: editorGroupToColumn(editorGroupsService, editorGroupsService.activeGroup),
				}
			});
			await instance.focusWhenReady();
		}
	});

	registerTerminalAction({
		id: TerminalCommandId.CreateTerminalEditorSide,
		title: localize2('workbench.action.terminal.createTerminalEditorSide', 'Create New Terminal in Editor Area to the Side'),
		run: async (c) => {
			const instance = await c.service.createTerminal({
				location: { viewColumn: SIDE_GROUP }
			});
			await instance.focusWhenReady();
		}
	});

	registerTerminalAction({
		id: TerminalCommandId.NewInNewWindow,
		title: terminalStrings.newInNewWindow,
		precondition: sharedWhenClause.terminalAvailable,
		keybinding: {
			primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyCode.Backquote,
			mac: { primary: KeyMod.WinCtrl | KeyMod.Shift | KeyMod.Alt | KeyCode.Backquote },
			weight: KeybindingWeight.WorkbenchContrib
		},
		run: async (c) => {
			const instance = await c.service.createTerminal({
				location: {
					viewColumn: AUX_WINDOW_GROUP,
					auxiliary: { compact: true },
				},
			});
			await instance.focusWhenReady();
		}
	});

	registerContextualInstanceAction({
		id: TerminalCommandId.MoveToEditor,
		title: terminalStrings.moveToEditor,
		precondition: sharedWhenClause.terminalAvailable_and_opened,
		activeInstanceType: 'view',
		run: (instance, c) => c.service.moveToEditor(instance),
		runAfter: (instances) => instances.at(-1)?.focus()
	});

	registerContextualInstanceAction({
		id: TerminalCommandId.MoveIntoNewWindow,
		title: terminalStrings.moveIntoNewWindow,
		precondition: sharedWhenClause.terminalAvailable_and_opened,
		run: (instance, c) => c.service.moveIntoNewEditor(instance),
		runAfter: (instances) => instances.at(-1)?.focus()
	});

	registerTerminalAction({
		id: TerminalCommandId.MoveToTerminalPanel,
		title: terminalStrings.moveToTerminalPanel,
		precondition: sharedWhenClause.terminalAvailable_and_editorActive,
		run: (c, _, args) => {
			const source = toOptionalUri(args) ?? c.editorService.activeInstance;
			if (source) {
				c.service.moveToTerminalView(source);
			}
		}
	});

	registerTerminalAction({
		id: TerminalCommandId.FocusPreviousPane,
		title: localize2('workbench.action.terminal.focusPreviousPane', 'Focus Previous Terminal in Terminal Group'),
		keybinding: {
			primary: KeyMod.Alt | KeyCode.LeftArrow,
			secondary: [KeyMod.Alt | KeyCode.UpArrow],
			mac: {
				primary: KeyMod.Alt | KeyMod.CtrlCmd | KeyCode.LeftArrow,
				secondary: [KeyMod.Alt | KeyMod.CtrlCmd | KeyCode.UpArrow]
			},
			when: ContextKeyExpr.and(TerminalContextKeys.focus, TerminalContextKeys.splitTerminalActive),
			// Should win over send sequence commands https://github.com/microsoft/vscode/issues/259326
			weight: KeybindingWeight.WorkbenchContrib + 1
		},
		precondition: sharedWhenClause.terminalAvailable,
		run: async (c) => {
			c.groupService.activeGroup?.focusPreviousPane();
			await c.groupService.showPanel(true);
		}
	});

	registerTerminalAction({
		id: TerminalCommandId.FocusNextPane,
		title: localize2('workbench.action.terminal.focusNextPane', 'Focus Next Terminal in Terminal Group'),
		keybinding: {
			primary: KeyMod.Alt | KeyCode.RightArrow,
			secondary: [KeyMod.Alt | KeyCode.DownArrow],
			mac: {
				primary: KeyMod.Alt | KeyMod.CtrlCmd | KeyCode.RightArrow,
				secondary: [KeyMod.Alt | KeyMod.CtrlCmd | KeyCode.DownArrow]
			},
			when: ContextKeyExpr.and(TerminalContextKeys.focus, TerminalContextKeys.splitTerminalActive),
			// Should win over send sequence commands https://github.com/microsoft/vscode/issues/259326
			weight: KeybindingWeight.WorkbenchContrib + 1
		},
		precondition: sharedWhenClause.terminalAvailable,
		run: async (c) => {
			c.groupService.activeGroup?.focusNextPane();
			await c.groupService.showPanel(true);
		}
	});

	registerTerminalAction({
		id: TerminalCommandId.ResizePaneLeft,
		title: localize2('workbench.action.terminal.resizePaneLeft', 'Resize Terminal Left'),
		keybinding: {
			linux: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.LeftArrow },
			mac: { primary: KeyMod.CtrlCmd | KeyMod.WinCtrl | KeyCode.LeftArrow },
			when: TerminalContextKeys.focus,
			weight: KeybindingWeight.WorkbenchContrib
		},
		precondition: sharedWhenClause.terminalAvailable,
		run: (c) => c.groupService.activeGroup?.resizePane(Direction.Left)
	});

	registerTerminalAction({
		id: TerminalCommandId.ResizePaneRight,
		title: localize2('workbench.action.terminal.resizePaneRight', 'Resize Terminal Right'),
		keybinding: {
			linux: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.RightArrow },
			mac: { primary: KeyMod.CtrlCmd | KeyMod.WinCtrl | KeyCode.RightArrow },
			when: TerminalContextKeys.focus,
			weight: KeybindingWeight.WorkbenchContrib
		},
		precondition: sharedWhenClause.terminalAvailable,
		run: (c) => c.groupService.activeGroup?.resizePane(Direction.Right)
	});

	registerTerminalAction({
		id: TerminalCommandId.ResizePaneUp,
		title: localize2('workbench.action.terminal.resizePaneUp', 'Resize Terminal Up'),
		keybinding: {
			mac: { primary: KeyMod.CtrlCmd | KeyMod.WinCtrl | KeyCode.UpArrow },
			when: TerminalContextKeys.focus,
			weight: KeybindingWeight.WorkbenchContrib
		},
		precondition: sharedWhenClause.terminalAvailable,
		run: (c) => c.groupService.activeGroup?.resizePane(Direction.Up)
	});

	registerTerminalAction({
		id: TerminalCommandId.ResizePaneDown,
		title: localize2('workbench.action.terminal.resizePaneDown', 'Resize Terminal Down'),
		keybinding: {
			mac: { primary: KeyMod.CtrlCmd | KeyMod.WinCtrl | KeyCode.DownArrow },
			when: TerminalContextKeys.focus,
			weight: KeybindingWeight.WorkbenchContrib
		},
		precondition: sharedWhenClause.terminalAvailable,
		run: (c) => c.groupService.activeGroup?.resizePane(Direction.Down)
	});

	registerTerminalAction({
		id: TerminalCommandId.Focus,
		title: terminalStrings.focus,
		keybinding: {
			when: ContextKeyExpr.and(CONTEXT_ACCESSIBILITY_MODE_ENABLED, accessibleViewOnLastLine, accessibleViewCurrentProviderId.isEqualTo(AccessibleViewProviderId.Terminal)),
			primary: KeyMod.CtrlCmd | KeyCode.DownArrow,
			weight: KeybindingWeight.WorkbenchContrib
		},
		precondition: sharedWhenClause.terminalAvailable,
		run: async (c) => {
			const instance = c.service.activeInstance || await c.service.createTerminal({ location: TerminalLocation.Panel });
			if (!instance) {
				return;
			}
			c.service.setActiveInstance(instance);
			focusActiveTerminal(instance, c);
		}
	});

	registerTerminalAction({
		id: TerminalCommandId.FocusTabs,
		title: localize2('workbench.action.terminal.focus.tabsView', 'Focus Terminal Tabs View'),
		keybinding: {
			primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Backslash,
			weight: KeybindingWeight.WorkbenchContrib,
			when: ContextKeyExpr.or(TerminalContextKeys.tabsFocus, TerminalContextKeys.focus),
		},
		precondition: sharedWhenClause.terminalAvailable,
		run: (c) => c.groupService.focusTabs()
	});

	registerTerminalAction({
		id: TerminalCommandId.FocusNext,
		title: localize2('workbench.action.terminal.focusNext', 'Focus Next Terminal Group'),
		precondition: sharedWhenClause.terminalAvailable,
		keybinding: {
			primary: KeyMod.CtrlCmd | KeyCode.PageDown,
			mac: {
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.BracketRight
			},
			when: ContextKeyExpr.and(TerminalContextKeys.focus, TerminalContextKeys.editorFocus.negate()),
			weight: KeybindingWeight.WorkbenchContrib
		},
		run: async (c) => {
			c.groupService.setActiveGroupToNext();
			await c.groupService.showPanel(true);
		}
	});

	registerTerminalAction({
		id: TerminalCommandId.FocusPrevious,
		title: localize2('workbench.action.terminal.focusPrevious', 'Focus Previous Terminal Group'),
		precondition: sharedWhenClause.terminalAvailable,
		keybinding: {
			primary: KeyMod.CtrlCmd | KeyCode.PageUp,
			mac: {
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.BracketLeft
			},
			when: ContextKeyExpr.and(TerminalContextKeys.focus, TerminalContextKeys.editorFocus.negate()),
			weight: KeybindingWeight.WorkbenchContrib
		},
		run: async (c) => {
			c.groupService.setActiveGroupToPrevious();
			await c.groupService.showPanel(true);
		}
	});

	registerTerminalAction({
		id: TerminalCommandId.RunSelectedText,
		title: localize2('workbench.action.terminal.runSelectedText', 'Run Selected Text In Active Terminal'),
		run: async (c, accessor) => {
			const codeEditorService = accessor.get(ICodeEditorService);
			const editor = codeEditorService.getActiveCodeEditor();
			if (!editor || !editor.hasModel()) {
				return;
			}
			const instance = await c.service.getActiveOrCreateInstance({ acceptsInput: true });
			const selection = editor.getSelection();
			let text: string;
			if (selection.isEmpty()) {
				text = editor.getModel().getLineContent(selection.selectionStartLineNumber).trim();
			} else {
				const endOfLinePreference = isWindows ? EndOfLinePreference.LF : EndOfLinePreference.CRLF;
				text = editor.getModel().getValueInRange(selection, endOfLinePreference);
			}
			instance.sendText(text, true, true);
			await c.service.revealActiveTerminal(true);
		}
	});

	registerTerminalAction({
		id: TerminalCommandId.RunActiveFile,
		title: localize2('workbench.action.terminal.runActiveFile', 'Run Active File In Active Terminal'),
		precondition: sharedWhenClause.terminalAvailable,
		run: async (c, accessor) => {
			const codeEditorService = accessor.get(ICodeEditorService);
			const notificationService = accessor.get(INotificationService);
			const workbenchEnvironmentService = accessor.get(IWorkbenchEnvironmentService);

			const editor = codeEditorService.getActiveCodeEditor();
			if (!editor || !editor.hasModel()) {
				return;
			}

			const instance = await c.service.getActiveOrCreateInstance({ acceptsInput: true });
			const isRemote = instance ? instance.hasRemoteAuthority : (workbenchEnvironmentService.remoteAuthority ? true : false);
			const uri = editor.getModel().uri;
			if ((!isRemote && uri.scheme !== Schemas.file && uri.scheme !== Schemas.vscodeUserData) || (isRemote && uri.scheme !== Schemas.vscodeRemote)) {
				notificationService.warn(localize('workbench.action.terminal.runActiveFile.noFile', 'Only files on disk can be run in the terminal'));
				return;
			}

			// TODO: Convert this to ctrl+c, ctrl+v for pwsh?
			await instance.sendPath(uri, true);
			return c.groupService.showPanel();
		}
	});

	registerActiveXtermAction({
		id: TerminalCommandId.ScrollDownLine,
		title: localize2('workbench.action.terminal.scrollDown', 'Scroll Down (Line)'),
		keybinding: {
			primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.PageDown,
			linux: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.DownArrow },
			when: sharedWhenClause.focusInAny_and_normalBuffer,
			weight: KeybindingWeight.WorkbenchContrib
		},
		precondition: sharedWhenClause.terminalAvailable,
		run: (xterm) => xterm.scrollDownLine()
	});

	registerActiveXtermAction({
		id: TerminalCommandId.ScrollDownPage,
		title: localize2('workbench.action.terminal.scrollDownPage', 'Scroll Down (Page)'),
		keybinding: {
			primary: KeyMod.Shift | KeyCode.PageDown,
			mac: { primary: KeyCode.PageDown },
			when: sharedWhenClause.focusInAny_and_normalBuffer,
			weight: KeybindingWeight.WorkbenchContrib
		},
		precondition: sharedWhenClause.terminalAvailable,
		run: (xterm) => xterm.scrollDownPage()
	});

	registerActiveXtermAction({
		id: TerminalCommandId.ScrollToBottom,
		title: localize2('workbench.action.terminal.scrollToBottom', 'Scroll to Bottom'),
		keybinding: {
			primary: KeyMod.CtrlCmd | KeyCode.End,
			linux: { primary: KeyMod.Shift | KeyCode.End },
			when: sharedWhenClause.focusInAny_and_normalBuffer,
			weight: KeybindingWeight.WorkbenchContrib
		},
		precondition: sharedWhenClause.terminalAvailable,
		run: (xterm) => xterm.scrollToBottom()
	});

	registerActiveXtermAction({
		id: TerminalCommandId.ScrollUpLine,
		title: localize2('workbench.action.terminal.scrollUp', 'Scroll Up (Line)'),
		keybinding: {
			primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.PageUp,
			linux: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.UpArrow },
			when: sharedWhenClause.focusInAny_and_normalBuffer,
			weight: KeybindingWeight.WorkbenchContrib
		},
		precondition: sharedWhenClause.terminalAvailable,
		run: (xterm) => xterm.scrollUpLine()
	});

	registerActiveXtermAction({
		id: TerminalCommandId.ScrollUpPage,
		title: localize2('workbench.action.terminal.scrollUpPage', 'Scroll Up (Page)'),
		f1: true,
		keybinding: {
			primary: KeyMod.Shift | KeyCode.PageUp,
			mac: { primary: KeyCode.PageUp },
			when: sharedWhenClause.focusInAny_and_normalBuffer,
			weight: KeybindingWeight.WorkbenchContrib
		},
		precondition: sharedWhenClause.terminalAvailable,
		run: (xterm) => xterm.scrollUpPage()
	});

	registerActiveXtermAction({
		id: TerminalCommandId.ScrollToTop,
		title: localize2('workbench.action.terminal.scrollToTop', 'Scroll to Top'),
		keybinding: {
			primary: KeyMod.CtrlCmd | KeyCode.Home,
			linux: { primary: KeyMod.Shift | KeyCode.Home },
			when: sharedWhenClause.focusInAny_and_normalBuffer,
			weight: KeybindingWeight.WorkbenchContrib
		},
		precondition: sharedWhenClause.terminalAvailable,
		run: (xterm) => xterm.scrollToTop()
	});

	registerActiveXtermAction({
		id: TerminalCommandId.ClearSelection,
		title: localize2('workbench.action.terminal.clearSelection', 'Clear Selection'),
		keybinding: {
			primary: KeyCode.Escape,
			when: ContextKeyExpr.and(TerminalContextKeys.focusInAny, TerminalContextKeys.textSelected, TerminalContextKeys.notFindVisible),
			weight: KeybindingWeight.WorkbenchContrib
		},
		precondition: sharedWhenClause.terminalAvailable,
		run: (xterm) => {
			if (xterm.hasSelection()) {
				xterm.clearSelection();
			}
		}
	});

	registerTerminalAction({
		id: TerminalCommandId.ChangeIcon,
		title: terminalStrings.changeIcon,
		precondition: sharedWhenClause.terminalAvailable,
		run: (c, _, args: unknown) => getResourceOrActiveInstance(c, args)?.changeIcon()
	});

	registerTerminalAction({
		id: TerminalCommandId.ChangeIconActiveTab,
		title: terminalStrings.changeIcon,
		f1: false,
		precondition: sharedWhenClause.terminalAvailable_and_singularSelection,
		run: async (c, accessor, args) => {
			let icon: TerminalIcon | undefined;
			if (c.groupService.lastAccessedMenu === 'inline-tab') {
				getResourceOrActiveInstance(c, args)?.changeIcon();
				return;
			}
			for (const terminal of getSelectedViewInstances(accessor) ?? []) {
				icon = await terminal.changeIcon(icon);
			}
		}
	});

	registerTerminalAction({
		id: TerminalCommandId.ChangeColor,
		title: terminalStrings.changeColor,
		precondition: sharedWhenClause.terminalAvailable,
		run: (c, _, args) => getResourceOrActiveInstance(c, args)?.changeColor()
	});

	registerTerminalAction({
		id: TerminalCommandId.ChangeColorActiveTab,
		title: terminalStrings.changeColor,
		f1: false,
		precondition: sharedWhenClause.terminalAvailable_and_singularSelection,
		run: async (c, accessor, args) => {
			let color: string | undefined;
			let i = 0;
			if (c.groupService.lastAccessedMenu === 'inline-tab') {
				getResourceOrActiveInstance(c, args)?.changeColor();
				return;
			}
			for (const terminal of getSelectedViewInstances(accessor) ?? []) {
				const skipQuickPick = i !== 0;
				// Always show the quickpick on the first iteration
				color = await terminal.changeColor(color, skipQuickPick);
				i++;
			}
		}
	});

	registerTerminalAction({
		id: TerminalCommandId.Rename,
		title: terminalStrings.rename,
		precondition: sharedWhenClause.terminalAvailable,
		run: (c, accessor, args) => renameWithQuickPick(c, accessor, args)
	});

	registerTerminalAction({
		id: TerminalCommandId.RenameActiveTab,
		title: terminalStrings.rename,
		f1: false,
		keybinding: {
			primary: KeyCode.F2,
			mac: {
				primary: KeyCode.Enter
			},
			when: ContextKeyExpr.and(TerminalContextKeys.tabsFocus),
			weight: KeybindingWeight.WorkbenchContrib
		},
		precondition: sharedWhenClause.terminalAvailable_and_singularSelection,
		run: async (c, accessor) => {
			const terminalGroupService = accessor.get(ITerminalGroupService);
			const notificationService = accessor.get(INotificationService);
			const instances = getSelectedViewInstances(accessor);
			const firstInstance = instances?.[0];
			if (!firstInstance) {
				return;
			}

			if (terminalGroupService.lastAccessedMenu === 'inline-tab') {
				return renameWithQuickPick(c, accessor, firstInstance);
			}

			c.editingService.setEditingTerminal(firstInstance);
			c.editingService.setEditable(firstInstance, {
				validationMessage: value => validateTerminalName(value),
				onFinish: async (value, success) => {
					// Cancel editing first as instance.rename will trigger a rerender automatically
					c.editingService.setEditable(firstInstance, null);
					c.editingService.setEditingTerminal(undefined);
					if (success) {
						const promises: Promise<void>[] = [];
						for (const instance of instances) {
							promises.push((async () => {
								await instance.rename(value);
							})());
						}
						try {
							await Promise.all(promises);
						} catch (e) {
							notificationService.error(e);
						}
					}
				}
			});
		}
	});

	registerActiveInstanceAction({
		id: TerminalCommandId.DetachSession,
		title: localize2('workbench.action.terminal.detachSession', 'Detach Session'),
		run: (activeInstance) => activeInstance.detachProcessAndDispose(TerminalExitReason.User)
	});

	registerTerminalAction({
		id: TerminalCommandId.AttachToSession,
		title: localize2('workbench.action.terminal.attachToSession', 'Attach to Session'),
		run: async (c, accessor) => {
			const quickInputService = accessor.get(IQuickInputService);
			const labelService = accessor.get(ILabelService);
			const remoteAgentService = accessor.get(IRemoteAgentService);
			const notificationService = accessor.get(INotificationService);

			const remoteAuthority = remoteAgentService.getConnection()?.remoteAuthority ?? undefined;
			const backend = await accessor.get(ITerminalInstanceService).getBackend(remoteAuthority);

			if (!backend) {
				throw new Error(`No backend registered for remote authority '${remoteAuthority}'`);
			}

			const terms = await backend.listProcesses();

			backend.reduceConnectionGraceTime();

			const unattachedTerms = terms.filter(term => !c.service.isAttachedToTerminal(term));
			const items = unattachedTerms.map(term => {
				const cwdLabel = labelService.getUriLabel(URI.file(term.cwd));
				return {
					label: term.title,
					detail: term.workspaceName ? `${term.workspaceName} \u2E31 ${cwdLabel}` : cwdLabel,
					description: term.pid ? String(term.pid) : '',
					term
				};
			});
			if (items.length === 0) {
				notificationService.info(localize('noUnattachedTerminals', 'There are no unattached terminals to attach to'));
				return;
			}
			const selected = await quickInputService.pick<IRemoteTerminalPick>(items, { canPickMany: false });
			if (selected) {
				const instance = await c.service.createTerminal({
					config: { attachPersistentProcess: selected.term }
				});
				c.service.setActiveInstance(instance);
				await focusActiveTerminal(instance, c);
			}
		}
	});

	registerActiveInstanceAction({
		id: TerminalCommandId.ScrollToPreviousCommand,
		title: terminalStrings.scrollToPreviousCommand,
		keybinding: {
			primary: KeyMod.CtrlCmd | KeyCode.UpArrow,
			when: ContextKeyExpr.and(TerminalContextKeys.focus, CONTEXT_ACCESSIBILITY_MODE_ENABLED.negate()),
			weight: KeybindingWeight.WorkbenchContrib
		},
		precondition: sharedWhenClause.terminalAvailable,
		icon: Codicon.arrowUp,
		menu: [
			{
				id: MenuId.ViewTitle,
				group: 'navigation',
				order: 4,
				when: ContextKeyExpr.equals('view', TERMINAL_VIEW_ID),
				isHiddenByDefault: true
			},
			...[MenuId.EditorTitle, MenuId.CompactWindowEditorTitle].map(id => ({
				id,
				group: '1_shellIntegration',
				order: 4,
				when: ResourceContextKey.Scheme.isEqualTo(Schemas.vscodeTerminal),
				isHiddenByDefault: true
			})),
		],
		run: (activeInstance) => activeInstance.xterm?.markTracker.scrollToPreviousMark(undefined, undefined, activeInstance.capabilities.has(TerminalCapability.CommandDetection))
	});

	registerActiveInstanceAction({
		id: TerminalCommandId.ScrollToNextCommand,
		title: terminalStrings.scrollToNextCommand,
		keybinding: {
			primary: KeyMod.CtrlCmd | KeyCode.DownArrow,
			when: ContextKeyExpr.and(TerminalContextKeys.focus, CONTEXT_ACCESSIBILITY_MODE_ENABLED.negate()),
			weight: KeybindingWeight.WorkbenchContrib
		},
		precondition: sharedWhenClause.terminalAvailable,
		icon: Codicon.arrowDown,
		menu: [
			{
				id: MenuId.ViewTitle,
				group: 'navigation',
				order: 5,
				when: ContextKeyExpr.equals('view', TERMINAL_VIEW_ID),
				isHiddenByDefault: true
			},
			...[MenuId.EditorTitle, MenuId.CompactWindowEditorTitle].map(id => ({
				id,
				group: '1_shellIntegration',
				order: 5,
				when: ResourceContextKey.Scheme.isEqualTo(Schemas.vscodeTerminal),
				isHiddenByDefault: true
			})),
		],
		run: (activeInstance) => {
			activeInstance.xterm?.markTracker.scrollToNextMark();
			activeInstance.focus();
		}
	});

	registerActiveInstanceAction({
		id: TerminalCommandId.SelectToPreviousCommand,
		title: localize2('workbench.action.terminal.selectToPreviousCommand', 'Select to Previous Command'),
		keybinding: {
			primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.UpArrow,
			when: TerminalContextKeys.focus,
			weight: KeybindingWeight.WorkbenchContrib
		},
		precondition: sharedWhenClause.terminalAvailable,
		run: (activeInstance) => {
			activeInstance.xterm?.markTracker.selectToPreviousMark();
			activeInstance.focus();
		}
	});

	registerActiveInstanceAction({
		id: TerminalCommandId.SelectToNextCommand,
		title: localize2('workbench.action.terminal.selectToNextCommand', 'Select to Next Command'),
		keybinding: {
			primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.DownArrow,
			when: TerminalContextKeys.focus,
			weight: KeybindingWeight.WorkbenchContrib
		},
		precondition: sharedWhenClause.terminalAvailable,
		run: (activeInstance) => {
			activeInstance.xterm?.markTracker.selectToNextMark();
			activeInstance.focus();
		}
	});

	registerActiveXtermAction({
		id: TerminalCommandId.SelectToPreviousLine,
		title: localize2('workbench.action.terminal.selectToPreviousLine', 'Select to Previous Line'),
		precondition: sharedWhenClause.terminalAvailable,
		run: async (xterm, _, instance) => {
			xterm.markTracker.selectToPreviousLine();
			// prefer to call focus on the TerminalInstance for additional accessibility triggers
			(instance || xterm).focus();
		}
	});

	registerActiveXtermAction({
		id: TerminalCommandId.SelectToNextLine,
		title: localize2('workbench.action.terminal.selectToNextLine', 'Select to Next Line'),
		precondition: sharedWhenClause.terminalAvailable,
		run: async (xterm, _, instance) => {
			xterm.markTracker.selectToNextLine();
			// prefer to call focus on the TerminalInstance for additional accessibility triggers
			(instance || xterm).focus();
		}
	});

	registerTerminalAction({
		id: TerminalCommandId.NewWithCwd,
		title: terminalStrings.newWithCwd,
		metadata: {
			description: terminalStrings.newWithCwd.value,
			args: [{
				name: 'args',
				schema: {
					type: 'object',
					required: ['cwd'],
					properties: {
						cwd: {
							description: localize('workbench.action.terminal.newWithCwd.cwd', "The directory to start the terminal at"),
							type: 'string'
						}
					},
				}
			}]
		},
		run: async (c, _, args) => {
			const cwd = args ? toOptionalString((<{ cwd?: string }>args).cwd) : undefined;
			const instance = await c.service.createTerminal({ cwd });
			if (!instance) {
				return;
			}
			c.service.setActiveInstance(instance);
			await focusActiveTerminal(instance, c);
		}
	});

	registerActiveInstanceAction({
		id: TerminalCommandId.RenameWithArgs,
		title: terminalStrings.renameWithArgs,
		metadata: {
			description: terminalStrings.renameWithArgs.value,
			args: [{
				name: 'args',
				schema: {
					type: 'object',
					required: ['name'],
					properties: {
						name: {
							description: localize('workbench.action.terminal.renameWithArg.name', "The new name for the terminal"),
							type: 'string',
							minLength: 1
						}
					}
				}
			}]
		},
		precondition: sharedWhenClause.terminalAvailable,
		f1: false,
		run: async (activeInstance, c, accessor, args) => {
			const notificationService = accessor.get(INotificationService);
			const name = args ? toOptionalString((<{ name?: string }>args).name) : undefined;
			if (!name) {
				notificationService.warn(localize('workbench.action.terminal.renameWithArg.noName', "No name argument provided"));
				return;
			}
			activeInstance.rename(name);
		}
	});

	registerActiveInstanceAction({
		id: TerminalCommandId.Relaunch,
		title: localize2('workbench.action.terminal.relaunch', 'Relaunch Active Terminal'),
		run: (activeInstance) => activeInstance.relaunch()
	});

	registerTerminalAction({
		id: TerminalCommandId.Split,
		title: terminalStrings.split,
		precondition: ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.webExtensionContributedProfile),
		keybinding: {
			primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Digit5,
			weight: KeybindingWeight.WorkbenchContrib,
			mac: {
				primary: KeyMod.CtrlCmd | KeyCode.Backslash,
				secondary: [KeyMod.WinCtrl | KeyMod.Shift | KeyCode.Digit5]
			},
			when: TerminalContextKeys.focus
		},
		icon: Codicon.splitHorizontal,
		run: async (c, accessor, args) => {
			const optionsOrProfile = isObject(args) ? args as ICreateTerminalOptions | ITerminalProfile : undefined;
			const commandService = accessor.get(ICommandService);
			const workspaceContextService = accessor.get(IWorkspaceContextService);
			const options = convertOptionsOrProfileToOptions(optionsOrProfile);
			const activeInstance = (await c.service.getInstanceHost(options?.location)).activeInstance;
			if (!activeInstance) {
				return;
			}
			const cwd = await getCwdForSplit(activeInstance, workspaceContextService.getWorkspace().folders, commandService, c.configService);
			if (cwd === undefined) {
				return;
			}
			const instance = await c.service.createTerminal({ location: { parentTerminal: activeInstance }, config: options?.config, cwd });
			await focusActiveTerminal(instance, c);
		}
	});

	registerTerminalAction({
		id: TerminalCommandId.SplitActiveTab,
		title: terminalStrings.split,
		f1: false,
		keybinding: {
			primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Digit5,
			mac: {
				primary: KeyMod.CtrlCmd | KeyCode.Backslash,
				secondary: [KeyMod.WinCtrl | KeyMod.Shift | KeyCode.Digit5]
			},
			weight: KeybindingWeight.WorkbenchContrib,
			when: TerminalContextKeys.tabsFocus
		},
		run: async (c, accessor) => {
			const instances = getSelectedViewInstances(accessor);
			if (instances) {
				const promises: Promise<void>[] = [];
				for (const t of instances) {
					promises.push((async () => {
						await c.service.createTerminal({ location: { parentTerminal: t } });
						await c.groupService.showPanel(true);
					})());
				}
				await Promise.all(promises);
			}
		}
	});

	registerContextualInstanceAction({
		id: TerminalCommandId.Unsplit,
		title: terminalStrings.unsplit,
		precondition: sharedWhenClause.terminalAvailable,
		run: async (instance, c) => {
			const group = c.groupService.getGroupForInstance(instance);
			if (group && group?.terminalInstances.length > 1) {
				c.groupService.unsplitInstance(instance);
			}
		}
	});

	registerTerminalAction({
		id: TerminalCommandId.JoinActiveTab,
		title: localize2('workbench.action.terminal.joinInstance', 'Join Terminals'),
		precondition: ContextKeyExpr.and(sharedWhenClause.terminalAvailable, TerminalContextKeys.tabsSingularSelection.toNegated()),
		run: async (c, accessor) => {
			const instances = getSelectedViewInstances(accessor);
			if (instances && instances.length > 1) {
				c.groupService.joinInstances(instances);
			}
		}
	});

	registerTerminalAction({
		id: TerminalCommandId.Join,
		title: localize2('workbench.action.terminal.join', 'Join Terminals...'),
		precondition: sharedWhenClause.terminalAvailable,
		run: async (c, accessor) => {
			const themeService = accessor.get(IThemeService);
			const notificationService = accessor.get(INotificationService);
			const quickInputService = accessor.get(IQuickInputService);

			const picks: ITerminalQuickPickItem[] = [];
			if (c.groupService.instances.length <= 1) {
				notificationService.warn(localize('workbench.action.terminal.join.insufficientTerminals', 'Insufficient terminals for the join action'));
				return;
			}
			const otherInstances = c.groupService.instances.filter(i => i.instanceId !== c.groupService.activeInstance?.instanceId);
			for (const terminal of otherInstances) {
				const group = c.groupService.getGroupForInstance(terminal);
				if (group?.terminalInstances.length === 1) {
					const iconId = getIconId(accessor, terminal);
					const label = `$(${iconId}): ${terminal.title}`;
					const iconClasses: string[] = [];
					const colorClass = getColorClass(terminal);
					if (colorClass) {
						iconClasses.push(colorClass);
					}
					const uriClasses = getUriClasses(terminal, themeService.getColorTheme().type);
					if (uriClasses) {
						iconClasses.push(...uriClasses);
					}
					picks.push({
						terminal,
						label,
						iconClasses
					});
				}
			}
			if (picks.length === 0) {
				notificationService.warn(localize('workbench.action.terminal.join.onlySplits', 'All terminals are joined already'));
				return;
			}
			const result = await quickInputService.pick(picks, {});
			if (result) {
				c.groupService.joinInstances([result.terminal, c.groupService.activeInstance!]);
			}
		}
	});

	registerActiveInstanceAction({
		id: TerminalCommandId.SplitInActiveWorkspace,
		title: localize2('workbench.action.terminal.splitInActiveWorkspace', 'Split Terminal (In Active Workspace)'),
		run: async (instance, c) => {
			const newInstance = await c.service.createTerminal({ location: { parentTerminal: instance } });
			if (newInstance?.target !== TerminalLocation.Editor) {
				await c.groupService.showPanel(true);
			}
		}
	});

	registerActiveXtermAction({
		id: TerminalCommandId.SelectAll,
		title: localize2('workbench.action.terminal.selectAll', 'Select All'),
		precondition: sharedWhenClause.terminalAvailable,
		keybinding: [{
			// Don't use ctrl+a by default as that would override the common go to start
			// of prompt shell binding
			primary: 0,
			// Technically this doesn't need to be here as it will fall back to this
			// behavior anyway when handed to xterm.js, having this handled by VS Code
			// makes it easier for users to see how it works though.
			mac: { primary: KeyMod.CtrlCmd | KeyCode.KeyA },
			weight: KeybindingWeight.WorkbenchContrib,
			when: TerminalContextKeys.focusInAny
		}],
		run: (xterm) => xterm.selectAll()
	});

	registerTerminalAction({
		id: TerminalCommandId.New,
		title: localize2('workbench.action.terminal.new', 'Create New Terminal'),
		precondition: ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.webExtensionContributedProfile),
		icon: newTerminalIcon,
		keybinding: {
			primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Backquote,
			mac: { primary: KeyMod.WinCtrl | KeyMod.Shift | KeyCode.Backquote },
			weight: KeybindingWeight.WorkbenchContrib
		},
		run: async (c, accessor, args) => {
			let eventOrOptions = isObject(args) ? args as MouseEvent | ICreateTerminalOptions : undefined;
			const workspaceContextService = accessor.get(IWorkspaceContextService);
			const commandService = accessor.get(ICommandService);
			const editorGroupsService = accessor.get(IEditorGroupsService);
			const folders = workspaceContextService.getWorkspace().folders;
			if (eventOrOptions && isMouseEvent(eventOrOptions) && (eventOrOptions.altKey || eventOrOptions.ctrlKey)) {
				await c.service.createTerminal({ location: { splitActiveTerminal: true } });
				return;
			}

			if (c.service.isProcessSupportRegistered) {
				eventOrOptions = !eventOrOptions || isMouseEvent(eventOrOptions) ? {} : eventOrOptions;

				if (isAuxiliaryWindow(getActiveWindow()) && !eventOrOptions.location) {
					eventOrOptions.location = { viewColumn: editorGroupToColumn(editorGroupsService, editorGroupsService.activeGroup) };
				}

				let instance: ITerminalInstance | undefined;
				if (folders.length <= 1) {
					// Allow terminal service to handle the path when there is only a
					// single root
					instance = await c.service.createTerminal(eventOrOptions);
				} else {
					const cwd = (await pickTerminalCwd(accessor))?.cwd;
					if (!cwd) {
						// Don't create the instance if the workspace picker was canceled
						return;
					}
					eventOrOptions.cwd = cwd;
					instance = await c.service.createTerminal(eventOrOptions);
				}
				c.service.setActiveInstance(instance);
				await focusActiveTerminal(instance, c);
			} else {
				if (c.profileService.contributedProfiles.length > 0) {
					commandService.executeCommand(TerminalCommandId.NewWithProfile);
				} else {
					commandService.executeCommand(TerminalCommandId.Toggle);
				}
			}
		}
	});

	async function killInstance(c: ITerminalServicesCollection, instance: ITerminalInstance | undefined): Promise<void> {
		if (!instance) {
			return;
		}
		await c.service.safeDisposeTerminal(instance);
		if (c.groupService.instances.length > 0) {
			await c.groupService.showPanel(true);
		}
	}
	registerTerminalAction({
		id: TerminalCommandId.Kill,
		title: localize2('workbench.action.terminal.kill', 'Kill the Active Terminal Instance'),
		precondition: ContextKeyExpr.or(sharedWhenClause.terminalAvailable, TerminalContextKeys.isOpen),
		icon: killTerminalIcon,
		run: async (c) => killInstance(c, c.groupService.activeInstance)
	});
	registerTerminalAction({
		id: TerminalCommandId.KillViewOrEditor,
		title: terminalStrings.kill,
		f1: false, // This is an internal command used for context menus
		precondition: ContextKeyExpr.or(sharedWhenClause.terminalAvailable, TerminalContextKeys.isOpen),
		run: async (c) => killInstance(c, c.service.activeInstance)
	});

	registerTerminalAction({
		id: TerminalCommandId.KillAll,
		title: localize2('workbench.action.terminal.killAll', 'Kill All Terminals'),
		precondition: ContextKeyExpr.or(sharedWhenClause.terminalAvailable, TerminalContextKeys.isOpen),
		icon: Codicon.trash,
		run: async (c) => {
			const disposePromises: Promise<void>[] = [];
			for (const instance of c.service.instances) {
				disposePromises.push(c.service.safeDisposeTerminal(instance));
			}
			await Promise.all(disposePromises);
		}
	});

	registerTerminalAction({
		id: TerminalCommandId.KillEditor,
		title: localize2('workbench.action.terminal.killEditor', 'Kill the Active Terminal in Editor Area'),
		precondition: sharedWhenClause.terminalAvailable,
		keybinding: {
			primary: KeyMod.CtrlCmd | KeyCode.KeyW,
			win: { primary: KeyMod.CtrlCmd | KeyCode.F4, secondary: [KeyMod.CtrlCmd | KeyCode.KeyW] },
			weight: KeybindingWeight.WorkbenchContrib,
			when: ContextKeyExpr.and(TerminalContextKeys.focus, TerminalContextKeys.editorFocus)
		},
		run: (c, accessor) => accessor.get(ICommandService).executeCommand(CLOSE_EDITOR_COMMAND_ID)
	});

	registerTerminalAction({
		id: TerminalCommandId.KillActiveTab,
		title: terminalStrings.kill,
		f1: false,
		precondition: ContextKeyExpr.or(sharedWhenClause.terminalAvailable, TerminalContextKeys.isOpen),
		keybinding: {
			primary: KeyCode.Delete,
			mac: {
				primary: KeyMod.CtrlCmd | KeyCode.Backspace,
				secondary: [KeyCode.Delete]
			},
			weight: KeybindingWeight.WorkbenchContrib,
			when: TerminalContextKeys.tabsFocus
		},
		run: async (c, accessor) => {
			const disposePromises: Promise<void>[] = [];
			for (const terminal of getSelectedViewInstances(accessor, true) ?? []) {
				disposePromises.push(c.service.safeDisposeTerminal(terminal));
			}
			await Promise.all(disposePromises);
			c.groupService.focusTabs();
		}
	});

	registerTerminalAction({
		id: TerminalCommandId.FocusHover,
		title: terminalStrings.focusHover,
		precondition: ContextKeyExpr.or(sharedWhenClause.terminalAvailable, TerminalContextKeys.isOpen),
		keybinding: {
			primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyI),
			weight: KeybindingWeight.WorkbenchContrib,
			when: ContextKeyExpr.or(TerminalContextKeys.tabsFocus, TerminalContextKeys.focus)
		},
		run: (c) => c.groupService.focusHover()
	});

	registerActiveInstanceAction({
		id: TerminalCommandId.Clear,
		title: localize2('workbench.action.terminal.clear', 'Clear'),
		precondition: sharedWhenClause.terminalAvailable,
		keybinding: [{
			primary: 0,
			mac: { primary: KeyMod.CtrlCmd | KeyCode.KeyK },
			// Weight is higher than work workbench contributions so the keybinding remains
			// highest priority when chords are registered afterwards
			weight: KeybindingWeight.WorkbenchContrib + 1,
			// Disable the keybinding when accessibility mode is enabled as chords include
			// important screen reader keybindings such as cmd+k, cmd+i to show the hover
			when: ContextKeyExpr.or(ContextKeyExpr.and(TerminalContextKeys.focus, CONTEXT_ACCESSIBILITY_MODE_ENABLED.negate()), ContextKeyExpr.and(CONTEXT_ACCESSIBILITY_MODE_ENABLED, accessibleViewIsShown, accessibleViewCurrentProviderId.isEqualTo(AccessibleViewProviderId.Terminal))),
		}],
		run: (activeInstance) => activeInstance.clearBuffer()
	});

	registerTerminalAction({
		id: TerminalCommandId.SelectDefaultProfile,
		title: localize2('workbench.action.terminal.selectDefaultShell', 'Select Default Profile'),
		run: (c) => c.service.showProfileQuickPick('setDefault')
	});

	registerTerminalAction({
		id: TerminalCommandId.ConfigureTerminalSettings,
		title: localize2('workbench.action.terminal.openSettings', 'Configure Terminal Settings'),
		precondition: sharedWhenClause.terminalAvailable,
		run: (c, accessor) => accessor.get(IPreferencesService).openSettings({ jsonEditor: false, query: '@feature:terminal' })
	});

	registerActiveInstanceAction({
		id: TerminalCommandId.SetDimensions,
		title: localize2('workbench.action.terminal.setFixedDimensions', 'Set Fixed Dimensions'),
		precondition: sharedWhenClause.terminalAvailable_and_opened,
		run: (activeInstance) => activeInstance.setFixedDimensions()
	});

	registerContextualInstanceAction({
		id: TerminalCommandId.SizeToContentWidth,
		title: terminalStrings.toggleSizeToContentWidth,
		precondition: sharedWhenClause.terminalAvailable_and_opened,
		keybinding: {
			primary: KeyMod.Alt | KeyCode.KeyZ,
			weight: KeybindingWeight.WorkbenchContrib,
			when: TerminalContextKeys.focus
		},
		run: (instance) => instance.toggleSizeToContentWidth()
	});

	registerTerminalAction({
		id: TerminalCommandId.SwitchTerminal,
		title: localize2('workbench.action.terminal.switchTerminal', 'Switch Terminal'),
		precondition: sharedWhenClause.terminalAvailable,
		run: async (c, accessor, args) => {
			const item = toOptionalString(args);
			if (!item) {
				return;
			}
			if (item === SeparatorSelectOption.text) {
				c.service.refreshActiveGroup();
				return;
			}
			if (item === switchTerminalShowTabsTitle) {
				accessor.get(IConfigurationService).updateValue(TerminalSettingId.TabsEnabled, true);
				return;
			}

			const terminalIndexRe = /^([0-9]+): /;
			const indexMatches = terminalIndexRe.exec(item);
			if (indexMatches) {
				c.groupService.setActiveGroupByIndex(Number(indexMatches[1]) - 1);
				return c.groupService.showPanel(true);
			}

			const quickSelectProfiles = c.profileService.availableProfiles;

			// Remove 'New ' from the selected item to get the profile name
			const profileSelection = item.substring(4);
			if (quickSelectProfiles) {
				const profile = quickSelectProfiles.find(profile => profile.profileName === profileSelection);
				if (profile) {
					const instance = await c.service.createTerminal({
						config: profile
					});
					c.service.setActiveInstance(instance);
				} else {
					console.warn(`No profile with name "${profileSelection}"`);
				}
			} else {
				console.warn(`Unmatched terminal item: "${item}"`);
			}
		}
	});
}

interface IRemoteTerminalPick extends IQuickPickItem {
	term: IRemoteTerminalAttachTarget;
}

function getSelectedViewInstances2(accessor: ServicesAccessor, args?: unknown): ITerminalInstance[] | undefined {
	const terminalService = accessor.get(ITerminalService);
	const result: ITerminalInstance[] = [];
	const context = parseActionArgs(args);
	if (context && context.length > 0) {
		for (const instanceContext of context) {
			const instance = terminalService.getInstanceFromId(instanceContext.instanceId);
			if (instance) {
				result.push(instance);
			}
		}
		if (result.length > 0) {
			return result;
		}
	}
	return undefined;
}

function getSelectedViewInstances(accessor: ServicesAccessor, args?: unknown, args2?: unknown): ITerminalInstance[] | undefined {
	const listService = accessor.get(IListService);
	const terminalGroupService = accessor.get(ITerminalGroupService);
	const result: ITerminalInstance[] = [];

	// Assign list only if it's an instance of TerminalTabList (#234791)
	const list = listService.lastFocusedList instanceof TerminalTabList ? listService.lastFocusedList : undefined;
	// Get selected tab list instance(s)
	const selections = list?.getSelection();
	// Get inline tab instance if there are not tab list selections #196578
	if (terminalGroupService.lastAccessedMenu === 'inline-tab' && !selections?.length) {
		const instance = terminalGroupService.activeInstance;
		return instance ? [terminalGroupService.activeInstance] : undefined;
	}

	if (!list || !selections) {
		return undefined;
	}
	const focused = list.getFocus();

	const viewInstances = terminalGroupService.instances;
	if (focused.length === 1 && !selections.includes(focused[0])) {
		// focused length is always a max of 1
		// if the focused one is not in the selected list, return that item
		result.push(viewInstances[focused[0]]);
		return result;
	}

	// multi-select
	for (const selection of selections) {
		result.push(viewInstances[selection]);
	}
	return result.filter(r => !!r);
}

export function validateTerminalName(name: string): { content: string; severity: Severity } | null {
	if (!name || name.trim().length === 0) {
		return {
			content: localize('emptyTerminalNameInfo', "Providing no name will reset it to the default value"),
			severity: Severity.Info
		};
	}

	return null;
}

function isTerminalProfile(obj: unknown): obj is ITerminalProfile {
	return isObject(obj) && 'profileName' in obj;
}

function convertOptionsOrProfileToOptions(optionsOrProfile?: ICreateTerminalOptions | ITerminalProfile): ICreateTerminalOptions | undefined {
	if (isTerminalProfile(optionsOrProfile)) {
		return { config: optionsOrProfile, location: (optionsOrProfile as ICreateTerminalOptions).location };
	}
	return optionsOrProfile;
}

let newWithProfileAction: IDisposable;

export function refreshTerminalActions(detectedProfiles: ITerminalProfile[]): IDisposable {
	const profileEnum = createProfileSchemaEnums(detectedProfiles);
	newWithProfileAction?.dispose();
	// TODO: Use new register function
	newWithProfileAction = registerAction2(class extends Action2 {
		constructor() {
			super({
				id: TerminalCommandId.NewWithProfile,
				title: localize2('workbench.action.terminal.newWithProfile', 'Create New Terminal (With Profile)'),
				f1: true,
				precondition: ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.webExtensionContributedProfile),
				metadata: {
					description: TerminalCommandId.NewWithProfile,
					args: [{
						name: 'args',
						schema: {
							type: 'object',
							required: ['profileName'],
							properties: {
								profileName: {
									description: localize('workbench.action.terminal.newWithProfile.profileName', "The name of the profile to create"),
									type: 'string',
									enum: profileEnum.values,
									markdownEnumDescriptions: profileEnum.markdownDescriptions
								},
								location: {
									description: localize('newWithProfile.location', "Where to create the terminal"),
									type: 'string',
									enum: ['view', 'editor'],
									enumDescriptions: [
										localize('newWithProfile.location.view', 'Create the terminal in the terminal view'),
										localize('newWithProfile.location.editor', 'Create the terminal in the editor'),
									]
								}
							}
						}
					}]
				},
			});
		}
		async run(
			accessor: ServicesAccessor,
			eventOrOptionsOrProfile: MouseEvent | ICreateTerminalOptions | ITerminalProfile | { profileName: string; location?: 'view' | 'editor' | unknown } | undefined,
			profile?: ITerminalProfile
		) {
			const c = getTerminalServices(accessor);
			const workspaceContextService = accessor.get(IWorkspaceContextService);
			const commandService = accessor.get(ICommandService);

			let event: MouseEvent | PointerEvent | KeyboardEvent | undefined;
			let options: ICreateTerminalOptions | undefined;
			let instance: ITerminalInstance | undefined;
			let cwd: string | URI | undefined;

			if (isObject(eventOrOptionsOrProfile) && eventOrOptionsOrProfile && hasKey(eventOrOptionsOrProfile, { profileName: true })) {
				const config = c.profileService.availableProfiles.find(profile => profile.profileName === eventOrOptionsOrProfile.profileName);
				if (!config) {
					throw new Error(`Could not find terminal profile "${eventOrOptionsOrProfile.profileName}"`);
				}
				options = { config };
				function isSimpleArgs(obj: unknown): obj is { profileName: string; location?: 'view' | 'editor' | unknown } {
					return isObject(obj) && 'location' in obj;
				}
				if (isSimpleArgs(eventOrOptionsOrProfile)) {
					switch (eventOrOptionsOrProfile.location) {
						case 'editor': options.location = TerminalLocation.Editor; break;
						case 'view': options.location = TerminalLocation.Panel; break;
					}
				}
			} else if (isMouseEvent(eventOrOptionsOrProfile) || isPointerEvent(eventOrOptionsOrProfile) || isKeyboardEvent(eventOrOptionsOrProfile)) {
				event = eventOrOptionsOrProfile;
				options = profile ? { config: profile } : undefined;
			} else {
				options = convertOptionsOrProfileToOptions(eventOrOptionsOrProfile);
			}

			// split terminal
			if (event && (event.altKey || event.ctrlKey)) {
				const parentTerminal = c.service.activeInstance;
				if (parentTerminal) {
					await c.service.createTerminal({ location: { parentTerminal }, config: options?.config });
					return;
				}
			}

			const folders = workspaceContextService.getWorkspace().folders;
			if (folders.length > 1) {
				// multi-root workspace, create root picker
				const options: IPickOptions<IQuickPickItem> = {
					placeHolder: localize('workbench.action.terminal.newWorkspacePlaceholder', "Select current working directory for new terminal")
				};
				const workspace = await commandService.executeCommand<IWorkspaceFolder>(PICK_WORKSPACE_FOLDER_COMMAND_ID, [options]);
				if (!workspace) {
					// Don't create the instance if the workspace picker was canceled
					return;
				}
				cwd = workspace.uri;
			}

			if (options) {
				options.cwd = cwd;
				instance = await c.service.createTerminal(options);
			} else {
				instance = await c.service.showProfileQuickPick('createInstance', cwd);
			}

			if (instance) {
				c.service.setActiveInstance(instance);
				await focusActiveTerminal(instance, c);
			}
		}
	});
	return newWithProfileAction;
}

function getResourceOrActiveInstance(c: ITerminalServicesCollection, resource: unknown): ITerminalInstance | undefined {
	return c.service.getInstanceFromResource(toOptionalUri(resource)) || c.service.activeInstance;
}

async function pickTerminalCwd(accessor: ServicesAccessor, cancel?: CancellationToken): Promise<WorkspaceFolderCwdPair | undefined> {
	const quickInputService = accessor.get(IQuickInputService);
	const labelService = accessor.get(ILabelService);
	const contextService = accessor.get(IWorkspaceContextService);
	const modelService = accessor.get(IModelService);
	const languageService = accessor.get(ILanguageService);
	const configurationService = accessor.get(IConfigurationService);
	const configurationResolverService = accessor.get(IConfigurationResolverService);

	const folders = contextService.getWorkspace().folders;
	if (!folders.length) {
		return;
	}

	const folderCwdPairs = await Promise.all(folders.map(e => resolveWorkspaceFolderCwd(e, configurationService, configurationResolverService)));
	const shrinkedPairs = shrinkWorkspaceFolderCwdPairs(folderCwdPairs);

	if (shrinkedPairs.length === 1) {
		return shrinkedPairs[0];
	}

	type Item = IQuickPickItem & { pair: WorkspaceFolderCwdPair };
	const folderPicks: Item[] = shrinkedPairs.map(pair => {
		const label = pair.folder.name;
		const description = pair.isOverridden
			? localize('workbench.action.terminal.overriddenCwdDescription', "(Overriden) {0}", labelService.getUriLabel(pair.cwd, { relative: !pair.isAbsolute }))
			: labelService.getUriLabel(dirname(pair.cwd), { relative: true });

		return {
			label,
			description: description !== label ? description : undefined,
			pair: pair,
			iconClasses: getIconClasses(modelService, languageService, pair.cwd, FileKind.ROOT_FOLDER)
		};
	});
	const options: IPickOptions<Item> = {
		placeHolder: localize('workbench.action.terminal.newWorkspacePlaceholder', "Select current working directory for new terminal"),
		matchOnDescription: true,
		canPickMany: false,
	};

	const token: CancellationToken = cancel || CancellationToken.None;
	const pick = await quickInputService.pick<Item>(folderPicks, options, token);
	return pick?.pair;
}

async function resolveWorkspaceFolderCwd(folder: IWorkspaceFolder, configurationService: IConfigurationService, configurationResolverService: IConfigurationResolverService): Promise<WorkspaceFolderCwdPair> {
	const cwdConfig = configurationService.getValue(TerminalSettingId.Cwd, { resource: folder.uri });
	if (!isString(cwdConfig) || cwdConfig.length === 0) {
		return { folder, cwd: folder.uri, isAbsolute: false, isOverridden: false };
	}

	const resolvedCwdConfig = await configurationResolverService.resolveAsync(folder, cwdConfig);
	return isAbsolute(resolvedCwdConfig) || resolvedCwdConfig.startsWith(ConfigurationResolverExpression.VARIABLE_LHS)
		? { folder, isAbsolute: true, isOverridden: true, cwd: URI.from({ ...folder.uri, path: resolvedCwdConfig }) }
		: { folder, isAbsolute: false, isOverridden: true, cwd: URI.joinPath(folder.uri, resolvedCwdConfig) };
}

/**
 * Drops repeated CWDs, if any, by keeping the one which best matches the workspace folder. It also preserves the original order.
 */
export function shrinkWorkspaceFolderCwdPairs(pairs: WorkspaceFolderCwdPair[]): WorkspaceFolderCwdPair[] {
	const map = new Map<string, WorkspaceFolderCwdPair>();
	for (const pair of pairs) {
		const key = pair.cwd.toString();
		const value = map.get(key);
		if (!value || key === pair.folder.uri.toString()) {
			map.set(key, pair);
		}
	}
	const selectedPairs = new Set(map.values());
	const selectedPairsInOrder = pairs.filter(x => selectedPairs.has(x));
	return selectedPairsInOrder;
}

async function focusActiveTerminal(instance: ITerminalInstance | undefined, c: ITerminalServicesCollection): Promise<void> {
	// TODO@meganrogge: Is this the right logic for when instance is undefined?
	if (instance?.target === TerminalLocation.Editor) {
		await c.editorService.revealActiveEditor();
		await instance.focusWhenReady(true);
	} else {
		await c.groupService.showPanel(true);
	}
}

async function renameWithQuickPick(c: ITerminalServicesCollection, accessor: ServicesAccessor, resource?: unknown) {
	let instance: ITerminalInstance | undefined = resource as ITerminalInstance;
	// Check if the 'instance' does not exist or if 'instance.rename' is not defined
	if (!instance || !instance?.rename) {
		// If not, obtain the resource instance using 'getResourceOrActiveInstance'
		instance = getResourceOrActiveInstance(c, resource);
	}

	if (instance) {
		const title = await accessor.get(IQuickInputService).input({
			value: instance.title,
			prompt: localize('workbench.action.terminal.rename.prompt', "Enter terminal name"),
		});
		if (title) {
			instance.rename(title);
		}
	}
}

function toOptionalUri(obj: unknown): URI | undefined {
	return URI.isUri(obj) ? obj : undefined;
}

function toOptionalString(obj: unknown): string | undefined {
	return isString(obj) ? obj : undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalCommands.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ITerminalGroupService } from './terminal.js';

export function setupTerminalCommands(): void {
	registerOpenTerminalAtIndexCommands();
}

function registerOpenTerminalAtIndexCommands(): void {
	for (let i = 0; i < 9; i++) {
		const terminalIndex = i;
		const visibleIndex = i + 1;

		KeybindingsRegistry.registerCommandAndKeybindingRule({
			id: `workbench.action.terminal.focusAtIndex${visibleIndex}`,
			weight: KeybindingWeight.WorkbenchContrib,
			when: undefined,
			primary: 0,
			handler: accessor => {
				accessor.get(ITerminalGroupService).setActiveInstanceByIndex(terminalIndex);
				return accessor.get(ITerminalGroupService).showPanel(true);
			}
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalConfigurationService.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalConfigurationService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { type IEditorOptions } from '../../../../editor/common/config/editorOptions.js';
import { EDITOR_FONT_DEFAULTS } from '../../../../editor/common/config/fontInfo.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ITerminalConfigurationService, LinuxDistro } from './terminal.js';
import type { IXtermCore } from './xterm-private.js';
import { DEFAULT_BOLD_FONT_WEIGHT, DEFAULT_FONT_WEIGHT, DEFAULT_LETTER_SPACING, DEFAULT_LINE_HEIGHT, FontWeight, ITerminalConfiguration, MAXIMUM_FONT_WEIGHT, MINIMUM_FONT_WEIGHT, MINIMUM_LETTER_SPACING, TERMINAL_CONFIG_SECTION, type ITerminalFont } from '../common/terminal.js';
import { isMacintosh } from '../../../../base/common/platform.js';
import { TerminalLocation, TerminalLocationConfigValue } from '../../../../platform/terminal/common/terminal.js';
import { isString } from '../../../../base/common/types.js';
import { clamp } from '../../../../base/common/numbers.js';

// #region TerminalConfigurationService

export class TerminalConfigurationService extends Disposable implements ITerminalConfigurationService {
	declare _serviceBrand: undefined;

	protected _fontMetrics: TerminalFontMetrics;

	protected _config!: Readonly<ITerminalConfiguration>;
	get config() { return this._config; }

	get defaultLocation(): TerminalLocation {
		if (this.config.defaultLocation === TerminalLocationConfigValue.Editor) {
			return TerminalLocation.Editor;
		}
		return TerminalLocation.Panel;
	}

	private readonly _onConfigChanged = new Emitter<void>();
	get onConfigChanged(): Event<void> { return this._onConfigChanged.event; }

	constructor(
		@IConfigurationService private readonly _configurationService: IConfigurationService,
	) {
		super();

		this._fontMetrics = this._register(new TerminalFontMetrics(this, this._configurationService));

		this._register(Event.runAndSubscribe(this._configurationService.onDidChangeConfiguration, e => {
			if (!e || e.affectsConfiguration(TERMINAL_CONFIG_SECTION)) {
				this._updateConfig();
			}
		}));
	}

	setPanelContainer(panelContainer: HTMLElement): void { return this._fontMetrics.setPanelContainer(panelContainer); }
	configFontIsMonospace(): boolean { return this._fontMetrics.configFontIsMonospace(); }
	getFont(w: Window, xtermCore?: IXtermCore, excludeDimensions?: boolean): ITerminalFont { return this._fontMetrics.getFont(w, xtermCore, excludeDimensions); }

	private _updateConfig(): void {
		const configValues = { ...this._configurationService.getValue<ITerminalConfiguration>(TERMINAL_CONFIG_SECTION) };
		configValues.fontWeight = this._normalizeFontWeight(configValues.fontWeight, DEFAULT_FONT_WEIGHT);
		configValues.fontWeightBold = this._normalizeFontWeight(configValues.fontWeightBold, DEFAULT_BOLD_FONT_WEIGHT);
		this._config = configValues;
		this._onConfigChanged.fire();
	}

	private _normalizeFontWeight(input: FontWeight, defaultWeight: FontWeight): FontWeight {
		if (input === 'normal' || input === 'bold') {
			return input;
		}
		return clampInt(input, MINIMUM_FONT_WEIGHT, MAXIMUM_FONT_WEIGHT, defaultWeight);
	}
}

// #endregion TerminalConfigurationService

// #region TerminalFontMetrics

const enum FontConstants {
	MinimumFontSize = 6,
	MaximumFontSize = 100,
}

export class TerminalFontMetrics extends Disposable {
	private _panelContainer: HTMLElement | undefined;
	private _charMeasureElement: HTMLElement | undefined;
	private _lastFontMeasurement: ITerminalFont | undefined;

	linuxDistro: LinuxDistro = LinuxDistro.Unknown;

	constructor(
		private readonly _terminalConfigurationService: ITerminalConfigurationService,
		private readonly _configurationService: IConfigurationService,
	) {
		super();
		this._register(toDisposable(() => this._charMeasureElement?.remove()));
	}

	setPanelContainer(panelContainer: HTMLElement): void {
		this._panelContainer = panelContainer;
	}

	configFontIsMonospace(): boolean {
		const fontSize = 15;
		const fontFamily = this._terminalConfigurationService.config.fontFamily || this._configurationService.getValue<IEditorOptions>('editor').fontFamily || EDITOR_FONT_DEFAULTS.fontFamily;
		const iRect = this._getBoundingRectFor('i', fontFamily, fontSize);
		const wRect = this._getBoundingRectFor('w', fontFamily, fontSize);

		// Check for invalid bounds, there is no reason to believe the font is not monospace
		if (!iRect || !wRect || !iRect.width || !wRect.width) {
			return true;
		}

		return iRect.width === wRect.width;
	}

	/**
	 * Gets the font information based on the terminal.integrated.fontFamily
	 * terminal.integrated.fontSize, terminal.integrated.lineHeight configuration properties
	 */
	getFont(w: Window, xtermCore?: IXtermCore, excludeDimensions?: boolean): ITerminalFont {
		const editorConfig = this._configurationService.getValue<IEditorOptions>('editor');

		let fontFamily = this._terminalConfigurationService.config.fontFamily || editorConfig.fontFamily || EDITOR_FONT_DEFAULTS.fontFamily || 'monospace';
		let fontSize = clampInt(this._terminalConfigurationService.config.fontSize, FontConstants.MinimumFontSize, FontConstants.MaximumFontSize, EDITOR_FONT_DEFAULTS.fontSize);

		// Work around bad font on Fedora/Ubuntu
		if (!this._terminalConfigurationService.config.fontFamily) {
			if (this.linuxDistro === LinuxDistro.Fedora) {
				fontFamily = '\'DejaVu Sans Mono\'';
			}
			if (this.linuxDistro === LinuxDistro.Ubuntu) {
				fontFamily = '\'Ubuntu Mono\'';

				// Ubuntu mono is somehow smaller, so set fontSize a bit larger to get the same perceived size.
				fontSize = clampInt(fontSize + 2, FontConstants.MinimumFontSize, FontConstants.MaximumFontSize, EDITOR_FONT_DEFAULTS.fontSize);
			}
		}

		// Always fallback to monospace, otherwise a proportional font may become the default
		fontFamily += ', monospace';

		// Always fallback to AppleBraille on macOS, otherwise braille will render with filled and
		// empty circles in all 8 positions, instead of just filled circles
		// See https://github.com/microsoft/vscode/issues/174521
		if (isMacintosh) {
			fontFamily += ', AppleBraille';
		}

		const letterSpacing = this._terminalConfigurationService.config.letterSpacing ? Math.max(Math.floor(this._terminalConfigurationService.config.letterSpacing), MINIMUM_LETTER_SPACING) : DEFAULT_LETTER_SPACING;
		const lineHeight = this._terminalConfigurationService.config.lineHeight ? Math.max(this._terminalConfigurationService.config.lineHeight, 1) : DEFAULT_LINE_HEIGHT;

		if (excludeDimensions) {
			return {
				fontFamily,
				fontSize,
				letterSpacing,
				lineHeight
			};
		}

		// Get the character dimensions from xterm if it's available
		if (xtermCore?._renderService?._renderer.value) {
			const cellDims = xtermCore._renderService.dimensions.css.cell;
			if (cellDims?.width && cellDims?.height) {
				return {
					fontFamily,
					fontSize,
					letterSpacing,
					lineHeight,
					charHeight: cellDims.height / lineHeight,
					charWidth: cellDims.width - Math.round(letterSpacing) / w.devicePixelRatio
				};
			}
		}

		// Fall back to measuring the font ourselves
		return this._measureFont(w, fontFamily, fontSize, letterSpacing, lineHeight);
	}

	private _createCharMeasureElementIfNecessary(): HTMLElement {
		if (!this._panelContainer) {
			throw new Error('Cannot measure element when terminal is not attached');
		}
		// Create charMeasureElement if it hasn't been created or if it was orphaned by its parent
		if (!this._charMeasureElement || !this._charMeasureElement.parentElement) {
			this._charMeasureElement = document.createElement('div');
			this._panelContainer.appendChild(this._charMeasureElement);
		}
		return this._charMeasureElement;
	}

	private _getBoundingRectFor(char: string, fontFamily: string, fontSize: number): ClientRect | DOMRect | undefined {
		let charMeasureElement: HTMLElement;
		try {
			charMeasureElement = this._createCharMeasureElementIfNecessary();
		} catch {
			return undefined;
		}
		const style = charMeasureElement.style;
		style.display = 'inline-block';
		style.fontFamily = fontFamily;
		style.fontSize = fontSize + 'px';
		style.lineHeight = 'normal';
		charMeasureElement.innerText = char;
		const rect = charMeasureElement.getBoundingClientRect();
		style.display = 'none';

		return rect;
	}

	private _measureFont(w: Window, fontFamily: string, fontSize: number, letterSpacing: number, lineHeight: number): ITerminalFont {
		const rect = this._getBoundingRectFor('X', fontFamily, fontSize);

		// Bounding client rect was invalid, use last font measurement if available.
		if (this._lastFontMeasurement && (!rect || !rect.width || !rect.height)) {
			return this._lastFontMeasurement;
		}

		this._lastFontMeasurement = {
			fontFamily,
			fontSize,
			letterSpacing,
			lineHeight,
			charWidth: 0,
			charHeight: 0
		};

		if (rect && rect.width && rect.height) {
			this._lastFontMeasurement.charHeight = Math.ceil(rect.height);
			// Char width is calculated differently for DOM and the other renderer types. Refer to
			// how each renderer updates their dimensions in xterm.js
			if (this._terminalConfigurationService.config.gpuAcceleration === 'off') {
				this._lastFontMeasurement.charWidth = rect.width;
			} else {
				const deviceCharWidth = Math.floor(rect.width * w.devicePixelRatio);
				const deviceCellWidth = deviceCharWidth + Math.round(letterSpacing);
				const cssCellWidth = deviceCellWidth / w.devicePixelRatio;
				this._lastFontMeasurement.charWidth = cssCellWidth - Math.round(letterSpacing) / w.devicePixelRatio;
			}
		}

		return this._lastFontMeasurement;
	}
}

// #endregion TerminalFontMetrics

// #region Utils

function clampInt<T>(source: string | number, minimum: number, maximum: number, fallback: T): number | T {
	if (source === null || source === undefined) {
		return fallback;
	}
	const r = isString(source) ? parseInt(source, 10) : source;
	if (isNaN(r)) {
		return fallback;
	}
	return clamp(r, minimum, maximum);
}
// #endregion Utils
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalContextMenu.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalContextMenu.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { StandardMouseEvent } from '../../../../base/browser/mouseEvent.js';
import { ActionRunner, IAction } from '../../../../base/common/actions.js';
import { asArray } from '../../../../base/common/arrays.js';
import { MarshalledId } from '../../../../base/common/marshallingIds.js';
import { SingleOrMany } from '../../../../base/common/types.js';
import { getFlatContextMenuActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IMenu } from '../../../../platform/actions/common/actions.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { ITerminalInstance } from './terminal.js';
import { ISerializedTerminalInstanceContext } from '../common/terminal.js';

/**
 * A context that is passed to actions as arguments to represent the terminal instance(s) being
 * acted upon.
 */
export class InstanceContext {
	readonly instanceId: number;

	constructor(instance: ITerminalInstance) {
		// Only store the instance to avoid contexts holding on to disposed instances.
		this.instanceId = instance.instanceId;
	}

	toJSON(): ISerializedTerminalInstanceContext {
		return {
			$mid: MarshalledId.TerminalContext,
			instanceId: this.instanceId
		};
	}
}

export class TerminalContextActionRunner extends ActionRunner {

	// eslint-disable-next-line @typescript-eslint/naming-convention
	protected override async runAction(action: IAction, context?: SingleOrMany<InstanceContext>): Promise<void> {
		if (Array.isArray(context) && context.every(e => e instanceof InstanceContext)) {
			// arg1: The (first) focused instance
			// arg2: All selected instances
			await action.run(context?.[0], context);
			return;
		}
		return super.runAction(action, context);
	}
}

export function openContextMenu(targetWindow: Window, event: MouseEvent, contextInstances: SingleOrMany<ITerminalInstance> | undefined, menu: IMenu, contextMenuService: IContextMenuService, extraActions?: IAction[]): void {
	const standardEvent = new StandardMouseEvent(targetWindow, event);

	const actions = getFlatContextMenuActions(menu.getActions({ shouldForwardArgs: true }));

	if (extraActions) {
		actions.push(...extraActions);
	}

	const context: InstanceContext[] = contextInstances ? asArray(contextInstances).map(e => new InstanceContext(e)) : [];

	const actionRunner = new TerminalContextActionRunner();
	contextMenuService.showContextMenu({
		actionRunner,
		getAnchor: () => standardEvent,
		getActions: () => actions,
		getActionsContext: () => context,
		onHide: () => actionRunner.dispose()
	});
}
```

--------------------------------------------------------------------------------

````
