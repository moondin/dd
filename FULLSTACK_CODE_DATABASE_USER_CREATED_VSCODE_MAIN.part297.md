---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 297
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 297 of 552)

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

---[FILE: src/vs/platform/windows/electron-main/windowImpl.ts]---
Location: vscode-main/src/vs/platform/windows/electron-main/windowImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import electron, { BrowserWindowConstructorOptions, Display, screen } from 'electron';
import { DeferredPromise, RunOnceScheduler, timeout, Delayer } from '../../../base/common/async.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { toErrorMessage } from '../../../base/common/errorMessage.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable, MutableDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { FileAccess, Schemas } from '../../../base/common/network.js';
import { getMarks, mark } from '../../../base/common/performance.js';
import { isTahoeOrNewer, isLinux, isMacintosh, isWindows } from '../../../base/common/platform.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { release } from 'os';
import { ISerializableCommandAction } from '../../action/common/action.js';
import { IBackupMainService } from '../../backup/electron-main/backup.js';
import { IConfigurationChangeEvent, IConfigurationService } from '../../configuration/common/configuration.js';
import { IDialogMainService } from '../../dialogs/electron-main/dialogMainService.js';
import { NativeParsedArgs } from '../../environment/common/argv.js';
import { IEnvironmentMainService } from '../../environment/electron-main/environmentMainService.js';
import { isLaunchedFromCli } from '../../environment/node/argvHelper.js';
import { IFileService } from '../../files/common/files.js';
import { ILifecycleMainService } from '../../lifecycle/electron-main/lifecycleMainService.js';
import { ILogService } from '../../log/common/log.js';
import { IProductService } from '../../product/common/productService.js';
import { IIPCObjectUrl, IProtocolMainService } from '../../protocol/electron-main/protocol.js';
import { resolveMarketplaceHeaders } from '../../externalServices/common/marketplace.js';
import { IApplicationStorageMainService, IStorageMainService } from '../../storage/electron-main/storageMainService.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { IThemeMainService } from '../../theme/electron-main/themeMainService.js';
import { getMenuBarVisibility, IFolderToOpen, INativeWindowConfiguration, IWindowSettings, IWorkspaceToOpen, MenuBarVisibility, hasNativeTitlebar, useNativeFullScreen, useWindowControlsOverlay, DEFAULT_CUSTOM_TITLEBAR_HEIGHT, TitlebarStyle, MenuSettings } from '../../window/common/window.js';
import { defaultBrowserWindowOptions, getAllWindowsExcludingOffscreen, IWindowsMainService, OpenContext, WindowStateValidator } from './windows.js';
import { ISingleFolderWorkspaceIdentifier, IWorkspaceIdentifier, isSingleFolderWorkspaceIdentifier, isWorkspaceIdentifier, toWorkspaceIdentifier } from '../../workspace/common/workspace.js';
import { IWorkspacesManagementMainService } from '../../workspaces/electron-main/workspacesManagementMainService.js';
import { IWindowState, ICodeWindow, ILoadEvent, WindowMode, WindowError, LoadReason, defaultWindowState, IBaseWindow } from '../../window/electron-main/window.js';
import { IPolicyService } from '../../policy/common/policy.js';
import { IUserDataProfile } from '../../userDataProfile/common/userDataProfile.js';
import { IStateService } from '../../state/node/state.js';
import { IUserDataProfilesMainService } from '../../userDataProfile/electron-main/userDataProfile.js';
import { ILoggerMainService } from '../../log/electron-main/loggerService.js';
import { IInstantiationService } from '../../instantiation/common/instantiation.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { errorHandler } from '../../../base/common/errors.js';
import { FocusMode } from '../../native/common/native.js';

export interface IWindowCreationOptions {
	readonly state: IWindowState;
	readonly extensionDevelopmentPath?: string[];
	readonly isExtensionTestHost?: boolean;
}

interface ITouchBarSegment extends electron.SegmentedControlSegment {
	readonly id: string;
}

interface ILoadOptions {
	readonly isReload?: boolean;
	readonly disableExtensions?: boolean;
}

const enum ReadyState {

	/**
	 * This window has not loaded anything yet
	 * and this is the initial state of every
	 * window.
	 */
	NONE,

	/**
	 * This window is navigating, either for the
	 * first time or subsequent times.
	 */
	NAVIGATING,

	/**
	 * This window has finished loading and is ready
	 * to forward IPC requests to the web contents.
	 */
	READY
}

class DockBadgeManager {

	static readonly INSTANCE = new DockBadgeManager();

	private readonly windows = new Set<number>();

	acquireBadge(window: IBaseWindow): IDisposable {
		this.windows.add(window.id);

		electron.app.setBadgeCount(isLinux ? 1 /* only numbers supported */ : undefined /* generic dot */);

		return {
			dispose: () => {
				this.windows.delete(window.id);

				if (this.windows.size === 0) {
					electron.app.setBadgeCount(0);
				}
			}
		};
	}
}

export abstract class BaseWindow extends Disposable implements IBaseWindow {

	//#region Events

	private readonly _onDidClose = this._register(new Emitter<void>());
	readonly onDidClose = this._onDidClose.event;

	private readonly _onDidMaximize = this._register(new Emitter<void>());
	readonly onDidMaximize = this._onDidMaximize.event;

	private readonly _onDidUnmaximize = this._register(new Emitter<void>());
	readonly onDidUnmaximize = this._onDidUnmaximize.event;

	private readonly _onDidTriggerSystemContextMenu = this._register(new Emitter<{ x: number; y: number }>());
	readonly onDidTriggerSystemContextMenu = this._onDidTriggerSystemContextMenu.event;

	private readonly _onDidEnterFullScreen = this._register(new Emitter<void>());
	readonly onDidEnterFullScreen = this._onDidEnterFullScreen.event;

	private readonly _onDidLeaveFullScreen = this._register(new Emitter<void>());
	readonly onDidLeaveFullScreen = this._onDidLeaveFullScreen.event;

	private readonly _onDidChangeAlwaysOnTop = this._register(new Emitter<boolean>());
	readonly onDidChangeAlwaysOnTop = this._onDidChangeAlwaysOnTop.event;

	//#endregion

	abstract readonly id: number;

	protected _lastFocusTime = Date.now(); // window is shown on creation so take current time
	get lastFocusTime(): number { return this._lastFocusTime; }

	private maximizedWindowState: IWindowState | undefined;

	protected _win: electron.BrowserWindow | null = null;
	get win() { return this._win; }
	protected setWin(win: electron.BrowserWindow, options?: BrowserWindowConstructorOptions): void {
		this._win = win;

		// Window Events
		this._register(Event.fromNodeEventEmitter(win, 'maximize')(() => {
			if (isWindows && this.environmentMainService.enableRDPDisplayTracking && this._win) {
				const [x, y] = this._win.getPosition();
				const [width, height] = this._win.getSize();

				this.maximizedWindowState = { mode: WindowMode.Maximized, width, height, x, y };
				this.logService.debug(`Saved maximized window ${this.id} display state:`, this.maximizedWindowState);
			}

			this._onDidMaximize.fire();
		}));
		this._register(Event.fromNodeEventEmitter(win, 'unmaximize')(() => {
			if (isWindows && this.environmentMainService.enableRDPDisplayTracking && this.maximizedWindowState) {
				this.maximizedWindowState = undefined;

				this.logService.debug(`Cleared maximized window ${this.id} state`);
			}

			this._onDidUnmaximize.fire();
		}));
		this._register(Event.fromNodeEventEmitter(win, 'closed')(() => {
			this._onDidClose.fire();

			this.dispose();
		}));
		this._register(Event.fromNodeEventEmitter(win, 'focus')(() => {
			this.clearNotifyFocus();

			this._lastFocusTime = Date.now();
		}));
		this._register(Event.fromNodeEventEmitter(this._win, 'enter-full-screen')(() => this._onDidEnterFullScreen.fire()));
		this._register(Event.fromNodeEventEmitter(this._win, 'leave-full-screen')(() => this._onDidLeaveFullScreen.fire()));
		this._register(Event.fromNodeEventEmitter(this._win, 'always-on-top-changed', (_, alwaysOnTop) => alwaysOnTop)(alwaysOnTop => this._onDidChangeAlwaysOnTop.fire(alwaysOnTop)));

		// Sheet Offsets
		const useCustomTitleStyle = !hasNativeTitlebar(this.configurationService, options?.titleBarStyle === 'hidden' ? TitlebarStyle.CUSTOM : undefined /* unknown */);
		if (isMacintosh && useCustomTitleStyle) {
			win.setSheetOffset(isTahoeOrNewer(release()) ? 32 : 28); // offset dialogs by the height of the custom title bar if we have any
		}

		// Update the window controls immediately based on cached or default values
		if (useCustomTitleStyle && useWindowControlsOverlay(this.configurationService)) {
			const cachedWindowControlHeight = this.stateService.getItem<number>((BaseWindow.windowControlHeightStateStorageKey));
			if (cachedWindowControlHeight) {
				this.updateWindowControls({ height: cachedWindowControlHeight });
			} else {
				this.updateWindowControls({ height: DEFAULT_CUSTOM_TITLEBAR_HEIGHT });
			}
		}

		// Setup windows/linux system context menu so it only is allowed over the app icon
		if ((isWindows || isLinux) && useCustomTitleStyle) {
			this._register(Event.fromNodeEventEmitter(win, 'system-context-menu', (event: Electron.Event, point: Electron.Point) => ({ event, point }))(e => {
				const [x, y] = win.getPosition();
				const cursorPos = electron.screen.screenToDipPoint(e.point);
				const cx = Math.floor(cursorPos.x) - x;
				const cy = Math.floor(cursorPos.y) - y;

				// TODO@deepak1556 workaround for https://github.com/microsoft/vscode/issues/250626
				// where showing the custom menu seems broken on Windows
				if (isLinux) {
					if (cx > 35 /* Cursor is beyond app icon in title bar */) {
						e.event.preventDefault();

						this._onDidTriggerSystemContextMenu.fire({ x: cx, y: cy });
					}
				}
			}));
		}

		// Open devtools if instructed from command line args
		if (this.environmentMainService.args['open-devtools'] === true) {
			win.webContents.openDevTools();
		}

		// macOS: Window Fullscreen Transitions
		if (isMacintosh) {
			this._register(this.onDidEnterFullScreen(() => {
				this.joinNativeFullScreenTransition?.complete(true);
			}));

			this._register(this.onDidLeaveFullScreen(() => {
				this.joinNativeFullScreenTransition?.complete(true);
			}));
		}

		if (isWindows && this.environmentMainService.enableRDPDisplayTracking) {
			// Handles the display-added event on Windows RDP multi-monitor scenarios.
			// This helps restore maximized windows to their correct monitor after RDP reconnection.
			// Refs https://github.com/electron/electron/issues/47016
			this._register(Event.fromNodeEventEmitter(screen, 'display-added', (event: Electron.Event, display: Display) => ({ event, display }))((e) => {
				this.onDisplayAdded(e.display);
			}));
		}
	}

	private onDisplayAdded(display: Display): void {
		const state = this.maximizedWindowState;
		if (state && this._win && WindowStateValidator.validateWindowStateOnDisplay(state, display)) {
			this.logService.debug(`Setting maximized window ${this.id} bounds to match newly added display`, state);

			this._win.setBounds(state);
		}
	}

	constructor(
		protected readonly configurationService: IConfigurationService,
		protected readonly stateService: IStateService,
		protected readonly environmentMainService: IEnvironmentMainService,
		protected readonly logService: ILogService
	) {
		super();
	}

	protected applyState(state: IWindowState, hasMultipleDisplays = electron.screen.getAllDisplays().length > 0): void {

		// TODO@electron (Electron 4 regression): when running on multiple displays where the target display
		// to open the window has a larger resolution than the primary display, the window will not size
		// correctly unless we set the bounds again (https://github.com/microsoft/vscode/issues/74872)
		//
		// Extended to cover Windows as well as Mac (https://github.com/microsoft/vscode/issues/146499)
		//
		// However, when running with native tabs with multiple windows we cannot use this workaround
		// because there is a potential that the new window will be added as native tab instead of being
		// a window on its own. In that case calling setBounds() would cause https://github.com/microsoft/vscode/issues/75830

		const windowSettings = this.configurationService.getValue<IWindowSettings | undefined>('window');
		const useNativeTabs = isMacintosh && windowSettings?.nativeTabs === true;
		if ((isMacintosh || isWindows) && hasMultipleDisplays && (!useNativeTabs || getAllWindowsExcludingOffscreen().length === 1)) {
			if ([state.width, state.height, state.x, state.y].every(value => typeof value === 'number')) {
				this._win?.setBounds({
					width: state.width,
					height: state.height,
					x: state.x,
					y: state.y
				});
			}
		}

		if (state.mode === WindowMode.Maximized || state.mode === WindowMode.Fullscreen) {

			// this call may or may not show the window, depends
			// on the platform: currently on Windows and Linux will
			// show the window as active. To be on the safe side,
			// we show the window at the end of this block.
			this._win?.maximize();

			if (state.mode === WindowMode.Fullscreen) {
				this.setFullScreen(true, true);
			}

			// to reduce flicker from the default window size
			// to maximize or fullscreen, we only show after
			this._win?.show();
		}
	}

	private representedFilename: string | undefined;

	setRepresentedFilename(filename: string): void {
		if (isMacintosh) {
			this.win?.setRepresentedFilename(filename);
		} else {
			this.representedFilename = filename;
		}
	}

	getRepresentedFilename(): string | undefined {
		if (isMacintosh) {
			return this.win?.getRepresentedFilename();
		}

		return this.representedFilename;
	}

	private documentEdited: boolean | undefined;

	setDocumentEdited(edited: boolean): void {
		if (isMacintosh) {
			this.win?.setDocumentEdited(edited);
		}

		this.documentEdited = edited;
	}

	isDocumentEdited(): boolean {
		if (isMacintosh) {
			return Boolean(this.win?.isDocumentEdited());
		}

		return !!this.documentEdited;
	}

	focus(options?: { mode: FocusMode }): void {
		switch (options?.mode ?? FocusMode.Transfer) {
			case FocusMode.Transfer:
				this.doFocusWindow();
				break;

			case FocusMode.Notify:
				this.showNotifyFocus();
				break;

			case FocusMode.Force:
				if (isMacintosh) {
					electron.app.focus({ steal: true });
				}
				this.doFocusWindow();
				break;
		}
	}

	private readonly notifyFocusDisposable = this._register(new MutableDisposable());

	private showNotifyFocus(): void {
		const disposables = new DisposableStore();
		this.notifyFocusDisposable.value = disposables;

		// Badge
		disposables.add(DockBadgeManager.INSTANCE.acquireBadge(this));

		// Flash/Bounce
		if (isWindows || isLinux) {
			this.win?.flashFrame(true);
			disposables.add(toDisposable(() => this.win?.flashFrame(false)));
		} else if (isMacintosh) {
			electron.app.dock?.bounce('informational');
		}
	}

	private clearNotifyFocus(): void {
		this.notifyFocusDisposable.clear();
	}

	private doFocusWindow() {
		const win = this.win;
		if (!win) {
			return;
		}

		if (win.isMinimized()) {
			win.restore();
		}

		win.focus();
	}

	//#region Window Control Overlays

	private static readonly windowControlHeightStateStorageKey = 'windowControlHeight';

	updateWindowControls(options: { height?: number; backgroundColor?: string; foregroundColor?: string }): void {
		const win = this.win;
		if (!win) {
			return;
		}

		// Cache the height for speeds lookups on startup
		if (options.height) {
			this.stateService.setItem((CodeWindow.windowControlHeightStateStorageKey), options.height);
		}

		// Windows/Linux: update window controls via setTitleBarOverlay()
		if (!isMacintosh && useWindowControlsOverlay(this.configurationService)) {
			win.setTitleBarOverlay({
				color: options.backgroundColor?.trim() === '' ? undefined : options.backgroundColor,
				symbolColor: options.foregroundColor?.trim() === '' ? undefined : options.foregroundColor,
				height: options.height ? options.height - 1 : undefined // account for window border
			});
		}

		// macOS: update window controls via setWindowButtonPosition()
		else if (isMacintosh && options.height !== undefined) {
			// When the position is set, the horizontal margin is offset to ensure
			// the distance between the traffic lights and the window frame is equal
			// in both directions.
			const buttonHeight = isTahoeOrNewer(release()) ? 14 : 16;
			const offset = Math.floor((options.height - buttonHeight) / 2);
			if (!offset) {
				win.setWindowButtonPosition(null);
			} else {
				win.setWindowButtonPosition({ x: offset + 1, y: offset });
			}
		}
	}

	//#endregion

	//#region Fullscreen

	private transientIsNativeFullScreen: boolean | undefined = undefined;
	private joinNativeFullScreenTransition: DeferredPromise<boolean> | undefined = undefined;

	toggleFullScreen(): void {
		this.setFullScreen(!this.isFullScreen, false);
	}

	protected setFullScreen(fullscreen: boolean, fromRestore: boolean): void {

		// Set fullscreen state
		if (useNativeFullScreen(this.configurationService)) {
			this.setNativeFullScreen(fullscreen, fromRestore);
		} else {
			this.setSimpleFullScreen(fullscreen);
		}
	}

	get isFullScreen(): boolean {
		if (isMacintosh && typeof this.transientIsNativeFullScreen === 'boolean') {
			return this.transientIsNativeFullScreen;
		}

		const win = this.win;
		const isFullScreen = win?.isFullScreen();
		const isSimpleFullScreen = win?.isSimpleFullScreen();

		return Boolean(isFullScreen || isSimpleFullScreen);
	}

	private setNativeFullScreen(fullscreen: boolean, fromRestore: boolean): void {
		const win = this.win;
		if (win?.isSimpleFullScreen()) {
			win?.setSimpleFullScreen(false);
		}

		this.doSetNativeFullScreen(fullscreen, fromRestore);
	}

	private doSetNativeFullScreen(fullscreen: boolean, fromRestore: boolean): void {
		if (isMacintosh) {

			// macOS: Electron windows report `false` for `isFullScreen()` for as long
			// as the fullscreen transition animation takes place. As such, we need to
			// listen to the transition events and carry around an intermediate state
			// for knowing if we are in fullscreen or not
			// Refs: https://github.com/electron/electron/issues/35360

			this.transientIsNativeFullScreen = fullscreen;

			const joinNativeFullScreenTransition = this.joinNativeFullScreenTransition = new DeferredPromise<boolean>();
			(async () => {
				const transitioned = await Promise.race([
					joinNativeFullScreenTransition.p,
					timeout(10000).then(() => false)
				]);

				if (this.joinNativeFullScreenTransition !== joinNativeFullScreenTransition) {
					return; // another transition was requested later
				}

				this.transientIsNativeFullScreen = undefined;
				this.joinNativeFullScreenTransition = undefined;

				// There is one interesting gotcha on macOS: when you are opening a new
				// window from a fullscreen window, that new window will immediately
				// open fullscreen and emit the `enter-full-screen` event even before we
				// reach this method. In that case, we actually will timeout after 10s
				// for detecting the transition and as such it is important that we only
				// signal to leave fullscreen if the window reports as not being in fullscreen.

				if (!transitioned && fullscreen && fromRestore && this.win && !this.win.isFullScreen()) {

					// We have seen requests for fullscreen failing eventually after some
					// time, for example when an OS update was performed and windows restore.
					// In those cases a user would find a window that is not in fullscreen
					// but also does not show any custom titlebar (and thus window controls)
					// because we think the window is in fullscreen.
					//
					// As a workaround in that case we emit a warning and leave fullscreen
					// so that at least the window controls are back.

					this.logService.warn('window: native macOS fullscreen transition did not happen within 10s from restoring');

					this._onDidLeaveFullScreen.fire();
				}
			})();
		}

		const win = this.win;
		win?.setFullScreen(fullscreen);
	}

	private setSimpleFullScreen(fullscreen: boolean): void {
		const win = this.win;
		if (win?.isFullScreen()) {
			this.doSetNativeFullScreen(false, false);
		}

		win?.setSimpleFullScreen(fullscreen);
		win?.webContents.focus(); // workaround issue where focus is not going into window
	}

	//#endregion

	abstract matches(webContents: electron.WebContents): boolean;

	override dispose(): void {
		super.dispose();

		this._win = null!; // Important to dereference the window object to allow for GC
	}
}

export class CodeWindow extends BaseWindow implements ICodeWindow {

	//#region Events

	private readonly _onWillLoad = this._register(new Emitter<ILoadEvent>());
	readonly onWillLoad = this._onWillLoad.event;

	private readonly _onDidSignalReady = this._register(new Emitter<void>());
	readonly onDidSignalReady = this._onDidSignalReady.event;

	private readonly _onDidDestroy = this._register(new Emitter<void>());
	readonly onDidDestroy = this._onDidDestroy.event;

	//#endregion


	//#region Properties

	private _id: number;
	get id(): number { return this._id; }

	protected override _win: electron.BrowserWindow;

	get backupPath(): string | undefined { return this._config?.backupPath; }

	get openedWorkspace(): IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier | undefined { return this._config?.workspace; }

	get profile(): IUserDataProfile | undefined {
		if (!this.config) {
			return undefined;
		}

		const profile = this.userDataProfilesService.profiles.find(profile => profile.id === this.config?.profiles.profile.id);
		if (this.isExtensionDevelopmentHost && profile) {
			return profile;
		}

		return this.userDataProfilesService.getProfileForWorkspace(this.config.workspace ?? toWorkspaceIdentifier(this.backupPath, this.isExtensionDevelopmentHost)) ?? this.userDataProfilesService.defaultProfile;
	}

	get remoteAuthority(): string | undefined { return this._config?.remoteAuthority; }

	private _config: INativeWindowConfiguration | undefined;
	get config(): INativeWindowConfiguration | undefined { return this._config; }

	get isExtensionDevelopmentHost(): boolean { return !!(this._config?.extensionDevelopmentPath); }

	get isExtensionTestHost(): boolean { return !!(this._config?.extensionTestsPath); }

	get isExtensionDevelopmentTestFromCli(): boolean { return this.isExtensionDevelopmentHost && this.isExtensionTestHost && !this._config?.debugId; }

	//#endregion

	private readonly windowState: IWindowState;
	private currentMenuBarVisibility: MenuBarVisibility | undefined;

	private readonly whenReadyCallbacks: { (window: ICodeWindow): void }[] = [];

	private readonly touchBarGroups: electron.TouchBarSegmentedControl[] = [];

	private currentHttpProxy: string | undefined = undefined;
	private currentNoProxy: string | undefined = undefined;

	private customZoomLevel: number | undefined = undefined;

	private readonly configObjectUrl: IIPCObjectUrl<INativeWindowConfiguration>;
	private pendingLoadConfig: INativeWindowConfiguration | undefined;
	private wasLoaded = false;

	private readonly jsCallStackMap: Map<string, number>;
	private readonly jsCallStackEffectiveSampleCount: number;
	private readonly jsCallStackCollector: Delayer<void>;
	private readonly jsCallStackCollectorStopScheduler: RunOnceScheduler;

