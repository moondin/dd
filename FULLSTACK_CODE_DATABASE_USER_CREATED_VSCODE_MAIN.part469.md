---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 469
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 469 of 552)

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

---[FILE: src/vs/workbench/contrib/terminalContrib/commandGuide/common/terminalCommandGuideConfiguration.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/commandGuide/common/terminalCommandGuideConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IStringDictionary } from '../../../../../base/common/collections.js';
import { localize } from '../../../../../nls.js';
import type { IConfigurationPropertySchema } from '../../../../../platform/configuration/common/configurationRegistry.js';

export const enum TerminalCommandGuideSettingId {
	ShowCommandGuide = 'terminal.integrated.shellIntegration.showCommandGuide',
}

export const terminalCommandGuideConfigSection = 'terminal.integrated.shellIntegration';

export interface ITerminalCommandGuideConfiguration {
	showCommandGuide: boolean;
}

export const terminalCommandGuideConfiguration: IStringDictionary<IConfigurationPropertySchema> = {
	[TerminalCommandGuideSettingId.ShowCommandGuide]: {
		restricted: true,
		markdownDescription: localize('showCommandGuide', "Whether to show the command guide when hovering over a command in the terminal."),
		type: 'boolean',
		default: true,
	},
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/developer/browser/terminal.developer.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/developer/browser/terminal.developer.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Terminal } from '@xterm/xterm';
import { Delayer } from '../../../../../base/common/async.js';
import { VSBuffer } from '../../../../../base/common/buffer.js';
import { Event } from '../../../../../base/common/event.js';
import { Disposable, DisposableMap, DisposableStore, IDisposable, MutableDisposable, combinedDisposable, dispose } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { localize, localize2 } from '../../../../../nls.js';
import { Categories } from '../../../../../platform/action/common/actionCommonCategories.js';
import { IClipboardService } from '../../../../../platform/clipboard/common/clipboardService.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';
import { ITerminalCommand, TerminalCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { ITerminalLogService, TerminalSettingId } from '../../../../../platform/terminal/common/terminal.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { IStatusbarService, StatusbarAlignment, type IStatusbarEntry } from '../../../../services/statusbar/browser/statusbar.js';
import { IInternalXtermTerminal, ITerminalContribution, ITerminalInstance, IXtermTerminal } from '../../../terminal/browser/terminal.js';
import { registerTerminalAction } from '../../../terminal/browser/terminalActions.js';
import { registerTerminalContribution, type ITerminalContributionContext } from '../../../terminal/browser/terminalExtensions.js';
import { TerminalContextKeys } from '../../../terminal/common/terminalContextKey.js';
import { TerminalDeveloperCommandId } from '../common/terminal.developer.js';
import './media/developer.css';

registerTerminalAction({
	id: TerminalDeveloperCommandId.ShowTextureAtlas,
	title: localize2('workbench.action.terminal.showTextureAtlas', 'Show Terminal Texture Atlas'),
	category: Categories.Developer,
	precondition: ContextKeyExpr.or(TerminalContextKeys.isOpen),
	run: async (c, accessor) => {
		const fileService = accessor.get(IFileService);
		const openerService = accessor.get(IOpenerService);
		const workspaceContextService = accessor.get(IWorkspaceContextService);
		const bitmap = await c.service.activeInstance?.xterm?.textureAtlas;
		if (!bitmap) {
			return;
		}
		const cwdUri = workspaceContextService.getWorkspace().folders[0].uri;
		const fileUri = URI.joinPath(cwdUri, 'textureAtlas.png');
		const canvas = document.createElement('canvas');
		canvas.width = bitmap.width;
		canvas.height = bitmap.height;
		const ctx = canvas.getContext('bitmaprenderer');
		if (!ctx) {
			return;
		}
		ctx.transferFromImageBitmap(bitmap);
		const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res));
		if (!blob) {
			return;
		}
		await fileService.writeFile(fileUri, VSBuffer.wrap(new Uint8Array(await blob.arrayBuffer())));
		openerService.open(fileUri);
	}
});

registerTerminalAction({
	id: TerminalDeveloperCommandId.WriteDataToTerminal,
	title: localize2('workbench.action.terminal.writeDataToTerminal', 'Write Data to Terminal'),
	category: Categories.Developer,
	run: async (c, accessor) => {
		const quickInputService = accessor.get(IQuickInputService);
		const instance = await c.service.getActiveOrCreateInstance();
		await c.service.revealActiveTerminal();
		await instance.processReady;
		if (!instance.xterm) {
			throw new Error('Cannot write data to terminal if xterm isn\'t initialized');
		}
		const data = await quickInputService.input({
			value: '',
			placeHolder: 'Enter data (supports \\n, \\r, \\xAB)',
			prompt: localize('workbench.action.terminal.writeDataToTerminal.prompt', "Enter data to write directly to the terminal, bypassing the pty"),
		});
		if (!data) {
			return;
		}
		let escapedData = data
			.replace(/\\n/g, '\n')
			.replace(/\\r/g, '\r');
		while (true) {
			const match = escapedData.match(/\\x([0-9a-fA-F]{2})/);
			if (match === null || match.index === undefined || match.length < 2) {
				break;
			}
			escapedData = escapedData.slice(0, match.index) + String.fromCharCode(parseInt(match[1], 16)) + escapedData.slice(match.index + 4);
		}
		const xterm = instance.xterm as IInternalXtermTerminal;
		xterm._writeText(escapedData);
	}
});

registerTerminalAction({
	id: TerminalDeveloperCommandId.RecordSession,
	title: localize2('workbench.action.terminal.recordSession', 'Record Terminal Session'),
	category: Categories.Developer,
	run: async (c, accessor) => {
		const clipboardService = accessor.get(IClipboardService);
		const commandService = accessor.get(ICommandService);
		const statusbarService = accessor.get(IStatusbarService);
		const store = new DisposableStore();

		// Set up status bar entry
		const text = localize('workbench.action.terminal.recordSession.recording', "Recording terminal session...");
		const statusbarEntry: IStatusbarEntry = {
			text,
			name: text,
			ariaLabel: text,
			showProgress: true
		};
		const statusbarHandle = statusbarService.addEntry(statusbarEntry, 'recordSession', StatusbarAlignment.LEFT);
		store.add(statusbarHandle);

		// Create, reveal and focus instance
		const instance = await c.service.createTerminal();
		c.service.setActiveInstance(instance);
		await c.service.revealActiveTerminal();
		await Promise.all([
			instance.processReady,
			instance.focusWhenReady(true)
		]);

		// Record session
		return new Promise<void>(resolve => {
			const events: unknown[] = [];
			const endRecording = () => {
				const session = JSON.stringify(events, null, 2);
				clipboardService.writeText(session);
				store.dispose();
				resolve();
			};


			const timer = store.add(new Delayer(5000));
			store.add(Event.runAndSubscribe(instance.onDimensionsChanged, () => {
				events.push({
					type: 'resize',
					cols: instance.cols,
					rows: instance.rows
				});
				timer.trigger(endRecording);
			}));
			store.add(commandService.onWillExecuteCommand(e => {
				events.push({
					type: 'command',
					id: e.commandId,
				});
				timer.trigger(endRecording);
			}));
			store.add(instance.onWillData(data => {
				events.push({
					type: 'output',
					data,
				});
				timer.trigger(endRecording);
			}));
			store.add(instance.onDidSendText(data => {
				events.push({
					type: 'sendText',
					data,
				});
				timer.trigger(endRecording);
			}));
			store.add(instance.xterm!.raw.onData(data => {
				events.push({
					type: 'input',
					data,
				});
				timer.trigger(endRecording);
			}));
			let commandDetectedRegistered = false;
			store.add(Event.runAndSubscribe(instance.capabilities.onDidAddCapability, e => {
				if (commandDetectedRegistered) {
					return;
				}
				const commandDetection = instance.capabilities.get(TerminalCapability.CommandDetection);
				if (!commandDetection) {
					return;
				}
				store.add(commandDetection.promptInputModel.onDidChangeInput(e => {
					events.push({
						type: 'promptInputChange',
						data: commandDetection.promptInputModel.getCombinedString(),
					});
					timer.trigger(endRecording);
				}));
				commandDetectedRegistered = true;
			}));
		});

	}
});

registerTerminalAction({
	id: TerminalDeveloperCommandId.RestartPtyHost,
	title: localize2('workbench.action.terminal.restartPtyHost', 'Restart Pty Host'),
	category: Categories.Developer,
	run: async (c, accessor) => {
		const logService = accessor.get(ITerminalLogService);
		const backends = Array.from(c.instanceService.getRegisteredBackends());
		const unresponsiveBackends = backends.filter(e => !e.isResponsive);
		// Restart only unresponsive backends if there are any
		const restartCandidates = unresponsiveBackends.length > 0 ? unresponsiveBackends : backends;
		for (const backend of restartCandidates) {
			logService.warn(`Restarting pty host for authority "${backend.remoteAuthority}"`);
			backend.restartPtyHost();
		}
	}
});

const enum DevModeContributionState {
	Off,
	WaitingForCapability,
	On,
}

class DevModeContribution extends Disposable implements ITerminalContribution {
	static readonly ID = 'terminal.devMode';
	static get(instance: ITerminalInstance): DevModeContribution | null {
		return instance.getContribution<DevModeContribution>(DevModeContribution.ID);
	}

	private _xterm: IXtermTerminal & { raw: Terminal } | undefined;
	private readonly _activeDevModeDisposables = this._register(new MutableDisposable());
	private _currentColor = 0;

	private _state: DevModeContributionState = DevModeContributionState.Off;

	constructor(
		private readonly _ctx: ITerminalContributionContext,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
	) {
		super();
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TerminalSettingId.DevMode)) {
				this._updateDevMode();
			}
		}));
	}

	xtermReady(xterm: IXtermTerminal & { raw: Terminal }): void {
		this._xterm = xterm;
		this._updateDevMode();
	}

	private _updateDevMode() {
		const devMode: boolean = this._isEnabled();
		this._xterm?.raw.element?.classList.toggle('dev-mode', devMode);

		const commandDetection = this._ctx.instance.capabilities.get(TerminalCapability.CommandDetection);
		if (devMode) {
			if (commandDetection) {
				if (this._state === DevModeContributionState.On) {
					return;
				}
				this._state = DevModeContributionState.On;
				const commandDecorations = new DisposableMap<ITerminalCommand, IDisposable>();
				const otherDisposables = new DisposableStore();
				this._activeDevModeDisposables.value = combinedDisposable(
					commandDecorations,
					otherDisposables,
					// Prompt input
					this._ctx.instance.onDidBlur(() => this._updateDevMode()),
					this._ctx.instance.onDidFocus(() => this._updateDevMode()),
					commandDetection.promptInputModel.onDidChangeInput(() => this._updateDevMode()),
					// Sequence markers
					commandDetection.onCommandFinished(command => {
						const colorClass = `color-${this._currentColor}`;
						const decorations: IDisposable[] = [];
						commandDecorations.set(command, combinedDisposable(...decorations));
						if (command.promptStartMarker) {
							const d = this._ctx.instance.xterm!.raw?.registerDecoration({
								marker: command.promptStartMarker
							});
							if (d) {
								decorations.push(d);
								otherDisposables.add(d.onRender(e => {
									e.textContent = 'A';
									e.classList.add('xterm-sequence-decoration', 'top', 'left', colorClass);
								}));
							}
						}
						if (command.marker) {
							const d = this._ctx.instance.xterm!.raw?.registerDecoration({
								marker: command.marker,
								x: command.startX
							});
							if (d) {
								decorations.push(d);
								otherDisposables.add(d.onRender(e => {
									e.textContent = 'B';
									e.classList.add('xterm-sequence-decoration', 'top', 'right', colorClass);
								}));
							}
						}
						if (command.executedMarker) {
							const d = this._ctx.instance.xterm!.raw?.registerDecoration({
								marker: command.executedMarker,
								x: command.executedX
							});
							if (d) {
								decorations.push(d);
								otherDisposables.add(d.onRender(e => {
									e.textContent = 'C';
									e.classList.add('xterm-sequence-decoration', 'bottom', 'left', colorClass);
								}));
							}
						}
						if (command.endMarker) {
							const d = this._ctx.instance.xterm!.raw?.registerDecoration({
								marker: command.endMarker
							});
							if (d) {
								decorations.push(d);
								otherDisposables.add(d.onRender(e => {
									e.textContent = 'D';
									e.classList.add('xterm-sequence-decoration', 'bottom', 'right', colorClass);
								}));
							}
						}
						this._currentColor = (this._currentColor + 1) % 2;
					}),
					commandDetection.onCommandInvalidated(commands => {
						for (const c of commands) {
							const decorations = commandDecorations.get(c);
							if (decorations) {
								dispose(decorations);
							}
							commandDecorations.deleteAndDispose(c);
						}
					})
				);
			} else {
				if (this._state === DevModeContributionState.WaitingForCapability) {
					return;
				}
				this._state = DevModeContributionState.WaitingForCapability;
				this._activeDevModeDisposables.value = this._ctx.instance.capabilities.onDidAddCommandDetectionCapability(e => {
					this._updateDevMode();
				});
			}
		} else {
			if (this._state === DevModeContributionState.Off) {
				return;
			}
			this._state = DevModeContributionState.Off;
			this._activeDevModeDisposables.clear();
		}
	}

	private _isEnabled(): boolean {
		return this._configurationService.getValue(TerminalSettingId.DevMode) || false;
	}
}

registerTerminalContribution(DevModeContribution.ID, DevModeContribution);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/developer/browser/media/developer.css]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/developer/browser/media/developer.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .xterm.dev-mode .xterm-sequence-decoration {
	background-color: var(--vscode-terminal-background, var(--vscode-panel-background));
	visibility: hidden;
}
.monaco-workbench .xterm.dev-mode:hover .xterm-sequence-decoration {
	visibility: visible !important;
}
.monaco-workbench .xterm.dev-mode .xterm-sequence-decoration.left {
	direction: rtl;
}
.monaco-workbench .xterm.dev-mode .xterm-sequence-decoration.top.left {
	transform: scale(.5) translate(-50%, -50%);
}
.monaco-workbench .xterm.dev-mode .xterm-sequence-decoration.top.right {
	transform: scale(.5) translate(50%, -50%);
}
.monaco-workbench .xterm.dev-mode .xterm-sequence-decoration.bottom.left {
	transform: scale(.5) translate(-50%, 50%);
}
.monaco-workbench .xterm.dev-mode .xterm-sequence-decoration.bottom.right {
	transform: scale(.5) translate(50%, 50%);
}
.monaco-workbench .xterm.dev-mode .xterm-sequence-decoration.color-0 {
	color: #FF4444;
}
.monaco-workbench .xterm.dev-mode .xterm-sequence-decoration.color-1 {
	color: #44FFFF;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/developer/common/terminal.developer.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/developer/common/terminal.developer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const enum TerminalDeveloperCommandId {
	WriteDataToTerminal = 'workbench.action.terminal.writeDataToTerminal',
	RecordSession = 'workbench.action.terminal.recordSession',
	ShowTextureAtlas = 'workbench.action.terminal.showTextureAtlas',
	RestartPtyHost = 'workbench.action.terminal.restartPtyHost',
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/environmentChanges/browser/terminal.environmentChanges.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/environmentChanges/browser/terminal.environmentChanges.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../../base/common/uri.js';
import { Event } from '../../../../../base/common/event.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { ITextModelContentProvider, ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { localize, localize2 } from '../../../../../nls.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { EnvironmentVariableMutatorType, EnvironmentVariableScope, IEnvironmentVariableMutator, IMergedEnvironmentVariableCollection } from '../../../../../platform/terminal/common/environmentVariable.js';
import { registerActiveInstanceAction } from '../../../terminal/browser/terminalActions.js';
import { TerminalCommandId } from '../../../terminal/common/terminal.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';

// TODO: The rest of the terminal environment changes feature should move here https://github.com/microsoft/vscode/issues/177241

// #region Actions

registerActiveInstanceAction({
	id: TerminalCommandId.ShowEnvironmentContributions,
	title: localize2('workbench.action.terminal.showEnvironmentContributions', 'Show Environment Contributions'),
	run: async (activeInstance, c, accessor, arg) => {
		const collection = activeInstance.extEnvironmentVariableCollection;
		if (collection) {
			const scope = arg as EnvironmentVariableScope | undefined;
			const instantiationService = accessor.get(IInstantiationService);
			const outputProvider = instantiationService.createInstance(EnvironmentCollectionProvider);
			const editorService = accessor.get(IEditorService);
			const timestamp = new Date().getTime();
			const scopeDesc = scope?.workspaceFolder ? ` - ${scope.workspaceFolder.name}` : '';
			const textContent = await outputProvider.provideTextContent(URI.from(
				{
					scheme: EnvironmentCollectionProvider.scheme,
					path: `Environment changes${scopeDesc}`,
					fragment: describeEnvironmentChanges(collection, scope),
					query: `environment-collection-${timestamp}`
				}));
			if (textContent) {
				await editorService.openEditor({
					resource: textContent.uri
				});
			}
		}
	}
});

// #endregion

function describeEnvironmentChanges(collection: IMergedEnvironmentVariableCollection, scope: EnvironmentVariableScope | undefined): string {
	let content = `# ${localize('envChanges', 'Terminal Environment Changes')}`;
	const globalDescriptions = collection.getDescriptionMap(undefined);
	const workspaceDescriptions = collection.getDescriptionMap(scope);
	for (const [ext, coll] of collection.collections) {
		content += `\n\n## ${localize('extension', 'Extension: {0}', ext)}`;
		content += '\n';
		const globalDescription = globalDescriptions.get(ext);
		if (globalDescription) {
			content += `\n${globalDescription}\n`;
		}
		const workspaceDescription = workspaceDescriptions.get(ext);
		if (workspaceDescription) {
			// Only show '(workspace)' suffix if there is already a description for the extension.
			const workspaceSuffix = globalDescription ? ` (${localize('ScopedEnvironmentContributionInfo', 'workspace')})` : '';
			content += `\n${workspaceDescription}${workspaceSuffix}\n`;
		}

		for (const mutator of coll.map.values()) {
			if (filterScope(mutator, scope) === false) {
				continue;
			}
			content += `\n- \`${mutatorTypeLabel(mutator.type, mutator.value, mutator.variable)}\``;
		}
	}
	return content;
}

function filterScope(
	mutator: IEnvironmentVariableMutator,
	scope: EnvironmentVariableScope | undefined
): boolean {
	if (!mutator.scope) {
		return true;
	}
	// Only mutators which are applicable on the relevant workspace should be shown.
	if (mutator.scope.workspaceFolder && scope?.workspaceFolder && mutator.scope.workspaceFolder.index === scope.workspaceFolder.index) {
		return true;
	}
	return false;
}

function mutatorTypeLabel(type: EnvironmentVariableMutatorType, value: string, variable: string): string {
	switch (type) {
		case EnvironmentVariableMutatorType.Prepend: return `${variable}=${value}\${env:${variable}}`;
		case EnvironmentVariableMutatorType.Append: return `${variable}=\${env:${variable}}${value}`;
		default: return `${variable}=${value}`;
	}
}

class EnvironmentCollectionProvider implements ITextModelContentProvider {
	static scheme = 'ENVIRONMENT_CHANGES_COLLECTION';

	constructor(
		@ITextModelService textModelResolverService: ITextModelService,
		@IModelService private readonly _modelService: IModelService
	) {
		textModelResolverService.registerTextModelContentProvider(EnvironmentCollectionProvider.scheme, this);
	}

	async provideTextContent(resource: URI): Promise<ITextModel | null> {
		const existing = this._modelService.getModel(resource);
		if (existing && !existing.isDisposed()) {
			return existing;
		}

		return this._modelService.createModel(resource.fragment, { languageId: 'markdown', onDidChange: Event.None }, resource, false);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/find/browser/terminal.find.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/find/browser/terminal.find.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Terminal as RawXtermTerminal } from '@xterm/xterm';
import { IDimension } from '../../../../../base/browser/dom.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { Lazy } from '../../../../../base/common/lazy.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { localize2 } from '../../../../../nls.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { findInFilesCommand } from '../../../search/browser/searchActionsFind.js';
import { IDetachedTerminalInstance, ITerminalContribution, ITerminalInstance, ITerminalService, IXtermTerminal, isDetachedTerminalInstance } from '../../../terminal/browser/terminal.js';
import { registerActiveInstanceAction, registerActiveXtermAction } from '../../../terminal/browser/terminalActions.js';
import { registerTerminalContribution, type IDetachedCompatibleTerminalContributionContext, type ITerminalContributionContext } from '../../../terminal/browser/terminalExtensions.js';
import { TerminalContextKeys } from '../../../terminal/common/terminalContextKey.js';
import { TerminalFindCommandId } from '../common/terminal.find.js';
import './media/terminalFind.css';
import { TerminalFindWidget } from './terminalFindWidget.js';

// #region Terminal Contributions

class TerminalFindContribution extends Disposable implements ITerminalContribution {
	static readonly ID = 'terminal.find';

	/**
	 * Currently focused find widget. This is used to track action context since
	 * 'active terminals' are only tracked for non-detached terminal instanecs.
	 */
	static activeFindWidget?: TerminalFindContribution;

	static get(instance: ITerminalInstance | IDetachedTerminalInstance): TerminalFindContribution | null {
		return instance.getContribution<TerminalFindContribution>(TerminalFindContribution.ID);
	}

	private _findWidget: Lazy<TerminalFindWidget>;
	private _lastLayoutDimensions: IDimension | undefined;

	get findWidget(): TerminalFindWidget { return this._findWidget.value; }

	constructor(
		ctx: ITerminalContributionContext | IDetachedCompatibleTerminalContributionContext,
		@IInstantiationService instantiationService: IInstantiationService,
		@ITerminalService terminalService: ITerminalService,
	) {
		super();

		this._findWidget = new Lazy(() => {
			const findWidget = instantiationService.createInstance(TerminalFindWidget, ctx.instance);

			// Track focus and set state so we can force the scroll bar to be visible
			findWidget.focusTracker.onDidFocus(() => {
				TerminalFindContribution.activeFindWidget = this;
				ctx.instance.forceScrollbarVisibility();
				if (!isDetachedTerminalInstance(ctx.instance)) {
					terminalService.setActiveInstance(ctx.instance);
				}
			});
			findWidget.focusTracker.onDidBlur(() => {
				TerminalFindContribution.activeFindWidget = undefined;
				ctx.instance.resetScrollbarVisibility();
			});

			if (!ctx.instance.domElement) {
				throw new Error('FindWidget expected terminal DOM to be initialized');
			}

			ctx.instance.domElement?.appendChild(findWidget.getDomNode());
			if (this._lastLayoutDimensions) {
				findWidget.layout(this._lastLayoutDimensions.width);
			}

			return findWidget;
		});
	}

	layout(_xterm: IXtermTerminal & { raw: RawXtermTerminal }, dimension: IDimension): void {
		this._lastLayoutDimensions = dimension;
		this._findWidget.rawValue?.layout(dimension.width);
	}

	xtermReady(xterm: IXtermTerminal & { raw: RawXtermTerminal }): void {
		this._register(xterm.onDidChangeFindResults(() => this._findWidget.rawValue?.updateResultCount()));
	}

	override dispose() {
		if (TerminalFindContribution.activeFindWidget === this) {
			TerminalFindContribution.activeFindWidget = undefined;
		}
		super.dispose();
		this._findWidget.rawValue?.dispose();
	}

}
registerTerminalContribution(TerminalFindContribution.ID, TerminalFindContribution, true);

// #endregion

// #region Actions

registerActiveXtermAction({
	id: TerminalFindCommandId.FindFocus,
	title: localize2('workbench.action.terminal.focusFind', 'Focus Find'),
	keybinding: {
		primary: KeyMod.CtrlCmd | KeyCode.KeyF,
		when: ContextKeyExpr.or(TerminalContextKeys.findFocus, TerminalContextKeys.focusInAny),
		weight: KeybindingWeight.WorkbenchContrib
	},
	precondition: ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated),
	run: (_xterm, _accessor, activeInstance) => {
		const contr = TerminalFindContribution.activeFindWidget || TerminalFindContribution.get(activeInstance);
		contr?.findWidget.reveal();
	}
});

registerActiveXtermAction({
	id: TerminalFindCommandId.FindHide,
	title: localize2('workbench.action.terminal.hideFind', 'Hide Find'),
	keybinding: {
		primary: KeyCode.Escape,
		secondary: [KeyMod.Shift | KeyCode.Escape],
		when: ContextKeyExpr.and(TerminalContextKeys.focusInAny, TerminalContextKeys.findVisible),
		weight: KeybindingWeight.WorkbenchContrib
	},
	precondition: ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated),
	run: (_xterm, _accessor, activeInstance) => {
		const contr = TerminalFindContribution.activeFindWidget || TerminalFindContribution.get(activeInstance);
		contr?.findWidget.hide();
	}
});

