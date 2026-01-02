---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 380
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 380 of 552)

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

---[FILE: src/vs/workbench/contrib/debug/browser/debugToolBar.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugToolBar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { StandardMouseEvent } from '../../../../base/browser/mouseEvent.js';
import { PixelRatio } from '../../../../base/browser/pixelRatio.js';
import { ActionBar, ActionsOrientation, IActionViewItem } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { IBaseActionViewItemOptions } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { CodeWindow, mainWindow } from '../../../../base/browser/window.js';
import { Action, IAction, IRunEvent, WorkbenchActionExecutedClassification, WorkbenchActionExecutedEvent } from '../../../../base/common/actions.js';
import * as arrays from '../../../../base/common/arrays.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { Codicon } from '../../../../base/common/codicons.js';
import * as errors from '../../../../base/common/errors.js';
import { DisposableStore, markAsSingleton, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { Platform, platform } from '../../../../base/common/platform.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { localize } from '../../../../nls.js';
import { ICommandAction, ICommandActionTitle } from '../../../../platform/action/common/action.js';
import { DropdownWithPrimaryActionViewItem, IDropdownWithPrimaryActionViewItemOptions } from '../../../../platform/actions/browser/dropdownWithPrimaryActionViewItem.js';
import { createActionViewItem, getFlatActionBarActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IMenu, IMenuService, MenuId, MenuItemAction, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, ContextKeyExpression, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { widgetBorder, widgetShadow } from '../../../../platform/theme/common/colorRegistry.js';
import { IThemeService, Themable } from '../../../../platform/theme/common/themeService.js';
import { getTitleBarStyle, TitlebarStyle } from '../../../../platform/window/common/window.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { EditorTabsMode, IWorkbenchLayoutService, LayoutSettings, Parts } from '../../../services/layout/browser/layoutService.js';
import { CONTEXT_DEBUG_STATE, CONTEXT_FOCUSED_SESSION_IS_ATTACH, CONTEXT_FOCUSED_SESSION_IS_NO_DEBUG, CONTEXT_IN_DEBUG_MODE, CONTEXT_MULTI_SESSION_DEBUG, CONTEXT_STEP_BACK_SUPPORTED, CONTEXT_SUSPEND_DEBUGGEE_SUPPORTED, CONTEXT_TERMINATE_DEBUGGEE_SUPPORTED, IDebugConfiguration, IDebugService, State, VIEWLET_ID } from '../common/debug.js';
import { FocusSessionActionViewItem } from './debugActionViewItems.js';
import { debugToolBarBackground, debugToolBarBorder } from './debugColors.js';
import { CONTINUE_ID, CONTINUE_LABEL, DISCONNECT_AND_SUSPEND_ID, DISCONNECT_AND_SUSPEND_LABEL, DISCONNECT_ID, DISCONNECT_LABEL, FOCUS_SESSION_ID, FOCUS_SESSION_LABEL, PAUSE_ID, PAUSE_LABEL, RESTART_LABEL, RESTART_SESSION_ID, REVERSE_CONTINUE_ID, STEP_BACK_ID, STEP_INTO_ID, STEP_INTO_LABEL, STEP_OUT_ID, STEP_OUT_LABEL, STEP_OVER_ID, STEP_OVER_LABEL, STOP_ID, STOP_LABEL } from './debugCommands.js';
import * as icons from './debugIcons.js';
import './media/debugToolBar.css';

const DEBUG_TOOLBAR_POSITION_KEY = 'debug.actionswidgetposition';
const DEBUG_TOOLBAR_Y_KEY = 'debug.actionswidgety';

export class DebugToolBar extends Themable implements IWorkbenchContribution {

	private $el: HTMLElement;
	private dragArea: HTMLElement;
	private actionBar: ActionBar;
	private activeActions: IAction[];
	private updateScheduler: RunOnceScheduler;
	private debugToolBarMenu: IMenu;

	private isVisible = false;
	private isBuilt = false;

	private readonly stopActionViewItemDisposables = this._register(new DisposableStore());
	/** coordinate of the debug toolbar per aux window */
	private readonly auxWindowCoordinates = new WeakMap<CodeWindow, { x: number; y: number | undefined }>();

	private readonly trackPixelRatioListener = this._register(new MutableDisposable());

	constructor(
		@INotificationService private readonly notificationService: INotificationService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IDebugService private readonly debugService: IDebugService,
		@IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService,
		@IStorageService private readonly storageService: IStorageService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IThemeService themeService: IThemeService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IMenuService menuService: IMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {
		super(themeService);

		this.$el = dom.$('div.debug-toolbar');

		// Note: changes to this setting require a restart, so no need to listen to it.
		const controlsOnTitlebar = getTitleBarStyle(this.configurationService) === TitlebarStyle.CUSTOM;

		// Do not allow the widget to overflow or underflow window controls.
		// Use CSS calculations to avoid having to force layout with `.clientWidth`
		const controlsOnLeft = controlsOnTitlebar && platform === Platform.Mac;
		const controlsOnRight = controlsOnTitlebar && (platform === Platform.Windows || platform === Platform.Linux);
		this.$el.style.transform = `translate(
			min(
				max(${controlsOnLeft ? '60px' : '0px'}, calc(-50% + (100vw * var(--x-position)))),
				calc(100vw - 100% - ${controlsOnRight ? '100px' : '0px'})
			),
			var(--y-position)
		)`;

		this.dragArea = dom.append(this.$el, dom.$('div.drag-area' + ThemeIcon.asCSSSelector(icons.debugGripper)));

		const actionBarContainer = dom.append(this.$el, dom.$('div.action-bar-container'));
		this.debugToolBarMenu = menuService.createMenu(MenuId.DebugToolBar, contextKeyService);
		this._register(this.debugToolBarMenu);

		this.activeActions = [];
		this.actionBar = this._register(new ActionBar(actionBarContainer, {
			orientation: ActionsOrientation.HORIZONTAL,
			actionViewItemProvider: (action: IAction, options: IBaseActionViewItemOptions) => {
				if (action.id === FOCUS_SESSION_ID) {
					return this.instantiationService.createInstance(FocusSessionActionViewItem, action, undefined);
				} else if (action.id === STOP_ID || action.id === DISCONNECT_ID) {
					this.stopActionViewItemDisposables.clear();
					const item = this.instantiationService.invokeFunction(accessor => createDisconnectMenuItemAction(action as MenuItemAction, this.stopActionViewItemDisposables, accessor, { hoverDelegate: options.hoverDelegate }));
					if (item) {
						return item;
					}
				}

				return createActionViewItem(this.instantiationService, action, options);
			}
		}));

		this.updateScheduler = this._register(new RunOnceScheduler(() => {
			const state = this.debugService.state;
			const toolBarLocation = this.configurationService.getValue<IDebugConfiguration>('debug').toolBarLocation;
			if (
				state === State.Inactive ||
				toolBarLocation !== 'floating' ||
				this.debugService.getModel().getSessions().every(s => s.suppressDebugToolbar) ||
				(state === State.Initializing && this.debugService.initializingOptions?.suppressDebugToolbar)
			) {
				return this.hide();
			}

			const actions = getFlatActionBarActions(this.debugToolBarMenu.getActions({ shouldForwardArgs: true }));
			if (!arrays.equals(actions, this.activeActions, (first, second) => first.id === second.id && first.enabled === second.enabled)) {
				this.actionBar.clear();
				this.actionBar.push(actions, { icon: true, label: false });
				this.activeActions = actions;
			}

			this.show();
		}, 20));

		this.updateStyles();
		this.registerListeners();
		this.hide();
	}

	private registerListeners(): void {
		this._register(this.debugService.onDidChangeState(() => this.updateScheduler.schedule()));
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('debug.toolBarLocation')) {
				this.updateScheduler.schedule();
			}
			if (e.affectsConfiguration(LayoutSettings.EDITOR_TABS_MODE) || e.affectsConfiguration(LayoutSettings.COMMAND_CENTER)) {
				this._yRange = undefined;
				this.setCoordinates();
			}
		}));
		this._register(this.debugToolBarMenu.onDidChange(() => this.updateScheduler.schedule()));
		this._register(this.actionBar.actionRunner.onDidRun((e: IRunEvent) => {
			// check for error
			if (e.error && !errors.isCancellationError(e.error)) {
				this.notificationService.warn(e.error);
			}

			// log in telemetry
			this.telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: e.action.id, from: 'debugActionsWidget' });
		}));

		this._register(dom.addDisposableGenericMouseUpListener(this.dragArea, (event: MouseEvent) => {
			const mouseClickEvent = new StandardMouseEvent(dom.getWindow(this.dragArea), event);
			if (mouseClickEvent.detail === 2) {
				// double click on debug bar centers it again #8250
				this.setCoordinates(0.5, this.yDefault);
				this.storePosition();
			}
		}));

		this._register(dom.addDisposableGenericMouseDownListener(this.dragArea, (e: MouseEvent) => {
			this.dragArea.classList.add('dragged');
			const activeWindow = dom.getWindow(this.layoutService.activeContainer);
			const originEvent = new StandardMouseEvent(activeWindow, e);

			const originX = this.computeCurrentXPercent();
			const originY = this.getCurrentYPosition();

			const mouseMoveListener = dom.addDisposableGenericMouseMoveListener(activeWindow, (e: MouseEvent) => {
				const mouseMoveEvent = new StandardMouseEvent(activeWindow, e);
				// Prevent default to stop editor selecting text #8524
				mouseMoveEvent.preventDefault();
				this.setCoordinates(
					originX + (mouseMoveEvent.posx - originEvent.posx) / activeWindow.innerWidth,
					originY + mouseMoveEvent.posy - originEvent.posy,
				);
			});

			const mouseUpListener = dom.addDisposableGenericMouseUpListener(activeWindow, (e: MouseEvent) => {
				this.storePosition();
				this.dragArea.classList.remove('dragged');

				mouseMoveListener.dispose();
				mouseUpListener.dispose();
			});
		}));

		this._register(this.layoutService.onDidChangePartVisibility(() => this.setCoordinates()));

		this._register(this.layoutService.onDidChangeActiveContainer(async () => {
			this._yRange = undefined;

			// note: we intentionally don't keep the activeContainer before the
			// `await` clause to avoid any races due to quickly switching windows.
			await this.layoutService.whenContainerStylesLoaded(dom.getWindow(this.layoutService.activeContainer));
			if (this.isBuilt) {
				this.doShowInActiveContainer();
				this.setCoordinates();
			}
		}));
	}

	/**
	 * Computes the x percent position at which the toolbar is currently displayed.
	 */
	private computeCurrentXPercent(): number {
		const { left, width } = this.$el.getBoundingClientRect();
		return (left + width / 2) / dom.getWindow(this.$el).innerWidth;
	}

	/**
	 * Gets the x position set in the style of the toolbar. This may not be its
	 * actual position on screen depending on toolbar locations.
	 */
	private getCurrentXPercent(): number {
		return Number(this.$el.style.getPropertyValue('--x-position'));
	}

	/** Gets the y position set in the style of the toolbar */
	private getCurrentYPosition(): number {
		return parseInt(this.$el.style.getPropertyValue('--y-position'));
	}

	private storePosition(): void {
		const activeWindow = dom.getWindow(this.layoutService.activeContainer);
		const isMainWindow = this.layoutService.activeContainer === this.layoutService.mainContainer;

		const x = this.getCurrentXPercent();
		const y = this.getCurrentYPosition();
		if (isMainWindow) {
			this.storageService.store(DEBUG_TOOLBAR_POSITION_KEY, x, StorageScope.PROFILE, StorageTarget.MACHINE);
			this.storageService.store(DEBUG_TOOLBAR_Y_KEY, y, StorageScope.PROFILE, StorageTarget.MACHINE);
		} else {
			this.auxWindowCoordinates.set(activeWindow, { x, y });
		}
	}

	override updateStyles(): void {
		super.updateStyles();

		if (this.$el) {
			this.$el.style.backgroundColor = this.getColor(debugToolBarBackground) || '';

			const widgetShadowColor = this.getColor(widgetShadow);
			this.$el.style.boxShadow = widgetShadowColor ? `0 0 8px 2px ${widgetShadowColor}` : '';

			const contrastBorderColor = this.getColor(widgetBorder);
			const borderColor = this.getColor(debugToolBarBorder);

			if (contrastBorderColor) {
				this.$el.style.border = `1px solid ${contrastBorderColor}`;
			} else {
				this.$el.style.border = borderColor ? `solid ${borderColor}` : 'none';
				this.$el.style.border = '1px 0';
			}
		}
	}

	/** Gets the stored X position of the middle of the toolbar based on the current window width */
	private getStoredXPosition() {
		const currentWindow = dom.getWindow(this.layoutService.activeContainer);
		const isMainWindow = currentWindow === mainWindow;
		const storedPercentage = isMainWindow
			? Number(this.storageService.get(DEBUG_TOOLBAR_POSITION_KEY, StorageScope.PROFILE))
			: this.auxWindowCoordinates.get(currentWindow)?.x;
		return storedPercentage !== undefined && !isNaN(storedPercentage) ? storedPercentage : 0.5;
	}

	private getStoredYPosition() {
		const currentWindow = dom.getWindow(this.layoutService.activeContainer);
		const isMainWindow = currentWindow === mainWindow;
		const storedY = isMainWindow
			? this.storageService.getNumber(DEBUG_TOOLBAR_Y_KEY, StorageScope.PROFILE)
			: this.auxWindowCoordinates.get(currentWindow)?.y;
		return storedY ?? this.yDefault;
	}

	private setCoordinates(x?: number, y?: number): void {
		if (!this.isVisible) {
			return;
		}

		x ??= this.getStoredXPosition();
		y ??= this.getStoredYPosition();

		const [yMin, yMax] = this.yRange;
		y = Math.max(yMin, Math.min(y, yMax));
		this.$el.style.setProperty('--x-position', `${x}`);
		this.$el.style.setProperty('--y-position', `${y}px`);
	}

	private get yDefault() {
		return this.layoutService.mainContainerOffset.top;
	}

	private _yRange: [number, number] | undefined;
	private get yRange(): [number, number] {
		if (!this._yRange) {
			const isTitleBarVisible = this.layoutService.isVisible(Parts.TITLEBAR_PART, dom.getWindow(this.layoutService.activeContainer));
			const yMin = isTitleBarVisible ? 0 : this.layoutService.mainContainerOffset.top;
			let yMax = 0;

			if (isTitleBarVisible) {
				if (this.configurationService.getValue(LayoutSettings.COMMAND_CENTER) === true) {
					yMax += 35;
				} else {
					yMax += 28;
				}
			}

			if (this.configurationService.getValue(LayoutSettings.EDITOR_TABS_MODE) !== EditorTabsMode.NONE) {
				yMax += 35;
			}
			this._yRange = [yMin, yMax];
		}
		return this._yRange;
	}

	private show(): void {
		if (this.isVisible) {
			this.setCoordinates();
			return;
		}
		if (!this.isBuilt) {
			this.isBuilt = true;
			this.doShowInActiveContainer();
		}

		this.isVisible = true;
		dom.show(this.$el);
		this.setCoordinates();
	}

	private doShowInActiveContainer(): void {
		this.layoutService.activeContainer.appendChild(this.$el);
		this.trackPixelRatioListener.value = PixelRatio.getInstance(dom.getWindow(this.$el)).onDidChange(
			() => this.setCoordinates()
		);
	}

	private hide(): void {
		this.isVisible = false;
		dom.hide(this.$el);
	}

	override dispose(): void {
		super.dispose();

		this.$el?.remove();
	}
}

export function createDisconnectMenuItemAction(action: MenuItemAction, disposables: DisposableStore, accessor: ServicesAccessor, options: IDropdownWithPrimaryActionViewItemOptions): IActionViewItem | undefined {
	const menuService = accessor.get(IMenuService);
	const contextKeyService = accessor.get(IContextKeyService);
	const instantiationService = accessor.get(IInstantiationService);

	const menu = menuService.getMenuActions(MenuId.DebugToolBarStop, contextKeyService, { shouldForwardArgs: true });
	const secondary = getFlatActionBarActions(menu);

	if (!secondary.length) {
		return undefined;
	}

	const dropdownAction = disposables.add(new Action('notebook.moreRunActions', localize('notebook.moreRunActionsLabel', "More..."), 'codicon-chevron-down', true));
	const item = instantiationService.createInstance(DropdownWithPrimaryActionViewItem,
		action as MenuItemAction,
		dropdownAction,
		secondary,
		'debug-stop-actions',
		options);
	return item;
}

// Debug toolbar

const debugViewTitleItems = new DisposableStore();
const registerDebugToolBarItem = (id: string, title: string | ICommandActionTitle, order: number, icon?: { light?: URI; dark?: URI } | ThemeIcon, when?: ContextKeyExpression, precondition?: ContextKeyExpression, alt?: ICommandAction) => {
	MenuRegistry.appendMenuItem(MenuId.DebugToolBar, {
		group: 'navigation',
		when,
		order,
		command: {
			id,
			title,
			icon,
			precondition
		},
		alt
	});

	// Register actions in debug viewlet when toolbar is docked
	debugViewTitleItems.add(MenuRegistry.appendMenuItem(MenuId.ViewContainerTitle, {
		group: 'navigation',
		when: ContextKeyExpr.and(when, ContextKeyExpr.equals('viewContainer', VIEWLET_ID), CONTEXT_DEBUG_STATE.notEqualsTo('inactive'), ContextKeyExpr.equals('config.debug.toolBarLocation', 'docked')),
		order,
		command: {
			id,
			title,
			icon,
			precondition
		}
	}));
};

markAsSingleton(MenuRegistry.onDidChangeMenu(e => {
	// In case the debug toolbar is docked we need to make sure that the docked toolbar has the up to date commands registered #115945
	if (e.has(MenuId.DebugToolBar)) {
		debugViewTitleItems.clear();
		const items = MenuRegistry.getMenuItems(MenuId.DebugToolBar);
		for (const i of items) {
			debugViewTitleItems.add(MenuRegistry.appendMenuItem(MenuId.ViewContainerTitle, {
				...i,
				when: ContextKeyExpr.and(i.when, ContextKeyExpr.equals('viewContainer', VIEWLET_ID), CONTEXT_DEBUG_STATE.notEqualsTo('inactive'), ContextKeyExpr.equals('config.debug.toolBarLocation', 'docked'))
			}));
		}
	}
}));


const CONTEXT_TOOLBAR_COMMAND_CENTER = ContextKeyExpr.equals('config.debug.toolBarLocation', 'commandCenter');

MenuRegistry.appendMenuItem(MenuId.CommandCenterCenter, {
	submenu: MenuId.DebugToolBar,
	title: 'Debug',
	icon: Codicon.debug,
	order: 1,
	when: ContextKeyExpr.and(CONTEXT_IN_DEBUG_MODE, CONTEXT_TOOLBAR_COMMAND_CENTER)
});

