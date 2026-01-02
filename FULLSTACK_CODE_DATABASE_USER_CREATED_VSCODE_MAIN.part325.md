---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 325
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 325 of 552)

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

---[FILE: src/vs/workbench/browser/layout.ts]---
Location: vscode-main/src/vs/workbench/browser/layout.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableMap, DisposableStore, IDisposable, toDisposable } from '../../base/common/lifecycle.js';
import { Event, Emitter } from '../../base/common/event.js';
import { EventType, addDisposableListener, getClientArea, size, IDimension, isAncestorUsingFlowTo, computeScreenAwareSize, getActiveDocument, getWindows, getActiveWindow, isActiveDocument, getWindow, getWindowId, getActiveElement, Dimension } from '../../base/browser/dom.js';
import { onDidChangeFullscreen, isFullscreen, isWCOEnabled } from '../../base/browser/browser.js';
import { isWindows, isLinux, isMacintosh, isWeb, isIOS } from '../../base/common/platform.js';
import { EditorInputCapabilities, GroupIdentifier, isResourceEditorInput, IUntypedEditorInput, pathsToEditors } from '../common/editor.js';
import { SidebarPart } from './parts/sidebar/sidebarPart.js';
import { PanelPart } from './parts/panel/panelPart.js';
import { Position, Parts, PartOpensMaximizedOptions, IWorkbenchLayoutService, positionFromString, positionToString, partOpensMaximizedFromString, PanelAlignment, ActivityBarPosition, LayoutSettings, MULTI_WINDOW_PARTS, SINGLE_WINDOW_PARTS, ZenModeSettings, EditorTabsMode, EditorActionsLocation, shouldShowCustomTitleBar, isHorizontal, isMultiWindowPart } from '../services/layout/browser/layoutService.js';
import { isTemporaryWorkspace, IWorkspaceContextService, WorkbenchState } from '../../platform/workspace/common/workspace.js';
import { IStorageService, StorageScope, StorageTarget } from '../../platform/storage/common/storage.js';
import { IConfigurationChangeEvent, IConfigurationService, isConfigured } from '../../platform/configuration/common/configuration.js';
import { ITitleService } from '../services/title/browser/titleService.js';
import { ServicesAccessor } from '../../platform/instantiation/common/instantiation.js';
import { StartupKind, ILifecycleService } from '../services/lifecycle/common/lifecycle.js';
import { getMenuBarVisibility, IPath, hasNativeTitlebar, hasCustomTitlebar, TitleBarSetting, CustomTitleBarVisibility, useWindowControlsOverlay, DEFAULT_EMPTY_WINDOW_SIZE, DEFAULT_WORKSPACE_WINDOW_SIZE, hasNativeMenu, MenuSettings } from '../../platform/window/common/window.js';
import { IHostService } from '../services/host/browser/host.js';
import { IBrowserWorkbenchEnvironmentService } from '../services/environment/browser/environmentService.js';
import { IEditorService } from '../services/editor/common/editorService.js';
import { EditorGroupLayout, GroupOrientation, GroupsOrder, IEditorGroupsService } from '../services/editor/common/editorGroupsService.js';
import { SerializableGrid, ISerializableView, ISerializedGrid, Orientation, ISerializedNode, ISerializedLeafNode, Direction, IViewSize, Sizing } from '../../base/browser/ui/grid/grid.js';
import { Part } from './part.js';
import { IStatusbarService } from '../services/statusbar/browser/statusbar.js';
import { IFileService } from '../../platform/files/common/files.js';
import { isCodeEditor } from '../../editor/browser/editorBrowser.js';
import { coalesce } from '../../base/common/arrays.js';
import { assertReturnsDefined } from '../../base/common/types.js';
import { INotificationService, NotificationsFilter } from '../../platform/notification/common/notification.js';
import { IThemeService } from '../../platform/theme/common/themeService.js';
import { WINDOW_ACTIVE_BORDER, WINDOW_INACTIVE_BORDER } from '../common/theme.js';
import { LineNumbersType } from '../../editor/common/config/editorOptions.js';
import { URI } from '../../base/common/uri.js';
import { IViewDescriptorService, ViewContainerLocation } from '../common/views.js';
import { DiffEditorInput } from '../common/editor/diffEditorInput.js';
import { mark } from '../../base/common/performance.js';
import { IExtensionService } from '../services/extensions/common/extensions.js';
import { ILogService } from '../../platform/log/common/log.js';
import { DeferredPromise, Promises } from '../../base/common/async.js';
import { IBannerService } from '../services/banner/browser/bannerService.js';
import { IPaneCompositePartService } from '../services/panecomposite/browser/panecomposite.js';
import { AuxiliaryBarPart } from './parts/auxiliarybar/auxiliaryBarPart.js';
import { ITelemetryService } from '../../platform/telemetry/common/telemetry.js';
import { IAuxiliaryWindowService } from '../services/auxiliaryWindow/browser/auxiliaryWindowService.js';
import { CodeWindow, mainWindow } from '../../base/browser/window.js';

//#region Layout Implementation

interface ILayoutRuntimeState {
	activeContainerId: number;
	mainWindowFullscreen: boolean;
	readonly maximized: Set<number>;
	hasFocus: boolean;
	mainWindowBorder: boolean;
	readonly menuBar: {
		toggled: boolean;
	};
	readonly zenMode: {
		readonly transitionDisposables: DisposableMap<string, IDisposable>;
	};
}

interface IEditorToOpen {
	readonly editor: IUntypedEditorInput;
	readonly viewColumn?: number;
}

interface ILayoutInitializationState {
	readonly views: {
		readonly defaults: string[] | undefined;
		readonly containerToRestore: {
			sideBar?: string;
			panel?: string;
			auxiliaryBar?: string;
		};
	};
	readonly editor: {
		readonly restoreEditors: boolean;
		readonly editorsToOpen: Promise<IEditorToOpen[]>;
	};
	readonly layout?: {
		readonly editors?: EditorGroupLayout;
	};
}

interface ILayoutState {
	readonly runtime: ILayoutRuntimeState;
	readonly initialization: ILayoutInitializationState;
}

enum LayoutClasses {
	SIDEBAR_HIDDEN = 'nosidebar',
	MAIN_EDITOR_AREA_HIDDEN = 'nomaineditorarea',
	PANEL_HIDDEN = 'nopanel',
	AUXILIARYBAR_HIDDEN = 'noauxiliarybar',
	STATUSBAR_HIDDEN = 'nostatusbar',
	FULLSCREEN = 'fullscreen',
	MAXIMIZED = 'maximized',
	WINDOW_BORDER = 'border'
}

interface IPathToOpen extends IPath {
	readonly viewColumn?: number;
}

interface IInitialEditorsState {
	readonly filesToOpenOrCreate?: IPathToOpen[];
	readonly filesToDiff?: IPathToOpen[];
	readonly filesToMerge?: IPathToOpen[];

	readonly layout?: EditorGroupLayout;
}

const COMMAND_CENTER_SETTINGS = [
	'chat.commandCenter.enabled',
	'workbench.navigationControl.enabled',
	'workbench.experimental.share.enabled',
];

export const TITLE_BAR_SETTINGS = [
	LayoutSettings.ACTIVITY_BAR_LOCATION,
	LayoutSettings.COMMAND_CENTER,
	...COMMAND_CENTER_SETTINGS,
	LayoutSettings.EDITOR_ACTIONS_LOCATION,
	LayoutSettings.LAYOUT_ACTIONS,
	MenuSettings.MenuBarVisibility,
	TitleBarSetting.TITLE_BAR_STYLE,
	TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY,
];

const DEFAULT_EMPTY_WINDOW_DIMENSIONS = new Dimension(DEFAULT_EMPTY_WINDOW_SIZE.width, DEFAULT_EMPTY_WINDOW_SIZE.height);
const DEFAULT_WORKSPACE_WINDOW_DIMENSIONS = new Dimension(DEFAULT_WORKSPACE_WINDOW_SIZE.width, DEFAULT_WORKSPACE_WINDOW_SIZE.height);

export abstract class Layout extends Disposable implements IWorkbenchLayoutService {

	declare readonly _serviceBrand: undefined;

	//#region Events

	private readonly _onDidChangeZenMode = this._register(new Emitter<boolean>());
	readonly onDidChangeZenMode = this._onDidChangeZenMode.event;

	private readonly _onDidChangeMainEditorCenteredLayout = this._register(new Emitter<boolean>());
	readonly onDidChangeMainEditorCenteredLayout = this._onDidChangeMainEditorCenteredLayout.event;

	private readonly _onDidChangePanelAlignment = this._register(new Emitter<PanelAlignment>());
	readonly onDidChangePanelAlignment = this._onDidChangePanelAlignment.event;

	private readonly _onDidChangeWindowMaximized = this._register(new Emitter<{ windowId: number; maximized: boolean }>());
	readonly onDidChangeWindowMaximized = this._onDidChangeWindowMaximized.event;

	private readonly _onDidChangePanelPosition = this._register(new Emitter<string>());
	readonly onDidChangePanelPosition = this._onDidChangePanelPosition.event;

	private readonly _onDidChangePartVisibility = this._register(new Emitter<void>());
	readonly onDidChangePartVisibility = this._onDidChangePartVisibility.event;

	private readonly _onDidChangeNotificationsVisibility = this._register(new Emitter<boolean>());
	readonly onDidChangeNotificationsVisibility = this._onDidChangeNotificationsVisibility.event;

	private readonly _onDidChangeAuxiliaryBarMaximized = this._register(new Emitter<void>());
	readonly onDidChangeAuxiliaryBarMaximized = this._onDidChangeAuxiliaryBarMaximized.event;

	private readonly _onDidLayoutMainContainer = this._register(new Emitter<IDimension>());
	readonly onDidLayoutMainContainer = this._onDidLayoutMainContainer.event;

	private readonly _onDidLayoutActiveContainer = this._register(new Emitter<IDimension>());
	readonly onDidLayoutActiveContainer = this._onDidLayoutActiveContainer.event;

	private readonly _onDidLayoutContainer = this._register(new Emitter<{ container: HTMLElement; dimension: IDimension }>());
	readonly onDidLayoutContainer = this._onDidLayoutContainer.event;

	private readonly _onDidAddContainer = this._register(new Emitter<{ container: HTMLElement; disposables: DisposableStore }>());
	readonly onDidAddContainer = this._onDidAddContainer.event;

	private readonly _onDidChangeActiveContainer = this._register(new Emitter<void>());
	readonly onDidChangeActiveContainer = this._onDidChangeActiveContainer.event;

	//#endregion

	//#region Properties

	readonly mainContainer = document.createElement('div');
	get activeContainer() { return this.getContainerFromDocument(getActiveDocument()); }
	get containers(): Iterable<HTMLElement> {
		const containers: HTMLElement[] = [];
		for (const { window } of getWindows()) {
			containers.push(this.getContainerFromDocument(window.document));
		}

		return containers;
	}

	private getContainerFromDocument(targetDocument: Document): HTMLElement {
		if (targetDocument === this.mainContainer.ownerDocument) {
			return this.mainContainer; // main window
		} else {
			// eslint-disable-next-line no-restricted-syntax
			return targetDocument.body.getElementsByClassName('monaco-workbench')[0] as HTMLElement; // auxiliary window
		}
	}

	private readonly containerStylesLoaded = new Map<number /* window ID */, Promise<void>>();
	whenContainerStylesLoaded(window: CodeWindow): Promise<void> | undefined {
		return this.containerStylesLoaded.get(window.vscodeWindowId);
	}

	private _mainContainerDimension!: IDimension;
	get mainContainerDimension(): IDimension { return this._mainContainerDimension; }

	get activeContainerDimension(): IDimension {
		return this.getContainerDimension(this.activeContainer);
	}

	private getContainerDimension(container: HTMLElement): IDimension {
		if (container === this.mainContainer) {
			return this.mainContainerDimension; // main window
		} else {
			return getClientArea(container); 	// auxiliary window
		}
	}

	get mainContainerOffset() {
		return this.computeContainerOffset(mainWindow);
	}

	get activeContainerOffset() {
		return this.computeContainerOffset(getWindow(this.activeContainer));
	}

	private computeContainerOffset(targetWindow: Window) {
		let top = 0;
		let quickPickTop = 0;

		if (this.isVisible(Parts.BANNER_PART)) {
			top = this.getPart(Parts.BANNER_PART).maximumHeight;
			quickPickTop = top;
		}

		const titlebarVisible = this.isVisible(Parts.TITLEBAR_PART, targetWindow);
		if (titlebarVisible) {
			top += this.getPart(Parts.TITLEBAR_PART).maximumHeight;
			quickPickTop = top;
		}

		const isCommandCenterVisible = titlebarVisible && this.configurationService.getValue<boolean>(LayoutSettings.COMMAND_CENTER) !== false;
		if (isCommandCenterVisible) {
			// If the command center is visible then the quickinput
			// should go over the title bar and the banner
			quickPickTop = 6;
		}

		return { top, quickPickTop };
	}

	//#endregion

	private readonly parts = new Map<string, Part>();

	private initialized = false;
	private workbenchGrid!: SerializableGrid<ISerializableView>;

	private titleBarPartView!: ISerializableView;
	private bannerPartView!: ISerializableView;
	private activityBarPartView!: ISerializableView;
	private sideBarPartView!: ISerializableView;
	private panelPartView!: ISerializableView;
	private auxiliaryBarPartView!: ISerializableView;
	private editorPartView!: ISerializableView;
	private statusBarPartView!: ISerializableView;

	private environmentService!: IBrowserWorkbenchEnvironmentService;
	private extensionService!: IExtensionService;
	private configurationService!: IConfigurationService;
	private storageService!: IStorageService;
	private hostService!: IHostService;
	private editorService!: IEditorService;
	private mainPartEditorService!: IEditorService;
	private editorGroupService!: IEditorGroupsService;
	private paneCompositeService!: IPaneCompositePartService;
	private titleService!: ITitleService;
	private viewDescriptorService!: IViewDescriptorService;
	private contextService!: IWorkspaceContextService;
	private notificationService!: INotificationService;
	private themeService!: IThemeService;
	private statusBarService!: IStatusbarService;
	private logService!: ILogService;
	private telemetryService!: ITelemetryService;
	private auxiliaryWindowService!: IAuxiliaryWindowService;

	private state!: ILayoutState;
	private stateModel!: LayoutStateModel;

	private disposed = false;

	constructor(
		protected readonly parent: HTMLElement,
		private readonly layoutOptions?: { resetLayout: boolean }
	) {
		super();
	}

	protected initLayout(accessor: ServicesAccessor): void {

		// Services
		this.environmentService = accessor.get(IBrowserWorkbenchEnvironmentService);
		this.configurationService = accessor.get(IConfigurationService);
		this.hostService = accessor.get(IHostService);
		this.contextService = accessor.get(IWorkspaceContextService);
		this.storageService = accessor.get(IStorageService);
		this.themeService = accessor.get(IThemeService);
		this.extensionService = accessor.get(IExtensionService);
		this.logService = accessor.get(ILogService);
		this.telemetryService = accessor.get(ITelemetryService);
		this.auxiliaryWindowService = accessor.get(IAuxiliaryWindowService);

		// Parts
		this.editorService = accessor.get(IEditorService);
		this.editorGroupService = accessor.get(IEditorGroupsService);
		this.mainPartEditorService = this.editorService.createScoped(this.editorGroupService.mainPart, this._store);
		this.paneCompositeService = accessor.get(IPaneCompositePartService);
		this.viewDescriptorService = accessor.get(IViewDescriptorService);
		this.titleService = accessor.get(ITitleService);
		this.notificationService = accessor.get(INotificationService);
		this.statusBarService = accessor.get(IStatusbarService);
		accessor.get(IBannerService);

		// Listeners
		this.registerLayoutListeners();

		// State
		this.initLayoutState(accessor.get(ILifecycleService), accessor.get(IFileService));
	}

