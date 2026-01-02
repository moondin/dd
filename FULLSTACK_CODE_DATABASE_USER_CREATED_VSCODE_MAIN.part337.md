---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 337
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 337 of 552)

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

---[FILE: src/vs/workbench/browser/parts/titlebar/menubarControl.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/titlebar/menubarControl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/menubarControl.css';
import { localize, localize2 } from '../../../../nls.js';
import { IMenuService, MenuId, IMenu, SubmenuItemAction, registerAction2, Action2, MenuItemAction, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { MenuBarVisibility, IWindowOpenable, getMenuBarVisibility, MenuSettings, hasNativeMenu } from '../../../../platform/window/common/window.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IAction, Action, SubmenuAction, Separator, IActionRunner, ActionRunner, WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification, toAction } from '../../../../base/common/actions.js';
import { addDisposableListener, Dimension, EventType } from '../../../../base/browser/dom.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { isMacintosh, isWeb, isIOS, isNative } from '../../../../base/common/platform.js';
import { IConfigurationService, IConfigurationChangeEvent } from '../../../../platform/configuration/common/configuration.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { IRecentlyOpened, isRecentFolder, IRecent, isRecentWorkspace, IWorkspacesService } from '../../../../platform/workspaces/common/workspaces.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { URI } from '../../../../base/common/uri.js';
import { ILabelService, Verbosity } from '../../../../platform/label/common/label.js';
import { IUpdateService, StateType } from '../../../../platform/update/common/update.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { MenuBar, IMenuBarOptions } from '../../../../base/browser/ui/menu/menubar.js';
import { HorizontalDirection, IMenuDirection, VerticalDirection } from '../../../../base/browser/ui/menu/menu.js';
import { mnemonicMenuLabel, unmnemonicLabel } from '../../../../base/common/labels.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { isFullscreen, onDidChangeFullscreen } from '../../../../base/browser/browser.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { BrowserFeatures } from '../../../../base/browser/canIUse.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IsMacNativeContext, IsWebContext } from '../../../../platform/contextkey/common/contextkeys.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { OpenRecentAction } from '../../actions/windowActions.js';
import { isICommandActionToggleInfo } from '../../../../platform/action/common/action.js';
import { getFlatContextMenuActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { defaultMenuStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { ActivityBarPosition } from '../../../services/layout/browser/layoutService.js';

export type IOpenRecentAction = IAction & { uri: URI; remoteAuthority?: string };

MenuRegistry.appendMenuItem(MenuId.MenubarMainMenu, {
	submenu: MenuId.MenubarFileMenu,
	title: {
		value: 'File',
		original: 'File',
		mnemonicTitle: localize({ key: 'mFile', comment: ['&& denotes a mnemonic'] }, "&&File"),
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarMainMenu, {
	submenu: MenuId.MenubarEditMenu,
	title: {
		value: 'Edit',
		original: 'Edit',
		mnemonicTitle: localize({ key: 'mEdit', comment: ['&& denotes a mnemonic'] }, "&&Edit")
	},
	order: 2
});

MenuRegistry.appendMenuItem(MenuId.MenubarMainMenu, {
	submenu: MenuId.MenubarSelectionMenu,
	title: {
		value: 'Selection',
		original: 'Selection',
		mnemonicTitle: localize({ key: 'mSelection', comment: ['&& denotes a mnemonic'] }, "&&Selection")
	},
	order: 3
});

MenuRegistry.appendMenuItem(MenuId.MenubarMainMenu, {
	submenu: MenuId.MenubarViewMenu,
	title: {
		value: 'View',
		original: 'View',
		mnemonicTitle: localize({ key: 'mView', comment: ['&& denotes a mnemonic'] }, "&&View")
	},
	order: 4
});

MenuRegistry.appendMenuItem(MenuId.MenubarMainMenu, {
	submenu: MenuId.MenubarGoMenu,
	title: {
		value: 'Go',
		original: 'Go',
		mnemonicTitle: localize({ key: 'mGoto', comment: ['&& denotes a mnemonic'] }, "&&Go")
	},
	order: 5
});

MenuRegistry.appendMenuItem(MenuId.MenubarMainMenu, {
	submenu: MenuId.MenubarTerminalMenu,
	title: {
		value: 'Terminal',
		original: 'Terminal',
		mnemonicTitle: localize({ key: 'mTerminal', comment: ['&& denotes a mnemonic'] }, "&&Terminal")
	},
	order: 7
});

MenuRegistry.appendMenuItem(MenuId.MenubarMainMenu, {
	submenu: MenuId.MenubarHelpMenu,
	title: {
		value: 'Help',
		original: 'Help',
		mnemonicTitle: localize({ key: 'mHelp', comment: ['&& denotes a mnemonic'] }, "&&Help")
	},
	order: 8
});

MenuRegistry.appendMenuItem(MenuId.MenubarMainMenu, {
	submenu: MenuId.MenubarPreferencesMenu,
	title: {
		value: 'Preferences',
		original: 'Preferences',
		mnemonicTitle: localize({ key: 'mPreferences', comment: ['&& denotes a mnemonic'] }, "Preferences")
	},
	when: IsMacNativeContext,
	order: 9
});

export abstract class MenubarControl extends Disposable {

	protected keys = [
		MenuSettings.MenuBarVisibility,
		'window.enableMenuBarMnemonics',
		'window.customMenuBarAltFocus',
		'workbench.sideBar.location',
		'window.nativeTabs'
	];

	protected mainMenu: IMenu;
	protected menus: {
		[index: string]: IMenu | undefined;
	} = {};

	protected topLevelTitles: { [menu: string]: string } = {};

	protected readonly mainMenuDisposables: DisposableStore;

	protected recentlyOpened: IRecentlyOpened = { files: [], workspaces: [] };

	protected menuUpdater: RunOnceScheduler;

	protected static readonly MAX_MENU_RECENT_ENTRIES = 10;

	constructor(
		protected readonly menuService: IMenuService,
		protected readonly workspacesService: IWorkspacesService,
		protected readonly contextKeyService: IContextKeyService,
		protected readonly keybindingService: IKeybindingService,
		protected readonly configurationService: IConfigurationService,
		protected readonly labelService: ILabelService,
		protected readonly updateService: IUpdateService,
		protected readonly storageService: IStorageService,
		protected readonly notificationService: INotificationService,
		protected readonly preferencesService: IPreferencesService,
		protected readonly environmentService: IWorkbenchEnvironmentService,
		protected readonly accessibilityService: IAccessibilityService,
		protected readonly hostService: IHostService,
		protected readonly commandService: ICommandService
	) {

		super();

		this.mainMenu = this._register(this.menuService.createMenu(MenuId.MenubarMainMenu, this.contextKeyService));
		this.mainMenuDisposables = this._register(new DisposableStore());

		this.setupMainMenu();

		this.menuUpdater = this._register(new RunOnceScheduler(() => this.doUpdateMenubar(false), 200));

		this.notifyUserOfCustomMenubarAccessibility();
	}

	protected abstract doUpdateMenubar(firstTime: boolean): void;

	protected registerListeners(): void {
		// Listen for window focus changes
		this._register(this.hostService.onDidChangeFocus(e => this.onDidChangeWindowFocus(e)));

		// Update when config changes
		this._register(this.configurationService.onDidChangeConfiguration(e => this.onConfigurationUpdated(e)));

		// Listen to update service
		this._register(this.updateService.onStateChange(() => this.onUpdateStateChange()));

		// Listen for changes in recently opened menu
		this._register(this.workspacesService.onDidChangeRecentlyOpened(() => { this.onDidChangeRecentlyOpened(); }));

		// Listen to keybindings change
		this._register(this.keybindingService.onDidUpdateKeybindings(() => this.updateMenubar()));

		// Update recent menu items on formatter registration
		this._register(this.labelService.onDidChangeFormatters(() => { this.onDidChangeRecentlyOpened(); }));

		// Listen for changes on the main menu
		this._register(this.mainMenu.onDidChange(() => { this.setupMainMenu(); this.doUpdateMenubar(true); }));
	}

	protected setupMainMenu(): void {
		this.mainMenuDisposables.clear();
		this.menus = {};
		this.topLevelTitles = {};

		const [, mainMenuActions] = this.mainMenu.getActions()[0];
		for (const mainMenuAction of mainMenuActions) {
			if (mainMenuAction instanceof SubmenuItemAction && typeof mainMenuAction.item.title !== 'string') {
				this.menus[mainMenuAction.item.title.original] = this.mainMenuDisposables.add(this.menuService.createMenu(mainMenuAction.item.submenu, this.contextKeyService, { emitEventsForSubmenuChanges: true }));
				this.topLevelTitles[mainMenuAction.item.title.original] = mainMenuAction.item.title.mnemonicTitle ?? mainMenuAction.item.title.value;
			}
		}
	}

	protected updateMenubar(): void {
		this.menuUpdater.schedule();
	}

	protected calculateActionLabel(action: { id: string; label: string }): string {
		const label = action.label;
		switch (action.id) {
			default:
				break;
		}

		return label;
	}

	protected onUpdateStateChange(): void {
		this.updateMenubar();
	}

	protected onUpdateKeybindings(): void {
		this.updateMenubar();
	}

	protected getOpenRecentActions(): (Separator | IOpenRecentAction)[] {
		if (!this.recentlyOpened) {
			return [];
		}

		const { workspaces, files } = this.recentlyOpened;

		const result = [];

		if (workspaces.length > 0) {
			for (let i = 0; i < MenubarControl.MAX_MENU_RECENT_ENTRIES && i < workspaces.length; i++) {
				result.push(this.createOpenRecentMenuAction(workspaces[i]));
			}

			result.push(new Separator());
		}

		if (files.length > 0) {
			for (let i = 0; i < MenubarControl.MAX_MENU_RECENT_ENTRIES && i < files.length; i++) {
				result.push(this.createOpenRecentMenuAction(files[i]));
			}

			result.push(new Separator());
		}

		return result;
	}

	protected onDidChangeWindowFocus(hasFocus: boolean): void {
		// When we regain focus, update the recent menu items
		if (hasFocus) {
			this.onDidChangeRecentlyOpened();
		}
	}

	private onConfigurationUpdated(event: IConfigurationChangeEvent): void {
		if (this.keys.some(key => event.affectsConfiguration(key))) {
			this.updateMenubar();
		}

		if (event.affectsConfiguration('editor.accessibilitySupport')) {
			this.notifyUserOfCustomMenubarAccessibility();
		}

		// Since we try not update when hidden, we should
		// try to update the recently opened list on visibility changes
		if (event.affectsConfiguration(MenuSettings.MenuBarVisibility)) {
			this.onDidChangeRecentlyOpened();
		}
	}

	private get menubarHidden(): boolean {
		return isMacintosh && isNative ? false : getMenuBarVisibility(this.configurationService) === 'hidden';
	}

	protected onDidChangeRecentlyOpened(): void {

		// Do not update recently opened when the menubar is hidden #108712
		if (!this.menubarHidden) {
			this.workspacesService.getRecentlyOpened().then(recentlyOpened => {
				this.recentlyOpened = recentlyOpened;
				this.updateMenubar();
			});
		}
	}

	private createOpenRecentMenuAction(recent: IRecent): IOpenRecentAction {

		let label: string;
		let uri: URI;
		let commandId: string;
		let openable: IWindowOpenable;
		const remoteAuthority = recent.remoteAuthority;

		if (isRecentFolder(recent)) {
			uri = recent.folderUri;
			label = recent.label || this.labelService.getWorkspaceLabel(uri, { verbose: Verbosity.LONG });
			commandId = 'openRecentFolder';
			openable = { folderUri: uri };
		} else if (isRecentWorkspace(recent)) {
			uri = recent.workspace.configPath;
			label = recent.label || this.labelService.getWorkspaceLabel(recent.workspace, { verbose: Verbosity.LONG });
			commandId = 'openRecentWorkspace';
			openable = { workspaceUri: uri };
		} else {
			uri = recent.fileUri;
			label = recent.label || this.labelService.getUriLabel(uri, { appendWorkspaceSuffix: true });
			commandId = 'openRecentFile';
			openable = { fileUri: uri };
		}

		const ret = toAction({
			id: commandId, label: unmnemonicLabel(label), run: (browserEvent: KeyboardEvent) => {
				const openInNewWindow = browserEvent && ((!isMacintosh && (browserEvent.ctrlKey || browserEvent.shiftKey)) || (isMacintosh && (browserEvent.metaKey || browserEvent.altKey)));

				return this.hostService.openWindow([openable], {
					forceNewWindow: !!openInNewWindow,
					remoteAuthority: remoteAuthority || null // local window if remoteAuthority is not set or can not be deducted from the openable
				});
			}
		});

		return Object.assign(ret, { uri, remoteAuthority });
	}

	private notifyUserOfCustomMenubarAccessibility(): void {
		if (isWeb || isMacintosh) {
			return;
		}

		const hasBeenNotified = this.storageService.getBoolean('menubar/accessibleMenubarNotified', StorageScope.APPLICATION, false);
		const usingCustomMenubar = !hasNativeMenu(this.configurationService);

		if (hasBeenNotified || usingCustomMenubar || !this.accessibilityService.isScreenReaderOptimized()) {
			return;
		}

		const message = localize('menubar.customTitlebarAccessibilityNotification', "Accessibility support is enabled for you. For the most accessible experience, we recommend the custom menu style.");
		this.notificationService.prompt(Severity.Info, message, [
			{
				label: localize('goToSetting', "Open Settings"),
				run: () => {
					return this.preferencesService.openUserSettings({ query: MenuSettings.MenuStyle });
				}
			}
		]);

		this.storageService.store('menubar/accessibleMenubarNotified', true, StorageScope.APPLICATION, StorageTarget.USER);
	}
}

// This is a bit complex due to the issue https://github.com/microsoft/vscode/issues/205836
let focusMenuBarEmitter: Emitter<void> | undefined = undefined;
function enableFocusMenuBarAction(): Emitter<void> {
	if (!focusMenuBarEmitter) {
		focusMenuBarEmitter = new Emitter<void>();

		registerAction2(class extends Action2 {
			constructor() {
				super({
					id: `workbench.actions.menubar.focus`,
					title: localize2('focusMenu', 'Focus Application Menu'),
					keybinding: {
						primary: KeyMod.Alt | KeyCode.F10,
						weight: KeybindingWeight.WorkbenchContrib,
						when: IsWebContext
					},
					f1: true
				});
			}

			async run(): Promise<void> {
				focusMenuBarEmitter?.fire();
			}
		});
	}

	return focusMenuBarEmitter;
}

export class CustomMenubarControl extends MenubarControl {
	private menubar: MenuBar | undefined;
	private container: HTMLElement | undefined;
	private alwaysOnMnemonics: boolean = false;
	private focusInsideMenubar: boolean = false;
	private pendingFirstTimeUpdate: boolean = false;
	private visible: boolean = true;
	private actionRunner: IActionRunner;
	private readonly webNavigationMenu = this._register(this.menuService.createMenu(MenuId.MenubarHomeMenu, this.contextKeyService));

	private readonly _onVisibilityChange: Emitter<boolean>;
	private readonly _onFocusStateChange: Emitter<boolean>;

	constructor(
		@IMenuService menuService: IMenuService,
		@IWorkspacesService workspacesService: IWorkspacesService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IConfigurationService configurationService: IConfigurationService,
		@ILabelService labelService: ILabelService,
		@IUpdateService updateService: IUpdateService,
		@IStorageService storageService: IStorageService,
		@INotificationService notificationService: INotificationService,
		@IPreferencesService preferencesService: IPreferencesService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IAccessibilityService accessibilityService: IAccessibilityService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IHostService hostService: IHostService,
		@ICommandService commandService: ICommandService
	) {
		super(menuService, workspacesService, contextKeyService, keybindingService, configurationService, labelService, updateService, storageService, notificationService, preferencesService, environmentService, accessibilityService, hostService, commandService);

		this._onVisibilityChange = this._register(new Emitter<boolean>());
		this._onFocusStateChange = this._register(new Emitter<boolean>());

		this.actionRunner = this._register(new ActionRunner());
		this.actionRunner.onDidRun(e => {
			this.telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: e.action.id, from: 'menu' });
		});

		this.workspacesService.getRecentlyOpened().then((recentlyOpened) => {
			this.recentlyOpened = recentlyOpened;
		});

		this.registerListeners();
	}

	protected doUpdateMenubar(firstTime: boolean): void {
		if (!this.focusInsideMenubar) {
			this.setupCustomMenubar(firstTime);
		}

		if (firstTime) {
			this.pendingFirstTimeUpdate = true;
		}
	}

	private getUpdateAction(): IAction | null {
		const state = this.updateService.state;

		switch (state.type) {
			case StateType.Idle:
				return toAction({
					id: 'update.check', label: localize({ key: 'checkForUpdates', comment: ['&& denotes a mnemonic'] }, "Check for &&Updates..."), enabled: true, run: () =>
						this.updateService.checkForUpdates(true)
				});

			case StateType.CheckingForUpdates:
				return toAction({ id: 'update.checking', label: localize('checkingForUpdates', "Checking for Updates..."), enabled: false, run: () => { } });

			case StateType.AvailableForDownload:
				return toAction({
					id: 'update.downloadNow', label: localize({ key: 'download now', comment: ['&& denotes a mnemonic'] }, "D&&ownload Update"), enabled: true, run: () =>
						this.updateService.downloadUpdate()
				});

			case StateType.Downloading:
				return toAction({ id: 'update.downloading', label: localize('DownloadingUpdate', "Downloading Update..."), enabled: false, run: () => { } });

			case StateType.Downloaded:
				return isMacintosh ? null : toAction({
					id: 'update.install', label: localize({ key: 'installUpdate...', comment: ['&& denotes a mnemonic'] }, "Install &&Update..."), enabled: true, run: () =>
						this.updateService.applyUpdate()
				});

			case StateType.Updating:
				return toAction({ id: 'update.updating', label: localize('installingUpdate', "Installing Update..."), enabled: false, run: () => { } });

			case StateType.Ready:
				return toAction({
					id: 'update.restart', label: localize({ key: 'restartToUpdate', comment: ['&& denotes a mnemonic'] }, "Restart to &&Update"), enabled: true, run: () =>
						this.updateService.quitAndInstall()
				});

			default:
				return null;
		}
	}

	private get currentMenubarVisibility(): MenuBarVisibility {
		return getMenuBarVisibility(this.configurationService);
	}

	private get currentDisableMenuBarAltFocus(): boolean {
		const settingValue = this.configurationService.getValue<boolean>('window.customMenuBarAltFocus');

		let disableMenuBarAltBehavior = false;
		if (typeof settingValue === 'boolean') {
			disableMenuBarAltBehavior = !settingValue;
		}

		return disableMenuBarAltBehavior;
	}

	private insertActionsBefore(nextAction: IAction, target: IAction[]): void {
		switch (nextAction.id) {
			case OpenRecentAction.ID:
				target.push(...this.getOpenRecentActions());
				break;

			case 'workbench.action.showAboutDialog':
				if (!isMacintosh && !isWeb) {
					const updateAction = this.getUpdateAction();
					if (updateAction) {
						updateAction.label = mnemonicMenuLabel(updateAction.label);
						target.push(updateAction);
						target.push(new Separator());
					}
				}

				break;

			default:
				break;
		}
	}

	private get currentEnableMenuBarMnemonics(): boolean {
		let enableMenuBarMnemonics = this.configurationService.getValue<boolean>('window.enableMenuBarMnemonics');
		if (typeof enableMenuBarMnemonics !== 'boolean') {
			enableMenuBarMnemonics = true;
		}

		return enableMenuBarMnemonics && (!isWeb || isFullscreen(mainWindow));
	}

	private get currentCompactMenuMode(): IMenuDirection | undefined {
		if (this.currentMenubarVisibility !== 'compact') {
			return undefined;
		}

		// Menu bar lives in activity bar and should flow based on its location
		const currentSidebarLocation = this.configurationService.getValue<string>('workbench.sideBar.location');
		const horizontalDirection = currentSidebarLocation === 'right' ? HorizontalDirection.Left : HorizontalDirection.Right;

		const activityBarLocation = this.configurationService.getValue<string>('workbench.activityBar.location');
		const verticalDirection = activityBarLocation === ActivityBarPosition.BOTTOM ? VerticalDirection.Above : VerticalDirection.Below;

		return { horizontal: horizontalDirection, vertical: verticalDirection };
	}

	private onDidVisibilityChange(visible: boolean): void {
		this.visible = visible;
		this.onDidChangeRecentlyOpened();
		this._onVisibilityChange.fire(visible);
	}

	private toActionsArray(menu: IMenu): IAction[] {
		return getFlatContextMenuActions(menu.getActions({ shouldForwardArgs: true }));
	}

	private readonly reinstallDisposables = this._register(new DisposableStore());
	private readonly updateActionsDisposables = this._register(new DisposableStore());
	private setupCustomMenubar(firstTime: boolean): void {
		// If there is no container, we cannot setup the menubar
		if (!this.container) {
			return;
		}

		if (firstTime) {
			// Reset and create new menubar
			if (this.menubar) {
				this.reinstallDisposables.clear();
			}

			this.menubar = this.reinstallDisposables.add(new MenuBar(this.container, this.getMenuBarOptions(), defaultMenuStyles));

			this.accessibilityService.alwaysUnderlineAccessKeys().then(val => {
				this.alwaysOnMnemonics = val;
				this.menubar?.update(this.getMenuBarOptions());
			});

			this.reinstallDisposables.add(this.menubar.onFocusStateChange(focused => {
				this._onFocusStateChange.fire(focused);

				// When the menubar loses focus, update it to clear any pending updates
				if (!focused) {
					if (this.pendingFirstTimeUpdate) {
						this.setupCustomMenubar(true);
						this.pendingFirstTimeUpdate = false;
					} else {
						this.updateMenubar();
					}

					this.focusInsideMenubar = false;
				}
			}));

			this.reinstallDisposables.add(this.menubar.onVisibilityChange(e => this.onDidVisibilityChange(e)));

			// Before we focus the menubar, stop updates to it so that focus-related context keys will work
			this.reinstallDisposables.add(addDisposableListener(this.container, EventType.FOCUS_IN, () => {
				this.focusInsideMenubar = true;
			}));

			this.reinstallDisposables.add(addDisposableListener(this.container, EventType.FOCUS_OUT, () => {
				this.focusInsideMenubar = false;
			}));

			// Fire visibility change for the first install if menu is shown
			if (this.menubar.isVisible) {
				this.onDidVisibilityChange(true);
			}
		} else {
			this.menubar?.update(this.getMenuBarOptions());
		}

		// Update the menu actions
		const updateActions = (menuActions: readonly IAction[], target: IAction[], topLevelTitle: string, store: DisposableStore) => {
			target.splice(0);

			for (const menuItem of menuActions) {
				this.insertActionsBefore(menuItem, target);

				if (menuItem instanceof Separator) {
					target.push(menuItem);
				} else if (menuItem instanceof SubmenuItemAction || menuItem instanceof MenuItemAction) {
					// use mnemonicTitle whenever possible
					let title = typeof menuItem.item.title === 'string'
						? menuItem.item.title
						: menuItem.item.title.mnemonicTitle ?? menuItem.item.title.value;

					if (menuItem instanceof SubmenuItemAction) {
						const submenuActions: SubmenuAction[] = [];
						updateActions(menuItem.actions, submenuActions, topLevelTitle, store);

						if (submenuActions.length > 0) {
							target.push(new SubmenuAction(menuItem.id, mnemonicMenuLabel(title), submenuActions));
						}
					} else {
						if (isICommandActionToggleInfo(menuItem.item.toggled)) {
							title = menuItem.item.toggled.mnemonicTitle ?? menuItem.item.toggled.title ?? title;
						}

						const newAction = store.add(new Action(menuItem.id, mnemonicMenuLabel(title), menuItem.class, menuItem.enabled, () => this.commandService.executeCommand(menuItem.id)));
						newAction.tooltip = menuItem.tooltip;
						newAction.checked = menuItem.checked;
						target.push(newAction);
					}
				}

			}

			// Append web navigation menu items to the file menu when not compact
			if (topLevelTitle === 'File' && this.currentCompactMenuMode === undefined) {
				const webActions = this.getWebNavigationActions();
				if (webActions.length) {
					target.push(...webActions);
				}
			}
		};

		for (const title of Object.keys(this.topLevelTitles)) {
			const menu = this.menus[title];
			if (firstTime && menu) {
				const menuChangedDisposable = this.reinstallDisposables.add(new DisposableStore());
				this.reinstallDisposables.add(menu.onDidChange(() => {
					if (!this.focusInsideMenubar) {
						const actions: IAction[] = [];
						menuChangedDisposable.clear();
						updateActions(this.toActionsArray(menu), actions, title, menuChangedDisposable);
						this.menubar?.updateMenu({ actions, label: mnemonicMenuLabel(this.topLevelTitles[title]) });
					}
				}));

				// For the file menu, we need to update if the web nav menu updates as well
				if (menu === this.menus.File) {
					const webMenuChangedDisposable = this.reinstallDisposables.add(new DisposableStore());
					this.reinstallDisposables.add(this.webNavigationMenu.onDidChange(() => {
						if (!this.focusInsideMenubar) {
							const actions: IAction[] = [];
							webMenuChangedDisposable.clear();
							updateActions(this.toActionsArray(menu), actions, title, webMenuChangedDisposable);
							this.menubar?.updateMenu({ actions, label: mnemonicMenuLabel(this.topLevelTitles[title]) });
						}
					}));
				}
			}

			const actions: IAction[] = [];
			if (menu) {
				this.updateActionsDisposables.clear();
				updateActions(this.toActionsArray(menu), actions, title, this.updateActionsDisposables);
			}

			if (this.menubar) {
				if (!firstTime) {
					this.menubar.updateMenu({ actions, label: mnemonicMenuLabel(this.topLevelTitles[title]) });
				} else {
					this.menubar.push({ actions, label: mnemonicMenuLabel(this.topLevelTitles[title]) });
				}
			}
		}
	}

	private getWebNavigationActions(): IAction[] {
		if (!isWeb) {
			return []; // only for web
		}

		const webNavigationActions = [];
		for (const groups of this.webNavigationMenu.getActions()) {
			const [, actions] = groups;
			for (const action of actions) {
				if (action instanceof MenuItemAction) {
					const title = typeof action.item.title === 'string'
						? action.item.title
						: action.item.title.mnemonicTitle ?? action.item.title.value;
					webNavigationActions.push(toAction({
						id: action.id, label: mnemonicMenuLabel(title), class: action.class, enabled: action.enabled, run: async (event?: unknown) => {
							this.commandService.executeCommand(action.id, event);
						}
					}));
				}
			}

			webNavigationActions.push(new Separator());
		}

		if (webNavigationActions.length) {
			webNavigationActions.pop();
		}

		return webNavigationActions;
	}

	private getMenuBarOptions(): IMenuBarOptions {
		return {
			enableMnemonics: this.currentEnableMenuBarMnemonics,
			disableAltFocus: this.currentDisableMenuBarAltFocus,
			visibility: this.currentMenubarVisibility,
			actionRunner: this.actionRunner,
			getKeybinding: (action) => this.keybindingService.lookupKeybinding(action.id),
			alwaysOnMnemonics: this.alwaysOnMnemonics,
			compactMode: this.currentCompactMenuMode,
			getCompactMenuActions: () => {
				if (!isWeb) {
					return []; // only for web
				}

				return this.getWebNavigationActions();
			}
		};
	}

	protected override onDidChangeWindowFocus(hasFocus: boolean): void {
		if (!this.visible) {
			return;
		}

		super.onDidChangeWindowFocus(hasFocus);

		if (this.container) {
			if (hasFocus) {
				this.container.classList.remove('inactive');
			} else {
				this.container.classList.add('inactive');
				this.menubar?.blur();
			}
		}
	}

	protected override onUpdateStateChange(): void {
		if (!this.visible) {
			return;
		}

		super.onUpdateStateChange();
	}

	protected override onDidChangeRecentlyOpened(): void {
		if (!this.visible) {
			return;
		}

		super.onDidChangeRecentlyOpened();
	}

	protected override onUpdateKeybindings(): void {
		if (!this.visible) {
			return;
		}

		super.onUpdateKeybindings();
	}

	protected override registerListeners(): void {
		super.registerListeners();

		this._register(addDisposableListener(mainWindow, EventType.RESIZE, () => {
			if (this.menubar && !(isIOS && BrowserFeatures.pointerEvents)) {
				this.menubar.blur();
			}
		}));

		// Mnemonics require fullscreen in web
		if (isWeb) {
			this._register(onDidChangeFullscreen(windowId => {
				if (windowId === mainWindow.vscodeWindowId) {
					this.updateMenubar();
				}
			}));
			this._register(this.webNavigationMenu.onDidChange(() => this.updateMenubar()));
			this._register(enableFocusMenuBarAction().event(() => this.menubar?.toggleFocus()));
		}
	}

	get onVisibilityChange(): Event<boolean> {
		return this._onVisibilityChange.event;
	}

	get onFocusStateChange(): Event<boolean> {
		return this._onFocusStateChange.event;
	}

	getMenubarItemsDimensions(): Dimension {
		if (this.menubar) {
			return new Dimension(this.menubar.getWidth(), this.menubar.getHeight());
		}

		return new Dimension(0, 0);
	}

	create(parent: HTMLElement): HTMLElement {
		this.container = parent;

		// Build the menubar
		if (this.container) {
			this.doUpdateMenubar(true);
		}

		return this.container;
	}

	layout(dimension: Dimension) {
		this.menubar?.update(this.getMenuBarOptions());
	}

	toggleFocus() {
		this.menubar?.toggleFocus();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/titlebar/titlebarActions.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/titlebar/titlebarActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILocalizedString, localize, localize2 } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { LayoutSettings } from '../../../services/layout/browser/layoutService.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ContextKeyExpr, ContextKeyExpression, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ACCOUNTS_ACTIVITY_ID, GLOBAL_ACTIVITY_ID } from '../../../common/activity.js';
import { IAction } from '../../../../base/common/actions.js';
import { IsMainWindowFullscreenContext, IsCompactTitleBarContext, TitleBarStyleContext, TitleBarVisibleContext } from '../../../common/contextkeys.js';
import { CustomTitleBarVisibility, TitleBarSetting, TitlebarStyle } from '../../../../platform/window/common/window.js';

// --- Context Menu Actions --- //

export class ToggleTitleBarConfigAction extends Action2 {

	constructor(private readonly section: string, title: string, description: string | ILocalizedString | undefined, order: number, when?: ContextKeyExpression) {

		super({
			id: `toggle.${section}`,
			title,
			metadata: description ? { description } : undefined,
			toggled: ContextKeyExpr.equals(`config.${section}`, true),
			menu: [
				{
					id: MenuId.TitleBarContext,
					when,
					order,
					group: '2_config'
				},
				{
					id: MenuId.TitleBarTitleContext,
					when,
					order,
					group: '2_config'
				}
			]
		});
	}

	run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const configService = accessor.get(IConfigurationService);
		const value = configService.getValue(this.section);
		configService.updateValue(this.section, !value);
	}
}

registerAction2(class ToggleCommandCenter extends ToggleTitleBarConfigAction {
	constructor() {
		super(LayoutSettings.COMMAND_CENTER, localize('toggle.commandCenter', 'Command Center'), localize('toggle.commandCenterDescription', "Toggle visibility of the Command Center in title bar"), 1, IsCompactTitleBarContext.toNegated());
	}
});

registerAction2(class ToggleNavigationControl extends ToggleTitleBarConfigAction {
	constructor() {
		super('workbench.navigationControl.enabled', localize('toggle.navigation', 'Navigation Controls'), localize('toggle.navigationDescription', "Toggle visibility of the Navigation Controls in title bar"), 2, ContextKeyExpr.and(IsCompactTitleBarContext.toNegated(), ContextKeyExpr.has('config.window.commandCenter')));
	}
});

registerAction2(class ToggleLayoutControl extends ToggleTitleBarConfigAction {
	constructor() {
		super(LayoutSettings.LAYOUT_ACTIONS, localize('toggle.layout', 'Layout Controls'), localize('toggle.layoutDescription', "Toggle visibility of the Layout Controls in title bar"), 4);
	}
});

registerAction2(class ToggleCustomTitleBar extends Action2 {
	constructor() {
		super({
			id: `toggle.${TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY}`,
			title: localize('toggle.hideCustomTitleBar', 'Hide Custom Title Bar'),
			menu: [
				{ id: MenuId.TitleBarContext, order: 0, when: ContextKeyExpr.equals(TitleBarStyleContext.key, TitlebarStyle.NATIVE), group: '3_toggle' },
				{ id: MenuId.TitleBarTitleContext, order: 0, when: ContextKeyExpr.equals(TitleBarStyleContext.key, TitlebarStyle.NATIVE), group: '3_toggle' },
			]
		});
	}

	run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const configService = accessor.get(IConfigurationService);
		configService.updateValue(TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY, CustomTitleBarVisibility.NEVER);
	}
});

registerAction2(class ToggleCustomTitleBarWindowed extends Action2 {
	constructor() {
		super({
			id: `toggle.${TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY}.windowed`,
			title: localize('toggle.hideCustomTitleBarInFullScreen', 'Hide Custom Title Bar In Full Screen'),
			menu: [
				{ id: MenuId.TitleBarContext, order: 1, when: IsMainWindowFullscreenContext, group: '3_toggle' },
				{ id: MenuId.TitleBarTitleContext, order: 1, when: IsMainWindowFullscreenContext, group: '3_toggle' },
			]
		});
	}

	run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const configService = accessor.get(IConfigurationService);
		configService.updateValue(TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY, CustomTitleBarVisibility.WINDOWED);
	}
});

class ToggleCustomTitleBar extends Action2 {

	constructor() {
		super({
			id: `toggle.toggleCustomTitleBar`,
			title: localize('toggle.customTitleBar', 'Custom Title Bar'),
			toggled: TitleBarVisibleContext,
			menu: [
				{
					id: MenuId.MenubarAppearanceMenu,
					order: 6,
					when: ContextKeyExpr.or(
						ContextKeyExpr.and(
							ContextKeyExpr.equals(TitleBarStyleContext.key, TitlebarStyle.NATIVE),
							ContextKeyExpr.and(
								ContextKeyExpr.equals('config.workbench.layoutControl.enabled', false),
								ContextKeyExpr.equals('config.window.commandCenter', false),
								ContextKeyExpr.notEquals('config.workbench.editor.editorActionsLocation', 'titleBar'),
								ContextKeyExpr.notEquals('config.workbench.activityBar.location', 'top'),
								ContextKeyExpr.notEquals('config.workbench.activityBar.location', 'bottom')
							)?.negate()
						),
						IsMainWindowFullscreenContext
					),
					group: '2_workbench_layout'
				},
			],
		});
	}

	run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const configService = accessor.get(IConfigurationService);
		const contextKeyService = accessor.get(IContextKeyService);
		const titleBarVisibility = configService.getValue<CustomTitleBarVisibility>(TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY);
		switch (titleBarVisibility) {
			case CustomTitleBarVisibility.NEVER:
				configService.updateValue(TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY, CustomTitleBarVisibility.AUTO);
				break;
			case CustomTitleBarVisibility.WINDOWED: {
				const isFullScreen = IsMainWindowFullscreenContext.evaluate(contextKeyService.getContext(null));
				if (isFullScreen) {
					configService.updateValue(TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY, CustomTitleBarVisibility.AUTO);
				} else {
					configService.updateValue(TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY, CustomTitleBarVisibility.NEVER);
				}
				break;
			}
			case CustomTitleBarVisibility.AUTO:
			default:
				configService.updateValue(TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY, CustomTitleBarVisibility.NEVER);
				break;
		}
	}
}
registerAction2(ToggleCustomTitleBar);

registerAction2(class ShowCustomTitleBar extends Action2 {
	constructor() {
		super({
			id: `showCustomTitleBar`,
			title: localize2('showCustomTitleBar', "Show Custom Title Bar"),
			precondition: TitleBarVisibleContext.negate(),
			f1: true
		});
	}

	run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const configService = accessor.get(IConfigurationService);
		configService.updateValue(TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY, CustomTitleBarVisibility.AUTO);
	}
});