registerDebugToolBarItem(CONTINUE_ID, CONTINUE_LABEL, 10, icons.debugContinue, CONTEXT_DEBUG_STATE.isEqualTo('stopped'));
registerDebugToolBarItem(PAUSE_ID, PAUSE_LABEL, 10, icons.debugPause, CONTEXT_DEBUG_STATE.notEqualsTo('stopped'), ContextKeyExpr.and(CONTEXT_DEBUG_STATE.isEqualTo('running'), CONTEXT_FOCUSED_SESSION_IS_NO_DEBUG.toNegated()));
registerDebugToolBarItem(STOP_ID, STOP_LABEL, 70, icons.debugStop, CONTEXT_FOCUSED_SESSION_IS_ATTACH.toNegated(), undefined, { id: DISCONNECT_ID, title: DISCONNECT_LABEL, icon: icons.debugDisconnect, precondition: ContextKeyExpr.and(CONTEXT_FOCUSED_SESSION_IS_ATTACH.toNegated(), CONTEXT_TERMINATE_DEBUGGEE_SUPPORTED), });
registerDebugToolBarItem(DISCONNECT_ID, DISCONNECT_LABEL, 70, icons.debugDisconnect, CONTEXT_FOCUSED_SESSION_IS_ATTACH, undefined, { id: STOP_ID, title: STOP_LABEL, icon: icons.debugStop, precondition: ContextKeyExpr.and(CONTEXT_FOCUSED_SESSION_IS_ATTACH, CONTEXT_TERMINATE_DEBUGGEE_SUPPORTED), });
registerDebugToolBarItem(STEP_OVER_ID, STEP_OVER_LABEL, 20, icons.debugStepOver, undefined, CONTEXT_DEBUG_STATE.isEqualTo('stopped'));
registerDebugToolBarItem(STEP_INTO_ID, STEP_INTO_LABEL, 30, icons.debugStepInto, undefined, CONTEXT_DEBUG_STATE.isEqualTo('stopped'));
registerDebugToolBarItem(STEP_OUT_ID, STEP_OUT_LABEL, 40, icons.debugStepOut, undefined, CONTEXT_DEBUG_STATE.isEqualTo('stopped'));
registerDebugToolBarItem(RESTART_SESSION_ID, RESTART_LABEL, 60, icons.debugRestart);
registerDebugToolBarItem(STEP_BACK_ID, localize('stepBackDebug', "Step Back"), 50, icons.debugStepBack, CONTEXT_STEP_BACK_SUPPORTED, CONTEXT_DEBUG_STATE.isEqualTo('stopped'));
registerDebugToolBarItem(REVERSE_CONTINUE_ID, localize('reverseContinue', "Reverse"), 55, icons.debugReverseContinue, CONTEXT_STEP_BACK_SUPPORTED, CONTEXT_DEBUG_STATE.isEqualTo('stopped'));
registerDebugToolBarItem(FOCUS_SESSION_ID, FOCUS_SESSION_LABEL, 100, Codicon.listTree, ContextKeyExpr.and(CONTEXT_MULTI_SESSION_DEBUG, CONTEXT_TOOLBAR_COMMAND_CENTER.negate()));

MenuRegistry.appendMenuItem(MenuId.DebugToolBarStop, {
	group: 'navigation',
	when: ContextKeyExpr.and(CONTEXT_FOCUSED_SESSION_IS_ATTACH.toNegated(), CONTEXT_TERMINATE_DEBUGGEE_SUPPORTED),
	order: 0,
	command: {
		id: DISCONNECT_ID,
		title: DISCONNECT_LABEL,
		icon: icons.debugDisconnect
	}
});

MenuRegistry.appendMenuItem(MenuId.DebugToolBarStop, {
	group: 'navigation',
	when: ContextKeyExpr.and(CONTEXT_FOCUSED_SESSION_IS_ATTACH, CONTEXT_TERMINATE_DEBUGGEE_SUPPORTED),
	order: 0,
	command: {
		id: STOP_ID,
		title: STOP_LABEL,
		icon: icons.debugStop
	}
});

MenuRegistry.appendMenuItem(MenuId.DebugToolBarStop, {
	group: 'navigation',
	when: ContextKeyExpr.or(
		ContextKeyExpr.and(CONTEXT_FOCUSED_SESSION_IS_ATTACH.toNegated(), CONTEXT_SUSPEND_DEBUGGEE_SUPPORTED, CONTEXT_TERMINATE_DEBUGGEE_SUPPORTED),
		ContextKeyExpr.and(CONTEXT_FOCUSED_SESSION_IS_ATTACH, CONTEXT_SUSPEND_DEBUGGEE_SUPPORTED),
	),
	order: 0,
	command: {
		id: DISCONNECT_AND_SUSPEND_ID,
		title: DISCONNECT_AND_SUSPEND_LABEL,
		icon: icons.debugDisconnect
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/debugViewlet.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugViewlet.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IActionViewItem } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { IAction } from '../../../../base/common/actions.js';
import { DisposableStore, dispose, IDisposable } from '../../../../base/common/lifecycle.js';
import './media/debugViewlet.css';
import * as nls from '../../../../nls.js';
import { createActionViewItem } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { Action2, MenuId, MenuItemAction, MenuRegistry, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService, IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IProgressService } from '../../../../platform/progress/common/progress.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { ViewPane } from '../../../browser/parts/views/viewPane.js';
import { ViewPaneContainer, ViewsSubMenu } from '../../../browser/parts/views/viewPaneContainer.js';
import { WorkbenchStateContext } from '../../../common/contextkeys.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { FocusSessionActionViewItem, StartDebugActionViewItem } from './debugActionViewItems.js';
import { DEBUG_CONFIGURE_COMMAND_ID, DEBUG_CONFIGURE_LABEL, DEBUG_START_COMMAND_ID, DEBUG_START_LABEL, DISCONNECT_ID, FOCUS_SESSION_ID, SELECT_AND_START_ID, STOP_ID } from './debugCommands.js';
import { debugConfigure } from './debugIcons.js';
import { createDisconnectMenuItemAction } from './debugToolBar.js';
import { WelcomeView } from './welcomeView.js';
import { BREAKPOINTS_VIEW_ID, CONTEXT_DEBUGGERS_AVAILABLE, CONTEXT_DEBUG_STATE, CONTEXT_DEBUG_UX, CONTEXT_DEBUG_UX_KEY, getStateLabel, IDebugService, ILaunch, REPL_VIEW_ID, State, VIEWLET_ID, EDITOR_CONTRIBUTION_ID, IDebugEditorContribution } from '../common/debug.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IWorkbenchLayoutService } from '../../../services/layout/browser/layoutService.js';
import { IBaseActionViewItemOptions } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { ILogService } from '../../../../platform/log/common/log.js';

export class DebugViewPaneContainer extends ViewPaneContainer {

	private startDebugActionViewItem: StartDebugActionViewItem | undefined;
	private progressResolve: (() => void) | undefined;
	private breakpointView: ViewPane | undefined;
	private paneListeners = new Map<string, IDisposable>();

	private readonly stopActionViewItemDisposables = this._register(new DisposableStore());

	constructor(
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IProgressService private readonly progressService: IProgressService,
		@IDebugService private readonly debugService: IDebugService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IWorkspaceContextService contextService: IWorkspaceContextService,
		@IStorageService storageService: IStorageService,
		@IThemeService themeService: IThemeService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IExtensionService extensionService: IExtensionService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextViewService private readonly contextViewService: IContextViewService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@ILogService logService: ILogService,
	) {
		super(VIEWLET_ID, { mergeViewWithContainerWhenSingleView: true }, instantiationService, configurationService, layoutService, contextMenuService, telemetryService, extensionService, themeService, storageService, contextService, viewDescriptorService, logService);

		// When there are potential updates to the docked debug toolbar we need to update it
		this._register(this.debugService.onDidChangeState(state => this.onDebugServiceStateChange(state)));

		this._register(this.contextKeyService.onDidChangeContext(e => {
			if (e.affectsSome(new Set([CONTEXT_DEBUG_UX_KEY, 'inDebugMode']))) {
				this.updateTitleArea();
			}
		}));

		this._register(this.contextService.onDidChangeWorkbenchState(() => this.updateTitleArea()));
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('debug.toolBarLocation') || e.affectsConfiguration('debug.hideLauncherWhileDebugging')) {
				this.updateTitleArea();
			}
		}));
	}

	override create(parent: HTMLElement): void {
		super.create(parent);
		parent.classList.add('debug-viewlet');
	}

	override focus(): void {
		super.focus();

		if (this.startDebugActionViewItem) {
			this.startDebugActionViewItem.focus();
		} else {
			this.focusView(WelcomeView.ID);
		}
	}

	override getActionViewItem(action: IAction, options: IBaseActionViewItemOptions): IActionViewItem | undefined {
		if (action.id === DEBUG_START_COMMAND_ID) {
			this.startDebugActionViewItem = this.instantiationService.createInstance(StartDebugActionViewItem, null, action, options);
			return this.startDebugActionViewItem;
		}
		if (action.id === FOCUS_SESSION_ID) {
			return new FocusSessionActionViewItem(action, undefined, this.debugService, this.contextViewService, this.configurationService);
		}

		if (action.id === STOP_ID || action.id === DISCONNECT_ID) {
			this.stopActionViewItemDisposables.clear();
			const item = this.instantiationService.invokeFunction(accessor => createDisconnectMenuItemAction(action as MenuItemAction, this.stopActionViewItemDisposables, accessor, { hoverDelegate: options.hoverDelegate }));
			if (item) {
				return item;
			}
		}

		return createActionViewItem(this.instantiationService, action, options);
	}

	focusView(id: string): void {
		const view = this.getView(id);
		if (view) {
			view.focus();
		}
	}

	private onDebugServiceStateChange(state: State): void {
		if (this.progressResolve) {
			this.progressResolve();
			this.progressResolve = undefined;
		}

		if (state === State.Initializing) {
			this.progressService.withProgress({ location: VIEWLET_ID, }, _progress => {
				return new Promise<void>(resolve => this.progressResolve = resolve);
			});
		}
	}

	override addPanes(panes: { pane: ViewPane; size: number; index?: number; disposable: IDisposable }[]): void {
		super.addPanes(panes);

		for (const { pane: pane } of panes) {
			// attach event listener to
			if (pane.id === BREAKPOINTS_VIEW_ID) {
				this.breakpointView = pane;
				this.updateBreakpointsMaxSize();
			} else {
				this.paneListeners.set(pane.id, pane.onDidChange(() => this.updateBreakpointsMaxSize()));
			}
		}
	}

	override removePanes(panes: ViewPane[]): void {
		super.removePanes(panes);
		for (const pane of panes) {
			dispose(this.paneListeners.get(pane.id));
			this.paneListeners.delete(pane.id);
		}
	}

	private updateBreakpointsMaxSize(): void {
		if (this.breakpointView) {
			// We need to update the breakpoints view since all other views are collapsed #25384
			const allOtherCollapsed = this.panes.every(view => !view.isExpanded() || view === this.breakpointView);
			this.breakpointView.maximumBodySize = allOtherCollapsed ? Number.POSITIVE_INFINITY : this.breakpointView.minimumBodySize;
		}
	}
}

MenuRegistry.appendMenuItem(MenuId.ViewContainerTitle, {
	when: ContextKeyExpr.and(
		ContextKeyExpr.equals('viewContainer', VIEWLET_ID),
		CONTEXT_DEBUG_UX.notEqualsTo('simple'),
		WorkbenchStateContext.notEqualsTo('empty'),
		ContextKeyExpr.or(
			CONTEXT_DEBUG_STATE.isEqualTo('inactive'),
			ContextKeyExpr.notEquals('config.debug.toolBarLocation', 'docked')
		),
		ContextKeyExpr.or(
			ContextKeyExpr.not('config.debug.hideLauncherWhileDebugging'),
			ContextKeyExpr.not('inDebugMode')
		)
	),
	order: 10,
	group: 'navigation',
	command: {
		precondition: CONTEXT_DEBUG_STATE.notEqualsTo(getStateLabel(State.Initializing)),
		id: DEBUG_START_COMMAND_ID,
		title: DEBUG_START_LABEL
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: DEBUG_CONFIGURE_COMMAND_ID,
			title: {
				value: DEBUG_CONFIGURE_LABEL,
				original: 'Open \'launch.json\'',
				mnemonicTitle: nls.localize({ key: 'miOpenConfigurations', comment: ['&& denotes a mnemonic'] }, "Open &&Configurations")
			},
			metadata: {
				description: nls.localize2('openLaunchConfigDescription', 'Opens the file used to configure how your program is debugged')
			},
			f1: true,
			icon: debugConfigure,
			precondition: CONTEXT_DEBUG_UX.notEqualsTo('simple'),
			menu: [{
				id: MenuId.ViewContainerTitle,
				group: 'navigation',
				order: 20,
				when: ContextKeyExpr.and(ContextKeyExpr.equals('viewContainer', VIEWLET_ID), CONTEXT_DEBUG_UX.notEqualsTo('simple'), WorkbenchStateContext.notEqualsTo('empty'),
					ContextKeyExpr.or(CONTEXT_DEBUG_STATE.isEqualTo('inactive'), ContextKeyExpr.notEquals('config.debug.toolBarLocation', 'docked')))
			}, {
				id: MenuId.ViewContainerTitle,
				order: 20,
				// Show in debug viewlet secondary actions when debugging and debug toolbar is docked
				when: ContextKeyExpr.and(ContextKeyExpr.equals('viewContainer', VIEWLET_ID), CONTEXT_DEBUG_STATE.notEqualsTo('inactive'), ContextKeyExpr.equals('config.debug.toolBarLocation', 'docked'))
			}, {
				id: MenuId.MenubarDebugMenu,
				group: '2_configuration',
				order: 1,
				when: CONTEXT_DEBUGGERS_AVAILABLE
			}]
		});
	}

	async run(accessor: ServicesAccessor, opts?: { addNew?: boolean }): Promise<void> {
		const debugService = accessor.get(IDebugService);
		const quickInputService = accessor.get(IQuickInputService);
		const configurationManager = debugService.getConfigurationManager();
		let launch: ILaunch | undefined;
		if (configurationManager.selectedConfiguration.name) {
			launch = configurationManager.selectedConfiguration.launch;
		} else {
			const launches = configurationManager.getLaunches().filter(l => !l.hidden);
			if (launches.length === 1) {
				launch = launches[0];
			} else {
				const picks = launches.map(l => ({ label: l.name, launch: l }));
				const picked = await quickInputService.pick<{ label: string; launch: ILaunch }>(picks, {
					activeItem: picks[0],
					placeHolder: nls.localize({ key: 'selectWorkspaceFolder', comment: ['User picks a workspace folder or a workspace configuration file here. Workspace configuration files can contain settings and thus a launch.json configuration can be written into one.'] }, "Select a workspace folder to create a launch.json file in or add it to the workspace config file")
				});
				if (picked) {
					launch = picked.launch;
				}
			}
		}

		if (launch) {
			const { editor } = await launch.openConfigFile({ preserveFocus: false });
			if (editor && opts?.addNew) {
				const codeEditor = <ICodeEditor>editor.getControl();
				if (codeEditor) {
					await codeEditor.getContribution<IDebugEditorContribution>(EDITOR_CONTRIBUTION_ID)?.addLaunchConfiguration();
				}
			}
		}
	}
});


registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'debug.toggleReplIgnoreFocus',
			title: nls.localize('debugPanel', "Debug Console"),
			toggled: ContextKeyExpr.has(`view.${REPL_VIEW_ID}.visible`),
			menu: [{
				id: ViewsSubMenu,
				group: '3_toggleRepl',
				order: 30,
				when: ContextKeyExpr.and(ContextKeyExpr.equals('viewContainer', VIEWLET_ID))
			}]
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const viewsService = accessor.get(IViewsService);
		if (viewsService.isViewVisible(REPL_VIEW_ID)) {
			viewsService.closeView(REPL_VIEW_ID);
		} else {
			await viewsService.openView(REPL_VIEW_ID);
		}
	}
});