	private registerLayoutListeners(): void {

		// Restore editor if hidden and an editor is to show
		const showEditorIfHidden = () => {
			if (!this.isVisible(Parts.EDITOR_PART, mainWindow)) {
				if (this.isAuxiliaryBarMaximized()) {
					this.toggleMaximizedAuxiliaryBar();
				} else {
					this.toggleMaximizedPanel();
				}
			}
		};

		// Wait to register these listeners after the editor group service
		// is ready to avoid conflicts on startup
		this.editorGroupService.whenRestored.then(() => {

			// Restore main editor part on any editor change in main part
			this._register(this.mainPartEditorService.onDidVisibleEditorsChange(showEditorIfHidden));
			this._register(this.editorGroupService.mainPart.onDidActivateGroup(showEditorIfHidden));

			// Revalidate center layout when active editor changes: diff editor quits centered mode.
			this._register(this.mainPartEditorService.onDidActiveEditorChange(() => this.centerMainEditorLayout(this.stateModel.getRuntimeValue(LayoutStateKeys.MAIN_EDITOR_CENTERED))));
		});

		// Configuration changes
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if ([
				...TITLE_BAR_SETTINGS,
				LegacyWorkbenchLayoutSettings.SIDEBAR_POSITION,
				LegacyWorkbenchLayoutSettings.STATUSBAR_VISIBLE,
			].some(setting => e.affectsConfiguration(setting))) {

				// Show Command Center if command center actions enabled
				const shareEnabled = e.affectsConfiguration('workbench.experimental.share.enabled') && this.configurationService.getValue<boolean>('workbench.experimental.share.enabled');
				const navigationControlEnabled = e.affectsConfiguration('workbench.navigationControl.enabled') && this.configurationService.getValue<boolean>('workbench.navigationControl.enabled');

				// Currently not supported for "chat.commandCenter.enabled" as we
				// programatically set this during setup and could lead to unwanted titlebar appearing
				// const chatControlsEnabled = e.affectsConfiguration('chat.commandCenter.enabled') && this.configurationService.getValue<boolean>('chat.commandCenter.enabled');

				if (shareEnabled || navigationControlEnabled) {
					if (this.configurationService.getValue<boolean>(LayoutSettings.COMMAND_CENTER) === false) {
						this.configurationService.updateValue(LayoutSettings.COMMAND_CENTER, true);
						return; // onDidChangeConfiguration will be triggered again
					}
				}

				// Show Custom TitleBar if actions enabled in (or moved to) the titlebar
				const editorActionsMovedToTitlebar = e.affectsConfiguration(LayoutSettings.EDITOR_ACTIONS_LOCATION) && this.configurationService.getValue<EditorActionsLocation>(LayoutSettings.EDITOR_ACTIONS_LOCATION) === EditorActionsLocation.TITLEBAR;
				const commandCenterEnabled = e.affectsConfiguration(LayoutSettings.COMMAND_CENTER) && this.configurationService.getValue<boolean>(LayoutSettings.COMMAND_CENTER);
				const layoutControlsEnabled = e.affectsConfiguration(LayoutSettings.LAYOUT_ACTIONS) && this.configurationService.getValue<boolean>(LayoutSettings.LAYOUT_ACTIONS);
				const activityBarMovedToTopOrBottom = e.affectsConfiguration(LayoutSettings.ACTIVITY_BAR_LOCATION) && [ActivityBarPosition.TOP, ActivityBarPosition.BOTTOM].includes(this.configurationService.getValue<ActivityBarPosition>(LayoutSettings.ACTIVITY_BAR_LOCATION));

				if (activityBarMovedToTopOrBottom || editorActionsMovedToTitlebar || commandCenterEnabled || layoutControlsEnabled) {
					if (this.configurationService.getValue<CustomTitleBarVisibility>(TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY) === CustomTitleBarVisibility.NEVER) {
						this.configurationService.updateValue(TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY, CustomTitleBarVisibility.AUTO);
						return; // onDidChangeConfiguration will be triggered again
					}
				}

				this.doUpdateLayoutConfiguration();
			}
		}));

		// Fullscreen changes
		this._register(onDidChangeFullscreen(windowId => this.onFullscreenChanged(windowId)));

		// Group changes
		this._register(this.editorGroupService.mainPart.onDidAddGroup(() => this.centerMainEditorLayout(this.stateModel.getRuntimeValue(LayoutStateKeys.MAIN_EDITOR_CENTERED))));
		this._register(this.editorGroupService.mainPart.onDidRemoveGroup(() => this.centerMainEditorLayout(this.stateModel.getRuntimeValue(LayoutStateKeys.MAIN_EDITOR_CENTERED))));
		this._register(this.editorGroupService.mainPart.onDidChangeGroupMaximized(() => this.centerMainEditorLayout(this.stateModel.getRuntimeValue(LayoutStateKeys.MAIN_EDITOR_CENTERED))));

		// Prevent workbench from scrolling #55456
		this._register(addDisposableListener(this.mainContainer, EventType.SCROLL, () => this.mainContainer.scrollTop = 0));

		// Menubar visibility changes
		const showingCustomMenu = (isWindows || isLinux || isWeb) && !hasNativeTitlebar(this.configurationService);
		if (showingCustomMenu) {
			this._register(this.titleService.onMenubarVisibilityChange(visible => this.onMenubarToggled(visible)));
		}

		// Theme changes
		this._register(this.themeService.onDidColorThemeChange(() => this.updateWindowBorder()));

		// Window active / focus changes
		this._register(this.hostService.onDidChangeFocus(focused => this.onWindowFocusChanged(focused)));
		this._register(this.hostService.onDidChangeActiveWindow(() => this.onActiveWindowChanged()));

		// WCO changes
		if (isWeb && typeof (navigator as { windowControlsOverlay?: EventTarget }).windowControlsOverlay === 'object') {
			this._register(addDisposableListener((navigator as unknown as { windowControlsOverlay: EventTarget }).windowControlsOverlay, 'geometrychange', () => this.onDidChangeWCO()));
		}

		// Auxiliary windows
		this._register(this.auxiliaryWindowService.onDidOpenAuxiliaryWindow(({ window, disposables }) => {
			const windowId = window.window.vscodeWindowId;
			this.containerStylesLoaded.set(windowId, window.whenStylesHaveLoaded);
			window.whenStylesHaveLoaded.then(() => this.containerStylesLoaded.delete(windowId));
			disposables.add(toDisposable(() => this.containerStylesLoaded.delete(windowId)));

			const eventDisposables = disposables.add(new DisposableStore());
			this._onDidAddContainer.fire({ container: window.container, disposables: eventDisposables });

			disposables.add(window.onDidLayout(dimension => this.handleContainerDidLayout(window.container, dimension)));
		}));
	}

	private onMenubarToggled(visible: boolean): void {
		if (visible !== this.state.runtime.menuBar.toggled) {
			this.state.runtime.menuBar.toggled = visible;

			const menuBarVisibility = getMenuBarVisibility(this.configurationService);

			// The menu bar toggles the title bar in web because it does not need to be shown for window controls only
			if (isWeb && menuBarVisibility === 'toggle') {
				this.workbenchGrid.setViewVisible(this.titleBarPartView, shouldShowCustomTitleBar(this.configurationService, mainWindow, this.state.runtime.menuBar.toggled));
			}

			// The menu bar toggles the title bar in full screen for toggle and classic settings
			else if (this.state.runtime.mainWindowFullscreen && (menuBarVisibility === 'toggle' || menuBarVisibility === 'classic')) {
				this.workbenchGrid.setViewVisible(this.titleBarPartView, shouldShowCustomTitleBar(this.configurationService, mainWindow, this.state.runtime.menuBar.toggled));
			}

			// Move layout call to any time the menubar
			// is toggled to update consumers of offset
			// see issue #115267
			this.handleContainerDidLayout(this.mainContainer, this._mainContainerDimension);
		}
	}

	private handleContainerDidLayout(container: HTMLElement, dimension: IDimension): void {
		if (container === this.mainContainer) {
			this._onDidLayoutMainContainer.fire(dimension);
		}

		if (isActiveDocument(container)) {
			this._onDidLayoutActiveContainer.fire(dimension);
		}

		this._onDidLayoutContainer.fire({ container, dimension });
	}

	private onFullscreenChanged(windowId: number): void {
		if (windowId !== mainWindow.vscodeWindowId) {
			return; // ignore all but main window
		}

		this.state.runtime.mainWindowFullscreen = isFullscreen(mainWindow);

		// Apply as CSS class
		if (this.state.runtime.mainWindowFullscreen) {
			this.mainContainer.classList.add(LayoutClasses.FULLSCREEN);
		} else {
			this.mainContainer.classList.remove(LayoutClasses.FULLSCREEN);

			const zenModeExitInfo = this.stateModel.getRuntimeValue(LayoutStateKeys.ZEN_MODE_EXIT_INFO);
			if (zenModeExitInfo.transitionedToFullScreen && this.isZenModeActive()) {
				this.toggleZenMode();
			}
		}

		// Change edge snapping accordingly
		this.workbenchGrid.edgeSnapping = this.state.runtime.mainWindowFullscreen;

		// Changing fullscreen state of the main window has an impact
		// on custom title bar visibility, so we need to update
		if (hasCustomTitlebar(this.configurationService)) {

			// Propagate to grid
			this.workbenchGrid.setViewVisible(this.titleBarPartView, shouldShowCustomTitleBar(this.configurationService, mainWindow, this.state.runtime.menuBar.toggled));

			// Indicate active window border
			this.updateWindowBorder(true);
		}
	}

	private onActiveWindowChanged(): void {
		const activeContainerId = this.getActiveContainerId();
		if (this.state.runtime.activeContainerId !== activeContainerId) {
			this.state.runtime.activeContainerId = activeContainerId;

			// Indicate active window border
			this.updateWindowBorder();

			this._onDidChangeActiveContainer.fire();
		}
	}

	private onWindowFocusChanged(hasFocus: boolean): void {
		if (this.state.runtime.hasFocus !== hasFocus) {
			this.state.runtime.hasFocus = hasFocus;

			// Indicate active window border
			this.updateWindowBorder();
		}
	}

	private getActiveContainerId(): number {
		const activeContainer = this.activeContainer;

		return getWindow(activeContainer).vscodeWindowId;
	}

	private doUpdateLayoutConfiguration(skipLayout?: boolean): void {

		// Custom Titlebar visibility with native titlebar
		this.updateCustomTitleBarVisibility();

		// Menubar visibility
		this.updateMenubarVisibility(!!skipLayout);

		// Centered Layout
		this.editorGroupService.whenRestored.then(() => this.centerMainEditorLayout(this.stateModel.getRuntimeValue(LayoutStateKeys.MAIN_EDITOR_CENTERED), skipLayout));
	}

	private setSideBarPosition(position: Position): void {
		const activityBar = this.getPart(Parts.ACTIVITYBAR_PART);
		const sideBar = this.getPart(Parts.SIDEBAR_PART);
		const auxiliaryBar = this.getPart(Parts.AUXILIARYBAR_PART);
		const newPositionValue = (position === Position.LEFT) ? 'left' : 'right';
		const oldPositionValue = (position === Position.RIGHT) ? 'left' : 'right';
		const panelAlignment = this.getPanelAlignment();
		const panelPosition = this.getPanelPosition();

		this.stateModel.setRuntimeValue(LayoutStateKeys.SIDEBAR_POSITON, position);

		// Adjust CSS
		const activityBarContainer = assertReturnsDefined(activityBar.getContainer());
		const sideBarContainer = assertReturnsDefined(sideBar.getContainer());
		const auxiliaryBarContainer = assertReturnsDefined(auxiliaryBar.getContainer());
		activityBarContainer.classList.remove(oldPositionValue);
		sideBarContainer.classList.remove(oldPositionValue);
		activityBarContainer.classList.add(newPositionValue);
		sideBarContainer.classList.add(newPositionValue);

		// Auxiliary Bar has opposite values
		auxiliaryBarContainer.classList.remove(newPositionValue);
		auxiliaryBarContainer.classList.add(oldPositionValue);

		// Update Styles
		activityBar.updateStyles();
		sideBar.updateStyles();
		auxiliaryBar.updateStyles();

		// Move activity bar and side bars
		this.adjustPartPositions(position, panelAlignment, panelPosition);
	}

	private updateWindowBorder(skipLayout = false) {
		if (
			isWeb ||
			isWindows || 											// not working well with zooming (border often not visible)
			(
				(isWindows || isLinux) &&
				useWindowControlsOverlay(this.configurationService)	// Windows/Linux: not working with WCO (border cannot draw over the overlay)
			) ||
			hasNativeTitlebar(this.configurationService)
		) {
			return;
		}

		const theme = this.themeService.getColorTheme();

		const activeBorder = theme.getColor(WINDOW_ACTIVE_BORDER);
		const inactiveBorder = theme.getColor(WINDOW_INACTIVE_BORDER);

		const didHaveMainWindowBorder = this.hasMainWindowBorder();

		for (const container of this.containers) {
			const isMainContainer = container === this.mainContainer;
			const isActiveContainer = this.activeContainer === container;

			let windowBorder = false;
			if (!this.state.runtime.mainWindowFullscreen && (activeBorder || inactiveBorder)) {
				windowBorder = true;

				// If the inactive color is missing, fallback to the active one
				const borderColor = isActiveContainer && this.state.runtime.hasFocus ? activeBorder : inactiveBorder ?? activeBorder;
				container.style.setProperty('--window-border-color', borderColor?.toString() ?? 'transparent');
			}

			if (isMainContainer) {
				this.state.runtime.mainWindowBorder = windowBorder;
			}

			container.classList.toggle(LayoutClasses.WINDOW_BORDER, windowBorder);
		}

		if (!skipLayout && didHaveMainWindowBorder !== this.hasMainWindowBorder()) {
			this.layout();
		}
	}

	private initLayoutState(lifecycleService: ILifecycleService, fileService: IFileService): void {
		this._mainContainerDimension = getClientArea(this.parent, this.contextService.getWorkbenchState() === WorkbenchState.EMPTY ? DEFAULT_EMPTY_WINDOW_DIMENSIONS : DEFAULT_WORKSPACE_WINDOW_DIMENSIONS); // running with fallback to ensure no error is thrown (https://github.com/microsoft/vscode/issues/240242)

		this.stateModel = new LayoutStateModel(this.storageService, this.configurationService, this.contextService, this.environmentService);
		this.stateModel.load({
			mainContainerDimension: this._mainContainerDimension,
			resetLayout: Boolean(this.layoutOptions?.resetLayout)
		});

		this._register(this.stateModel.onDidChangeState(change => {
			if (change.key === LayoutStateKeys.ACTIVITYBAR_HIDDEN) {
				this.setActivityBarHidden(change.value as boolean);
			}

			if (change.key === LayoutStateKeys.STATUSBAR_HIDDEN) {
				this.setStatusBarHidden(change.value as boolean);
			}

			if (change.key === LayoutStateKeys.SIDEBAR_POSITON) {
				this.setSideBarPosition(change.value as Position);
			}

			if (change.key === LayoutStateKeys.PANEL_POSITION) {
				this.setPanelPosition(change.value as Position);
			}

			if (change.key === LayoutStateKeys.PANEL_ALIGNMENT) {
				this.setPanelAlignment(change.value as PanelAlignment);
			}

			this.doUpdateLayoutConfiguration();
		}));

		// Layout Initialization State
		const initialEditorsState = this.getInitialEditorsState();
		if (initialEditorsState) {
			this.logService.trace('Initial editor state', initialEditorsState);
		}
		const initialLayoutState: ILayoutInitializationState = {
			layout: {
				editors: initialEditorsState?.layout
			},
			editor: {
				restoreEditors: this.shouldRestoreEditors(this.contextService, initialEditorsState),
				editorsToOpen: this.resolveEditorsToOpen(fileService, initialEditorsState),
			},
			views: {
				defaults: this.getDefaultLayoutViews(this.environmentService, this.storageService),
				containerToRestore: {}
			}
		};

		// Layout Runtime State
		const layoutRuntimeState: ILayoutRuntimeState = {
			activeContainerId: this.getActiveContainerId(),
			mainWindowFullscreen: isFullscreen(mainWindow),
			hasFocus: this.hostService.hasFocus,
			maximized: new Set<number>(),
			mainWindowBorder: false,
			menuBar: {
				toggled: false,
			},
			zenMode: {
				transitionDisposables: new DisposableMap(),
			}
		};

		this.state = {
			initialization: initialLayoutState,
			runtime: layoutRuntimeState,
		};

		// Sidebar View Container To Restore
		if (this.isVisible(Parts.SIDEBAR_PART)) {
			let viewContainerToRestore = this.storageService.get(SidebarPart.activeViewletSettingsKey, StorageScope.WORKSPACE, this.viewDescriptorService.getDefaultViewContainer(ViewContainerLocation.Sidebar)?.id);
			if (
				!this.environmentService.isBuilt ||
				lifecycleService.startupKind === StartupKind.ReloadedWindow ||
				this.environmentService.isExtensionDevelopment && !this.environmentService.extensionTestsLocationURI
			) {
				// allow to restore a non-default viewlet in development mode or when window reloads
			} else if (
				viewContainerToRestore !== this.viewDescriptorService.getDefaultViewContainer(ViewContainerLocation.Sidebar)?.id &&
				viewContainerToRestore !== this.viewDescriptorService.getDefaultViewContainer(ViewContainerLocation.AuxiliaryBar)?.id
			) {
				// fallback to default viewlet otherwise if the viewlet is not a default viewlet
				viewContainerToRestore = this.viewDescriptorService.getDefaultViewContainer(ViewContainerLocation.Sidebar)?.id;
			}

			if (viewContainerToRestore) {
				this.state.initialization.views.containerToRestore.sideBar = viewContainerToRestore;
			} else {
				this.stateModel.setRuntimeValue(LayoutStateKeys.SIDEBAR_HIDDEN, true);
			}
		}

		// Panel View Container To Restore
		if (this.isVisible(Parts.PANEL_PART)) {
			const viewContainerToRestore = this.storageService.get(PanelPart.activePanelSettingsKey, StorageScope.WORKSPACE, this.viewDescriptorService.getDefaultViewContainer(ViewContainerLocation.Panel)?.id);

			if (viewContainerToRestore) {
				this.state.initialization.views.containerToRestore.panel = viewContainerToRestore;
			} else {
				this.stateModel.setRuntimeValue(LayoutStateKeys.PANEL_HIDDEN, true);
			}
		}

		// Auxiliary View to restore
		if (this.isVisible(Parts.AUXILIARYBAR_PART)) {
			const viewContainerToRestore = this.storageService.get(AuxiliaryBarPart.activeViewSettingsKey, StorageScope.WORKSPACE, this.viewDescriptorService.getDefaultViewContainer(ViewContainerLocation.AuxiliaryBar)?.id);
			if (viewContainerToRestore) {
				this.state.initialization.views.containerToRestore.auxiliaryBar = viewContainerToRestore;
			} else {
				this.stateModel.setRuntimeValue(LayoutStateKeys.AUXILIARYBAR_HIDDEN, true);
			}
		}

		// Window border
		this.updateWindowBorder(true);
	}

	private getDefaultLayoutViews(environmentService: IBrowserWorkbenchEnvironmentService, storageService: IStorageService): string[] | undefined {
		const defaultLayout = environmentService.options?.defaultLayout;
		if (!defaultLayout) {
			return undefined;
		}

		if (!defaultLayout.force && !storageService.isNew(StorageScope.WORKSPACE)) {
			return undefined;
		}

		const { views } = defaultLayout;
		if (views?.length) {
			return views.map(view => view.id);
		}

		return undefined;
	}

	private shouldRestoreEditors(contextService: IWorkspaceContextService, initialEditorsState: IInitialEditorsState | undefined): boolean {

		// Restore editors based on a set of rules:
		// - never when running on temporary workspace
		// - not when we have files to open, unless:
		// - always when `window.restoreWindows: preserve`

		if (isTemporaryWorkspace(contextService.getWorkspace())) {
			return false;
		}

		const forceRestoreEditors = this.configurationService.getValue<string>('window.restoreWindows') === 'preserve';
		return !!forceRestoreEditors || initialEditorsState === undefined;
	}

	protected willRestoreEditors(): boolean {
		return this.state.initialization.editor.restoreEditors;
	}

	private async resolveEditorsToOpen(fileService: IFileService, initialEditorsState: IInitialEditorsState | undefined): Promise<IEditorToOpen[]> {
		if (initialEditorsState) {

			// Merge editor (single)
			const filesToMerge = coalesce(await pathsToEditors(initialEditorsState.filesToMerge, fileService, this.logService));
			if (filesToMerge.length === 4 && isResourceEditorInput(filesToMerge[0]) && isResourceEditorInput(filesToMerge[1]) && isResourceEditorInput(filesToMerge[2]) && isResourceEditorInput(filesToMerge[3])) {
				return [{
					editor: {
						input1: { resource: filesToMerge[0].resource },
						input2: { resource: filesToMerge[1].resource },
						base: { resource: filesToMerge[2].resource },
						result: { resource: filesToMerge[3].resource },
						options: { pinned: true }
					}
				}];
			}

			// Diff editor (single)
			const filesToDiff = coalesce(await pathsToEditors(initialEditorsState.filesToDiff, fileService, this.logService));
			if (filesToDiff.length === 2) {
				return [{
					editor: {
						original: { resource: filesToDiff[0].resource },
						modified: { resource: filesToDiff[1].resource },
						options: { pinned: true }
					}
				}];
			}

			// Normal editor (multiple)
			const filesToOpenOrCreate: IEditorToOpen[] = [];
			const resolvedFilesToOpenOrCreate = await pathsToEditors(initialEditorsState.filesToOpenOrCreate, fileService, this.logService);
			for (let i = 0; i < resolvedFilesToOpenOrCreate.length; i++) {
				const resolvedFileToOpenOrCreate = resolvedFilesToOpenOrCreate[i];
				if (resolvedFileToOpenOrCreate) {
					filesToOpenOrCreate.push({
						editor: resolvedFileToOpenOrCreate,
						viewColumn: initialEditorsState.filesToOpenOrCreate?.[i].viewColumn // take over `viewColumn` from initial state
					});
				}
			}

			return filesToOpenOrCreate;
		}

		// Empty workbench configured to open untitled file if empty
		else if (this.contextService.getWorkbenchState() === WorkbenchState.EMPTY && this.configurationService.getValue('workbench.startupEditor') === 'newUntitledFile') {
			if (this.editorGroupService.hasRestorableState) {
				return []; // do not open any empty untitled file if we restored groups/editors from previous session
			}

			return [{
				editor: { resource: undefined } // open empty untitled file
			}];
		}

		return [];
	}

	private _openedDefaultEditors: boolean = false;
	get openedDefaultEditors() { return this._openedDefaultEditors; }

	private getInitialEditorsState(): IInitialEditorsState | undefined {

		// Check for editors / editor layout from `defaultLayout` options first
		const defaultLayout = this.environmentService.options?.defaultLayout;
		if ((defaultLayout?.editors?.length || defaultLayout?.layout?.editors) && (defaultLayout.force || this.storageService.isNew(StorageScope.WORKSPACE))) {
			this._openedDefaultEditors = true;

			return {
				layout: defaultLayout.layout?.editors,
				filesToOpenOrCreate: defaultLayout?.editors?.map(editor => {
					return {
						viewColumn: editor.viewColumn,
						fileUri: URI.revive(editor.uri),
						openOnlyIfExists: editor.openOnlyIfExists,
						options: editor.options
					};
				})
			};
		}

		// Then check for files to open, create or diff/merge from main side
		const { filesToOpenOrCreate, filesToDiff, filesToMerge } = this.environmentService;
		if (filesToOpenOrCreate || filesToDiff || filesToMerge) {
			return { filesToOpenOrCreate, filesToDiff, filesToMerge };
		}

		return undefined;
	}

	private readonly whenReadyPromise = new DeferredPromise<void>();
	protected readonly whenReady = this.whenReadyPromise.p;

	private readonly whenRestoredPromise = new DeferredPromise<void>();
	readonly whenRestored = this.whenRestoredPromise.p;
	private restored = false;

	isRestored(): boolean {
		return this.restored;
	}

	protected restoreParts(): void {

		// distinguish long running restore operations that
		// are required for the layout to be ready from those
		// that are needed to signal restoring is done
		const layoutReadyPromises: Promise<unknown>[] = [];
		const layoutRestoredPromises: Promise<unknown>[] = [];

		// Restore editors
		layoutReadyPromises.push((async () => {
			mark('code/willRestoreEditors');

			// first ensure the editor part is ready
			await this.editorGroupService.whenReady;
			mark('code/restoreEditors/editorGroupsReady');

			// apply editor layout if any
			if (this.state.initialization.layout?.editors) {
				this.editorGroupService.mainPart.applyLayout(this.state.initialization.layout.editors);
			}

			// then see for editors to open as instructed
			// it is important that we trigger this from
			// the overall restore flow to reduce possible
			// flicker on startup: we want any editor to
			// open to get a chance to open first before
			// signaling that layout is restored, but we do
			// not need to await the editors from having
			// fully loaded.

			const editors = await this.state.initialization.editor.editorsToOpen;
			mark('code/restoreEditors/editorsToOpenResolved');

			let openEditorsPromise: Promise<unknown> | undefined = undefined;
			if (editors.length) {

				// we have to map editors to their groups as instructed
				// by the input. this is important to ensure that we open
				// the editors in the groups they belong to.

				const editorGroupsInVisualOrder = this.editorGroupService.mainPart.getGroups(GroupsOrder.GRID_APPEARANCE);
				const mapEditorsToGroup = new Map<GroupIdentifier, Set<IUntypedEditorInput>>();

				for (const editor of editors) {
					const group = editorGroupsInVisualOrder[(editor.viewColumn ?? 1) - 1]; // viewColumn is index+1 based

					let editorsByGroup = mapEditorsToGroup.get(group.id);
					if (!editorsByGroup) {
						editorsByGroup = new Set<IUntypedEditorInput>();
						mapEditorsToGroup.set(group.id, editorsByGroup);
					}

					editorsByGroup.add(editor.editor);
				}

				openEditorsPromise = Promise.all(Array.from(mapEditorsToGroup).map(async ([groupId, editors]) => {
					try {
						await this.editorService.openEditors(Array.from(editors), groupId, { validateTrust: true });
					} catch (error) {
						this.logService.error(error);
					}
				}));
			}

			// do not block the overall layout ready flow from potentially
			// slow editors to resolve on startup
			layoutRestoredPromises.push(
				Promise.all([
					openEditorsPromise?.finally(() => mark('code/restoreEditors/editorsOpened')),
					this.editorGroupService.whenRestored.finally(() => mark('code/restoreEditors/editorGroupsRestored'))
				]).finally(() => {
					// the `code/didRestoreEditors` perf mark is specifically
					// for when visible editors have resolved, so we only mark
					// if when editor group service has restored.
					mark('code/didRestoreEditors');
				})
			);
		})());

		// Restore default views (only when `IDefaultLayout` is provided)
		const restoreDefaultViewsPromise = (async () => {
			if (this.state.initialization.views.defaults?.length) {
				mark('code/willOpenDefaultViews');

				const locationsRestored: { id: string; order: number }[] = [];

				const tryOpenView = (view: { id: string; order: number }): boolean => {
					const location = this.viewDescriptorService.getViewLocationById(view.id);
					if (location !== null) {
						const container = this.viewDescriptorService.getViewContainerByViewId(view.id);
						if (container) {
							if (view.order >= (locationsRestored?.[location]?.order ?? 0)) {
								locationsRestored[location] = { id: container.id, order: view.order };
							}

							const containerModel = this.viewDescriptorService.getViewContainerModel(container);
							containerModel.setCollapsed(view.id, false);
							containerModel.setVisible(view.id, true);

							return true;
						}
					}

					return false;
				};

				const defaultViews = [...this.state.initialization.views.defaults].reverse().map((v, index) => ({ id: v, order: index }));

				let i = defaultViews.length;
				while (i) {
					i--;
					if (tryOpenView(defaultViews[i])) {
						defaultViews.splice(i, 1);
					}
				}

				// If we still have views left over, wait until all extensions have been registered and try again
				if (defaultViews.length) {
					await this.extensionService.whenInstalledExtensionsRegistered();

					let i = defaultViews.length;
					while (i) {
						i--;
						if (tryOpenView(defaultViews[i])) {
							defaultViews.splice(i, 1);
						}
					}
				}

				// If we opened a view in the sidebar, stop any restore there
				if (locationsRestored[ViewContainerLocation.Sidebar]) {
					this.state.initialization.views.containerToRestore.sideBar = locationsRestored[ViewContainerLocation.Sidebar].id;
				}

				// If we opened a view in the panel, stop any restore there
				if (locationsRestored[ViewContainerLocation.Panel]) {
					this.state.initialization.views.containerToRestore.panel = locationsRestored[ViewContainerLocation.Panel].id;
				}

				// If we opened a view in the auxiliary bar, stop any restore there
				if (locationsRestored[ViewContainerLocation.AuxiliaryBar]) {
					this.state.initialization.views.containerToRestore.auxiliaryBar = locationsRestored[ViewContainerLocation.AuxiliaryBar].id;
				}

				mark('code/didOpenDefaultViews');
			}
		})();
		layoutReadyPromises.push(restoreDefaultViewsPromise);

		// Restore Sidebar
		layoutReadyPromises.push((async () => {

			// Restoring views could mean that sidebar already
			// restored, as such we need to test again
			await restoreDefaultViewsPromise;
			if (!this.state.initialization.views.containerToRestore.sideBar) {
				return;
			}

			mark('code/willRestoreViewlet');

			await this.openViewContainer(ViewContainerLocation.Sidebar, this.state.initialization.views.containerToRestore.sideBar);

			mark('code/didRestoreViewlet');
		})());

		// Restore Panel
		layoutReadyPromises.push((async () => {

			// Restoring views could mean that panel already
			// restored, as such we need to test again
			await restoreDefaultViewsPromise;
			if (!this.state.initialization.views.containerToRestore.panel) {
				return;
			}

			mark('code/willRestorePanel');

			await this.openViewContainer(ViewContainerLocation.Panel, this.state.initialization.views.containerToRestore.panel);

			mark('code/didRestorePanel');
		})());

		// Restore Auxiliary Bar
		layoutReadyPromises.push((async () => {

			// Restoring views could mean that auxbar already
			// restored, as such we need to test again
			await restoreDefaultViewsPromise;
			if (!this.state.initialization.views.containerToRestore.auxiliaryBar) {
				return;
			}

			mark('code/willRestoreAuxiliaryBar');

			await this.openViewContainer(ViewContainerLocation.AuxiliaryBar, this.state.initialization.views.containerToRestore.auxiliaryBar);

			mark('code/didRestoreAuxiliaryBar');
		})());

		// Restore Zen Mode
		const zenModeWasActive = this.isZenModeActive();
		const restoreZenMode = getZenModeConfiguration(this.configurationService).restore;

		if (zenModeWasActive) {
			this.setZenModeActive(!restoreZenMode);
			this.toggleZenMode(false, true);
		}

		// Restore Main Editor Center Mode
		if (this.stateModel.getRuntimeValue(LayoutStateKeys.MAIN_EDITOR_CENTERED)) {
			this.centerMainEditorLayout(true, true);
		}

		// Await for promises that we recorded to update
		// our ready and restored states properly.
		Promises.settled(layoutReadyPromises).finally(() => {

			// Focus the active maximized part in case we have
			// not yet focused a specific element and panel
			// or auxiliary bar are maximized.
			if (getActiveElement() === mainWindow.document.body && (this.isPanelMaximized() || this.isAuxiliaryBarMaximized())) {
				this.focus();
			}

			this.whenReadyPromise.complete();

			Promises.settled(layoutRestoredPromises).finally(() => {
				this.restored = true;
				this.whenRestoredPromise.complete();
			});
		});
	}

	private async openViewContainer(location: ViewContainerLocation, id: string, focus?: boolean): Promise<void> {
		let viewContainer = await this.paneCompositeService.openPaneComposite(id, location, focus);
		if (viewContainer) {
			return;
		}

		// fallback to default view container
		viewContainer = await this.paneCompositeService.openPaneComposite(this.viewDescriptorService.getDefaultViewContainer(location)?.id, location, focus);
		if (viewContainer) {
			return;
		}

		// finally try to just open the first visible view container
		await this.paneCompositeService.openPaneComposite(this.paneCompositeService.getVisiblePaneCompositeIds(location).at(0), location, focus);
	}

	registerPart(part: Part): IDisposable {
		const id = part.getId();
		this.parts.set(id, part);

		return toDisposable(() => this.parts.delete(id));
	}

	protected getPart(key: Parts): Part {
		const part = this.parts.get(key);
		if (!part) {
			throw new Error(`Unknown part ${key}`);
		}

		return part;
	}

	registerNotifications(delegate: { onDidChangeNotificationsVisibility: Event<boolean> }): void {
		this._register(delegate.onDidChangeNotificationsVisibility(visible => this._onDidChangeNotificationsVisibility.fire(visible)));
	}

	hasFocus(part: Parts): boolean {
		const container = this.getContainer(getActiveWindow(), part);
		if (!container) {
			return false;
		}

		const activeElement = getActiveElement();
		if (!activeElement) {
			return false;
		}

		return isAncestorUsingFlowTo(activeElement, container);
	}

	private _getFocusedPart(): Parts | undefined {
		for (const part of this.parts.keys()) {
			if (this.hasFocus(part as Parts)) {
				return part as Parts;
			}
		}

		return undefined;
	}

	focusPart(part: MULTI_WINDOW_PARTS, targetWindow: Window): void;
	focusPart(part: SINGLE_WINDOW_PARTS): void;
	focusPart(part: Parts, targetWindow: Window = mainWindow): void {
		const container = this.getContainer(targetWindow, part) ?? this.mainContainer;

		switch (part) {
			case Parts.EDITOR_PART:
				this.editorGroupService.getPart(container).activeGroup.focus();
				break;
			case Parts.PANEL_PART: {
				this.paneCompositeService.getActivePaneComposite(ViewContainerLocation.Panel)?.focus();
				break;
			}
			case Parts.SIDEBAR_PART: {
				this.paneCompositeService.getActivePaneComposite(ViewContainerLocation.Sidebar)?.focus();
				break;
			}
			case Parts.AUXILIARYBAR_PART: {
				this.paneCompositeService.getActivePaneComposite(ViewContainerLocation.AuxiliaryBar)?.focus();
				break;
			}
			case Parts.ACTIVITYBAR_PART:
				(this.getPart(Parts.SIDEBAR_PART) as SidebarPart).focusActivityBar();
				break;
			case Parts.STATUSBAR_PART:
				this.statusBarService.getPart(container).focus();
				break;
			default: {
				container?.focus();
			}
		}
	}

	getContainer(targetWindow: Window): HTMLElement;
	getContainer(targetWindow: Window, part: Parts): HTMLElement | undefined;
	getContainer(targetWindow: Window, part?: Parts): HTMLElement | undefined {
		if (typeof part === 'undefined') {
			return this.getContainerFromDocument(targetWindow.document);
		}

		if (targetWindow === mainWindow) {
			return this.getPart(part).getContainer();
		}

		// Only some parts are supported for auxiliary windows
		let partCandidate: unknown;
		if (part === Parts.EDITOR_PART) {
			partCandidate = this.editorGroupService.getPart(this.getContainerFromDocument(targetWindow.document));
		} else if (part === Parts.STATUSBAR_PART) {
			partCandidate = this.statusBarService.getPart(this.getContainerFromDocument(targetWindow.document));
		} else if (part === Parts.TITLEBAR_PART) {
			partCandidate = this.titleService.getPart(this.getContainerFromDocument(targetWindow.document));
		}

		if (partCandidate instanceof Part) {
			return partCandidate.getContainer();
		}

		return undefined;
	}

	isVisible(part: MULTI_WINDOW_PARTS, targetWindow: Window): boolean;
	isVisible(part: SINGLE_WINDOW_PARTS): boolean;
	isVisible(part: Parts, targetWindow?: Window): boolean;
	isVisible(part: Parts, targetWindow: Window = mainWindow): boolean {
		if (targetWindow !== mainWindow && part === Parts.EDITOR_PART) {
			return true; // cannot hide editor part in auxiliary windows
		}

		switch (part) {
			case Parts.TITLEBAR_PART:
				return this.initialized ?
					this.workbenchGrid.isViewVisible(this.titleBarPartView) :
					shouldShowCustomTitleBar(this.configurationService, mainWindow, this.state.runtime.menuBar.toggled);
			case Parts.SIDEBAR_PART:
				return !this.stateModel.getRuntimeValue(LayoutStateKeys.SIDEBAR_HIDDEN);
			case Parts.PANEL_PART:
				return !this.stateModel.getRuntimeValue(LayoutStateKeys.PANEL_HIDDEN);
			case Parts.AUXILIARYBAR_PART:
				return !this.stateModel.getRuntimeValue(LayoutStateKeys.AUXILIARYBAR_HIDDEN);
			case Parts.STATUSBAR_PART:
				return !this.stateModel.getRuntimeValue(LayoutStateKeys.STATUSBAR_HIDDEN);
			case Parts.ACTIVITYBAR_PART:
				return !this.stateModel.getRuntimeValue(LayoutStateKeys.ACTIVITYBAR_HIDDEN);
			case Parts.EDITOR_PART:
				return !this.stateModel.getRuntimeValue(LayoutStateKeys.EDITOR_HIDDEN);
			case Parts.BANNER_PART:
				return this.initialized ? this.workbenchGrid.isViewVisible(this.bannerPartView) : false;
			default:
				return false; // any other part cannot be hidden
		}
	}

	private shouldShowBannerFirst(): boolean {
		return isWeb && !isWCOEnabled();
	}

	focus(): void {
		if (this.isPanelMaximized() && this.mainContainer === this.activeContainer) {
			this.focusPart(Parts.PANEL_PART);
		} else if (this.isAuxiliaryBarMaximized() && this.mainContainer === this.activeContainer) {
			this.focusPart(Parts.AUXILIARYBAR_PART);
		} else {
			this.focusPart(Parts.EDITOR_PART, getWindow(this.activeContainer));
		}
	}

	private focusPanelOrEditor(): void {
		const activePanel = this.paneCompositeService.getActivePaneComposite(ViewContainerLocation.Panel);
		if ((this.hasFocus(Parts.PANEL_PART) || !this.isVisible(Parts.EDITOR_PART)) && activePanel) {
			activePanel.focus(); // prefer panel if it has focus or editor is hidden
		} else {
			this.focus(); // otherwise focus editor
		}
	}

	getMaximumEditorDimensions(container: HTMLElement): IDimension {
		const targetWindow = getWindow(container);
		const containerDimension = this.getContainerDimension(container);

		if (container === this.mainContainer) {
			const isPanelHorizontal = isHorizontal(this.getPanelPosition());
			const takenWidth =
				(this.isVisible(Parts.ACTIVITYBAR_PART) ? this.activityBarPartView.minimumWidth : 0) +
				(this.isVisible(Parts.SIDEBAR_PART) ? this.sideBarPartView.minimumWidth : 0) +
				(this.isVisible(Parts.PANEL_PART) && !isPanelHorizontal ? this.panelPartView.minimumWidth : 0) +
				(this.isVisible(Parts.AUXILIARYBAR_PART) ? this.auxiliaryBarPartView.minimumWidth : 0);

			const takenHeight =
				(this.isVisible(Parts.TITLEBAR_PART, targetWindow) ? this.titleBarPartView.minimumHeight : 0) +
				(this.isVisible(Parts.STATUSBAR_PART, targetWindow) ? this.statusBarPartView.minimumHeight : 0) +
				(this.isVisible(Parts.PANEL_PART) && isPanelHorizontal ? this.panelPartView.minimumHeight : 0);

			const availableWidth = containerDimension.width - takenWidth;
			const availableHeight = containerDimension.height - takenHeight;

			return { width: availableWidth, height: availableHeight };
		} else {
			const takenHeight =
				(this.isVisible(Parts.TITLEBAR_PART, targetWindow) ? this.titleBarPartView.minimumHeight : 0) +
				(this.isVisible(Parts.STATUSBAR_PART, targetWindow) ? this.statusBarPartView.minimumHeight : 0);

			return { width: containerDimension.width, height: containerDimension.height - takenHeight };
		}
	}

	private isZenModeActive(): boolean {
		return this.stateModel.getRuntimeValue(LayoutStateKeys.ZEN_MODE_ACTIVE);
	}

	private setZenModeActive(active: boolean) {
		this.stateModel.setRuntimeValue(LayoutStateKeys.ZEN_MODE_ACTIVE, active);
	}

	toggleZenMode(skipLayout?: boolean, restoring = false): void {
		const focusedPartPreTransition = this._getFocusedPart();

		this.setZenModeActive(!this.isZenModeActive());
		this.state.runtime.zenMode.transitionDisposables.clearAndDisposeAll();

		const setLineNumbers = (lineNumbers?: LineNumbersType) => {
			for (const editor of this.mainPartEditorService.visibleTextEditorControls) {

				// To properly reset line numbers we need to read the configuration for each editor respecting it's uri.
				if (!lineNumbers && isCodeEditor(editor) && editor.hasModel()) {
					const model = editor.getModel();
					lineNumbers = this.configurationService.getValue('editor.lineNumbers', { resource: model.uri, overrideIdentifier: model.getLanguageId() });
				}
				if (!lineNumbers) {
					lineNumbers = this.configurationService.getValue('editor.lineNumbers');
				}

				editor.updateOptions({ lineNumbers });
			}
		};

		// Check if zen mode transitioned to full screen and if now we are out of zen mode
		// -> we need to go out of full screen (same goes for the centered editor layout)
		let toggleMainWindowFullScreen = false;
		const config = getZenModeConfiguration(this.configurationService);
		const zenModeExitInfo = this.stateModel.getRuntimeValue(LayoutStateKeys.ZEN_MODE_EXIT_INFO);

		// Zen Mode Active
		if (this.isZenModeActive()) {

			toggleMainWindowFullScreen = !this.state.runtime.mainWindowFullscreen && config.fullScreen && !isIOS;

			if (!restoring) {
				zenModeExitInfo.transitionedToFullScreen = toggleMainWindowFullScreen;
				zenModeExitInfo.transitionedToCenteredEditorLayout = !this.isMainEditorLayoutCentered() && config.centerLayout;
				zenModeExitInfo.handleNotificationsDoNotDisturbMode = this.notificationService.getFilter() === NotificationsFilter.OFF;
				zenModeExitInfo.wasVisible.sideBar = this.isVisible(Parts.SIDEBAR_PART);
				zenModeExitInfo.wasVisible.panel = this.isVisible(Parts.PANEL_PART);
				zenModeExitInfo.wasVisible.auxiliaryBar = this.isVisible(Parts.AUXILIARYBAR_PART);
				this.stateModel.setRuntimeValue(LayoutStateKeys.ZEN_MODE_EXIT_INFO, zenModeExitInfo);
			}

			this.setPanelHidden(true, true);
			this.setAuxiliaryBarHidden(true, true);
			this.setSideBarHidden(true);

			if (config.hideActivityBar) {
				this.setActivityBarHidden(true);
			}

			if (config.hideStatusBar) {
				this.setStatusBarHidden(true);
			}

			if (config.hideLineNumbers) {
				setLineNumbers('off');
				this.state.runtime.zenMode.transitionDisposables.set(ZenModeSettings.HIDE_LINENUMBERS, this.mainPartEditorService.onDidVisibleEditorsChange(() => setLineNumbers('off')));
			}

			if (config.showTabs !== this.editorGroupService.partOptions.showTabs) {
				this.state.runtime.zenMode.transitionDisposables.set(ZenModeSettings.SHOW_TABS, this.editorGroupService.mainPart.enforcePartOptions({ showTabs: config.showTabs }));
			}

			if (config.silentNotifications && zenModeExitInfo.handleNotificationsDoNotDisturbMode) {
				this.notificationService.setFilter(NotificationsFilter.ERROR);
			}

			if (config.centerLayout) {
				this.centerMainEditorLayout(true, true);
			}

			// Zen Mode Configuration Changes
			this.state.runtime.zenMode.transitionDisposables.set('configurationChange', this.configurationService.onDidChangeConfiguration(e => {

				// Activity Bar
				if (e.affectsConfiguration(ZenModeSettings.HIDE_ACTIVITYBAR) || e.affectsConfiguration(LayoutSettings.ACTIVITY_BAR_LOCATION)) {
					const zenModeHideActivityBar = this.configurationService.getValue<boolean>(ZenModeSettings.HIDE_ACTIVITYBAR);
					const activityBarLocation = this.configurationService.getValue<ActivityBarPosition>(LayoutSettings.ACTIVITY_BAR_LOCATION);
					this.setActivityBarHidden(zenModeHideActivityBar ? true : (activityBarLocation === ActivityBarPosition.TOP || activityBarLocation === ActivityBarPosition.BOTTOM));
				}

				// Status Bar
				if (e.affectsConfiguration(ZenModeSettings.HIDE_STATUSBAR)) {
					const zenModeHideStatusBar = this.configurationService.getValue<boolean>(ZenModeSettings.HIDE_STATUSBAR);
					this.setStatusBarHidden(zenModeHideStatusBar);
				}

				// Center Layout
				if (e.affectsConfiguration(ZenModeSettings.CENTER_LAYOUT)) {
					const zenModeCenterLayout = this.configurationService.getValue<boolean>(ZenModeSettings.CENTER_LAYOUT);
					this.centerMainEditorLayout(zenModeCenterLayout, true);
				}

				// Show Tabs
				if (e.affectsConfiguration(ZenModeSettings.SHOW_TABS)) {
					const zenModeShowTabs = this.configurationService.getValue<EditorTabsMode | undefined>(ZenModeSettings.SHOW_TABS) ?? 'multiple';
					this.state.runtime.zenMode.transitionDisposables.set(ZenModeSettings.SHOW_TABS, this.editorGroupService.mainPart.enforcePartOptions({ showTabs: zenModeShowTabs }));
				}

				// Notifications
				if (e.affectsConfiguration(ZenModeSettings.SILENT_NOTIFICATIONS)) {
					const zenModeSilentNotifications = !!this.configurationService.getValue(ZenModeSettings.SILENT_NOTIFICATIONS);
					if (zenModeExitInfo.handleNotificationsDoNotDisturbMode) {
						this.notificationService.setFilter(zenModeSilentNotifications ? NotificationsFilter.ERROR : NotificationsFilter.OFF);
					}
				}

				// Center Layout
				if (e.affectsConfiguration(ZenModeSettings.HIDE_LINENUMBERS)) {
					const lineNumbersType = this.configurationService.getValue<boolean>(ZenModeSettings.HIDE_LINENUMBERS) ? 'off' : undefined;
					setLineNumbers(lineNumbersType);
					this.state.runtime.zenMode.transitionDisposables.set(ZenModeSettings.HIDE_LINENUMBERS, this.mainPartEditorService.onDidVisibleEditorsChange(() => setLineNumbers(lineNumbersType)));
				}
			}));
		}

		// Zen Mode Inactive
		else {
			if (zenModeExitInfo.wasVisible.panel) {
				this.setPanelHidden(false, true);
			}

			if (zenModeExitInfo.wasVisible.auxiliaryBar) {
				this.setAuxiliaryBarHidden(false, true);
			}

			if (zenModeExitInfo.wasVisible.sideBar) {
				this.setSideBarHidden(false);
			}

			if (!this.stateModel.getRuntimeValue(LayoutStateKeys.ACTIVITYBAR_HIDDEN, true)) {
				this.setActivityBarHidden(false);
			}

			if (!this.stateModel.getRuntimeValue(LayoutStateKeys.STATUSBAR_HIDDEN, true)) {
				this.setStatusBarHidden(false);
			}

			if (zenModeExitInfo.transitionedToCenteredEditorLayout) {
				this.centerMainEditorLayout(false, true);
			}

			if (zenModeExitInfo.handleNotificationsDoNotDisturbMode) {
				this.notificationService.setFilter(NotificationsFilter.OFF);
			}

			setLineNumbers();

			toggleMainWindowFullScreen = zenModeExitInfo.transitionedToFullScreen && this.state.runtime.mainWindowFullscreen;
		}

		if (!skipLayout) {
			this.layout();
		}

		if (toggleMainWindowFullScreen) {
			this.hostService.toggleFullScreen(mainWindow);
		}

		// restore focus if part is still visible, otherwise fallback to editor
		if (focusedPartPreTransition && this.isVisible(focusedPartPreTransition, getWindow(this.activeContainer))) {
			if (isMultiWindowPart(focusedPartPreTransition)) {
				this.focusPart(focusedPartPreTransition, getWindow(this.activeContainer));
			} else {
				this.focusPart(focusedPartPreTransition);
			}
		} else {
			this.focus();
		}

		// Event
		this._onDidChangeZenMode.fire(this.isZenModeActive());
	}

	private setStatusBarHidden(hidden: boolean): void {
		this.stateModel.setRuntimeValue(LayoutStateKeys.STATUSBAR_HIDDEN, hidden);

		// Adjust CSS
		if (hidden) {
			this.mainContainer.classList.add(LayoutClasses.STATUSBAR_HIDDEN);
		} else {
			this.mainContainer.classList.remove(LayoutClasses.STATUSBAR_HIDDEN);
		}

		// Propagate to grid
		this.workbenchGrid.setViewVisible(this.statusBarPartView, !hidden);
	}

	protected createWorkbenchLayout(): void {
		const titleBar = this.getPart(Parts.TITLEBAR_PART);
		const bannerPart = this.getPart(Parts.BANNER_PART);
		const editorPart = this.getPart(Parts.EDITOR_PART);
		const activityBar = this.getPart(Parts.ACTIVITYBAR_PART);
		const panelPart = this.getPart(Parts.PANEL_PART);
		const auxiliaryBarPart = this.getPart(Parts.AUXILIARYBAR_PART);
		const sideBar = this.getPart(Parts.SIDEBAR_PART);
		const statusBar = this.getPart(Parts.STATUSBAR_PART);

		// View references for all parts
		this.titleBarPartView = titleBar;
		this.bannerPartView = bannerPart;
		this.sideBarPartView = sideBar;
		this.activityBarPartView = activityBar;
		this.editorPartView = editorPart;
		this.panelPartView = panelPart;
		this.auxiliaryBarPartView = auxiliaryBarPart;
		this.statusBarPartView = statusBar;

		const viewMap = {
			[Parts.ACTIVITYBAR_PART]: this.activityBarPartView,
			[Parts.BANNER_PART]: this.bannerPartView,
			[Parts.TITLEBAR_PART]: this.titleBarPartView,
			[Parts.EDITOR_PART]: this.editorPartView,
			[Parts.PANEL_PART]: this.panelPartView,
			[Parts.SIDEBAR_PART]: this.sideBarPartView,
			[Parts.STATUSBAR_PART]: this.statusBarPartView,
			[Parts.AUXILIARYBAR_PART]: this.auxiliaryBarPartView
		};

		const fromJSON = ({ type }: { type: Parts }) => viewMap[type];
		const workbenchGrid = SerializableGrid.deserialize(
			this.createGridDescriptor(),
			{ fromJSON },
			{ proportionalLayout: false }
		);

		this.mainContainer.prepend(workbenchGrid.element);
		this.mainContainer.setAttribute('role', 'application');
		this.workbenchGrid = workbenchGrid;
		this.workbenchGrid.edgeSnapping = this.state.runtime.mainWindowFullscreen;

		for (const part of [titleBar, editorPart, activityBar, panelPart, sideBar, statusBar, auxiliaryBarPart, bannerPart]) {
			this._register(part.onDidVisibilityChange(visible => {
				if (!this.inMaximizedAuxiliaryBarTransition) {

					// skip reacting when we are transitioning
					// in or out of maximised auxiliary bar to prevent
					// stepping on each other toes because this
					// transition is already dealing with all parts
					// visibility efficiently.

					if (part === sideBar) {
						this.setSideBarHidden(!visible);
					} else if (part === panelPart && this.stateModel.getRuntimeValue(LayoutStateKeys.PANEL_HIDDEN) === visible) {
						this.setPanelHidden(!visible, true);
					} else if (part === auxiliaryBarPart) {
						this.setAuxiliaryBarHidden(!visible, true);
					} else if (part === editorPart) {
						this.setEditorHidden(!visible);
					}
				}

				this._onDidChangePartVisibility.fire();
				this.handleContainerDidLayout(this.mainContainer, this._mainContainerDimension);
			}));
		}

		this._register(this.storageService.onWillSaveState(() => {

			// Side Bar Size
			const sideBarSize = this.stateModel.getRuntimeValue(LayoutStateKeys.SIDEBAR_HIDDEN)
				? this.workbenchGrid.getViewCachedVisibleSize(this.sideBarPartView)
				: this.workbenchGrid.getViewSize(this.sideBarPartView).width;
			this.stateModel.setInitializationValue(LayoutStateKeys.SIDEBAR_SIZE, sideBarSize as number);

			// Panel Size
			const panelSize = this.stateModel.getRuntimeValue(LayoutStateKeys.PANEL_HIDDEN)
				? this.workbenchGrid.getViewCachedVisibleSize(this.panelPartView)
				: isHorizontal(this.stateModel.getRuntimeValue(LayoutStateKeys.PANEL_POSITION))
					? this.workbenchGrid.getViewSize(this.panelPartView).height
					: this.workbenchGrid.getViewSize(this.panelPartView).width;
			this.stateModel.setInitializationValue(LayoutStateKeys.PANEL_SIZE, panelSize as number);

			// Auxiliary Bar Size
			const auxiliaryBarSize = this.stateModel.getRuntimeValue(LayoutStateKeys.AUXILIARYBAR_HIDDEN)
				? this.workbenchGrid.getViewCachedVisibleSize(this.auxiliaryBarPartView)
				: this.workbenchGrid.getViewSize(this.auxiliaryBarPartView).width;
			this.stateModel.setInitializationValue(LayoutStateKeys.AUXILIARYBAR_SIZE, auxiliaryBarSize as number);

			this.stateModel.save(true, true);
		}));

		this._register(Event.any(this.paneCompositeService.onDidPaneCompositeOpen, this.paneCompositeService.onDidPaneCompositeClose)(() => {

			// Auxiliary Bar State
			this.stateModel.setInitializationValue(LayoutStateKeys.AUXILIARYBAR_EMPTY, this.paneCompositeService.getPaneCompositeIds(ViewContainerLocation.AuxiliaryBar).length === 0);
		}));
	}

	layout(): void {
		if (!this.disposed) {
			this._mainContainerDimension = getClientArea(this.state.runtime.mainWindowFullscreen ?
				mainWindow.document.body : 	// in fullscreen mode, make sure to use <body> element because
				this.parent,				// in that case the workbench will span the entire site
				this.contextService.getWorkbenchState() === WorkbenchState.EMPTY ? DEFAULT_EMPTY_WINDOW_DIMENSIONS : DEFAULT_WORKSPACE_WINDOW_DIMENSIONS // running with fallback to ensure no error is thrown (https://github.com/microsoft/vscode/issues/240242)
			);
			this.logService.trace(`Layout#layout, height: ${this._mainContainerDimension.height}, width: ${this._mainContainerDimension.width}`);

			size(this.mainContainer, this._mainContainerDimension.width, this._mainContainerDimension.height);

			// Layout the grid widget
			this.workbenchGrid.layout(this._mainContainerDimension.width, this._mainContainerDimension.height);
			this.initialized = true;

			// Emit as event
			this.handleContainerDidLayout(this.mainContainer, this._mainContainerDimension);
		}
	}

	isMainEditorLayoutCentered(): boolean {
		return this.stateModel.getRuntimeValue(LayoutStateKeys.MAIN_EDITOR_CENTERED);
	}

	centerMainEditorLayout(active: boolean, skipLayout?: boolean): void {
		this.stateModel.setRuntimeValue(LayoutStateKeys.MAIN_EDITOR_CENTERED, active);

		const mainVisibleEditors = coalesce(this.editorGroupService.mainPart.groups.map(group => group.activeEditor));
		const isEditorComplex = mainVisibleEditors.some(editor => {
			if (editor instanceof DiffEditorInput) {
				return this.configurationService.getValue('diffEditor.renderSideBySide');
			}

			if (editor?.hasCapability(EditorInputCapabilities.MultipleEditors)) {
				return true;
			}

			return false;
		});

		const layout = this.editorGroupService.getLayout();
		let hasMoreThanOneColumn = false;
		if (layout.orientation === GroupOrientation.HORIZONTAL) {
			hasMoreThanOneColumn = layout.groups.length > 1;
		} else {
			hasMoreThanOneColumn = layout.groups.some(group => group.groups && group.groups.length > 1);
		}

		const isCenteredLayoutAutoResizing = this.configurationService.getValue('workbench.editor.centeredLayoutAutoResize');
		if (
			isCenteredLayoutAutoResizing &&
			((hasMoreThanOneColumn && !this.editorGroupService.mainPart.hasMaximizedGroup()) || isEditorComplex)
		) {
			active = false; // disable centered layout for complex editors or when there is more than one group
		}

		if (this.editorGroupService.mainPart.isLayoutCentered() !== active) {
			this.editorGroupService.mainPart.centerLayout(active);

			if (!skipLayout) {
				this.layout();
			}
		}

		this._onDidChangeMainEditorCenteredLayout.fire(this.stateModel.getRuntimeValue(LayoutStateKeys.MAIN_EDITOR_CENTERED));
	}

	getSize(part: Parts): IViewSize {
		return this.workbenchGrid.getViewSize(this.getPart(part));
	}

	setSize(part: Parts, size: IViewSize): void {
		this.workbenchGrid.resizeView(this.getPart(part), size);
	}

	resizePart(part: Parts, sizeChangeWidth: number, sizeChangeHeight: number): void {
		const sizeChangePxWidth = Math.sign(sizeChangeWidth) * computeScreenAwareSize(getActiveWindow(), Math.abs(sizeChangeWidth));
		const sizeChangePxHeight = Math.sign(sizeChangeHeight) * computeScreenAwareSize(getActiveWindow(), Math.abs(sizeChangeHeight));

		let viewSize: IViewSize;

		switch (part) {
			case Parts.SIDEBAR_PART:
				viewSize = this.workbenchGrid.getViewSize(this.sideBarPartView);
				this.workbenchGrid.resizeView(this.sideBarPartView, {
					width: viewSize.width + sizeChangePxWidth,
					height: viewSize.height
				});

				break;
			case Parts.PANEL_PART:
				viewSize = this.workbenchGrid.getViewSize(this.panelPartView);

				this.workbenchGrid.resizeView(this.panelPartView, {
					width: viewSize.width + (isHorizontal(this.getPanelPosition()) ? 0 : sizeChangePxWidth),
					height: viewSize.height + (isHorizontal(this.getPanelPosition()) ? sizeChangePxHeight : 0)
				});

				break;
			case Parts.AUXILIARYBAR_PART:
				viewSize = this.workbenchGrid.getViewSize(this.auxiliaryBarPartView);
				this.workbenchGrid.resizeView(this.auxiliaryBarPartView, {
					width: viewSize.width + sizeChangePxWidth,
					height: viewSize.height
				});
				break;
			case Parts.EDITOR_PART:
				viewSize = this.workbenchGrid.getViewSize(this.editorPartView);

				// Single Editor Group
				if (this.editorGroupService.mainPart.count === 1) {
					this.workbenchGrid.resizeView(this.editorPartView, {
						width: viewSize.width + sizeChangePxWidth,
						height: viewSize.height + sizeChangePxHeight
					});
				} else {
					const activeGroup = this.editorGroupService.mainPart.activeGroup;

					const { width, height } = this.editorGroupService.mainPart.getSize(activeGroup);
					this.editorGroupService.mainPart.setSize(activeGroup, { width: width + sizeChangePxWidth, height: height + sizeChangePxHeight });

					// After resizing the editor group
					// if it does not change in either direction
					// try resizing the full editor part
					const { width: newWidth, height: newHeight } = this.editorGroupService.mainPart.getSize(activeGroup);
					if ((sizeChangePxHeight && height === newHeight) || (sizeChangePxWidth && width === newWidth)) {
						this.workbenchGrid.resizeView(this.editorPartView, {
							width: viewSize.width + (sizeChangePxWidth && width === newWidth ? sizeChangePxWidth : 0),
							height: viewSize.height + (sizeChangePxHeight && height === newHeight ? sizeChangePxHeight : 0)
						});
					}
				}

				break;
			default:
				return; // Cannot resize other parts
		}
	}

	private setActivityBarHidden(hidden: boolean): void {
		this.stateModel.setRuntimeValue(LayoutStateKeys.ACTIVITYBAR_HIDDEN, hidden);
		this.workbenchGrid.setViewVisible(this.activityBarPartView, !hidden);
	}

	private setBannerHidden(hidden: boolean): void {
		this.workbenchGrid.setViewVisible(this.bannerPartView, !hidden);
	}

	private setEditorHidden(hidden: boolean): void {
		if (!hidden && this.setAuxiliaryBarMaximized(false) && this.isVisible(Parts.EDITOR_PART)) {
			return; // return: leaving maximised auxiliary bar made this part visible
		}

		this.stateModel.setRuntimeValue(LayoutStateKeys.EDITOR_HIDDEN, hidden);

		// Adjust CSS
		if (hidden) {
			this.mainContainer.classList.add(LayoutClasses.MAIN_EDITOR_AREA_HIDDEN);
		} else {
			this.mainContainer.classList.remove(LayoutClasses.MAIN_EDITOR_AREA_HIDDEN);
		}

		// Propagate to grid
		this.workbenchGrid.setViewVisible(this.editorPartView, !hidden);

		// The editor and panel cannot be hidden at the same time
		// unless we have a maximized auxiliary bar
		if (hidden && !this.isVisible(Parts.PANEL_PART) && !this.isAuxiliaryBarMaximized()) {
			this.setPanelHidden(false, true);
		}
	}

	getLayoutClasses(): string[] {
		return coalesce([
			!this.isVisible(Parts.SIDEBAR_PART) ? LayoutClasses.SIDEBAR_HIDDEN : undefined,
			!this.isVisible(Parts.EDITOR_PART, mainWindow) ? LayoutClasses.MAIN_EDITOR_AREA_HIDDEN : undefined,
			!this.isVisible(Parts.PANEL_PART) ? LayoutClasses.PANEL_HIDDEN : undefined,
			!this.isVisible(Parts.AUXILIARYBAR_PART) ? LayoutClasses.AUXILIARYBAR_HIDDEN : undefined,
			!this.isVisible(Parts.STATUSBAR_PART) ? LayoutClasses.STATUSBAR_HIDDEN : undefined,
			this.state.runtime.mainWindowFullscreen ? LayoutClasses.FULLSCREEN : undefined
		]);
	}

	private setSideBarHidden(hidden: boolean): void {
		if (!hidden && this.setAuxiliaryBarMaximized(false) && this.isVisible(Parts.SIDEBAR_PART)) {
			return; // return: leaving maximised auxiliary bar made this part visible
		}

		this.stateModel.setRuntimeValue(LayoutStateKeys.SIDEBAR_HIDDEN, hidden);

		// Adjust CSS
		if (hidden) {
			this.mainContainer.classList.add(LayoutClasses.SIDEBAR_HIDDEN);
		} else {
			this.mainContainer.classList.remove(LayoutClasses.SIDEBAR_HIDDEN);
		}

		// Propagate to grid
		this.workbenchGrid.setViewVisible(this.sideBarPartView, !hidden);

		// If sidebar becomes hidden, also hide the current active Viewlet if any
		if (hidden && this.paneCompositeService.getActivePaneComposite(ViewContainerLocation.Sidebar)) {
			this.paneCompositeService.hideActivePaneComposite(ViewContainerLocation.Sidebar);

			if (!this.isAuxiliaryBarMaximized()) {
				this.focusPanelOrEditor(); // do not auto focus when auxiliary bar is maximized
			}
		}

		// If sidebar becomes visible, show last active Viewlet or default viewlet
		else if (!hidden && !this.paneCompositeService.getActivePaneComposite(ViewContainerLocation.Sidebar)) {
			const viewletToOpen = this.paneCompositeService.getLastActivePaneCompositeId(ViewContainerLocation.Sidebar);
			if (viewletToOpen) {
				this.openViewContainer(ViewContainerLocation.Sidebar, viewletToOpen);
			}
		}
	}

	private hasViews(id: string): boolean {
		const viewContainer = this.viewDescriptorService.getViewContainerById(id);
		if (!viewContainer) {
			return false;
		}

		const viewContainerModel = this.viewDescriptorService.getViewContainerModel(viewContainer);
		if (!viewContainerModel) {
			return false;
		}

		return viewContainerModel.activeViewDescriptors.length >= 1;
	}

	private adjustPartPositions(sideBarPosition: Position, panelAlignment: PanelAlignment, panelPosition: Position): void {

		// Move activity bar and side bars
		const isPanelVertical = !isHorizontal(panelPosition);
		const sideBarSiblingToEditor = isPanelVertical || !(panelAlignment === 'center' || (sideBarPosition === Position.LEFT && panelAlignment === 'right') || (sideBarPosition === Position.RIGHT && panelAlignment === 'left'));
		const auxiliaryBarSiblingToEditor = isPanelVertical || !(panelAlignment === 'center' || (sideBarPosition === Position.RIGHT && panelAlignment === 'right') || (sideBarPosition === Position.LEFT && panelAlignment === 'left'));
		const preMovePanelWidth = !this.isVisible(Parts.PANEL_PART) ? Sizing.Invisible(this.workbenchGrid.getViewCachedVisibleSize(this.panelPartView) ?? this.panelPartView.minimumWidth) : this.workbenchGrid.getViewSize(this.panelPartView).width;
		const preMovePanelHeight = !this.isVisible(Parts.PANEL_PART) ? Sizing.Invisible(this.workbenchGrid.getViewCachedVisibleSize(this.panelPartView) ?? this.panelPartView.minimumHeight) : this.workbenchGrid.getViewSize(this.panelPartView).height;
		const preMoveSideBarSize = !this.isVisible(Parts.SIDEBAR_PART) ? Sizing.Invisible(this.workbenchGrid.getViewCachedVisibleSize(this.sideBarPartView) ?? this.sideBarPartView.minimumWidth) : this.workbenchGrid.getViewSize(this.sideBarPartView).width;
		const preMoveAuxiliaryBarSize = !this.isVisible(Parts.AUXILIARYBAR_PART) ? Sizing.Invisible(this.workbenchGrid.getViewCachedVisibleSize(this.auxiliaryBarPartView) ?? this.auxiliaryBarPartView.minimumWidth) : this.workbenchGrid.getViewSize(this.auxiliaryBarPartView).width;

		const focusedPart = [Parts.PANEL_PART, Parts.SIDEBAR_PART, Parts.AUXILIARYBAR_PART].find(part => this.hasFocus(part)) as SINGLE_WINDOW_PARTS | undefined;

		if (sideBarPosition === Position.LEFT) {
			this.workbenchGrid.moveViewTo(this.activityBarPartView, [2, 0]);
			this.workbenchGrid.moveView(this.sideBarPartView, preMoveSideBarSize, sideBarSiblingToEditor ? this.editorPartView : this.activityBarPartView, sideBarSiblingToEditor ? Direction.Left : Direction.Right);
			if (auxiliaryBarSiblingToEditor) {
				this.workbenchGrid.moveView(this.auxiliaryBarPartView, preMoveAuxiliaryBarSize, this.editorPartView, Direction.Right);
			} else {
				this.workbenchGrid.moveViewTo(this.auxiliaryBarPartView, [2, -1]);
			}
		} else {
			this.workbenchGrid.moveViewTo(this.activityBarPartView, [2, -1]);
			this.workbenchGrid.moveView(this.sideBarPartView, preMoveSideBarSize, sideBarSiblingToEditor ? this.editorPartView : this.activityBarPartView, sideBarSiblingToEditor ? Direction.Right : Direction.Left);
			if (auxiliaryBarSiblingToEditor) {
				this.workbenchGrid.moveView(this.auxiliaryBarPartView, preMoveAuxiliaryBarSize, this.editorPartView, Direction.Left);
			} else {
				this.workbenchGrid.moveViewTo(this.auxiliaryBarPartView, [2, 0]);
			}
		}

		// Maintain focus after moving parts
		if (focusedPart) {
			this.focusPart(focusedPart);
		}

		// We moved all the side parts based on the editor and ignored the panel
		// Now, we need to put the panel back in the right position when it is next to the editor
		if (isPanelVertical) {
			this.workbenchGrid.moveView(this.panelPartView, preMovePanelWidth, this.editorPartView, panelPosition === Position.LEFT ? Direction.Left : Direction.Right);
			this.workbenchGrid.resizeView(this.panelPartView, {
				height: preMovePanelHeight as number,
				width: preMovePanelWidth as number
			});
		}

		// Moving views in the grid can cause them to re-distribute sizing unnecessarily
		// Resize visible parts to the width they were before the operation
		if (this.isVisible(Parts.SIDEBAR_PART)) {
			this.workbenchGrid.resizeView(this.sideBarPartView, {
				height: this.workbenchGrid.getViewSize(this.sideBarPartView).height,
				width: preMoveSideBarSize as number
			});
		}

		if (this.isVisible(Parts.AUXILIARYBAR_PART)) {
			this.workbenchGrid.resizeView(this.auxiliaryBarPartView, {
				height: this.workbenchGrid.getViewSize(this.auxiliaryBarPartView).height,
				width: preMoveAuxiliaryBarSize as number
			});
		}
	}

	setPanelAlignment(alignment: PanelAlignment): void {

		// Panel alignment only applies to a panel in the top/bottom position
		if (!isHorizontal(this.getPanelPosition())) {
			this.setPanelPosition(Position.BOTTOM);
		}

		// the workbench grid currently prevents us from supporting panel maximization with non-center panel alignment
		if (alignment !== 'center' && this.isPanelMaximized()) {
			this.toggleMaximizedPanel();
		}

		this.stateModel.setRuntimeValue(LayoutStateKeys.PANEL_ALIGNMENT, alignment);

		this.adjustPartPositions(this.getSideBarPosition(), alignment, this.getPanelPosition());

		this._onDidChangePanelAlignment.fire(alignment);
	}

	private setPanelHidden(hidden: boolean, skipLayout?: boolean): void {
		if (!this.workbenchGrid) {
			return; // Return if not initialized fully (https://github.com/microsoft/vscode/issues/105480)
		}

		if (!hidden && this.setAuxiliaryBarMaximized(false) && this.isVisible(Parts.PANEL_PART)) {
			return; // return: leaving maximised auxiliary bar made this part visible
		}

		const wasHidden = !this.isVisible(Parts.PANEL_PART);
		const isPanelMaximized = this.isPanelMaximized();

		this.stateModel.setRuntimeValue(LayoutStateKeys.PANEL_HIDDEN, hidden);

		const panelOpensMaximized = this.panelOpensMaximized();

		// Adjust CSS
		if (hidden) {
			this.mainContainer.classList.add(LayoutClasses.PANEL_HIDDEN);
		} else {
			this.mainContainer.classList.remove(LayoutClasses.PANEL_HIDDEN);
		}

		// If maximized and in process of hiding, unmaximize FIRST before
		// changing visibility to prevent conflict with setEditorHidden
		// which would force panel visible again (fixes #281772)
		if (hidden && isPanelMaximized) {
			this.toggleMaximizedPanel();
		}

		// Propagate layout changes to grid
		this.workbenchGrid.setViewVisible(this.panelPartView, !hidden);

		// If panel part becomes hidden, also hide the current active panel if any
		let focusEditor = false;
		if (hidden && this.paneCompositeService.getActivePaneComposite(ViewContainerLocation.Panel)) {
			this.paneCompositeService.hideActivePaneComposite(ViewContainerLocation.Panel);
			if (
				!isIOS &&						// do not auto focus on iOS (https://github.com/microsoft/vscode/issues/127832)
				!this.isAuxiliaryBarMaximized()	// do not auto focus when auxiliary bar is maximized
			) {
				focusEditor = true;
			}
		}

		// If panel part becomes visible, show last active panel or default panel
		else if (!hidden && !this.paneCompositeService.getActivePaneComposite(ViewContainerLocation.Panel)) {
			let panelToOpen: string | undefined = this.paneCompositeService.getLastActivePaneCompositeId(ViewContainerLocation.Panel);

			// verify that the panel we try to open has views before we default to it
			// otherwise fall back to any view that has views still refs #111463
			if (!panelToOpen || !this.hasViews(panelToOpen)) {
				panelToOpen = this.viewDescriptorService
					.getViewContainersByLocation(ViewContainerLocation.Panel)
					.find(viewContainer => this.hasViews(viewContainer.id))?.id;
			}

			if (panelToOpen) {
				this.openViewContainer(ViewContainerLocation.Panel, panelToOpen, !skipLayout);
			}
		}

		// Don't proceed if we have already done this before
		if (wasHidden === hidden) {
			return;
		}

		// If in process of showing, toggle whether or not panel is maximized
		if (!hidden) {
			if (!skipLayout && isPanelMaximized !== panelOpensMaximized) {
				this.toggleMaximizedPanel();
			}
		} else {
			// If in process of hiding, remember whether the panel is maximized or not
			this.stateModel.setRuntimeValue(LayoutStateKeys.PANEL_WAS_LAST_MAXIMIZED, isPanelMaximized);
		}

		if (focusEditor) {
			this.editorGroupService.mainPart.activeGroup.focus(); // Pass focus to editor group if panel part is now hidden
		}
	}

	private inMaximizedAuxiliaryBarTransition = false;

	isAuxiliaryBarMaximized(): boolean {
		return this.stateModel.getRuntimeValue(LayoutStateKeys.AUXILIARYBAR_WAS_LAST_MAXIMIZED);
	}

	toggleMaximizedAuxiliaryBar(): void {
		this.setAuxiliaryBarMaximized(!this.isAuxiliaryBarMaximized());
	}

	setAuxiliaryBarMaximized(maximized: boolean): boolean {
		if (
			this.inMaximizedAuxiliaryBarTransition ||		// prevent re-entrance
			(maximized === this.isAuxiliaryBarMaximized())	// return early if state is already present
		) {
			return false;
		}

		if (maximized) {
			const state = {
				sideBarVisible: this.isVisible(Parts.SIDEBAR_PART),
				editorVisible: this.isVisible(Parts.EDITOR_PART),
				panelVisible: this.isVisible(Parts.PANEL_PART),
				auxiliaryBarVisible: this.isVisible(Parts.AUXILIARYBAR_PART)
			};
			this.stateModel.setRuntimeValue(LayoutStateKeys.AUXILIARYBAR_WAS_LAST_MAXIMIZED, true);

			this.inMaximizedAuxiliaryBarTransition = true;
			try {
				if (!state.auxiliaryBarVisible) {
					this.setAuxiliaryBarHidden(false);
				}

				const size = this.workbenchGrid.getViewSize(this.auxiliaryBarPartView).width;
				this.stateModel.setRuntimeValue(LayoutStateKeys.AUXILIARYBAR_LAST_NON_MAXIMIZED_SIZE, size);

				if (state.sideBarVisible) {
					this.setSideBarHidden(true);
				}
				if (state.panelVisible) {
					this.setPanelHidden(true);
				}
				if (state.editorVisible) {
					this.setEditorHidden(true);
				}

				this.stateModel.setRuntimeValue(LayoutStateKeys.AUXILIARYBAR_LAST_NON_MAXIMIZED_VISIBILITY, state);
			} finally {
				this.inMaximizedAuxiliaryBarTransition = false;
			}
		} else {
			const state = assertReturnsDefined(this.stateModel.getRuntimeValue(LayoutStateKeys.AUXILIARYBAR_LAST_NON_MAXIMIZED_VISIBILITY));
			this.stateModel.setRuntimeValue(LayoutStateKeys.AUXILIARYBAR_WAS_LAST_MAXIMIZED, false);

			this.inMaximizedAuxiliaryBarTransition = true;
			try {
				this.setEditorHidden(!state?.editorVisible);	// this order of updating view visibility
				this.setPanelHidden(!state?.panelVisible);		// helps in restoring the previous view
				this.setSideBarHidden(!state?.sideBarVisible);	// sizes we had

				const size = this.workbenchGrid.getViewSize(this.auxiliaryBarPartView);
				this.workbenchGrid.resizeView(this.auxiliaryBarPartView, {
					width: this.stateModel.getRuntimeValue(LayoutStateKeys.AUXILIARYBAR_LAST_NON_MAXIMIZED_SIZE),
					height: size.height
				});
			} finally {
				this.inMaximizedAuxiliaryBarTransition = false;
			}
		}

		this.focusPart(Parts.AUXILIARYBAR_PART);

		this._onDidChangeAuxiliaryBarMaximized.fire();

		return true;
	}

	isPanelMaximized(): boolean {
		return (
			this.getPanelAlignment() === 'center' || 	// the workbench grid currently prevents us from supporting panel
			!isHorizontal(this.getPanelPosition())		// maximization with non-center panel alignment
		) && !this.isVisible(Parts.EDITOR_PART, mainWindow) && !this.isAuxiliaryBarMaximized();
	}

	toggleMaximizedPanel(): void {
		const size = this.workbenchGrid.getViewSize(this.panelPartView);
		const panelPosition = this.getPanelPosition();
		const maximize = !this.isPanelMaximized();
		if (maximize) {
			if (this.isVisible(Parts.PANEL_PART)) {
				if (isHorizontal(panelPosition)) {
					this.stateModel.setRuntimeValue(LayoutStateKeys.PANEL_LAST_NON_MAXIMIZED_HEIGHT, size.height);
				} else {
					this.stateModel.setRuntimeValue(LayoutStateKeys.PANEL_LAST_NON_MAXIMIZED_WIDTH, size.width);
				}
			}

			this.setEditorHidden(true);
		} else {
			this.setEditorHidden(false);

			this.workbenchGrid.resizeView(this.panelPartView, {
				width: isHorizontal(panelPosition) ? size.width : this.stateModel.getRuntimeValue(LayoutStateKeys.PANEL_LAST_NON_MAXIMIZED_WIDTH),
				height: isHorizontal(panelPosition) ? this.stateModel.getRuntimeValue(LayoutStateKeys.PANEL_LAST_NON_MAXIMIZED_HEIGHT) : size.height
			});
		}

		this.stateModel.setRuntimeValue(LayoutStateKeys.PANEL_WAS_LAST_MAXIMIZED, maximize);
	}

	private panelOpensMaximized(): boolean {
		if (this.getPanelAlignment() !== 'center' && isHorizontal(this.getPanelPosition())) {
			return false; // The workbench grid currently prevents us from supporting panel maximization with non-center panel alignment
		}

		const panelOpensMaximized = partOpensMaximizedFromString(this.configurationService.getValue<string>(WorkbenchLayoutSettings.PANEL_OPENS_MAXIMIZED));
		const panelLastIsMaximized = this.stateModel.getRuntimeValue(LayoutStateKeys.PANEL_WAS_LAST_MAXIMIZED);

		return panelOpensMaximized === PartOpensMaximizedOptions.ALWAYS || (panelOpensMaximized === PartOpensMaximizedOptions.REMEMBER_LAST && panelLastIsMaximized);
	}

	private setAuxiliaryBarHidden(hidden: boolean, skipLayout?: boolean): void {
		if (hidden && this.setAuxiliaryBarMaximized(false) && !this.isVisible(Parts.AUXILIARYBAR_PART)) {
			return; // return: leaving maximised auxiliary bar made this part hidden
		}

		this.stateModel.setRuntimeValue(LayoutStateKeys.AUXILIARYBAR_HIDDEN, hidden);

		// Adjust CSS
		if (hidden) {
			this.mainContainer.classList.add(LayoutClasses.AUXILIARYBAR_HIDDEN);
		} else {
			this.mainContainer.classList.remove(LayoutClasses.AUXILIARYBAR_HIDDEN);
		}

		// Propagate to grid
		this.workbenchGrid.setViewVisible(this.auxiliaryBarPartView, !hidden);

		// If auxiliary bar becomes hidden, also hide the current active pane composite if any
		if (hidden && this.paneCompositeService.getActivePaneComposite(ViewContainerLocation.AuxiliaryBar)) {
			this.paneCompositeService.hideActivePaneComposite(ViewContainerLocation.AuxiliaryBar);
			this.focusPanelOrEditor();
		}

		// If auxiliary bar becomes visible, show last active pane composite or default pane composite
		else if (!hidden && !this.paneCompositeService.getActivePaneComposite(ViewContainerLocation.AuxiliaryBar)) {
			let viewletToOpen: string | undefined = this.paneCompositeService.getLastActivePaneCompositeId(ViewContainerLocation.AuxiliaryBar);

			// verify that the viewlet we try to open has views before we default to it
			// otherwise fall back to any view that has views still refs #111463
			if (!viewletToOpen || !this.hasViews(viewletToOpen)) {
				viewletToOpen = this.viewDescriptorService
					.getViewContainersByLocation(ViewContainerLocation.AuxiliaryBar)
					.find(viewContainer => this.hasViews(viewContainer.id))?.id;
			}

			if (viewletToOpen) {
				this.openViewContainer(ViewContainerLocation.AuxiliaryBar, viewletToOpen, !skipLayout);
			}
		}
	}

	setPartHidden(hidden: boolean, part: Parts): void {
		switch (part) {
			case Parts.ACTIVITYBAR_PART:
				return this.setActivityBarHidden(hidden);
			case Parts.SIDEBAR_PART:
				return this.setSideBarHidden(hidden);
			case Parts.EDITOR_PART:
				return this.setEditorHidden(hidden);
			case Parts.BANNER_PART:
				return this.setBannerHidden(hidden);
			case Parts.AUXILIARYBAR_PART:
				return this.setAuxiliaryBarHidden(hidden);
			case Parts.PANEL_PART:
				return this.setPanelHidden(hidden);
		}
	}

	hasMainWindowBorder(): boolean {
		return this.state.runtime.mainWindowBorder;
	}

	getMainWindowBorderRadius(): string | undefined {
		return this.state.runtime.mainWindowBorder && isMacintosh ? '10px' : undefined;
	}

	getSideBarPosition(): Position {
		return this.stateModel.getRuntimeValue(LayoutStateKeys.SIDEBAR_POSITON);
	}

	getPanelAlignment(): PanelAlignment {
		return this.stateModel.getRuntimeValue(LayoutStateKeys.PANEL_ALIGNMENT);
	}

	updateMenubarVisibility(skipLayout: boolean): void {
		const shouldShowTitleBar = shouldShowCustomTitleBar(this.configurationService, mainWindow, this.state.runtime.menuBar.toggled);
		if (!skipLayout && this.workbenchGrid && shouldShowTitleBar !== this.isVisible(Parts.TITLEBAR_PART, mainWindow)) {
			this.workbenchGrid.setViewVisible(this.titleBarPartView, shouldShowTitleBar);
		}
	}

	updateCustomTitleBarVisibility(): void {
		const shouldShowTitleBar = shouldShowCustomTitleBar(this.configurationService, mainWindow, this.state.runtime.menuBar.toggled);
		const titlebarVisible = this.isVisible(Parts.TITLEBAR_PART);
		if (shouldShowTitleBar !== titlebarVisible) {
			this.workbenchGrid.setViewVisible(this.titleBarPartView, shouldShowTitleBar);
		}
	}

	toggleMenuBar(): void {
		let currentVisibilityValue = getMenuBarVisibility(this.configurationService);
		if (typeof currentVisibilityValue !== 'string') {
			currentVisibilityValue = 'classic';
		}

		let newVisibilityValue: string;
		if (currentVisibilityValue === 'visible' || currentVisibilityValue === 'classic') {
			newVisibilityValue = hasNativeMenu(this.configurationService) ? 'toggle' : 'compact';
		} else {
			newVisibilityValue = 'classic';
		}

		this.configurationService.updateValue(MenuSettings.MenuBarVisibility, newVisibilityValue);
	}

	getPanelPosition(): Position {
		return this.stateModel.getRuntimeValue(LayoutStateKeys.PANEL_POSITION);
	}

	setPanelPosition(position: Position): void {
		if (!this.isVisible(Parts.PANEL_PART)) {
			this.setPanelHidden(false);
		}

		const panelPart = this.getPart(Parts.PANEL_PART);
		const oldPositionValue = positionToString(this.getPanelPosition());
		const newPositionValue = positionToString(position);

		// Adjust CSS
		const panelContainer = assertReturnsDefined(panelPart.getContainer());
		panelContainer.classList.remove(oldPositionValue);
		panelContainer.classList.add(newPositionValue);

		// Update Styles
		panelPart.updateStyles();

		// Layout
		const size = this.workbenchGrid.getViewSize(this.panelPartView);
		const sideBarSize = this.workbenchGrid.getViewSize(this.sideBarPartView);
		const auxiliaryBarSize = this.workbenchGrid.getViewSize(this.auxiliaryBarPartView);

		let editorHidden = !this.isVisible(Parts.EDITOR_PART, mainWindow);

		// Save last non-maximized size for panel before move
		if (newPositionValue !== oldPositionValue && !editorHidden) {

			// Save the current size of the panel for the new orthogonal direction
			// If moving down, save the width of the panel
			// Otherwise, save the height of the panel
			if (isHorizontal(position)) {
				this.stateModel.setRuntimeValue(LayoutStateKeys.PANEL_LAST_NON_MAXIMIZED_WIDTH, size.width);
			} else if (isHorizontal(positionFromString(oldPositionValue))) {
				this.stateModel.setRuntimeValue(LayoutStateKeys.PANEL_LAST_NON_MAXIMIZED_HEIGHT, size.height);
			}
		}

		if (isHorizontal(position) && this.getPanelAlignment() !== 'center' && editorHidden) {
			this.toggleMaximizedPanel();
			editorHidden = false;
		}

		this.stateModel.setRuntimeValue(LayoutStateKeys.PANEL_POSITION, position);

		const sideBarVisible = this.isVisible(Parts.SIDEBAR_PART);
		const auxiliaryBarVisible = this.isVisible(Parts.AUXILIARYBAR_PART);

		const hadFocus = this.hasFocus(Parts.PANEL_PART);

		if (position === Position.BOTTOM) {
			this.workbenchGrid.moveView(this.panelPartView, editorHidden ? size.height : this.stateModel.getRuntimeValue(LayoutStateKeys.PANEL_LAST_NON_MAXIMIZED_HEIGHT), this.editorPartView, Direction.Down);
		} else if (position === Position.TOP) {
			this.workbenchGrid.moveView(this.panelPartView, editorHidden ? size.height : this.stateModel.getRuntimeValue(LayoutStateKeys.PANEL_LAST_NON_MAXIMIZED_HEIGHT), this.editorPartView, Direction.Up);
		} else if (position === Position.RIGHT) {
			this.workbenchGrid.moveView(this.panelPartView, editorHidden ? size.width : this.stateModel.getRuntimeValue(LayoutStateKeys.PANEL_LAST_NON_MAXIMIZED_WIDTH), this.editorPartView, Direction.Right);
		} else {
			this.workbenchGrid.moveView(this.panelPartView, editorHidden ? size.width : this.stateModel.getRuntimeValue(LayoutStateKeys.PANEL_LAST_NON_MAXIMIZED_WIDTH), this.editorPartView, Direction.Left);
		}

		if (hadFocus) {
			this.focusPart(Parts.PANEL_PART);
		}

		// Reset sidebar to original size before shifting the panel
		this.workbenchGrid.resizeView(this.sideBarPartView, sideBarSize);
		if (!sideBarVisible) {
			this.setSideBarHidden(true);
		}

		this.workbenchGrid.resizeView(this.auxiliaryBarPartView, auxiliaryBarSize);
		if (!auxiliaryBarVisible) {
			this.setAuxiliaryBarHidden(true);
		}

		if (isHorizontal(position)) {
			this.adjustPartPositions(this.getSideBarPosition(), this.getPanelAlignment(), position);
		}

		this._onDidChangePanelPosition.fire(newPositionValue);
	}

	isWindowMaximized(targetWindow: Window): boolean {
		return this.state.runtime.maximized.has(getWindowId(targetWindow));
	}

	updateWindowMaximizedState(targetWindow: Window, maximized: boolean) {
		this.mainContainer.classList.toggle(LayoutClasses.MAXIMIZED, maximized);

		const targetWindowId = getWindowId(targetWindow);
		if (maximized === this.state.runtime.maximized.has(targetWindowId)) {
			return;
		}

		if (maximized) {
			this.state.runtime.maximized.add(targetWindowId);
		} else {
			this.state.runtime.maximized.delete(targetWindowId);
		}

		this.updateWindowBorder();
		this._onDidChangeWindowMaximized.fire({ windowId: targetWindowId, maximized });
	}

	getVisibleNeighborPart(part: Parts, direction: Direction): Parts | undefined {
		if (!this.workbenchGrid) {
			return undefined;
		}

		if (!this.isVisible(part, mainWindow)) {
			return undefined;
		}

		const neighborViews = this.workbenchGrid.getNeighborViews(this.getPart(part), direction, false);

		if (!neighborViews) {
			return undefined;
		}

		for (const neighborView of neighborViews) {
			const neighborPart =
				[Parts.ACTIVITYBAR_PART, Parts.EDITOR_PART, Parts.PANEL_PART, Parts.AUXILIARYBAR_PART, Parts.SIDEBAR_PART, Parts.STATUSBAR_PART, Parts.TITLEBAR_PART]
					.find(partId => this.getPart(partId) === neighborView && this.isVisible(partId, mainWindow));

			if (neighborPart !== undefined) {
				return neighborPart;
			}
		}

		return undefined;
	}

	private onDidChangeWCO(): void {
		const bannerFirst = this.workbenchGrid.getNeighborViews(this.titleBarPartView, Direction.Up, false).length > 0;
		const shouldBannerBeFirst = this.shouldShowBannerFirst();

		if (bannerFirst !== shouldBannerBeFirst) {
			this.workbenchGrid.moveView(this.bannerPartView, Sizing.Distribute, this.titleBarPartView, shouldBannerBeFirst ? Direction.Up : Direction.Down);
		}

		this.workbenchGrid.setViewVisible(this.titleBarPartView, shouldShowCustomTitleBar(this.configurationService, mainWindow, this.state.runtime.menuBar.toggled));
	}

	private arrangeEditorNodes(nodes: { editor: ISerializedNode; sideBar?: ISerializedNode; auxiliaryBar?: ISerializedNode }, availableHeight: number, availableWidth: number): ISerializedNode {
		if (!nodes.sideBar && !nodes.auxiliaryBar) {
			nodes.editor.size = availableHeight;
			return nodes.editor;
		}

		const result = [nodes.editor];
		nodes.editor.size = availableWidth;
		if (nodes.sideBar) {
			if (this.stateModel.getRuntimeValue(LayoutStateKeys.SIDEBAR_POSITON) === Position.LEFT) {
				result.splice(0, 0, nodes.sideBar);
			} else {
				result.push(nodes.sideBar);
			}

			nodes.editor.size -= this.stateModel.getRuntimeValue(LayoutStateKeys.SIDEBAR_HIDDEN) ? 0 : nodes.sideBar.size;
		}

		if (nodes.auxiliaryBar) {
			if (this.stateModel.getRuntimeValue(LayoutStateKeys.SIDEBAR_POSITON) === Position.RIGHT) {
				result.splice(0, 0, nodes.auxiliaryBar);
			} else {
				result.push(nodes.auxiliaryBar);
			}

			nodes.editor.size -= this.stateModel.getRuntimeValue(LayoutStateKeys.AUXILIARYBAR_HIDDEN) ? 0 : nodes.auxiliaryBar.size;
		}

		return {
			type: 'branch',
			data: result,
			size: availableHeight,
			visible: result.some(node => node.visible)
		};
	}

	private arrangeMiddleSectionNodes(nodes: { editor: ISerializedNode; panel: ISerializedNode; activityBar: ISerializedNode; sideBar: ISerializedNode; auxiliaryBar: ISerializedNode }, availableWidth: number, availableHeight: number): ISerializedNode[] {
		const activityBarSize = this.stateModel.getRuntimeValue(LayoutStateKeys.ACTIVITYBAR_HIDDEN) ? 0 : nodes.activityBar.size;
		const sideBarSize = this.stateModel.getRuntimeValue(LayoutStateKeys.SIDEBAR_HIDDEN) ? 0 : nodes.sideBar.size;
		const auxiliaryBarSize = this.stateModel.getRuntimeValue(LayoutStateKeys.AUXILIARYBAR_HIDDEN) ? 0 : nodes.auxiliaryBar.size;
		const panelSize = this.stateModel.getInitializationValue(LayoutStateKeys.PANEL_SIZE) ? 0 : nodes.panel.size;

		const panelPostion = this.stateModel.getRuntimeValue(LayoutStateKeys.PANEL_POSITION);
		const sideBarPosition = this.stateModel.getRuntimeValue(LayoutStateKeys.SIDEBAR_POSITON);

		const result = [] as ISerializedNode[];
		if (!isHorizontal(panelPostion)) {
			result.push(nodes.editor);
			nodes.editor.size = availableWidth - activityBarSize - sideBarSize - panelSize - auxiliaryBarSize;
			if (panelPostion === Position.RIGHT) {
				result.push(nodes.panel);
			} else {
				result.splice(0, 0, nodes.panel);
			}

			if (sideBarPosition === Position.LEFT) {
				result.push(nodes.auxiliaryBar);
				result.splice(0, 0, nodes.sideBar);
				result.splice(0, 0, nodes.activityBar);
			} else {
				result.splice(0, 0, nodes.auxiliaryBar);
				result.push(nodes.sideBar);
				result.push(nodes.activityBar);
			}
		} else {
			const panelAlignment = this.stateModel.getRuntimeValue(LayoutStateKeys.PANEL_ALIGNMENT);
			const sideBarNextToEditor = !(panelAlignment === 'center' || (sideBarPosition === Position.LEFT && panelAlignment === 'right') || (sideBarPosition === Position.RIGHT && panelAlignment === 'left'));
			const auxiliaryBarNextToEditor = !(panelAlignment === 'center' || (sideBarPosition === Position.RIGHT && panelAlignment === 'right') || (sideBarPosition === Position.LEFT && panelAlignment === 'left'));

			const editorSectionWidth = availableWidth - activityBarSize - (sideBarNextToEditor ? 0 : sideBarSize) - (auxiliaryBarNextToEditor ? 0 : auxiliaryBarSize);

			const editorNodes = this.arrangeEditorNodes({
				editor: nodes.editor,
				sideBar: sideBarNextToEditor ? nodes.sideBar : undefined,
				auxiliaryBar: auxiliaryBarNextToEditor ? nodes.auxiliaryBar : undefined
			}, availableHeight - panelSize, editorSectionWidth);

			const data = panelPostion === Position.BOTTOM ? [editorNodes, nodes.panel] : [nodes.panel, editorNodes];
			result.push({
				type: 'branch',
				data,
				size: editorSectionWidth,
				visible: data.some(node => node.visible)
			});

			if (!sideBarNextToEditor) {
				if (sideBarPosition === Position.LEFT) {
					result.splice(0, 0, nodes.sideBar);
				} else {
					result.push(nodes.sideBar);
				}
			}

			if (!auxiliaryBarNextToEditor) {
				if (sideBarPosition === Position.RIGHT) {
					result.splice(0, 0, nodes.auxiliaryBar);
				} else {
					result.push(nodes.auxiliaryBar);
				}
			}

			if (sideBarPosition === Position.LEFT) {
				result.splice(0, 0, nodes.activityBar);
			} else {
				result.push(nodes.activityBar);
			}
		}

		return result;
	}

	private createGridDescriptor(): ISerializedGrid {
		const { width, height } = this._mainContainerDimension;
		const sideBarSize = this.stateModel.getInitializationValue(LayoutStateKeys.SIDEBAR_SIZE);
		const auxiliaryBarSize = this.stateModel.getInitializationValue(LayoutStateKeys.AUXILIARYBAR_SIZE);
		const panelSize = this.stateModel.getInitializationValue(LayoutStateKeys.PANEL_SIZE);

		const titleBarHeight = this.titleBarPartView.minimumHeight;
		const bannerHeight = this.bannerPartView.minimumHeight;
		const statusBarHeight = this.statusBarPartView.minimumHeight;
		const activityBarWidth = this.activityBarPartView.minimumWidth;
		const middleSectionHeight = height - titleBarHeight - statusBarHeight;

		const titleAndBanner: ISerializedNode[] = [
			{
				type: 'leaf',
				data: { type: Parts.TITLEBAR_PART },
				size: titleBarHeight,
				visible: this.isVisible(Parts.TITLEBAR_PART, mainWindow)
			},
			{
				type: 'leaf',
				data: { type: Parts.BANNER_PART },
				size: bannerHeight,
				visible: false
			}
		];

		const activityBarNode: ISerializedLeafNode = {
			type: 'leaf',
			data: { type: Parts.ACTIVITYBAR_PART },
			size: activityBarWidth,
			visible: !this.stateModel.getRuntimeValue(LayoutStateKeys.ACTIVITYBAR_HIDDEN)
		};

		const sideBarNode: ISerializedLeafNode = {
			type: 'leaf',
			data: { type: Parts.SIDEBAR_PART },
			size: sideBarSize,
			visible: !this.stateModel.getRuntimeValue(LayoutStateKeys.SIDEBAR_HIDDEN)
		};

		const auxiliaryBarNode: ISerializedLeafNode = {
			type: 'leaf',
			data: { type: Parts.AUXILIARYBAR_PART },
			size: auxiliaryBarSize,
			visible: this.isVisible(Parts.AUXILIARYBAR_PART)
		};

		const editorNode: ISerializedLeafNode = {
			type: 'leaf',
			data: { type: Parts.EDITOR_PART },
			size: 0, // Update based on sibling sizes
			visible: !this.stateModel.getRuntimeValue(LayoutStateKeys.EDITOR_HIDDEN)
		};

		const panelNode: ISerializedLeafNode = {
			type: 'leaf',
			data: { type: Parts.PANEL_PART },
			size: panelSize,
			visible: !this.stateModel.getRuntimeValue(LayoutStateKeys.PANEL_HIDDEN)
		};

		const middleSection: ISerializedNode[] = this.arrangeMiddleSectionNodes({
			activityBar: activityBarNode,
			auxiliaryBar: auxiliaryBarNode,
			editor: editorNode,
			panel: panelNode,
			sideBar: sideBarNode
		}, width, middleSectionHeight);

		const result: ISerializedGrid = {
			root: {
				type: 'branch',
				size: width,
				data: [
					...(this.shouldShowBannerFirst() ? titleAndBanner.reverse() : titleAndBanner),
					{
						type: 'branch',
						data: middleSection,
						size: middleSectionHeight
					},
					{
						type: 'leaf',
						data: { type: Parts.STATUSBAR_PART },
						size: statusBarHeight,
						visible: !this.stateModel.getRuntimeValue(LayoutStateKeys.STATUSBAR_HIDDEN)
					}
				]
			},
			orientation: Orientation.VERTICAL,
			width,
			height
		};

		type StartupLayoutEvent = {
			activityBarVisible: boolean;
			sideBarVisible: boolean;
			auxiliaryBarVisible: boolean;
			panelVisible: boolean;
			statusbarVisible: boolean;
			sideBarPosition: string;
			panelPosition: string;
		};

		type StartupLayoutEventClassification = {
			owner: 'benibenj';
			comment: 'Information about the layout of the workbench during statup';
			activityBarVisible: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether or the not the activity bar is visible' };
			sideBarVisible: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether or the not the primary side bar is visible' };
			auxiliaryBarVisible: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether or the not the secondary side bar is visible' };
			panelVisible: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether or the not the panel is visible' };
			statusbarVisible: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether or the not the status bar is visible' };
			sideBarPosition: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the primary side bar is on the left or right' };
			panelPosition: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the panel is on the top, bottom, left, or right' };
		};

		const layoutDescriptor: StartupLayoutEvent = {
			activityBarVisible: !this.stateModel.getRuntimeValue(LayoutStateKeys.ACTIVITYBAR_HIDDEN),
			sideBarVisible: !this.stateModel.getRuntimeValue(LayoutStateKeys.SIDEBAR_HIDDEN),
			auxiliaryBarVisible: !this.stateModel.getRuntimeValue(LayoutStateKeys.AUXILIARYBAR_HIDDEN),
			panelVisible: !this.stateModel.getRuntimeValue(LayoutStateKeys.PANEL_HIDDEN),
			statusbarVisible: !this.stateModel.getRuntimeValue(LayoutStateKeys.STATUSBAR_HIDDEN),
			sideBarPosition: positionToString(this.stateModel.getRuntimeValue(LayoutStateKeys.SIDEBAR_POSITON)),
			panelPosition: positionToString(this.stateModel.getRuntimeValue(LayoutStateKeys.PANEL_POSITION)),
		};

		// WARNING: Do not remove this event, it's used to track build rollout progress
		// Talk to @joaomoreno, @lszomoru or @jruales before doing so
		this.telemetryService.publicLog2<StartupLayoutEvent, StartupLayoutEventClassification>('startupLayout', layoutDescriptor);

		return result;
	}

	override dispose(): void {
		super.dispose();

		this.disposed = true;
	}
}