	constructor(
		config: IWindowCreationOptions,
		@ILogService logService: ILogService,
		@ILoggerMainService private readonly loggerMainService: ILoggerMainService,
		@IEnvironmentMainService environmentMainService: IEnvironmentMainService,
		@IPolicyService private readonly policyService: IPolicyService,
		@IUserDataProfilesMainService private readonly userDataProfilesService: IUserDataProfilesMainService,
		@IFileService private readonly fileService: IFileService,
		@IApplicationStorageMainService private readonly applicationStorageMainService: IApplicationStorageMainService,
		@IStorageMainService private readonly storageMainService: IStorageMainService,
		@IConfigurationService configurationService: IConfigurationService,
		@IThemeMainService private readonly themeMainService: IThemeMainService,
		@IWorkspacesManagementMainService private readonly workspacesManagementMainService: IWorkspacesManagementMainService,
		@IBackupMainService private readonly backupMainService: IBackupMainService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IDialogMainService private readonly dialogMainService: IDialogMainService,
		@ILifecycleMainService private readonly lifecycleMainService: ILifecycleMainService,
		@IProductService private readonly productService: IProductService,
		@IProtocolMainService protocolMainService: IProtocolMainService,
		@IWindowsMainService private readonly windowsMainService: IWindowsMainService,
		@IStateService stateService: IStateService,
		@IInstantiationService instantiationService: IInstantiationService
	) {
		super(configurationService, stateService, environmentMainService, logService);

		//#region create browser window
		{
			this.configObjectUrl = this._register(protocolMainService.createIPCObjectUrl<INativeWindowConfiguration>());

			// Load window state
			const [state, hasMultipleDisplays] = this.restoreWindowState(config.state);
			this.windowState = state;
			this.logService.trace('window#ctor: using window state', state);

			const options = instantiationService.invokeFunction(defaultBrowserWindowOptions, this.windowState, undefined, {
				preload: FileAccess.asFileUri('vs/base/parts/sandbox/electron-browser/preload.js').fsPath,
				additionalArguments: [`--vscode-window-config=${this.configObjectUrl.resource.toString()}`],
				v8CacheOptions: this.environmentMainService.useCodeCache ? 'bypassHeatCheck' : 'none',
			});

			// Create the browser window
			mark('code/willCreateCodeBrowserWindow');
			this._win = new electron.BrowserWindow(options);
			mark('code/didCreateCodeBrowserWindow');

			this._id = this._win.id;
			this.setWin(this._win, options);

			// Apply some state after window creation
			this.applyState(this.windowState, hasMultipleDisplays);

			this._lastFocusTime = Date.now(); // since we show directly, we need to set the last focus time too
		}
		//#endregion

		//#region JS Callstack Collector

		let sampleInterval = parseInt(this.environmentMainService.args['unresponsive-sample-interval'] || '1000');
		let samplePeriod = parseInt(this.environmentMainService.args['unresponsive-sample-period'] || '15000');
		if (sampleInterval <= 0 || samplePeriod <= 0 || sampleInterval > samplePeriod) {
			this.logService.warn(`Invalid unresponsive sample interval (${sampleInterval}ms) or period (${samplePeriod}ms), using defaults.`);
			sampleInterval = 1000;
			samplePeriod = 15000;
		}

		this.jsCallStackMap = new Map<string, number>();
		this.jsCallStackEffectiveSampleCount = Math.round(samplePeriod / sampleInterval);
		this.jsCallStackCollector = this._register(new Delayer<void>(sampleInterval));
		this.jsCallStackCollectorStopScheduler = this._register(new RunOnceScheduler(() => {
			this.stopCollectingJScallStacks(); // Stop collecting after 15s max
		}, samplePeriod));

		//#endregion

		// respect configured menu bar visibility
		this.onConfigurationUpdated();

		// macOS: touch bar support
		this.createTouchBar();

		// Eventing
		this.registerListeners();
	}

	private readyState = ReadyState.NONE;

	setReady(): void {
		this.logService.trace(`window#load: window reported ready (id: ${this._id})`);

		this.readyState = ReadyState.READY;

		// inform all waiting promises that we are ready now
		while (this.whenReadyCallbacks.length) {
			this.whenReadyCallbacks.pop()!(this);
		}

		// Events
		this._onDidSignalReady.fire();
	}

	ready(): Promise<ICodeWindow> {
		return new Promise<ICodeWindow>(resolve => {
			if (this.isReady) {
				return resolve(this);
			}

			// otherwise keep and call later when we are ready
			this.whenReadyCallbacks.push(resolve);
		});
	}

	get isReady(): boolean {
		return this.readyState === ReadyState.READY;
	}

	get whenClosedOrLoaded(): Promise<void> {
		return new Promise<void>(resolve => {

			function handle() {
				closeListener.dispose();
				loadListener.dispose();

				resolve();
			}

			const closeListener = this.onDidClose(() => handle());
			const loadListener = this.onWillLoad(() => handle());
		});
	}

	private registerListeners(): void {

		// Window error conditions to handle
		this._register(Event.fromNodeEventEmitter(this._win, 'unresponsive')(() => this.onWindowError(WindowError.UNRESPONSIVE)));
		this._register(Event.fromNodeEventEmitter(this._win, 'responsive')(() => this.onWindowError(WindowError.RESPONSIVE)));
		this._register(Event.fromNodeEventEmitter(this._win.webContents, 'render-process-gone', (event, details) => details)(details => this.onWindowError(WindowError.PROCESS_GONE, { ...details })));
		this._register(Event.fromNodeEventEmitter(this._win.webContents, 'did-fail-load', (event, exitCode, reason) => ({ exitCode, reason }))(({ exitCode, reason }) => this.onWindowError(WindowError.LOAD, { reason, exitCode })));

		// Prevent windows/iframes from blocking the unload
		// through DOM events. We have our own logic for
		// unloading a window that should not be confused
		// with the DOM way.
		// (https://github.com/microsoft/vscode/issues/122736)
		this._register(Event.fromNodeEventEmitter<electron.Event>(this._win.webContents, 'will-prevent-unload')(event => event.preventDefault()));

		// Remember that we loaded
		this._register(Event.fromNodeEventEmitter(this._win.webContents, 'did-finish-load')(() => {

			// Associate properties from the load request if provided
			if (this.pendingLoadConfig) {
				this._config = this.pendingLoadConfig;

				this.pendingLoadConfig = undefined;
			}
		}));

		// Window (Un)Maximize
		this._register(this.onDidMaximize(() => {
			if (this._config) {
				this._config.maximized = true;
			}
		}));

		this._register(this.onDidUnmaximize(() => {
			if (this._config) {
				this._config.maximized = false;
			}
		}));

		// Window Fullscreen
		this._register(this.onDidEnterFullScreen(() => {
			this.sendWhenReady('vscode:enterFullScreen', CancellationToken.None);
		}));

		this._register(this.onDidLeaveFullScreen(() => {
			this.sendWhenReady('vscode:leaveFullScreen', CancellationToken.None);
		}));

		// Handle configuration changes
		this._register(this.configurationService.onDidChangeConfiguration(e => this.onConfigurationUpdated(e)));

		// Handle Workspace events
		this._register(this.workspacesManagementMainService.onDidDeleteUntitledWorkspace(e => this.onDidDeleteUntitledWorkspace(e)));

		// Inject headers when requests are incoming
		const urls = ['https://*.vsassets.io/*'];
		if (this.productService.extensionsGallery?.serviceUrl) {
			const serviceUrl = URI.parse(this.productService.extensionsGallery.serviceUrl);
			urls.push(`${serviceUrl.scheme}://${serviceUrl.authority}/*`);
		}
		this._win.webContents.session.webRequest.onBeforeSendHeaders({ urls }, async (details, cb) => {
			const headers = await this.getMarketplaceHeaders();

			cb({ cancel: false, requestHeaders: Object.assign(details.requestHeaders, headers) });
		});
	}

	private marketplaceHeadersPromise: Promise<object> | undefined;
	private getMarketplaceHeaders(): Promise<object> {
		if (!this.marketplaceHeadersPromise) {
			this.marketplaceHeadersPromise = resolveMarketplaceHeaders(
				this.productService.version,
				this.productService,
				this.environmentMainService,
				this.configurationService,
				this.fileService,
				this.applicationStorageMainService,
				this.telemetryService);
		}

		return this.marketplaceHeadersPromise;
	}

	private async onWindowError(error: WindowError.UNRESPONSIVE): Promise<void>;
	private async onWindowError(error: WindowError.RESPONSIVE): Promise<void>;
	private async onWindowError(error: WindowError.PROCESS_GONE, details: { reason: string; exitCode: number }): Promise<void>;
	private async onWindowError(error: WindowError.LOAD, details: { reason: string; exitCode: number }): Promise<void>;
	private async onWindowError(type: WindowError, details?: { reason?: string; exitCode?: number }): Promise<void> {

		switch (type) {
			case WindowError.PROCESS_GONE:
				this.logService.error(`CodeWindow: renderer process gone (reason: ${details?.reason || '<unknown>'}, code: ${details?.exitCode || '<unknown>'})`);
				break;
			case WindowError.UNRESPONSIVE:
				this.logService.error('CodeWindow: detected unresponsive');
				break;
			case WindowError.RESPONSIVE:
				this.logService.error('CodeWindow: recovered from unresponsive');
				break;
			case WindowError.LOAD:
				this.logService.error(`CodeWindow: failed to load (reason: ${details?.reason || '<unknown>'}, code: ${details?.exitCode || '<unknown>'})`);
				break;
		}

		// Telemetry
		type WindowErrorClassification = {
			type: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The type of window error to understand the nature of the error better.' };
			reason: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The reason of the window error to understand the nature of the error better.' };
			code: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The exit code of the window process to understand the nature of the error better' };
			owner: 'bpasero';
			comment: 'Provides insight into reasons the vscode window had an error.';
		};
		type WindowErrorEvent = {
			type: WindowError;
			reason: string | undefined;
			code: number | undefined;
		};
		this.telemetryService.publicLog2<WindowErrorEvent, WindowErrorClassification>('windowerror', {
			type,
			reason: details?.reason,
			code: details?.exitCode
		});

		// Inform User if non-recoverable
		switch (type) {
			case WindowError.UNRESPONSIVE:
			case WindowError.PROCESS_GONE:

				// If we run extension tests from CLI, we want to signal
				// back this state to the test runner by exiting with a
				// non-zero exit code.
				if (this.isExtensionDevelopmentTestFromCli) {
					this.lifecycleMainService.kill(1);
					return;
				}

				// If we run smoke tests, want to proceed with an orderly
				// shutdown as much as possible by destroying the window
				// and then calling the normal `quit` routine.
				if (this.environmentMainService.args['enable-smoke-test-driver']) {
					await this.destroyWindow(false, false);
					this.lifecycleMainService.quit(); // still allow for an orderly shutdown
					return;
				}

				// Unresponsive
				if (type === WindowError.UNRESPONSIVE) {
					if (this.isExtensionDevelopmentHost || this.isExtensionTestHost || this._win?.webContents?.isDevToolsOpened()) {
						// TODO@electron Workaround for https://github.com/microsoft/vscode/issues/56994
						// In certain cases the window can report unresponsiveness because a breakpoint was hit
						// and the process is stopped executing. The most typical cases are:
						// - devtools are opened and debugging happens
						// - window is an extensions development host that is being debugged
						// - window is an extension test development host that is being debugged
						return;
					}

					// Interrupt V8 and collect JavaScript stack
					this.jsCallStackCollector.trigger(() => this.startCollectingJScallStacks());
					// Stack collection will stop under any of the following conditions:
					// - The window becomes responsive again
					// - The window is destroyed i-e reopen or closed
					// - sampling period is complete, default is 15s
					this.jsCallStackCollectorStopScheduler.schedule();

					// Show Dialog
					const { response, checkboxChecked } = await this.dialogMainService.showMessageBox({
						type: 'warning',
						buttons: [
							localize({ key: 'reopen', comment: ['&& denotes a mnemonic'] }, "&&Reopen"),
							localize({ key: 'close', comment: ['&& denotes a mnemonic'] }, "&&Close"),
							localize({ key: 'wait', comment: ['&& denotes a mnemonic'] }, "&&Keep Waiting")
						],
						message: localize('appStalled', "The window is not responding"),
						detail: localize('appStalledDetail', "You can reopen or close the window or keep waiting."),
						checkboxLabel: this._config?.workspace ? localize('doNotRestoreEditors', "Don't restore editors") : undefined
					}, this._win);

					// Handle choice
					if (response !== 2 /* keep waiting */) {
						const reopen = response === 0;
						this.stopCollectingJScallStacks();
						await this.destroyWindow(reopen, checkboxChecked);
					}
				}

				// Process gone
				else if (type === WindowError.PROCESS_GONE) {
					let message: string;
					if (!details) {
						message = localize('appGone', "The window terminated unexpectedly");
					} else {
						message = localize('appGoneDetails', "The window terminated unexpectedly (reason: '{0}', code: '{1}')", details.reason, details.exitCode ?? '<unknown>');
					}

					// Show Dialog
					const { response, checkboxChecked } = await this.dialogMainService.showMessageBox({
						type: 'warning',
						buttons: [
							this._config?.workspace ? localize({ key: 'reopen', comment: ['&& denotes a mnemonic'] }, "&&Reopen") : localize({ key: 'newWindow', comment: ['&& denotes a mnemonic'] }, "&&New Window"),
							localize({ key: 'close', comment: ['&& denotes a mnemonic'] }, "&&Close")
						],
						message,
						detail: this._config?.workspace ?
							localize('appGoneDetailWorkspace', "We are sorry for the inconvenience. You can reopen the window to continue where you left off.") :
							localize('appGoneDetailEmptyWindow', "We are sorry for the inconvenience. You can open a new empty window to start again."),
						checkboxLabel: this._config?.workspace ? localize('doNotRestoreEditors', "Don't restore editors") : undefined
					}, this._win);

					// Handle choice
					const reopen = response === 0;
					await this.destroyWindow(reopen, checkboxChecked);
				}
				break;
			case WindowError.RESPONSIVE:
				this.stopCollectingJScallStacks();
				break;
		}
	}

	private async destroyWindow(reopen: boolean, skipRestoreEditors: boolean): Promise<void> {
		const workspace = this._config?.workspace;

		// check to discard editor state first
		if (skipRestoreEditors && workspace) {
			try {
				const workspaceStorage = this.storageMainService.workspaceStorage(workspace);
				await workspaceStorage.init();
				workspaceStorage.delete('memento/workbench.parts.editor');
				await workspaceStorage.close();
			} catch (error) {
				this.logService.error(error);
			}
		}

		// 'close' event will not be fired on destroy(), so signal crash via explicit event
		this._onDidDestroy.fire();

		try {
			// ask the windows service to open a new fresh window if specified
			if (reopen && this._config) {

				// We have to reconstruct a openable from the current workspace
				let uriToOpen: IWorkspaceToOpen | IFolderToOpen | undefined = undefined;
				let forceEmpty = undefined;
				if (isSingleFolderWorkspaceIdentifier(workspace)) {
					uriToOpen = { folderUri: workspace.uri };
				} else if (isWorkspaceIdentifier(workspace)) {
					uriToOpen = { workspaceUri: workspace.configPath };
				} else {
					forceEmpty = true;
				}

				// Delegate to windows service
				const window = (await this.windowsMainService.open({
					context: OpenContext.API,
					userEnv: this._config.userEnv,
					cli: {
						...this.environmentMainService.args,
						_: [] // we pass in the workspace to open explicitly via `urisToOpen`
					},
					urisToOpen: uriToOpen ? [uriToOpen] : undefined,
					forceEmpty,
					forceNewWindow: true,
					remoteAuthority: this.remoteAuthority
				})).at(0);
				window?.focus();
			}
		} finally {
			// make sure to destroy the window as its renderer process is gone. do this
			// after the code for reopening the window, to prevent the entire application
			// from quitting when the last window closes as a result.
			this._win?.destroy();
		}
	}

	private onDidDeleteUntitledWorkspace(workspace: IWorkspaceIdentifier): void {

		// Make sure to update our workspace config if we detect that it
		// was deleted
		if (this._config?.workspace?.id === workspace.id) {
			this._config.workspace = undefined;
		}
	}

	private onConfigurationUpdated(e?: IConfigurationChangeEvent): void {

		// Swipe command support (macOS)
		if (isMacintosh && (!e || e.affectsConfiguration('workbench.editor.swipeToNavigate'))) {
			const swipeToNavigate = this.configurationService.getValue<boolean>('workbench.editor.swipeToNavigate');
			if (swipeToNavigate) {
				this.registerSwipeListener();
			} else {
				this.swipeListenerDisposable.clear();
			}
		}

		// Menubar
		if (!e || e.affectsConfiguration(MenuSettings.MenuBarVisibility)) {
			const newMenuBarVisibility = this.getMenuBarVisibility();
			if (newMenuBarVisibility !== this.currentMenuBarVisibility) {
				this.currentMenuBarVisibility = newMenuBarVisibility;
				this.setMenuBarVisibility(newMenuBarVisibility);
			}
		}

		// Proxy
		if (!e || e.affectsConfiguration('http.proxy') || e.affectsConfiguration('http.noProxy')) {
			const inspect = this.configurationService.inspect<string>('http.proxy');
			let newHttpProxy = (inspect.userLocalValue || '').trim()
				|| (process.env['https_proxy'] || process.env['HTTPS_PROXY'] || process.env['http_proxy'] || process.env['HTTP_PROXY'] || '').trim() // Not standardized.
				|| undefined;

			if (newHttpProxy?.indexOf('@') !== -1) {
				const uri = URI.parse(newHttpProxy!);
				const i = uri.authority.indexOf('@');
				if (i !== -1) {
					newHttpProxy = uri.with({ authority: uri.authority.substring(i + 1) })
						.toString();
				}
			}
			if (newHttpProxy?.endsWith('/')) {
				newHttpProxy = newHttpProxy.substr(0, newHttpProxy.length - 1);
			}

			const newNoProxy = (this.configurationService.getValue<string[]>('http.noProxy') || []).map((item) => item.trim()).join(',')
				|| (process.env['no_proxy'] || process.env['NO_PROXY'] || '').trim() || undefined; // Not standardized.
			if ((newHttpProxy || '').indexOf('@') === -1 && (newHttpProxy !== this.currentHttpProxy || newNoProxy !== this.currentNoProxy)) {
				this.currentHttpProxy = newHttpProxy;
				this.currentNoProxy = newNoProxy;

				const proxyRules = newHttpProxy || '';
				const proxyBypassRules = newNoProxy ? `${newNoProxy},<local>` : '<local>';
				this.logService.trace(`Setting proxy to '${proxyRules}', bypassing '${proxyBypassRules}'`);
				this._win.webContents.session.setProxy({ proxyRules, proxyBypassRules, pacScript: '' });
				electron.app.setProxy({ proxyRules, proxyBypassRules, pacScript: '' });
			}
		}
	}

	private readonly swipeListenerDisposable = this._register(new MutableDisposable());

	private registerSwipeListener(): void {
		this.swipeListenerDisposable.value = Event.fromNodeEventEmitter<string>(this._win, 'swipe', (event: Electron.Event, cmd: string) => cmd)(cmd => {
			if (!this.isReady) {
				return; // window must be ready
			}

			if (cmd === 'left') {
				this.send('vscode:runAction', { id: 'workbench.action.openPreviousRecentlyUsedEditor', from: 'mouse' });
			} else if (cmd === 'right') {
				this.send('vscode:runAction', { id: 'workbench.action.openNextRecentlyUsedEditor', from: 'mouse' });
			}
		});
	}

	addTabbedWindow(window: ICodeWindow): void {
		if (isMacintosh && window.win) {
			this._win.addTabbedWindow(window.win);
		}
	}

	load(configuration: INativeWindowConfiguration, options: ILoadOptions = Object.create(null)): void {
		this.logService.trace(`window#load: attempt to load window (id: ${this._id})`);

		// Clear Document Edited if needed
		if (this.isDocumentEdited()) {
			if (!options.isReload || !this.backupMainService.isHotExitEnabled()) {
				this.setDocumentEdited(false);
			}
		}

		// Clear Title and Filename if needed
		if (!options.isReload) {
			if (this.getRepresentedFilename()) {
				this.setRepresentedFilename('');
			}

			this._win.setTitle(this.productService.nameLong);
		}

		// Update configuration values based on our window context
		// and set it into the config object URL for usage.
		this.updateConfiguration(configuration, options);

		// If this is the first time the window is loaded, we associate the paths
		// directly with the window because we assume the loading will just work
		if (this.readyState === ReadyState.NONE) {
			this._config = configuration;
		}

		// Otherwise, the window is currently showing a folder and if there is an
		// unload handler preventing the load, we cannot just associate the paths
		// because the loading might be vetoed. Instead we associate it later when
		// the window load event has fired.
		else {
			this.pendingLoadConfig = configuration;
		}

		// Indicate we are navigting now
		this.readyState = ReadyState.NAVIGATING;

		// Load URL
		let windowUrl: string;
		if (process.env.VSCODE_DEV && process.env.VSCODE_DEV_SERVER_URL) {
			windowUrl = process.env.VSCODE_DEV_SERVER_URL; // support URL override for development
		} else {
			windowUrl = FileAccess.asBrowserUri(`vs/code/electron-browser/workbench/workbench${this.environmentMainService.isBuilt ? '' : '-dev'}.html`).toString(true);
		}
		this._win.loadURL(windowUrl);

		// Remember that we did load
		const wasLoaded = this.wasLoaded;
		this.wasLoaded = true;

		// Make window visible if it did not open in N seconds because this indicates an error
		// Only do this when running out of sources and not when running tests
		if (!this.environmentMainService.isBuilt && !this.environmentMainService.extensionTestsLocationURI) {
			this._register(new RunOnceScheduler(() => {
				if (this._win && !this._win.isVisible() && !this._win.isMinimized()) {
					this._win.show();
					this.focus({ mode: FocusMode.Force });
					this._win.webContents.openDevTools();
				}
			}, 10000)).schedule();
		}

		// Event
		this._onWillLoad.fire({ workspace: configuration.workspace, reason: options.isReload ? LoadReason.RELOAD : wasLoaded ? LoadReason.LOAD : LoadReason.INITIAL });
	}

	private updateConfiguration(configuration: INativeWindowConfiguration, options: ILoadOptions): void {

		// If this window was loaded before from the command line
		// (as indicated by VSCODE_CLI environment), make sure to
		// preserve that user environment in subsequent loads,
		// unless the new configuration context was also a CLI
		// (for https://github.com/microsoft/vscode/issues/108571)
		// Also, preserve the environment if we're loading from an
		// extension development host that had its environment set
		// (for https://github.com/microsoft/vscode/issues/123508)
		const currentUserEnv = (this._config ?? this.pendingLoadConfig)?.userEnv;
		if (currentUserEnv) {
			const shouldPreserveLaunchCliEnvironment = isLaunchedFromCli(currentUserEnv) && !isLaunchedFromCli(configuration.userEnv);
			const shouldPreserveDebugEnvironmnet = this.isExtensionDevelopmentHost;
			if (shouldPreserveLaunchCliEnvironment || shouldPreserveDebugEnvironmnet) {
				configuration.userEnv = { ...currentUserEnv, ...configuration.userEnv }; // still allow to override certain environment as passed in
			}
		}

		// If named pipe was instantiated for the crashpad_handler process, reuse the same
		// pipe for new app instances connecting to the original app instance.
		// Ref: https://github.com/microsoft/vscode/issues/115874
		if (process.env['CHROME_CRASHPAD_PIPE_NAME']) {
			Object.assign(configuration.userEnv, {
				CHROME_CRASHPAD_PIPE_NAME: process.env['CHROME_CRASHPAD_PIPE_NAME']
			});
		}

		// Add disable-extensions to the config, but do not preserve it on currentConfig or
		// pendingLoadConfig so that it is applied only on this load
		if (options.disableExtensions !== undefined) {
			configuration['disable-extensions'] = options.disableExtensions;
		}

		// Update window related properties
		try {
			configuration.handle = VSBuffer.wrap(this._win.getNativeWindowHandle());
		} catch (error) {
			this.logService.error(`Error getting native window handle: ${error}`);
		}
		configuration.fullscreen = this.isFullScreen;
		configuration.maximized = this._win.isMaximized();
		configuration.partsSplash = this.themeMainService.getWindowSplash(configuration.workspace);
		configuration.zoomLevel = this.getZoomLevel();
		configuration.isCustomZoomLevel = typeof this.customZoomLevel === 'number';
		if (configuration.isCustomZoomLevel && configuration.partsSplash) {
			configuration.partsSplash.zoomLevel = configuration.zoomLevel;
		}

		// Update with latest perf marks
		mark('code/willOpenNewWindow');
		configuration.perfMarks = getMarks();

		// Update in config object URL for usage in renderer
		this.configObjectUrl.update(configuration);
	}