registerActiveXtermAction({
	id: TerminalFindCommandId.ToggleFindRegex,
	title: localize2('workbench.action.terminal.toggleFindRegex', 'Toggle Find Using Regex'),
	keybinding: {
		primary: KeyMod.Alt | KeyCode.KeyR,
		mac: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyR },
		when: TerminalContextKeys.findVisible,
		weight: KeybindingWeight.WorkbenchContrib
	},
	precondition: ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated),
	run: (_xterm, _accessor, activeInstance) => {
		const contr = TerminalFindContribution.activeFindWidget || TerminalFindContribution.get(activeInstance);
		const state = contr?.findWidget.state;
		state?.change({ isRegex: !state.isRegex }, false);
	}
});

registerActiveXtermAction({
	id: TerminalFindCommandId.ToggleFindWholeWord,
	title: localize2('workbench.action.terminal.toggleFindWholeWord', 'Toggle Find Using Whole Word'),
	keybinding: {
		primary: KeyMod.Alt | KeyCode.KeyW,
		mac: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyW },
		when: TerminalContextKeys.findVisible,
		weight: KeybindingWeight.WorkbenchContrib
	},
	precondition: ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated),
	run: (_xterm, _accessor, activeInstance) => {
		const contr = TerminalFindContribution.activeFindWidget || TerminalFindContribution.get(activeInstance);
		const state = contr?.findWidget.state;
		state?.change({ wholeWord: !state.wholeWord }, false);
	}
});

registerActiveXtermAction({
	id: TerminalFindCommandId.ToggleFindCaseSensitive,
	title: localize2('workbench.action.terminal.toggleFindCaseSensitive', 'Toggle Find Using Case Sensitive'),
	keybinding: {
		primary: KeyMod.Alt | KeyCode.KeyC,
		mac: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyC },
		when: TerminalContextKeys.findVisible,
		weight: KeybindingWeight.WorkbenchContrib
	},
	precondition: ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated),
	run: (_xterm, _accessor, activeInstance) => {
		const contr = TerminalFindContribution.activeFindWidget || TerminalFindContribution.get(activeInstance);
		const state = contr?.findWidget.state;
		state?.change({ matchCase: !state.matchCase }, false);
	}
});

registerActiveXtermAction({
	id: TerminalFindCommandId.FindNext,
	title: localize2('workbench.action.terminal.findNext', 'Find Next'),
	keybinding: [
		{
			primary: KeyCode.F3,
			mac: { primary: KeyMod.CtrlCmd | KeyCode.KeyG, secondary: [KeyCode.F3] },
			when: ContextKeyExpr.or(TerminalContextKeys.focusInAny, TerminalContextKeys.findFocus),
			weight: KeybindingWeight.WorkbenchContrib
		},
		{
			primary: KeyMod.Shift | KeyCode.Enter,
			when: TerminalContextKeys.findInputFocus,
			weight: KeybindingWeight.WorkbenchContrib
		}
	],
	precondition: ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated),
	run: (_xterm, _accessor, activeInstance) => {
		const contr = TerminalFindContribution.activeFindWidget || TerminalFindContribution.get(activeInstance);
		const widget = contr?.findWidget;
		if (widget) {
			widget.show();
			widget.find(false);
		}
	}
});

registerActiveXtermAction({
	id: TerminalFindCommandId.FindPrevious,
	title: localize2('workbench.action.terminal.findPrevious', 'Find Previous'),
	keybinding: [
		{
			primary: KeyMod.Shift | KeyCode.F3,
			mac: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyG, secondary: [KeyMod.Shift | KeyCode.F3] },
			when: ContextKeyExpr.or(TerminalContextKeys.focusInAny, TerminalContextKeys.findFocus),
			weight: KeybindingWeight.WorkbenchContrib
		},
		{
			primary: KeyCode.Enter,
			when: TerminalContextKeys.findInputFocus,
			weight: KeybindingWeight.WorkbenchContrib
		}
	],
	precondition: ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated),
	run: (_xterm, _accessor, activeInstance) => {
		const contr = TerminalFindContribution.activeFindWidget || TerminalFindContribution.get(activeInstance);
		const widget = contr?.findWidget;
		if (widget) {
			widget.show();
			widget.find(true);
		}
	}
});

// Global workspace file search
registerActiveInstanceAction({
	id: TerminalFindCommandId.SearchWorkspace,
	title: localize2('workbench.action.terminal.searchWorkspace', 'Search Workspace'),
	keybinding: [
		{
			primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyF,
			when: ContextKeyExpr.and(TerminalContextKeys.processSupported, TerminalContextKeys.focus, TerminalContextKeys.textSelected),
			weight: KeybindingWeight.WorkbenchContrib + 50
		}
	],
	run: (activeInstance, c, accessor) => findInFilesCommand(accessor, { query: activeInstance.selection })
});

// #endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/find/browser/terminalFindWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/find/browser/terminalFindWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { SimpleFindWidget } from '../../../codeEditor/browser/find/simpleFindWidget.js';
import { IContextMenuService, IContextViewService } from '../../../../../platform/contextview/browser/contextView.js';
import { IContextKeyService, IContextKey } from '../../../../../platform/contextkey/common/contextkey.js';
import { IDetachedTerminalInstance, ITerminalInstance, IXtermTerminal, XtermTerminalConstants } from '../../../terminal/browser/terminal.js';
import { TerminalContextKeys } from '../../../terminal/common/terminalContextKey.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { Event } from '../../../../../base/common/event.js';
import type { ISearchOptions } from '@xterm/addon-search';
import { IClipboardService } from '../../../../../platform/clipboard/common/clipboardService.js';
import { IDisposable, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { TerminalFindCommandId } from '../common/terminal.find.js';
import { TerminalClipboardContribution } from '../../clipboard/browser/terminal.clipboard.contribution.js';
import { StandardMouseEvent } from '../../../../../base/browser/mouseEvent.js';
import { createTextInputActions } from '../../../../browser/actions/textInputActions.js';
import { ILogService } from '../../../../../platform/log/common/log.js';

const TERMINAL_FIND_WIDGET_INITIAL_WIDTH = 419;

export class TerminalFindWidget extends SimpleFindWidget {
	private _findInputFocused: IContextKey<boolean>;
	private _findWidgetFocused: IContextKey<boolean>;
	private _findWidgetVisible: IContextKey<boolean>;

	private _overrideCopyOnSelectionDisposable: IDisposable | undefined;
	private _selectionDisposable = this._register(new MutableDisposable());

	constructor(
		private _instance: ITerminalInstance | IDetachedTerminalInstance,
		@IClipboardService clipboardService: IClipboardService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IContextViewService contextViewService: IContextViewService,
		@IHoverService hoverService: IHoverService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IThemeService themeService: IThemeService,
		@ILogService logService: ILogService
	) {
		super({
			showCommonFindToggles: true,
			checkImeCompletionState: true,
			showResultCount: true,
			initialWidth: TERMINAL_FIND_WIDGET_INITIAL_WIDTH,
			enableSash: true,
			appendCaseSensitiveActionId: TerminalFindCommandId.ToggleFindCaseSensitive,
			appendRegexActionId: TerminalFindCommandId.ToggleFindRegex,
			appendWholeWordsActionId: TerminalFindCommandId.ToggleFindWholeWord,
			previousMatchActionId: TerminalFindCommandId.FindPrevious,
			nextMatchActionId: TerminalFindCommandId.FindNext,
			closeWidgetActionId: TerminalFindCommandId.FindHide,
			type: 'Terminal',
			matchesLimit: XtermTerminalConstants.SearchHighlightLimit
		}, contextViewService, contextKeyService, hoverService, keybindingService);

		this._register(this.state.onFindReplaceStateChange(() => {
			this.show();
		}));
		this._findInputFocused = TerminalContextKeys.findInputFocus.bindTo(contextKeyService);
		this._findWidgetFocused = TerminalContextKeys.findFocus.bindTo(contextKeyService);
		this._findWidgetVisible = TerminalContextKeys.findVisible.bindTo(contextKeyService);
		const innerDom = this.getDomNode().firstChild;
		if (innerDom) {
			this._register(dom.addDisposableListener(innerDom, 'mousedown', (event) => {
				event.stopPropagation();
			}));
			this._register(dom.addDisposableListener(innerDom, 'contextmenu', (event) => {
				event.stopPropagation();
			}));
		}
		const findInputDomNode = this.getFindInputDomNode();
		this._register(dom.addDisposableListener(findInputDomNode, 'contextmenu', (event) => {
			const targetWindow = dom.getWindow(findInputDomNode);
			const standardEvent = new StandardMouseEvent(targetWindow, event);
			const actions = createTextInputActions(clipboardService, logService);

			contextMenuService.showContextMenu({
				getAnchor: () => standardEvent,
				getActions: () => actions,
				getActionsContext: () => event.target,
			});
			event.stopPropagation();
		}));
		this._register(themeService.onDidColorThemeChange(() => {
			if (this.isVisible()) {
				this.find(true, true);
			}
		}));
		this._register(configurationService.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration('workbench.colorCustomizations') && this.isVisible()) {
				this.find(true, true);
			}
		}));

		this.updateResultCount();
	}

	find(previous: boolean, update?: boolean) {
		const xterm = this._instance.xterm;
		if (!xterm) {
			return;
		}
		if (previous) {
			this._findPreviousWithEvent(xterm, this.inputValue, { regex: this._getRegexValue(), wholeWord: this._getWholeWordValue(), caseSensitive: this._getCaseSensitiveValue(), incremental: update });
		} else {
			this._findNextWithEvent(xterm, this.inputValue, { regex: this._getRegexValue(), wholeWord: this._getWholeWordValue(), caseSensitive: this._getCaseSensitiveValue() });
		}
	}

	override reveal(): void {
		const initialInput = this._instance.hasSelection() && !this._instance.selection!.includes('\n') ? this._instance.selection : undefined;
		const inputValue = initialInput ?? this.inputValue;
		const xterm = this._instance.xterm;
		if (xterm && inputValue && inputValue !== '') {
			// trigger highlight all matches
			this._findPreviousWithEvent(xterm, inputValue, { incremental: true, regex: this._getRegexValue(), wholeWord: this._getWholeWordValue(), caseSensitive: this._getCaseSensitiveValue() }).then(foundMatch => {
				this.updateButtons(foundMatch);
				this._register(Event.once(xterm.onDidChangeSelection)(() => xterm.clearActiveSearchDecoration()));
			});
		}
		this.updateButtons(false);

		super.reveal(inputValue);
		this._findWidgetVisible.set(true);
	}

	override show() {
		const initialInput = this._instance.hasSelection() && !this._instance.selection!.includes('\n') ? this._instance.selection : undefined;
		super.show(initialInput);
		this._findWidgetVisible.set(true);
	}

	override hide() {
		super.hide();
		this._findWidgetVisible.reset();
		this._instance.focus(true);
		this._instance.xterm?.clearSearchDecorations();
	}

	protected async _getResultCount(): Promise<{ resultIndex: number; resultCount: number } | undefined> {
		return this._instance.xterm?.findResult;
	}

	protected _onInputChanged() {
		// Ignore input changes for now
		const xterm = this._instance.xterm;
		if (xterm) {
			this._findPreviousWithEvent(xterm, this.inputValue, { regex: this._getRegexValue(), wholeWord: this._getWholeWordValue(), caseSensitive: this._getCaseSensitiveValue(), incremental: true }).then(foundMatch => {
				this.updateButtons(foundMatch);
			});
		}
		return false;
	}

	protected _onFocusTrackerFocus() {
		if (TerminalClipboardContribution.get(this._instance)?.overrideCopyOnSelection) {
			this._overrideCopyOnSelectionDisposable = TerminalClipboardContribution.get(this._instance)?.overrideCopyOnSelection(false);
		}
		this._findWidgetFocused.set(true);
	}

	protected _onFocusTrackerBlur() {
		this._overrideCopyOnSelectionDisposable?.dispose();
		this._instance.xterm?.clearActiveSearchDecoration();
		this._findWidgetFocused.reset();
	}

	protected _onFindInputFocusTrackerFocus() {
		this._findInputFocused.set(true);
	}

	protected _onFindInputFocusTrackerBlur() {
		this._findInputFocused.reset();
	}

	findFirst() {
		const instance = this._instance;
		if (instance.hasSelection()) {
			instance.clearSelection();
		}
		const xterm = instance.xterm;
		if (xterm) {
			this._findPreviousWithEvent(xterm, this.inputValue, { regex: this._getRegexValue(), wholeWord: this._getWholeWordValue(), caseSensitive: this._getCaseSensitiveValue() });
		}
	}

	private _registerSelectionChangeListener(xterm: IXtermTerminal): void {
		this._selectionDisposable.value = Event.once(xterm.onDidChangeSelection)(() => xterm.clearActiveSearchDecoration());
	}

	private async _findNextWithEvent(xterm: IXtermTerminal, term: string, options: ISearchOptions): Promise<boolean> {
		const foundMatch = await xterm.findNext(term, options);
		this._registerSelectionChangeListener(xterm);
		return foundMatch;
	}

	private async _findPreviousWithEvent(xterm: IXtermTerminal, term: string, options: ISearchOptions): Promise<boolean> {
		const foundMatch = await xterm.findPrevious(term, options);
		this._registerSelectionChangeListener(xterm);
		return foundMatch;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/find/browser/media/terminalFind.css]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/find/browser/media/terminalFind.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.hc-black .xterm-find-result-decoration,
.hc-light .xterm-find-result-decoration {
	outline-style: dotted !important;
}

.hc-black .xterm-find-result-decoration,
.hc-light .xterm-find-result-decoration {
	outline-style: solid !important;
}