type ZenModeConfiguration = {
	centerLayout: boolean;
	fullScreen: boolean;
	hideActivityBar: boolean;
	hideLineNumbers: boolean;
	hideStatusBar: boolean;
	showTabs: 'multiple' | 'single' | 'none';
	restore: boolean;
	silentNotifications: boolean;
};

function getZenModeConfiguration(configurationService: IConfigurationService): ZenModeConfiguration {
	return configurationService.getValue<ZenModeConfiguration>(WorkbenchLayoutSettings.ZEN_MODE_CONFIG);
}

//#endregion

//#region Layout State Model

interface IWorkbenchLayoutStateKey {
	readonly name: string;
	readonly runtime: boolean;
	readonly defaultValue: unknown;
	readonly scope: StorageScope;
	readonly target: StorageTarget;
	readonly zenModeIgnore?: boolean;
}

type StorageKeyType = string | boolean | number | object;

abstract class WorkbenchLayoutStateKey<T extends StorageKeyType> implements IWorkbenchLayoutStateKey {

	abstract readonly runtime: boolean;

	constructor(readonly name: string, readonly scope: StorageScope, readonly target: StorageTarget, public defaultValue: T) { }
}

class RuntimeStateKey<T extends StorageKeyType> extends WorkbenchLayoutStateKey<T> {