MenuRegistry.appendMenuItem(MenuId.ViewContainerTitle, {
	when: ContextKeyExpr.and(
		ContextKeyExpr.equals('viewContainer', VIEWLET_ID),
		CONTEXT_DEBUG_STATE.notEqualsTo('inactive'),
		ContextKeyExpr.or(
			ContextKeyExpr.equals('config.debug.toolBarLocation', 'docked'),
			ContextKeyExpr.has('config.debug.hideLauncherWhileDebugging')
		)
	),
	order: 10,
	command: {
		id: SELECT_AND_START_ID,
		title: nls.localize('startAdditionalSession', "Start Additional Session"),
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/disassemblyView.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/disassemblyView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { PixelRatio } from '../../../../base/browser/pixelRatio.js';
import { $, Dimension, addStandardDisposableListener, append } from '../../../../base/browser/dom.js';
import { IListAccessibilityProvider } from '../../../../base/browser/ui/list/listWidget.js';
import { ITableContextMenuEvent, ITableRenderer, ITableVirtualDelegate } from '../../../../base/browser/ui/table/table.js';
import { binarySearch2 } from '../../../../base/common/arrays.js';
import { Color } from '../../../../base/common/color.js';
import { Emitter } from '../../../../base/common/event.js';
import { Disposable, IDisposable, dispose } from '../../../../base/common/lifecycle.js';
import { isAbsolute } from '../../../../base/common/path.js';
import { Constants } from '../../../../base/common/uint.js';
import { URI } from '../../../../base/common/uri.js';
import { applyFontInfo } from '../../../../editor/browser/config/domFontInfo.js';
import { isCodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { BareFontInfo } from '../../../../editor/common/config/fontInfo.js';
import { createBareFontInfoFromRawSettings } from '../../../../editor/common/config/fontInfoFromSettings.js';
import { IRange, Range } from '../../../../editor/common/core/range.js';
import { StringBuilder } from '../../../../editor/common/core/stringBuilder.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { TextEditorSelectionRevealType } from '../../../../platform/editor/common/editor.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { WorkbenchTable } from '../../../../platform/list/browser/listService.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { editorBackground } from '../../../../platform/theme/common/colorRegistry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { EditorPane } from '../../../browser/parts/editor/editorPane.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { focusedStackFrameColor, topStackFrameColor } from './callStackEditorContribution.js';
import * as icons from './debugIcons.js';
import { CONTEXT_LANGUAGE_SUPPORTS_DISASSEMBLE_REQUEST, DISASSEMBLY_VIEW_ID, IDebugConfiguration, IDebugService, IDebugSession, IInstructionBreakpoint, State } from '../common/debug.js';
import { InstructionBreakpoint } from '../common/debugModel.js';
import { getUriFromSource } from '../common/debugSource.js';
import { isUriString, sourcesEqual } from '../common/debugUtils.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IEditorGroup } from '../../../services/editor/common/editorGroupsService.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IMenu, IMenuService, MenuId } from '../../../../platform/actions/common/actions.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { COPY_ADDRESS_ID, COPY_ADDRESS_LABEL } from '../../../../workbench/contrib/debug/browser/debugCommands.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { getFlatContextMenuActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';

export interface IDisassembledInstructionEntry {
	allowBreakpoint: boolean;
	isBreakpointSet: boolean;
	isBreakpointEnabled: boolean;
	/** Instruction reference from the DA */
	instructionReference: string;
	/** Offset from the instructionReference that's the basis for the `instructionOffset` */
	instructionReferenceOffset: number;
	/** The number of instructions (+/-) away from the instructionReference and instructionReferenceOffset this instruction lies */
	instructionOffset: number;
	/** Whether this is the first instruction on the target line. */
	showSourceLocation?: boolean;
	/** Original instruction from the debugger */
	instruction: DebugProtocol.DisassembledInstruction;
	/** Parsed instruction address */
	address: bigint;
}

// Special entry as a placeholer when disassembly is not available
const disassemblyNotAvailable: IDisassembledInstructionEntry = {
	allowBreakpoint: false,
	isBreakpointSet: false,
	isBreakpointEnabled: false,
	instructionReference: '',
	instructionOffset: 0,
	instructionReferenceOffset: 0,
	address: 0n,
	instruction: {
		address: '-1',
		instruction: localize('instructionNotAvailable', "Disassembly not available.")
	},
};

export class DisassemblyView extends EditorPane {

	private static readonly NUM_INSTRUCTIONS_TO_LOAD = 50;

	// Used in instruction renderer
	private _fontInfo: BareFontInfo | undefined;
	private _disassembledInstructions: WorkbenchTable<IDisassembledInstructionEntry> | undefined;
	private _onDidChangeStackFrame: Emitter<void>;
	private _previousDebuggingState: State;
	private _instructionBpList: readonly IInstructionBreakpoint[] = [];
	private _enableSourceCodeRender: boolean = true;
	private _loadingLock: boolean = false;
	private readonly _referenceToMemoryAddress = new Map<string, bigint>();
	private menu: IMenu;

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IDebugService private readonly _debugService: IDebugService,
		@IContextMenuService private readonly _contextMenuService: IContextMenuService,
		@IMenuService menuService: IMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {
		super(DISASSEMBLY_VIEW_ID, group, telemetryService, themeService, storageService);

		this.menu = menuService.createMenu(MenuId.DebugDisassemblyContext, contextKeyService);
		this._register(this.menu);
		this._disassembledInstructions = undefined;
		this._onDidChangeStackFrame = this._register(new Emitter<void>({ leakWarningThreshold: 1000 }));
		this._previousDebuggingState = _debugService.state;
		this._register(_configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('debug')) {
				// show/hide source code requires changing height which WorkbenchTable doesn't support dynamic height, thus force a total reload.
				const newValue = this._configurationService.getValue<IDebugConfiguration>('debug').disassemblyView.showSourceCode;
				if (this._enableSourceCodeRender !== newValue) {
					this._enableSourceCodeRender = newValue;
					// todo: trigger rerender
				} else {
					this._disassembledInstructions?.rerender();
				}
			}
		}));
	}

	get fontInfo() {
		if (!this._fontInfo) {
			this._fontInfo = this.createFontInfo();

			this._register(this._configurationService.onDidChangeConfiguration(e => {
				if (e.affectsConfiguration('editor')) {
					this._fontInfo = this.createFontInfo();
				}
			}));
		}

		return this._fontInfo;
	}

	private createFontInfo() {
		return createBareFontInfoFromRawSettings(this._configurationService.getValue('editor'), PixelRatio.getInstance(this.window).value);
	}

	get currentInstructionAddresses() {
		return this._debugService.getModel().getSessions(false).
			map(session => session.getAllThreads()).
			reduce((prev, curr) => prev.concat(curr), []).
			map(thread => thread.getTopStackFrame()).
			map(frame => frame?.instructionPointerReference).
			map(ref => ref ? this.getReferenceAddress(ref) : undefined);
	}

	// Instruction reference of the top stack frame of the focused stack
	get focusedCurrentInstructionReference() {
		return this._debugService.getViewModel().focusedStackFrame?.thread.getTopStackFrame()?.instructionPointerReference;
	}

	get focusedCurrentInstructionAddress() {
		const ref = this.focusedCurrentInstructionReference;
		return ref ? this.getReferenceAddress(ref) : undefined;
	}

	get focusedInstructionReference() {
		return this._debugService.getViewModel().focusedStackFrame?.instructionPointerReference;
	}

	get focusedInstructionAddress() {
		const ref = this.focusedInstructionReference;
		return ref ? this.getReferenceAddress(ref) : undefined;
	}

	get isSourceCodeRender() { return this._enableSourceCodeRender; }

	get debugSession(): IDebugSession | undefined {
		return this._debugService.getViewModel().focusedSession;
	}

	get onDidChangeStackFrame() { return this._onDidChangeStackFrame.event; }

	get focusedAddressAndOffset() {
		const element = this._disassembledInstructions?.getFocusedElements()[0];
		if (!element) {
			return undefined;
		}

		return this.getAddressAndOffset(element);
	}

	getAddressAndOffset(element: IDisassembledInstructionEntry) {
		const reference = element.instructionReference;
		const offset = Number(element.address - this.getReferenceAddress(reference)!);
		return { reference, offset, address: element.address };
	}

	protected createEditor(parent: HTMLElement): void {
		this._enableSourceCodeRender = this._configurationService.getValue<IDebugConfiguration>('debug').disassemblyView.showSourceCode;
		const lineHeight = this.fontInfo.lineHeight;
		const thisOM = this;
		const delegate = new class implements ITableVirtualDelegate<IDisassembledInstructionEntry> {
			headerRowHeight: number = 0; // No header
			getHeight(row: IDisassembledInstructionEntry): number {
				if (thisOM.isSourceCodeRender && row.showSourceLocation && row.instruction.location?.path && row.instruction.line) {
					// instruction line + source lines
					if (row.instruction.endLine) {
						return lineHeight * Math.max(2, (row.instruction.endLine - row.instruction.line + 2));
					} else {
						// source is only a single line.
						return lineHeight * 2;
					}
				}

				// just instruction line
				return lineHeight;
			}
		};

		const instructionRenderer = this._register(this._instantiationService.createInstance(InstructionRenderer, this));

		this._disassembledInstructions = this._register(this._instantiationService.createInstance(WorkbenchTable,
			'DisassemblyView', parent, delegate,
			[
				{
					label: '',
					tooltip: '',
					weight: 0,
					minimumWidth: this.fontInfo.lineHeight,
					maximumWidth: this.fontInfo.lineHeight,
					templateId: BreakpointRenderer.TEMPLATE_ID,
					project(row: IDisassembledInstructionEntry): IDisassembledInstructionEntry { return row; }
				},
				{
					label: localize('disassemblyTableColumnLabel', "instructions"),
					tooltip: '',
					weight: 0.3,
					templateId: InstructionRenderer.TEMPLATE_ID,
					project(row: IDisassembledInstructionEntry): IDisassembledInstructionEntry { return row; }
				},
			],
			[
				this._instantiationService.createInstance(BreakpointRenderer, this),
				instructionRenderer,
			],
			{
				identityProvider: { getId: (e: IDisassembledInstructionEntry) => e.instruction.address },
				horizontalScrolling: false,
				overrideStyles: {
					listBackground: editorBackground
				},
				multipleSelectionSupport: false,
				setRowLineHeight: false,
				openOnSingleClick: false,
				accessibilityProvider: new AccessibilityProvider(),
				mouseSupport: false
			}
		)) as WorkbenchTable<IDisassembledInstructionEntry>;

		this._disassembledInstructions.domNode.classList.add('disassembly-view');

		if (this.focusedInstructionReference) {
			this.reloadDisassembly(this.focusedInstructionReference, 0);
		}

		this._register(this._disassembledInstructions.onDidScroll(e => {
			if (this._disassembledInstructions?.row(0) === disassemblyNotAvailable) {
				return;
			}
			if (this._loadingLock) {
				return;
			}

			if (e.oldScrollTop > e.scrollTop && e.scrollTop < e.height) {
				this._loadingLock = true;
				const prevTop = Math.floor(e.scrollTop / this.fontInfo.lineHeight);
				this.scrollUp_LoadDisassembledInstructions(DisassemblyView.NUM_INSTRUCTIONS_TO_LOAD).then((loaded) => {
					if (loaded > 0) {
						this._disassembledInstructions!.reveal(prevTop + loaded, 0);
					}
				}).finally(() => { this._loadingLock = false; });
			} else if (e.oldScrollTop < e.scrollTop && e.scrollTop + e.height > e.scrollHeight - e.height) {
				this._loadingLock = true;
				this.scrollDown_LoadDisassembledInstructions(DisassemblyView.NUM_INSTRUCTIONS_TO_LOAD).finally(() => { this._loadingLock = false; });
			}
		}));

		this._register(this._disassembledInstructions.onContextMenu(e => this.onContextMenu(e)));

		this._register(this._debugService.getViewModel().onDidFocusStackFrame(({ stackFrame }) => {
			if (this._disassembledInstructions && stackFrame?.instructionPointerReference) {
				this.goToInstructionAndOffset(stackFrame.instructionPointerReference, 0);
			}
			this._onDidChangeStackFrame.fire();
		}));

		// refresh breakpoints view
		this._register(this._debugService.getModel().onDidChangeBreakpoints(bpEvent => {
			if (bpEvent && this._disassembledInstructions) {
				// draw viewable BP
				let changed = false;
				bpEvent.added?.forEach((bp) => {
					if (bp instanceof InstructionBreakpoint) {
						const index = this.getIndexFromReferenceAndOffset(bp.instructionReference, bp.offset);
						if (index >= 0) {
							this._disassembledInstructions!.row(index).isBreakpointSet = true;
							this._disassembledInstructions!.row(index).isBreakpointEnabled = bp.enabled;
							changed = true;
						}
					}
				});

				bpEvent.removed?.forEach((bp) => {
					if (bp instanceof InstructionBreakpoint) {
						const index = this.getIndexFromReferenceAndOffset(bp.instructionReference, bp.offset);
						if (index >= 0) {
							this._disassembledInstructions!.row(index).isBreakpointSet = false;
							changed = true;
						}
					}
				});

				bpEvent.changed?.forEach((bp) => {
					if (bp instanceof InstructionBreakpoint) {
						const index = this.getIndexFromReferenceAndOffset(bp.instructionReference, bp.offset);
						if (index >= 0) {
							if (this._disassembledInstructions!.row(index).isBreakpointEnabled !== bp.enabled) {
								this._disassembledInstructions!.row(index).isBreakpointEnabled = bp.enabled;
								changed = true;
							}
						}
					}
				});

				// get an updated list so that items beyond the current range would render when reached.
				this._instructionBpList = this._debugService.getModel().getInstructionBreakpoints();

				// breakpoints restored from a previous session can be based on memory
				// references that may no longer exist in the current session. Request
				// those instructions to be loaded so the BP can be displayed.
				for (const bp of this._instructionBpList) {
					this.primeMemoryReference(bp.instructionReference);
				}

				if (changed) {
					this._onDidChangeStackFrame.fire();
				}
			}
		}));

		this._register(this._debugService.onDidChangeState(e => {
			if ((e === State.Running || e === State.Stopped) &&
				(this._previousDebuggingState !== State.Running && this._previousDebuggingState !== State.Stopped)) {
				// Just started debugging, clear the view
				this.clear();
				this._enableSourceCodeRender = this._configurationService.getValue<IDebugConfiguration>('debug').disassemblyView.showSourceCode;
			}

			this._previousDebuggingState = e;
			this._onDidChangeStackFrame.fire();
		}));
	}

	layout(dimension: Dimension): void {
		this._disassembledInstructions?.layout(dimension.height);
	}

	async goToInstructionAndOffset(instructionReference: string, offset: number, focus?: boolean) {
		let addr = this._referenceToMemoryAddress.get(instructionReference);
		if (addr === undefined) {
			await this.loadDisassembledInstructions(instructionReference, 0, -DisassemblyView.NUM_INSTRUCTIONS_TO_LOAD, DisassemblyView.NUM_INSTRUCTIONS_TO_LOAD * 2);
			addr = this._referenceToMemoryAddress.get(instructionReference);
		}

		if (addr) {
			this.goToAddress(addr + BigInt(offset), focus);
		}
	}

	/** Gets the address associated with the instruction reference. */
	getReferenceAddress(instructionReference: string) {
		return this._referenceToMemoryAddress.get(instructionReference);
	}

	/**
	 * Go to the address provided. If no address is provided, reveal the address of the currently focused stack frame. Returns false if that address is not available.
	 */
	private goToAddress(address: bigint, focus?: boolean): boolean {
		if (!this._disassembledInstructions) {
			return false;
		}

		if (!address) {
			return false;
		}

		const index = this.getIndexFromAddress(address);
		if (index >= 0) {
			this._disassembledInstructions.reveal(index);

			if (focus) {
				this._disassembledInstructions.domFocus();
				this._disassembledInstructions.setFocus([index]);
			}
			return true;
		}

		return false;
	}

	private async scrollUp_LoadDisassembledInstructions(instructionCount: number): Promise<number> {
		const first = this._disassembledInstructions?.row(0);
		if (first) {
			return this.loadDisassembledInstructions(
				first.instructionReference,
				first.instructionReferenceOffset,
				first.instructionOffset - instructionCount,
				instructionCount,
			);
		}

		return 0;
	}

	private async scrollDown_LoadDisassembledInstructions(instructionCount: number): Promise<number> {
		const last = this._disassembledInstructions?.row(this._disassembledInstructions?.length - 1);
		if (last) {
			return this.loadDisassembledInstructions(
				last.instructionReference,
				last.instructionReferenceOffset,
				last.instructionOffset + 1,
				instructionCount,
			);
		}

		return 0;
	}

	/**
	 * Sets the memory reference address. We don't just loadDisassembledInstructions
	 * for this, since we can't really deal with discontiguous ranges (we can't
	 * detect _if_ a range is discontiguous since we don't know how much memory
	 * comes between instructions.)
	 */
	private async primeMemoryReference(instructionReference: string) {
		if (this._referenceToMemoryAddress.has(instructionReference)) {
			return true;
		}

		const s = await this.debugSession?.disassemble(instructionReference, 0, 0, 1);
		if (s && s.length > 0) {
			try {
				this._referenceToMemoryAddress.set(instructionReference, BigInt(s[0].address));
				return true;
			} catch {
				return false;
			}
		}

		return false;
	}

	/** Loads disasembled instructions. Returns the number of instructions that were loaded. */
	private async loadDisassembledInstructions(instructionReference: string, offset: number, instructionOffset: number, instructionCount: number): Promise<number> {
		const session = this.debugSession;
		const resultEntries = await session?.disassemble(instructionReference, offset, instructionOffset, instructionCount);

		// Ensure we always load the baseline instructions so we know what address the instructionReference refers to.
		if (!this._referenceToMemoryAddress.has(instructionReference) && instructionOffset !== 0) {
			await this.loadDisassembledInstructions(instructionReference, 0, 0, DisassemblyView.NUM_INSTRUCTIONS_TO_LOAD);
		}

		if (session && resultEntries && this._disassembledInstructions) {
			const newEntries: IDisassembledInstructionEntry[] = [];

			let lastLocation: DebugProtocol.Source | undefined;
			let lastLine: IRange | undefined;
			for (let i = 0; i < resultEntries.length; i++) {
				const instruction = resultEntries[i];
				const thisInstructionOffset = instructionOffset + i;

				// Forward fill the missing location as detailed in the DAP spec.
				if (instruction.location) {
					lastLocation = instruction.location;
					lastLine = undefined;
				}

				if (instruction.line) {
					const currentLine: IRange = {
						startLineNumber: instruction.line,
						startColumn: instruction.column ?? 0,
						endLineNumber: instruction.endLine ?? instruction.line,
						endColumn: instruction.endColumn ?? 0,
					};

					// Add location only to the first unique range. This will give the appearance of grouping of instructions.
					if (!Range.equalsRange(currentLine, lastLine ?? null)) {
						lastLine = currentLine;
						instruction.location = lastLocation;
					}
				}

				let address: bigint;
				try {
					address = BigInt(instruction.address);
				} catch {
					console.error(`Could not parse disassembly address ${instruction.address} (in ${JSON.stringify(instruction)})`);
					continue;
				}

				if (address === -1n) {
					// Ignore invalid instructions returned by the adapter.
					continue;
				}

				const entry: IDisassembledInstructionEntry = {
					allowBreakpoint: true,
					isBreakpointSet: false,
					isBreakpointEnabled: false,
					instructionReference,
					instructionReferenceOffset: offset,
					instructionOffset: thisInstructionOffset,
					instruction,
					address,
				};

				newEntries.push(entry);

				// if we just loaded the first instruction for this reference, mark its address.
				if (offset === 0 && thisInstructionOffset === 0) {
					this._referenceToMemoryAddress.set(instructionReference, address);
				}
			}

			if (newEntries.length === 0) {
				return 0;
			}

			const refBaseAddress = this._referenceToMemoryAddress.get(instructionReference);
			const bps = this._instructionBpList.map(p => {
				const base = this._referenceToMemoryAddress.get(p.instructionReference);
				if (!base) {
					return undefined;
				}
				return {
					enabled: p.enabled,
					address: base + BigInt(p.offset || 0),
				};
			});

			if (refBaseAddress !== undefined) {
				for (const entry of newEntries) {
					const bp = bps.find(p => p?.address === entry.address);
					if (bp) {
						entry.isBreakpointSet = true;
						entry.isBreakpointEnabled = bp.enabled;
					}
				}
			}

			const da = this._disassembledInstructions;
			if (da.length === 1 && this._disassembledInstructions.row(0) === disassemblyNotAvailable) {
				da.splice(0, 1);
			}

			const firstAddr = newEntries[0].address;
			const lastAddr = newEntries[newEntries.length - 1].address;

			const startN = binarySearch2(da.length, i => Number(da.row(i).address - firstAddr));
			const start = startN < 0 ? ~startN : startN;
			const endN = binarySearch2(da.length, i => Number(da.row(i).address - lastAddr));
			const end = endN < 0 ? ~endN : endN + 1;
			const toDelete = end - start;

			// Go through everything we're about to add, and only show the source
			// location if it's different from the previous one, "grouping" instructions by line
			let lastLocated: undefined | DebugProtocol.DisassembledInstruction;
			for (let i = start - 1; i >= 0; i--) {
				const { instruction } = da.row(i);
				if (instruction.location && instruction.line !== undefined) {
					lastLocated = instruction;
					break;
				}
			}

			const shouldShowLocation = (instruction: DebugProtocol.DisassembledInstruction) =>
				instruction.line !== undefined && instruction.location !== undefined &&
				(!lastLocated || !sourcesEqual(instruction.location, lastLocated.location) || instruction.line !== lastLocated.line);

			for (const entry of newEntries) {
				if (shouldShowLocation(entry.instruction)) {
					entry.showSourceLocation = true;
					lastLocated = entry.instruction;
				}
			}

			da.splice(start, toDelete, newEntries);

			return newEntries.length - toDelete;
		}

		return 0;
	}

	private getIndexFromReferenceAndOffset(instructionReference: string, offset: number): number {
		const addr = this._referenceToMemoryAddress.get(instructionReference);
		if (addr === undefined) {
			return -1;
		}

		return this.getIndexFromAddress(addr + BigInt(offset));
	}

	private getIndexFromAddress(address: bigint): number {
		const disassembledInstructions = this._disassembledInstructions;
		if (disassembledInstructions && disassembledInstructions.length > 0) {
			return binarySearch2(disassembledInstructions.length, index => {
				const row = disassembledInstructions.row(index);
				return Number(row.address - address);
			});
		}

		return -1;
	}

	/**
	 * Clears the table and reload instructions near the target address
	 */
	private reloadDisassembly(instructionReference: string, offset: number) {
		if (!this._disassembledInstructions) {
			return;
		}

		this._loadingLock = true; // stop scrolling during the load.
		this.clear();
		this._instructionBpList = this._debugService.getModel().getInstructionBreakpoints();
		this.loadDisassembledInstructions(instructionReference, offset, -DisassemblyView.NUM_INSTRUCTIONS_TO_LOAD * 4, DisassemblyView.NUM_INSTRUCTIONS_TO_LOAD * 8).then(() => {
			// on load, set the target instruction in the middle of the page.
			if (this._disassembledInstructions!.length > 0) {
				const targetIndex = Math.floor(this._disassembledInstructions!.length / 2);
				this._disassembledInstructions!.reveal(targetIndex, 0.5);

				// Always focus the target address on reload, or arrow key navigation would look terrible
				this._disassembledInstructions!.domFocus();
				this._disassembledInstructions!.setFocus([targetIndex]);
			}
			this._loadingLock = false;
		});
	}

	private clear() {
		this._referenceToMemoryAddress.clear();
		this._disassembledInstructions?.splice(0, this._disassembledInstructions.length, [disassemblyNotAvailable]);
	}

	private onContextMenu(e: ITableContextMenuEvent<IDisassembledInstructionEntry>): void {
		const actions = getFlatContextMenuActions(this.menu.getActions({ shouldForwardArgs: true }));
		this._contextMenuService.showContextMenu({
			getAnchor: () => e.anchor,
			getActions: () => actions,
			getActionsContext: () => e.element
		});
	}
}

interface IBreakpointColumnTemplateData {
	currentElement: { element?: IDisassembledInstructionEntry };
	icon: HTMLElement;
	disposables: IDisposable[];
}

class BreakpointRenderer implements ITableRenderer<IDisassembledInstructionEntry, IBreakpointColumnTemplateData> {

	static readonly TEMPLATE_ID = 'breakpoint';

	templateId: string = BreakpointRenderer.TEMPLATE_ID;

	private readonly _breakpointIcon = 'codicon-' + icons.breakpoint.regular.id;
	private readonly _breakpointDisabledIcon = 'codicon-' + icons.breakpoint.disabled.id;
	private readonly _breakpointHintIcon = 'codicon-' + icons.debugBreakpointHint.id;
	private readonly _debugStackframe = 'codicon-' + icons.debugStackframe.id;
	private readonly _debugStackframeFocused = 'codicon-' + icons.debugStackframeFocused.id;

	constructor(
		private readonly _disassemblyView: DisassemblyView,
		@IDebugService private readonly _debugService: IDebugService
	) {
	}

	renderTemplate(container: HTMLElement): IBreakpointColumnTemplateData {
		// align from the bottom so that it lines up with instruction when source code is present.
		container.style.alignSelf = 'flex-end';

		const icon = append(container, $('.codicon'));
		icon.style.display = 'flex';
		icon.style.alignItems = 'center';
		icon.style.justifyContent = 'center';
		icon.style.height = this._disassemblyView.fontInfo.lineHeight + 'px';

		const currentElement: { element?: IDisassembledInstructionEntry } = { element: undefined };

		const disposables = [
			this._disassemblyView.onDidChangeStackFrame(() => this.rerenderDebugStackframe(icon, currentElement.element)),
			addStandardDisposableListener(container, 'mouseover', () => {
				if (currentElement.element?.allowBreakpoint) {
					icon.classList.add(this._breakpointHintIcon);
				}
			}),
			addStandardDisposableListener(container, 'mouseout', () => {
				if (currentElement.element?.allowBreakpoint) {
					icon.classList.remove(this._breakpointHintIcon);
				}
			}),
			addStandardDisposableListener(container, 'click', () => {
				if (currentElement.element?.allowBreakpoint) {
					// click show hint while waiting for BP to resolve.
					icon.classList.add(this._breakpointHintIcon);
					const reference = currentElement.element.instructionReference;
					const offset = Number(currentElement.element.address - this._disassemblyView.getReferenceAddress(reference)!);
					if (currentElement.element.isBreakpointSet) {
						this._debugService.removeInstructionBreakpoints(reference, offset);
					} else if (currentElement.element.allowBreakpoint && !currentElement.element.isBreakpointSet) {
						this._debugService.addInstructionBreakpoint({ instructionReference: reference, offset, address: currentElement.element.address, canPersist: false });
					}
				}
			})
		];

		return { currentElement, icon, disposables };
	}

	renderElement(element: IDisassembledInstructionEntry, index: number, templateData: IBreakpointColumnTemplateData): void {
		templateData.currentElement.element = element;
		this.rerenderDebugStackframe(templateData.icon, element);
	}

	disposeTemplate(templateData: IBreakpointColumnTemplateData): void {
		dispose(templateData.disposables);
		templateData.disposables = [];
	}

	private rerenderDebugStackframe(icon: HTMLElement, element?: IDisassembledInstructionEntry) {
		if (element?.address === this._disassemblyView.focusedCurrentInstructionAddress) {
			icon.classList.add(this._debugStackframe);
		} else if (element?.address === this._disassemblyView.focusedInstructionAddress) {
			icon.classList.add(this._debugStackframeFocused);
		} else {
			icon.classList.remove(this._debugStackframe);
			icon.classList.remove(this._debugStackframeFocused);
		}

		icon.classList.remove(this._breakpointHintIcon);

		if (element?.isBreakpointSet) {
			if (element.isBreakpointEnabled) {
				icon.classList.add(this._breakpointIcon);
				icon.classList.remove(this._breakpointDisabledIcon);
			} else {
				icon.classList.remove(this._breakpointIcon);
				icon.classList.add(this._breakpointDisabledIcon);
			}
		} else {
			icon.classList.remove(this._breakpointIcon);
			icon.classList.remove(this._breakpointDisabledIcon);
		}
	}
}

interface IInstructionColumnTemplateData {
	currentElement: { element?: IDisassembledInstructionEntry };
	// TODO: hover widget?
	instruction: HTMLElement;
	sourcecode: HTMLElement;
	// disposed when cell is closed.
	cellDisposable: IDisposable[];
	// disposed when template is closed.
	disposables: IDisposable[];
}

class InstructionRenderer extends Disposable implements ITableRenderer<IDisassembledInstructionEntry, IInstructionColumnTemplateData> {

	static readonly TEMPLATE_ID = 'instruction';

	private static readonly INSTRUCTION_ADDR_MIN_LENGTH = 25;
	private static readonly INSTRUCTION_BYTES_MIN_LENGTH = 30;

	templateId: string = InstructionRenderer.TEMPLATE_ID;

	private _topStackFrameColor: Color | undefined;
	private _focusedStackFrameColor: Color | undefined;

	constructor(
		private readonly _disassemblyView: DisassemblyView,
		@IThemeService themeService: IThemeService,
		@IEditorService private readonly editorService: IEditorService,
		@ITextModelService private readonly textModelService: ITextModelService,
		@IUriIdentityService private readonly uriService: IUriIdentityService,
		@ILogService private readonly logService: ILogService,
	) {
		super();

		this._topStackFrameColor = themeService.getColorTheme().getColor(topStackFrameColor);
		this._focusedStackFrameColor = themeService.getColorTheme().getColor(focusedStackFrameColor);

		this._register(themeService.onDidColorThemeChange(e => {
			this._topStackFrameColor = e.getColor(topStackFrameColor);
			this._focusedStackFrameColor = e.getColor(focusedStackFrameColor);
		}));
	}

	renderTemplate(container: HTMLElement): IInstructionColumnTemplateData {
		const sourcecode = append(container, $('.sourcecode'));
		const instruction = append(container, $('.instruction'));
		this.applyFontInfo(sourcecode);
		this.applyFontInfo(instruction);
		const currentElement: { element?: IDisassembledInstructionEntry } = { element: undefined };
		const cellDisposable: IDisposable[] = [];

		const disposables = [
			this._disassemblyView.onDidChangeStackFrame(() => this.rerenderBackground(instruction, sourcecode, currentElement.element)),
			addStandardDisposableListener(sourcecode, 'dblclick', () => this.openSourceCode(currentElement.element?.instruction)),
		];

		return { currentElement, instruction, sourcecode, cellDisposable, disposables };
	}

	renderElement(element: IDisassembledInstructionEntry, index: number, templateData: IInstructionColumnTemplateData): void {
		this.renderElementInner(element, index, templateData);
	}

	private async renderElementInner(element: IDisassembledInstructionEntry, index: number, templateData: IInstructionColumnTemplateData): Promise<void> {
		templateData.currentElement.element = element;
		const instruction = element.instruction;
		templateData.sourcecode.innerText = '';
		const sb = new StringBuilder(1000);

		if (this._disassemblyView.isSourceCodeRender && element.showSourceLocation && instruction.location?.path && instruction.line !== undefined) {
			const sourceURI = this.getUriFromSource(instruction);

			if (sourceURI) {
				let textModel: ITextModel | undefined = undefined;
				const sourceSB = new StringBuilder(10000);
				const ref = await this.textModelService.createModelReference(sourceURI);
				if (templateData.currentElement.element !== element) {
					return; // avoid a race, #192831
				}
				textModel = ref.object.textEditorModel;
				templateData.cellDisposable.push(ref);

				// templateData could have moved on during async.  Double check if it is still the same source.
				if (textModel && templateData.currentElement.element === element) {
					let lineNumber = instruction.line;

					while (lineNumber && lineNumber >= 1 && lineNumber <= textModel.getLineCount()) {
						const lineContent = textModel.getLineContent(lineNumber);
						sourceSB.appendString(`  ${lineNumber}: `);
						sourceSB.appendString(lineContent + '\n');

						if (instruction.endLine && lineNumber < instruction.endLine) {
							lineNumber++;
							continue;
						}

						break;
					}

					templateData.sourcecode.innerText = sourceSB.build();
				}
			}
		}

		let spacesToAppend = 10;

		if (instruction.address !== '-1') {
			sb.appendString(instruction.address);
			if (instruction.address.length < InstructionRenderer.INSTRUCTION_ADDR_MIN_LENGTH) {
				spacesToAppend = InstructionRenderer.INSTRUCTION_ADDR_MIN_LENGTH - instruction.address.length;
			}
			for (let i = 0; i < spacesToAppend; i++) {
				sb.appendString(' ');
			}
		}

		if (instruction.instructionBytes) {
			sb.appendString(instruction.instructionBytes);
			spacesToAppend = 10;
			if (instruction.instructionBytes.length < InstructionRenderer.INSTRUCTION_BYTES_MIN_LENGTH) {
				spacesToAppend = InstructionRenderer.INSTRUCTION_BYTES_MIN_LENGTH - instruction.instructionBytes.length;
			}
			for (let i = 0; i < spacesToAppend; i++) {
				sb.appendString(' ');
			}
		}

		sb.appendString(instruction.instruction);
		templateData.instruction.innerText = sb.build();

		this.rerenderBackground(templateData.instruction, templateData.sourcecode, element);
	}

	disposeElement(element: IDisassembledInstructionEntry, index: number, templateData: IInstructionColumnTemplateData): void {
		dispose(templateData.cellDisposable);
		templateData.cellDisposable = [];
	}

	disposeTemplate(templateData: IInstructionColumnTemplateData): void {
		dispose(templateData.disposables);
		templateData.disposables = [];
	}

	private rerenderBackground(instruction: HTMLElement, sourceCode: HTMLElement, element?: IDisassembledInstructionEntry) {
		if (element && this._disassemblyView.currentInstructionAddresses.includes(element.address)) {
			instruction.style.background = this._topStackFrameColor?.toString() || 'transparent';
		} else if (element?.address === this._disassemblyView.focusedInstructionAddress) {
			instruction.style.background = this._focusedStackFrameColor?.toString() || 'transparent';
		} else {
			instruction.style.background = 'transparent';
		}
	}

	private openSourceCode(instruction: DebugProtocol.DisassembledInstruction | undefined) {
		if (instruction) {
			const sourceURI = this.getUriFromSource(instruction);
			const selection = instruction.endLine ? {
				startLineNumber: instruction.line!,
				endLineNumber: instruction.endLine,
				startColumn: instruction.column || 1,
				endColumn: instruction.endColumn || Constants.MAX_SAFE_SMALL_INTEGER,
			} : {
				startLineNumber: instruction.line!,
				endLineNumber: instruction.line!,
				startColumn: instruction.column || 1,
				endColumn: instruction.endColumn || Constants.MAX_SAFE_SMALL_INTEGER,
			};

			this.editorService.openEditor({
				resource: sourceURI,
				description: localize('editorOpenedFromDisassemblyDescription', "from disassembly"),
				options: {
					preserveFocus: false,
					selection: selection,
					revealIfOpened: true,
					selectionRevealType: TextEditorSelectionRevealType.CenterIfOutsideViewport,
					pinned: false,
				}
			});
		}
	}

	private getUriFromSource(instruction: DebugProtocol.DisassembledInstruction): URI {
		// Try to resolve path before consulting the debugSession.
		const path = instruction.location!.path;
		if (path && isUriString(path)) {	// path looks like a uri
			return this.uriService.asCanonicalUri(URI.parse(path));
		}
		// assume a filesystem path
		if (path && isAbsolute(path)) {
			return this.uriService.asCanonicalUri(URI.file(path));
		}

		return getUriFromSource(instruction.location!, instruction.location!.path, this._disassemblyView.debugSession!.getId(), this.uriService, this.logService);
	}

	private applyFontInfo(element: HTMLElement) {
		applyFontInfo(element, this._disassemblyView.fontInfo);
		element.style.whiteSpace = 'pre';
	}
}

class AccessibilityProvider implements IListAccessibilityProvider<IDisassembledInstructionEntry> {

	getWidgetAriaLabel(): string {
		return localize('disassemblyView', "Disassembly View");
	}

	getAriaLabel(element: IDisassembledInstructionEntry): string | null {
		let label = '';

		const instruction = element.instruction;
		if (instruction.address !== '-1') {
			label += `${localize('instructionAddress', "Address")}: ${instruction.address}`;
		}
		if (instruction.instructionBytes) {
			label += `, ${localize('instructionBytes', "Bytes")}: ${instruction.instructionBytes}`;
		}
		label += `, ${localize(`instructionText`, "Instruction")}: ${instruction.instruction}`;

		return label;
	}
}

export class DisassemblyViewContribution implements IWorkbenchContribution {

	private readonly _onDidActiveEditorChangeListener: IDisposable;
	private _onDidChangeModelLanguage: IDisposable | undefined;
	private _languageSupportsDisassembleRequest: IContextKey<boolean> | undefined;

	constructor(
		@IEditorService editorService: IEditorService,
		@IDebugService debugService: IDebugService,
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		contextKeyService.bufferChangeEvents(() => {
			this._languageSupportsDisassembleRequest = CONTEXT_LANGUAGE_SUPPORTS_DISASSEMBLE_REQUEST.bindTo(contextKeyService);
		});

		const onDidActiveEditorChangeListener = () => {
			if (this._onDidChangeModelLanguage) {
				this._onDidChangeModelLanguage.dispose();
				this._onDidChangeModelLanguage = undefined;
			}

			const activeTextEditorControl = editorService.activeTextEditorControl;
			if (isCodeEditor(activeTextEditorControl)) {
				const language = activeTextEditorControl.getModel()?.getLanguageId();
				// TODO: instead of using idDebuggerInterestedInLanguage, have a specific ext point for languages
				// support disassembly
				this._languageSupportsDisassembleRequest?.set(!!language && debugService.getAdapterManager().someDebuggerInterestedInLanguage(language));

				this._onDidChangeModelLanguage = activeTextEditorControl.onDidChangeModelLanguage(e => {
					this._languageSupportsDisassembleRequest?.set(debugService.getAdapterManager().someDebuggerInterestedInLanguage(e.newLanguage));
				});
			} else {
				this._languageSupportsDisassembleRequest?.set(false);
			}
		};

		onDidActiveEditorChangeListener();
		this._onDidActiveEditorChangeListener = editorService.onDidActiveEditorChange(onDidActiveEditorChangeListener);
	}

	dispose(): void {
		this._onDidActiveEditorChangeListener.dispose();
		this._onDidChangeModelLanguage?.dispose();
	}
}

CommandsRegistry.registerCommand({
	metadata: {
		description: COPY_ADDRESS_LABEL,
	},
	id: COPY_ADDRESS_ID,
	handler: async (accessor: ServicesAccessor, entry?: IDisassembledInstructionEntry) => {
		if (entry?.instruction?.address) {
			const clipboardService = accessor.get(IClipboardService);
			clipboardService.writeText(entry.instruction.address);
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/exceptionWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/exceptionWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/exceptionWidget.css';
import * as nls from '../../../../nls.js';
import * as dom from '../../../../base/browser/dom.js';
import { ZoneWidget } from '../../../../editor/contrib/zoneWidget/browser/zoneWidget.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { IExceptionInfo, IDebugSession, IDebugEditorContribution, EDITOR_CONTRIBUTION_ID } from '../common/debug.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { IThemeService, IColorTheme } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { Color } from '../../../../base/common/color.js';
import { registerColor } from '../../../../platform/theme/common/colorRegistry.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { DebugLinkHoverBehavior, LinkDetector } from './linkDetector.js';
import { EditorOption } from '../../../../editor/common/config/editorOptions.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { Action } from '../../../../base/common/actions.js';
import { widgetClose } from '../../../../platform/theme/common/iconRegistry.js';
import { Range } from '../../../../editor/common/core/range.js';
const $ = dom.$;

// theming

const debugExceptionWidgetBorder = registerColor('debugExceptionWidget.border', '#a31515', nls.localize('debugExceptionWidgetBorder', 'Exception widget border color.'));
const debugExceptionWidgetBackground = registerColor('debugExceptionWidget.background', { dark: '#420b0d', light: '#f1dfde', hcDark: '#420b0d', hcLight: '#f1dfde' }, nls.localize('debugExceptionWidgetBackground', 'Exception widget background color.'));

export class ExceptionWidget extends ZoneWidget {

	private backgroundColor: Color | undefined;

	constructor(
		editor: ICodeEditor,
		private exceptionInfo: IExceptionInfo,
		private debugSession: IDebugSession | undefined,
		private readonly shouldScroll: () => boolean,
		@IThemeService themeService: IThemeService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super(editor, { showFrame: true, showArrow: true, isAccessible: true, frameWidth: 1, className: 'exception-widget-container' });

		this.applyTheme(themeService.getColorTheme());
		this._disposables.add(themeService.onDidColorThemeChange(this.applyTheme.bind(this)));

		this.create();
		const onDidLayoutChangeScheduler = new RunOnceScheduler(() => this._doLayout(undefined, undefined), 50);
		this._disposables.add(this.editor.onDidLayoutChange(() => onDidLayoutChangeScheduler.schedule()));
		this._disposables.add(onDidLayoutChangeScheduler);
	}

	private applyTheme(theme: IColorTheme): void {
		this.backgroundColor = theme.getColor(debugExceptionWidgetBackground);
		const frameColor = theme.getColor(debugExceptionWidgetBorder);
		this.style({
			arrowColor: frameColor,
			frameColor: frameColor
		}); // style() will trigger _applyStyles
	}

	protected override _applyStyles(): void {
		if (this.container) {
			this.container.style.backgroundColor = this.backgroundColor ? this.backgroundColor.toString() : '';
		}
		super._applyStyles();
	}

	protected _fillContainer(container: HTMLElement): void {
		this.setCssClass('exception-widget');
		// Set the font size and line height to the one from the editor configuration.
		const fontInfo = this.editor.getOption(EditorOption.fontInfo);
		container.style.fontSize = `${fontInfo.fontSize}px`;
		container.style.lineHeight = `${fontInfo.lineHeight}px`;
		container.tabIndex = 0;
		const title = $('.title');
		const label = $('.label');
		dom.append(title, label);
		const actions = $('.actions');
		dom.append(title, actions);
		label.textContent = this.exceptionInfo.id ? nls.localize('exceptionThrownWithId', 'Exception has occurred: {0}', this.exceptionInfo.id) : nls.localize('exceptionThrown', 'Exception has occurred.');
		let ariaLabel = label.textContent;

		const actionBar = new ActionBar(actions);
		actionBar.push(new Action('editor.closeExceptionWidget', nls.localize('close', "Close"), ThemeIcon.asClassName(widgetClose), true, async () => {
			const contribution = this.editor.getContribution<IDebugEditorContribution>(EDITOR_CONTRIBUTION_ID);
			contribution?.closeExceptionWidget();
		}), { label: false, icon: true });

		dom.append(container, title);

		if (this.exceptionInfo.description) {
			const description = $('.description');
			description.textContent = this.exceptionInfo.description;
			ariaLabel += ', ' + this.exceptionInfo.description;
			dom.append(container, description);
		}

		if (this.exceptionInfo.details && this.exceptionInfo.details.stackTrace) {
			const stackTrace = $('.stack-trace');
			const linkDetector = this.instantiationService.createInstance(LinkDetector);
			const linkedStackTrace = linkDetector.linkify(this.exceptionInfo.details.stackTrace, true, this.debugSession ? this.debugSession.root : undefined, undefined, { type: DebugLinkHoverBehavior.Rich, store: this._disposables });
			stackTrace.appendChild(linkedStackTrace);
			dom.append(container, stackTrace);
			ariaLabel += ', ' + this.exceptionInfo.details.stackTrace;
		}
		container.setAttribute('aria-label', ariaLabel);
	}

	protected override _doLayout(_heightInPixel: number | undefined, _widthInPixel: number | undefined): void {
		// Reload the height with respect to the exception text content and relayout it to match the line count.
		this.container!.style.height = 'initial';

		const lineHeight = this.editor.getOption(EditorOption.lineHeight);
		const arrowHeight = Math.round(lineHeight / 3);
		const computedLinesNumber = Math.ceil((this.container!.offsetHeight + arrowHeight) / lineHeight);

		this._relayout(computedLinesNumber);
	}

	protected override revealRange(range: Range, isLastLine: boolean): void {
		// Only reveal/scroll if this widget should scroll
		// For inactive editors, skip the reveal to prevent scrolling
		if (this.shouldScroll()) {
			super.revealRange(range, isLastLine);
		}
	}

	focus(): void {
		// Focus into the container for accessibility purposes so the exception and stack trace gets read
		this.container?.focus();
	}

	override hasFocus(): boolean {
		if (!this.container) {
			return false;
		}

		return dom.isAncestorOfActiveElement(this.container);
	}

	getWhitespaceHeight(): number {
		// Returns the height of the whitespace zone from the editor's whitespaces
		// This is more accurate than the container height as it includes the actual zone dimensions
		if (!this._viewZone || !this._viewZone.id) {
			return 0;
		}

		const whitespaces = this.editor.getWhitespaces();
		const whitespace = whitespaces.find(ws => ws.id === this._viewZone!.id);
		return whitespace ? whitespace.height : 0;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/extensionHostDebugService.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/extensionHostDebugService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { IChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { IExtensionHostDebugService, IOpenExtensionWindowResult } from '../../../../platform/debug/common/extensionHostDebug.js';
import { ExtensionHostDebugBroadcastChannel, ExtensionHostDebugChannelClient } from '../../../../platform/debug/common/extensionHostDebugIpc.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { isFolderToOpen, isWorkspaceToOpen } from '../../../../platform/window/common/window.js';
import { IWorkspaceContextService, isSingleFolderWorkspaceIdentifier, isWorkspaceIdentifier, toWorkspaceIdentifier, hasWorkspaceFileExtension } from '../../../../platform/workspace/common/workspace.js';
import { IWorkspace, IWorkspaceProvider } from '../../../browser/web.api.js';
import { IBrowserWorkbenchEnvironmentService } from '../../../services/environment/browser/environmentService.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';

class BrowserExtensionHostDebugService extends ExtensionHostDebugChannelClient implements IExtensionHostDebugService {

	private static readonly LAST_EXTENSION_DEVELOPMENT_WORKSPACE_KEY = 'debug.lastExtensionDevelopmentWorkspace';

	private workspaceProvider: IWorkspaceProvider;

	private readonly storageService: IStorageService;
	private readonly fileService: IFileService;

	constructor(
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@IBrowserWorkbenchEnvironmentService environmentService: IBrowserWorkbenchEnvironmentService,
		@ILogService logService: ILogService,
		@IHostService hostService: IHostService,
		@IWorkspaceContextService contextService: IWorkspaceContextService,
		@IStorageService storageService: IStorageService,
		@IFileService fileService: IFileService
	) {
		const connection = remoteAgentService.getConnection();
		let channel: IChannel;
		if (connection) {
			channel = connection.getChannel(ExtensionHostDebugBroadcastChannel.ChannelName);
		} else {
			// Extension host debugging not supported in serverless.
			channel = { call: async () => Promise.resolve(undefined!), listen: () => Event.None };
		}

		super(channel);

		this.storageService = storageService;
		this.fileService = fileService;

		if (environmentService.options && environmentService.options.workspaceProvider) {
			this.workspaceProvider = environmentService.options.workspaceProvider;
		} else {
			this.workspaceProvider = { open: async () => true, workspace: undefined, trusted: undefined };
			logService.warn('Extension Host Debugging not available due to missing workspace provider.');
		}

		// Reload window on reload request
		this._register(this.onReload(event => {
			if (environmentService.isExtensionDevelopment && environmentService.debugExtensionHost.debugId === event.sessionId) {
				hostService.reload();
			}
		}));

		// Close window on close request
		this._register(this.onClose(event => {
			if (environmentService.isExtensionDevelopment && environmentService.debugExtensionHost.debugId === event.sessionId) {
				hostService.close();
			}
		}));

		// Remember workspace as last used for extension development
		// (unless this is API tests) to restore for a future session
		if (environmentService.isExtensionDevelopment && !environmentService.extensionTestsLocationURI) {
			const workspaceId = toWorkspaceIdentifier(contextService.getWorkspace());
			if (isSingleFolderWorkspaceIdentifier(workspaceId) || isWorkspaceIdentifier(workspaceId)) {
				const serializedWorkspace = isSingleFolderWorkspaceIdentifier(workspaceId) ? { folderUri: workspaceId.uri.toJSON() } : { workspaceUri: workspaceId.configPath.toJSON() };
				storageService.store(BrowserExtensionHostDebugService.LAST_EXTENSION_DEVELOPMENT_WORKSPACE_KEY, JSON.stringify(serializedWorkspace), StorageScope.PROFILE, StorageTarget.MACHINE);
			} else {
				storageService.remove(BrowserExtensionHostDebugService.LAST_EXTENSION_DEVELOPMENT_WORKSPACE_KEY, StorageScope.PROFILE);
			}
		}
	}

	override async openExtensionDevelopmentHostWindow(args: string[], _debugRenderer: boolean): Promise<IOpenExtensionWindowResult> {

		// Add environment parameters required for debug to work
		const environment = new Map<string, string>();

		const fileUriArg = this.findArgument('file-uri', args);
		if (fileUriArg && !hasWorkspaceFileExtension(fileUriArg)) {
			environment.set('openFile', fileUriArg);
		}

		const copyArgs = [
			'extensionDevelopmentPath',
			'extensionTestsPath',
			'extensionEnvironment',
			'debugId',
			'inspect-brk-extensions',
			'inspect-extensions',
		];

		for (const argName of copyArgs) {
			const value = this.findArgument(argName, args);
			if (value) {
				environment.set(argName, value);
			}
		}

		// Find out which workspace to open debug window on
		let debugWorkspace: IWorkspace = undefined;
		const folderUriArg = this.findArgument('folder-uri', args);
		if (folderUriArg) {
			debugWorkspace = { folderUri: URI.parse(folderUriArg) };
		} else {
			const fileUriArg = this.findArgument('file-uri', args);
			if (fileUriArg && hasWorkspaceFileExtension(fileUriArg)) {
				debugWorkspace = { workspaceUri: URI.parse(fileUriArg) };
			}
		}

		const extensionTestsPath = this.findArgument('extensionTestsPath', args);
		if (!debugWorkspace && !extensionTestsPath) {
			const lastExtensionDevelopmentWorkspace = this.storageService.get(BrowserExtensionHostDebugService.LAST_EXTENSION_DEVELOPMENT_WORKSPACE_KEY, StorageScope.PROFILE);
			if (lastExtensionDevelopmentWorkspace) {
				try {
					const serializedWorkspace: { workspaceUri?: UriComponents; folderUri?: UriComponents } = JSON.parse(lastExtensionDevelopmentWorkspace);
					if (serializedWorkspace.workspaceUri) {
						debugWorkspace = { workspaceUri: URI.revive(serializedWorkspace.workspaceUri) };
					} else if (serializedWorkspace.folderUri) {
						debugWorkspace = { folderUri: URI.revive(serializedWorkspace.folderUri) };
					}
				} catch (error) {
					// ignore
				}
			}
		}

		// Validate workspace exists
		if (debugWorkspace) {
			const debugWorkspaceResource = isFolderToOpen(debugWorkspace) ? debugWorkspace.folderUri : isWorkspaceToOpen(debugWorkspace) ? debugWorkspace.workspaceUri : undefined;
			if (debugWorkspaceResource) {
				const workspaceExists = await this.fileService.exists(debugWorkspaceResource);
				if (!workspaceExists) {
					debugWorkspace = undefined;
				}
			}
		}

		// Open debug window as new window. Pass arguments over.
		const success = await this.workspaceProvider.open(debugWorkspace, {
			reuse: false, 								// debugging always requires a new window
			payload: Array.from(environment.entries())	// mandatory properties to enable debugging
		});

		return { success };
	}

	private findArgument(key: string, args: string[]): string | undefined {
		for (const a of args) {
			const k = `--${key}=`;
			if (a.indexOf(k) === 0) {
				return a.substring(k.length);
			}
		}

		return undefined;
	}
}

registerSingleton(IExtensionHostDebugService, BrowserExtensionHostDebugService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/linkDetector.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/linkDetector.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getWindow, isHTMLElement, reset } from '../../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import * as osPath from '../../../../base/common/path.js';
import * as platform from '../../../../base/common/platform.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { ITunnelService } from '../../../../platform/tunnel/common/tunnel.js';
import { IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { IDebugSession } from '../common/debug.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IPathService } from '../../../services/path/common/pathService.js';
import { IHighlight } from '../../../../base/browser/ui/highlightedlabel/highlightedLabel.js';
import { Iterable } from '../../../../base/common/iterator.js';

const CONTROL_CODES = '\\u0000-\\u0020\\u007f-\\u009f';
const WEB_LINK_REGEX = new RegExp('(?:[a-zA-Z][a-zA-Z0-9+.-]{2,}:\\/\\/|data:|www\\.)[^\\s' + CONTROL_CODES + '"]{2,}[^\\s' + CONTROL_CODES + '"\')}\\],:;.!?]', 'ug');

const WIN_ABSOLUTE_PATH = /(?:[a-zA-Z]:(?:(?:\\|\/)[\w\s\.@\-\(\)\[\]{}!#$%^&'`~+=]+)+)/;
const WIN_RELATIVE_PATH = /(?:(?:\~|\.+)(?:(?:\\|\/)[\w\s\.@\-\(\)\[\]{}!#$%^&'`~+=]+)+)/;
const WIN_PATH = new RegExp(`(${WIN_ABSOLUTE_PATH.source}|${WIN_RELATIVE_PATH.source})`);
const POSIX_PATH = /((?:\~|\.+)?(?:\/[\w\s\.@\-\(\)\[\]{}!#$%^&'`~+=]+)+)/;
// Support both ":line 123" and ":123:45" formats for line/column numbers
const LINE_COLUMN = /(?::(?:line\s+)?([\d]+))?(?::([\d]+))?/;
const PATH_LINK_REGEX = new RegExp(`${platform.isWindows ? WIN_PATH.source : POSIX_PATH.source}${LINE_COLUMN.source}`, 'g');
const LINE_COLUMN_REGEX = /:(?:line\s+)?([\d]+)(?::([\d]+))?$/;

const MAX_LENGTH = 2000;

type LinkKind = 'web' | 'path' | 'text';
type LinkPart = {
	kind: LinkKind;
	value: string;
	captures: string[];
	index: number;
};

export const enum DebugLinkHoverBehavior {
	/** A nice workbench hover */
	Rich,
	/**
	 * Basic browser hover
	 * @deprecated Consumers should adopt `rich` by propagating disposables appropriately
	 */
	Basic,
	/** No hover */
	None
}

/** Store implies HoverBehavior=rich */
export type DebugLinkHoverBehaviorTypeData = { type: DebugLinkHoverBehavior.None | DebugLinkHoverBehavior.Basic }
	| { type: DebugLinkHoverBehavior.Rich; store: DisposableStore };

export interface ILinkDetector {
	linkify(text: string, splitLines?: boolean, workspaceFolder?: IWorkspaceFolder, includeFulltext?: boolean, hoverBehavior?: DebugLinkHoverBehaviorTypeData, highlights?: IHighlight[]): HTMLElement;
	linkifyLocation(text: string, locationReference: number, session: IDebugSession, hoverBehavior?: DebugLinkHoverBehaviorTypeData): HTMLElement;
}

export class LinkDetector implements ILinkDetector {
	constructor(
		@IEditorService private readonly editorService: IEditorService,
		@IFileService private readonly fileService: IFileService,
		@IOpenerService private readonly openerService: IOpenerService,
		@IPathService private readonly pathService: IPathService,
		@ITunnelService private readonly tunnelService: ITunnelService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IHoverService private readonly hoverService: IHoverService,
	) {
		// noop
	}

	/**
	 * Matches and handles web urls, absolute and relative file links in the string provided.
	 * Returns <span/> element that wraps the processed string, where matched links are replaced by <a/>.
	 * 'onclick' event is attached to all anchored links that opens them in the editor.
	 * When splitLines is true, each line of the text, even if it contains no links, is wrapped in a <span>
	 * and added as a child of the returned <span>.
	 * If a `hoverBehavior` is passed, hovers may be added using the workbench hover service.
	 * This should be preferred for new code where hovers are desirable.
	 */
	linkify(text: string, splitLines?: boolean, workspaceFolder?: IWorkspaceFolder, includeFulltext?: boolean, hoverBehavior?: DebugLinkHoverBehaviorTypeData, highlights?: IHighlight[]): HTMLElement {
		return this._linkify(text, splitLines, workspaceFolder, includeFulltext, hoverBehavior, highlights);
	}

	private _linkify(text: string, splitLines?: boolean, workspaceFolder?: IWorkspaceFolder, includeFulltext?: boolean, hoverBehavior?: DebugLinkHoverBehaviorTypeData, highlights?: IHighlight[], defaultRef?: { locationReference: number; session: IDebugSession }): HTMLElement {
		if (splitLines) {
			const lines = text.split('\n');
			for (let i = 0; i < lines.length - 1; i++) {
				lines[i] = lines[i] + '\n';
			}
			if (!lines[lines.length - 1]) {
				// Remove the last element ('') that split added.
				lines.pop();
			}
			const elements = lines.map(line => this._linkify(line, false, workspaceFolder, includeFulltext, hoverBehavior, highlights, defaultRef));
			if (elements.length === 1) {
				// Do not wrap single line with extra span.
				return elements[0];
			}
			const container = document.createElement('span');
			elements.forEach(e => container.appendChild(e));
			return container;
		}

		const container = document.createElement('span');
		for (const part of this.detectLinks(text)) {
			try {
				let node: Node;
				switch (part.kind) {
					case 'text':
						node = defaultRef ? this.linkifyLocation(part.value, defaultRef.locationReference, defaultRef.session, hoverBehavior) : document.createTextNode(part.value);
						break;
					case 'web':
						node = this.createWebLink(includeFulltext ? text : undefined, part.value, hoverBehavior);
						break;
					case 'path': {
						const path = part.captures[0];
						const lineNumber = part.captures[1] ? Number(part.captures[1]) : 0;
						const columnNumber = part.captures[2] ? Number(part.captures[2]) : 0;
						node = this.createPathLink(includeFulltext ? text : undefined, part.value, path, lineNumber, columnNumber, workspaceFolder, hoverBehavior);
						break;
					}
					default:
						node = document.createTextNode(part.value);
				}

				container.append(...this.applyHighlights(node, part.index, part.value.length, highlights));
			} catch (e) {
				container.appendChild(document.createTextNode(part.value));
			}
		}
		return container;
	}

	private applyHighlights(node: Node, startIndex: number, length: number, highlights: IHighlight[] | undefined): Iterable<Node | string> {
		const children: (Node | string)[] = [];
		let currentIndex = startIndex;
		const endIndex = startIndex + length;

		for (const highlight of highlights || []) {
			if (highlight.end <= currentIndex || highlight.start >= endIndex) {
				continue;
			}

			if (highlight.start > currentIndex) {
				children.push(node.textContent!.substring(currentIndex - startIndex, highlight.start - startIndex));
				currentIndex = highlight.start;
			}

			const highlightEnd = Math.min(highlight.end, endIndex);
			const highlightedText = node.textContent!.substring(currentIndex - startIndex, highlightEnd - startIndex);
			const highlightSpan = document.createElement('span');
			highlightSpan.classList.add('highlight');
			if (highlight.extraClasses) {
				highlightSpan.classList.add(...highlight.extraClasses);
			}
			highlightSpan.textContent = highlightedText;
			children.push(highlightSpan);
			currentIndex = highlightEnd;
		}

		if (currentIndex === startIndex) {
			return Iterable.single(node); // no changes made
		}

		if (currentIndex < endIndex) {
			children.push(node.textContent!.substring(currentIndex - startIndex));
		}

		// reuse the element if it's a link
		if (isHTMLElement(node)) {
			reset(node, ...children);
			return Iterable.single(node);
		}

		return children;
	}

	/**
	 * Linkifies a location reference.
	 */
	linkifyLocation(text: string, locationReference: number, session: IDebugSession, hoverBehavior?: DebugLinkHoverBehaviorTypeData) {
		const link = this.createLink(text);
		this.decorateLink(link, undefined, text, hoverBehavior, async (preserveFocus: boolean) => {
			const location = await session.resolveLocationReference(locationReference);
			await location.source.openInEditor(this.editorService, {
				startLineNumber: location.line,
				startColumn: location.column,
				endLineNumber: location.endLine ?? location.line,
				endColumn: location.endColumn ?? location.column,
			}, preserveFocus);
		});

		return link;
	}

	/**
	 * Makes an {@link ILinkDetector} that links everything in the output to the
	 * reference if they don't have other explicit links.
	 */
	makeReferencedLinkDetector(locationReference: number, session: IDebugSession): ILinkDetector {
		return {
			linkify: (text, splitLines, workspaceFolder, includeFulltext, hoverBehavior, highlights) =>
				this._linkify(text, splitLines, workspaceFolder, includeFulltext, hoverBehavior, highlights, { locationReference, session }),
			linkifyLocation: this.linkifyLocation.bind(this),
		};
	}

	private createWebLink(fulltext: string | undefined, url: string, hoverBehavior?: DebugLinkHoverBehaviorTypeData): Node {
		const link = this.createLink(url);

		let uri = URI.parse(url);
		// if the URI ends with something like `foo.js:12:3`, parse
		// that into a fragment to reveal that location (#150702)
		const lineCol = LINE_COLUMN_REGEX.exec(uri.path);
		if (lineCol) {
			uri = uri.with({
				path: uri.path.slice(0, lineCol.index),
				fragment: `L${lineCol[0].slice(1)}`
			});
		}

		this.decorateLink(link, uri, fulltext, hoverBehavior, async () => {

			if (uri.scheme === Schemas.file) {
				// Just using fsPath here is unsafe: https://github.com/microsoft/vscode/issues/109076
				const fsPath = uri.fsPath;
				const path = await this.pathService.path;
				const fileUrl = osPath.normalize(((path.sep === osPath.posix.sep) && platform.isWindows) ? fsPath.replace(/\\/g, osPath.posix.sep) : fsPath);

				const fileUri = URI.parse(fileUrl);
				const exists = await this.fileService.exists(fileUri);
				if (!exists) {
					return;
				}

				await this.editorService.openEditor({
					resource: fileUri,
					options: {
						pinned: true,
						selection: lineCol ? { startLineNumber: +lineCol[1], startColumn: lineCol[2] ? +lineCol[2] : 1 } : undefined,
					},
				});
				return;
			}

			this.openerService.open(url, { allowTunneling: (!!this.environmentService.remoteAuthority && this.configurationService.getValue('remote.forwardOnOpen')) });
		});

		return link;
	}

	private createPathLink(fulltext: string | undefined, text: string, path: string, lineNumber: number, columnNumber: number, workspaceFolder: IWorkspaceFolder | undefined, hoverBehavior?: DebugLinkHoverBehaviorTypeData): Node {
		if (path[0] === '/' && path[1] === '/') {
			// Most likely a url part which did not match, for example ftp://path.
			return document.createTextNode(text);
		}

		// Only set selection if we have a valid line number (greater than 0)
		const options = lineNumber > 0
			? { selection: { startLineNumber: lineNumber, startColumn: columnNumber > 0 ? columnNumber : 1 } }
			: {};

		if (path[0] === '.') {
			if (!workspaceFolder) {
				return document.createTextNode(text);
			}
			const uri = workspaceFolder.toResource(path);
			const link = this.createLink(text);
			this.decorateLink(link, uri, fulltext, hoverBehavior, (preserveFocus: boolean) => this.editorService.openEditor({ resource: uri, options: { ...options, preserveFocus } }));
			return link;
		}

		if (path[0] === '~') {
			const userHome = this.pathService.resolvedUserHome;
			if (userHome) {
				path = osPath.join(userHome.fsPath, path.substring(1));
			}
		}

		const link = this.createLink(text);
		link.tabIndex = 0;
		const uri = URI.file(osPath.normalize(path));
		this.fileService.stat(uri).then(stat => {
			if (stat.isDirectory) {
				return;
			}
			this.decorateLink(link, uri, fulltext, hoverBehavior, (preserveFocus: boolean) => this.editorService.openEditor({ resource: uri, options: { ...options, preserveFocus } }));
		}).catch(() => {
			// If the uri can not be resolved we should not spam the console with error, remain quite #86587
		});
		return link;
	}

	private createLink(text: string): HTMLElement {
		const link = document.createElement('a');
		link.textContent = text;
		return link;
	}

	private decorateLink(link: HTMLElement, uri: URI | undefined, fulltext: string | undefined, hoverBehavior: DebugLinkHoverBehaviorTypeData | undefined, onClick: (preserveFocus: boolean) => void) {
		link.classList.add('link');
		const followLink = uri && this.tunnelService.canTunnel(uri) ? localize('followForwardedLink', "follow link using forwarded port") : localize('followLink', "follow link");
		const title = link.ariaLabel = fulltext
			? (platform.isMacintosh ? localize('fileLinkWithPathMac', "Cmd + click to {0}\n{1}", followLink, fulltext) : localize('fileLinkWithPath', "Ctrl + click to {0}\n{1}", followLink, fulltext))
			: (platform.isMacintosh ? localize('fileLinkMac', "Cmd + click to {0}", followLink) : localize('fileLink', "Ctrl + click to {0}", followLink));

		if (hoverBehavior?.type === DebugLinkHoverBehavior.Rich) {
			hoverBehavior.store.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('element'), link, title));
		} else if (hoverBehavior?.type !== DebugLinkHoverBehavior.None) {
			link.title = title;
		}

		link.onmousemove = (event) => { link.classList.toggle('pointer', platform.isMacintosh ? event.metaKey : event.ctrlKey); };
		link.onmouseleave = () => link.classList.remove('pointer');
		link.onclick = (event) => {
			const selection = getWindow(link).getSelection();
			if (!selection || selection.type === 'Range') {
				return; // do not navigate when user is selecting
			}
			if (!(platform.isMacintosh ? event.metaKey : event.ctrlKey)) {
				return;
			}

			event.preventDefault();
			event.stopImmediatePropagation();
			onClick(false);
		};
		link.onkeydown = e => {
			const event = new StandardKeyboardEvent(e);
			if (event.keyCode === KeyCode.Enter || event.keyCode === KeyCode.Space) {
				event.preventDefault();
				event.stopPropagation();
				onClick(event.keyCode === KeyCode.Space);
			}
		};
	}

	private detectLinks(text: string): LinkPart[] {
		if (text.length > MAX_LENGTH) {
			return [{ kind: 'text', value: text, captures: [], index: 0 }];
		}

		const regexes: RegExp[] = [WEB_LINK_REGEX, PATH_LINK_REGEX];
		const kinds: LinkKind[] = ['web', 'path'];
		const result: LinkPart[] = [];

		const splitOne = (text: string, regexIndex: number, baseIndex: number) => {
			if (regexIndex >= regexes.length) {
				result.push({ value: text, kind: 'text', captures: [], index: baseIndex });
				return;
			}
			const regex = regexes[regexIndex];
			let currentIndex = 0;
			let match;
			regex.lastIndex = 0;
			while ((match = regex.exec(text)) !== null) {
				const stringBeforeMatch = text.substring(currentIndex, match.index);
				if (stringBeforeMatch) {
					splitOne(stringBeforeMatch, regexIndex + 1, baseIndex + currentIndex);
				}
				const value = match[0];
				result.push({
					value: value,
					kind: kinds[regexIndex],
					captures: match.slice(1),
					index: baseIndex + match.index
				});
				currentIndex = match.index + value.length;
			}
			const stringAfterMatches = text.substring(currentIndex);
			if (stringAfterMatches) {
				splitOne(stringAfterMatches, regexIndex + 1, baseIndex + currentIndex);
			}
		};

		splitOne(text, 0, 0);
		return result;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/loadedScriptsView.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/loadedScriptsView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { IListAccessibilityProvider } from '../../../../base/browser/ui/list/listWidget.js';
import { TreeFindMode } from '../../../../base/browser/ui/tree/abstractTree.js';
import type { ICompressedTreeNode } from '../../../../base/browser/ui/tree/compressedObjectTreeModel.js';
import type { ICompressibleTreeRenderer } from '../../../../base/browser/ui/tree/objectTree.js';
import { ITreeElement, ITreeFilter, ITreeNode, TreeFilterResult, TreeVisibility } from '../../../../base/browser/ui/tree/tree.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { createMatches, FuzzyScore } from '../../../../base/common/filters.js';
import { normalizeDriveLetter, tildify } from '../../../../base/common/labels.js';
import { dispose } from '../../../../base/common/lifecycle.js';
import { isAbsolute, normalize, posix } from '../../../../base/common/path.js';
import { isWindows } from '../../../../base/common/platform.js';
import { ltrim } from '../../../../base/common/strings.js';
import { URI } from '../../../../base/common/uri.js';
import * as nls from '../../../../nls.js';
import { MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { FileKind } from '../../../../platform/files/common/files.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { WorkbenchCompressibleObjectTree } from '../../../../platform/list/browser/listService.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IFileIconTheme, IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IWorkspaceContextService, IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { IResourceLabel, IResourceLabelOptions, IResourceLabelProps, ResourceLabels } from '../../../browser/labels.js';
import { ViewAction, ViewPane } from '../../../browser/parts/views/viewPane.js';
import { IViewletViewOptions } from '../../../browser/parts/views/viewsViewlet.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IPathService } from '../../../services/path/common/pathService.js';
import { CONTEXT_LOADED_SCRIPTS_ITEM_TYPE, IDebugService, IDebugSession, LOADED_SCRIPTS_VIEW_ID } from '../common/debug.js';
import { DebugContentProvider } from '../common/debugContentProvider.js';
import { Source } from '../common/debugSource.js';
import { renderViewTree } from './baseDebugView.js';

const NEW_STYLE_COMPRESS = true;

// RFC 2396, Appendix A: https://www.ietf.org/rfc/rfc2396.txt
const URI_SCHEMA_PATTERN = /^[a-zA-Z][a-zA-Z0-9\+\-\.]+:/;

type LoadedScriptsItem = BaseTreeItem;

class BaseTreeItem {

	private _showedMoreThanOne: boolean;
	private _children = new Map<string, BaseTreeItem>();
	private _source: Source | undefined;

	constructor(private _parent: BaseTreeItem | undefined, private _label: string, public readonly isIncompressible = false) {
		this._showedMoreThanOne = false;
	}

	updateLabel(label: string) {
		this._label = label;
	}

	isLeaf(): boolean {
		return this._children.size === 0;
	}

	getSession(): IDebugSession | undefined {
		if (this._parent) {
			return this._parent.getSession();
		}
		return undefined;
	}

	setSource(session: IDebugSession, source: Source): void {
		this._source = source;
		this._children.clear();
		if (source.raw && source.raw.sources) {
			for (const src of source.raw.sources) {
				if (src.name && src.path) {
					const s = new BaseTreeItem(this, src.name);
					this._children.set(src.path, s);
					const ss = session.getSource(src);
					s.setSource(session, ss);
				}
			}
		}
	}

	createIfNeeded<T extends BaseTreeItem>(key: string, factory: (parent: BaseTreeItem, label: string) => T): T {
		let child = <T>this._children.get(key);
		if (!child) {
			child = factory(this, key);
			this._children.set(key, child);
		}
		return child;
	}

	getChild(key: string): BaseTreeItem | undefined {
		return this._children.get(key);
	}

	remove(key: string): void {
		this._children.delete(key);
	}

	removeFromParent(): void {
		if (this._parent) {
			this._parent.remove(this._label);
			if (this._parent._children.size === 0) {
				this._parent.removeFromParent();
			}
		}
	}

	getTemplateId(): string {
		return 'id';
	}

	// a dynamic ID based on the parent chain; required for reparenting (see #55448)
	getId(): string {
		const parent = this.getParent();
		return parent ? `${parent.getId()}/${this.getInternalId()}` : this.getInternalId();
	}

	getInternalId(): string {
		return this._label;
	}

	// skips intermediate single-child nodes
	getParent(): BaseTreeItem | undefined {
		if (this._parent) {
			if (this._parent.isSkipped()) {
				return this._parent.getParent();
			}
			return this._parent;
		}
		return undefined;
	}

	isSkipped(): boolean {
		if (this._parent) {
			if (this._parent.oneChild()) {
				return true;	// skipped if I'm the only child of my parents
			}
			return false;
		}
		return true;	// roots are never skipped
	}

	// skips intermediate single-child nodes
	hasChildren(): boolean {
		const child = this.oneChild();
		if (child) {
			return child.hasChildren();
		}
		return this._children.size > 0;
	}

	// skips intermediate single-child nodes
	getChildren(): BaseTreeItem[] {
		const child = this.oneChild();
		if (child) {
			return child.getChildren();
		}
		const array: BaseTreeItem[] = [];
		for (const child of this._children.values()) {
			array.push(child);
		}
		return array.sort((a, b) => this.compare(a, b));
	}

	// skips intermediate single-child nodes
	getLabel(separateRootFolder = true): string {
		const child = this.oneChild();
		if (child) {
			const sep = (this instanceof RootFolderTreeItem && separateRootFolder) ? ' • ' : posix.sep;
			return `${this._label}${sep}${child.getLabel()}`;
		}
		return this._label;
	}

	// skips intermediate single-child nodes
	getHoverLabel(): string | undefined {
		if (this._source && this._parent && this._parent._source) {
			return this._source.raw.path || this._source.raw.name;
		}
		const label = this.getLabel(false);
		const parent = this.getParent();
		if (parent) {
			const hover = parent.getHoverLabel();
			if (hover) {
				return `${hover}/${label}`;
			}
		}
		return label;
	}

	// skips intermediate single-child nodes
	getSource(): Source | undefined {
		const child = this.oneChild();
		if (child) {
			return child.getSource();
		}
		return this._source;
	}

	protected compare(a: BaseTreeItem, b: BaseTreeItem): number {
		if (a._label && b._label) {
			return a._label.localeCompare(b._label);
		}
		return 0;
	}

	private oneChild(): BaseTreeItem | undefined {
		if (!this._source && !this._showedMoreThanOne && this.skipOneChild()) {
			if (this._children.size === 1) {
				return this._children.values().next().value;
			}
			// if a node had more than one child once, it will never be skipped again
			if (this._children.size > 1) {
				this._showedMoreThanOne = true;
			}
		}
		return undefined;
	}

	private skipOneChild(): boolean {
		if (NEW_STYLE_COMPRESS) {
			// if the root node has only one Session, don't show the session
			return this instanceof RootTreeItem;
		} else {
			return !(this instanceof RootFolderTreeItem) && !(this instanceof SessionTreeItem);
		}
	}
}

class RootFolderTreeItem extends BaseTreeItem {

	constructor(parent: BaseTreeItem, public folder: IWorkspaceFolder) {
		super(parent, folder.name, true);
	}
}

class RootTreeItem extends BaseTreeItem {

	constructor(private _pathService: IPathService, private _contextService: IWorkspaceContextService, private _labelService: ILabelService) {
		super(undefined, 'Root');
	}

	add(session: IDebugSession): SessionTreeItem {
		return this.createIfNeeded(session.getId(), () => new SessionTreeItem(this._labelService, this, session, this._pathService, this._contextService));
	}

	find(session: IDebugSession): SessionTreeItem {
		return <SessionTreeItem>this.getChild(session.getId());
	}
}

class SessionTreeItem extends BaseTreeItem {

	private static readonly URL_REGEXP = /^(https?:\/\/[^/]+)(\/.*)$/;

	private _session: IDebugSession;
	private _map = new Map<string, BaseTreeItem>();
	private _labelService: ILabelService;

	constructor(labelService: ILabelService, parent: BaseTreeItem, session: IDebugSession, private _pathService: IPathService, private rootProvider: IWorkspaceContextService) {
		super(parent, session.getLabel(), true);
		this._labelService = labelService;
		this._session = session;
	}

	override getInternalId(): string {
		return this._session.getId();
	}

	override getSession(): IDebugSession {
		return this._session;
	}

	override getHoverLabel(): string | undefined {
		return undefined;
	}

	override hasChildren(): boolean {
		return true;
	}

	protected override compare(a: BaseTreeItem, b: BaseTreeItem): number {
		const acat = this.category(a);
		const bcat = this.category(b);
		if (acat !== bcat) {
			return acat - bcat;
		}
		return super.compare(a, b);
	}

	private category(item: BaseTreeItem): number {

		// workspace scripts come at the beginning in "folder" order
		if (item instanceof RootFolderTreeItem) {
			return item.folder.index;
		}

		// <...> come at the very end
		const l = item.getLabel();
		if (l && /^<.+>$/.test(l)) {
			return 1000;
		}

		// everything else in between
		return 999;
	}

	async addPath(source: Source): Promise<void> {

		let folder: IWorkspaceFolder | null;
		let url: string;

		let path = source.raw.path;
		if (!path) {
			return;
		}

		if (this._labelService && URI_SCHEMA_PATTERN.test(path)) {
			path = this._labelService.getUriLabel(URI.parse(path));
		}

		const match = SessionTreeItem.URL_REGEXP.exec(path);
		if (match && match.length === 3) {
			url = match[1];
			path = decodeURI(match[2]);
		} else {
			if (isAbsolute(path)) {
				const resource = URI.file(path);

				// return early if we can resolve a relative path label from the root folder
				folder = this.rootProvider ? this.rootProvider.getWorkspaceFolder(resource) : null;
				if (folder) {
					// strip off the root folder path
					path = normalize(ltrim(resource.path.substring(folder.uri.path.length), posix.sep));
					const hasMultipleRoots = this.rootProvider.getWorkspace().folders.length > 1;
					if (hasMultipleRoots) {
						path = posix.sep + path;
					} else {
						// don't show root folder
						folder = null;
					}
				} else {
					// on unix try to tildify absolute paths
					path = normalize(path);
					if (isWindows) {
						path = normalizeDriveLetter(path);
					} else {
						path = tildify(path, (await this._pathService.userHome()).fsPath);
					}
				}
			}
		}

		let leaf: BaseTreeItem = this;
		path.split(/[\/\\]/).forEach((segment, i) => {
			if (i === 0 && folder) {
				const f = folder;
				leaf = leaf.createIfNeeded(folder.name, parent => new RootFolderTreeItem(parent, f));
			} else if (i === 0 && url) {
				leaf = leaf.createIfNeeded(url, parent => new BaseTreeItem(parent, url));
			} else {
				leaf = leaf.createIfNeeded(segment, parent => new BaseTreeItem(parent, segment));
			}
		});

		leaf.setSource(this._session, source);
		if (source.raw.path) {
			this._map.set(source.raw.path, leaf);
		}
	}

	removePath(source: Source): boolean {
		if (source.raw.path) {
			const leaf = this._map.get(source.raw.path);
			if (leaf) {
				leaf.removeFromParent();
				return true;
			}
		}
		return false;
	}
}

interface IViewState {
	readonly expanded: Set<string>;
}

/**
 * This maps a model item into a view model item.
 */
function asTreeElement(item: BaseTreeItem, viewState?: IViewState): ITreeElement<LoadedScriptsItem> {
	const children = item.getChildren();
	const collapsed = viewState ? !viewState.expanded.has(item.getId()) : !(item instanceof SessionTreeItem);

	return {
		element: item,
		collapsed,
		collapsible: item.hasChildren(),
		children: children.map(i => asTreeElement(i, viewState))
	};
}

export class LoadedScriptsView extends ViewPane {

	private treeContainer!: HTMLElement;
	private loadedScriptsItemType: IContextKey<string>;
	private tree!: WorkbenchCompressibleObjectTree<LoadedScriptsItem, FuzzyScore>;
	private treeLabels!: ResourceLabels;
	private changeScheduler!: RunOnceScheduler;
	private treeNeedsRefreshOnVisible = false;
	private filter!: LoadedScriptsFilter;

	constructor(
		options: IViewletViewOptions,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IConfigurationService configurationService: IConfigurationService,
		@IEditorService private readonly editorService: IEditorService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IDebugService private readonly debugService: IDebugService,
		@ILabelService private readonly labelService: ILabelService,
		@IPathService private readonly pathService: IPathService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);
		this.loadedScriptsItemType = CONTEXT_LOADED_SCRIPTS_ITEM_TYPE.bindTo(contextKeyService);
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);

		this.element.classList.add('debug-pane');
		container.classList.add('debug-loaded-scripts', 'show-file-icons');

		this.treeContainer = renderViewTree(container);

		this.filter = new LoadedScriptsFilter();

		const root = new RootTreeItem(this.pathService, this.contextService, this.labelService);

		this.treeLabels = this.instantiationService.createInstance(ResourceLabels, { onDidChangeVisibility: this.onDidChangeBodyVisibility });
		this._register(this.treeLabels);

		const onFileIconThemeChange = (fileIconTheme: IFileIconTheme) => {
			this.treeContainer.classList.toggle('align-icons-and-twisties', fileIconTheme.hasFileIcons && !fileIconTheme.hasFolderIcons);
			this.treeContainer.classList.toggle('hide-arrows', fileIconTheme.hidesExplorerArrows === true);
		};

		this._register(this.themeService.onDidFileIconThemeChange(onFileIconThemeChange));
		onFileIconThemeChange(this.themeService.getFileIconTheme());

		this.tree = this.instantiationService.createInstance(WorkbenchCompressibleObjectTree<LoadedScriptsItem, FuzzyScore>,
			'LoadedScriptsView',
			this.treeContainer,
			new LoadedScriptsDelegate(),
			[new LoadedScriptsRenderer(this.treeLabels)],
			{
				compressionEnabled: NEW_STYLE_COMPRESS,
				collapseByDefault: true,
				hideTwistiesOfChildlessElements: true,
				identityProvider: {
					getId: (element: LoadedScriptsItem) => element.getId()
				},
				keyboardNavigationLabelProvider: {
					getKeyboardNavigationLabel: (element: LoadedScriptsItem) => {
						return element.getLabel();
					},
					getCompressedNodeKeyboardNavigationLabel: (elements: LoadedScriptsItem[]) => {
						return elements.map(e => e.getLabel()).join('/');
					}
				},
				filter: this.filter,
				accessibilityProvider: new LoadedSciptsAccessibilityProvider(),
				overrideStyles: this.getLocationBasedColors().listOverrideStyles
			}
		);

		const updateView = (viewState?: IViewState) => this.tree.setChildren(null, asTreeElement(root, viewState).children);

		updateView();

		this.changeScheduler = new RunOnceScheduler(() => {
			this.treeNeedsRefreshOnVisible = false;
			if (this.tree) {
				updateView();
			}
		}, 300);
		this._register(this.changeScheduler);

		this._register(this.tree.onDidOpen(e => {
			if (e.element instanceof BaseTreeItem) {
				const source = e.element.getSource();
				if (source && source.available) {
					const nullRange = { startLineNumber: 0, startColumn: 0, endLineNumber: 0, endColumn: 0 };
					source.openInEditor(this.editorService, nullRange, e.editorOptions.preserveFocus, e.sideBySide, e.editorOptions.pinned);
				}
			}
		}));

		this._register(this.tree.onDidChangeFocus(() => {
			const focus = this.tree.getFocus();
			if (focus instanceof SessionTreeItem) {
				this.loadedScriptsItemType.set('session');
			} else {
				this.loadedScriptsItemType.reset();
			}
		}));

		const scheduleRefreshOnVisible = () => {
			if (this.isBodyVisible()) {
				this.changeScheduler.schedule();
			} else {
				this.treeNeedsRefreshOnVisible = true;
			}
		};

		const addSourcePathsToSession = async (session: IDebugSession) => {
			if (session.capabilities.supportsLoadedSourcesRequest) {
				const sessionNode = root.add(session);
				const paths = await session.getLoadedSources();
				for (const path of paths) {
					await sessionNode.addPath(path);
				}
				scheduleRefreshOnVisible();
			}
		};

		const registerSessionListeners = (session: IDebugSession) => {
			this._register(session.onDidChangeName(async () => {
				const sessionRoot = root.find(session);
				if (sessionRoot) {
					sessionRoot.updateLabel(session.getLabel());
					scheduleRefreshOnVisible();
				}
			}));
			this._register(session.onDidLoadedSource(async event => {
				let sessionRoot: SessionTreeItem;
				switch (event.reason) {
					case 'new':
					case 'changed':
						sessionRoot = root.add(session);
						await sessionRoot.addPath(event.source);
						scheduleRefreshOnVisible();
						if (event.reason === 'changed') {
							DebugContentProvider.refreshDebugContent(event.source.uri);
						}
						break;
					case 'removed':
						sessionRoot = root.find(session);
						if (sessionRoot && sessionRoot.removePath(event.source)) {
							scheduleRefreshOnVisible();
						}
						break;
					default:
						this.filter.setFilter(event.source.name);
						this.tree.refilter();
						break;
				}
			}));
		};

		this._register(this.debugService.onDidNewSession(registerSessionListeners));
		this.debugService.getModel().getSessions().forEach(registerSessionListeners);

		this._register(this.debugService.onDidEndSession(({ session }) => {
			root.remove(session.getId());
			this.changeScheduler.schedule();
		}));

		this.changeScheduler.schedule(0);

		this._register(this.onDidChangeBodyVisibility(visible => {
			if (visible && this.treeNeedsRefreshOnVisible) {
				this.changeScheduler.schedule();
			}
		}));

		// feature: expand all nodes when filtering (not when finding)
		let viewState: IViewState | undefined;
		this._register(this.tree.onDidChangeFindPattern(pattern => {
			if (this.tree.findMode === TreeFindMode.Highlight) {
				return;
			}

			if (!viewState && pattern) {
				const expanded = new Set<string>();
				const visit = (node: ITreeNode<BaseTreeItem | null, FuzzyScore>) => {
					if (node.element && !node.collapsed) {
						expanded.add(node.element.getId());
					}

					for (const child of node.children) {
						visit(child);
					}
				};

				visit(this.tree.getNode());
				viewState = { expanded };
				this.tree.expandAll();
			} else if (!pattern && viewState) {
				this.tree.setFocus([]);
				updateView(viewState);
				viewState = undefined;
			}
		}));

		// populate tree model with source paths from all debug sessions
		this.debugService.getModel().getSessions().forEach(session => addSourcePathsToSession(session));
	}

	protected override layoutBody(height: number, width: number): void {
		super.layoutBody(height, width);
		this.tree.layout(height, width);
	}

	collapseAll(): void {
		this.tree.collapseAll();
	}

	override dispose(): void {
		dispose(this.tree);
		dispose(this.treeLabels);
		super.dispose();
	}
}

class LoadedScriptsDelegate implements IListVirtualDelegate<LoadedScriptsItem> {

	getHeight(element: LoadedScriptsItem): number {
		return 22;
	}

	getTemplateId(element: LoadedScriptsItem): string {
		return LoadedScriptsRenderer.ID;
	}
}

interface ILoadedScriptsItemTemplateData {
	label: IResourceLabel;
}

class LoadedScriptsRenderer implements ICompressibleTreeRenderer<BaseTreeItem, FuzzyScore, ILoadedScriptsItemTemplateData> {

	static readonly ID = 'lsrenderer';

	constructor(
		private labels: ResourceLabels
	) {
	}

	get templateId(): string {
		return LoadedScriptsRenderer.ID;
	}

	renderTemplate(container: HTMLElement): ILoadedScriptsItemTemplateData {
		const label = this.labels.create(container, { supportHighlights: true });
		return { label };
	}

	renderElement(node: ITreeNode<BaseTreeItem, FuzzyScore>, index: number, data: ILoadedScriptsItemTemplateData): void {

		const element = node.element;
		const label = element.getLabel();

		this.render(element, label, data, node.filterData);
	}

	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<BaseTreeItem>, FuzzyScore>, index: number, data: ILoadedScriptsItemTemplateData): void {

		const element = node.element.elements[node.element.elements.length - 1];
		const labels = node.element.elements.map(e => e.getLabel());

		this.render(element, labels, data, node.filterData);
	}

	private render(element: BaseTreeItem, labels: string | string[], data: ILoadedScriptsItemTemplateData, filterData: FuzzyScore | undefined) {

		const label: IResourceLabelProps = {
			name: labels
		};
		const options: IResourceLabelOptions = {
			title: element.getHoverLabel()
		};

		if (element instanceof RootFolderTreeItem) {

			options.fileKind = FileKind.ROOT_FOLDER;

		} else if (element instanceof SessionTreeItem) {

			options.title = nls.localize('loadedScriptsSession', "Debug Session");
			options.hideIcon = true;

		} else if (element instanceof BaseTreeItem) {

			const src = element.getSource();
			if (src && src.uri) {
				label.resource = src.uri;
				options.fileKind = FileKind.FILE;
			} else {
				options.fileKind = FileKind.FOLDER;
			}
		}
		options.matches = createMatches(filterData);

		data.label.setResource(label, options);
	}

	disposeTemplate(templateData: ILoadedScriptsItemTemplateData): void {
		templateData.label.dispose();
	}
}

class LoadedSciptsAccessibilityProvider implements IListAccessibilityProvider<LoadedScriptsItem> {

	getWidgetAriaLabel(): string {
		return nls.localize({ comment: ['Debug is a noun in this context, not a verb.'], key: 'loadedScriptsAriaLabel' }, "Debug Loaded Scripts");
	}

	getAriaLabel(element: LoadedScriptsItem): string {

		if (element instanceof RootFolderTreeItem) {
			return nls.localize('loadedScriptsRootFolderAriaLabel', "Workspace folder {0}, loaded script, debug", element.getLabel());
		}

		if (element instanceof SessionTreeItem) {
			return nls.localize('loadedScriptsSessionAriaLabel', "Session {0}, loaded script, debug", element.getLabel());
		}

		if (element.hasChildren()) {
			return nls.localize('loadedScriptsFolderAriaLabel', "Folder {0}, loaded script, debug", element.getLabel());
		} else {
			return nls.localize('loadedScriptsSourceAriaLabel', "{0}, loaded script, debug", element.getLabel());
		}
	}
}

class LoadedScriptsFilter implements ITreeFilter<BaseTreeItem, FuzzyScore> {

	private filterText: string | undefined;

	setFilter(filterText: string) {
		this.filterText = filterText;
	}

	filter(element: BaseTreeItem, parentVisibility: TreeVisibility): TreeFilterResult<FuzzyScore> {

		if (!this.filterText) {
			return TreeVisibility.Visible;
		}

		if (element.isLeaf()) {
			const name = element.getLabel();
			if (name.indexOf(this.filterText) >= 0) {
				return TreeVisibility.Visible;
			}
			return TreeVisibility.Hidden;
		}
		return TreeVisibility.Recurse;
	}
}
registerAction2(class Collapse extends ViewAction<LoadedScriptsView> {
	constructor() {
		super({
			id: 'loadedScripts.collapse',
			viewId: LOADED_SCRIPTS_VIEW_ID,
			title: nls.localize('collapse', "Collapse All"),
			f1: false,
			icon: Codicon.collapseAll,
			menu: {
				id: MenuId.ViewTitle,
				order: 30,
				group: 'navigation',
				when: ContextKeyExpr.equals('view', LOADED_SCRIPTS_VIEW_ID)
			}
		});
	}

	runInView(_accessor: ServicesAccessor, view: LoadedScriptsView) {
		view.collapseAll();
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/rawDebugSession.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/rawDebugSession.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import * as objects from '../../../../base/common/objects.js';
import { toAction } from '../../../../base/common/actions.js';
import * as errors from '../../../../base/common/errors.js';
import { createErrorWithActions } from '../../../../base/common/errorMessage.js';
import { formatPII, isUriString } from '../common/debugUtils.js';
import { IDebugAdapter, IConfig, AdapterEndEvent, IDebugger } from '../common/debug.js';
import { IExtensionHostDebugService, IOpenExtensionWindowResult } from '../../../../platform/debug/common/extensionHostDebug.js';
import { URI } from '../../../../base/common/uri.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IDisposable, dispose } from '../../../../base/common/lifecycle.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { Schemas } from '../../../../base/common/network.js';

/**
 * This interface represents a single command line argument split into a "prefix" and a "path" half.
 * The optional "prefix" contains arbitrary text and the optional "path" contains a file system path.
 * Concatenating both results in the original command line argument.
 */
interface ILaunchVSCodeArgument {
	prefix?: string;
	path?: string;
}

interface ILaunchVSCodeArguments {
	args: ILaunchVSCodeArgument[];
	debugRenderer?: boolean;
	env?: { [key: string]: string | null };
}

/**
 * Encapsulates the DebugAdapter lifecycle and some idiosyncrasies of the Debug Adapter Protocol.
 */
export class RawDebugSession implements IDisposable {

	private allThreadsContinued = true;
	private _readyForBreakpoints = false;
	private _capabilities: DebugProtocol.Capabilities;

	// shutdown
	private debugAdapterStopped = false;
	private inShutdown = false;
	private terminated = false;
	private firedAdapterExitEvent = false;

	// telemetry
	private startTime = 0;
	private didReceiveStoppedEvent = false;

	// DAP events
	private readonly _onDidInitialize = new Emitter<DebugProtocol.InitializedEvent>();
	private readonly _onDidStop = new Emitter<DebugProtocol.StoppedEvent>();
	private readonly _onDidContinued = new Emitter<DebugProtocol.ContinuedEvent>();
	private readonly _onDidTerminateDebugee = new Emitter<DebugProtocol.TerminatedEvent>();
	private readonly _onDidExitDebugee = new Emitter<DebugProtocol.ExitedEvent>();
	private readonly _onDidThread = new Emitter<DebugProtocol.ThreadEvent>();
	private readonly _onDidOutput = new Emitter<DebugProtocol.OutputEvent>();
	private readonly _onDidBreakpoint = new Emitter<DebugProtocol.BreakpointEvent>();
	private readonly _onDidLoadedSource = new Emitter<DebugProtocol.LoadedSourceEvent>();
	private readonly _onDidProgressStart = new Emitter<DebugProtocol.ProgressStartEvent>();
	private readonly _onDidProgressUpdate = new Emitter<DebugProtocol.ProgressUpdateEvent>();
	private readonly _onDidProgressEnd = new Emitter<DebugProtocol.ProgressEndEvent>();
	private readonly _onDidInvalidated = new Emitter<DebugProtocol.InvalidatedEvent>();
	private readonly _onDidInvalidateMemory = new Emitter<DebugProtocol.MemoryEvent>();
	private readonly _onDidCustomEvent = new Emitter<DebugProtocol.Event>();
	private readonly _onDidEvent = new Emitter<DebugProtocol.Event>();

	// DA events
	private readonly _onDidExitAdapter = new Emitter<AdapterEndEvent>();
	private debugAdapter: IDebugAdapter | null;
	private stoppedSinceLastStep = false;

	private toDispose: IDisposable[] = [];

	constructor(
		debugAdapter: IDebugAdapter,
		public readonly dbgr: IDebugger,
		private readonly sessionId: string,
		private readonly name: string,
		@IExtensionHostDebugService private readonly extensionHostDebugService: IExtensionHostDebugService,
		@IOpenerService private readonly openerService: IOpenerService,
		@INotificationService private readonly notificationService: INotificationService,
		@IDialogService private readonly dialogSerivce: IDialogService,
	) {
		this.debugAdapter = debugAdapter;
		this._capabilities = Object.create(null);

		this.toDispose.push(this.debugAdapter.onError(err => {
			this.shutdown(err);
		}));

		this.toDispose.push(this.debugAdapter.onExit(code => {
			if (code !== 0) {
				this.shutdown(new Error(`exit code: ${code}`));
			} else {
				// normal exit
				this.shutdown();
			}
		}));

		this.debugAdapter.onEvent(event => {
			switch (event.event) {
				case 'initialized':
					this._readyForBreakpoints = true;
					this._onDidInitialize.fire(event);
					break;
				case 'loadedSource':
					this._onDidLoadedSource.fire(<DebugProtocol.LoadedSourceEvent>event);
					break;
				case 'capabilities':
					if (event.body) {
						const capabilities = (<DebugProtocol.CapabilitiesEvent>event).body.capabilities;
						this.mergeCapabilities(capabilities);
					}
					break;
				case 'stopped':
					this.didReceiveStoppedEvent = true;		// telemetry: remember that debugger stopped successfully
					this.stoppedSinceLastStep = true;
					this._onDidStop.fire(<DebugProtocol.StoppedEvent>event);
					break;
				case 'continued':
					this.allThreadsContinued = (<DebugProtocol.ContinuedEvent>event).body.allThreadsContinued === false ? false : true;
					this._onDidContinued.fire(<DebugProtocol.ContinuedEvent>event);
					break;
				case 'thread':
					this._onDidThread.fire(<DebugProtocol.ThreadEvent>event);
					break;
				case 'output':
					this._onDidOutput.fire(<DebugProtocol.OutputEvent>event);
					break;
				case 'breakpoint':
					this._onDidBreakpoint.fire(<DebugProtocol.BreakpointEvent>event);
					break;
				case 'terminated':
					this._onDidTerminateDebugee.fire(<DebugProtocol.TerminatedEvent>event);
					break;
				case 'exited':
					this._onDidExitDebugee.fire(<DebugProtocol.ExitedEvent>event);
					break;
				case 'progressStart':
					this._onDidProgressStart.fire(event as DebugProtocol.ProgressStartEvent);
					break;
				case 'progressUpdate':
					this._onDidProgressUpdate.fire(event as DebugProtocol.ProgressUpdateEvent);
					break;
				case 'progressEnd':
					this._onDidProgressEnd.fire(event as DebugProtocol.ProgressEndEvent);
					break;
				case 'invalidated':
					this._onDidInvalidated.fire(event as DebugProtocol.InvalidatedEvent);
					break;
				case 'memory':
					this._onDidInvalidateMemory.fire(event as DebugProtocol.MemoryEvent);
					break;
				case 'process':
					break;
				case 'module':
					break;
				default:
					this._onDidCustomEvent.fire(event);
					break;
			}
			this._onDidEvent.fire(event);
		});

		this.debugAdapter.onRequest(request => this.dispatchRequest(request));
	}

	get isInShutdown() {
		return this.inShutdown;
	}

	get onDidExitAdapter(): Event<AdapterEndEvent> {
		return this._onDidExitAdapter.event;
	}

	get capabilities(): DebugProtocol.Capabilities {
		return this._capabilities;
	}

	/**
	 * DA is ready to accepts setBreakpoint requests.
	 * Becomes true after "initialized" events has been received.
	 */
	get readyForBreakpoints(): boolean {
		return this._readyForBreakpoints;
	}

	//---- DAP events

	get onDidInitialize(): Event<DebugProtocol.InitializedEvent> {
		return this._onDidInitialize.event;
	}

	get onDidStop(): Event<DebugProtocol.StoppedEvent> {
		return this._onDidStop.event;
	}

	get onDidContinued(): Event<DebugProtocol.ContinuedEvent> {
		return this._onDidContinued.event;
	}

	get onDidTerminateDebugee(): Event<DebugProtocol.TerminatedEvent> {
		return this._onDidTerminateDebugee.event;
	}

	get onDidExitDebugee(): Event<DebugProtocol.ExitedEvent> {
		return this._onDidExitDebugee.event;
	}

	get onDidThread(): Event<DebugProtocol.ThreadEvent> {
		return this._onDidThread.event;
	}

	get onDidOutput(): Event<DebugProtocol.OutputEvent> {
		return this._onDidOutput.event;
	}

	get onDidBreakpoint(): Event<DebugProtocol.BreakpointEvent> {
		return this._onDidBreakpoint.event;
	}

	get onDidLoadedSource(): Event<DebugProtocol.LoadedSourceEvent> {
		return this._onDidLoadedSource.event;
	}

	get onDidCustomEvent(): Event<DebugProtocol.Event> {
		return this._onDidCustomEvent.event;
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

	get onDidInvalidated(): Event<DebugProtocol.InvalidatedEvent> {
		return this._onDidInvalidated.event;
	}

	get onDidInvalidateMemory(): Event<DebugProtocol.MemoryEvent> {
		return this._onDidInvalidateMemory.event;
	}

	get onDidEvent(): Event<DebugProtocol.Event> {
		return this._onDidEvent.event;
	}

	//---- DebugAdapter lifecycle

	/**
	 * Starts the underlying debug adapter and tracks the session time for telemetry.
	 */
	async start(): Promise<void> {
		if (!this.debugAdapter) {
			return Promise.reject(new Error(nls.localize('noDebugAdapterStart', "No debug adapter, can not start debug session.")));
		}

		await this.debugAdapter.startSession();
		this.startTime = new Date().getTime();
	}

	/**
	 * Send client capabilities to the debug adapter and receive DA capabilities in return.
	 */
	async initialize(args: DebugProtocol.InitializeRequestArguments): Promise<DebugProtocol.InitializeResponse | undefined> {
		const response = await this.send('initialize', args, undefined, undefined, false);
		if (response) {
			this.mergeCapabilities(response.body);
		}

		return response;
	}

	/**
	 * Terminate the debuggee and shutdown the adapter
	 */
	disconnect(args: DebugProtocol.DisconnectArguments): Promise<any> {
		const terminateDebuggee = this.capabilities.supportTerminateDebuggee ? args.terminateDebuggee : undefined;
		const suspendDebuggee = this.capabilities.supportTerminateDebuggee && this.capabilities.supportSuspendDebuggee ? args.suspendDebuggee : undefined;
		return this.shutdown(undefined, args.restart, terminateDebuggee, suspendDebuggee);
	}

	//---- DAP requests

	async launchOrAttach(config: IConfig): Promise<DebugProtocol.Response | undefined> {
		const response = await this.send(config.request, config, undefined, undefined, false);
		if (response) {
			this.mergeCapabilities(response.body);
		}

		return response;
	}

	/**
	 * Try killing the debuggee softly...
	 */
	terminate(restart = false): Promise<DebugProtocol.TerminateResponse | undefined> {
		if (this.capabilities.supportsTerminateRequest) {
			if (!this.terminated) {
				this.terminated = true;
				return this.send('terminate', { restart }, undefined);
			}
			return this.disconnect({ terminateDebuggee: true, restart });
		}
		return Promise.reject(new Error('terminated not supported'));
	}

	restart(args: DebugProtocol.RestartArguments): Promise<DebugProtocol.RestartResponse | undefined> {
		if (this.capabilities.supportsRestartRequest) {
			return this.send('restart', args);
		}
		return Promise.reject(new Error('restart not supported'));
	}

	async next(args: DebugProtocol.NextArguments): Promise<DebugProtocol.NextResponse | undefined> {
		this.stoppedSinceLastStep = false;
		const response = await this.send('next', args);
		if (!this.stoppedSinceLastStep) {
			this.fireSimulatedContinuedEvent(args.threadId);
		}
		return response;
	}

	async stepIn(args: DebugProtocol.StepInArguments): Promise<DebugProtocol.StepInResponse | undefined> {
		this.stoppedSinceLastStep = false;
		const response = await this.send('stepIn', args);
		if (!this.stoppedSinceLastStep) {
			this.fireSimulatedContinuedEvent(args.threadId);
		}
		return response;
	}

	async stepOut(args: DebugProtocol.StepOutArguments): Promise<DebugProtocol.StepOutResponse | undefined> {
		this.stoppedSinceLastStep = false;
		const response = await this.send('stepOut', args);
		if (!this.stoppedSinceLastStep) {
			this.fireSimulatedContinuedEvent(args.threadId);
		}
		return response;
	}

	async continue(args: DebugProtocol.ContinueArguments): Promise<DebugProtocol.ContinueResponse | undefined> {
		this.stoppedSinceLastStep = false;
		const response = await this.send<DebugProtocol.ContinueResponse>('continue', args);
		if (response && response.body && response.body.allThreadsContinued !== undefined) {
			this.allThreadsContinued = response.body.allThreadsContinued;
		}
		if (!this.stoppedSinceLastStep) {
			this.fireSimulatedContinuedEvent(args.threadId, this.allThreadsContinued);
		}

		return response;
	}

	pause(args: DebugProtocol.PauseArguments): Promise<DebugProtocol.PauseResponse | undefined> {
		return this.send('pause', args);
	}

	terminateThreads(args: DebugProtocol.TerminateThreadsArguments): Promise<DebugProtocol.TerminateThreadsResponse | undefined> {
		if (this.capabilities.supportsTerminateThreadsRequest) {
			return this.send('terminateThreads', args);
		}
		return Promise.reject(new Error('terminateThreads not supported'));
	}

	setVariable(args: DebugProtocol.SetVariableArguments): Promise<DebugProtocol.SetVariableResponse | undefined> {
		if (this.capabilities.supportsSetVariable) {
			return this.send<DebugProtocol.SetVariableResponse>('setVariable', args);
		}
		return Promise.reject(new Error('setVariable not supported'));
	}

	setExpression(args: DebugProtocol.SetExpressionArguments): Promise<DebugProtocol.SetExpressionResponse | undefined> {
		if (this.capabilities.supportsSetExpression) {
			return this.send<DebugProtocol.SetExpressionResponse>('setExpression', args);
		}
		return Promise.reject(new Error('setExpression not supported'));
	}

	async restartFrame(args: DebugProtocol.RestartFrameArguments, threadId: number): Promise<DebugProtocol.RestartFrameResponse | undefined> {
		if (this.capabilities.supportsRestartFrame) {
			this.stoppedSinceLastStep = false;
			const response = await this.send('restartFrame', args);
			if (!this.stoppedSinceLastStep) {
				this.fireSimulatedContinuedEvent(threadId);
			}
			return response;
		}
		return Promise.reject(new Error('restartFrame not supported'));
	}

	stepInTargets(args: DebugProtocol.StepInTargetsArguments): Promise<DebugProtocol.StepInTargetsResponse | undefined> {
		if (this.capabilities.supportsStepInTargetsRequest) {
			return this.send('stepInTargets', args);
		}
		return Promise.reject(new Error('stepInTargets not supported'));
	}

	completions(args: DebugProtocol.CompletionsArguments, token: CancellationToken): Promise<DebugProtocol.CompletionsResponse | undefined> {
		if (this.capabilities.supportsCompletionsRequest) {
			return this.send<DebugProtocol.CompletionsResponse>('completions', args, token);
		}
		return Promise.reject(new Error('completions not supported'));
	}

	setBreakpoints(args: DebugProtocol.SetBreakpointsArguments): Promise<DebugProtocol.SetBreakpointsResponse | undefined> {
		return this.send<DebugProtocol.SetBreakpointsResponse>('setBreakpoints', args);
	}

	setFunctionBreakpoints(args: DebugProtocol.SetFunctionBreakpointsArguments): Promise<DebugProtocol.SetFunctionBreakpointsResponse | undefined> {
		if (this.capabilities.supportsFunctionBreakpoints) {
			return this.send<DebugProtocol.SetFunctionBreakpointsResponse>('setFunctionBreakpoints', args);
		}
		return Promise.reject(new Error('setFunctionBreakpoints not supported'));
	}

	dataBreakpointInfo(args: DebugProtocol.DataBreakpointInfoArguments): Promise<DebugProtocol.DataBreakpointInfoResponse | undefined> {
		if (this.capabilities.supportsDataBreakpoints) {
			return this.send<DebugProtocol.DataBreakpointInfoResponse>('dataBreakpointInfo', args);
		}
		return Promise.reject(new Error('dataBreakpointInfo not supported'));
	}

	setDataBreakpoints(args: DebugProtocol.SetDataBreakpointsArguments): Promise<DebugProtocol.SetDataBreakpointsResponse | undefined> {
		if (this.capabilities.supportsDataBreakpoints) {
			return this.send<DebugProtocol.SetDataBreakpointsResponse>('setDataBreakpoints', args);
		}
		return Promise.reject(new Error('setDataBreakpoints not supported'));
	}

	setExceptionBreakpoints(args: DebugProtocol.SetExceptionBreakpointsArguments): Promise<DebugProtocol.SetExceptionBreakpointsResponse | undefined> {
		return this.send<DebugProtocol.SetExceptionBreakpointsResponse>('setExceptionBreakpoints', args);
	}

	breakpointLocations(args: DebugProtocol.BreakpointLocationsArguments): Promise<DebugProtocol.BreakpointLocationsResponse | undefined> {
		if (this.capabilities.supportsBreakpointLocationsRequest) {
			return this.send('breakpointLocations', args);
		}
		return Promise.reject(new Error('breakpointLocations is not supported'));
	}

	configurationDone(): Promise<DebugProtocol.ConfigurationDoneResponse | undefined> {
		if (this.capabilities.supportsConfigurationDoneRequest) {
			return this.send('configurationDone', null);
		}
		return Promise.reject(new Error('configurationDone not supported'));
	}

	stackTrace(args: DebugProtocol.StackTraceArguments, token: CancellationToken): Promise<DebugProtocol.StackTraceResponse | undefined> {
		return this.send<DebugProtocol.StackTraceResponse>('stackTrace', args, token);
	}

	exceptionInfo(args: DebugProtocol.ExceptionInfoArguments): Promise<DebugProtocol.ExceptionInfoResponse | undefined> {
		if (this.capabilities.supportsExceptionInfoRequest) {
			return this.send<DebugProtocol.ExceptionInfoResponse>('exceptionInfo', args);
		}
		return Promise.reject(new Error('exceptionInfo not supported'));
	}

	scopes(args: DebugProtocol.ScopesArguments, token: CancellationToken): Promise<DebugProtocol.ScopesResponse | undefined> {
		return this.send<DebugProtocol.ScopesResponse>('scopes', args, token);
	}

	variables(args: DebugProtocol.VariablesArguments, token?: CancellationToken): Promise<DebugProtocol.VariablesResponse | undefined> {
		return this.send<DebugProtocol.VariablesResponse>('variables', args, token);
	}

	source(args: DebugProtocol.SourceArguments): Promise<DebugProtocol.SourceResponse | undefined> {
		return this.send<DebugProtocol.SourceResponse>('source', args);
	}

	locations(args: DebugProtocol.LocationsArguments): Promise<DebugProtocol.LocationsResponse | undefined> {
		return this.send<DebugProtocol.LocationsResponse>('locations', args);
	}

	loadedSources(args: DebugProtocol.LoadedSourcesArguments): Promise<DebugProtocol.LoadedSourcesResponse | undefined> {
		if (this.capabilities.supportsLoadedSourcesRequest) {
			return this.send<DebugProtocol.LoadedSourcesResponse>('loadedSources', args);
		}
		return Promise.reject(new Error('loadedSources not supported'));
	}

	threads(): Promise<DebugProtocol.ThreadsResponse | undefined> {
		return this.send<DebugProtocol.ThreadsResponse>('threads', null);
	}

	evaluate(args: DebugProtocol.EvaluateArguments): Promise<DebugProtocol.EvaluateResponse | undefined> {
		return this.send<DebugProtocol.EvaluateResponse>('evaluate', args);
	}

	async stepBack(args: DebugProtocol.StepBackArguments): Promise<DebugProtocol.StepBackResponse | undefined> {
		if (this.capabilities.supportsStepBack) {
			this.stoppedSinceLastStep = false;
			const response = await this.send('stepBack', args);
			if (!this.stoppedSinceLastStep) {
				this.fireSimulatedContinuedEvent(args.threadId);
			}
			return response;
		}
		return Promise.reject(new Error('stepBack not supported'));
	}

	async reverseContinue(args: DebugProtocol.ReverseContinueArguments): Promise<DebugProtocol.ReverseContinueResponse | undefined> {
		if (this.capabilities.supportsStepBack) {
			this.stoppedSinceLastStep = false;
			const response = await this.send('reverseContinue', args);
			if (!this.stoppedSinceLastStep) {
				this.fireSimulatedContinuedEvent(args.threadId);
			}
			return response;
		}
		return Promise.reject(new Error('reverseContinue not supported'));
	}

	gotoTargets(args: DebugProtocol.GotoTargetsArguments): Promise<DebugProtocol.GotoTargetsResponse | undefined> {
		if (this.capabilities.supportsGotoTargetsRequest) {
			return this.send('gotoTargets', args);
		}
		return Promise.reject(new Error('gotoTargets is not supported'));
	}

	async goto(args: DebugProtocol.GotoArguments): Promise<DebugProtocol.GotoResponse | undefined> {
		if (this.capabilities.supportsGotoTargetsRequest) {
			this.stoppedSinceLastStep = false;
			const response = await this.send('goto', args);
			if (!this.stoppedSinceLastStep) {
				this.fireSimulatedContinuedEvent(args.threadId);
			}
			return response;
		}

		return Promise.reject(new Error('goto is not supported'));
	}

	async setInstructionBreakpoints(args: DebugProtocol.SetInstructionBreakpointsArguments): Promise<DebugProtocol.SetInstructionBreakpointsResponse | undefined> {
		if (this.capabilities.supportsInstructionBreakpoints) {
			return await this.send('setInstructionBreakpoints', args);
		}

		return Promise.reject(new Error('setInstructionBreakpoints is not supported'));
	}

	async disassemble(args: DebugProtocol.DisassembleArguments): Promise<DebugProtocol.DisassembleResponse | undefined> {
		if (this.capabilities.supportsDisassembleRequest) {
			return await this.send('disassemble', args);
		}

		return Promise.reject(new Error('disassemble is not supported'));
	}

	async readMemory(args: DebugProtocol.ReadMemoryArguments): Promise<DebugProtocol.ReadMemoryResponse | undefined> {
		if (this.capabilities.supportsReadMemoryRequest) {
			return await this.send('readMemory', args);
		}

		return Promise.reject(new Error('readMemory is not supported'));
	}

	async writeMemory(args: DebugProtocol.WriteMemoryArguments): Promise<DebugProtocol.WriteMemoryResponse | undefined> {
		if (this.capabilities.supportsWriteMemoryRequest) {
			return await this.send('writeMemory', args);
		}

		return Promise.reject(new Error('writeMemory is not supported'));
	}

	cancel(args: DebugProtocol.CancelArguments): Promise<DebugProtocol.CancelResponse | undefined> {
		return this.send('cancel', args);
	}

	custom(request: string, args: any): Promise<DebugProtocol.Response | undefined> {
		return this.send(request, args);
	}

	//---- private

	private async shutdown(error?: Error, restart = false, terminateDebuggee: boolean | undefined = undefined, suspendDebuggee: boolean | undefined = undefined): Promise<void> {
		if (!this.inShutdown) {
			this.inShutdown = true;
			if (this.debugAdapter) {
				try {
					const args: DebugProtocol.DisconnectArguments = { restart };
					if (typeof terminateDebuggee === 'boolean') {
						args.terminateDebuggee = terminateDebuggee;
					}

					if (typeof suspendDebuggee === 'boolean') {
						args.suspendDebuggee = suspendDebuggee;
					}

					// if there's an error, the DA is probably already gone, so give it a much shorter timeout.
					await this.send('disconnect', args, undefined, error ? 200 : 2000);
				} catch (e) {
					// Catch the potential 'disconnect' error - no need to show it to the user since the adapter is shutting down
				} finally {
					await this.stopAdapter(error);
				}
			} else {
				return this.stopAdapter(error);
			}
		}
	}

	private async stopAdapter(error?: Error): Promise<void> {
		try {
			if (this.debugAdapter) {
				const da = this.debugAdapter;
				this.debugAdapter = null;
				await da.stopSession();
				this.debugAdapterStopped = true;
			}
		} finally {
			this.fireAdapterExitEvent(error);
		}
	}

	private fireAdapterExitEvent(error?: Error): void {
		if (!this.firedAdapterExitEvent) {
			this.firedAdapterExitEvent = true;

			const e: AdapterEndEvent = {
				emittedStopped: this.didReceiveStoppedEvent,
				sessionLengthInSeconds: (new Date().getTime() - this.startTime) / 1000
			};
			if (error && !this.debugAdapterStopped) {
				e.error = error;
			}
			this._onDidExitAdapter.fire(e);
		}
	}

	private async dispatchRequest(request: DebugProtocol.Request): Promise<void> {

		const response: DebugProtocol.Response = {
			type: 'response',
			seq: 0,
			command: request.command,
			request_seq: request.seq,
			success: true
		};

		const safeSendResponse = (response: DebugProtocol.Response) => this.debugAdapter && this.debugAdapter.sendResponse(response);

		if (request.command === 'launchVSCode') {
			try {
				let result = await this.launchVsCode(<ILaunchVSCodeArguments>request.arguments);
				if (!result.success) {
					const { confirmed } = await this.dialogSerivce.confirm({
						type: Severity.Warning,
						message: nls.localize('canNotStart', "The debugger needs to open a new tab or window for the debuggee but the browser prevented this. You must give permission to continue."),
						primaryButton: nls.localize({ key: 'continue', comment: ['&& denotes a mnemonic'] }, "&&Continue")
					});
					if (confirmed) {
						result = await this.launchVsCode(<ILaunchVSCodeArguments>request.arguments);
					} else {
						response.success = false;
						safeSendResponse(response);
						await this.shutdown();
					}
				}
				response.body = {
					rendererDebugAddr: result.rendererDebugAddr,
				};
				safeSendResponse(response);
			} catch (err) {
				response.success = false;
				response.message = err.message;
				safeSendResponse(response);
			}
		} else if (request.command === 'runInTerminal') {
			try {
				const shellProcessId = await this.dbgr.runInTerminal(request.arguments as DebugProtocol.RunInTerminalRequestArguments, this.sessionId);
				const resp = response as DebugProtocol.RunInTerminalResponse;
				resp.body = {};
				if (typeof shellProcessId === 'number') {
					resp.body.shellProcessId = shellProcessId;
				}
				safeSendResponse(resp);
			} catch (err) {
				response.success = false;
				response.message = err.message;
				safeSendResponse(response);
			}
		} else if (request.command === 'startDebugging') {
			try {
				const args = (request.arguments as DebugProtocol.StartDebuggingRequestArguments);
				const config: IConfig = {
					...args.configuration,
					...{
						request: args.request,
						type: this.dbgr.type,
						name: args.configuration.name || this.name
					}
				};
				const success = await this.dbgr.startDebugging(config, this.sessionId);
				if (success) {
					safeSendResponse(response);
				} else {
					response.success = false;
					response.message = 'Failed to start debugging';
					safeSendResponse(response);
				}
			} catch (err) {
				response.success = false;
				response.message = err.message;
				safeSendResponse(response);
			}
		} else {
			response.success = false;
			response.message = `unknown request '${request.command}'`;
			safeSendResponse(response);
		}
	}

	private launchVsCode(vscodeArgs: ILaunchVSCodeArguments): Promise<IOpenExtensionWindowResult> {

		const args: string[] = [];

		for (const arg of vscodeArgs.args) {
			const a2 = (arg.prefix || '') + (arg.path || '');
			const match = /^--(.+)=(.+)$/.exec(a2);
			if (match && match.length === 3) {
				const key = match[1];
				let value = match[2];

				if ((key === 'file-uri' || key === 'folder-uri') && !isUriString(arg.path)) {
					value = isUriString(value) ? value : URI.file(value).toString();
				}
				args.push(`--${key}=${value}`);
			} else {
				args.push(a2);
			}
		}

		if (vscodeArgs.env) {
			args.push(`--extensionEnvironment=${JSON.stringify(vscodeArgs.env)}`);
		}

		return this.extensionHostDebugService.openExtensionDevelopmentHostWindow(args, !!vscodeArgs.debugRenderer);
	}

	private send<R extends DebugProtocol.Response>(command: string, args: any, token?: CancellationToken, timeout?: number, showErrors = true): Promise<R | undefined> {
		return new Promise<DebugProtocol.Response | undefined>((completeDispatch, errorDispatch) => {
			if (!this.debugAdapter) {
				if (this.inShutdown) {
					// We are in shutdown silently complete
					completeDispatch(undefined);
				} else {
					errorDispatch(new Error(nls.localize('noDebugAdapter', "No debugger available found. Can not send '{0}'.", command)));
				}
				return;
			}

			let cancelationListener: IDisposable;
			const requestId = this.debugAdapter.sendRequest(command, args, (response: DebugProtocol.Response) => {
				cancelationListener?.dispose();

				if (response.success) {
					completeDispatch(response);
				} else {
					errorDispatch(response);
				}
			}, timeout);

			if (token) {
				cancelationListener = token.onCancellationRequested(() => {
					cancelationListener.dispose();
					if (this.capabilities.supportsCancelRequest) {
						this.cancel({ requestId });
					}
				});
			}
		}).then(undefined, err => Promise.reject(this.handleErrorResponse(err, showErrors)));
	}

	private handleErrorResponse(errorResponse: DebugProtocol.Response, showErrors: boolean): Error {

		if (errorResponse.command === 'canceled' && errorResponse.message === 'canceled') {
			return new errors.CancellationError();
		}

		const error: DebugProtocol.Message | undefined = errorResponse?.body?.error;
		const errorMessage = errorResponse?.message || '';

		const userMessage = error ? formatPII(error.format, false, error.variables) : errorMessage;
		const url = error?.url;
		if (error && url) {
			const label = error.urlLabel ? error.urlLabel : nls.localize('moreInfo', "More Info");
			const uri = URI.parse(url);
			// Use a suffixed id if uri invokes a command, so default 'Open launch.json' command is suppressed on dialog
			const actionId = uri.scheme === Schemas.command ? 'debug.moreInfo.command' : 'debug.moreInfo';
			return createErrorWithActions(userMessage, [toAction({ id: actionId, label, run: () => this.openerService.open(uri, { allowCommands: true }) })]);
		}
		if (showErrors && error && error.format && error.showUser) {
			this.notificationService.error(userMessage);
		}
		const result = new errors.ErrorNoTelemetry(userMessage);
		(result as { showUser?: boolean }).showUser = error?.showUser;

		return result;
	}

	private mergeCapabilities(capabilities: DebugProtocol.Capabilities | undefined): void {
		if (capabilities) {
			this._capabilities = objects.mixin(this._capabilities, capabilities);
		}
	}

	private fireSimulatedContinuedEvent(threadId: number, allThreadsContinued = false): void {
		this._onDidContinued.fire({
			type: 'event',
			event: 'continued',
			body: {
				threadId,
				allThreadsContinued
			},
			seq: undefined!
		});
	}

	dispose(): void {
		dispose(this.toDispose);
	}
}
```

--------------------------------------------------------------------------------

````