.xterm-find-active-result-decoration {
	outline-style: solid !important;
	outline-width: 2px !important;
	/* Ensure the active decoration is above the regular decoration */
	z-index: 7 !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/find/common/terminal.find.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/find/common/terminal.find.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const enum TerminalFindCommandId {
	FindFocus = 'workbench.action.terminal.focusFind',
	FindHide = 'workbench.action.terminal.hideFind',
	FindNext = 'workbench.action.terminal.findNext',
	FindPrevious = 'workbench.action.terminal.findPrevious',
	ToggleFindRegex = 'workbench.action.terminal.toggleFindRegex',
	ToggleFindWholeWord = 'workbench.action.terminal.toggleFindWholeWord',
	ToggleFindCaseSensitive = 'workbench.action.terminal.toggleFindCaseSensitive',
	SearchWorkspace = 'workbench.action.terminal.searchWorkspace',
}

export const defaultTerminalFindCommandToSkipShell = [
	TerminalFindCommandId.FindFocus,
	TerminalFindCommandId.FindHide,
	TerminalFindCommandId.FindNext,
	TerminalFindCommandId.FindPrevious,
	TerminalFindCommandId.ToggleFindRegex,
	TerminalFindCommandId.ToggleFindWholeWord,
	TerminalFindCommandId.ToggleFindCaseSensitive,
	TerminalFindCommandId.SearchWorkspace,
];
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/history/browser/terminal.history.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/history/browser/terminal.history.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import { localize2 } from '../../../../../nls.js';
import { AccessibleViewProviderId } from '../../../../../platform/accessibility/browser/accessibleView.js';
import { CONTEXT_ACCESSIBILITY_MODE_ENABLED } from '../../../../../platform/accessibility/common/accessibility.js';
import { MenuId } from '../../../../../platform/actions/common/actions.js';
import { ContextKeyExpr, IContextKeyService, type IContextKey } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { TerminalCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { TerminalLocation } from '../../../../../platform/terminal/common/terminal.js';
import { ResourceContextKey } from '../../../../common/contextkeys.js';
import { accessibleViewCurrentProviderId, accessibleViewIsShown } from '../../../accessibility/browser/accessibilityConfiguration.js';
import type { ITerminalContribution, ITerminalInstance } from '../../../terminal/browser/terminal.js';
import { registerActiveInstanceAction, registerTerminalAction } from '../../../terminal/browser/terminalActions.js';
import { registerTerminalContribution, type ITerminalContributionContext } from '../../../terminal/browser/terminalExtensions.js';
import { TERMINAL_VIEW_ID } from '../../../terminal/common/terminal.js';
import { TerminalContextKeys } from '../../../terminal/common/terminalContextKey.js';
import { clearShellFileHistory, getCommandHistory, getDirectoryHistory } from '../common/history.js';
import { TerminalHistoryCommandId } from '../common/terminal.history.js';
import { showRunRecentQuickPick } from './terminalRunRecentQuickPick.js';

// #region Terminal Contributions

class TerminalHistoryContribution extends Disposable implements ITerminalContribution {
	static readonly ID = 'terminal.history';

	static get(instance: ITerminalInstance): TerminalHistoryContribution | null {
		return instance.getContribution<TerminalHistoryContribution>(TerminalHistoryContribution.ID);
	}

	private _terminalInRunCommandPicker: IContextKey<boolean>;

	constructor(
		private readonly _ctx: ITerminalContributionContext,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super();

		this._terminalInRunCommandPicker = TerminalContextKeys.inTerminalRunCommandPicker.bindTo(contextKeyService);

		this._register(_ctx.instance.capabilities.onDidAddCapability(e => {
			switch (e.id) {
				case TerminalCapability.CwdDetection: {
					this._register(e.capability.onDidChangeCwd(e => {
						this._instantiationService.invokeFunction(getDirectoryHistory)?.add(e, { remoteAuthority: _ctx.instance.remoteAuthority });
					}));
					break;
				}
				case TerminalCapability.CommandDetection: {
					this._register(e.capability.onCommandFinished(e => {
						if (e.command.trim().length > 0) {
							this._instantiationService.invokeFunction(getCommandHistory)?.add(e.command, { shellType: _ctx.instance.shellType });
						}
					}));
					break;
				}
			}
		}));
	}

	/**
	 * Triggers a quick pick that displays recent commands or cwds. Selecting one will
	 * rerun it in the active terminal.
	 */
	async runRecent(type: 'command' | 'cwd', filterMode?: 'fuzzy' | 'contiguous', value?: string): Promise<void> {
		return this._instantiationService.invokeFunction(showRunRecentQuickPick,
			this._ctx.instance,
			this._terminalInRunCommandPicker,
			type,
			filterMode,
			value,
		);
	}
}

registerTerminalContribution(TerminalHistoryContribution.ID, TerminalHistoryContribution);

// #endregion

// #region Actions

const precondition = ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated);

registerTerminalAction({
	id: TerminalHistoryCommandId.ClearPreviousSessionHistory,
	title: localize2('workbench.action.terminal.clearPreviousSessionHistory', 'Clear Previous Session History'),
	precondition,
	run: async (c, accessor) => {
		getCommandHistory(accessor).clear();
		clearShellFileHistory();
	}
});

registerActiveInstanceAction({
	id: TerminalHistoryCommandId.GoToRecentDirectory,
	title: localize2('workbench.action.terminal.goToRecentDirectory', 'Go to Recent Directory...'),
	metadata: {
		description: localize2('goToRecentDirectory.metadata', 'Goes to a recent folder'),
	},
	precondition,
	keybinding: {
		primary: KeyMod.CtrlCmd | KeyCode.KeyG,
		when: TerminalContextKeys.focus,
		weight: KeybindingWeight.WorkbenchContrib
	},
	menu: [
		{
			id: MenuId.ViewTitle,
			group: 'shellIntegration',
			order: 0,
			when: ContextKeyExpr.equals('view', TERMINAL_VIEW_ID),
			isHiddenByDefault: true
		},
		...[MenuId.EditorTitle, MenuId.CompactWindowEditorTitle].map(id => ({
			id,
			group: '1_shellIntegration',
			order: 0,
			when: ResourceContextKey.Scheme.isEqualTo(Schemas.vscodeTerminal),
			isHiddenByDefault: true
		})),
	],
	run: async (activeInstance, c) => {
		const history = TerminalHistoryContribution.get(activeInstance);
		if (!history) {
			return;
		}
		await history.runRecent('cwd');
		if (activeInstance?.target === TerminalLocation.Editor) {
			await c.editorService.revealActiveEditor();
		} else {
			await c.groupService.showPanel(false);
		}
	}
});

registerTerminalAction({
	id: TerminalHistoryCommandId.RunRecentCommand,
	title: localize2('workbench.action.terminal.runRecentCommand', 'Run Recent Command...'),
	precondition,
	keybinding: [
		{
			primary: KeyMod.CtrlCmd | KeyCode.KeyR,
			when: ContextKeyExpr.and(CONTEXT_ACCESSIBILITY_MODE_ENABLED, ContextKeyExpr.or(TerminalContextKeys.focus, ContextKeyExpr.and(accessibleViewIsShown, accessibleViewCurrentProviderId.isEqualTo(AccessibleViewProviderId.Terminal)))),
			weight: KeybindingWeight.WorkbenchContrib
		},
		{
			primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyR,
			mac: { primary: KeyMod.WinCtrl | KeyMod.Alt | KeyCode.KeyR },
			when: ContextKeyExpr.and(TerminalContextKeys.focus, CONTEXT_ACCESSIBILITY_MODE_ENABLED.negate()),
			weight: KeybindingWeight.WorkbenchContrib
		}
	],
	menu: [
		{
			id: MenuId.ViewTitle,
			group: 'shellIntegration',
			order: 1,
			when: ContextKeyExpr.equals('view', TERMINAL_VIEW_ID),
			isHiddenByDefault: true
		},
		...[MenuId.EditorTitle, MenuId.CompactWindowEditorTitle].map(id => ({
			id,
			group: '1_shellIntegration',
			order: 1,
			when: ResourceContextKey.Scheme.isEqualTo(Schemas.vscodeTerminal),
			isHiddenByDefault: true
		})),
	],
	run: async (c, accessor) => {
		let activeInstance = c.service.activeInstance;
		// If an instanec doesn't exist, create one and wait for shell type to be set
		if (!activeInstance) {
			const newInstance = activeInstance = await c.service.getActiveOrCreateInstance();
			await c.service.revealActiveTerminal();
			const store = new DisposableStore();
			const wasDisposedPrematurely = await new Promise<boolean>(r => {
				store.add(newInstance.onDidChangeShellType(() => r(false)));
				store.add(newInstance.onDisposed(() => r(true)));
			});
			store.dispose();
			if (wasDisposedPrematurely) {
				return;
			}
		}
		const history = TerminalHistoryContribution.get(activeInstance);
		if (!history) {
			return;
		}
		await history.runRecent('command');
		if (activeInstance?.target === TerminalLocation.Editor) {
			await c.editorService.revealActiveEditor();
		} else {
			await c.groupService.showPanel(false);
		}
	}
});

// #endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/history/browser/terminalRunRecentQuickPick.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/history/browser/terminalRunRecentQuickPick.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Toggle } from '../../../../../base/browser/ui/toggle/toggle.js';
import { isMacintosh, OperatingSystem } from '../../../../../base/common/platform.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { ITextModelContentProvider, ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { localize } from '../../../../../nls.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IQuickInputButton, IQuickInputService, IQuickPickItem, IQuickPickSeparator } from '../../../../../platform/quickinput/common/quickInput.js';
import { ITerminalCommand, TerminalCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { collapseTildePath } from '../../../../../platform/terminal/common/terminalEnvironment.js';
import { asCssVariable, inputActiveOptionBackground, inputActiveOptionBorder, inputActiveOptionForeground } from '../../../../../platform/theme/common/colorRegistry.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { ITerminalInstance } from '../../../terminal/browser/terminal.js';
import { commandHistoryFuzzySearchIcon, commandHistoryOpenFileIcon, commandHistoryOutputIcon, commandHistoryRemoveIcon } from '../../../terminal/browser/terminalIcons.js';
import { TerminalStorageKeys } from '../../../terminal/common/terminalStorageKeys.js';
import { terminalStrings } from '../../../terminal/common/terminalStrings.js';
import { URI } from '../../../../../base/common/uri.js';
import { fromNow } from '../../../../../base/common/date.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { showWithPinnedItems } from '../../../../../platform/quickinput/browser/quickPickPin.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { IContextKey } from '../../../../../platform/contextkey/common/contextkey.js';
import { AccessibleViewProviderId, IAccessibleViewService } from '../../../../../platform/accessibility/browser/accessibleView.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { getCommandHistory, getDirectoryHistory, getShellFileHistory } from '../common/history.js';
import { ResourceSet } from '../../../../../base/common/map.js';
import { extUri, extUriIgnorePathCase } from '../../../../../base/common/resources.js';
import { IPathService } from '../../../../services/path/common/pathService.js';
import { isObject } from '../../../../../base/common/types.js';

export async function showRunRecentQuickPick(
	accessor: ServicesAccessor,
	instance: ITerminalInstance,
	terminalInRunCommandPicker: IContextKey<boolean>,
	type: 'command' | 'cwd',
	filterMode?: 'fuzzy' | 'contiguous',
	value?: string,
): Promise<void> {
	if (!instance.xterm) {
		return;
	}

	const accessibleViewService = accessor.get(IAccessibleViewService);
	const editorService = accessor.get(IEditorService);
	const instantiationService = accessor.get(IInstantiationService);
	const quickInputService = accessor.get(IQuickInputService);
	const storageService = accessor.get(IStorageService);
	const pathService = accessor.get(IPathService);

	const runRecentStorageKey = `${TerminalStorageKeys.PinnedRecentCommandsPrefix}.${instance.shellType}`;
	let placeholder: string;
	type Item = IQuickPickItem & { command?: ITerminalCommand; rawLabel: string };
	let items: (Item | IQuickPickItem & { rawLabel: string } | IQuickPickSeparator)[] = [];
	const commandMap: Set<string> = new Set();

	const removeFromCommandHistoryButton: IQuickInputButton = {
		iconClass: ThemeIcon.asClassName(commandHistoryRemoveIcon),
		tooltip: localize('removeCommand', "Remove from Command History")
	};

	const commandOutputButton: IQuickInputButton = {
		iconClass: ThemeIcon.asClassName(commandHistoryOutputIcon),
		tooltip: localize('viewCommandOutput', "View Command Output"),
		alwaysVisible: false
	};

	const openResourceButtons: (IQuickInputButton & { resource: URI })[] = [];

	if (type === 'command') {
		placeholder = isMacintosh ? localize('selectRecentCommandMac', 'Select a command to run (hold Option-key to edit the command)') : localize('selectRecentCommand', 'Select a command to run (hold Alt-key to edit the command)');
		const cmdDetection = instance.capabilities.get(TerminalCapability.CommandDetection);
		const commands = cmdDetection?.commands;
		// Current session history
		const executingCommand = cmdDetection?.executingCommand;
		if (executingCommand) {
			commandMap.add(executingCommand);
		}
		function formatLabel(label: string) {
			return label
				// Replace new lines with "enter" symbol
				.replace(/\r?\n/g, '\u23CE')
				// Replace 3 or more spaces with midline horizontal ellipsis which looks similar
				// to whitespace in the editor
				.replace(/\s\s\s+/g, '\u22EF');
		}
		if (commands && commands.length > 0) {
			for (let i = commands.length - 1; i >= 0; i--) {
				const entry = commands[i];
				// Trim off any whitespace and/or line endings, replace new lines with the
				// Downwards Arrow with Corner Leftwards symbol
				const label = entry.command.trim();
				if (label.length === 0 || commandMap.has(label)) {
					continue;
				}
				let description = collapseTildePath(entry.cwd, instance.userHome, instance.os === OperatingSystem.Windows ? '\\' : '/');
				if (entry.exitCode) {
					// Since you cannot get the last command's exit code on pwsh, just whether it failed
					// or not, -1 is treated specially as simply failed
					if (entry.exitCode === -1) {
						description += ' failed';
					} else {
						description += ` exitCode: ${entry.exitCode}`;
					}
				}
				description = description.trim();
				const buttons: IQuickInputButton[] = [commandOutputButton];
				// Merge consecutive commands
				const lastItem = items.length > 0 ? items[items.length - 1] : undefined;
				if (lastItem?.type !== 'separator' && lastItem?.label === label) {
					lastItem.id = entry.timestamp.toString();
					lastItem.description = description;
					continue;
				}
				items.push({
					label: formatLabel(label),
					rawLabel: label,
					description,
					id: entry.timestamp.toString(),
					command: entry,
					buttons: entry.hasOutput() ? buttons : undefined
				});
				commandMap.add(label);
			}
		}
		if (executingCommand) {
			items.unshift({
				label: formatLabel(executingCommand),
				rawLabel: executingCommand,
				description: cmdDetection.cwd
			});
		}
		if (items.length > 0) {
			items.unshift({
				type: 'separator',
				buttons: [], // HACK: Force full sized separators as there's no flag currently
				label: terminalStrings.currentSessionCategory
			});
		}

		// Gather previous session history
		const history = instantiationService.invokeFunction(getCommandHistory);
		const previousSessionItems: (IQuickPickItem & { rawLabel: string })[] = [];
		for (const [label, info] of history.entries) {
			// Only add previous session item if it's not in this session
			if (!commandMap.has(label) && info.shellType === instance.shellType) {
				previousSessionItems.unshift({
					label: formatLabel(label),
					rawLabel: label,
					buttons: [removeFromCommandHistoryButton]
				});
				commandMap.add(label);
			}
		}

		if (previousSessionItems.length > 0) {
			items.push(
				{
					type: 'separator',
					buttons: [], // HACK: Force full sized separators as there's no flag currently
					label: terminalStrings.previousSessionCategory
				},
				...previousSessionItems,
			);
		}

		// Gather shell file history
		const shellFileHistory = await instantiationService.invokeFunction(getShellFileHistory, instance.shellType);
		if (shellFileHistory !== undefined) {
			const dedupedShellFileItems: (IQuickPickItem & { rawLabel: string })[] = [];
			for (const label of shellFileHistory.commands) {
				if (!commandMap.has(label)) {
					dedupedShellFileItems.unshift({
						label: formatLabel(label),
						rawLabel: label
					});
				}
			}
			if (dedupedShellFileItems.length > 0) {
				const button: IQuickInputButton & { resource: URI } = {
					iconClass: ThemeIcon.asClassName(commandHistoryOpenFileIcon),
					tooltip: localize('openShellHistoryFile', "Open File"),
					alwaysVisible: false,
					resource: shellFileHistory.sourceResource
				};
				openResourceButtons.push(button);
				items.push(
					{
						type: 'separator',
						buttons: [button],
						label: localize('shellFileHistoryCategory', '{0} history', instance.shellType),
						description: shellFileHistory.sourceLabel
					},
					...dedupedShellFileItems,
				);
			}
		}
	} else {
		placeholder = isMacintosh
			? localize('selectRecentDirectoryMac', 'Select a directory to go to (hold Option-key to edit the command)')
			: localize('selectRecentDirectory', 'Select a directory to go to (hold Alt-key to edit the command)');

		// Check path uniqueness following target platform's case sensitivity rules.
		const uriComparer = instance.os === OperatingSystem.Windows ? extUriIgnorePathCase : extUri;
		const uniqueUris = new ResourceSet(o => uriComparer.getComparisonKey(o));

		const cwds = instance.capabilities.get(TerminalCapability.CwdDetection)?.cwds || [];
		if (cwds && cwds.length > 0) {
			for (const label of cwds) {
				const itemUri = URI.file(label);
				if (!uniqueUris.has(itemUri)) {
					uniqueUris.add(itemUri);
					items.push({
						label: await instance.getUriLabelForShell(itemUri),
						rawLabel: label
					});
				}
			}
			items = items.reverse();
			items.unshift({ type: 'separator', label: terminalStrings.currentSessionCategory });
		}

		// Gather previous session history
		const history = instantiationService.invokeFunction(getDirectoryHistory);
		const previousSessionItems: (IQuickPickItem & { rawLabel: string })[] = [];
		// Only add previous session item if it's not in this session and it matches the remote authority
		for (const [label, info] of history.entries) {
			if (info === null || info.remoteAuthority === instance.remoteAuthority) {
				const itemUri = info?.remoteAuthority ? await pathService.fileURI(label) : URI.file(label);
				if (!uniqueUris.has(itemUri)) {
					uniqueUris.add(itemUri);
					previousSessionItems.unshift({
						label: await instance.getUriLabelForShell(itemUri),
						rawLabel: label,
						buttons: [removeFromCommandHistoryButton]
					});
				}
			}
		}
		if (previousSessionItems.length > 0) {
			items.push(
				{ type: 'separator', label: terminalStrings.previousSessionCategory },
				...previousSessionItems,
			);
		}
	}
	if (items.length === 0) {
		return;
	}
	const disposables = new DisposableStore();
	const fuzzySearchToggle = disposables.add(new Toggle({
		title: 'Fuzzy search',
		icon: commandHistoryFuzzySearchIcon,
		isChecked: filterMode === 'fuzzy',
		inputActiveOptionBorder: asCssVariable(inputActiveOptionBorder),
		inputActiveOptionForeground: asCssVariable(inputActiveOptionForeground),
		inputActiveOptionBackground: asCssVariable(inputActiveOptionBackground)
	}));
	disposables.add(fuzzySearchToggle.onChange(() => {
		instantiationService.invokeFunction(showRunRecentQuickPick, instance, terminalInRunCommandPicker, type, fuzzySearchToggle.checked ? 'fuzzy' : 'contiguous', quickPick.value);
	}));
	const outputProvider = disposables.add(instantiationService.createInstance(TerminalOutputProvider));
	const quickPick = disposables.add(quickInputService.createQuickPick<Item | IQuickPickItem & { rawLabel: string }>({ useSeparators: true }));
	const originalItems = items;
	quickPick.items = [...originalItems];
	quickPick.sortByLabel = false;
	quickPick.placeholder = placeholder;
	quickPick.matchOnLabelMode = filterMode || 'contiguous';
	quickPick.toggles = [fuzzySearchToggle];
	disposables.add(quickPick.onDidTriggerItemButton(async e => {
		if (e.button === removeFromCommandHistoryButton) {
			if (type === 'command') {
				instantiationService.invokeFunction(getCommandHistory)?.remove(e.item.label);
			} else {
				instantiationService.invokeFunction(getDirectoryHistory)?.remove(e.item.rawLabel);
			}
		} else if (e.button === commandOutputButton) {
			const selectedCommand = (e.item as Item).command;
			const output = selectedCommand?.getOutput();
			if (output && selectedCommand?.command) {
				const textContent = await outputProvider.provideTextContent(URI.from(
					{
						scheme: TerminalOutputProvider.scheme,
						path: `${selectedCommand.command}... ${fromNow(selectedCommand.timestamp, true)}`,
						fragment: output,
						query: `terminal-output-${selectedCommand.timestamp}-${instance.instanceId}`
					}));
				if (textContent) {
					await editorService.openEditor({
						resource: textContent.uri
					});
				}
			}
		}
		await instantiationService.invokeFunction(showRunRecentQuickPick, instance, terminalInRunCommandPicker, type, filterMode, value);
	}));
	disposables.add(quickPick.onDidTriggerSeparatorButton(async e => {
		const resource = openResourceButtons.find(openResourceButton => e.button === openResourceButton)?.resource;
		if (resource) {
			await editorService.openEditor({
				resource
			});
		}
	}));
	disposables.add(quickPick.onDidChangeValue(async value => {
		if (!value) {
			await instantiationService.invokeFunction(showRunRecentQuickPick, instance, terminalInRunCommandPicker, type, filterMode, value);
		}
	}));
	let terminalScrollStateSaved = false;
	function restoreScrollState() {
		terminalScrollStateSaved = false;
		instance.xterm?.markTracker.restoreScrollState();
		instance.xterm?.markTracker.clear();
	}
	disposables.add(quickPick.onDidChangeActive(async () => {
		const xterm = instance.xterm;
		if (!xterm) {
			return;
		}
		const [item] = quickPick.activeItems;
		if (!item) {
			return;
		}
		function isItem(obj: unknown): obj is Item {
			return isObject(obj) && 'rawLabel' in obj;
		}
		if (isItem(item) && item.command && item.command.marker) {
			if (!terminalScrollStateSaved) {
				xterm.markTracker.saveScrollState();
				terminalScrollStateSaved = true;
			}
			const promptRowCount = item.command.getPromptRowCount();
			const commandRowCount = item.command.getCommandRowCount();
			xterm.markTracker.revealRange({
				start: {
					x: 1,
					y: item.command.marker.line - (promptRowCount - 1) + 1
				},
				end: {
					x: instance.cols,
					y: item.command.marker.line + (commandRowCount - 1) + 1
				}
			});
		} else {
			restoreScrollState();
		}
	}));
	disposables.add(quickPick.onDidAccept(async () => {
		const result = quickPick.activeItems[0];
		let text: string;
		if (type === 'cwd') {
			text = `cd ${await instance.preparePathForShell(result.rawLabel)}`;
		} else { // command
			text = result.rawLabel;
		}
		quickPick.hide();
		terminalScrollStateSaved = false;
		instance.xterm?.markTracker.clear();
		instance.scrollToBottom();
		instance.runCommand(text, !quickPick.keyMods.alt);
		if (quickPick.keyMods.alt) {
			instance.focus();
		}
	}));
	disposables.add(quickPick.onDidHide(() => restoreScrollState()));
	if (value) {
		quickPick.value = value;
	}
	return new Promise<void>(r => {
		terminalInRunCommandPicker.set(true);
		disposables.add(showWithPinnedItems(storageService, runRecentStorageKey, quickPick, true));
		disposables.add(quickPick.onDidHide(() => {
			terminalInRunCommandPicker.set(false);
			accessibleViewService.showLastProvider(AccessibleViewProviderId.Terminal);
			r();
			disposables.dispose();
		}));
	});
}

class TerminalOutputProvider extends Disposable implements ITextModelContentProvider {
	static scheme = 'TERMINAL_OUTPUT';

	constructor(
		@ITextModelService textModelResolverService: ITextModelService,
		@IModelService private readonly _modelService: IModelService,
	) {
		super();
		this._register(textModelResolverService.registerTextModelContentProvider(TerminalOutputProvider.scheme, this));
	}

	async provideTextContent(resource: URI): Promise<ITextModel | null> {
		const existing = this._modelService.getModel(resource);
		if (existing && !existing.isDisposed()) {
			return existing;
		}

		return this._modelService.createModel(resource.fragment, null, resource, false);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/history/common/history.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/history/common/history.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../base/common/lifecycle.js';
import { LRUCache } from '../../../../../base/common/map.js';
import { Schemas } from '../../../../../base/common/network.js';
import { join } from '../../../../../base/common/path.js';
import { isWindows, OperatingSystem } from '../../../../../base/common/platform.js';
import { env } from '../../../../../base/common/process.js';
import { isNumber } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { FileOperationError, FileOperationResult, IFileContent, IFileService } from '../../../../../platform/files/common/files.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { GeneralShellType, PosixShellType, TerminalShellType } from '../../../../../platform/terminal/common/terminal.js';
import { IRemoteAgentService } from '../../../../services/remote/common/remoteAgentService.js';
import { TerminalHistorySettingId } from './terminal.history.js';

/**
 * Tracks a list of generic entries.
 */
export interface ITerminalPersistedHistory<T> {
	/**
	 * The persisted entries.
	 */
	readonly entries: IterableIterator<[string, T]>;
	/**
	 * Adds an entry.
	 */
	add(key: string, value: T): void;
	/**
	 * Removes an entry.
	 */
	remove(key: string): void;
	/**
	 * Clears all entries.
	 */
	clear(): void;
}

interface ISerializedCache<T> {
	entries: { key: string; value: T }[];
}

const enum Constants {
	DefaultHistoryLimit = 100
}

const enum StorageKeys {
	Entries = 'terminal.history.entries',
	Timestamp = 'terminal.history.timestamp'
}

let directoryHistory: ITerminalPersistedHistory<{ remoteAuthority?: string }> | undefined = undefined;
export function getDirectoryHistory(accessor: ServicesAccessor): ITerminalPersistedHistory<{ remoteAuthority?: string }> {
	if (!directoryHistory) {
		directoryHistory = accessor.get(IInstantiationService).createInstance(TerminalPersistedHistory, 'dirs') as TerminalPersistedHistory<{ remoteAuthority?: string }>;
	}
	return directoryHistory;
}

let commandHistory: ITerminalPersistedHistory<{ shellType: TerminalShellType }> | undefined = undefined;
export function getCommandHistory(accessor: ServicesAccessor): ITerminalPersistedHistory<{ shellType: TerminalShellType | undefined }> {
	if (!commandHistory) {
		commandHistory = accessor.get(IInstantiationService).createInstance(TerminalPersistedHistory, 'commands') as TerminalPersistedHistory<{ shellType: TerminalShellType }>;
	}
	return commandHistory;
}

export class TerminalPersistedHistory<T> extends Disposable implements ITerminalPersistedHistory<T> {
	private readonly _entries: LRUCache<string, T>;
	private _timestamp: number = 0;
	private _isReady = false;
	private _isStale = true;

	get entries(): IterableIterator<[string, T]> {
		this._ensureUpToDate();
		return this._entries.entries();
	}

	constructor(
		private readonly _storageDataKey: string,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IStorageService private readonly _storageService: IStorageService,
	) {
		super();

		// Init cache
		this._entries = new LRUCache<string, T>(this._getHistoryLimit());

		// Listen for config changes to set history limit
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TerminalHistorySettingId.ShellIntegrationCommandHistory)) {
				this._entries.limit = this._getHistoryLimit();
			}
		}));

		// Listen to cache changes from other windows
		this._register(this._storageService.onDidChangeValue(StorageScope.APPLICATION, this._getTimestampStorageKey(), this._store)(() => {
			if (!this._isStale) {
				this._isStale = this._storageService.getNumber(this._getTimestampStorageKey(), StorageScope.APPLICATION, 0) !== this._timestamp;
			}
		}));
	}

	add(key: string, value: T) {
		this._ensureUpToDate();
		this._entries.set(key, value);
		this._saveState();
	}

	remove(key: string) {
		this._ensureUpToDate();
		this._entries.delete(key);
		this._saveState();
	}

	clear() {
		this._ensureUpToDate();
		this._entries.clear();
		this._saveState();
	}

	private _ensureUpToDate() {
		// Initial load
		if (!this._isReady) {
			this._loadState();
			this._isReady = true;
		}

		// React to stale cache caused by another window
		if (this._isStale) {
			// Since state is saved whenever the entries change, it's a safe assumption that no
			// merging of entries needs to happen, just loading the new state.
			this._entries.clear();
			this._loadState();
			this._isStale = false;
		}
	}

	private _loadState() {
		this._timestamp = this._storageService.getNumber(this._getTimestampStorageKey(), StorageScope.APPLICATION, 0);

		// Load global entries plus
		const serialized = this._loadPersistedState();
		if (serialized) {
			for (const entry of serialized.entries) {
				this._entries.set(entry.key, entry.value);
			}
		}
	}

	private _loadPersistedState(): ISerializedCache<T> | undefined {
		const raw = this._storageService.get(this._getEntriesStorageKey(), StorageScope.APPLICATION);
		if (raw === undefined || raw.length === 0) {
			return undefined;
		}
		let serialized: ISerializedCache<T> | undefined = undefined;
		try {
			serialized = JSON.parse(raw);
		} catch {
			// Invalid data
			return undefined;
		}
		return serialized;
	}

	private _saveState() {
		const serialized: ISerializedCache<T> = { entries: [] };
		this._entries.forEach((value, key) => serialized.entries.push({ key, value }));
		this._storageService.store(this._getEntriesStorageKey(), JSON.stringify(serialized), StorageScope.APPLICATION, StorageTarget.MACHINE);
		this._timestamp = Date.now();
		this._storageService.store(this._getTimestampStorageKey(), this._timestamp, StorageScope.APPLICATION, StorageTarget.MACHINE);
	}

	private _getHistoryLimit() {
		const historyLimit = this._configurationService.getValue(TerminalHistorySettingId.ShellIntegrationCommandHistory);
		return isNumber(historyLimit) ? historyLimit : Constants.DefaultHistoryLimit;
	}

	private _getTimestampStorageKey() {
		return `${StorageKeys.Timestamp}.${this._storageDataKey}`;
	}

	private _getEntriesStorageKey() {
		return `${StorageKeys.Entries}.${this._storageDataKey}`;
	}
}

