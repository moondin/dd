---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 458
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 458 of 552)

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

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalEditingService.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalEditingService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IEditableData } from '../../../common/views.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { ITerminalEditingService, ITerminalInstance } from './terminal.js';
import { TERMINAL_VIEW_ID } from '../common/terminal.js';
import { TerminalViewPane } from './terminalView.js';

export class TerminalEditingService implements ITerminalEditingService {
	readonly _serviceBrand: undefined;

	private _editable: { instance: ITerminalInstance; data: IEditableData } | undefined;
	private _editingTerminal: ITerminalInstance | undefined;

	constructor(
		@IViewsService private readonly _viewsService: IViewsService
	) {
	}

	getEditableData(instance: ITerminalInstance): IEditableData | undefined {
		return this._editable && this._editable.instance === instance ? this._editable.data : undefined;
	}

	setEditable(instance: ITerminalInstance, data: IEditableData | null): void {
		if (!data) {
			this._editable = undefined;
		} else {
			this._editable = { instance: instance, data };
		}
		const pane = this._viewsService.getActiveViewWithId<TerminalViewPane>(TERMINAL_VIEW_ID);
		const isEditing = this.isEditable(instance);
		pane?.terminalTabbedView?.setEditable(isEditing);
	}

	isEditable(instance: ITerminalInstance | undefined): boolean {
		return !!this._editable && (this._editable.instance === instance || !instance);
	}

	getEditingTerminal(): ITerminalInstance | undefined {
		return this._editingTerminal;
	}