	readonly runtime = true;

	constructor(name: string, scope: StorageScope, target: StorageTarget, defaultValue: T, readonly zenModeIgnore?: boolean) {
		super(name, scope, target, defaultValue);
	}
}

class InitializationStateKey<T extends StorageKeyType> extends WorkbenchLayoutStateKey<T> {
	readonly runtime = false;
}

const LayoutStateKeys = {

	// Editor
	MAIN_EDITOR_CENTERED: new RuntimeStateKey<boolean>('editor.centered', StorageScope.WORKSPACE, StorageTarget.MACHINE, false),

	// Zen Mode
	ZEN_MODE_ACTIVE: new RuntimeStateKey<boolean>('zenMode.active', StorageScope.WORKSPACE, StorageTarget.MACHINE, false),
	ZEN_MODE_EXIT_INFO: new RuntimeStateKey('zenMode.exitInfo', StorageScope.WORKSPACE, StorageTarget.MACHINE, {
		transitionedToCenteredEditorLayout: false,
		transitionedToFullScreen: false,
		handleNotificationsDoNotDisturbMode: false,
		wasVisible: {
			auxiliaryBar: false,
			panel: false,
			sideBar: false,
		},
	}),

	// Part Sizing
	SIDEBAR_SIZE: new InitializationStateKey<number>('sideBar.size', StorageScope.PROFILE, StorageTarget.MACHINE, 300),
	AUXILIARYBAR_SIZE: new InitializationStateKey<number>('auxiliaryBar.size', StorageScope.PROFILE, StorageTarget.MACHINE, 300),
	PANEL_SIZE: new InitializationStateKey<number>('panel.size', StorageScope.PROFILE, StorageTarget.MACHINE, 300),

	// Part State
	PANEL_LAST_NON_MAXIMIZED_HEIGHT: new RuntimeStateKey<number>('panel.lastNonMaximizedHeight', StorageScope.PROFILE, StorageTarget.MACHINE, 300),
	PANEL_LAST_NON_MAXIMIZED_WIDTH: new RuntimeStateKey<number>('panel.lastNonMaximizedWidth', StorageScope.PROFILE, StorageTarget.MACHINE, 300),
	PANEL_WAS_LAST_MAXIMIZED: new RuntimeStateKey<boolean>('panel.wasLastMaximized', StorageScope.WORKSPACE, StorageTarget.MACHINE, false),

	AUXILIARYBAR_WAS_LAST_MAXIMIZED: new RuntimeStateKey<boolean>('auxiliaryBar.wasLastMaximized', StorageScope.WORKSPACE, StorageTarget.MACHINE, false),
	AUXILIARYBAR_LAST_NON_MAXIMIZED_SIZE: new RuntimeStateKey<number>('auxiliaryBar.lastNonMaximizedSize', StorageScope.PROFILE, StorageTarget.MACHINE, 300),
	AUXILIARYBAR_LAST_NON_MAXIMIZED_VISIBILITY: new RuntimeStateKey('auxiliaryBar.lastNonMaximizedVisibility', StorageScope.WORKSPACE, StorageTarget.MACHINE, {
		sideBarVisible: false,
		editorVisible: false,
		panelVisible: false,
		auxiliaryBarVisible: false
	}),
	AUXILIARYBAR_EMPTY: new InitializationStateKey<boolean>('auxiliaryBar.empty', StorageScope.PROFILE, StorageTarget.MACHINE, false),

	// Part Positions
	SIDEBAR_POSITON: new RuntimeStateKey<Position>('sideBar.position', StorageScope.WORKSPACE, StorageTarget.MACHINE, Position.LEFT),
	PANEL_POSITION: new RuntimeStateKey<Position>('panel.position', StorageScope.WORKSPACE, StorageTarget.MACHINE, Position.BOTTOM),
	PANEL_ALIGNMENT: new RuntimeStateKey<PanelAlignment>('panel.alignment', StorageScope.PROFILE, StorageTarget.USER, 'center'),

	// Part Visibility
	ACTIVITYBAR_HIDDEN: new RuntimeStateKey<boolean>('activityBar.hidden', StorageScope.WORKSPACE, StorageTarget.MACHINE, false, true),
	SIDEBAR_HIDDEN: new RuntimeStateKey<boolean>('sideBar.hidden', StorageScope.WORKSPACE, StorageTarget.MACHINE, false),
	EDITOR_HIDDEN: new RuntimeStateKey<boolean>('editor.hidden', StorageScope.WORKSPACE, StorageTarget.MACHINE, false),
	PANEL_HIDDEN: new RuntimeStateKey<boolean>('panel.hidden', StorageScope.WORKSPACE, StorageTarget.MACHINE, true),
	AUXILIARYBAR_HIDDEN: new RuntimeStateKey<boolean>('auxiliaryBar.hidden', StorageScope.WORKSPACE, StorageTarget.MACHINE, true),
	STATUSBAR_HIDDEN: new RuntimeStateKey<boolean>('statusBar.hidden', StorageScope.WORKSPACE, StorageTarget.MACHINE, false, true)

} as const;

