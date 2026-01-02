---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 379
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 379 of 552)

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

---[FILE: src/vs/workbench/contrib/debug/browser/debugMemory.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugMemory.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../base/common/buffer.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { clamp } from '../../../../base/common/numbers.js';
import { assertNever } from '../../../../base/common/assert.js';
import { URI } from '../../../../base/common/uri.js';
import { FileChangeType, IFileOpenOptions, FilePermission, FileSystemProviderCapabilities, FileSystemProviderErrorCode, FileType, IFileChange, IFileSystemProvider, IStat, IWatchOptions, createFileSystemProviderError } from '../../../../platform/files/common/files.js';
import { DEBUG_MEMORY_SCHEME, IDebugService, IDebugSession, IMemoryInvalidationEvent, IMemoryRegion, MemoryRange, MemoryRangeType, State } from '../common/debug.js';

const rangeRe = /range=([0-9]+):([0-9]+)/;

export class DebugMemoryFileSystemProvider extends Disposable implements IFileSystemProvider {
	private memoryFdCounter = 0;
	private readonly fdMemory = new Map<number, { session: IDebugSession; region: IMemoryRegion }>();
	private readonly changeEmitter = new Emitter<readonly IFileChange[]>();

	/** @inheritdoc */
	public readonly onDidChangeCapabilities = Event.None;

	/** @inheritdoc */
	public readonly onDidChangeFile = this.changeEmitter.event;

	/** @inheritdoc */
	public readonly capabilities = 0
		| FileSystemProviderCapabilities.PathCaseSensitive
		| FileSystemProviderCapabilities.FileOpenReadWriteClose;

	constructor(private readonly debugService: IDebugService) {
		super();

		this._register(debugService.onDidEndSession(({ session }) => {
			for (const [fd, memory] of this.fdMemory) {
				if (memory.session === session) {
					this.close(fd);
				}
			}
		}));
	}

	public watch(resource: URI, opts: IWatchOptions) {
		if (opts.recursive) {
			return toDisposable(() => { });
		}

		const { session, memoryReference, offset } = this.parseUri(resource);
		const disposable = new DisposableStore();

		disposable.add(session.onDidChangeState(() => {
			if (session.state === State.Running || session.state === State.Inactive) {
				this.changeEmitter.fire([{ type: FileChangeType.DELETED, resource }]);
			}
		}));

		disposable.add(session.onDidInvalidateMemory(e => {
			if (e.body.memoryReference !== memoryReference) {
				return;
			}

			if (offset && (e.body.offset >= offset.toOffset || e.body.offset + e.body.count < offset.fromOffset)) {
				return;
			}

			this.changeEmitter.fire([{ resource, type: FileChangeType.UPDATED }]);
		}));

		return disposable;
	}

	/** @inheritdoc */
	public stat(file: URI): Promise<IStat> {
		const { readOnly } = this.parseUri(file);
		return Promise.resolve({
			type: FileType.File,
			mtime: 0,
			ctime: 0,
			size: 0,
			permissions: readOnly ? FilePermission.Readonly : undefined,
		});
	}

	/** @inheritdoc */
	public mkdir(): never {
		throw createFileSystemProviderError(`Not allowed`, FileSystemProviderErrorCode.NoPermissions);
	}

	/** @inheritdoc */
	public readdir(): never {
		throw createFileSystemProviderError(`Not allowed`, FileSystemProviderErrorCode.NoPermissions);
	}

	/** @inheritdoc */
	public delete(): never {
		throw createFileSystemProviderError(`Not allowed`, FileSystemProviderErrorCode.NoPermissions);
	}

	/** @inheritdoc */
	public rename(): never {
		throw createFileSystemProviderError(`Not allowed`, FileSystemProviderErrorCode.NoPermissions);
	}

	/** @inheritdoc */
	public open(resource: URI, _opts: IFileOpenOptions): Promise<number> {
		const { session, memoryReference, offset } = this.parseUri(resource);
		const fd = this.memoryFdCounter++;
		let region = session.getMemory(memoryReference);
		if (offset) {
			region = new MemoryRegionView(region, offset);
		}

		this.fdMemory.set(fd, { session, region });
		return Promise.resolve(fd);
	}

	/** @inheritdoc */
	public close(fd: number) {
		this.fdMemory.get(fd)?.region.dispose();
		this.fdMemory.delete(fd);
		return Promise.resolve();
	}

	/** @inheritdoc */
	public async writeFile(resource: URI, content: Uint8Array) {
		const { offset } = this.parseUri(resource);
		if (!offset) {
			throw createFileSystemProviderError(`Range must be present to read a file`, FileSystemProviderErrorCode.FileNotFound);
		}

		const fd = await this.open(resource, { create: false });

		try {
			await this.write(fd, offset.fromOffset, content, 0, content.length);
		} finally {
			this.close(fd);
		}
	}

	/** @inheritdoc */
	public async readFile(resource: URI) {
		const { offset } = this.parseUri(resource);
		if (!offset) {
			throw createFileSystemProviderError(`Range must be present to read a file`, FileSystemProviderErrorCode.FileNotFound);
		}

		const data = new Uint8Array(offset.toOffset - offset.fromOffset);
		const fd = await this.open(resource, { create: false });

		try {
			await this.read(fd, offset.fromOffset, data, 0, data.length);
			return data;
		} finally {
			this.close(fd);
		}
	}

	/** @inheritdoc */
	public async read(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> {
		const memory = this.fdMemory.get(fd);
		if (!memory) {
			throw createFileSystemProviderError(`No file with that descriptor open`, FileSystemProviderErrorCode.Unavailable);
		}

		const ranges = await memory.region.read(pos, length);
		let readSoFar = 0;
		for (const range of ranges) {
			switch (range.type) {
				case MemoryRangeType.Unreadable:
					return readSoFar;
				case MemoryRangeType.Error:
					if (readSoFar > 0) {
						return readSoFar;
					} else {
						throw createFileSystemProviderError(range.error, FileSystemProviderErrorCode.Unknown);
					}
				case MemoryRangeType.Valid: {
					const start = Math.max(0, pos - range.offset);
					const toWrite = range.data.slice(start, Math.min(range.data.byteLength, start + (length - readSoFar)));
					data.set(toWrite.buffer, offset + readSoFar);
					readSoFar += toWrite.byteLength;
					break;
				}
				default:
					assertNever(range);
			}
		}

		return readSoFar;
	}

	/** @inheritdoc */
	public write(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> {
		const memory = this.fdMemory.get(fd);
		if (!memory) {
			throw createFileSystemProviderError(`No file with that descriptor open`, FileSystemProviderErrorCode.Unavailable);
		}

		return memory.region.write(pos, VSBuffer.wrap(data).slice(offset, offset + length));
	}

	protected parseUri(uri: URI) {
		if (uri.scheme !== DEBUG_MEMORY_SCHEME) {
			throw createFileSystemProviderError(`Cannot open file with scheme ${uri.scheme}`, FileSystemProviderErrorCode.FileNotFound);
		}

		const session = this.debugService.getModel().getSession(uri.authority);
		if (!session) {
			throw createFileSystemProviderError(`Debug session not found`, FileSystemProviderErrorCode.FileNotFound);
		}

		let offset: { fromOffset: number; toOffset: number } | undefined;
		const rangeMatch = rangeRe.exec(uri.query);
		if (rangeMatch) {
			offset = { fromOffset: Number(rangeMatch[1]), toOffset: Number(rangeMatch[2]) };
		}

		const [, memoryReference] = uri.path.split('/');

		return {
			session,
			offset,
			readOnly: !session.capabilities.supportsWriteMemoryRequest,
			sessionId: uri.authority,
			memoryReference: decodeURIComponent(memoryReference),
		};
	}
}

/** A wrapper for a MemoryRegion that references a subset of data in another region. */
class MemoryRegionView extends Disposable implements IMemoryRegion {
	private readonly invalidateEmitter = new Emitter<IMemoryInvalidationEvent>();

	public readonly onDidInvalidate = this.invalidateEmitter.event;
	public readonly writable: boolean;
	private readonly width: number;

	constructor(private readonly parent: IMemoryRegion, public readonly range: { fromOffset: number; toOffset: number }) {
		super();
		this.writable = parent.writable;
		this.width = range.toOffset - range.fromOffset;

		this._register(parent);
		this._register(parent.onDidInvalidate(e => {
			const fromOffset = clamp(e.fromOffset - range.fromOffset, 0, this.width);
			const toOffset = clamp(e.toOffset - range.fromOffset, 0, this.width);
			if (toOffset > fromOffset) {
				this.invalidateEmitter.fire({ fromOffset, toOffset });
			}
		}));
	}

	public read(fromOffset: number, toOffset: number): Promise<MemoryRange[]> {
		if (fromOffset < 0) {
			throw new RangeError(`Invalid fromOffset: ${fromOffset}`);
		}

		return this.parent.read(
			this.range.fromOffset + fromOffset,
			this.range.fromOffset + Math.min(toOffset, this.width),
		);
	}

	public write(offset: number, data: VSBuffer): Promise<number> {
		return this.parent.write(this.range.fromOffset + offset, data);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/debugProgress.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugProgress.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { IDisposable, dispose } from '../../../../base/common/lifecycle.js';
import { IProgressService, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IDebugService, IDebugSession, VIEWLET_ID } from '../common/debug.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';

export class DebugProgressContribution implements IWorkbenchContribution {

	private toDispose: IDisposable[] = [];

	constructor(
		@IDebugService debugService: IDebugService,
		@IProgressService progressService: IProgressService,
		@IViewsService viewsService: IViewsService
	) {
		let progressListener: IDisposable | undefined;
		const listenOnProgress = (session: IDebugSession | undefined) => {
			if (progressListener) {
				progressListener.dispose();
				progressListener = undefined;
			}
			if (session) {
				progressListener = session.onDidProgressStart(async progressStartEvent => {
					const promise = new Promise<void>(r => {
						// Show progress until a progress end event comes or the session ends
						const listener = Event.any(Event.filter(session.onDidProgressEnd, e => e.body.progressId === progressStartEvent.body.progressId),
							session.onDidEndAdapter)(() => {
								listener.dispose();
								r();
							});
					});

					if (viewsService.isViewContainerVisible(VIEWLET_ID)) {
						progressService.withProgress({ location: VIEWLET_ID }, () => promise);
					}
					const source = debugService.getAdapterManager().getDebuggerLabel(session.configuration.type);
					progressService.withProgress({
						location: ProgressLocation.Notification,
						title: progressStartEvent.body.title,
						cancellable: progressStartEvent.body.cancellable,
						source,
						delay: 500
					}, progressStep => {
						let total = 0;
						const reportProgress = (progress: { message?: string; percentage?: number }) => {
							let increment = undefined;
							if (typeof progress.percentage === 'number') {
								increment = progress.percentage - total;
								total += increment;
							}
							progressStep.report({
								message: progress.message,
								increment,
								total: typeof increment === 'number' ? 100 : undefined,
							});
						};

						if (progressStartEvent.body.message) {
							reportProgress(progressStartEvent.body);
						}
						const progressUpdateListener = session.onDidProgressUpdate(e => {
							if (e.body.progressId === progressStartEvent.body.progressId) {
								reportProgress(e.body);
							}
						});

						return promise.then(() => progressUpdateListener.dispose());
					}, () => session.cancel(progressStartEvent.body.progressId));
				});
			}
		};
		this.toDispose.push(debugService.getViewModel().onDidFocusSession(listenOnProgress));
		listenOnProgress(debugService.getViewModel().focusedSession);
		this.toDispose.push(debugService.onWillNewSession(session => {
			if (!progressListener) {
				listenOnProgress(session);
			}
		}));
	}

	dispose(): void {
		dispose(this.toDispose);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/debugQuickAccess.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';
import { PickerQuickAccessProvider, IPickerQuickAccessItem, TriggerAction } from '../../../../platform/quickinput/browser/pickerQuickAccess.js';
import { localize } from '../../../../nls.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IDebugService } from '../common/debug.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { matchesFuzzy } from '../../../../base/common/filters.js';
import { ADD_CONFIGURATION_ID, DEBUG_QUICK_ACCESS_PREFIX } from './debugCommands.js';
import { debugConfigure, debugRemoveConfig } from './debugIcons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';

export class StartDebugQuickAccessProvider extends PickerQuickAccessProvider<IPickerQuickAccessItem> {

	constructor(
		@IDebugService private readonly debugService: IDebugService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@ICommandService private readonly commandService: ICommandService,
		@INotificationService private readonly notificationService: INotificationService,
	) {
		super(DEBUG_QUICK_ACCESS_PREFIX, {
			noResultsPick: {
				label: localize('noDebugResults', "No matching launch configurations")
			}
		});
	}

	protected async _getPicks(filter: string): Promise<(IQuickPickSeparator | IPickerQuickAccessItem)[]> {
		const picks: Array<IPickerQuickAccessItem | IQuickPickSeparator> = [];
		if (!this.debugService.getAdapterManager().hasEnabledDebuggers()) {
			return [];
		}

		picks.push({ type: 'separator', label: 'launch.json' });

		const configManager = this.debugService.getConfigurationManager();
		const selectedConfiguration = configManager.selectedConfiguration;

		// Entries: configs
		let lastGroup: string | undefined;
		for (const config of configManager.getAllConfigurations()) {
			const highlights = matchesFuzzy(filter, config.name, true);
			if (highlights) {

				const pick = {
					label: config.name,
					description: this.contextService.getWorkbenchState() === WorkbenchState.WORKSPACE ? config.launch.name : '',
					highlights: { label: highlights },
					buttons: [{
						iconClass: ThemeIcon.asClassName(debugConfigure),
						tooltip: localize('customizeLaunchConfig', "Configure Launch Configuration")
					}],
					trigger: () => {
						config.launch.openConfigFile({ preserveFocus: false });

						return TriggerAction.CLOSE_PICKER;
					},
					accept: async () => {
						await configManager.selectConfiguration(config.launch, config.name);
						try {
							await this.debugService.startDebugging(config.launch, undefined, { startedByUser: true });
						} catch (error) {
							this.notificationService.error(error);
						}
					}
				};

				// Most recently used configuration
				if (selectedConfiguration.name === config.name && selectedConfiguration.launch === config.launch) {
					const separator: IQuickPickSeparator = { type: 'separator', label: localize('mostRecent', 'Most Recent') };
					picks.unshift(separator, pick);
					continue;
				}

				// Separator
				if (lastGroup !== config.presentation?.group) {
					picks.push({ type: 'separator' });
					lastGroup = config.presentation?.group;
				}

				// Launch entry

				picks.push(pick);
			}
		}

		// Entries detected configurations
		const dynamicProviders = await configManager.getDynamicProviders();
		if (dynamicProviders.length > 0) {
			picks.push({
				type: 'separator', label: localize({
					key: 'contributed',
					comment: ['contributed is lower case because it looks better like that in UI. Nothing preceeds it. It is a name of the grouping of debug configurations.']
				}, "contributed")
			});
		}

		configManager.getRecentDynamicConfigurations().forEach(({ name, type }) => {
			const highlights = matchesFuzzy(filter, name, true);
			if (highlights) {
				picks.push({
					label: name,
					highlights: { label: highlights },
					buttons: [{
						iconClass: ThemeIcon.asClassName(debugRemoveConfig),
						tooltip: localize('removeLaunchConfig', "Remove Launch Configuration")
					}],
					trigger: () => {
						configManager.removeRecentDynamicConfigurations(name, type);
						return TriggerAction.CLOSE_PICKER;
					},
					accept: async () => {
						await configManager.selectConfiguration(undefined, name, undefined, { type });
						try {
							const { launch, getConfig } = configManager.selectedConfiguration;
							const config = await getConfig();
							await this.debugService.startDebugging(launch, config, { startedByUser: true });
						} catch (error) {
							this.notificationService.error(error);
						}
					}
				});
			}
		});

		dynamicProviders.forEach(provider => {
			picks.push({
				label: `$(folder) ${provider.label}...`,
				ariaLabel: localize({ key: 'providerAriaLabel', comment: ['Placeholder stands for the provider label. For example "NodeJS".'] }, "{0} contributed configurations", provider.label),
				accept: async () => {
					const pick = await provider.pick();
					if (pick) {
						// Use the type of the provider, not of the config since config sometimes have subtypes (for example "node-terminal")
						await configManager.selectConfiguration(pick.launch, pick.config.name, pick.config, { type: provider.type });
						this.debugService.startDebugging(pick.launch, pick.config, { startedByUser: true });
					}
				}
			});
		});


		// Entries: launches
		const visibleLaunches = configManager.getLaunches().filter(launch => !launch.hidden);

		// Separator
		if (visibleLaunches.length > 0) {
			picks.push({ type: 'separator', label: localize('configure', "configure") });
		}

		for (const launch of visibleLaunches) {
			const label = this.contextService.getWorkbenchState() === WorkbenchState.WORKSPACE ?
				localize("addConfigTo", "Add Config ({0})...", launch.name) :
				localize('addConfiguration', "Add Configuration...");

			// Add Config entry
			picks.push({
				label,
				description: this.contextService.getWorkbenchState() === WorkbenchState.WORKSPACE ? launch.name : '',
				highlights: { label: matchesFuzzy(filter, label, true) ?? undefined },
				accept: () => this.commandService.executeCommand(ADD_CONFIGURATION_ID, launch.uri.toString())
			});
		}

		return picks;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/debugService.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as aria from '../../../../base/browser/ui/aria/aria.js';
import { IAction, toAction } from '../../../../base/common/actions.js';
import { distinct } from '../../../../base/common/arrays.js';
import { RunOnceScheduler, raceTimeout } from '../../../../base/common/async.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { isErrorWithActions } from '../../../../base/common/errorMessage.js';
import * as errors from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { deepClone, equals } from '../../../../base/common/objects.js';

import severity from '../../../../base/common/severity.js';
import { URI, URI as uri } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { isCodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { ITextModel } from '../../../../editor/common/model.js';
import * as nls from '../../../../nls.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IExtensionHostDebugService } from '../../../../platform/debug/common/extensionHostDebug.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { FileChangeType, FileChangesEvent, IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IWorkspaceContextService, IWorkspaceFolder, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { IWorkspaceTrustRequestService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { EditorsOrder } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IViewDescriptorService, ViewContainerLocation } from '../../../common/views.js';
import { IActivityService, NumberBadge } from '../../../services/activity/common/activity.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IWorkbenchLayoutService, Parts } from '../../../services/layout/browser/layoutService.js';
import { ILifecycleService } from '../../../services/lifecycle/common/lifecycle.js';
import { IPaneCompositePartService } from '../../../services/panecomposite/browser/panecomposite.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { VIEWLET_ID as EXPLORER_VIEWLET_ID } from '../../files/common/files.js';
import { ITestService } from '../../testing/common/testService.js';
import { CALLSTACK_VIEW_ID, CONTEXT_BREAKPOINTS_EXIST, CONTEXT_DEBUG_STATE, CONTEXT_DEBUG_TYPE, CONTEXT_DEBUG_UX, CONTEXT_DISASSEMBLY_VIEW_FOCUS, CONTEXT_HAS_DEBUGGED, CONTEXT_IN_DEBUG_MODE, DEBUG_MEMORY_SCHEME, DEBUG_SCHEME, IAdapterManager, IBreakpoint, IBreakpointData, IBreakpointUpdateData, ICompound, IConfig, IConfigurationManager, IDebugConfiguration, IDebugModel, IDebugService, IDebugSession, IDebugSessionOptions, IEnablement, IExceptionBreakpoint, IGlobalConfig, IGuessedDebugger, ILaunch, IStackFrame, IThread, IViewModel, REPL_VIEW_ID, State, VIEWLET_ID, debuggerDisabledMessage, getStateLabel } from '../common/debug.js';
import { DebugCompoundRoot } from '../common/debugCompoundRoot.js';
import { Breakpoint, DataBreakpoint, DebugModel, FunctionBreakpoint, IDataBreakpointOptions, IFunctionBreakpointOptions, IInstructionBreakpointOptions, InstructionBreakpoint } from '../common/debugModel.js';
import { Source } from '../common/debugSource.js';
import { DebugStorage, IChosenEnvironment } from '../common/debugStorage.js';
import { DebugTelemetry } from '../common/debugTelemetry.js';
import { getExtensionHostDebugSession, saveAllBeforeDebugStart } from '../common/debugUtils.js';
import { ViewModel } from '../common/debugViewModel.js';
import { DisassemblyViewInput } from '../common/disassemblyViewInput.js';
import { AdapterManager } from './debugAdapterManager.js';
import { DEBUG_CONFIGURE_COMMAND_ID, DEBUG_CONFIGURE_LABEL } from './debugCommands.js';
import { ConfigurationManager } from './debugConfigurationManager.js';
import { DebugMemoryFileSystemProvider } from './debugMemory.js';
import { DebugSession } from './debugSession.js';
import { DebugTaskRunner, TaskRunResult } from './debugTaskRunner.js';

export class DebugService implements IDebugService {
	declare readonly _serviceBrand: undefined;

	private readonly _onDidChangeState: Emitter<State>;
	private readonly _onDidNewSession: Emitter<IDebugSession>;
	private readonly _onWillNewSession: Emitter<IDebugSession>;
	private readonly _onDidEndSession: Emitter<{ session: IDebugSession; restart: boolean }>;
	private readonly restartingSessions = new Set<IDebugSession>();
	private debugStorage: DebugStorage;
	private model: DebugModel;
	private viewModel: ViewModel;
	private telemetry: DebugTelemetry;
	private taskRunner: DebugTaskRunner;
	private configurationManager: ConfigurationManager;
	private adapterManager: AdapterManager;
	private readonly disposables = new DisposableStore();
	private debugType!: IContextKey<string>;
	private debugState!: IContextKey<string>;
	private inDebugMode!: IContextKey<boolean>;
	private debugUx!: IContextKey<string>;
	private hasDebugged!: IContextKey<boolean>;
	private breakpointsExist!: IContextKey<boolean>;
	private disassemblyViewFocus!: IContextKey<boolean>;
	private breakpointsToSendOnResourceSaved: Set<URI>;
	private initializing = false;
	private _initializingOptions: IDebugSessionOptions | undefined;
	private previousState: State | undefined;
	private sessionCancellationTokens = new Map<string, CancellationTokenSource>();
	private activity: IDisposable | undefined;
	private chosenEnvironments: Record<string, IChosenEnvironment>;
	private haveDoneLazySetup = false;

	constructor(
		@IEditorService private readonly editorService: IEditorService,
		@IPaneCompositePartService private readonly paneCompositeService: IPaneCompositePartService,
		@IViewsService private readonly viewsService: IViewsService,
		@IViewDescriptorService private readonly viewDescriptorService: IViewDescriptorService,
		@INotificationService private readonly notificationService: INotificationService,
		@IDialogService private readonly dialogService: IDialogService,
		@IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IFileService private readonly fileService: IFileService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IExtensionHostDebugService private readonly extensionHostDebugService: IExtensionHostDebugService,
		@IActivityService private readonly activityService: IActivityService,
		@ICommandService private readonly commandService: ICommandService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IWorkspaceTrustRequestService private readonly workspaceTrustRequestService: IWorkspaceTrustRequestService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@ITestService private readonly testService: ITestService,
	) {
		this.breakpointsToSendOnResourceSaved = new Set<URI>();

		this._onDidChangeState = new Emitter<State>();
		this._onDidNewSession = new Emitter<IDebugSession>();
		this._onWillNewSession = new Emitter<IDebugSession>();
		this._onDidEndSession = new Emitter();

		this.adapterManager = this.instantiationService.createInstance(AdapterManager, {
			onDidNewSession: this.onDidNewSession,
			configurationManager: () => this.configurationManager,
		});
		this.disposables.add(this.adapterManager);
		this.configurationManager = this.instantiationService.createInstance(ConfigurationManager, this.adapterManager);
		this.disposables.add(this.configurationManager);
		this.debugStorage = this.disposables.add(this.instantiationService.createInstance(DebugStorage));

		this.chosenEnvironments = this.debugStorage.loadChosenEnvironments();

		this.model = this.instantiationService.createInstance(DebugModel, this.debugStorage);
		this.telemetry = this.instantiationService.createInstance(DebugTelemetry, this.model);

		this.viewModel = new ViewModel(contextKeyService);
		this.taskRunner = this.instantiationService.createInstance(DebugTaskRunner);

		this.disposables.add(this.fileService.onDidFilesChange(e => this.onFileChanges(e)));
		this.disposables.add(this.lifecycleService.onWillShutdown(this.dispose, this));

		this.disposables.add(this.extensionHostDebugService.onAttachSession(event => {
			const session = this.model.getSession(event.sessionId, true);
			if (session) {
				// EH was started in debug mode -> attach to it
				session.configuration.request = 'attach';
				session.configuration.port = event.port;
				session.setSubId(event.subId);
				this.launchOrAttachToSession(session);
			}
		}));
		this.disposables.add(this.extensionHostDebugService.onTerminateSession(event => {
			const session = this.model.getSession(event.sessionId);
			if (session && session.subId === event.subId) {
				session.disconnect();
			}
		}));

		this.disposables.add(this.viewModel.onDidFocusStackFrame(() => {
			this.onStateChange();
		}));
		this.disposables.add(this.viewModel.onDidFocusSession((session: IDebugSession | undefined) => {
			this.onStateChange();

			if (session) {
				this.setExceptionBreakpointFallbackSession(session.getId());
			}
		}));
		this.disposables.add(Event.any(this.adapterManager.onDidRegisterDebugger, this.configurationManager.onDidSelectConfiguration)(() => {
			const debugUxValue = (this.state !== State.Inactive || (this.configurationManager.getAllConfigurations().length > 0 && this.adapterManager.hasEnabledDebuggers())) ? 'default' : 'simple';
			this.debugUx.set(debugUxValue);
			this.debugStorage.storeDebugUxState(debugUxValue);
		}));
		this.disposables.add(this.model.onDidChangeCallStack(() => {
			const numberOfSessions = this.model.getSessions().filter(s => !s.parentSession).length;
			this.activity?.dispose();
			if (numberOfSessions > 0) {
				const viewContainer = this.viewDescriptorService.getViewContainerByViewId(CALLSTACK_VIEW_ID);
				if (viewContainer) {
					this.activity = this.activityService.showViewContainerActivity(viewContainer.id, { badge: new NumberBadge(numberOfSessions, n => n === 1 ? nls.localize('1activeSession', "1 active session") : nls.localize('nActiveSessions', "{0} active sessions", n)) });
				}
			}
		}));

		this.disposables.add(editorService.onDidActiveEditorChange(() => {
			this.contextKeyService.bufferChangeEvents(() => {
				if (editorService.activeEditor === DisassemblyViewInput.instance) {
					this.disassemblyViewFocus.set(true);
				} else {
					// This key can be initialized a tick after this event is fired
					this.disassemblyViewFocus?.reset();
				}
			});
		}));

		this.disposables.add(this.lifecycleService.onBeforeShutdown(() => {
			for (const editor of editorService.editors) {
				// Editors will not be valid on window reload, so close them.
				if (editor.resource?.scheme === DEBUG_MEMORY_SCHEME) {
					editor.dispose();
				}
			}
		}));

		this.disposables.add(extensionService.onWillStop(evt => {
			evt.veto(
				this.model.getSessions().length > 0,
				nls.localize('active debug session', 'A debug session is still running that would terminate.'),
			);
		}));

		this.initContextKeys(contextKeyService);
	}

	private initContextKeys(contextKeyService: IContextKeyService): void {
		queueMicrotask(() => {
			contextKeyService.bufferChangeEvents(() => {
				this.debugType = CONTEXT_DEBUG_TYPE.bindTo(contextKeyService);
				this.debugState = CONTEXT_DEBUG_STATE.bindTo(contextKeyService);
				this.hasDebugged = CONTEXT_HAS_DEBUGGED.bindTo(contextKeyService);
				this.inDebugMode = CONTEXT_IN_DEBUG_MODE.bindTo(contextKeyService);
				this.debugUx = CONTEXT_DEBUG_UX.bindTo(contextKeyService);
				this.debugUx.set(this.debugStorage.loadDebugUxState());
				this.breakpointsExist = CONTEXT_BREAKPOINTS_EXIST.bindTo(contextKeyService);
				// Need to set disassemblyViewFocus here to make it in the same context as the debug event handlers
				this.disassemblyViewFocus = CONTEXT_DISASSEMBLY_VIEW_FOCUS.bindTo(contextKeyService);
			});

			const setBreakpointsExistContext = () => this.breakpointsExist.set(!!(this.model.getBreakpoints().length || this.model.getDataBreakpoints().length || this.model.getFunctionBreakpoints().length));
			setBreakpointsExistContext();
			this.disposables.add(this.model.onDidChangeBreakpoints(() => setBreakpointsExistContext()));
		});
	}

	getModel(): IDebugModel {
		return this.model;
	}

	getViewModel(): IViewModel {
		return this.viewModel;
	}

	getConfigurationManager(): IConfigurationManager {
		return this.configurationManager;
	}

	getAdapterManager(): IAdapterManager {
		return this.adapterManager;
	}

	sourceIsNotAvailable(uri: uri): void {
		this.model.sourceIsNotAvailable(uri);
	}

	dispose(): void {
		this.disposables.dispose();
	}

	//---- state management

	get state(): State {
		const focusedSession = this.viewModel.focusedSession;
		if (focusedSession) {
			return focusedSession.state;
		}

		return this.initializing ? State.Initializing : State.Inactive;
	}

	get initializingOptions(): IDebugSessionOptions | undefined {
		return this._initializingOptions;
	}

	private startInitializingState(options?: IDebugSessionOptions): void {
		if (!this.initializing) {
			this.initializing = true;
			this._initializingOptions = options;
			this.onStateChange();
		}
	}

	private endInitializingState(): void {
		if (this.initializing) {
			this.initializing = false;
			this._initializingOptions = undefined;
			this.onStateChange();
		}
	}

	private cancelTokens(id: string | undefined): void {
		if (id) {
			const token = this.sessionCancellationTokens.get(id);
			if (token) {
				token.cancel();
				this.sessionCancellationTokens.delete(id);
			}
		} else {
			this.sessionCancellationTokens.forEach(t => t.cancel());
			this.sessionCancellationTokens.clear();
		}
	}

	private onStateChange(): void {
		const state = this.state;
		if (this.previousState !== state) {
			this.contextKeyService.bufferChangeEvents(() => {
				this.debugState.set(getStateLabel(state));
				this.inDebugMode.set(state !== State.Inactive);
				// Only show the simple ux if debug is not yet started and if no launch.json exists
				const debugUxValue = ((state !== State.Inactive && state !== State.Initializing) || (this.adapterManager.hasEnabledDebuggers() && this.configurationManager.selectedConfiguration.name)) ? 'default' : 'simple';
				this.debugUx.set(debugUxValue);
				this.debugStorage.storeDebugUxState(debugUxValue);
			});
			this.previousState = state;
			this._onDidChangeState.fire(state);
		}
	}

	get onDidChangeState(): Event<State> {
		return this._onDidChangeState.event;
	}

	get onDidNewSession(): Event<IDebugSession> {
		return this._onDidNewSession.event;
	}

	get onWillNewSession(): Event<IDebugSession> {
		return this._onWillNewSession.event;
	}

	get onDidEndSession(): Event<{ session: IDebugSession; restart: boolean }> {
		return this._onDidEndSession.event;
	}

	private lazySetup() {
		if (!this.haveDoneLazySetup) {
			// Registering fs providers is slow
			// https://github.com/microsoft/vscode/issues/159886
			this.disposables.add(this.fileService.registerProvider(DEBUG_MEMORY_SCHEME, this.disposables.add(new DebugMemoryFileSystemProvider(this))));
			this.haveDoneLazySetup = true;
		}
	}

	//---- life cycle management

	/**
	 * main entry point
	 * properly manages compounds, checks for errors and handles the initializing state.
	 */
	async startDebugging(launch: ILaunch | undefined, configOrName?: IConfig | string, options?: IDebugSessionOptions, saveBeforeStart = !options?.parentSession): Promise<boolean> {
		const message = options && options.noDebug ? nls.localize('runTrust', "Running executes build tasks and program code from your workspace.") : nls.localize('debugTrust', "Debugging executes build tasks and program code from your workspace.");
		const trust = await this.workspaceTrustRequestService.requestWorkspaceTrust({ message });
		if (!trust) {
			return false;
		}

		this.lazySetup();
		this.startInitializingState(options);
		this.hasDebugged.set(true);
		try {
			// make sure to save all files and that the configuration is up to date
			await this.extensionService.activateByEvent('onDebug');
			if (saveBeforeStart) {
				await saveAllBeforeDebugStart(this.configurationService, this.editorService);
			}
			await this.extensionService.whenInstalledExtensionsRegistered();

			let config: IConfig | undefined;
			let compound: ICompound | undefined;
			if (!configOrName) {
				configOrName = this.configurationManager.selectedConfiguration.name;
			}
			if (typeof configOrName === 'string' && launch) {
				config = launch.getConfiguration(configOrName);
				compound = launch.getCompound(configOrName);
			} else if (typeof configOrName !== 'string') {
				config = configOrName;
			}

			if (compound) {
				// we are starting a compound debug, first do some error checking and than start each configuration in the compound
				if (!compound.configurations) {
					throw new Error(nls.localize({ key: 'compoundMustHaveConfigurations', comment: ['compound indicates a "compounds" configuration item', '"configurations" is an attribute and should not be localized'] },
						"Compound must have \"configurations\" attribute set in order to start multiple configurations."));
				}
				if (compound.preLaunchTask) {
					const taskResult = await this.taskRunner.runTaskAndCheckErrors(launch?.workspace || this.contextService.getWorkspace(), compound.preLaunchTask);
					if (taskResult === TaskRunResult.Failure) {
						this.endInitializingState();
						return false;
					}
				}
				if (compound.stopAll) {
					options = { ...options, compoundRoot: new DebugCompoundRoot() };
				}

				const values = await Promise.all(compound.configurations.map(configData => {
					const name = typeof configData === 'string' ? configData : configData.name;
					if (name === compound.name) {
						return Promise.resolve(false);
					}

					let launchForName: ILaunch | undefined;
					if (typeof configData === 'string') {
						const launchesContainingName = this.configurationManager.getLaunches().filter(l => !!l.getConfiguration(name));
						if (launchesContainingName.length === 1) {
							launchForName = launchesContainingName[0];
						} else if (launch && launchesContainingName.length > 1 && launchesContainingName.indexOf(launch) >= 0) {
							// If there are multiple launches containing the configuration give priority to the configuration in the current launch
							launchForName = launch;
						} else {
							throw new Error(launchesContainingName.length === 0 ? nls.localize('noConfigurationNameInWorkspace', "Could not find launch configuration '{0}' in the workspace.", name)
								: nls.localize('multipleConfigurationNamesInWorkspace', "There are multiple launch configurations '{0}' in the workspace. Use folder name to qualify the configuration.", name));
						}
					} else if (configData.folder) {
						const launchesMatchingConfigData = this.configurationManager.getLaunches().filter(l => l.workspace && l.workspace.name === configData.folder && !!l.getConfiguration(configData.name));
						if (launchesMatchingConfigData.length === 1) {
							launchForName = launchesMatchingConfigData[0];
						} else {
							throw new Error(nls.localize('noFolderWithName', "Can not find folder with name '{0}' for configuration '{1}' in compound '{2}'.", configData.folder, configData.name, compound.name));
						}
					}

					return this.createSession(launchForName, launchForName!.getConfiguration(name), options);
				}));

				const result = values.every(success => !!success); // Compound launch is a success only if each configuration launched successfully
				this.endInitializingState();
				return result;
			}

			if (configOrName && !config) {
				const message = !!launch ? nls.localize('configMissing', "Configuration '{0}' is missing in 'launch.json'.", typeof configOrName === 'string' ? configOrName : configOrName.name) :
					nls.localize('launchJsonDoesNotExist', "'launch.json' does not exist for passed workspace folder.");
				throw new Error(message);
			}

			const result = await this.createSession(launch, config, options);
			this.endInitializingState();
			return result;
		} catch (err) {
			// make sure to get out of initializing state, and propagate the result
			this.notificationService.error(err);
			this.endInitializingState();
			return Promise.reject(err);
		}
	}

	/**
	 * gets the debugger for the type, resolves configurations by providers, substitutes variables and runs prelaunch tasks
	 */
	private async createSession(launch: ILaunch | undefined, config: IConfig | undefined, options?: IDebugSessionOptions): Promise<boolean> {
		// We keep the debug type in a separate variable 'type' so that a no-folder config has no attributes.
		// Storing the type in the config would break extensions that assume that the no-folder case is indicated by an empty config.
		let type: string | undefined;
		if (config) {
			type = config.type;
		} else {
			// a no-folder workspace has no launch.config
			config = Object.create(null) as IConfig;
		}
		if (options && options.noDebug) {
			config.noDebug = true;
		} else if (options && typeof options.noDebug === 'undefined' && options.parentSession && options.parentSession.configuration.noDebug) {
			config.noDebug = true;
		}
		const unresolvedConfig = deepClone(config);

		let guess: IGuessedDebugger | undefined;
		let activeEditor: EditorInput | undefined;
		if (!type) {
			activeEditor = this.editorService.activeEditor;
			if (activeEditor && activeEditor.resource) {
				const chosen = this.chosenEnvironments[activeEditor.resource.toString()];
				if (chosen) {
					type = chosen.type;
					if (chosen.dynamicLabel) {
						const dyn = await this.configurationManager.getDynamicConfigurationsByType(chosen.type);
						const found = dyn.find(d => d.label === chosen.dynamicLabel);
						if (found) {
							launch = found.launch;
							Object.assign(config, found.config);
						}
					}
				}
			}

			if (!type) {
				guess = await this.adapterManager.guessDebugger(false);
				if (guess) {
					type = guess.debugger.type;
					if (guess.withConfig) {
						launch = guess.withConfig.launch;
						Object.assign(config, guess.withConfig.config);
					}
				}
			}
		}

		const initCancellationToken = new CancellationTokenSource();
		const sessionId = generateUuid();
		this.sessionCancellationTokens.set(sessionId, initCancellationToken);

		const configByProviders = await this.configurationManager.resolveConfigurationByProviders(launch && launch.workspace ? launch.workspace.uri : undefined, type, config, initCancellationToken.token);
		// a falsy config indicates an aborted launch
		if (configByProviders && configByProviders.type) {
			try {
				let resolvedConfig = await this.substituteVariables(launch, configByProviders);
				if (!resolvedConfig) {
					// User cancelled resolving of interactive variables, silently return
					return false;
				}

				if (initCancellationToken.token.isCancellationRequested) {
					// User cancelled, silently return
					return false;
				}

				// Check for concurrent sessions before running preLaunchTask to avoid running the task if user cancels
				let userConfirmedConcurrentSession = false;
				if (options?.startedByUser && resolvedConfig && resolvedConfig.suppressMultipleSessionWarning !== true) {
					// Check if there's already a session with the same launch configuration
					const existingSessions = this.model.getSessions();
					const workspace = launch?.workspace;

					const existingSession = existingSessions.find(s =>
						s.configuration.name === resolvedConfig!.name &&
						s.configuration.type === resolvedConfig!.type &&
						s.configuration.request === resolvedConfig!.request &&
						s.root === workspace
					);

					if (existingSession) {
						// There is already a session with the same configuration, prompt user before running preLaunchTask
						const confirmed = await this.confirmConcurrentSession(existingSession.getLabel());
						if (!confirmed) {
							return false;
						}
						userConfirmedConcurrentSession = true;
					}
				}

				const workspace = launch?.workspace || this.contextService.getWorkspace();
				const taskResult = await this.taskRunner.runTaskAndCheckErrors(workspace, resolvedConfig.preLaunchTask);
				if (taskResult === TaskRunResult.Failure) {
					return false;
				}

				const cfg = await this.configurationManager.resolveDebugConfigurationWithSubstitutedVariables(launch && launch.workspace ? launch.workspace.uri : undefined, resolvedConfig.type, resolvedConfig, initCancellationToken.token);
				if (!cfg) {
					if (launch && type && cfg === null && !initCancellationToken.token.isCancellationRequested) {	// show launch.json only for "config" being "null".
						await launch.openConfigFile({ preserveFocus: true, type }, initCancellationToken.token);
					}
					return false;
				}
				resolvedConfig = cfg;

				const dbg = this.adapterManager.getDebugger(resolvedConfig.type);
				if (!dbg || (configByProviders.request !== 'attach' && configByProviders.request !== 'launch')) {
					let message: string;
					if (configByProviders.request !== 'attach' && configByProviders.request !== 'launch') {
						message = configByProviders.request ? nls.localize('debugRequestNotSupported', "Attribute '{0}' has an unsupported value '{1}' in the chosen debug configuration.", 'request', configByProviders.request)
							: nls.localize('debugRequesMissing', "Attribute '{0}' is missing from the chosen debug configuration.", 'request');

					} else {
						message = resolvedConfig.type ? nls.localize('debugTypeNotSupported', "Configured debug type '{0}' is not supported.", resolvedConfig.type) :
							nls.localize('debugTypeMissing', "Missing property 'type' for the chosen launch configuration.");
					}

					const actionList: IAction[] = [];

					actionList.push(toAction({
						id: 'installAdditionalDebuggers',
						label: nls.localize({ key: 'installAdditionalDebuggers', comment: ['Placeholder is the debug type, so for example "node", "python"'] }, "Install {0} Extension", resolvedConfig.type),
						enabled: true,
						run: async () => this.commandService.executeCommand('debug.installAdditionalDebuggers', resolvedConfig?.type)
					}));

					await this.showError(message, actionList); return false;
				}

				if (!dbg.enabled) {
					await this.showError(debuggerDisabledMessage(dbg.type), []);
					return false;
				}

				const result = await this.doCreateSession(sessionId, launch?.workspace, { resolved: resolvedConfig, unresolved: unresolvedConfig }, options, userConfirmedConcurrentSession);
				if (result && guess && activeEditor && activeEditor.resource) {
					// Remeber user choice of environment per active editor to make starting debugging smoother #124770
					this.chosenEnvironments[activeEditor.resource.toString()] = { type: guess.debugger.type, dynamicLabel: guess.withConfig?.label };
					this.debugStorage.storeChosenEnvironments(this.chosenEnvironments);
				}
				return result;
			} catch (err) {
				if (err && err.message) {
					await this.showError(err.message);
				} else if (this.contextService.getWorkbenchState() === WorkbenchState.EMPTY) {
					await this.showError(nls.localize('noFolderWorkspaceDebugError', "The active file can not be debugged. Make sure it is saved and that you have a debug extension installed for that file type."));
				}
				if (launch && !initCancellationToken.token.isCancellationRequested) {
					await launch.openConfigFile({ preserveFocus: true }, initCancellationToken.token);
				}

				return false;
			}
		}

		if (launch && type && configByProviders === null && !initCancellationToken.token.isCancellationRequested) {	// show launch.json only for "config" being "null".
			await launch.openConfigFile({ preserveFocus: true, type }, initCancellationToken.token);
		}

		return false;
	}

	/**
	 * instantiates the new session, initializes the session, registers session listeners and reports telemetry
	 */
	private async doCreateSession(sessionId: string, root: IWorkspaceFolder | undefined, configuration: { resolved: IConfig; unresolved: IConfig | undefined }, options?: IDebugSessionOptions, userConfirmedConcurrentSession = false): Promise<boolean> {

		const session = this.instantiationService.createInstance(DebugSession, sessionId, configuration, root, this.model, options);
		if (!userConfirmedConcurrentSession && options?.startedByUser && this.model.getSessions().some(s =>
			s.configuration.name === configuration.resolved.name &&
			s.configuration.type === configuration.resolved.type &&
			s.configuration.request === configuration.resolved.request &&
			s.root === root
		) && configuration.resolved.suppressMultipleSessionWarning !== true) {
			// There is already a session with the same configuration, prompt user #127721
			const confirmed = await this.confirmConcurrentSession(session.getLabel());
			if (!confirmed) {
				return false;
			}
		}

		this.model.addSession(session);

		// since the Session is now properly registered under its ID and hooked, we can announce it
		// this event doesn't go to extensions
		this._onWillNewSession.fire(session);

		const openDebug = this.configurationService.getValue<IDebugConfiguration>('debug').openDebug;
		// Open debug viewlet based on the visibility of the side bar and openDebug setting. Do not open for 'run without debug'
		if (!configuration.resolved.noDebug && (openDebug === 'openOnSessionStart' || (openDebug !== 'neverOpen' && this.viewModel.firstSessionStart)) && !session.suppressDebugView) {
			await this.paneCompositeService.openPaneComposite(VIEWLET_ID, ViewContainerLocation.Sidebar);
		}

		try {
			await this.launchOrAttachToSession(session);

			const internalConsoleOptions = session.configuration.internalConsoleOptions || this.configurationService.getValue<IDebugConfiguration>('debug').internalConsoleOptions;
			if (internalConsoleOptions === 'openOnSessionStart' || (this.viewModel.firstSessionStart && internalConsoleOptions === 'openOnFirstSessionStart')) {
				this.viewsService.openView(REPL_VIEW_ID, false);
			}

			this.viewModel.firstSessionStart = false;
			const showSubSessions = this.configurationService.getValue<IDebugConfiguration>('debug').showSubSessionsInToolBar;
			const sessions = this.model.getSessions();
			const shownSessions = showSubSessions ? sessions : sessions.filter(s => !s.parentSession);
			if (shownSessions.length > 1) {
				this.viewModel.setMultiSessionView(true);
			}

			// since the initialized response has arrived announce the new Session (including extensions)
			this._onDidNewSession.fire(session);

			return true;
		} catch (error) {

			if (errors.isCancellationError(error)) {
				// don't show 'canceled' error messages to the user #7906
				return false;
			}

			// Show the repl if some error got logged there #5870
			if (session && session.getReplElements().length > 0) {
				this.viewsService.openView(REPL_VIEW_ID, false);
			}

			if (session.configuration && session.configuration.request === 'attach' && session.configuration.__autoAttach) {
				// ignore attach timeouts in auto attach mode
				return false;
			}

			const errorMessage = error instanceof Error ? error.message : error;
			if (error.showUser !== false) {
				// Only show the error when showUser is either not defined, or is true #128484
				await this.showError(errorMessage, isErrorWithActions(error) ? error.actions : []);
			}
			return false;
		}
	}

	private async confirmConcurrentSession(sessionLabel: string): Promise<boolean> {
		const result = await this.dialogService.confirm({
			message: nls.localize('multipleSession', "'{0}' is already running. Do you want to start another instance?", sessionLabel)
		});
		return result.confirmed;
	}

	private async launchOrAttachToSession(session: IDebugSession, forceFocus = false): Promise<void> {
		// register listeners as the very first thing!
		this.registerSessionListeners(session);

		const dbgr = this.adapterManager.getDebugger(session.configuration.type);
		try {
			await session.initialize(dbgr!);
			await session.launchOrAttach(session.configuration);
			const launchJsonExists = !!session.root && !!this.configurationService.getValue<IGlobalConfig>('launch', { resource: session.root.uri });
			await this.telemetry.logDebugSessionStart(dbgr!, launchJsonExists);

			if (forceFocus || !this.viewModel.focusedSession || (session.parentSession === this.viewModel.focusedSession && session.compact)) {
				await this.focusStackFrame(undefined, undefined, session);
			}
		} catch (err) {
			if (this.viewModel.focusedSession === session) {
				await this.focusStackFrame(undefined);
			}
			return Promise.reject(err);
		}
	}

	private registerSessionListeners(session: IDebugSession): void {
		const listenerDisposables = new DisposableStore();
		this.disposables.add(listenerDisposables);

		const sessionRunningScheduler = listenerDisposables.add(new RunOnceScheduler(() => {
			// Do not immediatly defocus the stack frame if the session is running
			if (session.state === State.Running && this.viewModel.focusedSession === session) {
				this.viewModel.setFocus(undefined, this.viewModel.focusedThread, session, false);
			}
		}, 200));
		listenerDisposables.add(session.onDidChangeState(() => {
			if (session.state === State.Running && this.viewModel.focusedSession === session) {
				sessionRunningScheduler.schedule();
			}
			if (session === this.viewModel.focusedSession) {
				this.onStateChange();
			}
		}));
		listenerDisposables.add(this.onDidEndSession(e => {
			if (e.session === session) {
				this.disposables.delete(listenerDisposables);
			}
		}));
		listenerDisposables.add(session.onDidEndAdapter(async adapterExitEvent => {

			if (adapterExitEvent) {
				if (adapterExitEvent.error) {
					this.notificationService.error(nls.localize('debugAdapterCrash', "Debug adapter process has terminated unexpectedly ({0})", adapterExitEvent.error.message || adapterExitEvent.error.toString()));
				}
				this.telemetry.logDebugSessionStop(session, adapterExitEvent);
			}

			// 'Run without debugging' mode VSCode must terminate the extension host. More details: #3905
			const extensionDebugSession = getExtensionHostDebugSession(session);
			if (extensionDebugSession && extensionDebugSession.state === State.Running && extensionDebugSession.configuration.noDebug) {
				this.extensionHostDebugService.close(extensionDebugSession.getId());
			}

			if (session.configuration.postDebugTask) {
				const root = session.root ?? this.contextService.getWorkspace();
				try {
					await this.taskRunner.runTask(root, session.configuration.postDebugTask);
				} catch (err) {
					this.notificationService.error(err);
				}
			}
			this.endInitializingState();
			this.cancelTokens(session.getId());

			if (this.configurationService.getValue<IDebugConfiguration>('debug').closeReadonlyTabsOnEnd) {
				const editorsToClose = this.editorService.getEditors(EditorsOrder.SEQUENTIAL).filter(({ editor }) => {
					return editor.resource?.scheme === DEBUG_SCHEME && session.getId() === Source.getEncodedDebugData(editor.resource).sessionId;
				});
				this.editorService.closeEditors(editorsToClose);
			}
			this._onDidEndSession.fire({ session, restart: this.restartingSessions.has(session) });

			const focusedSession = this.viewModel.focusedSession;
			if (focusedSession && focusedSession.getId() === session.getId()) {
				const { session, thread, stackFrame } = getStackFrameThreadAndSessionToFocus(this.model, undefined, undefined, undefined, focusedSession);
				this.viewModel.setFocus(stackFrame, thread, session, false);
			}

			if (this.model.getSessions().length === 0) {
				this.viewModel.setMultiSessionView(false);

				if (this.layoutService.isVisible(Parts.SIDEBAR_PART) && this.configurationService.getValue<IDebugConfiguration>('debug').openExplorerOnEnd) {
					this.paneCompositeService.openPaneComposite(EXPLORER_VIEWLET_ID, ViewContainerLocation.Sidebar);
				}

				// Data breakpoints that can not be persisted should be cleared when a session ends
				const dataBreakpoints = this.model.getDataBreakpoints().filter(dbp => !dbp.canPersist);
				dataBreakpoints.forEach(dbp => this.model.removeDataBreakpoints(dbp.getId()));

				if (this.configurationService.getValue<IDebugConfiguration>('debug').console.closeOnEnd) {
					const debugConsoleContainer = this.viewDescriptorService.getViewContainerByViewId(REPL_VIEW_ID);
					if (debugConsoleContainer && this.viewsService.isViewContainerVisible(debugConsoleContainer.id)) {
						this.viewsService.closeViewContainer(debugConsoleContainer.id);
					}
				}
			}

			this.model.removeExceptionBreakpointsForSession(session.getId());
			// session.dispose(); TODO@roblourens
		}));
	}

	async restartSession(session: IDebugSession, restartData?: any): Promise<void> {
		if (session.saveBeforeRestart) {
			await saveAllBeforeDebugStart(this.configurationService, this.editorService);
		}

		const isAutoRestart = !!restartData;

		const runTasks: () => Promise<TaskRunResult> = async () => {
			if (isAutoRestart) {
				// Do not run preLaunch and postDebug tasks for automatic restarts
				return Promise.resolve(TaskRunResult.Success);
			}

			const root = session.root || this.contextService.getWorkspace();
			await this.taskRunner.runTask(root, session.configuration.preRestartTask);
			await this.taskRunner.runTask(root, session.configuration.postDebugTask);

			const taskResult1 = await this.taskRunner.runTaskAndCheckErrors(root, session.configuration.preLaunchTask);
			if (taskResult1 !== TaskRunResult.Success) {
				return taskResult1;
			}

			return this.taskRunner.runTaskAndCheckErrors(root, session.configuration.postRestartTask);
		};

		const extensionDebugSession = getExtensionHostDebugSession(session);
		if (extensionDebugSession) {
			const taskResult = await runTasks();
			if (taskResult === TaskRunResult.Success) {
				this.extensionHostDebugService.reload(extensionDebugSession.getId());
			}

			return;
		}

		// Read the configuration again if a launch.json has been changed, if not just use the inmemory configuration
		let needsToSubstitute = false;
		let unresolved: IConfig | undefined;
		const launch = session.root ? this.configurationManager.getLaunch(session.root.uri) : undefined;
		if (launch) {
			unresolved = launch.getConfiguration(session.configuration.name);
			if (unresolved && !equals(unresolved, session.unresolvedConfiguration)) {
				unresolved.noDebug = session.configuration.noDebug;
				needsToSubstitute = true;
			}
		}

		let resolved: IConfig | undefined | null = session.configuration;
		if (launch && needsToSubstitute && unresolved) {
			const initCancellationToken = new CancellationTokenSource();
			this.sessionCancellationTokens.set(session.getId(), initCancellationToken);
			const resolvedByProviders = await this.configurationManager.resolveConfigurationByProviders(launch.workspace ? launch.workspace.uri : undefined, unresolved.type, unresolved, initCancellationToken.token);
			if (resolvedByProviders) {
				resolved = await this.substituteVariables(launch, resolvedByProviders);
				if (resolved && !initCancellationToken.token.isCancellationRequested) {
					resolved = await this.configurationManager.resolveDebugConfigurationWithSubstitutedVariables(launch && launch.workspace ? launch.workspace.uri : undefined, resolved.type, resolved, initCancellationToken.token);
				}
			} else {
				resolved = resolvedByProviders;
			}
		}
		if (resolved) {
			session.setConfiguration({ resolved, unresolved });
		}
		session.configuration.__restart = restartData;

		const doRestart = async (fn: () => Promise<boolean | undefined>) => {
			this.restartingSessions.add(session);
			let didRestart = false;
			try {
				didRestart = (await fn()) !== false;
			} catch (e) {
				didRestart = false;
				throw e;
			} finally {
				this.restartingSessions.delete(session);
				// we previously may have issued an onDidEndSession with restart: true,
				// assuming the adapter exited (in `registerSessionListeners`). But the
				// restart failed, so emit the final termination now.
				if (!didRestart) {
					this._onDidEndSession.fire({ session, restart: false });
				}
			}
		};

		for (const breakpoint of this.model.getBreakpoints({ triggeredOnly: true })) {
			breakpoint.setSessionDidTrigger(session.getId(), false);
		}

		// For debug sessions spawned by test runs, cancel the test run and stop
		// the session, then start the test run again; tests have no notion of restarts.
		if (session.correlatedTestRun) {
			if (!session.correlatedTestRun.completedAt) {
				session.cancelCorrelatedTestRun();
				await Event.toPromise(session.correlatedTestRun.onComplete);
				// todo@connor4312 is there any reason to wait for the debug session to
				// terminate? I don't think so, test extension should already handle any
				// state conflicts...
			}

			this.testService.runResolvedTests(session.correlatedTestRun.request);
			return;
		}

		if (session.capabilities.supportsRestartRequest) {
			const taskResult = await runTasks();
			if (taskResult === TaskRunResult.Success) {
				await doRestart(async () => {
					await session.restart();
					return true;
				});
			}

			return;
		}

		const shouldFocus = !!this.viewModel.focusedSession && session.getId() === this.viewModel.focusedSession.getId();
		return doRestart(async () => {
			// If the restart is automatic  -> disconnect, otherwise -> terminate #55064
			if (isAutoRestart) {
				await session.disconnect(true);
			} else {
				await session.terminate(true);
			}

			return new Promise<boolean>((c, e) => {
				setTimeout(async () => {
					const taskResult = await runTasks();
					if (taskResult !== TaskRunResult.Success) {
						return c(false);
					}

					if (!resolved) {
						return c(false);
					}

					try {
						await this.launchOrAttachToSession(session, shouldFocus);
						this._onDidNewSession.fire(session);
						c(true);
					} catch (error) {
						e(error);
					}
				}, 300);
			});
		});
	}

	async stopSession(session: IDebugSession | undefined, disconnect = false, suspend = false): Promise<any> {
		if (session) {
			return disconnect ? session.disconnect(undefined, suspend) : session.terminate();
		}

		const sessions = this.model.getSessions();
		if (sessions.length === 0) {
			this.taskRunner.cancel();
			// User might have cancelled starting of a debug session, and in some cases the quick pick is left open
			await this.quickInputService.cancel();
			this.endInitializingState();
			this.cancelTokens(undefined);
		}

		return Promise.all(sessions.map(s => disconnect ? s.disconnect(undefined, suspend) : s.terminate()));
	}

	private async substituteVariables(launch: ILaunch | undefined, config: IConfig): Promise<IConfig | undefined> {
		const dbg = this.adapterManager.getDebugger(config.type);
		if (dbg) {
			let folder: IWorkspaceFolder | undefined = undefined;
			if (launch && launch.workspace) {
				folder = launch.workspace;
			} else {
				const folders = this.contextService.getWorkspace().folders;
				if (folders.length === 1) {
					folder = folders[0];
				}
			}
			try {
				return await dbg.substituteVariables(folder, config);
			} catch (err) {
				if (err.message !== errors.canceledName) {
					this.showError(err.message, undefined, !!launch?.getConfiguration(config.name));
				}
				return undefined;	// bail out
			}
		}
		return Promise.resolve(config);
	}

	private async showError(message: string, errorActions: ReadonlyArray<IAction> = [], promptLaunchJson = true): Promise<void> {
		const configureAction = toAction({ id: DEBUG_CONFIGURE_COMMAND_ID, label: DEBUG_CONFIGURE_LABEL, enabled: true, run: () => this.commandService.executeCommand(DEBUG_CONFIGURE_COMMAND_ID) });
		// Don't append the standard command if id of any provided action indicates it is a command
		const actions = errorActions.filter((action) => action.id.endsWith('.command')).length > 0 ?
			errorActions :
			[...errorActions, ...(promptLaunchJson ? [configureAction] : [])];
		await this.dialogService.prompt({
			type: severity.Error,
			message,
			buttons: actions.map(action => ({
				label: action.label,
				run: () => action.run()
			})),
			cancelButton: true
		});
	}

	//---- focus management

	async focusStackFrame(_stackFrame: IStackFrame | undefined, _thread?: IThread, _session?: IDebugSession, options?: { explicit?: boolean; preserveFocus?: boolean; sideBySide?: boolean; pinned?: boolean }): Promise<void> {
		const { stackFrame, thread, session } = getStackFrameThreadAndSessionToFocus(this.model, _stackFrame, _thread, _session);

		if (stackFrame) {
			const editor = await stackFrame.openInEditor(this.editorService, options?.preserveFocus ?? true, options?.sideBySide, options?.pinned);
			if (editor) {
				if (editor.input === DisassemblyViewInput.instance) {
					// Go to address is invoked via setFocus
				} else {
					const control = editor.getControl();
					if (stackFrame && isCodeEditor(control) && control.hasModel()) {
						const model = control.getModel();
						const lineNumber = stackFrame.range.startLineNumber;
						if (lineNumber >= 1 && lineNumber <= model.getLineCount()) {
							const lineContent = control.getModel().getLineContent(lineNumber);
							aria.alert(nls.localize({ key: 'debuggingPaused', comment: ['First placeholder is the file line content, second placeholder is the reason why debugging is stopped, for example "breakpoint", third is the stack frame name, and last is the line number.'] },
								"{0}, debugging paused {1}, {2}:{3}", lineContent, thread && thread.stoppedDetails ? `, reason ${thread.stoppedDetails.reason}` : '', stackFrame.source ? stackFrame.source.name : '', stackFrame.range.startLineNumber));
						}
					}
				}
			}
		}
		if (session) {
			this.debugType.set(session.configuration.type);
		} else {
			this.debugType.reset();
		}

		this.viewModel.setFocus(stackFrame, thread, session, !!options?.explicit);
	}

	//---- watches

	addWatchExpression(name?: string): void {
		const we = this.model.addWatchExpression(name);
		if (!name) {
			this.viewModel.setSelectedExpression(we, false);
		}
		this.debugStorage.storeWatchExpressions(this.model.getWatchExpressions());
	}

	renameWatchExpression(id: string, newName: string): void {
		this.model.renameWatchExpression(id, newName);
		this.debugStorage.storeWatchExpressions(this.model.getWatchExpressions());
	}

	moveWatchExpression(id: string, position: number): void {
		this.model.moveWatchExpression(id, position);
		this.debugStorage.storeWatchExpressions(this.model.getWatchExpressions());
	}

	removeWatchExpressions(id?: string): void {
		this.model.removeWatchExpressions(id);
		this.debugStorage.storeWatchExpressions(this.model.getWatchExpressions());
	}

	//---- breakpoints

	canSetBreakpointsIn(model: ITextModel): boolean {
		return this.adapterManager.canSetBreakpointsIn(model);
	}

	async enableOrDisableBreakpoints(enable: boolean, breakpoint?: IEnablement): Promise<void> {
		if (breakpoint) {
			this.model.setEnablement(breakpoint, enable);
			this.debugStorage.storeBreakpoints(this.model);
			if (breakpoint instanceof Breakpoint) {
				await this.makeTriggeredBreakpointsMatchEnablement(enable, breakpoint);
				await this.sendBreakpoints(breakpoint.originalUri);
			} else if (breakpoint instanceof FunctionBreakpoint) {
				await this.sendFunctionBreakpoints();
			} else if (breakpoint instanceof DataBreakpoint) {
				await this.sendDataBreakpoints();
			} else if (breakpoint instanceof InstructionBreakpoint) {
				await this.sendInstructionBreakpoints();
			} else {
				await this.sendExceptionBreakpoints();
			}
		} else {
			this.model.enableOrDisableAllBreakpoints(enable);
			this.debugStorage.storeBreakpoints(this.model);
			await this.sendAllBreakpoints();
		}
		this.debugStorage.storeBreakpoints(this.model);
	}

	async addBreakpoints(uri: uri, rawBreakpoints: IBreakpointData[], ariaAnnounce = true): Promise<IBreakpoint[]> {
		const breakpoints = this.model.addBreakpoints(uri, rawBreakpoints);
		if (ariaAnnounce) {
			breakpoints.forEach(bp => aria.status(nls.localize('breakpointAdded', "Added breakpoint, line {0}, file {1}", bp.lineNumber, uri.fsPath)));
		}

		// In some cases we need to store breakpoints before we send them because sending them can take a long time
		// And after sending them because the debug adapter can attach adapter data to a breakpoint
		this.debugStorage.storeBreakpoints(this.model);
		await this.sendBreakpoints(uri);
		this.debugStorage.storeBreakpoints(this.model);
		return breakpoints;
	}

	async updateBreakpoints(uri: uri, data: Map<string, IBreakpointUpdateData>, sendOnResourceSaved: boolean): Promise<void> {
		this.model.updateBreakpoints(data);
		this.debugStorage.storeBreakpoints(this.model);
		if (sendOnResourceSaved) {
			this.breakpointsToSendOnResourceSaved.add(uri);
		} else {
			await this.sendBreakpoints(uri);
			this.debugStorage.storeBreakpoints(this.model);
		}
	}

	async removeBreakpoints(id?: string | string[]): Promise<void> {
		const breakpoints = this.model.getBreakpoints();
		const toRemove = id === undefined
			? breakpoints
			: id instanceof Array
				? breakpoints.filter(bp => id.includes(bp.getId()))
				: breakpoints.filter(bp => bp.getId() === id);
		// note: using the debugger-resolved uri for aria to reflect UI state
		toRemove.forEach(bp => aria.status(nls.localize('breakpointRemoved', "Removed breakpoint, line {0}, file {1}", bp.lineNumber, bp.uri.fsPath)));
		const urisToClear = new Set(toRemove.map(bp => bp.originalUri.toString()));

		this.model.removeBreakpoints(toRemove);
		this.unlinkTriggeredBreakpoints(breakpoints, toRemove).forEach(uri => urisToClear.add(uri.toString()));

		this.debugStorage.storeBreakpoints(this.model);
		await Promise.all([...urisToClear].map(uri => this.sendBreakpoints(URI.parse(uri))));
	}

	setBreakpointsActivated(activated: boolean): Promise<void> {
		this.model.setBreakpointsActivated(activated);
		return this.sendAllBreakpoints();
	}

	async addFunctionBreakpoint(opts?: IFunctionBreakpointOptions, id?: string): Promise<void> {
		this.model.addFunctionBreakpoint(opts ?? { name: '' }, id);
		// If opts not provided, sending the breakpoint is handled by a later to call to `updateFunctionBreakpoint`
		if (opts) {
			this.debugStorage.storeBreakpoints(this.model);
			await this.sendFunctionBreakpoints();
			this.debugStorage.storeBreakpoints(this.model);
		}
	}

	async updateFunctionBreakpoint(id: string, update: { name?: string; hitCondition?: string; condition?: string }): Promise<void> {
		this.model.updateFunctionBreakpoint(id, update);
		this.debugStorage.storeBreakpoints(this.model);
		await this.sendFunctionBreakpoints();
	}

	async removeFunctionBreakpoints(id?: string): Promise<void> {
		this.model.removeFunctionBreakpoints(id);
		this.debugStorage.storeBreakpoints(this.model);
		await this.sendFunctionBreakpoints();
	}

	async addDataBreakpoint(opts: IDataBreakpointOptions): Promise<void> {
		this.model.addDataBreakpoint(opts);
		this.debugStorage.storeBreakpoints(this.model);
		await this.sendDataBreakpoints();
		this.debugStorage.storeBreakpoints(this.model);
	}

	async updateDataBreakpoint(id: string, update: { hitCondition?: string; condition?: string }): Promise<void> {
		this.model.updateDataBreakpoint(id, update);
		this.debugStorage.storeBreakpoints(this.model);
		await this.sendDataBreakpoints();
	}

	async removeDataBreakpoints(id?: string): Promise<void> {
		this.model.removeDataBreakpoints(id);
		this.debugStorage.storeBreakpoints(this.model);
		await this.sendDataBreakpoints();
	}

	async addInstructionBreakpoint(opts: IInstructionBreakpointOptions): Promise<void> {
		this.model.addInstructionBreakpoint(opts);
		this.debugStorage.storeBreakpoints(this.model);
		await this.sendInstructionBreakpoints();
		this.debugStorage.storeBreakpoints(this.model);
	}

	async removeInstructionBreakpoints(instructionReference?: string, offset?: number): Promise<void> {
		this.model.removeInstructionBreakpoints(instructionReference, offset);
		this.debugStorage.storeBreakpoints(this.model);
		await this.sendInstructionBreakpoints();
	}

	setExceptionBreakpointFallbackSession(sessionId: string) {
		this.model.setExceptionBreakpointFallbackSession(sessionId);
		this.debugStorage.storeBreakpoints(this.model);
	}

	setExceptionBreakpointsForSession(session: IDebugSession, filters: DebugProtocol.ExceptionBreakpointsFilter[]): void {
		this.model.setExceptionBreakpointsForSession(session.getId(), filters);
		this.debugStorage.storeBreakpoints(this.model);
	}

	async setExceptionBreakpointCondition(exceptionBreakpoint: IExceptionBreakpoint, condition: string | undefined): Promise<void> {
		this.model.setExceptionBreakpointCondition(exceptionBreakpoint, condition);
		this.debugStorage.storeBreakpoints(this.model);
		await this.sendExceptionBreakpoints();
	}

	async sendAllBreakpoints(session?: IDebugSession): Promise<void> {
		const setBreakpointsPromises = distinct(this.model.getBreakpoints(), bp => bp.originalUri.toString())
			.map(bp => this.sendBreakpoints(bp.originalUri, false, session));

		// If sending breakpoints to one session which we know supports the configurationDone request, can make all requests in parallel
		if (session?.capabilities.supportsConfigurationDoneRequest) {
			await Promise.all([
				...setBreakpointsPromises,
				this.sendFunctionBreakpoints(session),
				this.sendDataBreakpoints(session),
				this.sendInstructionBreakpoints(session),
				this.sendExceptionBreakpoints(session),
			]);
		} else {
			await Promise.all(setBreakpointsPromises);
			await this.sendFunctionBreakpoints(session);
			await this.sendDataBreakpoints(session);
			await this.sendInstructionBreakpoints(session);
			// send exception breakpoints at the end since some debug adapters may rely on the order - this was the case before
			// the configurationDone request was introduced.
			await this.sendExceptionBreakpoints(session);
		}
	}

	/**
	 * Removes the condition of triggered breakpoints that depended on
	 * breakpoints in `removedBreakpoints`. Returns the URIs of resources that
	 * had their breakpoints changed in this way.
	 */
	private unlinkTriggeredBreakpoints(allBreakpoints: readonly IBreakpoint[], removedBreakpoints: readonly IBreakpoint[]): uri[] {
		const affectedUris: uri[] = [];
		for (const removed of removedBreakpoints) {
			for (const existing of allBreakpoints) {
				if (!removedBreakpoints.includes(existing) && existing.triggeredBy === removed.getId()) {
					this.model.updateBreakpoints(new Map([[existing.getId(), { triggeredBy: undefined }]]));
					affectedUris.push(existing.originalUri);
				}
			}
		}

		return affectedUris;
	}

	private async makeTriggeredBreakpointsMatchEnablement(enable: boolean, breakpoint: Breakpoint) {
		if (enable) {
			/** If the breakpoint is being enabled, also ensure its triggerer is enabled */
			if (breakpoint.triggeredBy) {
				const trigger = this.model.getBreakpoints().find(bp => breakpoint.triggeredBy === bp.getId());
				if (trigger && !trigger.enabled) {
					await this.enableOrDisableBreakpoints(enable, trigger);
				}
			}
		}


		/** Makes its triggeree states match the state of this breakpoint */
		await Promise.all(this.model.getBreakpoints()
			.filter(bp => bp.triggeredBy === breakpoint.getId() && bp.enabled !== enable)
			.map(bp => this.enableOrDisableBreakpoints(enable, bp))
		);
	}

	public async sendBreakpoints(modelUri: uri, sourceModified = false, session?: IDebugSession): Promise<void> {
		const breakpointsToSend = this.model.getBreakpoints({ originalUri: modelUri, enabledOnly: true });
		await sendToOneOrAllSessions(this.model, session, async s => {
			if (!s.configuration.noDebug) {
				const sessionBps = breakpointsToSend.filter(bp => !bp.triggeredBy || bp.getSessionDidTrigger(s.getId()));
				await s.sendBreakpoints(modelUri, sessionBps, sourceModified);
			}
		});
	}

	private async sendFunctionBreakpoints(session?: IDebugSession): Promise<void> {
		const breakpointsToSend = this.model.getFunctionBreakpoints().filter(fbp => fbp.enabled && this.model.areBreakpointsActivated());

		await sendToOneOrAllSessions(this.model, session, async s => {
			if (s.capabilities.supportsFunctionBreakpoints && !s.configuration.noDebug) {
				await s.sendFunctionBreakpoints(breakpointsToSend);
			}
		});
	}

	private async sendDataBreakpoints(session?: IDebugSession): Promise<void> {
		const breakpointsToSend = this.model.getDataBreakpoints().filter(fbp => fbp.enabled && this.model.areBreakpointsActivated());

		await sendToOneOrAllSessions(this.model, session, async s => {
			if (s.capabilities.supportsDataBreakpoints && !s.configuration.noDebug) {
				await s.sendDataBreakpoints(breakpointsToSend);
			}
		});
	}

	private async sendInstructionBreakpoints(session?: IDebugSession): Promise<void> {
		const breakpointsToSend = this.model.getInstructionBreakpoints().filter(fbp => fbp.enabled && this.model.areBreakpointsActivated());

		await sendToOneOrAllSessions(this.model, session, async s => {
			if (s.capabilities.supportsInstructionBreakpoints && !s.configuration.noDebug) {
				await s.sendInstructionBreakpoints(breakpointsToSend);
			}
		});
	}

	private sendExceptionBreakpoints(session?: IDebugSession): Promise<void> {
		return sendToOneOrAllSessions(this.model, session, async s => {
			const enabledExceptionBps = this.model.getExceptionBreakpointsForSession(s.getId()).filter(exb => exb.enabled);
			if (s.capabilities.supportsConfigurationDoneRequest && (!s.capabilities.exceptionBreakpointFilters || s.capabilities.exceptionBreakpointFilters.length === 0)) {
				// Only call `setExceptionBreakpoints` as specified in dap protocol #90001
				return;
			}
			if (!s.configuration.noDebug) {
				await s.sendExceptionBreakpoints(enabledExceptionBps);
			}
		});
	}

	private onFileChanges(fileChangesEvent: FileChangesEvent): void {
		const toRemove = this.model.getBreakpoints().filter(bp =>
			fileChangesEvent.contains(bp.originalUri, FileChangeType.DELETED));
		if (toRemove.length) {
			this.model.removeBreakpoints(toRemove);
		}

		const toSend: URI[] = [];
		for (const uri of this.breakpointsToSendOnResourceSaved) {
			if (fileChangesEvent.contains(uri, FileChangeType.UPDATED)) {
				toSend.push(uri);
			}
		}

		for (const uri of toSend) {
			this.breakpointsToSendOnResourceSaved.delete(uri);
			this.sendBreakpoints(uri, true);
		}
	}

	async runTo(uri: uri, lineNumber: number, column?: number): Promise<void> {
		let breakpointToRemove: IBreakpoint | undefined;
		let threadToContinue = this.getViewModel().focusedThread;
		const addTempBreakPoint = async () => {
			const bpExists = !!(this.getModel().getBreakpoints({ column, lineNumber, uri }).length);

			if (!bpExists) {
				const addResult = await this.addAndValidateBreakpoints(uri, lineNumber, column);
				if (addResult.thread) {
					threadToContinue = addResult.thread;
				}

				if (addResult.breakpoint) {
					breakpointToRemove = addResult.breakpoint;
				}
			}
			return { threadToContinue, breakpointToRemove };
		};
		const removeTempBreakPoint = (state: State): boolean => {
			if (state === State.Stopped || state === State.Inactive) {
				if (breakpointToRemove) {
					this.removeBreakpoints(breakpointToRemove.getId());
				}
				return true;
			}
			return false;
		};

		await addTempBreakPoint();
		if (this.state === State.Inactive) {
			// If no session exists start the debugger
			const { launch, name, getConfig } = this.getConfigurationManager().selectedConfiguration;
			const config = await getConfig();
			const configOrName = config ? Object.assign(deepClone(config), {}) : name;
			const listener = this.onDidChangeState(state => {
				if (removeTempBreakPoint(state)) {
					listener.dispose();
				}
			});
			await this.startDebugging(launch, configOrName, undefined, true);
		}
		if (this.state === State.Stopped) {
			const focusedSession = this.getViewModel().focusedSession;
			if (!focusedSession || !threadToContinue) {
				return;
			}

			const listener = threadToContinue.session.onDidChangeState(() => {
				if (removeTempBreakPoint(focusedSession.state)) {
					listener.dispose();
				}
			});
			await threadToContinue.continue();
		}
	}

	private async addAndValidateBreakpoints(uri: URI, lineNumber: number, column?: number) {
		const debugModel = this.getModel();
		const viewModel = this.getViewModel();

		const breakpoints = await this.addBreakpoints(uri, [{ lineNumber, column }], false);
		const breakpoint = breakpoints?.[0];
		if (!breakpoint) {
			return { breakpoint: undefined, thread: viewModel.focusedThread };
		}

		// If the breakpoint was not initially verified, wait up to 2s for it to become so.
		// Inherently racey if multiple sessions can verify async, but not solvable...
		if (!breakpoint.verified) {
			let listener: IDisposable;
			await raceTimeout(new Promise<void>(resolve => {
				listener = debugModel.onDidChangeBreakpoints(() => {
					if (breakpoint.verified) {
						resolve();
					}
				});
			}), 2000);
			listener!.dispose();
		}

		// Look at paused threads for sessions that verified this bp. Prefer, in order:
		const enum Score {
			/** The focused thread */
			Focused,
			/** Any other stopped thread of a session that verified the bp */
			Verified,
			/** Any thread that verified and paused in the same file */
			VerifiedAndPausedInFile,
			/** The focused thread if it verified the breakpoint */
			VerifiedAndFocused,
		}

		let bestThread = viewModel.focusedThread;
		let bestScore = Score.Focused;
		for (const sessionId of breakpoint.sessionsThatVerified) {
			const session = debugModel.getSession(sessionId);
			if (!session) {
				continue;
			}

			const threads = session.getAllThreads().filter(t => t.stopped);
			if (bestScore < Score.VerifiedAndFocused) {
				if (viewModel.focusedThread && threads.includes(viewModel.focusedThread)) {
					bestThread = viewModel.focusedThread;
					bestScore = Score.VerifiedAndFocused;
				}
			}

			if (bestScore < Score.VerifiedAndPausedInFile) {
				const pausedInThisFile = threads.find(t => {
					const top = t.getTopStackFrame();
					return top && this.uriIdentityService.extUri.isEqual(top.source.uri, uri);
				});

				if (pausedInThisFile) {
					bestThread = pausedInThisFile;
					bestScore = Score.VerifiedAndPausedInFile;
				}
			}

			if (bestScore < Score.Verified) {
				bestThread = threads[0];
				bestScore = Score.VerifiedAndPausedInFile;
			}
		}

		return { thread: bestThread, breakpoint };
	}
}

export function getStackFrameThreadAndSessionToFocus(model: IDebugModel, stackFrame: IStackFrame | undefined, thread?: IThread, session?: IDebugSession, avoidSession?: IDebugSession): { stackFrame: IStackFrame | undefined; thread: IThread | undefined; session: IDebugSession | undefined } {
	if (!session) {
		if (stackFrame || thread) {
			session = stackFrame ? stackFrame.thread.session : thread!.session;
		} else {
			const sessions = model.getSessions();
			const stoppedSession = sessions.find(s => s.state === State.Stopped);
			// Make sure to not focus session that is going down
			session = stoppedSession || sessions.find(s => s !== avoidSession && s !== avoidSession?.parentSession) || (sessions.length ? sessions[0] : undefined);
		}
	}

	if (!thread) {
		if (stackFrame) {
			thread = stackFrame.thread;
		} else {
			const threads = session ? session.getAllThreads() : undefined;
			const stoppedThread = threads && threads.find(t => t.stopped);
			thread = stoppedThread || (threads && threads.length ? threads[0] : undefined);
		}
	}

	if (!stackFrame && thread) {
		stackFrame = thread.getTopStackFrame();
	}

	return { session, thread, stackFrame };
}

async function sendToOneOrAllSessions(model: DebugModel, session: IDebugSession | undefined, send: (session: IDebugSession) => Promise<void>): Promise<void> {
	if (session) {
		await send(session);
	} else {
		await Promise.all(model.getSessions().map(s => send(s)));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/debugSession.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugSession.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getActiveWindow } from '../../../../base/browser/dom.js';
import * as aria from '../../../../base/browser/ui/aria/aria.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { distinct } from '../../../../base/common/arrays.js';
import { Queue, RunOnceScheduler, raceTimeout } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { canceled } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { normalizeDriveLetter } from '../../../../base/common/labels.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { Disposable, DisposableMap, DisposableStore, MutableDisposable, dispose } from '../../../../base/common/lifecycle.js';
import { mixin } from '../../../../base/common/objects.js';
import * as platform from '../../../../base/common/platform.js';
import * as resources from '../../../../base/common/resources.js';
import Severity from '../../../../base/common/severity.js';
import { isDefined } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { IPosition, Position } from '../../../../editor/common/core/position.js';
import { localize } from '../../../../nls.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { FocusMode } from '../../../../platform/native/common/native.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { ICustomEndpointTelemetryService, ITelemetryService, TelemetryLevel } from '../../../../platform/telemetry/common/telemetry.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IWorkspaceContextService, IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { ViewContainerLocation } from '../../../common/views.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { ILifecycleService } from '../../../services/lifecycle/common/lifecycle.js';
import { IPaneCompositePartService } from '../../../services/panecomposite/browser/panecomposite.js';
import { LiveTestResult } from '../../testing/common/testResult.js';
import { ITestResultService } from '../../testing/common/testResultService.js';
import { ITestService } from '../../testing/common/testService.js';
import { AdapterEndEvent, IBreakpoint, IConfig, IDataBreakpoint, IDataBreakpointInfoResponse, IDebugConfiguration, IDebugLocationReferenced, IDebugService, IDebugSession, IDebugSessionOptions, IDebugger, IExceptionBreakpoint, IExceptionInfo, IFunctionBreakpoint, IInstructionBreakpoint, IMemoryRegion, IRawModelUpdate, IRawStoppedDetails, IReplElement, IStackFrame, IThread, LoadedSourceEvent, State, VIEWLET_ID, isFrameDeemphasized } from '../common/debug.js';
import { DebugCompoundRoot } from '../common/debugCompoundRoot.js';
import { DebugModel, ExpressionContainer, MemoryRegion, Thread } from '../common/debugModel.js';
import { Source } from '../common/debugSource.js';
import { filterExceptionsFromTelemetry } from '../common/debugUtils.js';
import { INewReplElementData, ReplModel } from '../common/replModel.js';
import { RawDebugSession } from './rawDebugSession.js';

const TRIGGERED_BREAKPOINT_MAX_DELAY = 1500;

export class DebugSession implements IDebugSession {
	parentSession: IDebugSession | undefined;
	rememberedCapabilities?: DebugProtocol.Capabilities;

	private _subId: string | undefined;
	raw: RawDebugSession | undefined; // used in tests
	private initialized = false;
	private _options: IDebugSessionOptions;

	private sources = new Map<string, Source>();
	private threads = new Map<number, Thread>();
	private threadIds: number[] = [];
	private cancellationMap = new Map<number, CancellationTokenSource[]>();
	private readonly rawListeners = new DisposableStore();
	private readonly globalDisposables = new DisposableStore();
	private fetchThreadsScheduler = new Lazy(() => {
		const inst = new RunOnceScheduler(() => {
			this.fetchThreads();
		}, 100);
		this.rawListeners.add(inst);
		return inst;
	});
	private passFocusScheduler: RunOnceScheduler;
	private lastContinuedThreadId: number | undefined;
	private repl: ReplModel;
	private stoppedDetails: IRawStoppedDetails[] = [];
	private readonly statusQueue = this.rawListeners.add(new ThreadStatusScheduler());

	/** Test run this debug session was spawned by */
	public readonly correlatedTestRun?: LiveTestResult;
	/** Whether we terminated the correlated run yet. Used so a 2nd terminate request goes through to the underlying session. */
	private didTerminateTestRun?: boolean;

	private readonly _onDidChangeState = new Emitter<void>();
	private readonly _onDidEndAdapter = new Emitter<AdapterEndEvent | undefined>();

	private readonly _onDidLoadedSource = new Emitter<LoadedSourceEvent>();
	private readonly _onDidCustomEvent = new Emitter<DebugProtocol.Event>();
	private readonly _onDidProgressStart = new Emitter<DebugProtocol.ProgressStartEvent>();
	private readonly _onDidProgressUpdate = new Emitter<DebugProtocol.ProgressUpdateEvent>();
	private readonly _onDidProgressEnd = new Emitter<DebugProtocol.ProgressEndEvent>();
	private readonly _onDidInvalidMemory = new Emitter<DebugProtocol.MemoryEvent>();

	private readonly _onDidChangeREPLElements = new Emitter<IReplElement | undefined>();

	private _name: string | undefined;
	private readonly _onDidChangeName = new Emitter<string>();

	/**
	 * Promise set while enabling dependent breakpoints to block the debugger
	 * from continuing from a stopped state.
	 */
	private _waitToResume?: Promise<unknown>;

	constructor(
		private id: string,
		private _configuration: { resolved: IConfig; unresolved: IConfig | undefined },
		public root: IWorkspaceFolder | undefined,
		private model: DebugModel,
		options: IDebugSessionOptions | undefined,
		@IDebugService private readonly debugService: IDebugService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IHostService private readonly hostService: IHostService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IPaneCompositePartService private readonly paneCompositeService: IPaneCompositePartService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@IProductService private readonly productService: IProductService,
		@INotificationService private readonly notificationService: INotificationService,
		@ILifecycleService lifecycleService: ILifecycleService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ICustomEndpointTelemetryService private readonly customEndpointTelemetryService: ICustomEndpointTelemetryService,
		@IWorkbenchEnvironmentService private readonly workbenchEnvironmentService: IWorkbenchEnvironmentService,
		@ILogService private readonly logService: ILogService,
		@ITestService private readonly testService: ITestService,
		@ITestResultService testResultService: ITestResultService,
		@IAccessibilityService private readonly accessibilityService: IAccessibilityService,
	) {
		this._options = options || {};
		this.parentSession = this._options.parentSession;
		if (this.hasSeparateRepl()) {
			this.repl = new ReplModel(this.configurationService);
		} else {
			this.repl = (this.parentSession as DebugSession).repl;
		}

		const toDispose = this.globalDisposables;
		const replListener = toDispose.add(new MutableDisposable());
		replListener.value = this.repl.onDidChangeElements((e) => this._onDidChangeREPLElements.fire(e));
		if (lifecycleService) {
			toDispose.add(lifecycleService.onWillShutdown(() => {
				this.shutdown();
				dispose(toDispose);
			}));
		}

		// Cast here, it's not possible to reference a hydrated result in this code path.
		this.correlatedTestRun = options?.testRun
			? (testResultService.getResult(options.testRun.runId) as LiveTestResult)
			: this.parentSession?.correlatedTestRun;

		if (this.correlatedTestRun) {
			// Listen to the test completing because the user might have taken the cancel action rather than stopping the session.
			toDispose.add(this.correlatedTestRun.onComplete(() => this.terminate()));
		}

		const compoundRoot = this._options.compoundRoot;
		if (compoundRoot) {
			toDispose.add(compoundRoot.onDidSessionStop(() => this.terminate()));
		}
		this.passFocusScheduler = new RunOnceScheduler(() => {
			// If there is some session or thread that is stopped pass focus to it
			if (this.debugService.getModel().getSessions().some(s => s.state === State.Stopped) || this.getAllThreads().some(t => t.stopped)) {
				if (typeof this.lastContinuedThreadId === 'number') {
					const thread = this.debugService.getViewModel().focusedThread;
					if (thread && thread.threadId === this.lastContinuedThreadId && !thread.stopped) {
						const toFocusThreadId = this.getStoppedDetails()?.threadId;
						const toFocusThread = typeof toFocusThreadId === 'number' ? this.getThread(toFocusThreadId) : undefined;
						this.debugService.focusStackFrame(undefined, toFocusThread);
					}
				} else {
					const session = this.debugService.getViewModel().focusedSession;
					if (session && session.getId() === this.getId() && session.state !== State.Stopped) {
						this.debugService.focusStackFrame(undefined);
					}
				}
			}
		}, 800);

		const parent = this._options.parentSession;
		if (parent) {
			toDispose.add(parent.onDidEndAdapter(() => {
				// copy the parent repl and get a new detached repl for this child, and
				// remove its parent, if it's still running
				if (!this.hasSeparateRepl() && this.raw?.isInShutdown === false) {
					this.repl = this.repl.clone();
					replListener.value = this.repl.onDidChangeElements((e) => this._onDidChangeREPLElements.fire(e));
					this.parentSession = undefined;
				}
			}));
		}
	}

	getId(): string {
		return this.id;
	}

	setSubId(subId: string | undefined) {
		this._subId = subId;
	}

	getMemory(memoryReference: string): IMemoryRegion {
		return new MemoryRegion(memoryReference, this);
	}

	get subId(): string | undefined {
		return this._subId;
	}

	get configuration(): IConfig {
		return this._configuration.resolved;
	}

	get unresolvedConfiguration(): IConfig | undefined {
		return this._configuration.unresolved;
	}

	get lifecycleManagedByParent(): boolean {
		return !!this._options.lifecycleManagedByParent;
	}

	get compact(): boolean {
		return !!this._options.compact;
	}

	get saveBeforeRestart(): boolean {
		return this._options.saveBeforeRestart ?? !this._options?.parentSession;
	}

	get compoundRoot(): DebugCompoundRoot | undefined {
		return this._options.compoundRoot;
	}

	get suppressDebugStatusbar(): boolean {
		return this._options.suppressDebugStatusbar ?? false;
	}

	get suppressDebugToolbar(): boolean {
		return this._options.suppressDebugToolbar ?? false;
	}

	get suppressDebugView(): boolean {
		return this._options.suppressDebugView ?? false;
	}


	get autoExpandLazyVariables(): boolean {
		// This tiny helper avoids converting the entire debug model to use service injection
		const screenReaderOptimized = this.accessibilityService.isScreenReaderOptimized();
		const value = this.configurationService.getValue<IDebugConfiguration>('debug').autoExpandLazyVariables;
		return value === 'auto' && screenReaderOptimized || value === 'on';
	}

	setConfiguration(configuration: { resolved: IConfig; unresolved: IConfig | undefined }) {
		this._configuration = configuration;
	}

	getLabel(): string {
		const includeRoot = this.workspaceContextService.getWorkspace().folders.length > 1;
		return includeRoot && this.root ? `${this.name} (${resources.basenameOrAuthority(this.root.uri)})` : this.name;
	}

	setName(name: string): void {
		this._name = name;
		this._onDidChangeName.fire(name);
	}

	get name(): string {
		return this._name || this.configuration.name;
	}

	get state(): State {
		if (!this.initialized) {
			return State.Initializing;
		}
		if (!this.raw) {
			return State.Inactive;
		}

		const focusedThread = this.debugService.getViewModel().focusedThread;
		if (focusedThread && focusedThread.session === this) {
			return focusedThread.stopped ? State.Stopped : State.Running;
		}
		if (this.getAllThreads().some(t => t.stopped)) {
			return State.Stopped;
		}

		return State.Running;
	}

	get capabilities(): DebugProtocol.Capabilities {
		return this.raw ? this.raw.capabilities : Object.create(null);
	}

	//---- events
	get onDidChangeState(): Event<void> {
		return this._onDidChangeState.event;
	}

	get onDidEndAdapter(): Event<AdapterEndEvent | undefined> {
		return this._onDidEndAdapter.event;
	}

	get onDidChangeReplElements(): Event<IReplElement | undefined> {
		return this._onDidChangeREPLElements.event;
	}

	get onDidChangeName(): Event<string> {
		return this._onDidChangeName.event;
	}

	//---- DAP events

	get onDidCustomEvent(): Event<DebugProtocol.Event> {
		return this._onDidCustomEvent.event;
	}

	get onDidLoadedSource(): Event<LoadedSourceEvent> {
		return this._onDidLoadedSource.event;
	}

	get onDidProgressStart(): Event<DebugProtocol.ProgressStartEvent> {
		return this._onDidProgressStart.event;
	}

	get onDidProgressUpdate(): Event<DebugProtocol.ProgressUpdateEvent> {
		return this._onDidProgressUpdate.event;
	}

	get onDidProgressEnd(): Event<DebugProtocol.ProgressEndEvent> {
		return this._onDidProgressEnd.event;
	}

	get onDidInvalidateMemory(): Event<DebugProtocol.MemoryEvent> {
		return this._onDidInvalidMemory.event;
	}

	//---- DAP requests

	/**
	 * create and initialize a new debug adapter for this session
	 */
	async initialize(dbgr: IDebugger): Promise<void> {

		if (this.raw) {
			// if there was already a connection make sure to remove old listeners
			await this.shutdown();
		}

		try {
			const debugAdapter = await dbgr.createDebugAdapter(this);
			this.raw = this.instantiationService.createInstance(RawDebugSession, debugAdapter, dbgr, this.id, this.configuration.name);

			await this.raw.start();
			this.registerListeners();
			await this.raw.initialize({
				clientID: 'vscode',
				clientName: this.productService.nameLong,
				adapterID: this.configuration.type,
				pathFormat: 'path',
				linesStartAt1: true,
				columnsStartAt1: true,
				supportsVariableType: true, // #8858
				supportsVariablePaging: true, // #9537
				supportsRunInTerminalRequest: true, // #10574
				locale: platform.language, // #169114
				supportsProgressReporting: true, // #92253
				supportsInvalidatedEvent: true, // #106745
				supportsMemoryReferences: true, //#129684
				supportsArgsCanBeInterpretedByShell: true, // #149910
				supportsMemoryEvent: true, // #133643
				supportsStartDebuggingRequest: true,
				supportsANSIStyling: true,
			});

			this.initialized = true;
			this._onDidChangeState.fire();
			this.rememberedCapabilities = this.raw.capabilities;
			this.debugService.setExceptionBreakpointsForSession(this, (this.raw && this.raw.capabilities.exceptionBreakpointFilters) || []);
			this.debugService.getModel().registerBreakpointModes(this.configuration.type, this.raw.capabilities.breakpointModes || []);
		} catch (err) {
			this.initialized = true;
			this._onDidChangeState.fire();
			await this.shutdown();
			throw err;
		}
	}

	/**
	 * launch or attach to the debuggee
	 */
	async launchOrAttach(config: IConfig): Promise<void> {
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'launch or attach'));
		}
		if (this.parentSession && this.parentSession.state === State.Inactive) {
			throw canceled();
		}

		// __sessionID only used for EH debugging (but we add it always for now...)
		config.__sessionId = this.getId();
		try {
			await this.raw.launchOrAttach(config);
		} catch (err) {
			this.shutdown();
			throw err;
		}
	}

	/**
	 * Terminate any linked test run.
	 */
	cancelCorrelatedTestRun() {
		if (this.correlatedTestRun && !this.correlatedTestRun.completedAt) {
			this.didTerminateTestRun = true;
			this.testService.cancelTestRun(this.correlatedTestRun.id);
		}
	}

	/**
	 * terminate the current debug adapter session
	 */
	async terminate(restart = false): Promise<void> {
		if (!this.raw) {
			// Adapter went down but it did not send a 'terminated' event, simulate like the event has been sent
			this.onDidExitAdapter();
		}

		this.cancelAllRequests();
		if (this._options.lifecycleManagedByParent && this.parentSession) {
			await this.parentSession.terminate(restart);
		} else if (this.correlatedTestRun && !this.correlatedTestRun.completedAt && !this.didTerminateTestRun) {
			this.cancelCorrelatedTestRun();
		} else if (this.raw) {
			if (this.raw.capabilities.supportsTerminateRequest && this._configuration.resolved.request === 'launch') {
				await this.raw.terminate(restart);
			} else {
				await this.raw.disconnect({ restart, terminateDebuggee: true });
			}
		}

		if (!restart) {
			this._options.compoundRoot?.sessionStopped();
		}
	}

	/**
	 * end the current debug adapter session
	 */
	async disconnect(restart = false, suspend = false): Promise<void> {
		if (!this.raw) {
			// Adapter went down but it did not send a 'terminated' event, simulate like the event has been sent
			this.onDidExitAdapter();
		}

		this.cancelAllRequests();
		if (this._options.lifecycleManagedByParent && this.parentSession) {
			await this.parentSession.disconnect(restart, suspend);
		} else if (this.raw) {
			// TODO terminateDebuggee should be undefined by default?
			await this.raw.disconnect({ restart, terminateDebuggee: false, suspendDebuggee: suspend });
		}

		if (!restart) {
			this._options.compoundRoot?.sessionStopped();
		}
	}

	/**
	 * restart debug adapter session
	 */
	async restart(): Promise<void> {
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'restart'));
		}

		this.cancelAllRequests();
		if (this._options.lifecycleManagedByParent && this.parentSession) {
			await this.parentSession.restart();
		} else {
			await this.raw.restart({ arguments: this.configuration });
		}
	}

	async sendBreakpoints(modelUri: URI, breakpointsToSend: IBreakpoint[], sourceModified: boolean): Promise<void> {
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'breakpoints'));
		}

		if (!this.raw.readyForBreakpoints) {
			return Promise.resolve(undefined);
		}

		const rawSource = this.getRawSource(modelUri);
		if (breakpointsToSend.length && !rawSource.adapterData) {
			rawSource.adapterData = breakpointsToSend[0].adapterData;
		}
		// Normalize all drive letters going out from vscode to debug adapters so we are consistent with our resolving #43959
		if (rawSource.path) {
			rawSource.path = normalizeDriveLetter(rawSource.path);
		}

		const response = await this.raw.setBreakpoints({
			source: rawSource,
			lines: breakpointsToSend.map(bp => bp.sessionAgnosticData.lineNumber),
			breakpoints: breakpointsToSend.map(bp => bp.toDAP()),
			sourceModified
		});
		if (response?.body) {
			const data = new Map<string, DebugProtocol.Breakpoint>();
			for (let i = 0; i < breakpointsToSend.length; i++) {
				data.set(breakpointsToSend[i].getId(), response.body.breakpoints[i]);
			}

			this.model.setBreakpointSessionData(this.getId(), this.capabilities, data);
		}
	}

	async sendFunctionBreakpoints(fbpts: IFunctionBreakpoint[]): Promise<void> {
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'function breakpoints'));
		}

		if (this.raw.readyForBreakpoints) {
			const response = await this.raw.setFunctionBreakpoints({ breakpoints: fbpts.map(bp => bp.toDAP()) });
			if (response?.body) {
				const data = new Map<string, DebugProtocol.Breakpoint>();
				for (let i = 0; i < fbpts.length; i++) {
					data.set(fbpts[i].getId(), response.body.breakpoints[i]);
				}
				this.model.setBreakpointSessionData(this.getId(), this.capabilities, data);
			}
		}
	}

	async sendExceptionBreakpoints(exbpts: IExceptionBreakpoint[]): Promise<void> {
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'exception breakpoints'));
		}

		if (this.raw.readyForBreakpoints) {
			const args: DebugProtocol.SetExceptionBreakpointsArguments = this.capabilities.supportsExceptionFilterOptions ? {
				filters: [],
				filterOptions: exbpts.map(exb => {
					if (exb.condition) {
						return { filterId: exb.filter, condition: exb.condition };
					}

					return { filterId: exb.filter };
				})
			} : { filters: exbpts.map(exb => exb.filter) };

			const response = await this.raw.setExceptionBreakpoints(args);
			if (response?.body && response.body.breakpoints) {
				const data = new Map<string, DebugProtocol.Breakpoint>();
				for (let i = 0; i < exbpts.length; i++) {
					data.set(exbpts[i].getId(), response.body.breakpoints[i]);
				}

				this.model.setBreakpointSessionData(this.getId(), this.capabilities, data);
			}
		}
	}

	dataBytesBreakpointInfo(address: string, bytes: number): Promise<IDataBreakpointInfoResponse | undefined> {
		if (this.raw?.capabilities.supportsDataBreakpointBytes === false) {
			throw new Error(localize('sessionDoesNotSupporBytesBreakpoints', "Session does not support breakpoints with bytes"));
		}

		return this._dataBreakpointInfo({ name: address, bytes, asAddress: true });
	}

	dataBreakpointInfo(name: string, variablesReference?: number, frameId?: number): Promise<{ dataId: string | null; description: string; canPersist?: boolean } | undefined> {
		return this._dataBreakpointInfo({ name, variablesReference, frameId });
	}

	private async _dataBreakpointInfo(args: DebugProtocol.DataBreakpointInfoArguments): Promise<{ dataId: string | null; description: string; canPersist?: boolean } | undefined> {
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'data breakpoints info'));
		}
		if (!this.raw.readyForBreakpoints) {
			throw new Error(localize('sessionNotReadyForBreakpoints', "Session is not ready for breakpoints"));
		}

		const response = await this.raw.dataBreakpointInfo(args);
		return response?.body;
	}

	async sendDataBreakpoints(dataBreakpoints: IDataBreakpoint[]): Promise<void> {
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'data breakpoints'));
		}

		if (this.raw.readyForBreakpoints) {
			const converted = await Promise.all(dataBreakpoints.map(async bp => {
				try {
					const dap = await bp.toDAP(this);
					return { dap, bp };
				} catch (e) {
					return { bp, message: e.message };
				}
			}));
			const response = await this.raw.setDataBreakpoints({ breakpoints: converted.map(d => d.dap).filter(isDefined) });
			if (response?.body) {
				const data = new Map<string, DebugProtocol.Breakpoint>();
				let i = 0;
				for (const dap of converted) {
					if (!dap.dap) {
						data.set(dap.bp.getId(), dap.message);
					} else if (i < response.body.breakpoints.length) {
						data.set(dap.bp.getId(), response.body.breakpoints[i++]);
					}
				}
				this.model.setBreakpointSessionData(this.getId(), this.capabilities, data);
			}
		}
	}

	async sendInstructionBreakpoints(instructionBreakpoints: IInstructionBreakpoint[]): Promise<void> {
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'instruction breakpoints'));
		}

		if (this.raw.readyForBreakpoints) {
			const response = await this.raw.setInstructionBreakpoints({ breakpoints: instructionBreakpoints.map(ib => ib.toDAP()) });
			if (response?.body) {
				const data = new Map<string, DebugProtocol.Breakpoint>();
				for (let i = 0; i < instructionBreakpoints.length; i++) {
					data.set(instructionBreakpoints[i].getId(), response.body.breakpoints[i]);
				}
				this.model.setBreakpointSessionData(this.getId(), this.capabilities, data);
			}
		}
	}

	async breakpointsLocations(uri: URI, lineNumber: number): Promise<IPosition[]> {
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'breakpoints locations'));
		}

		const source = this.getRawSource(uri);
		const response = await this.raw.breakpointLocations({ source, line: lineNumber });
		if (!response || !response.body || !response.body.breakpoints) {
			return [];
		}

		const positions = response.body.breakpoints.map(bp => ({ lineNumber: bp.line, column: bp.column || 1 }));

		return distinct(positions, p => `${p.lineNumber}:${p.column}`);
	}

	getDebugProtocolBreakpoint(breakpointId: string): DebugProtocol.Breakpoint | undefined {
		return this.model.getDebugProtocolBreakpoint(breakpointId, this.getId());
	}

	customRequest(request: string, args: any): Promise<DebugProtocol.Response | undefined> {
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", request));
		}

		return this.raw.custom(request, args);
	}

	stackTrace(threadId: number, startFrame: number, levels: number, token: CancellationToken): Promise<DebugProtocol.StackTraceResponse | undefined> {
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'stackTrace'));
		}

		const sessionToken = this.getNewCancellationToken(threadId, token);
		return this.raw.stackTrace({ threadId, startFrame, levels }, sessionToken);
	}

	async exceptionInfo(threadId: number): Promise<IExceptionInfo | undefined> {
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'exceptionInfo'));
		}

		const response = await this.raw.exceptionInfo({ threadId });
		if (response) {
			return {
				id: response.body.exceptionId,
				description: response.body.description,
				breakMode: response.body.breakMode,
				details: response.body.details
			};
		}

		return undefined;
	}

	scopes(frameId: number, threadId: number): Promise<DebugProtocol.ScopesResponse | undefined> {
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'scopes'));
		}

		const token = this.getNewCancellationToken(threadId);
		return this.raw.scopes({ frameId }, token);
	}

	variables(variablesReference: number, threadId: number | undefined, filter: 'indexed' | 'named' | undefined, start: number | undefined, count: number | undefined): Promise<DebugProtocol.VariablesResponse | undefined> {
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'variables'));
		}

		const token = threadId ? this.getNewCancellationToken(threadId) : undefined;
		return this.raw.variables({ variablesReference, filter, start, count }, token);
	}

	evaluate(expression: string, frameId: number, context?: string, location?: { line: number; column: number; source: DebugProtocol.Source }): Promise<DebugProtocol.EvaluateResponse | undefined> {
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'evaluate'));
		}

		return this.raw.evaluate({ expression, frameId, context, line: location?.line, column: location?.column, source: location?.source });
	}

	async restartFrame(frameId: number, threadId: number): Promise<void> {
		await this.waitForTriggeredBreakpoints();
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'restartFrame'));
		}

		await this.raw.restartFrame({ frameId }, threadId);
	}

	private setLastSteppingGranularity(threadId: number, granularity?: DebugProtocol.SteppingGranularity) {
		const thread = this.getThread(threadId);
		if (thread) {
			thread.lastSteppingGranularity = granularity;
		}
	}

	async next(threadId: number, granularity?: DebugProtocol.SteppingGranularity): Promise<void> {
		await this.waitForTriggeredBreakpoints();
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'next'));
		}

		this.setLastSteppingGranularity(threadId, granularity);
		await this.raw.next({ threadId, granularity });
	}

	async stepIn(threadId: number, targetId?: number, granularity?: DebugProtocol.SteppingGranularity): Promise<void> {
		await this.waitForTriggeredBreakpoints();
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'stepIn'));
		}

		this.setLastSteppingGranularity(threadId, granularity);
		await this.raw.stepIn({ threadId, targetId, granularity });
	}

	async stepOut(threadId: number, granularity?: DebugProtocol.SteppingGranularity): Promise<void> {
		await this.waitForTriggeredBreakpoints();
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'stepOut'));
		}

		this.setLastSteppingGranularity(threadId, granularity);
		await this.raw.stepOut({ threadId, granularity });
	}

	async stepBack(threadId: number, granularity?: DebugProtocol.SteppingGranularity): Promise<void> {
		await this.waitForTriggeredBreakpoints();
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'stepBack'));
		}

		this.setLastSteppingGranularity(threadId, granularity);
		await this.raw.stepBack({ threadId, granularity });
	}

	async continue(threadId: number): Promise<void> {
		await this.waitForTriggeredBreakpoints();
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'continue'));
		}

		await this.raw.continue({ threadId });
	}

	async reverseContinue(threadId: number): Promise<void> {
		await this.waitForTriggeredBreakpoints();
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'reverse continue'));
		}

		await this.raw.reverseContinue({ threadId });
	}

	async pause(threadId: number): Promise<void> {
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'pause'));
		}

		await this.raw.pause({ threadId });
	}

	async terminateThreads(threadIds?: number[]): Promise<void> {
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'terminateThreads'));
		}

		await this.raw.terminateThreads({ threadIds });
	}

	setVariable(variablesReference: number, name: string, value: string): Promise<DebugProtocol.SetVariableResponse | undefined> {
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'setVariable'));
		}

		return this.raw.setVariable({ variablesReference, name, value });
	}

	setExpression(frameId: number, expression: string, value: string): Promise<DebugProtocol.SetExpressionResponse | undefined> {
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'setExpression'));
		}

		return this.raw.setExpression({ expression, value, frameId });
	}

	gotoTargets(source: DebugProtocol.Source, line: number, column?: number): Promise<DebugProtocol.GotoTargetsResponse | undefined> {
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'gotoTargets'));
		}

		return this.raw.gotoTargets({ source, line, column });
	}

	goto(threadId: number, targetId: number): Promise<DebugProtocol.GotoResponse | undefined> {
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'goto'));
		}

		return this.raw.goto({ threadId, targetId });
	}

	loadSource(resource: URI): Promise<DebugProtocol.SourceResponse | undefined> {
		if (!this.raw) {
			return Promise.reject(new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'loadSource')));
		}

		const source = this.getSourceForUri(resource);
		let rawSource: DebugProtocol.Source;
		if (source) {
			rawSource = source.raw;
		} else {
			// create a Source
			const data = Source.getEncodedDebugData(resource);
			rawSource = { path: data.path, sourceReference: data.sourceReference };
		}

		return this.raw.source({ sourceReference: rawSource.sourceReference || 0, source: rawSource });
	}

	async getLoadedSources(): Promise<Source[]> {
		if (!this.raw) {
			return Promise.reject(new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'getLoadedSources')));
		}

		const response = await this.raw.loadedSources({});
		if (response?.body && response.body.sources) {
			return response.body.sources.map(src => this.getSource(src));
		} else {
			return [];
		}
	}

	async completions(frameId: number | undefined, threadId: number, text: string, position: Position, token: CancellationToken): Promise<DebugProtocol.CompletionsResponse | undefined> {
		if (!this.raw) {
			return Promise.reject(new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'completions')));
		}
		const sessionCancelationToken = this.getNewCancellationToken(threadId, token);

		return this.raw.completions({
			frameId,
			text,
			column: position.column,
			line: position.lineNumber,
		}, sessionCancelationToken);
	}

	async stepInTargets(frameId: number): Promise<{ id: number; label: string }[] | undefined> {
		if (!this.raw) {
			return Promise.reject(new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'stepInTargets')));
		}

		const response = await this.raw.stepInTargets({ frameId });
		return response?.body.targets;
	}

	async cancel(progressId: string): Promise<DebugProtocol.CancelResponse | undefined> {
		if (!this.raw) {
			return Promise.reject(new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'cancel')));
		}

		return this.raw.cancel({ progressId });
	}

	async disassemble(memoryReference: string, offset: number, instructionOffset: number, instructionCount: number): Promise<DebugProtocol.DisassembledInstruction[] | undefined> {
		if (!this.raw) {
			return Promise.reject(new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'disassemble')));
		}

		const response = await this.raw.disassemble({ memoryReference, offset, instructionOffset, instructionCount, resolveSymbols: true });
		return response?.body?.instructions;
	}

	readMemory(memoryReference: string, offset: number, count: number): Promise<DebugProtocol.ReadMemoryResponse | undefined> {
		if (!this.raw) {
			return Promise.reject(new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'readMemory')));
		}

		return this.raw.readMemory({ count, memoryReference, offset });
	}

	writeMemory(memoryReference: string, offset: number, data: string, allowPartial?: boolean): Promise<DebugProtocol.WriteMemoryResponse | undefined> {
		if (!this.raw) {
			return Promise.reject(new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'disassemble')));
		}

		return this.raw.writeMemory({ memoryReference, offset, allowPartial, data });
	}

	async resolveLocationReference(locationReference: number): Promise<IDebugLocationReferenced> {
		if (!this.raw) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'locations'));
		}

		const location = await this.raw.locations({ locationReference });
		if (!location?.body) {
			throw new Error(localize('noDebugAdapter', "No debugger available, can not send '{0}'", 'locations'));
		}

		const source = this.getSource(location.body.source);
		return { column: 1, ...location.body, source };
	}

	//---- threads

	getThread(threadId: number): Thread | undefined {
		return this.threads.get(threadId);
	}

	getAllThreads(): IThread[] {
		const result: IThread[] = [];
		this.threadIds.forEach((threadId) => {
			const thread = this.threads.get(threadId);
			if (thread) {
				result.push(thread);
			}
		});
		return result;
	}

	clearThreads(removeThreads: boolean, reference: number | undefined = undefined): void {
		if (reference !== undefined && reference !== null) {
			const thread = this.threads.get(reference);
			if (thread) {
				thread.clearCallStack();
				thread.stoppedDetails = undefined;
				thread.stopped = false;

				if (removeThreads) {
					this.threads.delete(reference);
				}
			}
		} else {
			this.threads.forEach(thread => {
				thread.clearCallStack();
				thread.stoppedDetails = undefined;
				thread.stopped = false;
			});

			if (removeThreads) {
				this.threads.clear();
				this.threadIds = [];
				ExpressionContainer.allValues.clear();
			}
		}
	}

	getStoppedDetails(): IRawStoppedDetails | undefined {
		return this.stoppedDetails.length >= 1 ? this.stoppedDetails[0] : undefined;
	}

	rawUpdate(data: IRawModelUpdate): void {
		this.threadIds = [];
		data.threads.forEach(thread => {
			this.threadIds.push(thread.id);
			if (!this.threads.has(thread.id)) {
				// A new thread came in, initialize it.
				this.threads.set(thread.id, new Thread(this, thread.name, thread.id));
			} else if (thread.name) {
				// Just the thread name got updated #18244
				const oldThread = this.threads.get(thread.id);
				if (oldThread) {
					oldThread.name = thread.name;
				}
			}
		});
		this.threads.forEach(t => {
			// Remove all old threads which are no longer part of the update #75980
			if (this.threadIds.indexOf(t.threadId) === -1) {
				this.threads.delete(t.threadId);
			}
		});

		const stoppedDetails = data.stoppedDetails;
		if (stoppedDetails) {
			// Set the availability of the threads' callstacks depending on
			// whether the thread is stopped or not
			if (stoppedDetails.allThreadsStopped) {
				this.threads.forEach(thread => {
					thread.stoppedDetails = thread.threadId === stoppedDetails.threadId ? stoppedDetails : { reason: thread.stoppedDetails?.reason };
					thread.stopped = true;
					thread.clearCallStack();
				});
			} else {
				const thread = typeof stoppedDetails.threadId === 'number' ? this.threads.get(stoppedDetails.threadId) : undefined;
				if (thread) {
					// One thread is stopped, only update that thread.
					thread.stoppedDetails = stoppedDetails;
					thread.clearCallStack();
					thread.stopped = true;
				}
			}
		}
	}

	private waitForTriggeredBreakpoints() {
		if (!this._waitToResume) {
			return;
		}

		return raceTimeout(
			this._waitToResume,
			TRIGGERED_BREAKPOINT_MAX_DELAY
		);
	}

	private async fetchThreads(stoppedDetails?: IRawStoppedDetails): Promise<void> {
		if (this.raw) {
			const response = await this.raw.threads();
			if (response?.body && response.body.threads) {
				this.model.rawUpdate({
					sessionId: this.getId(),
					threads: response.body.threads,
					stoppedDetails
				});
			}
		}
	}

	initializeForTest(raw: RawDebugSession): void {
		this.raw = raw;
		this.registerListeners();
	}

	//---- private

	private registerListeners(): void {
		if (!this.raw) {
			return;
		}

		this.rawListeners.add(this.raw.onDidInitialize(async () => {
			aria.status(
				this.configuration.noDebug
					? localize('debuggingStartedNoDebug', "Started running without debugging.")
					: localize('debuggingStarted', "Debugging started.")
			);

			const sendConfigurationDone = async () => {
				if (this.raw && this.raw.capabilities.supportsConfigurationDoneRequest) {
					try {
						await this.raw.configurationDone();
					} catch (e) {
						// Disconnect the debug session on configuration done error #10596
						this.notificationService.error(e);
						this.raw?.disconnect({});
					}
				}

				return undefined;
			};

			// Send all breakpoints
			try {
				await this.debugService.sendAllBreakpoints(this);
			} finally {
				await sendConfigurationDone();
				await this.fetchThreads();
			}
		}));


		const statusQueue = this.statusQueue;
		this.rawListeners.add(this.raw.onDidStop(event => this.handleStop(event.body)));

		this.rawListeners.add(this.raw.onDidThread(event => {
			statusQueue.cancel([event.body.threadId]);
			if (event.body.reason === 'started') {
				if (!this.fetchThreadsScheduler.value.isScheduled()) {
					this.fetchThreadsScheduler.value.schedule();
				}
			} else if (event.body.reason === 'exited') {
				this.model.clearThreads(this.getId(), true, event.body.threadId);
				const viewModel = this.debugService.getViewModel();
				const focusedThread = viewModel.focusedThread;
				this.passFocusScheduler.cancel();
				if (focusedThread && event.body.threadId === focusedThread.threadId) {
					// De-focus the thread in case it was focused
					this.debugService.focusStackFrame(undefined, undefined, viewModel.focusedSession, { explicit: false });
				}
			}
		}));

		this.rawListeners.add(this.raw.onDidTerminateDebugee(async event => {
			aria.status(localize('debuggingStopped', "Debugging stopped."));
			if (event.body && event.body.restart) {
				await this.debugService.restartSession(this, event.body.restart);
			} else if (this.raw) {
				await this.raw.disconnect({ terminateDebuggee: false });
			}
		}));

		this.rawListeners.add(this.raw.onDidContinued(async event => {
			const allThreads = event.body.allThreadsContinued !== false;

			let affectedThreads: number[] | Promise<number[]>;
			if (!allThreads) {
				affectedThreads = [event.body.threadId];
				if (this.threadIds.includes(event.body.threadId)) {
					affectedThreads = [event.body.threadId];
				} else {
					this.fetchThreadsScheduler.rawValue?.cancel();
					affectedThreads = this.fetchThreads().then(() => [event.body.threadId]);
				}
			} else if (this.fetchThreadsScheduler.value.isScheduled()) {
				this.fetchThreadsScheduler.value.cancel();
				affectedThreads = this.fetchThreads().then(() => this.threadIds);
			} else {
				affectedThreads = this.threadIds;
			}

			statusQueue.cancel(allThreads ? undefined : [event.body.threadId]);
			await statusQueue.run(affectedThreads, threadId => {
				this.stoppedDetails = this.stoppedDetails.filter(sd => sd.threadId !== threadId);
				const tokens = this.cancellationMap.get(threadId);
				this.cancellationMap.delete(threadId);
				tokens?.forEach(t => t.dispose(true));
				this.model.clearThreads(this.getId(), false, threadId);
				return Promise.resolve();
			});

			// We need to pass focus to other sessions / threads with a timeout in case a quick stop event occurs #130321
			this.lastContinuedThreadId = allThreads ? undefined : event.body.threadId;
			this.passFocusScheduler.schedule();
			this._onDidChangeState.fire();
		}));

		const outputQueue = new Queue<void>();
		this.rawListeners.add(this.raw.onDidOutput(async event => {
			const outputSeverity = event.body.category === 'stderr' ? Severity.Error : event.body.category === 'console' ? Severity.Warning : Severity.Info;

			// When a variables event is received, execute immediately to obtain the variables value #126967
			if (event.body.variablesReference) {
				const source = event.body.source && event.body.line ? {
					lineNumber: event.body.line,
					column: event.body.column ? event.body.column : 1,
					source: this.getSource(event.body.source)
				} : undefined;
				const container = new ExpressionContainer(this, undefined, event.body.variablesReference, generateUuid());
				const children = container.getChildren();
				// we should put appendToRepl into queue to make sure the logs to be displayed in correct order
				// see https://github.com/microsoft/vscode/issues/126967#issuecomment-874954269
				outputQueue.queue(async () => {
					const resolved = await children;
					// For single logged variables, try to use the output if we can so
					// present a better (i.e. ANSI-aware) representation of the output
					if (resolved.length === 1) {
						this.appendToRepl({ output: event.body.output, expression: resolved[0], sev: outputSeverity, source }, event.body.category === 'important');
						return;
					}

					resolved.forEach((child) => {
						// Since we can not display multiple trees in a row, we are displaying these variables one after the other (ignoring their names)
						// eslint-disable-next-line local/code-no-any-casts
						(<any>child).name = null;
						this.appendToRepl({ output: '', expression: child, sev: outputSeverity, source }, event.body.category === 'important');
					});
				});
				return;
			}
			outputQueue.queue(async () => {
				if (!event.body || !this.raw) {
					return;
				}

				if (event.body.category === 'telemetry') {
					// only log telemetry events from debug adapter if the debug extension provided the telemetry key
					// and the user opted in telemetry
					const telemetryEndpoint = this.raw.dbgr.getCustomTelemetryEndpoint();
					if (telemetryEndpoint && this.telemetryService.telemetryLevel !== TelemetryLevel.NONE) {
						// __GDPR__TODO__ We're sending events in the name of the debug extension and we can not ensure that those are declared correctly.
						let data = event.body.data;
						if (!telemetryEndpoint.sendErrorTelemetry && event.body.data) {
							data = filterExceptionsFromTelemetry(event.body.data);
						}

						this.customEndpointTelemetryService.publicLog(telemetryEndpoint, event.body.output, data);
					}

					return;
				}

				// Make sure to append output in the correct order by properly waiting on preivous promises #33822
				const source = event.body.source && event.body.line ? {
					lineNumber: event.body.line,
					column: event.body.column ? event.body.column : 1,
					source: this.getSource(event.body.source)
				} : undefined;

				if (event.body.group === 'start' || event.body.group === 'startCollapsed') {
					const expanded = event.body.group === 'start';
					this.repl.startGroup(this, event.body.output || '', expanded, source);
					return;
				}
				if (event.body.group === 'end') {
					this.repl.endGroup();
					if (!event.body.output) {
						// Only return if the end event does not have additional output in it
						return;
					}
				}

				if (typeof event.body.output === 'string') {
					this.appendToRepl({ output: event.body.output, sev: outputSeverity, source }, event.body.category === 'important');
				}
			});
		}));

		this.rawListeners.add(this.raw.onDidBreakpoint(event => {
			const id = event.body && event.body.breakpoint ? event.body.breakpoint.id : undefined;
			const breakpoint = this.model.getBreakpoints().find(bp => bp.getIdFromAdapter(this.getId()) === id);
			const functionBreakpoint = this.model.getFunctionBreakpoints().find(bp => bp.getIdFromAdapter(this.getId()) === id);
			const dataBreakpoint = this.model.getDataBreakpoints().find(dbp => dbp.getIdFromAdapter(this.getId()) === id);
			const exceptionBreakpoint = this.model.getExceptionBreakpoints().find(excbp => excbp.getIdFromAdapter(this.getId()) === id);

			if (event.body.reason === 'new' && event.body.breakpoint.source && event.body.breakpoint.line) {
				const source = this.getSource(event.body.breakpoint.source);
				const bps = this.model.addBreakpoints(source.uri, [{
					column: event.body.breakpoint.column,
					enabled: true,
					lineNumber: event.body.breakpoint.line,
				}], false);
				if (bps.length === 1) {
					const data = new Map<string, DebugProtocol.Breakpoint>([[bps[0].getId(), event.body.breakpoint]]);
					this.model.setBreakpointSessionData(this.getId(), this.capabilities, data);
				}
			}

			if (event.body.reason === 'removed') {
				if (breakpoint) {
					this.model.removeBreakpoints([breakpoint]);
				}
				if (functionBreakpoint) {
					this.model.removeFunctionBreakpoints(functionBreakpoint.getId());
				}
				if (dataBreakpoint) {
					this.model.removeDataBreakpoints(dataBreakpoint.getId());
				}
			}

			if (event.body.reason === 'changed') {
				if (breakpoint) {
					if (!breakpoint.column) {
						event.body.breakpoint.column = undefined;
					}
					const data = new Map<string, DebugProtocol.Breakpoint>([[breakpoint.getId(), event.body.breakpoint]]);
					this.model.setBreakpointSessionData(this.getId(), this.capabilities, data);
				}
				if (functionBreakpoint) {
					const data = new Map<string, DebugProtocol.Breakpoint>([[functionBreakpoint.getId(), event.body.breakpoint]]);
					this.model.setBreakpointSessionData(this.getId(), this.capabilities, data);
				}
				if (dataBreakpoint) {
					const data = new Map<string, DebugProtocol.Breakpoint>([[dataBreakpoint.getId(), event.body.breakpoint]]);
					this.model.setBreakpointSessionData(this.getId(), this.capabilities, data);
				}
				if (exceptionBreakpoint) {
					const data = new Map<string, DebugProtocol.Breakpoint>([[exceptionBreakpoint.getId(), event.body.breakpoint]]);
					this.model.setBreakpointSessionData(this.getId(), this.capabilities, data);
				}
			}
		}));

		this.rawListeners.add(this.raw.onDidLoadedSource(event => {
			this._onDidLoadedSource.fire({
				reason: event.body.reason,
				source: this.getSource(event.body.source)
			});
		}));

		this.rawListeners.add(this.raw.onDidCustomEvent(event => {
			this._onDidCustomEvent.fire(event);
		}));

		this.rawListeners.add(this.raw.onDidProgressStart(event => {
			this._onDidProgressStart.fire(event);
		}));
		this.rawListeners.add(this.raw.onDidProgressUpdate(event => {
			this._onDidProgressUpdate.fire(event);
		}));
		this.rawListeners.add(this.raw.onDidProgressEnd(event => {
			this._onDidProgressEnd.fire(event);
		}));
		this.rawListeners.add(this.raw.onDidInvalidateMemory(event => {
			this._onDidInvalidMemory.fire(event);
		}));
		this.rawListeners.add(this.raw.onDidInvalidated(async event => {
			const areas = event.body.areas || ['all'];
			// If invalidated event only requires to update variables or watch, do that, otherwise refetch threads https://github.com/microsoft/vscode/issues/106745
			if (areas.includes('threads') || areas.includes('stacks') || areas.includes('all')) {
				this.cancelAllRequests();
				this.model.clearThreads(this.getId(), true);

				const details = this.stoppedDetails.slice();
				this.stoppedDetails.length = 0;
				if (details.length) {
					await Promise.all(details.map(d => this.handleStop(d)));
				} else if (!this.fetchThreadsScheduler.value.isScheduled()) {
					// threads are fetched as a side-effect of processing the stopped
					// event(s), but if there are none, schedule a thread update manually (#282777)
					this.fetchThreadsScheduler.value.schedule();
				}
			}

			const viewModel = this.debugService.getViewModel();
			if (viewModel.focusedSession === this) {
				viewModel.updateViews();
			}
		}));

		this.rawListeners.add(this.raw.onDidExitAdapter(event => this.onDidExitAdapter(event)));
	}

	private async handleStop(event: IRawStoppedDetails) {
		this.passFocusScheduler.cancel();
		this.stoppedDetails.push(event);

		// do this very eagerly if we have hitBreakpointIds, since it may take a
		// moment for breakpoints to set and we want to do our best to not miss
		// anything
		if (event.hitBreakpointIds) {
			this._waitToResume = this.enableDependentBreakpoints(event.hitBreakpointIds);
		}

		this.statusQueue.run(
			this.fetchThreads(event).then(() => event.threadId === undefined ? this.threadIds : [event.threadId]),
			async (threadId, token) => {
				const hasLotsOfThreads = event.threadId === undefined && this.threadIds.length > 10;

				// If the focus for the current session is on a non-existent thread, clear the focus.
				const focusedThread = this.debugService.getViewModel().focusedThread;
				const focusedThreadDoesNotExist = focusedThread !== undefined && focusedThread.session === this && !this.threads.has(focusedThread.threadId);
				if (focusedThreadDoesNotExist) {
					this.debugService.focusStackFrame(undefined, undefined);
				}

				const thread = typeof threadId === 'number' ? this.getThread(threadId) : undefined;
				if (thread) {
					// Call fetch call stack twice, the first only return the top stack frame.
					// Second retrieves the rest of the call stack. For performance reasons #25605
					// Second call is only done if there's few threads that stopped in this event.
					const promises = this.model.refreshTopOfCallstack(<Thread>thread, /* fetchFullStack= */!hasLotsOfThreads);
					const focus = async () => {
						if (focusedThreadDoesNotExist || (!event.preserveFocusHint && thread.getCallStack().length)) {
							const focusedStackFrame = this.debugService.getViewModel().focusedStackFrame;
							if (!focusedStackFrame || focusedStackFrame.thread.session === this) {
								// Only take focus if nothing is focused, or if the focus is already on the current session
								const preserveFocus = !this.configurationService.getValue<IDebugConfiguration>('debug').focusEditorOnBreak;
								await this.debugService.focusStackFrame(undefined, thread, undefined, { preserveFocus });
							}

							if (thread.stoppedDetails && !token.isCancellationRequested) {
								if (thread.stoppedDetails.reason === 'breakpoint' && this.configurationService.getValue<IDebugConfiguration>('debug').openDebug === 'openOnDebugBreak' && !this.suppressDebugView) {
									await this.paneCompositeService.openPaneComposite(VIEWLET_ID, ViewContainerLocation.Sidebar);
								}

								if (this.configurationService.getValue<IDebugConfiguration>('debug').focusWindowOnBreak && !this.workbenchEnvironmentService.extensionTestsLocationURI) {
									const activeWindow = getActiveWindow();
									if (!activeWindow.document.hasFocus()) {
										await this.hostService.focus(mainWindow, { mode: FocusMode.Force /* Application may not be active */ });
									}
								}
							}
						}
					};

					await promises.topCallStack;

					if (!event.hitBreakpointIds) { // if hitBreakpointIds are present, this is handled earlier on
						this._waitToResume = this.enableDependentBreakpoints(thread);
					}

					if (token.isCancellationRequested) {
						return;
					}

					focus();

					await promises.wholeCallStack;
					if (token.isCancellationRequested) {
						return;
					}

					const focusedStackFrame = this.debugService.getViewModel().focusedStackFrame;
					if (!focusedStackFrame || isFrameDeemphasized(focusedStackFrame)) {
						// The top stack frame can be deemphesized so try to focus again #68616
						focus();
					}
				}
				this._onDidChangeState.fire();
			},
		);
	}

	private async enableDependentBreakpoints(hitBreakpointIdsOrThread: Thread | number[]) {
		let breakpoints: IBreakpoint[];
		if (Array.isArray(hitBreakpointIdsOrThread)) {
			breakpoints = this.model.getBreakpoints().filter(bp => hitBreakpointIdsOrThread.includes(bp.getIdFromAdapter(this.id)!));
		} else {
			const frame = hitBreakpointIdsOrThread.getTopStackFrame();
			if (frame === undefined) {
				return;
			}

			if (hitBreakpointIdsOrThread.stoppedDetails && hitBreakpointIdsOrThread.stoppedDetails.reason !== 'breakpoint') {
				return;
			}

			breakpoints = this.getBreakpointsAtPosition(frame.source.uri, frame.range.startLineNumber, frame.range.endLineNumber, frame.range.startColumn, frame.range.endColumn);
		}

		// find the current breakpoints

		// check if the current breakpoints are dependencies, and if so collect and send the dependents to DA
		const urisToResend = new Set<string>();
		this.model.getBreakpoints({ triggeredOnly: true, enabledOnly: true }).forEach(bp => {
			breakpoints.forEach(cbp => {
				if (bp.enabled && bp.triggeredBy === cbp.getId()) {
					bp.setSessionDidTrigger(this.getId());
					urisToResend.add(bp.uri.toString());
				}
			});
		});

		const results: Promise<any>[] = [];
		urisToResend.forEach((uri) => results.push(this.debugService.sendBreakpoints(URI.parse(uri), undefined, this)));
		return Promise.all(results);
	}

	private getBreakpointsAtPosition(uri: URI, startLineNumber: number, endLineNumber: number, startColumn: number, endColumn: number): IBreakpoint[] {
		return this.model.getBreakpoints({ uri: uri }).filter(bp => {
			if (bp.lineNumber < startLineNumber || bp.lineNumber > endLineNumber) {
				return false;
			}

			if (bp.column && (bp.column < startColumn || bp.column > endColumn)) {
				return false;
			}
			return true;
		});
	}

	private onDidExitAdapter(event?: AdapterEndEvent): void {
		this.initialized = true;
		this.model.setBreakpointSessionData(this.getId(), this.capabilities, undefined);
		this.shutdown();
		this._onDidEndAdapter.fire(event);
	}

	// Disconnects and clears state. Session can be initialized again for a new connection.
	private shutdown(): void {
		this.rawListeners.clear();
		if (this.raw) {
			// Send out disconnect and immediatly dispose (do not wait for response) #127418
			this.raw.disconnect({});
			this.raw.dispose();
			this.raw = undefined;
		}
		this.passFocusScheduler.cancel();
		this.passFocusScheduler.dispose();
		this.model.clearThreads(this.getId(), true);
		this.sources.clear();
		this.threads.clear();
		this.threadIds = [];
		this.stoppedDetails = [];
		this._onDidChangeState.fire();
	}

	public dispose() {
		this.cancelAllRequests();
		this.rawListeners.dispose();
		this.globalDisposables.dispose();
		this._waitToResume = undefined;
	}

	//---- sources

	getSourceForUri(uri: URI): Source | undefined {
		return this.sources.get(this.uriIdentityService.asCanonicalUri(uri).toString());
	}

	getSource(raw?: DebugProtocol.Source): Source {
		let source = new Source(raw, this.getId(), this.uriIdentityService, this.logService);
		const uriKey = source.uri.toString();
		const found = this.sources.get(uriKey);
		if (found) {
			source = found;
			// merge attributes of new into existing
			source.raw = mixin(source.raw, raw);
			if (source.raw && raw) {
				// Always take the latest presentation hint from adapter #42139
				source.raw.presentationHint = raw.presentationHint;
			}
		} else {
			this.sources.set(uriKey, source);
		}

		return source;
	}

	private getRawSource(uri: URI): DebugProtocol.Source {
		const source = this.getSourceForUri(uri);
		if (source) {
			return source.raw;
		} else {
			const data = Source.getEncodedDebugData(uri);
			return { name: data.name, path: data.path, sourceReference: data.sourceReference };
		}
	}

	private getNewCancellationToken(threadId: number, token?: CancellationToken): CancellationToken {
		const tokenSource = new CancellationTokenSource(token);
		const tokens = this.cancellationMap.get(threadId) || [];
		tokens.push(tokenSource);
		this.cancellationMap.set(threadId, tokens);

		return tokenSource.token;
	}

	private cancelAllRequests(): void {
		this.cancellationMap.forEach(tokens => tokens.forEach(t => t.dispose(true)));
		this.cancellationMap.clear();
	}

	// REPL

	getReplElements(): IReplElement[] {
		return this.repl.getReplElements();
	}

	hasSeparateRepl(): boolean {
		return !this.parentSession || this._options.repl !== 'mergeWithParent';
	}

	removeReplExpressions(): void {
		this.repl.removeReplExpressions();
	}

	async addReplExpression(stackFrame: IStackFrame | undefined, expression: string): Promise<void> {
		await this.repl.addReplExpression(this, stackFrame, expression);
		// Evaluate all watch expressions and fetch variables again since repl evaluation might have changed some.
		this.debugService.getViewModel().updateViews();
	}

	appendToRepl(data: INewReplElementData, isImportant?: boolean): void {
		this.repl.appendToRepl(this, data);
		if (isImportant) {
			this.notificationService.notify({ message: data.output.toString(), severity: data.sev, source: this.name });
		}
	}
}