	async reload(cli?: NativeParsedArgs): Promise<void> {

		// Copy our current config for reuse
		const configuration = Object.assign({}, this._config);

		// Validate workspace
		configuration.workspace = await this.validateWorkspaceBeforeReload(configuration);

		// Delete some properties we do not want during reload
		delete configuration.filesToOpenOrCreate;
		delete configuration.filesToDiff;
		delete configuration.filesToMerge;
		delete configuration.filesToWait;

		// Some configuration things get inherited if the window is being reloaded and we are
		// in extension development mode. These options are all development related.
		if (this.isExtensionDevelopmentHost && cli) {
			configuration.verbose = cli.verbose;
			configuration.debugId = cli.debugId;
			configuration.extensionEnvironment = cli.extensionEnvironment;
			configuration['inspect-extensions'] = cli['inspect-extensions'];
			configuration['inspect-brk-extensions'] = cli['inspect-brk-extensions'];
			configuration['extensions-dir'] = cli['extensions-dir'];
		}

		configuration.accessibilitySupport = electron.app.isAccessibilitySupportEnabled();
		configuration.isInitialStartup = false; // since this is a reload
		configuration.policiesData = this.policyService.serialize(); // set policies data again
		configuration.continueOn = this.environmentMainService.continueOn;
		configuration.profiles = {
			all: this.userDataProfilesService.profiles,
			profile: this.profile || this.userDataProfilesService.defaultProfile,
			home: this.userDataProfilesService.profilesHome
		};
		configuration.logLevel = this.loggerMainService.getLogLevel();
		configuration.loggers = this.loggerMainService.getGlobalLoggers();

		// Load config
		this.load(configuration, { isReload: true, disableExtensions: cli?.['disable-extensions'] });
	}

	private async validateWorkspaceBeforeReload(configuration: INativeWindowConfiguration): Promise<IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier | undefined> {

		// Multi folder
		if (isWorkspaceIdentifier(configuration.workspace)) {
			const configPath = configuration.workspace.configPath;
			if (configPath.scheme === Schemas.file) {
				const workspaceExists = await this.fileService.exists(configPath);
				if (!workspaceExists) {
					return undefined;
				}
			}
		}

		// Single folder
		else if (isSingleFolderWorkspaceIdentifier(configuration.workspace)) {
			const uri = configuration.workspace.uri;
			if (uri.scheme === Schemas.file) {
				const folderExists = await this.fileService.exists(uri);
				if (!folderExists) {
					return undefined;
				}
			}
		}

		// Workspace is valid
		return configuration.workspace;
	}

	serializeWindowState(): IWindowState {
		if (!this._win) {
			return defaultWindowState();
		}

		// fullscreen gets special treatment
		if (this.isFullScreen) {
			let display: electron.Display | undefined;
			try {
				display = electron.screen.getDisplayMatching(this.getBounds());
			} catch (error) {
				// Electron has weird conditions under which it throws errors
				// e.g. https://github.com/microsoft/vscode/issues/100334 when
				// large numbers are passed in
			}

			const defaultState = defaultWindowState();

			return {
				mode: WindowMode.Fullscreen,
				display: display ? display.id : undefined,

				// Still carry over window dimensions from previous sessions
				// if we can compute it in fullscreen state.
				// does not seem possible in all cases on Linux for example
				// (https://github.com/microsoft/vscode/issues/58218) so we
				// fallback to the defaults in that case.
				width: this.windowState.width || defaultState.width,
				height: this.windowState.height || defaultState.height,
				x: this.windowState.x || 0,
				y: this.windowState.y || 0,
				zoomLevel: this.customZoomLevel
			};
		}

		const state: IWindowState = Object.create(null);
		let mode: WindowMode;

		// get window mode
		if (!isMacintosh && this._win.isMaximized()) {
			mode = WindowMode.Maximized;
		} else {
			mode = WindowMode.Normal;
		}

		// we don't want to save minimized state, only maximized or normal
		if (mode === WindowMode.Maximized) {
			state.mode = WindowMode.Maximized;
		} else {
			state.mode = WindowMode.Normal;
		}

		// only consider non-minimized window states
		if (mode === WindowMode.Normal || mode === WindowMode.Maximized) {
			let bounds: electron.Rectangle;
			if (mode === WindowMode.Normal) {
				bounds = this.getBounds();
			} else {
				bounds = this._win.getNormalBounds(); // make sure to persist the normal bounds when maximized to be able to restore them
			}

			state.x = bounds.x;
			state.y = bounds.y;
			state.width = bounds.width;
			state.height = bounds.height;
		}

		state.zoomLevel = this.customZoomLevel;

		return state;
	}

	private restoreWindowState(state?: IWindowState): [IWindowState, boolean? /* has multiple displays */] {
		mark('code/willRestoreCodeWindowState');

		let hasMultipleDisplays = false;
		if (state) {

			// Window zoom
			this.customZoomLevel = state.zoomLevel;

			// Window dimensions
			try {
				const displays = electron.screen.getAllDisplays();
				hasMultipleDisplays = displays.length > 1;

				state = WindowStateValidator.validateWindowState(this.logService, state, displays);
			} catch (err) {
				this.logService.warn(`Unexpected error validating window state: ${err}\n${err.stack}`); // somehow display API can be picky about the state to validate
			}
		}

		mark('code/didRestoreCodeWindowState');

		return [state || defaultWindowState(), hasMultipleDisplays];
	}

	getBounds(): electron.Rectangle {
		const [x, y] = this._win.getPosition();
		const [width, height] = this._win.getSize();

		return { x, y, width, height };
	}

	protected override setFullScreen(fullscreen: boolean, fromRestore: boolean): void {
		super.setFullScreen(fullscreen, fromRestore);

		// Events
		this.sendWhenReady(fullscreen ? 'vscode:enterFullScreen' : 'vscode:leaveFullScreen', CancellationToken.None);

		// Respect configured menu bar visibility or default to toggle if not set
		if (this.currentMenuBarVisibility) {
			this.setMenuBarVisibility(this.currentMenuBarVisibility, false);
		}
	}

	private getMenuBarVisibility(): MenuBarVisibility {
		let menuBarVisibility = getMenuBarVisibility(this.configurationService);
		if (['visible', 'toggle', 'hidden'].indexOf(menuBarVisibility) < 0) {
			menuBarVisibility = 'classic';
		}

		return menuBarVisibility;
	}

	private setMenuBarVisibility(visibility: MenuBarVisibility, notify = true): void {
		if (isMacintosh) {
			return; // ignore for macOS platform
		}

		if (visibility === 'toggle') {
			if (notify) {
				this.send('vscode:showInfoMessage', localize('hiddenMenuBar', "You can still access the menu bar by pressing the Alt-key."));
			}
		}

		if (visibility === 'hidden') {
			// for some weird reason that I have no explanation for, the menu bar is not hiding when calling
			// this without timeout (see https://github.com/microsoft/vscode/issues/19777). there seems to be
			// a timing issue with us opening the first window and the menu bar getting created. somehow the
			// fact that we want to hide the menu without being able to bring it back via Alt key makes Electron
			// still show the menu. Unable to reproduce from a simple Hello World application though...
			setTimeout(() => {
				this.doSetMenuBarVisibility(visibility);
			});
		} else {
			this.doSetMenuBarVisibility(visibility);
		}
	}

	private doSetMenuBarVisibility(visibility: MenuBarVisibility): void {
		const isFullscreen = this.isFullScreen;

		switch (visibility) {
			case ('classic'):
				this._win.setMenuBarVisibility(!isFullscreen);
				this._win.autoHideMenuBar = isFullscreen;
				break;

			case ('visible'):
				this._win.setMenuBarVisibility(true);
				this._win.autoHideMenuBar = false;
				break;

			case ('toggle'):
				this._win.setMenuBarVisibility(false);
				this._win.autoHideMenuBar = true;
				break;

			case ('hidden'):
				this._win.setMenuBarVisibility(false);
				this._win.autoHideMenuBar = false;
				break;
		}
	}

	notifyZoomLevel(zoomLevel: number | undefined): void {
		this.customZoomLevel = zoomLevel;
	}

	private getZoomLevel(): number | undefined {
		if (typeof this.customZoomLevel === 'number') {
			return this.customZoomLevel;
		}

		const windowSettings = this.configurationService.getValue<IWindowSettings | undefined>('window');
		return windowSettings?.zoomLevel;
	}

	close(): void {
		this._win?.close();
	}

	sendWhenReady(channel: string, token: CancellationToken, ...args: unknown[]): void {
		if (this.isReady) {
			this.send(channel, ...args);
		} else {
			this.ready().then(() => {
				if (!token.isCancellationRequested) {
					this.send(channel, ...args);
				}
			});
		}
	}

	send(channel: string, ...args: unknown[]): void {
		if (this._win) {
			if (this._win.isDestroyed() || this._win.webContents.isDestroyed()) {
				this.logService.warn(`Sending IPC message to channel '${channel}' for window that is destroyed`);
				return;
			}

			try {
				this._win.webContents.send(channel, ...args);
			} catch (error) {
				this.logService.warn(`Error sending IPC message to channel '${channel}' of window ${this._id}: ${toErrorMessage(error)}`);
			}
		}
	}

	updateTouchBar(groups: ISerializableCommandAction[][]): void {
		if (!isMacintosh) {
			return; // only supported on macOS
		}

		// Update segments for all groups. Setting the segments property
		// of the group directly prevents ugly flickering from happening
		this.touchBarGroups.forEach((touchBarGroup, index) => {
			const commands = groups[index];
			touchBarGroup.segments = this.createTouchBarGroupSegments(commands);
		});
	}

	private createTouchBar(): void {
		if (!isMacintosh) {
			return; // only supported on macOS
		}

		// To avoid flickering, we try to reuse the touch bar group
		// as much as possible by creating a large number of groups
		// for reusing later.
		for (let i = 0; i < 10; i++) {
			const groupTouchBar = this.createTouchBarGroup();
			this.touchBarGroups.push(groupTouchBar);
		}

		this._win.setTouchBar(new electron.TouchBar({ items: this.touchBarGroups }));
	}

	private createTouchBarGroup(items: ISerializableCommandAction[] = []): electron.TouchBarSegmentedControl {

		// Group Segments
		const segments = this.createTouchBarGroupSegments(items);

		// Group Control
		const control = new electron.TouchBar.TouchBarSegmentedControl({
			segments,
			mode: 'buttons',
			segmentStyle: 'automatic',
			change: (selectedIndex) => {
				this.sendWhenReady('vscode:runAction', CancellationToken.None, { id: (control.segments[selectedIndex] as ITouchBarSegment).id, from: 'touchbar' });
			}
		});

		return control;
	}

	private createTouchBarGroupSegments(items: ISerializableCommandAction[] = []): ITouchBarSegment[] {
		const segments: ITouchBarSegment[] = items.map(item => {
			let icon: electron.NativeImage | undefined;
			if (item.icon && !ThemeIcon.isThemeIcon(item.icon) && item.icon?.dark?.scheme === Schemas.file) {
				icon = electron.nativeImage.createFromPath(URI.revive(item.icon.dark).fsPath);
				if (icon.isEmpty()) {
					icon = undefined;
				}
			}

			let title: string;
			if (typeof item.title === 'string') {
				title = item.title;
			} else {
				title = item.title.value;
			}

			return {
				id: item.id,
				label: !icon ? title : undefined,
				icon
			};
		});

		return segments;
	}

	private async startCollectingJScallStacks(): Promise<void> {
		if (!this.jsCallStackCollector.isTriggered()) {
			const stack = await this._win?.webContents.mainFrame.collectJavaScriptCallStack();

			// Increment the count for this stack trace
			if (stack) {
				const count = this.jsCallStackMap.get(stack) || 0;
				this.jsCallStackMap.set(stack, count + 1);
			}

			this.jsCallStackCollector.trigger(() => this.startCollectingJScallStacks());
		}
	}

	private stopCollectingJScallStacks(): void {
		this.jsCallStackCollectorStopScheduler.cancel();
		this.jsCallStackCollector.cancel();

		if (this.jsCallStackMap.size) {
			let logMessage = `CodeWindow unresponsive samples:\n`;
			let samples = 0;

			const sortedEntries = Array.from(this.jsCallStackMap.entries())
				.sort((a, b) => b[1] - a[1]);

			for (const [stack, count] of sortedEntries) {
				samples += count;
				// If the stack appears more than 20 percent of the time, log it
				// to the error telemetry as UnresponsiveSampleError.
				if (Math.round((count * 100) / this.jsCallStackEffectiveSampleCount) > 20) {
					const fakeError = new UnresponsiveError(stack, this.id, this._win?.webContents.getOSProcessId());
					errorHandler.onUnexpectedError(fakeError);
				}
				logMessage += `<${count}> ${stack}\n`;
			}

			logMessage += `Total Samples: ${samples}\n`;
			logMessage += 'For full overview of the unresponsive period, capture cpu profile via https://aka.ms/vscode-tracing-cpu-profile';
			this.logService.error(logMessage);
		}

		this.jsCallStackMap.clear();
	}

	matches(webContents: electron.WebContents): boolean {
		return this._win?.webContents.id === webContents.id;
	}

	override dispose(): void {
		super.dispose();

		// Deregister the loggers for this window
		this.loggerMainService.deregisterLoggers(this.id);
	}
}

class UnresponsiveError extends Error {

	constructor(sample: string, windowId: number, pid = 0) {
		// Since the stacks are available via the sample
		// we can avoid collecting them when constructing the error.
		const stackTraceLimit = Error.stackTraceLimit;
		Error.stackTraceLimit = 0;
		super(`UnresponsiveSampleError: from window with ID ${windowId} belonging to process with pid ${pid}`);
		Error.stackTraceLimit = stackTraceLimit;
		this.name = 'UnresponsiveSampleError';
		this.stack = sample;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/windows/electron-main/windows.ts]---
Location: vscode-main/src/vs/platform/windows/electron-main/windows.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import electron, { Display, Rectangle } from 'electron';
import { Color } from '../../../base/common/color.js';
import { Event } from '../../../base/common/event.js';
import { join } from '../../../base/common/path.js';
import { IProcessEnvironment, isLinux, isMacintosh, isWindows } from '../../../base/common/platform.js';
import { URI } from '../../../base/common/uri.js';
import { IAuxiliaryWindow } from '../../auxiliaryWindow/electron-main/auxiliaryWindow.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { NativeParsedArgs } from '../../environment/common/argv.js';
import { IEnvironmentMainService } from '../../environment/electron-main/environmentMainService.js';
import { ServicesAccessor, createDecorator } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';
import { IProductService } from '../../product/common/productService.js';
import { IThemeMainService } from '../../theme/electron-main/themeMainService.js';
import { IOpenEmptyWindowOptions, IWindowOpenable, IWindowSettings, TitlebarStyle, WindowMinimumSize, hasNativeTitlebar, useNativeFullScreen, useWindowControlsOverlay, zoomLevelToZoomFactor } from '../../window/common/window.js';
import { ICodeWindow, IWindowState, WindowMode, defaultWindowState } from '../../window/electron-main/window.js';

export const IWindowsMainService = createDecorator<IWindowsMainService>('windowsMainService');

export interface IWindowsMainService {

	readonly _serviceBrand: undefined;

	readonly onDidChangeWindowsCount: Event<IWindowsCountChangedEvent>;

	readonly onDidOpenWindow: Event<ICodeWindow>;
	readonly onDidSignalReadyWindow: Event<ICodeWindow>;
	readonly onDidMaximizeWindow: Event<ICodeWindow>;
	readonly onDidUnmaximizeWindow: Event<ICodeWindow>;
	readonly onDidChangeFullScreen: Event<{ window: ICodeWindow; fullscreen: boolean }>;
	readonly onDidTriggerSystemContextMenu: Event<{ readonly window: ICodeWindow; readonly x: number; readonly y: number }>;
	readonly onDidDestroyWindow: Event<ICodeWindow>;

	open(openConfig: IOpenConfiguration): Promise<ICodeWindow[]>;
	openEmptyWindow(openConfig: IOpenEmptyConfiguration, options?: IOpenEmptyWindowOptions): Promise<ICodeWindow[]>;
	openExtensionDevelopmentHostWindow(extensionDevelopmentPath: string[], openConfig: IOpenConfiguration): Promise<ICodeWindow[]>;

	openExistingWindow(window: ICodeWindow, openConfig: IOpenConfiguration): void;

	sendToFocused(channel: string, ...args: unknown[]): void;
	sendToOpeningWindow(channel: string, ...args: unknown[]): void;
	sendToAll(channel: string, payload?: unknown, windowIdsToIgnore?: number[]): void;

	getWindows(): ICodeWindow[];
	getWindowCount(): number;

	getFocusedWindow(): ICodeWindow | undefined;
	getLastActiveWindow(): ICodeWindow | undefined;

	getWindowById(windowId: number): ICodeWindow | undefined;
	getWindowByWebContents(webContents: electron.WebContents): ICodeWindow | undefined;
}

export interface IWindowsCountChangedEvent {
	readonly oldCount: number;
	readonly newCount: number;
}

export const enum OpenContext {

	// opening when running from the command line
	CLI,

	// macOS only: opening from the dock (also when opening files to a running instance from desktop)
	DOCK,

	// opening from the main application window
	MENU,

	// opening from a file or folder dialog
	DIALOG,

	// opening from the OS's UI
	DESKTOP,

	// opening through the API
	API,

	// opening from a protocol link
	LINK
}

export interface IBaseOpenConfiguration {
	readonly context: OpenContext;
	readonly contextWindowId?: number;
}

export interface IOpenConfiguration extends IBaseOpenConfiguration {
	readonly cli: NativeParsedArgs;
	readonly userEnv?: IProcessEnvironment;
	readonly urisToOpen?: IWindowOpenable[];
	readonly waitMarkerFileURI?: URI;
	readonly preferNewWindow?: boolean;
	readonly forceNewWindow?: boolean;
	readonly forceNewTabbedWindow?: boolean;
	readonly forceReuseWindow?: boolean;
	readonly forceEmpty?: boolean;
	readonly diffMode?: boolean;
	readonly mergeMode?: boolean;
	addMode?: boolean;
	removeMode?: boolean;
	readonly gotoLineMode?: boolean;
	readonly initialStartup?: boolean;
	readonly noRecentEntry?: boolean;
	/**
	 * The remote authority to use when windows are opened with either
	 * - no workspace (empty window)
	 * - a workspace that is neither `file://` nor `vscode-remote://`
	 */
	readonly remoteAuthority?: string;
	readonly forceProfile?: string;
	readonly forceTempProfile?: boolean;
}

export interface IOpenEmptyConfiguration extends IBaseOpenConfiguration { }

export interface IDefaultBrowserWindowOptionsOverrides {
	forceNativeTitlebar?: boolean;
	disableFullscreen?: boolean;
	alwaysOnTop?: boolean;
}

export function defaultBrowserWindowOptions(accessor: ServicesAccessor, windowState: IWindowState, overrides?: IDefaultBrowserWindowOptionsOverrides, webPreferences?: electron.WebPreferences): electron.BrowserWindowConstructorOptions & { experimentalDarkMode: boolean } {
	const themeMainService = accessor.get(IThemeMainService);
	const productService = accessor.get(IProductService);
	const configurationService = accessor.get(IConfigurationService);
	const environmentMainService = accessor.get(IEnvironmentMainService);

	const windowSettings = configurationService.getValue<IWindowSettings | undefined>('window');

	const options: electron.BrowserWindowConstructorOptions & { experimentalDarkMode: boolean; accentColor?: boolean | string } = {
		backgroundColor: themeMainService.getBackgroundColor(),
		minWidth: WindowMinimumSize.WIDTH,
		minHeight: WindowMinimumSize.HEIGHT,
		title: productService.nameLong,
		show: windowState.mode !== WindowMode.Maximized && windowState.mode !== WindowMode.Fullscreen, // reduce flicker by showing later
		x: windowState.x,
		y: windowState.y,
		width: windowState.width,
		height: windowState.height,
		webPreferences: {
			...webPreferences,
			enableWebSQL: false,
			spellcheck: false,
			zoomFactor: zoomLevelToZoomFactor(windowState.zoomLevel ?? windowSettings?.zoomLevel),
			autoplayPolicy: 'user-gesture-required',
			// Enable experimental css highlight api https://chromestatus.com/feature/5436441440026624
			// Refs https://github.com/microsoft/vscode/issues/140098
			enableBlinkFeatures: 'HighlightAPI',
			sandbox: true,
			// TODO(deepak1556): Should be removed once migration is complete
			// https://github.com/microsoft/vscode/issues/239228
			enableDeprecatedPaste: true,
		},
		experimentalDarkMode: true
	};

	if (isWindows) {
		let borderSetting = windowSettings?.border || 'default';
		if (borderSetting === 'system') {
			borderSetting = 'default';
		}
		if (borderSetting !== 'default') {
			if (borderSetting === 'off') {
				options.accentColor = false;
			} else if (typeof borderSetting === 'string') {
				options.accentColor = borderSetting;
			}
		}
	}

	if (isLinux) {
		options.icon = join(environmentMainService.appRoot, 'resources/linux/code.png'); // always on Linux
	} else if (isWindows && !environmentMainService.isBuilt) {
		options.icon = join(environmentMainService.appRoot, 'resources/win32/code_150x150.png'); // only when running out of sources on Windows
	}

	if (isMacintosh) {
		options.acceptFirstMouse = true; // enabled by default

		if (windowSettings?.clickThroughInactive === false) {
			options.acceptFirstMouse = false;
		}
	}

	if (overrides?.disableFullscreen) {
		options.fullscreen = false;
	} else if (isMacintosh && !useNativeFullScreen(configurationService)) {
		options.fullscreenable = false; // enables simple fullscreen mode
	}

	const useNativeTabs = isMacintosh && windowSettings?.nativeTabs === true;
	if (useNativeTabs) {
		options.tabbingIdentifier = productService.nameShort; // this opts in to native macOS tabs
	}

	const hideNativeTitleBar = !hasNativeTitlebar(configurationService, overrides?.forceNativeTitlebar ? TitlebarStyle.NATIVE : undefined);
	if (hideNativeTitleBar) {
		options.titleBarStyle = 'hidden';
		if (!isMacintosh) {
			options.frame = false;
		}

		if (useWindowControlsOverlay(configurationService)) {
			if (isMacintosh) {
				options.titleBarOverlay = true;
			} else {

				// This logic will not perfectly guess the right colors
				// to use on initialization, but prefer to keep things
				// simple as it is temporary and not noticeable

				const titleBarColor = themeMainService.getWindowSplash(undefined)?.colorInfo.titleBarBackground ?? themeMainService.getBackgroundColor();
				const symbolColor = Color.fromHex(titleBarColor).isDarker() ? '#FFFFFF' : '#000000';

				options.titleBarOverlay = {
					height: 29, // the smallest size of the title bar on windows accounting for the border on windows 11
					color: titleBarColor,
					symbolColor
				};
			}
		}
	}

	if (overrides?.alwaysOnTop) {
		options.alwaysOnTop = true;
	}

	return options;
}

export function getLastFocused(windows: ICodeWindow[]): ICodeWindow | undefined;
export function getLastFocused(windows: IAuxiliaryWindow[]): IAuxiliaryWindow | undefined;
export function getLastFocused(windows: ICodeWindow[] | IAuxiliaryWindow[]): ICodeWindow | IAuxiliaryWindow | undefined {
	let lastFocusedWindow: ICodeWindow | IAuxiliaryWindow | undefined = undefined;
	let maxLastFocusTime = Number.MIN_VALUE;

	for (const window of windows) {
		if (window.lastFocusTime > maxLastFocusTime) {
			maxLastFocusTime = window.lastFocusTime;
			lastFocusedWindow = window;
		}
	}

	return lastFocusedWindow;
}

export namespace WindowStateValidator {