interface ILayoutStateChangeEvent<T extends StorageKeyType> {
	readonly key: RuntimeStateKey<T>;
	readonly value: T;
}

enum WorkbenchLayoutSettings {
	AUXILIARYBAR_DEFAULT_VISIBILITY = 'workbench.secondarySideBar.defaultVisibility',
	ACTIVITY_BAR_VISIBLE = 'workbench.activityBar.visible',
	PANEL_POSITION = 'workbench.panel.defaultLocation',
	PANEL_OPENS_MAXIMIZED = 'workbench.panel.opensMaximized',
	ZEN_MODE_CONFIG = 'zenMode',
	EDITOR_CENTERED_LAYOUT_AUTO_RESIZE = 'workbench.editor.centeredLayoutAutoResize',
}

enum LegacyWorkbenchLayoutSettings {
	STATUSBAR_VISIBLE = 'workbench.statusBar.visible', 	// Deprecated to UI State
	SIDEBAR_POSITION = 'workbench.sideBar.location', 	// Deprecated to UI State
}

interface ILayoutStateLoadConfiguration {
	readonly mainContainerDimension: IDimension;
	readonly resetLayout: boolean;
}

class LayoutStateModel extends Disposable {

	static readonly STORAGE_PREFIX = 'workbench.';

	private readonly _onDidChangeState = this._register(new Emitter<ILayoutStateChangeEvent<StorageKeyType>>());
	readonly onDidChangeState = this._onDidChangeState.event;