/**
 * Keeps track of events for threads, and cancels any previous operations for
 * a thread when the thread goes into a new state. Currently, the operations a thread has are:
 *
 * - started
 * - stopped
 * - continue
 * - exited
 *
 * In each case, the new state preempts the old state, so we don't need to
 * queue work, just cancel old work. It's up to the caller to make sure that
 * no UI effects happen at the point when the `token` is cancelled.
 */
export class ThreadStatusScheduler extends Disposable {
	/**
	 * An array of set of thread IDs. When a 'stopped' event is encountered, the
	 * editor refreshes its thread IDs. In the meantime, the thread may change
	 * state it again. So the editor puts a Set into this array when it starts
	 * the refresh, and checks it after the refresh is finished, to see if
	 * any of the threads it looked up should now be invalidated.
	 */
	private pendingCancellations: Set<number | undefined>[] = [];

	/**
	 * Cancellation tokens for currently-running operations on threads.
	 */
	private readonly threadOps = this._register(new DisposableMap<number, CancellationTokenSource>());

	/**
	 * Runs the operation.
	 * If thread is undefined it affects all threads.
	 */
	public async run(threadIdsP: Promise<number[]> | number[], operation: (threadId: number, ct: CancellationToken) => Promise<unknown>) {
		const cancelledWhileLookingUpThreads = new Set<number | undefined>();
		this.pendingCancellations.push(cancelledWhileLookingUpThreads);
		const threadIds = await threadIdsP;

		// Now that we got our threads,
		// 1. Remove our pending set, and
		// 2. Cancel any slower callers who might also have found this thread
		for (let i = 0; i < this.pendingCancellations.length; i++) {
			const s = this.pendingCancellations[i];
			if (s === cancelledWhileLookingUpThreads) {
				this.pendingCancellations.splice(i, 1);
				break;
			} else {
				for (const threadId of threadIds) {
					s.add(threadId);
				}
			}
		}

		if (cancelledWhileLookingUpThreads.has(undefined)) {
			return;
		}

		await Promise.all(threadIds.map(threadId => {
			if (cancelledWhileLookingUpThreads.has(threadId)) {
				return;
			}
			this.threadOps.get(threadId)?.cancel();
			const cts = new CancellationTokenSource();
			this.threadOps.set(threadId, cts);
			return operation(threadId, cts.token);
		}));
	}

