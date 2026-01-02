---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 313
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 313 of 552)

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

---[FILE: src/vs/workbench/api/common/extHostTerminalService.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTerminalService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { Event, Emitter } from '../../../base/common/event.js';
import { ExtHostTerminalServiceShape, MainContext, MainThreadTerminalServiceShape, ITerminalDimensionsDto, ITerminalLinkDto, ExtHostTerminalIdentifier, ICommandDto, ITerminalQuickFixOpenerDto, ITerminalQuickFixTerminalCommandDto, TerminalCommandMatchResultDto, ITerminalCommandDto, ITerminalCompletionContextDto, TerminalCompletionListDto } from './extHost.protocol.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { URI } from '../../../base/common/uri.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import { IDisposable, DisposableStore, Disposable, MutableDisposable } from '../../../base/common/lifecycle.js';
import { Disposable as VSCodeDisposable, EnvironmentVariableMutatorType, TerminalExitReason, TerminalCompletionItem } from './extHostTypes.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { localize } from '../../../nls.js';
import { NotSupportedError } from '../../../base/common/errors.js';
import { serializeEnvironmentDescriptionMap, serializeEnvironmentVariableCollection } from '../../../platform/terminal/common/environmentVariableShared.js';
import { CancellationTokenSource } from '../../../base/common/cancellation.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { IEnvironmentVariableCollectionDescription, IEnvironmentVariableMutator, ISerializableEnvironmentVariableCollection } from '../../../platform/terminal/common/environmentVariable.js';
import { ICreateContributedTerminalProfileOptions, IProcessReadyEvent, IShellLaunchConfigDto, ITerminalChildProcess, ITerminalLaunchError, ITerminalProfile, TerminalIcon, TerminalLocation, IProcessProperty, ProcessPropertyType, IProcessPropertyMap, TerminalShellType, WindowsShellType } from '../../../platform/terminal/common/terminal.js';
import { TerminalDataBufferer } from '../../../platform/terminal/common/terminalDataBuffering.js';
import { ThemeColor } from '../../../base/common/themables.js';
import { Promises } from '../../../base/common/async.js';
import { EditorGroupColumn } from '../../services/editor/common/editorGroupColumn.js';
import { TerminalCompletionList, TerminalQuickFix, ViewColumn } from './extHostTypeConverters.js';
import { IExtHostCommands } from './extHostCommands.js';
import { MarshalledId } from '../../../base/common/marshallingIds.js';
import { ISerializedTerminalInstanceContext } from '../../contrib/terminal/common/terminal.js';
import { isWindows } from '../../../base/common/platform.js';
import { hasKey } from '../../../base/common/types.js';

export interface IExtHostTerminalService extends ExtHostTerminalServiceShape, IDisposable {

	readonly _serviceBrand: undefined;

	activeTerminal: vscode.Terminal | undefined;
	terminals: vscode.Terminal[];

	readonly onDidCloseTerminal: Event<vscode.Terminal>;
	readonly onDidOpenTerminal: Event<vscode.Terminal>;
	readonly onDidChangeActiveTerminal: Event<vscode.Terminal | undefined>;
	readonly onDidChangeTerminalDimensions: Event<vscode.TerminalDimensionsChangeEvent>;
	readonly onDidChangeTerminalState: Event<vscode.Terminal>;
	readonly onDidWriteTerminalData: Event<vscode.TerminalDataWriteEvent>;
	readonly onDidExecuteTerminalCommand: Event<vscode.TerminalExecutedCommand>;
	readonly onDidChangeShell: Event<string>;

	createTerminal(name?: string, shellPath?: string, shellArgs?: readonly string[] | string): vscode.Terminal;
	createTerminalFromOptions(options: vscode.TerminalOptions, internalOptions?: ITerminalInternalOptions): vscode.Terminal;
	createExtensionTerminal(options: vscode.ExtensionTerminalOptions): vscode.Terminal;
	attachPtyToTerminal(id: number, pty: vscode.Pseudoterminal): void;
	getDefaultShell(useAutomationShell: boolean): string;
	getDefaultShellArgs(useAutomationShell: boolean): string[] | string;
	registerLinkProvider(provider: vscode.TerminalLinkProvider): vscode.Disposable;
	registerProfileProvider(extension: IExtensionDescription, id: string, provider: vscode.TerminalProfileProvider): vscode.Disposable;
	registerTerminalQuickFixProvider(id: string, extensionId: string, provider: vscode.TerminalQuickFixProvider): vscode.Disposable;
	getEnvironmentVariableCollection(extension: IExtensionDescription): IEnvironmentVariableCollection;
	getTerminalById(id: number): ExtHostTerminal | null;
	getTerminalIdByApiObject(apiTerminal: vscode.Terminal): number | null;
	registerTerminalCompletionProvider(extension: IExtensionDescription, provider: vscode.TerminalCompletionProvider<vscode.TerminalCompletionItem>, ...triggerCharacters: string[]): vscode.Disposable;
}

interface IEnvironmentVariableCollection extends vscode.EnvironmentVariableCollection {
	getScoped(scope: vscode.EnvironmentVariableScope): vscode.EnvironmentVariableCollection;
}

export interface ITerminalInternalOptions {
	cwd?: string | URI;
	isFeatureTerminal?: boolean;
	forceShellIntegration?: boolean;
	useShellEnvironment?: boolean;
	resolvedExtHostIdentifier?: ExtHostTerminalIdentifier;
	/**
	 * This location is different from the API location because it can include splitActiveTerminal,
	 * a property we resolve internally
	 */
	location?: TerminalLocation | { viewColumn: number; preserveState?: boolean } | { splitActiveTerminal: boolean };
}

export const IExtHostTerminalService = createDecorator<IExtHostTerminalService>('IExtHostTerminalService');

export class ExtHostTerminal extends Disposable {
	private _disposed: boolean = false;
	private _pidPromise: Promise<number | undefined>;
	private _cols: number | undefined;
	private _pidPromiseComplete: ((value: number | undefined) => unknown) | undefined;
	private _rows: number | undefined;
	private _exitStatus: vscode.TerminalExitStatus | undefined;
	private _state: vscode.TerminalState = { isInteractedWith: false, shell: undefined };
	private _selection: string | undefined;

	shellIntegration: vscode.TerminalShellIntegration | undefined;

	public isOpen: boolean = false;

	readonly value: vscode.Terminal;

	protected readonly _onWillDispose = this._register(new Emitter<void>());
	readonly onWillDispose = this._onWillDispose.event;

	constructor(
		private _proxy: MainThreadTerminalServiceShape,
		public _id: ExtHostTerminalIdentifier,
		private readonly _creationOptions: vscode.TerminalOptions | vscode.ExtensionTerminalOptions,
		private _name?: string,
	) {
		super();

		this._creationOptions = Object.freeze(this._creationOptions);
		this._pidPromise = new Promise<number | undefined>(c => this._pidPromiseComplete = c);

		const that = this;
		this.value = {
			get name(): string {
				return that._name || '';
			},
			get processId(): Promise<number | undefined> {
				return that._pidPromise;
			},
			get creationOptions(): Readonly<vscode.TerminalOptions | vscode.ExtensionTerminalOptions> {
				return that._creationOptions;
			},
			get exitStatus(): vscode.TerminalExitStatus | undefined {
				return that._exitStatus;
			},
			get state(): vscode.TerminalState {
				return that._state;
			},
			get selection(): string | undefined {
				return that._selection;
			},
			get shellIntegration(): vscode.TerminalShellIntegration | undefined {
				return that.shellIntegration;
			},
			sendText(text: string, shouldExecute: boolean = true): void {
				that._checkDisposed();
				that._proxy.$sendText(that._id, text, shouldExecute);
			},
			show(preserveFocus: boolean): void {
				that._checkDisposed();
				that._proxy.$show(that._id, preserveFocus);
			},
			hide(): void {
				that._checkDisposed();
				that._proxy.$hide(that._id);
			},
			dispose(): void {
				if (!that._disposed) {
					that._disposed = true;
					that._proxy.$dispose(that._id);
				}
			},
			get dimensions(): vscode.TerminalDimensions | undefined {
				if (that._cols === undefined || that._rows === undefined) {
					return undefined;
				}
				return {
					columns: that._cols,
					rows: that._rows
				};
			}
		};
	}

	override dispose(): void {
		this._onWillDispose.fire();
		super.dispose();
	}

	public async create(
		options: vscode.TerminalOptions,
		internalOptions?: ITerminalInternalOptions,
	): Promise<void> {
		if (typeof this._id !== 'string') {
			throw new Error('Terminal has already been created');
		}
		await this._proxy.$createTerminal(this._id, {
			name: options.name,
			shellPath: options.shellPath ?? undefined,
			shellArgs: options.shellArgs ?? undefined,
			cwd: options.cwd ?? internalOptions?.cwd ?? undefined,
			env: options.env ?? undefined,
			icon: asTerminalIcon(options.iconPath) ?? undefined,
			color: ThemeColor.isThemeColor(options.color) ? options.color.id : undefined,
			initialText: options.message ?? undefined,
			strictEnv: options.strictEnv ?? undefined,
			hideFromUser: options.hideFromUser ?? undefined,
			forceShellIntegration: internalOptions?.forceShellIntegration ?? undefined,
			isFeatureTerminal: internalOptions?.isFeatureTerminal ?? undefined,
			isExtensionOwnedTerminal: true,
			useShellEnvironment: internalOptions?.useShellEnvironment ?? undefined,
			location: internalOptions?.location || this._serializeParentTerminal(options.location, internalOptions?.resolvedExtHostIdentifier),
			isTransient: options.isTransient ?? undefined,
			shellIntegrationNonce: options.shellIntegrationNonce ?? undefined,
		});
	}


	public async createExtensionTerminal(location?: TerminalLocation | vscode.TerminalEditorLocationOptions | vscode.TerminalSplitLocationOptions, internalOptions?: ITerminalInternalOptions, parentTerminal?: ExtHostTerminalIdentifier, iconPath?: TerminalIcon, color?: ThemeColor, shellIntegrationNonce?: string): Promise<number> {
		if (typeof this._id !== 'string') {
			throw new Error('Terminal has already been created');
		}
		await this._proxy.$createTerminal(this._id, {
			name: this._name,
			isExtensionCustomPtyTerminal: true,
			icon: iconPath,
			color: ThemeColor.isThemeColor(color) ? color.id : undefined,
			location: internalOptions?.location || this._serializeParentTerminal(location, parentTerminal),
			isTransient: true,
			shellIntegrationNonce: shellIntegrationNonce ?? undefined,
		});
		// At this point, the id has been set via `$acceptTerminalOpened`
		if (typeof this._id === 'string') {
			throw new Error('Terminal creation failed');
		}
		return this._id;
	}

	private _serializeParentTerminal(location?: TerminalLocation | vscode.TerminalEditorLocationOptions | vscode.TerminalSplitLocationOptions, parentTerminal?: ExtHostTerminalIdentifier): TerminalLocation | { viewColumn: EditorGroupColumn; preserveFocus?: boolean } | { parentTerminal: ExtHostTerminalIdentifier } | undefined {
		if (typeof location === 'object') {
			if (hasKey(location, { parentTerminal: true }) && location.parentTerminal && parentTerminal) {
				return { parentTerminal };
			}

			if (hasKey(location, { viewColumn: true })) {
				return { viewColumn: ViewColumn.from(location.viewColumn), preserveFocus: location.preserveFocus };
			}

			return undefined;
		}

		return location;
	}

	private _checkDisposed() {
		if (this._disposed) {
			throw new Error('Terminal has already been disposed');
		}
	}

	public set name(name: string) {
		this._name = name;
	}

	public setExitStatus(code: number | undefined, reason: TerminalExitReason) {
		this._exitStatus = Object.freeze({ code, reason });
	}

	public setDimensions(cols: number, rows: number): boolean {
		if (cols === this._cols && rows === this._rows) {
			// Nothing changed
			return false;
		}
		if (cols === 0 || rows === 0) {
			return false;
		}
		this._cols = cols;
		this._rows = rows;
		return true;
	}

	public setInteractedWith(): boolean {
		if (!this._state.isInteractedWith) {
			this._state = {
				...this._state,
				isInteractedWith: true
			};
			return true;
		}
		return false;
	}

	public setShellType(shellType: TerminalShellType | undefined): boolean {

		if (this._state.shell !== shellType) {
			this._state = {
				...this._state,
				shell: shellType
			};
			return true;
		}
		return false;
	}

	public setSelection(selection: string | undefined): void {
		this._selection = selection;
	}

	public _setProcessId(processId: number | undefined): void {
		// The event may fire 2 times when the panel is restored
		if (this._pidPromiseComplete) {
			this._pidPromiseComplete(processId);
			this._pidPromiseComplete = undefined;
		} else {
			// Recreate the promise if this is the nth processId set (e.g. reused task terminals)
			this._pidPromise.then(pid => {
				if (pid !== processId) {
					this._pidPromise = Promise.resolve(processId);
				}
			});
		}
	}
}

class ExtHostPseudoterminal implements ITerminalChildProcess {
	readonly id = 0;
	readonly shouldPersist = false;

	private readonly _onProcessData = new Emitter<string>();
	public readonly onProcessData: Event<string> = this._onProcessData.event;
	private readonly _onProcessReady = new Emitter<IProcessReadyEvent>();
	public get onProcessReady(): Event<IProcessReadyEvent> { return this._onProcessReady.event; }
	private readonly _onDidChangeProperty = new Emitter<IProcessProperty>();
	public readonly onDidChangeProperty = this._onDidChangeProperty.event;
	private readonly _onProcessExit = new Emitter<number | undefined>();
	public readonly onProcessExit: Event<number | undefined> = this._onProcessExit.event;

	constructor(private readonly _pty: vscode.Pseudoterminal) { }

	refreshProperty<T extends ProcessPropertyType>(property: ProcessPropertyType): Promise<IProcessPropertyMap[T]> {
		throw new Error(`refreshProperty is not suppported in extension owned terminals. property: ${property}`);
	}

	updateProperty<T extends ProcessPropertyType>(property: ProcessPropertyType, value: IProcessPropertyMap[T]): Promise<void> {
		throw new Error(`updateProperty is not suppported in extension owned terminals. property: ${property}, value: ${value}`);
	}

	async start(): Promise<undefined> {
		return undefined;
	}

	shutdown(): void {
		this._pty.close();
	}

	input(data: string): void {
		this._pty.handleInput?.(data);
	}

	sendSignal(signal: string): void {
		// Extension owned terminals don't support sending signals directly to processes
		// This could be extended in the future if the pseudoterminal API is enhanced
	}

	resize(cols: number, rows: number): void {
		this._pty.setDimensions?.({ columns: cols, rows });
	}

	clearBuffer(): void {
		// no-op
	}

	async processBinary(data: string): Promise<void> {
		// No-op, processBinary is not supported in extension owned terminals.
	}

	acknowledgeDataEvent(charCount: number): void {
		// No-op, flow control is not supported in extension owned terminals. If this is ever
		// implemented it will need new pause and resume VS Code APIs.
	}

	async setUnicodeVersion(version: '6' | '11'): Promise<void> {
		// No-op, xterm-headless isn't used for extension owned terminals.
	}

	getInitialCwd(): Promise<string> {
		return Promise.resolve('');
	}

	getCwd(): Promise<string> {
		return Promise.resolve('');
	}

	startSendingEvents(initialDimensions: ITerminalDimensionsDto | undefined): void {
		// Attach the listeners
		this._pty.onDidWrite(e => this._onProcessData.fire(e));
		this._pty.onDidClose?.((e: number | void = undefined) => {
			this._onProcessExit.fire(e === void 0 ? undefined : e);
		});
		this._pty.onDidOverrideDimensions?.(e => {
			if (e) {
				this._onDidChangeProperty.fire({ type: ProcessPropertyType.OverrideDimensions, value: { cols: e.columns, rows: e.rows } });
			}
		});
		this._pty.onDidChangeName?.(title => {
			this._onDidChangeProperty.fire({ type: ProcessPropertyType.Title, value: title });
		});

		this._pty.open(initialDimensions ? initialDimensions : undefined);

		if (initialDimensions) {
			this._pty.setDimensions?.(initialDimensions);
		}

		this._onProcessReady.fire({ pid: -1, cwd: '', windowsPty: undefined });
	}
}

let nextLinkId = 1;

interface ICachedLinkEntry {
	provider: vscode.TerminalLinkProvider;
	link: vscode.TerminalLink;
}

export abstract class BaseExtHostTerminalService extends Disposable implements IExtHostTerminalService, ExtHostTerminalServiceShape {

	readonly _serviceBrand: undefined;

	protected _proxy: MainThreadTerminalServiceShape;
	protected _activeTerminal: ExtHostTerminal | undefined;
	protected _terminals: ExtHostTerminal[] = [];
	protected _terminalProcesses: Map<number, ITerminalChildProcess> = new Map();
	protected _terminalProcessDisposables: { [id: number]: IDisposable } = {};
	protected _extensionTerminalAwaitingStart: { [id: number]: { initialDimensions: ITerminalDimensionsDto | undefined } | undefined } = {};
	protected _getTerminalPromises: { [id: number]: Promise<ExtHostTerminal | undefined> } = {};
	protected _environmentVariableCollections: Map<string, UnifiedEnvironmentVariableCollection> = new Map();
	private _defaultProfile: ITerminalProfile | undefined;
	private _defaultAutomationProfile: ITerminalProfile | undefined;
	private readonly _lastQuickFixCommands: MutableDisposable<IDisposable> = this._register(new MutableDisposable());

	private readonly _bufferer: TerminalDataBufferer;
	private readonly _linkProviders: Set<vscode.TerminalLinkProvider> = new Set();
	private readonly _completionProviders: Map<string, vscode.TerminalCompletionProvider<vscode.TerminalCompletionItem>> = new Map();
	private readonly _profileProviders: Map<string, vscode.TerminalProfileProvider> = new Map();
	private readonly _quickFixProviders: Map<string, vscode.TerminalQuickFixProvider> = new Map();
	private readonly _terminalLinkCache: Map<number, Map<number, ICachedLinkEntry>> = new Map();
	private readonly _terminalLinkCancellationSource: Map<number, CancellationTokenSource> = new Map();

	public get activeTerminal(): vscode.Terminal | undefined { return this._activeTerminal?.value; }
	public get terminals(): vscode.Terminal[] { return this._terminals.map(term => term.value); }

	protected readonly _onDidCloseTerminal = new Emitter<vscode.Terminal>();
	readonly onDidCloseTerminal = this._onDidCloseTerminal.event;
	protected readonly _onDidOpenTerminal = new Emitter<vscode.Terminal>();
	readonly onDidOpenTerminal = this._onDidOpenTerminal.event;
	protected readonly _onDidChangeActiveTerminal = new Emitter<vscode.Terminal | undefined>();
	readonly onDidChangeActiveTerminal = this._onDidChangeActiveTerminal.event;
	protected readonly _onDidChangeTerminalDimensions = new Emitter<vscode.TerminalDimensionsChangeEvent>();
	readonly onDidChangeTerminalDimensions = this._onDidChangeTerminalDimensions.event;
	protected readonly _onDidChangeTerminalState = new Emitter<vscode.Terminal>();
	readonly onDidChangeTerminalState = this._onDidChangeTerminalState.event;
	protected readonly _onDidChangeShell = new Emitter<string>();
	readonly onDidChangeShell = this._onDidChangeShell.event;

	protected readonly _onDidWriteTerminalData = new Emitter<vscode.TerminalDataWriteEvent>({
		onWillAddFirstListener: () => this._proxy.$startSendingDataEvents(),
		onDidRemoveLastListener: () => this._proxy.$stopSendingDataEvents()
	});
	readonly onDidWriteTerminalData = this._onDidWriteTerminalData.event;
	protected readonly _onDidExecuteCommand = new Emitter<vscode.TerminalExecutedCommand>({
		onWillAddFirstListener: () => this._proxy.$startSendingCommandEvents(),
		onDidRemoveLastListener: () => this._proxy.$stopSendingCommandEvents()
	});
	readonly onDidExecuteTerminalCommand = this._onDidExecuteCommand.event;

	constructor(
		supportsProcesses: boolean,
		@IExtHostCommands private readonly _extHostCommands: IExtHostCommands,
		@IExtHostRpcService extHostRpc: IExtHostRpcService
	) {
		super();
		this._proxy = extHostRpc.getProxy(MainContext.MainThreadTerminalService);
		this._bufferer = new TerminalDataBufferer(this._proxy.$sendProcessData);
		this._proxy.$registerProcessSupport(supportsProcesses);
		this._extHostCommands.registerArgumentProcessor({
			processArgument: arg => {
				const deserialize = (arg: ISerializedTerminalInstanceContext) => {
					return this.getTerminalById(arg.instanceId)?.value;
				};
				switch (arg?.$mid) {
					case MarshalledId.TerminalContext: return deserialize(arg);
					default: {
						// Do array transformation in place as this is a hot path
						if (Array.isArray(arg)) {
							for (let i = 0; i < arg.length; i++) {
								if (arg[i].$mid === MarshalledId.TerminalContext) {
									arg[i] = deserialize(arg[i]);
								} else {
									// Probably something else, so exit early
									break;
								}
							}
						}
						return arg;
					}
				}
			}
		});
		this._register({
			dispose: () => {
				for (const [_, terminalProcess] of this._terminalProcesses) {
					terminalProcess.shutdown(true);
				}
			}
		});
	}

	public abstract createTerminal(name?: string, shellPath?: string, shellArgs?: string[] | string): vscode.Terminal;
	public abstract createTerminalFromOptions(options: vscode.TerminalOptions, internalOptions?: ITerminalInternalOptions): vscode.Terminal;

	public getDefaultShell(useAutomationShell: boolean): string {
		const profile = useAutomationShell ? this._defaultAutomationProfile : this._defaultProfile;
		return profile?.path || '';
	}

	public getDefaultShellArgs(useAutomationShell: boolean): string[] | string {
		const profile = useAutomationShell ? this._defaultAutomationProfile : this._defaultProfile;
		return profile?.args || [];
	}

	public createExtensionTerminal(options: vscode.ExtensionTerminalOptions, internalOptions?: ITerminalInternalOptions): vscode.Terminal {
		const terminal = new ExtHostTerminal(this._proxy, generateUuid(), options, options.name);
		const p = new ExtHostPseudoterminal(options.pty);
		terminal.createExtensionTerminal(options.location, internalOptions, this._serializeParentTerminal(options, internalOptions).resolvedExtHostIdentifier, asTerminalIcon(options.iconPath), asTerminalColor(options.color), options.shellIntegrationNonce).then(id => {
			const disposable = this._setupExtHostProcessListeners(id, p);
			this._terminalProcessDisposables[id] = disposable;
		});
		this._terminals.push(terminal);
		return terminal.value;
	}

	protected _serializeParentTerminal(options: vscode.TerminalOptions, internalOptions?: ITerminalInternalOptions): ITerminalInternalOptions {
		internalOptions = internalOptions ? internalOptions : {};
		if (options.location && typeof options.location === 'object' && hasKey(options.location, { parentTerminal: true })) {
			const parentTerminal = options.location.parentTerminal;
			if (parentTerminal) {
				const parentExtHostTerminal = this._terminals.find(t => t.value === parentTerminal);
				if (parentExtHostTerminal) {
					internalOptions.resolvedExtHostIdentifier = parentExtHostTerminal._id;
				}
			}
		} else if (options.location && typeof options.location !== 'object') {
			internalOptions.location = options.location;
		} else if (internalOptions.location && typeof internalOptions.location === 'object' && hasKey(internalOptions.location, { splitActiveTerminal: true })) {
			internalOptions.location = { splitActiveTerminal: true };
		}
		return internalOptions;
	}

	public attachPtyToTerminal(id: number, pty: vscode.Pseudoterminal): void {
		const terminal = this.getTerminalById(id);
		if (!terminal) {
			throw new Error(`Cannot resolve terminal with id ${id} for virtual process`);
		}
		const p = new ExtHostPseudoterminal(pty);
		const disposable = this._setupExtHostProcessListeners(id, p);
		this._terminalProcessDisposables[id] = disposable;
	}

	public async $acceptActiveTerminalChanged(id: number | null): Promise<void> {
		const original = this._activeTerminal;
		if (id === null) {
			this._activeTerminal = undefined;
			if (original !== this._activeTerminal) {
				this._onDidChangeActiveTerminal.fire(this._activeTerminal);
			}
			return;
		}
		const terminal = this.getTerminalById(id);
		if (terminal) {
			this._activeTerminal = terminal;
			if (original !== this._activeTerminal) {
				this._onDidChangeActiveTerminal.fire(this._activeTerminal.value);
			}
		}
	}

	public async $acceptTerminalProcessData(id: number, data: string): Promise<void> {
		const terminal = this.getTerminalById(id);
		if (terminal) {
			this._onDidWriteTerminalData.fire({ terminal: terminal.value, data });
		}
	}

	public async $acceptTerminalDimensions(id: number, cols: number, rows: number): Promise<void> {
		const terminal = this.getTerminalById(id);
		if (terminal) {
			if (terminal.setDimensions(cols, rows)) {
				this._onDidChangeTerminalDimensions.fire({
					terminal: terminal.value,
					dimensions: terminal.value.dimensions as vscode.TerminalDimensions
				});
			}
		}
	}

	public async $acceptDidExecuteCommand(id: number, command: ITerminalCommandDto): Promise<void> {
		const terminal = this.getTerminalById(id);
		if (terminal) {
			this._onDidExecuteCommand.fire({ terminal: terminal.value, ...command });
		}
	}

	public async $acceptTerminalMaximumDimensions(id: number, cols: number, rows: number): Promise<void> {
		// Extension pty terminal only - when virtual process resize fires it means that the
		// terminal's maximum dimensions changed
		this._terminalProcesses.get(id)?.resize(cols, rows);
	}

	public async $acceptTerminalTitleChange(id: number, name: string): Promise<void> {
		const terminal = this.getTerminalById(id);
		if (terminal) {
			terminal.name = name;
		}
	}

	public async $acceptTerminalClosed(id: number, exitCode: number | undefined, exitReason: TerminalExitReason): Promise<void> {
		const index = this._getTerminalObjectIndexById(this._terminals, id);
		if (index !== null) {
			const terminal = this._terminals.splice(index, 1)[0];
			terminal.setExitStatus(exitCode, exitReason);
			this._onDidCloseTerminal.fire(terminal.value);
		}
	}

	public $acceptTerminalOpened(id: number, extHostTerminalId: string | undefined, name: string, shellLaunchConfigDto: IShellLaunchConfigDto): void {
		if (extHostTerminalId) {
			// Resolve with the renderer generated id
			const index = this._getTerminalObjectIndexById(this._terminals, extHostTerminalId);
			if (index !== null) {
				// The terminal has already been created (via createTerminal*), only fire the event
				this._terminals[index]._id = id;
				this._onDidOpenTerminal.fire(this.terminals[index]);
				this._terminals[index].isOpen = true;
				return;
			}
		}

		const creationOptions: vscode.TerminalOptions = {
			name: shellLaunchConfigDto.name,
			shellPath: shellLaunchConfigDto.executable,
			shellArgs: shellLaunchConfigDto.args,
			cwd: typeof shellLaunchConfigDto.cwd === 'string' ? shellLaunchConfigDto.cwd : URI.revive(shellLaunchConfigDto.cwd),
			env: shellLaunchConfigDto.env,
			hideFromUser: shellLaunchConfigDto.hideFromUser
		};
		const terminal = new ExtHostTerminal(this._proxy, id, creationOptions, name);
		this._terminals.push(terminal);
		this._onDidOpenTerminal.fire(terminal.value);
		terminal.isOpen = true;
	}

	public async $acceptTerminalProcessId(id: number, processId: number): Promise<void> {
		const terminal = this.getTerminalById(id);
		terminal?._setProcessId(processId);
	}

	public async $startExtensionTerminal(id: number, initialDimensions: ITerminalDimensionsDto | undefined): Promise<ITerminalLaunchError | undefined> {
		// Make sure the ExtHostTerminal exists so onDidOpenTerminal has fired before we call
		// Pseudoterminal.start
		const terminal = this.getTerminalById(id);
		if (!terminal) {
			return { message: localize('launchFail.idMissingOnExtHost', "Could not find the terminal with id {0} on the extension host", id) };
		}

		// Wait for onDidOpenTerminal to fire
		if (!terminal.isOpen) {
			await new Promise<void>(r => {
				// Ensure open is called after onDidOpenTerminal
				const listener = this.onDidOpenTerminal(async e => {
					if (e === terminal.value) {
						listener.dispose();
						r();
					}
				});
			});
		}

		const terminalProcess = this._terminalProcesses.get(id);
		if (terminalProcess) {
			(terminalProcess as ExtHostPseudoterminal).startSendingEvents(initialDimensions);
		} else {
			// Defer startSendingEvents call to when _setupExtHostProcessListeners is called
			this._extensionTerminalAwaitingStart[id] = { initialDimensions };
		}

		return undefined;
	}

	protected _setupExtHostProcessListeners(id: number, p: ITerminalChildProcess): IDisposable {
		const disposables = new DisposableStore();
		disposables.add(p.onProcessReady(e => this._proxy.$sendProcessReady(id, e.pid, e.cwd, e.windowsPty)));
		disposables.add(p.onDidChangeProperty(property => this._proxy.$sendProcessProperty(id, property)));

		// Buffer data events to reduce the amount of messages going to the renderer
		this._bufferer.startBuffering(id, p.onProcessData);
		disposables.add(p.onProcessExit(exitCode => this._onProcessExit(id, exitCode)));
		this._terminalProcesses.set(id, p);

		const awaitingStart = this._extensionTerminalAwaitingStart[id];
		if (awaitingStart && p instanceof ExtHostPseudoterminal) {
			p.startSendingEvents(awaitingStart.initialDimensions);
			delete this._extensionTerminalAwaitingStart[id];
		}

		return disposables;
	}

	public $acceptProcessAckDataEvent(id: number, charCount: number): void {
		this._terminalProcesses.get(id)?.acknowledgeDataEvent(charCount);
	}

	public $acceptProcessInput(id: number, data: string): void {
		this._terminalProcesses.get(id)?.input(data);
	}

	public $acceptTerminalInteraction(id: number): void {
		const terminal = this.getTerminalById(id);
		if (terminal?.setInteractedWith()) {
			this._onDidChangeTerminalState.fire(terminal.value);
		}
	}

	public $acceptTerminalSelection(id: number, selection: string | undefined): void {
		this.getTerminalById(id)?.setSelection(selection);
	}

	public $acceptProcessResize(id: number, cols: number, rows: number): void {
		try {
			this._terminalProcesses.get(id)?.resize(cols, rows);
		} catch (error) {
			// We tried to write to a closed pipe / channel.
			if (error.code !== 'EPIPE' && error.code !== 'ERR_IPC_CHANNEL_CLOSED') {
				throw (error);
			}
		}
	}

	public $acceptProcessShutdown(id: number, immediate: boolean): void {
		this._terminalProcesses.get(id)?.shutdown(immediate);
	}

	public $acceptProcessRequestInitialCwd(id: number): void {
		this._terminalProcesses.get(id)?.getInitialCwd().then(initialCwd => this._proxy.$sendProcessProperty(id, { type: ProcessPropertyType.InitialCwd, value: initialCwd }));
	}

	public $acceptProcessRequestCwd(id: number): void {
		this._terminalProcesses.get(id)?.getCwd().then(cwd => this._proxy.$sendProcessProperty(id, { type: ProcessPropertyType.Cwd, value: cwd }));
	}

	public $acceptProcessRequestLatency(id: number): Promise<number> {
		return Promise.resolve(id);
	}


	public registerProfileProvider(extension: IExtensionDescription, id: string, provider: vscode.TerminalProfileProvider): vscode.Disposable {
		if (this._profileProviders.has(id)) {
			throw new Error(`Terminal profile provider "${id}" already registered`);
		}
		this._profileProviders.set(id, provider);
		this._proxy.$registerProfileProvider(id, extension.identifier.value);
		return new VSCodeDisposable(() => {
			this._profileProviders.delete(id);
			this._proxy.$unregisterProfileProvider(id);
		});
	}

	public registerTerminalCompletionProvider(extension: IExtensionDescription, provider: vscode.TerminalCompletionProvider<TerminalCompletionItem>, ...triggerCharacters: string[]): vscode.Disposable {
		if (this._completionProviders.has(extension.identifier.value)) {
			throw new Error(`Terminal completion provider "${extension.identifier.value}" already registered`);
		}
		this._completionProviders.set(extension.identifier.value, provider);
		this._proxy.$registerCompletionProvider(extension.identifier.value, extension.identifier.value, ...triggerCharacters);
		return new VSCodeDisposable(() => {
			this._completionProviders.delete(extension.identifier.value);
			this._proxy.$unregisterCompletionProvider(extension.identifier.value);
		});
	}

	public async $provideTerminalCompletions(id: string, options: ITerminalCompletionContextDto): Promise<TerminalCompletionListDto | undefined> {
		const token = new CancellationTokenSource().token;
		if (token.isCancellationRequested || !this.activeTerminal) {
			return undefined;
		}

		const provider = this._completionProviders.get(id);
		if (!provider) {
			return;
		}

		const completions = await provider.provideTerminalCompletions(this.activeTerminal, options, token);
		if (completions === null || completions === undefined) {
			return undefined;
		}
		const pathSeparator = !isWindows || this.activeTerminal.state?.shell === WindowsShellType.GitBash ? '/' : '\\';
		return TerminalCompletionList.from(completions, pathSeparator);
	}

	public $acceptTerminalShellType(id: number, shellType: TerminalShellType | undefined): void {
		const terminal = this.getTerminalById(id);
		if (terminal?.setShellType(shellType)) {
			this._onDidChangeTerminalState.fire(terminal.value);
		}
	}

	public registerTerminalQuickFixProvider(id: string, extensionId: string, provider: vscode.TerminalQuickFixProvider): vscode.Disposable {
		if (this._quickFixProviders.has(id)) {
			throw new Error(`Terminal quick fix provider "${id}" is already registered`);
		}
		this._quickFixProviders.set(id, provider);
		this._proxy.$registerQuickFixProvider(id, extensionId);
		return new VSCodeDisposable(() => {
			this._quickFixProviders.delete(id);
			this._proxy.$unregisterQuickFixProvider(id);
		});
	}

	public async $provideTerminalQuickFixes(id: string, matchResult: TerminalCommandMatchResultDto): Promise<(ITerminalQuickFixTerminalCommandDto | ITerminalQuickFixOpenerDto | ICommandDto)[] | ITerminalQuickFixTerminalCommandDto | ITerminalQuickFixOpenerDto | ICommandDto | undefined> {
		const token = new CancellationTokenSource().token;
		if (token.isCancellationRequested) {
			return;
		}
		const provider = this._quickFixProviders.get(id);
		if (!provider) {
			return;
		}
		const quickFixes = await provider.provideTerminalQuickFixes(matchResult, token);
		if (quickFixes === null || (Array.isArray(quickFixes) && quickFixes.length === 0)) {
			return undefined;
		}

		const store = new DisposableStore();
		this._lastQuickFixCommands.value = store;

		// Single
		if (!Array.isArray(quickFixes)) {
			return quickFixes ? TerminalQuickFix.from(quickFixes, this._extHostCommands.converter, store) : undefined;
		}

		// Many
		const result = [];
		for (const fix of quickFixes) {
			const converted = TerminalQuickFix.from(fix, this._extHostCommands.converter, store);
			if (converted) {
				result.push(converted);
			}
		}
		return result;
	}

	public async $createContributedProfileTerminal(id: string, options: ICreateContributedTerminalProfileOptions): Promise<void> {
		const token = new CancellationTokenSource().token;
		let profile = await this._profileProviders.get(id)?.provideTerminalProfile(token);
		if (token.isCancellationRequested) {
			return;
		}
		if (profile && !hasKey(profile, { options: true })) {
			profile = { options: profile };
		}

		if (!profile || !hasKey(profile, { options: true })) {
			throw new Error(`No terminal profile options provided for id "${id}"`);
		}

		if (hasKey(profile.options, { pty: true })) {
			this.createExtensionTerminal(profile.options, options);
			return;
		}
		this.createTerminalFromOptions(profile.options, options);
	}

	public registerLinkProvider(provider: vscode.TerminalLinkProvider): vscode.Disposable {
		this._linkProviders.add(provider);
		if (this._linkProviders.size === 1) {
			this._proxy.$startLinkProvider();
		}
		return new VSCodeDisposable(() => {
			this._linkProviders.delete(provider);
			if (this._linkProviders.size === 0) {
				this._proxy.$stopLinkProvider();
			}
		});
	}

	public async $provideLinks(terminalId: number, line: string): Promise<ITerminalLinkDto[]> {
		const terminal = this.getTerminalById(terminalId);
		if (!terminal) {
			return [];
		}

		// Discard any cached links the terminal has been holding, currently all links are released
		// when new links are provided.
		this._terminalLinkCache.delete(terminalId);

		const oldToken = this._terminalLinkCancellationSource.get(terminalId);
		oldToken?.dispose(true);
		const cancellationSource = new CancellationTokenSource();
		this._terminalLinkCancellationSource.set(terminalId, cancellationSource);

		const result: ITerminalLinkDto[] = [];
		const context: vscode.TerminalLinkContext = { terminal: terminal.value, line };
		const promises: vscode.ProviderResult<{ provider: vscode.TerminalLinkProvider; links: vscode.TerminalLink[] }>[] = [];

		for (const provider of this._linkProviders) {
			promises.push(Promises.withAsyncBody(async r => {
				cancellationSource.token.onCancellationRequested(() => r({ provider, links: [] }));
				const links = (await provider.provideTerminalLinks(context, cancellationSource.token)) || [];
				if (!cancellationSource.token.isCancellationRequested) {
					r({ provider, links });
				}
			}));
		}

		const provideResults = await Promise.all(promises);

		if (cancellationSource.token.isCancellationRequested) {
			return [];
		}

		const cacheLinkMap = new Map<number, ICachedLinkEntry>();
		for (const provideResult of provideResults) {
			if (provideResult && provideResult.links.length > 0) {
				result.push(...provideResult.links.map(providerLink => {
					const link = {
						id: nextLinkId++,
						startIndex: providerLink.startIndex,
						length: providerLink.length,
						label: providerLink.tooltip
					};
					cacheLinkMap.set(link.id, {
						provider: provideResult.provider,
						link: providerLink
					});
					return link;
				}));
			}
		}

		this._terminalLinkCache.set(terminalId, cacheLinkMap);

		return result;
	}

	$activateLink(terminalId: number, linkId: number): void {
		const cachedLink = this._terminalLinkCache.get(terminalId)?.get(linkId);
		if (!cachedLink) {
			return;
		}
		cachedLink.provider.handleTerminalLink(cachedLink.link);
	}

	private _onProcessExit(id: number, exitCode: number | undefined): void {
		this._bufferer.stopBuffering(id);

		// Remove process reference
		this._terminalProcesses.delete(id);
		delete this._extensionTerminalAwaitingStart[id];

		// Clean up process disposables
		const processDiposable = this._terminalProcessDisposables[id];
		if (processDiposable) {
			processDiposable.dispose();
			delete this._terminalProcessDisposables[id];
		}
		// Send exit event to main side
		this._proxy.$sendProcessExit(id, exitCode);
	}

	public getTerminalById(id: number): ExtHostTerminal | null {
		return this._getTerminalObjectById(this._terminals, id);
	}

	public getTerminalIdByApiObject(terminal: vscode.Terminal): number | null {
		const index = this._terminals.findIndex(item => {
			return item.value === terminal;
		});
		return index >= 0 ? index : null;
	}

	private _getTerminalObjectById<T extends ExtHostTerminal>(array: T[], id: number): T | null {
		const index = this._getTerminalObjectIndexById(array, id);
		return index !== null ? array[index] : null;
	}

	private _getTerminalObjectIndexById<T extends ExtHostTerminal>(array: T[], id: ExtHostTerminalIdentifier): number | null {
		const index = array.findIndex(item => {
			return item._id === id;
		});
		return index >= 0 ? index : null;
	}

	public getEnvironmentVariableCollection(extension: IExtensionDescription): IEnvironmentVariableCollection {
		let collection = this._environmentVariableCollections.get(extension.identifier.value);
		if (!collection) {
			collection = this._register(new UnifiedEnvironmentVariableCollection());
			this._setEnvironmentVariableCollection(extension.identifier.value, collection);
		}
		return collection.getScopedEnvironmentVariableCollection(undefined);
	}

	private _syncEnvironmentVariableCollection(extensionIdentifier: string, collection: UnifiedEnvironmentVariableCollection): void {
		const serialized = serializeEnvironmentVariableCollection(collection.map);
		const serializedDescription = serializeEnvironmentDescriptionMap(collection.descriptionMap);
		this._proxy.$setEnvironmentVariableCollection(extensionIdentifier, collection.persistent, serialized.length === 0 ? undefined : serialized, serializedDescription);
	}

	public $initEnvironmentVariableCollections(collections: [string, ISerializableEnvironmentVariableCollection][]): void {
		collections.forEach(entry => {
			const extensionIdentifier = entry[0];
			const collection = this._register(new UnifiedEnvironmentVariableCollection(entry[1]));
			this._setEnvironmentVariableCollection(extensionIdentifier, collection);
		});
	}

	public $acceptDefaultProfile(profile: ITerminalProfile, automationProfile: ITerminalProfile): void {
		const oldProfile = this._defaultProfile;
		this._defaultProfile = profile;
		this._defaultAutomationProfile = automationProfile;
		if (oldProfile?.path !== profile.path) {
			this._onDidChangeShell.fire(profile.path);
		}
	}

	private _setEnvironmentVariableCollection(extensionIdentifier: string, collection: UnifiedEnvironmentVariableCollection): void {
		this._environmentVariableCollections.set(extensionIdentifier, collection);
		this._register(collection.onDidChangeCollection(() => {
			// When any collection value changes send this immediately, this is done to ensure
			// following calls to createTerminal will be created with the new environment. It will
			// result in more noise by sending multiple updates when called but collections are
			// expected to be small.
			this._syncEnvironmentVariableCollection(extensionIdentifier, collection);
		}));
	}
}

/**
 * Unified environment variable collection carrying information for all scopes, for a specific extension.
 */
class UnifiedEnvironmentVariableCollection extends Disposable {
	readonly map: Map<string, IEnvironmentVariableMutator> = new Map();
	private readonly scopedCollections: Map<string, ScopedEnvironmentVariableCollection> = new Map();
	readonly descriptionMap: Map<string, IEnvironmentVariableCollectionDescription> = new Map();
	private _persistent: boolean = true;

	public get persistent(): boolean { return this._persistent; }
	public set persistent(value: boolean) {
		this._persistent = value;
		this._onDidChangeCollection.fire();
	}

	protected readonly _onDidChangeCollection: Emitter<void> = new Emitter<void>();
	get onDidChangeCollection(): Event<void> { return this._onDidChangeCollection && this._onDidChangeCollection.event; }

	constructor(
		serialized?: ISerializableEnvironmentVariableCollection
	) {
		super();
		this.map = new Map(serialized);
	}

	getScopedEnvironmentVariableCollection(scope: vscode.EnvironmentVariableScope | undefined): IEnvironmentVariableCollection {
		const scopedCollectionKey = this.getScopeKey(scope);
		let scopedCollection = this.scopedCollections.get(scopedCollectionKey);
		if (!scopedCollection) {
			scopedCollection = new ScopedEnvironmentVariableCollection(this, scope);
			this.scopedCollections.set(scopedCollectionKey, scopedCollection);
			this._register(scopedCollection.onDidChangeCollection(() => this._onDidChangeCollection.fire()));
		}
		return scopedCollection;
	}

	replace(variable: string, value: string, options: vscode.EnvironmentVariableMutatorOptions | undefined, scope: vscode.EnvironmentVariableScope | undefined): void {
		this._setIfDiffers(variable, { value, type: EnvironmentVariableMutatorType.Replace, options: options ?? { applyAtProcessCreation: true }, scope });
	}

	append(variable: string, value: string, options: vscode.EnvironmentVariableMutatorOptions | undefined, scope: vscode.EnvironmentVariableScope | undefined): void {
		this._setIfDiffers(variable, { value, type: EnvironmentVariableMutatorType.Append, options: options ?? { applyAtProcessCreation: true }, scope });
	}

	prepend(variable: string, value: string, options: vscode.EnvironmentVariableMutatorOptions | undefined, scope: vscode.EnvironmentVariableScope | undefined): void {
		this._setIfDiffers(variable, { value, type: EnvironmentVariableMutatorType.Prepend, options: options ?? { applyAtProcessCreation: true }, scope });
	}

	private _setIfDiffers(variable: string, mutator: vscode.EnvironmentVariableMutator & { scope: vscode.EnvironmentVariableScope | undefined }): void {
		if (mutator.options && mutator.options.applyAtProcessCreation === false && !mutator.options.applyAtShellIntegration) {
			throw new Error('EnvironmentVariableMutatorOptions must apply at either process creation or shell integration');
		}
		const key = this.getKey(variable, mutator.scope);
		const current = this.map.get(key);
		const newOptions = mutator.options ? {
			applyAtProcessCreation: mutator.options.applyAtProcessCreation ?? false,
			applyAtShellIntegration: mutator.options.applyAtShellIntegration ?? false,
		} : {
			applyAtProcessCreation: true
		};
		if (
			!current ||
			current.value !== mutator.value ||
			current.type !== mutator.type ||
			current.options?.applyAtProcessCreation !== newOptions.applyAtProcessCreation ||
			current.options?.applyAtShellIntegration !== newOptions.applyAtShellIntegration ||
			current.scope?.workspaceFolder?.index !== mutator.scope?.workspaceFolder?.index
		) {
			const key = this.getKey(variable, mutator.scope);
			const value: IEnvironmentVariableMutator = {
				variable,
				...mutator,
				options: newOptions
			};
			this.map.set(key, value);
			this._onDidChangeCollection.fire();
		}
	}

	get(variable: string, scope: vscode.EnvironmentVariableScope | undefined): vscode.EnvironmentVariableMutator | undefined {
		const key = this.getKey(variable, scope);
		const value = this.map.get(key);
		// TODO: Set options to defaults if needed
		return value ? convertMutator(value) : undefined;
	}

	private getKey(variable: string, scope: vscode.EnvironmentVariableScope | undefined) {
		const scopeKey = this.getScopeKey(scope);
		return scopeKey.length ? `${variable}:::${scopeKey}` : variable;
	}

	private getScopeKey(scope: vscode.EnvironmentVariableScope | undefined): string {
		return this.getWorkspaceKey(scope?.workspaceFolder) ?? '';
	}

	private getWorkspaceKey(workspaceFolder: vscode.WorkspaceFolder | undefined): string | undefined {
		return workspaceFolder ? workspaceFolder.uri.toString() : undefined;
	}

	public getVariableMap(scope: vscode.EnvironmentVariableScope | undefined): Map<string, vscode.EnvironmentVariableMutator> {
		const map = new Map<string, vscode.EnvironmentVariableMutator>();
		for (const [_, value] of this.map) {
			if (this.getScopeKey(value.scope) === this.getScopeKey(scope)) {
				map.set(value.variable, convertMutator(value));
			}
		}
		return map;
	}

	delete(variable: string, scope: vscode.EnvironmentVariableScope | undefined): void {
		const key = this.getKey(variable, scope);
		this.map.delete(key);
		this._onDidChangeCollection.fire();
	}

	clear(scope: vscode.EnvironmentVariableScope | undefined): void {
		if (scope?.workspaceFolder) {
			for (const [key, mutator] of this.map) {
				if (mutator.scope?.workspaceFolder?.index === scope.workspaceFolder.index) {
					this.map.delete(key);
				}
			}
			this.clearDescription(scope);
		} else {
			this.map.clear();
			this.descriptionMap.clear();
		}
		this._onDidChangeCollection.fire();
	}

	setDescription(description: string | vscode.MarkdownString | undefined, scope: vscode.EnvironmentVariableScope | undefined): void {
		const key = this.getScopeKey(scope);
		const current = this.descriptionMap.get(key);
		if (!current || current.description !== description) {
			let descriptionStr: string | undefined;
			if (typeof description === 'string') {
				descriptionStr = description;
			} else {
				// Only take the description before the first `\n\n`, so that the description doesn't mess up the UI
				descriptionStr = description?.value.split('\n\n')[0];
			}
			const value: IEnvironmentVariableCollectionDescription = { description: descriptionStr, scope };
			this.descriptionMap.set(key, value);
			this._onDidChangeCollection.fire();
		}
	}

	public getDescription(scope: vscode.EnvironmentVariableScope | undefined): string | vscode.MarkdownString | undefined {
		const key = this.getScopeKey(scope);
		return this.descriptionMap.get(key)?.description;
	}

	private clearDescription(scope: vscode.EnvironmentVariableScope | undefined): void {
		const key = this.getScopeKey(scope);
		this.descriptionMap.delete(key);
	}
}

class ScopedEnvironmentVariableCollection implements IEnvironmentVariableCollection {
	public get persistent(): boolean { return this.collection.persistent; }
	public set persistent(value: boolean) {
		this.collection.persistent = value;
	}

	protected readonly _onDidChangeCollection = new Emitter<void>();
	get onDidChangeCollection(): Event<void> { return this._onDidChangeCollection && this._onDidChangeCollection.event; }

	constructor(
		private readonly collection: UnifiedEnvironmentVariableCollection,
		private readonly scope: vscode.EnvironmentVariableScope | undefined
	) {
	}

	getScoped(scope: vscode.EnvironmentVariableScope | undefined) {
		return this.collection.getScopedEnvironmentVariableCollection(scope);
	}

	replace(variable: string, value: string, options?: vscode.EnvironmentVariableMutatorOptions | undefined): void {
		this.collection.replace(variable, value, options, this.scope);
	}

	append(variable: string, value: string, options?: vscode.EnvironmentVariableMutatorOptions | undefined): void {
		this.collection.append(variable, value, options, this.scope);
	}

	prepend(variable: string, value: string, options?: vscode.EnvironmentVariableMutatorOptions | undefined): void {
		this.collection.prepend(variable, value, options, this.scope);
	}

	get(variable: string): vscode.EnvironmentVariableMutator | undefined {
		return this.collection.get(variable, this.scope);
	}

	forEach(callback: (variable: string, mutator: vscode.EnvironmentVariableMutator, collection: vscode.EnvironmentVariableCollection) => unknown, thisArg?: unknown): void {
		this.collection.getVariableMap(this.scope).forEach((value, variable) => callback.call(thisArg, variable, value, this), this.scope);
	}

	[Symbol.iterator](): IterableIterator<[variable: string, mutator: vscode.EnvironmentVariableMutator]> {
		return this.collection.getVariableMap(this.scope).entries();
	}

	delete(variable: string): void {
		this.collection.delete(variable, this.scope);
		this._onDidChangeCollection.fire(undefined);
	}

	clear(): void {
		this.collection.clear(this.scope);
	}

	set description(description: string | vscode.MarkdownString | undefined) {
		this.collection.setDescription(description, this.scope);
	}

	get description(): string | vscode.MarkdownString | undefined {
		return this.collection.getDescription(this.scope);
	}
}

export class WorkerExtHostTerminalService extends BaseExtHostTerminalService {
	constructor(
		@IExtHostCommands extHostCommands: IExtHostCommands,
		@IExtHostRpcService extHostRpc: IExtHostRpcService
	) {
		super(false, extHostCommands, extHostRpc);
	}

	public createTerminal(name?: string, shellPath?: string, shellArgs?: string[] | string): vscode.Terminal {
		throw new NotSupportedError();
	}

	public createTerminalFromOptions(options: vscode.TerminalOptions, internalOptions?: ITerminalInternalOptions): vscode.Terminal {
		throw new NotSupportedError();
	}
}

function asTerminalIcon(iconPath?: vscode.Uri | { light: vscode.Uri; dark: vscode.Uri } | vscode.ThemeIcon): TerminalIcon | undefined {
	if (!iconPath || typeof iconPath === 'string') {
		return undefined;
	}

	if (!hasKey(iconPath, { id: true })) {
		return iconPath;
	}

	return {
		id: iconPath.id,
		color: iconPath.color as ThemeColor
	};
}

function asTerminalColor(color?: vscode.ThemeColor): ThemeColor | undefined {
	return ThemeColor.isThemeColor(color) ? color as ThemeColor : undefined;
}

function convertMutator(mutator: IEnvironmentVariableMutator): vscode.EnvironmentVariableMutator {
	const newMutator = { ...mutator };
	delete newMutator.scope;
	newMutator.options = newMutator.options ?? undefined;
	return newMutator as vscode.EnvironmentVariableMutator;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostTerminalShellIntegration.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTerminalShellIntegration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { TerminalShellExecutionCommandLineConfidence } from './extHostTypes.js';
import { Disposable, DisposableStore, toDisposable } from '../../../base/common/lifecycle.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { MainContext, type ExtHostTerminalShellIntegrationShape, type MainThreadTerminalShellIntegrationShape } from './extHost.protocol.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import { IExtHostTerminalService } from './extHostTerminalService.js';
import { Emitter, type Event } from '../../../base/common/event.js';
import { URI } from '../../../base/common/uri.js';
import { AsyncIterableObject, Barrier, type AsyncIterableEmitter } from '../../../base/common/async.js';

export interface IExtHostTerminalShellIntegration extends ExtHostTerminalShellIntegrationShape {
	readonly _serviceBrand: undefined;

	readonly onDidChangeTerminalShellIntegration: Event<vscode.TerminalShellIntegrationChangeEvent>;
	readonly onDidStartTerminalShellExecution: Event<vscode.TerminalShellExecutionStartEvent>;
	readonly onDidEndTerminalShellExecution: Event<vscode.TerminalShellExecutionEndEvent>;
}
export const IExtHostTerminalShellIntegration = createDecorator<IExtHostTerminalShellIntegration>('IExtHostTerminalShellIntegration');

export class ExtHostTerminalShellIntegration extends Disposable implements IExtHostTerminalShellIntegration {

	readonly _serviceBrand: undefined;

	protected _proxy: MainThreadTerminalShellIntegrationShape;

	private _activeShellIntegrations: Map</*instanceId*/number, InternalTerminalShellIntegration> = new Map();

	protected readonly _onDidChangeTerminalShellIntegration = new Emitter<vscode.TerminalShellIntegrationChangeEvent>();
	readonly onDidChangeTerminalShellIntegration = this._onDidChangeTerminalShellIntegration.event;
	protected readonly _onDidStartTerminalShellExecution = new Emitter<vscode.TerminalShellExecutionStartEvent>();
	readonly onDidStartTerminalShellExecution = this._onDidStartTerminalShellExecution.event;
	protected readonly _onDidEndTerminalShellExecution = new Emitter<vscode.TerminalShellExecutionEndEvent>();
	readonly onDidEndTerminalShellExecution = this._onDidEndTerminalShellExecution.event;

	constructor(
		@IExtHostRpcService extHostRpc: IExtHostRpcService,
		@IExtHostTerminalService private readonly _extHostTerminalService: IExtHostTerminalService,
	) {
		super();

		this._proxy = extHostRpc.getProxy(MainContext.MainThreadTerminalShellIntegration);

		// Clean up listeners
		this._register(toDisposable(() => {
			for (const [_, integration] of this._activeShellIntegrations) {
				integration.dispose();
			}
			this._activeShellIntegrations.clear();
		}));

		// Convenient test code:
		// this.onDidChangeTerminalShellIntegration(e => {
		// 	console.log('*** onDidChangeTerminalShellIntegration', e);
		// });
		// this.onDidStartTerminalShellExecution(async e => {
		// 	console.log('*** onDidStartTerminalShellExecution', e);
		// 	// new Promise<void>(r => {
		// 	// 	(async () => {
		// 	// 		for await (const d of e.execution.read()) {
		// 	// 			console.log('data2', d);
		// 	// 		}
		// 	// 	})();
		// 	// });
		// 	for await (const d of e.execution.read()) {
		// 		console.log('data', d);
		// 	}
		// });
		// this.onDidEndTerminalShellExecution(e => {
		// 	console.log('*** onDidEndTerminalShellExecution', e);
		// });
		// setTimeout(() => {
		// 	console.log('before executeCommand(\"echo hello\")');
		// 	Array.from(this._activeShellIntegrations.values())[0].value.executeCommand('echo hello');
		// 	console.log('after executeCommand(\"echo hello\")');
		// }, 4000);
	}

	public $shellIntegrationChange(instanceId: number, supportsExecuteCommandApi: boolean): void {
		const terminal = this._extHostTerminalService.getTerminalById(instanceId);
		if (!terminal) {
			return;
		}

		const apiTerminal = terminal.value;
		let shellIntegration = this._activeShellIntegrations.get(instanceId);
		if (!shellIntegration) {
			shellIntegration = new InternalTerminalShellIntegration(terminal.value, supportsExecuteCommandApi, this._onDidStartTerminalShellExecution);
			this._activeShellIntegrations.set(instanceId, shellIntegration);
			shellIntegration.store.add(terminal.onWillDispose(() => this._activeShellIntegrations.get(instanceId)?.dispose()));
			shellIntegration.store.add(shellIntegration.onDidRequestShellExecution(commandLine => this._proxy.$executeCommand(instanceId, commandLine)));
			shellIntegration.store.add(shellIntegration.onDidRequestEndExecution(e => this._onDidEndTerminalShellExecution.fire(e)));
			shellIntegration.store.add(shellIntegration.onDidRequestChangeShellIntegration(e => this._onDidChangeTerminalShellIntegration.fire(e)));
			terminal.shellIntegration = shellIntegration.value;
		}
		this._onDidChangeTerminalShellIntegration.fire({
			terminal: apiTerminal,
			shellIntegration: shellIntegration.value
		});
	}

	public $shellExecutionStart(instanceId: number, supportsExecuteCommandApi: boolean, commandLineValue: string, commandLineConfidence: TerminalShellExecutionCommandLineConfidence, isTrusted: boolean, cwd: string | undefined): void {
		// Force shellIntegration creation if it hasn't been created yet, this could when events
		// don't come through on startup
		if (!this._activeShellIntegrations.has(instanceId)) {
			this.$shellIntegrationChange(instanceId, supportsExecuteCommandApi);
		}
		const commandLine: vscode.TerminalShellExecutionCommandLine = {
			value: commandLineValue,
			confidence: commandLineConfidence,
			isTrusted
		};
		this._activeShellIntegrations.get(instanceId)?.startShellExecution(commandLine, this._convertCwdToUri(cwd));
	}

	public $shellExecutionEnd(instanceId: number, commandLineValue: string, commandLineConfidence: TerminalShellExecutionCommandLineConfidence, isTrusted: boolean, exitCode: number | undefined): void {
		const commandLine: vscode.TerminalShellExecutionCommandLine = {
			value: commandLineValue,
			confidence: commandLineConfidence,
			isTrusted
		};
		this._activeShellIntegrations.get(instanceId)?.endShellExecution(commandLine, exitCode);
	}

	public $shellExecutionData(instanceId: number, data: string): void {
		this._activeShellIntegrations.get(instanceId)?.emitData(data);
	}

	public $shellEnvChange(instanceId: number, shellEnvKeys: string[], shellEnvValues: string[], isTrusted: boolean): void {
		this._activeShellIntegrations.get(instanceId)?.setEnv(shellEnvKeys, shellEnvValues, isTrusted);
	}

	public $cwdChange(instanceId: number, cwd: string | undefined): void {
		this._activeShellIntegrations.get(instanceId)?.setCwd(this._convertCwdToUri(cwd));
	}

	public $closeTerminal(instanceId: number): void {
		this._activeShellIntegrations.get(instanceId)?.dispose();
		this._activeShellIntegrations.delete(instanceId);
	}

	private _convertCwdToUri(cwd: string | undefined): URI | undefined {
		// IMPORTANT: cwd is provided to the exthost as a string from the renderer and only
		// converted to a URI on the machine in which the pty is hosted on. The string version of
		// the cwd is used from the renderer such that it's access is synchronous and its event
		// comes through in order relative to other shell integration events.
		return cwd ? URI.file(cwd) : undefined;
	}
}

interface IExecutionProperties {
	isMultiLine: boolean;
	unresolvedCommandLines: string[] | undefined;
}

export class InternalTerminalShellIntegration extends Disposable {
	private _pendingExecutions: InternalTerminalShellExecution[] = [];
	private _pendingEndingExecution: InternalTerminalShellExecution | undefined;

	private _currentExecutionProperties: IExecutionProperties | undefined;
	private _currentExecution: InternalTerminalShellExecution | undefined;
	get currentExecution(): InternalTerminalShellExecution | undefined { return this._currentExecution; }


	private _env: vscode.TerminalShellIntegrationEnvironment | undefined;
	private _cwd: URI | undefined;

	readonly store: DisposableStore = this._register(new DisposableStore());

	readonly value: vscode.TerminalShellIntegration;

	protected readonly _onDidRequestChangeShellIntegration = this._register(new Emitter<vscode.TerminalShellIntegrationChangeEvent>());
	readonly onDidRequestChangeShellIntegration = this._onDidRequestChangeShellIntegration.event;
	protected readonly _onDidRequestShellExecution = this._register(new Emitter<string>());
	readonly onDidRequestShellExecution = this._onDidRequestShellExecution.event;
	protected readonly _onDidRequestEndExecution = this._register(new Emitter<vscode.TerminalShellExecutionEndEvent>());
	readonly onDidRequestEndExecution = this._onDidRequestEndExecution.event;
	protected readonly _onDidRequestNewExecution = this._register(new Emitter<string>());
	readonly onDidRequestNewExecution = this._onDidRequestNewExecution.event;

	constructor(
		private readonly _terminal: vscode.Terminal,
		supportsExecuteCommandApi: boolean,
		private readonly _onDidStartTerminalShellExecution: Emitter<vscode.TerminalShellExecutionStartEvent>
	) {
		super();

		const that = this;
		this.value = {
			get cwd(): URI | undefined {
				return that._cwd;
			},
			get env(): vscode.TerminalShellIntegrationEnvironment | undefined {
				if (!that._env) {
					return undefined;
				}
				return Object.freeze({
					isTrusted: that._env.isTrusted,
					value: Object.freeze({ ...that._env.value })
				});
			},
			// executeCommand(commandLine: string): vscode.TerminalShellExecution;
			// executeCommand(executable: string, args: string[]): vscode.TerminalShellExecution;
			executeCommand(commandLineOrExecutable: string, args?: string[]): vscode.TerminalShellExecution {
				if (!supportsExecuteCommandApi) {
					throw new Error('This terminal does not support the executeCommand API.');
				}
				let commandLineValue = commandLineOrExecutable;
				if (args) {
					for (const arg of args) {
						const wrapInQuotes = !arg.match(/["'`]/) && arg.match(/\s/);
						if (wrapInQuotes) {
							commandLineValue += ` "${arg}"`;
						} else {
							commandLineValue += ` ${arg}`;
						}
					}
				}

				that._onDidRequestShellExecution.fire(commandLineValue);
				// Fire the event in a microtask to allow the extension to use the execution before
				// the start event fires
				const commandLine: vscode.TerminalShellExecutionCommandLine = {
					value: commandLineValue,
					confidence: TerminalShellExecutionCommandLineConfidence.High,
					isTrusted: true
				};
				const execution = that.requestNewShellExecution(commandLine, that._cwd).value;
				return execution;
			}
		};
	}

	requestNewShellExecution(commandLine: vscode.TerminalShellExecutionCommandLine, cwd: URI | undefined) {
		const execution = new InternalTerminalShellExecution(commandLine, cwd ?? this._cwd);
		const unresolvedCommandLines = splitAndSanitizeCommandLine(commandLine.value);
		if (unresolvedCommandLines.length > 1) {
			this._currentExecutionProperties = {
				isMultiLine: true,
				unresolvedCommandLines: splitAndSanitizeCommandLine(commandLine.value),
			};
		}
		this._pendingExecutions.push(execution);
		this._onDidRequestNewExecution.fire(commandLine.value);
		return execution;
	}

	startShellExecution(commandLine: vscode.TerminalShellExecutionCommandLine, cwd: URI | undefined): undefined {
		// Since an execution is starting, fire the end event for any execution that is awaiting to
		// end. When this happens it means that the data stream may not be flushed and therefore may
		// fire events after the end event.
		if (this._pendingEndingExecution) {
			this._onDidRequestEndExecution.fire({ terminal: this._terminal, shellIntegration: this.value, execution: this._pendingEndingExecution.value, exitCode: undefined });
			this._pendingEndingExecution = undefined;
		}

		if (this._currentExecution) {
			// If the current execution is multi-line, check if this command line is part of it.
			if (this._currentExecutionProperties?.isMultiLine && this._currentExecutionProperties.unresolvedCommandLines) {
				const subExecutionResult = isSubExecution(this._currentExecutionProperties.unresolvedCommandLines, commandLine);
				if (subExecutionResult) {
					this._currentExecutionProperties.unresolvedCommandLines = subExecutionResult.unresolvedCommandLines;
					return;
				}
			}
			this._currentExecution.endExecution(undefined);
			this._currentExecution.flush();
			this._onDidRequestEndExecution.fire({ terminal: this._terminal, shellIntegration: this.value, execution: this._currentExecution.value, exitCode: undefined });
		}

		// Get the matching pending execution, how strict this is depends on the confidence of the
		// command line
		let currentExecution: InternalTerminalShellExecution | undefined;
		if (commandLine.confidence === TerminalShellExecutionCommandLineConfidence.High) {
			for (const [i, execution] of this._pendingExecutions.entries()) {
				if (execution.value.commandLine.value === commandLine.value) {
					currentExecution = execution;
					this._currentExecutionProperties = {
						isMultiLine: false,
						unresolvedCommandLines: undefined,
					};
					currentExecution = execution;
					this._pendingExecutions.splice(i, 1);
					break;
				} else {
					const subExecutionResult = isSubExecution(splitAndSanitizeCommandLine(execution.value.commandLine.value), commandLine);
					if (subExecutionResult) {
						this._currentExecutionProperties = {
							isMultiLine: true,
							unresolvedCommandLines: subExecutionResult.unresolvedCommandLines,
						};
						currentExecution = execution;
						this._pendingExecutions.splice(i, 1);
						break;
					}
				}
			}
		} else {
			currentExecution = this._pendingExecutions.shift();
		}

		// If there is no execution, create a new one
		if (!currentExecution) {
			// Fallback to the shell integration's cwd as the cwd may not have been restored after a reload
			currentExecution = new InternalTerminalShellExecution(commandLine, cwd ?? this._cwd);
		}

		this._currentExecution = currentExecution;
		this._onDidStartTerminalShellExecution.fire({ terminal: this._terminal, shellIntegration: this.value, execution: this._currentExecution.value });
	}

	emitData(data: string): void {
		this.currentExecution?.emitData(data);
	}

	endShellExecution(commandLine: vscode.TerminalShellExecutionCommandLine | undefined, exitCode: number | undefined): void {
		// If the current execution is multi-line, don't end it until the next command line is
		// confirmed to not be a part of it.
		if (this._currentExecutionProperties?.isMultiLine) {
			if (this._currentExecutionProperties.unresolvedCommandLines && this._currentExecutionProperties.unresolvedCommandLines.length > 0) {
				return;
			}
		}

		if (this._currentExecution) {
			const commandLineForEvent = this._currentExecutionProperties?.isMultiLine ? this._currentExecution.value.commandLine : commandLine;
			this._currentExecution.endExecution(commandLineForEvent);
			const currentExecution = this._currentExecution;
			this._pendingEndingExecution = currentExecution;
			this._currentExecution = undefined;
			// IMPORTANT: Ensure the current execution's data events are flushed in order to
			// prevent data events firing after the end event fires.
			currentExecution.flush().then(() => {
				// Only fire if it's still the same execution, if it's changed it would have already
				// been fired.
				if (this._pendingEndingExecution === currentExecution) {
					this._onDidRequestEndExecution.fire({ terminal: this._terminal, shellIntegration: this.value, execution: currentExecution.value, exitCode });
					this._pendingEndingExecution = undefined;
				}
			});
		}
	}

	setEnv(keys: string[], values: string[], isTrusted: boolean): void {
		const env: { [key: string]: string | undefined } = {};
		for (let i = 0; i < keys.length; i++) {
			env[keys[i]] = values[i];
		}
		this._env = { value: env, isTrusted };
		this._fireChangeEvent();
	}

	setCwd(cwd: URI | undefined): void {
		let wasChanged = false;
		if (URI.isUri(this._cwd)) {
			wasChanged = !URI.isUri(cwd) || this._cwd.toString() !== cwd.toString();
		} else if (this._cwd !== cwd) {
			wasChanged = true;
		}
		if (wasChanged) {
			this._cwd = cwd;
			this._fireChangeEvent();
		}
	}

	private _fireChangeEvent() {
		this._onDidRequestChangeShellIntegration.fire({ terminal: this._terminal, shellIntegration: this.value });
	}
}

class InternalTerminalShellExecution {
	readonly value: vscode.TerminalShellExecution;

	private _dataStream: ShellExecutionDataStream | undefined;
	private _isEnded: boolean = false;

	constructor(
		private _commandLine: vscode.TerminalShellExecutionCommandLine,
		readonly cwd: URI | undefined,
	) {
		const that = this;
		this.value = {
			get commandLine(): vscode.TerminalShellExecutionCommandLine {
				return that._commandLine;
			},
			get cwd(): URI | undefined {
				return that.cwd;
			},
			read(): AsyncIterable<string> {
				return that._createDataStream();
			}
		};
	}

	private _createDataStream(): AsyncIterable<string> {
		if (!this._dataStream) {
			if (this._isEnded) {
				return AsyncIterableObject.EMPTY;
			}
			this._dataStream = new ShellExecutionDataStream();
		}
		return this._dataStream.createIterable();
	}

	emitData(data: string): void {
		if (!this._isEnded) {
			this._dataStream?.emitData(data);
		}
	}

	endExecution(commandLine: vscode.TerminalShellExecutionCommandLine | undefined): void {
		if (commandLine) {
			this._commandLine = commandLine;
		}
		this._dataStream?.endExecution();
		this._isEnded = true;
	}

	async flush(): Promise<void> {
		if (this._dataStream) {
			await this._dataStream.flush();
			this._dataStream.dispose();
			this._dataStream = undefined;
		}
	}
}

class ShellExecutionDataStream extends Disposable {
	private _barrier: Barrier | undefined;
	private _iterables: AsyncIterableObject<string>[] = [];
	private _emitters: AsyncIterableEmitter<string>[] = [];

	createIterable(): AsyncIterable<string> {
		if (!this._barrier) {
			this._barrier = new Barrier();
		}
		const barrier = this._barrier;
		const iterable = new AsyncIterableObject<string>(async emitter => {
			this._emitters.push(emitter);
			await barrier.wait();
		});
		this._iterables.push(iterable);
		return iterable;
	}

	emitData(data: string): void {
		for (const emitter of this._emitters) {
			emitter.emitOne(data);
		}
	}

	endExecution(): void {
		this._barrier?.open();
	}

	async flush(): Promise<void> {
		await Promise.all(this._iterables.map(e => e.toPromise()));
	}
}

function splitAndSanitizeCommandLine(commandLine: string): string[] {
	return commandLine
		.split('\n')
		.map(line => line.trim())
		.filter(line => line.length > 0);
}

/**
 * When executing something that the shell considers multiple commands, such as
 * a comment followed by a command, this needs to all be tracked under a single
 * execution.
 */
function isSubExecution(unresolvedCommandLines: string[], commandLine: vscode.TerminalShellExecutionCommandLine): { unresolvedCommandLines: string[] } | false {
	if (unresolvedCommandLines.length === 0) {
		return false;
	}
	const newUnresolvedCommandLines = [...unresolvedCommandLines];
	const subExecutionLines = splitAndSanitizeCommandLine(commandLine.value);
	if (newUnresolvedCommandLines && newUnresolvedCommandLines.length > 0) {
		// If all sub-execution lines are in the command line, this is part of the
		// multi-line execution.
		while (newUnresolvedCommandLines.length > 0) {
			if (newUnresolvedCommandLines[0] !== subExecutionLines[0]) {
				break;
			}
			newUnresolvedCommandLines.shift();
			subExecutionLines.shift();
		}

		if (subExecutionLines.length === 0) {
			return { unresolvedCommandLines: newUnresolvedCommandLines };
		}
	}
	return false;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostTesting.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTesting.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable local/code-no-native-private */

import type * as vscode from 'vscode';
import { RunOnceScheduler } from '../../../base/common/async.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken, CancellationTokenSource } from '../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { createSingleCallFunction } from '../../../base/common/functional.js';
import { hash } from '../../../base/common/hash.js';
import { Disposable, DisposableStore, toDisposable } from '../../../base/common/lifecycle.js';
import { MarshalledId } from '../../../base/common/marshallingIds.js';
import { isDefined } from '../../../base/common/types.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { IPosition } from '../../../editor/common/core/position.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { TestCommandId } from '../../contrib/testing/common/constants.js';
import { TestId, TestPosition } from '../../contrib/testing/common/testId.js';
import { InvalidTestItemError } from '../../contrib/testing/common/testItemCollection.js';
import { AbstractIncrementalTestCollection, CoverageDetails, ICallProfileRunHandler, ISerializedTestResults, IStartControllerTests, IStartControllerTestsResult, ITestErrorMessage, ITestItem, ITestItemContext, ITestMessageMenuArgs, ITestRunProfile, IncrementalChangeCollector, IncrementalTestCollectionItem, InternalTestItem, TestControllerCapability, TestMessageFollowupRequest, TestMessageFollowupResponse, TestResultState, TestsDiff, TestsDiffOp, isStartControllerTests } from '../../contrib/testing/common/testTypes.js';
import { checkProposedApiEnabled } from '../../services/extensions/common/extensions.js';
import { ExtHostTestingShape, ILocationDto, MainContext, MainThreadTestingShape } from './extHost.protocol.js';
import { IExtHostCommands } from './extHostCommands.js';
import { IExtHostDocumentsAndEditors } from './extHostDocumentsAndEditors.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import { ExtHostTestItemCollection, TestItemImpl, TestItemRootImpl, toItemFromContext } from './extHostTestItem.js';
import * as Convert from './extHostTypeConverters.js';
import { FileCoverage, TestRunProfileBase, TestRunRequest } from './extHostTypes.js';

interface ControllerInfo {
	controller: vscode.TestController;
	profiles: Map<number, vscode.TestRunProfile>;
	collection: ExtHostTestItemCollection;
	extension: IExtensionDescription;
	relatedCodeProvider?: vscode.TestRelatedCodeProvider;
	activeProfiles: Set<number>;
}

type DefaultProfileChangeEvent = Map</* controllerId */ string, Map< /* profileId */number, boolean>>;

let followupCounter = 0;

const testResultInternalIDs = new WeakMap<vscode.TestRunResult, string>();

export const IExtHostTesting = createDecorator<IExtHostTesting>('IExtHostTesting');
export interface IExtHostTesting extends ExtHostTesting {
	readonly _serviceBrand: undefined;
}

export class ExtHostTesting extends Disposable implements ExtHostTestingShape {
	declare readonly _serviceBrand: undefined;

	private readonly resultsChangedEmitter = this._register(new Emitter<void>());
	protected readonly controllers = new Map</* controller ID */ string, ControllerInfo>();
	private readonly proxy: MainThreadTestingShape;
	private readonly runTracker: TestRunCoordinator;
	private readonly observer: TestObservers;
	private readonly defaultProfilesChangedEmitter = this._register(new Emitter<DefaultProfileChangeEvent>());
	private readonly followupProviders = new Set<vscode.TestFollowupProvider>();
	private readonly testFollowups = new Map<number, vscode.Command>();

	public onResultsChanged = this.resultsChangedEmitter.event;
	public results: ReadonlyArray<vscode.TestRunResult> = [];

	constructor(
		@IExtHostRpcService rpc: IExtHostRpcService,
		@ILogService private readonly logService: ILogService,
		@IExtHostCommands private readonly commands: IExtHostCommands,
		@IExtHostDocumentsAndEditors private readonly editors: IExtHostDocumentsAndEditors,
	) {
		super();
		this.proxy = rpc.getProxy(MainContext.MainThreadTesting);
		this.observer = new TestObservers(this.proxy);
		this.runTracker = new TestRunCoordinator(this.proxy, logService);

		commands.registerArgumentProcessor({
			processArgument: arg => {
				switch (arg?.$mid) {
					case MarshalledId.TestItemContext: {
						const cast = arg as ITestItemContext;
						const targetTest = cast.tests[cast.tests.length - 1].item.extId;
						const controller = this.controllers.get(TestId.root(targetTest));
						return controller?.collection.tree.get(targetTest)?.actual ?? toItemFromContext(arg);
					}
					case MarshalledId.TestMessageMenuArgs: {
						const { test, message } = arg as ITestMessageMenuArgs;
						const extId = test.item.extId;
						return {
							test: this.controllers.get(TestId.root(extId))?.collection.tree.get(extId)?.actual
								?? toItemFromContext({ $mid: MarshalledId.TestItemContext, tests: [test] }),
							message: Convert.TestMessage.to(message as ITestErrorMessage.Serialized),
						};
					}
					default: return arg;
				}
			}
		});

		commands.registerCommand(false, 'testing.getExplorerSelection', async (): Promise<any> => {
			const inner = await commands.executeCommand<{
				include: string[];
				exclude: string[];
			}>(TestCommandId.GetExplorerSelection);

			const lookup = (i: string) => {
				const controller = this.controllers.get(TestId.root(i));
				if (!controller) { return undefined; }
				return TestId.isRoot(i) ? controller.controller : controller.collection.tree.get(i)?.actual;
			};

			return {
				include: inner?.include.map(lookup).filter(isDefined) || [],
				exclude: inner?.exclude.map(lookup).filter(isDefined) || [],
			};
		});
	}

	//#region public API

	/**
	 * Implements vscode.test.registerTestProvider
	 */
	public createTestController(extension: IExtensionDescription, controllerId: string, label: string, refreshHandler?: (token: CancellationToken) => Thenable<void> | void): vscode.TestController {
		if (this.controllers.has(controllerId)) {
			throw new Error(`Attempt to insert a duplicate controller with ID "${controllerId}"`);
		}

		const disposable = new DisposableStore();
		const collection = disposable.add(new ExtHostTestItemCollection(controllerId, label, this.editors));
		collection.root.label = label;

		const profiles = new Map<number, vscode.TestRunProfile>();
		const activeProfiles = new Set<number>();
		const proxy = this.proxy;

		const getCapability = () => {
			let cap = 0;
			if (refreshHandler) {
				cap |= TestControllerCapability.Refresh;
			}
			const rcp = info.relatedCodeProvider;
			if (rcp) {
				if (rcp?.provideRelatedTests) {
					cap |= TestControllerCapability.TestRelatedToCode;
				}
				if (rcp?.provideRelatedCode) {
					cap |= TestControllerCapability.CodeRelatedToTest;
				}
			}
			return cap as TestControllerCapability;
		};

		const controller: vscode.TestController = {
			items: collection.root.children,
			get label() {
				return label;
			},
			set label(value: string) {
				label = value;
				collection.root.label = value;
				proxy.$updateController(controllerId, { label });
			},
			get refreshHandler() {
				return refreshHandler;
			},
			set refreshHandler(value: ((token: CancellationToken) => Thenable<void> | void) | undefined) {
				refreshHandler = value;
				proxy.$updateController(controllerId, { capabilities: getCapability() });
			},
			get id() {
				return controllerId;
			},
			get relatedCodeProvider() {
				return info.relatedCodeProvider;
			},
			set relatedCodeProvider(value: vscode.TestRelatedCodeProvider | undefined) {
				checkProposedApiEnabled(extension, 'testRelatedCode');
				info.relatedCodeProvider = value;
				proxy.$updateController(controllerId, { capabilities: getCapability() });
			},
			createRunProfile: (label, group, runHandler, isDefault, tag?: vscode.TestTag | undefined, supportsContinuousRun?: boolean) => {
				// Derive the profile ID from a hash so that the same profile will tend
				// to have the same hashes, allowing re-run requests to work across reloads.
				let profileId = hash(label);
				while (profiles.has(profileId)) {
					profileId++;
				}

				return new TestRunProfileImpl(this.proxy, profiles, activeProfiles, this.defaultProfilesChangedEmitter.event, controllerId, profileId, label, group, runHandler, isDefault, tag, supportsContinuousRun);
			},
			createTestItem(id, label, uri) {
				return new TestItemImpl(controllerId, id, label, uri);
			},
			createTestRun: (request, name, persist = true) => {
				return this.runTracker.createTestRun(extension, controllerId, collection, request, name, persist);
			},
			invalidateTestResults: items => {
				if (items === undefined) {
					this.proxy.$markTestRetired(undefined);
				} else {
					const itemsArr = items instanceof Array ? items : [items];
					this.proxy.$markTestRetired(itemsArr.map(i => TestId.fromExtHostTestItem(i!, controllerId).toString()));
				}
			},
			set resolveHandler(fn) {
				collection.resolveHandler = fn;
			},
			get resolveHandler() {
				return collection.resolveHandler as undefined | ((item?: vscode.TestItem) => void);
			},
			dispose: () => {
				disposable.dispose();
			},
		};

		const info: ControllerInfo = { controller, collection, profiles, extension, activeProfiles };
		proxy.$registerTestController(controllerId, label, getCapability());
		disposable.add(toDisposable(() => proxy.$unregisterTestController(controllerId)));

		this.controllers.set(controllerId, info);
		disposable.add(toDisposable(() => this.controllers.delete(controllerId)));

		disposable.add(collection.onDidGenerateDiff(diff => proxy.$publishDiff(controllerId, diff.map(TestsDiffOp.serialize))));

		return controller;
	}

	/**
	 * Implements vscode.test.createTestObserver
	 */
	public createTestObserver() {
		return this.observer.checkout();
	}


	/**
	 * Implements vscode.test.runTests
	 */
	public async runTests(req: vscode.TestRunRequest, token = CancellationToken.None) {
		const profile = tryGetProfileFromTestRunReq(req);
		if (!profile) {
			throw new Error('The request passed to `vscode.test.runTests` must include a profile');
		}

		const controller = this.controllers.get(profile.controllerId);
		if (!controller) {
			throw new Error('Controller not found');
		}

		await this.proxy.$runTests({
			preserveFocus: req.preserveFocus ?? true,
			group: Convert.TestRunProfileKind.from(profile.kind),
			targets: [{
				testIds: req.include?.map(t => TestId.fromExtHostTestItem(t, controller.collection.root.id).toString()) ?? [controller.collection.root.id],
				profileId: profile.profileId,
				controllerId: profile.controllerId,
			}],
			exclude: req.exclude?.map(t => t.id),
		}, token);
	}

	/**
	 * Implements vscode.test.registerTestFollowupProvider
	 */
	public registerTestFollowupProvider(provider: vscode.TestFollowupProvider): vscode.Disposable {
		this.followupProviders.add(provider);
		return { dispose: () => { this.followupProviders.delete(provider); } };
	}

	//#endregion

	//#region RPC methods
	/**
	 * @inheritdoc
	 */
	async $getTestsRelatedToCode(uri: UriComponents, _position: IPosition, token: CancellationToken): Promise<string[]> {
		const doc = this.editors.getDocument(URI.revive(uri));
		if (!doc) {
			return [];
		}

		const position = Convert.Position.to(_position);
		const related: string[] = [];
		await Promise.all([...this.controllers.values()].map(async (c) => {
			let tests: vscode.TestItem[] | undefined | null;
			try {
				tests = await c.relatedCodeProvider?.provideRelatedTests?.(doc.document, position, token);
			} catch (e) {
				if (!token.isCancellationRequested) {
					this.logService.warn(`Error thrown while providing related tests for ${c.controller.label}`, e);
				}
			}

			if (tests) {
				for (const test of tests) {
					related.push(TestId.fromExtHostTestItem(test, c.controller.id).toString());
				}
				c.collection.flushDiff();
			}
		}));

		return related;
	}

	/**
	 * @inheritdoc
	 */
	async $getCodeRelatedToTest(testId: string, token: CancellationToken): Promise<ILocationDto[]> {
		const controller = this.controllers.get(TestId.root(testId));
		if (!controller) {
			return [];
		}

		const test = controller.collection.tree.get(testId);
		if (!test) {
			return [];
		}

		const locations = await controller.relatedCodeProvider?.provideRelatedCode?.(test.actual, token);
		return locations?.map(Convert.location.from) ?? [];
	}

	/**
	 * @inheritdoc
	 */
	$syncTests(): Promise<void> {
		for (const { collection } of this.controllers.values()) {
			collection.flushDiff();
		}

		return Promise.resolve();
	}

	/**
	 * @inheritdoc
	 */
	async $getCoverageDetails(coverageId: string, testId: string | undefined, token: CancellationToken): Promise<CoverageDetails.Serialized[]> {
		const details = await this.runTracker.getCoverageDetails(coverageId, testId, token);
		return details?.map(Convert.TestCoverage.fromDetails);
	}

	/**
	 * @inheritdoc
	 */
	async $disposeRun(runId: string) {
		this.runTracker.disposeTestRun(runId);
	}

	/** @inheritdoc */
	$configureRunProfile(controllerId: string, profileId: number) {
		this.controllers.get(controllerId)?.profiles.get(profileId)?.configureHandler?.();
	}

	/** @inheritdoc */
	$setDefaultRunProfiles(profiles: Record</* controller id */string, /* profile id */ number[]>): void {
		const evt: DefaultProfileChangeEvent = new Map();
		for (const [controllerId, profileIds] of Object.entries(profiles)) {
			const ctrl = this.controllers.get(controllerId);
			if (!ctrl) {
				continue;
			}
			const changes = new Map<number, boolean>();
			const added = profileIds.filter(id => !ctrl.activeProfiles.has(id));
			const removed = [...ctrl.activeProfiles].filter(id => !profileIds.includes(id));
			for (const id of added) {
				changes.set(id, true);
				ctrl.activeProfiles.add(id);
			}
			for (const id of removed) {
				changes.set(id, false);
				ctrl.activeProfiles.delete(id);
			}
			if (changes.size) {
				evt.set(controllerId, changes);
			}
		}

		this.defaultProfilesChangedEmitter.fire(evt);
	}

	/** @inheritdoc */
	async $refreshTests(controllerId: string, token: CancellationToken) {
		await this.controllers.get(controllerId)?.controller.refreshHandler?.(token);
	}

	/**
	 * Updates test results shown to extensions.
	 * @override
	 */
	public $publishTestResults(results: ISerializedTestResults[]): void {
		this.results = Object.freeze(
			results
				.map(r => {
					const o = Convert.TestResults.to(r);
					const taskWithCoverage = r.tasks.findIndex(t => t.hasCoverage);
					if (taskWithCoverage !== -1) {
						o.getDetailedCoverage = (uri, token = CancellationToken.None) =>
							this.proxy.$getCoverageDetails(r.id, taskWithCoverage, uri, token).then(r => r.map(Convert.TestCoverage.to));
					}

					testResultInternalIDs.set(o, r.id);
					return o;
				})
				.concat(this.results)
				.sort((a, b) => b.completedAt - a.completedAt)
				.slice(0, 32),
		);

		this.resultsChangedEmitter.fire();
	}

	/**
	 * Expands the nodes in the test tree. If levels is less than zero, it will
	 * be treated as infinite.
	 */
	public async $expandTest(testId: string, levels: number) {
		const collection = this.controllers.get(TestId.fromString(testId).controllerId)?.collection;
		if (collection) {
			await collection.expand(testId, levels < 0 ? Infinity : levels);
			collection.flushDiff();
		}
	}

	/**
	 * Receives a test update from the main thread. Called (eventually) whenever
	 * tests change.
	 */
	public $acceptDiff(diff: TestsDiffOp.Serialized[]): void {
		this.observer.applyDiff(diff.map(d => TestsDiffOp.deserialize({ asCanonicalUri: u => u }, d)));
	}

	/**
	 * Runs tests with the given set of IDs. Allows for test from multiple
	 * providers to be run.
	 * @inheritdoc
	 */
	public async $runControllerTests(reqs: IStartControllerTests[], token: CancellationToken): Promise<IStartControllerTestsResult[]> {
		return Promise.all(reqs.map(req => this.runControllerTestRequest(req, false, token)));
	}

	/**
	 * Starts continuous test runs with the given set of IDs. Allows for test from
	 * multiple providers to be run.
	 * @inheritdoc
	 */
	public async $startContinuousRun(reqs: IStartControllerTests[], token: CancellationToken): Promise<IStartControllerTestsResult[]> {
		const cts = new CancellationTokenSource(token);
		const res = await Promise.all(reqs.map(req => this.runControllerTestRequest(req, true, cts.token)));

		// avoid returning until cancellation is requested, otherwise ipc disposes of the token
		if (!token.isCancellationRequested && !res.some(r => r.error)) {
			await new Promise(r => token.onCancellationRequested(r));
		}

		cts.dispose(true);
		return res;
	}

	/** @inheritdoc */
	public async $provideTestFollowups(req: TestMessageFollowupRequest, token: CancellationToken): Promise<TestMessageFollowupResponse[]> {
		const results = this.results.find(r => testResultInternalIDs.get(r) === req.resultId);
		const test = results && findTestInResultSnapshot(TestId.fromString(req.extId), results?.results);
		if (!test) {
			return [];
		}

		let followups: vscode.Command[] = [];
		await Promise.all([...this.followupProviders].map(async provider => {
			try {
				const r = await provider.provideFollowup(results, test, req.taskIndex, req.messageIndex, token);
				if (r) {
					followups = followups.concat(r);
				}
			} catch (e) {
				this.logService.error(`Error thrown while providing followup for test message`, e);
			}
		}));

		if (token.isCancellationRequested) {
			return [];
		}

		return followups.map(command => {
			const id = followupCounter++;
			this.testFollowups.set(id, command);
			return { title: command.title, id };
		});
	}

	$disposeTestFollowups(id: number[]): void {
		for (const i of id) {
			this.testFollowups.delete(i);
		}
	}

	$executeTestFollowup(id: number): Promise<void> {
		const command = this.testFollowups.get(id);
		if (!command) {
			return Promise.resolve();
		}

		return this.commands.executeCommand(command.command, ...(command.arguments || []));
	}

	/**
	 * Cancels an ongoing test run.
	 */
	public $cancelExtensionTestRun(runId: string | undefined, taskId: string | undefined) {
		if (runId === undefined) {
			this.runTracker.cancelAllRuns();
		} else {
			this.runTracker.cancelRunById(runId, taskId);
		}
	}

	//#endregion

	public getMetadataForRun(run: vscode.TestRun) {
		for (const tracker of this.runTracker.trackers) {
			const taskId = tracker.getTaskIdForRun(run);
			if (taskId) {
				return { taskId, runId: tracker.id };
			}
		}

		return undefined;
	}

	private async runControllerTestRequest(req: ICallProfileRunHandler | ICallProfileRunHandler, isContinuous: boolean, token: CancellationToken): Promise<IStartControllerTestsResult> {
		const lookup = this.controllers.get(req.controllerId);
		if (!lookup) {
			return {};
		}

		const { collection, profiles, extension } = lookup;
		const profile = profiles.get(req.profileId);
		if (!profile) {
			return {};
		}

		const includeTests = req.testIds
			.map((testId) => collection.tree.get(testId))
			.filter(isDefined);

		const excludeTests = req.excludeExtIds
			.map(id => lookup.collection.tree.get(id))
			.filter(isDefined)
			.filter(exclude => includeTests.some(
				include => include.fullId.compare(exclude.fullId) === TestPosition.IsChild,
			));

		if (!includeTests.length) {
			return {};
		}

		const publicReq = new TestRunRequest(
			includeTests.some(i => i.actual instanceof TestItemRootImpl) ? undefined : includeTests.map(t => t.actual),
			excludeTests.map(t => t.actual),
			profile,
			isContinuous,
		);

		const tracker = isStartControllerTests(req) && this.runTracker.prepareForMainThreadTestRun(
			extension,
			publicReq,
			TestRunDto.fromInternal(req, lookup.collection),
			profile,
			token,
		);

		try {
			await profile.runHandler(publicReq, token);
			return {};
		} catch (e) {
			return { error: String(e) };
		} finally {
			if (tracker) {
				if (tracker.hasRunningTasks && !token.isCancellationRequested) {
					await Event.toPromise(tracker.onEnd);
				}
			}
		}
	}
}

// Deadline after being requested by a user that a test run is forcibly cancelled.
const RUN_CANCEL_DEADLINE = 10_000;

const enum TestRunTrackerState {
	// Default state
	Running,
	// Cancellation is requested, but the run is still going.
	Cancelling,
	// All tasks have ended
	Ended,
}

class TestRunTracker extends Disposable {
	private state = TestRunTrackerState.Running;
	private running = 0;
	private readonly tasks = new Map</* task ID */string, { cts: CancellationTokenSource; run: vscode.TestRun }>();
	private readonly sharedTestIds = new Set<string>();
	private readonly cts: CancellationTokenSource;
	private readonly endEmitter = this._register(new Emitter<void>());
	private readonly onDidDispose: Event<void>;
	private readonly publishedCoverage = new Map<string, { report: vscode.FileCoverage; extIds: string[] }>();

	/**
	 * Fires when a test ends, and no more tests are left running.
	 */
	public readonly onEnd = this.endEmitter.event;

	/**
	 * Gets whether there are any tests running.
	 */
	public get hasRunningTasks() {
		return this.running > 0;
	}

	/**
	 * Gets the run ID.
	 */
	public get id() {
		return this.dto.id;
	}

	constructor(
		private readonly dto: TestRunDto,
		private readonly proxy: MainThreadTestingShape,
		private readonly logService: ILogService,
		private readonly profile: vscode.TestRunProfile | undefined,
		private readonly extension: IExtensionDescription,
		parentToken?: CancellationToken,
	) {
		super();
		this.cts = this._register(new CancellationTokenSource(parentToken));

		const forciblyEnd = this._register(new RunOnceScheduler(() => this.forciblyEndTasks(), RUN_CANCEL_DEADLINE));
		this._register(this.cts.token.onCancellationRequested(() => forciblyEnd.schedule()));

		const didDisposeEmitter = new Emitter<void>();
		this.onDidDispose = didDisposeEmitter.event;
		this._register(toDisposable(() => {
			didDisposeEmitter.fire();
			didDisposeEmitter.dispose();
		}));
	}

	/** Gets the task ID from a test run object. */
	public getTaskIdForRun(run: vscode.TestRun) {
		for (const [taskId, { run: r }] of this.tasks) {
			if (r === run) {
				return taskId;
			}
		}

		return undefined;
	}

	/** Requests cancellation of the run. On the second call, forces cancellation. */
	public cancel(taskId?: string) {
		if (taskId) {
			this.tasks.get(taskId)?.cts.cancel();
		} else if (this.state === TestRunTrackerState.Running) {
			this.cts.cancel();
			this.state = TestRunTrackerState.Cancelling;
		} else if (this.state === TestRunTrackerState.Cancelling) {
			this.forciblyEndTasks();
		}
	}

	/** Gets details for a previously-emitted coverage object. */
	public async getCoverageDetails(id: string, testId: string | undefined, token: CancellationToken): Promise<vscode.FileCoverageDetail[]> {
		const [, taskId] = TestId.fromString(id).path; /** runId, taskId, URI */
		const coverage = this.publishedCoverage.get(id);
		if (!coverage) {
			return [];
		}

		const { report, extIds } = coverage;
		const task = this.tasks.get(taskId);
		if (!task) {
			throw new Error('unreachable: run task was not found');
		}

		let testItem: vscode.TestItem | undefined;
		if (testId && report instanceof FileCoverage) {
			const index = extIds.indexOf(testId);
			if (index === -1) {
				return []; // ??
			}
			testItem = report.includesTests[index];
		}

		const details = testItem
			? this.profile?.loadDetailedCoverageForTest?.(task.run, report, testItem, token)
			: this.profile?.loadDetailedCoverage?.(task.run, report, token);

		return (await details) ?? [];
	}

	/** Creates the public test run interface to give to extensions. */
	public createRun(name: string | undefined): vscode.TestRun {
		const runId = this.dto.id;
		const ctrlId = this.dto.controllerId;
		const taskId = generateUuid();

		const guardTestMutation = <Args extends unknown[]>(fn: (test: vscode.TestItem, ...args: Args) => void) =>
			(test: vscode.TestItem, ...args: Args) => {
				if (ended) {
					this.logService.warn(`Setting the state of test "${test.id}" is a no-op after the run ends.`);
					return;
				}

				this.ensureTestIsKnown(test);
				fn(test, ...args);
			};

		const appendMessages = (test: vscode.TestItem, messages: vscode.TestMessage | readonly vscode.TestMessage[]) => {
			const converted = messages instanceof Array
				? messages.map(Convert.TestMessage.from)
				: [Convert.TestMessage.from(messages)];

			if (test.uri && test.range) {
				const defaultLocation: ILocationDto = { range: Convert.Range.from(test.range), uri: test.uri };
				for (const message of converted) {
					message.location = message.location || defaultLocation;
				}
			}

			this.proxy.$appendTestMessagesInRun(runId, taskId, TestId.fromExtHostTestItem(test, ctrlId).toString(), converted);
		};

		let ended = false;
		// tasks are alive for as long as the tracker is alive, so simple this._register is fine:
		const cts = this._register(new CancellationTokenSource(this.cts.token));

		// one-off map used to associate test items with incrementing IDs in `addCoverage`.
		// There's no need to include their entire ID, we just want to make sure they're
		// stable and unique. Normal map is okay since TestRun lifetimes are limited.
		const run: vscode.TestRun = {
			isPersisted: this.dto.isPersisted,
			token: cts.token,
			name,
			onDidDispose: this.onDidDispose,
			addCoverage: (coverage) => {
				if (ended) {
					return;
				}

				const includesTests = coverage instanceof FileCoverage ? coverage.includesTests : [];
				if (includesTests.length) {
					for (const test of includesTests) {
						this.ensureTestIsKnown(test);
					}
				}

				const uriStr = coverage.uri.toString();
				const id = new TestId([runId, taskId, uriStr]).toString();
				// it's a lil funky, but it's possible for a test item's ID to change after
				// it's been reported if it's rehomed under a different parent. Record its
				// ID at the time when the coverage report is generated so we can reference
				// it later if needeed.
				this.publishedCoverage.set(id, { report: coverage, extIds: includesTests.map(t => TestId.fromExtHostTestItem(t, ctrlId).toString()) });
				this.proxy.$appendCoverage(runId, taskId, Convert.TestCoverage.fromFile(ctrlId, id, coverage));
			},
			//#region state mutation
			enqueued: guardTestMutation(test => {
				this.proxy.$updateTestStateInRun(runId, taskId, TestId.fromExtHostTestItem(test, ctrlId).toString(), TestResultState.Queued);
			}),
			skipped: guardTestMutation(test => {
				this.proxy.$updateTestStateInRun(runId, taskId, TestId.fromExtHostTestItem(test, ctrlId).toString(), TestResultState.Skipped);
			}),
			started: guardTestMutation(test => {
				this.proxy.$updateTestStateInRun(runId, taskId, TestId.fromExtHostTestItem(test, ctrlId).toString(), TestResultState.Running);
			}),
			errored: guardTestMutation((test, messages, duration) => {
				appendMessages(test, messages);
				this.proxy.$updateTestStateInRun(runId, taskId, TestId.fromExtHostTestItem(test, ctrlId).toString(), TestResultState.Errored, duration);
			}),
			failed: guardTestMutation((test, messages, duration) => {
				appendMessages(test, messages);
				this.proxy.$updateTestStateInRun(runId, taskId, TestId.fromExtHostTestItem(test, ctrlId).toString(), TestResultState.Failed, duration);
			}),
			passed: guardTestMutation((test, duration) => {
				this.proxy.$updateTestStateInRun(runId, taskId, TestId.fromExtHostTestItem(test, this.dto.controllerId).toString(), TestResultState.Passed, duration);
			}),
			//#endregion
			appendOutput: (output, location?: vscode.Location, test?: vscode.TestItem) => {
				if (ended) {
					return;
				}

				if (test) {
					this.ensureTestIsKnown(test);
				}

				this.proxy.$appendOutputToRun(
					runId,
					taskId,
					VSBuffer.fromString(output),
					location && Convert.location.from(location),
					test && TestId.fromExtHostTestItem(test, ctrlId).toString(),
				);
			},
			end: () => {
				if (ended) {
					return;
				}

				ended = true;
				this.proxy.$finishedTestRunTask(runId, taskId);
				if (!--this.running) {
					this.markEnded();
				}
			}
		};

		this.running++;
		this.tasks.set(taskId, { run, cts });
		this.proxy.$startedTestRunTask(runId, {
			id: taskId,
			ctrlId: this.dto.controllerId,
			name: name || this.extension.displayName || this.extension.identifier.value,
			running: true,
		});

		return run;
	}

	private forciblyEndTasks() {
		for (const { run } of this.tasks.values()) {
			run.end();
		}
	}

	private markEnded() {
		if (this.state !== TestRunTrackerState.Ended) {
			this.state = TestRunTrackerState.Ended;
			this.endEmitter.fire();
		}
	}

	private ensureTestIsKnown(test: vscode.TestItem) {
		if (!(test instanceof TestItemImpl)) {
			throw new InvalidTestItemError(test.id);
		}

		if (this.sharedTestIds.has(TestId.fromExtHostTestItem(test, this.dto.controllerId).toString())) {
			return;
		}

		const chain: ITestItem.Serialized[] = [];
		const root = this.dto.colllection.root;
		while (true) {
			const converted = Convert.TestItem.from(test as TestItemImpl);
			chain.unshift(converted);

			if (this.sharedTestIds.has(converted.extId)) {
				break;
			}

			this.sharedTestIds.add(converted.extId);
			if (test === root) {
				break;
			}

			test = test.parent || root;
		}

		this.proxy.$addTestsToRun(this.dto.controllerId, this.dto.id, chain);
	}

	public override dispose(): void {
		this.markEnded();
		super.dispose();
	}
}

/**
 * Queues runs for a single extension and provides the currently-executing
 * run so that `createTestRun` can be properly correlated.
 */
export class TestRunCoordinator {
	private readonly tracked = new Map<vscode.TestRunRequest, TestRunTracker>();
	private readonly trackedById = new Map<string, TestRunTracker>();

	public get trackers() {
		return this.tracked.values();
	}

	constructor(
		private readonly proxy: MainThreadTestingShape,
		private readonly logService: ILogService,
	) { }

	/**
	 * Gets a coverage report for a given run and task ID.
	 */
	public getCoverageDetails(id: string, testId: string | undefined, token: vscode.CancellationToken) {
		const runId = TestId.root(id);
		return this.trackedById.get(runId)?.getCoverageDetails(id, testId, token) || [];
	}

	/**
	 * Disposes the test run, called when the main thread is no longer interested
	 * in associated data.
	 */
	public disposeTestRun(runId: string) {
		this.trackedById.get(runId)?.dispose();
		this.trackedById.delete(runId);
		for (const [req, { id }] of this.tracked) {
			if (id === runId) {
				this.tracked.delete(req);
			}
		}
	}

	/**
	 * Registers a request as being invoked by the main thread, so
	 * `$startedExtensionTestRun` is not invoked. The run must eventually
	 * be cancelled manually.
	 */
	public prepareForMainThreadTestRun(extension: IExtensionDescription, req: vscode.TestRunRequest, dto: TestRunDto, profile: vscode.TestRunProfile, token: CancellationToken) {
		return this.getTracker(req, dto, profile, extension, token);
	}

	/**
	 * Cancels an existing test run via its cancellation token.
	 */
	public cancelRunById(runId: string, taskId?: string) {
		this.trackedById.get(runId)?.cancel(taskId);
	}

	/**
	 * Cancels an existing test run via its cancellation token.
	 */
	public cancelAllRuns() {
		for (const tracker of this.tracked.values()) {
			tracker.cancel();
		}
	}

	/**
	 * Implements the public `createTestRun` API.
	 */
	public createTestRun(extension: IExtensionDescription, controllerId: string, collection: ExtHostTestItemCollection, request: vscode.TestRunRequest, name: string | undefined, persist: boolean): vscode.TestRun {
		const existing = this.tracked.get(request);
		if (existing) {
			return existing.createRun(name);
		}

		// If there is not an existing tracked extension for the request, start
		// a new, detached session.
		const dto = TestRunDto.fromPublic(controllerId, collection, request, persist);
		const profile = tryGetProfileFromTestRunReq(request);
		this.proxy.$startedExtensionTestRun({
			controllerId,
			continuous: !!request.continuous,
			profile: profile && { group: Convert.TestRunProfileKind.from(profile.kind), id: profile.profileId },
			exclude: request.exclude?.map(t => TestId.fromExtHostTestItem(t, collection.root.id).toString()) ?? [],
			id: dto.id,
			include: request.include?.map(t => TestId.fromExtHostTestItem(t, collection.root.id).toString()) ?? [collection.root.id],
			preserveFocus: request.preserveFocus ?? true,
			persist
		});

		const tracker = this.getTracker(request, dto, request.profile, extension);
		Event.once(tracker.onEnd)(() => {
			this.proxy.$finishedExtensionTestRun(dto.id);
		});

		return tracker.createRun(name);
	}

	private getTracker(req: vscode.TestRunRequest, dto: TestRunDto, profile: vscode.TestRunProfile | undefined, extension: IExtensionDescription, token?: CancellationToken) {
		const tracker = new TestRunTracker(dto, this.proxy, this.logService, profile, extension, token);
		this.tracked.set(req, tracker);
		this.trackedById.set(tracker.id, tracker);
		return tracker;
	}
}

const tryGetProfileFromTestRunReq = (request: vscode.TestRunRequest) => {
	if (!request.profile) {
		return undefined;
	}

	if (!(request.profile instanceof TestRunProfileImpl)) {
		throw new Error(`TestRunRequest.profile is not an instance created from TestController.createRunProfile`);
	}

	return request.profile;
};

export class TestRunDto {
	public static fromPublic(controllerId: string, collection: ExtHostTestItemCollection, request: vscode.TestRunRequest, persist: boolean) {
		return new TestRunDto(
			controllerId,
			generateUuid(),
			persist,
			collection,
		);
	}

	public static fromInternal(request: IStartControllerTests, collection: ExtHostTestItemCollection) {
		return new TestRunDto(
			request.controllerId,
			request.runId,
			true,
			collection,
		);
	}

	constructor(
		public readonly controllerId: string,
		public readonly id: string,
		public readonly isPersisted: boolean,
		public readonly colllection: ExtHostTestItemCollection,
	) {
	}
}

/**
 * @private
 */
interface MirroredCollectionTestItem extends IncrementalTestCollectionItem {
	revived: vscode.TestItem;
	depth: number;
}

class MirroredChangeCollector implements IncrementalChangeCollector<MirroredCollectionTestItem> {
	private readonly added = new Set<MirroredCollectionTestItem>();
	private readonly updated = new Set<MirroredCollectionTestItem>();
	private readonly removed = new Set<MirroredCollectionTestItem>();

	private readonly alreadyRemoved = new Set<string>();

	public get isEmpty() {
		return this.added.size === 0 && this.removed.size === 0 && this.updated.size === 0;
	}

	constructor(private readonly emitter: Emitter<vscode.TestsChangeEvent>) {
	}

	/**
	 * @inheritdoc
	 */
	public add(node: MirroredCollectionTestItem): void {
		this.added.add(node);
	}

	/**
	 * @inheritdoc
	 */
	public update(node: MirroredCollectionTestItem): void {
		Object.assign(node.revived, Convert.TestItem.toPlain(node.item));
		if (!this.added.has(node)) {
			this.updated.add(node);
		}
	}

	/**
	 * @inheritdoc
	 */
	public remove(node: MirroredCollectionTestItem): void {
		if (this.added.delete(node)) {
			return;
		}

		this.updated.delete(node);

		const parentId = TestId.parentId(node.item.extId);
		if (parentId && this.alreadyRemoved.has(parentId.toString())) {
			this.alreadyRemoved.add(node.item.extId);
			return;
		}

		this.removed.add(node);
	}

	/**
	 * @inheritdoc
	 */
	public getChangeEvent(): vscode.TestsChangeEvent {
		const { added, updated, removed } = this;
		return {
			get added() { return [...added].map(n => n.revived); },
			get updated() { return [...updated].map(n => n.revived); },
			get removed() { return [...removed].map(n => n.revived); },
		};
	}

	public complete() {
		if (!this.isEmpty) {
			this.emitter.fire(this.getChangeEvent());
		}
	}
}

/**
 * Maintains tests in this extension host sent from the main thread.
 * @private
 */
class MirroredTestCollection extends AbstractIncrementalTestCollection<MirroredCollectionTestItem> {
	private changeEmitter = new Emitter<vscode.TestsChangeEvent>();

	/**
	 * Change emitter that fires with the same semantics as `TestObserver.onDidChangeTests`.
	 */
	public readonly onDidChangeTests = this.changeEmitter.event;

	/**
	 * Gets a list of root test items.
	 */
	public get rootTests() {
		return this.roots;
	}

	/**
	 *
	 * If the test ID exists, returns its underlying ID.
	 */
	public getMirroredTestDataById(itemId: string) {
		return this.items.get(itemId);
	}

	/**
	 * If the test item is a mirrored test item, returns its underlying ID.
	 */
	public getMirroredTestDataByReference(item: vscode.TestItem) {
		return this.items.get(item.id);
	}

	/**
	 * @override
	 */
	protected createItem(item: InternalTestItem, parent?: MirroredCollectionTestItem): MirroredCollectionTestItem {
		return {
			...item,
			// todo@connor4312: make this work well again with children
			revived: Convert.TestItem.toPlain(item.item) as vscode.TestItem,
			depth: parent ? parent.depth + 1 : 0,
			children: new Set(),
		};
	}

	/**
	 * @override
	 */
	protected override createChangeCollector() {
		return new MirroredChangeCollector(this.changeEmitter);
	}
}

class TestObservers {
	private current?: {
		observers: number;
		tests: MirroredTestCollection;
	};

	constructor(
		private readonly proxy: MainThreadTestingShape,
	) {
	}

	public checkout(): vscode.TestObserver {
		if (!this.current) {
			this.current = this.createObserverData();
		}

		const current = this.current;
		current.observers++;

		return {
			onDidChangeTest: current.tests.onDidChangeTests,
			get tests() { return [...current.tests.rootTests].map(t => t.revived); },
			dispose: createSingleCallFunction(() => {
				if (--current.observers === 0) {
					this.proxy.$unsubscribeFromDiffs();
					this.current = undefined;
				}
			}),
		};
	}

	/**
	 * Gets the internal test data by its reference.
	 */
	public getMirroredTestDataByReference(ref: vscode.TestItem) {
		return this.current?.tests.getMirroredTestDataByReference(ref);
	}

	/**
	 * Applies test diffs to the current set of observed tests.
	 */
	public applyDiff(diff: TestsDiff) {
		this.current?.tests.apply(diff);
	}

	private createObserverData() {
		const tests = new MirroredTestCollection({ asCanonicalUri: u => u });
		this.proxy.$subscribeToDiffs();
		return { observers: 0, tests, };
	}
}

const updateProfile = (impl: TestRunProfileImpl, proxy: MainThreadTestingShape, initial: ITestRunProfile | undefined, update: Partial<ITestRunProfile>) => {
	if (initial) {
		Object.assign(initial, update);
	} else {
		proxy.$updateTestRunConfig(impl.controllerId, impl.profileId, update);
	}
};

export class TestRunProfileImpl extends TestRunProfileBase implements vscode.TestRunProfile {
	readonly #proxy: MainThreadTestingShape;
	readonly #activeProfiles: Set<number>;
	readonly #onDidChangeDefaultProfiles: Event<DefaultProfileChangeEvent>;
	#initialPublish?: ITestRunProfile;
	#profiles?: Map<number, vscode.TestRunProfile>;
	private _configureHandler?: (() => void);

	public get label() {
		return this._label;
	}

	public set label(label: string) {
		if (label !== this._label) {
			this._label = label;
			updateProfile(this, this.#proxy, this.#initialPublish, { label });
		}
	}

	public get supportsContinuousRun() {
		return this._supportsContinuousRun;
	}

	public set supportsContinuousRun(supports: boolean) {
		if (supports !== this._supportsContinuousRun) {
			this._supportsContinuousRun = supports;
			updateProfile(this, this.#proxy, this.#initialPublish, { supportsContinuousRun: supports });
		}
	}

	public get isDefault() {
		return this.#activeProfiles.has(this.profileId);
	}

	public set isDefault(isDefault: boolean) {
		if (isDefault !== this.isDefault) {
			// #activeProfiles is synced from the main thread, so we can make
			// provisional changes here that will get confirmed momentarily
			if (isDefault) {
				this.#activeProfiles.add(this.profileId);
			} else {
				this.#activeProfiles.delete(this.profileId);
			}

			updateProfile(this, this.#proxy, this.#initialPublish, { isDefault });
		}
	}

	public get tag() {
		return this._tag;
	}

	public set tag(tag: vscode.TestTag | undefined) {
		if (tag?.id !== this._tag?.id) {
			this._tag = tag;
			updateProfile(this, this.#proxy, this.#initialPublish, {
				tag: tag ? Convert.TestTag.namespace(this.controllerId, tag.id) : null,
			});
		}
	}

	public get configureHandler() {
		return this._configureHandler;
	}

	public set configureHandler(handler: undefined | (() => void)) {
		if (handler !== this._configureHandler) {
			this._configureHandler = handler;
			updateProfile(this, this.#proxy, this.#initialPublish, { hasConfigurationHandler: !!handler });
		}
	}

	public get onDidChangeDefault() {
		return Event.chain(this.#onDidChangeDefaultProfiles, $ => $
			.map(ev => ev.get(this.controllerId)?.get(this.profileId))
			.filter(isDefined)
		);
	}

	constructor(
		proxy: MainThreadTestingShape,
		profiles: Map<number, vscode.TestRunProfile>,
		activeProfiles: Set<number>,
		onDidChangeActiveProfiles: Event<DefaultProfileChangeEvent>,
		controllerId: string,
		profileId: number,
		private _label: string,
		kind: vscode.TestRunProfileKind,
		public runHandler: (request: vscode.TestRunRequest, token: vscode.CancellationToken) => Thenable<void> | void,
		_isDefault = false,
		public _tag: vscode.TestTag | undefined = undefined,
		private _supportsContinuousRun = false,
	) {
		super(controllerId, profileId, kind);

		this.#proxy = proxy;
		this.#profiles = profiles;
		this.#activeProfiles = activeProfiles;
		this.#onDidChangeDefaultProfiles = onDidChangeActiveProfiles;
		profiles.set(profileId, this);

		const groupBitset = Convert.TestRunProfileKind.from(kind);
		if (_isDefault) {
			activeProfiles.add(profileId);
		}

		this.#initialPublish = {
			profileId: profileId,
			controllerId,
			tag: _tag ? Convert.TestTag.namespace(this.controllerId, _tag.id) : null,
			label: _label,
			group: groupBitset,
			isDefault: _isDefault,
			hasConfigurationHandler: false,
			supportsContinuousRun: _supportsContinuousRun,
		};

		// we send the initial profile publish out on the next microtask so that
		// initially setting the isDefault value doesn't overwrite a user-configured value
		queueMicrotask(() => {
			if (this.#initialPublish) {
				this.#proxy.$publishTestRunProfile(this.#initialPublish);
				this.#initialPublish = undefined;
			}
		});
	}

	dispose(): void {
		if (this.#profiles?.delete(this.profileId)) {
			this.#profiles = undefined;
			this.#proxy.$removeTestProfile(this.controllerId, this.profileId);
		}
		this.#initialPublish = undefined;
	}
}

function findTestInResultSnapshot(extId: TestId, snapshot: readonly Readonly<vscode.TestResultSnapshot>[]) {
	for (let i = 0; i < extId.path.length; i++) {
		const item = snapshot.find(s => s.id === extId.path[i]);
		if (!item) {
			return undefined;
		}

		if (i === extId.path.length - 1) {
			return item;
		}

		snapshot = item.children;
	}

	return undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostTestingPrivateApi.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTestingPrivateApi.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtHostTestItemEvent, InvalidTestItemError } from '../../contrib/testing/common/testItemCollection.js';
import * as vscode from 'vscode';

export interface IExtHostTestItemApi {
	controllerId: string;
	parent?: vscode.TestItem;
	listener?: (evt: ExtHostTestItemEvent) => void;
}

const eventPrivateApis = new WeakMap<vscode.TestItem, IExtHostTestItemApi>();

export const createPrivateApiFor = (impl: vscode.TestItem, controllerId: string) => {
	const api: IExtHostTestItemApi = { controllerId };
	eventPrivateApis.set(impl, api);
	return api;
};

/**
 * Gets the private API for a test item implementation. This implementation
 * is a managed object, but we keep a weakmap to avoid exposing any of the
 * internals to extensions.
 */
export const getPrivateApiFor = (impl: vscode.TestItem) => {
	const api = eventPrivateApis.get(impl);
	if (!api) {
		throw new InvalidTestItemError(impl?.id || '<unknown>');
	}

	return api;
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostTestItem.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTestItem.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { URI } from '../../../base/common/uri.js';
import * as editorRange from '../../../editor/common/core/range.js';
import { TestId, TestIdPathParts } from '../../contrib/testing/common/testId.js';
import { createTestItemChildren, ExtHostTestItemEvent, ITestChildrenLike, ITestItemApi, ITestItemChildren, TestItemCollection, TestItemEventOp } from '../../contrib/testing/common/testItemCollection.js';
import { denamespaceTestTag, ITestItem, ITestItemContext } from '../../contrib/testing/common/testTypes.js';
import { ExtHostDocumentsAndEditors } from './extHostDocumentsAndEditors.js';
import { createPrivateApiFor, getPrivateApiFor, IExtHostTestItemApi } from './extHostTestingPrivateApi.js';
import * as Convert from './extHostTypeConverters.js';

const testItemPropAccessor = <K extends keyof vscode.TestItem>(
	api: IExtHostTestItemApi,
	defaultValue: vscode.TestItem[K],
	equals: (a: vscode.TestItem[K], b: vscode.TestItem[K]) => boolean,
	toUpdate: (newValue: vscode.TestItem[K], oldValue: vscode.TestItem[K]) => ExtHostTestItemEvent,
) => {
	let value = defaultValue;
	return {
		enumerable: true,
		configurable: false,
		get() {
			return value;
		},
		set(newValue: vscode.TestItem[K]) {
			if (!equals(value, newValue)) {
				const oldValue = value;
				value = newValue;
				api.listener?.(toUpdate(newValue, oldValue));
			}
		},
	};
};

type WritableProps = Pick<vscode.TestItem, 'range' | 'label' | 'description' | 'sortText' | 'canResolveChildren' | 'busy' | 'error' | 'tags'>;

const strictEqualComparator = <T>(a: T, b: T) => a === b;

const propComparators: { [K in keyof Required<WritableProps>]: (a: vscode.TestItem[K], b: vscode.TestItem[K]) => boolean } = {
	range: (a, b) => {
		if (a === b) { return true; }
		if (!a || !b) { return false; }
		return a.isEqual(b);
	},
	label: strictEqualComparator,
	description: strictEqualComparator,
	sortText: strictEqualComparator,
	busy: strictEqualComparator,
	error: strictEqualComparator,
	canResolveChildren: strictEqualComparator,
	tags: (a, b) => {
		if (a.length !== b.length) {
			return false;
		}

		if (a.some(t1 => !b.find(t2 => t1.id === t2.id))) {
			return false;
		}

		return true;
	},
};

const evSetProps = <T>(fn: (newValue: T) => Partial<ITestItem>): (newValue: T) => ExtHostTestItemEvent =>
	v => ({ op: TestItemEventOp.SetProp, update: fn(v) });

const makePropDescriptors = (api: IExtHostTestItemApi, label: string): { [K in keyof Required<WritableProps>]: PropertyDescriptor } => ({
	range: (() => {
		let value: vscode.Range | undefined;
		const updateProps = evSetProps<vscode.Range | undefined>(r => ({ range: editorRange.Range.lift(Convert.Range.from(r)) }));
		return {
			enumerable: true,
			configurable: false,
			get() {
				return value;
			},
			set(newValue: vscode.Range | undefined) {
				api.listener?.({ op: TestItemEventOp.DocumentSynced });
				if (!propComparators.range(value, newValue)) {
					value = newValue;
					api.listener?.(updateProps(newValue));
				}
			},
		};
	})(),
	label: testItemPropAccessor<'label'>(api, label, propComparators.label, evSetProps(label => ({ label }))),
	description: testItemPropAccessor<'description'>(api, undefined, propComparators.description, evSetProps(description => ({ description }))),
	sortText: testItemPropAccessor<'sortText'>(api, undefined, propComparators.sortText, evSetProps(sortText => ({ sortText }))),
	canResolveChildren: testItemPropAccessor<'canResolveChildren'>(api, false, propComparators.canResolveChildren, state => ({
		op: TestItemEventOp.UpdateCanResolveChildren,
		state,
	})),
	busy: testItemPropAccessor<'busy'>(api, false, propComparators.busy, evSetProps(busy => ({ busy }))),
	error: testItemPropAccessor<'error'>(api, undefined, propComparators.error, evSetProps(error => ({ error: Convert.MarkdownString.fromStrict(error) || null }))),
	tags: testItemPropAccessor<'tags'>(api, [], propComparators.tags, (current, previous) => ({
		op: TestItemEventOp.SetTags,
		new: current.map(Convert.TestTag.from),
		old: previous.map(Convert.TestTag.from),
	})),
});

const toItemFromPlain = (item: ITestItem.Serialized): TestItemImpl => {
	const testId = TestId.fromString(item.extId);
	const testItem = new TestItemImpl(testId.controllerId, testId.localId, item.label, URI.revive(item.uri) || undefined);
	testItem.range = Convert.Range.to(item.range || undefined);
	testItem.description = item.description || undefined;
	testItem.sortText = item.sortText || undefined;
	testItem.tags = item.tags.map(t => Convert.TestTag.to({ id: denamespaceTestTag(t).tagId }));
	return testItem;
};

export const toItemFromContext = (context: ITestItemContext): TestItemImpl => {
	let node: TestItemImpl | undefined;
	for (const test of context.tests) {
		const next = toItemFromPlain(test.item);
		getPrivateApiFor(next).parent = node;
		node = next;
	}

	return node!;
};

export class TestItemImpl implements vscode.TestItem {
	public readonly id!: string;
	public readonly uri!: vscode.Uri | undefined;
	public readonly children!: ITestItemChildren<vscode.TestItem>;
	public readonly parent!: TestItemImpl | undefined;

	public range!: vscode.Range | undefined;
	public description!: string | undefined;
	public sortText!: string | undefined;
	public label!: string;
	public error!: string | vscode.MarkdownString;
	public busy!: boolean;
	public canResolveChildren!: boolean;
	public tags!: readonly vscode.TestTag[];

	/**
	 * Note that data is deprecated and here for back-compat only
	 */
	constructor(controllerId: string, id: string, label: string, uri: vscode.Uri | undefined) {
		if (id.includes(TestIdPathParts.Delimiter)) {
			throw new Error(`Test IDs may not include the ${JSON.stringify(id)} symbol`);
		}

		const api = createPrivateApiFor(this, controllerId);
		Object.defineProperties(this, {
			id: {
				value: id,
				enumerable: true,
				writable: false,
			},
			uri: {
				value: uri,
				enumerable: true,
				writable: false,
			},
			parent: {
				enumerable: false,
				get() {
					return api.parent instanceof TestItemRootImpl ? undefined : api.parent;
				},
			},
			children: {
				value: createTestItemChildren(api, getPrivateApiFor, TestItemImpl),
				enumerable: true,
				writable: false,
			},
			...makePropDescriptors(api, label),
		});
	}
}

export class TestItemRootImpl extends TestItemImpl {
	public readonly _isRoot = true;

	constructor(controllerId: string, label: string) {
		super(controllerId, controllerId, label, undefined);
	}
}

export class ExtHostTestItemCollection extends TestItemCollection<TestItemImpl> {
	constructor(controllerId: string, controllerLabel: string, editors: ExtHostDocumentsAndEditors) {
		super({
			controllerId,
			getDocumentVersion: uri => uri && editors.getDocument(uri)?.version,
			getApiFor: getPrivateApiFor as (impl: TestItemImpl) => ITestItemApi<TestItemImpl>,
			getChildren: (item) => item.children as ITestChildrenLike<TestItemImpl>,
			root: new TestItemRootImpl(controllerId, controllerLabel),
			toITestItem: Convert.TestItem.from,
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostTextEditor.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTextEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ok } from '../../../base/common/assert.js';
import { ReadonlyError, illegalArgument } from '../../../base/common/errors.js';
import { IdGenerator } from '../../../base/common/idGenerator.js';
import { TextEditorCursorStyle } from '../../../editor/common/config/editorOptions.js';
import { IRange } from '../../../editor/common/core/range.js';
import { ISingleEditOperation } from '../../../editor/common/core/editOperation.js';
import { IResolvedTextEditorConfiguration, ITextEditorConfigurationUpdate, MainThreadTextEditorsShape } from './extHost.protocol.js';
import * as TypeConverters from './extHostTypeConverters.js';
import { EndOfLine, Position, Range, Selection, SnippetString, TextEditorLineNumbersStyle, TextEditorRevealType } from './extHostTypes.js';
import type * as vscode from 'vscode';
import { ILogService } from '../../../platform/log/common/log.js';
import { Lazy } from '../../../base/common/lazy.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';

export class TextEditorDecorationType {

	private static readonly _Keys = new IdGenerator('TextEditorDecorationType');

	readonly value: vscode.TextEditorDecorationType;

	constructor(proxy: MainThreadTextEditorsShape, extension: IExtensionDescription, options: vscode.DecorationRenderOptions) {
		const key = TextEditorDecorationType._Keys.nextId();
		proxy.$registerTextEditorDecorationType(extension.identifier, key, TypeConverters.DecorationRenderOptions.from(options));
		this.value = Object.freeze({
			key,
			dispose() {
				proxy.$removeTextEditorDecorationType(key);
			}
		});
	}

}

export interface ITextEditOperation {
	range: vscode.Range;
	text: string | null;
	forceMoveMarkers: boolean;
}

export interface IEditData {
	documentVersionId: number;
	edits: ITextEditOperation[];
	setEndOfLine: EndOfLine | undefined;
	undoStopBefore: boolean;
	undoStopAfter: boolean;
}

class TextEditorEdit {

	private readonly _document: vscode.TextDocument;
	private readonly _documentVersionId: number;
	private readonly _undoStopBefore: boolean;
	private readonly _undoStopAfter: boolean;
	private _collectedEdits: ITextEditOperation[] = [];
	private _setEndOfLine: EndOfLine | undefined = undefined;
	private _finalized: boolean = false;

	constructor(document: vscode.TextDocument, options: { undoStopBefore: boolean; undoStopAfter: boolean }) {
		this._document = document;
		this._documentVersionId = document.version;
		this._undoStopBefore = options.undoStopBefore;
		this._undoStopAfter = options.undoStopAfter;
	}

	finalize(): IEditData {
		this._finalized = true;
		return {
			documentVersionId: this._documentVersionId,
			edits: this._collectedEdits,
			setEndOfLine: this._setEndOfLine,
			undoStopBefore: this._undoStopBefore,
			undoStopAfter: this._undoStopAfter
		};
	}

	private _throwIfFinalized() {
		if (this._finalized) {
			throw new Error('Edit is only valid while callback runs');
		}
	}

	replace(location: Position | Range | Selection, value: string): void {
		this._throwIfFinalized();
		let range: Range | null = null;

		if (location instanceof Position) {
			range = new Range(location, location);
		} else if (location instanceof Range) {
			range = location;
		} else {
			throw new Error('Unrecognized location');
		}

		this._pushEdit(range, value, false);
	}

	insert(location: Position, value: string): void {
		this._throwIfFinalized();
		this._pushEdit(new Range(location, location), value, true);
	}

	delete(location: Range | Selection): void {
		this._throwIfFinalized();
		let range: Range | null = null;

		if (location instanceof Range) {
			range = location;
		} else {
			throw new Error('Unrecognized location');
		}

		this._pushEdit(range, null, true);
	}

	private _pushEdit(range: Range, text: string | null, forceMoveMarkers: boolean): void {
		const validRange = this._document.validateRange(range);
		this._collectedEdits.push({
			range: validRange,
			text: text,
			forceMoveMarkers: forceMoveMarkers
		});
	}

	setEndOfLine(endOfLine: EndOfLine): void {
		this._throwIfFinalized();
		if (endOfLine !== EndOfLine.LF && endOfLine !== EndOfLine.CRLF) {
			throw illegalArgument('endOfLine');
		}

		this._setEndOfLine = endOfLine;
	}
}

export class ExtHostTextEditorOptions {

	private _proxy: MainThreadTextEditorsShape;
	private _id: string;
	private _logService: ILogService;

	private _tabSize!: number;
	private _indentSize!: number;
	private _originalIndentSize!: number | 'tabSize';
	private _insertSpaces!: boolean;
	private _cursorStyle!: TextEditorCursorStyle;
	private _lineNumbers!: TextEditorLineNumbersStyle;

	readonly value: vscode.TextEditorOptions;

	constructor(proxy: MainThreadTextEditorsShape, id: string, source: IResolvedTextEditorConfiguration, logService: ILogService) {
		this._proxy = proxy;
		this._id = id;
		this._accept(source);
		this._logService = logService;

		const that = this;

		this.value = {
			get tabSize(): number | string {
				return that._tabSize;
			},
			set tabSize(value: number | string) {
				that._setTabSize(value);
			},
			get indentSize(): number | string {
				return that._indentSize;
			},
			set indentSize(value: number | string) {
				that._setIndentSize(value);
			},
			get insertSpaces(): boolean | string {
				return that._insertSpaces;
			},
			set insertSpaces(value: boolean | string) {
				that._setInsertSpaces(value);
			},
			get cursorStyle(): TextEditorCursorStyle {
				return that._cursorStyle;
			},
			set cursorStyle(value: TextEditorCursorStyle) {
				that._setCursorStyle(value);
			},
			get lineNumbers(): TextEditorLineNumbersStyle {
				return that._lineNumbers;
			},
			set lineNumbers(value: TextEditorLineNumbersStyle) {
				that._setLineNumbers(value);
			}
		};
	}

	public _accept(source: IResolvedTextEditorConfiguration): void {
		this._tabSize = source.tabSize;
		this._indentSize = source.indentSize;
		this._originalIndentSize = source.originalIndentSize;
		this._insertSpaces = source.insertSpaces;
		this._cursorStyle = source.cursorStyle;
		this._lineNumbers = TypeConverters.TextEditorLineNumbersStyle.to(source.lineNumbers);
	}

	// --- internal: tabSize

	private _validateTabSize(value: number | string): number | 'auto' | null {
		if (value === 'auto') {
			return 'auto';
		}
		if (typeof value === 'number') {
			const r = Math.floor(value);
			return (r > 0 ? r : null);
		}
		if (typeof value === 'string') {
			const r = parseInt(value, 10);
			if (isNaN(r)) {
				return null;
			}
			return (r > 0 ? r : null);
		}
		return null;
	}

	private _setTabSize(value: number | string) {
		const tabSize = this._validateTabSize(value);
		if (tabSize === null) {
			// ignore invalid call
			return;
		}
		if (typeof tabSize === 'number') {
			if (this._tabSize === tabSize) {
				// nothing to do
				return;
			}
			// reflect the new tabSize value immediately
			this._tabSize = tabSize;
		}
		this._warnOnError('setTabSize', this._proxy.$trySetOptions(this._id, {
			tabSize: tabSize
		}));
	}

	// --- internal: indentSize

	private _validateIndentSize(value: number | string): number | 'tabSize' | null {
		if (value === 'tabSize') {
			return 'tabSize';
		}
		if (typeof value === 'number') {
			const r = Math.floor(value);
			return (r > 0 ? r : null);
		}
		if (typeof value === 'string') {
			const r = parseInt(value, 10);
			if (isNaN(r)) {
				return null;
			}
			return (r > 0 ? r : null);
		}
		return null;
	}

	private _setIndentSize(value: number | string) {
		const indentSize = this._validateIndentSize(value);
		if (indentSize === null) {
			// ignore invalid call
			return;
		}
		if (typeof indentSize === 'number') {
			if (this._originalIndentSize === indentSize) {
				// nothing to do
				return;
			}
			// reflect the new indentSize value immediately
			this._indentSize = indentSize;
			this._originalIndentSize = indentSize;
		}
		this._warnOnError('setIndentSize', this._proxy.$trySetOptions(this._id, {
			indentSize: indentSize
		}));
	}

	// --- internal: insert spaces

	private _validateInsertSpaces(value: boolean | string): boolean | 'auto' {
		if (value === 'auto') {
			return 'auto';
		}
		return (value === 'false' ? false : Boolean(value));
	}

	private _setInsertSpaces(value: boolean | string) {
		const insertSpaces = this._validateInsertSpaces(value);
		if (typeof insertSpaces === 'boolean') {
			if (this._insertSpaces === insertSpaces) {
				// nothing to do
				return;
			}
			// reflect the new insertSpaces value immediately
			this._insertSpaces = insertSpaces;
		}
		this._warnOnError('setInsertSpaces', this._proxy.$trySetOptions(this._id, {
			insertSpaces: insertSpaces
		}));
	}

	// --- internal: cursor style

	private _setCursorStyle(value: TextEditorCursorStyle) {
		if (this._cursorStyle === value) {
			// nothing to do
			return;
		}
		this._cursorStyle = value;
		this._warnOnError('setCursorStyle', this._proxy.$trySetOptions(this._id, {
			cursorStyle: value
		}));
	}

	// --- internal: line number

	private _setLineNumbers(value: TextEditorLineNumbersStyle) {
		if (this._lineNumbers === value) {
			// nothing to do
			return;
		}
		this._lineNumbers = value;
		this._warnOnError('setLineNumbers', this._proxy.$trySetOptions(this._id, {
			lineNumbers: TypeConverters.TextEditorLineNumbersStyle.from(value)
		}));
	}

	public assign(newOptions: vscode.TextEditorOptions) {
		const bulkConfigurationUpdate: ITextEditorConfigurationUpdate = {};
		let hasUpdate = false;

		if (typeof newOptions.tabSize !== 'undefined') {
			const tabSize = this._validateTabSize(newOptions.tabSize);
			if (tabSize === 'auto') {
				hasUpdate = true;
				bulkConfigurationUpdate.tabSize = tabSize;
			} else if (typeof tabSize === 'number' && this._tabSize !== tabSize) {
				// reflect the new tabSize value immediately
				this._tabSize = tabSize;
				hasUpdate = true;
				bulkConfigurationUpdate.tabSize = tabSize;
			}
		}

		if (typeof newOptions.indentSize !== 'undefined') {
			const indentSize = this._validateIndentSize(newOptions.indentSize);
			if (indentSize === 'tabSize') {
				hasUpdate = true;
				bulkConfigurationUpdate.indentSize = indentSize;
			} else if (typeof indentSize === 'number' && this._originalIndentSize !== indentSize) {
				// reflect the new indentSize value immediately
				this._indentSize = indentSize;
				this._originalIndentSize = indentSize;
				hasUpdate = true;
				bulkConfigurationUpdate.indentSize = indentSize;
			}
		}

		if (typeof newOptions.insertSpaces !== 'undefined') {
			const insertSpaces = this._validateInsertSpaces(newOptions.insertSpaces);
			if (insertSpaces === 'auto') {
				hasUpdate = true;
				bulkConfigurationUpdate.insertSpaces = insertSpaces;
			} else if (this._insertSpaces !== insertSpaces) {
				// reflect the new insertSpaces value immediately
				this._insertSpaces = insertSpaces;
				hasUpdate = true;
				bulkConfigurationUpdate.insertSpaces = insertSpaces;
			}
		}

		if (typeof newOptions.cursorStyle !== 'undefined') {
			if (this._cursorStyle !== newOptions.cursorStyle) {
				this._cursorStyle = newOptions.cursorStyle;
				hasUpdate = true;
				bulkConfigurationUpdate.cursorStyle = newOptions.cursorStyle;
			}
		}

		if (typeof newOptions.lineNumbers !== 'undefined') {
			if (this._lineNumbers !== newOptions.lineNumbers) {
				this._lineNumbers = newOptions.lineNumbers;
				hasUpdate = true;
				bulkConfigurationUpdate.lineNumbers = TypeConverters.TextEditorLineNumbersStyle.from(newOptions.lineNumbers);
			}
		}

		if (hasUpdate) {
			this._warnOnError('setOptions', this._proxy.$trySetOptions(this._id, bulkConfigurationUpdate));
		}
	}

	private _warnOnError(action: string, promise: Promise<any>): void {
		promise.catch(err => {
			this._logService.warn(`ExtHostTextEditorOptions '${action}' failed:'`);
			this._logService.warn(err);
		});
	}
}

export class ExtHostTextEditor {

	private _selections: Selection[];
	private _options: ExtHostTextEditorOptions;
	private _visibleRanges: Range[];
	private _viewColumn: vscode.ViewColumn | undefined;
	private _disposed: boolean = false;
	private _hasDecorationsForKey = new Set<string>();
	private _diffInformation: vscode.TextEditorDiffInformation[] | undefined;

	readonly value: vscode.TextEditor;

	constructor(
		readonly id: string,
		private readonly _proxy: MainThreadTextEditorsShape,
		private readonly _logService: ILogService,
		document: Lazy<vscode.TextDocument>,
		selections: Selection[], options: IResolvedTextEditorConfiguration,
		visibleRanges: Range[], viewColumn: vscode.ViewColumn | undefined
	) {
		this._selections = selections;
		this._options = new ExtHostTextEditorOptions(this._proxy, this.id, options, _logService);
		this._visibleRanges = visibleRanges;
		this._viewColumn = viewColumn;

		const that = this;

		this.value = Object.freeze({
			get document(): vscode.TextDocument {
				return document.value;
			},
			set document(_value) {
				throw new ReadonlyError('document');
			},
			// --- selection
			get selection(): Selection {
				return that._selections && that._selections[0];
			},
			set selection(value: Selection) {
				if (!(value instanceof Selection)) {
					throw illegalArgument('selection');
				}
				that._selections = [value];
				that._trySetSelection();
			},
			get selections(): Selection[] {
				return that._selections;
			},
			set selections(value: Selection[]) {
				if (!Array.isArray(value) || value.some(a => !(a instanceof Selection))) {
					throw illegalArgument('selections');
				}
				if (value.length === 0) {
					value = [new Selection(0, 0, 0, 0)];
				}
				that._selections = value;
				that._trySetSelection();
			},
			// --- visible ranges
			get visibleRanges(): Range[] {
				return that._visibleRanges;
			},
			set visibleRanges(_value: Range[]) {
				throw new ReadonlyError('visibleRanges');
			},
			get diffInformation() {
				return that._diffInformation;
			},
			// --- options
			get options(): vscode.TextEditorOptions {
				return that._options.value;
			},
			set options(value: vscode.TextEditorOptions) {
				if (!that._disposed) {
					that._options.assign(value);
				}
			},
			// --- view column
			get viewColumn(): vscode.ViewColumn | undefined {
				return that._viewColumn;
			},
			set viewColumn(_value) {
				throw new ReadonlyError('viewColumn');
			},
			// --- edit
			edit(callback: (edit: TextEditorEdit) => void, options: { undoStopBefore: boolean; undoStopAfter: boolean } = { undoStopBefore: true, undoStopAfter: true }): Promise<boolean> {
				if (that._disposed) {
					return Promise.reject(new Error('TextEditor#edit not possible on closed editors'));
				}
				const edit = new TextEditorEdit(document.value, options);
				callback(edit);
				return that._applyEdit(edit);
			},
			// --- snippet edit
			insertSnippet(snippet: SnippetString, where?: Position | readonly Position[] | Range | readonly Range[], options: { undoStopBefore: boolean; undoStopAfter: boolean; keepWhitespace?: boolean } = { undoStopBefore: true, undoStopAfter: true }): Promise<boolean> {
				if (that._disposed) {
					return Promise.reject(new Error('TextEditor#insertSnippet not possible on closed editors'));
				}
				let ranges: IRange[];

				if (!where || (Array.isArray(where) && where.length === 0)) {
					ranges = that._selections.map(range => TypeConverters.Range.from(range));

				} else if (where instanceof Position) {
					const { lineNumber, column } = TypeConverters.Position.from(where);
					ranges = [{ startLineNumber: lineNumber, startColumn: column, endLineNumber: lineNumber, endColumn: column }];

				} else if (where instanceof Range) {
					ranges = [TypeConverters.Range.from(where)];
				} else {
					ranges = [];
					for (const posOrRange of where) {
						if (posOrRange instanceof Range) {
							ranges.push(TypeConverters.Range.from(posOrRange));
						} else {
							const { lineNumber, column } = TypeConverters.Position.from(posOrRange);
							ranges.push({ startLineNumber: lineNumber, startColumn: column, endLineNumber: lineNumber, endColumn: column });
						}
					}
				}
				if (options.keepWhitespace === undefined) {
					options.keepWhitespace = false;
				}
				return _proxy.$tryInsertSnippet(id, document.value.version, snippet.value, ranges, options);
			},
			setDecorations(decorationType: vscode.TextEditorDecorationType, ranges: Range[] | vscode.DecorationOptions[]): void {
				const willBeEmpty = (ranges.length === 0);
				if (willBeEmpty && !that._hasDecorationsForKey.has(decorationType.key)) {
					// avoid no-op call to the renderer
					return;
				}
				if (willBeEmpty) {
					that._hasDecorationsForKey.delete(decorationType.key);
				} else {
					that._hasDecorationsForKey.add(decorationType.key);
				}
				that._runOnProxy(() => {
					if (TypeConverters.isDecorationOptionsArr(ranges)) {
						return _proxy.$trySetDecorations(
							id,
							decorationType.key,
							TypeConverters.fromRangeOrRangeWithMessage(ranges)
						);
					} else {
						const _ranges: number[] = new Array<number>(4 * ranges.length);
						for (let i = 0, len = ranges.length; i < len; i++) {
							const range = ranges[i];
							_ranges[4 * i] = range.start.line + 1;
							_ranges[4 * i + 1] = range.start.character + 1;
							_ranges[4 * i + 2] = range.end.line + 1;
							_ranges[4 * i + 3] = range.end.character + 1;
						}
						return _proxy.$trySetDecorationsFast(
							id,
							decorationType.key,
							_ranges
						);
					}
				});
			},
			revealRange(range: Range, revealType: vscode.TextEditorRevealType): void {
				that._runOnProxy(() => _proxy.$tryRevealRange(
					id,
					TypeConverters.Range.from(range),
					(revealType || TextEditorRevealType.Default)
				));
			},
			show(column: vscode.ViewColumn) {
				_proxy.$tryShowEditor(id, TypeConverters.ViewColumn.from(column));
			},
			hide() {
				_proxy.$tryHideEditor(id);
			},
			[Symbol.for('debug.description')]() {
				return `TextEditor(${this.document.uri.toString()})`;
			}
		});
	}

	dispose() {
		ok(!this._disposed);
		this._disposed = true;
	}

	// --- incoming: extension host MUST accept what the renderer says

	_acceptOptions(options: IResolvedTextEditorConfiguration): void {
		ok(!this._disposed);
		this._options._accept(options);
	}

	_acceptVisibleRanges(value: Range[]): void {
		ok(!this._disposed);
		this._visibleRanges = value;
	}

	_acceptViewColumn(value: vscode.ViewColumn) {
		ok(!this._disposed);
		this._viewColumn = value;
	}

	_acceptSelections(selections: Selection[]): void {
		ok(!this._disposed);
		this._selections = selections;
	}

	_acceptDiffInformation(diffInformation: vscode.TextEditorDiffInformation[] | undefined): void {
		ok(!this._disposed);
		this._diffInformation = diffInformation;
	}

	private async _trySetSelection(): Promise<vscode.TextEditor | null | undefined> {
		const selection = this._selections.map(TypeConverters.Selection.from);
		await this._runOnProxy(() => this._proxy.$trySetSelections(this.id, selection));
		return this.value;
	}

	private _applyEdit(editBuilder: TextEditorEdit): Promise<boolean> {
		const editData = editBuilder.finalize();

		// return when there is nothing to do
		if (editData.edits.length === 0 && !editData.setEndOfLine) {
			return Promise.resolve(true);
		}

		// check that the edits are not overlapping (i.e. illegal)
		const editRanges = editData.edits.map(edit => edit.range);

		// sort ascending (by end and then by start)
		editRanges.sort((a, b) => {
			if (a.end.line === b.end.line) {
				if (a.end.character === b.end.character) {
					if (a.start.line === b.start.line) {
						return a.start.character - b.start.character;
					}
					return a.start.line - b.start.line;
				}
				return a.end.character - b.end.character;
			}
			return a.end.line - b.end.line;
		});

		// check that no edits are overlapping
		for (let i = 0, count = editRanges.length - 1; i < count; i++) {
			const rangeEnd = editRanges[i].end;
			const nextRangeStart = editRanges[i + 1].start;

			if (nextRangeStart.isBefore(rangeEnd)) {
				// overlapping ranges
				return Promise.reject(
					new Error('Overlapping ranges are not allowed!')
				);
			}
		}

		// prepare data for serialization
		const edits = editData.edits.map((edit): ISingleEditOperation => {
			return {
				range: TypeConverters.Range.from(edit.range),
				text: edit.text,
				forceMoveMarkers: edit.forceMoveMarkers
			};
		});

		return this._proxy.$tryApplyEdits(this.id, editData.documentVersionId, edits, {
			setEndOfLine: typeof editData.setEndOfLine === 'number' ? TypeConverters.EndOfLine.from(editData.setEndOfLine) : undefined,
			undoStopBefore: editData.undoStopBefore,
			undoStopAfter: editData.undoStopAfter
		});
	}
	private _runOnProxy(callback: () => Promise<any>): Promise<ExtHostTextEditor | undefined | null> {
		if (this._disposed) {
			this._logService.warn('TextEditor is closed/disposed');
			return Promise.resolve(undefined);
		}

		return callback().then(() => this, err => {
			if (!(err instanceof Error && err.name === 'DISPOSED')) {
				this._logService.warn(err);
			}
			return null;
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostTextEditors.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTextEditors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as arrays from '../../../base/common/arrays.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { ExtHostEditorsShape, IEditorPropertiesChangeData, IMainContext, ITextDocumentShowOptions, ITextEditorDiffInformation, ITextEditorPositionData, MainContext, MainThreadTextEditorsShape } from './extHost.protocol.js';
import { ExtHostDocumentsAndEditors } from './extHostDocumentsAndEditors.js';
import { ExtHostTextEditor, TextEditorDecorationType } from './extHostTextEditor.js';
import * as TypeConverters from './extHostTypeConverters.js';
import { TextEditorSelectionChangeKind, TextEditorChangeKind } from './extHostTypes.js';
import * as vscode from 'vscode';

export class ExtHostEditors extends Disposable implements ExtHostEditorsShape {

	private readonly _onDidChangeTextEditorSelection = new Emitter<vscode.TextEditorSelectionChangeEvent>();
	private readonly _onDidChangeTextEditorOptions = new Emitter<vscode.TextEditorOptionsChangeEvent>();
	private readonly _onDidChangeTextEditorVisibleRanges = new Emitter<vscode.TextEditorVisibleRangesChangeEvent>();
	private readonly _onDidChangeTextEditorViewColumn = new Emitter<vscode.TextEditorViewColumnChangeEvent>();
	private readonly _onDidChangeTextEditorDiffInformation = new Emitter<vscode.TextEditorDiffInformationChangeEvent>();
	private readonly _onDidChangeActiveTextEditor = new Emitter<vscode.TextEditor | undefined>();
	private readonly _onDidChangeVisibleTextEditors = new Emitter<readonly vscode.TextEditor[]>();

	readonly onDidChangeTextEditorSelection: Event<vscode.TextEditorSelectionChangeEvent> = this._onDidChangeTextEditorSelection.event;
	readonly onDidChangeTextEditorOptions: Event<vscode.TextEditorOptionsChangeEvent> = this._onDidChangeTextEditorOptions.event;
	readonly onDidChangeTextEditorVisibleRanges: Event<vscode.TextEditorVisibleRangesChangeEvent> = this._onDidChangeTextEditorVisibleRanges.event;
	readonly onDidChangeTextEditorViewColumn: Event<vscode.TextEditorViewColumnChangeEvent> = this._onDidChangeTextEditorViewColumn.event;
	readonly onDidChangeTextEditorDiffInformation: Event<vscode.TextEditorDiffInformationChangeEvent> = this._onDidChangeTextEditorDiffInformation.event;
	readonly onDidChangeActiveTextEditor: Event<vscode.TextEditor | undefined> = this._onDidChangeActiveTextEditor.event;
	readonly onDidChangeVisibleTextEditors: Event<readonly vscode.TextEditor[]> = this._onDidChangeVisibleTextEditors.event;

	private readonly _proxy: MainThreadTextEditorsShape;

	constructor(
		mainContext: IMainContext,
		private readonly _extHostDocumentsAndEditors: ExtHostDocumentsAndEditors,
	) {
		super();
		this._proxy = mainContext.getProxy(MainContext.MainThreadTextEditors);

		this._register(this._extHostDocumentsAndEditors.onDidChangeVisibleTextEditors(e => this._onDidChangeVisibleTextEditors.fire(e)));
		this._register(this._extHostDocumentsAndEditors.onDidChangeActiveTextEditor(e => this._onDidChangeActiveTextEditor.fire(e)));
	}

	getActiveTextEditor(): vscode.TextEditor | undefined {
		return this._extHostDocumentsAndEditors.activeEditor();
	}

	getVisibleTextEditors(): vscode.TextEditor[];
	getVisibleTextEditors(internal: true): ExtHostTextEditor[];
	getVisibleTextEditors(internal?: true): ExtHostTextEditor[] | vscode.TextEditor[] {
		const editors = this._extHostDocumentsAndEditors.allEditors();
		return internal
			? editors
			: editors.map(editor => editor.value);
	}

	showTextDocument(document: vscode.TextDocument, column: vscode.ViewColumn, preserveFocus: boolean): Promise<vscode.TextEditor>;
	showTextDocument(document: vscode.TextDocument, options: { column: vscode.ViewColumn; preserveFocus: boolean; pinned: boolean }): Promise<vscode.TextEditor>;
	showTextDocument(document: vscode.TextDocument, columnOrOptions: vscode.ViewColumn | vscode.TextDocumentShowOptions | undefined, preserveFocus?: boolean): Promise<vscode.TextEditor>;
	async showTextDocument(document: vscode.TextDocument, columnOrOptions: vscode.ViewColumn | vscode.TextDocumentShowOptions | undefined, preserveFocus?: boolean): Promise<vscode.TextEditor> {
		let options: ITextDocumentShowOptions;
		if (typeof columnOrOptions === 'number') {
			options = {
				position: TypeConverters.ViewColumn.from(columnOrOptions),
				preserveFocus
			};
		} else if (typeof columnOrOptions === 'object') {
			options = {
				position: TypeConverters.ViewColumn.from(columnOrOptions.viewColumn),
				preserveFocus: columnOrOptions.preserveFocus,
				selection: typeof columnOrOptions.selection === 'object' ? TypeConverters.Range.from(columnOrOptions.selection) : undefined,
				pinned: typeof columnOrOptions.preview === 'boolean' ? !columnOrOptions.preview : undefined
			};
		} else {
			options = {
				preserveFocus: false
			};
		}

		const editorId = await this._proxy.$tryShowTextDocument(document.uri, options);
		const editor = editorId && this._extHostDocumentsAndEditors.getEditor(editorId);
		if (editor) {
			return editor.value;
		}
		// we have no editor... having an id means that we had an editor
		// on the main side and that it isn't the current editor anymore...
		if (editorId) {
			throw new Error(`Could NOT open editor for "${document.uri.toString()}" because another editor opened in the meantime.`);
		} else {
			throw new Error(`Could NOT open editor for "${document.uri.toString()}".`);
		}
	}

	createTextEditorDecorationType(extension: IExtensionDescription, options: vscode.DecorationRenderOptions): vscode.TextEditorDecorationType {
		return new TextEditorDecorationType(this._proxy, extension, options).value;
	}

	// --- called from main thread

	$acceptEditorPropertiesChanged(id: string, data: IEditorPropertiesChangeData): void {
		const textEditor = this._extHostDocumentsAndEditors.getEditor(id);
		if (!textEditor) {
			throw new Error('unknown text editor');
		}

		// (1) set all properties
		if (data.options) {
			textEditor._acceptOptions(data.options);
		}
		if (data.selections) {
			const selections = data.selections.selections.map(TypeConverters.Selection.to);
			textEditor._acceptSelections(selections);
		}
		if (data.visibleRanges) {
			const visibleRanges = arrays.coalesce(data.visibleRanges.map(TypeConverters.Range.to));
			textEditor._acceptVisibleRanges(visibleRanges);
		}

		// (2) fire change events
		if (data.options) {
			this._onDidChangeTextEditorOptions.fire({
				textEditor: textEditor.value,
				options: { ...data.options, lineNumbers: TypeConverters.TextEditorLineNumbersStyle.to(data.options.lineNumbers) }
			});
		}
		if (data.selections) {
			const kind = TextEditorSelectionChangeKind.fromValue(data.selections.source);
			const selections = data.selections.selections.map(TypeConverters.Selection.to);
			this._onDidChangeTextEditorSelection.fire({
				textEditor: textEditor.value,
				selections,
				kind
			});
		}
		if (data.visibleRanges) {
			const visibleRanges = arrays.coalesce(data.visibleRanges.map(TypeConverters.Range.to));
			this._onDidChangeTextEditorVisibleRanges.fire({
				textEditor: textEditor.value,
				visibleRanges
			});
		}
	}

	$acceptEditorPositionData(data: ITextEditorPositionData): void {
		for (const id in data) {
			const textEditor = this._extHostDocumentsAndEditors.getEditor(id);
			if (!textEditor) {
				throw new Error('Unknown text editor');
			}
			const viewColumn = TypeConverters.ViewColumn.to(data[id]);
			if (textEditor.value.viewColumn !== viewColumn) {
				textEditor._acceptViewColumn(viewColumn);
				this._onDidChangeTextEditorViewColumn.fire({ textEditor: textEditor.value, viewColumn });
			}
		}
	}

	$acceptEditorDiffInformation(id: string, diffInformation: ITextEditorDiffInformation[] | undefined): void {
		const textEditor = this._extHostDocumentsAndEditors.getEditor(id);
		if (!textEditor) {
			throw new Error('unknown text editor');
		}

		if (!diffInformation) {
			textEditor._acceptDiffInformation(undefined);
			this._onDidChangeTextEditorDiffInformation.fire({
				textEditor: textEditor.value,
				diffInformation: undefined
			});
			return;
		}

		const that = this;
		const result = diffInformation.map(diff => {
			const original = URI.revive(diff.original);
			const modified = URI.revive(diff.modified);

			const changes = diff.changes.map(change => {
				const [originalStartLineNumber, originalEndLineNumberExclusive, modifiedStartLineNumber, modifiedEndLineNumberExclusive] = change;

				let kind: vscode.TextEditorChangeKind;
				if (originalStartLineNumber === originalEndLineNumberExclusive) {
					kind = TextEditorChangeKind.Addition;
				} else if (modifiedStartLineNumber === modifiedEndLineNumberExclusive) {
					kind = TextEditorChangeKind.Deletion;
				} else {
					kind = TextEditorChangeKind.Modification;
				}

				return {
					original: {
						startLineNumber: originalStartLineNumber,
						endLineNumberExclusive: originalEndLineNumberExclusive
					},
					modified: {
						startLineNumber: modifiedStartLineNumber,
						endLineNumberExclusive: modifiedEndLineNumberExclusive
					},
					kind
				} satisfies vscode.TextEditorChange;
			});

			return Object.freeze({
				documentVersion: diff.documentVersion,
				original,
				modified,
				changes,
				get isStale(): boolean {
					const document = that._extHostDocumentsAndEditors.getDocument(modified);
					return document?.version !== diff.documentVersion;
				}
			});
		});

		textEditor._acceptDiffInformation(result);
		this._onDidChangeTextEditorDiffInformation.fire({
			textEditor: textEditor.value,
			diffInformation: result
		});
	}

	getDiffInformation(id: string): Promise<vscode.LineChange[]> {
		return Promise.resolve(this._proxy.$getDiffInformation(id));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostTheming.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTheming.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ColorTheme, ColorThemeKind } from './extHostTypes.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import { ExtHostThemingShape } from './extHost.protocol.js';
import { Emitter, Event } from '../../../base/common/event.js';

export class ExtHostTheming implements ExtHostThemingShape {

	readonly _serviceBrand: undefined;

	private _actual: ColorTheme;
	private _onDidChangeActiveColorTheme: Emitter<ColorTheme>;

	constructor(
		@IExtHostRpcService _extHostRpc: IExtHostRpcService
	) {
		this._actual = new ColorTheme(ColorThemeKind.Dark);
		this._onDidChangeActiveColorTheme = new Emitter<ColorTheme>();
	}

	public get activeColorTheme(): ColorTheme {
		return this._actual;
	}

	$onColorThemeChange(type: string): void {
		let kind;
		switch (type) {
			case 'light': kind = ColorThemeKind.Light; break;
			case 'hcDark': kind = ColorThemeKind.HighContrast; break;
			case 'hcLight': kind = ColorThemeKind.HighContrastLight; break;
			default:
				kind = ColorThemeKind.Dark;
		}
		this._actual = new ColorTheme(kind);
		this._onDidChangeActiveColorTheme.fire(this._actual);
	}

	public get onDidChangeActiveColorTheme(): Event<ColorTheme> {
		return this._onDidChangeActiveColorTheme.event;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostTimeline.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTimeline.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { UriComponents, URI } from '../../../base/common/uri.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { ExtHostTimelineShape, MainThreadTimelineShape, IMainContext, MainContext } from './extHost.protocol.js';
import { Timeline, TimelineItem, TimelineOptions, TimelineProvider } from '../../contrib/timeline/common/timeline.js';
import { IDisposable, toDisposable, DisposableStore } from '../../../base/common/lifecycle.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { CommandsConverter, ExtHostCommands } from './extHostCommands.js';
import { ThemeIcon, MarkdownString as MarkdownStringType } from './extHostTypes.js';
import { MarkdownString } from './extHostTypeConverters.js';
import { ExtensionIdentifier } from '../../../platform/extensions/common/extensions.js';
import { MarshalledId } from '../../../base/common/marshallingIds.js';
import { isString } from '../../../base/common/types.js';
import { isProposedApiEnabled } from '../../services/extensions/common/extensions.js';

export interface IExtHostTimeline extends ExtHostTimelineShape {
	readonly _serviceBrand: undefined;
	$getTimeline(id: string, uri: UriComponents, options: vscode.TimelineOptions, token: vscode.CancellationToken): Promise<Timeline | undefined>;
}

export const IExtHostTimeline = createDecorator<IExtHostTimeline>('IExtHostTimeline');

export class ExtHostTimeline implements IExtHostTimeline {
	declare readonly _serviceBrand: undefined;

	private _proxy: MainThreadTimelineShape;

	private _providers = new Map<string, { provider: TimelineProvider; extension: ExtensionIdentifier }>();

	private _itemsBySourceAndUriMap = new Map<string, Map<string | undefined, Map<string, vscode.TimelineItem>>>();

	constructor(
		mainContext: IMainContext,
		commands: ExtHostCommands,
	) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadTimeline);

		commands.registerArgumentProcessor({
			processArgument: (arg, extension) => {
				if (arg && arg.$mid === MarshalledId.TimelineActionContext) {
					if (this._providers.get(arg.source) && extension && isProposedApiEnabled(extension, 'timeline')) {
						const uri = arg.uri === undefined ? undefined : URI.revive(arg.uri);
						return this._itemsBySourceAndUriMap.get(arg.source)?.get(getUriKey(uri))?.get(arg.handle);
					} else {
						return undefined;
					}
				}
				return arg;
			}
		});
	}

	async $getTimeline(id: string, uri: UriComponents, options: vscode.TimelineOptions, token: vscode.CancellationToken): Promise<Timeline | undefined> {
		const item = this._providers.get(id);
		return item?.provider.provideTimeline(URI.revive(uri), options, token);
	}

	registerTimelineProvider(scheme: string | string[], provider: vscode.TimelineProvider, extensionId: ExtensionIdentifier, commandConverter: CommandsConverter): IDisposable {
		const timelineDisposables = new DisposableStore();

		const convertTimelineItem = this.convertTimelineItem(provider.id, commandConverter, timelineDisposables).bind(this);

		let disposable: IDisposable | undefined;
		if (provider.onDidChange) {
			disposable = provider.onDidChange(e => this._proxy.$emitTimelineChangeEvent({ uri: undefined, reset: true, ...e, id: provider.id }), this);
		}

		const itemsBySourceAndUriMap = this._itemsBySourceAndUriMap;
		return this.registerTimelineProviderCore({
			...provider,
			scheme: scheme,
			onDidChange: undefined,
			async provideTimeline(uri: URI, options: TimelineOptions, token: CancellationToken) {
				if (options?.resetCache) {
					timelineDisposables.clear();

					// For now, only allow the caching of a single Uri
					// itemsBySourceAndUriMap.get(provider.id)?.get(getUriKey(uri))?.clear();
					itemsBySourceAndUriMap.get(provider.id)?.clear();
				}

				const result = await provider.provideTimeline(uri, options, token);
				if (result === undefined || result === null) {
					return undefined;
				}

				// TODO: Should we bother converting all the data if we aren't caching? Meaning it is being requested by an extension?

				const convertItem = convertTimelineItem(uri, options);
				return {
					...result,
					source: provider.id,
					items: result.items.map(convertItem)
				};
			},
			dispose() {
				for (const sourceMap of itemsBySourceAndUriMap.values()) {
					sourceMap.get(provider.id)?.clear();
				}

				disposable?.dispose();
				timelineDisposables.dispose();
			}
		}, extensionId);
	}

	private convertTimelineItem(source: string, commandConverter: CommandsConverter, disposables: DisposableStore) {
		return (uri: URI, options?: TimelineOptions) => {
			let items: Map<string, vscode.TimelineItem> | undefined;
			if (options?.cacheResults) {
				let itemsByUri = this._itemsBySourceAndUriMap.get(source);
				if (itemsByUri === undefined) {
					itemsByUri = new Map();
					this._itemsBySourceAndUriMap.set(source, itemsByUri);
				}

				const uriKey = getUriKey(uri);
				items = itemsByUri.get(uriKey);
				if (items === undefined) {
					items = new Map();
					itemsByUri.set(uriKey, items);
				}
			}

			return (item: vscode.TimelineItem): TimelineItem => {
				const { iconPath, ...props } = item;

				const handle = `${source}|${item.id ?? item.timestamp}`;
				items?.set(handle, item);

				let icon;
				let iconDark;
				let themeIcon;
				if (item.iconPath) {
					if (iconPath instanceof ThemeIcon) {
						themeIcon = { id: iconPath.id, color: iconPath.color };
					}
					else if (URI.isUri(iconPath)) {
						icon = iconPath;
						iconDark = iconPath;
					}
					else {
						({ light: icon, dark: iconDark } = iconPath as { light: URI; dark: URI });
					}
				}

				let tooltip;
				if (MarkdownStringType.isMarkdownString(props.tooltip)) {
					tooltip = MarkdownString.from(props.tooltip);
				}
				else if (isString(props.tooltip)) {
					tooltip = props.tooltip;
				}
				// TODO @jkearl, remove once migration complete.
				// eslint-disable-next-line local/code-no-any-casts
				else if (MarkdownStringType.isMarkdownString((props as any).detail)) {
					console.warn('Using deprecated TimelineItem.detail, migrate to TimelineItem.tooltip');
					// eslint-disable-next-line local/code-no-any-casts
					tooltip = MarkdownString.from((props as any).detail);
				}
				// eslint-disable-next-line local/code-no-any-casts
				else if (isString((props as any).detail)) {
					console.warn('Using deprecated TimelineItem.detail, migrate to TimelineItem.tooltip');
					// eslint-disable-next-line local/code-no-any-casts
					tooltip = (props as any).detail;
				}

				return {
					...props,
					id: props.id ?? undefined,
					handle: handle,
					source: source,
					command: item.command ? commandConverter.toInternal(item.command, disposables) : undefined,
					icon: icon,
					iconDark: iconDark,
					themeIcon: themeIcon,
					tooltip,
					accessibilityInformation: item.accessibilityInformation
				};
			};
		};
	}

	private registerTimelineProviderCore(provider: TimelineProvider, extension: ExtensionIdentifier): IDisposable {
		// console.log(`ExtHostTimeline#registerTimelineProvider: id=${provider.id}`);

		const existing = this._providers.get(provider.id);
		if (existing) {
			throw new Error(`Timeline Provider ${provider.id} already exists.`);
		}

		this._proxy.$registerTimelineProvider({
			id: provider.id,
			label: provider.label,
			scheme: provider.scheme
		});
		this._providers.set(provider.id, { provider, extension });

		return toDisposable(() => {
			for (const sourceMap of this._itemsBySourceAndUriMap.values()) {
				sourceMap.get(provider.id)?.clear();
			}

			this._providers.delete(provider.id);
			this._proxy.$unregisterTimelineProvider(provider.id);
			provider.dispose();
		});
	}
}

function getUriKey(uri: URI | undefined): string | undefined {
	return uri?.toString();
}
```

--------------------------------------------------------------------------------

````