// Shell file history loads once per shell per window
interface IShellFileHistoryEntry {
	sourceLabel: string;
	sourceResource: URI;
	commands: string[];
}
const shellFileHistory: Map<TerminalShellType | undefined, IShellFileHistoryEntry | null> = new Map();
export async function getShellFileHistory(accessor: ServicesAccessor, shellType: TerminalShellType | undefined): Promise<IShellFileHistoryEntry | undefined> {
	const cached = shellFileHistory.get(shellType);
	if (cached === null) {
		return undefined;
	}
	if (cached !== undefined) {
		return cached;
	}
	let result: IShellFileHistoryEntry | undefined;
	switch (shellType) {
		case PosixShellType.Bash:
			result = await fetchBashHistory(accessor);
			break;
		case GeneralShellType.PowerShell:
			result = await fetchPwshHistory(accessor);
			break;
		case PosixShellType.Zsh:
			result = await fetchZshHistory(accessor);
			break;
		case PosixShellType.Fish:
			result = await fetchFishHistory(accessor);
			break;
		case GeneralShellType.Python:
			result = await fetchPythonHistory(accessor);
			break;
		default: return undefined;
	}
	if (result === undefined) {
		shellFileHistory.set(shellType, null);
		return undefined;
	}
	shellFileHistory.set(shellType, result);
	return result;
}
export function clearShellFileHistory() {
	shellFileHistory.clear();
}