	private readonly stateCache = new Map<string, unknown>();

	private readonly isNew: {
		[StorageScope.WORKSPACE]: boolean;
		[StorageScope.PROFILE]: boolean;
		[StorageScope.APPLICATION]: boolean;
	};

	constructor(
		private readonly storageService: IStorageService,
		private readonly configurationService: IConfigurationService,
		private readonly contextService: IWorkspaceContextService,
		private readonly environmentService: IBrowserWorkbenchEnvironmentService,
	) {
		super();

		this.isNew = {
			[StorageScope.WORKSPACE]: this.storageService.isNew(StorageScope.WORKSPACE),
			[StorageScope.PROFILE]: this.storageService.isNew(StorageScope.PROFILE),
			[StorageScope.APPLICATION]: this.storageService.isNew(StorageScope.APPLICATION)
		};

		this._register(this.configurationService.onDidChangeConfiguration(configurationChange => this.updateStateFromLegacySettings(configurationChange)));
	}

	private updateStateFromLegacySettings(configurationChangeEvent: IConfigurationChangeEvent): void {
		if (configurationChangeEvent.affectsConfiguration(LayoutSettings.ACTIVITY_BAR_LOCATION)) {
			this.setRuntimeValueAndFire(LayoutStateKeys.ACTIVITYBAR_HIDDEN, this.isActivityBarHidden());
		}

		if (configurationChangeEvent.affectsConfiguration(LegacyWorkbenchLayoutSettings.STATUSBAR_VISIBLE)) {
			this.setRuntimeValueAndFire(LayoutStateKeys.STATUSBAR_HIDDEN, !this.configurationService.getValue(LegacyWorkbenchLayoutSettings.STATUSBAR_VISIBLE));
		}

		if (configurationChangeEvent.affectsConfiguration(LegacyWorkbenchLayoutSettings.SIDEBAR_POSITION)) {
			this.setRuntimeValueAndFire(LayoutStateKeys.SIDEBAR_POSITON, positionFromString(this.configurationService.getValue(LegacyWorkbenchLayoutSettings.SIDEBAR_POSITION) ?? 'left'));
		}
	}

	private updateLegacySettingsFromState<T extends StorageKeyType>(key: RuntimeStateKey<T>, value: T): void {
		const isZenMode = this.getRuntimeValue(LayoutStateKeys.ZEN_MODE_ACTIVE);
		if (key.zenModeIgnore && isZenMode) {
			return;
		}

		if (key === LayoutStateKeys.ACTIVITYBAR_HIDDEN) {
			this.configurationService.updateValue(LayoutSettings.ACTIVITY_BAR_LOCATION, value ? ActivityBarPosition.HIDDEN : undefined);
		} else if (key === LayoutStateKeys.STATUSBAR_HIDDEN) {
			this.configurationService.updateValue(LegacyWorkbenchLayoutSettings.STATUSBAR_VISIBLE, !value);
		} else if (key === LayoutStateKeys.SIDEBAR_POSITON) {
			this.configurationService.updateValue(LegacyWorkbenchLayoutSettings.SIDEBAR_POSITION, positionToString(value as Position));
		}
	}

	load(configuration: ILayoutStateLoadConfiguration): void {
		let key: keyof typeof LayoutStateKeys;

		// Load stored values for all keys unless we explicitly set to reset
		if (!configuration.resetLayout) {
			for (key in LayoutStateKeys) {
				const stateKey = LayoutStateKeys[key] as WorkbenchLayoutStateKey<StorageKeyType>;
				const value = this.loadKeyFromStorage(stateKey);

				if (value !== undefined) {
					this.stateCache.set(stateKey.name, value);
				}
			}
		}

		// Apply legacy settings
		this.stateCache.set(LayoutStateKeys.ACTIVITYBAR_HIDDEN.name, this.isActivityBarHidden());
		this.stateCache.set(LayoutStateKeys.STATUSBAR_HIDDEN.name, !this.configurationService.getValue(LegacyWorkbenchLayoutSettings.STATUSBAR_VISIBLE));
		this.stateCache.set(LayoutStateKeys.SIDEBAR_POSITON.name, positionFromString(this.configurationService.getValue(LegacyWorkbenchLayoutSettings.SIDEBAR_POSITION) ?? 'left'));

		// Set dynamic defaults: part sizing and side bar visibility
		const workbenchState = this.contextService.getWorkbenchState();
		const mainContainerDimension = configuration.mainContainerDimension;
		LayoutStateKeys.SIDEBAR_SIZE.defaultValue = Math.min(300, mainContainerDimension.width / 4);
		LayoutStateKeys.SIDEBAR_HIDDEN.defaultValue = workbenchState === WorkbenchState.EMPTY;
		LayoutStateKeys.AUXILIARYBAR_SIZE.defaultValue = Math.min(300, mainContainerDimension.width / 4);
		LayoutStateKeys.AUXILIARYBAR_HIDDEN.defaultValue = (() => {
			if (isWeb && !this.environmentService.remoteAuthority) {
				return true; // not required in web if unsupported
			}

			const configuration = this.configurationService.inspect(WorkbenchLayoutSettings.AUXILIARYBAR_DEFAULT_VISIBILITY);

			// Unless auxiliary bar visibility is explicitly configured, make
			// sure to not force open it in case we know it was empty before.
			if (configuration.defaultValue !== 'hidden' && !isConfigured(configuration) && this.stateCache.get(LayoutStateKeys.AUXILIARYBAR_EMPTY.name)) {
				return true;
			}

			// New users: Show auxiliary bar even in empty workspaces
			// but not if the user explicitly hides it
			if (
				this.isNew[StorageScope.APPLICATION] &&
				configuration.value !== 'hidden'
			) {
				return false;
			}

			// Existing users: respect visibility setting
			switch (configuration.value) {
				case 'hidden':
					return true;
				case 'visibleInWorkspace':
				case 'maximizedInWorkspace':
					return workbenchState === WorkbenchState.EMPTY;
				default:
					return false;
			}
		})();
		LayoutStateKeys.PANEL_SIZE.defaultValue = (this.stateCache.get(LayoutStateKeys.PANEL_POSITION.name) ?? isHorizontal(LayoutStateKeys.PANEL_POSITION.defaultValue)) ? mainContainerDimension.height / 3 : mainContainerDimension.width / 4;
		LayoutStateKeys.PANEL_POSITION.defaultValue = positionFromString(this.configurationService.getValue(WorkbenchLayoutSettings.PANEL_POSITION) ?? 'bottom');

		// Apply all defaults
		for (key in LayoutStateKeys) {
			const stateKey = LayoutStateKeys[key];
			if (this.stateCache.get(stateKey.name) === undefined) {
				this.stateCache.set(stateKey.name, stateKey.defaultValue);
			}
		}

		// Apply all overrides
		this.applyOverrides(configuration);

		// Register for runtime key changes
		this._register(this.storageService.onDidChangeValue(StorageScope.PROFILE, undefined, this._store)(storageChangeEvent => {
			let key: keyof typeof LayoutStateKeys;
			for (key in LayoutStateKeys) {
				const stateKey = LayoutStateKeys[key] as WorkbenchLayoutStateKey<StorageKeyType>;
				if (stateKey instanceof RuntimeStateKey && stateKey.scope === StorageScope.PROFILE && stateKey.target === StorageTarget.USER) {
					if (`${LayoutStateModel.STORAGE_PREFIX}${stateKey.name}` === storageChangeEvent.key) {
						const value = this.loadKeyFromStorage(stateKey) ?? stateKey.defaultValue;
						if (this.stateCache.get(stateKey.name) !== value) {
							this.stateCache.set(stateKey.name, value);
							this._onDidChangeState.fire({ key: stateKey, value });
						}
					}
				}
			}
		}));
	}

	private applyOverrides(configuration: ILayoutStateLoadConfiguration): void {

		// Auxiliary bar: Maximized setting (new workspaces)
		if (this.isNew[StorageScope.WORKSPACE]) {
			const defaultAuxiliaryBarVisibility = this.configurationService.getValue(WorkbenchLayoutSettings.AUXILIARYBAR_DEFAULT_VISIBILITY);
			if (
				defaultAuxiliaryBarVisibility === 'maximized' ||
				(defaultAuxiliaryBarVisibility === 'maximizedInWorkspace' && this.contextService.getWorkbenchState() !== WorkbenchState.EMPTY)
			) {
				this.applyAuxiliaryBarMaximizedOverride();
			}
		}

		// Both editor and panel should not be hidden on startup unless auxiliary bar is maximized
		if (
			this.getRuntimeValue(LayoutStateKeys.PANEL_HIDDEN) &&
			this.getRuntimeValue(LayoutStateKeys.EDITOR_HIDDEN) &&
			!this.getRuntimeValue(LayoutStateKeys.AUXILIARYBAR_WAS_LAST_MAXIMIZED)
		) {
			this.setRuntimeValue(LayoutStateKeys.EDITOR_HIDDEN, false);
		}

		// Restrict auxiliary bar size in case of small window dimensions
		if (this.isNew[StorageScope.WORKSPACE] && configuration.mainContainerDimension.width <= DEFAULT_WORKSPACE_WINDOW_DIMENSIONS.width) {
			this.setInitializationValue(LayoutStateKeys.SIDEBAR_SIZE, Math.min(300, configuration.mainContainerDimension.width / 4));
			this.setInitializationValue(LayoutStateKeys.AUXILIARYBAR_SIZE, Math.min(300, configuration.mainContainerDimension.width / 4));
		}
	}

	private applyAuxiliaryBarMaximizedOverride(): void {
		this.setRuntimeValue(LayoutStateKeys.AUXILIARYBAR_LAST_NON_MAXIMIZED_VISIBILITY, {
			sideBarVisible: !this.getRuntimeValue(LayoutStateKeys.SIDEBAR_HIDDEN),
			panelVisible: !this.getRuntimeValue(LayoutStateKeys.PANEL_HIDDEN),
			editorVisible: !this.getRuntimeValue(LayoutStateKeys.EDITOR_HIDDEN),
			auxiliaryBarVisible: !this.getRuntimeValue(LayoutStateKeys.AUXILIARYBAR_HIDDEN)
		});

		this.setRuntimeValue(LayoutStateKeys.SIDEBAR_HIDDEN, true);
		this.setRuntimeValue(LayoutStateKeys.PANEL_HIDDEN, true);
		this.setRuntimeValue(LayoutStateKeys.EDITOR_HIDDEN, true);
		this.setRuntimeValue(LayoutStateKeys.AUXILIARYBAR_HIDDEN, false);

		this.setRuntimeValue(LayoutStateKeys.AUXILIARYBAR_LAST_NON_MAXIMIZED_SIZE, this.getInitializationValue(LayoutStateKeys.AUXILIARYBAR_SIZE));
		this.setRuntimeValue(LayoutStateKeys.AUXILIARYBAR_WAS_LAST_MAXIMIZED, true);
	}

	save(workspace: boolean, global: boolean): void {
		let key: keyof typeof LayoutStateKeys;

		const isZenMode = this.getRuntimeValue(LayoutStateKeys.ZEN_MODE_ACTIVE);

		for (key in LayoutStateKeys) {
			const stateKey = LayoutStateKeys[key] as WorkbenchLayoutStateKey<StorageKeyType>;
			if ((workspace && stateKey.scope === StorageScope.WORKSPACE) ||
				(global && stateKey.scope === StorageScope.PROFILE)) {
				if (isZenMode && stateKey instanceof RuntimeStateKey && stateKey.zenModeIgnore) {
					continue; // Don't write out specific keys while in zen mode
				}

				this.saveKeyToStorage(stateKey);
			}
		}
	}

	getInitializationValue<T extends StorageKeyType>(key: InitializationStateKey<T>): T {
		return this.stateCache.get(key.name) as T;
	}

	setInitializationValue<T extends StorageKeyType>(key: InitializationStateKey<T>, value: T): void {
		this.stateCache.set(key.name, value);
	}

	getRuntimeValue<T extends StorageKeyType>(key: RuntimeStateKey<T>, fallbackToSetting?: boolean): T {
		if (fallbackToSetting) {
			switch (key) {
				case LayoutStateKeys.ACTIVITYBAR_HIDDEN:
					this.stateCache.set(key.name, this.isActivityBarHidden());
					break;
				case LayoutStateKeys.STATUSBAR_HIDDEN:
					this.stateCache.set(key.name, !this.configurationService.getValue(LegacyWorkbenchLayoutSettings.STATUSBAR_VISIBLE));
					break;
				case LayoutStateKeys.SIDEBAR_POSITON:
					this.stateCache.set(key.name, this.configurationService.getValue(LegacyWorkbenchLayoutSettings.SIDEBAR_POSITION) ?? 'left');
					break;
			}
		}

		return this.stateCache.get(key.name) as T;
	}

	setRuntimeValue<T extends StorageKeyType>(key: RuntimeStateKey<T>, value: T): void {
		this.stateCache.set(key.name, value);
		const isZenMode = this.getRuntimeValue(LayoutStateKeys.ZEN_MODE_ACTIVE);

		if (key.scope === StorageScope.PROFILE) {
			if (!isZenMode || !key.zenModeIgnore) {
				this.saveKeyToStorage<T>(key);
				this.updateLegacySettingsFromState(key, value);
			}
		}
	}

	private isActivityBarHidden(): boolean {
		const oldValue = this.configurationService.getValue<boolean | undefined>(WorkbenchLayoutSettings.ACTIVITY_BAR_VISIBLE);
		if (oldValue !== undefined) {
			return !oldValue;
		}

		return this.configurationService.getValue(LayoutSettings.ACTIVITY_BAR_LOCATION) !== ActivityBarPosition.DEFAULT;
	}

	private setRuntimeValueAndFire<T extends StorageKeyType>(key: RuntimeStateKey<T>, value: T): void {
		const previousValue = this.stateCache.get(key.name);
		if (previousValue === value) {
			return;
		}

		this.setRuntimeValue(key, value);
		this._onDidChangeState.fire({ key, value });
	}

	private saveKeyToStorage<T extends StorageKeyType>(key: WorkbenchLayoutStateKey<T>): void {
		const value = this.stateCache.get(key.name) as T;
		this.storageService.store(`${LayoutStateModel.STORAGE_PREFIX}${key.name}`, typeof value === 'object' ? JSON.stringify(value) : value, key.scope, key.target);
	}

	private loadKeyFromStorage<T extends StorageKeyType>(key: WorkbenchLayoutStateKey<T>): T | undefined {
		const value = this.storageService.get(`${LayoutStateModel.STORAGE_PREFIX}${key.name}`, key.scope);
		if (value !== undefined) {
			this.isNew[key.scope] = false; // remember that we had previous state for this scope

			switch (typeof key.defaultValue) {
				case 'boolean': return (value === 'true') as T;
				case 'number': return parseInt(value) as T;
				case 'object': return JSON.parse(value) as T;
			}
		}

		return value as T | undefined;
	}
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/panecomposite.ts]---
Location: vscode-main/src/vs/workbench/browser/panecomposite.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Registry } from '../../platform/registry/common/platform.js';
import { Composite, CompositeDescriptor, CompositeRegistry } from './composite.js';
import { IConstructorSignature, BrandedService, IInstantiationService } from '../../platform/instantiation/common/instantiation.js';
import { URI } from '../../base/common/uri.js';
import { Dimension } from '../../base/browser/dom.js';
import { IActionViewItem } from '../../base/browser/ui/actionbar/actionbar.js';
import { IAction, Separator } from '../../base/common/actions.js';
import { MenuId, SubmenuItemAction } from '../../platform/actions/common/actions.js';
import { IContextMenuService } from '../../platform/contextview/browser/contextView.js';
import { IStorageService } from '../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../platform/theme/common/themeService.js';
import { IWorkspaceContextService } from '../../platform/workspace/common/workspace.js';
import { ViewPaneContainer, ViewsSubMenu } from './parts/views/viewPaneContainer.js';
import { IPaneComposite } from '../common/panecomposite.js';
import { IView } from '../common/views.js';
import { IExtensionService } from '../services/extensions/common/extensions.js';
import { VIEWPANE_FILTER_ACTION } from './parts/views/viewPane.js';
import { IBoundarySashes } from '../../base/browser/ui/sash/sash.js';
import { IBaseActionViewItemOptions } from '../../base/browser/ui/actionbar/actionViewItems.js';

export abstract class PaneComposite<MementoType extends object = object> extends Composite<MementoType> implements IPaneComposite {

	private viewPaneContainer?: ViewPaneContainer;

	constructor(
		id: string,
		@ITelemetryService telemetryService: ITelemetryService,
		@IStorageService protected storageService: IStorageService,
		@IInstantiationService protected instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IContextMenuService protected contextMenuService: IContextMenuService,
		@IExtensionService protected extensionService: IExtensionService,
		@IWorkspaceContextService protected contextService: IWorkspaceContextService
	) {
		super(id, telemetryService, themeService, storageService);
	}

	override create(parent: HTMLElement): void {
		super.create(parent);
		this.viewPaneContainer = this._register(this.createViewPaneContainer(parent));
		this._register(this.viewPaneContainer.onTitleAreaUpdate(() => this.updateTitleArea()));
		this.viewPaneContainer.create(parent);
	}

	override setVisible(visible: boolean): void {
		super.setVisible(visible);
		this.viewPaneContainer?.setVisible(visible);
	}

	layout(dimension: Dimension): void {
		this.viewPaneContainer?.layout(dimension);
	}

	setBoundarySashes(sashes: IBoundarySashes): void {
		this.viewPaneContainer?.setBoundarySashes(sashes);
	}

	getOptimalWidth(): number {
		return this.viewPaneContainer?.getOptimalWidth() ?? 0;
	}

	openView<T extends IView>(id: string, focus?: boolean): T | undefined {
		return this.viewPaneContainer?.openView(id, focus) as T;
	}

	getViewPaneContainer(): ViewPaneContainer | undefined {
		return this.viewPaneContainer;
	}

	override getActionsContext(): unknown {
		return this.getViewPaneContainer()?.getActionsContext();
	}

	override getContextMenuActions(): readonly IAction[] {
		return this.viewPaneContainer?.menuActions?.getContextMenuActions() ?? [];
	}

	override getMenuIds(): MenuId[] {
		const result: MenuId[] = [];
		if (this.viewPaneContainer?.menuActions) {
			result.push(this.viewPaneContainer.menuActions.menuId);
			if (this.viewPaneContainer.isViewMergedWithContainer()) {
				result.push(this.viewPaneContainer.panes[0].menuActions.menuId);
			}
		}
		return result;
	}