	/**
	 * Cancels all ongoing state operations on the given threads.
	 * If threads is undefined it cancel all threads.
	 */
	public cancel(threadIds?: readonly number[]) {
		if (!threadIds) {
			for (const [_, op] of this.threadOps) {
				op.cancel();
			}
			this.threadOps.clearAndDisposeAll();
			for (const s of this.pendingCancellations) {
				s.add(undefined);
			}
		} else {
			for (const threadId of threadIds) {
				this.threadOps.get(threadId)?.cancel();
				this.threadOps.deleteAndDispose(threadId);
				for (const s of this.pendingCancellations) {
					s.add(threadId);
				}
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/debugSessionPicker.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugSessionPicker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as nls from '../../../../nls.js';
import { matchesFuzzy } from '../../../../base/common/filters.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { IDebugService, IDebugSession, REPL_VIEW_ID } from '../common/debug.js';
import { IQuickInputService, IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';

import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IPickerDebugItem } from '../common/loadedScriptsPicker.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';


export async function showDebugSessionMenu(accessor: ServicesAccessor, selectAndStartID: string) {
	const quickInputService = accessor.get(IQuickInputService);
	const debugService = accessor.get(IDebugService);
	const viewsService = accessor.get(IViewsService);
	const commandService = accessor.get(ICommandService);

	const localDisposableStore = new DisposableStore();
	const quickPick = quickInputService.createQuickPick<IPickerDebugItem>({ useSeparators: true });
	localDisposableStore.add(quickPick);
	quickPick.matchOnLabel = quickPick.matchOnDescription = quickPick.matchOnDetail = quickPick.sortByLabel = false;
	quickPick.placeholder = nls.localize('moveFocusedView.selectView', 'Search debug sessions by name');

	const pickItems = _getPicksAndActiveItem(quickPick.value, selectAndStartID, debugService, viewsService, commandService);
	quickPick.items = pickItems.picks;
	quickPick.activeItems = pickItems.activeItems;

	localDisposableStore.add(quickPick.onDidChangeValue(async () => {
		quickPick.items = _getPicksAndActiveItem(quickPick.value, selectAndStartID, debugService, viewsService, commandService).picks;
	}));
	localDisposableStore.add(quickPick.onDidAccept(() => {
		const selectedItem = quickPick.selectedItems[0];
		selectedItem.accept();
		quickPick.hide();
		localDisposableStore.dispose();
	}));
	quickPick.show();
}

function _getPicksAndActiveItem(filter: string, selectAndStartID: string, debugService: IDebugService, viewsService: IViewsService, commandService: ICommandService): { picks: Array<IPickerDebugItem | IQuickPickSeparator>; activeItems: Array<IPickerDebugItem> } {
	const debugConsolePicks: Array<IPickerDebugItem | IQuickPickSeparator> = [];
	const headerSessions: IDebugSession[] = [];

	const currSession = debugService.getViewModel().focusedSession;
	const sessions = debugService.getModel().getSessions(false);
	const activeItems: Array<IPickerDebugItem> = [];

	sessions.forEach((session) => {
		if (session.compact && session.parentSession) {
			headerSessions.push(session.parentSession);
		}
	});

	sessions.forEach((session) => {
		const isHeader = headerSessions.includes(session);
		if (!session.parentSession) {
			debugConsolePicks.push({ type: 'separator', label: isHeader ? session.name : undefined });
		}

		if (!isHeader) {
			const pick = _createPick(session, filter, debugService, viewsService, commandService);
			if (pick) {
				debugConsolePicks.push(pick);
				if (session.getId() === currSession?.getId()) {
					activeItems.push(pick);
				}
			}
		}
	});

	if (debugConsolePicks.length) {
		debugConsolePicks.push({ type: 'separator' });
	}

	const createDebugSessionLabel = nls.localize('workbench.action.debug.startDebug', 'Start a New Debug Session');
	debugConsolePicks.push({
		label: `$(plus) ${createDebugSessionLabel}`,
		ariaLabel: createDebugSessionLabel,
		accept: () => commandService.executeCommand(selectAndStartID)
	});

	return { picks: debugConsolePicks, activeItems };
}


function _getSessionInfo(session: IDebugSession): { label: string; description: string; ariaLabel: string } {
	const label = (!session.configuration.name.length) ? session.name : session.configuration.name;
	const parentName = session.compact ? undefined : session.parentSession?.configuration.name;
	let description = '';
	let ariaLabel = '';
	if (parentName) {
		ariaLabel = nls.localize('workbench.action.debug.spawnFrom', 'Session {0} spawned from {1}', label, parentName);
		description = parentName;
	}

	return { label, description, ariaLabel };
}

function _createPick(session: IDebugSession, filter: string, debugService: IDebugService, viewsService: IViewsService, commandService: ICommandService): IPickerDebugItem | undefined {
	const pickInfo = _getSessionInfo(session);
	const highlights = matchesFuzzy(filter, pickInfo.label, true);
	if (highlights) {
		return {
			label: pickInfo.label,
			description: pickInfo.description,
			ariaLabel: pickInfo.ariaLabel,
			highlights: { label: highlights },
			accept: () => {
				debugService.focusStackFrame(undefined, undefined, session, { explicit: true });
				if (!viewsService.isViewVisible(REPL_VIEW_ID)) {
					viewsService.openView(REPL_VIEW_ID, true);
				}
			}
		};
	}
	return undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/debugSettingMigration.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugSettingMigration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions, IConfigurationMigrationRegistry } from '../../../common/configuration.js';

Registry.as<IConfigurationMigrationRegistry>(Extensions.ConfigurationMigration)
	.registerConfigurationMigrations([{
		key: 'debug.autoExpandLazyVariables',
		migrateFn: (value: boolean) => {
			if (value === true) {
				return { value: 'on' };
			} else if (value === false) {
				return { value: 'off' };
			}

			return [];
		}
	}]);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/debugStatus.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugStatus.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { IDisposable, dispose } from '../../../../base/common/lifecycle.js';
import { IDebugService, State, IDebugConfiguration } from '../common/debug.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IStatusbarEntry, IStatusbarService, StatusbarAlignment, IStatusbarEntryAccessor } from '../../../services/statusbar/browser/statusbar.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';

export class DebugStatusContribution implements IWorkbenchContribution {

	private showInStatusBar!: 'never' | 'always' | 'onFirstSessionStart';
	private toDispose: IDisposable[] = [];
	private entryAccessor: IStatusbarEntryAccessor | undefined;

	constructor(
		@IStatusbarService private readonly statusBarService: IStatusbarService,
		@IDebugService private readonly debugService: IDebugService,
		@IConfigurationService configurationService: IConfigurationService
	) {

		const addStatusBarEntry = () => {
			this.entryAccessor = this.statusBarService.addEntry(this.entry, 'status.debug', StatusbarAlignment.LEFT, 30 /* Low Priority */);
		};

		const setShowInStatusBar = () => {
			this.showInStatusBar = configurationService.getValue<IDebugConfiguration>('debug').showInStatusBar;
			if (this.showInStatusBar === 'always' && !this.entryAccessor) {
				addStatusBarEntry();
			}
		};
		setShowInStatusBar();

		this.toDispose.push(this.debugService.onDidChangeState(state => {
			if (state !== State.Inactive && this.showInStatusBar === 'onFirstSessionStart' && !this.entryAccessor) {
				addStatusBarEntry();
			}
		}));
		this.toDispose.push(configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('debug.showInStatusBar')) {
				setShowInStatusBar();
				if (this.entryAccessor && this.showInStatusBar === 'never') {
					this.entryAccessor.dispose();
					this.entryAccessor = undefined;
				}
			}
		}));
		this.toDispose.push(this.debugService.getConfigurationManager().onDidSelectConfiguration(e => {
			this.entryAccessor?.update(this.entry);
		}));
	}

	private get entry(): IStatusbarEntry {
		let text = '';
		const manager = this.debugService.getConfigurationManager();
		const name = manager.selectedConfiguration.name || '';
		const nameAndLaunchPresent = name && manager.selectedConfiguration.launch;
		if (nameAndLaunchPresent) {
			text = (manager.getLaunches().length > 1 ? `${name} (${manager.selectedConfiguration.launch!.name})` : name);
		}

		return {
			name: nls.localize('status.debug', "Debug"),
			text: '$(debug-alt-small) ' + text,
			ariaLabel: nls.localize('debugTarget', "Debug: {0}", text),
			tooltip: nls.localize('selectAndStartDebug', "Select and Start Debug Configuration"),
			command: 'workbench.action.debug.selectandstart'
		};
	}

	dispose(): void {
		this.entryAccessor?.dispose();
		dispose(this.toDispose);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/debugTaskRunner.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugTaskRunner.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { toAction } from '../../../../base/common/actions.js';
import { disposableTimeout } from '../../../../base/common/async.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { createErrorWithActions } from '../../../../base/common/errorMessage.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import severity from '../../../../base/common/severity.js';
import * as nls from '../../../../nls.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IMarkerService, MarkerSeverity } from '../../../../platform/markers/common/markers.js';
import { IProgressService, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IWorkspace, IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { DEBUG_CONFIGURE_COMMAND_ID, DEBUG_CONFIGURE_LABEL } from './debugCommands.js';
import { IDebugConfiguration } from '../common/debug.js';
import { Markers } from '../../markers/common/markers.js';
import { ConfiguringTask, CustomTask, ITaskEvent, ITaskIdentifier, Task, TaskEventKind } from '../../tasks/common/tasks.js';
import { ITaskService, ITaskSummary } from '../../tasks/common/taskService.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';

const onceFilter = (event: Event<ITaskEvent>, filter: (e: ITaskEvent) => boolean) => Event.once(Event.filter(event, filter));

export const enum TaskRunResult {
	Failure,
	Success
}

const DEBUG_TASK_ERROR_CHOICE_KEY = 'debug.taskerrorchoice';
const ABORT_LABEL = nls.localize('abort', "Abort");
const DEBUG_ANYWAY_LABEL = nls.localize({ key: 'debugAnyway', comment: ['&& denotes a mnemonic'] }, "&&Debug Anyway");
const DEBUG_ANYWAY_LABEL_NO_MEMO = nls.localize('debugAnywayNoMemo', "Debug Anyway");

interface IRunnerTaskSummary extends ITaskSummary {
	cancelled?: boolean;
}

export class DebugTaskRunner implements IDisposable {

	private globalCancellation = new CancellationTokenSource();

	constructor(
		@ITaskService private readonly taskService: ITaskService,
		@IMarkerService private readonly markerService: IMarkerService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IViewsService private readonly viewsService: IViewsService,
		@IDialogService private readonly dialogService: IDialogService,
		@IStorageService private readonly storageService: IStorageService,
		@ICommandService private readonly commandService: ICommandService,
		@IProgressService private readonly progressService: IProgressService,
	) { }

	cancel(): void {
		this.globalCancellation.dispose(true);
		this.globalCancellation = new CancellationTokenSource();
	}

	public dispose(): void {
		this.globalCancellation.dispose(true);
	}

	async runTaskAndCheckErrors(
		root: IWorkspaceFolder | IWorkspace | undefined,
		taskId: string | ITaskIdentifier | undefined,
	): Promise<TaskRunResult> {
		try {
			const taskSummary = await this.runTask(root, taskId, this.globalCancellation.token);
			if (taskSummary && (taskSummary.exitCode === undefined || taskSummary.cancelled)) {
				// User canceled, either debugging, or the prelaunch task
				return TaskRunResult.Failure;
			}

			const errorCount = taskId ? this.markerService.read({ severities: MarkerSeverity.Error, take: 2 }).length : 0;
			const successExitCode = taskSummary && taskSummary.exitCode === 0;
			const failureExitCode = taskSummary && taskSummary.exitCode !== 0;
			const onTaskErrors = this.configurationService.getValue<IDebugConfiguration>('debug').onTaskErrors;
			if (successExitCode || onTaskErrors === 'debugAnyway' || (errorCount === 0 && !failureExitCode)) {
				return TaskRunResult.Success;
			}
			if (onTaskErrors === 'showErrors') {
				await this.viewsService.openView(Markers.MARKERS_VIEW_ID, true);
				return Promise.resolve(TaskRunResult.Failure);
			}
			if (onTaskErrors === 'abort') {
				return Promise.resolve(TaskRunResult.Failure);
			}

			const taskLabel = typeof taskId === 'string' ? taskId : taskId ? taskId.name : '';
			const message = errorCount > 1
				? nls.localize('preLaunchTaskErrors', "Errors exist after running preLaunchTask '{0}'.", taskLabel)
				: errorCount === 1
					? nls.localize('preLaunchTaskError', "Error exists after running preLaunchTask '{0}'.", taskLabel)
					: taskSummary && typeof taskSummary.exitCode === 'number'
						? nls.localize('preLaunchTaskExitCode', "The preLaunchTask '{0}' terminated with exit code {1}.", taskLabel, taskSummary.exitCode)
						: nls.localize('preLaunchTaskTerminated', "The preLaunchTask '{0}' terminated.", taskLabel);

			enum DebugChoice {
				DebugAnyway = 1,
				ShowErrors = 2,
				Cancel = 0
			}
			const { result, checkboxChecked } = await this.dialogService.prompt<DebugChoice>({
				type: severity.Warning,
				message,
				buttons: [
					{
						label: DEBUG_ANYWAY_LABEL,
						run: () => DebugChoice.DebugAnyway
					},
					{
						label: nls.localize({ key: 'showErrors', comment: ['&& denotes a mnemonic'] }, "&&Show Errors"),
						run: () => DebugChoice.ShowErrors
					}
				],
				cancelButton: {
					label: ABORT_LABEL,
					run: () => DebugChoice.Cancel
				},
				checkbox: {
					label: nls.localize('remember', "Remember my choice in user settings"),
				}
			});


			const debugAnyway = result === DebugChoice.DebugAnyway;
			const abort = result === DebugChoice.Cancel;
			if (checkboxChecked) {
				this.configurationService.updateValue('debug.onTaskErrors', result === DebugChoice.DebugAnyway ? 'debugAnyway' : abort ? 'abort' : 'showErrors');
			}

			if (abort) {
				return Promise.resolve(TaskRunResult.Failure);
			}
			if (debugAnyway) {
				return TaskRunResult.Success;
			}

			await this.viewsService.openView(Markers.MARKERS_VIEW_ID, true);
			return Promise.resolve(TaskRunResult.Failure);
		} catch (err) {
			const taskConfigureAction = this.taskService.configureAction();
			const choiceMap: { [key: string]: number } = JSON.parse(this.storageService.get(DEBUG_TASK_ERROR_CHOICE_KEY, StorageScope.WORKSPACE, '{}'));

			let choice = -1;
			enum DebugChoice {
				DebugAnyway = 0,
				ConfigureTask = 1,
				Cancel = 2
			}
			if (choiceMap[err.message] !== undefined) {
				choice = choiceMap[err.message];
			} else {
				const { result, checkboxChecked } = await this.dialogService.prompt<DebugChoice>({
					type: severity.Error,
					message: err.message,
					buttons: [
						{
							label: nls.localize({ key: 'debugAnyway', comment: ['&& denotes a mnemonic'] }, "&&Debug Anyway"),
							run: () => DebugChoice.DebugAnyway
						},
						{
							label: taskConfigureAction.label,
							run: () => DebugChoice.ConfigureTask
						}
					],
					cancelButton: {
						run: () => DebugChoice.Cancel
					},
					checkbox: {
						label: nls.localize('rememberTask', "Remember my choice for this task")
					}
				});
				choice = result;
				if (checkboxChecked) {
					choiceMap[err.message] = choice;
					this.storageService.store(DEBUG_TASK_ERROR_CHOICE_KEY, JSON.stringify(choiceMap), StorageScope.WORKSPACE, StorageTarget.MACHINE);
				}
			}

			if (choice === DebugChoice.ConfigureTask) {
				await taskConfigureAction.run();
			}

			return choice === DebugChoice.DebugAnyway ? TaskRunResult.Success : TaskRunResult.Failure;
		}
	}

	async runTask(root: IWorkspace | IWorkspaceFolder | undefined, taskId: string | ITaskIdentifier | undefined, token = this.globalCancellation.token): Promise<IRunnerTaskSummary | null> {
		if (!taskId) {
			return Promise.resolve(null);
		}
		if (!root) {
			return Promise.reject(new Error(nls.localize('invalidTaskReference', "Task '{0}' can not be referenced from a launch configuration that is in a different workspace folder.", typeof taskId === 'string' ? taskId : taskId.type)));
		}
		// run a task before starting a debug session
		const task = await this.taskService.getTask(root, taskId);
		if (!task) {
			const errorMessage = typeof taskId === 'string'
				? nls.localize('DebugTaskNotFoundWithTaskId', "Could not find the task '{0}'.", taskId)
				: nls.localize('DebugTaskNotFound', "Could not find the specified task.");
			return Promise.reject(createErrorWithActions(errorMessage, [toAction({ id: DEBUG_CONFIGURE_COMMAND_ID, label: DEBUG_CONFIGURE_LABEL, enabled: true, run: () => this.commandService.executeCommand(DEBUG_CONFIGURE_COMMAND_ID) })]));
		}

		// If a task is missing the problem matcher the promise will never complete, so we need to have a workaround #35340
		let taskStarted = false;
		const store = new DisposableStore();
		const getTaskKey = (t: Task) => t.getKey() ?? t.getMapKey();
		const taskKey = getTaskKey(task);
		const inactivePromise: Promise<ITaskSummary | null> = new Promise((resolve) => store.add(
			onceFilter(this.taskService.onDidStateChange, e => {
				// When a task isBackground it will go inactive when it is safe to launch.
				// But when a background task is terminated by the user, it will also fire an inactive event.
				// This means that we will not get to see the real exit code from running the task (undefined when terminated by the user).
				// Catch the ProcessEnded event here, which occurs before inactive, and capture the exit code to prevent this.
				return (e.kind === TaskEventKind.Inactive
					|| (e.kind === TaskEventKind.ProcessEnded && e.exitCode === undefined))
					&& getTaskKey(e.__task) === taskKey;
			})(e => {
				taskStarted = true;
				resolve(e.kind === TaskEventKind.ProcessEnded ? { exitCode: e.exitCode } : null);
			}),
		));

		store.add(
			onceFilter(this.taskService.onDidStateChange, e => ((e.kind === TaskEventKind.Active) || (e.kind === TaskEventKind.DependsOnStarted)) && getTaskKey(e.__task) === taskKey
			)(() => {
				// Task is active, so everything seems to be fine, no need to prompt after 10 seconds
				// Use case being a slow running task should not be prompted even though it takes more than 10 seconds
				taskStarted = true;
			})
		);

		const didAcquireInput = store.add(new Emitter<void>());
		store.add(onceFilter(
			this.taskService.onDidStateChange,
			e => (e.kind === TaskEventKind.AcquiredInput) && getTaskKey(e.__task) === taskKey
		)(() => didAcquireInput.fire()));

		const taskDonePromise: Promise<ITaskSummary | null> = this.taskService.getActiveTasks().then(async (tasks): Promise<ITaskSummary | null> => {
			if (tasks.find(t => getTaskKey(t) === taskKey)) {
				didAcquireInput.fire();
				// Check that the task isn't busy and if it is, wait for it
				const busyTasks = await this.taskService.getBusyTasks();
				if (busyTasks.find(t => getTaskKey(t) === taskKey)) {
					taskStarted = true;
					return inactivePromise;
				}
				// task is already running and isn't busy - nothing to do.
				return Promise.resolve(null);
			}

			const taskPromise = this.taskService.run(task);
			if (task.configurationProperties.isBackground) {
				return inactivePromise;
			}

			return taskPromise.then(x => x ?? null);
		});

		const result = new Promise<IRunnerTaskSummary | null>((resolve, reject) => {
			taskDonePromise.then(result => {
				taskStarted = true;
				resolve(result);
			}, error => reject(error));

			store.add(token.onCancellationRequested(() => {
				resolve({ exitCode: undefined, cancelled: true });
				this.taskService.terminate(task).catch(() => { });
			}));

			// Start the timeouts once a terminal has been acquired
			store.add(didAcquireInput.event(() => {
				const waitTime = task.configurationProperties.isBackground ? 5000 : 10000;

				// Error shown if there's a background task with no problem matcher that doesn't exit quickly
				store.add(disposableTimeout(() => {
					if (!taskStarted) {
						const errorMessage = nls.localize('taskNotTracked', "The task '{0}' has not exited and doesn't have a 'problemMatcher' defined. Make sure to define a problem matcher for watch tasks.", typeof taskId === 'string' ? taskId : JSON.stringify(taskId));
						reject({ severity: severity.Error, message: errorMessage });
					}
				}, waitTime));

				const hideSlowPreLaunchWarning = this.configurationService.getValue<IDebugConfiguration>('debug').hideSlowPreLaunchWarning;
				if (!hideSlowPreLaunchWarning) {
					// Notification shown on any task taking a while to resolve
					store.add(disposableTimeout(() => {
						const message = nls.localize('runningTask', "Waiting for preLaunchTask '{0}'...", task.configurationProperties.name);
						const buttons = [DEBUG_ANYWAY_LABEL_NO_MEMO, ABORT_LABEL];
						const canConfigure = task instanceof CustomTask || task instanceof ConfiguringTask;
						if (canConfigure) {
							buttons.splice(1, 0, nls.localize('configureTask', "Configure Task"));
						}

						this.progressService.withProgress(
							{ location: ProgressLocation.Notification, title: message, buttons },
							() => result.catch(() => { }),
							(choice) => {
								if (choice === undefined) {
									// no-op, keep waiting
								} else if (choice === 0) { // debug anyway
									resolve({ exitCode: 0 });
								} else { // abort or configure
									resolve({ exitCode: undefined, cancelled: true });
									this.taskService.terminate(task).catch(() => { });
									if (canConfigure && choice === 1) { // configure
										this.taskService.openConfig(task as CustomTask);
									}
								}
							}
						);
					}, 10_000));
				}
			}));
		});

		return result.finally(() => store.dispose());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/debugTitle.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugTitle.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IDebugService, State } from '../common/debug.js';
import { dispose, IDisposable } from '../../../../base/common/lifecycle.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { ITitleService } from '../../../services/title/browser/titleService.js';

export class DebugTitleContribution implements IWorkbenchContribution {

	private toDispose: IDisposable[] = [];

	constructor(
		@IDebugService debugService: IDebugService,
		@IHostService hostService: IHostService,
		@ITitleService titleService: ITitleService
	) {
		const updateTitle = () => {
			if (debugService.state === State.Stopped && !hostService.hasFocus) {
				titleService.updateProperties({ prefix: '🔴' });
			} else {
				titleService.updateProperties({ prefix: '' });
			}
		};
		this.toDispose.push(debugService.onDidChangeState(updateTitle));
		this.toDispose.push(hostService.onDidChangeFocus(updateTitle));
	}

	dispose(): void {
		dispose(this.toDispose);
	}
}
```

--------------------------------------------------------------------------------

````