	setEditingTerminal(instance: ITerminalInstance | undefined): void {
		this._editingTerminal = instance;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { IActionViewItem } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { IAction } from '../../../../base/common/actions.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { DropdownWithPrimaryActionViewItem } from '../../../../platform/actions/browser/dropdownWithPrimaryActionViewItem.js';
import { IMenu, IMenuService, MenuId, MenuItemAction } from '../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { EditorPane } from '../../../browser/parts/editor/editorPane.js';
import { IEditorOpenContext } from '../../../common/editor.js';
import { ITerminalConfigurationService, ITerminalEditorService, ITerminalService, terminalEditorId } from './terminal.js';
import { TerminalEditorInput } from './terminalEditorInput.js';
import { getTerminalActionBarArgs } from './terminalMenus.js';
import { ITerminalProfileResolverService, ITerminalProfileService, TerminalCommandId } from '../common/terminal.js';
import { IEditorGroup } from '../../../services/editor/common/editorGroupsService.js';
import { openContextMenu } from './terminalContextMenu.js';
import { ACTIVE_GROUP } from '../../../services/editor/common/editorService.js';
import { IWorkbenchLayoutService, Parts } from '../../../services/layout/browser/layoutService.js';
import { IBaseActionViewItemOptions } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { DisposableStore, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { ITerminalProfile, TerminalLocation } from '../../../../platform/terminal/common/terminal.js';

export class TerminalEditor extends EditorPane {

	private _editorInstanceElement: HTMLElement | undefined;
	private _overflowGuardElement: HTMLElement | undefined;

	private _editorInput?: TerminalEditorInput = undefined;

	private _lastDimension?: dom.Dimension;

	private readonly _dropdownMenu: IMenu;

	private readonly _instanceMenu: IMenu;

	private _cancelContextMenu: boolean = false;

	private readonly _newDropdown: MutableDisposable<DropdownWithPrimaryActionViewItem> = this._register(new MutableDisposable());

	private readonly _disposableStore = this._register(new DisposableStore());

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@ITerminalEditorService private readonly _terminalEditorService: ITerminalEditorService,
		@ITerminalProfileResolverService private readonly _terminalProfileResolverService: ITerminalProfileResolverService,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@ITerminalConfigurationService private readonly _terminalConfigurationService: ITerminalConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IMenuService menuService: IMenuService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IContextMenuService private readonly _contextMenuService: IContextMenuService,
		@ITerminalProfileService private readonly _terminalProfileService: ITerminalProfileService,
		@IWorkbenchLayoutService private readonly _workbenchLayoutService: IWorkbenchLayoutService
	) {
		super(terminalEditorId, group, telemetryService, themeService, storageService);
		this._dropdownMenu = this._register(menuService.createMenu(MenuId.TerminalNewDropdownContext, contextKeyService));
		this._instanceMenu = this._register(menuService.createMenu(MenuId.TerminalInstanceContext, contextKeyService));
		this._register(this._terminalProfileService.onDidChangeAvailableProfiles(profiles => this._updateTabActionBar(profiles)));
	}

	override async setInput(newInput: TerminalEditorInput, options: IEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken) {
		this._editorInput?.terminalInstance?.detachFromElement();
		this._editorInput = newInput;
		await super.setInput(newInput, options, context, token);
		this._editorInput.terminalInstance?.attachToElement(this._overflowGuardElement!);
		if (this._lastDimension) {
			this.layout(this._lastDimension);
		}
		this._editorInput.terminalInstance?.setVisible(this.isVisible() && this._workbenchLayoutService.isVisible(Parts.EDITOR_PART, this.window));
		if (this._editorInput.terminalInstance) {
			// since the editor does not monitor focus changes, for ex. between the terminal
			// panel and the editors, this is needed so that the active instance gets set
			// when focus changes between them.
			this._register(this._editorInput.terminalInstance.onDidFocus(() => this._setActiveInstance()));
			this._editorInput.setCopyLaunchConfig(this._editorInput.terminalInstance.shellLaunchConfig);
		}
	}

	override clearInput(): void {
		super.clearInput();
		if (this._overflowGuardElement && this._editorInput?.terminalInstance?.domElement.parentElement === this._overflowGuardElement) {
			this._editorInput.terminalInstance?.detachFromElement();
		}
		this._editorInput = undefined;
	}

	private _setActiveInstance(): void {
		if (!this._editorInput?.terminalInstance) {
			return;
		}
		this._terminalEditorService.setActiveInstance(this._editorInput.terminalInstance);
	}

	override focus() {
		super.focus();

		this._editorInput?.terminalInstance?.focus(true);
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	protected createEditor(parent: HTMLElement): void {
		this._editorInstanceElement = parent;
		this._overflowGuardElement = dom.$('.terminal-overflow-guard.terminal-editor');
		this._editorInstanceElement.appendChild(this._overflowGuardElement);
		this._registerListeners();
	}

	private _registerListeners(): void {
		if (!this._editorInstanceElement) {
			return;
		}
		this._register(dom.addDisposableListener(this._editorInstanceElement, 'mousedown', async (event: MouseEvent) => {
			const terminal = this._terminalEditorService.activeInstance;
			if (this._terminalEditorService.instances.length > 0 && terminal) {
				const result = await terminal.handleMouseEvent(event, this._instanceMenu);
				if (typeof result === 'object' && result.cancelContextMenu) {
					this._cancelContextMenu = true;
				}
			}
		}));
		this._register(dom.addDisposableListener(this._editorInstanceElement, 'contextmenu', (event: MouseEvent) => {
			const rightClickBehavior = this._terminalConfigurationService.config.rightClickBehavior;
			if (rightClickBehavior === 'nothing' && !event.shiftKey) {
				event.preventDefault();
				event.stopImmediatePropagation();
				this._cancelContextMenu = false;
				return;
			}
			else
				if (!this._cancelContextMenu && rightClickBehavior !== 'copyPaste' && rightClickBehavior !== 'paste') {
					if (!this._cancelContextMenu) {
						openContextMenu(this.window, event, this._editorInput?.terminalInstance, this._instanceMenu, this._contextMenuService);
					}
					event.preventDefault();
					event.stopImmediatePropagation();
					this._cancelContextMenu = false;
				}
		}));
	}

	private _updateTabActionBar(profiles: ITerminalProfile[]): void {
		this._disposableStore.clear();
		const actions = getTerminalActionBarArgs(TerminalLocation.Editor, profiles, this._getDefaultProfileName(), this._terminalProfileService.contributedProfiles, this._terminalService, this._dropdownMenu, this._disposableStore);
		this._newDropdown.value?.update(actions.dropdownAction, actions.dropdownMenuActions);
	}

	layout(dimension: dom.Dimension): void {
		const instance = this._editorInput?.terminalInstance;
		if (instance) {
			instance.attachToElement(this._overflowGuardElement!);
			instance.layout(dimension);
		}
		this._lastDimension = dimension;
	}

	override setVisible(visible: boolean): void {
		super.setVisible(visible);
		this._editorInput?.terminalInstance?.setVisible(visible && this._workbenchLayoutService.isVisible(Parts.EDITOR_PART, this.window));
	}

	override getActionViewItem(action: IAction, options: IBaseActionViewItemOptions): IActionViewItem | undefined {
		switch (action.id) {
			case TerminalCommandId.CreateTerminalEditorSameGroup: {
				if (action instanceof MenuItemAction) {
					const location = { viewColumn: ACTIVE_GROUP };
					this._disposableStore.clear();
					const actions = getTerminalActionBarArgs(location, this._terminalProfileService.availableProfiles, this._getDefaultProfileName(), this._terminalProfileService.contributedProfiles, this._terminalService, this._dropdownMenu, this._disposableStore);
					this._newDropdown.value = this._instantiationService.createInstance(DropdownWithPrimaryActionViewItem, action, actions.dropdownAction, actions.dropdownMenuActions, actions.className, { hoverDelegate: options.hoverDelegate });
					this._newDropdown.value?.update(actions.dropdownAction, actions.dropdownMenuActions);
					return this._newDropdown.value;
				}
			}
		}
		return super.getActionViewItem(action, options);
	}

	private _getDefaultProfileName(): string {
		let defaultProfileName;
		try {
			defaultProfileName = this._terminalProfileService.getDefaultProfileName();
		} catch (e) {
			defaultProfileName = this._terminalProfileResolverService.defaultProfileName;
		}
		return defaultProfileName!;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalEditorInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import Severity from '../../../../base/common/severity.js';
import { dispose, toDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { EditorInputCapabilities, IEditorIdentifier, IUntypedEditorInput } from '../../../common/editor.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { EditorInput, IEditorCloseHandler } from '../../../common/editor/editorInput.js';
import { ITerminalInstance, ITerminalInstanceService, terminalEditorId } from './terminal.js';
import { getColorClass, getUriClasses } from './terminalIcon.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IShellLaunchConfig, TerminalExitReason, TerminalLocation, TerminalSettingId } from '../../../../platform/terminal/common/terminal.js';
import { IEditorGroup } from '../../../services/editor/common/editorGroupsService.js';
import { ILifecycleService, ShutdownReason, WillShutdownEvent } from '../../../services/lifecycle/common/lifecycle.js';
import { ConfirmOnKill } from '../common/terminal.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { TerminalContextKeys } from '../common/terminalContextKey.js';
import { ConfirmResult, IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { Emitter } from '../../../../base/common/event.js';

export class TerminalEditorInput extends EditorInput implements IEditorCloseHandler {

	static readonly ID = 'workbench.editors.terminal';

	override readonly closeHandler = this;

	private _isDetached = false;
	private _isShuttingDown = false;
	private _isReverted = false;
	private _copyLaunchConfig?: IShellLaunchConfig;
	private _terminalEditorFocusContextKey: IContextKey<boolean>;
	private _group: IEditorGroup | undefined;

	protected readonly _onDidRequestAttach = this._register(new Emitter<ITerminalInstance>());
	readonly onDidRequestAttach = this._onDidRequestAttach.event;

	setGroup(group: IEditorGroup | undefined) {
		this._group = group;
		if (group?.scopedContextKeyService) {
			this._terminalInstance?.setParentContextKeyService(group.scopedContextKeyService);
		}
	}

	get group(): IEditorGroup | undefined {
		return this._group;
	}

	override get typeId(): string {
		return TerminalEditorInput.ID;
	}

	override get editorId(): string | undefined {
		return terminalEditorId;
	}

	override get capabilities(): EditorInputCapabilities {
		return EditorInputCapabilities.Readonly | EditorInputCapabilities.Singleton | EditorInputCapabilities.CanDropIntoEditor | EditorInputCapabilities.ForceDescription;
	}

	setTerminalInstance(instance: ITerminalInstance): void {
		if (this._terminalInstance) {
			throw new Error('cannot set instance that has already been set');
		}
		this._terminalInstance = instance;
		this._setupInstanceListeners();
	}

	override copy(): EditorInput {
		const instance = this._terminalInstanceService.createInstance(this._copyLaunchConfig || {}, TerminalLocation.Editor);
		instance.focusWhenReady();
		this._copyLaunchConfig = undefined;
		return this._instantiationService.createInstance(TerminalEditorInput, instance.resource, instance);
	}

	/**
	 * Sets the launch config to use for the next call to EditorInput.copy, which will be used when
	 * the editor's split command is run.
	 */
	setCopyLaunchConfig(launchConfig: IShellLaunchConfig) {
		this._copyLaunchConfig = launchConfig;
	}

	/**
	 * Returns the terminal instance for this input if it has not yet been detached from the input.
	 */
	get terminalInstance(): ITerminalInstance | undefined {
		return this._isDetached ? undefined : this._terminalInstance;
	}

	showConfirm(): boolean {
		if (this._isReverted) {
			return false;
		}
		const confirmOnKill = this._configurationService.getValue<ConfirmOnKill>(TerminalSettingId.ConfirmOnKill);
		if (confirmOnKill === 'editor' || confirmOnKill === 'always') {
			return this._terminalInstance?.hasChildProcesses || false;
		}
		return false;
	}

	async confirm(terminals: ReadonlyArray<IEditorIdentifier>): Promise<ConfirmResult> {
		const { confirmed } = await this._dialogService.confirm({
			type: Severity.Warning,
			message: localize('confirmDirtyTerminal.message', "Do you want to terminate running processes?"),
			primaryButton: localize({ key: 'confirmDirtyTerminal.button', comment: ['&& denotes a mnemonic'] }, "&&Terminate"),
			detail: terminals.length > 1 ?
				terminals.map(terminal => terminal.editor.getName()).join('\n') + '\n\n' + localize('confirmDirtyTerminals.detail', "Closing will terminate the running processes in the terminals.") :
				localize('confirmDirtyTerminal.detail', "Closing will terminate the running processes in this terminal.")
		});

		return confirmed ? ConfirmResult.DONT_SAVE : ConfirmResult.CANCEL;
	}

	override async revert(): Promise<void> {
		// On revert just treat the terminal as permanently non-dirty
		this._isReverted = true;
	}

	constructor(
		public readonly resource: URI,
		private _terminalInstance: ITerminalInstance | undefined,
		@IThemeService private readonly _themeService: IThemeService,
		@ITerminalInstanceService private readonly _terminalInstanceService: ITerminalInstanceService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ILifecycleService private readonly _lifecycleService: ILifecycleService,
		@IContextKeyService private _contextKeyService: IContextKeyService,
		@IDialogService private readonly _dialogService: IDialogService
	) {
		super();

		this._terminalEditorFocusContextKey = TerminalContextKeys.editorFocus.bindTo(_contextKeyService);

		if (_terminalInstance) {
			this._setupInstanceListeners();
		}
	}

	private _setupInstanceListeners(): void {
		const instance = this._terminalInstance;
		if (!instance) {
			return;
		}

		const instanceOnDidFocusListener = instance.onDidFocus(() => this._terminalEditorFocusContextKey.set(true));
		const instanceOnDidBlurListener = instance.onDidBlur(() => this._terminalEditorFocusContextKey.reset());

		const disposeListeners = [
			instance.onExit((e) => {
				if (!instance.waitOnExit) {
					this.dispose();
				}
			}),
			instance.onDisposed(() => this.dispose()),
			instance.onTitleChanged(() => this._onDidChangeLabel.fire()),
			instance.onIconChanged(() => this._onDidChangeLabel.fire()),
			instanceOnDidFocusListener,
			instanceOnDidBlurListener,
			instance.statusList.onDidChangePrimaryStatus(() => this._onDidChangeLabel.fire())
		];

		this._register(toDisposable(() => {
			if (!this._isDetached && !this._isShuttingDown) {
				// Will be ignored if triggered by onExit or onDisposed terminal events
				// as disposed was already called
				instance.dispose(TerminalExitReason.User);
			}
			dispose(disposeListeners);
			dispose([instanceOnDidFocusListener, instanceOnDidBlurListener]);
		}));

		// Don't dispose editor when instance is torn down on shutdown to avoid extra work and so
		// the editor/tabs don't disappear
		this._register(this._lifecycleService.onWillShutdown((e: WillShutdownEvent) => {
			this._isShuttingDown = true;
			dispose(disposeListeners);

			// Don't touch processes if the shutdown was a result of reload as they will be reattached
			const shouldPersistTerminals = this._configurationService.getValue<boolean>(TerminalSettingId.EnablePersistentSessions) && e.reason === ShutdownReason.RELOAD;
			if (shouldPersistTerminals) {
				instance.detachProcessAndDispose(TerminalExitReason.Shutdown);
			} else {
				instance.dispose(TerminalExitReason.Shutdown);
			}
		}));
	}

	override getName() {
		return this._terminalInstance?.title || this.resource.fragment;
	}

	override getIcon(): ThemeIcon | undefined {
		if (!this._terminalInstance || !ThemeIcon.isThemeIcon(this._terminalInstance.icon)) {
			return undefined;
		}
		return this._terminalInstance.icon;
	}

	override getLabelExtraClasses(): string[] {
		if (!this._terminalInstance) {
			return [];
		}
		const extraClasses: string[] = ['terminal-tab', 'predefined-file-icon'];
		const colorClass = getColorClass(this._terminalInstance);
		if (colorClass) {
			extraClasses.push(colorClass);
		}
		const uriClasses = getUriClasses(this._terminalInstance, this._themeService.getColorTheme().type);
		if (uriClasses) {
			extraClasses.push(...uriClasses);
		}
		return extraClasses;
	}

	/**
	 * Detach the instance from the input such that when the input is disposed it will not dispose
	 * of the terminal instance/process.
	 */
	detachInstance() {
		if (!this._isShuttingDown) {
			this._terminalInstance?.detachFromElement();
			this._terminalInstance?.setParentContextKeyService(this._contextKeyService);
			this._isDetached = true;
		}
	}

	public override getDescription(): string | undefined {
		return this._terminalInstance?.description;
	}

	public override toUntyped(): IUntypedEditorInput {
		return {
			resource: this.resource,
			options: {
				override: terminalEditorId,
				pinned: true,
				forceReload: true
			}
		};
	}

	public override canReopen(): boolean {
		return false;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalEditorSerializer.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalEditorSerializer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isNumber, isObject } from '../../../../base/common/types.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IEditorSerializer } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { ISerializedTerminalEditorInput, ITerminalEditorService, ITerminalInstance, type IDeserializedTerminalEditorInput } from './terminal.js';
import { TerminalEditorInput } from './terminalEditorInput.js';

export class TerminalInputSerializer implements IEditorSerializer {
	constructor(
		@ITerminalEditorService private readonly _terminalEditorService: ITerminalEditorService
	) { }

	public canSerialize(editorInput: TerminalEditorInput): editorInput is TerminalEditorInput & { readonly terminalInstance: ITerminalInstance } {
		return isNumber(editorInput.terminalInstance?.persistentProcessId) && editorInput.terminalInstance.shouldPersist;
	}

	public serialize(editorInput: TerminalEditorInput): string | undefined {
		if (!this.canSerialize(editorInput)) {
			return;
		}
		return JSON.stringify(this._toJson(editorInput.terminalInstance));
	}

	public deserialize(instantiationService: IInstantiationService, serializedEditorInput: string): EditorInput | undefined {
		const editorInput = JSON.parse(serializedEditorInput) as unknown;
		if (!isDeserializedTerminalEditorInput(editorInput)) {
			throw new Error(`Could not revive terminal editor input, ${editorInput}`);
		}
		return this._terminalEditorService.reviveInput(editorInput);
	}

	private _toJson(instance: ITerminalInstance): ISerializedTerminalEditorInput {
		return {
			id: instance.persistentProcessId!,
			pid: instance.processId || 0,
			title: instance.title,
			titleSource: instance.titleSource,
			cwd: '',
			icon: instance.icon,
			color: instance.color,
			hasChildProcesses: instance.hasChildProcesses,
			isFeatureTerminal: instance.shellLaunchConfig.isFeatureTerminal,
			hideFromUser: instance.shellLaunchConfig.hideFromUser,
			reconnectionProperties: instance.shellLaunchConfig.reconnectionProperties,
			shellIntegrationNonce: instance.shellIntegrationNonce
		};
	}
}

function isDeserializedTerminalEditorInput(obj: unknown): obj is IDeserializedTerminalEditorInput {
	return isObject(obj) && 'id' in obj && 'pid' in obj;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalEditorService.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalEditorService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';
import { Disposable, dispose, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { EditorActivation } from '../../../../platform/editor/common/editor.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IShellLaunchConfig, TerminalLocation } from '../../../../platform/terminal/common/terminal.js';
import { IEditorPane } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IDeserializedTerminalEditorInput, ITerminalEditorService, ITerminalInstance, ITerminalInstanceService, TerminalEditorLocation } from './terminal.js';
import { TerminalEditorInput } from './terminalEditorInput.js';
import { getInstanceFromResource } from './terminalUri.js';
import { TerminalContextKeys } from '../common/terminalContextKey.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { IEditorService, ACTIVE_GROUP, SIDE_GROUP } from '../../../services/editor/common/editorService.js';
import { ILifecycleService } from '../../../services/lifecycle/common/lifecycle.js';

export class TerminalEditorService extends Disposable implements ITerminalEditorService {
	declare _serviceBrand: undefined;

	instances: ITerminalInstance[] = [];
	private _activeInstanceIndex: number = -1;
	private _isShuttingDown = false;
	private _activeOpenEditorRequest?: { instanceId: number; promise: Promise<IEditorPane | undefined> };

	private _terminalEditorActive: IContextKey<boolean>;

	private _editorInputs: Map</*resource*/string, TerminalEditorInput> = new Map();
	private _instanceDisposables: Map</*resource*/string, IDisposable[]> = new Map();

	private readonly _onDidDisposeInstance = this._register(new Emitter<ITerminalInstance>());
	readonly onDidDisposeInstance = this._onDidDisposeInstance.event;
	private readonly _onDidFocusInstance = this._register(new Emitter<ITerminalInstance>());
	readonly onDidFocusInstance = this._onDidFocusInstance.event;
	private readonly _onDidChangeInstanceCapability = this._register(new Emitter<ITerminalInstance>());
	readonly onDidChangeInstanceCapability = this._onDidChangeInstanceCapability.event;
	private readonly _onDidChangeActiveInstance = this._register(new Emitter<ITerminalInstance | undefined>());
	readonly onDidChangeActiveInstance = this._onDidChangeActiveInstance.event;
	private readonly _onDidChangeInstances = this._register(new Emitter<void>());
	readonly onDidChangeInstances = this._onDidChangeInstances.event;

	constructor(
		@IEditorService private readonly _editorService: IEditorService,
		@IEditorGroupsService private readonly _editorGroupsService: IEditorGroupsService,
		@ITerminalInstanceService private readonly _terminalInstanceService: ITerminalInstanceService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ILifecycleService lifecycleService: ILifecycleService,
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		super();
		this._terminalEditorActive = TerminalContextKeys.terminalEditorActive.bindTo(contextKeyService);
		this._register(toDisposable(() => {
			for (const d of this._instanceDisposables.values()) {
				dispose(d);
			}
		}));
		this._register(lifecycleService.onWillShutdown(() => this._isShuttingDown = true));
		this._register(this._editorService.onDidActiveEditorChange(() => {
			const activeEditor = this._editorService.activeEditor;
			const instance = activeEditor instanceof TerminalEditorInput ? activeEditor?.terminalInstance : undefined;
			const terminalEditorActive = !!instance && activeEditor instanceof TerminalEditorInput;
			this._terminalEditorActive.set(terminalEditorActive);
			if (terminalEditorActive) {
				activeEditor?.setGroup(this._editorService.activeEditorPane?.group);
				this.setActiveInstance(instance);
			} else {
				for (const instance of this.instances) {
					instance.resetFocusContextKey();
				}
			}
		}));
		this._register(this._editorService.onDidVisibleEditorsChange(() => {
			// add any terminal editors created via the editor service split command
			const knownIds = this.instances.map(i => i.instanceId);
			const terminalEditors = this._getActiveTerminalEditors();
			const unknownEditor = terminalEditors.find(input => {
				const inputId = input instanceof TerminalEditorInput ? input.terminalInstance?.instanceId : undefined;
				if (inputId === undefined) {
					return false;
				}
				return !knownIds.includes(inputId);
			});
			if (unknownEditor instanceof TerminalEditorInput && unknownEditor.terminalInstance) {
				this._editorInputs.set(unknownEditor.terminalInstance.resource.path, unknownEditor);
				this.instances.push(unknownEditor.terminalInstance);
			}
		}));

		// Remove the terminal from the managed instances when the editor closes. This fires when
		// dragging and dropping to another editor or closing the editor via cmd/ctrl+w.
		this._register(this._editorService.onDidCloseEditor(e => {
			const instance = e.editor instanceof TerminalEditorInput ? e.editor.terminalInstance : undefined;
			if (instance) {
				const instanceIndex = this.instances.findIndex(e => e === instance);
				if (instanceIndex !== -1) {
					const wasActiveInstance = this.instances[instanceIndex] === this.activeInstance;
					this._removeInstance(instance);
					if (wasActiveInstance) {
						this.setActiveInstance(undefined);
					}
				}
			}
		}));
	}

	private _getActiveTerminalEditors(): EditorInput[] {
		return this._editorService.visibleEditors.filter(e => e instanceof TerminalEditorInput && e.terminalInstance?.instanceId);
	}

	get activeInstance(): ITerminalInstance | undefined {
		if (this.instances.length === 0 || this._activeInstanceIndex === -1) {
			return undefined;
		}
		return this.instances[this._activeInstanceIndex];
	}

	setActiveInstance(instance: ITerminalInstance | undefined): void {
		this._activeInstanceIndex = instance ? this.instances.findIndex(e => e === instance) : -1;
		this._onDidChangeActiveInstance.fire(this.activeInstance);
	}

	async focusInstance(instance: ITerminalInstance): Promise<void> {
		return instance.focusWhenReady(true);
	}

	async focusActiveInstance(): Promise<void> {
		return this.activeInstance?.focusWhenReady(true);
	}

	async openEditor(instance: ITerminalInstance, editorOptions?: TerminalEditorLocation): Promise<void> {
		const resource = this.resolveResource(instance);
		if (resource) {
			await this._activeOpenEditorRequest?.promise;
			this._activeOpenEditorRequest = {
				instanceId: instance.instanceId,
				promise: this._editorService.openEditor({
					resource,
					description: instance.description || instance.shellLaunchConfig.type,
					options: {
						pinned: true,
						forceReload: true,
						preserveFocus: editorOptions?.preserveFocus,
						auxiliary: editorOptions?.auxiliary,
					}
				}, editorOptions?.viewColumn ?? ACTIVE_GROUP)
			};
			await this._activeOpenEditorRequest?.promise;
			this._activeOpenEditorRequest = undefined;
		}
	}

	resolveResource(instance: ITerminalInstance): URI {
		const resource = instance.resource;
		const inputKey = resource.path;
		const cachedEditor = this._editorInputs.get(inputKey);

		if (cachedEditor) {
			return cachedEditor.resource;
		}

		instance.target = TerminalLocation.Editor;
		const input = this._instantiationService.createInstance(TerminalEditorInput, resource, instance);
		this._registerInstance(inputKey, input, instance);
		return input.resource;
	}

	getInputFromResource(resource: URI): TerminalEditorInput {
		const input = this._editorInputs.get(resource.path);
		if (!input) {
			throw new Error(`Could not get input from resource: ${resource.path}`);
		}
		return input;
	}

	private _registerInstance(inputKey: string, input: TerminalEditorInput, instance: ITerminalInstance): void {
		this._editorInputs.set(inputKey, input);
		this._instanceDisposables.set(inputKey, [
			instance.onDidFocus(this._onDidFocusInstance.fire, this._onDidFocusInstance),
			instance.onDisposed(this._onDidDisposeInstance.fire, this._onDidDisposeInstance),
			instance.capabilities.onDidChangeCapabilities(() => this._onDidChangeInstanceCapability.fire(instance)),
		]);
		this.instances.push(instance);
		this._onDidChangeInstances.fire();
	}

	private _removeInstance(instance: ITerminalInstance) {
		const inputKey = instance.resource.path;
		this._editorInputs.delete(inputKey);
		const instanceIndex = this.instances.findIndex(e => e === instance);
		if (instanceIndex !== -1) {
			this.instances.splice(instanceIndex, 1);
		}
		const disposables = this._instanceDisposables.get(inputKey);
		this._instanceDisposables.delete(inputKey);
		if (disposables) {
			dispose(disposables);
		}
		this._onDidChangeInstances.fire();
	}

	getInstanceFromResource(resource?: URI): ITerminalInstance | undefined {
		return getInstanceFromResource(this.instances, resource);
	}

	splitInstance(instanceToSplit: ITerminalInstance, shellLaunchConfig: IShellLaunchConfig = {}): ITerminalInstance {
		if (instanceToSplit.target === TerminalLocation.Editor) {
			// Make sure the instance to split's group is active
			const group = this._editorInputs.get(instanceToSplit.resource.path)?.group;
			if (group) {
				this._editorGroupsService.activateGroup(group);
			}
		}
		const instance = this._terminalInstanceService.createInstance(shellLaunchConfig, TerminalLocation.Editor);
		const resource = this.resolveResource(instance);
		if (resource) {
			this._editorService.openEditor({
				resource: URI.revive(resource),
				description: instance.description,
				options: {
					pinned: true,
					forceReload: true
				}
			}, SIDE_GROUP);
		}
		return instance;
	}

	reviveInput(deserializedInput: IDeserializedTerminalEditorInput): EditorInput {
		const newDeserializedInput = { ...deserializedInput, findRevivedId: true };
		const instance = this._terminalInstanceService.createInstance({ attachPersistentProcess: newDeserializedInput }, TerminalLocation.Editor);
		const input = this._instantiationService.createInstance(TerminalEditorInput, instance.resource, instance);
		this._registerInstance(instance.resource.path, input, instance);
		return input;
	}

	detachInstance(instance: ITerminalInstance) {
		const inputKey = instance.resource.path;
		const editorInput = this._editorInputs.get(inputKey);
		editorInput?.detachInstance();
		this._removeInstance(instance);
		// Don't dispose the input when shutting down to avoid layouts in the editor area
		if (!this._isShuttingDown) {
			editorInput?.dispose();
		}
	}

	async revealActiveEditor(preserveFocus?: boolean): Promise<void> {
		const instance = this.activeInstance;
		if (!instance) {
			return;
		}

		// If there is an active openEditor call for this instance it will be revealed by that
		if (this._activeOpenEditorRequest?.instanceId === instance.instanceId) {
			return;
		}

		const editorInput = this._editorInputs.get(instance.resource.path)!;
		this._editorService.openEditor(
			editorInput,
			{
				pinned: true,
				forceReload: true,
				preserveFocus,
				activation: EditorActivation.PRESERVE
			}
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalEscapeSequences.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalEscapeSequences.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * The identifier for the first numeric parameter (`Ps`) for OSC commands used by shell integration.
 */
const enum ShellIntegrationOscPs {
	/**
	 * Sequences pioneered by FinalTerm.
	 */
	FinalTerm = 133,
	/**
	 * Sequences pioneered by VS Code. The number is derived from the least significant digit of
	 * "VSC" when encoded in hex ("VSC" = 0x56, 0x53, 0x43).
	 */
	VSCode = 633,
	/**
	 * Sequences pioneered by iTerm.
	 */
	ITerm = 1337
}

/**
 * VS Code-specific shell integration sequences. Some of these are based on common alternatives like
 * those pioneered in FinalTerm. The decision to move to entirely custom sequences was to try to
 * improve reliability and prevent the possibility of applications confusing the terminal.
 */
export const enum VSCodeOscPt {
	/**
	 * The start of the prompt, this is expected to always appear at the start of a line.
	 * Based on FinalTerm's `OSC 133 ; A ST`.
	 */
	PromptStart = 'A',

	/**
	 * The start of a command, ie. where the user inputs their command.
	 * Based on FinalTerm's `OSC 133 ; B ST`.
	 */
	CommandStart = 'B',

	/**
	 * Sent just before the command output begins.
	 * Based on FinalTerm's `OSC 133 ; C ST`.
	 */
	CommandExecuted = 'C',

	/**
	 * Sent just after a command has finished. The exit code is optional, when not specified it
	 * means no command was run (ie. enter on empty prompt or ctrl+c).
	 * Based on FinalTerm's `OSC 133 ; D [; <ExitCode>] ST`.
	 */
	CommandFinished = 'D',

	/**
	 * Explicitly set the command line. This helps workaround problems with conpty not having a
	 * passthrough mode by providing an option on Windows to send the command that was run. With
	 * this sequence there's no need for the guessing based on the unreliable cursor positions that
	 * would otherwise be required.
	 */
	CommandLine = 'E',

	/**
	 * Similar to prompt start but for line continuations.
	 */
	ContinuationStart = 'F',

	/**
	 * Similar to command start but for line continuations.
	 */
	ContinuationEnd = 'G',

	/**
	 * The start of the right prompt.
	 */
	RightPromptStart = 'H',

	/**
	 * The end of the right prompt.
	 */
	RightPromptEnd = 'I',

	/**
	 * Set an arbitrary property: `OSC 633 ; P ; <Property>=<Value> ST`, only known properties will
	 * be handled.
	 */
	Property = 'P'
}

export const enum VSCodeOscProperty {
	Task = 'Task',
	Cwd = 'Cwd',
	HasRichCommandDetection = 'HasRichCommandDetection',
}

/**
 * ITerm sequences
 */
export const enum ITermOscPt {
	/**
	 * Based on ITerm's `OSC 1337 ; SetMark` sets a mark on the scrollbar
	 */
	SetMark = 'SetMark'
}

export function VSCodeSequence(osc: VSCodeOscPt, data?: string | VSCodeOscProperty): string {
	return oscSequence(ShellIntegrationOscPs.VSCode, osc, data);
}

export function ITermSequence(osc: ITermOscPt, data?: string): string {
	return oscSequence(ShellIntegrationOscPs.ITerm, osc, data);
}

function oscSequence(ps: number, pt: string, data?: string): string {
	let result = `\x1b]${ps};${pt}`;
	if (data) {
		result += `;${data}`;
	}
	result += `\x07`;
	return result;

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalEvents.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalEvents.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITerminalInstance } from './terminal.js';
import { DynamicListEventMultiplexer, Event, EventMultiplexer, IDynamicListEventMultiplexer } from '../../../../base/common/event.js';
import { DisposableMap, DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { ITerminalCapabilityImplMap, TerminalCapability } from '../../../../platform/terminal/common/capabilities/capabilities.js';

export function createInstanceCapabilityEventMultiplexer<T extends TerminalCapability, K>(
	currentInstances: ITerminalInstance[],
	onAddInstance: Event<ITerminalInstance>,
	onRemoveInstance: Event<ITerminalInstance>,
	capabilityId: T,
	getEvent: (capability: ITerminalCapabilityImplMap[T]) => Event<K>
): IDynamicListEventMultiplexer<{ instance: ITerminalInstance; data: K }> {
	const store = new DisposableStore();
	const multiplexer = store.add(new EventMultiplexer<{ instance: ITerminalInstance; data: K }>());
	const capabilityListeners = store.add(new DisposableMap<number, DisposableMap<ITerminalCapabilityImplMap[T], IDisposable>>());

	function addCapability(instance: ITerminalInstance, capability: ITerminalCapabilityImplMap[T]) {
		const listener = multiplexer.add(Event.map(getEvent(capability), data => ({ instance, data })));
		let instanceCapabilityListeners = capabilityListeners.get(instance.instanceId);
		if (!instanceCapabilityListeners) {
			instanceCapabilityListeners = new DisposableMap<ITerminalCapabilityImplMap[T], IDisposable>();
			capabilityListeners.set(instance.instanceId, instanceCapabilityListeners);
		}
		instanceCapabilityListeners.set(capability, listener);
	}

	// Existing instances
	for (const instance of currentInstances) {
		const capability = instance.capabilities.get(capabilityId);
		if (capability) {
			addCapability(instance, capability);
		}
	}

	// Removed instances
	store.add(onRemoveInstance(instance => {
		capabilityListeners.deleteAndDispose(instance.instanceId);
	}));

	// Added capabilities
	const addCapabilityMultiplexer = store.add(new DynamicListEventMultiplexer(
		currentInstances,
		onAddInstance,
		onRemoveInstance,
		instance => Event.map(instance.capabilities.createOnDidAddCapabilityOfTypeEvent(capabilityId), changeEvent => ({ instance, changeEvent }))
	));
	store.add(addCapabilityMultiplexer.event(e => {
		addCapability(e.instance, e.changeEvent);
	}));

	// Removed capabilities
	const removeCapabilityMultiplexer = store.add(new DynamicListEventMultiplexer(
		currentInstances,
		onAddInstance,
		onRemoveInstance,
		instance => Event.map(instance.capabilities.createOnDidRemoveCapabilityOfTypeEvent(capabilityId), changeEvent => ({ instance, changeEvent }))
	));
	store.add(removeCapabilityMultiplexer.event(e => {
		capabilityListeners.get(e.instance.instanceId)?.deleteAndDispose(e.changeEvent);
	}));

	return {
		dispose: () => store.dispose(),
		event: multiplexer.event
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalExtensions.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalExtensions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BrandedService, IConstructorSignature } from '../../../../platform/instantiation/common/instantiation.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IDetachedTerminalInstance, ITerminalContribution, ITerminalInstance } from './terminal.js';
import { TerminalWidgetManager } from './widgets/widgetManager.js';
import { ITerminalProcessInfo, ITerminalProcessManager } from '../common/terminal.js';

export interface ITerminalContributionContext {
	instance: ITerminalInstance;
	processManager: ITerminalProcessManager;
	widgetManager: TerminalWidgetManager;
}
export interface IDetachedCompatibleTerminalContributionContext {
	instance: IDetachedTerminalInstance;
	processManager: ITerminalProcessInfo;
	widgetManager: TerminalWidgetManager;
}

/** Constructor compatible with full terminal instances, is assignable to {@link DetachedCompatibleTerminalContributionCtor} */
export type TerminalContributionCtor = IConstructorSignature<ITerminalContribution, [ITerminalContributionContext]>;
/** Constructor compatible with detached terminals */
export type DetachedCompatibleTerminalContributionCtor = IConstructorSignature<ITerminalContribution, [IDetachedCompatibleTerminalContributionContext]>;

export type ITerminalContributionDescription = { readonly id: string } & (
	| { readonly canRunInDetachedTerminals: false; readonly ctor: TerminalContributionCtor }
	| { readonly canRunInDetachedTerminals: true; readonly ctor: DetachedCompatibleTerminalContributionCtor }
);

/**
 * A terminal contribution is a method for extending _each_ terminal created, providing the terminal
 * instance when it becomes ready and various convenient hooks for xterm.js like when it's opened in
 * the DOM.
 * @param id The unique ID of the terminal contribution.
 * @param ctor The constructor of the terminal contribution.
 * @param canRunInDetachedTerminals Whether the terminal contribution should be run in detecthed
 * terminals. Defaults to false.
 */
export function registerTerminalContribution<Services extends BrandedService[]>(id: string, ctor: { new(ctx: ITerminalContributionContext, ...services: Services): ITerminalContribution }, canRunInDetachedTerminals?: false): void;
export function registerTerminalContribution<Services extends BrandedService[]>(id: string, ctor: { new(ctx: IDetachedCompatibleTerminalContributionContext, ...services: Services): ITerminalContribution }, canRunInDetachedTerminals: true): void;
export function registerTerminalContribution(id: string, ctor: TerminalContributionCtor | DetachedCompatibleTerminalContributionCtor, canRunInDetachedTerminals: boolean = false): void {
	// eslint-disable-next-line local/code-no-dangerous-type-assertions
	TerminalContributionRegistry.INSTANCE.registerTerminalContribution({ id, ctor, canRunInDetachedTerminals } as ITerminalContributionDescription);
}

/**
 * The registry of terminal contributions.
 *
 * **WARNING**: This is internal and should only be used by core terminal code that activates the
 * contributions.
 */
export namespace TerminalExtensionsRegistry {
	export function getTerminalContributions(): ITerminalContributionDescription[] {
		return TerminalContributionRegistry.INSTANCE.getTerminalContributions();
	}
}

class TerminalContributionRegistry {

	public static readonly INSTANCE = new TerminalContributionRegistry();

	private readonly _terminalContributions: ITerminalContributionDescription[] = [];

	constructor() {
	}

	public registerTerminalContribution(description: ITerminalContributionDescription): void {
		this._terminalContributions.push(description);
	}

	public getTerminalContributions(): ITerminalContributionDescription[] {
		return this._terminalContributions.slice(0);
	}
}

const enum Extensions {
	TerminalContributions = 'terminal.contributions'
}

Registry.add(Extensions.TerminalContributions, TerminalContributionRegistry.INSTANCE);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalGroup.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalGroup.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TERMINAL_VIEW_ID } from '../common/terminal.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { IDisposable, Disposable, DisposableStore, dispose, toDisposable } from '../../../../base/common/lifecycle.js';
import { SplitView, Orientation, IView, Sizing } from '../../../../base/browser/ui/splitview/splitview.js';
import { isHorizontal, IWorkbenchLayoutService, Position } from '../../../services/layout/browser/layoutService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ITerminalInstance, Direction, ITerminalGroup, ITerminalInstanceService, ITerminalConfigurationService } from './terminal.js';
import { ViewContainerLocation, IViewDescriptorService } from '../../../common/views.js';
import { IShellLaunchConfig, ITerminalTabLayoutInfoById, TerminalLocation } from '../../../../platform/terminal/common/terminal.js';
import { TerminalStatus } from './terminalStatusList.js';
import { getWindow } from '../../../../base/browser/dom.js';
import { getPartByLocation } from '../../../services/views/browser/viewsService.js';
import { asArray } from '../../../../base/common/arrays.js';
import { hasKey, isNumber, type SingleOrMany } from '../../../../base/common/types.js';

const enum Constants {
	/**
	 * The minimum size in pixels of a split pane.
	 */
	SplitPaneMinSize = 80,
	/**
	 * The number of cells the terminal gets added or removed when asked to increase or decrease
	 * the view size.
	 */
	ResizePartCellCount = 4
}

class SplitPaneContainer extends Disposable {
	private _height: number;
	private _width: number;
	private _splitView!: SplitView;
	private readonly _splitViewDisposables = this._register(new DisposableStore());
	private _children: SplitPane[] = [];
	private _terminalToPane: Map<ITerminalInstance, SplitPane> = new Map();

	private _onDidChange: Event<number | undefined> = Event.None;
	get onDidChange(): Event<number | undefined> { return this._onDidChange; }

	constructor(
		private _container: HTMLElement,
		public orientation: Orientation,
	) {
		super();
		this._width = this._container.offsetWidth;
		this._height = this._container.offsetHeight;
		this._createSplitView();
		this._splitView.layout(this.orientation === Orientation.HORIZONTAL ? this._width : this._height);
	}

	private _createSplitView(): void {
		this._splitViewDisposables.clear();
		this._splitView = new SplitView(this._container, { orientation: this.orientation });
		this._splitViewDisposables.add(this._splitView);
		this._splitViewDisposables.add(this._splitView.onDidSashReset(() => this._splitView.distributeViewSizes()));
	}

	split(instance: ITerminalInstance, index: number): void {
		this._addChild(instance, index);
	}

	resizePane(index: number, direction: Direction, amount: number): void {
		// Only resize when there is more than one pane
		if (this._children.length <= 1) {
			return;
		}

		// Get sizes
		const sizes: number[] = [];
		for (let i = 0; i < this._splitView.length; i++) {
			sizes.push(this._splitView.getViewSize(i));
		}

		// Remove size from right pane, unless index is the last pane in which case use left pane
		const isSizingEndPane = index !== this._children.length - 1;
		const indexToChange = isSizingEndPane ? index + 1 : index - 1;
		if (isSizingEndPane && direction === Direction.Left) {
			amount *= -1;
		} else if (!isSizingEndPane && direction === Direction.Right) {
			amount *= -1;
		} else if (isSizingEndPane && direction === Direction.Up) {
			amount *= -1;
		} else if (!isSizingEndPane && direction === Direction.Down) {
			amount *= -1;
		}

		// Ensure the size is not reduced beyond the minimum, otherwise weird things can happen
		if (sizes[index] + amount < Constants.SplitPaneMinSize) {
			amount = Constants.SplitPaneMinSize - sizes[index];
		} else if (sizes[indexToChange] - amount < Constants.SplitPaneMinSize) {
			amount = sizes[indexToChange] - Constants.SplitPaneMinSize;
		}

		// Apply the size change
		sizes[index] += amount;
		sizes[indexToChange] -= amount;
		for (let i = 0; i < this._splitView.length - 1; i++) {
			this._splitView.resizeView(i, sizes[i]);
		}
	}

	resizePanes(relativeSizes: number[]): void {
		if (this._children.length <= 1) {
			return;
		}

		// assign any extra size to last terminal
		relativeSizes[relativeSizes.length - 1] += 1 - relativeSizes.reduce((totalValue, currentValue) => totalValue + currentValue, 0);
		let totalSize = 0;
		for (let i = 0; i < this._splitView.length; i++) {
			totalSize += this._splitView.getViewSize(i);
		}
		for (let i = 0; i < this._splitView.length; i++) {
			this._splitView.resizeView(i, totalSize * relativeSizes[i]);
		}
	}

	getPaneSize(instance: ITerminalInstance): number {
		const paneForInstance = this._terminalToPane.get(instance);
		if (!paneForInstance) {
			return 0;
		}

		const index = this._children.indexOf(paneForInstance);
		return this._splitView.getViewSize(index);
	}

	private _addChild(instance: ITerminalInstance, index: number): void {
		const child = new SplitPane(instance, this.orientation === Orientation.HORIZONTAL ? this._height : this._width);
		child.orientation = this.orientation;
		if (isNumber(index)) {
			this._children.splice(index, 0, child);
		} else {
			this._children.push(child);
		}
		this._terminalToPane.set(instance, this._children[this._children.indexOf(child)]);

		this._withDisabledLayout(() => this._splitView.addView(child, Sizing.Distribute, index));
		this.layout(this._width, this._height);

		this._onDidChange = Event.any(...this._children.map(c => c.onDidChange));
	}

	remove(instance: ITerminalInstance): void {
		let index: number | null = null;
		for (let i = 0; i < this._children.length; i++) {
			if (this._children[i].instance === instance) {
				index = i;
			}
		}
		if (index !== null) {
			this._children.splice(index, 1);
			this._terminalToPane.delete(instance);
			this._splitView.removeView(index, Sizing.Distribute);
			instance.detachFromElement();
		}
	}

	layout(width: number, height: number): void {
		this._width = width;
		this._height = height;
		if (this.orientation === Orientation.HORIZONTAL) {
			this._children.forEach(c => c.orthogonalLayout(height));
			this._splitView.layout(width);
		} else {
			this._children.forEach(c => c.orthogonalLayout(width));
			this._splitView.layout(height);
		}
	}

	setOrientation(orientation: Orientation): void {
		if (this.orientation === orientation) {
			return;
		}
		this.orientation = orientation;

		// Remove old split view
		while (this._container.children.length > 0) {
			this._container.children[0].remove();
		}

		// Create new split view with updated orientation
		this._createSplitView();
		this._withDisabledLayout(() => {
			this._children.forEach(child => {
				child.orientation = orientation;
				this._splitView.addView(child, 1);
			});
		});
	}

	private _withDisabledLayout(innerFunction: () => void): void {
		// Whenever manipulating views that are going to be changed immediately, disabling
		// layout/resize events in the terminal prevent bad dimensions going to the pty.
		this._children.forEach(c => c.instance.disableLayout = true);
		innerFunction();
		this._children.forEach(c => c.instance.disableLayout = false);
	}
}

class SplitPane implements IView {
	minimumSize: number = Constants.SplitPaneMinSize;
	maximumSize: number = Number.MAX_VALUE;

	orientation: Orientation | undefined;

	private _onDidChange: Event<number | undefined> = Event.None;
	get onDidChange(): Event<number | undefined> { return this._onDidChange; }

	readonly element: HTMLElement;

	constructor(
		readonly instance: ITerminalInstance,
		public orthogonalSize: number
	) {
		this.element = document.createElement('div');
		this.element.className = 'terminal-split-pane';
		this.instance.attachToElement(this.element);
	}

	layout(size: number): void {
		// Only layout when both sizes are known
		if (!size || !this.orthogonalSize) {
			return;
		}

		if (this.orientation === Orientation.VERTICAL) {
			this.instance.layout({ width: this.orthogonalSize, height: size });
		} else {
			this.instance.layout({ width: size, height: this.orthogonalSize });
		}
	}

	orthogonalLayout(size: number): void {
		this.orthogonalSize = size;
	}
}

export class TerminalGroup extends Disposable implements ITerminalGroup {
	private _terminalInstances: ITerminalInstance[] = [];
	private _splitPaneContainer: SplitPaneContainer | undefined;
	private _groupElement: HTMLElement | undefined;
	private _panelPosition: Position = Position.BOTTOM;
	private _terminalLocation: ViewContainerLocation = ViewContainerLocation.Panel;
	private _instanceDisposables: Map<number, IDisposable[]> = new Map();

	private _activeInstanceIndex: number = -1;

	get terminalInstances(): ITerminalInstance[] { return this._terminalInstances; }

	private _hadFocusOnExit: boolean = false;
	get hadFocusOnExit(): boolean { return this._hadFocusOnExit; }

	private _initialRelativeSizes: number[] | undefined;
	private _visible: boolean = false;

	private readonly _onDidDisposeInstance: Emitter<ITerminalInstance> = this._register(new Emitter<ITerminalInstance>());
	readonly onDidDisposeInstance = this._onDidDisposeInstance.event;
	private readonly _onDidFocusInstance: Emitter<ITerminalInstance> = this._register(new Emitter<ITerminalInstance>());
	readonly onDidFocusInstance = this._onDidFocusInstance.event;
	private readonly _onDidChangeInstanceCapability: Emitter<ITerminalInstance> = this._register(new Emitter<ITerminalInstance>());
	readonly onDidChangeInstanceCapability = this._onDidChangeInstanceCapability.event;
	private readonly _onDisposed: Emitter<ITerminalGroup> = this._register(new Emitter<ITerminalGroup>());
	readonly onDisposed = this._onDisposed.event;
	private readonly _onInstancesChanged: Emitter<void> = this._register(new Emitter<void>());
	readonly onInstancesChanged = this._onInstancesChanged.event;
	private readonly _onDidChangeActiveInstance = this._register(new Emitter<ITerminalInstance | undefined>());
	readonly onDidChangeActiveInstance = this._onDidChangeActiveInstance.event;
	private readonly _onPanelOrientationChanged = this._register(new Emitter<Orientation>());
	readonly onPanelOrientationChanged = this._onPanelOrientationChanged.event;

	constructor(
		private _container: HTMLElement | undefined,
		shellLaunchConfigOrInstance: IShellLaunchConfig | ITerminalInstance | undefined,
		@ITerminalConfigurationService private readonly _terminalConfigurationService: ITerminalConfigurationService,
		@ITerminalInstanceService private readonly _terminalInstanceService: ITerminalInstanceService,
		@IWorkbenchLayoutService private readonly _layoutService: IWorkbenchLayoutService,
		@IViewDescriptorService private readonly _viewDescriptorService: IViewDescriptorService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService
	) {
		super();
		if (shellLaunchConfigOrInstance) {
			this.addInstance(shellLaunchConfigOrInstance);
		}
		if (this._container) {
			this.attachToElement(this._container);
		}
		this._onPanelOrientationChanged.fire(this._terminalLocation === ViewContainerLocation.Panel && isHorizontal(this._panelPosition) ? Orientation.HORIZONTAL : Orientation.VERTICAL);
		this._register(toDisposable(() => {
			if (this._container && this._groupElement) {
				this._groupElement.remove();
				this._groupElement = undefined;
			}
		}));
	}

	addInstance(shellLaunchConfigOrInstance: IShellLaunchConfig | ITerminalInstance, parentTerminalId?: number): void {
		let instance: ITerminalInstance;
		// if a parent terminal is provided, find it
		// otherwise, parent is the active terminal
		const parentIndex = parentTerminalId ? this._terminalInstances.findIndex(t => t.instanceId === parentTerminalId) : this._activeInstanceIndex;
		if (hasKey(shellLaunchConfigOrInstance, { instanceId: true })) {
			instance = shellLaunchConfigOrInstance;
		} else {
			instance = this._terminalInstanceService.createInstance(shellLaunchConfigOrInstance, TerminalLocation.Panel);
		}
		if (this._terminalInstances.length === 0) {
			this._terminalInstances.push(instance);
			this._activeInstanceIndex = 0;
		} else {
			this._terminalInstances.splice(parentIndex + 1, 0, instance);
		}
		this._initInstanceListeners(instance);

		if (this._splitPaneContainer) {
			this._splitPaneContainer.split(instance, parentIndex + 1);
		}

		this._onInstancesChanged.fire();
	}

	override dispose(): void {
		this._terminalInstances = [];
		this._onInstancesChanged.fire();
		this._splitPaneContainer?.dispose();
		super.dispose();
	}

	get activeInstance(): ITerminalInstance | undefined {
		if (this._terminalInstances.length === 0) {
			return undefined;
		}
		return this._terminalInstances[this._activeInstanceIndex];
	}

	getLayoutInfo(isActive: boolean): ITerminalTabLayoutInfoById {
		const instances = this.terminalInstances.filter(instance => isNumber(instance.persistentProcessId) && instance.shouldPersist);
		const totalSize = instances.map(t => this._splitPaneContainer?.getPaneSize(t) || 0).reduce((total, size) => total += size, 0);
		return {
			isActive: isActive,
			activePersistentProcessId: this.activeInstance ? this.activeInstance.persistentProcessId : undefined,
			terminals: instances.map(t => {
				return {
					relativeSize: totalSize > 0 ? this._splitPaneContainer!.getPaneSize(t) / totalSize : 0,
					terminal: t.persistentProcessId || 0
				};
			})
		};
	}

	private _initInstanceListeners(instance: ITerminalInstance) {
		this._instanceDisposables.set(instance.instanceId, [
			instance.onDisposed(instance => {
				this._onDidDisposeInstance.fire(instance);
				this._handleOnDidDisposeInstance(instance);
			}),
			instance.onDidFocus(instance => {
				this._setActiveInstance(instance);
				this._onDidFocusInstance.fire(instance);
			}),
			instance.capabilities.onDidChangeCapabilities(() => this._onDidChangeInstanceCapability.fire(instance)),
		]);
	}

	private _handleOnDidDisposeInstance(instance: ITerminalInstance) {
		this._removeInstance(instance);
	}

	removeInstance(instance: ITerminalInstance) {
		this._removeInstance(instance);
	}

	private _removeInstance(instance: ITerminalInstance) {
		const index = this._terminalInstances.indexOf(instance);
		if (index === -1) {
			return;
		}

		const wasActiveInstance = instance === this.activeInstance;
		this._terminalInstances.splice(index, 1);

		// Adjust focus if the instance was active
		if (wasActiveInstance && this._terminalInstances.length > 0) {
			const newIndex = index < this._terminalInstances.length ? index : this._terminalInstances.length - 1;
			this.setActiveInstanceByIndex(newIndex);
			// TODO: Only focus the new instance if the group had focus?
			this.activeInstance?.focus(true);
		} else if (index < this._activeInstanceIndex) {
			// Adjust active instance index if needed
			this._activeInstanceIndex--;
		}

		this._splitPaneContainer?.remove(instance);

		// Fire events and dispose group if it was the last instance
		if (this._terminalInstances.length === 0) {
			this._hadFocusOnExit = instance.hadFocusOnExit;
			this._onDisposed.fire(this);
			this.dispose();
		} else {
			this._onInstancesChanged.fire();
		}

		// Dispose instance event listeners
		const disposables = this._instanceDisposables.get(instance.instanceId);
		if (disposables) {
			dispose(disposables);
			this._instanceDisposables.delete(instance.instanceId);
		}
	}

	moveInstance(instances: SingleOrMany<ITerminalInstance>, index: number, position: 'before' | 'after'): void {
		instances = asArray(instances);
		const hasInvalidInstance = instances.some(instance => !this.terminalInstances.includes(instance));
		if (hasInvalidInstance) {
			return;
		}
		const insertIndex = position === 'before' ? index : index + 1;
		this._terminalInstances.splice(insertIndex, 0, ...instances);
		for (const item of instances) {
			const originSourceGroupIndex = position === 'after' ? this._terminalInstances.indexOf(item) : this._terminalInstances.lastIndexOf(item);
			this._terminalInstances.splice(originSourceGroupIndex, 1);
		}
		if (this._splitPaneContainer) {
			for (let i = 0; i < instances.length; i++) {
				const item = instances[i];
				this._splitPaneContainer.remove(item);
				this._splitPaneContainer.split(item, index + (position === 'before' ? i : 0));
			}
		}
		this._onInstancesChanged.fire();
	}

	private _setActiveInstance(instance: ITerminalInstance) {
		this.setActiveInstanceByIndex(this._getIndexFromId(instance.instanceId));
	}

	private _getIndexFromId(terminalId: number): number {
		let terminalIndex = -1;
		this.terminalInstances.forEach((terminalInstance, i) => {
			if (terminalInstance.instanceId === terminalId) {
				terminalIndex = i;
			}
		});
		if (terminalIndex === -1) {
			throw new Error(`Terminal with ID ${terminalId} does not exist (has it already been disposed?)`);
		}
		return terminalIndex;
	}

	setActiveInstanceByIndex(index: number, force?: boolean): void {
		// Check for invalid value
		if (index < 0 || index >= this._terminalInstances.length) {
			return;
		}

		const oldActiveInstance = this.activeInstance;
		this._activeInstanceIndex = index;
		if (oldActiveInstance !== this.activeInstance || force) {
			this._onInstancesChanged.fire();
			this._onDidChangeActiveInstance.fire(this.activeInstance);
		}
	}

	attachToElement(element: HTMLElement): void {
		this._container = element;

		// If we already have a group element, we can reparent it
		if (!this._groupElement) {
			this._groupElement = document.createElement('div');
			this._groupElement.classList.add('terminal-group');
		}

		this._container.appendChild(this._groupElement);
		if (!this._splitPaneContainer) {
			this._panelPosition = this._layoutService.getPanelPosition();
			this._terminalLocation = this._viewDescriptorService.getViewLocationById(TERMINAL_VIEW_ID)!;
			const orientation = this._terminalLocation === ViewContainerLocation.Panel && isHorizontal(this._panelPosition) ? Orientation.HORIZONTAL : Orientation.VERTICAL;
			this._splitPaneContainer = this._instantiationService.createInstance(SplitPaneContainer, this._groupElement, orientation);
			this.terminalInstances.forEach(instance => this._splitPaneContainer!.split(instance, this._activeInstanceIndex + 1));
		}
	}

	get title(): string {
		if (this._terminalInstances.length === 0) {
			// Normally consumers should not call into title at all after the group is disposed but
			// this is required when the group is used as part of a tree.
			return '';
		}
		let title = this.terminalInstances[0].title + this._getBellTitle(this.terminalInstances[0]);
		if (this.terminalInstances[0].description) {
			title += ` (${this.terminalInstances[0].description})`;
		}
		for (let i = 1; i < this.terminalInstances.length; i++) {
			const instance = this.terminalInstances[i];
			if (instance.title) {
				title += `, ${instance.title + this._getBellTitle(instance)}`;
				if (instance.description) {
					title += ` (${instance.description})`;
				}
			}
		}
		return title;
	}

	private _getBellTitle(instance: ITerminalInstance) {
		if (this._terminalConfigurationService.config.enableBell && instance.statusList.statuses.some(e => e.id === TerminalStatus.Bell)) {
			return '*';
		}
		return '';
	}

	setVisible(visible: boolean): void {
		this._visible = visible;
		if (this._groupElement) {
			this._groupElement.style.display = visible ? '' : 'none';
		}
		this.terminalInstances.forEach(i => i.setVisible(visible));
	}

	split(shellLaunchConfig: IShellLaunchConfig): ITerminalInstance {
		const instance = this._terminalInstanceService.createInstance(shellLaunchConfig, TerminalLocation.Panel);
		this.addInstance(instance, shellLaunchConfig.parentTerminalId);
		this._setActiveInstance(instance);
		return instance;
	}

	addDisposable(disposable: IDisposable): void {
		this._register(disposable);
	}

	layout(width: number, height: number): void {
		if (this._splitPaneContainer) {
			// Check if the panel position changed and rotate panes if so
			const newPanelPosition = this._layoutService.getPanelPosition();
			const newTerminalLocation = this._viewDescriptorService.getViewLocationById(TERMINAL_VIEW_ID)!;
			const terminalPositionChanged = newPanelPosition !== this._panelPosition || newTerminalLocation !== this._terminalLocation;
			if (terminalPositionChanged) {
				const newOrientation = newTerminalLocation === ViewContainerLocation.Panel && isHorizontal(newPanelPosition) ? Orientation.HORIZONTAL : Orientation.VERTICAL;
				this._splitPaneContainer.setOrientation(newOrientation);
				this._panelPosition = newPanelPosition;
				this._terminalLocation = newTerminalLocation;
				this._onPanelOrientationChanged.fire(this._splitPaneContainer.orientation);
			}
			this._splitPaneContainer.layout(width, height);
			if (this._initialRelativeSizes && this._visible) {
				this.resizePanes(this._initialRelativeSizes);
				this._initialRelativeSizes = undefined;
			}
		}
	}

	focusPreviousPane(): void {
		const newIndex = this._activeInstanceIndex === 0 ? this._terminalInstances.length - 1 : this._activeInstanceIndex - 1;
		this.setActiveInstanceByIndex(newIndex);
	}

	focusNextPane(): void {
		const newIndex = this._activeInstanceIndex === this._terminalInstances.length - 1 ? 0 : this._activeInstanceIndex + 1;
		this.setActiveInstanceByIndex(newIndex);
	}

	private _getPosition(): Position {
		switch (this._terminalLocation) {
			case ViewContainerLocation.Panel:
				return this._panelPosition;
			case ViewContainerLocation.Sidebar:
				return this._layoutService.getSideBarPosition();
			case ViewContainerLocation.AuxiliaryBar:
				return this._layoutService.getSideBarPosition() === Position.LEFT ? Position.RIGHT : Position.LEFT;
		}
	}

	private _getOrientation(): Orientation {
		return isHorizontal(this._getPosition()) ? Orientation.HORIZONTAL : Orientation.VERTICAL;
	}

	resizePane(direction: Direction): void {
		if (!this._splitPaneContainer) {
			return;
		}

		const isHorizontalResize = (direction === Direction.Left || direction === Direction.Right);

		const groupOrientation = this._getOrientation();

		const shouldResizePart =
			(isHorizontalResize && groupOrientation === Orientation.VERTICAL) ||
			(!isHorizontalResize && groupOrientation === Orientation.HORIZONTAL);

		const font = this._terminalConfigurationService.getFont(getWindow(this._groupElement));
		// TODO: Support letter spacing and line height
		const charSize = (isHorizontalResize ? font.charWidth : font.charHeight);

		if (charSize) {
			let resizeAmount = charSize * Constants.ResizePartCellCount;

			if (shouldResizePart) {

				const position = this._getPosition();
				const shouldShrink =
					(position === Position.LEFT && direction === Direction.Left) ||
					(position === Position.RIGHT && direction === Direction.Right) ||
					(position === Position.BOTTOM && direction === Direction.Down) ||
					(position === Position.TOP && direction === Direction.Up);

				if (shouldShrink) {
					resizeAmount *= -1;
				}

				this._layoutService.resizePart(getPartByLocation(this._terminalLocation), resizeAmount, resizeAmount);
			} else {
				this._splitPaneContainer.resizePane(this._activeInstanceIndex, direction, resizeAmount);
			}

		}
	}

	resizePanes(relativeSizes: number[]): void {
		if (!this._splitPaneContainer) {
			this._initialRelativeSizes = relativeSizes;
			return;
		}

		this._splitPaneContainer.resizePanes(relativeSizes);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalGroupService.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalGroupService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Orientation } from '../../../../base/browser/ui/sash/sash.js';
import { timeout } from '../../../../base/common/async.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IShellLaunchConfig } from '../../../../platform/terminal/common/terminal.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { ITerminalGroup, ITerminalGroupService, ITerminalInstance } from './terminal.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { TerminalGroup } from './terminalGroup.js';
import { getInstanceFromResource } from './terminalUri.js';
import { TerminalViewPane } from './terminalView.js';
import { TERMINAL_VIEW_ID } from '../common/terminal.js';
import { TerminalContextKeys } from '../common/terminalContextKey.js';
import { asArray } from '../../../../base/common/arrays.js';
import type { SingleOrMany } from '../../../../base/common/types.js';

export class TerminalGroupService extends Disposable implements ITerminalGroupService {
	declare _serviceBrand: undefined;

	groups: ITerminalGroup[] = [];
	activeGroupIndex: number = -1;
	get instances(): ITerminalInstance[] {
		return this.groups.reduce((p, c) => p.concat(c.terminalInstances), [] as ITerminalInstance[]);
	}

	lastAccessedMenu: 'inline-tab' | 'tab-list' = 'inline-tab';

	private _container: HTMLElement | undefined;

	private _isQuickInputOpened: boolean = false;

	private readonly _onDidChangeActiveGroup = this._register(new Emitter<ITerminalGroup | undefined>());
	readonly onDidChangeActiveGroup = this._onDidChangeActiveGroup.event;
	private readonly _onDidDisposeGroup = this._register(new Emitter<ITerminalGroup>());
	readonly onDidDisposeGroup = this._onDidDisposeGroup.event;
	private readonly _onDidChangeGroups = this._register(new Emitter<void>());
	readonly onDidChangeGroups = this._onDidChangeGroups.event;
	private readonly _onDidShow = this._register(new Emitter<void>());
	readonly onDidShow = this._onDidShow.event;

	private readonly _onDidDisposeInstance = this._register(new Emitter<ITerminalInstance>());
	readonly onDidDisposeInstance = this._onDidDisposeInstance.event;
	private readonly _onDidFocusInstance = this._register(new Emitter<ITerminalInstance>());
	readonly onDidFocusInstance = this._onDidFocusInstance.event;
	private readonly _onDidChangeActiveInstance = this._register(new Emitter<ITerminalInstance | undefined>());
	readonly onDidChangeActiveInstance = this._onDidChangeActiveInstance.event;
	private readonly _onDidChangeInstances = this._register(new Emitter<void>());
	readonly onDidChangeInstances = this._onDidChangeInstances.event;
	private readonly _onDidChangeInstanceCapability = this._register(new Emitter<ITerminalInstance>());
	readonly onDidChangeInstanceCapability = this._onDidChangeInstanceCapability.event;

	private readonly _onDidChangePanelOrientation = this._register(new Emitter<Orientation>());
	readonly onDidChangePanelOrientation = this._onDidChangePanelOrientation.event;

	constructor(
		@IContextKeyService private _contextKeyService: IContextKeyService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IViewsService private readonly _viewsService: IViewsService,
		@IViewDescriptorService private readonly _viewDescriptorService: IViewDescriptorService,
		@IQuickInputService private readonly _quickInputService: IQuickInputService
	) {
		super();

		const terminalGroupCountContextKey = TerminalContextKeys.groupCount.bindTo(this._contextKeyService);
		this._register(Event.runAndSubscribe(this.onDidChangeGroups, () => terminalGroupCountContextKey.set(this.groups.length)));

		const splitTerminalActiveContextKey = TerminalContextKeys.splitTerminalActive.bindTo(this._contextKeyService);
		this._register(Event.runAndSubscribe(this.onDidFocusInstance, () => {
			const activeInstance = this.activeInstance;
			splitTerminalActiveContextKey.set(activeInstance ? this.instanceIsSplit(activeInstance) : false);
		}));

		this._register(this.onDidDisposeGroup(group => this._removeGroup(group)));
		this._register(Event.any(this.onDidChangeActiveGroup, this.onDidChangeInstances)(() => this.updateVisibility()));
		this._register(this._quickInputService.onShow(() => this._isQuickInputOpened = true));
		this._register(this._quickInputService.onHide(() => this._isQuickInputOpened = false));
	}

	hidePanel(): void {
		// Hide the panel if the terminal is in the panel and it has no sibling views
		const panel = this._viewDescriptorService.getViewContainerByViewId(TERMINAL_VIEW_ID);
		if (panel && this._viewDescriptorService.getViewContainerModel(panel).visibleViewDescriptors.length === 1) {
			this._viewsService.closeView(TERMINAL_VIEW_ID);
			TerminalContextKeys.tabsMouse.bindTo(this._contextKeyService).set(false);
		}
	}

	get activeGroup(): ITerminalGroup | undefined {
		if (this.activeGroupIndex < 0 || this.activeGroupIndex >= this.groups.length) {
			return undefined;
		}
		return this.groups[this.activeGroupIndex];
	}
	set activeGroup(value: ITerminalGroup | undefined) {
		if (value === undefined) {
			// Setting to undefined is not possible, this can only be done when removing the last group
			return;
		}
		const index = this.groups.findIndex(e => e === value);
		this.setActiveGroupByIndex(index);
	}

	get activeInstance(): ITerminalInstance | undefined {
		return this.activeGroup?.activeInstance;
	}

	setActiveInstance(instance: ITerminalInstance) {
		this.setActiveInstanceByIndex(this._getIndexFromId(instance.instanceId));
	}

	private _getIndexFromId(terminalId: number): number {
		const terminalIndex = this.instances.findIndex(e => e.instanceId === terminalId);
		if (terminalIndex === -1) {
			throw new Error(`Terminal with ID ${terminalId} does not exist (has it already been disposed?)`);
		}
		return terminalIndex;
	}

	setContainer(container: HTMLElement) {
		this._container = container;
		this.groups.forEach(group => group.attachToElement(container));
	}

	async focusTabs(): Promise<void> {
		if (this.instances.length === 0) {
			return;
		}
		await this.showPanel(true);
		const pane = this._viewsService.getActiveViewWithId<TerminalViewPane>(TERMINAL_VIEW_ID);
		pane?.terminalTabbedView?.focusTabs();
	}

	async focusHover(): Promise<void> {
		if (this.instances.length === 0) {
			return;
		}

		const pane = this._viewsService.getActiveViewWithId<TerminalViewPane>(TERMINAL_VIEW_ID);
		pane?.terminalTabbedView?.focusHover();
	}

	async focusInstance(_: ITerminalInstance): Promise<void> {
		return this.showPanel(true);
	}

	async focusActiveInstance(): Promise<void> {
		return this.showPanel(true);
	}

	createGroup(slcOrInstance?: IShellLaunchConfig | ITerminalInstance): ITerminalGroup {
		const group = this._instantiationService.createInstance(TerminalGroup, this._container, slcOrInstance);
		this.groups.push(group);
		group.addDisposable(Event.forward(group.onPanelOrientationChanged, this._onDidChangePanelOrientation));
		group.addDisposable(Event.forward(group.onDidDisposeInstance, this._onDidDisposeInstance));
		group.addDisposable(Event.forward(group.onDidFocusInstance, this._onDidFocusInstance));
		group.addDisposable(Event.forward(group.onDidChangeInstanceCapability, this._onDidChangeInstanceCapability));
		group.addDisposable(Event.forward(group.onInstancesChanged, this._onDidChangeInstances));
		group.addDisposable(Event.forward(group.onDisposed, this._onDidDisposeGroup));
		group.addDisposable(group.onDidChangeActiveInstance(e => {
			if (group === this.activeGroup) {
				this._onDidChangeActiveInstance.fire(e);
			}
		}));
		if (group.terminalInstances.length > 0) {
			this._onDidChangeInstances.fire();
		}
		if (this.instances.length === 1) {
			// It's the first instance so it should be made active automatically, this must fire
			// after onInstancesChanged so consumers can react to the instance being added first
			this.setActiveInstanceByIndex(0);
		}
		this._onDidChangeGroups.fire();
		return group;
	}

	async showPanel(focus?: boolean): Promise<void> {
		const pane = this._viewsService.getActiveViewWithId(TERMINAL_VIEW_ID)
			?? await this._viewsService.openView(TERMINAL_VIEW_ID, focus);
		pane?.setExpanded(true);

		if (focus) {
			// Do the focus call asynchronously as going through the
			// command palette will force editor focus
			await timeout(0);
			const instance = this.activeInstance;
			if (instance) {
				// HACK: Ensure the panel is still visible at this point as there may have been
				// a request since it was opened to show a different panel
				if (pane && !pane.isVisible()) {
					await this._viewsService.openView(TERMINAL_VIEW_ID, focus);
				}
				await instance.focusWhenReady(true);
			}
		}
		this._onDidShow.fire();
	}

	getInstanceFromResource(resource: URI | undefined): ITerminalInstance | undefined {
		return getInstanceFromResource(this.instances, resource);
	}

	private _removeGroup(group: ITerminalGroup) {
		// Get the index of the group and remove it from the list
		const activeGroup = this.activeGroup;
		const wasActiveGroup = group === activeGroup;
		const index = this.groups.indexOf(group);
		if (index !== -1) {
			this.groups.splice(index, 1);
			this._onDidChangeGroups.fire();
		}

		if (wasActiveGroup) {
			// Adjust focus if the group was active
			if (this.groups.length > 0 && !this._isQuickInputOpened) {
				const newIndex = index < this.groups.length ? index : this.groups.length - 1;
				this.setActiveGroupByIndex(newIndex, true);
				if (group.hadFocusOnExit) {
					this.activeInstance?.focus(true);
				}
			}
		} else {
			// Adjust the active group if the removed group was above the active group
			if (this.activeGroupIndex > index) {
				this.setActiveGroupByIndex(this.activeGroupIndex - 1);
			}
		}
		// Ensure the active group is still valid, this should set the activeGroupIndex to -1 if
		// there are no groups
		if (this.activeGroupIndex >= this.groups.length) {
			this.setActiveGroupByIndex(this.groups.length - 1);
		}

		this._onDidChangeInstances.fire();
		this._onDidChangeGroups.fire();
		if (wasActiveGroup) {
			this._onDidChangeActiveGroup.fire(this.activeGroup);
			this._onDidChangeActiveInstance.fire(this.activeInstance);
		}
	}

	/**
	 * @param force Whether to force the group change, this should be used when the previous active
	 * group has been removed.
	 */
	setActiveGroupByIndex(index: number, force?: boolean) {
		// Unset active group when the last group is removed
		if (index === -1 && this.groups.length === 0) {
			if (this.activeGroupIndex !== -1) {
				this.activeGroupIndex = -1;
				this._onDidChangeActiveGroup.fire(this.activeGroup);
				this._onDidChangeActiveInstance.fire(this.activeInstance);
			}
			return;
		}

		// Ensure index is valid
		if (index < 0 || index >= this.groups.length) {
			return;
		}

		// Fire group/instance change if needed
		const oldActiveGroup = this.activeGroup;
		this.activeGroupIndex = index;
		if (force || oldActiveGroup !== this.activeGroup) {
			this._onDidChangeActiveGroup.fire(this.activeGroup);
			this._onDidChangeActiveInstance.fire(this.activeInstance);
		}
	}

	private _getInstanceLocation(index: number): IInstanceLocation | undefined {
		let currentGroupIndex = 0;
		while (index >= 0 && currentGroupIndex < this.groups.length) {
			const group = this.groups[currentGroupIndex];
			const count = group.terminalInstances.length;
			if (index < count) {
				return {
					group,
					groupIndex: currentGroupIndex,
					instance: group.terminalInstances[index],
					instanceIndex: index
				};
			}
			index -= count;
			currentGroupIndex++;
		}
		return undefined;
	}

	setActiveInstanceByIndex(index: number) {
		const activeInstance = this.activeInstance;
		const instanceLocation = this._getInstanceLocation(index);
		const newActiveInstance = instanceLocation?.group.terminalInstances[instanceLocation.instanceIndex];
		if (!instanceLocation || activeInstance === newActiveInstance) {
			return;
		}

		const activeInstanceIndex = instanceLocation.instanceIndex;

		this.activeGroupIndex = instanceLocation.groupIndex;
		this._onDidChangeActiveGroup.fire(this.activeGroup);
		instanceLocation.group.setActiveInstanceByIndex(activeInstanceIndex, true);
	}

	setActiveGroupToNext() {
		if (this.groups.length <= 1) {
			return;
		}
		let newIndex = this.activeGroupIndex + 1;
		if (newIndex >= this.groups.length) {
			newIndex = 0;
		}
		this.setActiveGroupByIndex(newIndex);
	}

	setActiveGroupToPrevious() {
		if (this.groups.length <= 1) {
			return;
		}
		let newIndex = this.activeGroupIndex - 1;
		if (newIndex < 0) {
			newIndex = this.groups.length - 1;
		}
		this.setActiveGroupByIndex(newIndex);
	}

	private _getValidTerminalGroups = (sources: ITerminalInstance[]): Set<ITerminalGroup> => {
		return new Set(
			sources
				.map(source => this.getGroupForInstance(source))
				.filter((group) => group !== undefined)
		);
	};

	moveGroup(source: SingleOrMany<ITerminalInstance>, target: ITerminalInstance) {
		source = asArray(source);
		const sourceGroups = this._getValidTerminalGroups(source);
		const targetGroup = this.getGroupForInstance(target);
		if (!targetGroup || sourceGroups.size === 0) {
			return;
		}

		// The groups are the same, rearrange within the group
		if (sourceGroups.size === 1 && sourceGroups.has(targetGroup)) {
			const targetIndex = targetGroup.terminalInstances.indexOf(target);
			const sortedSources = source.sort((a, b) => {
				return targetGroup.terminalInstances.indexOf(a) - targetGroup.terminalInstances.indexOf(b);
			});
			const firstTargetIndex = targetGroup.terminalInstances.indexOf(sortedSources[0]);
			const position: 'before' | 'after' = firstTargetIndex < targetIndex ? 'after' : 'before';
			targetGroup.moveInstance(sortedSources, targetIndex, position);
			this._onDidChangeInstances.fire();
			return;
		}

		// The groups differ, rearrange groups
		const targetGroupIndex = this.groups.indexOf(targetGroup);
		const sortedSourceGroups = Array.from(sourceGroups).sort((a, b) => {
			return this.groups.indexOf(a) - this.groups.indexOf(b);
		});
		const firstSourceGroupIndex = this.groups.indexOf(sortedSourceGroups[0]);
		const position: 'before' | 'after' = firstSourceGroupIndex < targetGroupIndex ? 'after' : 'before';
		const insertIndex = position === 'after' ? targetGroupIndex + 1 : targetGroupIndex;
		this.groups.splice(insertIndex, 0, ...sortedSourceGroups);
		for (const sourceGroup of sortedSourceGroups) {
			const originSourceGroupIndex = position === 'after' ? this.groups.indexOf(sourceGroup) : this.groups.lastIndexOf(sourceGroup);
			this.groups.splice(originSourceGroupIndex, 1);
		}
		this._onDidChangeInstances.fire();
	}

	moveGroupToEnd(source: SingleOrMany<ITerminalInstance>): void {
		source = asArray(source);
		const sourceGroups = this._getValidTerminalGroups(source);
		if (sourceGroups.size === 0) {
			return;
		}
		const lastInstanceIndex = this.groups.length - 1;
		const sortedSourceGroups = Array.from(sourceGroups).sort((a, b) => {
			return this.groups.indexOf(a) - this.groups.indexOf(b);
		});
		this.groups.splice(lastInstanceIndex + 1, 0, ...sortedSourceGroups);
		for (const sourceGroup of sortedSourceGroups) {
			const sourceGroupIndex = this.groups.indexOf(sourceGroup);
			this.groups.splice(sourceGroupIndex, 1);
		}
		this._onDidChangeInstances.fire();
	}

	moveInstance(source: ITerminalInstance, target: ITerminalInstance, side: 'before' | 'after') {
		const sourceGroup = this.getGroupForInstance(source);
		const targetGroup = this.getGroupForInstance(target);
		if (!sourceGroup || !targetGroup) {
			return;
		}

		// Move from the source group to the target group
		if (sourceGroup !== targetGroup) {
			// Move groups
			sourceGroup.removeInstance(source);
			targetGroup.addInstance(source);
		}

		// Rearrange within the target group
		const index = targetGroup.terminalInstances.indexOf(target) + (side === 'after' ? 1 : 0);
		targetGroup.moveInstance(source, index, side);
	}

	unsplitInstance(instance: ITerminalInstance) {
		const oldGroup = this.getGroupForInstance(instance);
		if (!oldGroup || oldGroup.terminalInstances.length < 2) {
			return;
		}

		oldGroup.removeInstance(instance);
		this.createGroup(instance);
	}

	joinInstances(instances: ITerminalInstance[]) {
		const group = this.getGroupForInstance(instances[0]);
		if (group) {
			let differentGroups = true;
			for (let i = 1; i < group.terminalInstances.length; i++) {
				if (group.terminalInstances.includes(instances[i])) {
					differentGroups = false;
					break;
				}
			}
			if (!differentGroups && group.terminalInstances.length === instances.length) {
				return;
			}
		}
		// Find the group of the first instance that is the only instance in the group, if one exists
		let candidateInstance: ITerminalInstance | undefined = undefined;
		let candidateGroup: ITerminalGroup | undefined = undefined;
		for (const instance of instances) {
			const group = this.getGroupForInstance(instance);
			if (group?.terminalInstances.length === 1) {
				candidateInstance = instance;
				candidateGroup = group;
				break;
			}
		}

		// Create a new group if needed
		if (!candidateGroup) {
			candidateGroup = this.createGroup();
		}

		const wasActiveGroup = this.activeGroup === candidateGroup;

		// Unsplit all other instances and add them to the new group
		for (const instance of instances) {
			if (instance === candidateInstance) {
				continue;
			}

			const oldGroup = this.getGroupForInstance(instance);
			if (!oldGroup) {
				// Something went wrong, don't join this one
				continue;
			}
			oldGroup.removeInstance(instance);
			candidateGroup.addInstance(instance);
		}

		// Set the active terminal
		this.setActiveInstance(instances[0]);

		// Fire events
		this._onDidChangeInstances.fire();
		if (!wasActiveGroup) {
			this._onDidChangeActiveGroup.fire(this.activeGroup);
		}
	}

	instanceIsSplit(instance: ITerminalInstance): boolean {
		const group = this.getGroupForInstance(instance);
		if (!group) {
			return false;
		}
		return group.terminalInstances.length > 1;
	}

	getGroupForInstance(instance: ITerminalInstance): ITerminalGroup | undefined {
		return this.groups.find(group => group.terminalInstances.includes(instance));
	}

	getGroupLabels(): string[] {
		return this.groups.filter(group => group.terminalInstances.length > 0).map((group, index) => {
			return `${index + 1}: ${group.title ? group.title : ''}`;
		});
	}

	/**
	 * Visibility should be updated in the following cases:
	 * 1. Toggle `TERMINAL_VIEW_ID` visibility
	 * 2. Change active group
	 * 3. Change instances in active group
	 */
	updateVisibility() {
		const visible = this._viewsService.isViewVisible(TERMINAL_VIEW_ID);
		this.groups.forEach((g, i) => g.setVisible(visible && i === this.activeGroupIndex));
	}
}

interface IInstanceLocation {
	group: ITerminalGroup;
	groupIndex: number;
	instance: ITerminalInstance;
	instanceIndex: number;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalIcon.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalIcon.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { hash } from '../../../../base/common/hash.js';
import { URI } from '../../../../base/common/uri.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IExtensionTerminalProfile, ITerminalProfile } from '../../../../platform/terminal/common/terminal.js';
import { getIconRegistry } from '../../../../platform/theme/common/iconRegistry.js';
import { ColorScheme, isDark } from '../../../../platform/theme/common/theme.js';
import { IColorTheme } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { ITerminalInstance } from './terminal.js';
import { ITerminalProfileResolverService } from '../common/terminal.js';
import { ansiColorMap } from '../common/terminalColorRegistry.js';
import { createStyleSheet } from '../../../../base/browser/domStylesheets.js';
import { DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { isString } from '../../../../base/common/types.js';


export function getColorClass(colorKey: string): string;
export function getColorClass(profile: ITerminalProfile): string;
export function getColorClass(terminal: ITerminalInstance): string | undefined;
export function getColorClass(extensionTerminalProfile: IExtensionTerminalProfile): string | undefined;
export function getColorClass(terminalOrColorKey: ITerminalInstance | IExtensionTerminalProfile | ITerminalProfile | string): string | undefined {
	let color = undefined;
	if (isString(terminalOrColorKey)) {
		color = terminalOrColorKey;
	} else if (terminalOrColorKey.color) {
		color = terminalOrColorKey.color.replace(/\./g, '_');
	} else if (ThemeIcon.isThemeIcon(terminalOrColorKey.icon) && terminalOrColorKey.icon.color) {
		color = terminalOrColorKey.icon.color.id.replace(/\./g, '_');
	}
	if (color) {
		return `terminal-icon-${color.replace(/\./g, '_')}`;
	}
	return undefined;
}

export function getStandardColors(colorTheme: IColorTheme): string[] {
	const standardColors: string[] = [];

	for (const colorKey in ansiColorMap) {
		const color = colorTheme.getColor(colorKey);
		if (color && !colorKey.toLowerCase().includes('bright')) {
			standardColors.push(colorKey);
		}
	}
	return standardColors;
}

export function createColorStyleElement(colorTheme: IColorTheme): IDisposable {
	const disposable = new DisposableStore();
	const standardColors = getStandardColors(colorTheme);
	const styleElement = createStyleSheet(undefined, undefined, disposable);
	let css = '';
	for (const colorKey of standardColors) {
		const colorClass = getColorClass(colorKey);
		const color = colorTheme.getColor(colorKey);
		if (color) {
			css += (
				`.monaco-workbench .${colorClass} .codicon:first-child:not(.codicon-split-horizontal):not(.codicon-trashcan):not(.file-icon)` +
				`{ color: ${color} !important; }`
			);
		}
	}
	styleElement.textContent = css;
	return disposable;
}

export function getColorStyleContent(colorTheme: IColorTheme, editor?: boolean): string {
	const standardColors = getStandardColors(colorTheme);
	let css = '';
	for (const colorKey of standardColors) {
		const colorClass = getColorClass(colorKey);
		const color = colorTheme.getColor(colorKey);
		if (color) {
			if (editor) {
				css += (
					`.monaco-workbench .show-file-icons .predefined-file-icon.terminal-tab.${colorClass}::before,` +
					`.monaco-workbench .show-file-icons .file-icon.terminal-tab.${colorClass}::before` +
					`{ color: ${color} !important; }`
				);
			} else {
				css += (
					`.monaco-workbench .${colorClass} .codicon:first-child:not(.codicon-split-horizontal):not(.codicon-trashcan):not(.file-icon)` +
					`{ color: ${color} !important; }`
				);
			}
		}
	}
	return css;
}

export function getUriClasses(terminal: ITerminalInstance | IExtensionTerminalProfile | ITerminalProfile, colorScheme: ColorScheme, extensionContributed?: boolean): string[] | undefined {
	const icon = terminal.icon;
	if (!icon) {
		return undefined;
	}
	const iconClasses: string[] = [];
	let uri = undefined;

	if (extensionContributed) {
		if (isString(icon) && (icon.startsWith('$(') || getIconRegistry().getIcon(icon))) {
			return iconClasses;
		} else if (isString(icon)) {
			uri = URI.parse(icon);
		}
	}

	if (URI.isUri(icon)) {
		uri = icon;
	} else if (!ThemeIcon.isThemeIcon(icon) && !isString(icon)) {
		uri = isDark(colorScheme) ? icon.dark : icon.light;
	}
	if (uri instanceof URI) {
		const uriIconKey = hash(uri.path).toString(36);
		const className = `terminal-uri-icon-${uriIconKey}`;
		iconClasses.push(className);
		iconClasses.push(`terminal-uri-icon`);
	}
	return iconClasses;
}

export function getIconId(accessor: ServicesAccessor, terminal: ITerminalInstance | IExtensionTerminalProfile | ITerminalProfile): string {
	if (isString(terminal.icon)) {
		return terminal.icon;
	}
	if (ThemeIcon.isThemeIcon(terminal.icon)) {
		return terminal.icon.id;
	}
	return accessor.get(ITerminalProfileResolverService).getDefaultIcon().id;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalIconPicker.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalIconPicker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Dimension, getActiveDocument } from '../../../../base/browser/dom.js';
import { HoverPosition } from '../../../../base/browser/ui/hover/hoverWidget.js';
import { codiconsLibrary } from '../../../../base/common/codiconsLibrary.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILayoutService } from '../../../../platform/layout/browser/layoutService.js';
import { defaultInputBoxStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { getIconRegistry, IconContribution } from '../../../../platform/theme/common/iconRegistry.js';
import { WorkbenchIconSelectBox } from '../../../services/userDataProfile/browser/iconSelectBox.js';

const icons = new Lazy<IconContribution[]>(() => {
	const iconDefinitions = getIconRegistry().getIcons();
	const includedChars = new Set<string>();
	const dedupedIcons = iconDefinitions.filter(e => {
		if (e.id === codiconsLibrary.blank.id) {
			return false;
		}
		if (ThemeIcon.isThemeIcon(e.defaults)) {
			return false;
		}
		if (includedChars.has(e.defaults.fontCharacter)) {
			return false;
		}
		includedChars.add(e.defaults.fontCharacter);
		return true;
	});
	return dedupedIcons;
});

export class TerminalIconPicker extends Disposable {
	private readonly _iconSelectBox: WorkbenchIconSelectBox;

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@IHoverService private readonly _hoverService: IHoverService,
		@ILayoutService private readonly _layoutService: ILayoutService,
	) {
		super();

		this._iconSelectBox = instantiationService.createInstance(WorkbenchIconSelectBox, {
			icons: icons.value,
			inputBoxStyles: defaultInputBoxStyles
		});
	}

	async pickIcons(): Promise<ThemeIcon | undefined> {
		const dimension = new Dimension(486, 260);
		return new Promise<ThemeIcon | undefined>(resolve => {
			this._register(this._iconSelectBox.onDidSelect(e => {
				resolve(e);
				this._iconSelectBox.dispose();
			}));
			this._iconSelectBox.clearInput();
			const body = getActiveDocument().body;
			const bodyRect = body.getBoundingClientRect();
			const hoverWidget = this._hoverService.showInstantHover({
				content: this._iconSelectBox.domNode,
				target: {
					targetElements: [body],
					x: bodyRect.left + (bodyRect.width - dimension.width) / 2,
					y: bodyRect.top + this._layoutService.activeContainerOffset.top
				},
				position: {
					hoverPosition: HoverPosition.BELOW,
				},
				persistence: {
					sticky: true,
				},
			}, true);
			if (hoverWidget) {
				this._register(hoverWidget);
			}
			this._iconSelectBox.layout(dimension);
			this._iconSelectBox.focus();
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/terminalIcons.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/terminalIcons.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { localize } from '../../../../nls.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';

export const terminalViewIcon = registerIcon('terminal-view-icon', Codicon.terminal, localize('terminalViewIcon', 'View icon of the terminal view.'));

export const renameTerminalIcon = registerIcon('terminal-rename', Codicon.edit, localize('renameTerminalIcon', 'Icon for rename in the terminal quick menu.'));
export const killTerminalIcon = registerIcon('terminal-kill', Codicon.trash, localize('killTerminalIcon', 'Icon for killing a terminal instance.'));
export const newTerminalIcon = registerIcon('terminal-new', Codicon.add, localize('newTerminalIcon', 'Icon for creating a new terminal instance.'));

export const configureTerminalProfileIcon = registerIcon('terminal-configure-profile', Codicon.gear, localize('configureTerminalProfileIcon', 'Icon for creating a new terminal profile.'));

export const terminalDecorationMark = registerIcon('terminal-decoration-mark', Codicon.circleSmallFilled, localize('terminalDecorationMark', 'Icon for a terminal decoration mark.'));
export const terminalDecorationIncomplete = registerIcon('terminal-decoration-incomplete', Codicon.circle, localize('terminalDecorationIncomplete', 'Icon for a terminal decoration of a command that was incomplete.'));
export const terminalDecorationError = registerIcon('terminal-decoration-error', Codicon.errorSmall, localize('terminalDecorationError', 'Icon for a terminal decoration of a command that errored.'));
export const terminalDecorationSuccess = registerIcon('terminal-decoration-success', Codicon.circleFilled, localize('terminalDecorationSuccess', 'Icon for a terminal decoration of a command that was successful.'));

export const commandHistoryRemoveIcon = registerIcon('terminal-command-history-remove', Codicon.close, localize('terminalCommandHistoryRemove', 'Icon for removing a terminal command from command history.'));
export const commandHistoryOutputIcon = registerIcon('terminal-command-history-output', Codicon.output, localize('terminalCommandHistoryOutput', 'Icon for viewing output of a terminal command.'));
export const commandHistoryFuzzySearchIcon = registerIcon('terminal-command-history-fuzzy-search', Codicon.searchFuzzy, localize('terminalCommandHistoryFuzzySearch', 'Icon for toggling fuzzy search of command history.'));
export const commandHistoryOpenFileIcon = registerIcon('terminal-command-history-open-file', Codicon.symbolReference, localize('terminalCommandHistoryOpenFile', 'Icon for opening a shell history file.'));
```

--------------------------------------------------------------------------------

````