	override getActions(): readonly IAction[] {
		const result = [];
		if (this.viewPaneContainer?.menuActions) {
			result.push(...this.viewPaneContainer.menuActions.getPrimaryActions());
			if (this.viewPaneContainer.isViewMergedWithContainer()) {
				const viewPane = this.viewPaneContainer.panes[0];
				if (viewPane.shouldShowFilterInHeader()) {
					result.push(VIEWPANE_FILTER_ACTION);
				}
				result.push(...viewPane.menuActions.getPrimaryActions());
			}
		}
		return result;
	}

	override getSecondaryActions(): readonly IAction[] {
		if (!this.viewPaneContainer?.menuActions) {
			return [];
		}

		const viewPaneActions = this.viewPaneContainer.isViewMergedWithContainer() ? this.viewPaneContainer.panes[0].menuActions.getSecondaryActions() : [];
		let menuActions = this.viewPaneContainer.menuActions.getSecondaryActions();

		const viewsSubmenuActionIndex = menuActions.findIndex(action => action instanceof SubmenuItemAction && action.item.submenu === ViewsSubMenu);
		if (viewsSubmenuActionIndex !== -1) {
			const viewsSubmenuAction = <SubmenuItemAction>menuActions[viewsSubmenuActionIndex];
			if (viewsSubmenuAction.actions.some(({ enabled }) => enabled)) {
				if (menuActions.length === 1 && viewPaneActions.length === 0) {
					menuActions = viewsSubmenuAction.actions.slice();
				} else if (viewsSubmenuActionIndex !== 0) {
					menuActions = [viewsSubmenuAction, ...menuActions.slice(0, viewsSubmenuActionIndex), ...menuActions.slice(viewsSubmenuActionIndex + 1)];
				}
			} else {
				// Remove views submenu if none of the actions are enabled
				menuActions.splice(viewsSubmenuActionIndex, 1);
			}
		}

		if (menuActions.length && viewPaneActions.length) {
			return [
				...menuActions,
				new Separator(),
				...viewPaneActions
			];
		}

		return menuActions.length ? menuActions : viewPaneActions;
	}

	override getActionViewItem(action: IAction, options: IBaseActionViewItemOptions): IActionViewItem | undefined {
		return this.viewPaneContainer?.getActionViewItem(action, options);
	}

	override getTitle(): string {
		return this.viewPaneContainer?.getTitle() ?? '';
	}

	override focus(): void {
		super.focus();
		this.viewPaneContainer?.focus();
	}

	protected abstract createViewPaneContainer(parent: HTMLElement): ViewPaneContainer;
}


/**
 * A Pane Composite descriptor is a lightweight descriptor of a Pane Composite in the workbench.
 */
export class PaneCompositeDescriptor extends CompositeDescriptor<PaneComposite> {

	static create<Services extends BrandedService[]>(
		ctor: { new(...services: Services): PaneComposite },
		id: string,
		name: string,
		cssClass?: string,
		order?: number,
		requestedIndex?: number,
		iconUrl?: URI
	): PaneCompositeDescriptor {

		return new PaneCompositeDescriptor(ctor as IConstructorSignature<PaneComposite>, id, name, cssClass, order, requestedIndex, iconUrl);
	}

	private constructor(
		ctor: IConstructorSignature<PaneComposite>,
		id: string,
		name: string,
		cssClass?: string,
		order?: number,
		requestedIndex?: number,
		readonly iconUrl?: URI
	) {
		super(ctor, id, name, cssClass, order, requestedIndex);
	}
}

export const Extensions = {
	Viewlets: 'workbench.contributions.viewlets',
	Panels: 'workbench.contributions.panels',
	Auxiliary: 'workbench.contributions.auxiliary',
};

export class PaneCompositeRegistry extends CompositeRegistry<PaneComposite> {

	/**
	 * Registers a viewlet to the platform.
	 */
	registerPaneComposite(descriptor: PaneCompositeDescriptor): void {
		super.registerComposite(descriptor);
	}

	/**
	 * Deregisters a viewlet to the platform.
	 */
	deregisterPaneComposite(id: string): void {
		super.deregisterComposite(id);
	}

	/**
	 * Returns the viewlet descriptor for the given id or null if none.
	 */
	getPaneComposite(id: string): PaneCompositeDescriptor {
		return this.getComposite(id) as PaneCompositeDescriptor;
	}

	/**
	 * Returns an array of registered viewlets known to the platform.
	 */
	getPaneComposites(): PaneCompositeDescriptor[] {
		return this.getComposites() as PaneCompositeDescriptor[];
	}
}

Registry.add(Extensions.Viewlets, new PaneCompositeRegistry());
Registry.add(Extensions.Panels, new PaneCompositeRegistry());
Registry.add(Extensions.Auxiliary, new PaneCompositeRegistry());
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/part.ts]---
Location: vscode-main/src/vs/workbench/browser/part.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/part.css';
import { Component } from '../common/component.js';
import { IThemeService, IColorTheme } from '../../platform/theme/common/themeService.js';
import { Dimension, size, IDimension, getActiveDocument, prepend, IDomPosition } from '../../base/browser/dom.js';
import { IStorageService } from '../../platform/storage/common/storage.js';
import { ISerializableView, IViewSize } from '../../base/browser/ui/grid/grid.js';
import { Event, Emitter } from '../../base/common/event.js';
import { IWorkbenchLayoutService } from '../services/layout/browser/layoutService.js';
import { assertReturnsDefined } from '../../base/common/types.js';
import { IDisposable, toDisposable } from '../../base/common/lifecycle.js';

export interface IPartOptions {
	readonly hasTitle?: boolean;
	readonly borderWidth?: () => number;
}

export interface ILayoutContentResult {
	readonly headerSize: IDimension;
	readonly titleSize: IDimension;
	readonly contentSize: IDimension;
	readonly footerSize: IDimension;
}

/**
 * Parts are layed out in the workbench and have their own layout that
 * arranges an optional title and mandatory content area to show content.
 */
export abstract class Part<MementoType extends object = object> extends Component<MementoType> implements ISerializableView {

	private _dimension: Dimension | undefined;
	get dimension(): Dimension | undefined { return this._dimension; }

	private _contentPosition: IDomPosition | undefined;
	get contentPosition(): IDomPosition | undefined { return this._contentPosition; }

	protected _onDidVisibilityChange = this._register(new Emitter<boolean>());
	readonly onDidVisibilityChange = this._onDidVisibilityChange.event;

	private parent: HTMLElement | undefined;
	private headerArea: HTMLElement | undefined;
	protected titleArea: HTMLElement | undefined;
	protected contentArea: HTMLElement | undefined;
	private footerArea: HTMLElement | undefined;
	private partLayout: PartLayout | undefined;

	constructor(
		id: string,
		private options: IPartOptions,
		themeService: IThemeService,
		storageService: IStorageService,
		protected readonly layoutService: IWorkbenchLayoutService
	) {
		super(id, themeService, storageService);

		this._register(layoutService.registerPart(this));
	}

	protected override onThemeChange(theme: IColorTheme): void {

		// only call if our create() method has been called
		if (this.parent) {
			super.onThemeChange(theme);
		}
	}

	/**
	 * Note: Clients should not call this method, the workbench calls this
	 * method. Calling it otherwise may result in unexpected behavior.
	 *
	 * Called to create title and content area of the part.
	 */
	create(parent: HTMLElement, options?: object): void {
		this.parent = parent;
		this.titleArea = this.createTitleArea(parent, options);
		this.contentArea = this.createContentArea(parent, options);

		this.partLayout = new PartLayout(this.options, this.contentArea);

		this.updateStyles();
	}

	/**
	 * Returns the overall part container.
	 */
	getContainer(): HTMLElement | undefined {
		return this.parent;
	}

	/**
	 * Subclasses override to provide a title area implementation.
	 */
	protected createTitleArea(parent: HTMLElement, options?: object): HTMLElement | undefined {
		return undefined;
	}

	/**
	 * Subclasses override to provide a content area implementation.
	 */
	protected createContentArea(parent: HTMLElement, options?: object): HTMLElement | undefined {
		return undefined;
	}

	protected setHeaderArea(headerContainer: HTMLElement): void {
		if (this.headerArea) {
			throw new Error('Header already exists');
		}

		if (!this.parent || !this.titleArea) {
			return;
		}

		prepend(this.parent, headerContainer);
		headerContainer.classList.add('header-or-footer');
		headerContainer.classList.add('header');

		this.headerArea = headerContainer;
		this.partLayout?.setHeaderVisibility(true);
		this.relayout();
	}

	protected setFooterArea(footerContainer: HTMLElement): void {
		if (this.footerArea) {
			throw new Error('Footer already exists');
		}

		if (!this.parent || !this.titleArea) {
			return;
		}

		this.parent.appendChild(footerContainer);
		footerContainer.classList.add('header-or-footer');
		footerContainer.classList.add('footer');

		this.footerArea = footerContainer;
		this.partLayout?.setFooterVisibility(true);
		this.relayout();
	}

	protected removeHeaderArea(): void {
		if (this.headerArea) {
			this.headerArea.remove();
			this.headerArea = undefined;
			this.partLayout?.setHeaderVisibility(false);
			this.relayout();
		}
	}

	protected removeFooterArea(): void {
		if (this.footerArea) {
			this.footerArea.remove();
			this.footerArea = undefined;
			this.partLayout?.setFooterVisibility(false);
			this.relayout();
		}
	}

	private relayout() {
		if (this.dimension && this.contentPosition) {
			this.layout(this.dimension.width, this.dimension.height, this.contentPosition.top, this.contentPosition.left);
		}
	}
	/**
	 * Layout title and content area in the given dimension.
	 */
	protected layoutContents(width: number, height: number): ILayoutContentResult {
		const partLayout = assertReturnsDefined(this.partLayout);

		return partLayout.layout(width, height);
	}

	//#region ISerializableView

	protected _onDidChange = this._register(new Emitter<IViewSize | undefined>());
	get onDidChange(): Event<IViewSize | undefined> { return this._onDidChange.event; }

	element!: HTMLElement;

	abstract minimumWidth: number;
	abstract maximumWidth: number;
	abstract minimumHeight: number;
	abstract maximumHeight: number;

	layout(width: number, height: number, top: number, left: number): void {
		this._dimension = new Dimension(width, height);
		this._contentPosition = { top, left };
	}

	setVisible(visible: boolean) {
		this._onDidVisibilityChange.fire(visible);
	}

	abstract toJSON(): object;

	//#endregion
}

class PartLayout {

	private static readonly HEADER_HEIGHT = 35;
	private static readonly TITLE_HEIGHT = 35;
	private static readonly Footer_HEIGHT = 35;

	private headerVisible: boolean = false;
	private footerVisible: boolean = false;

	constructor(private options: IPartOptions, private contentArea: HTMLElement | undefined) { }

	layout(width: number, height: number): ILayoutContentResult {

		// Title Size: Width (Fill), Height (Variable)
		let titleSize: Dimension;
		if (this.options.hasTitle) {
			titleSize = new Dimension(width, Math.min(height, PartLayout.TITLE_HEIGHT));
		} else {
			titleSize = Dimension.None;
		}

		// Header Size: Width (Fill), Height (Variable)
		let headerSize: Dimension;
		if (this.headerVisible) {
			headerSize = new Dimension(width, Math.min(height, PartLayout.HEADER_HEIGHT));
		} else {
			headerSize = Dimension.None;
		}

		// Footer Size: Width (Fill), Height (Variable)
		let footerSize: Dimension;
		if (this.footerVisible) {
			footerSize = new Dimension(width, Math.min(height, PartLayout.Footer_HEIGHT));
		} else {
			footerSize = Dimension.None;
		}

		let contentWidth = width;
		if (this.options && typeof this.options.borderWidth === 'function') {
			contentWidth -= this.options.borderWidth(); // adjust for border size
		}

		// Content Size: Width (Fill), Height (Variable)
		const contentSize = new Dimension(contentWidth, height - titleSize.height - headerSize.height - footerSize.height);

		// Content
		if (this.contentArea) {
			size(this.contentArea, contentSize.width, contentSize.height);
		}

		return { headerSize, titleSize, contentSize, footerSize };
	}

	setFooterVisibility(visible: boolean): void {
		this.footerVisible = visible;
	}

	setHeaderVisibility(visible: boolean): void {
		this.headerVisible = visible;
	}
}

export interface IMultiWindowPart {
	readonly element: HTMLElement;
}

export abstract class MultiWindowParts<T extends IMultiWindowPart, MementoType extends object = object> extends Component<MementoType> {

	protected readonly _parts = new Set<T>();
	get parts() { return Array.from(this._parts); }

	abstract readonly mainPart: T;

	registerPart(part: T): IDisposable {
		this._parts.add(part);

		return toDisposable(() => this.unregisterPart(part));
	}

	protected unregisterPart(part: T): void {
		this._parts.delete(part);
	}

	getPart(container: HTMLElement): T {
		return this.getPartByDocument(container.ownerDocument);
	}

	protected getPartByDocument(document: Document): T {
		if (this._parts.size > 1) {
			for (const part of this._parts) {
				if (part.element?.ownerDocument === document) {
					return part;
				}
			}
		}

		return this.mainPart;
	}

	get activePart(): T {
		return this.getPartByDocument(getActiveDocument());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/quickaccess.ts]---
Location: vscode-main/src/vs/workbench/browser/quickaccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../base/common/lifecycle.js';
import { getIEditor } from '../../editor/browser/editorBrowser.js';
import { ICodeEditorViewState, IDiffEditorViewState } from '../../editor/common/editorCommon.js';
import { localize } from '../../nls.js';
import { ICommandHandler } from '../../platform/commands/common/commands.js';
import { ContextKeyExpr, RawContextKey } from '../../platform/contextkey/common/contextkey.js';
import { IResourceEditorInput, ITextResourceEditorInput } from '../../platform/editor/common/editor.js';
import { IKeybindingService } from '../../platform/keybinding/common/keybinding.js';
import { IQuickInputService } from '../../platform/quickinput/common/quickInput.js';
import { IEditorPane, IUntitledTextResourceEditorInput, IUntypedEditorInput } from '../common/editor.js';
import { EditorInput } from '../common/editor/editorInput.js';
import { IEditorGroup, IEditorGroupsService } from '../services/editor/common/editorGroupsService.js';
import { PreferredGroup, IEditorService } from '../services/editor/common/editorService.js';

export const inQuickPickContextKeyValue = 'inQuickOpen';
export const InQuickPickContextKey = new RawContextKey<boolean>(inQuickPickContextKeyValue, false, localize('inQuickOpen', "Whether keyboard focus is inside the quick open control"));
export const inQuickPickContext = ContextKeyExpr.has(inQuickPickContextKeyValue);

export const defaultQuickAccessContextKeyValue = 'inFilesPicker';
export const defaultQuickAccessContext = ContextKeyExpr.and(inQuickPickContext, ContextKeyExpr.has(defaultQuickAccessContextKeyValue));

export interface IWorkbenchQuickAccessConfiguration {
	readonly workbench: {
		readonly commandPalette: {
			readonly history: number;
			readonly preserveInput: boolean;
			readonly showAskInChat: boolean;
			readonly experimental: {
				readonly suggestCommands: boolean;
				readonly enableNaturalLanguageSearch: boolean;
				readonly askChatLocation: 'quickChat' | 'chatView';
			};
		};
		readonly quickOpen: {
			readonly enableExperimentalNewVersion: boolean;
			readonly preserveInput: boolean;
		};
	};
}

export function getQuickNavigateHandler(id: string, next?: boolean): ICommandHandler {
	return accessor => {
		const keybindingService = accessor.get(IKeybindingService);
		const quickInputService = accessor.get(IQuickInputService);

		const keys = keybindingService.lookupKeybindings(id);
		const quickNavigate = { keybindings: keys };

		quickInputService.navigate(!!next, quickNavigate);
	};
}

export class PickerEditorState extends Disposable {
	private _editorViewState: {
		editor: EditorInput;
		group: IEditorGroup;
		state: ICodeEditorViewState | IDiffEditorViewState | undefined;
	} | undefined = undefined;

	private readonly openedTransientEditors = new Set<EditorInput>(); // editors that were opened between set and restore

	constructor(
		@IEditorService private readonly editorService: IEditorService,
		@IEditorGroupsService private readonly editorGroupsService: IEditorGroupsService
	) {
		super();
	}

	set(): void {
		if (this._editorViewState) {
			return; // return early if already done
		}

		const activeEditorPane = this.editorService.activeEditorPane;
		if (activeEditorPane) {
			this._editorViewState = {
				group: activeEditorPane.group,
				editor: activeEditorPane.input,
				state: getIEditor(activeEditorPane.getControl())?.saveViewState() ?? undefined,
			};
		}
	}

	/**
	 * Open a transient editor such that it may be closed when the state is restored.
	 * Note that, when the state is restored, if the editor is no longer transient, it will not be closed.
	 */
	async openTransientEditor(editor: IResourceEditorInput | ITextResourceEditorInput | IUntitledTextResourceEditorInput | IUntypedEditorInput, group?: PreferredGroup): Promise<IEditorPane | undefined> {
		editor.options = { ...editor.options, transient: true };

		const editorPane = await this.editorService.openEditor(editor, group);
		if (editorPane?.input && editorPane.input !== this._editorViewState?.editor && editorPane.group.isTransient(editorPane.input)) {
			this.openedTransientEditors.add(editorPane.input);
		}

		return editorPane;
	}

	async restore(): Promise<void> {
		if (this._editorViewState) {
			for (const editor of this.openedTransientEditors) {
				if (editor.isDirty()) {
					continue;
				}

				for (const group of this.editorGroupsService.groups) {
					if (group.isTransient(editor)) {
						await group.closeEditor(editor, { preserveFocus: true });
					}
				}
			}

			await this._editorViewState.group.openEditor(this._editorViewState.editor, {
				viewState: this._editorViewState.state,
				preserveFocus: true // important to not close the picker as a result
			});

			this.reset();
		}
	}

	reset() {
		this._editorViewState = undefined;
		this.openedTransientEditors.clear();
	}