registerAction2(class HideCustomTitleBar extends Action2 {
	constructor() {
		super({
			id: `hideCustomTitleBar`,
			title: localize2('hideCustomTitleBar', "Hide Custom Title Bar"),
			precondition: TitleBarVisibleContext,
			f1: true
		});
	}

	run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const configService = accessor.get(IConfigurationService);
		configService.updateValue(TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY, CustomTitleBarVisibility.NEVER);
	}
});

registerAction2(class HideCustomTitleBar extends Action2 {
	constructor() {
		super({
			id: `hideCustomTitleBarInFullScreen`,
			title: localize2('hideCustomTitleBarInFullScreen', "Hide Custom Title Bar In Full Screen"),
			precondition: ContextKeyExpr.and(TitleBarVisibleContext, IsMainWindowFullscreenContext),
			f1: true
		});
	}

	run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const configService = accessor.get(IConfigurationService);
		configService.updateValue(TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY, CustomTitleBarVisibility.WINDOWED);
	}
});

registerAction2(class ToggleEditorActions extends Action2 {
	static readonly settingsID = `workbench.editor.editorActionsLocation`;
	constructor() {

		const titleBarContextCondition = ContextKeyExpr.and(
			ContextKeyExpr.equals(`config.workbench.editor.showTabs`, 'none').negate(),
			ContextKeyExpr.equals(`config.${ToggleEditorActions.settingsID}`, 'default'),
		)?.negate();

		super({
			id: `toggle.${ToggleEditorActions.settingsID}`,
			title: localize('toggle.editorActions', 'Editor Actions'),
			toggled: ContextKeyExpr.equals(`config.${ToggleEditorActions.settingsID}`, 'hidden').negate(),
			menu: [
				{ id: MenuId.TitleBarContext, order: 3, when: titleBarContextCondition, group: '2_config' },
				{ id: MenuId.TitleBarTitleContext, order: 3, when: titleBarContextCondition, group: '2_config' }
			]
		});
	}

	run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const configService = accessor.get(IConfigurationService);
		const storageService = accessor.get(IStorageService);

		const location = configService.getValue<string>(ToggleEditorActions.settingsID);
		if (location === 'hidden') {
			const showTabs = configService.getValue<string>(LayoutSettings.EDITOR_TABS_MODE);

			// If tabs are visible, then set the editor actions to be in the title bar
			if (showTabs !== 'none') {
				configService.updateValue(ToggleEditorActions.settingsID, 'titleBar');
			}

			// If tabs are not visible, then set the editor actions to the last location the were before being hidden
			else {
				const storedValue = storageService.get(ToggleEditorActions.settingsID, StorageScope.PROFILE);
				configService.updateValue(ToggleEditorActions.settingsID, storedValue ?? 'default');
			}

			storageService.remove(ToggleEditorActions.settingsID, StorageScope.PROFILE);
		}
		// Store the current value (titleBar or default) in the storage service for later to restore
		else {
			configService.updateValue(ToggleEditorActions.settingsID, 'hidden');
			storageService.store(ToggleEditorActions.settingsID, location, StorageScope.PROFILE, StorageTarget.USER);
		}
	}
});