	export function validateWindowState(logService: ILogService, state: IWindowState, displays = electron.screen.getAllDisplays()): IWindowState | undefined {
		logService.trace(`window#validateWindowState: validating window state on ${displays.length} display(s)`, state);

		if (
			typeof state.x !== 'number' ||
			typeof state.y !== 'number' ||
			typeof state.width !== 'number' ||
			typeof state.height !== 'number'
		) {
			logService.trace('window#validateWindowState: unexpected type of state values');

			return undefined;
		}

		if (state.width <= 0 || state.height <= 0) {
			logService.trace('window#validateWindowState: unexpected negative values');

			return undefined;
		}

		// Single Monitor: be strict about x/y positioning
		// macOS & Linux: these OS seem to be pretty good in ensuring that a window is never outside of it's bounds.
		// Windows: it is possible to have a window with a size that makes it fall out of the window. our strategy
		//          is to try as much as possible to keep the window in the monitor bounds. we are not as strict as
		//          macOS and Linux and allow the window to exceed the monitor bounds as long as the window is still
		//          some pixels (128) visible on the screen for the user to drag it back.
		if (displays.length === 1) {
			const displayWorkingArea = getWorkingArea(displays[0]);
			logService.trace('window#validateWindowState: single monitor working area', displayWorkingArea);

			if (displayWorkingArea) {

				function ensureStateInDisplayWorkingArea(): void {
					if (!state || typeof state.x !== 'number' || typeof state.y !== 'number' || !displayWorkingArea) {
						return;
					}

					if (state.x < displayWorkingArea.x) {
						// prevent window from falling out of the screen to the left
						state.x = displayWorkingArea.x;
					}

					if (state.y < displayWorkingArea.y) {
						// prevent window from falling out of the screen to the top
						state.y = displayWorkingArea.y;
					}
				}

				// ensure state is not outside display working area (top, left)
				ensureStateInDisplayWorkingArea();

				if (state.width > displayWorkingArea.width) {
					// prevent window from exceeding display bounds width
					state.width = displayWorkingArea.width;
				}

				if (state.height > displayWorkingArea.height) {
					// prevent window from exceeding display bounds height
					state.height = displayWorkingArea.height;
				}

				if (state.x > (displayWorkingArea.x + displayWorkingArea.width - 128)) {
					// prevent window from falling out of the screen to the right with
					// 128px margin by positioning the window to the far right edge of
					// the screen
					state.x = displayWorkingArea.x + displayWorkingArea.width - state.width;
				}

				if (state.y > (displayWorkingArea.y + displayWorkingArea.height - 128)) {
					// prevent window from falling out of the screen to the bottom with
					// 128px margin by positioning the window to the far bottom edge of
					// the screen
					state.y = displayWorkingArea.y + displayWorkingArea.height - state.height;
				}

				// again ensure state is not outside display working area
				// (it may have changed from the previous validation step)
				ensureStateInDisplayWorkingArea();
			}

			return state;
		}

		// Multi Montior (fullscreen): try to find the previously used display
		if (state.display && state.mode === WindowMode.Fullscreen) {
			const display = displays.find(d => d.id === state.display);
			if (display && typeof display.bounds?.x === 'number' && typeof display.bounds?.y === 'number') {
				logService.trace('window#validateWindowState: restoring fullscreen to previous display');

				const defaults = defaultWindowState(WindowMode.Fullscreen); // make sure we have good values when the user restores the window
				defaults.x = display.bounds.x; // carefull to use displays x/y position so that the window ends up on the correct monitor
				defaults.y = display.bounds.y;

				return defaults;
			}
		}

		// Multi Monitor (non-fullscreen): ensure window is within display bounds
		let display: electron.Display | undefined;
		let displayWorkingArea: electron.Rectangle | undefined;
		try {
			display = electron.screen.getDisplayMatching({ x: state.x, y: state.y, width: state.width, height: state.height });
			displayWorkingArea = getWorkingArea(display);

			logService.trace('window#validateWindowState: multi-monitor working area', displayWorkingArea);
		} catch (error) {
			// Electron has weird conditions under which it throws errors
			// e.g. https://github.com/microsoft/vscode/issues/100334 when
			// large numbers are passed in
			logService.error('window#validateWindowState: error finding display for window state', error);
		}

		if (display && validateWindowStateOnDisplay(state, display)) {
			return state;
		}

		logService.trace('window#validateWindowState: state is outside of the multi-monitor working area');

		return undefined;
	}

	export function validateWindowStateOnDisplay(state: IWindowState, display: Display): state is Rectangle {
		if (
			typeof state.x !== 'number' ||
			typeof state.y !== 'number' ||
			typeof state.width !== 'number' ||
			typeof state.height !== 'number' ||
			state.width <= 0 || state.height <= 0
		) {
			return false;
		}

		const displayWorkingArea = getWorkingArea(display);
		return Boolean(
			displayWorkingArea &&											// we have valid working area bounds
			state.x + state.width > displayWorkingArea.x &&					// prevent window from falling out of the screen to the left
			state.y + state.height > displayWorkingArea.y &&				// prevent window from falling out of the screen to the top
			state.x < displayWorkingArea.x + displayWorkingArea.width &&	// prevent window from falling out of the screen to the right
			state.y < displayWorkingArea.y + displayWorkingArea.height		// prevent window from falling out of the screen to the bottom
		);
	}