	override dispose(): void {
		super.dispose();

		this.reset();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/style.ts]---
Location: vscode-main/src/vs/workbench/browser/style.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/style.css';
import { registerThemingParticipant } from '../../platform/theme/common/themeService.js';
import { WORKBENCH_BACKGROUND, TITLE_BAR_ACTIVE_BACKGROUND } from '../common/theme.js';
import { isWeb, isIOS } from '../../base/common/platform.js';
import { createMetaElement } from '../../base/browser/dom.js';
import { isSafari, isStandalone } from '../../base/browser/browser.js';
import { selectionBackground } from '../../platform/theme/common/colorRegistry.js';
import { mainWindow } from '../../base/browser/window.js';

registerThemingParticipant((theme, collector) => {

	// Background (helps for subpixel-antialiasing on Windows)
	const workbenchBackground = WORKBENCH_BACKGROUND(theme);
	collector.addRule(`.monaco-workbench { background-color: ${workbenchBackground}; }`);

	// Selection (do NOT remove - https://github.com/microsoft/vscode/issues/169662)
	const windowSelectionBackground = theme.getColor(selectionBackground);
	if (windowSelectionBackground) {
		collector.addRule(`.monaco-workbench ::selection { background-color: ${windowSelectionBackground}; }`);
	}

	// Update <meta name="theme-color" content=""> based on selected theme
	if (isWeb) {
		const titleBackground = theme.getColor(TITLE_BAR_ACTIVE_BACKGROUND);
		if (titleBackground) {
			const metaElementId = 'monaco-workbench-meta-theme-color';
			// eslint-disable-next-line no-restricted-syntax
			let metaElement = mainWindow.document.getElementById(metaElementId) as HTMLMetaElement | null;
			if (!metaElement) {
				metaElement = createMetaElement();
				metaElement.name = 'theme-color';
				metaElement.id = metaElementId;
			}

			metaElement.content = titleBackground.toString();
		}
	}

	// We disable user select on the root element, however on Safari this seems
	// to prevent any text selection in the monaco editor. As a workaround we
	// allow to select text in monaco editor instances.
	if (isSafari) {
		collector.addRule(`
			body.web {
				touch-action: none;
			}
			.monaco-workbench .monaco-editor .view-lines {
				user-select: text;
				-webkit-user-select: text;
			}
		`);
	}

	// Update body background color to ensure the home indicator area looks similar to the workbench
	if (isIOS && isStandalone()) {
		collector.addRule(`body { background-color: ${workbenchBackground}; }`);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/web.api.ts]---
Location: vscode-main/src/vs/workbench/browser/web.api.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { PerformanceMark } from '../../base/common/performance.js';
import type { UriComponents, URI } from '../../base/common/uri.js';
import type { IWebSocketFactory } from '../../platform/remote/browser/browserSocketFactory.js';
import type { IURLCallbackProvider } from '../services/url/browser/urlService.js';
import type { LogLevel } from '../../platform/log/common/log.js';
import type { IUpdateProvider } from '../services/update/browser/updateService.js';
import type { Event } from '../../base/common/event.js';
import type { IProductConfiguration } from '../../base/common/product.js';
import type { ISecretStorageProvider } from '../../platform/secrets/common/secrets.js';
import type { TunnelProviderFeatures } from '../../platform/tunnel/common/tunnel.js';
import type { IProgress, IProgressCompositeOptions, IProgressDialogOptions, IProgressNotificationOptions, IProgressOptions, IProgressStep, IProgressWindowOptions } from '../../platform/progress/common/progress.js';
import type { ITextEditorOptions } from '../../platform/editor/common/editor.js';
import type { IFolderToOpen, IWorkspaceToOpen } from '../../platform/window/common/window.js';
import type { EditorGroupLayout } from '../services/editor/common/editorGroupsService.js';
import type { IEmbedderTerminalOptions } from '../services/terminal/common/embedderTerminalService.js';
import type { IAuthenticationProvider } from '../services/authentication/common/authentication.js';

/**
 * The `IWorkbench` interface is the API facade for web embedders
 * to call into the workbench.
 *
 * Note: Changes to this interface need to be announced and adopted.
 */
export interface IWorkbench {

	commands: {

		/**
		 * Allows to execute any command if known with the provided arguments.
		 *
		 * @param command Identifier of the command to execute.
		 * @param rest Parameters passed to the command function.
		 * @return A promise that resolves to the returned value of the given command.
		 */
		executeCommand(command: string, ...args: unknown[]): Promise<unknown>;
	};

	logger: {

		/**
		 * Logging for embedder.
		 *
		 * @param level The log level of the message to be printed.
		 * @param message Message to be printed.
		 */
		log(level: LogLevel, message: string): void;
	};

	env: {

		/**
		 * @returns the scheme to use for opening the associated desktop
		 * experience via protocol handler.
		 */
		getUriScheme(): Promise<string>;

		/**
		 * Retrieve performance marks that have been collected during startup. This function
		 * returns tuples of source and marks. A source is a dedicated context, like
		 * the renderer or an extension host.
		 *
		 * *Note* that marks can be collected on different machines and in different processes
		 * and that therefore "different clocks" are used. So, comparing `startTime`-properties
		 * across contexts should be taken with a grain of salt.
		 *
		 * @returns A promise that resolves to tuples of source and marks.
		 */
		retrievePerformanceMarks(): Promise<[string, readonly PerformanceMark[]][]>;

		/**
		 * Allows to open a target Uri with the standard opener service of the
		 * workbench.
		 */
		openUri(target: URI | UriComponents): Promise<boolean>;
	};

	window: {

		/**
		 * Show progress in the editor. Progress is shown while running the given callback
		 * and while the promise it returned isn't resolved nor rejected.
		 *
		 * @param task A callback returning a promise.
		 * @return A promise that resolves to the returned value of the given task result.
		 */
		withProgress<R>(
			options: IProgressOptions | IProgressDialogOptions | IProgressNotificationOptions | IProgressWindowOptions | IProgressCompositeOptions,
			task: (progress: IProgress<IProgressStep>) => Promise<R>
		): Promise<R>;

		/**
		 * Creates a terminal with limited capabilities that is intended for
		 * writing output from the embedder before the workbench has finished
		 * loading. When an embedder terminal is created it will automatically
		 * show to the user.
		 *
		 * @param options The definition of the terminal, this is similar to
		 * `ExtensionTerminalOptions` in the extension API.
		 */
		createTerminal(options: IEmbedderTerminalOptions): Promise<void>;

		/**
		 * Show an information message to users. Optionally provide an array of items which will be presented as
		 * clickable buttons.
		 *
		 * @param message The message to show.
		 * @param items A set of items that will be rendered as actions in the message.
		 * @returns A thenable that resolves to the selected item or `undefined` when being dismissed.
		 */
		showInformationMessage<T extends string>(message: string, ...items: T[]): Promise<T | undefined>;
	};

	workspace: {
		/**
		 * Resolves once the remote authority has been resolved.
		 */
		didResolveRemoteAuthority(): Promise<void>;

		/**
		 * Forwards a port. If the current embedder implements a tunnelFactory then that will be used to make the tunnel.
		 * By default, openTunnel only support localhost; however, a tunnelFactory can be used to support other ips.
		 *
		 * @throws When run in an environment without a remote.
		 *
		 * @param tunnelOptions The `localPort` is a suggestion only. If that port is not available another will be chosen.
		 */
		openTunnel(tunnelOptions: ITunnelOptions): Promise<ITunnel>;
	};

	/**
	 * Triggers shutdown of the workbench programmatically. After this method is
	 * called, the workbench is not usable anymore and the page needs to reload
	 * or closed.
	 *
	 * This will also remove any `beforeUnload` handlers that would bring up a
	 * confirmation dialog.
	 *
	 * The returned promise should be awaited on to ensure any data to persist
	 * has been persisted.
	 */
	shutdown: () => Promise<void>;
}

export interface IWorkbenchConstructionOptions {

	//#region Connection related configuration

	/**
	 * The remote authority is the IP:PORT from where the workbench is served
	 * from. It is for example being used for the websocket connections as address.
	 */
	readonly remoteAuthority?: string;

	/**
	 * The server base path is the path where the workbench is served from.
	 * The path must be absolute (start with a slash).
	 * Corresponds to option `server-base-path` on the server side.
	 */
	readonly serverBasePath?: string;

	/**
	 * The connection token to send to the server.
	 */
	readonly connectionToken?: string | Promise<string>;

	/**
	 * An endpoint to serve iframe content ("webview") from. This is required
	 * to provide full security isolation from the workbench host.
	 */
	readonly webviewEndpoint?: string;

	/**
	 * A factory for web sockets.
	 */
	readonly webSocketFactory?: IWebSocketFactory;

	/**
	 * A provider for resource URIs.
	 *
	 * *Note*: This will only be invoked after the `connectionToken` is resolved.
	 */
	readonly resourceUriProvider?: IResourceUriProvider;

	/**
	 * Resolves an external uri before it is opened.
	 */
	readonly resolveExternalUri?: IExternalUriResolver;

	/**
	 * A provider for supplying tunneling functionality,
	 * such as creating tunnels and showing candidate ports to forward.
	 */
	readonly tunnelProvider?: ITunnelProvider;

	/**
	 * Endpoints to be used for proxying authentication code exchange calls in the browser.
	 */
	readonly codeExchangeProxyEndpoints?: { [providerId: string]: string };

	/**
	 * The identifier of an edit session associated with the current workspace.
	 */
	readonly editSessionId?: string;

	/**
	 * Resource delegation handler that allows for loading of resources when
	 * using remote resolvers.
	 *
	 * This is exclusive with {@link resourceUriProvider}. `resourceUriProvider`
	 * should be used if a {@link webSocketFactory} is used, and will be preferred.
	 */
	readonly remoteResourceProvider?: IRemoteResourceProvider;

	//#endregion


	//#region Workbench configuration

	/**
	 * A handler for opening workspaces and providing the initial workspace.
	 */
	readonly workspaceProvider?: IWorkspaceProvider;

	/**
	 * Settings sync options
	 */
	readonly settingsSyncOptions?: ISettingsSyncOptions;

	/**
	 * The secret storage provider to store and retrieve secrets.
	 */
	readonly secretStorageProvider?: ISecretStorageProvider;

	/**
	 * Additional builtin extensions those cannot be uninstalled but only be disabled.
	 * It can be one of the following:
	 * 	- an extension in the Marketplace
	 * 	- location of the extension where it is hosted.
	 */
	readonly additionalBuiltinExtensions?: readonly (MarketplaceExtension | UriComponents)[];

	/**
	 * List of extensions to be enabled if they are installed.
	 * Note: This will not install extensions if not installed.
	 */
	readonly enabledExtensions?: readonly ExtensionId[];

	/**
	 * Additional domains allowed to open from the workbench without the
	 * link protection popup.
	 */
	readonly additionalTrustedDomains?: string[];

	/**
	 * Enable workspace trust feature for the current window
	 */
	readonly enableWorkspaceTrust?: boolean;

	/**
	 * Urls that will be opened externally that are allowed access
	 * to the opener window. This is primarily used to allow
	 * `window.close()` to be called from the newly opened window.
	 */
	readonly openerAllowedExternalUrlPrefixes?: string[];

	/**
	 * Support for URL callbacks.
	 */
	readonly urlCallbackProvider?: IURLCallbackProvider;

	/**
	 * Support adding additional properties to telemetry.
	 */
	readonly resolveCommonTelemetryProperties?: ICommonTelemetryPropertiesResolver;

	/**
	 * A set of optional commands that should be registered with the commands
	 * registry.
	 *
	 * Note: commands can be called from extensions if the identifier is known!
	 */
	readonly commands?: readonly ICommand[];

	/**
	 * Optional default layout to apply on first time the workspace is opened
	 * (unless `force` is specified). This includes visibility of views and
	 * editors including editor grid layout.
	 */
	readonly defaultLayout?: IDefaultLayout;

	/**
	 * Optional configuration default overrides contributed to the workbench.
	 */
	readonly configurationDefaults?: Record<string, unknown>;

	//#endregion

	//#region Profile options

	/**
	 * Profile to use for the workbench.
	 */
	readonly profile?: { readonly name: string; readonly contents?: string | UriComponents };

	/**
	 * URI of the profile to preview.
	 */
	readonly profileToPreview?: UriComponents;

	//#endregion


	//#region Update/Quality related

	/**
	 * Support for update reporting
	 */
	readonly updateProvider?: IUpdateProvider;

	/**
	 * Support for product quality switching
	 */
	readonly productQualityChangeHandler?: IProductQualityChangeHandler;

	//#endregion


	//#region Branding

	/**
	 * Optional welcome banner to appear above the workbench. Can be dismissed by the
	 * user.
	 */
	readonly welcomeBanner?: IWelcomeBanner;

	/**
	 * Optional override for the product configuration properties.
	 */
	readonly productConfiguration?: Partial<IProductConfiguration>;

	/**
	 * Optional override for properties of the window indicator in the status bar.
	 */
	readonly windowIndicator?: IWindowIndicator;

	/**
	 * Specifies the default theme type (LIGHT, DARK..) and allows to provide initial colors that are shown
	 * until the color theme that is specified in the settings (`editor.colorTheme`) is loaded and applied.
	 * Once there are persisted colors from a last run these will be used.
	 *
	 * The idea is that the colors match the main colors from the theme defined in the `configurationDefaults`.
	 */
	readonly initialColorTheme?: IInitialColorTheme;

	//#endregion


	//#region IPC

	readonly messagePorts?: ReadonlyMap<ExtensionId, MessagePort>;

	//#endregion

	//#region Authentication Providers

	/**
	 * Optional authentication provider contributions. These take precedence over
	 * any authentication providers contributed via extensions.
	 */
	readonly authenticationProviders?: readonly IAuthenticationProvider[];

	//#endregion

	//#region Development options

	readonly developmentOptions?: IDevelopmentOptions;

	//#endregion

}


/**
 * A workspace to open in the workbench can either be:
 * - a workspace file with 0-N folders (via `workspaceUri`)
 * - a single folder (via `folderUri`)
 * - empty (via `undefined`)
 */
export type IWorkspace = IWorkspaceToOpen | IFolderToOpen | undefined;

export interface IWorkspaceProvider {

	/**
	 * The initial workspace to open.
	 */
	readonly workspace: IWorkspace;

	/**
	 * Arbitrary payload from the `IWorkspaceProvider.open` call.
	 */
	readonly payload?: object;

	/**
	 * Return `true` if the provided [workspace](#IWorkspaceProvider.workspace) is trusted, `false` if not trusted, `undefined` if unknown.
	 */
	readonly trusted: boolean | undefined;

	/**
	 * Asks to open a workspace in the current or a new window.
	 *
	 * @param workspace the workspace to open.
	 * @param options optional options for the workspace to open.
	 * - `reuse`: whether to open inside the current window or a new window
	 * - `payload`: arbitrary payload that should be made available
	 * to the opening window via the `IWorkspaceProvider.payload` property.
	 * @param payload optional payload to send to the workspace to open.
	 *
	 * @returns true if successfully opened, false otherwise.
	 */
	open(workspace: IWorkspace, options?: { reuse?: boolean; payload?: object }): Promise<boolean>;
}

export interface IResourceUriProvider {
	(uri: URI): URI;
}

/**
 * The identifier of an extension in the format: `PUBLISHER.NAME`. For example: `vscode.csharp`
 */
export type ExtensionId = string;

export type MarketplaceExtension = ExtensionId | { readonly id: ExtensionId; preRelease?: boolean; migrateStorageFrom?: ExtensionId };

export interface ICommonTelemetryPropertiesResolver {
	(): { [key: string]: unknown };
}

export interface IExternalUriResolver {
	(uri: URI): Promise<URI>;
}

export interface IExternalURLOpener {

	/**
	 * Overrides the behavior when an external URL is about to be opened.
	 * Returning false means that the URL wasn't handled, and the default
	 * handling behavior should be used: `window.open(href, '_blank', 'noopener');`
	 *
	 * @returns true if URL was handled, false otherwise.
	 */
	openExternal(href: string): boolean | Promise<boolean>;
}

export interface ITunnelProvider {

	/**
	 * Support for creating tunnels.
	 */
	tunnelFactory?: ITunnelFactory;

	/**
	 * Support for filtering candidate ports.
	 */
	showPortCandidate?: IShowPortCandidate;

	/**
	 * The features that the tunnel provider supports.
	 */
	features?: TunnelProviderFeatures;
}

export interface ITunnelFactory {
	(tunnelOptions: ITunnelOptions, tunnelCreationOptions: TunnelCreationOptions): Promise<ITunnel> | undefined;
}

export interface ITunnelOptions {

	remoteAddress: { port: number; host: string };

	/**
	 * The desired local port. If this port can't be used, then another will be chosen.
	 */
	localAddressPort?: number;

	label?: string;

	privacy?: string;

	protocol?: string;
}

export interface TunnelCreationOptions {

	/**
	 * True when the local operating system will require elevation to use the requested local port.
	 */
	elevationRequired?: boolean;
}

export interface ITunnel {

	remoteAddress: { port: number; host: string };

	/**
	 * The complete local address(ex. localhost:1234)
	 */
	localAddress: string;

	privacy?: string;

	/**
	 * If protocol is not provided, it is assumed to be http, regardless of the localAddress
	 */
	protocol?: string;

	/**
	 * Implementers of Tunnel should fire onDidDispose when dispose is called.
	 */
	readonly onDidDispose: Event<void>;

	dispose(): Promise<void> | void;
}

export interface IShowPortCandidate {
	(host: string, port: number, detail: string): Promise<boolean>;
}

export enum Menu {
	CommandPalette,
	StatusBarWindowIndicatorMenu,
}

export interface ICommand {

	/**
	 * An identifier for the command. Commands can be executed from extensions
	 * using the `vscode.commands.executeCommand` API using that command ID.
	 */
	id: string;

	/**
	 * The optional label of the command. If provided, the command will appear
	 * in the command palette.
	 */
	label?: string;

	/**
	 * The optional menus to append this command to. Only valid if `label` is
	 * provided as well.
	 * @default Menu.CommandPalette
	 */
	menu?: Menu | Menu[];

	/**
	 * A function that is being executed with any arguments passed over. The
	 * return type will be send back to the caller.
	 *
	 * Note: arguments and return type should be serializable so that they can
	 * be exchanged across processes boundaries.
	 */
	handler: (...args: unknown[]) => unknown;
}

export interface IWelcomeBanner {

	/**
	 * Welcome banner message to appear as text.
	 */
	message: string;

	/**
	 * Optional icon for the banner. This is either the URL to an icon to use
	 * or the name of one of the existing icons from our Codicon icon set.
	 *
	 * If not provided a default icon will be used.
	 */
	icon?: string | UriComponents;

	/**
	 * Optional actions to appear as links after the welcome banner message.
	 */
	actions?: IWelcomeLinkAction[];
}

export interface IWelcomeLinkAction {

	/**
	 * The link to open when clicking. Supports command invocation when
	 * using the `command:<commandId>` value.
	 */
	href: string;

	/**
	 * The label to show for the action link.
	 */
	label: string;

	/**
	 * A tooltip that will appear while hovering over the action link.
	 */
	title?: string;
}

export interface IWindowIndicator {

	/**
	 * Triggering this event will cause the window indicator to update.
	 */
	readonly onDidChange?: Event<void>;

	/**
	 * Label of the window indicator may include octicons
	 * e.g. `$(remote) label`
	 */
	label: string;

	/**
	 * Tooltip of the window indicator should not include
	 * octicons and be descriptive.
	 */
	tooltip: string;

	/**
	 * If provided, overrides the default command that
	 * is executed when clicking on the window indicator.
	 */
	command?: string;
}

export enum ColorScheme {
	DARK = 'dark',
	LIGHT = 'light',
	HIGH_CONTRAST_LIGHT = 'hcLight',
	HIGH_CONTRAST_DARK = 'hcDark'
}

export interface IInitialColorTheme {

	/**
	 * Initial color theme type.
	 */
	readonly themeType: ColorScheme;

	/**
	 * A list of workbench colors to apply initially.
	 */
	readonly colors?: { [colorId: string]: string };
}

export interface IDefaultView {

	/**
	 * The identifier of the view to show by default.
	 */
	readonly id: string;
}

export interface IDefaultEditor {

	/**
	 * The location of the editor in the editor grid layout.
	 * Editors are layed out in editor groups and the view
	 * column is counted from top left to bottom right in
	 * the order of appearance beginning with `1`.
	 *
	 * If not provided, the editor will open in the active
	 * group.
	 */
	readonly viewColumn?: number;

	/**
	 * The resource of the editor to open.
	 */
	readonly uri: UriComponents;

	/**
	 * Optional extra options like which editor
	 * to use or which text to select.
	 */
	readonly options?: ITextEditorOptions;

	/**
	 * Will not open an untitled editor in case
	 * the resource does not exist.
	 */
	readonly openOnlyIfExists?: boolean;
}

export interface IDefaultLayout {

	/**
	 * A list of views to show by default.
	 */
	readonly views?: IDefaultView[];

	/**
	 * A list of editors to show by default.
	 */
	readonly editors?: IDefaultEditor[];

	/**
	 * The layout to use for the workbench.
	 */
	readonly layout?: {

		/**
		 * The layout of the editor area.
		 */
		readonly editors?: EditorGroupLayout;
	};

	/**
	 * Forces this layout to be applied even if this isn't
	 * the first time the workspace has been opened
	 */
	readonly force?: boolean;
}

export interface IProductQualityChangeHandler {

	/**
	 * Handler is being called when the user wants to switch between
	 * `insider` or `stable` product qualities.
	 */
	(newQuality: 'insider' | 'stable'): void;
}

/**
 * Settings sync options
 */
export interface ISettingsSyncOptions {

	/**
	 * Is settings sync enabled
	 */
	readonly enabled: boolean;

	/**
	 * Version of extensions sync state.
	 * Extensions sync state will be reset if version is provided and different from previous version.
	 */
	readonly extensionsSyncStateVersion?: string;

	/**
	 * Handler is being called when the user changes Settings Sync enablement.
	 */
	enablementHandler?(enablement: boolean, authenticationProvider: string): void;

	/**
	 * Authentication provider
	 */
	readonly authenticationProvider?: {

		/**
		 * Unique identifier of the authentication provider.
		 */
		readonly id: string;

		/**
		 * Called when the user wants to signin to Settings Sync using the given authentication provider.
		 * The returned promise should resolve to the authentication session id.
		 */
		signIn(): Promise<string>;
	};
}

export interface IDevelopmentOptions {

	/**
	 * Current logging level. Default is `LogLevel.Info`.
	 */
	readonly logLevel?: LogLevel;

	/**
	 * Extension log level.
	 */
	readonly extensionLogLevel?: [string, LogLevel][];

	/**
	 * Location of a module containing extension tests to run once the workbench is open.
	 */
	readonly extensionTestsPath?: UriComponents;

	/**
	 * Add extensions under development.
	 */
	readonly extensions?: readonly UriComponents[];

	/**
	 * Whether to enable the smoke test driver.
	 */
	readonly enableSmokeTestDriver?: boolean;
}

/**
 * Utility provided in the {@link WorkbenchOptions} which allows loading resources
 * when remote resolvers are used in the web.
 */
export interface IRemoteResourceProvider {

	/**
	 * Path the workbench should delegate requests to. The embedder should
	 * install a service worker on this path and emit {@link onDidReceiveRequest}
	 * events when requests come in for that path.
	 */
	readonly path: string;

	/**
	 * Event that should fire when requests are made on the {@link pathPrefix}.
	 */
	readonly onDidReceiveRequest: Event<IRemoteResourceRequest>;
}

/**
 * todo@connor4312: this may eventually gain more properties like method and
 * headers, but for now we only deal with GET requests.
 */
export interface IRemoteResourceRequest {

	/**
	 * Request URI. Generally will begin with the current
	 * origin and {@link IRemoteResourceProvider.pathPrefix}.
	 */
	uri: URI;

	/**
	 * A method called by the editor to issue a response to the request.
	 */
	respondWith(statusCode: number, body: Uint8Array, headers: Record<string, string>): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/web.factory.ts]---
Location: vscode-main/src/vs/workbench/browser/web.factory.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITunnel, ITunnelOptions, IWorkbench, IWorkbenchConstructionOptions, Menu } from './web.api.js';
import { BrowserMain } from './web.main.js';
import { URI, UriComponents } from '../../base/common/uri.js';
import { IDisposable, toDisposable } from '../../base/common/lifecycle.js';
import { CommandsRegistry } from '../../platform/commands/common/commands.js';
import { mark, PerformanceMark } from '../../base/common/performance.js';
import { MenuId, MenuRegistry } from '../../platform/actions/common/actions.js';
import { DeferredPromise } from '../../base/common/async.js';
import { asArray } from '../../base/common/arrays.js';
import { IProgress, IProgressCompositeOptions, IProgressDialogOptions, IProgressNotificationOptions, IProgressOptions, IProgressStep, IProgressWindowOptions } from '../../platform/progress/common/progress.js';
import { LogLevel } from '../../platform/log/common/log.js';
import { IEmbedderTerminalOptions } from '../services/terminal/common/embedderTerminalService.js';

let created = false;
const workbenchPromise = new DeferredPromise<IWorkbench>();

/**
 * Creates the workbench with the provided options in the provided container.
 *
 * @param domElement the container to create the workbench in
 * @param options for setting up the workbench
 */
export function create(domElement: HTMLElement, options: IWorkbenchConstructionOptions): IDisposable {

	// Mark start of workbench
	mark('code/didLoadWorkbenchMain');

	// Assert that the workbench is not created more than once. We currently
	// do not support this and require a full context switch to clean-up.
	if (created) {
		throw new Error('Unable to create the VSCode workbench more than once.');
	} else {
		created = true;
	}

	// Register commands if any
	if (Array.isArray(options.commands)) {
		for (const command of options.commands) {

			CommandsRegistry.registerCommand(command.id, (accessor, ...args) => {
				// we currently only pass on the arguments but not the accessor
				// to the command to reduce our exposure of internal API.
				return command.handler(...args);
			});

			// Commands with labels appear in the command palette
			if (command.label) {
				for (const menu of asArray(command.menu ?? Menu.CommandPalette)) {
					MenuRegistry.appendMenuItem(asMenuId(menu), { command: { id: command.id, title: command.label } });
				}
			}
		}
	}

	// Startup workbench and resolve waiters
	let instantiatedWorkbench: IWorkbench | undefined = undefined;
	new BrowserMain(domElement, options).open().then(workbench => {
		instantiatedWorkbench = workbench;
		workbenchPromise.complete(workbench);
	});

	return toDisposable(() => {
		if (instantiatedWorkbench) {
			instantiatedWorkbench.shutdown();
		} else {
			workbenchPromise.p.then(instantiatedWorkbench => instantiatedWorkbench.shutdown());
		}
	});
}

function asMenuId(menu: Menu): MenuId {
	switch (menu) {
		case Menu.CommandPalette: return MenuId.CommandPalette;
		case Menu.StatusBarWindowIndicatorMenu: return MenuId.StatusBarWindowIndicatorMenu;
	}
}

export namespace commands {

	/**
	 * {@linkcode IWorkbench.commands IWorkbench.commands.executeCommand}
	 */
	export async function executeCommand(command: string, ...args: unknown[]): Promise<unknown> {
		const workbench = await workbenchPromise.p;

		return workbench.commands.executeCommand(command, ...args);
	}
}

export namespace logger {

	/**
	 * {@linkcode IWorkbench.logger IWorkbench.logger.log}
	 */
	export function log(level: LogLevel, message: string) {
		workbenchPromise.p.then(workbench => workbench.logger.log(level, message));
	}
}

export namespace env {

	/**
	 * {@linkcode IWorkbench.env IWorkbench.env.retrievePerformanceMarks}
	 */
	export async function retrievePerformanceMarks(): Promise<[string, readonly PerformanceMark[]][]> {
		const workbench = await workbenchPromise.p;

		return workbench.env.retrievePerformanceMarks();
	}

	/**
	 * {@linkcode IWorkbench.env IWorkbench.env.getUriScheme}
	 */
	export async function getUriScheme(): Promise<string> {
		const workbench = await workbenchPromise.p;

		return workbench.env.getUriScheme();
	}

	/**
	 * {@linkcode IWorkbench.env IWorkbench.env.openUri}
	 */
	export async function openUri(target: URI | UriComponents): Promise<boolean> {
		const workbench = await workbenchPromise.p;

		return workbench.env.openUri(URI.isUri(target) ? target : URI.from(target));
	}
}

export namespace window {

	/**
	 * {@linkcode IWorkbench.window IWorkbench.window.withProgress}
	 */
	export async function withProgress<R>(
		options: IProgressOptions | IProgressDialogOptions | IProgressNotificationOptions | IProgressWindowOptions | IProgressCompositeOptions,
		task: (progress: IProgress<IProgressStep>) => Promise<R>
	): Promise<R> {
		const workbench = await workbenchPromise.p;

		return workbench.window.withProgress(options, task);
	}

	export async function createTerminal(options: IEmbedderTerminalOptions): Promise<void> {
		const workbench = await workbenchPromise.p;
		workbench.window.createTerminal(options);
	}

	export async function showInformationMessage<T extends string>(message: string, ...items: T[]): Promise<T | undefined> {
		const workbench = await workbenchPromise.p;
		return await workbench.window.showInformationMessage(message, ...items);
	}
}

export namespace workspace {

	/**
	 * {@linkcode IWorkbench.workspace IWorkbench.workspace.didResolveRemoteAuthority}
	 */
	export async function didResolveRemoteAuthority() {
		const workbench = await workbenchPromise.p;
		await workbench.workspace.didResolveRemoteAuthority();
	}

	/**
	 * {@linkcode IWorkbench.workspace IWorkbench.workspace.openTunnel}
	 */
	export async function openTunnel(tunnelOptions: ITunnelOptions): Promise<ITunnel> {
		const workbench = await workbenchPromise.p;

		return workbench.workspace.openTunnel(tunnelOptions);
	}
}
```

--------------------------------------------------------------------------------

````