export async function fetchBashHistory(accessor: ServicesAccessor): Promise<IShellFileHistoryEntry | undefined> {
	const fileService = accessor.get(IFileService);
	const remoteAgentService = accessor.get(IRemoteAgentService);
	const remoteEnvironment = await remoteAgentService.getEnvironment();
	if (remoteEnvironment?.os === OperatingSystem.Windows || !remoteEnvironment && isWindows) {
		return undefined;
	}
	const sourceLabel = '~/.bash_history';
	const resolvedFile = await fetchFileContents(env['HOME'], '.bash_history', false, fileService, remoteAgentService);
	if (resolvedFile === undefined) {
		return undefined;
	}
	// .bash_history does not differentiate wrapped commands from multiple commands. Parse
	// the output to get the
	const fileLines = resolvedFile.content.split('\n');
	const result: Set<string> = new Set();
	let currentLine: string;
	let currentCommand: string | undefined = undefined;
	let wrapChar: string | undefined = undefined;
	for (let i = 0; i < fileLines.length; i++) {
		currentLine = fileLines[i];
		if (currentCommand === undefined) {
			currentCommand = currentLine;
		} else {
			currentCommand += `\n${currentLine}`;
		}
		for (let c = 0; c < currentLine.length; c++) {
			if (wrapChar) {
				if (currentLine[c] === wrapChar) {
					wrapChar = undefined;
				}
			} else {
				if (currentLine[c].match(/['"]/)) {
					wrapChar = currentLine[c];
				}
			}
		}
		if (wrapChar === undefined) {
			if (currentCommand.length > 0) {
				result.add(currentCommand.trim());
			}
			currentCommand = undefined;
		}
	}

	return {
		sourceLabel,
		sourceResource: resolvedFile.resource,
		commands: Array.from(result.values())
	};
}

export async function fetchZshHistory(accessor: ServicesAccessor): Promise<IShellFileHistoryEntry | undefined> {
	const fileService = accessor.get(IFileService);
	const remoteAgentService = accessor.get(IRemoteAgentService);
	const remoteEnvironment = await remoteAgentService.getEnvironment();
	if (remoteEnvironment?.os === OperatingSystem.Windows || !remoteEnvironment && isWindows) {
		return undefined;
	}

	const sourceLabel = '~/.zsh_history';
	const resolvedFile = await fetchFileContents(env['HOME'], '.zsh_history', false, fileService, remoteAgentService);
	if (resolvedFile === undefined) {
		return undefined;
	}
	const isExtendedHistory = /^:\s\d+:\d+;/.test(resolvedFile.content);
	const fileLines = resolvedFile.content.split(isExtendedHistory ? /\:\s\d+\:\d+;/ : /(?<!\\)\n/);
	const result: Set<string> = new Set();
	for (let i = 0; i < fileLines.length; i++) {
		const sanitized = fileLines[i].replace(/\\\n/g, '\n').trim();
		if (sanitized.length > 0) {
			result.add(sanitized);
		}
	}
	return {
		sourceLabel,
		sourceResource: resolvedFile.resource,
		commands: Array.from(result.values())
	};
}


export async function fetchPythonHistory(accessor: ServicesAccessor): Promise<IShellFileHistoryEntry | undefined> {
	const fileService = accessor.get(IFileService);
	const remoteAgentService = accessor.get(IRemoteAgentService);

	const sourceLabel = '~/.python_history';
	const resolvedFile = await fetchFileContents(env['HOME'], '.python_history', false, fileService, remoteAgentService);

	if (resolvedFile === undefined) {
		return undefined;
	}

	// Python history file is a simple text file with one command per line
	const fileLines = resolvedFile.content.split('\n');
	const result: Set<string> = new Set();

	fileLines.forEach(line => {
		if (line.trim().length > 0) {
			result.add(line.trim());
		}
	});

	return {
		sourceLabel,
		sourceResource: resolvedFile.resource,
		commands: Array.from(result.values())
	};
}

export async function fetchPwshHistory(accessor: ServicesAccessor): Promise<IShellFileHistoryEntry | undefined> {
	const fileService: Pick<IFileService, 'readFile'> = accessor.get(IFileService);
	const remoteAgentService: Pick<IRemoteAgentService, 'getConnection' | 'getEnvironment'> = accessor.get(IRemoteAgentService);
	let folderPrefix: string | undefined;
	let filePath: string;
	const remoteEnvironment = await remoteAgentService.getEnvironment();
	const isFileWindows = remoteEnvironment?.os === OperatingSystem.Windows || !remoteEnvironment && isWindows;
	let sourceLabel: string;
	if (isFileWindows) {
		folderPrefix = env['APPDATA'];
		filePath = 'Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt';
		sourceLabel = `$APPDATA\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt`;
	} else {
		folderPrefix = env['HOME'];
		filePath = '.local/share/powershell/PSReadline/ConsoleHost_history.txt';
		sourceLabel = `~/${filePath}`;
	}
	const resolvedFile = await fetchFileContents(folderPrefix, filePath, isFileWindows, fileService, remoteAgentService);
	if (resolvedFile === undefined) {
		return undefined;
	}
	const fileLines = resolvedFile.content.split('\n');
	const result: Set<string> = new Set();
	let currentLine: string;
	let currentCommand: string | undefined = undefined;
	let wrapChar: string | undefined = undefined;
	for (let i = 0; i < fileLines.length; i++) {
		currentLine = fileLines[i];
		if (currentCommand === undefined) {
			currentCommand = currentLine;
		} else {
			currentCommand += `\n${currentLine}`;
		}
		if (!currentLine.endsWith('`')) {
			const sanitized = currentCommand.trim();
			if (sanitized.length > 0) {
				result.add(sanitized);
			}
			currentCommand = undefined;
			continue;
		}
		// If the line ends with `, the line may be wrapped. Need to also test the case where ` is
		// the last character in the line
		for (let c = 0; c < currentLine.length; c++) {
			if (wrapChar) {
				if (currentLine[c] === wrapChar) {
					wrapChar = undefined;
				}
			} else {
				if (currentLine[c].match(/`/)) {
					wrapChar = currentLine[c];
				}
			}
		}
		// Having an even number of backticks means the line is terminated
		// TODO: This doesn't cover more complicated cases where ` is within quotes
		if (!wrapChar) {
			const sanitized = currentCommand.trim();
			if (sanitized.length > 0) {
				result.add(sanitized);
			}
			currentCommand = undefined;
		} else {
			// Remove trailing backtick
			currentCommand = currentCommand.replace(/`$/, '');
			wrapChar = undefined;
		}
	}

	return {
		sourceLabel,
		sourceResource: resolvedFile.resource,
		commands: Array.from(result.values())
	};
}

export async function fetchFishHistory(accessor: ServicesAccessor): Promise<IShellFileHistoryEntry | undefined> {
	const fileService = accessor.get(IFileService);
	const remoteAgentService = accessor.get(IRemoteAgentService);
	const remoteEnvironment = await remoteAgentService.getEnvironment();
	if (remoteEnvironment?.os === OperatingSystem.Windows || !remoteEnvironment && isWindows) {
		return undefined;
	}

	/**
	 * From `fish` docs:
	 * > The command history is stored in the file ~/.local/share/fish/fish_history
	 *   (or $XDG_DATA_HOME/fish/fish_history if that variable is set) by default.
	 *
	 * (https://fishshell.com/docs/current/interactive.html#history-search)
	 */
	const overridenDataHome = env['XDG_DATA_HOME'];

	// TODO: Unchecked fish behavior:
	// What if XDG_DATA_HOME was defined but somehow $XDG_DATA_HOME/fish/fish_history
	// was not exist. Does fish fall back to ~/.local/share/fish/fish_history?

	let folderPrefix: string | undefined;
	let filePath: string;
	let sourceLabel: string;
	if (overridenDataHome) {
		sourceLabel = '$XDG_DATA_HOME/fish/fish_history';
		folderPrefix = env['XDG_DATA_HOME'];
		filePath = 'fish/fish_history';
	} else {
		sourceLabel = '~/.local/share/fish/fish_history';
		folderPrefix = env['HOME'];
		filePath = '.local/share/fish/fish_history';
	}
	const resolvedFile = await fetchFileContents(folderPrefix, filePath, false, fileService, remoteAgentService);
	if (resolvedFile === undefined) {
		return undefined;
	}

	/**
	 * These apply to `fish` v3.5.1:
	 * - It looks like YAML but it's not. It's, quoting, *"a broken psuedo-YAML"*.
	 *   See these discussions for more details:
	 *   - https://github.com/fish-shell/fish-shell/pull/6493
	 *   - https://github.com/fish-shell/fish-shell/issues/3341
	 * - Every record should exactly start with `- cmd:` (the whitespace between `-` and `cmd` cannot be replaced with tab)
	 * - Both `- cmd: echo 1` and `- cmd:echo 1` are valid entries.
	 * - Backslashes are esacped as `\\`.
	 * - Multiline commands are joined with a `\n` sequence, hence they're read as single line commands.
	 * - Property `when` is optional.
	 * - History navigation respects the records order and ignore the actual `when` property values (chronological order).
	 * - If `cmd` value is multiline , it just takes the first line. Also YAML operators like `>-` or `|-` are not supported.
	 */
	const result: Set<string> = new Set();
	const cmds = resolvedFile.content.split('\n')
		.filter(x => x.startsWith('- cmd:'))
		.map(x => x.substring(6).trimStart());
	for (let i = 0; i < cmds.length; i++) {
		const sanitized = sanitizeFishHistoryCmd(cmds[i]).trim();
		if (sanitized.length > 0) {
			result.add(sanitized);
		}
	}
	return {
		sourceLabel,
		sourceResource: resolvedFile.resource,
		commands: Array.from(result.values())
	};
}

export function sanitizeFishHistoryCmd(cmd: string): string {
	/**
	 * NOTE
	 * This repeatedReplace() call can be eliminated by using look-ahead
	 * caluses in the original RegExp pattern:
	 *
	 * >>> ```ts
	 * >>> cmds[i].replace(/(?<=^|[^\\])((?:\\\\)*)(\\n)/g, '$1\n')
	 * >>> ```
	 *
	 * But since not all browsers support look aheads we opted to a simple
	 * pattern and repeatedly calling replace method.
	 */
	return repeatedReplace(/(^|[^\\])((?:\\\\)*)(\\n)/g, cmd, '$1$2\n');
}

function repeatedReplace(pattern: RegExp, value: string, replaceValue: string): string {
	let last;
	let current = value;
	while (true) {
		last = current;
		current = current.replace(pattern, replaceValue);
		if (current === last) {
			return current;
		}
	}
}

async function fetchFileContents(
	folderPrefix: string | undefined,
	filePath: string,
	isFileWindows: boolean,
	fileService: Pick<IFileService, 'readFile'>,
	remoteAgentService: Pick<IRemoteAgentService, 'getConnection'>,
): Promise<{ resource: URI; content: string } | undefined> {
	if (!folderPrefix) {
		return undefined;
	}
	const connection = remoteAgentService.getConnection();
	const isRemote = !!connection?.remoteAuthority;
	const resource = URI.from({
		scheme: isRemote ? Schemas.vscodeRemote : Schemas.file,
		authority: isRemote ? connection.remoteAuthority : undefined,
		path: URI.file(join(folderPrefix, filePath)).path
	});
	let content: IFileContent;
	try {
		content = await fileService.readFile(resource);
	} catch (e: unknown) {
		// Handle file not found only
		if (e instanceof FileOperationError && e.fileOperationResult === FileOperationResult.FILE_NOT_FOUND) {
			return undefined;
		}
		throw e;
	}
	if (content === undefined) {
		return undefined;
	}
	return {
		resource,
		content: content.value.toString()
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/history/common/terminal.history.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/history/common/terminal.history.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IStringDictionary } from '../../../../../base/common/collections.js';
import { localize } from '../../../../../nls.js';
import type { IConfigurationPropertySchema } from '../../../../../platform/configuration/common/configurationRegistry.js';

export const enum TerminalHistoryCommandId {
	ClearPreviousSessionHistory = 'workbench.action.terminal.clearPreviousSessionHistory',
	GoToRecentDirectory = 'workbench.action.terminal.goToRecentDirectory',
	RunRecentCommand = 'workbench.action.terminal.runRecentCommand',
}

export const defaultTerminalHistoryCommandsToSkipShell = [
	TerminalHistoryCommandId.GoToRecentDirectory,
	TerminalHistoryCommandId.RunRecentCommand
];

export const enum TerminalHistorySettingId {
	ShellIntegrationCommandHistory = 'terminal.integrated.shellIntegration.history',
}

export const terminalHistoryConfiguration: IStringDictionary<IConfigurationPropertySchema> = {
	[TerminalHistorySettingId.ShellIntegrationCommandHistory]: {
		restricted: true,
		markdownDescription: localize('terminal.integrated.shellIntegration.history', "Controls the number of recently used commands to keep in the terminal command history. Set to 0 to disable terminal command history."),
		type: 'number',
		default: 100
	},
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/history/test/common/history.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/history/test/common/history.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual, strictEqual, ok } from 'assert';
import { VSBuffer } from '../../../../../../base/common/buffer.js';
import { Schemas } from '../../../../../../base/common/network.js';
import { join } from '../../../../../../base/common/path.js';
import { isWindows, OperatingSystem } from '../../../../../../base/common/platform.js';
import { env } from '../../../../../../base/common/process.js';
import { URI } from '../../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IFileService } from '../../../../../../platform/files/common/files.js';
import { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IRemoteAgentEnvironment } from '../../../../../../platform/remote/common/remoteAgentEnvironment.js';
import { IStorageService } from '../../../../../../platform/storage/common/storage.js';
import { IRemoteAgentConnection, IRemoteAgentService } from '../../../../../services/remote/common/remoteAgentService.js';
import { TestStorageService } from '../../../../../test/common/workbenchTestServices.js';
import { fetchBashHistory, fetchFishHistory, fetchPwshHistory, fetchZshHistory, sanitizeFishHistoryCmd, TerminalPersistedHistory, type ITerminalPersistedHistory } from '../../common/history.js';

function getConfig(limit: number) {
	return {
		terminal: {
			integrated: {
				shellIntegration: {
					history: limit
				}
			}
		}
	};
}

const expectedCommands = [
	'single line command',
	'git commit -m "A wrapped line in pwsh history\n\nSome commit description\n\nFixes #xyz"',
	'git status',
	'two "\nline"'
];

suite('Terminal history', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	suite('TerminalPersistedHistory', () => {
		let history: ITerminalPersistedHistory<number>;
		let instantiationService: TestInstantiationService;
		let configurationService: TestConfigurationService;

		setup(() => {
			configurationService = new TestConfigurationService(getConfig(5));
			instantiationService = store.add(new TestInstantiationService());
			instantiationService.set(IConfigurationService, configurationService);
			instantiationService.set(IStorageService, store.add(new TestStorageService()));

			history = store.add(instantiationService.createInstance(TerminalPersistedHistory<number>, 'test'));
		});

		teardown(() => {
			instantiationService.dispose();
		});

		test('should support adding items to the cache and respect LRU', () => {
			history.add('foo', 1);
			deepStrictEqual(Array.from(history.entries), [
				['foo', 1]
			]);
			history.add('bar', 2);
			deepStrictEqual(Array.from(history.entries), [
				['foo', 1],
				['bar', 2]
			]);
			history.add('foo', 1);
			deepStrictEqual(Array.from(history.entries), [
				['bar', 2],
				['foo', 1]
			]);
		});

		test('should support removing specific items', () => {
			history.add('1', 1);
			history.add('2', 2);
			history.add('3', 3);
			history.add('4', 4);
			history.add('5', 5);
			strictEqual(Array.from(history.entries).length, 5);
			history.add('6', 6);
			strictEqual(Array.from(history.entries).length, 5);
		});

		test('should limit the number of entries based on config', () => {
			history.add('1', 1);
			history.add('2', 2);
			history.add('3', 3);
			history.add('4', 4);
			history.add('5', 5);
			strictEqual(Array.from(history.entries).length, 5);
			history.add('6', 6);
			strictEqual(Array.from(history.entries).length, 5);
			configurationService.setUserConfiguration('terminal', getConfig(2).terminal);
			// eslint-disable-next-line local/code-no-any-casts
			configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true } as any);
			strictEqual(Array.from(history.entries).length, 2);
			history.add('7', 7);
			strictEqual(Array.from(history.entries).length, 2);
			configurationService.setUserConfiguration('terminal', getConfig(3).terminal);
			// eslint-disable-next-line local/code-no-any-casts
			configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true } as any);
			strictEqual(Array.from(history.entries).length, 2);
			history.add('8', 8);
			strictEqual(Array.from(history.entries).length, 3);
			history.add('9', 9);
			strictEqual(Array.from(history.entries).length, 3);
		});

		test('should reload from storage service after recreation', () => {
			history.add('1', 1);
			history.add('2', 2);
			history.add('3', 3);
			strictEqual(Array.from(history.entries).length, 3);
			const history2 = store.add(instantiationService.createInstance(TerminalPersistedHistory, 'test'));
			strictEqual(Array.from(history2.entries).length, 3);
		});
	});
	suite('fetchBashHistory', () => {
		let fileScheme: string;
		let filePath: string;
		const fileContent: string = [
			'single line command',
			'git commit -m "A wrapped line in pwsh history',
			'',
			'Some commit description',
			'',
			'Fixes #xyz"',
			'git status',
			'two "',
			'line"'
		].join('\n');

		let instantiationService: TestInstantiationService;
		let remoteConnection: Pick<IRemoteAgentConnection, 'remoteAuthority'> | null = null;
		let remoteEnvironment: Pick<IRemoteAgentEnvironment, 'os'> | null = null;

		setup(() => {
			instantiationService = new TestInstantiationService();
			instantiationService.stub(IFileService, {
				async readFile(resource: URI) {
					const expected = URI.from({ scheme: fileScheme, path: filePath });
					strictEqual(resource.scheme, expected.scheme);
					strictEqual(resource.path, expected.path);
					return { value: VSBuffer.fromString(fileContent) };
				}
			} as Pick<IFileService, 'readFile'>);
			instantiationService.stub(IRemoteAgentService, {
				async getEnvironment() { return remoteEnvironment; },
				getConnection() { return remoteConnection; }
			} as Pick<IRemoteAgentService, 'getConnection' | 'getEnvironment'>);
		});

		teardown(() => {
			instantiationService.dispose();
		});

		if (!isWindows) {
			suite('local', () => {
				let originalEnvValues: { HOME: string | undefined };
				setup(() => {
					originalEnvValues = { HOME: env['HOME'] };
					env['HOME'] = '/home/user';
					remoteConnection = { remoteAuthority: 'some-remote' };
					fileScheme = Schemas.vscodeRemote;
					filePath = '/home/user/.bash_history';
				});
				teardown(() => {
					if (originalEnvValues['HOME'] === undefined) {
						delete env['HOME'];
					} else {
						env['HOME'] = originalEnvValues['HOME'];
					}
				});
				test('current OS', async () => {
					filePath = '/home/user/.bash_history';
					deepStrictEqual((await instantiationService.invokeFunction(fetchBashHistory))!.commands, expectedCommands);
				});
			});
		}
		suite('remote', () => {
			let originalEnvValues: { HOME: string | undefined };
			setup(() => {
				originalEnvValues = { HOME: env['HOME'] };
				env['HOME'] = '/home/user';
				remoteConnection = { remoteAuthority: 'some-remote' };
				fileScheme = Schemas.vscodeRemote;
				filePath = '/home/user/.bash_history';
			});
			teardown(() => {
				if (originalEnvValues['HOME'] === undefined) {
					delete env['HOME'];
				} else {
					env['HOME'] = originalEnvValues['HOME'];
				}
			});
			test('Windows', async () => {
				remoteEnvironment = { os: OperatingSystem.Windows };
				strictEqual(await instantiationService.invokeFunction(fetchBashHistory), undefined);
			});
			test('macOS', async () => {
				remoteEnvironment = { os: OperatingSystem.Macintosh };
				deepStrictEqual((await instantiationService.invokeFunction(fetchBashHistory))!.commands, expectedCommands);
			});
			test('Linux', async () => {
				remoteEnvironment = { os: OperatingSystem.Linux };
				deepStrictEqual((await instantiationService.invokeFunction(fetchBashHistory))!.commands, expectedCommands);
			});
		});
	});
	suite('fetchZshHistory', () => {
		let fileScheme: string;
		let filePath: string;
		const fileContentType = [
			{
				type: 'simple',
				content: [
					'single line command',
					'git commit -m "A wrapped line in pwsh history\\',
					'\\',
					'Some commit description\\',
					'\\',
					'Fixes #xyz"',
					'git status',
					'two "\\',
					'line"'
				].join('\n')
			},
			{
				type: 'extended',
				content: [
					': 1655252330:0;single line command',
					': 1655252330:0;git commit -m "A wrapped line in pwsh history\\',
					'\\',
					'Some commit description\\',
					'\\',
					'Fixes #xyz"',
					': 1655252330:0;git status',
					': 1655252330:0;two "\\',
					'line"'
				].join('\n')
			},
		];

		let instantiationService: TestInstantiationService;
		let remoteConnection: Pick<IRemoteAgentConnection, 'remoteAuthority'> | null = null;
		let remoteEnvironment: Pick<IRemoteAgentEnvironment, 'os'> | null = null;

		for (const { type, content } of fileContentType) {
			suite(type, () => {
				setup(() => {
					instantiationService = new TestInstantiationService();
					instantiationService.stub(IFileService, {
						async readFile(resource: URI) {
							const expected = URI.from({ scheme: fileScheme, path: filePath });
							strictEqual(resource.scheme, expected.scheme);
							strictEqual(resource.path, expected.path);
							return { value: VSBuffer.fromString(content) };
						}
					} as Pick<IFileService, 'readFile'>);
					instantiationService.stub(IRemoteAgentService, {
						async getEnvironment() { return remoteEnvironment; },
						getConnection() { return remoteConnection; }
					} as Pick<IRemoteAgentService, 'getConnection' | 'getEnvironment'>);
				});

				teardown(() => {
					instantiationService.dispose();
				});

				if (!isWindows) {
					suite('local', () => {
						let originalEnvValues: { HOME: string | undefined };
						setup(() => {
							originalEnvValues = { HOME: env['HOME'] };
							env['HOME'] = '/home/user';
							remoteConnection = { remoteAuthority: 'some-remote' };
							fileScheme = Schemas.vscodeRemote;
							filePath = '/home/user/.bash_history';
						});
						teardown(() => {
							if (originalEnvValues['HOME'] === undefined) {
								delete env['HOME'];
							} else {
								env['HOME'] = originalEnvValues['HOME'];
							}
						});
						test('current OS', async () => {
							filePath = '/home/user/.zsh_history';
							deepStrictEqual((await instantiationService.invokeFunction(fetchZshHistory))!.commands, expectedCommands);
						});
					});
				}
				suite('remote', () => {
					let originalEnvValues: { HOME: string | undefined };
					setup(() => {
						originalEnvValues = { HOME: env['HOME'] };
						env['HOME'] = '/home/user';
						remoteConnection = { remoteAuthority: 'some-remote' };
						fileScheme = Schemas.vscodeRemote;
						filePath = '/home/user/.zsh_history';
					});
					teardown(() => {
						if (originalEnvValues['HOME'] === undefined) {
							delete env['HOME'];
						} else {
							env['HOME'] = originalEnvValues['HOME'];
						}
					});
					test('Windows', async () => {
						remoteEnvironment = { os: OperatingSystem.Windows };
						strictEqual(await instantiationService.invokeFunction(fetchZshHistory), undefined);
					});
					test('macOS', async () => {
						remoteEnvironment = { os: OperatingSystem.Macintosh };
						deepStrictEqual((await instantiationService.invokeFunction(fetchZshHistory))!.commands, expectedCommands);
					});
					test('Linux', async () => {
						remoteEnvironment = { os: OperatingSystem.Linux };
						deepStrictEqual((await instantiationService.invokeFunction(fetchZshHistory))!.commands, expectedCommands);
					});
				});
			});
		}
	});
	suite('fetchPwshHistory', () => {
		let fileScheme: string;
		let filePath: string;
		const fileContent: string = [
			'single line command',
			'git commit -m "A wrapped line in pwsh history`',
			'`',
			'Some commit description`',
			'`',
			'Fixes #xyz"',
			'git status',
			'two "`',
			'line"'
		].join('\n');

		let instantiationService: TestInstantiationService;
		let remoteConnection: Pick<IRemoteAgentConnection, 'remoteAuthority'> | null = null;
		let remoteEnvironment: Pick<IRemoteAgentEnvironment, 'os'> | null = null;

		setup(() => {
			instantiationService = new TestInstantiationService();
			instantiationService.stub(IFileService, {
				async readFile(resource: URI) {
					const expected = URI.from({
						scheme: fileScheme,
						authority: remoteConnection?.remoteAuthority,
						path: URI.file(filePath).path
					});
					// Sanitize the encoded `/` chars as they don't impact behavior
					strictEqual(resource.toString().replaceAll('%5C', '/'), expected.toString().replaceAll('%5C', '/'));
					return { value: VSBuffer.fromString(fileContent) };
				}
			} as Pick<IFileService, 'readFile'>);
			instantiationService.stub(IRemoteAgentService, {
				async getEnvironment() { return remoteEnvironment; },
				getConnection() { return remoteConnection; }
			} as Pick<IRemoteAgentService, 'getConnection' | 'getEnvironment'>);
		});

		teardown(() => {
			instantiationService.dispose();
		});

		suite('local', () => {
			let originalEnvValues: { HOME: string | undefined; APPDATA: string | undefined };
			setup(() => {
				originalEnvValues = { HOME: env['HOME'], APPDATA: env['APPDATA'] };
				env['HOME'] = '/home/user';
				env['APPDATA'] = 'C:\\AppData';
				remoteConnection = { remoteAuthority: 'some-remote' };
				fileScheme = Schemas.vscodeRemote;
				filePath = '/home/user/.zsh_history';
				originalEnvValues = { HOME: env['HOME'], APPDATA: env['APPDATA'] };
			});
			teardown(() => {
				if (originalEnvValues['HOME'] === undefined) {
					delete env['HOME'];
				} else {
					env['HOME'] = originalEnvValues['HOME'];
				}
				if (originalEnvValues['APPDATA'] === undefined) {
					delete env['APPDATA'];
				} else {
					env['APPDATA'] = originalEnvValues['APPDATA'];
				}
			});
			test('current OS', async () => {
				if (isWindows) {
					filePath = join(env['APPDATA']!, 'Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt');
				} else {
					filePath = join(env['HOME']!, '.local/share/powershell/PSReadline/ConsoleHost_history.txt');
				}
				deepStrictEqual((await instantiationService.invokeFunction(fetchPwshHistory))!.commands, expectedCommands);
			});
		});
		suite('remote', () => {
			let originalEnvValues: { HOME: string | undefined; APPDATA: string | undefined };
			setup(() => {
				remoteConnection = { remoteAuthority: 'some-remote' };
				fileScheme = Schemas.vscodeRemote;
				originalEnvValues = { HOME: env['HOME'], APPDATA: env['APPDATA'] };
			});
			teardown(() => {
				if (originalEnvValues['HOME'] === undefined) {
					delete env['HOME'];
				} else {
					env['HOME'] = originalEnvValues['HOME'];
				}
				if (originalEnvValues['APPDATA'] === undefined) {
					delete env['APPDATA'];
				} else {
					env['APPDATA'] = originalEnvValues['APPDATA'];
				}
			});
			test('Windows', async () => {
				remoteEnvironment = { os: OperatingSystem.Windows };
				env['APPDATA'] = 'C:\\AppData';
				filePath = 'C:\\AppData\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt';
				deepStrictEqual((await instantiationService.invokeFunction(fetchPwshHistory))!.commands, expectedCommands);
			});
			test('macOS', async () => {
				remoteEnvironment = { os: OperatingSystem.Macintosh };
				env['HOME'] = '/home/user';
				filePath = '/home/user/.local/share/powershell/PSReadline/ConsoleHost_history.txt';
				deepStrictEqual((await instantiationService.invokeFunction(fetchPwshHistory))!.commands, expectedCommands);
			});
			test('Linux', async () => {
				remoteEnvironment = { os: OperatingSystem.Linux };
				env['HOME'] = '/home/user';
				filePath = '/home/user/.local/share/powershell/PSReadline/ConsoleHost_history.txt';
				deepStrictEqual((await instantiationService.invokeFunction(fetchPwshHistory))!.commands, expectedCommands);
			});
		});
	});
	suite('fetchFishHistory', () => {
		let fileScheme: string;
		let filePath: string;
		const fileContent: string = [
			'- cmd: single line command',
			'  when: 1650000000',
			'- cmd: git commit -m "A wrapped line in pwsh history\\n\\nSome commit description\\n\\nFixes #xyz"',
			'  when: 1650000010',
			'- cmd: git status',
			'  when: 1650000020',
			'- cmd: two "\\nline"',
			'  when: 1650000030',
		].join('\n');

		let instantiationService: TestInstantiationService;
		let remoteConnection: Pick<IRemoteAgentConnection, 'remoteAuthority'> | null = null;
		let remoteEnvironment: Pick<IRemoteAgentEnvironment, 'os'> | null = null;

		setup(() => {
			instantiationService = new TestInstantiationService();
			instantiationService.stub(IFileService, {
				async readFile(resource: URI) {
					const expected = URI.from({ scheme: fileScheme, path: filePath });
					strictEqual(resource.scheme, expected.scheme);
					strictEqual(resource.path, expected.path);
					return { value: VSBuffer.fromString(fileContent) };
				}
			} as Pick<IFileService, 'readFile'>);
			instantiationService.stub(IRemoteAgentService, {
				async getEnvironment() { return remoteEnvironment; },
				getConnection() { return remoteConnection; }
			} as Pick<IRemoteAgentService, 'getConnection' | 'getEnvironment'>);
		});

		teardown(() => {
			instantiationService.dispose();
		});

		if (!isWindows) {
			suite('local', () => {
				let originalEnvValues: { HOME: string | undefined };
				setup(() => {
					originalEnvValues = { HOME: env['HOME'] };
					env['HOME'] = '/home/user';
					remoteConnection = { remoteAuthority: 'some-remote' };
					fileScheme = Schemas.vscodeRemote;
					filePath = '/home/user/.local/share/fish/fish_history';
				});
				teardown(() => {
					if (originalEnvValues['HOME'] === undefined) {
						delete env['HOME'];
					} else {
						env['HOME'] = originalEnvValues['HOME'];
					}
				});
				test('current OS', async () => {
					filePath = '/home/user/.local/share/fish/fish_history';
					deepStrictEqual((await instantiationService.invokeFunction(fetchFishHistory))!.commands, expectedCommands);
				});
			});

			suite('local (overriden path)', () => {
				let originalEnvValues: { XDG_DATA_HOME: string | undefined };
				setup(() => {
					originalEnvValues = { XDG_DATA_HOME: env['XDG_DATA_HOME'] };
					env['XDG_DATA_HOME'] = '/home/user/data-home';
					remoteConnection = { remoteAuthority: 'some-remote' };
					fileScheme = Schemas.vscodeRemote;
					filePath = '/home/user/data-home/fish/fish_history';
				});
				teardown(() => {
					if (originalEnvValues['XDG_DATA_HOME'] === undefined) {
						delete env['XDG_DATA_HOME'];
					} else {
						env['XDG_DATA_HOME'] = originalEnvValues['XDG_DATA_HOME'];
					}
				});
				test('current OS', async () => {
					filePath = '/home/user/data-home/fish/fish_history';
					deepStrictEqual((await instantiationService.invokeFunction(fetchFishHistory))!.commands, expectedCommands);
				});
			});
		}
		suite('remote', () => {
			let originalEnvValues: { HOME: string | undefined };
			setup(() => {
				originalEnvValues = { HOME: env['HOME'] };
				env['HOME'] = '/home/user';
				remoteConnection = { remoteAuthority: 'some-remote' };
				fileScheme = Schemas.vscodeRemote;
				filePath = '/home/user/.local/share/fish/fish_history';
			});
			teardown(() => {
				if (originalEnvValues['HOME'] === undefined) {
					delete env['HOME'];
				} else {
					env['HOME'] = originalEnvValues['HOME'];
				}
			});
			test('Windows', async () => {
				remoteEnvironment = { os: OperatingSystem.Windows };
				strictEqual(await instantiationService.invokeFunction(fetchFishHistory), undefined);
			});
			test('macOS', async () => {
				remoteEnvironment = { os: OperatingSystem.Macintosh };
				deepStrictEqual((await instantiationService.invokeFunction(fetchFishHistory))!.commands, expectedCommands);
			});
			test('Linux', async () => {
				remoteEnvironment = { os: OperatingSystem.Linux };
				deepStrictEqual((await instantiationService.invokeFunction(fetchFishHistory))!.commands, expectedCommands);
			});
		});

		suite('remote (overriden path)', () => {
			let originalEnvValues: { XDG_DATA_HOME: string | undefined };
			setup(() => {
				originalEnvValues = { XDG_DATA_HOME: env['XDG_DATA_HOME'] };
				env['XDG_DATA_HOME'] = '/home/user/data-home';
				remoteConnection = { remoteAuthority: 'some-remote' };
				fileScheme = Schemas.vscodeRemote;
				filePath = '/home/user/data-home/fish/fish_history';
			});
			teardown(() => {
				if (originalEnvValues['XDG_DATA_HOME'] === undefined) {
					delete env['XDG_DATA_HOME'];
				} else {
					env['XDG_DATA_HOME'] = originalEnvValues['XDG_DATA_HOME'];
				}
			});
			test('Windows', async () => {
				remoteEnvironment = { os: OperatingSystem.Windows };
				strictEqual(await instantiationService.invokeFunction(fetchFishHistory), undefined);
			});
			test('macOS', async () => {
				remoteEnvironment = { os: OperatingSystem.Macintosh };
				deepStrictEqual((await instantiationService.invokeFunction(fetchFishHistory))!.commands, expectedCommands);
			});
			test('Linux', async () => {
				remoteEnvironment = { os: OperatingSystem.Linux };
				deepStrictEqual((await instantiationService.invokeFunction(fetchFishHistory))!.commands, expectedCommands);
			});
		});

		suite('sanitizeFishHistoryCmd', () => {
			test('valid new-lines', () => {
				/**
				 * Valid new-lines have odd number of leading backslashes: \n, \\\n, \\\\\n
				 */
				const cases = [
					'\\n',
					'\\n at start',
					'some \\n in the middle',
					'at the end \\n',
					'\\\\\\n',
					'\\\\\\n valid at start',
					'valid \\\\\\n in the middle',
					'valid in the end \\\\\\n',
					'\\\\\\\\\\n',
					'\\\\\\\\\\n valid at start',
					'valid \\\\\\\\\\n in the middle',
					'valid in the end \\\\\\\\\\n',
					'mixed valid \\r\\n',
					'mixed valid \\\\\\r\\n',
					'mixed valid \\r\\\\\\n',
				];

				for (const x of cases) {
					ok(sanitizeFishHistoryCmd(x).includes('\n'));
				}
			});

			test('invalid new-lines', () => {
				/**
				 * Invalid new-lines have even number of leading backslashes: \\n, \\\\n, \\\\\\n
				 */
				const cases = [
					'\\\\n',
					'\\\\n invalid at start',
					'invalid \\\\n in the middle',
					'invalid in the end \\\\n',
					'\\\\\\\\n',
					'\\\\\\\\n invalid at start',
					'invalid \\\\\\\\n in the middle',
					'invalid in the end \\\\\\\\n',
					'mixed invalid \\r\\\\n',
					'mixed invalid \\r\\\\\\\\n',
					'echo "\\\\n"',
				];

				for (const x of cases) {
					ok(!sanitizeFishHistoryCmd(x).includes('\n'));
				}
			});

		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/links/browser/links.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/browser/links.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IBufferLine, IBufferRange, Terminal } from '@xterm/xterm';
import { URI } from '../../../../../base/common/uri.js';
import { createDecorator } from '../../../../../platform/instantiation/common/instantiation.js';
import { ITerminalProcessManager } from '../../../terminal/common/terminal.js';
import { IParsedLink } from './terminalLinkParsing.js';
import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { ITerminalExternalLinkProvider } from '../../../terminal/browser/terminal.js';
import { Event } from '../../../../../base/common/event.js';
import { ITerminalBackend } from '../../../../../platform/terminal/common/terminal.js';
import { ITextEditorSelection } from '../../../../../platform/editor/common/editor.js';
import type { IHoverAction } from '../../../../../base/browser/ui/hover/hover.js';
import type { MaybePromise } from '../../../../../base/common/async.js';

export const ITerminalLinkProviderService = createDecorator<ITerminalLinkProviderService>('terminalLinkProviderService');
export interface ITerminalLinkProviderService {
	readonly _serviceBrand: undefined;

	readonly linkProviders: ReadonlySet<ITerminalExternalLinkProvider>;

	readonly onDidAddLinkProvider: Event<ITerminalExternalLinkProvider>;
	readonly onDidRemoveLinkProvider: Event<ITerminalExternalLinkProvider>;

	// TODO: Currently only a single link provider is supported; the one registered by the ext host
	registerLinkProvider(provider: ITerminalExternalLinkProvider): IDisposable;
}

export interface ITerminalLinkResolver {
	resolveLink(processManager: Pick<ITerminalProcessManager, 'initialCwd' | 'os' | 'remoteAuthority' | 'userHome'> & { backend?: Pick<ITerminalBackend, 'getWslPath'> }, link: string, uri?: URI): Promise<ResolvedLink>;
}

/**
 * A link detector can search for and return links within the xterm.js buffer. A single link
 * detector can return multiple links of differing types.
 */
export interface ITerminalLinkDetector {
	/**
	 * The xterm.js instance this detector belongs to.
	 */
	readonly xterm: Terminal;

	/**
	 * The maximum link length possible for this detector, this puts a cap on how much of a wrapped
	 * line to consider to prevent performance problems.
	 */
	readonly maxLinkLength: number;

	/**
	 * Detects links within the _wrapped_ line range provided and returns them as an array.
	 *
	 * @param lines The individual buffer lines that make up the wrapped line.
	 * @param startLine The start of the wrapped line. This _will not_ be validated that it is
	 * indeed the start of a wrapped line.
	 * @param endLine The end of the wrapped line.  This _will not_ be validated that it is indeed
	 * the end of a wrapped line.
	 */
	detect(lines: IBufferLine[], startLine: number, endLine: number): MaybePromise<ITerminalSimpleLink[]>;
}

export interface ITerminalSimpleLink {
	/**
	 * The text of the link.
	 */
	text: string;

	parsedLink?: IParsedLink;

	/**
	 * The buffer range of the link.
	 */
	readonly bufferRange: IBufferRange;

	/**
	 * The type of link, which determines how it is handled when activated.
	 */
	readonly type: TerminalLinkType;

	/**
	 * The URI of the link if it has been resolved.
	 */
	uri?: URI;

	/**
	 * An optional full line to be used for context when resolving.
	 */
	contextLine?: string;

	/**
	 * The location or selection range of the link.
	 */
	selection?: ITextEditorSelection;

	/**
	 * Whether to trim a trailing colon at the end of a path.
	 */
	disableTrimColon?: boolean;

	/**
	 * A hover label to override the default for the type.
	 */
	label?: string;

	/**
	 * An optional set of actions to show in the hover's status bar.
	 */
	actions?: IHoverAction[];

	/**
	 * An optional method to call when the link is activated. This should be used when there is are
	 * no registered opener for this link type.
	 */
	activate?(text: string): void;
}

export type TerminalLinkType = TerminalBuiltinLinkType | ITerminalExternalLinkType;

export const enum TerminalBuiltinLinkType {
	/**
	 * The link is validated to be a file on the file system and will open an editor.
	 */
	LocalFile = 'LocalFile',

	/**
	 * The link is validated to be a folder on the file system and is outside the workspace. It will
	 * reveal the folder within the explorer.
	 */
	LocalFolderOutsideWorkspace = 'LocalFolderOutsideWorkspace',

	/**
	 * The link is validated to be a folder on the file system and is within the workspace and will
	 * reveal the folder within the explorer.
	 */
	LocalFolderInWorkspace = 'LocalFolderInWorkspace',

	/**
	 * A low confidence link which will search for the file in the workspace. If there is a single
	 * match, it will open the file; otherwise, it will present the matches in a quick pick.
	 */
	Search = 'Search',

	/**
	 * A link whose text is a valid URI.
	 */
	Url = 'Url'
}

export interface ITerminalExternalLinkType {
	id: string;
}

export interface ITerminalLinkOpener {
	open(link: ITerminalSimpleLink): Promise<void>;
}

export type ResolvedLink = IResolvedValidLink | null;

export interface IResolvedValidLink {
	uri: URI;
	link: string;
	isDirectory: boolean;
}

// Suppress as the any type is being removed anyway
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/links/browser/terminal.links.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/browser/terminal.links.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Terminal as RawXtermTerminal } from '@xterm/xterm';
import { Event } from '../../../../../base/common/event.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { localize2 } from '../../../../../nls.js';
import { AccessibleViewProviderId } from '../../../../../platform/accessibility/browser/accessibleView.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { InstantiationType, registerSingleton } from '../../../../../platform/instantiation/common/extensions.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { accessibleViewCurrentProviderId, accessibleViewIsShown } from '../../../accessibility/browser/accessibilityConfiguration.js';
import { ITerminalContribution, ITerminalInstance, IXtermTerminal, isDetachedTerminalInstance } from '../../../terminal/browser/terminal.js';
import { registerActiveInstanceAction } from '../../../terminal/browser/terminalActions.js';
import { registerTerminalContribution, type IDetachedCompatibleTerminalContributionContext, type ITerminalContributionContext } from '../../../terminal/browser/terminalExtensions.js';
import { isTerminalProcessManager } from '../../../terminal/common/terminal.js';
import { TerminalContextKeys } from '../../../terminal/common/terminalContextKey.js';
import { terminalStrings } from '../../../terminal/common/terminalStrings.js';
import { TerminalLinksCommandId } from '../common/terminal.links.js';
import { ITerminalLinkProviderService } from './links.js';
import { IDetectedLinks, TerminalLinkManager } from './terminalLinkManager.js';
import { TerminalLinkProviderService } from './terminalLinkProviderService.js';
import { TerminalLinkQuickpick } from './terminalLinkQuickpick.js';
import { TerminalLinkResolver } from './terminalLinkResolver.js';

// #region Services

registerSingleton(ITerminalLinkProviderService, TerminalLinkProviderService, InstantiationType.Delayed);

// #endregion

// #region Terminal Contributions

class TerminalLinkContribution extends DisposableStore implements ITerminalContribution {
	static readonly ID = 'terminal.link';

	static get(instance: ITerminalInstance): TerminalLinkContribution | null {
		return instance.getContribution<TerminalLinkContribution>(TerminalLinkContribution.ID);
	}

	private _linkManager: TerminalLinkManager | undefined;
	private _terminalLinkQuickpick: TerminalLinkQuickpick | undefined;
	private _linkResolver: TerminalLinkResolver;

	constructor(
		private readonly _ctx: ITerminalContributionContext | IDetachedCompatibleTerminalContributionContext,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ITerminalLinkProviderService private readonly _terminalLinkProviderService: ITerminalLinkProviderService,
	) {
		super();
		this._linkResolver = this._instantiationService.createInstance(TerminalLinkResolver);
	}

	xtermReady(xterm: IXtermTerminal & { raw: RawXtermTerminal }): void {
		const linkManager = this._linkManager = this.add(this._instantiationService.createInstance(TerminalLinkManager, xterm.raw, this._ctx.processManager, this._ctx.instance.capabilities, this._linkResolver));

		// Set widget manager
		if (isTerminalProcessManager(this._ctx.processManager)) {
			const disposable = linkManager.add(Event.once(this._ctx.processManager.onProcessReady)(() => {
				linkManager.setWidgetManager(this._ctx.widgetManager);
				this.delete(disposable);
			}));
		} else {
			linkManager.setWidgetManager(this._ctx.widgetManager);
		}

		// Attach the external link provider to the instance and listen for changes
		if (!isDetachedTerminalInstance(this._ctx.instance)) {
			for (const linkProvider of this._terminalLinkProviderService.linkProviders) {
				linkManager.externalProvideLinksCb = linkProvider.provideLinks.bind(linkProvider, this._ctx.instance);
			}
			linkManager.add(this._terminalLinkProviderService.onDidAddLinkProvider(e => {
				linkManager.externalProvideLinksCb = e.provideLinks.bind(e, this._ctx.instance as ITerminalInstance);
			}));
		}
		linkManager.add(this._terminalLinkProviderService.onDidRemoveLinkProvider(() => linkManager.externalProvideLinksCb = undefined));
	}

	async showLinkQuickpick(extended?: boolean): Promise<void> {
		if (!this._terminalLinkQuickpick) {
			this._terminalLinkQuickpick = this.add(this._instantiationService.createInstance(TerminalLinkQuickpick));
			this._terminalLinkQuickpick.onDidRequestMoreLinks(() => {
				this.showLinkQuickpick(true);
			});
		}
		const links = await this._getLinks();
		return await this._terminalLinkQuickpick.show(this._ctx.instance, links);
	}

	private async _getLinks(): Promise<{ viewport: IDetectedLinks; all: Promise<IDetectedLinks> }> {
		if (!this._linkManager) {
			throw new Error('terminal links are not ready, cannot generate link quick pick');
		}
		return this._linkManager.getLinks();
	}

	async openRecentLink(type: 'localFile' | 'url'): Promise<void> {
		if (!this._linkManager) {
			throw new Error('terminal links are not ready, cannot open a link');
		}
		this._linkManager.openRecentLink(type);
	}
}

registerTerminalContribution(TerminalLinkContribution.ID, TerminalLinkContribution, true);

// #endregion

// #region Actions

const category = terminalStrings.actionCategory;

registerActiveInstanceAction({
	id: TerminalLinksCommandId.OpenDetectedLink,
	title: localize2('workbench.action.terminal.openDetectedLink', 'Open Detected Link...'),
	f1: true,
	category,
	precondition: TerminalContextKeys.terminalHasBeenCreated,
	keybinding: [{
		primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyO,
		weight: KeybindingWeight.WorkbenchContrib + 1,
		when: TerminalContextKeys.focus
	}, {
		primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyG,
		weight: KeybindingWeight.WorkbenchContrib + 1,
		when: ContextKeyExpr.and(accessibleViewIsShown, ContextKeyExpr.equals(accessibleViewCurrentProviderId.key, AccessibleViewProviderId.Terminal))
	},
	],
	run: (activeInstance) => TerminalLinkContribution.get(activeInstance)?.showLinkQuickpick()
});
registerActiveInstanceAction({
	id: TerminalLinksCommandId.OpenWebLink,
	title: localize2('workbench.action.terminal.openLastUrlLink', 'Open Last URL Link'),
	metadata: {
		description: localize2('workbench.action.terminal.openLastUrlLink.description', 'Opens the last detected URL/URI link in the terminal')
	},
	f1: true,
	category,
	precondition: TerminalContextKeys.terminalHasBeenCreated,
	run: (activeInstance) => TerminalLinkContribution.get(activeInstance)?.openRecentLink('url')
});
registerActiveInstanceAction({
	id: TerminalLinksCommandId.OpenFileLink,
	title: localize2('workbench.action.terminal.openLastLocalFileLink', 'Open Last Local File Link'),
	f1: true,
	category,
	precondition: TerminalContextKeys.terminalHasBeenCreated,
	run: (activeInstance) => TerminalLinkContribution.get(activeInstance)?.openRecentLink('localFile')
});

// #endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/links/browser/terminalExternalLinkDetector.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/browser/terminalExternalLinkDetector.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITerminalLinkDetector, ITerminalSimpleLink, OmitFirstArg } from './links.js';
import { convertLinkRangeToBuffer, getXtermLineContent } from './terminalLinkHelpers.js';
import { ITerminalExternalLinkProvider } from '../../../terminal/browser/terminal.js';
import type { IBufferLine, Terminal } from '@xterm/xterm';

export class TerminalExternalLinkDetector implements ITerminalLinkDetector {
	readonly maxLinkLength = 2000;

	constructor(
		readonly id: string,
		readonly xterm: Terminal,
		private readonly _provideLinks: OmitFirstArg<ITerminalExternalLinkProvider['provideLinks']>
	) {
	}

	async detect(lines: IBufferLine[], startLine: number, endLine: number): Promise<ITerminalSimpleLink[]> {
		// Get the text representation of the wrapped line
		const text = getXtermLineContent(this.xterm.buffer.active, startLine, endLine, this.xterm.cols);
		if (text === '' || text.length > this.maxLinkLength) {
			return [];
		}

		const externalLinks = await this._provideLinks(text);
		if (!externalLinks) {
			return [];
		}

		const result = externalLinks.map(link => {
			const bufferRange = convertLinkRangeToBuffer(lines, this.xterm.cols, {
				startColumn: link.startIndex + 1,
				startLineNumber: 1,
				endColumn: link.startIndex + link.length + 1,
				endLineNumber: 1
			}, startLine);
			const matchingText = text.substring(link.startIndex, link.startIndex + link.length) || '';

			const l: ITerminalSimpleLink = {
				text: matchingText,
				label: link.label,
				bufferRange,
				type: { id: this.id },
				activate: link.activate
			};
			return l;
		});

		return result;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/links/browser/terminalLink.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/browser/terminalLink.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IViewportRange, IBufferRange, ILink, ILinkDecorations, Terminal } from '@xterm/xterm';
import { Disposable, DisposableStore, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import * as dom from '../../../../../base/browser/dom.js';
import { RunOnceScheduler } from '../../../../../base/common/async.js';
import { convertBufferRangeToViewport } from './terminalLinkHelpers.js';
import { isMacintosh } from '../../../../../base/common/platform.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TerminalLinkType } from './links.js';
import type { URI } from '../../../../../base/common/uri.js';
import type { IParsedLink } from './terminalLinkParsing.js';
import type { IHoverAction } from '../../../../../base/browser/ui/hover/hover.js';

export class TerminalLink extends Disposable implements ILink {
	decorations: ILinkDecorations;

	private readonly _tooltipScheduler: MutableDisposable<RunOnceScheduler> = this._register(new MutableDisposable());
	private readonly _hoverListeners = this._register(new MutableDisposable());

	private readonly _onInvalidated = new Emitter<void>();
	get onInvalidated(): Event<void> { return this._onInvalidated.event; }

	get type(): TerminalLinkType { return this._type; }

	constructor(
		private readonly _xterm: Terminal,
		readonly range: IBufferRange,
		readonly text: string,
		readonly uri: URI | undefined,
		readonly parsedLink: IParsedLink | undefined,
		readonly actions: IHoverAction[] | undefined,
		private readonly _viewportY: number,
		private readonly _activateCallback: (event: MouseEvent | undefined, uri: string) => Promise<void>,
		private readonly _tooltipCallback: (link: TerminalLink, viewportRange: IViewportRange, modifierDownCallback?: () => void, modifierUpCallback?: () => void) => void,
		private readonly _isHighConfidenceLink: boolean,
		readonly label: string | undefined,
		private readonly _type: TerminalLinkType,
		@IConfigurationService private readonly _configurationService: IConfigurationService
	) {
		super();
		this.decorations = {
			pointerCursor: false,
			underline: this._isHighConfidenceLink
		};
	}

	activate(event: MouseEvent | undefined, text: string): void {
		this._activateCallback(event, text);
	}

	hover(event: MouseEvent, text: string): void {
		const w = dom.getWindow(event);
		const d = w.document;
		// Listen for modifier before handing it off to the hover to handle so it gets disposed correctly
		const hoverListeners = this._hoverListeners.value = new DisposableStore();
		hoverListeners.add(dom.addDisposableListener(d, 'keydown', e => {
			if (!e.repeat && this._isModifierDown(e)) {
				this._enableDecorations();
			}
		}));
		hoverListeners.add(dom.addDisposableListener(d, 'keyup', e => {
			if (!e.repeat && !this._isModifierDown(e)) {
				this._disableDecorations();
			}
		}));

		// Listen for when the terminal renders on the same line as the link
		hoverListeners.add(this._xterm.onRender(e => {
			const viewportRangeY = this.range.start.y - this._viewportY;
			if (viewportRangeY >= e.start && viewportRangeY <= e.end) {
				this._onInvalidated.fire();
			}
		}));

		// Only show the tooltip and highlight for high confidence links (not word/search workspace
		// links). Feedback was that this makes using the terminal overly noisy.
		if (this._isHighConfidenceLink) {
			this._tooltipScheduler.value = new RunOnceScheduler(() => {
				this._tooltipCallback(
					this,
					convertBufferRangeToViewport(this.range, this._viewportY),
					this._isHighConfidenceLink ? () => this._enableDecorations() : undefined,
					this._isHighConfidenceLink ? () => this._disableDecorations() : undefined
				);
				// Clear out scheduler until next hover event
				this._tooltipScheduler.clear();
			}, this._configurationService.getValue('workbench.hover.delay'));
			this._tooltipScheduler.value.schedule();
		}

		const origin = { x: event.pageX, y: event.pageY };
		hoverListeners.add(dom.addDisposableListener(d, dom.EventType.MOUSE_MOVE, e => {
			// Update decorations
			if (this._isModifierDown(e)) {
				this._enableDecorations();
			} else {
				this._disableDecorations();
			}

			// Reset the scheduler if the mouse moves too much
			if (Math.abs(e.pageX - origin.x) > w.devicePixelRatio * 2 || Math.abs(e.pageY - origin.y) > w.devicePixelRatio * 2) {
				origin.x = e.pageX;
				origin.y = e.pageY;
				this._tooltipScheduler.value?.schedule();
			}
		}));
	}

	leave(): void {
		this._hoverListeners.clear();
		this._tooltipScheduler.clear();
	}

	private _enableDecorations(): void {
		if (!this.decorations.pointerCursor) {
			this.decorations.pointerCursor = true;
		}
		if (!this.decorations.underline) {
			this.decorations.underline = true;
		}
	}

	private _disableDecorations(): void {
		if (this.decorations.pointerCursor) {
			this.decorations.pointerCursor = false;
		}
		if (this.decorations.underline !== this._isHighConfidenceLink) {
			this.decorations.underline = this._isHighConfidenceLink;
		}
	}

	private _isModifierDown(event: MouseEvent | KeyboardEvent): boolean {
		const multiCursorModifier = this._configurationService.getValue<'ctrlCmd' | 'alt'>('editor.multiCursorModifier');
		if (multiCursorModifier === 'ctrlCmd') {
			return !!event.altKey;
		}
		return isMacintosh ? event.metaKey : event.ctrlKey;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/links/browser/terminalLinkDetectorAdapter.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/browser/terminalLinkDetectorAdapter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { localize } from '../../../../../nls.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ITerminalLinkDetector, ITerminalSimpleLink, TerminalBuiltinLinkType, TerminalLinkType } from './links.js';
import { TerminalLink } from './terminalLink.js';
import { XtermLinkMatcherHandler } from './terminalLinkManager.js';
import type { IBufferLine, ILink, ILinkProvider, IViewportRange } from '@xterm/xterm';

export interface IActivateLinkEvent {
	link: ITerminalSimpleLink;
	event?: MouseEvent;
}

export interface IShowHoverEvent {
	link: TerminalLink;
	viewportRange: IViewportRange;
	modifierDownCallback?: () => void;
	modifierUpCallback?: () => void;
}

/**
 * Wrap a link detector object so it can be used in xterm.js
 */
export class TerminalLinkDetectorAdapter extends Disposable implements ILinkProvider {
	private readonly _activeLinksStore = this._register(new DisposableStore());

	private readonly _onDidActivateLink = this._register(new Emitter<IActivateLinkEvent>());
	readonly onDidActivateLink = this._onDidActivateLink.event;
	private readonly _onDidShowHover = this._register(new Emitter<IShowHoverEvent>());
	readonly onDidShowHover = this._onDidShowHover.event;

	constructor(
		private readonly _detector: ITerminalLinkDetector,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super();
	}

	private _activeProvideLinkRequests: Map<number, Promise<TerminalLink[]>> = new Map();
	async provideLinks(bufferLineNumber: number, callback: (links: ILink[] | undefined) => void) {
		let activeRequest = this._activeProvideLinkRequests.get(bufferLineNumber);
		if (activeRequest) {
			const links = await activeRequest;
			callback(links);
			return;
		}
		this._activeLinksStore.clear();
		activeRequest = this._provideLinks(bufferLineNumber);
		this._activeProvideLinkRequests.set(bufferLineNumber, activeRequest);
		const links = await activeRequest;
		this._activeProvideLinkRequests.delete(bufferLineNumber);
		callback(links);
	}

	private async _provideLinks(bufferLineNumber: number): Promise<TerminalLink[]> {
		// Dispose of all old links if new links are provided, links are only cached for the current line
		const links: TerminalLink[] = [];

		let startLine = bufferLineNumber - 1;
		let endLine = startLine;

		const lines: IBufferLine[] = [
			this._detector.xterm.buffer.active.getLine(startLine)!
		];

		// Cap the maximum context on either side of the line being provided, by taking the context
		// around the line being provided for this ensures the line the pointer is on will have
		// links provided.
		const maxCharacterContext = Math.max(this._detector.maxLinkLength, this._detector.xterm.cols);
		const maxLineContext = Math.ceil(maxCharacterContext / this._detector.xterm.cols);
		const minStartLine = Math.max(startLine - maxLineContext, 0);
		const maxEndLine = Math.min(endLine + maxLineContext, this._detector.xterm.buffer.active.length);

		while (startLine >= minStartLine && this._detector.xterm.buffer.active.getLine(startLine)?.isWrapped) {
			lines.unshift(this._detector.xterm.buffer.active.getLine(startLine - 1)!);
			startLine--;
		}

		while (endLine < maxEndLine && this._detector.xterm.buffer.active.getLine(endLine + 1)?.isWrapped) {
			lines.push(this._detector.xterm.buffer.active.getLine(endLine + 1)!);
			endLine++;
		}

		const detectedLinks = await this._detector.detect(lines, startLine, endLine);
		for (const link of detectedLinks) {
			const terminalLink = this._createTerminalLink(link, async (event) => this._onDidActivateLink.fire({ link, event }));
			links.push(terminalLink);
			this._activeLinksStore.add(terminalLink);
		}

		return links;
	}

	private _createTerminalLink(l: ITerminalSimpleLink, activateCallback: XtermLinkMatcherHandler): TerminalLink {
		// Remove trailing colon if there is one so the link is more useful
		if (!l.disableTrimColon && l.text.length > 0 && l.text.charAt(l.text.length - 1) === ':') {
			l.text = l.text.slice(0, -1);
			l.bufferRange.end.x--;
		}
		return this._instantiationService.createInstance(TerminalLink,
			this._detector.xterm,
			l.bufferRange,
			l.text,
			l.uri,
			l.parsedLink,
			l.actions,
			this._detector.xterm.buffer.active.viewportY,
			activateCallback,
			(link, viewportRange, modifierDownCallback, modifierUpCallback) => this._onDidShowHover.fire({
				link,
				viewportRange,
				modifierDownCallback,
				modifierUpCallback
			}),
			l.type !== TerminalBuiltinLinkType.Search, // Only search is low confidence
			l.label || this._getLabel(l.type),
			l.type
		);
	}

	private _getLabel(type: TerminalLinkType): string {
		switch (type) {
			case TerminalBuiltinLinkType.Search: return localize('searchWorkspace', 'Search workspace');
			case TerminalBuiltinLinkType.LocalFile: return localize('openFile', 'Open file in editor');
			case TerminalBuiltinLinkType.LocalFolderInWorkspace: return localize('focusFolder', 'Focus folder in explorer');
			case TerminalBuiltinLinkType.LocalFolderOutsideWorkspace: return localize('openFolder', 'Open folder in new window');
			case TerminalBuiltinLinkType.Url:
			default:
				return localize('followLink', 'Follow link');
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/links/browser/terminalLinkHelpers.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/browser/terminalLinkHelpers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IViewportRange, IBufferRange, IBufferLine, IBuffer, IBufferCellPosition } from '@xterm/xterm';
import { IRange } from '../../../../../editor/common/core/range.js';
import { OperatingSystem } from '../../../../../base/common/platform.js';
import { IPath, posix, win32 } from '../../../../../base/common/path.js';
import { ITerminalCapabilityStore, TerminalCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { ITerminalLogService } from '../../../../../platform/terminal/common/terminal.js';

/**
 * Converts a possibly wrapped link's range (comprised of string indices) into a buffer range that plays nicely with xterm.js
 *
 * @param lines A single line (not the entire buffer)
 * @param bufferWidth The number of columns in the terminal
 * @param range The link range - string indices
 * @param startLine The absolute y position (on the buffer) of the line
 */
export function convertLinkRangeToBuffer(
	lines: IBufferLine[],
	bufferWidth: number,
	range: IRange,
	startLine: number
): IBufferRange {
	const bufferRange: IBufferRange = {
		start: {
			x: range.startColumn,
			y: range.startLineNumber + startLine
		},
		end: {
			x: range.endColumn - 1,
			y: range.endLineNumber + startLine
		}
	};

	// Shift start range right for each wide character before the link
	let startOffset = 0;
	const startWrappedLineCount = Math.ceil(range.startColumn / bufferWidth);
	for (let y = 0; y < Math.min(startWrappedLineCount); y++) {
		const lineLength = Math.min(bufferWidth, (range.startColumn - 1) - y * bufferWidth);
		let lineOffset = 0;
		const line = lines[y];
		// Sanity check for line, apparently this can happen but it's not clear under what
		// circumstances this happens. Continue on, skipping the remainder of start offset if this
		// happens to minimize impact.
		if (!line) {
			break;
		}
		for (let x = 0; x < Math.min(bufferWidth, lineLength + lineOffset); x++) {
			const cell = line.getCell(x);
			// This is unexpected but it means the character doesn't exist, so we shouldn't add to
			// the offset
			if (!cell) {
				break;
			}
			const width = cell.getWidth();
			if (width === 2) {
				lineOffset++;
			}
			const char = cell.getChars();
			if (char.length > 1) {
				lineOffset -= char.length - 1;
			}
		}
		startOffset += lineOffset;
	}

	// Shift end range right for each wide character inside the link
	let endOffset = 0;
	const endWrappedLineCount = Math.ceil(range.endColumn / bufferWidth);
	for (let y = Math.max(0, startWrappedLineCount - 1); y < endWrappedLineCount; y++) {
		const start = (y === startWrappedLineCount - 1 ? (range.startColumn - 1 + startOffset) % bufferWidth : 0);
		const lineLength = Math.min(bufferWidth, range.endColumn + startOffset - y * bufferWidth);
		let lineOffset = 0;
		const line = lines[y];
		// Sanity check for line, apparently this can happen but it's not clear under what
		// circumstances this happens. Continue on, skipping the remainder of start offset if this
		// happens to minimize impact.
		if (!line) {
			break;
		}
		for (let x = start; x < Math.min(bufferWidth, lineLength + lineOffset); x++) {
			const cell = line.getCell(x);
			// This is unexpected but it means the character doesn't exist, so we shouldn't add to
			// the offset
			if (!cell) {
				break;
			}
			const width = cell.getWidth();
			const chars = cell.getChars();
			// Offset for null cells following wide characters
			if (width === 2) {
				lineOffset++;
			}
			// Offset for early wrapping when the last cell in row is a wide character
			if (x === bufferWidth - 1 && chars === '') {
				lineOffset++;
			}
			// Offset multi-code characters like emoji
			if (chars.length > 1) {
				lineOffset -= chars.length - 1;
			}
		}
		endOffset += lineOffset;
	}

	// Apply the width character offsets to the result
	bufferRange.start.x += startOffset;
	bufferRange.end.x += startOffset + endOffset;

	// Convert back to wrapped lines
	while (bufferRange.start.x > bufferWidth) {
		bufferRange.start.x -= bufferWidth;
		bufferRange.start.y++;
	}
	while (bufferRange.end.x > bufferWidth) {
		bufferRange.end.x -= bufferWidth;
		bufferRange.end.y++;
	}

	return bufferRange;
}

export function convertBufferRangeToViewport(bufferRange: IBufferRange, viewportY: number): IViewportRange {
	return {
		start: {
			x: bufferRange.start.x - 1,
			y: bufferRange.start.y - viewportY - 1
		},
		end: {
			x: bufferRange.end.x - 1,
			y: bufferRange.end.y - viewportY - 1
		}
	};
}

export function getXtermLineContent(buffer: IBuffer, lineStart: number, lineEnd: number, cols: number): string {
	// Cap the maximum number of lines generated to prevent potential performance problems. This is
	// more of a sanity check as the wrapped line should already be trimmed down at this point.
	const maxLineLength = Math.max(2048, cols * 2);
	lineEnd = Math.min(lineEnd, lineStart + maxLineLength);
	let content = '';
	for (let i = lineStart; i <= lineEnd; i++) {
		// Make sure only 0 to cols are considered as resizing when windows mode is enabled will
		// retain buffer data outside of the terminal width as reflow is disabled.
		const line = buffer.getLine(i);
		if (line) {
			content += line.translateToString(true, 0, cols);
		}
	}
	return content;
}

export function getXtermRangesByAttr(buffer: IBuffer, lineStart: number, lineEnd: number, cols: number): IBufferRange[] {
	let bufferRangeStart: IBufferCellPosition | undefined = undefined;
	let lastFgAttr: number = -1;
	let lastBgAttr: number = -1;
	const ranges: IBufferRange[] = [];
	for (let y = lineStart; y <= lineEnd; y++) {
		const line = buffer.getLine(y);
		if (!line) {
			continue;
		}
		for (let x = 0; x < cols; x++) {
			const cell = line.getCell(x);
			if (!cell) {
				break;
			}
			// HACK: Re-construct the attributes from fg and bg, this is hacky as it relies
			// upon the internal buffer bit layout
			const thisFgAttr = (
				cell.isBold() |
				cell.isInverse() |
				cell.isStrikethrough() |
				cell.isUnderline()
			);
			const thisBgAttr = (
				cell.isDim() |
				cell.isItalic()
			);
			if (lastFgAttr === -1 || lastBgAttr === -1) {
				bufferRangeStart = { x, y };
			} else {
				if (lastFgAttr !== thisFgAttr || lastBgAttr !== thisBgAttr) {
					// TODO: x overflow
					const bufferRangeEnd = { x, y };
					ranges.push({
						start: bufferRangeStart!,
						end: bufferRangeEnd
					});
					bufferRangeStart = { x, y };
				}
			}
			lastFgAttr = thisFgAttr;
			lastBgAttr = thisBgAttr;
		}
	}
	return ranges;
}


// export function positionIsInRange(position: IBufferCellPosition, range: IBufferRange): boolean {
// 	if (position.y < range.start.y || position.y > range.end.y) {
// 		return false;
// 	}
// 	if (position.y === range.start.y && position.x < range.start.x) {
// 		return false;
// 	}
// 	if (position.y === range.end.y && position.x > range.end.x) {
// 		return false;
// 	}
// 	return true;
// }

/**
 * For shells with the CommandDetection capability, the cwd for a command relative to the line of
 * the particular link can be used to narrow down the result for an exact file match.
 */
export function updateLinkWithRelativeCwd(capabilities: ITerminalCapabilityStore, y: number, text: string, osPath: IPath, logService: ITerminalLogService): string[] | undefined {
	const cwd = capabilities.get(TerminalCapability.CommandDetection)?.getCwdForLine(y);
	logService.trace('terminalLinkHelpers#updateLinkWithRelativeCwd cwd', cwd);
	if (!cwd) {
		return undefined;
	}
	const result: string[] = [];
	const sep = osPath.sep;
	if (!text.includes(sep)) {
		result.push(osPath.resolve(cwd + sep + text));
	} else {
		let commonDirs = 0;
		let i = 0;
		const cwdPath = cwd.split(sep).reverse();
		const linkPath = text.split(sep);
		// Get all results as candidates, prioritizing the link with the most common directories.
		// For example if in the directory /home/common and the link is common/file, the result
		// should be: `['/home/common/common/file', '/home/common/file']`. The first is the most
		// likely as cwd detection is active.
		while (i < cwdPath.length) {
			result.push(osPath.resolve(cwd + sep + linkPath.slice(commonDirs).join(sep)));
			if (cwdPath[i] === linkPath[i]) {
				commonDirs++;
			} else {
				break;
			}
			i++;
		}
	}
	return result;
}

export function osPathModule(os: OperatingSystem): IPath {
	return os === OperatingSystem.Windows ? win32 : posix;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/links/browser/terminalLinkManager.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/browser/terminalLinkManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EventType } from '../../../../../base/browser/dom.js';
import { IMarkdownString, MarkdownString } from '../../../../../base/common/htmlContent.js';
import { DisposableStore, dispose, IDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { isMacintosh, OS } from '../../../../../base/common/platform.js';
import { URI } from '../../../../../base/common/uri.js';
import * as nls from '../../../../../nls.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ITunnelService } from '../../../../../platform/tunnel/common/tunnel.js';
import { ITerminalLinkDetector, ITerminalLinkOpener, ITerminalLinkResolver, ITerminalSimpleLink, OmitFirstArg, TerminalBuiltinLinkType, TerminalLinkType } from './links.js';
import { TerminalExternalLinkDetector } from './terminalExternalLinkDetector.js';
import { TerminalLink } from './terminalLink.js';
import { TerminalLinkDetectorAdapter } from './terminalLinkDetectorAdapter.js';
import { TerminalLocalFileLinkOpener, TerminalLocalFolderInWorkspaceLinkOpener, TerminalLocalFolderOutsideWorkspaceLinkOpener, TerminalSearchLinkOpener, TerminalUrlLinkOpener } from './terminalLinkOpeners.js';
import { TerminalLocalLinkDetector } from './terminalLocalLinkDetector.js';
import { TerminalUriLinkDetector } from './terminalUriLinkDetector.js';
import { TerminalWordLinkDetector } from './terminalWordLinkDetector.js';
import { ITerminalConfigurationService, ITerminalExternalLinkProvider, TerminalLinkQuickPickEvent } from '../../../terminal/browser/terminal.js';
import { ILinkHoverTargetOptions, TerminalHover } from '../../../terminal/browser/widgets/terminalHoverWidget.js';
import { TerminalWidgetManager } from '../../../terminal/browser/widgets/widgetManager.js';
import { IXtermCore } from '../../../terminal/browser/xterm-private.js';
import { ITerminalCapabilityStore } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { ITerminalConfiguration, ITerminalProcessInfo, TERMINAL_CONFIG_SECTION } from '../../../terminal/common/terminal.js';
import type { ILink, ILinkProvider, IViewportRange, Terminal } from '@xterm/xterm';
import { convertBufferRangeToViewport } from './terminalLinkHelpers.js';
import { RunOnceScheduler } from '../../../../../base/common/async.js';
import { ITerminalLogService } from '../../../../../platform/terminal/common/terminal.js';
import { TerminalMultiLineLinkDetector } from './terminalMultiLineLinkDetector.js';
import { INotificationService, Severity } from '../../../../../platform/notification/common/notification.js';
import type { IHoverAction } from '../../../../../base/browser/ui/hover/hover.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { isString } from '../../../../../base/common/types.js';

export type XtermLinkMatcherHandler = (event: MouseEvent | undefined, link: string) => Promise<void>;

/**
 * An object responsible for managing registration of link matchers and link providers.
 */
export class TerminalLinkManager extends DisposableStore {
	private _widgetManager: TerminalWidgetManager | undefined;
	private readonly _standardLinkProviders: Map<string, ILinkProvider> = new Map();
	private readonly _linkProvidersDisposables: IDisposable[] = [];
	private readonly _externalLinkProviders: IDisposable[] = [];
	private readonly _openers: Map<TerminalLinkType, ITerminalLinkOpener> = new Map();

	externalProvideLinksCb?: OmitFirstArg<ITerminalExternalLinkProvider['provideLinks']>;

	constructor(
		private readonly _xterm: Terminal,
		private readonly _processInfo: ITerminalProcessInfo,
		capabilities: ITerminalCapabilityStore,
		private readonly _linkResolver: ITerminalLinkResolver,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@INotificationService notificationService: INotificationService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@ITerminalConfigurationService terminalConfigurationService: ITerminalConfigurationService,
		@ITerminalLogService private readonly _logService: ITerminalLogService,
		@ITunnelService private readonly _tunnelService: ITunnelService,
	) {
		super();

		let enableFileLinks: boolean = true;
		const enableFileLinksConfig = this._configurationService.getValue<ITerminalConfiguration>(TERMINAL_CONFIG_SECTION).enableFileLinks as ITerminalConfiguration['enableFileLinks'] | boolean;
		switch (enableFileLinksConfig) {
			case 'off':
			case false: // legacy from v1.75
				enableFileLinks = false;
				break;
			case 'notRemote':
				enableFileLinks = !this._processInfo.remoteAuthority;
				break;
		}

		// Setup link detectors in their order of priority
		if (enableFileLinks) {
			this._setupLinkDetector(TerminalMultiLineLinkDetector.id, this._instantiationService.createInstance(TerminalMultiLineLinkDetector, this._xterm, this._processInfo, this._linkResolver));
			this._setupLinkDetector(TerminalLocalLinkDetector.id, this._instantiationService.createInstance(TerminalLocalLinkDetector, this._xterm, capabilities, this._processInfo, this._linkResolver));
		}
		this._setupLinkDetector(TerminalUriLinkDetector.id, this._instantiationService.createInstance(TerminalUriLinkDetector, this._xterm, this._processInfo, this._linkResolver));
		this._setupLinkDetector(TerminalWordLinkDetector.id, this.add(this._instantiationService.createInstance(TerminalWordLinkDetector, this._xterm)));

		// Setup link openers
		const localFileOpener = this._instantiationService.createInstance(TerminalLocalFileLinkOpener);
		const localFolderInWorkspaceOpener = this._instantiationService.createInstance(TerminalLocalFolderInWorkspaceLinkOpener);
		const localFolderOutsideWorkspaceOpener = this._instantiationService.createInstance(TerminalLocalFolderOutsideWorkspaceLinkOpener);
		this._openers.set(TerminalBuiltinLinkType.LocalFile, localFileOpener);
		this._openers.set(TerminalBuiltinLinkType.LocalFolderInWorkspace, localFolderInWorkspaceOpener);
		this._openers.set(TerminalBuiltinLinkType.LocalFolderOutsideWorkspace, localFolderOutsideWorkspaceOpener);
		this._openers.set(TerminalBuiltinLinkType.Search, this._instantiationService.createInstance(TerminalSearchLinkOpener, capabilities, this._processInfo.initialCwd, localFileOpener, localFolderInWorkspaceOpener, () => this._processInfo.os || OS));
		this._openers.set(TerminalBuiltinLinkType.Url, this._instantiationService.createInstance(TerminalUrlLinkOpener, !!this._processInfo.remoteAuthority, localFileOpener, localFolderInWorkspaceOpener, localFolderOutsideWorkspaceOpener));
		this._registerStandardLinkProviders();

		let activeHoverDisposable: IDisposable | undefined;
		let activeTooltipScheduler: RunOnceScheduler | undefined;
		this.add(toDisposable(() => {
			this._clearLinkProviders();
			dispose(this._externalLinkProviders);
			activeHoverDisposable?.dispose();
			activeTooltipScheduler?.dispose();
		}));
		this._xterm.options.linkHandler = {
			allowNonHttpProtocols: true,
			activate: async (event, text) => {
				if (!this._isLinkActivationModifierDown(event)) {
					return;
				}
				const colonIndex = text.indexOf(':');
				if (colonIndex === -1) {
					throw new Error(`Could not find scheme in link "${text}"`);
				}
				const scheme = text.substring(0, colonIndex);
				if (terminalConfigurationService.config.allowedLinkSchemes.indexOf(scheme) === -1) {
					const userAllowed = await new Promise<boolean>((resolve) => {
						notificationService.prompt(Severity.Warning, nls.localize('scheme', 'Opening URIs can be insecure, do you want to allow opening links with the scheme {0}?', scheme), [
							{
								label: nls.localize('allow', 'Allow {0}', scheme),
								run: () => {
									const allowedLinkSchemes = [
										...terminalConfigurationService.config.allowedLinkSchemes,
										scheme
									];
									this._configurationService.updateValue(`terminal.integrated.allowedLinkSchemes`, allowedLinkSchemes);
									resolve(true);
								}
							}
						], {
							onCancel: () => resolve(false)
						});
					});

					if (!userAllowed) {
						return;
					}
				}
				this._openers.get(TerminalBuiltinLinkType.Url)?.open({
					type: TerminalBuiltinLinkType.Url,
					text,
					bufferRange: null!,
					uri: URI.parse(text)
				});
			},
			hover: (e, text, range) => {
				activeHoverDisposable?.dispose();
				activeHoverDisposable = undefined;
				activeTooltipScheduler?.dispose();
				activeTooltipScheduler = new RunOnceScheduler(() => {
					interface XtermWithCore extends Terminal {
						_core: IXtermCore;
					}
					const core = (this._xterm as XtermWithCore)._core;
					const cellDimensions = {
						width: core._renderService.dimensions.css.cell.width,
						height: core._renderService.dimensions.css.cell.height
					};
					const terminalDimensions = {
						width: this._xterm.cols,
						height: this._xterm.rows
					};
					activeHoverDisposable = this._showHover({
						viewportRange: convertBufferRangeToViewport(range, this._xterm.buffer.active.viewportY),
						cellDimensions,
						terminalDimensions
					}, this._getLinkHoverString(text, text), undefined, (text) => this._xterm.options.linkHandler?.activate(e, text, range));
					// Clear out scheduler until next hover event
					activeTooltipScheduler?.dispose();
					activeTooltipScheduler = undefined;
				}, this._configurationService.getValue('workbench.hover.delay'));
				activeTooltipScheduler.schedule();
			}
		};
	}

	private _setupLinkDetector(id: string, detector: ITerminalLinkDetector, isExternal: boolean = false): ILinkProvider {
		const detectorAdapter = this.add(this._instantiationService.createInstance(TerminalLinkDetectorAdapter, detector));
		this.add(detectorAdapter.onDidActivateLink(e => {
			// Prevent default electron link handling so Alt+Click mode works normally
			e.event?.preventDefault();
			// Require correct modifier on click unless event is coming from linkQuickPick selection
			if (e.event && !(e.event instanceof TerminalLinkQuickPickEvent) && !this._isLinkActivationModifierDown(e.event)) {
				return;
			}
			// Just call the handler if there is no before listener
			if (e.link.activate) {
				// Custom activate call (external links only)
				e.link.activate(e.link.text);
			} else {
				this._openLink(e.link);
			}
		}));
		this.add(detectorAdapter.onDidShowHover(e => this._tooltipCallback(e.link, e.viewportRange, e.modifierDownCallback, e.modifierUpCallback)));
		if (!isExternal) {
			this._standardLinkProviders.set(id, detectorAdapter);
		}
		return detectorAdapter;
	}

	private async _openLink(link: ITerminalSimpleLink): Promise<void> {
		this._logService.debug('Opening link', link);
		const opener = this._openers.get(link.type);
		if (!opener) {
			throw new Error(`No matching opener for link type "${link.type}"`);
		}
		this._telemetryService.publicLog2<{
			linkType: TerminalBuiltinLinkType | string;
		}, {
			owner: 'tyriar';
			comment: 'When the user opens a link in the terminal';
			linkType: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The type of link being opened' };
		}>('terminal/openLink', { linkType: isString(link.type) ? link.type : `extension:${link.type.id}` });
		await opener.open(link);
	}

	async openRecentLink(type: 'localFile' | 'url'): Promise<ILink | undefined> {
		let links;
		let i = this._xterm.buffer.active.length;
		while ((!links || links.length === 0) && i >= this._xterm.buffer.active.viewportY) {
			links = await this._getLinksForType(i, type);
			i--;
		}

		if (!links || links.length < 1) {
			return undefined;
		}
		const event = new TerminalLinkQuickPickEvent(EventType.CLICK);
		links[0].activate(event, links[0].text);
		return links[0];
	}

	async getLinks(): Promise<{ viewport: IDetectedLinks; all: Promise<IDetectedLinks> }> {
		// Fetch and await the viewport results
		const viewportLinksByLinePromises: Promise<IDetectedLinks | undefined>[] = [];
		for (let i = this._xterm.buffer.active.viewportY + this._xterm.rows - 1; i >= this._xterm.buffer.active.viewportY; i--) {
			viewportLinksByLinePromises.push(this._getLinksForLine(i));
		}
		const viewportLinksByLine = await Promise.all(viewportLinksByLinePromises);

		// Assemble viewport links
		const viewportLinks: Required<Pick<IDetectedLinks, 'wordLinks' | 'webLinks' | 'fileLinks' | 'folderLinks'>> = {
			wordLinks: [],
			webLinks: [],
			fileLinks: [],
			folderLinks: [],
		};
		for (const links of viewportLinksByLine) {
			if (links) {
				const { wordLinks, webLinks, fileLinks, folderLinks } = links;
				if (wordLinks?.length) {
					viewportLinks.wordLinks.push(...wordLinks.reverse());
				}
				if (webLinks?.length) {
					viewportLinks.webLinks.push(...webLinks.reverse());
				}
				if (fileLinks?.length) {
					viewportLinks.fileLinks.push(...fileLinks.reverse());
				}
				if (folderLinks?.length) {
					viewportLinks.folderLinks.push(...folderLinks.reverse());
				}
			}
		}

		// Fetch the remaining results async
		const aboveViewportLinksPromises: Promise<IDetectedLinks | undefined>[] = [];
		for (let i = this._xterm.buffer.active.viewportY - 1; i >= 0; i--) {
			aboveViewportLinksPromises.push(this._getLinksForLine(i));
		}
		const belowViewportLinksPromises: Promise<IDetectedLinks | undefined>[] = [];
		for (let i = this._xterm.buffer.active.length - 1; i >= this._xterm.buffer.active.viewportY + this._xterm.rows; i--) {
			belowViewportLinksPromises.push(this._getLinksForLine(i));
		}

		// Assemble all links in results
		const allLinks: Promise<Required<Pick<IDetectedLinks, 'wordLinks' | 'webLinks' | 'fileLinks' | 'folderLinks'>>> = Promise.all(aboveViewportLinksPromises).then(async aboveViewportLinks => {
			const belowViewportLinks = await Promise.all(belowViewportLinksPromises);
			const allResults: Required<Pick<IDetectedLinks, 'wordLinks' | 'webLinks' | 'fileLinks' | 'folderLinks'>> = {
				wordLinks: [...viewportLinks.wordLinks],
				webLinks: [...viewportLinks.webLinks],
				fileLinks: [...viewportLinks.fileLinks],
				folderLinks: [...viewportLinks.folderLinks]
			};
			for (const links of [...belowViewportLinks, ...aboveViewportLinks]) {
				if (links) {
					const { wordLinks, webLinks, fileLinks, folderLinks } = links;
					if (wordLinks?.length) {
						allResults.wordLinks.push(...wordLinks.reverse());
					}
					if (webLinks?.length) {
						allResults.webLinks.push(...webLinks.reverse());
					}
					if (fileLinks?.length) {
						allResults.fileLinks.push(...fileLinks.reverse());
					}
					if (folderLinks?.length) {
						allResults.folderLinks.push(...folderLinks.reverse());
					}
				}
			}
			return allResults;
		});

		return {
			viewport: viewportLinks,
			all: allLinks
		};
	}

	private async _getLinksForLine(y: number): Promise<IDetectedLinks | undefined> {
		const unfilteredWordLinks = await this._getLinksForType(y, 'word');
		const webLinks = await this._getLinksForType(y, 'url');
		const fileLinks = await this._getLinksForType(y, 'localFile');
		const folderLinks = await this._getLinksForType(y, 'localFolder');
		const words = new Set();
		let wordLinks;
		if (unfilteredWordLinks) {
			wordLinks = [];
			for (const link of unfilteredWordLinks) {
				if (!words.has(link.text) && link.text.length > 1) {
					wordLinks.push(link);
					words.add(link.text);
				}
			}
		}
		return { wordLinks, webLinks, fileLinks, folderLinks };
	}

	protected async _getLinksForType(y: number, type: 'word' | 'url' | 'localFile' | 'localFolder'): Promise<ILink[] | undefined> {
		switch (type) {
			case 'word':
				return (await new Promise<ILink[] | undefined>(r => this._standardLinkProviders.get(TerminalWordLinkDetector.id)?.provideLinks(y, r)));
			case 'url':
				return (await new Promise<ILink[] | undefined>(r => this._standardLinkProviders.get(TerminalUriLinkDetector.id)?.provideLinks(y, r)));
			case 'localFile': {
				const links = (await new Promise<ILink[] | undefined>(r => this._standardLinkProviders.get(TerminalLocalLinkDetector.id)?.provideLinks(y, r)));
				return links?.filter(link => (link as TerminalLink).type === TerminalBuiltinLinkType.LocalFile);
			}
			case 'localFolder': {
				const links = (await new Promise<ILink[] | undefined>(r => this._standardLinkProviders.get(TerminalLocalLinkDetector.id)?.provideLinks(y, r)));
				return links?.filter(link => (link as TerminalLink).type === TerminalBuiltinLinkType.LocalFolderInWorkspace);
			}
		}
	}

	private _tooltipCallback(link: TerminalLink, viewportRange: IViewportRange, modifierDownCallback?: () => void, modifierUpCallback?: () => void) {
		if (!this._widgetManager) {
			return;
		}

		interface XtermWithCore extends Terminal {
			_core: IXtermCore;
		}
		const core = (this._xterm as XtermWithCore)._core;
		const cellDimensions = {
			width: core._renderService.dimensions.css.cell.width,
			height: core._renderService.dimensions.css.cell.height
		};
		const terminalDimensions = {
			width: this._xterm.cols,
			height: this._xterm.rows
		};

		// Don't pass the mouse event as this avoids the modifier check
		this._showHover({
			viewportRange,
			cellDimensions,
			terminalDimensions,
			modifierDownCallback,
			modifierUpCallback
		}, this._getLinkHoverString(link.text, link.label), link.actions, (text) => link.activate(undefined, text), link);
	}

	private _showHover(
		targetOptions: ILinkHoverTargetOptions,
		text: IMarkdownString,
		actions: IHoverAction[] | undefined,
		linkHandler: (url: string) => void,
		link?: TerminalLink
	): IDisposable | undefined {
		if (this._widgetManager) {
			const widget = this._instantiationService.createInstance(TerminalHover, targetOptions, text, actions, linkHandler);
			const attached = this._widgetManager.attachWidget(widget);
			if (attached) {
				link?.onInvalidated(() => attached.dispose());
			}
			return attached;
		}
		return undefined;
	}

	setWidgetManager(widgetManager: TerminalWidgetManager): void {
		this._widgetManager = widgetManager;
	}

	private _clearLinkProviders(): void {
		dispose(this._linkProvidersDisposables);
		this._linkProvidersDisposables.length = 0;
	}

	private _registerStandardLinkProviders(): void {
		// Forward any external link provider requests to the registered provider if it exists. This
		// helps maintain the relative priority of the link providers as it's defined by the order
		// in which they're registered in xterm.js.
		//
		/**
		 * There's a bit going on here but here's another view:
		 * - {@link externalProvideLinksCb} The external callback that gives the links (eg. from
		 *   exthost)
		 * - {@link proxyLinkProvider} A proxy that forwards the call over to
		 *   {@link externalProvideLinksCb}
		 * - {@link wrappedLinkProvider} Wraps the above in an `TerminalLinkDetectorAdapter`
		 */
		const proxyLinkProvider: OmitFirstArg<ITerminalExternalLinkProvider['provideLinks']> = async (bufferLineNumber) => {
			return this.externalProvideLinksCb?.(bufferLineNumber);
		};
		const detectorId = `extension-${this._externalLinkProviders.length}`;
		const wrappedLinkProvider = this._setupLinkDetector(detectorId, new TerminalExternalLinkDetector(detectorId, this._xterm, proxyLinkProvider), true);
		this._linkProvidersDisposables.push(this._xterm.registerLinkProvider(wrappedLinkProvider));

		for (const p of this._standardLinkProviders.values()) {
			this._linkProvidersDisposables.push(this._xterm.registerLinkProvider(p));
		}
	}

	protected _isLinkActivationModifierDown(event: MouseEvent): boolean {
		const editorConf = this._configurationService.getValue<{ multiCursorModifier: 'ctrlCmd' | 'alt' }>('editor');
		if (editorConf.multiCursorModifier === 'ctrlCmd') {
			return !!event.altKey;
		}
		return isMacintosh ? event.metaKey : event.ctrlKey;
	}

	private _getLinkHoverString(uri: string, label: string | undefined): IMarkdownString {
		const editorConf = this._configurationService.getValue<{ multiCursorModifier: 'ctrlCmd' | 'alt' }>('editor');

		let clickLabel = '';
		if (editorConf.multiCursorModifier === 'ctrlCmd') {
			if (isMacintosh) {
				clickLabel = nls.localize('terminalLinkHandler.followLinkAlt.mac', "option + click");
			} else {
				clickLabel = nls.localize('terminalLinkHandler.followLinkAlt', "alt + click");
			}
		} else {
			if (isMacintosh) {
				clickLabel = nls.localize('terminalLinkHandler.followLinkCmd', "cmd + click");
			} else {
				clickLabel = nls.localize('terminalLinkHandler.followLinkCtrl', "ctrl + click");
			}
		}

		let fallbackLabel = nls.localize('followLink', "Follow link");
		try {
			if (this._tunnelService.canTunnel(URI.parse(uri))) {
				fallbackLabel = nls.localize('followForwardedLink', "Follow link using forwarded port");
			}
		} catch {
			// No-op, already set to fallback
		}

		const markdown = new MarkdownString('', true);
		// Escapes markdown in label & uri
		if (label) {
			label = markdown.appendText(label).value;
			markdown.value = '';
		}
		if (uri) {
			uri = markdown.appendText(uri).value;
			markdown.value = '';
		}

		label = label || fallbackLabel;
		// Use the label when uri is '' so the link displays correctly
		uri = uri || label;
		// Although if there is a space in the uri, just replace it completely
		if (/(\s|&nbsp;)/.test(uri)) {
			uri = nls.localize('followLinkUrl', 'Link');
		}

		return markdown.appendLink(uri, label).appendMarkdown(` (${clickLabel})`);
	}
}

export interface ILineColumnInfo {
	lineNumber: number;
	columnNumber: number;
}

export interface IDetectedLinks {
	wordLinks?: ILink[];
	webLinks?: ILink[];
	fileLinks?: (ILink | TerminalLink)[];
	folderLinks?: ILink[];
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/links/browser/terminalLinkOpeners.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/browser/terminalLinkOpeners.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../../../../../base/common/network.js';
import { OperatingSystem } from '../../../../../base/common/platform.js';
import { URI } from '../../../../../base/common/uri.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { ITextEditorSelection } from '../../../../../platform/editor/common/editor.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { ITerminalLinkOpener, ITerminalSimpleLink, TerminalBuiltinLinkType } from './links.js';
import { osPathModule, updateLinkWithRelativeCwd } from './terminalLinkHelpers.js';
import { getTerminalLinkType } from './terminalLocalLinkDetector.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { ITerminalCapabilityStore, TerminalCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IWorkbenchEnvironmentService } from '../../../../services/environment/common/environmentService.js';
import { IHostService } from '../../../../services/host/browser/host.js';
import { QueryBuilder } from '../../../../services/search/common/queryBuilder.js';
import { ISearchService } from '../../../../services/search/common/search.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { detectLinks, getLinkSuffix } from './terminalLinkParsing.js';
import { ITerminalLogService } from '../../../../../platform/terminal/common/terminal.js';

export class TerminalLocalFileLinkOpener implements ITerminalLinkOpener {
	constructor(
		@IEditorService private readonly _editorService: IEditorService,
	) {
	}

	async open(link: ITerminalSimpleLink): Promise<void> {
		if (!link.uri) {
			throw new Error('Tried to open file link without a resolved URI');
		}
		const linkSuffix = link.parsedLink ? link.parsedLink.suffix : getLinkSuffix(link.text);
		let selection: ITextEditorSelection | undefined = link.selection;
		if (!selection) {
			selection = linkSuffix?.row === undefined ? undefined : {
				startLineNumber: linkSuffix.row ?? 1,
				startColumn: linkSuffix.col ?? 1,
				endLineNumber: linkSuffix.rowEnd,
				endColumn: linkSuffix.colEnd
			};
		}
		await this._editorService.openEditor({
			resource: link.uri,
			options: { pinned: true, selection, revealIfOpened: true }
		});
	}
}

export class TerminalLocalFolderInWorkspaceLinkOpener implements ITerminalLinkOpener {
	constructor(@ICommandService private readonly _commandService: ICommandService) {
	}

	async open(link: ITerminalSimpleLink): Promise<void> {
		if (!link.uri) {
			throw new Error('Tried to open folder in workspace link without a resolved URI');
		}
		await this._commandService.executeCommand('revealInExplorer', link.uri);
	}
}

export class TerminalLocalFolderOutsideWorkspaceLinkOpener implements ITerminalLinkOpener {
	constructor(@IHostService private readonly _hostService: IHostService) {
	}

	async open(link: ITerminalSimpleLink): Promise<void> {
		if (!link.uri) {
			throw new Error('Tried to open folder in workspace link without a resolved URI');
		}
		this._hostService.openWindow([{ folderUri: link.uri }], { forceNewWindow: true });
	}
}

export class TerminalSearchLinkOpener implements ITerminalLinkOpener {
	protected _fileQueryBuilder: QueryBuilder;

	constructor(
		private readonly _capabilities: ITerminalCapabilityStore,
		private readonly _initialCwd: string,
		private readonly _localFileOpener: TerminalLocalFileLinkOpener,
		private readonly _localFolderInWorkspaceOpener: TerminalLocalFolderInWorkspaceLinkOpener,
		private readonly _getOS: () => OperatingSystem,
		@IFileService private readonly _fileService: IFileService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
		@ISearchService private readonly _searchService: ISearchService,
		@ITerminalLogService private readonly _logService: ITerminalLogService,
		@IWorkbenchEnvironmentService private readonly _workbenchEnvironmentService: IWorkbenchEnvironmentService,
		@IWorkspaceContextService private readonly _workspaceContextService: IWorkspaceContextService,
	) {
		this._fileQueryBuilder = instantiationService.createInstance(QueryBuilder);
	}

	async open(link: ITerminalSimpleLink): Promise<void> {
		const osPath = osPathModule(this._getOS());
		const pathSeparator = osPath.sep;

		// Remove file:/// and any leading ./ or ../ since quick access doesn't understand that format
		let text = link.text.replace(/^file:\/\/\/?/, '');
		text = osPath.normalize(text).replace(/^(\.+[\\/])+/, '');

		// Try extract any trailing line and column numbers by matching the text against parsed
		// links. This will give a search link `foo` on a line like `"foo", line 10` to open the
		// quick pick with `foo:10` as the contents.
		//
		// This also normalizes the path to remove suffixes like :10 or :5.0-4
		if (link.contextLine) {
			// Skip suffix parsing if the text looks like it contains an ISO 8601 timestamp format
			const iso8601Pattern = /:\d{2}:\d{2}[+-]\d{2}:\d{2}\.[a-z]+/;
			if (!iso8601Pattern.test(link.text)) {
				const parsedLinks = detectLinks(link.contextLine, this._getOS());
				// Optimistically check that the link _starts with_ the parsed link text. If so,
				// continue to use the parsed link
				const matchingParsedLink = parsedLinks.find(parsedLink => parsedLink.suffix && link.text.startsWith(parsedLink.path.text));
				if (matchingParsedLink) {
					if (matchingParsedLink.suffix?.row !== undefined) {
						// Normalize the path based on the parsed link
						text = matchingParsedLink.path.text;
						text += `:${matchingParsedLink.suffix.row}`;
						if (matchingParsedLink.suffix?.col !== undefined) {
							text += `:${matchingParsedLink.suffix.col}`;
						}
					}
				}
			}
		}

		// Remove `:<one or more non number characters>` from the end of the link.
		// Examples:
		// - Ruby stack traces: <link>:in ...
		// - Grep output: <link>:<result line>
		// This only happens when the colon is _not_ followed by a forward- or back-slash as that
		// would break absolute Windows paths (eg. `C:/Users/...`).
		text = text.replace(/:[^\\/\d][^\d]*$/, '');

		// Remove any trailing periods after the line/column numbers, to prevent breaking the search feature, #200257
		// Examples:
		// "Check your code Test.tsx:12:45." -> Test.tsx:12:45
		// "Check your code Test.tsx:12." -> Test.tsx:12

		text = text.replace(/\.$/, '');

		// If any of the names of the folders in the workspace matches
		// a prefix of the link, remove that prefix and continue
		this._workspaceContextService.getWorkspace().folders.forEach((folder) => {
			if (text.substring(0, folder.name.length + 1) === folder.name + pathSeparator) {
				text = text.substring(folder.name.length + 1);
				return;
			}
		});
		let cwdResolvedText = text;
		if (this._capabilities.has(TerminalCapability.CommandDetection)) {
			cwdResolvedText = updateLinkWithRelativeCwd(this._capabilities, link.bufferRange.start.y, text, osPath, this._logService)?.[0] || text;
		}

		// Try open the cwd resolved link first
		if (await this._tryOpenExactLink(cwdResolvedText, link)) {
			return;
		}

		// If the cwd resolved text didn't match, try find the link without the cwd resolved, for
		// example when a command prints paths in a sub-directory of the current cwd
		if (text !== cwdResolvedText) {
			if (await this._tryOpenExactLink(text, link)) {
				return;
			}
		}

		// Fallback to searching quick access
		return this._quickInputService.quickAccess.show(text);
	}

	private async _getExactMatch(sanitizedLink: string): Promise<IResourceMatch | undefined> {
		// Make the link relative to the cwd if it isn't absolute
		const os = this._getOS();
		const pathModule = osPathModule(os);
		const isAbsolute = pathModule.isAbsolute(sanitizedLink);
		let absolutePath: string | undefined = isAbsolute ? sanitizedLink : undefined;
		if (!isAbsolute && this._initialCwd.length > 0) {
			absolutePath = pathModule.join(this._initialCwd, sanitizedLink);
		}

		// Try open as an absolute link
		let resourceMatch: IResourceMatch | undefined;
		if (absolutePath) {
			let normalizedAbsolutePath: string = absolutePath;
			if (os === OperatingSystem.Windows) {
				normalizedAbsolutePath = absolutePath.replace(/\\/g, '/');
				if (normalizedAbsolutePath.match(/[a-z]:/i)) {
					normalizedAbsolutePath = `/${normalizedAbsolutePath}`;
				}
			}
			let uri: URI;
			if (this._workbenchEnvironmentService.remoteAuthority) {
				uri = URI.from({
					scheme: Schemas.vscodeRemote,
					authority: this._workbenchEnvironmentService.remoteAuthority,
					path: normalizedAbsolutePath
				});
			} else {
				uri = URI.file(normalizedAbsolutePath);
			}
			try {
				const fileStat = await this._fileService.stat(uri);
				resourceMatch = { uri, isDirectory: fileStat.isDirectory };
			} catch {
				// File or dir doesn't exist, continue on
			}
		}

		// Search the workspace if an exact match based on the absolute path was not found
		if (!resourceMatch) {
			const results = await this._searchService.fileSearch(
				this._fileQueryBuilder.file(this._workspaceContextService.getWorkspace().folders, {
					filePattern: sanitizedLink,
					maxResults: 2
				})
			);
			if (results.results.length > 0) {
				if (results.results.length === 1) {
					// If there's exactly 1 search result, return it regardless of whether it's
					// exact or partial.
					resourceMatch = { uri: results.results[0].resource };
				} else if (!isAbsolute) {
					// For non-absolute links, exact link matching is allowed only if there is a single an exact
					// file match. For example searching for `foo.txt` when there is no cwd information
					// available (ie. only the initial cwd) should open the file directly only if there is a
					// single file names `foo.txt` anywhere within the folder. These same rules apply to
					// relative paths with folders such as `src/foo.txt`.
					const results = await this._searchService.fileSearch(
						this._fileQueryBuilder.file(this._workspaceContextService.getWorkspace().folders, {
							filePattern: `**/${sanitizedLink}`
						})
					);
					// Find an exact match if it exists
					const exactMatches = results.results.filter(e => e.resource.toString().endsWith(sanitizedLink));
					if (exactMatches.length === 1) {
						resourceMatch = { uri: exactMatches[0].resource };
					}
				}
			}
		}
		return resourceMatch;
	}

	private async _tryOpenExactLink(text: string, link: ITerminalSimpleLink): Promise<boolean> {
		const sanitizedLink = text.replace(/:\d+(:\d+)?$/, '');
		try {
			const result = await this._getExactMatch(sanitizedLink);
			if (result) {
				const { uri, isDirectory } = result;
				const linkToOpen = {
					// Use the absolute URI's path here so the optional line/col get detected
					text: result.uri.path + (text.match(/:\d+(:\d+)?$/)?.[0] || ''),
					uri,
					bufferRange: link.bufferRange,
					type: link.type
				};
				if (uri) {
					await (isDirectory ? this._localFolderInWorkspaceOpener.open(linkToOpen) : this._localFileOpener.open(linkToOpen));
					return true;
				}
			}
		} catch {
			return false;
		}
		return false;
	}
}

interface IResourceMatch {
	uri: URI;
	isDirectory?: boolean;
}

export class TerminalUrlLinkOpener implements ITerminalLinkOpener {
	constructor(
		private readonly _isRemote: boolean,
		private readonly _localFileOpener: TerminalLocalFileLinkOpener,
		private readonly _localFolderInWorkspaceOpener: TerminalLocalFolderInWorkspaceLinkOpener,
		private readonly _localFolderOutsideWorkspaceOpener: TerminalLocalFolderOutsideWorkspaceLinkOpener,
		@IOpenerService private readonly _openerService: IOpenerService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IFileService private readonly _fileService: IFileService,
		@IUriIdentityService private readonly _uriIdentityService: IUriIdentityService,
		@IWorkspaceContextService private readonly _workspaceContextService: IWorkspaceContextService,
		@ITerminalLogService private readonly _logService: ITerminalLogService,
	) {
	}

	async open(link: ITerminalSimpleLink): Promise<void> {
		if (!link.uri) {
			throw new Error('Tried to open a url without a resolved URI');
		}
		// Handle file:// URIs by delegating to appropriate file/folder openers
		if (link.uri.scheme === Schemas.file) {
			return this._openFileSchemeLink(link);
		}
		// It's important to use the raw string value here to avoid converting pre-encoded values
		// from the URL like `%2B` -> `+`.
		this._openerService.open(link.text, {
			allowTunneling: this._isRemote && this._configurationService.getValue('remote.forwardOnOpen'),
			allowContributedOpeners: true,
			openExternal: true
		});
	}

	private async _openFileSchemeLink(link: ITerminalSimpleLink): Promise<void> {
		if (!link.uri) {
			return;
		}

		try {
			const stat = await this._fileService.stat(link.uri);
			const isDirectory = stat.isDirectory;
			const linkType = getTerminalLinkType(
				link.uri,
				isDirectory,
				this._uriIdentityService,
				this._workspaceContextService
			);

			// Delegate to appropriate opener based on link type
			switch (linkType) {
				case TerminalBuiltinLinkType.LocalFile:
					await this._localFileOpener.open(link);
					return;
				case TerminalBuiltinLinkType.LocalFolderInWorkspace:
					await this._localFolderInWorkspaceOpener.open(link);
					return;
				case TerminalBuiltinLinkType.LocalFolderOutsideWorkspace:
					await this._localFolderOutsideWorkspaceOpener.open(link);
					return;
				case TerminalBuiltinLinkType.Url:
					await this.open(link);
					return;
			}
		} catch (error) {
			this._logService.warn('Open file via native file explorer');
		}
		this._openerService.open(link.text, {
			allowTunneling: this._isRemote && this._configurationService.getValue('remote.forwardOnOpen'),
			allowContributedOpeners: true,
			openExternal: true
		});
	}
}
```

--------------------------------------------------------------------------------

````