// --- Toolbar actions --- //

export const ACCOUNTS_ACTIVITY_TILE_ACTION: IAction = {
	id: ACCOUNTS_ACTIVITY_ID,
	label: localize('accounts', "Accounts"),
	tooltip: localize('accounts', "Accounts"),
	class: undefined,
	enabled: true,
	run: function (): void { }
};

export const GLOBAL_ACTIVITY_TITLE_ACTION: IAction = {
	id: GLOBAL_ACTIVITY_ID,
	label: localize('manage', "Manage"),
	tooltip: localize('manage', "Manage"),
	class: undefined,
	enabled: true,
	run: function (): void { }
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/titlebar/titlebarPart.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/titlebar/titlebarPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/titlebarpart.css';
import { localize, localize2 } from '../../../../nls.js';
import { MultiWindowParts, Part } from '../../part.js';
import { ITitleService } from '../../../services/title/browser/titleService.js';
import { getWCOTitlebarAreaRect, getZoomFactor, isWCOEnabled } from '../../../../base/browser/browser.js';
import { MenuBarVisibility, getTitleBarStyle, getMenuBarVisibility, hasCustomTitlebar, hasNativeTitlebar, DEFAULT_CUSTOM_TITLEBAR_HEIGHT, getWindowControlsStyle, WindowControlsStyle, TitlebarStyle, MenuSettings, hasNativeMenu } from '../../../../platform/window/common/window.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { StandardMouseEvent } from '../../../../base/browser/mouseEvent.js';
import { IConfigurationService, IConfigurationChangeEvent } from '../../../../platform/configuration/common/configuration.js';
import { DisposableStore, IDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { IBrowserWorkbenchEnvironmentService } from '../../../services/environment/browser/environmentService.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { TITLE_BAR_ACTIVE_BACKGROUND, TITLE_BAR_ACTIVE_FOREGROUND, TITLE_BAR_INACTIVE_FOREGROUND, TITLE_BAR_INACTIVE_BACKGROUND, TITLE_BAR_BORDER, WORKBENCH_BACKGROUND } from '../../../common/theme.js';
import { isMacintosh, isWindows, isLinux, isWeb, isNative, platformLocale } from '../../../../base/common/platform.js';
import { Color } from '../../../../base/common/color.js';
import { EventType, EventHelper, Dimension, append, $, addDisposableListener, prepend, reset, getWindow, getWindowId, isAncestor, getActiveDocument, isHTMLElement } from '../../../../base/browser/dom.js';
import { CustomMenubarControl } from './menubarControl.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IStorageService, StorageScope } from '../../../../platform/storage/common/storage.js';
import { Parts, IWorkbenchLayoutService, ActivityBarPosition, LayoutSettings, EditorActionsLocation, EditorTabsMode } from '../../../services/layout/browser/layoutService.js';
import { createActionViewItem, fillInActionBarActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { Action2, IMenu, IMenuService, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { WindowTitle } from './windowTitle.js';
import { CommandCenterControl } from './commandCenterControl.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { WorkbenchToolBar } from '../../../../platform/actions/browser/toolbar.js';
import { ACCOUNTS_ACTIVITY_ID, GLOBAL_ACTIVITY_ID } from '../../../common/activity.js';
import { AccountsActivityActionViewItem, isAccountsActionVisible, SimpleAccountActivityActionViewItem, SimpleGlobalActivityActionViewItem } from '../globalCompositeBar.js';
import { HoverPosition } from '../../../../base/browser/ui/hover/hoverWidget.js';
import { IEditorGroupsContainer, IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { ActionRunner, IAction } from '../../../../base/common/actions.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ActionsOrientation, IActionViewItem, prepareActions } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { EDITOR_CORE_NAVIGATION_COMMANDS } from '../editor/editorCommands.js';
import { AnchorAlignment } from '../../../../base/browser/ui/contextview/contextview.js';
import { EditorPane } from '../editor/editorPane.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ResolvedKeybinding } from '../../../../base/common/keybindings.js';
import { EditorCommandsContextActionRunner } from '../editor/editorTabsControl.js';
import { IEditorCommandsContext, IEditorPartOptionsChangeEvent, IToolbarActions } from '../../../common/editor.js';
import { CodeWindow, mainWindow } from '../../../../base/browser/window.js';
import { ACCOUNTS_ACTIVITY_TILE_ACTION, GLOBAL_ACTIVITY_TITLE_ACTION } from './titlebarActions.js';
import { IView } from '../../../../base/browser/ui/grid/grid.js';
import { createInstantHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { IBaseActionViewItemOptions } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { IHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegate.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { safeIntl } from '../../../../base/common/date.js';
import { IsCompactTitleBarContext, TitleBarVisibleContext } from '../../../common/contextkeys.js';

export interface ITitleVariable {
	readonly name: string;
	readonly contextKey: string;
}

export interface ITitleProperties {
	isPure?: boolean;
	isAdmin?: boolean;
	prefix?: string;
}

export interface ITitlebarPart extends IDisposable {

	/**
	 * An event when the menubar visibility changes.
	 */
	readonly onMenubarVisibilityChange: Event<boolean>;

	/**
	 * Update some environmental title properties.
	 */
	updateProperties(properties: ITitleProperties): void;

	/**
	 * Adds variables to be supported in the window title.
	 */
	registerVariables(variables: ITitleVariable[]): void;
}

export class BrowserTitleService extends MultiWindowParts<BrowserTitlebarPart> implements ITitleService {

	declare _serviceBrand: undefined;

	readonly mainPart: BrowserTitlebarPart;

	constructor(
		@IInstantiationService protected readonly instantiationService: IInstantiationService,
		@IStorageService storageService: IStorageService,
		@IThemeService themeService: IThemeService
	) {
		super('workbench.titleService', themeService, storageService);

		this.mainPart = this._register(this.createMainTitlebarPart());
		this.onMenubarVisibilityChange = this.mainPart.onMenubarVisibilityChange;
		this._register(this.registerPart(this.mainPart));

		this.registerActions();
		this.registerAPICommands();
	}

	protected createMainTitlebarPart(): BrowserTitlebarPart {
		return this.instantiationService.createInstance(MainBrowserTitlebarPart);
	}

	private registerActions(): void {

		// Focus action
		const that = this;
		this._register(registerAction2(class FocusTitleBar extends Action2 {

			constructor() {
				super({
					id: `workbench.action.focusTitleBar`,
					title: localize2('focusTitleBar', 'Focus Title Bar'),
					category: Categories.View,
					f1: true,
					precondition: TitleBarVisibleContext
				});
			}

			run(): void {
				that.getPartByDocument(getActiveDocument())?.focus();
			}
		}));
	}

	private registerAPICommands(): void {
		this._register(CommandsRegistry.registerCommand({
			id: 'registerWindowTitleVariable',
			handler: (accessor: ServicesAccessor, name: string, contextKey: string) => {
				this.registerVariables([{ name, contextKey }]);
			},
			metadata: {
				description: 'Registers a new title variable',
				args: [
					{ name: 'name', schema: { type: 'string' }, description: 'The name of the variable to register' },
					{ name: 'contextKey', schema: { type: 'string' }, description: 'The context key to use for the value of the variable' }
				]
			}
		}));
	}

	//#region Auxiliary Titlebar Parts

	createAuxiliaryTitlebarPart(container: HTMLElement, editorGroupsContainer: IEditorGroupsContainer, instantiationService: IInstantiationService): IAuxiliaryTitlebarPart {
		const titlebarPartContainer = $('.part.titlebar', { role: 'none' });
		titlebarPartContainer.style.position = 'relative';
		container.insertBefore(titlebarPartContainer, container.firstChild); // ensure we are first element

		const disposables = new DisposableStore();

		const titlebarPart = this.doCreateAuxiliaryTitlebarPart(titlebarPartContainer, editorGroupsContainer, instantiationService);
		disposables.add(this.registerPart(titlebarPart));

		disposables.add(Event.runAndSubscribe(titlebarPart.onDidChange, () => titlebarPartContainer.style.height = `${titlebarPart.height}px`));
		titlebarPart.create(titlebarPartContainer);

		if (this.properties) {
			titlebarPart.updateProperties(this.properties);
		}

		if (this.variables.size) {
			titlebarPart.registerVariables(Array.from(this.variables.values()));
		}

		Event.once(titlebarPart.onWillDispose)(() => disposables.dispose());

		return titlebarPart;
	}

	protected doCreateAuxiliaryTitlebarPart(container: HTMLElement, editorGroupsContainer: IEditorGroupsContainer, instantiationService: IInstantiationService): BrowserTitlebarPart & IAuxiliaryTitlebarPart {
		return instantiationService.createInstance(AuxiliaryBrowserTitlebarPart, container, editorGroupsContainer, this.mainPart);
	}

	//#endregion


	//#region Service Implementation

	readonly onMenubarVisibilityChange: Event<boolean>;

	private properties: ITitleProperties | undefined = undefined;

	updateProperties(properties: ITitleProperties): void {
		this.properties = properties;

		for (const part of this.parts) {
			part.updateProperties(properties);
		}
	}

	private readonly variables = new Map<string, ITitleVariable>();

	registerVariables(variables: ITitleVariable[]): void {
		const newVariables: ITitleVariable[] = [];

		for (const variable of variables) {
			if (!this.variables.has(variable.name)) {
				this.variables.set(variable.name, variable);
				newVariables.push(variable);
			}
		}

		for (const part of this.parts) {
			part.registerVariables(newVariables);
		}
	}

	//#endregion
}

export class BrowserTitlebarPart extends Part implements ITitlebarPart {

	//#region IView

	readonly minimumWidth: number = 0;
	readonly maximumWidth: number = Number.POSITIVE_INFINITY;

	get minimumHeight(): number {
		const wcoEnabled = isWeb && isWCOEnabled();
		let value = this.isCommandCenterVisible || wcoEnabled ? DEFAULT_CUSTOM_TITLEBAR_HEIGHT : 30;
		if (wcoEnabled) {
			value = Math.max(value, getWCOTitlebarAreaRect(getWindow(this.element))?.height ?? 0);
		}

		return value / (this.preventZoom ? getZoomFactor(getWindow(this.element)) : 1);
	}

	get maximumHeight(): number { return this.minimumHeight; }

	//#endregion

	//#region Events

	private _onMenubarVisibilityChange = this._register(new Emitter<boolean>());
	readonly onMenubarVisibilityChange = this._onMenubarVisibilityChange.event;

	private readonly _onWillDispose = this._register(new Emitter<void>());
	readonly onWillDispose = this._onWillDispose.event;

	//#endregion

	protected rootContainer!: HTMLElement;
	protected windowControlsContainer: HTMLElement | undefined;

	protected dragRegion: HTMLElement | undefined;
	private title!: HTMLElement;

	private leftContent!: HTMLElement;
	private centerContent!: HTMLElement;
	private rightContent!: HTMLElement;

	protected readonly customMenubar = this._register(new MutableDisposable<CustomMenubarControl>());
	protected appIcon: HTMLElement | undefined;
	private appIconBadge: HTMLElement | undefined;
	protected menubar?: HTMLElement;
	private lastLayoutDimensions: Dimension | undefined;

	private actionToolBar!: WorkbenchToolBar;
	private readonly actionToolBarDisposable = this._register(new DisposableStore());
	private readonly editorActionsChangeDisposable = this._register(new DisposableStore());
	private actionToolBarElement!: HTMLElement;

	private globalToolbarMenu: IMenu | undefined;
	private layoutToolbarMenu: IMenu | undefined;

	private readonly globalToolbarMenuDisposables = this._register(new DisposableStore());
	private readonly editorToolbarMenuDisposables = this._register(new DisposableStore());
	private readonly layoutToolbarMenuDisposables = this._register(new DisposableStore());
	private readonly activityToolbarDisposables = this._register(new DisposableStore());

	private readonly hoverDelegate: IHoverDelegate;

	private readonly titleDisposables = this._register(new DisposableStore());
	private titleBarStyle: TitlebarStyle;

	private isInactive: boolean = false;

	private readonly isAuxiliary: boolean;
	private isCompact = false;

	private readonly isCompactContextKey: IContextKey<boolean>;

	private readonly windowTitle: WindowTitle;

	constructor(
		id: string,
		targetWindow: CodeWindow,
		private readonly editorGroupsContainer: IEditorGroupsContainer,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IConfigurationService protected readonly configurationService: IConfigurationService,
		@IBrowserWorkbenchEnvironmentService protected readonly environmentService: IBrowserWorkbenchEnvironmentService,
		@IInstantiationService protected readonly instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IStorageService private readonly storageService: IStorageService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@IContextKeyService protected readonly contextKeyService: IContextKeyService,
		@IHostService private readonly hostService: IHostService,
		@IEditorService private readonly editorService: IEditorService,
		@IMenuService private readonly menuService: IMenuService,
		@IKeybindingService private readonly keybindingService: IKeybindingService
	) {
		super(id, { hasTitle: false }, themeService, storageService, layoutService);

		this.isAuxiliary = targetWindow.vscodeWindowId !== mainWindow.vscodeWindowId;

		this.isCompactContextKey = IsCompactTitleBarContext.bindTo(this.contextKeyService);

		this.titleBarStyle = getTitleBarStyle(this.configurationService);

		this.windowTitle = this._register(instantiationService.createInstance(WindowTitle, targetWindow));

		this.hoverDelegate = this._register(createInstantHoverDelegate());

		this.registerListeners(getWindowId(targetWindow));
	}

	private registerListeners(targetWindowId: number): void {
		this._register(this.hostService.onDidChangeFocus(focused => focused ? this.onFocus() : this.onBlur()));
		this._register(this.hostService.onDidChangeActiveWindow(windowId => windowId === targetWindowId ? this.onFocus() : this.onBlur()));
		this._register(this.configurationService.onDidChangeConfiguration(e => this.onConfigurationChanged(e)));
		this._register(this.editorGroupsContainer.onDidChangeEditorPartOptions(e => this.onEditorPartConfigurationChange(e)));
	}

	private onBlur(): void {
		this.isInactive = true;

		this.updateStyles();
	}

	private onFocus(): void {
		this.isInactive = false;

		this.updateStyles();
	}

	private onEditorPartConfigurationChange({ oldPartOptions, newPartOptions }: IEditorPartOptionsChangeEvent): void {
		if (
			oldPartOptions.editorActionsLocation !== newPartOptions.editorActionsLocation ||
			oldPartOptions.showTabs !== newPartOptions.showTabs
		) {
			if (hasCustomTitlebar(this.configurationService, this.titleBarStyle) && this.actionToolBar) {
				this.createActionToolBar();
				this.createActionToolBarMenus({ editorActions: true });
				this._onDidChange.fire(undefined);
			}
		}
	}

	protected onConfigurationChanged(event: IConfigurationChangeEvent): void {

		// Custom menu bar (disabled if auxiliary)
		if (!this.isAuxiliary && !hasNativeMenu(this.configurationService, this.titleBarStyle) && (!isMacintosh || isWeb)) {
			if (event.affectsConfiguration(MenuSettings.MenuBarVisibility)) {
				if (this.currentMenubarVisibility === 'compact') {
					this.uninstallMenubar();
				} else {
					this.installMenubar();
				}
			}
		}

		// Actions
		if (hasCustomTitlebar(this.configurationService, this.titleBarStyle) && this.actionToolBar) {
			const affectsLayoutControl = event.affectsConfiguration(LayoutSettings.LAYOUT_ACTIONS);
			const affectsActivityControl = event.affectsConfiguration(LayoutSettings.ACTIVITY_BAR_LOCATION);

			if (affectsLayoutControl || affectsActivityControl) {
				this.createActionToolBarMenus({ layoutActions: affectsLayoutControl, activityActions: affectsActivityControl });

				this._onDidChange.fire(undefined);
			}
		}

		// Command Center
		if (event.affectsConfiguration(LayoutSettings.COMMAND_CENTER)) {
			this.recreateTitle();
		}
	}

	private recreateTitle(): void {
		this.createTitle();

		this._onDidChange.fire(undefined);
	}

	updateOptions(options: { compact: boolean }): void {
		const oldIsCompact = this.isCompact;
		this.isCompact = options.compact;

		this.isCompactContextKey.set(this.isCompact);

		if (oldIsCompact !== this.isCompact) {
			this.recreateTitle();
			this.createActionToolBarMenus(true);
		}
	}

	protected installMenubar(): void {
		if (this.menubar) {
			return; // If the menubar is already installed, skip
		}

		this.customMenubar.value = this.instantiationService.createInstance(CustomMenubarControl);

		this.menubar = append(this.leftContent, $('div.menubar'));
		this.menubar.setAttribute('role', 'menubar');

		this._register(this.customMenubar.value.onVisibilityChange(e => this.onMenubarVisibilityChanged(e)));

		this.customMenubar.value.create(this.menubar);
	}

	private uninstallMenubar(): void {
		this.customMenubar.value = undefined;

		this.menubar?.remove();
		this.menubar = undefined;

		this.onMenubarVisibilityChanged(false);
	}

	protected onMenubarVisibilityChanged(visible: boolean): void {
		if (isWeb || isWindows || isLinux) {
			if (this.lastLayoutDimensions) {
				this.layout(this.lastLayoutDimensions.width, this.lastLayoutDimensions.height);
			}

			this._onMenubarVisibilityChange.fire(visible);
		}
	}

	updateProperties(properties: ITitleProperties): void {
		this.windowTitle.updateProperties(properties);
	}

	registerVariables(variables: ITitleVariable[]): void {
		this.windowTitle.registerVariables(variables);
	}

	protected override createContentArea(parent: HTMLElement): HTMLElement {
		this.element = parent;
		this.rootContainer = append(parent, $('.titlebar-container'));

		this.leftContent = append(this.rootContainer, $('.titlebar-left'));
		this.centerContent = append(this.rootContainer, $('.titlebar-center'));
		this.rightContent = append(this.rootContainer, $('.titlebar-right'));

		// App Icon (Windows, Linux)
		if ((isWindows || isLinux) && !hasNativeTitlebar(this.configurationService, this.titleBarStyle)) {
			this.appIcon = prepend(this.leftContent, $('a.window-appicon'));
		}

		// Draggable region that we can manipulate for #52522
		this.dragRegion = prepend(this.rootContainer, $('div.titlebar-drag-region'));

		// Menubar: install a custom menu bar depending on configuration
		if (
			!this.isAuxiliary &&
			!hasNativeMenu(this.configurationService, this.titleBarStyle) &&
			(!isMacintosh || isWeb) &&
			this.currentMenubarVisibility !== 'compact'
		) {
			this.installMenubar();
		}

		// Title
		this.title = append(this.centerContent, $('div.window-title'));
		this.createTitle();

		// Create Toolbar Actions
		if (hasCustomTitlebar(this.configurationService, this.titleBarStyle)) {
			this.actionToolBarElement = append(this.rightContent, $('div.action-toolbar-container'));
			this.createActionToolBar();
			this.createActionToolBarMenus();
		}

		// Window Controls Container
		if (!hasNativeTitlebar(this.configurationService, this.titleBarStyle)) {
			let primaryWindowControlsLocation = isMacintosh ? 'left' : 'right';
			if (isMacintosh && isNative) {

				// Check if the locale is RTL, macOS will move traffic lights in RTL locales
				// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/textInfo

				const localeInfo = safeIntl.Locale(platformLocale).value;
				const textInfo = (localeInfo as { textInfo?: unknown }).textInfo;
				if (textInfo && typeof textInfo === 'object' && 'direction' in textInfo && textInfo.direction === 'rtl') {
					primaryWindowControlsLocation = 'right';
				}
			}

			if (isMacintosh && isNative && primaryWindowControlsLocation === 'left') {
				// macOS native: controls are on the left and the container is not needed to make room
				// for something, except for web where a custom menu being supported). not putting the
				// container helps with allowing to move the window when clicking very close to the
				// window control buttons.
			} else if (getWindowControlsStyle(this.configurationService) === WindowControlsStyle.HIDDEN) {
				// Linux/Windows: controls are explicitly disabled
			} else {
				this.windowControlsContainer = append(primaryWindowControlsLocation === 'left' ? this.leftContent : this.rightContent, $('div.window-controls-container'));
				if (isWeb) {
					// Web: its possible to have control overlays on both sides, for example on macOS
					// with window controls on the left and PWA controls on the right.
					append(primaryWindowControlsLocation === 'left' ? this.rightContent : this.leftContent, $('div.window-controls-container'));
				}

				if (isWCOEnabled()) {
					this.windowControlsContainer.classList.add('wco-enabled');
				}
			}
		}

		// Context menu over title bar: depending on the OS and the location of the click this will either be
		// the overall context menu for the entire title bar or a specific title context menu.
		// Windows / Linux: we only support the overall context menu on the title bar
		// macOS: we support both the overall context menu and the title context menu.
		//        in addition, we allow Cmd+click to bring up the title context menu.
		{
			this._register(addDisposableListener(this.rootContainer, EventType.CONTEXT_MENU, e => {
				EventHelper.stop(e);

				let targetMenu: MenuId;
				if (isMacintosh && isHTMLElement(e.target) && isAncestor(e.target, this.title)) {
					targetMenu = MenuId.TitleBarTitleContext;
				} else {
					targetMenu = MenuId.TitleBarContext;
				}

				this.onContextMenu(e, targetMenu);
			}));

			if (isMacintosh) {
				this._register(addDisposableListener(this.title, EventType.MOUSE_DOWN, e => {
					if (e.metaKey) {
						EventHelper.stop(e, true /* stop bubbling to prevent command center from opening */);

						this.onContextMenu(e, MenuId.TitleBarTitleContext);
					}
				}, true /* capture phase to prevent command center from opening */));
			}
		}

		this.updateStyles();

		return this.element;
	}

	private createTitle(): void {
		this.titleDisposables.clear();

		const isShowingTitleInNativeTitlebar = hasNativeTitlebar(this.configurationService, this.titleBarStyle);

		// Text Title
		if (!this.isCommandCenterVisible) {
			if (!isShowingTitleInNativeTitlebar) {
				this.title.textContent = this.windowTitle.value;
				this.titleDisposables.add(this.windowTitle.onDidChange(() => {
					this.title.textContent = this.windowTitle.value;
					if (this.lastLayoutDimensions) {
						this.updateLayout(this.lastLayoutDimensions); // layout menubar and other renderings in the titlebar
					}
				}));
			} else {
				reset(this.title);
			}
		}

		// Menu Title
		else {
			const commandCenter = this.instantiationService.createInstance(CommandCenterControl, this.windowTitle, this.hoverDelegate);
			reset(this.title, commandCenter.element);
			this.titleDisposables.add(commandCenter);
		}
	}

	private actionViewItemProvider(action: IAction, options: IBaseActionViewItemOptions): IActionViewItem | undefined {

		// --- Activity Actions
		if (!this.isAuxiliary) {
			if (action.id === GLOBAL_ACTIVITY_ID) {
				return this.instantiationService.createInstance(SimpleGlobalActivityActionViewItem, { position: () => HoverPosition.BELOW }, options);
			}
			if (action.id === ACCOUNTS_ACTIVITY_ID) {
				return this.instantiationService.createInstance(SimpleAccountActivityActionViewItem, { position: () => HoverPosition.BELOW }, options);
			}
		}

		// --- Editor Actions
		const activeEditorPane = this.editorGroupsContainer.activeGroup?.activeEditorPane;
		if (activeEditorPane && activeEditorPane instanceof EditorPane) {
			const result = activeEditorPane.getActionViewItem(action, options);

			if (result) {
				return result;
			}
		}

		// Check extensions
		return createActionViewItem(this.instantiationService, action, { ...options, menuAsChild: false });
	}

	private getKeybinding(action: IAction): ResolvedKeybinding | undefined {
		const editorPaneAwareContextKeyService = this.editorGroupsContainer.activeGroup?.activeEditorPane?.scopedContextKeyService ?? this.contextKeyService;

		return this.keybindingService.lookupKeybinding(action.id, editorPaneAwareContextKeyService);
	}

	private createActionToolBar(): void {

		// Creates the action tool bar. Depends on the configuration of the title bar menus
		// Requires to be recreated whenever editor actions enablement changes

		this.actionToolBarDisposable.clear();

		this.actionToolBar = this.actionToolBarDisposable.add(this.instantiationService.createInstance(WorkbenchToolBar, this.actionToolBarElement, {
			contextMenu: MenuId.TitleBarContext,
			orientation: ActionsOrientation.HORIZONTAL,
			ariaLabel: localize('ariaLabelTitleActions', "Title actions"),
			getKeyBinding: action => this.getKeybinding(action),
			overflowBehavior: { maxItems: 9, exempted: [ACCOUNTS_ACTIVITY_ID, GLOBAL_ACTIVITY_ID, ...EDITOR_CORE_NAVIGATION_COMMANDS] },
			anchorAlignmentProvider: () => AnchorAlignment.RIGHT,
			telemetrySource: 'titlePart',
			highlightToggledItems: this.editorActionsEnabled || this.isAuxiliary, // Only show toggled state for editor actions or auxiliary title bars
			actionViewItemProvider: (action, options) => this.actionViewItemProvider(action, options),
			hoverDelegate: this.hoverDelegate
		}));

		if (this.editorActionsEnabled) {
			this.actionToolBarDisposable.add(this.editorGroupsContainer.onDidChangeActiveGroup(() => this.createActionToolBarMenus({ editorActions: true })));
		}
	}

	private createActionToolBarMenus(update: true | { editorActions?: boolean; layoutActions?: boolean; globalActions?: boolean; activityActions?: boolean } = true): void {
		if (update === true) {
			update = { editorActions: true, layoutActions: true, globalActions: true, activityActions: true };
		}

		const updateToolBarActions = () => {
			const actions: IToolbarActions = { primary: [], secondary: [] };

			// --- Editor Actions
			if (this.editorActionsEnabled) {
				this.editorActionsChangeDisposable.clear();

				const activeGroup = this.editorGroupsContainer.activeGroup;
				if (activeGroup) {
					const editorActions = activeGroup.createEditorActions(this.editorActionsChangeDisposable, this.isAuxiliary && this.isCompact ? MenuId.CompactWindowEditorTitle : MenuId.EditorTitle);

					actions.primary.push(...editorActions.actions.primary);
					actions.secondary.push(...editorActions.actions.secondary);

					this.editorActionsChangeDisposable.add(editorActions.onDidChange(() => updateToolBarActions()));
				}
			}

			// --- Global Actions
			if (this.globalToolbarMenu) {
				fillInActionBarActions(
					this.globalToolbarMenu.getActions(),
					actions
				);
			}

			// --- Layout Actions
			if (this.layoutToolbarMenu) {
				fillInActionBarActions(
					this.layoutToolbarMenu.getActions(),
					actions,
					() => !this.editorActionsEnabled || this.isCompact // layout actions move to "..." if editor actions are enabled unless compact
				);
			}

			// --- Activity Actions (always at the end)
			if (this.activityActionsEnabled) {
				if (isAccountsActionVisible(this.storageService)) {
					actions.primary.push(ACCOUNTS_ACTIVITY_TILE_ACTION);
				}

				actions.primary.push(GLOBAL_ACTIVITY_TITLE_ACTION);
			}

			this.actionToolBar.setActions(prepareActions(actions.primary), prepareActions(actions.secondary));
		};

		// Create/Update the menus which should be in the title tool bar

		if (update.editorActions) {
			this.editorToolbarMenuDisposables.clear();

			// The editor toolbar menu is handled by the editor group so we do not need to manage it here.
			// However, depending on the active editor, we need to update the context and action runner of the toolbar menu.
			if (this.editorActionsEnabled && this.editorService.activeEditor !== undefined) {
				const context: IEditorCommandsContext = { groupId: this.editorGroupsContainer.activeGroup.id };

				this.actionToolBar.actionRunner = this.editorToolbarMenuDisposables.add(new EditorCommandsContextActionRunner(context));
				this.actionToolBar.context = context;
			} else {
				this.actionToolBar.actionRunner = this.editorToolbarMenuDisposables.add(new ActionRunner());
				this.actionToolBar.context = undefined;
			}
		}

		if (update.layoutActions) {
			this.layoutToolbarMenuDisposables.clear();

			if (this.layoutControlEnabled) {
				this.layoutToolbarMenu = this.menuService.createMenu(MenuId.LayoutControlMenu, this.contextKeyService);

				this.layoutToolbarMenuDisposables.add(this.layoutToolbarMenu);
				this.layoutToolbarMenuDisposables.add(this.layoutToolbarMenu.onDidChange(() => updateToolBarActions()));
			} else {
				this.layoutToolbarMenu = undefined;
			}
		}

		if (update.globalActions) {
			this.globalToolbarMenuDisposables.clear();

			if (this.globalActionsEnabled) {
				this.globalToolbarMenu = this.menuService.createMenu(MenuId.TitleBar, this.contextKeyService);

				this.globalToolbarMenuDisposables.add(this.globalToolbarMenu);
				this.globalToolbarMenuDisposables.add(this.globalToolbarMenu.onDidChange(() => updateToolBarActions()));
			} else {
				this.globalToolbarMenu = undefined;
			}
		}

		if (update.activityActions) {
			this.activityToolbarDisposables.clear();
			if (this.activityActionsEnabled) {
				this.activityToolbarDisposables.add(this.storageService.onDidChangeValue(StorageScope.PROFILE, AccountsActivityActionViewItem.ACCOUNTS_VISIBILITY_PREFERENCE_KEY, this._store)(() => updateToolBarActions()));
			}
		}

		updateToolBarActions();
	}

	override updateStyles(): void {
		super.updateStyles();

		// Part container
		if (this.element) {
			if (this.isInactive) {
				this.element.classList.add('inactive');
			} else {
				this.element.classList.remove('inactive');
			}

			const titleBackground = this.getColor(this.isInactive ? TITLE_BAR_INACTIVE_BACKGROUND : TITLE_BAR_ACTIVE_BACKGROUND, (color, theme) => {
				// LCD Rendering Support: the title bar part is a defining its own GPU layer.
				// To benefit from LCD font rendering, we must ensure that we always set an
				// opaque background color. As such, we compute an opaque color given we know
				// the background color is the workbench background.
				return color.isOpaque() ? color : color.makeOpaque(WORKBENCH_BACKGROUND(theme));
			}) || '';
			this.element.style.backgroundColor = titleBackground;

			if (this.appIconBadge) {
				this.appIconBadge.style.backgroundColor = titleBackground;
			}

			if (titleBackground && Color.fromHex(titleBackground).isLighter()) {
				this.element.classList.add('light');
			} else {
				this.element.classList.remove('light');
			}

			const titleForeground = this.getColor(this.isInactive ? TITLE_BAR_INACTIVE_FOREGROUND : TITLE_BAR_ACTIVE_FOREGROUND);
			this.element.style.color = titleForeground || '';

			const titleBorder = this.getColor(TITLE_BAR_BORDER);
			this.element.style.borderBottom = titleBorder ? `1px solid ${titleBorder}` : '';
		}
	}

	protected onContextMenu(e: MouseEvent, menuId: MenuId): void {
		const event = new StandardMouseEvent(getWindow(this.element), e);

		// Show it
		this.contextMenuService.showContextMenu({
			getAnchor: () => event,
			menuId,
			contextKeyService: this.contextKeyService,
			domForShadowRoot: isMacintosh && isNative ? event.target : undefined
		});
	}

	protected get currentMenubarVisibility(): MenuBarVisibility {
		if (this.isAuxiliary) {
			return 'hidden';
		}

		return getMenuBarVisibility(this.configurationService);
	}

	private get layoutControlEnabled(): boolean {
		return this.configurationService.getValue<boolean>(LayoutSettings.LAYOUT_ACTIONS) !== false;
	}

	protected get isCommandCenterVisible() {
		return !this.isCompact && this.configurationService.getValue<boolean>(LayoutSettings.COMMAND_CENTER) !== false;
	}

	private get editorActionsEnabled(): boolean {
		return (this.editorGroupsContainer.partOptions.editorActionsLocation === EditorActionsLocation.TITLEBAR ||
			(
				this.editorGroupsContainer.partOptions.editorActionsLocation === EditorActionsLocation.DEFAULT &&
				this.editorGroupsContainer.partOptions.showTabs === EditorTabsMode.NONE
			));
	}

	private get activityActionsEnabled(): boolean {
		const activityBarPosition = this.configurationService.getValue<ActivityBarPosition>(LayoutSettings.ACTIVITY_BAR_LOCATION);
		return !this.isCompact && !this.isAuxiliary && (activityBarPosition === ActivityBarPosition.TOP || activityBarPosition === ActivityBarPosition.BOTTOM);
	}

	private get globalActionsEnabled(): boolean {
		return !this.isCompact;
	}

	get hasZoomableElements(): boolean {
		const hasMenubar = !(this.currentMenubarVisibility === 'hidden' || this.currentMenubarVisibility === 'compact' || (!isWeb && isMacintosh));
		const hasCommandCenter = this.isCommandCenterVisible;
		const hasToolBarActions = this.globalActionsEnabled || this.layoutControlEnabled || this.editorActionsEnabled || this.activityActionsEnabled;
		return hasMenubar || hasCommandCenter || hasToolBarActions;
	}

	get preventZoom(): boolean {
		// Prevent zooming behavior if any of the following conditions are met:
		// 1. Shrinking below the window control size (zoom < 1)
		// 2. No custom items are present in the title bar

		return getZoomFactor(getWindow(this.element)) < 1 || !this.hasZoomableElements;
	}

	override layout(width: number, height: number): void {
		this.updateLayout(new Dimension(width, height));

		super.layoutContents(width, height);
	}

	private updateLayout(dimension: Dimension): void {
		this.lastLayoutDimensions = dimension;

		if (!hasCustomTitlebar(this.configurationService, this.titleBarStyle)) {
			return;
		}

		const zoomFactor = getZoomFactor(getWindow(this.element));

		this.element.style.setProperty('--zoom-factor', zoomFactor.toString());
		this.rootContainer.classList.toggle('counter-zoom', this.preventZoom);

		if (this.customMenubar.value) {
			const menubarDimension = new Dimension(0, dimension.height);
			this.customMenubar.value.layout(menubarDimension);
		}

		const hasCenter = this.isCommandCenterVisible || this.title.textContent !== '';
		this.rootContainer.classList.toggle('has-center', hasCenter);
	}

	focus(): void {
		if (this.customMenubar.value) {
			this.customMenubar.value.toggleFocus();
		} else {
			// eslint-disable-next-line no-restricted-syntax
			(this.element.querySelector('[tabindex]:not([tabindex="-1"])') as HTMLElement | null)?.focus();
		}
	}

	toJSON(): object {
		return {
			type: Parts.TITLEBAR_PART
		};
	}

	override dispose(): void {
		this._onWillDispose.fire();

		super.dispose();
	}
}

export class MainBrowserTitlebarPart extends BrowserTitlebarPart {

	constructor(
		@IContextMenuService contextMenuService: IContextMenuService,
		@IConfigurationService configurationService: IConfigurationService,
		@IBrowserWorkbenchEnvironmentService environmentService: IBrowserWorkbenchEnvironmentService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IHostService hostService: IHostService,
		@IEditorGroupsService editorGroupService: IEditorGroupsService,
		@IEditorService editorService: IEditorService,
		@IMenuService menuService: IMenuService,
		@IKeybindingService keybindingService: IKeybindingService,
	) {
		super(Parts.TITLEBAR_PART, mainWindow, editorGroupService.mainPart, contextMenuService, configurationService, environmentService, instantiationService, themeService, storageService, layoutService, contextKeyService, hostService, editorService, menuService, keybindingService);
	}
}

export interface IAuxiliaryTitlebarPart extends ITitlebarPart, IView {
	readonly container: HTMLElement;
	readonly height: number;

	updateOptions(options: { compact: boolean }): void;
}

export class AuxiliaryBrowserTitlebarPart extends BrowserTitlebarPart implements IAuxiliaryTitlebarPart {

	private static COUNTER = 1;

	get height() { return this.minimumHeight; }

	constructor(
		readonly container: HTMLElement,
		editorGroupsContainer: IEditorGroupsContainer,
		private readonly mainTitlebar: BrowserTitlebarPart,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IConfigurationService configurationService: IConfigurationService,
		@IBrowserWorkbenchEnvironmentService environmentService: IBrowserWorkbenchEnvironmentService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IHostService hostService: IHostService,
		@IEditorGroupsService editorGroupService: IEditorGroupsService,
		@IEditorService editorService: IEditorService,
		@IMenuService menuService: IMenuService,
		@IKeybindingService keybindingService: IKeybindingService,
	) {
		const id = AuxiliaryBrowserTitlebarPart.COUNTER++;
		super(`workbench.parts.auxiliaryTitle.${id}`, getWindow(container), editorGroupsContainer, contextMenuService, configurationService, environmentService, instantiationService, themeService, storageService, layoutService, contextKeyService, hostService, editorService, menuService, keybindingService);
	}

	override get preventZoom(): boolean {

		// Prevent zooming behavior if any of the following conditions are met:
		// 1. Shrinking below the window control size (zoom < 1)
		// 2. No custom items are present in the main title bar
		// The auxiliary title bar never contains any zoomable items itself,
		// but we want to match the behavior of the main title bar.

		return getZoomFactor(getWindow(this.element)) < 1 || !this.mainTitlebar.hasZoomableElements;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/titlebar/windowTitle.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/titlebar/windowTitle.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { dirname, basename } from '../../../../base/common/resources.js';
import { ITitleProperties, ITitleVariable } from './titlebarPart.js';
import { IConfigurationService, IConfigurationChangeEvent } from '../../../../platform/configuration/common/configuration.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { EditorResourceAccessor, Verbosity, SideBySideEditor } from '../../../common/editor.js';
import { IBrowserWorkbenchEnvironmentService } from '../../../services/environment/browser/environmentService.js';
import { IWorkspaceContextService, WorkbenchState, IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { isWindows, isWeb, isMacintosh, isNative } from '../../../../base/common/platform.js';
import { URI } from '../../../../base/common/uri.js';
import { trim } from '../../../../base/common/strings.js';
import { template } from '../../../../base/common/labels.js';
import { ILabelService, Verbosity as LabelVerbosity } from '../../../../platform/label/common/label.js';
import { Emitter } from '../../../../base/common/event.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { Schemas } from '../../../../base/common/network.js';
import { getVirtualWorkspaceLocation } from '../../../../platform/workspace/common/virtualWorkspace.js';
import { IUserDataProfileService } from '../../../services/userDataProfile/common/userDataProfile.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { ICodeEditor, isCodeEditor, isDiffEditor } from '../../../../editor/browser/editorBrowser.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { getWindowById } from '../../../../base/browser/dom.js';
import { CodeWindow } from '../../../../base/browser/window.js';
import { IDecorationsService } from '../../../services/decorations/common/decorations.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';

const enum WindowSettingNames {
	titleSeparator = 'window.titleSeparator',
	title = 'window.title',
}

export const defaultWindowTitle = (() => {
	if (isMacintosh && isNative) {
		return '${activeEditorShort}${separator}${rootName}${separator}${profileName}'; // macOS has native dirty indicator
	}

	const base = '${dirty}${activeEditorShort}${separator}${rootName}${separator}${profileName}${separator}${appName}';
	if (isWeb) {
		return base + '${separator}${remoteName}'; // Web: always show remote name
	}

	return base;
})();
export const defaultWindowTitleSeparator = isMacintosh ? ' \u2014 ' : ' - ';

export class WindowTitle extends Disposable {

	private static readonly NLS_USER_IS_ADMIN = isWindows ? localize('userIsAdmin', "[Administrator]") : localize('userIsSudo', "[Superuser]");
	private static readonly NLS_EXTENSION_HOST = localize('devExtensionWindowTitlePrefix', "[Extension Development Host]");
	private static readonly TITLE_DIRTY = '\u25cf ';

	private readonly properties: ITitleProperties = { isPure: true, isAdmin: false, prefix: undefined };
	private readonly variables = new Map<string /* context key */, string /* name */>();

	private readonly activeEditorListeners = this._register(new DisposableStore());
	private readonly titleUpdater = this._register(new RunOnceScheduler(() => this.doUpdateTitle(), 0));

	private readonly onDidChangeEmitter = new Emitter<void>();
	readonly onDidChange = this.onDidChangeEmitter.event;

	get value() { return this.title ?? ''; }
	get workspaceName() { return this.labelService.getWorkspaceLabel(this.contextService.getWorkspace()); }
	get fileName() {
		const activeEditor = this.editorService.activeEditor;
		if (!activeEditor) {
			return undefined;
		}
		const fileName = activeEditor.getTitle(Verbosity.SHORT);
		const dirty = activeEditor?.isDirty() && !activeEditor.isSaving() ? WindowTitle.TITLE_DIRTY : '';
		return `${dirty}${fileName}`;
	}

	private title: string | undefined;

	private titleIncludesFocusedView: boolean = false;
	private titleIncludesEditorState: boolean = false;

	private readonly windowId: number;

	constructor(
		targetWindow: CodeWindow,
		@IConfigurationService protected readonly configurationService: IConfigurationService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IEditorService private readonly editorService: IEditorService,
		@IBrowserWorkbenchEnvironmentService protected readonly environmentService: IBrowserWorkbenchEnvironmentService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@ILabelService private readonly labelService: ILabelService,
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IProductService private readonly productService: IProductService,
		@IViewsService private readonly viewsService: IViewsService,
		@IDecorationsService private readonly decorationsService: IDecorationsService,
		@IAccessibilityService private readonly accessibilityService: IAccessibilityService
	) {
		super();

		this.windowId = targetWindow.vscodeWindowId;

		this.checkTitleVariables();

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.configurationService.onDidChangeConfiguration(e => this.onConfigurationChanged(e)));
		this._register(this.editorService.onDidActiveEditorChange(() => this.onActiveEditorChange()));
		this._register(this.contextService.onDidChangeWorkspaceFolders(() => this.titleUpdater.schedule()));
		this._register(this.contextService.onDidChangeWorkbenchState(() => this.titleUpdater.schedule()));
		this._register(this.contextService.onDidChangeWorkspaceName(() => this.titleUpdater.schedule()));
		this._register(this.labelService.onDidChangeFormatters(() => this.titleUpdater.schedule()));
		this._register(this.userDataProfileService.onDidChangeCurrentProfile(() => this.titleUpdater.schedule()));
		this._register(this.viewsService.onDidChangeFocusedView(() => {
			if (this.titleIncludesFocusedView) {
				this.titleUpdater.schedule();
			}
		}));
		this._register(this.contextKeyService.onDidChangeContext(e => {
			if (e.affectsSome(this.variables)) {
				this.titleUpdater.schedule();
			}
		}));
		this._register(this.accessibilityService.onDidChangeScreenReaderOptimized(() => this.titleUpdater.schedule()));
	}

	private onConfigurationChanged(event: IConfigurationChangeEvent): void {
		const affectsTitleConfiguration = event.affectsConfiguration(WindowSettingNames.title);
		if (affectsTitleConfiguration) {
			this.checkTitleVariables();
		}

		if (affectsTitleConfiguration || event.affectsConfiguration(WindowSettingNames.titleSeparator)) {
			this.titleUpdater.schedule();
		}
	}

	private checkTitleVariables(): void {
		const titleTemplate = this.configurationService.getValue<unknown>(WindowSettingNames.title);
		if (typeof titleTemplate === 'string') {
			this.titleIncludesFocusedView = titleTemplate.includes('${focusedView}');
			this.titleIncludesEditorState = titleTemplate.includes('${activeEditorState}');
		}
	}

	private onActiveEditorChange(): void {

		// Dispose old listeners
		this.activeEditorListeners.clear();

		// Calculate New Window Title
		this.titleUpdater.schedule();

		// Apply listener for dirty and label changes
		const activeEditor = this.editorService.activeEditor;
		if (activeEditor) {
			this.activeEditorListeners.add(activeEditor.onDidChangeDirty(() => this.titleUpdater.schedule()));
			this.activeEditorListeners.add(activeEditor.onDidChangeLabel(() => this.titleUpdater.schedule()));
		}

		// Apply listeners for tracking focused code editor
		if (this.titleIncludesFocusedView) {
			const activeTextEditorControl = this.editorService.activeTextEditorControl;
			const textEditorControls: ICodeEditor[] = [];
			if (isCodeEditor(activeTextEditorControl)) {
				textEditorControls.push(activeTextEditorControl);
			} else if (isDiffEditor(activeTextEditorControl)) {
				textEditorControls.push(activeTextEditorControl.getOriginalEditor(), activeTextEditorControl.getModifiedEditor());
			}

			for (const textEditorControl of textEditorControls) {
				this.activeEditorListeners.add(textEditorControl.onDidBlurEditorText(() => this.titleUpdater.schedule()));
				this.activeEditorListeners.add(textEditorControl.onDidFocusEditorText(() => this.titleUpdater.schedule()));
			}
		}

		// Apply listener for decorations to track editor state
		if (this.titleIncludesEditorState) {
			this.activeEditorListeners.add(this.decorationsService.onDidChangeDecorations(() => this.titleUpdater.schedule()));
		}
	}

	private doUpdateTitle(): void {
		const title = this.getFullWindowTitle();
		if (title !== this.title) {

			// Always set the native window title to identify us properly to the OS
			let nativeTitle = title;
			if (!trim(nativeTitle)) {
				nativeTitle = this.productService.nameLong;
			}

			const window = getWindowById(this.windowId, true).window;
			if (!window.document.title && isMacintosh && nativeTitle === this.productService.nameLong) {
				// TODO@electron macOS: if we set a window title for
				// the first time and it matches the one we set in
				// `windowImpl.ts` somehow the window does not appear
				// in the "Windows" menu. As such, we set the title
				// briefly to something different to ensure macOS
				// recognizes we have a window.
				// See: https://github.com/microsoft/vscode/issues/191288
				window.document.title = `${this.productService.nameLong} ${WindowTitle.TITLE_DIRTY}`;
			}

			window.document.title = nativeTitle;
			this.title = title;

			this.onDidChangeEmitter.fire();
		}
	}

	private getFullWindowTitle(): string {
		const { prefix, suffix } = this.getTitleDecorations();

		let title = this.getWindowTitle() || this.productService.nameLong;
		if (prefix) {
			title = `${prefix} ${title}`;
		}

		if (suffix) {
			title = `${title} ${suffix}`;
		}

		// Replace non-space whitespace
		return title.replace(/[^\S ]/g, ' ');
	}

	getTitleDecorations() {
		let prefix: string | undefined;
		let suffix: string | undefined;

		if (this.properties.prefix) {
			prefix = this.properties.prefix;
		}

		if (this.environmentService.isExtensionDevelopment) {
			prefix = !prefix
				? WindowTitle.NLS_EXTENSION_HOST
				: `${WindowTitle.NLS_EXTENSION_HOST} - ${prefix}`;
		}

		if (this.properties.isAdmin) {
			suffix = WindowTitle.NLS_USER_IS_ADMIN;
		}

		return { prefix, suffix };
	}

	updateProperties(properties: ITitleProperties): void {
		const isAdmin = typeof properties.isAdmin === 'boolean' ? properties.isAdmin : this.properties.isAdmin;
		const isPure = typeof properties.isPure === 'boolean' ? properties.isPure : this.properties.isPure;
		const prefix = typeof properties.prefix === 'string' ? properties.prefix : this.properties.prefix;

		if (isAdmin !== this.properties.isAdmin || isPure !== this.properties.isPure || prefix !== this.properties.prefix) {
			this.properties.isAdmin = isAdmin;
			this.properties.isPure = isPure;
			this.properties.prefix = prefix;

			this.titleUpdater.schedule();
		}
	}

	registerVariables(variables: ITitleVariable[]): void {
		let changed = false;

		for (const { name, contextKey } of variables) {
			if (!this.variables.has(contextKey)) {
				this.variables.set(contextKey, name);

				changed = true;
			}
		}

		if (changed) {
			this.titleUpdater.schedule();
		}
	}

	/**
	 * Possible template values:
	 *
	 * {activeEditorLong}: e.g. /Users/Development/myFolder/myFileFolder/myFile.txt
	 * {activeEditorMedium}: e.g. myFolder/myFileFolder/myFile.txt
	 * {activeEditorShort}: e.g. myFile.txt
	 * {activeFolderLong}: e.g. /Users/Development/myFolder/myFileFolder
	 * {activeFolderMedium}: e.g. myFolder/myFileFolder
	 * {activeFolderShort}: e.g. myFileFolder
	 * {rootName}: e.g. myFolder1, myFolder2, myFolder3
	 * {rootPath}: e.g. /Users/Development
	 * {folderName}: e.g. myFolder
	 * {folderPath}: e.g. /Users/Development/myFolder
	 * {appName}: e.g. VS Code
	 * {remoteName}: e.g. SSH
	 * {dirty}: indicator
	 * {focusedView}: e.g. Terminal
	 * {separator}: conditional separator
	 * {activeEditorState}: e.g. Modified
	 */
	getWindowTitle(): string {
		const editor = this.editorService.activeEditor;
		const workspace = this.contextService.getWorkspace();

		// Compute root
		let root: URI | undefined;
		if (workspace.configuration) {
			root = workspace.configuration;
		} else if (workspace.folders.length) {
			root = workspace.folders[0].uri;
		}

		// Compute active editor folder
		const editorResource = EditorResourceAccessor.getOriginalUri(editor, { supportSideBySide: SideBySideEditor.PRIMARY });
		let editorFolderResource = editorResource ? dirname(editorResource) : undefined;
		if (editorFolderResource?.path === '.') {
			editorFolderResource = undefined;
		}

		// Compute folder resource
		// Single Root Workspace: always the root single workspace in this case
		// Otherwise: root folder of the currently active file if any
		let folder: IWorkspaceFolder | undefined = undefined;
		if (this.contextService.getWorkbenchState() === WorkbenchState.FOLDER) {
			folder = workspace.folders[0];
		} else if (editorResource) {
			folder = this.contextService.getWorkspaceFolder(editorResource) ?? undefined;
		}

		// Compute remote
		// vscode-remtoe: use as is
		// otherwise figure out if we have a virtual folder opened
		let remoteName: string | undefined = undefined;
		if (this.environmentService.remoteAuthority && !isWeb) {
			remoteName = this.labelService.getHostLabel(Schemas.vscodeRemote, this.environmentService.remoteAuthority);
		} else {
			const virtualWorkspaceLocation = getVirtualWorkspaceLocation(workspace);
			if (virtualWorkspaceLocation) {
				remoteName = this.labelService.getHostLabel(virtualWorkspaceLocation.scheme, virtualWorkspaceLocation.authority);
			}
		}

		// Variables
		const activeEditorShort = editor ? editor.getTitle(Verbosity.SHORT) : '';
		const activeEditorMedium = editor ? editor.getTitle(Verbosity.MEDIUM) : activeEditorShort;
		const activeEditorLong = editor ? editor.getTitle(Verbosity.LONG) : activeEditorMedium;
		const activeFolderShort = editorFolderResource ? basename(editorFolderResource) : '';
		const activeFolderMedium = editorFolderResource ? this.labelService.getUriLabel(editorFolderResource, { relative: true }) : '';
		const activeFolderLong = editorFolderResource ? this.labelService.getUriLabel(editorFolderResource) : '';
		const rootName = this.labelService.getWorkspaceLabel(workspace);
		const rootNameShort = this.labelService.getWorkspaceLabel(workspace, { verbose: LabelVerbosity.SHORT });
		const rootPath = root ? this.labelService.getUriLabel(root) : '';
		const folderName = folder ? folder.name : '';
		const folderPath = folder ? this.labelService.getUriLabel(folder.uri) : '';
		const dirty = editor?.isDirty() && !editor.isSaving() ? WindowTitle.TITLE_DIRTY : '';
		const appName = this.productService.nameLong;
		const profileName = this.userDataProfileService.currentProfile.isDefault ? '' : this.userDataProfileService.currentProfile.name;
		const focusedView: string = this.viewsService.getFocusedViewName();
		const activeEditorState = editorResource ? this.decorationsService.getDecoration(editorResource, false)?.tooltip : undefined;

		const variables: Record<string, string> = {};
		for (const [contextKey, name] of this.variables) {
			variables[name] = this.contextKeyService.getContextKeyValue(contextKey) ?? '';
		}

		let titleTemplate = this.configurationService.getValue<string>(WindowSettingNames.title);
		if (typeof titleTemplate !== 'string') {
			titleTemplate = defaultWindowTitle;
		}

		if (!this.titleIncludesEditorState && this.accessibilityService.isScreenReaderOptimized() && this.configurationService.getValue('accessibility.windowTitleOptimized')) {
			titleTemplate += '${separator}${activeEditorState}';
		}

		let separator = this.configurationService.getValue<string>(WindowSettingNames.titleSeparator);
		if (typeof separator !== 'string') {
			separator = defaultWindowTitleSeparator;
		}

		return template(titleTemplate, {
			...variables,
			activeEditorShort,
			activeEditorLong,
			activeEditorMedium,
			activeFolderShort,
			activeFolderMedium,
			activeFolderLong,
			rootName,
			rootPath,
			rootNameShort,
			folderName,
			folderPath,
			dirty,
			appName,
			remoteName,
			profileName,
			focusedView,
			activeEditorState,
			separator: { label: separator }
		});
	}

	isCustomTitleFormat(): boolean {
		if (this.accessibilityService.isScreenReaderOptimized() || this.titleIncludesEditorState) {
			return true;
		}
		const title = this.configurationService.inspect<string>(WindowSettingNames.title);
		const titleSeparator = this.configurationService.inspect<string>(WindowSettingNames.titleSeparator);

		return title.value !== title.defaultValue || titleSeparator.value !== titleSeparator.defaultValue;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/titlebar/media/menubarControl.css]---
Location: vscode-main/src/vs/workbench/browser/parts/titlebar/media/menubarControl.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .menubar > .menubar-menu-button,
.monaco-workbench .menubar .toolbar-toggle-more {
	color: var(--vscode-titleBar-activeForeground);
}

.monaco-workbench .activitybar .menubar.compact > .menubar-menu-button,
.monaco-workbench .activitybar .menubar.compact .toolbar-toggle-more {
	color: var(--vscode-activityBar-inactiveForeground);
}

.monaco-workbench .activitybar .menubar.compact > .menubar-menu-button.open,
.monaco-workbench .activitybar .menubar.compact > .menubar-menu-button:focus,
.monaco-workbench .activitybar .menubar.compact:not(:focus-within) > .menubar-menu-button:hover,
.monaco-workbench .activitybar .menubar.compact > .menubar-menu-button.open .toolbar-toggle-more,
.monaco-workbench .activitybar .menubar.compact > .menubar-menu-button:focus .toolbar-toggle-more,
.monaco-workbench .activitybar .menubar.compact:not(:focus-within) > .menubar-menu-button:hover .toolbar-toggle-more {
	color: var(--vscode-activityBar-foreground);
}

.monaco-workbench .activitybar .menubar.compact > .menubar-menu-button:focus {
	background-color: var(--vscode-menubar-selectionBackground);
}

.monaco-workbench .menubar.inactive:not(.compact) > .menubar-menu-button,
.monaco-workbench .menubar.inactive:not(.compact) > .menubar-menu-button .toolbar-toggle-more {
	color: var(--vscode-titleBar-inactiveForeground);
}

.monaco-workbench .menubar:not(.compact) > .menubar-menu-button.open,
.monaco-workbench .menubar:not(.compact) > .menubar-menu-button:focus,
.monaco-workbench .menubar:not(:focus-within):not(.compact) > .menubar-menu-button:hover,
.monaco-workbench .menubar:not(.compact) > .menubar-menu-button.open .toolbar-toggle-more,
.monaco-workbench .menubar:not(.compact) > .menubar-menu-button:focus .toolbar-toggle-more,
.monaco-workbench .menubar:not(:focus-within):not(.compact) > .menubar-menu-button:hover .toolbar-toggle-more {
	color: var(--vscode-menubar-selectionForeground);
}

.monaco-workbench .menubar:not(.compact) > .menubar-menu-button.open .menubar-menu-title,
.monaco-workbench .menubar:not(.compact) > .menubar-menu-button:focus .menubar-menu-title,
.monaco-workbench .menubar:not(:focus-within):not(.compact) > .menubar-menu-button:hover .menubar-menu-title {
	background-color: var(--vscode-menubar-selectionBackground);
}

.monaco-workbench .menubar > .menubar-menu-button:hover .menubar-menu-title {
	outline: dashed 1px var(--vscode-menubar-selectionBorder);
}

.monaco-workbench .menubar > .menubar-menu-button.open .menubar-menu-title,
.monaco-workbench .menubar > .menubar-menu-button:focus .menubar-menu-title {
	outline: solid 1px var(--vscode-menubar-selectionBorder);
}

.monaco-workbench .menubar > .menubar-menu-button.open .menubar-menu-title,
.monaco-workbench .menubar > .menubar-menu-button:focus .menubar-menu-title,
.monaco-workbench .menubar > .menubar-menu-button:hover .menubar-menu-title {
	outline-color: var(--vscode-menubar-selectionBorder);
	outline-offset: -1px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/titlebar/media/titlebarpart.css]---
Location: vscode-main/src/vs/workbench/browser/parts/titlebar/media/titlebarpart.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Part Element */
.monaco-workbench .part.titlebar {
	display: flex;
	flex-direction: row;
}

.monaco-workbench.mac .part.titlebar {
	flex-direction: row-reverse;
}

/* Root Container */
.monaco-workbench .part.titlebar > .titlebar-container {
	box-sizing: border-box;
	overflow: hidden;
	flex-shrink: 1;
	flex-grow: 1;
	align-items: center;
	justify-content: space-between;
	user-select: none;
	-webkit-user-select: none;
	display: flex;
	height: 100%;
	width: 100%;
}

/* Account for zooming */
.monaco-workbench .part.titlebar > .titlebar-container.counter-zoom {
	zoom: calc(1.0 / var(--zoom-factor));
}

/* Platform specific root element */
.monaco-workbench.mac .part.titlebar > .titlebar-container {
	line-height: 22px;
}

.monaco-workbench.web .part.titlebar > .titlebar-container,
.monaco-workbench.windows .part.titlebar > .titlebar-container,
.monaco-workbench.linux .part.titlebar > .titlebar-container {
	line-height: 22px;
	justify-content: left;
}

.monaco-workbench.web.safari .part.titlebar,
.monaco-workbench.web.safari .part.titlebar > .titlebar-container {
	/* Must be scoped to safari due to #148851 */
	/* Is required in safari due to #149476 */
	overflow: visible;
}

/* Draggable region */
.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-drag-region {
	top: 0;
	left: 0;
	display: block;
	position: absolute;
	width: 100%;
	height: 100%;
	-webkit-app-region: drag;
}

.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-left,
.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-center,
.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-right {
	display: flex;
	height: 100%;
	align-items: center;
}

.monaco-workbench .part.titlebar > .titlebar-container.has-center > .titlebar-left {
	order: 0;
	width: 20%;
	flex-grow: 2;
	justify-content: flex-start;
}

.monaco-workbench .part.titlebar > .titlebar-container.has-center > .titlebar-center {
	order: 1;
	width: 60%;
	max-width: fit-content;
	min-width: 0px;
	margin: 0 10px;
	/* flex-shrink: 10; */
	justify-content: center;
}

.monaco-workbench .part.titlebar > .titlebar-container.has-center > .titlebar-right {
	order: 2;
	width: 20%;
	min-width: min-content;
	flex-grow: 2;
	justify-content: flex-end;
}

.monaco-workbench .part.titlebar > .titlebar-container:not(.has-center) > .titlebar-left {
	flex: 1 1 0%;
	min-width: 0;
}

.monaco-workbench .part.titlebar > .titlebar-container:not(.has-center) > .titlebar-center {
	display: none;
}

.monaco-workbench .part.titlebar > .titlebar-container:not(.has-center) > .titlebar-right {
	flex: 0 0 auto;
	padding-left: 16px; /* ensure there is some space between title and controls */
}

/* Window title text */
.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-center > .window-title {
	flex: 0 1 auto;
	font-size: 12px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	margin-left: auto;
	margin-right: auto;
}

.monaco-workbench.web .part.titlebar > .titlebar-container > .titlebar-center > .window-title,
.monaco-workbench.windows .part.titlebar > .titlebar-container > .titlebar-center > .window-title,
.monaco-workbench.linux .part.titlebar > .titlebar-container > .titlebar-center > .window-title {
	cursor: default;
}

.monaco-workbench.linux .part.titlebar > .titlebar-container > .titlebar-center > .window-title {
	font-size: inherit;
	/* see #55435 */
}

.monaco-workbench .part.titlebar > .titlebar-container .monaco-toolbar .actions-container {
	gap: 4px;
}

/* Window Title Menu */
.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-center > .window-title > .command-center {
	z-index: 2500;
	-webkit-app-region: no-drag;
}

.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-center > .window-title > .command-center.hide {
	visibility: hidden;
}

.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-center > .window-title > .command-center > .monaco-toolbar > .monaco-action-bar > .actions-container > .action-item > .action-label,
.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-center > .window-title > .command-center > .monaco-toolbar > .monaco-action-bar > .actions-container > .action-item.monaco-dropdown-with-primary .action-label {
	color: var(--vscode-titleBar-activeForeground);
}

.monaco-workbench .part.titlebar.inactive > .titlebar-container > .titlebar-center > .window-title > .command-center > .monaco-toolbar > .monaco-action-bar > .actions-container > .action-item > .action-label,
.monaco-workbench .part.titlebar.inactive > .titlebar-container > .titlebar-center > .window-title > .command-center > .monaco-toolbar > .monaco-action-bar > .actions-container > .action-item.monaco-dropdown-with-primary .action-label {
	color: var(--vscode-titleBar-inactiveForeground);
}

.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-center > .window-title > .command-center > .monaco-toolbar > .monaco-action-bar > .actions-container > .action-item > .action-label {
	color: inherit;
}

.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-center > .window-title > .command-center .action-item.command-center-center {
	display: flex;
	align-items: stretch;
	color: var(--vscode-commandCenter-foreground);
	background-color: var(--vscode-commandCenter-background);
	border: 1px solid var(--vscode-commandCenter-border);
	overflow: hidden;
	margin: 0 6px;
	border-top-left-radius: 6px;
	border-bottom-left-radius: 6px;
	border-top-right-radius: 6px;
	border-bottom-right-radius: 6px;
	height: 22px;
	width: 38vw;
	max-width: 600px;
}

.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-center > .window-title > .command-center .action-item.command-center-center .action-item.command-center-quick-pick {
	display: flex;
	justify-content: start;
	overflow: hidden;
	margin: auto;
	max-width: 600px;
}

.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-center > .window-title > .command-center .action-item.command-center-center .action-item.command-center-quick-pick .search-icon {
	font-size: 14px;
	opacity: .8;
	margin: auto 3px;
	color: var(--vscode-commandCenter-foreground);
}

.monaco-workbench .part.titlebar.inactive > .titlebar-container > .titlebar-center > .window-title > .command-center .action-item.command-center-center .action-item.command-center-quick-pick .search-icon {
	color: var(--vscode-titleBar-inactiveForeground);
}

.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-center > .window-title > .command-center .action-item.command-center-center .action-item.command-center-quick-pick .search-label {
	overflow: hidden;
	text-overflow: ellipsis;
}

.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-center > .window-title > .command-center .action-item.command-center-center.multiple {
	justify-content: flex-start;
	padding: 0 12px;
}

.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-center > .window-title > .command-center .action-item.command-center-center.multiple.active .action-label {
	background-color: inherit;
}

.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-center > .window-title > .command-center .action-item.command-center-center:only-child {
	margin-left: 0; /* no margin if there is only the command center, without nav buttons */
}

.monaco-workbench .part.titlebar.inactive > .titlebar-container > .titlebar-center > .window-title > .command-center .action-item.command-center-center {
	color: var(--vscode-titleBar-inactiveForeground);
	border-color: var(--vscode-commandCenter-inactiveBorder) !important;
}

.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-center > .window-title > .command-center .action-item.command-center-center:HOVER {
	color: var(--vscode-commandCenter-activeForeground);
	background-color: var(--vscode-commandCenter-activeBackground);
	border-color: var(--vscode-commandCenter-activeBorder);
}

/* Menubar */
.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-left > .menubar {
	/* move menubar above drag region as negative z-index on drag region cause greyscale AA */
	z-index: 2500;
	min-width: 36px;
	flex-wrap: nowrap;
	order: 2;
}

.monaco-workbench.web .part.titlebar > .titlebar-container > .titlebar-left > .menubar {
	margin-left: 4px;
}

.monaco-workbench .part.titlebar > .titlebar-container.counter-zoom .menubar .menubar-menu-button > .menubar-menu-items-holder.monaco-menu-container,
.monaco-workbench .part.titlebar > .titlebar-container.counter-zoom .monaco-toolbar .dropdown-action-container {
	zoom: var(--zoom-factor); /* helps to position the menu properly when counter zooming */
}

/* Resizer */
.monaco-workbench.windows .part.titlebar > .titlebar-container > .resizer,
.monaco-workbench.linux .part.titlebar > .titlebar-container > .resizer {
	-webkit-app-region: no-drag;
	position: absolute;
	top: 0;
	width: 100%;
	height: 4px;
}

.monaco-workbench.windows.fullscreen .part.titlebar > .titlebar-container > .resizer,
.monaco-workbench.linux.fullscreen .part.titlebar > .titlebar-container > .resizer {
	display: none;
}

/* App Icon */
.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-left > .window-appicon {
	width: 35px;
	height: 100%;
	position: relative;
	z-index: 2500;
	flex-shrink: 0;
	order: 1;
}

.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-left > .window-appicon:not(.codicon) {
	background-image: url('../../../media/code-icon.svg');
	background-repeat: no-repeat;
	background-position: center center;
	background-size: 16px;
}

.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-left > .window-appicon.codicon {
	line-height: 30px;
}

.monaco-workbench.fullscreen .part.titlebar > .titlebar-container > .titlebar-left > .window-appicon {
	display: none;
}

/* Window Controls Container */
.monaco-workbench .part.titlebar .window-controls-container {
	display: flex;
	flex-grow: 0;
	flex-shrink: 0;
	text-align: center;
	z-index: 3000;
	-webkit-app-region: no-drag;
	width: 0px;
	height: 100%;
}

.monaco-workbench.fullscreen .part.titlebar .window-controls-container {
	display: none;
	background-color: transparent;
}

/* Window Controls Container Web: Apply WCO environment variables (https://developer.mozilla.org/en-US/docs/Web/CSS/env#titlebar-area-x) */
.monaco-workbench.web .part.titlebar .titlebar-right .window-controls-container {
	width: calc(100vw - env(titlebar-area-width, 100vw) - env(titlebar-area-x, 0px));
	height: env(titlebar-area-height, 35px);
}

.monaco-workbench.web .part.titlebar .titlebar-left .window-controls-container {
	width: env(titlebar-area-x, 0px);
	height: env(titlebar-area-height, 35px);
}

.monaco-workbench.web.mac .part.titlebar .titlebar-left .window-controls-container {
	order: 0;
}

.monaco-workbench.web.mac .part.titlebar .titlebar-right .window-controls-container {
	order: 1;
}

/* Window Controls Container Desktop: apply zoom friendly size */
.monaco-workbench:not(.web):not(.mac) .part.titlebar .window-controls-container {
	width: calc(138px / var(--zoom-factor, 1));
}

.monaco-workbench:not(.web):not(.mac) .part.titlebar .titlebar-container.counter-zoom .window-controls-container {
	width: 138px;
}

.monaco-workbench.linux:not(.web) .part.titlebar .window-controls-container.wco-enabled {
	width: calc(100vw - env(titlebar-area-width, 100vw) - env(titlebar-area-x, 0px));
}

.monaco-workbench:not(.web):not(.mac) .part.titlebar .titlebar-container:not(.counter-zoom) .window-controls-container * {
	zoom: calc(1 / var(--zoom-factor, 1));
}

.monaco-workbench:not(.web).mac .part.titlebar .window-controls-container {
	width: 70px;
}

/* Window Control Icons */
.monaco-workbench .part.titlebar .window-controls-container > .window-icon {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 46px;
	font-size: 16px;
	color: var(--vscode-titleBar-activeForeground);
}

.monaco-workbench .part.titlebar.inactive .window-controls-container > .window-icon {
	color: var(--vscode-titleBar-inactiveForeground);
}

.monaco-workbench .part.titlebar .window-controls-container > .window-icon::before {
	height: 16px;
	line-height: 16px;
}

.monaco-workbench .part.titlebar .window-controls-container > .window-icon:hover {
	background-color: rgba(255, 255, 255, 0.1);
}

.monaco-workbench .part.titlebar.light .window-controls-container > .window-icon:hover {
	background-color: rgba(0, 0, 0, 0.1);
}

.monaco-workbench .part.titlebar .window-controls-container > .window-icon.window-close:hover {
	background-color: rgba(232, 17, 35, 0.9);
}

.monaco-workbench .part.titlebar .window-controls-container .window-icon.window-close:hover {
	color: white;
}

/* Action Tool Bar Controls */
.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-right > .action-toolbar-container {
	display: none;
	padding-right: 4px;
	flex-grow: 0;
	flex-shrink: 0;
	text-align: center;
	position: relative;
	z-index: 2500;
	-webkit-app-region: no-drag;
	height: 100%;
}

.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-right > .action-toolbar-container {
	margin-left: auto;
}

.monaco-workbench.mac:not(.web) .part.titlebar > .titlebar-container > .titlebar-right > .action-toolbar-container {
	right: 8px;
}

.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-right > .action-toolbar-container:not(.has-no-actions) {
	display: flex;
	justify-content: center;
}

.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-right > .action-toolbar-container .codicon {
	color: inherit;
}

.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-right > .action-toolbar-container .monaco-action-bar .action-item {
	display: flex;
}

.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-right > .action-toolbar-container .monaco-action-bar .badge {
	margin-left: 8px;
	display: flex;
	align-items: center;
}

.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-right > .action-toolbar-container .monaco-action-bar .action-item.icon .badge {
	margin-left: 0px;
}

.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-right > .action-toolbar-container .monaco-action-bar .badge .badge-content {
	padding: 3px 5px;
	border-radius: 11px;
	font-size: 9px;
	min-width: 11px;
	height: 16px;
	line-height: 11px;
	font-weight: normal;
	text-align: center;
	display: inline-block;
	box-sizing: border-box;
	position: relative;
}

.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-right > .action-toolbar-container .monaco-action-bar .action-item.icon .badge.compact {
	position: absolute;
	top: 0;
	bottom: 0;
	margin: auto;
	left: 0;
	overflow: hidden;
	width: 100%;
	height: 100%;
	z-index: 2;
}

.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-right > .action-toolbar-container .monaco-action-bar .action-item.icon .badge.compact .badge-content::before {
	mask-size: 12px;
	-webkit-mask-size: 12px;
	top: 2px;
}

.monaco-workbench .part.titlebar > .titlebar-container > .titlebar-right > .action-toolbar-container .monaco-action-bar .action-item.icon .badge.compact .badge-content {
	position: absolute;
	top: 10px;
	right: 0px;
	font-size: 9px;
	font-weight: 600;
	min-width: 12px;
	height: 12px;
	line-height: 12px;
	padding: 0 2px;
	border-radius: 16px;
	text-align: center;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/views/checkbox.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/views/checkbox.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../base/browser/dom.js';
import type { IManagedHover } from '../../../../base/browser/ui/hover/hover.js';
import { IHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegate.js';
import { Checkbox } from '../../../../base/browser/ui/toggle/toggle.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import type { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { defaultCheckboxStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { ITreeItem, ITreeItemCheckboxState } from '../../../common/views.js';

export class CheckboxStateHandler extends Disposable {
	private readonly _onDidChangeCheckboxState = this._register(new Emitter<ITreeItem[]>());
	readonly onDidChangeCheckboxState: Event<ITreeItem[]> = this._onDidChangeCheckboxState.event;

	public setCheckboxState(node: ITreeItem) {
		this._onDidChangeCheckboxState.fire([node]);
	}
}

export class TreeItemCheckbox extends Disposable {
	private toggle: Checkbox | undefined;
	private readonly checkboxContainer: HTMLDivElement;
	private hover: IManagedHover | undefined;

	public static readonly checkboxClass = 'custom-view-tree-node-item-checkbox';

	constructor(
		container: HTMLElement,
		private readonly checkboxStateHandler: CheckboxStateHandler,
		private readonly hoverDelegate: IHoverDelegate,
		private readonly hoverService: IHoverService
	) {
		super();
		this.checkboxContainer = <HTMLDivElement>container;
	}

	public render(node: ITreeItem) {
		if (node.checkbox) {
			if (!this.toggle) {
				this.createCheckbox(node);
			}
			else {
				this.toggle.checked = node.checkbox.isChecked;
			}
		}
	}

	private createCheckbox(node: ITreeItem) {
		if (node.checkbox) {
			this.toggle = new Checkbox('', node.checkbox.isChecked, { ...defaultCheckboxStyles, size: 15 });
			this.setHover(node.checkbox);
			this.setAccessibilityInformation(node.checkbox);
			this.toggle.domNode.classList.add(TreeItemCheckbox.checkboxClass);
			this.toggle.domNode.tabIndex = 1;
			DOM.append(this.checkboxContainer, this.toggle.domNode);
			this.registerListener(node);
		}
	}

	private registerListener(node: ITreeItem) {
		if (this.toggle) {
			this._register({ dispose: () => this.removeCheckbox() });
			this._register(this.toggle);
			this._register(this.toggle.onChange(() => {
				this.setCheckbox(node);
			}));
		}
	}

	private setHover(checkbox: ITreeItemCheckboxState) {
		if (this.toggle) {
			if (!this.hover) {
				this.hover = this._register(this.hoverService.setupManagedHover(this.hoverDelegate, this.toggle.domNode, this.checkboxHoverContent(checkbox)));
			} else {
				this.hover.update(checkbox.tooltip);
			}
		}
	}

	private setCheckbox(node: ITreeItem) {
		if (this.toggle && node.checkbox) {
			node.checkbox.isChecked = this.toggle.checked;
			this.setHover(node.checkbox);

			this.setAccessibilityInformation(node.checkbox);
			this.checkboxStateHandler.setCheckboxState(node);
		}
	}

	private checkboxHoverContent(checkbox: ITreeItemCheckboxState): string {
		return checkbox.tooltip ? checkbox.tooltip :
			checkbox.isChecked ? localize('checked', 'Checked') : localize('unchecked', 'Unchecked');
	}

	private setAccessibilityInformation(checkbox: ITreeItemCheckboxState) {
		if (this.toggle && checkbox.accessibilityInformation) {
			this.toggle.setTitle(checkbox.accessibilityInformation.label);
			if (checkbox.accessibilityInformation.role) {
				this.toggle.domNode.role = checkbox.accessibilityInformation.role;
			}
		}
	}

	private removeCheckbox() {
		const children = this.checkboxContainer.children;
		for (const child of children) {
			child.remove();
		}
	}
}
```

--------------------------------------------------------------------------------

````