	function getWorkingArea(display: electron.Display): electron.Rectangle | undefined {

		// Prefer the working area of the display to account for taskbars on the
		// desktop being positioned somewhere (https://github.com/microsoft/vscode/issues/50830).
		//
		// Linux X11 sessions sometimes report wrong display bounds, so we validate
		// the reported sizes are positive.
		if (display.workArea.width > 0 && display.workArea.height > 0) {
			return display.workArea;
		}

		if (display.bounds.width > 0 && display.bounds.height > 0) {
			return display.bounds;
		}

		return undefined;
	}
}

/**
 * We have some components like `NativeWebContentExtractorService` that create offscreen windows
 * to extract content from web pages. These windows are not visible to the user and are not
 * considered part of the main application window. This function filters out those offscreen
 * windows from the list of all windows.
 * @returns An array of all BrowserWindow instances that are not offscreen.
 */
export function getAllWindowsExcludingOffscreen() {
	return electron.BrowserWindow.getAllWindows().filter(win => !win.webContents.isOffscreen());
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/windows/electron-main/windowsFinder.ts]---
Location: vscode-main/src/vs/platform/windows/electron-main/windowsFinder.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { extUriBiasedIgnorePathCase } from '../../../base/common/resources.js';
import { URI } from '../../../base/common/uri.js';
import { ICodeWindow } from '../../window/electron-main/window.js';
import { IResolvedWorkspace, ISingleFolderWorkspaceIdentifier, isSingleFolderWorkspaceIdentifier, isWorkspaceIdentifier, IWorkspaceIdentifier } from '../../workspace/common/workspace.js';

export async function findWindowOnFile(windows: ICodeWindow[], fileUri: URI, localWorkspaceResolver: (workspace: IWorkspaceIdentifier) => Promise<IResolvedWorkspace | undefined>): Promise<ICodeWindow | undefined> {

	// First check for windows with workspaces that have a parent folder of the provided path opened
	for (const window of windows) {
		const workspace = window.openedWorkspace;
		if (isWorkspaceIdentifier(workspace)) {
			const resolvedWorkspace = await localWorkspaceResolver(workspace);

			// resolved workspace: folders are known and can be compared with
			if (resolvedWorkspace) {
				if (resolvedWorkspace.folders.some(folder => extUriBiasedIgnorePathCase.isEqualOrParent(fileUri, folder.uri))) {
					return window;
				}
			}

			// unresolved: can only compare with workspace location
			else {
				if (extUriBiasedIgnorePathCase.isEqualOrParent(fileUri, workspace.configPath)) {
					return window;
				}
			}
		}
	}

	// Then go with single folder windows that are parent of the provided file path
	const singleFolderWindowsOnFilePath = windows.filter(window => isSingleFolderWorkspaceIdentifier(window.openedWorkspace) && extUriBiasedIgnorePathCase.isEqualOrParent(fileUri, window.openedWorkspace.uri));
	if (singleFolderWindowsOnFilePath.length) {
		return singleFolderWindowsOnFilePath.sort((windowA, windowB) => -((windowA.openedWorkspace as ISingleFolderWorkspaceIdentifier).uri.path.length - (windowB.openedWorkspace as ISingleFolderWorkspaceIdentifier).uri.path.length))[0];
	}

	return undefined;
}

export function findWindowOnWorkspaceOrFolder(windows: ICodeWindow[], folderOrWorkspaceConfigUri: URI): ICodeWindow | undefined {

	for (const window of windows) {

		// check for workspace config path
		if (isWorkspaceIdentifier(window.openedWorkspace) && extUriBiasedIgnorePathCase.isEqual(window.openedWorkspace.configPath, folderOrWorkspaceConfigUri)) {
			return window;
		}

		// check for folder path
		if (isSingleFolderWorkspaceIdentifier(window.openedWorkspace) && extUriBiasedIgnorePathCase.isEqual(window.openedWorkspace.uri, folderOrWorkspaceConfigUri)) {
			return window;
		}
	}

	return undefined;
}


export function findWindowOnExtensionDevelopmentPath(windows: ICodeWindow[], extensionDevelopmentPaths: string[]): ICodeWindow | undefined {

	const matches = (uriString: string): boolean => {
		return extensionDevelopmentPaths.some(path => extUriBiasedIgnorePathCase.isEqual(URI.file(path), URI.file(uriString)));
	};

	for (const window of windows) {

		// match on extension development path. the path can be one or more paths
		// so we check if any of the paths match on any of the provided ones
		if (window.config?.extensionDevelopmentPath?.some(path => matches(path))) {
			return window;
		}
	}

	return undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/windows/electron-main/windowsMainService.ts]---
Location: vscode-main/src/vs/platform/windows/electron-main/windowsMainService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import { app, BrowserWindow, WebContents, shell } from 'electron';
import { addUNCHostToAllowlist } from '../../../base/node/unc.js';
import { hostname, release, arch } from 'os';
import { coalesce, distinct } from '../../../base/common/arrays.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { CharCode } from '../../../base/common/charCode.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { isWindowsDriveLetter, parseLineAndColumnAware, sanitizeFilePath, toSlashes } from '../../../base/common/extpath.js';
import { getPathLabel } from '../../../base/common/labels.js';
import { Disposable, DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import { basename, join, normalize, posix } from '../../../base/common/path.js';
import { getMarks, mark } from '../../../base/common/performance.js';
import { IProcessEnvironment, isMacintosh, isWindows, OS } from '../../../base/common/platform.js';
import { cwd } from '../../../base/common/process.js';
import { extUriBiasedIgnorePathCase, isEqualAuthority, normalizePath, originalFSPath, removeTrailingPathSeparator } from '../../../base/common/resources.js';
import { assertReturnsDefined } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { getNLSLanguage, getNLSMessages, localize } from '../../../nls.js';
import { IBackupMainService } from '../../backup/electron-main/backup.js';
import { IEmptyWindowBackupInfo } from '../../backup/node/backup.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IDialogMainService } from '../../dialogs/electron-main/dialogMainService.js';
import { NativeParsedArgs } from '../../environment/common/argv.js';
import { IEnvironmentMainService } from '../../environment/electron-main/environmentMainService.js';
import { FileType, IFileService } from '../../files/common/files.js';
import { IInstantiationService } from '../../instantiation/common/instantiation.js';
import { ILifecycleMainService } from '../../lifecycle/electron-main/lifecycleMainService.js';
import { ILogService } from '../../log/common/log.js';
import product from '../../product/common/product.js';
import { IProtocolMainService } from '../../protocol/electron-main/protocol.js';
import { getRemoteAuthority } from '../../remote/common/remoteHosts.js';
import { IStateService } from '../../state/node/state.js';
import { IAddRemoveFoldersRequest, INativeOpenFileRequest, INativeWindowConfiguration, IOpenEmptyWindowOptions, IPath, IPathsToWaitFor, isFileToOpen, isFolderToOpen, isWorkspaceToOpen, IWindowOpenable, IWindowSettings } from '../../window/common/window.js';
import { CodeWindow } from './windowImpl.js';
import { IOpenConfiguration, IOpenEmptyConfiguration, IWindowsCountChangedEvent, IWindowsMainService, OpenContext, getLastFocused } from './windows.js';
import { findWindowOnExtensionDevelopmentPath, findWindowOnFile, findWindowOnWorkspaceOrFolder } from './windowsFinder.js';
import { IWindowState, WindowsStateHandler } from './windowsStateHandler.js';
import { IRecent } from '../../workspaces/common/workspaces.js';
import { hasWorkspaceFileExtension, IAnyWorkspaceIdentifier, ISingleFolderWorkspaceIdentifier, isSingleFolderWorkspaceIdentifier, isWorkspaceIdentifier, IWorkspaceIdentifier, toWorkspaceIdentifier } from '../../workspace/common/workspace.js';
import { createEmptyWorkspaceIdentifier, getSingleFolderWorkspaceIdentifier, getWorkspaceIdentifier } from '../../workspaces/node/workspaces.js';
import { IWorkspacesHistoryMainService } from '../../workspaces/electron-main/workspacesHistoryMainService.js';
import { IWorkspacesManagementMainService } from '../../workspaces/electron-main/workspacesManagementMainService.js';
import { ICodeWindow, UnloadReason } from '../../window/electron-main/window.js';
import { IThemeMainService } from '../../theme/electron-main/themeMainService.js';
import { IEditorOptions, ITextEditorOptions } from '../../editor/common/editor.js';
import { IUserDataProfile } from '../../userDataProfile/common/userDataProfile.js';
import { IPolicyService } from '../../policy/common/policy.js';
import { IUserDataProfilesMainService } from '../../userDataProfile/electron-main/userDataProfile.js';
import { ILoggerMainService } from '../../log/electron-main/loggerService.js';
import { IAuxiliaryWindowsMainService } from '../../auxiliaryWindow/electron-main/auxiliaryWindows.js';
import { IAuxiliaryWindow } from '../../auxiliaryWindow/electron-main/auxiliaryWindow.js';
import { ICSSDevelopmentService } from '../../cssDev/node/cssDevService.js';
import { ResourceSet } from '../../../base/common/map.js';

//#region Helper Interfaces

type RestoreWindowsSetting = 'preserve' | 'all' | 'folders' | 'one' | 'none';

interface IOpenBrowserWindowOptions {
	readonly userEnv?: IProcessEnvironment;
	readonly cli?: NativeParsedArgs;

	readonly workspace?: IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier;

	readonly remoteAuthority?: string;

	readonly initialStartup?: boolean;

	readonly filesToOpen?: IFilesToOpen;

	readonly forceNewWindow?: boolean;
	readonly forceNewTabbedWindow?: boolean;
	readonly windowToUse?: ICodeWindow;

	readonly emptyWindowBackupInfo?: IEmptyWindowBackupInfo;
	readonly forceProfile?: string;
	readonly forceTempProfile?: boolean;
}

interface IPathResolveOptions {

	/**
	 * By default, resolving a path will check
	 * if the path exists. This can be disabled
	 * with this flag.
	 */
	readonly ignoreFileNotFound?: boolean;

	/**
	 * Will reject a path if it points to a transient
	 * workspace as indicated by a `transient: true`
	 * property in the workspace file.
	 */
	readonly rejectTransientWorkspaces?: boolean;

	/**
	 * If enabled, will resolve the path line/column
	 * aware and properly remove this information
	 * from the resulting file path.
	 */
	readonly gotoLineMode?: boolean;

	/**
	 * Forces to resolve the provided path as workspace
	 * file instead of opening it as a file.
	 */
	readonly forceOpenWorkspaceAsFile?: boolean;

	/**
	 * The remoteAuthority to use if the URL to open is
	 * neither `file` nor `vscode-remote`.
	 */
	readonly remoteAuthority?: string;
}

interface IFilesToOpen {
	readonly remoteAuthority?: string;

	filesToOpenOrCreate: IPath[];
	filesToDiff: IPath[];
	filesToMerge: IPath[];

	filesToWait?: IPathsToWaitFor;
}

interface IPathToOpen<T = IEditorOptions> extends IPath<T> {

	/**
	 * The workspace to open
	 */
	readonly workspace?: IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier;

	/**
	 * Whether the path is considered to be transient or not
	 * for example, a transient workspace should not add to
	 * the workspaces history and should never restore.
	 */
	readonly transient?: boolean;

	/**
	 * The backup path to use
	 */
	readonly backupPath?: string;

	/**
	 * The remote authority for the Code instance to open. Undefined if not remote.
	 */
	readonly remoteAuthority?: string;

	/**
	 * Optional label for the recent history
	 */
	label?: string;
}

const EMPTY_WINDOW: IPathToOpen = Object.create(null);

interface IWorkspacePathToOpen extends IPathToOpen {
	readonly workspace: IWorkspaceIdentifier;
}

interface ISingleFolderWorkspacePathToOpen extends IPathToOpen {
	readonly workspace: ISingleFolderWorkspaceIdentifier;
}

function isWorkspacePathToOpen(path: IPathToOpen | undefined): path is IWorkspacePathToOpen {
	return isWorkspaceIdentifier(path?.workspace);
}

function isSingleFolderWorkspacePathToOpen(path: IPathToOpen | undefined): path is ISingleFolderWorkspacePathToOpen {
	return isSingleFolderWorkspaceIdentifier(path?.workspace);
}

//#endregion

export class WindowsMainService extends Disposable implements IWindowsMainService {

	declare readonly _serviceBrand: undefined;

	private readonly _onDidOpenWindow = this._register(new Emitter<ICodeWindow>());
	readonly onDidOpenWindow = this._onDidOpenWindow.event;

	private readonly _onDidSignalReadyWindow = this._register(new Emitter<ICodeWindow>());
	readonly onDidSignalReadyWindow = this._onDidSignalReadyWindow.event;

	private readonly _onDidDestroyWindow = this._register(new Emitter<ICodeWindow>());
	readonly onDidDestroyWindow = this._onDidDestroyWindow.event;

	private readonly _onDidChangeWindowsCount = this._register(new Emitter<IWindowsCountChangedEvent>());
	readonly onDidChangeWindowsCount = this._onDidChangeWindowsCount.event;

	private readonly _onDidMaximizeWindow = this._register(new Emitter<ICodeWindow>());
	readonly onDidMaximizeWindow = this._onDidMaximizeWindow.event;

	private readonly _onDidUnmaximizeWindow = this._register(new Emitter<ICodeWindow>());
	readonly onDidUnmaximizeWindow = this._onDidUnmaximizeWindow.event;

	private readonly _onDidChangeFullScreen = this._register(new Emitter<{ window: ICodeWindow; fullscreen: boolean }>());
	readonly onDidChangeFullScreen = this._onDidChangeFullScreen.event;

	private readonly _onDidTriggerSystemContextMenu = this._register(new Emitter<{ window: ICodeWindow; x: number; y: number }>());
	readonly onDidTriggerSystemContextMenu = this._onDidTriggerSystemContextMenu.event;

	private readonly windows = new Map<number, ICodeWindow>();

	private readonly windowsStateHandler: WindowsStateHandler;

	constructor(
		private readonly machineId: string,
		private readonly sqmId: string,
		private readonly devDeviceId: string,
		private readonly initialUserEnv: IProcessEnvironment,
		@ILogService private readonly logService: ILogService,
		@ILoggerMainService private readonly loggerService: ILoggerMainService,
		@IStateService stateService: IStateService,
		@IPolicyService private readonly policyService: IPolicyService,
		@IEnvironmentMainService private readonly environmentMainService: IEnvironmentMainService,
		@IUserDataProfilesMainService private readonly userDataProfilesMainService: IUserDataProfilesMainService,
		@ILifecycleMainService private readonly lifecycleMainService: ILifecycleMainService,
		@IBackupMainService private readonly backupMainService: IBackupMainService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IWorkspacesHistoryMainService private readonly workspacesHistoryMainService: IWorkspacesHistoryMainService,
		@IWorkspacesManagementMainService private readonly workspacesManagementMainService: IWorkspacesManagementMainService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IDialogMainService private readonly dialogMainService: IDialogMainService,
		@IFileService private readonly fileService: IFileService,
		@IProtocolMainService private readonly protocolMainService: IProtocolMainService,
		@IThemeMainService private readonly themeMainService: IThemeMainService,
		@IAuxiliaryWindowsMainService private readonly auxiliaryWindowsMainService: IAuxiliaryWindowsMainService,
		@ICSSDevelopmentService private readonly cssDevelopmentService: ICSSDevelopmentService
	) {
		super();

		this.windowsStateHandler = this._register(new WindowsStateHandler(this, stateService, this.lifecycleMainService, this.logService, this.configurationService));

		this.registerListeners();
	}

	private registerListeners(): void {

		// Signal a window is ready after having entered a workspace
		this._register(this.workspacesManagementMainService.onDidEnterWorkspace(event => this._onDidSignalReadyWindow.fire(event.window)));

		// Update valid roots in protocol service for extension dev windows
		this._register(this.onDidSignalReadyWindow(window => {
			if (window.config?.extensionDevelopmentPath || window.config?.extensionTestsPath) {
				const disposables = new DisposableStore();
				disposables.add(Event.any(window.onDidClose, window.onDidDestroy)(() => disposables.dispose()));

				// Allow access to extension development path
				if (window.config.extensionDevelopmentPath) {
					for (const extensionDevelopmentPath of window.config.extensionDevelopmentPath) {
						disposables.add(this.protocolMainService.addValidFileRoot(extensionDevelopmentPath));
					}
				}

				// Allow access to extension tests path
				if (window.config.extensionTestsPath) {
					disposables.add(this.protocolMainService.addValidFileRoot(window.config.extensionTestsPath));
				}
			}
		}));
	}

	openEmptyWindow(openConfig: IOpenEmptyConfiguration, options?: IOpenEmptyWindowOptions): Promise<ICodeWindow[]> {
		const cli = this.environmentMainService.args;
		const remoteAuthority = options?.remoteAuthority || undefined;
		const forceEmpty = true;
		const forceReuseWindow = options?.forceReuseWindow;
		const forceNewWindow = !forceReuseWindow;

		return this.open({ ...openConfig, cli, forceEmpty, forceNewWindow, forceReuseWindow, remoteAuthority, forceTempProfile: options?.forceTempProfile, forceProfile: options?.forceProfile });
	}

	openExistingWindow(window: ICodeWindow, openConfig: IOpenConfiguration): void {

		// Bring window to front
		window.focus();

		// Handle `<app> --wait`
		this.handleWaitMarkerFile(openConfig, [window]);

		// Handle `<app> chat`
		this.handleChatRequest(openConfig, [window]);
	}

	async open(openConfig: IOpenConfiguration): Promise<ICodeWindow[]> {
		this.logService.trace('windowsManager#open');

		// Make sure addMode/removeMode is only enabled if we have an active window
		if ((openConfig.addMode || openConfig.removeMode) && (openConfig.initialStartup || !this.getLastActiveWindow())) {
			openConfig.addMode = false;
			openConfig.removeMode = false;
		}

		const foldersToAdd: ISingleFolderWorkspacePathToOpen[] = [];
		const foldersToRemove: ISingleFolderWorkspacePathToOpen[] = [];

		const foldersToOpen: ISingleFolderWorkspacePathToOpen[] = [];

		const workspacesToOpen: IWorkspacePathToOpen[] = [];
		const untitledWorkspacesToRestore: IWorkspacePathToOpen[] = [];

		const emptyWindowsWithBackupsToRestore: IEmptyWindowBackupInfo[] = [];

		let filesToOpen: IFilesToOpen | undefined;
		let maybeOpenEmptyWindow = false;

		// Identify things to open from open config
		const pathsToOpen = await this.getPathsToOpen(openConfig);
		this.logService.trace('windowsManager#open pathsToOpen', pathsToOpen);
		for (const path of pathsToOpen) {
			if (isSingleFolderWorkspacePathToOpen(path)) {
				if (openConfig.addMode) {
					// When run with --add, take the folders that are to be opened as
					// folders that should be added to the currently active window.
					foldersToAdd.push(path);
				} else if (openConfig.removeMode) {
					// When run with --remove, take the folders that are to be opened as
					// folders that should be removed from the currently active window.
					foldersToRemove.push(path);
				} else {
					foldersToOpen.push(path);
				}
			} else if (isWorkspacePathToOpen(path)) {
				workspacesToOpen.push(path);
			} else if (path.fileUri) {
				if (!filesToOpen) {
					filesToOpen = { filesToOpenOrCreate: [], filesToDiff: [], filesToMerge: [], remoteAuthority: path.remoteAuthority };
				}
				filesToOpen.filesToOpenOrCreate.push(path);
			} else if (path.backupPath) {
				emptyWindowsWithBackupsToRestore.push({ backupFolder: basename(path.backupPath), remoteAuthority: path.remoteAuthority });
			} else {
				maybeOpenEmptyWindow = true; // depends on other parameters such as `forceEmpty` and how many windows have opened already
			}
		}

		// When run with --diff, take the first 2 files to open as files to diff
		if (openConfig.diffMode && filesToOpen && filesToOpen.filesToOpenOrCreate.length >= 2) {
			filesToOpen.filesToDiff = filesToOpen.filesToOpenOrCreate.slice(0, 2);
			filesToOpen.filesToOpenOrCreate = [];
		}

		// When run with --merge, take the first 4 files to open as files to merge
		if (openConfig.mergeMode && filesToOpen && filesToOpen.filesToOpenOrCreate.length === 4) {
			filesToOpen.filesToMerge = filesToOpen.filesToOpenOrCreate.slice(0, 4);
			filesToOpen.filesToOpenOrCreate = [];
			filesToOpen.filesToDiff = [];
		}

		// When run with --wait, make sure we keep the paths to wait for
		if (filesToOpen && openConfig.waitMarkerFileURI) {
			filesToOpen.filesToWait = { paths: coalesce([...filesToOpen.filesToDiff, filesToOpen.filesToMerge[3] /* [3] is the resulting merge file */, ...filesToOpen.filesToOpenOrCreate]), waitMarkerFileUri: openConfig.waitMarkerFileURI };
		}

		// These are windows to restore because of hot-exit or from previous session (only performed once on startup!)
		if (openConfig.initialStartup) {

			// Untitled workspaces are always restored
			untitledWorkspacesToRestore.push(...this.workspacesManagementMainService.getUntitledWorkspaces());
			workspacesToOpen.push(...untitledWorkspacesToRestore);

			// Empty windows with backups are always restored
			emptyWindowsWithBackupsToRestore.push(...this.backupMainService.getEmptyWindowBackups());
		} else {
			emptyWindowsWithBackupsToRestore.length = 0;
		}

		// Open based on config
		const { windows: usedWindows, filesOpenedInWindow } = await this.doOpen(openConfig, workspacesToOpen, foldersToOpen, emptyWindowsWithBackupsToRestore, maybeOpenEmptyWindow, filesToOpen, foldersToAdd, foldersToRemove);

		this.logService.trace(`windowsManager#open used window count ${usedWindows.length} (workspacesToOpen: ${workspacesToOpen.length}, foldersToOpen: ${foldersToOpen.length}, emptyToRestore: ${emptyWindowsWithBackupsToRestore.length}, maybeOpenEmptyWindow: ${maybeOpenEmptyWindow})`);

		// Make sure to pass focus to the most relevant of the windows if we open multiple
		if (usedWindows.length > 1) {

			// 1.) focus window we opened files in always with highest priority
			if (filesOpenedInWindow) {
				filesOpenedInWindow.focus();
			}

			// Otherwise, find a good window based on open params
			else {
				const focusLastActive = this.windowsStateHandler.state.lastActiveWindow && !openConfig.forceEmpty && !openConfig.cli._.length && !openConfig.cli['file-uri'] && !openConfig.cli['folder-uri'] && !openConfig.urisToOpen?.length;
				let focusLastOpened = true;
				let focusLastWindow = true;

				// 2.) focus last active window if we are not instructed to open any paths
				if (focusLastActive) {
					const lastActiveWindow = usedWindows.filter(window => this.windowsStateHandler.state.lastActiveWindow && window.backupPath === this.windowsStateHandler.state.lastActiveWindow.backupPath);
					if (lastActiveWindow.length) {
						lastActiveWindow[0].focus();
						focusLastOpened = false;
						focusLastWindow = false;
					}
				}

				// 3.) if instructed to open paths, focus last window which is not restored
				if (focusLastOpened) {
					for (let i = usedWindows.length - 1; i >= 0; i--) {
						const usedWindow = usedWindows[i];
						if (
							(usedWindow.openedWorkspace && untitledWorkspacesToRestore.some(workspace => usedWindow.openedWorkspace && workspace.workspace.id === usedWindow.openedWorkspace.id)) ||	// skip over restored workspace
							(usedWindow.backupPath && emptyWindowsWithBackupsToRestore.some(empty => usedWindow.backupPath && empty.backupFolder === basename(usedWindow.backupPath)))							// skip over restored empty window
						) {
							continue;
						}

						usedWindow.focus();
						focusLastWindow = false;
						break;
					}
				}

				// 4.) finally, always ensure to have at least last used window focused
				if (focusLastWindow) {
					usedWindows[usedWindows.length - 1].focus();
				}
			}
		}

		// Remember in recent document list (unless this opens for extension development)
		// Also do not add paths when files are opened for diffing or merging, only if opened individually
		const isDiff = filesToOpen && filesToOpen.filesToDiff.length > 0;
		const isMerge = filesToOpen && filesToOpen.filesToMerge.length > 0;
		if (!usedWindows.some(window => window.isExtensionDevelopmentHost) && !isDiff && !isMerge && !openConfig.noRecentEntry) {
			const recents: IRecent[] = [];
			for (const pathToOpen of pathsToOpen) {
				if (isWorkspacePathToOpen(pathToOpen) && !pathToOpen.transient /* never add transient workspaces to history */) {
					recents.push({ label: pathToOpen.label, workspace: pathToOpen.workspace, remoteAuthority: pathToOpen.remoteAuthority });
				} else if (isSingleFolderWorkspacePathToOpen(pathToOpen)) {
					recents.push({ label: pathToOpen.label, folderUri: pathToOpen.workspace.uri, remoteAuthority: pathToOpen.remoteAuthority });
				} else if (pathToOpen.fileUri) {
					recents.push({ label: pathToOpen.label, fileUri: pathToOpen.fileUri, remoteAuthority: pathToOpen.remoteAuthority });
				}
			}

			this.workspacesHistoryMainService.addRecentlyOpened(recents);
		}

		// Handle `<app> --wait`
		this.handleWaitMarkerFile(openConfig, usedWindows);

		// Handle `<app> chat`
		this.handleChatRequest(openConfig, usedWindows);

		return usedWindows;
	}

	private handleWaitMarkerFile(openConfig: IOpenConfiguration, usedWindows: ICodeWindow[]): void {

		// If we got started with --wait from the CLI, we need to signal to the outside when the window
		// used for the edit operation is closed or loaded to a different folder so that the waiting
		// process can continue. We do this by deleting the waitMarkerFilePath.
		const waitMarkerFileURI = openConfig.waitMarkerFileURI;
		if (openConfig.context === OpenContext.CLI && waitMarkerFileURI && usedWindows.length === 1 && usedWindows[0]) {
			(async () => {
				await usedWindows[0].whenClosedOrLoaded;

				try {
					await this.fileService.del(waitMarkerFileURI);
				} catch (error) {
					// ignore - could have been deleted from the window already
				}
			})();
		}
	}

	private handleChatRequest(openConfig: IOpenConfiguration, usedWindows: ICodeWindow[]): void {
		if (openConfig.context !== OpenContext.CLI || !openConfig.cli.chat || usedWindows.length === 0) {
			return;
		}

		let windowHandlingChatRequest: ICodeWindow | undefined;
		if (usedWindows.length === 1) {
			windowHandlingChatRequest = usedWindows[0];
		} else {
			const chatRequestFolder = openConfig.cli._[0]; // chat request gets cwd() as folder to open
			if (chatRequestFolder) {
				windowHandlingChatRequest = findWindowOnWorkspaceOrFolder(usedWindows, URI.file(chatRequestFolder));
			}
		}

		if (windowHandlingChatRequest) {
			windowHandlingChatRequest.sendWhenReady('vscode:handleChatRequest', CancellationToken.None, openConfig.cli.chat);
			windowHandlingChatRequest.focus();
		}
	}

	private async doOpen(
		openConfig: IOpenConfiguration,
		workspacesToOpen: IWorkspacePathToOpen[],
		foldersToOpen: ISingleFolderWorkspacePathToOpen[],
		emptyToRestore: IEmptyWindowBackupInfo[],
		maybeOpenEmptyWindow: boolean,
		filesToOpen: IFilesToOpen | undefined,
		foldersToAdd: ISingleFolderWorkspacePathToOpen[],
		foldersToRemove: ISingleFolderWorkspacePathToOpen[]
	): Promise<{ windows: ICodeWindow[]; filesOpenedInWindow: ICodeWindow | undefined }> {

		// Keep track of used windows and remember
		// if files have been opened in one of them
		const usedWindows: ICodeWindow[] = [];
		let filesOpenedInWindow: ICodeWindow | undefined = undefined;
		function addUsedWindow(window: ICodeWindow, openedFiles?: boolean): void {
			usedWindows.push(window);

			if (openedFiles) {
				filesOpenedInWindow = window;
				filesToOpen = undefined; // reset `filesToOpen` since files have been opened
			}
		}

		// Settings can decide if files/folders open in new window or not
		let { openFolderInNewWindow, openFilesInNewWindow } = this.shouldOpenNewWindow(openConfig);

		// Handle folders to add/remove by looking for the last active workspace (not on initial startup)
		if (!openConfig.initialStartup && (foldersToAdd.length > 0 || foldersToRemove.length > 0)) {
			const authority = foldersToAdd.at(0)?.remoteAuthority ?? foldersToRemove.at(0)?.remoteAuthority;
			const lastActiveWindow = this.getLastActiveWindowForAuthority(authority);
			if (lastActiveWindow) {
				addUsedWindow(this.doAddRemoveFoldersInExistingWindow(lastActiveWindow, foldersToAdd.map(folderToAdd => folderToAdd.workspace.uri), foldersToRemove.map(folderToRemove => folderToRemove.workspace.uri)));
			}
		}

		// Handle files to open/diff/merge or to create when we dont open a folder and we do not restore any
		// folder/untitled from hot-exit by trying to open them in the window that fits best
		const potentialNewWindowsCount = foldersToOpen.length + workspacesToOpen.length + emptyToRestore.length;
		if (filesToOpen && potentialNewWindowsCount === 0) {

			// Find suitable window or folder path to open files in
			const fileToCheck: IPath<IEditorOptions> | undefined = filesToOpen.filesToOpenOrCreate[0] || filesToOpen.filesToDiff[0] || filesToOpen.filesToMerge[3] /* [3] is the resulting merge file */;

			// only look at the windows with correct authority
			const windows = this.getWindows().filter(window => filesToOpen && isEqualAuthority(window.remoteAuthority, filesToOpen.remoteAuthority));

			// figure out a good window to open the files in if any
			// with a fallback to the last active window.
			//
			// in case `openFilesInNewWindow` is enforced, we skip
			// this step.
			let windowToUseForFiles: ICodeWindow | undefined = undefined;
			if (fileToCheck?.fileUri && !openFilesInNewWindow) {
				if (openConfig.context === OpenContext.DESKTOP || openConfig.context === OpenContext.CLI || openConfig.context === OpenContext.DOCK || openConfig.context === OpenContext.LINK) {
					windowToUseForFiles = await findWindowOnFile(windows, fileToCheck.fileUri, async workspace => workspace.configPath.scheme === Schemas.file ? this.workspacesManagementMainService.resolveLocalWorkspace(workspace.configPath) : undefined);
				}

				if (!windowToUseForFiles) {
					windowToUseForFiles = this.doGetLastActiveWindow(windows);
				}
			}

			// We found a window to open the files in
			if (windowToUseForFiles) {

				// Window is workspace
				if (isWorkspaceIdentifier(windowToUseForFiles.openedWorkspace)) {
					workspacesToOpen.push({ workspace: windowToUseForFiles.openedWorkspace, remoteAuthority: windowToUseForFiles.remoteAuthority });
				}

				// Window is single folder
				else if (isSingleFolderWorkspaceIdentifier(windowToUseForFiles.openedWorkspace)) {
					foldersToOpen.push({ workspace: windowToUseForFiles.openedWorkspace, remoteAuthority: windowToUseForFiles.remoteAuthority });
				}

				// Window is empty
				else {
					addUsedWindow(this.doOpenFilesInExistingWindow(openConfig, windowToUseForFiles, filesToOpen), true);
				}
			}

			// Finally, if no window or folder is found, just open the files in an empty window
			else {
				addUsedWindow(await this.openInBrowserWindow({
					userEnv: openConfig.userEnv,
					cli: openConfig.cli,
					initialStartup: openConfig.initialStartup,
					filesToOpen,
					forceNewWindow: true,
					remoteAuthority: filesToOpen.remoteAuthority,
					forceNewTabbedWindow: openConfig.forceNewTabbedWindow,
					forceProfile: openConfig.forceProfile,
					forceTempProfile: openConfig.forceTempProfile
				}), true);
			}
		}

		// Handle workspaces to open (instructed and to restore)
		const allWorkspacesToOpen = distinct(workspacesToOpen, workspace => workspace.workspace.id); // prevent duplicates
		if (allWorkspacesToOpen.length > 0) {

			// Check for existing instances
			const windowsOnWorkspace = coalesce(allWorkspacesToOpen.map(workspaceToOpen => findWindowOnWorkspaceOrFolder(this.getWindows(), workspaceToOpen.workspace.configPath)));
			if (windowsOnWorkspace.length > 0) {
				const windowOnWorkspace = windowsOnWorkspace[0];
				const filesToOpenInWindow = isEqualAuthority(filesToOpen?.remoteAuthority, windowOnWorkspace.remoteAuthority) ? filesToOpen : undefined;

				// Do open files
				addUsedWindow(this.doOpenFilesInExistingWindow(openConfig, windowOnWorkspace, filesToOpenInWindow), !!filesToOpenInWindow);

				openFolderInNewWindow = true; // any other folders to open must open in new window then
			}

			// Open remaining ones
			for (const workspaceToOpen of allWorkspacesToOpen) {
				if (windowsOnWorkspace.some(window => window.openedWorkspace && window.openedWorkspace.id === workspaceToOpen.workspace.id)) {
					continue; // ignore folders that are already open
				}

				const remoteAuthority = workspaceToOpen.remoteAuthority;
				const filesToOpenInWindow = isEqualAuthority(filesToOpen?.remoteAuthority, remoteAuthority) ? filesToOpen : undefined;

				// Do open folder
				addUsedWindow(await this.doOpenFolderOrWorkspace(openConfig, workspaceToOpen, openFolderInNewWindow, filesToOpenInWindow), !!filesToOpenInWindow);

				openFolderInNewWindow = true; // any other folders to open must open in new window then
			}
		}

		// Handle folders to open (instructed and to restore)
		const allFoldersToOpen = distinct(foldersToOpen, folder => extUriBiasedIgnorePathCase.getComparisonKey(folder.workspace.uri)); // prevent duplicates
		if (allFoldersToOpen.length > 0) {

			// Check for existing instances
			const windowsOnFolderPath = coalesce(allFoldersToOpen.map(folderToOpen => findWindowOnWorkspaceOrFolder(this.getWindows(), folderToOpen.workspace.uri)));
			if (windowsOnFolderPath.length > 0) {
				const windowOnFolderPath = windowsOnFolderPath[0];
				const filesToOpenInWindow = isEqualAuthority(filesToOpen?.remoteAuthority, windowOnFolderPath.remoteAuthority) ? filesToOpen : undefined;

				// Do open files
				addUsedWindow(this.doOpenFilesInExistingWindow(openConfig, windowOnFolderPath, filesToOpenInWindow), !!filesToOpenInWindow);

				openFolderInNewWindow = true; // any other folders to open must open in new window then
			}

			// Open remaining ones
			for (const folderToOpen of allFoldersToOpen) {
				if (windowsOnFolderPath.some(window => isSingleFolderWorkspaceIdentifier(window.openedWorkspace) && extUriBiasedIgnorePathCase.isEqual(window.openedWorkspace.uri, folderToOpen.workspace.uri))) {
					continue; // ignore folders that are already open
				}

				const remoteAuthority = folderToOpen.remoteAuthority;
				const filesToOpenInWindow = isEqualAuthority(filesToOpen?.remoteAuthority, remoteAuthority) ? filesToOpen : undefined;

				// Do open folder
				addUsedWindow(await this.doOpenFolderOrWorkspace(openConfig, folderToOpen, openFolderInNewWindow, filesToOpenInWindow), !!filesToOpenInWindow);

				openFolderInNewWindow = true; // any other folders to open must open in new window then
			}
		}

		// Handle empty to restore
		const allEmptyToRestore = distinct(emptyToRestore, info => info.backupFolder); // prevent duplicates
		if (allEmptyToRestore.length > 0) {
			for (const emptyWindowBackupInfo of allEmptyToRestore) {
				const remoteAuthority = emptyWindowBackupInfo.remoteAuthority;
				const filesToOpenInWindow = isEqualAuthority(filesToOpen?.remoteAuthority, remoteAuthority) ? filesToOpen : undefined;

				addUsedWindow(await this.doOpenEmpty(openConfig, true, remoteAuthority, filesToOpenInWindow, emptyWindowBackupInfo), !!filesToOpenInWindow);

				openFolderInNewWindow = true; // any other folders to open must open in new window then
			}
		}

		// Finally, open an empty window if
		// - we still have files to open
		// - user forces an empty window (e.g. via command line)
		// - no window has opened yet
		if (filesToOpen || (maybeOpenEmptyWindow && (openConfig.forceEmpty || usedWindows.length === 0))) {
			const remoteAuthority = filesToOpen ? filesToOpen.remoteAuthority : openConfig.remoteAuthority;

			addUsedWindow(await this.doOpenEmpty(openConfig, openFolderInNewWindow, remoteAuthority, filesToOpen), !!filesToOpen);
		}

		return { windows: distinct(usedWindows), filesOpenedInWindow };
	}

	private doOpenFilesInExistingWindow(configuration: IOpenConfiguration, window: ICodeWindow, filesToOpen?: IFilesToOpen): ICodeWindow {
		this.logService.trace('windowsManager#doOpenFilesInExistingWindow', { filesToOpen });

		this.focusMainOrChildWindow(window); // make sure window or any of the children has focus

		const params: INativeOpenFileRequest = {
			filesToOpenOrCreate: filesToOpen?.filesToOpenOrCreate,
			filesToDiff: filesToOpen?.filesToDiff,
			filesToMerge: filesToOpen?.filesToMerge,
			filesToWait: filesToOpen?.filesToWait,
			termProgram: configuration?.userEnv?.['TERM_PROGRAM']
		};
		window.sendWhenReady('vscode:openFiles', CancellationToken.None, params);

		return window;
	}

	private focusMainOrChildWindow(mainWindow: ICodeWindow): void {
		let windowToFocus: ICodeWindow | IAuxiliaryWindow = mainWindow;

		const focusedWindow = BrowserWindow.getFocusedWindow();
		if (focusedWindow && focusedWindow.id !== mainWindow.id) {
			const auxiliaryWindowCandidate = this.auxiliaryWindowsMainService.getWindowByWebContents(focusedWindow.webContents);
			if (auxiliaryWindowCandidate && auxiliaryWindowCandidate.parentId === mainWindow.id) {
				windowToFocus = auxiliaryWindowCandidate;
			}
		}

		windowToFocus.focus();
	}

	private doAddRemoveFoldersInExistingWindow(window: ICodeWindow, foldersToAdd: URI[], foldersToRemove: URI[]): ICodeWindow {
		this.logService.trace('windowsManager#doAddRemoveFoldersToExistingWindow', { foldersToAdd, foldersToRemove });

		window.focus(); // make sure window has focus

		const request: IAddRemoveFoldersRequest = { foldersToAdd, foldersToRemove };
		window.sendWhenReady('vscode:addRemoveFolders', CancellationToken.None, request);

		return window;
	}

	private doOpenEmpty(openConfig: IOpenConfiguration, forceNewWindow: boolean, remoteAuthority: string | undefined, filesToOpen: IFilesToOpen | undefined, emptyWindowBackupInfo?: IEmptyWindowBackupInfo): Promise<ICodeWindow> {
		this.logService.trace('windowsManager#doOpenEmpty', { restore: !!emptyWindowBackupInfo, remoteAuthority, filesToOpen, forceNewWindow });

		let windowToUse: ICodeWindow | undefined;
		if (!forceNewWindow && typeof openConfig.contextWindowId === 'number') {
			windowToUse = this.getWindowById(openConfig.contextWindowId); // fix for https://github.com/microsoft/vscode/issues/97172
		}

		return this.openInBrowserWindow({
			userEnv: openConfig.userEnv,
			cli: openConfig.cli,
			initialStartup: openConfig.initialStartup,
			remoteAuthority,
			forceNewWindow,
			forceNewTabbedWindow: openConfig.forceNewTabbedWindow,
			filesToOpen,
			windowToUse,
			emptyWindowBackupInfo,
			forceProfile: openConfig.forceProfile,
			forceTempProfile: openConfig.forceTempProfile
		});
	}

	private doOpenFolderOrWorkspace(openConfig: IOpenConfiguration, folderOrWorkspace: IWorkspacePathToOpen | ISingleFolderWorkspacePathToOpen, forceNewWindow: boolean, filesToOpen: IFilesToOpen | undefined, windowToUse?: ICodeWindow): Promise<ICodeWindow> {
		this.logService.trace('windowsManager#doOpenFolderOrWorkspace', { folderOrWorkspace, filesToOpen });

		if (!forceNewWindow && !windowToUse && typeof openConfig.contextWindowId === 'number') {
			windowToUse = this.getWindowById(openConfig.contextWindowId); // fix for https://github.com/microsoft/vscode/issues/49587
		}

		return this.openInBrowserWindow({
			workspace: folderOrWorkspace.workspace,
			userEnv: openConfig.userEnv,
			cli: openConfig.cli,
			initialStartup: openConfig.initialStartup,
			remoteAuthority: folderOrWorkspace.remoteAuthority,
			forceNewWindow,
			forceNewTabbedWindow: openConfig.forceNewTabbedWindow,
			filesToOpen,
			windowToUse,
			forceProfile: openConfig.forceProfile,
			forceTempProfile: openConfig.forceTempProfile
		});
	}

	private async getPathsToOpen(openConfig: IOpenConfiguration): Promise<IPathToOpen[]> {
		let pathsToOpen: IPathToOpen[];
		let isCommandLineOrAPICall = false;
		let isRestoringPaths = false;

		// Extract paths: from API
		if (openConfig.urisToOpen && openConfig.urisToOpen.length > 0) {
			pathsToOpen = await this.doExtractPathsFromAPI(openConfig);
			isCommandLineOrAPICall = true;
		}

		// Check for force empty
		else if (openConfig.forceEmpty) {
			pathsToOpen = [EMPTY_WINDOW];
		}

		// Extract paths: from CLI
		else if (openConfig.cli._.length || openConfig.cli['folder-uri'] || openConfig.cli['file-uri']) {
			pathsToOpen = await this.doExtractPathsFromCLI(openConfig.cli);
			if (pathsToOpen.length === 0) {
				pathsToOpen.push(EMPTY_WINDOW); // add an empty window if we did not have windows to open from command line
			}

			isCommandLineOrAPICall = true;
		}

		// Extract paths: from previous session
		else {
			pathsToOpen = await this.doGetPathsFromLastSession();
			if (pathsToOpen.length === 0) {
				pathsToOpen.push(EMPTY_WINDOW); // add an empty window if we did not have windows to restore
			}

			isRestoringPaths = true;
		}

		// Handle the case of multiple folders being opened from CLI while we are
		// not in `--add` or `--remove` mode by creating an untitled workspace, only if:
		// - they all share the same remote authority
		// - there is no existing workspace to open that matches these folders
		if (!openConfig.addMode && !openConfig.removeMode && isCommandLineOrAPICall) {
			const foldersToOpen = pathsToOpen.filter(path => isSingleFolderWorkspacePathToOpen(path));
			if (foldersToOpen.length > 1) {
				const remoteAuthority = foldersToOpen[0].remoteAuthority;
				if (foldersToOpen.every(folderToOpen => isEqualAuthority(folderToOpen.remoteAuthority, remoteAuthority))) {
					let workspace: IWorkspaceIdentifier | undefined;

					const lastSessionWorkspaceMatchingFolders = await this.doGetWorkspaceMatchingFoldersFromLastSession(remoteAuthority, foldersToOpen);
					if (lastSessionWorkspaceMatchingFolders) {
						workspace = lastSessionWorkspaceMatchingFolders;
					} else {
						workspace = await this.workspacesManagementMainService.createUntitledWorkspace(foldersToOpen.map(folder => ({ uri: folder.workspace.uri })));
					}

					// Add workspace and remove folders thereby
					pathsToOpen.push({ workspace, remoteAuthority });
					pathsToOpen = pathsToOpen.filter(path => !isSingleFolderWorkspacePathToOpen(path));
				}
			}
		}

		// Check for `window.restoreWindows` setting to include all windows
		// from the previous session if this is the initial startup and we have
		// not restored windows already otherwise.
		// Use `unshift` to ensure any new window to open comes last for proper
		// focus treatment.
		if (openConfig.initialStartup && !isRestoringPaths && this.configurationService.getValue<IWindowSettings | undefined>('window')?.restoreWindows === 'preserve') {
			const lastSessionPaths = await this.doGetPathsFromLastSession();
			pathsToOpen.unshift(...lastSessionPaths.filter(path => isWorkspacePathToOpen(path) || isSingleFolderWorkspacePathToOpen(path) || path.backupPath));
		}

		return pathsToOpen;
	}

	private async doExtractPathsFromAPI(openConfig: IOpenConfiguration): Promise<IPathToOpen[]> {
		const pathResolveOptions: IPathResolveOptions = {
			gotoLineMode: openConfig.gotoLineMode,
			remoteAuthority: openConfig.remoteAuthority
		};

		const pathsToOpen = await Promise.all(coalesce(openConfig.urisToOpen || []).map(async pathToOpen => {
			const path = await this.resolveOpenable(pathToOpen, pathResolveOptions);

			// Path exists
			if (path) {
				path.label = pathToOpen.label;

				return path;
			}

			// Path does not exist: show a warning box
			const uri = this.resourceFromOpenable(pathToOpen);

			this.dialogMainService.showMessageBox({
				type: 'info',
				buttons: [localize({ key: 'ok', comment: ['&& denotes a mnemonic'] }, "&&OK")],
				message: uri.scheme === Schemas.file ? localize('pathNotExistTitle', "Path does not exist") : localize('uriInvalidTitle', "URI can not be opened"),
				detail: uri.scheme === Schemas.file ?
					localize('pathNotExistDetail', "The path '{0}' does not exist on this computer.", getPathLabel(uri, { os: OS, tildify: this.environmentMainService })) :
					localize('uriInvalidDetail', "The URI '{0}' is not valid and can not be opened.", uri.toString(true))
			}, BrowserWindow.getFocusedWindow() ?? undefined);

			return undefined;
		}));

		return coalesce(pathsToOpen);
	}

	private async doExtractPathsFromCLI(cli: NativeParsedArgs): Promise<IPath[]> {
		const pathsToOpen: IPathToOpen[] = [];
		const pathResolveOptions: IPathResolveOptions = {
			ignoreFileNotFound: true,
			gotoLineMode: cli.goto,
			remoteAuthority: cli.remote || undefined,
			forceOpenWorkspaceAsFile:
				// special case diff / merge mode to force open
				// workspace as file
				// https://github.com/microsoft/vscode/issues/149731
				cli.diff && cli._.length === 2 ||
				cli.merge && cli._.length === 4
		};

		// folder uris
		const folderUris = cli['folder-uri'];
		if (folderUris) {
			const resolvedFolderUris = await Promise.all(folderUris.map(rawFolderUri => {
				const folderUri = this.cliArgToUri(rawFolderUri);
				if (!folderUri) {
					return undefined;
				}

				return this.resolveOpenable({ folderUri }, pathResolveOptions);
			}));

			pathsToOpen.push(...coalesce(resolvedFolderUris));
		}

		// file uris
		const fileUris = cli['file-uri'];
		if (fileUris) {
			const resolvedFileUris = await Promise.all(fileUris.map(rawFileUri => {
				const fileUri = this.cliArgToUri(rawFileUri);
				if (!fileUri) {
					return undefined;
				}

				return this.resolveOpenable(hasWorkspaceFileExtension(rawFileUri) ? { workspaceUri: fileUri } : { fileUri }, pathResolveOptions);
			}));

			pathsToOpen.push(...coalesce(resolvedFileUris));
		}

		// folder or file paths
		const resolvedCliPaths = await Promise.all(cli._.map(cliPath => {
			return pathResolveOptions.remoteAuthority ? this.doResolveRemotePath(cliPath, pathResolveOptions) : this.doResolveFilePath(cliPath, pathResolveOptions);
		}));

		pathsToOpen.push(...coalesce(resolvedCliPaths));

		return pathsToOpen;
	}

	private cliArgToUri(arg: string): URI | undefined {
		try {
			const uri = URI.parse(arg);
			if (!uri.scheme) {
				this.logService.error(`Invalid URI input string, scheme missing: ${arg}`);

				return undefined;
			}
			if (!uri.path) {
				return uri.with({ path: '/' });
			}

			return uri;
		} catch (e) {
			this.logService.error(`Invalid URI input string: ${arg}, ${e.message}`);
		}

		return undefined;
	}

	private async doGetPathsFromLastSession(): Promise<IPathToOpen[]> {
		const restoreWindowsSetting = this.getRestoreWindowsSetting();

		switch (restoreWindowsSetting) {

			// none: no window to restore
			case 'none':
				return [];

			// one: restore last opened workspace/folder or empty window
			// all: restore all windows
			// folders: restore last opened folders only
			case 'one':
			case 'all':
			case 'preserve':
			case 'folders': {

				// Collect previously opened windows
				const lastSessionWindows: IWindowState[] = [];
				if (restoreWindowsSetting !== 'one') {
					lastSessionWindows.push(...this.windowsStateHandler.state.openedWindows);
				}
				if (this.windowsStateHandler.state.lastActiveWindow) {
					lastSessionWindows.push(this.windowsStateHandler.state.lastActiveWindow);
				}

				const pathsToOpen = await Promise.all(lastSessionWindows.map(async lastSessionWindow => {

					// Workspaces
					if (lastSessionWindow.workspace) {
						const pathToOpen = await this.resolveOpenable({ workspaceUri: lastSessionWindow.workspace.configPath }, { remoteAuthority: lastSessionWindow.remoteAuthority, rejectTransientWorkspaces: true /* https://github.com/microsoft/vscode/issues/119695 */ });
						if (isWorkspacePathToOpen(pathToOpen)) {
							return pathToOpen;
						}
					}

					// Folders
					else if (lastSessionWindow.folderUri) {
						const pathToOpen = await this.resolveOpenable({ folderUri: lastSessionWindow.folderUri }, { remoteAuthority: lastSessionWindow.remoteAuthority });
						if (isSingleFolderWorkspacePathToOpen(pathToOpen)) {
							return pathToOpen;
						}
					}

					// Empty window, potentially editors open to be restored
					else if (restoreWindowsSetting !== 'folders' && lastSessionWindow.backupPath) {
						return { backupPath: lastSessionWindow.backupPath, remoteAuthority: lastSessionWindow.remoteAuthority };
					}

					return undefined;
				}));

				return coalesce(pathsToOpen);
			}
		}
	}

	private getRestoreWindowsSetting(): RestoreWindowsSetting {
		let restoreWindows: RestoreWindowsSetting;
		if (this.lifecycleMainService.wasRestarted) {
			restoreWindows = 'all'; // always reopen all windows when an update was applied
		} else {
			const windowConfig = this.configurationService.getValue<IWindowSettings | undefined>('window');
			restoreWindows = windowConfig?.restoreWindows || 'all'; // by default restore all windows

			if (!['preserve', 'all', 'folders', 'one', 'none'].includes(restoreWindows)) {
				restoreWindows = 'all'; // by default restore all windows
			}
		}

		return restoreWindows;
	}

	private async doGetWorkspaceMatchingFoldersFromLastSession(remoteAuthority: string | undefined, folders: ISingleFolderWorkspacePathToOpen[]): Promise<IWorkspaceIdentifier | undefined> {
		const workspaces = (await this.doGetPathsFromLastSession()).filter(path => isWorkspacePathToOpen(path));
		const folderUris = folders.map(folder => folder.workspace.uri);

		for (const { workspace } of workspaces) {
			const resolvedWorkspace = await this.workspacesManagementMainService.resolveLocalWorkspace(workspace.configPath);
			if (
				!resolvedWorkspace ||
				resolvedWorkspace.remoteAuthority !== remoteAuthority ||
				resolvedWorkspace.transient ||
				resolvedWorkspace.folders.length !== folders.length
			) {
				continue;
			}

			const folderSet = new ResourceSet(folderUris, uri => extUriBiasedIgnorePathCase.getComparisonKey(uri));
			if (resolvedWorkspace.folders.every(folder => folderSet.has(folder.uri))) {
				return resolvedWorkspace;
			}
		}

		return undefined;
	}

	private async resolveOpenable(openable: IWindowOpenable, options: IPathResolveOptions = Object.create(null)): Promise<IPathToOpen | undefined> {

		// handle file:// openables with some extra validation
		const uri = this.resourceFromOpenable(openable);
		if (uri.scheme === Schemas.file) {
			if (isFileToOpen(openable)) {
				options = { ...options, forceOpenWorkspaceAsFile: true };
			}

			return this.doResolveFilePath(uri.fsPath, options);
		}

		// handle non file:// openables
		return this.doResolveRemoteOpenable(openable, options);
	}

	private doResolveRemoteOpenable(openable: IWindowOpenable, options: IPathResolveOptions): IPathToOpen<ITextEditorOptions> | undefined {
		let uri = this.resourceFromOpenable(openable);

		// use remote authority from vscode
		const remoteAuthority = getRemoteAuthority(uri) || options.remoteAuthority;

		// normalize URI
		uri = removeTrailingPathSeparator(normalizePath(uri));

		// File
		if (isFileToOpen(openable)) {
			if (options.gotoLineMode) {
				const { path, line, column } = parseLineAndColumnAware(uri.path);

				return {
					fileUri: uri.with({ path }),
					options: {
						selection: line ? { startLineNumber: line, startColumn: column || 1 } : undefined
					},
					remoteAuthority
				};
			}

			return { fileUri: uri, remoteAuthority };
		}

		// Workspace
		else if (isWorkspaceToOpen(openable)) {
			return { workspace: getWorkspaceIdentifier(uri), remoteAuthority };
		}

		// Folder
		return { workspace: getSingleFolderWorkspaceIdentifier(uri), remoteAuthority };
	}

	private resourceFromOpenable(openable: IWindowOpenable): URI {
		if (isWorkspaceToOpen(openable)) {
			return openable.workspaceUri;
		}

		if (isFolderToOpen(openable)) {
			return openable.folderUri;
		}

		return openable.fileUri;
	}

	private async doResolveFilePath(path: string, options: IPathResolveOptions, skipHandleUNCError?: boolean): Promise<IPathToOpen<ITextEditorOptions> | undefined> {

		// Extract line/col information from path
		let lineNumber: number | undefined;
		let columnNumber: number | undefined;
		if (options.gotoLineMode) {
			({ path, line: lineNumber, column: columnNumber } = parseLineAndColumnAware(path));
		}

		// Ensure the path is normalized and absolute
		path = sanitizeFilePath(normalize(path), cwd());

		try {
			const pathStat = await fs.promises.stat(path);

			// File
			if (pathStat.isFile()) {

				// Workspace (unless disabled via flag)
				if (!options.forceOpenWorkspaceAsFile) {
					const workspace = await this.workspacesManagementMainService.resolveLocalWorkspace(URI.file(path));
					if (workspace) {

						// If the workspace is transient and we are to ignore
						// transient workspaces, reject it.
						if (workspace.transient && options.rejectTransientWorkspaces) {
							return undefined;
						}

						return {
							workspace: { id: workspace.id, configPath: workspace.configPath },
							type: FileType.File,
							exists: true,
							remoteAuthority: workspace.remoteAuthority,
							transient: workspace.transient
						};
					}
				}

				return {
					fileUri: URI.file(path),
					type: FileType.File,
					exists: true,
					options: {
						selection: lineNumber ? { startLineNumber: lineNumber, startColumn: columnNumber || 1 } : undefined
					}
				};
			}

			// Folder
			else if (pathStat.isDirectory()) {
				return {
					workspace: getSingleFolderWorkspaceIdentifier(URI.file(path), pathStat),
					type: FileType.Directory,
					exists: true
				};
			}

			// Special device: in POSIX environments, we may get /dev/null passed
			// in (for example git uses it to signal one side of a diff does not
			// exist). In that special case, treat it like a file to support this
			// scenario ()
			else if (!isWindows && path === '/dev/null') {
				return {
					fileUri: URI.file(path),
					type: FileType.File,
					exists: true
				};
			}
		} catch (error) {

			if (error.code === 'ERR_UNC_HOST_NOT_ALLOWED' && !skipHandleUNCError) {
				return this.onUNCHostNotAllowed(path, options);
			}

			const fileUri = URI.file(path);

			// since file does not seem to exist anymore, remove from recent
			this.workspacesHistoryMainService.removeRecentlyOpened([fileUri]);

			// assume this is a file that does not yet exist
			if (options.ignoreFileNotFound && error.code === 'ENOENT') {
				return {
					fileUri,
					type: FileType.File,
					exists: false
				};
			}

			this.logService.error(`Invalid path provided: ${path}, ${error.message}`);
		}

		return undefined;
	}

	private async onUNCHostNotAllowed(path: string, options: IPathResolveOptions): Promise<IPathToOpen<ITextEditorOptions> | undefined> {
		const uri = URI.file(path);

		const { response, checkboxChecked } = await this.dialogMainService.showMessageBox({
			type: 'warning',
			buttons: [
				localize({ key: 'allow', comment: ['&& denotes a mnemonic'] }, "&&Allow"),
				localize({ key: 'cancel', comment: ['&& denotes a mnemonic'] }, "&&Cancel"),
				localize({ key: 'learnMore', comment: ['&& denotes a mnemonic'] }, "&&Learn More"),
			],
			message: localize('confirmOpenMessage', "The host '{0}' was not found in the list of allowed hosts. Do you want to allow it anyway?", uri.authority),
			detail: localize('confirmOpenDetail', "The path '{0}' uses a host that is not allowed. Unless you trust the host, you should press 'Cancel'", getPathLabel(uri, { os: OS, tildify: this.environmentMainService })),
			checkboxLabel: localize('doNotAskAgain', "Permanently allow host '{0}'", uri.authority),
			cancelId: 1
		});

		if (response === 0) {
			addUNCHostToAllowlist(uri.authority);

			if (checkboxChecked) {
				// Due to https://github.com/microsoft/vscode/issues/195436, we can only
				// update settings from within a window. But we do not know if a window
				// is about to open or can already handle the request, so we have to send
				// to any current window and any newly opening window.
				const request = { channel: 'vscode:configureAllowedUNCHost', args: uri.authority };
				this.sendToFocused(request.channel, request.args);
				this.sendToOpeningWindow(request.channel, request.args);
			}

			return this.doResolveFilePath(path, options, true /* do not handle UNC error again */);
		}

		if (response === 2) {
			shell.openExternal('https://aka.ms/vscode-windows-unc');

			return this.onUNCHostNotAllowed(path, options); // keep showing the dialog until decision (https://github.com/microsoft/vscode/issues/181956)
		}

		return undefined;
	}

	private doResolveRemotePath(path: string, options: IPathResolveOptions): IPathToOpen<ITextEditorOptions> | undefined {
		const first = path.charCodeAt(0);
		const remoteAuthority = options.remoteAuthority;

		// Extract line/col information from path
		let lineNumber: number | undefined;
		let columnNumber: number | undefined;

		if (options.gotoLineMode) {
			({ path, line: lineNumber, column: columnNumber } = parseLineAndColumnAware(path));
		}

		// make absolute
		if (first !== CharCode.Slash) {
			if (isWindowsDriveLetter(first) && path.charCodeAt(path.charCodeAt(1)) === CharCode.Colon) {
				path = toSlashes(path);
			}

			path = `/${path}`;
		}

		const uri = URI.from({ scheme: Schemas.vscodeRemote, authority: remoteAuthority, path: path });

		// guess the file type:
		// - if it ends with a slash it's a folder
		// - if in goto line mode or if it has a file extension, it's a file or a workspace
		// - by defaults it's a folder
		if (path.charCodeAt(path.length - 1) !== CharCode.Slash) {

			// file name ends with .code-workspace
			if (hasWorkspaceFileExtension(path)) {
				if (options.forceOpenWorkspaceAsFile) {
					return {
						fileUri: uri,
						options: {
							selection: lineNumber ? { startLineNumber: lineNumber, startColumn: columnNumber || 1 } : undefined
						},
						remoteAuthority: options.remoteAuthority
					};
				}

				return { workspace: getWorkspaceIdentifier(uri), remoteAuthority };
			}

			// file name starts with a dot or has an file extension
			else if (options.gotoLineMode || posix.basename(path).indexOf('.') !== -1) {
				return {
					fileUri: uri,
					options: {
						selection: lineNumber ? { startLineNumber: lineNumber, startColumn: columnNumber || 1 } : undefined
					},
					remoteAuthority
				};
			}
		}

		return { workspace: getSingleFolderWorkspaceIdentifier(uri), remoteAuthority };
	}

	private shouldOpenNewWindow(openConfig: IOpenConfiguration): { openFolderInNewWindow: boolean; openFilesInNewWindow: boolean } {

		// let the user settings override how folders are open in a new window or same window unless we are forced
		const windowConfig = this.configurationService.getValue<IWindowSettings | undefined>('window');
		const openFolderInNewWindowConfig = windowConfig?.openFoldersInNewWindow || 'default' /* default */;
		const openFilesInNewWindowConfig = windowConfig?.openFilesInNewWindow || 'off' /* default */;

		let openFolderInNewWindow = (openConfig.preferNewWindow || openConfig.forceNewWindow) && !openConfig.forceReuseWindow;
		if (!openConfig.forceNewWindow && !openConfig.forceReuseWindow && (openFolderInNewWindowConfig === 'on' || openFolderInNewWindowConfig === 'off')) {
			openFolderInNewWindow = (openFolderInNewWindowConfig === 'on');
		}

		// let the user settings override how files are open in a new window or same window unless we are forced (not for extension development though)
		let openFilesInNewWindow = false;
		if (openConfig.forceNewWindow || openConfig.forceReuseWindow) {
			openFilesInNewWindow = !!openConfig.forceNewWindow && !openConfig.forceReuseWindow;
		} else {

			// macOS: by default we open files in a new window if this is triggered via DOCK context
			if (isMacintosh) {
				if (openConfig.context === OpenContext.DOCK) {
					openFilesInNewWindow = true;
				}
			}

			// Linux/Windows: by default we open files in the new window unless triggered via DIALOG / MENU context
			// or from the integrated terminal where we assume the user prefers to open in the current window
			else {
				if (openConfig.context !== OpenContext.DIALOG && openConfig.context !== OpenContext.MENU && !(openConfig.userEnv && openConfig.userEnv['TERM_PROGRAM'] === 'vscode')) {
					openFilesInNewWindow = true;
				}
			}

			// finally check for overrides of default
			if (!openConfig.cli.extensionDevelopmentPath && (openFilesInNewWindowConfig === 'on' || openFilesInNewWindowConfig === 'off')) {
				openFilesInNewWindow = (openFilesInNewWindowConfig === 'on');
			}
		}

		return { openFolderInNewWindow: !!openFolderInNewWindow, openFilesInNewWindow };
	}

	async openExtensionDevelopmentHostWindow(extensionDevelopmentPaths: string[], openConfig: IOpenConfiguration): Promise<ICodeWindow[]> {

		// Reload an existing extension development host window on the same path
		// We currently do not allow more than one extension development window
		// on the same extension path.
		const existingWindow = findWindowOnExtensionDevelopmentPath(this.getWindows(), extensionDevelopmentPaths);
		if (existingWindow) {
			this.lifecycleMainService.reload(existingWindow, openConfig.cli);
			existingWindow.focus(); // make sure it gets focus and is restored

			return [existingWindow];
		}

		let folderUris = openConfig.cli['folder-uri'] || [];
		let fileUris = openConfig.cli['file-uri'] || [];
		let cliArgs = openConfig.cli._;

		// Fill in previously opened workspace unless an explicit path is provided and we are not unit testing
		if (!cliArgs.length && !folderUris.length && !fileUris.length && !openConfig.cli.extensionTestsPath) {
			const extensionDevelopmentWindowState = this.windowsStateHandler.state.lastPluginDevelopmentHostWindow;
			const workspaceToOpen = extensionDevelopmentWindowState?.workspace ?? extensionDevelopmentWindowState?.folderUri;
			if (workspaceToOpen) {
				if (URI.isUri(workspaceToOpen)) {
					if (workspaceToOpen.scheme === Schemas.file) {
						cliArgs = [workspaceToOpen.fsPath];
					} else {
						folderUris = [workspaceToOpen.toString()];
					}
				} else {
					if (workspaceToOpen.configPath.scheme === Schemas.file) {
						cliArgs = [originalFSPath(workspaceToOpen.configPath)];
					} else {
						fileUris = [workspaceToOpen.configPath.toString()];
					}
				}
			}
		}

		let remoteAuthority = openConfig.remoteAuthority;
		for (const extensionDevelopmentPath of extensionDevelopmentPaths) {
			if (extensionDevelopmentPath.match(/^[a-zA-Z][a-zA-Z0-9\+\-\.]+:/)) {
				const url = URI.parse(extensionDevelopmentPath);
				const extensionDevelopmentPathRemoteAuthority = getRemoteAuthority(url);
				if (extensionDevelopmentPathRemoteAuthority) {
					if (remoteAuthority) {
						if (!isEqualAuthority(extensionDevelopmentPathRemoteAuthority, remoteAuthority)) {
							this.logService.error('more than one extension development path authority');
						}
					} else {
						remoteAuthority = extensionDevelopmentPathRemoteAuthority;
					}
				}
			}
		}

		// Make sure that we do not try to open:
		// - a workspace or folder that is already opened
		// - a workspace or file that has a different authority as the extension development.

		cliArgs = cliArgs.filter(path => {
			const uri = URI.file(path);
			if (findWindowOnWorkspaceOrFolder(this.getWindows(), uri)) {
				return false;
			}

			return isEqualAuthority(getRemoteAuthority(uri), remoteAuthority);
		});

		folderUris = folderUris.filter(folderUriStr => {
			const folderUri = this.cliArgToUri(folderUriStr);
			if (folderUri && findWindowOnWorkspaceOrFolder(this.getWindows(), folderUri)) {
				return false;
			}

			return folderUri ? isEqualAuthority(getRemoteAuthority(folderUri), remoteAuthority) : false;
		});

		fileUris = fileUris.filter(fileUriStr => {
			const fileUri = this.cliArgToUri(fileUriStr);
			if (fileUri && findWindowOnWorkspaceOrFolder(this.getWindows(), fileUri)) {
				return false;
			}

			return fileUri ? isEqualAuthority(getRemoteAuthority(fileUri), remoteAuthority) : false;
		});

		openConfig.cli._ = cliArgs;
		openConfig.cli['folder-uri'] = folderUris;
		openConfig.cli['file-uri'] = fileUris;

		// Open it
		const openArgs: IOpenConfiguration = {
			context: openConfig.context,
			cli: openConfig.cli,
			forceNewWindow: true,
			forceEmpty: !cliArgs.length && !folderUris.length && !fileUris.length,
			userEnv: openConfig.userEnv,
			noRecentEntry: true,
			waitMarkerFileURI: openConfig.waitMarkerFileURI,
			remoteAuthority,
			forceProfile: openConfig.forceProfile,
			forceTempProfile: openConfig.forceTempProfile
		};

		return this.open(openArgs);
	}

	private async openInBrowserWindow(options: IOpenBrowserWindowOptions): Promise<ICodeWindow> {
		const windowConfig = this.configurationService.getValue<IWindowSettings | undefined>('window');

		const lastActiveWindow = this.getLastActiveWindow();
		const newWindowProfile = windowConfig?.newWindowProfile
			? this.userDataProfilesMainService.profiles.find(profile => profile.name === windowConfig.newWindowProfile) : undefined;
		const defaultProfile = newWindowProfile ?? lastActiveWindow?.profile ?? this.userDataProfilesMainService.defaultProfile;

		let window: ICodeWindow | undefined;
		if (!options.forceNewWindow && !options.forceNewTabbedWindow) {
			window = options.windowToUse || lastActiveWindow;
			if (window) {
				window.focus();
			}
		}

		// Build up the window configuration from provided options, config and environment
		const configuration: INativeWindowConfiguration = {

			// Inherit CLI arguments from environment and/or
			// the specific properties from this launch if provided
			...this.environmentMainService.args,
			...options.cli,

			machineId: this.machineId,
			sqmId: this.sqmId,
			devDeviceId: this.devDeviceId,

			windowId: -1,	// Will be filled in by the window once loaded later

			mainPid: process.pid,

			appRoot: this.environmentMainService.appRoot,
			execPath: process.execPath,
			codeCachePath: this.environmentMainService.codeCachePath,
			// If we know the backup folder upfront (for empty windows to restore), we can set it
			// directly here which helps for restoring UI state associated with that window.
			// For all other cases we first call into registerEmptyWindowBackup() to set it before
			// loading the window.
			backupPath: options.emptyWindowBackupInfo ? join(this.environmentMainService.backupHome, options.emptyWindowBackupInfo.backupFolder) : undefined,

			profiles: {
				home: this.userDataProfilesMainService.profilesHome,
				all: this.userDataProfilesMainService.profiles,
				// Set to default profile first and resolve and update the profile
				// only after the workspace-backup is registered.
				// Because, workspace identifier of an empty window is known only then.
				profile: defaultProfile
			},

			homeDir: this.environmentMainService.userHome.with({ scheme: Schemas.file }).fsPath,
			tmpDir: this.environmentMainService.tmpDir.with({ scheme: Schemas.file }).fsPath,
			userDataDir: this.environmentMainService.userDataPath,

			remoteAuthority: options.remoteAuthority,
			workspace: options.workspace,
			userEnv: { ...this.initialUserEnv, ...options.userEnv },

			nls: {
				messages: getNLSMessages(),
				language: getNLSLanguage()
			},

			filesToOpenOrCreate: options.filesToOpen?.filesToOpenOrCreate,
			filesToDiff: options.filesToOpen?.filesToDiff,
			filesToMerge: options.filesToOpen?.filesToMerge,
			filesToWait: options.filesToOpen?.filesToWait,

			logLevel: this.loggerService.getLogLevel(),
			loggers: this.loggerService.getGlobalLoggers(),
			logsPath: this.environmentMainService.logsHome.with({ scheme: Schemas.file }).fsPath,

			product,
			isInitialStartup: options.initialStartup,
			perfMarks: getMarks(),
			os: { release: release(), hostname: hostname(), arch: arch() },

			autoDetectHighContrast: windowConfig?.autoDetectHighContrast ?? true,
			autoDetectColorScheme: windowConfig?.autoDetectColorScheme ?? false,
			accessibilitySupport: app.accessibilitySupportEnabled,
			colorScheme: this.themeMainService.getColorScheme(),
			policiesData: this.policyService.serialize(),
			continueOn: this.environmentMainService.continueOn,

			cssModules: this.cssDevelopmentService.isEnabled ? await this.cssDevelopmentService.getCssModules() : undefined
		};

		// New window
		if (!window) {
			const state = this.windowsStateHandler.getNewWindowState(configuration);

			// Create the window
			mark('code/willCreateCodeWindow');
			const createdWindow = window = this.instantiationService.createInstance(CodeWindow, {
				state,
				extensionDevelopmentPath: configuration.extensionDevelopmentPath,
				isExtensionTestHost: !!configuration.extensionTestsPath
			});
			mark('code/didCreateCodeWindow');

			// Add as window tab if configured (macOS only)
			if (options.forceNewTabbedWindow) {
				const activeWindow = this.getLastActiveWindow();
				activeWindow?.addTabbedWindow(createdWindow);
			}

			// Add to our list of windows
			this.windows.set(createdWindow.id, createdWindow);

			// Indicate new window via event
			this._onDidOpenWindow.fire(createdWindow);

			// Indicate number change via event
			this._onDidChangeWindowsCount.fire({ oldCount: this.getWindowCount() - 1, newCount: this.getWindowCount() });

			// Window Events
			const disposables = new DisposableStore();
			disposables.add(createdWindow.onDidSignalReady(() => this._onDidSignalReadyWindow.fire(createdWindow)));
			disposables.add(Event.once(createdWindow.onDidClose)(() => this.onWindowClosed(createdWindow, disposables)));
			disposables.add(Event.once(createdWindow.onDidDestroy)(() => this.onWindowDestroyed(createdWindow)));
			disposables.add(createdWindow.onDidMaximize(() => this._onDidMaximizeWindow.fire(createdWindow)));
			disposables.add(createdWindow.onDidUnmaximize(() => this._onDidUnmaximizeWindow.fire(createdWindow)));
			disposables.add(createdWindow.onDidEnterFullScreen(() => this._onDidChangeFullScreen.fire({ window: createdWindow, fullscreen: true })));
			disposables.add(createdWindow.onDidLeaveFullScreen(() => this._onDidChangeFullScreen.fire({ window: createdWindow, fullscreen: false })));
			disposables.add(createdWindow.onDidTriggerSystemContextMenu(({ x, y }) => this._onDidTriggerSystemContextMenu.fire({ window: createdWindow, x, y })));

			const webContents = assertReturnsDefined(createdWindow.win?.webContents);
			webContents.removeAllListeners('devtools-reload-page'); // remove built in listener so we can handle this on our own
			disposables.add(Event.fromNodeEventEmitter(webContents, 'devtools-reload-page')(() => this.lifecycleMainService.reload(createdWindow)));

			// Lifecycle
			this.lifecycleMainService.registerWindow(createdWindow);
		}

		// Existing window
		else {

			// Some configuration things get inherited if the window is being reused and we are
			// in extension development host mode. These options are all development related.
			const currentWindowConfig = window.config;
			if (!configuration.extensionDevelopmentPath && currentWindowConfig?.extensionDevelopmentPath) {
				configuration.extensionDevelopmentPath = currentWindowConfig.extensionDevelopmentPath;
				configuration.extensionDevelopmentKind = currentWindowConfig.extensionDevelopmentKind;
				configuration['enable-proposed-api'] = currentWindowConfig['enable-proposed-api'];
				configuration.verbose = currentWindowConfig.verbose;
				configuration['inspect-extensions'] = currentWindowConfig['inspect-extensions'];
				configuration['inspect-brk-extensions'] = currentWindowConfig['inspect-brk-extensions'];
				configuration.debugId = currentWindowConfig.debugId;
				configuration.extensionEnvironment = currentWindowConfig.extensionEnvironment;
				configuration['extensions-dir'] = currentWindowConfig['extensions-dir'];
				configuration['disable-extensions'] = currentWindowConfig['disable-extensions'];
				configuration['disable-extension'] = currentWindowConfig['disable-extension'];
			}
		}

		// Update window identifier and session now
		// that we have the window object in hand.
		configuration.windowId = window.id;

		// If the window was already loaded, make sure to unload it
		// first and only load the new configuration if that was
		// not vetoed
		if (window.isReady) {
			this.lifecycleMainService.unload(window, UnloadReason.LOAD).then(async veto => {
				if (!veto) {
					await this.doOpenInBrowserWindow(window, configuration, options, defaultProfile);
				}
			});
		} else {
			await this.doOpenInBrowserWindow(window, configuration, options, defaultProfile);
		}

		return window;
	}

	private async doOpenInBrowserWindow(window: ICodeWindow, configuration: INativeWindowConfiguration, options: IOpenBrowserWindowOptions, defaultProfile: IUserDataProfile): Promise<void> {

		// Register window for backups unless the window
		// is for extension development, where we do not
		// keep any backups.

		if (!configuration.extensionDevelopmentPath) {
			if (isWorkspaceIdentifier(configuration.workspace)) {
				configuration.backupPath = this.backupMainService.registerWorkspaceBackup({
					workspace: configuration.workspace,
					remoteAuthority: configuration.remoteAuthority
				});
			} else if (isSingleFolderWorkspaceIdentifier(configuration.workspace)) {
				configuration.backupPath = this.backupMainService.registerFolderBackup({
					folderUri: configuration.workspace.uri,
					remoteAuthority: configuration.remoteAuthority
				});
			} else {

				// Empty windows are special in that they provide no workspace on
				// their configuration. To properly register them with the backup
				// service, we either use the provided associated `backupFolder`
				// in case we restore a previously opened empty window or we have
				// to generate a new empty window workspace identifier to be used
				// as `backupFolder`.

				configuration.backupPath = this.backupMainService.registerEmptyWindowBackup({
					backupFolder: options.emptyWindowBackupInfo?.backupFolder ?? createEmptyWorkspaceIdentifier().id,
					remoteAuthority: configuration.remoteAuthority
				});
			}
		}

		const workspace = configuration.workspace ?? toWorkspaceIdentifier(configuration.backupPath, false);
		const profilePromise = this.resolveProfileForBrowserWindow(options, workspace, defaultProfile);
		const profile = profilePromise instanceof Promise ? await profilePromise : profilePromise;
		configuration.profiles.profile = profile;

		if (!configuration.extensionDevelopmentPath) {
			// Associate the configured profile to the workspace
			// unless the window is for extension development,
			// where we do not persist the associations
			await this.userDataProfilesMainService.setProfileForWorkspace(workspace, profile);
		}

		// Load it
		window.load(configuration);
	}

	private resolveProfileForBrowserWindow(options: IOpenBrowserWindowOptions, workspace: IAnyWorkspaceIdentifier, defaultProfile: IUserDataProfile): Promise<IUserDataProfile> | IUserDataProfile {
		if (options.forceProfile) {
			return this.userDataProfilesMainService.profiles.find(p => p.name === options.forceProfile) ?? this.userDataProfilesMainService.createNamedProfile(options.forceProfile);
		}

		if (options.forceTempProfile) {
			return this.userDataProfilesMainService.createTransientProfile();
		}

		return this.userDataProfilesMainService.getProfileForWorkspace(workspace) ?? defaultProfile;
	}

	private onWindowClosed(window: ICodeWindow, disposables: IDisposable): void {

		// Remove from our list so that Electron can clean it up
		this.windows.delete(window.id);

		// Emit
		this._onDidChangeWindowsCount.fire({ oldCount: this.getWindowCount() + 1, newCount: this.getWindowCount() });

		// Clean up
		disposables.dispose();
	}

	private onWindowDestroyed(window: ICodeWindow): void {

		// Remove from our list so that Electron can clean it up
		this.windows.delete(window.id);

		// Emit
		this._onDidDestroyWindow.fire(window);
	}

	getFocusedWindow(): ICodeWindow | undefined {
		const window = BrowserWindow.getFocusedWindow();
		if (window) {
			return this.getWindowById(window.id);
		}

		return undefined;
	}

	getLastActiveWindow(): ICodeWindow | undefined {
		return this.doGetLastActiveWindow(this.getWindows());
	}

	private getLastActiveWindowForAuthority(remoteAuthority: string | undefined): ICodeWindow | undefined {
		return this.doGetLastActiveWindow(this.getWindows().filter(window => isEqualAuthority(window.remoteAuthority, remoteAuthority)));
	}

	private doGetLastActiveWindow(windows: ICodeWindow[]): ICodeWindow | undefined {
		return getLastFocused(windows);
	}

	sendToFocused(channel: string, ...args: unknown[]): void {
		const focusedWindow = this.getFocusedWindow() || this.getLastActiveWindow();

		focusedWindow?.sendWhenReady(channel, CancellationToken.None, ...args);
	}

	sendToOpeningWindow(channel: string, ...args: unknown[]): void {
		this._register(Event.once(this.onDidSignalReadyWindow)(window => {
			window.sendWhenReady(channel, CancellationToken.None, ...args);
		}));
	}

	sendToAll(channel: string, payload?: unknown, windowIdsToIgnore?: number[]): void {
		for (const window of this.getWindows()) {
			if (windowIdsToIgnore && windowIdsToIgnore.indexOf(window.id) >= 0) {
				continue; // do not send if we are instructed to ignore it
			}

			window.sendWhenReady(channel, CancellationToken.None, payload);
		}
	}

	getWindows(): ICodeWindow[] {
		return Array.from(this.windows.values());
	}

	getWindowCount(): number {
		return this.windows.size;
	}

	getWindowById(windowId: number): ICodeWindow | undefined {
		return this.windows.get(windowId);
	}

	getWindowByWebContents(webContents: WebContents): ICodeWindow | undefined {
		const browserWindow = BrowserWindow.fromWebContents(webContents);
		if (!browserWindow) {
			return undefined;
		}

		const window = this.getWindowById(browserWindow.id);

		return window?.matches(webContents) ? window : undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/windows/electron-main/windowsStateHandler.ts]---
Location: vscode-main/src/vs/platform/windows/electron-main/windowsStateHandler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import electron from 'electron';
import { Disposable } from '../../../base/common/lifecycle.js';
import { isMacintosh } from '../../../base/common/platform.js';
import { extUriBiasedIgnorePathCase } from '../../../base/common/resources.js';
import { URI } from '../../../base/common/uri.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { ILifecycleMainService } from '../../lifecycle/electron-main/lifecycleMainService.js';
import { ILogService } from '../../log/common/log.js';
import { IStateService } from '../../state/node/state.js';
import { INativeWindowConfiguration, IWindowSettings } from '../../window/common/window.js';
import { IWindowsMainService } from './windows.js';
import { defaultWindowState, ICodeWindow, IWindowState as IWindowUIState, WindowMode } from '../../window/electron-main/window.js';
import { isSingleFolderWorkspaceIdentifier, isWorkspaceIdentifier, IWorkspaceIdentifier } from '../../workspace/common/workspace.js';

export interface IWindowState {
	readonly windowId?: number;
	workspace?: IWorkspaceIdentifier;
	folderUri?: URI;
	backupPath?: string;
	remoteAuthority?: string;
	uiState: IWindowUIState;
}

export interface IWindowsState {
	lastActiveWindow?: IWindowState;
	lastPluginDevelopmentHostWindow?: IWindowState;
	openedWindows: IWindowState[];
}

interface INewWindowState extends IWindowUIState {
	hasDefaultState?: boolean;
}

interface ISerializedWindowsState {
	readonly lastActiveWindow?: ISerializedWindowState;
	readonly lastPluginDevelopmentHostWindow?: ISerializedWindowState;
	readonly openedWindows: ISerializedWindowState[];
}

interface ISerializedWindowState {
	readonly workspaceIdentifier?: { id: string; configURIPath: string };
	readonly folder?: string;
	readonly backupPath?: string;
	readonly remoteAuthority?: string;
	readonly uiState: IWindowUIState;
}

export class WindowsStateHandler extends Disposable {

	private static readonly windowsStateStorageKey = 'windowsState';

	get state() { return this._state; }
	private readonly _state: IWindowsState;

	private lastClosedState: IWindowState | undefined = undefined;

	private shuttingDown = false;

	constructor(
		@IWindowsMainService private readonly windowsMainService: IWindowsMainService,
		@IStateService private readonly stateService: IStateService,
		@ILifecycleMainService private readonly lifecycleMainService: ILifecycleMainService,
		@ILogService private readonly logService: ILogService,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		super();

		this._state = restoreWindowsState(this.stateService.getItem<ISerializedWindowsState>(WindowsStateHandler.windowsStateStorageKey));

		this.registerListeners();
	}

	private registerListeners(): void {

		// When a window looses focus, save all windows state. This allows to
		// prevent loss of window-state data when OS is restarted without properly
		// shutting down the application (https://github.com/microsoft/vscode/issues/87171)
		electron.app.on('browser-window-blur', () => {
			if (!this.shuttingDown) {
				this.saveWindowsState();
			}
		});

		// Handle various lifecycle events around windows
		this._register(this.lifecycleMainService.onBeforeCloseWindow(window => this.onBeforeCloseWindow(window)));
		this._register(this.lifecycleMainService.onBeforeShutdown(() => this.onBeforeShutdown()));
		this._register(this.windowsMainService.onDidChangeWindowsCount(e => {
			if (e.newCount - e.oldCount > 0) {
				// clear last closed window state when a new window opens. this helps on macOS where
				// otherwise closing the last window, opening a new window and then quitting would
				// use the state of the previously closed window when restarting.
				this.lastClosedState = undefined;
			}
		}));

		// try to save state before destroy because close will not fire
		this._register(this.windowsMainService.onDidDestroyWindow(window => this.onBeforeCloseWindow(window)));
	}

	// Note that onBeforeShutdown() and onBeforeCloseWindow() are fired in different order depending on the OS:
	// - macOS: since the app will not quit when closing the last window, you will always first get
	//          the onBeforeShutdown() event followed by N onBeforeCloseWindow() events for each window
	// - other: on other OS, closing the last window will quit the app so the order depends on the
	//          user interaction: closing the last window will first trigger onBeforeCloseWindow()
	//          and then onBeforeShutdown(). Using the quit action however will first issue onBeforeShutdown()
	//          and then onBeforeCloseWindow().
	//
	// Here is the behavior on different OS depending on action taken (Electron 1.7.x):
	//
	// Legend
	// -  quit(N): quit application with N windows opened
	// - close(1): close one window via the window close button
	// - closeAll: close all windows via the taskbar command
	// - onBeforeShutdown(N): number of windows reported in this event handler
	// - onBeforeCloseWindow(N, M): number of windows reported and quitRequested boolean in this event handler
	//
	// macOS
	// 	-     quit(1): onBeforeShutdown(1), onBeforeCloseWindow(1, true)
	// 	-     quit(2): onBeforeShutdown(2), onBeforeCloseWindow(2, true), onBeforeCloseWindow(2, true)
	// 	-     quit(0): onBeforeShutdown(0)
	// 	-    close(1): onBeforeCloseWindow(1, false)
	//
	// Windows
	// 	-     quit(1): onBeforeShutdown(1), onBeforeCloseWindow(1, true)
	// 	-     quit(2): onBeforeShutdown(2), onBeforeCloseWindow(2, true), onBeforeCloseWindow(2, true)
	// 	-    close(1): onBeforeCloseWindow(2, false)[not last window]
	// 	-    close(1): onBeforeCloseWindow(1, false), onBeforeShutdown(0)[last window]
	// 	- closeAll(2): onBeforeCloseWindow(2, false), onBeforeCloseWindow(2, false), onBeforeShutdown(0)
	//
	// Linux
	// 	-     quit(1): onBeforeShutdown(1), onBeforeCloseWindow(1, true)
	// 	-     quit(2): onBeforeShutdown(2), onBeforeCloseWindow(2, true), onBeforeCloseWindow(2, true)
	// 	-    close(1): onBeforeCloseWindow(2, false)[not last window]
	// 	-    close(1): onBeforeCloseWindow(1, false), onBeforeShutdown(0)[last window]
	// 	- closeAll(2): onBeforeCloseWindow(2, false), onBeforeCloseWindow(2, false), onBeforeShutdown(0)
	//
	private onBeforeShutdown(): void {
		this.shuttingDown = true;

		this.saveWindowsState();
	}

	private saveWindowsState(): void {

		// TODO@electron workaround for Electron not being able to restore
		// multiple (native) fullscreen windows on the same display at once
		// on macOS.
		// https://github.com/electron/electron/issues/34367
		const displaysWithFullScreenWindow = new Set<number | undefined>();

		const currentWindowsState: IWindowsState = {
			openedWindows: [],
			lastPluginDevelopmentHostWindow: this._state.lastPluginDevelopmentHostWindow,
			lastActiveWindow: this.lastClosedState
		};

		// 1.) Find a last active window (pick any other first window otherwise)
		if (!currentWindowsState.lastActiveWindow) {
			let activeWindow = this.windowsMainService.getLastActiveWindow();
			if (!activeWindow || activeWindow.isExtensionDevelopmentHost) {
				activeWindow = this.windowsMainService.getWindows().find(window => !window.isExtensionDevelopmentHost);
			}

			if (activeWindow) {
				currentWindowsState.lastActiveWindow = this.toWindowState(activeWindow);

				if (currentWindowsState.lastActiveWindow.uiState.mode === WindowMode.Fullscreen) {
					displaysWithFullScreenWindow.add(currentWindowsState.lastActiveWindow.uiState.display); // always allow fullscreen for active window
				}
			}
		}

		// 2.) Find extension host window
		const extensionHostWindow = this.windowsMainService.getWindows().find(window => window.isExtensionDevelopmentHost && !window.isExtensionTestHost);
		if (extensionHostWindow) {
			currentWindowsState.lastPluginDevelopmentHostWindow = this.toWindowState(extensionHostWindow);

			if (currentWindowsState.lastPluginDevelopmentHostWindow.uiState.mode === WindowMode.Fullscreen) {
				if (displaysWithFullScreenWindow.has(currentWindowsState.lastPluginDevelopmentHostWindow.uiState.display)) {
					if (isMacintosh && !extensionHostWindow.win?.isSimpleFullScreen()) {
						currentWindowsState.lastPluginDevelopmentHostWindow.uiState.mode = WindowMode.Normal;
					}
				} else {
					displaysWithFullScreenWindow.add(currentWindowsState.lastPluginDevelopmentHostWindow.uiState.display);
				}
			}
		}

		// 3.) All windows (except extension host) for N >= 2 to support `restoreWindows: all` or for auto update
		//
		// Careful here: asking a window for its window state after it has been closed returns bogus values (width: 0, height: 0)
		// so if we ever want to persist the UI state of the last closed window (window count === 1), it has
		// to come from the stored lastClosedWindowState on Win/Linux at least
		if (this.windowsMainService.getWindowCount() > 1) {
			currentWindowsState.openedWindows = this.windowsMainService.getWindows().filter(window => !window.isExtensionDevelopmentHost).map(window => {
				const windowState = this.toWindowState(window);

				if (windowState.uiState.mode === WindowMode.Fullscreen) {
					if (displaysWithFullScreenWindow.has(windowState.uiState.display)) {
						if (isMacintosh && windowState.windowId !== currentWindowsState.lastActiveWindow?.windowId && !window.win?.isSimpleFullScreen()) {
							windowState.uiState.mode = WindowMode.Normal;
						}
					} else {
						displaysWithFullScreenWindow.add(windowState.uiState.display);
					}
				}

				return windowState;
			});
		}

		// Persist
		const state = getWindowsStateStoreData(currentWindowsState);
		this.stateService.setItem(WindowsStateHandler.windowsStateStorageKey, state);

		if (this.shuttingDown) {
			this.logService.trace('[WindowsStateHandler] onBeforeShutdown', state);
		}
	}

	// See note on #onBeforeShutdown() for details how these events are flowing
	private onBeforeCloseWindow(window: ICodeWindow): void {
		if (this.lifecycleMainService.quitRequested) {
			return; // during quit, many windows close in parallel so let it be handled in the before-quit handler
		}

		// On Window close, update our stored UI state of this window
		const state: IWindowState = this.toWindowState(window);
		if (window.isExtensionDevelopmentHost && !window.isExtensionTestHost) {
			this._state.lastPluginDevelopmentHostWindow = state; // do not let test run window state overwrite our extension development state
		}

		// Any non extension host window with same workspace or folder
		else if (!window.isExtensionDevelopmentHost && window.openedWorkspace) {
			this._state.openedWindows.forEach(openedWindow => {
				const sameWorkspace = isWorkspaceIdentifier(window.openedWorkspace) && openedWindow.workspace?.id === window.openedWorkspace.id;
				const sameFolder = isSingleFolderWorkspaceIdentifier(window.openedWorkspace) && openedWindow.folderUri && extUriBiasedIgnorePathCase.isEqual(openedWindow.folderUri, window.openedWorkspace.uri);

				if (sameWorkspace || sameFolder) {
					openedWindow.uiState = state.uiState;
				}
			});
		}

		// On Windows and Linux closing the last window will trigger quit. Since we are storing all UI state
		// before quitting, we need to remember the UI state of this window to be able to persist it.
		// On macOS we keep the last closed window state ready in case the user wants to quit right after or
		// wants to open another window, in which case we use this state over the persisted one.
		if (this.windowsMainService.getWindowCount() === 1) {
			this.lastClosedState = state;
		}
	}

	private toWindowState(window: ICodeWindow): IWindowState {
		return {
			windowId: window.id,
			workspace: isWorkspaceIdentifier(window.openedWorkspace) ? window.openedWorkspace : undefined,
			folderUri: isSingleFolderWorkspaceIdentifier(window.openedWorkspace) ? window.openedWorkspace.uri : undefined,
			backupPath: window.backupPath,
			remoteAuthority: window.remoteAuthority,
			uiState: window.serializeWindowState()
		};
	}

	getNewWindowState(configuration: INativeWindowConfiguration): INewWindowState {
		const state = this.doGetNewWindowState(configuration);
		const windowConfig = this.configurationService.getValue<IWindowSettings | undefined>('window');

		// Fullscreen state gets special treatment
		if (state.mode === WindowMode.Fullscreen) {

			// Window state is not from a previous session: only allow fullscreen if we inherit it or user wants fullscreen
			let allowFullscreen: boolean;
			if (state.hasDefaultState) {
				allowFullscreen = !!(windowConfig?.newWindowDimensions && ['fullscreen', 'inherit', 'offset'].indexOf(windowConfig.newWindowDimensions) >= 0);
			}

			// Window state is from a previous session: only allow fullscreen when we got updated or user wants to restore
			else {
				allowFullscreen = !!(this.lifecycleMainService.wasRestarted || windowConfig?.restoreFullscreen);
			}

			if (!allowFullscreen) {
				state.mode = WindowMode.Normal;
			}
		}

		return state;
	}

	private doGetNewWindowState(configuration: INativeWindowConfiguration): INewWindowState {
		const lastActive = this.windowsMainService.getLastActiveWindow();

		// Restore state unless we are running extension tests
		if (!configuration.extensionTestsPath) {

			// extension development host Window - load from stored settings if any
			if (!!configuration.extensionDevelopmentPath && this.state.lastPluginDevelopmentHostWindow) {
				return this.state.lastPluginDevelopmentHostWindow.uiState;
			}

			// Known Workspace - load from stored settings
			const workspace = configuration.workspace;
			if (isWorkspaceIdentifier(workspace)) {
				const stateForWorkspace = this.state.openedWindows.filter(openedWindow => openedWindow.workspace && openedWindow.workspace.id === workspace.id).map(openedWindow => openedWindow.uiState);
				if (stateForWorkspace.length) {
					return stateForWorkspace[0];
				}
			}

			// Known Folder - load from stored settings
			if (isSingleFolderWorkspaceIdentifier(workspace)) {
				const stateForFolder = this.state.openedWindows.filter(openedWindow => openedWindow.folderUri && extUriBiasedIgnorePathCase.isEqual(openedWindow.folderUri, workspace.uri)).map(openedWindow => openedWindow.uiState);
				if (stateForFolder.length) {
					return stateForFolder[0];
				}
			}

			// Empty windows with backups
			else if (configuration.backupPath) {
				const stateForEmptyWindow = this.state.openedWindows.filter(openedWindow => openedWindow.backupPath === configuration.backupPath).map(openedWindow => openedWindow.uiState);
				if (stateForEmptyWindow.length) {
					return stateForEmptyWindow[0];
				}
			}

			// First Window
			const lastActiveState = this.lastClosedState || this.state.lastActiveWindow;
			if (!lastActive && lastActiveState) {
				return lastActiveState.uiState;
			}
		}

		//
		// In any other case, we do not have any stored settings for the window state, so we come up with something smart
		//

		// We want the new window to open on the same display that the last active one is in
		let displayToUse: electron.Display | undefined;
		const displays = electron.screen.getAllDisplays();

		// Single Display
		if (displays.length === 1) {
			displayToUse = displays[0];
		}

		// Multi Display
		else {

			// on mac there is 1 menu per window so we need to use the monitor where the cursor currently is
			if (isMacintosh) {
				const cursorPoint = electron.screen.getCursorScreenPoint();
				displayToUse = electron.screen.getDisplayNearestPoint(cursorPoint);
			}

			// if we have a last active window, use that display for the new window
			if (!displayToUse && lastActive) {
				displayToUse = electron.screen.getDisplayMatching(lastActive.getBounds());
			}

			// fallback to primary display or first display
			if (!displayToUse) {
				displayToUse = electron.screen.getPrimaryDisplay() || displays[0];
			}
		}

		// Compute x/y based on display bounds
		// Note: important to use Math.round() because Electron does not seem to be too happy about
		// display coordinates that are not absolute numbers.
		let state = defaultWindowState(undefined, isWorkspaceIdentifier(configuration.workspace) || isSingleFolderWorkspaceIdentifier(configuration.workspace));
		state.x = Math.round(displayToUse.bounds.x + (displayToUse.bounds.width / 2) - (state.width! / 2));
		state.y = Math.round(displayToUse.bounds.y + (displayToUse.bounds.height / 2) - (state.height! / 2));

		// Check for newWindowDimensions setting and adjust accordingly
		const windowConfig = this.configurationService.getValue<IWindowSettings | undefined>('window');
		let ensureNoOverlap = true;
		if (windowConfig?.newWindowDimensions) {
			if (windowConfig.newWindowDimensions === 'maximized') {
				state.mode = WindowMode.Maximized;
				ensureNoOverlap = false;
			} else if (windowConfig.newWindowDimensions === 'fullscreen') {
				state.mode = WindowMode.Fullscreen;
				ensureNoOverlap = false;
			} else if ((windowConfig.newWindowDimensions === 'inherit' || windowConfig.newWindowDimensions === 'offset') && lastActive) {
				const lastActiveState = lastActive.serializeWindowState();
				if (lastActiveState.mode === WindowMode.Fullscreen) {
					state.mode = WindowMode.Fullscreen; // only take mode (fixes https://github.com/microsoft/vscode/issues/19331)
				} else {
					state = {
						...lastActiveState,
						zoomLevel: undefined // do not inherit zoom level
					};
				}

				ensureNoOverlap = state.mode !== WindowMode.Fullscreen && windowConfig.newWindowDimensions === 'offset';
			}
		}

		if (ensureNoOverlap) {
			state = this.ensureNoOverlap(state);
		}

		(state as INewWindowState).hasDefaultState = true; // flag as default state

		return state;
	}

	private ensureNoOverlap(state: IWindowUIState): IWindowUIState {
		if (this.windowsMainService.getWindows().length === 0) {
			return state;
		}

		state.x = typeof state.x === 'number' ? state.x : 0;
		state.y = typeof state.y === 'number' ? state.y : 0;

		const existingWindowBounds = this.windowsMainService.getWindows().map(window => window.getBounds());
		while (existingWindowBounds.some(bounds => bounds.x === state.x || bounds.y === state.y)) {
			state.x += 30;
			state.y += 30;
		}

		return state;
	}
}

export function restoreWindowsState(data: ISerializedWindowsState | undefined): IWindowsState {
	const result: IWindowsState = { openedWindows: [] };
	const windowsState = data || { openedWindows: [] };

	if (windowsState.lastActiveWindow) {
		result.lastActiveWindow = restoreWindowState(windowsState.lastActiveWindow);
	}

	if (windowsState.lastPluginDevelopmentHostWindow) {
		result.lastPluginDevelopmentHostWindow = restoreWindowState(windowsState.lastPluginDevelopmentHostWindow);
	}

	if (Array.isArray(windowsState.openedWindows)) {
		result.openedWindows = windowsState.openedWindows.map(windowState => restoreWindowState(windowState));
	}

	return result;
}

function restoreWindowState(windowState: ISerializedWindowState): IWindowState {
	const result: IWindowState = { uiState: windowState.uiState };
	if (windowState.backupPath) {
		result.backupPath = windowState.backupPath;
	}

	if (windowState.remoteAuthority) {
		result.remoteAuthority = windowState.remoteAuthority;
	}

	if (windowState.folder) {
		result.folderUri = URI.parse(windowState.folder);
	}

	if (windowState.workspaceIdentifier) {
		result.workspace = { id: windowState.workspaceIdentifier.id, configPath: URI.parse(windowState.workspaceIdentifier.configURIPath) };
	}

	return result;
}

export function getWindowsStateStoreData(windowsState: IWindowsState): IWindowsState {
	return {
		lastActiveWindow: windowsState.lastActiveWindow && serializeWindowState(windowsState.lastActiveWindow),
		lastPluginDevelopmentHostWindow: windowsState.lastPluginDevelopmentHostWindow && serializeWindowState(windowsState.lastPluginDevelopmentHostWindow),
		openedWindows: windowsState.openedWindows.map(ws => serializeWindowState(ws))
	};
}

function serializeWindowState(windowState: IWindowState): ISerializedWindowState {
	return {
		workspaceIdentifier: windowState.workspace && { id: windowState.workspace.id, configURIPath: windowState.workspace.configPath.toString() },
		folder: windowState.folderUri?.toString(),
		backupPath: windowState.backupPath,
		remoteAuthority: windowState.remoteAuthority,
		uiState: windowState.uiState
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/windows/node/windowTracker.ts]---
Location: vscode-main/src/vs/platform/windows/node/windowTracker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancelablePromise, createCancelablePromise } from '../../../base/common/async.js';
import { Event } from '../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../base/common/lifecycle.js';

export class ActiveWindowManager extends Disposable {

	private readonly disposables = this._register(new DisposableStore());
	private firstActiveWindowIdPromise: CancelablePromise<number | undefined> | undefined;

	private activeWindowId: number | undefined;

	constructor({ onDidOpenMainWindow, onDidFocusMainWindow, getActiveWindowId }: {
		readonly onDidOpenMainWindow: Event<number>;
		readonly onDidFocusMainWindow: Event<number>;
		getActiveWindowId(): Promise<number | undefined>;
	}) {
		super();

		// remember last active window id upon events
		const onActiveWindowChange = Event.latch(Event.any(onDidOpenMainWindow, onDidFocusMainWindow));
		onActiveWindowChange(this.setActiveWindow, this, this.disposables);

		// resolve current active window
		this.firstActiveWindowIdPromise = createCancelablePromise(() => getActiveWindowId());
		(async () => {
			try {
				const windowId = await this.firstActiveWindowIdPromise;
				this.activeWindowId = (typeof this.activeWindowId === 'number') ? this.activeWindowId : windowId;
			} catch (error) {
				// ignore
			} finally {
				this.firstActiveWindowIdPromise = undefined;
			}
		})();
	}

	private setActiveWindow(windowId: number | undefined) {
		if (this.firstActiveWindowIdPromise) {
			this.firstActiveWindowIdPromise.cancel();
			this.firstActiveWindowIdPromise = undefined;
		}

		this.activeWindowId = windowId;
	}

	async getActiveClientId(): Promise<string | undefined> {
		const id = this.firstActiveWindowIdPromise ? (await this.firstActiveWindowIdPromise) : this.activeWindowId;

		return `window:${id}`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/windows/test/electron-main/windowsFinder.test.ts]---
Location: vscode-main/src/vs/platform/windows/test/electron-main/windowsFinder.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { join } from '../../../../base/common/path.js';
import { extUriBiasedIgnorePathCase } from '../../../../base/common/resources.js';
import { URI, UriDto } from '../../../../base/common/uri.js';
import { ICommandAction } from '../../../action/common/action.js';
import { NativeParsedArgs } from '../../../environment/common/argv.js';
import { INativeWindowConfiguration } from '../../../window/common/window.js';
import { ICodeWindow, ILoadEvent, IWindowState } from '../../../window/electron-main/window.js';
import { findWindowOnFile } from '../../electron-main/windowsFinder.js';
import { toWorkspaceFolders } from '../../../workspaces/common/workspaces.js';
import { IWorkspaceIdentifier } from '../../../workspace/common/workspace.js';
import { FileAccess } from '../../../../base/common/network.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { FocusMode } from '../../../native/common/native.js';

suite('WindowsFinder', () => {

	const fixturesFolder = FileAccess.asFileUri('vs/platform/windows/test/electron-main/fixtures').fsPath;

	const testWorkspace: IWorkspaceIdentifier = {
		id: Date.now().toString(),
		configPath: URI.file(join(fixturesFolder, 'workspaces.json'))
	};

	const testWorkspaceFolders = toWorkspaceFolders([{ path: join(fixturesFolder, 'vscode_workspace_1_folder') }, { path: join(fixturesFolder, 'vscode_workspace_2_folder') }], testWorkspace.configPath, extUriBiasedIgnorePathCase);
	const localWorkspaceResolver = async (workspace: IWorkspaceIdentifier) => { return workspace === testWorkspace ? { id: testWorkspace.id, configPath: workspace.configPath, folders: testWorkspaceFolders } : undefined; };

	function createTestCodeWindow(options: { lastFocusTime: number; openedFolderUri?: URI; openedWorkspace?: IWorkspaceIdentifier }): ICodeWindow {
		return new class implements ICodeWindow {
			readonly onWillLoad: Event<ILoadEvent> = Event.None;
			onDidMaximize = Event.None;
			onDidUnmaximize = Event.None;
			readonly onDidTriggerSystemContextMenu: Event<{ x: number; y: number }> = Event.None;
			readonly onDidSignalReady: Event<void> = Event.None;
			readonly onDidClose: Event<void> = Event.None;
			readonly onDidDestroy: Event<void> = Event.None;
			readonly onDidEnterFullScreen: Event<void> = Event.None;
			readonly onDidLeaveFullScreen: Event<void> = Event.None;
			whenClosedOrLoaded: Promise<void> = Promise.resolve();
			id: number = -1;
			win: Electron.BrowserWindow = null!;
			config: INativeWindowConfiguration | undefined;
			openedWorkspace = options.openedFolderUri ? { id: '', uri: options.openedFolderUri } : options.openedWorkspace;
			backupPath?: string | undefined;
			remoteAuthority?: string | undefined;
			isExtensionDevelopmentHost = false;
			isExtensionTestHost = false;
			lastFocusTime = options.lastFocusTime;
			isFullScreen = false;
			isReady = true;

			ready(): Promise<ICodeWindow> { throw new Error('Method not implemented.'); }
			setReady(): void { throw new Error('Method not implemented.'); }
			addTabbedWindow(window: ICodeWindow): void { throw new Error('Method not implemented.'); }
			load(config: INativeWindowConfiguration, options: { isReload?: boolean }): void { throw new Error('Method not implemented.'); }
			reload(cli?: NativeParsedArgs): void { throw new Error('Method not implemented.'); }
			focus(options?: { mode: FocusMode }): void { throw new Error('Method not implemented.'); }
			close(): void { throw new Error('Method not implemented.'); }
			getBounds(): Electron.Rectangle { throw new Error('Method not implemented.'); }
			send(channel: string, ...args: unknown[]): void { throw new Error('Method not implemented.'); }
			sendWhenReady(channel: string, token: CancellationToken, ...args: unknown[]): void { throw new Error('Method not implemented.'); }
			toggleFullScreen(): void { throw new Error('Method not implemented.'); }
			setRepresentedFilename(name: string): void { throw new Error('Method not implemented.'); }
			getRepresentedFilename(): string | undefined { throw new Error('Method not implemented.'); }
			setDocumentEdited(edited: boolean): void { throw new Error('Method not implemented.'); }
			isDocumentEdited(): boolean { throw new Error('Method not implemented.'); }
			updateTouchBar(items: UriDto<ICommandAction>[][]): void { throw new Error('Method not implemented.'); }
			serializeWindowState(): IWindowState { throw new Error('Method not implemented'); }
			updateWindowControls(options: { height?: number | undefined; backgroundColor?: string | undefined; foregroundColor?: string | undefined }): void { throw new Error('Method not implemented.'); }
			notifyZoomLevel(level: number): void { throw new Error('Method not implemented.'); }
			matches(webContents: Electron.WebContents): boolean { throw new Error('Method not implemented.'); }
			dispose(): void { }
		};
	}

	const vscodeFolderWindow: ICodeWindow = createTestCodeWindow({ lastFocusTime: 1, openedFolderUri: URI.file(join(fixturesFolder, 'vscode_folder')) });
	const lastActiveWindow: ICodeWindow = createTestCodeWindow({ lastFocusTime: 3, openedFolderUri: undefined });
	const noVscodeFolderWindow: ICodeWindow = createTestCodeWindow({ lastFocusTime: 2, openedFolderUri: URI.file(join(fixturesFolder, 'no_vscode_folder')) });
	const windows: ICodeWindow[] = [
		vscodeFolderWindow,
		lastActiveWindow,
		noVscodeFolderWindow,
	];

	test('New window without folder when no windows exist', async () => {
		assert.strictEqual(await findWindowOnFile([], URI.file('nonexisting'), localWorkspaceResolver), undefined);
		assert.strictEqual(await findWindowOnFile([], URI.file(join(fixturesFolder, 'no_vscode_folder', 'file.txt')), localWorkspaceResolver), undefined);
	});

	test('Existing window with folder', async () => {
		assert.strictEqual(await findWindowOnFile(windows, URI.file(join(fixturesFolder, 'no_vscode_folder', 'file.txt')), localWorkspaceResolver), noVscodeFolderWindow);

		assert.strictEqual(await findWindowOnFile(windows, URI.file(join(fixturesFolder, 'vscode_folder', 'file.txt')), localWorkspaceResolver), vscodeFolderWindow);

		const window: ICodeWindow = createTestCodeWindow({ lastFocusTime: 1, openedFolderUri: URI.file(join(fixturesFolder, 'vscode_folder', 'nested_folder')) });
		assert.strictEqual(await findWindowOnFile([window], URI.file(join(fixturesFolder, 'vscode_folder', 'nested_folder', 'subfolder', 'file.txt')), localWorkspaceResolver), window);
	});

	test('More specific existing window wins', async () => {
		const window: ICodeWindow = createTestCodeWindow({ lastFocusTime: 2, openedFolderUri: URI.file(join(fixturesFolder, 'no_vscode_folder')) });
		const nestedFolderWindow: ICodeWindow = createTestCodeWindow({ lastFocusTime: 1, openedFolderUri: URI.file(join(fixturesFolder, 'no_vscode_folder', 'nested_folder')) });
		assert.strictEqual(await findWindowOnFile([window, nestedFolderWindow], URI.file(join(fixturesFolder, 'no_vscode_folder', 'nested_folder', 'subfolder', 'file.txt')), localWorkspaceResolver), nestedFolderWindow);
	});

	test('Workspace folder wins', async () => {
		const window: ICodeWindow = createTestCodeWindow({ lastFocusTime: 1, openedWorkspace: testWorkspace });
		assert.strictEqual(await findWindowOnFile([window], URI.file(join(fixturesFolder, 'vscode_workspace_2_folder', 'nested_vscode_folder', 'subfolder', 'file.txt')), localWorkspaceResolver), window);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

````
