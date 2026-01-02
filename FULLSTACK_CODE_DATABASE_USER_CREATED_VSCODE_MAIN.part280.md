---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 280
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 280 of 552)

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

---[FILE: src/vs/platform/native/common/nativeHostService.ts]---
Location: vscode-main/src/vs/platform/native/common/nativeHostService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ProxyChannel } from '../../../base/parts/ipc/common/ipc.js';
import { IMainProcessService } from '../../ipc/common/mainProcessService.js';
import { INativeHostService } from './native.js';

// @ts-expect-error: interface is implemented via proxy
export class NativeHostService implements INativeHostService {

	declare readonly _serviceBrand: undefined;

	constructor(
		readonly windowId: number,
		@IMainProcessService mainProcessService: IMainProcessService
	) {
		return ProxyChannel.toService<INativeHostService>(mainProcessService.getChannel('nativeHost'), {
			context: windowId,
			properties: (() => {
				const properties = new Map<string, unknown>();
				properties.set('windowId', windowId);

				return properties;
			})()
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/native/electron-main/auth.ts]---
Location: vscode-main/src/vs/platform/native/electron-main/auth.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { app, AuthenticationResponseDetails, AuthInfo as ElectronAuthInfo, Event as ElectronEvent, WebContents } from 'electron';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Event } from '../../../base/common/event.js';
import { hash } from '../../../base/common/hash.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEncryptionMainService } from '../../encryption/common/encryptionService.js';
import { IEnvironmentMainService } from '../../environment/electron-main/environmentMainService.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';
import { AuthInfo, Credentials } from '../../request/common/request.js';
import { StorageScope, StorageTarget } from '../../storage/common/storage.js';
import { IApplicationStorageMainService } from '../../storage/electron-main/storageMainService.js';
import { IWindowsMainService } from '../../windows/electron-main/windows.js';

interface ElectronAuthenticationResponseDetails extends AuthenticationResponseDetails {
	firstAuthAttempt?: boolean; // https://github.com/electron/electron/blob/84a42a050e7d45225e69df5bd2d2bf9f1037ea41/shell/browser/login_handler.cc#L70
}

type LoginEvent = {
	event?: ElectronEvent;
	authInfo: AuthInfo;
	callback?: (username?: string, password?: string) => void;
};

export const IProxyAuthService = createDecorator<IProxyAuthService>('proxyAuthService');

export interface IProxyAuthService {
	lookupAuthorization(authInfo: AuthInfo): Promise<Credentials | undefined>;
}

export class ProxyAuthService extends Disposable implements IProxyAuthService {

	declare readonly _serviceBrand: undefined;

	private readonly PROXY_CREDENTIALS_SERVICE_KEY = 'proxy-credentials://';

	private pendingProxyResolves = new Map<string, Promise<Credentials | undefined>>();
	private currentDialog: Promise<Credentials | undefined> | undefined = undefined;

	private cancelledAuthInfoHashes = new Set<string>();

	private sessionCredentials = new Map<string, Credentials | undefined>();

	constructor(
		@ILogService private readonly logService: ILogService,
		@IWindowsMainService private readonly windowsMainService: IWindowsMainService,
		@IEncryptionMainService private readonly encryptionMainService: IEncryptionMainService,
		@IApplicationStorageMainService private readonly applicationStorageMainService: IApplicationStorageMainService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IEnvironmentMainService private readonly environmentMainService: IEnvironmentMainService,
	) {
		super();

		this.registerListeners();
	}

	private registerListeners(): void {
		const onLogin = Event.fromNodeEventEmitter<LoginEvent>(app, 'login', (event: ElectronEvent, _webContents: WebContents, req: ElectronAuthenticationResponseDetails, authInfo: ElectronAuthInfo, callback) => ({ event, authInfo: { ...authInfo, attempt: req.firstAuthAttempt ? 1 : 2 }, callback } satisfies LoginEvent));
		this._register(onLogin(this.onLogin, this));
	}

	async lookupAuthorization(authInfo: AuthInfo): Promise<Credentials | undefined> {
		return this.onLogin({ authInfo });
	}

	private async onLogin({ event, authInfo, callback }: LoginEvent): Promise<Credentials | undefined> {
		if (!authInfo.isProxy) {
			return; // only for proxy
		}

		// Signal we handle this event on our own, otherwise
		// Electron will ignore our provided credentials.
		event?.preventDefault();

		// Compute a hash over the authentication info to be used
		// with the credentials store to return the right credentials
		// given the properties of the auth request
		// (see https://github.com/microsoft/vscode/issues/109497)
		const authInfoHash = String(hash({ scheme: authInfo.scheme, host: authInfo.host, port: authInfo.port }));

		let credentials: Credentials | undefined = undefined;
		let pendingProxyResolve = this.pendingProxyResolves.get(authInfoHash);
		if (!pendingProxyResolve) {
			this.logService.trace('auth#onLogin (proxy) - no pending proxy handling found, starting new');

			pendingProxyResolve = this.resolveProxyCredentials(authInfo, authInfoHash);
			this.pendingProxyResolves.set(authInfoHash, pendingProxyResolve);
			try {
				credentials = await pendingProxyResolve;
			} finally {
				this.pendingProxyResolves.delete(authInfoHash);
			}
		} else {
			this.logService.trace('auth#onLogin (proxy) - pending proxy handling found');

			credentials = await pendingProxyResolve;
		}

		// According to Electron docs, it is fine to call back without
		// username or password to signal that the authentication was handled
		// by us, even though without having credentials received:
		//
		// > If `callback` is called without a username or password, the authentication
		// > request will be cancelled and the authentication error will be returned to the
		// > page.
		callback?.(credentials?.username, credentials?.password);
		return credentials;
	}

	private async resolveProxyCredentials(authInfo: AuthInfo, authInfoHash: string): Promise<Credentials | undefined> {
		this.logService.trace('auth#resolveProxyCredentials (proxy) - enter');

		try {
			const credentials = await this.doResolveProxyCredentials(authInfo, authInfoHash);
			if (credentials) {
				this.logService.trace('auth#resolveProxyCredentials (proxy) - got credentials');

				return credentials;
			} else {
				this.logService.trace('auth#resolveProxyCredentials (proxy) - did not get credentials');
			}
		} finally {
			this.logService.trace('auth#resolveProxyCredentials (proxy) - exit');
		}

		return undefined;
	}

	private async doResolveProxyCredentials(authInfo: AuthInfo, authInfoHash: string): Promise<Credentials | undefined> {
		this.logService.trace('auth#doResolveProxyCredentials - enter', authInfo);

		// For testing.
		if (this.environmentMainService.extensionTestsLocationURI) {
			try {
				const decodedRealm = Buffer.from(authInfo.realm, 'base64').toString('utf-8');
				if (decodedRealm.startsWith('{')) {
					return JSON.parse(decodedRealm);
				}
			} catch {
				// ignore
			}
			return undefined;
		}

		// Reply with manually supplied credentials. Fail if they are wrong.
		const newHttpProxy = (this.configurationService.getValue<string>('http.proxy') || '').trim()
			|| (process.env['https_proxy'] || process.env['HTTPS_PROXY'] || process.env['http_proxy'] || process.env['HTTP_PROXY'] || '').trim()
			|| undefined;

		if (newHttpProxy?.indexOf('@') !== -1) {
			const uri = URI.parse(newHttpProxy!);
			const i = uri.authority.indexOf('@');
			if (i !== -1) {
				if (authInfo.attempt > 1) {
					this.logService.trace('auth#doResolveProxyCredentials (proxy) - exit - ignoring previously used config/envvar credentials');
					return undefined; // We tried already, let the user handle it.
				}
				this.logService.trace('auth#doResolveProxyCredentials (proxy) - exit - found config/envvar credentials to use');
				const credentials = uri.authority.substring(0, i);
				const j = credentials.indexOf(':');
				if (j !== -1) {
					return {
						username: credentials.substring(0, j),
						password: credentials.substring(j + 1)
					};
				} else {
					return {
						username: credentials,
						password: ''
					};
				}
			}
		}

		// Reply with session credentials unless we used them already.
		// In that case we need to show a login dialog again because
		// they seem invalid.
		const sessionCredentials = authInfo.attempt === 1 && this.sessionCredentials.get(authInfoHash);
		if (sessionCredentials) {
			this.logService.trace('auth#doResolveProxyCredentials (proxy) - exit - found session credentials to use');

			const { username, password } = sessionCredentials;
			return { username, password };
		}

		let storedUsername: string | undefined;
		let storedPassword: string | undefined;
		try {
			// Try to find stored credentials for the given auth info
			const encryptedValue = this.applicationStorageMainService.get(this.PROXY_CREDENTIALS_SERVICE_KEY + authInfoHash, StorageScope.APPLICATION);
			if (encryptedValue) {
				const credentials: Credentials = JSON.parse(await this.encryptionMainService.decrypt(encryptedValue));
				storedUsername = credentials.username;
				storedPassword = credentials.password;
			}
		} catch (error) {
			this.logService.error(error); // handle errors by asking user for login via dialog
		}

		// Reply with stored credentials unless we used them already.
		// In that case we need to show a login dialog again because
		// they seem invalid.
		if (authInfo.attempt === 1 && typeof storedUsername === 'string' && typeof storedPassword === 'string') {
			this.logService.trace('auth#doResolveProxyCredentials (proxy) - exit - found stored credentials to use');

			this.sessionCredentials.set(authInfoHash, { username: storedUsername, password: storedPassword });
			return { username: storedUsername, password: storedPassword };
		}

		const previousDialog = this.currentDialog;
		const currentDialog = this.currentDialog = (async () => {
			await previousDialog;
			const credentials = await this.showProxyCredentialsDialog(authInfo, authInfoHash, storedUsername, storedPassword);
			if (this.currentDialog === currentDialog!) {
				this.currentDialog = undefined;
			}
			return credentials;
		})();
		return currentDialog;
	}

	private async showProxyCredentialsDialog(authInfo: AuthInfo, authInfoHash: string, storedUsername: string | undefined, storedPassword: string | undefined): Promise<Credentials | undefined> {
		if (this.cancelledAuthInfoHashes.has(authInfoHash)) {
			this.logService.trace('auth#doResolveProxyCredentials (proxy) - exit - login dialog was cancelled before, not showing again');

			return undefined;
		}

		// Find suitable window to show dialog: prefer to show it in the
		// active window because any other network request will wait on
		// the credentials and we want the user to present the dialog.
		const window = this.windowsMainService.getFocusedWindow() || this.windowsMainService.getLastActiveWindow();
		if (!window) {
			this.logService.trace('auth#doResolveProxyCredentials (proxy) - exit - no opened window found to show dialog in');

			return undefined; // unexpected
		}

		this.logService.trace(`auth#doResolveProxyCredentials (proxy) - asking window ${window.id} to handle proxy login`);

		// Open proxy dialog
		const sessionCredentials = this.sessionCredentials.get(authInfoHash);
		const payload = {
			authInfo,
			username: sessionCredentials?.username ?? storedUsername, // prefer to show already used username (if any) over stored
			password: sessionCredentials?.password ?? storedPassword, // prefer to show already used password (if any) over stored
			replyChannel: `vscode:proxyAuthResponse:${generateUuid()}`
		};
		window.sendWhenReady('vscode:openProxyAuthenticationDialog', CancellationToken.None, payload);

		// Handle reply
		const loginDialogCredentials = await new Promise<Credentials | undefined>(resolve => {
			const proxyAuthResponseHandler = async (event: ElectronEvent, channel: string, reply: Credentials & { remember: boolean } | undefined /* canceled */) => {
				if (channel === payload.replyChannel) {
					this.logService.trace(`auth#doResolveProxyCredentials - exit - received credentials from window ${window.id}`);
					window.win?.webContents.off('ipc-message', proxyAuthResponseHandler);

					// We got credentials from the window
					if (reply) {
						const credentials: Credentials = { username: reply.username, password: reply.password };

						// Update stored credentials based on `remember` flag
						try {
							if (reply.remember) {
								const encryptedSerializedCredentials = await this.encryptionMainService.encrypt(JSON.stringify(credentials));
								this.applicationStorageMainService.store(
									this.PROXY_CREDENTIALS_SERVICE_KEY + authInfoHash,
									encryptedSerializedCredentials,
									StorageScope.APPLICATION,
									// Always store in machine scope because we do not want these values to be synced
									StorageTarget.MACHINE
								);
							} else {
								this.applicationStorageMainService.remove(this.PROXY_CREDENTIALS_SERVICE_KEY + authInfoHash, StorageScope.APPLICATION);
							}
						} catch (error) {
							this.logService.error(error); // handle gracefully
						}

						resolve({ username: credentials.username, password: credentials.password });
					}

					// We did not get any credentials from the window (e.g. cancelled)
					else {
						this.cancelledAuthInfoHashes.add(authInfoHash);
						resolve(undefined);
					}
				}
			};

			window.win?.webContents.on('ipc-message', proxyAuthResponseHandler);
		});

		// Remember credentials for the session in case
		// the credentials are wrong and we show the dialog
		// again
		this.sessionCredentials.set(authInfoHash, loginDialogCredentials);

		return loginDialogCredentials;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/native/electron-main/nativeHostMainService.ts]---
Location: vscode-main/src/vs/platform/native/electron-main/nativeHostMainService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import { exec } from 'child_process';
import { app, BrowserWindow, clipboard, contentTracing, Display, Menu, MessageBoxOptions, MessageBoxReturnValue, OpenDevToolsOptions, OpenDialogOptions, OpenDialogReturnValue, powerMonitor, SaveDialogOptions, SaveDialogReturnValue, screen, shell, webContents } from 'electron';
import { arch, cpus, freemem, loadavg, platform, release, totalmem, type } from 'os';
import { promisify } from 'util';
import { memoize } from '../../../base/common/decorators.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { matchesSomeScheme, Schemas } from '../../../base/common/network.js';
import { dirname, join, posix, resolve, win32 } from '../../../base/common/path.js';
import { isLinux, isMacintosh, isWindows } from '../../../base/common/platform.js';
import { AddFirstParameterToFunctions } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { virtualMachineHint } from '../../../base/node/id.js';
import { Promises, SymlinkSupport } from '../../../base/node/pfs.js';
import { findFreePort, isPortFree } from '../../../base/node/ports.js';
import { localize } from '../../../nls.js';
import { ISerializableCommandAction } from '../../action/common/action.js';
import { INativeOpenDialogOptions } from '../../dialogs/common/dialogs.js';
import { IDialogMainService } from '../../dialogs/electron-main/dialogMainService.js';
import { IEnvironmentMainService } from '../../environment/electron-main/environmentMainService.js';
import { createDecorator, IInstantiationService } from '../../instantiation/common/instantiation.js';
import { ILifecycleMainService, IRelaunchOptions } from '../../lifecycle/electron-main/lifecycleMainService.js';
import { ILogService } from '../../log/common/log.js';
import { FocusMode, ICommonNativeHostService, INativeHostOptions, IOSProperties, IOSStatistics } from '../common/native.js';
import { IProductService } from '../../product/common/productService.js';
import { IPartsSplash } from '../../theme/common/themeService.js';
import { IThemeMainService } from '../../theme/electron-main/themeMainService.js';
import { defaultWindowState, ICodeWindow } from '../../window/electron-main/window.js';
import { IColorScheme, IOpenedAuxiliaryWindow, IOpenedMainWindow, IOpenEmptyWindowOptions, IOpenWindowOptions, IPoint, IRectangle, IWindowOpenable } from '../../window/common/window.js';
import { defaultBrowserWindowOptions, IWindowsMainService, OpenContext } from '../../windows/electron-main/windows.js';
import { isWorkspaceIdentifier, toWorkspaceIdentifier } from '../../workspace/common/workspace.js';
import { IWorkspacesManagementMainService } from '../../workspaces/electron-main/workspacesManagementMainService.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { hasWSLFeatureInstalled } from '../../remote/node/wsl.js';
import { WindowProfiler } from '../../profiling/electron-main/windowProfiling.js';
import { IV8Profile } from '../../profiling/common/profiling.js';
import { IAuxiliaryWindowsMainService } from '../../auxiliaryWindow/electron-main/auxiliaryWindows.js';
import { IAuxiliaryWindow } from '../../auxiliaryWindow/electron-main/auxiliaryWindow.js';
import { CancellationError } from '../../../base/common/errors.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IProxyAuthService } from './auth.js';
import { AuthInfo, Credentials, IRequestService } from '../../request/common/request.js';
import { randomPath } from '../../../base/common/extpath.js';

export interface INativeHostMainService extends AddFirstParameterToFunctions<ICommonNativeHostService, Promise<unknown> /* only methods, not events */, number | undefined /* window ID */> { }

export const INativeHostMainService = createDecorator<INativeHostMainService>('nativeHostMainService');

export class NativeHostMainService extends Disposable implements INativeHostMainService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@IWindowsMainService private readonly windowsMainService: IWindowsMainService,
		@IAuxiliaryWindowsMainService private readonly auxiliaryWindowsMainService: IAuxiliaryWindowsMainService,
		@IDialogMainService private readonly dialogMainService: IDialogMainService,
		@ILifecycleMainService private readonly lifecycleMainService: ILifecycleMainService,
		@IEnvironmentMainService private readonly environmentMainService: IEnvironmentMainService,
		@ILogService private readonly logService: ILogService,
		@IProductService private readonly productService: IProductService,
		@IThemeMainService private readonly themeMainService: IThemeMainService,
		@IWorkspacesManagementMainService private readonly workspacesManagementMainService: IWorkspacesManagementMainService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IRequestService private readonly requestService: IRequestService,
		@IProxyAuthService private readonly proxyAuthService: IProxyAuthService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super();

		// Events
		{
			this.onDidOpenMainWindow = Event.map(this.windowsMainService.onDidOpenWindow, window => window.id);

			this.onDidTriggerWindowSystemContextMenu = Event.any(
				Event.map(this.windowsMainService.onDidTriggerSystemContextMenu, ({ window, x, y }) => ({ windowId: window.id, x, y })),
				Event.map(this.auxiliaryWindowsMainService.onDidTriggerSystemContextMenu, ({ window, x, y }) => ({ windowId: window.id, x, y }))
			);

			this.onDidMaximizeWindow = Event.any(
				Event.map(this.windowsMainService.onDidMaximizeWindow, window => window.id),
				Event.map(this.auxiliaryWindowsMainService.onDidMaximizeWindow, window => window.id)
			);
			this.onDidUnmaximizeWindow = Event.any(
				Event.map(this.windowsMainService.onDidUnmaximizeWindow, window => window.id),
				Event.map(this.auxiliaryWindowsMainService.onDidUnmaximizeWindow, window => window.id)
			);

			this.onDidChangeWindowFullScreen = Event.any(
				Event.map(this.windowsMainService.onDidChangeFullScreen, e => ({ windowId: e.window.id, fullscreen: e.fullscreen })),
				Event.map(this.auxiliaryWindowsMainService.onDidChangeFullScreen, e => ({ windowId: e.window.id, fullscreen: e.fullscreen }))
			);

			this.onDidChangeWindowAlwaysOnTop = Event.any(
				Event.None, // always on top is unsupported in main windows currently
				Event.map(this.auxiliaryWindowsMainService.onDidChangeAlwaysOnTop, e => ({ windowId: e.window.id, alwaysOnTop: e.alwaysOnTop }))
			);

			this.onDidBlurMainWindow = Event.filter(Event.fromNodeEventEmitter(app, 'browser-window-blur', (event, window: BrowserWindow) => window.id), windowId => !!this.windowsMainService.getWindowById(windowId));
			this.onDidFocusMainWindow = Event.any(
				Event.map(Event.filter(Event.map(this.windowsMainService.onDidChangeWindowsCount, () => this.windowsMainService.getLastActiveWindow()), window => !!window), window => window!.id),
				Event.filter(Event.fromNodeEventEmitter(app, 'browser-window-focus', (event, window: BrowserWindow) => window.id), windowId => !!this.windowsMainService.getWindowById(windowId))
			);

			this.onDidBlurMainOrAuxiliaryWindow = Event.any(
				this.onDidBlurMainWindow,
				Event.map(Event.filter(Event.fromNodeEventEmitter(app, 'browser-window-blur', (event, window: BrowserWindow) => this.auxiliaryWindowsMainService.getWindowByWebContents(window.webContents)), window => !!window), window => window!.id)
			);
			this.onDidFocusMainOrAuxiliaryWindow = Event.any(
				this.onDidFocusMainWindow,
				Event.map(Event.filter(Event.fromNodeEventEmitter(app, 'browser-window-focus', (event, window: BrowserWindow) => this.auxiliaryWindowsMainService.getWindowByWebContents(window.webContents)), window => !!window), window => window!.id)
			);

			this.onDidResumeOS = Event.fromNodeEventEmitter(powerMonitor, 'resume');

			this.onDidChangeColorScheme = this.themeMainService.onDidChangeColorScheme;

			this.onDidChangeDisplay = Event.debounce(Event.any(
				Event.filter(Event.fromNodeEventEmitter(screen, 'display-metrics-changed', (event: Electron.Event, display: Display, changedMetrics?: string[]) => changedMetrics), changedMetrics => {
					// Electron will emit 'display-metrics-changed' events even when actually
					// going fullscreen, because the dock hides. However, we do not want to
					// react on this event as there is no change in display bounds.
					return !(Array.isArray(changedMetrics) && changedMetrics.length === 1 && changedMetrics[0] === 'workArea');
				}),
				Event.fromNodeEventEmitter(screen, 'display-added'),
				Event.fromNodeEventEmitter(screen, 'display-removed')
			), () => { }, 100);
		}
	}


	//#region Properties

	get windowId(): never { throw new Error('Not implemented in electron-main'); }

	//#endregion


	//#region Events

	readonly onDidOpenMainWindow: Event<number>;

	readonly onDidTriggerWindowSystemContextMenu: Event<{ windowId: number; x: number; y: number }>;

	readonly onDidMaximizeWindow: Event<number>;
	readonly onDidUnmaximizeWindow: Event<number>;

	readonly onDidChangeWindowFullScreen: Event<{ readonly windowId: number; readonly fullscreen: boolean }>;

	readonly onDidBlurMainWindow: Event<number>;
	readonly onDidFocusMainWindow: Event<number>;

	readonly onDidBlurMainOrAuxiliaryWindow: Event<number>;
	readonly onDidFocusMainOrAuxiliaryWindow: Event<number>;

	readonly onDidChangeWindowAlwaysOnTop: Event<{ readonly windowId: number; readonly alwaysOnTop: boolean }>;

	readonly onDidResumeOS: Event<void>;

	readonly onDidChangeColorScheme: Event<IColorScheme>;

	private readonly _onDidChangePassword = this._register(new Emitter<{ account: string; service: string }>());
	readonly onDidChangePassword = this._onDidChangePassword.event;

	readonly onDidChangeDisplay: Event<void>;

	//#endregion


	//#region Window

	getWindows(windowId: number | undefined, options: { includeAuxiliaryWindows: true }): Promise<Array<IOpenedMainWindow | IOpenedAuxiliaryWindow>>;
	getWindows(windowId: number | undefined, options: { includeAuxiliaryWindows: false }): Promise<Array<IOpenedMainWindow>>;
	async getWindows(windowId: number | undefined, options: { includeAuxiliaryWindows: boolean }): Promise<Array<IOpenedMainWindow | IOpenedAuxiliaryWindow>> {
		const mainWindows = this.windowsMainService.getWindows().map(window => ({
			id: window.id,
			workspace: window.openedWorkspace ?? toWorkspaceIdentifier(window.backupPath, window.isExtensionDevelopmentHost),
			title: window.win?.getTitle() ?? '',
			filename: window.getRepresentedFilename(),
			dirty: window.isDocumentEdited()
		}));

		const auxiliaryWindows = [];
		if (options.includeAuxiliaryWindows) {
			auxiliaryWindows.push(...this.auxiliaryWindowsMainService.getWindows().map(window => ({
				id: window.id,
				parentId: window.parentId,
				title: window.win?.getTitle() ?? '',
				filename: window.getRepresentedFilename()
			})));
		}

		return [...mainWindows, ...auxiliaryWindows];
	}

	async getWindowCount(windowId: number | undefined): Promise<number> {
		return this.windowsMainService.getWindowCount();
	}

	async getActiveWindowId(windowId: number | undefined): Promise<number | undefined> {
		const activeWindow = this.windowsMainService.getFocusedWindow() || this.windowsMainService.getLastActiveWindow();
		if (activeWindow) {
			return activeWindow.id;
		}

		return undefined;
	}

	async getActiveWindowPosition(): Promise<IRectangle | undefined> {
		const activeWindow = this.windowsMainService.getFocusedWindow() || this.windowsMainService.getLastActiveWindow();
		if (activeWindow) {
			return activeWindow.getBounds();
		}
		return undefined;
	}

	async getNativeWindowHandle(fallbackWindowId: number | undefined, windowId: number): Promise<VSBuffer | undefined> {
		const window = this.windowById(windowId, fallbackWindowId);
		if (window?.win) {
			return VSBuffer.wrap(window.win.getNativeWindowHandle());
		}
		return undefined;
	}

	openWindow(windowId: number | undefined, options?: IOpenEmptyWindowOptions): Promise<void>;
	openWindow(windowId: number | undefined, toOpen: IWindowOpenable[], options?: IOpenWindowOptions): Promise<void>;
	openWindow(windowId: number | undefined, arg1?: IOpenEmptyWindowOptions | IWindowOpenable[], arg2?: IOpenWindowOptions): Promise<void> {
		if (Array.isArray(arg1)) {
			return this.doOpenWindow(windowId, arg1, arg2);
		}

		return this.doOpenEmptyWindow(windowId, arg1);
	}

	private async doOpenWindow(windowId: number | undefined, toOpen: IWindowOpenable[], options: IOpenWindowOptions = Object.create(null)): Promise<void> {
		if (toOpen.length > 0) {
			await this.windowsMainService.open({
				context: OpenContext.API,
				contextWindowId: windowId,
				urisToOpen: toOpen,
				cli: this.environmentMainService.args,
				forceNewWindow: options.forceNewWindow,
				forceReuseWindow: options.forceReuseWindow,
				preferNewWindow: options.preferNewWindow,
				diffMode: options.diffMode,
				mergeMode: options.mergeMode,
				addMode: options.addMode,
				removeMode: options.removeMode,
				gotoLineMode: options.gotoLineMode,
				noRecentEntry: options.noRecentEntry,
				waitMarkerFileURI: options.waitMarkerFileURI,
				remoteAuthority: options.remoteAuthority || undefined,
				forceProfile: options.forceProfile,
				forceTempProfile: options.forceTempProfile,
			});
		}
	}

	private async doOpenEmptyWindow(windowId: number | undefined, options?: IOpenEmptyWindowOptions): Promise<void> {
		await this.windowsMainService.openEmptyWindow({
			context: OpenContext.API,
			contextWindowId: windowId
		}, options);
	}

	async isFullScreen(windowId: number | undefined, options?: INativeHostOptions): Promise<boolean> {
		const window = this.windowById(options?.targetWindowId, windowId);
		return window?.isFullScreen ?? false;
	}

	async toggleFullScreen(windowId: number | undefined, options?: INativeHostOptions): Promise<void> {
		const window = this.windowById(options?.targetWindowId, windowId);
		window?.toggleFullScreen();
	}

	async getCursorScreenPoint(windowId: number | undefined): Promise<{ readonly point: IPoint; readonly display: IRectangle }> {
		const point = screen.getCursorScreenPoint();
		const display = screen.getDisplayNearestPoint(point);

		return { point, display: display.bounds };
	}

	async isMaximized(windowId: number | undefined, options?: INativeHostOptions): Promise<boolean> {
		const window = this.windowById(options?.targetWindowId, windowId);
		return window?.win?.isMaximized() ?? false;
	}

	async maximizeWindow(windowId: number | undefined, options?: INativeHostOptions): Promise<void> {
		const window = this.windowById(options?.targetWindowId, windowId);
		window?.win?.maximize();
	}

	async unmaximizeWindow(windowId: number | undefined, options?: INativeHostOptions): Promise<void> {
		const window = this.windowById(options?.targetWindowId, windowId);
		window?.win?.unmaximize();
	}

	async minimizeWindow(windowId: number | undefined, options?: INativeHostOptions): Promise<void> {
		const window = this.windowById(options?.targetWindowId, windowId);
		window?.win?.minimize();
	}

	async moveWindowTop(windowId: number | undefined, options?: INativeHostOptions): Promise<void> {
		const window = this.windowById(options?.targetWindowId, windowId);
		window?.win?.moveTop();
	}

	async isWindowAlwaysOnTop(windowId: number | undefined, options?: INativeHostOptions): Promise<boolean> {
		const window = this.windowById(options?.targetWindowId, windowId);
		return window?.win?.isAlwaysOnTop() ?? false;
	}

	async toggleWindowAlwaysOnTop(windowId: number | undefined, options?: INativeHostOptions): Promise<void> {
		const window = this.windowById(options?.targetWindowId, windowId);
		window?.win?.setAlwaysOnTop(!window.win.isAlwaysOnTop());
	}

	async setWindowAlwaysOnTop(windowId: number | undefined, alwaysOnTop: boolean, options?: INativeHostOptions): Promise<void> {
		const window = this.windowById(options?.targetWindowId, windowId);
		window?.win?.setAlwaysOnTop(alwaysOnTop);
	}

	async positionWindow(windowId: number | undefined, position: IRectangle, options?: INativeHostOptions): Promise<void> {
		const window = this.windowById(options?.targetWindowId, windowId);
		if (window?.win) {
			if (window.win.isFullScreen()) {
				const fullscreenLeftFuture = Event.toPromise(Event.once(Event.fromNodeEventEmitter(window.win, 'leave-full-screen')));
				window.win.setFullScreen(false);
				await fullscreenLeftFuture;
			}

			window.win.setBounds(position);
		}
	}

	async updateWindowControls(windowId: number | undefined, options: INativeHostOptions & { height?: number; backgroundColor?: string; foregroundColor?: string }): Promise<void> {
		const window = this.windowById(options?.targetWindowId, windowId);
		window?.updateWindowControls(options);
	}

	async updateWindowAccentColor(windowId: number | undefined, color: 'default' | 'off' | string, inactiveColor: string | undefined): Promise<void> {
		if (!isWindows) {
			return; // windows only
		}

		const window = this.windowById(windowId);
		if (!window) {
			return;
		}

		let activeWindowAccentColor: string | boolean | null;
		let inactiveWindowAccentColor: string | boolean | null;

		if (color === 'default') {
			activeWindowAccentColor = null;
			inactiveWindowAccentColor = null;
		} else if (color === 'off') {
			activeWindowAccentColor = false;
			inactiveWindowAccentColor = false;
		} else {
			activeWindowAccentColor = color;
			inactiveWindowAccentColor = inactiveColor ?? color;
		}

		const windows = [window];
		for (const auxiliaryWindow of this.auxiliaryWindowsMainService.getWindows()) {
			if (auxiliaryWindow.parentId === windowId) {
				windows.push(auxiliaryWindow);
			}
		}

		for (const window of windows) {
			window.win?.setAccentColor(window.win.isFocused() ? activeWindowAccentColor : inactiveWindowAccentColor);
		}
	}

	async focusWindow(windowId: number | undefined, options?: INativeHostOptions & { mode?: FocusMode }): Promise<void> {
		const window = this.windowById(options?.targetWindowId, windowId);
		window?.focus({ mode: options?.mode ?? FocusMode.Transfer });
	}

	async setMinimumSize(windowId: number | undefined, width: number | undefined, height: number | undefined): Promise<void> {
		const window = this.codeWindowById(windowId);
		if (window?.win) {
			const [windowWidth, windowHeight] = window.win.getSize();
			const [minWindowWidth, minWindowHeight] = window.win.getMinimumSize();
			const [newMinWindowWidth, newMinWindowHeight] = [width ?? minWindowWidth, height ?? minWindowHeight];
			const [newWindowWidth, newWindowHeight] = [Math.max(windowWidth, newMinWindowWidth), Math.max(windowHeight, newMinWindowHeight)];

			if (minWindowWidth !== newMinWindowWidth || minWindowHeight !== newMinWindowHeight) {
				window.win.setMinimumSize(newMinWindowWidth, newMinWindowHeight);
			}
			if (windowWidth !== newWindowWidth || windowHeight !== newWindowHeight) {
				window.win.setSize(newWindowWidth, newWindowHeight);
			}
		}
	}

	async saveWindowSplash(windowId: number | undefined, splash: IPartsSplash): Promise<void> {
		const window = this.codeWindowById(windowId);

		this.themeMainService.saveWindowSplash(windowId, window?.openedWorkspace, splash);
	}

	async setBackgroundThrottling(windowId: number | undefined, allowed: boolean): Promise<void> {
		const window = this.codeWindowById(windowId);

		this.logService.trace(`Setting background throttling for window ${windowId} to '${allowed}'`);

		window?.win?.webContents?.setBackgroundThrottling(allowed);
	}

	//#endregion


	//#region macOS Shell Command

	async installShellCommand(windowId: number | undefined): Promise<void> {
		const { source, target } = await this.getShellCommandLink();

		// Only install unless already existing
		try {
			const { symbolicLink } = await SymlinkSupport.stat(source);
			if (symbolicLink && !symbolicLink.dangling) {
				const linkTargetRealPath = await Promises.realpath(source);
				if (target === linkTargetRealPath) {
					return;
				}
			}
		} catch (error) {
			if (error.code !== 'ENOENT') {
				throw error; // throw on any error but file not found
			}
		}

		await this.installShellCommandWithPrivileges(windowId, source, target);
	}

	private async installShellCommandWithPrivileges(windowId: number | undefined, source: string, target: string): Promise<void> {
		const { response } = await this.showMessageBox(windowId, {
			type: 'info',
			message: localize('warnEscalation', "{0} will now prompt with 'osascript' for Administrator privileges to install the shell command.", this.productService.nameShort),
			buttons: [
				localize({ key: 'ok', comment: ['&& denotes a mnemonic'] }, "&&OK"),
				localize('cancel', "Cancel")
			]
		});

		if (response === 1 /* Cancel */) {
			throw new CancellationError();
		}

		try {
			const command = `osascript -e "do shell script \\"mkdir -p /usr/local/bin && ln -sf \'${target}\' \'${source}\'\\" with administrator privileges"`;
			await promisify(exec)(command);
		} catch (error) {
			throw new Error(localize('cantCreateBinFolder', "Unable to install the shell command '{0}'.", source));
		}
	}

	async uninstallShellCommand(windowId: number | undefined): Promise<void> {
		const { source } = await this.getShellCommandLink();

		try {
			await fs.promises.unlink(source);
		} catch (error) {
			switch (error.code) {
				case 'EACCES': {
					const { response } = await this.showMessageBox(windowId, {
						type: 'info',
						message: localize('warnEscalationUninstall', "{0} will now prompt with 'osascript' for Administrator privileges to uninstall the shell command.", this.productService.nameShort),
						buttons: [
							localize({ key: 'ok', comment: ['&& denotes a mnemonic'] }, "&&OK"),
							localize('cancel', "Cancel")
						]
					});

					if (response === 1 /* Cancel */) {
						throw new CancellationError();
					}

					try {
						const command = `osascript -e "do shell script \\"rm \'${source}\'\\" with administrator privileges"`;
						await promisify(exec)(command);
					} catch (error) {
						throw new Error(localize('cantUninstall', "Unable to uninstall the shell command '{0}'.", source));
					}
					break;
				}
				case 'ENOENT':
					break; // ignore file not found
				default:
					throw error;
			}
		}
	}

	private async getShellCommandLink(): Promise<{ readonly source: string; readonly target: string }> {
		const target = resolve(this.environmentMainService.appRoot, 'bin', 'code');
		const source = `/usr/local/bin/${this.productService.applicationName}`;

		// Ensure source exists
		const sourceExists = await Promises.exists(target);
		if (!sourceExists) {
			throw new Error(localize('sourceMissing', "Unable to find shell script in '{0}'", target));
		}

		return { source, target };
	}

	//#endregion

	//#region Dialog

	async showMessageBox(windowId: number | undefined, options: MessageBoxOptions & INativeHostOptions): Promise<MessageBoxReturnValue> {
		const window = this.windowById(options?.targetWindowId, windowId);
		return this.dialogMainService.showMessageBox(options, window?.win ?? undefined);
	}

	async showSaveDialog(windowId: number | undefined, options: SaveDialogOptions & INativeHostOptions): Promise<SaveDialogReturnValue> {
		const window = this.windowById(options?.targetWindowId, windowId);
		return this.dialogMainService.showSaveDialog(options, window?.win ?? undefined);
	}

	async showOpenDialog(windowId: number | undefined, options: OpenDialogOptions & INativeHostOptions): Promise<OpenDialogReturnValue> {
		const window = this.windowById(options?.targetWindowId, windowId);
		return this.dialogMainService.showOpenDialog(options, window?.win ?? undefined);
	}

	async pickFileFolderAndOpen(windowId: number | undefined, options: INativeOpenDialogOptions): Promise<void> {
		const paths = await this.dialogMainService.pickFileFolder(options);
		if (paths) {
			await this.doOpenPicked(await Promise.all(paths.map(async path => (await SymlinkSupport.existsDirectory(path)) ? { folderUri: URI.file(path) } : { fileUri: URI.file(path) })), options, windowId);
		}
	}

	async pickFolderAndOpen(windowId: number | undefined, options: INativeOpenDialogOptions): Promise<void> {
		const paths = await this.dialogMainService.pickFolder(options);
		if (paths) {
			await this.doOpenPicked(paths.map(path => ({ folderUri: URI.file(path) })), options, windowId);
		}
	}

	async pickFileAndOpen(windowId: number | undefined, options: INativeOpenDialogOptions): Promise<void> {
		const paths = await this.dialogMainService.pickFile(options);
		if (paths) {
			await this.doOpenPicked(paths.map(path => ({ fileUri: URI.file(path) })), options, windowId);
		}
	}

	async pickWorkspaceAndOpen(windowId: number | undefined, options: INativeOpenDialogOptions): Promise<void> {
		const paths = await this.dialogMainService.pickWorkspace(options);
		if (paths) {
			await this.doOpenPicked(paths.map(path => ({ workspaceUri: URI.file(path) })), options, windowId);
		}
	}

	private async doOpenPicked(openable: IWindowOpenable[], options: INativeOpenDialogOptions, windowId: number | undefined): Promise<void> {
		await this.windowsMainService.open({
			context: OpenContext.DIALOG,
			contextWindowId: windowId,
			cli: this.environmentMainService.args,
			urisToOpen: openable,
			forceNewWindow: options.forceNewWindow,
			/* remoteAuthority will be determined based on openable */
		});
	}

	//#endregion


	//#region OS

	async showItemInFolder(windowId: number | undefined, path: string): Promise<void> {
		shell.showItemInFolder(path);
	}

	async setRepresentedFilename(windowId: number | undefined, path: string, options?: INativeHostOptions): Promise<void> {
		const window = this.windowById(options?.targetWindowId, windowId);
		window?.setRepresentedFilename(path);
	}

	async setDocumentEdited(windowId: number | undefined, edited: boolean, options?: INativeHostOptions): Promise<void> {
		const window = this.windowById(options?.targetWindowId, windowId);
		window?.setDocumentEdited(edited);
	}

	async openExternal(windowId: number | undefined, url: string, defaultApplication?: string): Promise<boolean> {
		this.environmentMainService.unsetSnapExportedVariables();
		try {
			if (matchesSomeScheme(url, Schemas.http, Schemas.https)) {
				this.openExternalBrowser(windowId, url, defaultApplication);
			} else {
				this.doOpenShellExternal(windowId, url);
			}
		} finally {
			this.environmentMainService.restoreSnapExportedVariables();
		}

		return true;
	}

	private async openExternalBrowser(windowId: number | undefined, url: string, defaultApplication?: string): Promise<void> {
		const configuredBrowser = defaultApplication ?? this.configurationService.getValue<string>('workbench.externalBrowser');
		if (!configuredBrowser) {
			return this.doOpenShellExternal(windowId, url);
		}

		if (configuredBrowser.includes(posix.sep) || configuredBrowser.includes(win32.sep)) {
			const browserPathExists = await Promises.exists(configuredBrowser);
			if (!browserPathExists) {
				this.logService.error(`Configured external browser path does not exist: ${configuredBrowser}`);
				return this.doOpenShellExternal(windowId, url);
			}
		}

		try {
			const { default: open, apps } = await import('open');
			const res = await open(url, {
				app: {
					// Use `open.apps` helper to allow cross-platform browser
					// aliases to be looked up properly. Fallback to the
					// configured value if not found.
					name: Object.hasOwn(apps, configuredBrowser) ? apps[(configuredBrowser as keyof typeof apps)] : configuredBrowser
				}
			});

			if (!isWindows) {
				// On Linux/macOS, listen to stderr and treat that as failure
				// for opening the browser to fallback to the default.
				// On Windows, unfortunately PowerShell seems to always write
				// to stderr so we cannot use it there
				// (see also https://github.com/microsoft/vscode/issues/230636)
				res.stderr?.once('data', (data: Buffer) => {
					this.logService.error(`Error openening external URL '${url}' using browser '${configuredBrowser}': ${data.toString()}`);
					return this.doOpenShellExternal(windowId, url);
				});
			}
		} catch (error) {
			this.logService.error(`Unable to open external URL '${url}' using browser '${configuredBrowser}' due to ${error}.`);
			return this.doOpenShellExternal(windowId, url);
		}
	}

	private async doOpenShellExternal(windowId: number | undefined, url: string): Promise<void> {
		try {
			await shell.openExternal(url);
		} catch (error) {
			let isLink: boolean;
			let message: string;
			if (matchesSomeScheme(url, Schemas.http, Schemas.https)) {
				isLink = true;
				message = localize('openExternalErrorLinkMessage', "An error occurred opening a link in your default browser.");
			} else {
				isLink = false;
				message = localize('openExternalProgramErrorMessage', "An error occurred opening an external program.");
			}

			const { response } = await this.dialogMainService.showMessageBox({
				type: 'error',
				message,
				detail: error.message,
				buttons: isLink ? [
					localize({ key: 'copyLink', comment: ['&& denotes a mnemonic'] }, "&&Copy Link"),
					localize('cancel', "Cancel")
				] : [
					localize({ key: 'ok', comment: ['&& denotes a mnemonic'] }, "&&OK")
				]
			}, this.windowById(windowId)?.win ?? undefined);

			if (response === 1 /* Cancel */) {
				return;
			}

			this.writeClipboardText(windowId, url);
		}
	}

	moveItemToTrash(windowId: number | undefined, fullPath: string): Promise<void> {
		return shell.trashItem(fullPath);
	}

	async isAdmin(): Promise<boolean> {
		let isAdmin: boolean;
		if (isWindows) {
			isAdmin = (await import('native-is-elevated')).default();
		} else {
			isAdmin = process.getuid?.() === 0;
		}

		return isAdmin;
	}

	async writeElevated(windowId: number | undefined, source: URI, target: URI, options?: { unlock?: boolean }): Promise<void> {
		const sudoPrompt = await import('@vscode/sudo-prompt');

		const argsFile = randomPath(this.environmentMainService.userDataPath, 'code-elevated');
		await Promises.writeFile(argsFile, JSON.stringify({ source: source.fsPath, target: target.fsPath }));

		try {
			await new Promise<void>((resolve, reject) => {
				const sudoCommand: string[] = [`"${this.cliPath}"`];
				if (options?.unlock) {
					sudoCommand.push('--file-chmod');
				}

				sudoCommand.push('--file-write', `"${argsFile}"`);

				const promptOptions = {
					name: this.productService.nameLong.replace('-', ''),
					icns: (isMacintosh && this.environmentMainService.isBuilt) ? join(dirname(this.environmentMainService.appRoot), `${this.productService.nameShort}.icns`) : undefined
				};

				this.logService.trace(`[sudo-prompt] running command: ${sudoCommand.join(' ')}`);

				sudoPrompt.exec(sudoCommand.join(' '), promptOptions, (error?, stdout?, stderr?) => {
					if (stdout) {
						this.logService.trace(`[sudo-prompt] received stdout: ${stdout}`);
					}

					if (stderr) {
						this.logService.error(`[sudo-prompt] received stderr: ${stderr}`);
					}

					if (error) {
						reject(error);
					} else {
						resolve(undefined);
					}
				});
			});
		} finally {
			await fs.promises.unlink(argsFile);
		}
	}

	async isRunningUnderARM64Translation(): Promise<boolean> {
		if (isLinux || isWindows) {
			return false;
		}

		return app.runningUnderARM64Translation;
	}

	@memoize
	private get cliPath(): string {

		// Windows
		if (isWindows) {
			if (this.environmentMainService.isBuilt) {
				return join(dirname(process.execPath), 'bin', `${this.productService.applicationName}.cmd`);
			}

			return join(this.environmentMainService.appRoot, 'scripts', 'code-cli.bat');
		}

		// Linux
		if (isLinux) {
			if (this.environmentMainService.isBuilt) {
				return join(dirname(process.execPath), 'bin', `${this.productService.applicationName}`);
			}

			return join(this.environmentMainService.appRoot, 'scripts', 'code-cli.sh');
		}

		// macOS
		if (this.environmentMainService.isBuilt) {
			return join(this.environmentMainService.appRoot, 'bin', 'code');
		}

		return join(this.environmentMainService.appRoot, 'scripts', 'code-cli.sh');
	}

	async getOSStatistics(): Promise<IOSStatistics> {
		return {
			totalmem: totalmem(),
			freemem: freemem(),
			loadavg: loadavg()
		};
	}

	async getOSProperties(): Promise<IOSProperties> {
		return {
			arch: arch(),
			platform: platform(),
			release: release(),
			type: type(),
			cpus: cpus()
		};
	}

	async getOSVirtualMachineHint(): Promise<number> {
		return virtualMachineHint.value();
	}

	async getOSColorScheme(): Promise<IColorScheme> {
		return this.themeMainService.getColorScheme();
	}

	// WSL
	async hasWSLFeatureInstalled(): Promise<boolean> {
		return isWindows && hasWSLFeatureInstalled();
	}

	//#endregion


	//#region Screenshots

	async getScreenshot(windowId: number | undefined, rect?: IRectangle, options?: INativeHostOptions): Promise<VSBuffer | undefined> {
		const window = this.windowById(options?.targetWindowId, windowId);
		const captured = await window?.win?.webContents.capturePage(rect);

		const buf = captured?.toJPEG(95);
		return buf && VSBuffer.wrap(buf);
	}

	//#endregion


	//#region Process

	async getProcessId(windowId: number | undefined): Promise<number | undefined> {
		const window = this.windowById(undefined, windowId);
		return window?.win?.webContents.getOSProcessId();
	}

	async killProcess(windowId: number | undefined, pid: number, code: string): Promise<void> {
		process.kill(pid, code);
	}

	//#endregion


	//#region Clipboard

	async readClipboardText(windowId: number | undefined, type?: 'selection' | 'clipboard'): Promise<string> {
		this.logService.trace(`readClipboardText in window ${windowId} with type:`, type);
		const clipboardText = clipboard.readText(type);
		this.logService.trace(`clipboardText.length :`, clipboardText.length);
		return clipboardText;
	}

	async triggerPaste(windowId: number | undefined, options?: INativeHostOptions): Promise<void> {
		this.logService.trace(`Triggering paste in window ${windowId} with options:`, options);
		const window = this.windowById(options?.targetWindowId, windowId);
		return window?.win?.webContents.paste() ?? Promise.resolve();
	}

	async readImage(): Promise<Uint8Array> {
		return clipboard.readImage().toPNG();
	}

	async writeClipboardText(windowId: number | undefined, text: string, type?: 'selection' | 'clipboard'): Promise<void> {
		return clipboard.writeText(text, type);
	}

	async readClipboardFindText(windowId: number | undefined,): Promise<string> {
		return clipboard.readFindText();
	}

	async writeClipboardFindText(windowId: number | undefined, text: string): Promise<void> {
		return clipboard.writeFindText(text);
	}

	async writeClipboardBuffer(windowId: number | undefined, format: string, buffer: VSBuffer, type?: 'selection' | 'clipboard'): Promise<void> {
		return clipboard.writeBuffer(format, Buffer.from(buffer.buffer), type);
	}

	async readClipboardBuffer(windowId: number | undefined, format: string): Promise<VSBuffer> {
		return VSBuffer.wrap(clipboard.readBuffer(format));
	}

	async hasClipboard(windowId: number | undefined, format: string, type?: 'selection' | 'clipboard'): Promise<boolean> {
		return clipboard.has(format, type);
	}

	//#endregion


	//#region macOS Touchbar

	async newWindowTab(): Promise<void> {
		await this.windowsMainService.open({
			context: OpenContext.API,
			cli: this.environmentMainService.args,
			forceNewTabbedWindow: true,
			forceEmpty: true,
			remoteAuthority: this.environmentMainService.args.remote || undefined
		});
	}

	async showPreviousWindowTab(): Promise<void> {
		Menu.sendActionToFirstResponder('selectPreviousTab:');
	}

	async showNextWindowTab(): Promise<void> {
		Menu.sendActionToFirstResponder('selectNextTab:');
	}

	async moveWindowTabToNewWindow(): Promise<void> {
		Menu.sendActionToFirstResponder('moveTabToNewWindow:');
	}

	async mergeAllWindowTabs(): Promise<void> {
		Menu.sendActionToFirstResponder('mergeAllWindows:');
	}

	async toggleWindowTabsBar(): Promise<void> {
		Menu.sendActionToFirstResponder('toggleTabBar:');
	}

	async updateTouchBar(windowId: number | undefined, items: ISerializableCommandAction[][]): Promise<void> {
		const window = this.codeWindowById(windowId);
		window?.updateTouchBar(items);
	}

	//#endregion


	//#region Lifecycle

	async notifyReady(windowId: number | undefined): Promise<void> {
		const window = this.codeWindowById(windowId);
		window?.setReady();
	}

	async relaunch(windowId: number | undefined, options?: IRelaunchOptions): Promise<void> {
		return this.lifecycleMainService.relaunch(options);
	}

	async reload(windowId: number | undefined, options?: { disableExtensions?: boolean }): Promise<void> {
		const window = this.codeWindowById(windowId);
		if (window) {

			// Special case: support `transient` workspaces by preventing
			// the reload and rather go back to an empty window. Transient
			// workspaces should never restore, even when the user wants
			// to reload.
			// For: https://github.com/microsoft/vscode/issues/119695
			if (isWorkspaceIdentifier(window.openedWorkspace)) {
				const configPath = window.openedWorkspace.configPath;
				if (configPath.scheme === Schemas.file) {
					const workspace = await this.workspacesManagementMainService.resolveLocalWorkspace(configPath);
					if (workspace?.transient) {
						return this.openWindow(window.id, { forceReuseWindow: true });
					}
				}
			}

			// Proceed normally to reload the window
			return this.lifecycleMainService.reload(window, options?.disableExtensions !== undefined ? { _: [], 'disable-extensions': options.disableExtensions } : undefined);
		}
	}

	async closeWindow(windowId: number | undefined, options?: INativeHostOptions): Promise<void> {
		const window = this.windowById(options?.targetWindowId, windowId);
		return window?.win?.close();
	}

	async quit(windowId: number | undefined): Promise<void> {

		// If the user selected to exit from an extension development host window, do not quit, but just
		// close the window unless this is the last window that is opened.
		const window = this.windowsMainService.getLastActiveWindow();
		if (window?.isExtensionDevelopmentHost && this.windowsMainService.getWindowCount() > 1 && window.win) {
			window.win.close();
		}

		// Otherwise: normal quit
		else {
			this.lifecycleMainService.quit();
		}
	}

	async exit(windowId: number | undefined, code: number): Promise<void> {
		await this.lifecycleMainService.kill(code);
	}

	//#endregion


	//#region Connectivity

	async resolveProxy(windowId: number | undefined, url: string): Promise<string | undefined> {
		const window = this.codeWindowById(windowId);
		const session = window?.win?.webContents?.session;

		return session?.resolveProxy(url);
	}

	async lookupAuthorization(_windowId: number | undefined, authInfo: AuthInfo): Promise<Credentials | undefined> {
		return this.proxyAuthService.lookupAuthorization(authInfo);
	}

	async lookupKerberosAuthorization(_windowId: number | undefined, url: string): Promise<string | undefined> {
		return this.requestService.lookupKerberosAuthorization(url);
	}

	async loadCertificates(_windowId: number | undefined): Promise<string[]> {
		return this.requestService.loadCertificates();
	}

	isPortFree(windowId: number | undefined, port: number): Promise<boolean> {
		return isPortFree(port, 1_000);
	}

	findFreePort(windowId: number | undefined, startPort: number, giveUpAfter: number, timeout: number, stride = 1): Promise<number> {
		return findFreePort(startPort, giveUpAfter, timeout, stride);
	}

	//#endregion


	//#region Development

	private gpuInfoWindowId: number | undefined;
	private contentTracingWindowId: number | undefined;

	async openDevTools(windowId: number | undefined, options?: Partial<OpenDevToolsOptions> & INativeHostOptions): Promise<void> {
		const window = this.windowById(options?.targetWindowId, windowId);
		window?.win?.webContents.openDevTools(options?.mode ? { mode: options.mode, activate: options.activate } : undefined);
	}

	async toggleDevTools(windowId: number | undefined, options?: INativeHostOptions): Promise<void> {
		const window = this.windowById(options?.targetWindowId, windowId);
		window?.win?.webContents.toggleDevTools();
	}

	async openDevToolsWindow(windowId: number | undefined, url: string): Promise<void> {
		const parentWindow = this.codeWindowById(windowId);
		if (!parentWindow) {
			return;
		}

		this.openChildWindow(parentWindow.win, url);
	}

	private openChildWindow(parentWindow: BrowserWindow | null, url: string, overrideWindowOptions: Electron.BrowserWindowConstructorOptions = {}): BrowserWindow {
		const options = this.instantiationService.invokeFunction(defaultBrowserWindowOptions, defaultWindowState(), { forceNativeTitlebar: true });

		const windowOptions: Electron.BrowserWindowConstructorOptions = {
			...options,
			parent: parentWindow ?? undefined,
			...overrideWindowOptions
		};

		const window = new BrowserWindow(windowOptions);
		window.setMenuBarVisibility(false);
		window.loadURL(url);

		window.once('ready-to-show', () => window.show());

		return window;
	}

	async openGPUInfoWindow(windowId: number | undefined): Promise<void> {
		const parentWindow = this.codeWindowById(windowId);
		if (!parentWindow) {
			return;
		}

		if (typeof this.gpuInfoWindowId !== 'number') {
			const gpuInfoWindow = this.openChildWindow(parentWindow.win, 'chrome://gpu');
			gpuInfoWindow.once('close', () => this.gpuInfoWindowId = undefined);

			this.gpuInfoWindowId = gpuInfoWindow.id;
		}

		if (typeof this.gpuInfoWindowId === 'number') {
			const window = BrowserWindow.fromId(this.gpuInfoWindowId);
			if (window?.isMinimized()) {
				window?.restore();
			}
			window?.focus();
		}
	}

	async openContentTracingWindow(): Promise<void> {
		if (typeof this.contentTracingWindowId !== 'number') {
			// Disable ready-to-show event with paintWhenInitiallyHidden to
			// customize content tracing window below.
			const contentTracingWindow = this.openChildWindow(null, 'chrome://tracing', {
				paintWhenInitiallyHidden: false,
				webPreferences: {
					backgroundThrottling: false
				}
			});
			contentTracingWindow.webContents.once('did-finish-load', async () => {
				// Mock window.prompt to support save action from the tracing UI
				// since Electron by default doesn't provide the api.
				// See requestFilename_ implementation under
				// https://source.chromium.org/chromium/chromium/src/+/main:third_party/catapult/tracing/tracing/ui/extras/about_tracing/profiling_view.html;l=334-379
				await contentTracingWindow.webContents.executeJavaScript(`
					window.prompt = () => '';
					null
				`);
				contentTracingWindow.show();
			});
			contentTracingWindow.once('close', () => this.contentTracingWindowId = undefined);
			this.contentTracingWindowId = contentTracingWindow.id;
		}

		if (typeof this.contentTracingWindowId === 'number') {
			const window = BrowserWindow.fromId(this.contentTracingWindowId);
			if (window?.isMinimized()) {
				window?.restore();
			}
			window?.focus();
		}
	}

	async stopTracing(windowId: number | undefined): Promise<void> {
		if (!this.environmentMainService.args.trace) {
			return; // requires tracing to be on
		}

		const path = await contentTracing.stopRecording(`${randomPath(this.environmentMainService.userHome.fsPath, this.productService.applicationName)}.trace.txt`);

		// Inform user to report an issue
		await this.dialogMainService.showMessageBox({
			type: 'info',
			message: localize('trace.message', "Successfully created the trace file"),
			detail: localize('trace.detail', "Please create an issue and manually attach the following file:\n{0}", path),
			buttons: [localize({ key: 'trace.ok', comment: ['&& denotes a mnemonic'] }, "&&OK")],
		}, BrowserWindow.getFocusedWindow() ?? undefined);

		// Show item in explorer
		this.showItemInFolder(undefined, path);
	}

	//#endregion

	// #region Performance

	async profileRenderer(windowId: number | undefined, session: string, duration: number): Promise<IV8Profile> {
		const window = this.codeWindowById(windowId);
		if (!window?.win) {
			throw new Error();
		}

		const profiler = new WindowProfiler(window.win, session, this.logService);
		const result = await profiler.inspect(duration);
		return result;
	}

	// #endregion

	//#region Registry (windows)

	async windowsGetStringRegKey(windowId: number | undefined, hive: 'HKEY_CURRENT_USER' | 'HKEY_LOCAL_MACHINE' | 'HKEY_CLASSES_ROOT' | 'HKEY_USERS' | 'HKEY_CURRENT_CONFIG', path: string, name: string): Promise<string | undefined> {
		if (!isWindows) {
			return undefined;
		}

		const Registry = await import('@vscode/windows-registry');
		try {
			return Registry.GetStringRegKey(hive, path, name);
		} catch {
			return undefined;
		}
	}

	//#endregion

	private windowById(windowId: number | undefined, fallbackCodeWindowId?: number): ICodeWindow | IAuxiliaryWindow | undefined {
		return this.codeWindowById(windowId) ?? this.auxiliaryWindowById(windowId) ?? this.codeWindowById(fallbackCodeWindowId);
	}

	private codeWindowById(windowId: number | undefined): ICodeWindow | undefined {
		if (typeof windowId !== 'number') {
			return undefined;
		}

		return this.windowsMainService.getWindowById(windowId);
	}

	private auxiliaryWindowById(windowId: number | undefined): IAuxiliaryWindow | undefined {
		if (typeof windowId !== 'number') {
			return undefined;
		}

		const contents = webContents.fromId(windowId);
		if (!contents) {
			return undefined;
		}

		return this.auxiliaryWindowsMainService.getWindowByWebContents(contents);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/notification/common/notification.ts]---
Location: vscode-main/src/vs/platform/notification/common/notification.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../nls.js';
import { IAction } from '../../../base/common/actions.js';
import { Event } from '../../../base/common/event.js';
import BaseSeverity from '../../../base/common/severity.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export import Severity = BaseSeverity;

export const INotificationService = createDecorator<INotificationService>('notificationService');

export type NotificationMessage = string | Error;

export enum NotificationPriority {

	/**
	 * Default priority: notification will be visible unless do not disturb mode is enabled.
	 */
	DEFAULT,

	/**
	 * Optional priority: notification might only be visible from the notifications center.
	 */
	OPTIONAL,

	/**
	 * Silent priority: notification will only be visible from the notifications center.
	 */
	SILENT,

	/**
	 * Urgent priority: notification will be visible even when do not disturb mode is enabled.
	 */
	URGENT
}

export interface INotificationProperties {

	/**
	 * Sticky notifications are not automatically removed after a certain timeout.
	 *
	 * Currently, only 2 kinds of notifications are sticky:
	 * - Error notifications with primary actions
	 * - Notifications that show progress
	 */
	readonly sticky?: boolean;

	/**
	 * Allows to override the priority of the notification based on needs.
	 */
	readonly priority?: NotificationPriority;

	/**
	 * Adds an action to never show the notification again. The choice will be persisted
	 * such as future requests will not cause the notification to show again.
	 */
	readonly neverShowAgain?: INeverShowAgainOptions;
}

export enum NeverShowAgainScope {

	/**
	 * Will never show this notification on the current workspace again.
	 */
	WORKSPACE,

	/**
	 * Will never show this notification on any workspace of the same
	 * profile again.
	 */
	PROFILE,

	/**
	 * Will never show this notification on any workspace across all
	 * profiles again.
	 */
	APPLICATION
}

export interface INeverShowAgainOptions {

	/**
	 * The id is used to persist the selection of not showing the notification again.
	 */
	readonly id: string;

	/**
	 * By default the action will show up as primary action. Setting this to true will
	 * make it a secondary action instead.
	 */
	readonly isSecondary?: boolean;

	/**
	 * Whether to persist the choice in the current workspace or for all workspaces. By
	 * default it will be persisted for all workspaces across all profiles
	 * (= `NeverShowAgainScope.APPLICATION`).
	 */
	readonly scope?: NeverShowAgainScope;
}

export interface INotificationSource {

	/**
	 * The id of the source.
	 */
	readonly id: string;

	/**
	 * The label of the source.
	 */
	readonly label: string;
}

export function isNotificationSource(thing: unknown): thing is INotificationSource {
	if (thing) {
		const candidate = thing as INotificationSource;

		return typeof candidate.id === 'string' && typeof candidate.label === 'string';
	}

	return false;
}

export interface INotification extends INotificationProperties {

	/**
	 * The id of the notification. If provided, will be used to compare
	 * notifications with others to decide whether a notification is
	 * duplicate or not.
	 */
	readonly id?: string;

	/**
	 * The severity of the notification. Either `Info`, `Warning` or `Error`.
	 */
	readonly severity: Severity;

	/**
	 * The message of the notification. This can either be a `string` or `Error`. Messages
	 * can optionally include links in the format: `[text](link)`
	 */
	readonly message: NotificationMessage;

	/**
	 * The source of the notification appears as additional information.
	 */
	readonly source?: string | INotificationSource;

	/**
	 * Actions to show as part of the notification. Primary actions show up as
	 * buttons as part of the message and will close the notification once clicked.
	 *
	 * Secondary actions are meant to provide additional configuration or context
	 * for the notification and will show up less prominent. A notification does not
	 * close automatically when invoking a secondary action.
	 *
	 * **Note:** If your intent is to show a message with actions to the user, consider
	 * the `INotificationService.prompt()` method instead which are optimized for
	 * this usecase and much easier to use!
	 */
	actions?: INotificationActions;

	/**
	 * The initial set of progress properties for the notification. To update progress
	 * later on, access the `INotificationHandle.progress` property.
	 */
	readonly progress?: INotificationProgressProperties;
}

export interface INotificationActions {

	/**
	 * Primary actions show up as buttons as part of the message and will close
	 * the notification once clicked.
	 *
	 * Pass `ActionWithMenuAction` for an action that has additional menu actions.
	 */
	readonly primary?: readonly IAction[];

	/**
	 * Secondary actions are meant to provide additional configuration or context
	 * for the notification and will show up less prominent. A notification does not
	 * close automatically when invoking a secondary action.
	 */
	readonly secondary?: readonly IAction[];
}

export interface INotificationProgressProperties {

	/**
	 * Causes the progress bar to spin infinitley.
	 */
	readonly infinite?: boolean;

	/**
	 * Indicate the total amount of work.
	 */
	readonly total?: number;

	/**
	 * Indicate that a specific chunk of work is done.
	 */
	readonly worked?: number;
}

export interface INotificationProgress {

	/**
	 * Causes the progress bar to spin infinitley.
	 */
	infinite(): void;

	/**
	 * Indicate the total amount of work.
	 */
	total(value: number): void;

	/**
	 * Indicate that a specific chunk of work is done.
	 */
	worked(value: number): void;

	/**
	 * Indicate that the long running operation is done.
	 */
	done(): void;
}

export interface INotificationHandle {

	/**
	 * Will be fired once the notification is closed.
	 */
	readonly onDidClose: Event<void>;

	/**
	 * Will be fired whenever the visibility of the notification changes.
	 * A notification can either be visible as toast or inside the notification
	 * center if it is visible.
	 */
	readonly onDidChangeVisibility: Event<boolean>;

	/**
	 * Allows to indicate progress on the notification even after the
	 * notification is already visible.
	 */
	readonly progress: INotificationProgress;

	/**
	 * Allows to update the severity of the notification.
	 */
	updateSeverity(severity: Severity): void;

	/**
	 * Allows to update the message of the notification even after the
	 * notification is already visible.
	 */
	updateMessage(message: NotificationMessage): void;

	/**
	 * Allows to update the actions of the notification even after the
	 * notification is already visible.
	 */
	updateActions(actions?: INotificationActions): void;

	/**
	 * Hide the notification and remove it from the notification center.
	 */
	close(): void;
}

export interface IStatusHandle {

	/**
	 * Hide the status message.
	 */
	close(): void;
}

interface IBasePromptChoice {

	/**
	 * Label to show for the choice to the user.
	 */
	readonly label: string;

	/**
	 * Whether to keep the notification open after the choice was selected
	 * by the user. By default, will close the notification upon click.
	 */
	readonly keepOpen?: boolean;

	/**
	 * Triggered when the user selects the choice.
	 */
	run: () => void;
}

export interface IPromptChoice extends IBasePromptChoice {

	/**
	 * Primary choices show up as buttons in the notification below the message.
	 * Secondary choices show up under the gear icon in the header of the notification.
	 */
	readonly isSecondary?: boolean;
}

export interface IPromptChoiceWithMenu extends IPromptChoice {

	/**
	 * Additional choices those will be shown in the dropdown menu for this choice.
	 */
	readonly menu: IBasePromptChoice[];

	/**
	 * Menu is not supported on secondary choices
	 */
	readonly isSecondary: false | undefined;
}

export interface IPromptOptions extends INotificationProperties {

	/**
	 * Will be called if the user closed the notification without picking
	 * any of the provided choices.
	 */
	onCancel?: () => void;
}

export interface IStatusMessageOptions {

	/**
	 * An optional timeout after which the status message should show. By default
	 * the status message will show immediately.
	 */
	readonly showAfter?: number;

	/**
	 * An optional timeout after which the status message is to be hidden. By default
	 * the status message will not hide until another status message is displayed.
	 */
	readonly hideAfter?: number;
}

export enum NotificationsFilter {

	/**
	 * No filter is enabled.
	 */
	OFF,

	/**
	 * All notifications are silent except error notifications.
	*/
	ERROR
}

export interface INotificationSourceFilter extends INotificationSource {
	readonly filter: NotificationsFilter;
}

/**
 * A service to bring up notifications and non-modal prompts.
 *
 * Note: use the `IDialogService` for a modal way to ask the user for input.
 */
export interface INotificationService {

	readonly _serviceBrand: undefined;

	/**
	 * Emitted when the notifications filter changed.
	 */
	readonly onDidChangeFilter: Event<void>;

	/**
	 * Sets a notification filter either for all notifications
	 * or for a specific source.
	 */
	setFilter(filter: NotificationsFilter | INotificationSourceFilter): void;

	/**
	 * Gets the notification filter either for all notifications
	 * or for a specific source.
	 */
	getFilter(source?: INotificationSource): NotificationsFilter;

	/**
	 * Returns all filters with their sources.
	 */
	getFilters(): INotificationSourceFilter[];

	/**
	 * Removes a filter for a specific source.
	 */
	removeFilter(sourceId: string): void;

	/**
	 * Show the provided notification to the user. The returned `INotificationHandle`
	 * can be used to control the notification afterwards.
	 *
	 * **Note:** If your intent is to show a message with actions to the user, consider
	 * the `INotificationService.prompt()` method instead which are optimized for
	 * this usecase and much easier to use!
	 *
	 * @returns a handle on the notification to e.g. hide it or update message, buttons, etc.
	 */
	notify(notification: INotification): INotificationHandle;

	/**
	 * A convenient way of reporting infos. Use the `INotificationService.notify`
	 * method if you need more control over the notification.
	 */
	info(message: NotificationMessage | NotificationMessage[]): void;

	/**
	 * A convenient way of reporting warnings. Use the `INotificationService.notify`
	 * method if you need more control over the notification.
	 */
	warn(message: NotificationMessage | NotificationMessage[]): void;

	/**
	 * A convenient way of reporting errors. Use the `INotificationService.notify`
	 * method if you need more control over the notification.
	 */
	error(message: NotificationMessage | NotificationMessage[]): void;

	/**
	 * Shows a prompt in the notification area with the provided choices. The prompt
	 * is non-modal. If you want to show a modal dialog instead, use `IDialogService`.
	 *
	 * @param severity the severity of the notification. Either `Info`, `Warning` or `Error`.
	 * @param message the message to show as status.
	 * @param choices options to be chosen from.
	 * @param options provides some optional configuration options.
	 *
	 * @returns a handle on the notification to e.g. hide it or update message, buttons, etc.
	 */
	prompt(severity: Severity, message: string, choices: (IPromptChoice | IPromptChoiceWithMenu)[], options?: IPromptOptions): INotificationHandle;

	/**
	 * Shows a status message in the status area with the provided text.
	 *
	 * @param message the message to show as status
	 * @param options provides some optional configuration options
	 *
	 * @returns a handle to hide the status message
	 */
	status(message: NotificationMessage, options?: IStatusMessageOptions): IStatusHandle;
}

export class NoOpNotification implements INotificationHandle {

	readonly progress = new NoOpProgress();

	readonly onDidClose = Event.None;
	readonly onDidChangeVisibility = Event.None;

	updateSeverity(severity: Severity): void { }
	updateMessage(message: NotificationMessage): void { }
	updateActions(actions?: INotificationActions): void { }

	close(): void { }
}

export class NoOpProgress implements INotificationProgress {
	infinite(): void { }
	done(): void { }
	total(value: number): void { }
	worked(value: number): void { }
}

export function withSeverityPrefix(label: string, severity: Severity): string {

	// Add severity prefix to match WCAG 4.1.3 Status
	// Messages requirements.

	if (severity === Severity.Error) {
		return localize('severityPrefix.error', "Error: {0}", label);
	}

	if (severity === Severity.Warning) {
		return localize('severityPrefix.warning', "Warning: {0}", label);
	}

	return localize('severityPrefix.info', "Info: {0}", label);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/notification/test/common/testNotificationService.ts]---
Location: vscode-main/src/vs/platform/notification/test/common/testNotificationService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { INotification, INotificationHandle, INotificationService, INotificationSource, INotificationSourceFilter, IPromptChoice, IPromptOptions, IStatusHandle, IStatusMessageOptions, NoOpNotification, NotificationsFilter, Severity } from '../../common/notification.js';

export class TestNotificationService implements INotificationService {

	readonly onDidChangeFilter: Event<void> = Event.None;

	declare readonly _serviceBrand: undefined;

	private static readonly NO_OP: INotificationHandle = new NoOpNotification();

	info(message: string): INotificationHandle {
		return this.notify({ severity: Severity.Info, message });
	}

	warn(message: string): INotificationHandle {
		return this.notify({ severity: Severity.Warning, message });
	}

	error(error: string | Error): INotificationHandle {
		return this.notify({ severity: Severity.Error, message: error });
	}

	notify(notification: INotification): INotificationHandle {
		return TestNotificationService.NO_OP;
	}

	prompt(severity: Severity, message: string, choices: IPromptChoice[], options?: IPromptOptions): INotificationHandle {
		return TestNotificationService.NO_OP;
	}

	status(message: string | Error, options?: IStatusMessageOptions): IStatusHandle {
		return {
			close: () => { }
		};
	}

	setFilter(): void { }

	getFilter(source?: INotificationSource | undefined): NotificationsFilter {
		return NotificationsFilter.OFF;
	}

	getFilters(): INotificationSourceFilter[] {
		return [];
	}

	removeFilter(sourceId: string): void { }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/observable/common/observableMemento.ts]---
Location: vscode-main/src/vs/platform/observable/common/observableMemento.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { strictEquals } from '../../../base/common/equals.js';
import { DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { DebugLocation } from '../../../base/common/observable.js';
// eslint-disable-next-line local/code-no-deep-import-of-internal
import { DebugNameData } from '../../../base/common/observableInternal/debugName.js';
// eslint-disable-next-line local/code-no-deep-import-of-internal
import { ObservableValue } from '../../../base/common/observableInternal/observables/observableValue.js';
import { IStorageService, StorageScope, StorageTarget } from '../../storage/common/storage.js';

interface IObservableMementoOpts<T> {
	defaultValue: T;
	key: string;
	toStorage: (value: T) => string;
	fromStorage: (value: string) => T;
}

/**
 * Defines an observable memento. Returns a function that can be called with
 * the specific storage scope, target, and service to use in a class.
 *
 * Note that the returned Observable is a disposable, because it interacts
 * with storage service events, and must be tracked appropriately.
 */
export function observableMemento<T>(opts: IObservableMementoOpts<T>) {
	return (scope: StorageScope, target: StorageTarget, storageService: IStorageService): ObservableMemento<T> => {
		return new ObservableMemento<T>(opts, scope, target, storageService);
	};
}

/**
 * A value that is stored, and is also observable. Note: T should be readonly.
 */
export class ObservableMemento<T> extends ObservableValue<T> implements IDisposable {
	private readonly _store = new DisposableStore();
	private _noStorageUpdateNeeded = false;

	constructor(
		private readonly opts: IObservableMementoOpts<T>,
		private readonly storageScope: StorageScope,
		private readonly storageTarget: StorageTarget,
		@IStorageService private readonly storageService: IStorageService,
	) {
		const getStorageValue = (): T => {
			const fromStorage = storageService.get(opts.key, storageScope);
			if (fromStorage !== undefined) {
				try {
					return opts.fromStorage(fromStorage);
				} catch {
					return opts.defaultValue;
				}
			}
			return opts.defaultValue;
		};

		const initialValue = getStorageValue();
		super(new DebugNameData(undefined, `storage/${opts.key}`, undefined), initialValue, strictEquals, DebugLocation.ofCaller());

		const didChange = storageService.onDidChangeValue(storageScope, opts.key, this._store);
		this._store.add(didChange((e) => {
			if (e.external && e.key === opts.key) {
				this._noStorageUpdateNeeded = true;
				try {
					this.set(getStorageValue(), undefined);
				} finally {
					this._noStorageUpdateNeeded = false;
				}
			}
		}));
	}

	protected override _setValue(newValue: T): void {
		super._setValue(newValue);
		if (this._noStorageUpdateNeeded) {
			return;
		}
		const valueToStore = this.opts.toStorage(this.get());
		this.storageService.store(this.opts.key, valueToStore, this.storageScope, this.storageTarget);
	}

	dispose(): void {
		this._store.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/observable/common/platformObservableUtils.ts]---
Location: vscode-main/src/vs/platform/observable/common/platformObservableUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { DebugLocation, derivedOpts, IObservable, IReader, observableFromEvent, observableFromEventOpts } from '../../../base/common/observable.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { ContextKeyValue, IContextKeyService, RawContextKey } from '../../contextkey/common/contextkey.js';

/** Creates an observable update when a configuration key updates. */
export function observableConfigValue<T>(
	key: string,
	defaultValue: T,
	configurationService: IConfigurationService,
	debugLocation = DebugLocation.ofCaller(),
): IObservable<T> {
	return observableFromEventOpts({ debugName: () => `Configuration Key "${key}"`, },
		(handleChange) => configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(key)) {
				handleChange(e);
			}
		}),
		() => configurationService.getValue<T>(key) ?? defaultValue,
		debugLocation,
	);
}

/** Update the configuration key with a value derived from observables. */
export function bindContextKey<T extends ContextKeyValue>(
	key: RawContextKey<T>,
	service: IContextKeyService,
	computeValue: (reader: IReader) => T,
	debugLocation = DebugLocation.ofCaller(),
): IDisposable {
	const boundKey = key.bindTo(service);
	const store = new DisposableStore();
	derivedOpts({ debugName: () => `Set Context Key "${key.key}"` }, reader => {
		const value = computeValue(reader);
		boundKey.set(value);
		return value;
	}, debugLocation).recomputeInitiallyAndOnChange(store);
	return store;
}


export function observableContextKey<T>(key: string, contextKeyService: IContextKeyService, debugLocation = DebugLocation.ofCaller()): IObservable<T | undefined> {
	return observableFromEvent(undefined, contextKeyService.onDidChangeContext, () => contextKeyService.getContextKeyValue<T>(key), debugLocation);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/observable/common/wrapInHotClass.ts]---
Location: vscode-main/src/vs/platform/observable/common/wrapInHotClass.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { isHotReloadEnabled } from '../../../base/common/hotReload.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { autorunWithStore, IObservable } from '../../../base/common/observable.js';
import { BrandedService, IInstantiationService } from '../../instantiation/common/instantiation.js';

export function hotClassGetOriginalInstance<T>(value: T): T {
	if (value instanceof BaseClass) {
		// eslint-disable-next-line local/code-no-any-casts
		return value._instance as any;
	}
	return value;
}

/**
 * Wrap a class in a reloadable wrapper.
 * When the wrapper is created, the original class is created.
 * When the original class changes, the instance is re-created.
*/
export function wrapInHotClass0<TArgs extends BrandedService[]>(clazz: IObservable<Result<TArgs>>): Result<TArgs> {
	return !isHotReloadEnabled() ? clazz.get() : createWrapper(clazz, BaseClass0);
}

type Result<TArgs extends any[]> = new (...args: TArgs) => IDisposable;

class BaseClass {
	public _instance: unknown;

	constructor(
		public readonly instantiationService: IInstantiationService,
	) { }

	public init(...params: any[]): void { }
}

function createWrapper<T extends any[]>(clazz: IObservable<any>, B: new (...args: T) => BaseClass) {
	// eslint-disable-next-line local/code-no-any-casts
	return (class ReloadableWrapper extends B {
		private _autorun: IDisposable | undefined = undefined;

		override init(...params: any[]) {
			this._autorun = autorunWithStore((reader, store) => {
				const clazz_ = clazz.read(reader);
				this._instance = store.add(this.instantiationService.createInstance(clazz_, ...params));
			});
		}

		dispose(): void {
			this._autorun?.dispose();
		}
	}) as any;
}

class BaseClass0 extends BaseClass {
	constructor(@IInstantiationService i: IInstantiationService) { super(i); this.init(); }
}

/**
 * Wrap a class in a reloadable wrapper.
 * When the wrapper is created, the original class is created.
 * When the original class changes, the instance is re-created.
*/
export function wrapInHotClass1<TArgs extends [any, ...BrandedService[]]>(clazz: IObservable<Result<TArgs>>): Result<TArgs> {
	return !isHotReloadEnabled() ? clazz.get() : createWrapper(clazz, BaseClass1);
}

class BaseClass1 extends BaseClass {
	constructor(param1: any, @IInstantiationService i: IInstantiationService,) { super(i); this.init(param1); }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/observable/common/wrapInReloadableClass.ts]---
Location: vscode-main/src/vs/platform/observable/common/wrapInReloadableClass.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { isHotReloadEnabled } from '../../../base/common/hotReload.js';
import { readHotReloadableExport } from '../../../base/common/hotReloadHelpers.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { autorunWithStore } from '../../../base/common/observable.js';
import { BrandedService, GetLeadingNonServiceArgs, IInstantiationService } from '../../instantiation/common/instantiation.js';

/**
 * Wrap a class in a reloadable wrapper.
 * When the wrapper is created, the original class is created.
 * When the original class changes, the instance is re-created.
*/
export function wrapInReloadableClass0<TArgs extends BrandedService[]>(getClass: () => Result<TArgs>): Result<TArgs> {
	return !isHotReloadEnabled() ? getClass() : createWrapper(getClass, BaseClass0);
}

type Result<TArgs extends any[]> = new (...args: TArgs) => IDisposable;

class BaseClass {
	constructor(
		public readonly instantiationService: IInstantiationService,
	) { }

	public init(...params: any[]): void { }
}

function createWrapper<T extends any[]>(getClass: () => any, B: new (...args: T) => BaseClass) {
	// eslint-disable-next-line local/code-no-any-casts
	return (class ReloadableWrapper extends B {
		private _autorun: IDisposable | undefined = undefined;

		override init(...params: any[]) {
			this._autorun = autorunWithStore((reader, store) => {
				const clazz = readHotReloadableExport(getClass(), reader);
				store.add(this.instantiationService.createInstance(clazz, ...params));
			});
		}

		dispose(): void {
			this._autorun?.dispose();
		}
	}) as any;
}

class BaseClass0 extends BaseClass {
	constructor(@IInstantiationService i: IInstantiationService) { super(i); this.init(); }
}

/**
 * Wrap a class in a reloadable wrapper.
 * When the wrapper is created, the original class is created.
 * When the original class changes, the instance is re-created.
*/
export function wrapInReloadableClass1<TArgs extends [any, ...BrandedService[]]>(getClass: () => Result<TArgs>): Result<GetLeadingNonServiceArgs<TArgs>> {
	// eslint-disable-next-line local/code-no-any-casts
	return !isHotReloadEnabled() ? getClass() as any : createWrapper(getClass, BaseClass1);
}

class BaseClass1 extends BaseClass {
	constructor(param1: any, @IInstantiationService i: IInstantiationService,) { super(i); this.init(param1); }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/opener/browser/link.css]---
Location: vscode-main/src/vs/platform/opener/browser/link.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-link {
	color: var(--vscode-textLink-foreground);
}

.monaco-link:hover {
	color: var(--vscode-textLink-activeForeground);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/opener/browser/link.ts]---
Location: vscode-main/src/vs/platform/opener/browser/link.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, append, EventHelper, EventLike, clearNode } from '../../../base/browser/dom.js';
import { DomEmitter } from '../../../base/browser/event.js';
import { StandardKeyboardEvent } from '../../../base/browser/keyboardEvent.js';
import { EventType as TouchEventType, Gesture } from '../../../base/browser/touch.js';
import { Event } from '../../../base/common/event.js';
import { KeyCode } from '../../../base/common/keyCodes.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { IOpenerService } from '../common/opener.js';
import './link.css';
import { getDefaultHoverDelegate } from '../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { IHoverDelegate } from '../../../base/browser/ui/hover/hoverDelegate.js';
import type { IManagedHover } from '../../../base/browser/ui/hover/hover.js';
import { IHoverService } from '../../hover/browser/hover.js';

export interface ILinkDescriptor {
	readonly label: string | HTMLElement;
	readonly href: string;
	readonly title?: string;
	readonly tabIndex?: number;
}

export interface ILinkOptions {
	readonly opener?: (href: string) => void;
	readonly hoverDelegate?: IHoverDelegate;
	readonly textLinkForeground?: string;
}

export class Link extends Disposable {

	private el: HTMLAnchorElement;
	private hover?: IManagedHover;
	private hoverDelegate: IHoverDelegate;

	private _enabled: boolean = true;

	get enabled(): boolean {
		return this._enabled;
	}

	set enabled(enabled: boolean) {
		if (enabled) {
			this.el.setAttribute('aria-disabled', 'false');
			this.el.tabIndex = 0;
			this.el.style.pointerEvents = 'auto';
			this.el.style.opacity = '1';
			this.el.style.cursor = 'pointer';
			this._enabled = false;
		} else {
			this.el.setAttribute('aria-disabled', 'true');
			this.el.tabIndex = -1;
			this.el.style.pointerEvents = 'none';
			this.el.style.opacity = '0.4';
			this.el.style.cursor = 'default';
			this._enabled = true;
		}

		this._enabled = enabled;
	}

	set link(link: ILinkDescriptor) {
		if (typeof link.label === 'string') {
			this.el.textContent = link.label;
		} else {
			clearNode(this.el);
			this.el.appendChild(link.label);
		}

		this.el.href = link.href;

		if (typeof link.tabIndex !== 'undefined') {
			this.el.tabIndex = link.tabIndex;
		}

		this.setTooltip(link.title);

		this._link = link;
	}

	constructor(
		container: HTMLElement,
		private _link: ILinkDescriptor,
		options: ILinkOptions = {},
		@IHoverService private readonly _hoverService: IHoverService,
		@IOpenerService openerService: IOpenerService
	) {
		super();

		this.el = append(container, $('a.monaco-link', {
			tabIndex: _link.tabIndex ?? 0,
			href: _link.href,
		}, _link.label));

		this.hoverDelegate = options.hoverDelegate ?? getDefaultHoverDelegate('mouse');
		this.setTooltip(_link.title);

		this.el.setAttribute('role', 'button');

		const onClickEmitter = this._register(new DomEmitter(this.el, 'click'));
		const onKeyPress = this._register(new DomEmitter(this.el, 'keypress'));
		const onEnterPress = Event.chain(onKeyPress.event, $ =>
			$.map(e => new StandardKeyboardEvent(e))
				.filter(e => e.keyCode === KeyCode.Enter)
		);
		const onTap = this._register(new DomEmitter(this.el, TouchEventType.Tap)).event;
		this._register(Gesture.addTarget(this.el));
		const onOpen = Event.any<EventLike>(onClickEmitter.event, onEnterPress, onTap);

		this._register(onOpen(e => {
			if (!this.enabled) {
				return;
			}

			EventHelper.stop(e, true);

			if (options?.opener) {
				options.opener(this._link.href);
			} else {
				openerService.open(this._link.href, { allowCommands: true });
			}
		}));

		this.enabled = true;
	}

	private setTooltip(title: string | undefined): void {
		if (!this.hover && title) {
			this.hover = this._register(this._hoverService.setupManagedHover(this.hoverDelegate, this.el, title));
		} else if (this.hover) {
			this.hover.update(title);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/opener/common/opener.ts]---
Location: vscode-main/src/vs/platform/opener/common/opener.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { IEditorOptions, ITextEditorSelection } from '../../editor/common/editor.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IOpenerService = createDecorator<IOpenerService>('openerService');

export type OpenInternalOptions = {

	/**
	 * Signals that the intent is to open an editor to the side
	 * of the currently active editor.
	 */
	readonly openToSide?: boolean;

	/**
	 * Extra editor options to apply in case an editor is used to open.
	 */
	readonly editorOptions?: IEditorOptions;

	/**
	 * Signals that the editor to open was triggered through a user
	 * action, such as keyboard or mouse usage.
	 */
	readonly fromUserGesture?: boolean;

	/**
	 * Allow command links to be handled.
	 *
	 * If this is an array, then only the commands included in the array can be run.
	 */
	readonly allowCommands?: boolean | readonly string[];
};

export type OpenExternalOptions = {
	readonly openExternal?: boolean;
	readonly allowTunneling?: boolean;
	readonly allowContributedOpeners?: boolean | string;
	readonly fromWorkspace?: boolean;
	readonly skipValidation?: boolean;
};

export type OpenOptions = OpenInternalOptions & OpenExternalOptions;

export type ResolveExternalUriOptions = { readonly allowTunneling?: boolean };

export interface IResolvedExternalUri extends IDisposable {
	resolved: URI;
}

export interface IOpener {
	open(resource: URI | string, options?: OpenInternalOptions | OpenExternalOptions): Promise<boolean>;
}

export interface IExternalOpener {
	openExternal(href: string, ctx: { sourceUri: URI; preferredOpenerId?: string }, token: CancellationToken): Promise<boolean>;
	dispose?(): void;
}

export interface IValidator {
	shouldOpen(resource: URI | string, openOptions?: OpenOptions): Promise<boolean>;
}

export interface IExternalUriResolver {
	resolveExternalUri(resource: URI, options?: OpenOptions): Promise<{ resolved: URI; dispose(): void } | undefined>;
}

export interface IOpenerService {

	readonly _serviceBrand: undefined;

	/**
	 * Register a participant that can handle the open() call.
	 */
	registerOpener(opener: IOpener): IDisposable;

	/**
	 * Register a participant that can validate if the URI resource be opened.
	 * Validators are run before openers.
	 */
	registerValidator(validator: IValidator): IDisposable;

	/**
	 * Register a participant that can resolve an external URI resource to be opened.
	 */
	registerExternalUriResolver(resolver: IExternalUriResolver): IDisposable;

	/**
	 * Sets the handler for opening externally. If not provided,
	 * a default handler will be used.
	 */
	setDefaultExternalOpener(opener: IExternalOpener): void;

	/**
	 * Registers a new opener external resources openers.
	 */
	registerExternalOpener(opener: IExternalOpener): IDisposable;

	/**
	 * Opens a resource, like a webaddress, a document uri, or executes command.
	 *
	 * @param resource A resource
	 * @return A promise that resolves when the opening is done.
	 */
	open(resource: URI | string, options?: OpenInternalOptions | OpenExternalOptions): Promise<boolean>;

	/**
	 * Resolve a resource to its external form.
	 * @throws whenever resolvers couldn't resolve this resource externally.
	 */
	resolveExternalUri(resource: URI, options?: ResolveExternalUriOptions): Promise<IResolvedExternalUri>;
}

/**
 * Encodes selection into the `URI`.
 *
 * IMPORTANT: you MUST use `extractSelection` to separate the selection
 * again from the original `URI` before passing the `URI` into any
 * component that is not aware of selections.
 */
export function withSelection(uri: URI, selection: ITextEditorSelection): URI {
	return uri.with({ fragment: `${selection.startLineNumber},${selection.startColumn}${selection.endLineNumber ? `-${selection.endLineNumber}${selection.endColumn ? `,${selection.endColumn}` : ''}` : ''}` });
}

/**
 * file:///some/file.js#73
 * file:///some/file.js#L73
 * file:///some/file.js#73,84
 * file:///some/file.js#L73,84
 * file:///some/file.js#73-83
 * file:///some/file.js#L73-L83
 * file:///some/file.js#73,84-83,52
 * file:///some/file.js#L73,84-L83,52
 */
export function extractSelection(uri: URI): { selection: ITextEditorSelection | undefined; uri: URI } {
	let selection: ITextEditorSelection | undefined = undefined;
	const match = /^L?(\d+)(?:,(\d+))?(-L?(\d+)(?:,(\d+))?)?/.exec(uri.fragment);
	if (match) {
		selection = {
			startLineNumber: parseInt(match[1]),
			startColumn: match[2] ? parseInt(match[2]) : 1,
			endLineNumber: match[4] ? parseInt(match[4]) : undefined,
			endColumn: match[4] ? (match[5] ? parseInt(match[5]) : 1) : undefined
		};
		uri = uri.with({ fragment: '' });
	}
	return { selection, uri };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/opener/test/common/nullOpenerService.ts]---
Location: vscode-main/src/vs/platform/opener/test/common/nullOpenerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { IOpenerService } from '../../common/opener.js';

export const NullOpenerService = Object.freeze<IOpenerService>({
	_serviceBrand: undefined,
	registerOpener() { return Disposable.None; },
	registerValidator() { return Disposable.None; },
	registerExternalUriResolver() { return Disposable.None; },
	setDefaultExternalOpener() { },
	registerExternalOpener() { return Disposable.None; },
	async open() { return false; },
	async resolveExternalUri(uri: URI) { return { resolved: uri, dispose() { } }; },
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/opener/test/common/opener.test.ts]---
Location: vscode-main/src/vs/platform/opener/test/common/opener.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../base/common/uri.js';
import { extractSelection, withSelection } from '../../common/opener.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

suite('extractSelection', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('extractSelection with only startLineNumber', async () => {
		const uri = URI.parse('file:///some/file.js#73');
		assert.deepStrictEqual(extractSelection(uri).selection, { startLineNumber: 73, startColumn: 1, endLineNumber: undefined, endColumn: undefined });
	});

	test('extractSelection with only startLineNumber in L format', async () => {
		const uri = URI.parse('file:///some/file.js#L73');
		assert.deepStrictEqual(extractSelection(uri).selection, { startLineNumber: 73, startColumn: 1, endLineNumber: undefined, endColumn: undefined });
	});

	test('extractSelection with startLineNumber and startColumn', async () => {
		const uri = URI.parse('file:///some/file.js#73,84');
		assert.deepStrictEqual(extractSelection(uri).selection, { startLineNumber: 73, startColumn: 84, endLineNumber: undefined, endColumn: undefined });
	});

	test('extractSelection with startLineNumber and startColumn in L format', async () => {
		const uri = URI.parse('file:///some/file.js#L73,84');
		assert.deepStrictEqual(extractSelection(uri).selection, { startLineNumber: 73, startColumn: 84, endLineNumber: undefined, endColumn: undefined });
	});

	test('extractSelection with range and no column number', async () => {
		const uri = URI.parse('file:///some/file.js#73-83');
		assert.deepStrictEqual(extractSelection(uri).selection, { startLineNumber: 73, startColumn: 1, endLineNumber: 83, endColumn: 1 });
	});

	test('extractSelection with range and no column number in L format', async () => {
		const uri = URI.parse('file:///some/file.js#L73-L83');
		assert.deepStrictEqual(extractSelection(uri).selection, { startLineNumber: 73, startColumn: 1, endLineNumber: 83, endColumn: 1 });
	});

	test('extractSelection with range and no column number in L format only for start', async () => {
		const uri = URI.parse('file:///some/file.js#L73-83');
		assert.deepStrictEqual(extractSelection(uri).selection, { startLineNumber: 73, startColumn: 1, endLineNumber: 83, endColumn: 1 });
	});

	test('extractSelection with range and no column number in L format only for end', async () => {
		const uri = URI.parse('file:///some/file.js#73-L83');
		assert.deepStrictEqual(extractSelection(uri).selection, { startLineNumber: 73, startColumn: 1, endLineNumber: 83, endColumn: 1 });
	});

	test('extractSelection with complete range', async () => {
		const uri = URI.parse('file:///some/file.js#73,84-83,52');
		assert.deepStrictEqual(extractSelection(uri).selection, { startLineNumber: 73, startColumn: 84, endLineNumber: 83, endColumn: 52 });
	});

	test('extractSelection with complete range in L format', async () => {
		const uri = URI.parse('file:///some/file.js#L73,84-L83,52');
		assert.deepStrictEqual(extractSelection(uri).selection, { startLineNumber: 73, startColumn: 84, endLineNumber: 83, endColumn: 52 });
	});

	test('withSelection with startLineNumber and startColumn', async () => {
		assert.deepStrictEqual(withSelection(URI.parse('file:///some/file.js'), { startLineNumber: 73, startColumn: 84 }).toString(), 'file:///some/file.js#73%2C84');
	});

	test('withSelection with startLineNumber, startColumn and endLineNumber', async () => {
		assert.deepStrictEqual(withSelection(URI.parse('file:///some/file.js'), { startLineNumber: 73, startColumn: 84, endLineNumber: 83 }).toString(), 'file:///some/file.js#73%2C84-83');
	});

	test('withSelection with startLineNumber, startColumn and endLineNumber, endColumn', async () => {
		assert.deepStrictEqual(withSelection(URI.parse('file:///some/file.js'), { startLineNumber: 73, startColumn: 84, endLineNumber: 83, endColumn: 52 }).toString(), 'file:///some/file.js#73%2C84-83%2C52');
	});

	test('extractSelection returns original withSelection URI', async () => {
		let uri = URI.parse('file:///some/file.js');

		const uriWithSelection = withSelection(URI.parse('file:///some/file.js'), { startLineNumber: 73, startColumn: 84, endLineNumber: 83, endColumn: 52 });
		assert.strictEqual(uri.toString(), extractSelection(uriWithSelection).uri.toString());

		uri = URI.parse('file:///some/file.js');
		assert.strictEqual(uri.toString(), extractSelection(uri).uri.toString());
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/policy/common/filePolicyService.ts]---
Location: vscode-main/src/vs/platform/policy/common/filePolicyService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ThrottledDelayer } from '../../../base/common/async.js';
import { Event } from '../../../base/common/event.js';
import { Iterable } from '../../../base/common/iterator.js';
import { PolicyName } from '../../../base/common/policy.js';
import { isObject } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { FileOperationError, FileOperationResult, IFileService } from '../../files/common/files.js';
import { ILogService } from '../../log/common/log.js';
import { AbstractPolicyService, IPolicyService, PolicyValue } from './policy.js';

function keysDiff<T>(a: Map<string, T>, b: Map<string, T>): string[] {
	const result: string[] = [];

	for (const key of new Set(Iterable.concat(a.keys(), b.keys()))) {
		if (a.get(key) !== b.get(key)) {
			result.push(key);
		}
	}

	return result;
}

export class FilePolicyService extends AbstractPolicyService implements IPolicyService {

	private readonly throttledDelayer = this._register(new ThrottledDelayer(500));

	constructor(
		private readonly file: URI,
		@IFileService private readonly fileService: IFileService,
		@ILogService private readonly logService: ILogService
	) {
		super();

		const onDidChangePolicyFile = Event.filter(fileService.onDidFilesChange, e => e.affects(file));
		this._register(fileService.watch(file));
		this._register(onDidChangePolicyFile(() => this.throttledDelayer.trigger(() => this.refresh())));
	}

	protected async _updatePolicyDefinitions(): Promise<void> {
		await this.refresh();
	}

	private async read(): Promise<Map<PolicyName, PolicyValue>> {
		const policies = new Map<PolicyName, PolicyValue>();

		try {
			const content = await this.fileService.readFile(this.file);
			const raw = JSON.parse(content.value.toString());

			if (!isObject(raw)) {
				throw new Error('Policy file isn\'t a JSON object');
			}

			for (const key of Object.keys(raw)) {
				if (this.policyDefinitions[key]) {
					policies.set(key, raw[key]);
				}
			}
		} catch (error) {
			if ((<FileOperationError>error).fileOperationResult !== FileOperationResult.FILE_NOT_FOUND) {
				this.logService.error(`[FilePolicyService] Failed to read policies`, error);
			}
		}

		return policies;
	}

	private async refresh(): Promise<void> {
		const policies = await this.read();
		const diff = keysDiff(this.policies, policies);
		this.policies = policies;

		if (diff.length > 0) {
			this._onDidChange.fire(diff);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/policy/common/policy.ts]---
Location: vscode-main/src/vs/platform/policy/common/policy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStringDictionary } from '../../../base/common/collections.js';
import { IDefaultAccount } from '../../../base/common/defaultAccount.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Iterable } from '../../../base/common/iterator.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { PolicyName } from '../../../base/common/policy.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export type PolicyValue = string | number | boolean;
export type PolicyDefinition = {
	type: 'string' | 'number' | 'boolean';
	value?: (account: IDefaultAccount) => string | number | boolean | undefined;
};

export const IPolicyService = createDecorator<IPolicyService>('policy');

export interface IPolicyService {
	readonly _serviceBrand: undefined;

	readonly onDidChange: Event<readonly PolicyName[]>;
	updatePolicyDefinitions(policyDefinitions: IStringDictionary<PolicyDefinition>): Promise<IStringDictionary<PolicyValue>>;
	getPolicyValue(name: PolicyName): PolicyValue | undefined;
	serialize(): IStringDictionary<{ definition: PolicyDefinition; value: PolicyValue }> | undefined;
	readonly policyDefinitions: IStringDictionary<PolicyDefinition>;
}

export abstract class AbstractPolicyService extends Disposable implements IPolicyService {
	readonly _serviceBrand: undefined;

	public policyDefinitions: IStringDictionary<PolicyDefinition> = {};
	protected policies = new Map<PolicyName, PolicyValue>();

	protected readonly _onDidChange = this._register(new Emitter<readonly PolicyName[]>());
	readonly onDidChange = this._onDidChange.event;

	async updatePolicyDefinitions(policyDefinitions: IStringDictionary<PolicyDefinition>): Promise<IStringDictionary<PolicyValue>> {
		const size = Object.keys(this.policyDefinitions).length;
		this.policyDefinitions = { ...policyDefinitions, ...this.policyDefinitions };

		if (size !== Object.keys(this.policyDefinitions).length) {
			await this._updatePolicyDefinitions(this.policyDefinitions);
		}

		return Iterable.reduce(this.policies.entries(), (r, [name, value]) => ({ ...r, [name]: value }), {});
	}

	getPolicyValue(name: PolicyName): PolicyValue | undefined {
		return this.policies.get(name);
	}

	serialize(): IStringDictionary<{ definition: PolicyDefinition; value: PolicyValue }> {
		return Iterable.reduce<[PolicyName, PolicyDefinition], IStringDictionary<{ definition: PolicyDefinition; value: PolicyValue }>>(Object.entries(this.policyDefinitions), (r, [name, definition]) => ({ ...r, [name]: { definition, value: this.policies.get(name)! } }), {});
	}

	protected abstract _updatePolicyDefinitions(policyDefinitions: IStringDictionary<PolicyDefinition>): Promise<void>;
}

export class NullPolicyService implements IPolicyService {
	readonly _serviceBrand: undefined;
	readonly onDidChange = Event.None;
	async updatePolicyDefinitions() { return {}; }
	getPolicyValue() { return undefined; }
	serialize() { return undefined; }
	policyDefinitions: IStringDictionary<PolicyDefinition> = {};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/policy/common/policyIpc.ts]---
Location: vscode-main/src/vs/platform/policy/common/policyIpc.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStringDictionary } from '../../../base/common/collections.js';
import { Event } from '../../../base/common/event.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { PolicyName } from '../../../base/common/policy.js';
import { IChannel, IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { AbstractPolicyService, IPolicyService, PolicyDefinition, PolicyValue } from './policy.js';


export class PolicyChannel implements IServerChannel {

	private readonly disposables = new DisposableStore();

	constructor(private service: IPolicyService) { }

	listen(_: unknown, event: string): Event<any> {
		switch (event) {
			case 'onDidChange': return Event.map(
				this.service.onDidChange,
				names => names.reduce<object>((r, name) => ({ ...r, [name]: this.service.getPolicyValue(name) ?? null }), {}),
				this.disposables
			);
		}

		throw new Error(`Event not found: ${event}`);
	}

	call(_: unknown, command: string, arg?: any): Promise<any> {
		switch (command) {
			case 'updatePolicyDefinitions': return this.service.updatePolicyDefinitions(arg as IStringDictionary<PolicyDefinition>);
		}

		throw new Error(`Call not found: ${command}`);
	}

	dispose() {
		this.disposables.dispose();
	}
}

export class PolicyChannelClient extends AbstractPolicyService implements IPolicyService {

	constructor(policiesData: IStringDictionary<{ definition: PolicyDefinition; value: PolicyValue }>, private readonly channel: IChannel) {
		super();
		for (const name in policiesData) {
			const { definition, value } = policiesData[name];
			this.policyDefinitions[name] = definition;
			if (value !== undefined) {
				this.policies.set(name, value);
			}
		}
		this.channel.listen<object>('onDidChange')(policies => {
			for (const name in policies) {
				const value = policies[name as keyof typeof policies];

				if (value === null) {
					this.policies.delete(name);
				} else {
					this.policies.set(name, value);
				}
			}

			this._onDidChange.fire(Object.keys(policies));
		});
	}

	protected async _updatePolicyDefinitions(policyDefinitions: IStringDictionary<PolicyDefinition>): Promise<void> {
		const result = await this.channel.call<{ [name: PolicyName]: PolicyValue }>('updatePolicyDefinitions', policyDefinitions);
		for (const name in result) {
			this.policies.set(name, result[name]);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/policy/node/nativePolicyService.ts]---
Location: vscode-main/src/vs/platform/policy/node/nativePolicyService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AbstractPolicyService, IPolicyService, PolicyDefinition, PolicyValue } from '../common/policy.js';
import { IStringDictionary } from '../../../base/common/collections.js';
import { Throttler } from '../../../base/common/async.js';
import type { PolicyUpdate, Watcher } from '@vscode/policy-watcher';
import { MutableDisposable } from '../../../base/common/lifecycle.js';
import { ILogService } from '../../log/common/log.js';

export class NativePolicyService extends AbstractPolicyService implements IPolicyService {

	private throttler = new Throttler();
	private readonly watcher = this._register(new MutableDisposable<Watcher>());

	constructor(
		@ILogService private readonly logService: ILogService,
		private readonly productName: string
	) {
		super();
	}

	protected async _updatePolicyDefinitions(policyDefinitions: IStringDictionary<PolicyDefinition>): Promise<void> {
		this.logService.trace(`NativePolicyService#_updatePolicyDefinitions - Found ${Object.keys(policyDefinitions).length} policy definitions`);

		const { createWatcher } = await import('@vscode/policy-watcher');

		await this.throttler.queue(() => new Promise<void>((c, e) => {
			try {
				this.watcher.value = createWatcher(this.productName, policyDefinitions, update => {
					this._onDidPolicyChange(update);
					c();
				});
			} catch (err) {
				this.logService.error(`NativePolicyService#_updatePolicyDefinitions - Error creating watcher:`, err);
				e(err);
			}
		}));
	}

	private _onDidPolicyChange(update: PolicyUpdate<IStringDictionary<PolicyDefinition>>): void {
		this.logService.trace(`NativePolicyService#_onDidPolicyChange - Updated policy values: ${JSON.stringify(update)}`);

		for (const key in update as Record<string, PolicyValue | undefined>) {
			const value = update[key];

			if (value === undefined) {
				this.policies.delete(key);
			} else {
				this.policies.set(key, value);
			}
		}

		this._onDidChange.fire(Object.keys(update));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/process/common/process.ts]---
Location: vscode-main/src/vs/platform/process/common/process.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ProcessItem } from '../../../base/common/processes.js';
import { IRemoteDiagnosticError, PerformanceInfo, SystemInfo } from '../../diagnostics/common/diagnostics.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

// Since data sent through the service is serialized to JSON, functions will be lost, so Color objects
// should not be sent as their 'toString' method will be stripped. Instead convert to strings before sending.
export interface WindowStyles {
	backgroundColor?: string;
	color?: string;
}
export interface WindowData {
	styles: WindowStyles;
	zoomLevel: number;
}

export enum IssueSource {
	VSCode = 'vscode',
	Extension = 'extension',
	Marketplace = 'marketplace'
}
export interface ISettingSearchResult {
	extensionId: string;
	key: string;
	score: number;
}

export const IProcessService = createDecorator<IProcessService>('processService');

export interface IResolvedProcessInformation {
	readonly pidToNames: [number, string][];
	readonly processes: {
		readonly name: string;
		readonly rootProcess: ProcessItem | IRemoteDiagnosticError;
	}[];
}

export interface IProcessService {

	readonly _serviceBrand: undefined;

	resolveProcesses(): Promise<IResolvedProcessInformation>;

	getSystemStatus(): Promise<string>;
	getSystemInfo(): Promise<SystemInfo>;
	getPerformanceInfo(): Promise<PerformanceInfo>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/process/electron-main/processMainService.ts]---
Location: vscode-main/src/vs/platform/process/electron-main/processMainService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { listProcesses } from '../../../base/node/ps.js';
import { localize } from '../../../nls.js';
import { IDiagnosticsService, IRemoteDiagnosticError, isRemoteDiagnosticError, PerformanceInfo, SystemInfo } from '../../diagnostics/common/diagnostics.js';
import { IDiagnosticsMainService } from '../../diagnostics/electron-main/diagnosticsMainService.js';
import { IProcessService, IResolvedProcessInformation } from '../common/process.js';
import { ILogService } from '../../log/common/log.js';
import { UtilityProcess } from '../../utilityProcess/electron-main/utilityProcess.js';
import { ProcessItem } from '../../../base/common/processes.js';

export class ProcessMainService implements IProcessService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@ILogService private readonly logService: ILogService,
		@IDiagnosticsService private readonly diagnosticsService: IDiagnosticsService,
		@IDiagnosticsMainService private readonly diagnosticsMainService: IDiagnosticsMainService
	) {
	}

	async resolveProcesses(): Promise<IResolvedProcessInformation> {
		const mainProcessInfo = await this.diagnosticsMainService.getMainDiagnostics();

		const pidToNames: [number, string][] = [];
		for (const window of mainProcessInfo.windows) {
			pidToNames.push([window.pid, `window [${window.id}] (${window.title})`]);
		}

		for (const { pid, name } of UtilityProcess.getAll()) {
			pidToNames.push([pid, name]);
		}

		const processes: { name: string; rootProcess: ProcessItem | IRemoteDiagnosticError }[] = [];
		try {
			processes.push({ name: localize('local', "Local"), rootProcess: await listProcesses(process.pid) });

			const remoteDiagnostics = await this.diagnosticsMainService.getRemoteDiagnostics({ includeProcesses: true });
			remoteDiagnostics.forEach(data => {
				if (isRemoteDiagnosticError(data)) {
					processes.push({
						name: data.hostName,
						rootProcess: data
					});
				} else {
					if (data.processes) {
						processes.push({
							name: data.hostName,
							rootProcess: data.processes
						});
					}
				}
			});
		} catch (e) {
			this.logService.error(`Listing processes failed: ${e}`);
		}

		return { pidToNames, processes };
	}

	async getSystemStatus(): Promise<string> {
		const [info, remoteData] = await Promise.all([this.diagnosticsMainService.getMainDiagnostics(), this.diagnosticsMainService.getRemoteDiagnostics({ includeProcesses: false, includeWorkspaceMetadata: false })]);

		return this.diagnosticsService.getDiagnostics(info, remoteData);
	}

	async getSystemInfo(): Promise<SystemInfo> {
		const [info, remoteData] = await Promise.all([this.diagnosticsMainService.getMainDiagnostics(), this.diagnosticsMainService.getRemoteDiagnostics({ includeProcesses: false, includeWorkspaceMetadata: false })]);
		const msg = await this.diagnosticsService.getSystemInfo(info, remoteData);

		return msg;
	}

	async getPerformanceInfo(): Promise<PerformanceInfo> {
		try {
			const [info, remoteData] = await Promise.all([this.diagnosticsMainService.getMainDiagnostics(), this.diagnosticsMainService.getRemoteDiagnostics({ includeProcesses: true, includeWorkspaceMetadata: true })]);
			return await this.diagnosticsService.getPerformanceInfo(info, remoteData);
		} catch (error) {
			this.logService.warn('issueService#getPerformanceInfo ', error.message);

			throw error;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/product/common/product.ts]---
Location: vscode-main/src/vs/platform/product/common/product.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { env } from '../../../base/common/process.js';
import { IProductConfiguration } from '../../../base/common/product.js';
import { ISandboxConfiguration } from '../../../base/parts/sandbox/common/sandboxTypes.js';

/**
 * @deprecated It is preferred that you use `IProductService` if you can. This
 * allows web embedders to override our defaults. But for things like `product.quality`,
 * the use is fine because that property is not overridable.
 */
let product: IProductConfiguration;

// Native sandbox environment
const vscodeGlobal = (globalThis as { vscode?: { context?: { configuration(): ISandboxConfiguration | undefined } } }).vscode;
if (typeof vscodeGlobal !== 'undefined' && typeof vscodeGlobal.context !== 'undefined') {
	const configuration: ISandboxConfiguration | undefined = vscodeGlobal.context.configuration();
	if (configuration) {
		product = configuration.product;
	} else {
		throw new Error('Sandbox: unable to resolve product configuration from preload script.');
	}
}
// _VSCODE environment
else if (globalThis._VSCODE_PRODUCT_JSON && globalThis._VSCODE_PACKAGE_JSON) {
	// Obtain values from product.json and package.json-data
	product = globalThis._VSCODE_PRODUCT_JSON as unknown as IProductConfiguration;

	// Running out of sources
	if (env['VSCODE_DEV']) {
		Object.assign(product, {
			nameShort: `${product.nameShort} Dev`,
			nameLong: `${product.nameLong} Dev`,
			dataFolderName: `${product.dataFolderName}-dev`,
			serverDataFolderName: product.serverDataFolderName ? `${product.serverDataFolderName}-dev` : undefined
		});
	}

	// Version is added during built time, but we still
	// want to have it running out of sources so we
	// read it from package.json only when we need it.
	if (!product.version) {
		const pkg = globalThis._VSCODE_PACKAGE_JSON as { version: string };

		Object.assign(product, {
			version: pkg.version
		});
	}
}

// Web environment or unknown
else {

	// Built time configuration (do NOT modify)
	// eslint-disable-next-line local/code-no-dangerous-type-assertions
	product = { /*BUILD->INSERT_PRODUCT_CONFIGURATION*/ } as unknown as IProductConfiguration;

	// Running out of sources
	if (Object.keys(product).length === 0) {
		Object.assign(product, {
			version: '1.104.0-dev',
			nameShort: 'Code - OSS Dev',
			nameLong: 'Code - OSS Dev',
			applicationName: 'code-oss',
			dataFolderName: '.vscode-oss',
			urlProtocol: 'code-oss',
			reportIssueUrl: 'https://github.com/microsoft/vscode/issues/new',
			licenseName: 'MIT',
			licenseUrl: 'https://github.com/microsoft/vscode/blob/main/LICENSE.txt',
			serverLicenseUrl: 'https://github.com/microsoft/vscode/blob/main/LICENSE.txt'
		});
	}
}

export default product;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/product/common/productService.ts]---
Location: vscode-main/src/vs/platform/product/common/productService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IProductConfiguration } from '../../../base/common/product.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IProductService = createDecorator<IProductService>('productService');

export interface IProductService extends Readonly<IProductConfiguration> {

	readonly _serviceBrand: undefined;

}

export const productSchemaId = 'vscode://schemas/vscode-product';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/profiling/common/profiling.ts]---
Location: vscode-main/src/vs/platform/profiling/common/profiling.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { basename, isAbsolute, join } from '../../../base/common/path.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export interface IV8Profile {
	nodes: IV8ProfileNode[];
	samples?: number[];
	timeDeltas?: number[];
	startTime: number;
	endTime: number;
}

export interface IV8ProfileNode {
	id: number;
	hitCount?: number;
	children?: number[];
	callFrame: IV8CallFrame;
	deoptReason?: string;
	positionTicks?: { line: number; ticks: number }[];
}

export interface IV8CallFrame {
	url: string;
	scriptId: string;
	functionName: string;
	lineNumber: number;
	columnNumber: number;
}

export const IV8InspectProfilingService = createDecorator<IV8InspectProfilingService>('IV8InspectProfilingService');

export interface IV8InspectProfilingService {

	_serviceBrand: undefined;

	startProfiling(options: { host: string; port: number }): Promise<string>;

	stopProfiling(sessionId: string): Promise<IV8Profile>;
}


export namespace Utils {

	export function isValidProfile(profile: IV8Profile): profile is Required<IV8Profile> {
		return Boolean(profile.samples && profile.timeDeltas);
	}

	export function rewriteAbsolutePaths(profile: IV8Profile, replace: string = 'noAbsolutePaths') {
		for (const node of profile.nodes) {
			if (node.callFrame && node.callFrame.url) {
				if (isAbsolute(node.callFrame.url) || /^\w[\w\d+.-]*:\/\/\/?/.test(node.callFrame.url)) {
					node.callFrame.url = join(replace, basename(node.callFrame.url));
				}
			}
		}
		return profile;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/profiling/common/profilingModel.ts]---
Location: vscode-main/src/vs/platform/profiling/common/profilingModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IV8Profile, IV8ProfileNode } from './profiling.js';

// #region
// https://github.com/microsoft/vscode-js-profile-visualizer/blob/6e7401128ee860be113a916f80fcfe20ac99418e/packages/vscode-js-profile-core/src/cpu/model.ts#L4

export interface IProfileModel {
	nodes: ReadonlyArray<IComputedNode>;
	locations: ReadonlyArray<ILocation>;
	samples: ReadonlyArray<number>;
	timeDeltas: ReadonlyArray<number>;
	rootPath?: string;
	duration: number;
}

export interface IComputedNode {
	id: number;
	selfTime: number;
	aggregateTime: number;
	children: number[];
	parent?: number;
	locationId: number;
}

export interface ISourceLocation {
	lineNumber: number;
	columnNumber: number;
	//   source: Dap.Source;
	relativePath?: string;
}

export interface CdpCallFrame {
	functionName: string;
	scriptId: string;
	url: string;
	lineNumber: number;
	columnNumber: number;
}

export interface CdpPositionTickInfo {
	line: number;
	ticks: number;
}

export interface INode {
	id: number;
	//   category: Category;
	callFrame: CdpCallFrame;
	src?: ISourceLocation;
}

export interface ILocation extends INode {
	selfTime: number;
	aggregateTime: number;
	ticks: number;
}

export interface IAnnotationLocation {
	callFrame: CdpCallFrame;
	locations: ISourceLocation[];
}

export interface IProfileNode extends IV8ProfileNode {
	locationId?: number;
	positionTicks?: (CdpPositionTickInfo & {
		startLocationId?: number;
		endLocationId?: number;
	})[];
}

export interface ICpuProfileRaw extends IV8Profile {
	//   $vscode?: IJsDebugAnnotations;
	nodes: IProfileNode[];
}


/**
 * Recursive function that computes and caches the aggregate time for the
 * children of the computed now.
 */
const computeAggregateTime = (index: number, nodes: IComputedNode[]): number => {
	const row = nodes[index];
	if (row.aggregateTime) {
		return row.aggregateTime;
	}

	let total = row.selfTime;
	for (const child of row.children) {
		total += computeAggregateTime(child, nodes);
	}

	return (row.aggregateTime = total);
};

const ensureSourceLocations = (profile: ICpuProfileRaw): ReadonlyArray<IAnnotationLocation> => {

	let locationIdCounter = 0;
	const locationsByRef = new Map<string, { id: number; callFrame: CdpCallFrame; location: ISourceLocation }>();

	const getLocationIdFor = (callFrame: CdpCallFrame) => {
		const ref = [
			callFrame.functionName,
			callFrame.url,
			callFrame.scriptId,
			callFrame.lineNumber,
			callFrame.columnNumber,
		].join(':');

		const existing = locationsByRef.get(ref);
		if (existing) {
			return existing.id;
		}
		const id = locationIdCounter++;
		locationsByRef.set(ref, {
			id,
			callFrame,
			location: {
				lineNumber: callFrame.lineNumber + 1,
				columnNumber: callFrame.columnNumber + 1,
				// source: {
				// 	name: maybeFileUrlToPath(callFrame.url),
				// 	path: maybeFileUrlToPath(callFrame.url),
				// 	sourceReference: 0,
				// },
			},
		});

		return id;
	};

	for (const node of profile.nodes) {
		node.locationId = getLocationIdFor(node.callFrame);
		node.positionTicks = node.positionTicks?.map(tick => ({
			...tick,
			// weirdly, line numbers here are 1-based, not 0-based. The position tick
			// only gives line-level granularity, so 'mark' the entire range of source
			// code the tick refers to
			startLocationId: getLocationIdFor({
				...node.callFrame,
				lineNumber: tick.line - 1,
				columnNumber: 0,
			}),
			endLocationId: getLocationIdFor({
				...node.callFrame,
				lineNumber: tick.line,
				columnNumber: 0,
			}),
		}));
	}

	return [...locationsByRef.values()]
		.sort((a, b) => a.id - b.id)
		.map(l => ({ locations: [l.location], callFrame: l.callFrame }));
};

/**
 * Computes the model for the given profile.
 */
export const buildModel = (profile: ICpuProfileRaw): IProfileModel => {
	if (!profile.timeDeltas || !profile.samples) {
		return {
			nodes: [],
			locations: [],
			samples: profile.samples || [],
			timeDeltas: profile.timeDeltas || [],
			// rootPath: profile.$vscode?.rootPath,
			duration: profile.endTime - profile.startTime,
		};
	}

	const { samples, timeDeltas } = profile;
	const sourceLocations = ensureSourceLocations(profile);
	const locations: ILocation[] = sourceLocations.map((l, id) => {
		const src = l.locations[0]; //getBestLocation(profile, l.locations);

		return {
			id,
			selfTime: 0,
			aggregateTime: 0,
			ticks: 0,
			// category: categorize(l.callFrame, src),
			callFrame: l.callFrame,
			src,
		};
	});

	const idMap = new Map<number /* id in profile */, number /* incrementing ID */>();
	const mapId = (nodeId: number) => {
		let id = idMap.get(nodeId);
		if (id === undefined) {
			id = idMap.size;
			idMap.set(nodeId, id);
		}

		return id;
	};

	// 1. Created a sorted list of nodes. It seems that the profile always has
	// incrementing IDs, although they are just not initially sorted.
	const nodes = new Array<IComputedNode>(profile.nodes.length);
	for (let i = 0; i < profile.nodes.length; i++) {
		const node = profile.nodes[i];

		// make them 0-based:
		const id = mapId(node.id);
		nodes[id] = {
			id,
			selfTime: 0,
			aggregateTime: 0,
			locationId: node.locationId as number,
			children: node.children?.map(mapId) || [],
		};

		for (const child of node.positionTicks || []) {
			if (child.startLocationId) {
				locations[child.startLocationId].ticks += child.ticks;
			}
		}
	}

	for (const node of nodes) {
		for (const child of node.children) {
			nodes[child].parent = node.id;
		}
	}

	// 2. The profile samples are the 'bottom-most' node, the currently running
	// code. Sum of these in the self time.
	const duration = profile.endTime - profile.startTime;
	let lastNodeTime = duration - timeDeltas[0];
	for (let i = 0; i < timeDeltas.length - 1; i++) {
		const d = timeDeltas[i + 1];
		nodes[mapId(samples[i])].selfTime += d;
		lastNodeTime -= d;
	}

	// Add in an extra time delta for the last sample. `timeDeltas[0]` is the
	// time before the first sample, and the time of the last sample is only
	// derived (approximately) by the missing time in the sum of deltas. Save
	// some work by calculating it here.
	if (nodes.length) {
		nodes[mapId(samples[timeDeltas.length - 1])].selfTime += lastNodeTime;
		timeDeltas.push(lastNodeTime);
	}

	// 3. Add the aggregate times for all node children and locations
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		const location = locations[node.locationId];
		location.aggregateTime += computeAggregateTime(i, nodes);
		location.selfTime += node.selfTime;
	}

	return {
		nodes,
		locations,
		samples: samples.map(mapId),
		timeDeltas,
		// rootPath: profile.$vscode?.rootPath,
		duration,
	};
};

export class BottomUpNode {
	public static root() {
		return new BottomUpNode({
			id: -1,
			selfTime: 0,
			aggregateTime: 0,
			ticks: 0,
			callFrame: {
				functionName: '(root)',
				lineNumber: -1,
				columnNumber: -1,
				scriptId: '0',
				url: '',
			},
		});
	}

	public children: { [id: number]: BottomUpNode } = {};
	public aggregateTime = 0;
	public selfTime = 0;
	public ticks = 0;
	public childrenSize = 0;

	public get id() {
		return this.location.id;
	}

	public get callFrame() {
		return this.location.callFrame;
	}

	public get src() {
		return this.location.src;
	}

	constructor(public readonly location: ILocation, public readonly parent?: BottomUpNode) { }

	public addNode(node: IComputedNode) {
		this.selfTime += node.selfTime;
		this.aggregateTime += node.aggregateTime;
	}

}

export const processNode = (aggregate: BottomUpNode, node: IComputedNode, model: IProfileModel, initialNode = node) => {
	let child = aggregate.children[node.locationId];
	if (!child) {
		child = new BottomUpNode(model.locations[node.locationId], aggregate);
		aggregate.childrenSize++;
		aggregate.children[node.locationId] = child;
	}

	child.addNode(initialNode);

	if (node.parent) {
		processNode(child, model.nodes[node.parent], model, initialNode);
	}
};

//#endregion


export interface BottomUpSample {
	selfTime: number;
	totalTime: number;
	location: string;
	absLocation: string;
	url: string;
	caller: { percentage: number; absLocation: string; location: string }[];
	percentage: number;
	isSpecial: boolean;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/profiling/common/profilingTelemetrySpec.ts]---
Location: vscode-main/src/vs/platform/profiling/common/profilingTelemetrySpec.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILogService } from '../../log/common/log.js';
import { BottomUpSample } from './profilingModel.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { errorHandler } from '../../../base/common/errors.js';

type TelemetrySampleData = {
	selfTime: number;
	totalTime: number;
	percentage: number;
	perfBaseline: number;
	functionName: string;
	callers: string;
	callersAnnotated: string;
	source: string;
};

type TelemetrySampleDataClassification = {
	owner: 'jrieken';
	comment: 'A callstack that took a long time to execute';
	selfTime: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Self time of the sample' };
	totalTime: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Total time of the sample' };
	percentage: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Relative time (percentage) of the sample' };
	perfBaseline: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Performance baseline for the machine' };
	functionName: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The name of the sample' };
	callers: { classification: 'CallstackOrException'; purpose: 'PerformanceAndHealth'; comment: 'The heaviest call trace into this sample' };
	callersAnnotated: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The heaviest call trace into this sample annotated with respective costs' };
	source: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The source - either renderer or an extension' };
};

export interface SampleData {
	perfBaseline: number;
	sample: BottomUpSample;
	source: string;
}

export function reportSample(data: SampleData, telemetryService: ITelemetryService, logService: ILogService, sendAsErrorTelemtry: boolean): void {

	const { sample, perfBaseline, source } = data;

	// send telemetry event
	telemetryService.publicLog2<TelemetrySampleData, TelemetrySampleDataClassification>(`unresponsive.sample`, {
		perfBaseline,
		selfTime: sample.selfTime,
		totalTime: sample.totalTime,
		percentage: sample.percentage,
		functionName: sample.location,
		callers: sample.caller.map(c => c.location).join('<'),
		callersAnnotated: sample.caller.map(c => `${c.percentage}|${c.location}`).join('<'),
		source
	});

	// log a fake error with a clearer stack
	const fakeError = new PerformanceError(data);
	if (sendAsErrorTelemtry) {
		errorHandler.onUnexpectedError(fakeError);
	} else {
		logService.error(fakeError);
	}
}

class PerformanceError extends Error {
	readonly selfTime: number;

	constructor(data: SampleData) {
		// Since the stacks are available via the sample
		// we can avoid collecting them when constructing the error.
		if (Error.hasOwnProperty('stackTraceLimit')) {
			// eslint-disable-next-line local/code-no-any-casts
			const Err = Error as any as { stackTraceLimit: number }; // For the monaco editor checks.
			const stackTraceLimit = Err.stackTraceLimit;
			Err.stackTraceLimit = 0;
			super(`PerfSampleError: by ${data.source} in ${data.sample.location}`);
			Err.stackTraceLimit = stackTraceLimit;
		} else {
			super(`PerfSampleError: by ${data.source} in ${data.sample.location}`);
		}
		this.name = 'PerfSampleError';
		this.selfTime = data.sample.selfTime;

		const trace = [data.sample.absLocation, ...data.sample.caller.map(c => c.absLocation)];
		this.stack = `\n\t at ${trace.join('\n\t at ')}`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/profiling/electron-browser/profileAnalysisWorker.ts]---
Location: vscode-main/src/vs/platform/profiling/electron-browser/profileAnalysisWorker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { basename } from '../../../base/common/path.js';
import { TernarySearchTree } from '../../../base/common/ternarySearchTree.js';
import { URI } from '../../../base/common/uri.js';
import { IWebWorkerServerRequestHandler } from '../../../base/common/worker/webWorker.js';
import { IV8Profile, Utils } from '../common/profiling.js';
import { IProfileModel, BottomUpSample, buildModel, BottomUpNode, processNode, CdpCallFrame } from '../common/profilingModel.js';
import { BottomUpAnalysis, IProfileAnalysisWorker, ProfilingOutput } from './profileAnalysisWorkerService.js';

export function create(): IWebWorkerServerRequestHandler {
	return new ProfileAnalysisWorker();
}

class ProfileAnalysisWorker implements IWebWorkerServerRequestHandler, IProfileAnalysisWorker {

	_requestHandlerBrand: void = undefined;

	$analyseBottomUp(profile: IV8Profile): BottomUpAnalysis {
		if (!Utils.isValidProfile(profile)) {
			return { kind: ProfilingOutput.Irrelevant, samples: [] };
		}

		const model = buildModel(profile);
		const samples = bottomUp(model, 5)
			.filter(s => !s.isSpecial);

		if (samples.length === 0 || samples[0].percentage < 10) {
			// ignore this profile because 90% of the time is spent inside "special" frames
			// like idle, GC, or program
			return { kind: ProfilingOutput.Irrelevant, samples: [] };
		}

		return { kind: ProfilingOutput.Interesting, samples };
	}

	$analyseByUrlCategory(profile: IV8Profile, categories: [url: URI, category: string][]): [category: string, aggregated: number][] {

		// build search tree
		const searchTree = TernarySearchTree.forUris<string>();
		searchTree.fill(categories);

		// cost by categories
		const model = buildModel(profile);
		const aggegrateByCategory = new Map<string, number>();

		for (const node of model.nodes) {
			const loc = model.locations[node.locationId];
			let category: string | undefined;
			try {
				category = searchTree.findSubstr(URI.parse(loc.callFrame.url));
			} catch {
				// ignore
			}
			if (!category) {
				category = printCallFrameShort(loc.callFrame);
			}
			const value = aggegrateByCategory.get(category) ?? 0;
			const newValue = value + node.selfTime;
			aggegrateByCategory.set(category, newValue);
		}

		const result: [string, number][] = [];
		for (const [key, value] of aggegrateByCategory) {
			result.push([key, value]);
		}
		return result;
	}
}

function isSpecial(call: CdpCallFrame): boolean {
	return call.functionName.startsWith('(') && call.functionName.endsWith(')');
}

function printCallFrameShort(frame: CdpCallFrame): string {
	let result = frame.functionName || '(anonymous)';
	if (frame.url) {
		result += '#';
		result += basename(frame.url);
		if (frame.lineNumber >= 0) {
			result += ':';
			result += frame.lineNumber + 1;
		}
		if (frame.columnNumber >= 0) {
			result += ':';
			result += frame.columnNumber + 1;
		}
	}
	return result;
}

function printCallFrameStackLike(frame: CdpCallFrame): string {
	let result = frame.functionName || '(anonymous)';
	if (frame.url) {
		result += ' (';
		result += frame.url;
		if (frame.lineNumber >= 0) {
			result += ':';
			result += frame.lineNumber + 1;
		}
		if (frame.columnNumber >= 0) {
			result += ':';
			result += frame.columnNumber + 1;
		}
		result += ')';
	}
	return result;
}

function getHeaviestLocationIds(model: IProfileModel, topN: number) {
	const stackSelfTime: { [locationId: number]: number } = {};
	for (const node of model.nodes) {
		stackSelfTime[node.locationId] = (stackSelfTime[node.locationId] || 0) + node.selfTime;
	}

	const locationIds = Object.entries(stackSelfTime)
		.sort(([, a], [, b]) => b - a)
		.slice(0, topN)
		.map(([locationId]) => Number(locationId));

	return new Set(locationIds);
}

function bottomUp(model: IProfileModel, topN: number) {
	const root = BottomUpNode.root();
	const locationIds = getHeaviestLocationIds(model, topN);

	for (const node of model.nodes) {
		if (locationIds.has(node.locationId)) {
			processNode(root, node, model);
			root.addNode(node);
		}
	}

	const result = Object.values(root.children)
		.sort((a, b) => b.selfTime - a.selfTime)
		.slice(0, topN);

	const samples: BottomUpSample[] = [];

	for (const node of result) {

		const sample: BottomUpSample = {
			selfTime: Math.round(node.selfTime / 1000),
			totalTime: Math.round(node.aggregateTime / 1000),
			location: printCallFrameShort(node.callFrame),
			absLocation: printCallFrameStackLike(node.callFrame),
			url: node.callFrame.url,
			caller: [],
			percentage: Math.round(node.selfTime / (model.duration / 100)),
			isSpecial: isSpecial(node.callFrame)
		};

		// follow the heaviest caller paths
		const stack = [node];
		while (stack.length) {
			const node = stack.pop()!;
			let top: BottomUpNode | undefined;
			for (const candidate of Object.values(node.children)) {
				if (!top || top.selfTime < candidate.selfTime) {
					top = candidate;
				}
			}
			if (top) {
				const percentage = Math.round(top.selfTime / (node.selfTime / 100));
				sample.caller.push({
					percentage,
					location: printCallFrameShort(top.callFrame),
					absLocation: printCallFrameStackLike(top.callFrame),
				});
				stack.push(top);
			}
		}

		samples.push(sample);
	}

	return samples;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/profiling/electron-browser/profileAnalysisWorkerMain.ts]---
Location: vscode-main/src/vs/platform/profiling/electron-browser/profileAnalysisWorkerMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { create } from './profileAnalysisWorker.js';
import { bootstrapWebWorker } from '../../../base/common/worker/webWorkerBootstrap.js';

bootstrapWebWorker(create);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/profiling/electron-browser/profileAnalysisWorkerService.ts]---
Location: vscode-main/src/vs/platform/profiling/electron-browser/profileAnalysisWorkerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { WebWorkerDescriptor } from '../../webWorker/browser/webWorkerDescriptor.js';
import { URI } from '../../../base/common/uri.js';
import { Proxied } from '../../../base/common/worker/webWorker.js';
import { InstantiationType, registerSingleton } from '../../instantiation/common/extensions.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IWebWorkerService } from '../../webWorker/browser/webWorkerService.js';
import { ILogService } from '../../log/common/log.js';
import { IV8Profile } from '../common/profiling.js';
import { BottomUpSample } from '../common/profilingModel.js';
import { reportSample } from '../common/profilingTelemetrySpec.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { FileAccess } from '../../../base/common/network.js';

export const enum ProfilingOutput {
	Failure,
	Irrelevant,
	Interesting,
}

export interface IScriptUrlClassifier {
	(scriptUrl: string): string;
}

export const IProfileAnalysisWorkerService = createDecorator<IProfileAnalysisWorkerService>('IProfileAnalysisWorkerService');

export interface IProfileAnalysisWorkerService {
	readonly _serviceBrand: undefined;
	analyseBottomUp(profile: IV8Profile, callFrameClassifier: IScriptUrlClassifier, perfBaseline: number, sendAsErrorTelemtry: boolean): Promise<ProfilingOutput>;
	analyseByLocation(profile: IV8Profile, locations: [location: URI, id: string][]): Promise<[category: string, aggregated: number][]>;
}


// ---- impl

class ProfileAnalysisWorkerService implements IProfileAnalysisWorkerService {

	declare _serviceBrand: undefined;

	constructor(
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@ILogService private readonly _logService: ILogService,
		@IWebWorkerService private readonly _webWorkerService: IWebWorkerService,
	) { }

	private async _withWorker<R>(callback: (worker: Proxied<IProfileAnalysisWorker>) => Promise<R>): Promise<R> {

		const worker = this._webWorkerService.createWorkerClient<IProfileAnalysisWorker>(
			new WebWorkerDescriptor({
				esmModuleLocation: FileAccess.asBrowserUri('vs/platform/profiling/electron-browser/profileAnalysisWorkerMain.js'),
				label: 'CpuProfileAnalysisWorker'
			})
		);

		try {
			const r = await callback(worker.proxy);
			return r;
		} finally {
			worker.dispose();
		}
	}

	async analyseBottomUp(profile: IV8Profile, callFrameClassifier: IScriptUrlClassifier, perfBaseline: number, sendAsErrorTelemtry: boolean): Promise<ProfilingOutput> {
		return this._withWorker(async worker => {
			const result = await worker.$analyseBottomUp(profile);
			if (result.kind === ProfilingOutput.Interesting) {
				for (const sample of result.samples) {
					reportSample({
						sample,
						perfBaseline,
						source: callFrameClassifier(sample.url)
					}, this._telemetryService, this._logService, sendAsErrorTelemtry);
				}
			}
			return result.kind;
		});
	}

	async analyseByLocation(profile: IV8Profile, locations: [location: URI, id: string][]): Promise<[category: string, aggregated: number][]> {
		return this._withWorker(async worker => {
			const result = await worker.$analyseByUrlCategory(profile, locations);
			return result;
		});
	}
}

// ---- worker contract

export interface BottomUpAnalysis {
	kind: ProfilingOutput;
	samples: BottomUpSample[];
}

export interface CategoryAnalysis {
	category: string;
	percentage: number;
	aggregated: number;
	overallDuration: number;
}

export interface IProfileAnalysisWorker {
	$analyseBottomUp(profile: IV8Profile): BottomUpAnalysis;
	$analyseByUrlCategory(profile: IV8Profile, categories: [url: URI, category: string][]): [category: string, aggregated: number][];
}

registerSingleton(IProfileAnalysisWorkerService, ProfileAnalysisWorkerService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/profiling/electron-browser/profilingService.ts]---
Location: vscode-main/src/vs/platform/profiling/electron-browser/profilingService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerSharedProcessRemoteService } from '../../ipc/electron-browser/services.js';
import { IV8InspectProfilingService } from '../common/profiling.js';

registerSharedProcessRemoteService(IV8InspectProfilingService, 'v8InspectProfiling');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/profiling/electron-main/windowProfiling.ts]---
Location: vscode-main/src/vs/platform/profiling/electron-main/windowProfiling.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { ProfileResult } from 'v8-inspect-profiler';
import { BrowserWindow } from 'electron';
import { timeout } from '../../../base/common/async.js';
import { ILogService } from '../../log/common/log.js';
import { IV8Profile } from '../common/profiling.js';

export class WindowProfiler {

	constructor(
		private readonly _window: BrowserWindow,
		private readonly _sessionId: string,
		@ILogService private readonly _logService: ILogService,
	) { }

	async inspect(duration: number): Promise<IV8Profile> {

		await this._connect();

		const inspector = this._window.webContents.debugger;
		await inspector.sendCommand('Profiler.start');
		this._logService.warn('[perf] profiling STARTED', this._sessionId);
		await timeout(duration);
		const data: ProfileResult = await inspector.sendCommand('Profiler.stop');
		this._logService.warn('[perf] profiling DONE', this._sessionId);

		await this._disconnect();
		return data.profile;
	}

	private async _connect() {
		const inspector = this._window.webContents.debugger;
		inspector.attach();
		await inspector.sendCommand('Profiler.enable');
	}

	private async _disconnect() {
		const inspector = this._window.webContents.debugger;
		await inspector.sendCommand('Profiler.disable');
		inspector.detach();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/profiling/node/profilingService.ts]---
Location: vscode-main/src/vs/platform/profiling/node/profilingService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { ProfilingSession } from 'v8-inspect-profiler';
import { generateUuid } from '../../../base/common/uuid.js';
import { IV8InspectProfilingService, IV8Profile } from '../common/profiling.js';

export class InspectProfilingService implements IV8InspectProfilingService {

	_serviceBrand: undefined;

	private readonly _sessions = new Map<string, ProfilingSession>();

	async startProfiling(options: { host: string; port: number }): Promise<string> {
		const prof = await import('v8-inspect-profiler');
		const session = await prof.startProfiling({ host: options.host, port: options.port, checkForPaused: true });
		const id = generateUuid();
		this._sessions.set(id, session);
		return id;
	}

	async stopProfiling(sessionId: string): Promise<IV8Profile> {
		const session = this._sessions.get(sessionId);
		if (!session) {
			throw new Error(`UNKNOWN session '${sessionId}'`);
		}
		const result = await session.stop();
		this._sessions.delete(sessionId);
		return result.profile;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/progress/common/progress.ts]---
Location: vscode-main/src/vs/platform/progress/common/progress.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAction } from '../../../base/common/actions.js';
import { DeferredPromise } from '../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../base/common/cancellation.js';
import { Disposable, DisposableStore, toDisposable } from '../../../base/common/lifecycle.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { INotificationSource, NotificationPriority } from '../../notification/common/notification.js';

export const IProgressService = createDecorator<IProgressService>('progressService');

/**
 * A progress service that can be used to report progress to various locations of the UI.
 */
export interface IProgressService {

	readonly _serviceBrand: undefined;

	withProgress<R>(
		options: IProgressOptions | IProgressDialogOptions | IProgressNotificationOptions | IProgressWindowOptions | IProgressCompositeOptions,
		task: (progress: IProgress<IProgressStep>) => Promise<R>,
		onDidCancel?: (choice?: number) => void
	): Promise<R>;
}

export interface IProgressIndicator {

	/**
	 * Show progress customized with the provided flags.
	 */
	show(infinite: true, delay?: number): IProgressRunner;
	show(total: number, delay?: number): IProgressRunner;

	/**
	 * Indicate progress for the duration of the provided promise. Progress will stop in
	 * any case of promise completion, error or cancellation.
	 */
	showWhile(promise: Promise<unknown>, delay?: number): Promise<void>;
}

export const enum ProgressLocation {
	Explorer = 1,
	Scm = 3,
	Extensions = 5,
	Window = 10,
	Notification = 15,
	Dialog = 20
}

export interface IProgressOptions {
	readonly location: ProgressLocation | string;
	readonly title?: string;
	readonly source?: string | INotificationSource;
	readonly total?: number;
	readonly cancellable?: boolean | string;
	readonly buttons?: string[];
}

export interface IProgressNotificationOptions extends IProgressOptions {
	readonly location: ProgressLocation.Notification;
	readonly primaryActions?: readonly IAction[];
	readonly secondaryActions?: readonly IAction[];
	readonly delay?: number;
	readonly priority?: NotificationPriority;
	readonly type?: 'loading' | 'syncing';
}

export interface IProgressDialogOptions extends IProgressOptions {
	readonly delay?: number;
	readonly detail?: string;
	readonly sticky?: boolean;
}

export interface IProgressWindowOptions extends IProgressOptions {
	readonly location: ProgressLocation.Window;
	readonly command?: string;
	readonly type?: 'loading' | 'syncing';
}

export interface IProgressCompositeOptions extends IProgressOptions {
	readonly location: ProgressLocation.Explorer | ProgressLocation.Extensions | ProgressLocation.Scm | string;
	readonly delay?: number;
}

export interface IProgressStep {
	message?: string;
	increment?: number;
	total?: number;
}

export interface IProgressRunner {
	total(value: number): void;
	worked(value: number): void;
	done(): void;
}

export const emptyProgressRunner = Object.freeze<IProgressRunner>({
	total() { },
	worked() { },
	done() { }
});

export interface IProgress<T> {
	report(item: T): void;
}

export class Progress<T> implements IProgress<T> {

	static readonly None = Object.freeze<IProgress<unknown>>({ report() { } });

	private _value?: T;
	get value(): T | undefined { return this._value; }

	constructor(private callback: (data: T) => unknown) {
	}

	report(item: T) {
		this._value = item;
		this.callback(this._value);
	}
}

/**
 * A helper to show progress during a long running operation. If the operation
 * is started multiple times, only the last invocation will drive the progress.
 */
export interface IOperation {
	id: number;
	isCurrent: () => boolean;
	token: CancellationToken;
	stop(): void;
}

/**
 * RAII-style progress instance that allows imperative reporting and hides
 * once `dispose()` is called.
 */
export class UnmanagedProgress extends Disposable {
	private readonly deferred = new DeferredPromise<void>();
	private reporter?: IProgress<IProgressStep>;
	private lastStep?: IProgressStep;

	constructor(
		options: IProgressOptions | IProgressDialogOptions | IProgressNotificationOptions | IProgressWindowOptions | IProgressCompositeOptions,
		@IProgressService progressService: IProgressService,
	) {
		super();
		progressService.withProgress(options, reporter => {
			this.reporter = reporter;
			if (this.lastStep) {
				reporter.report(this.lastStep);
			}

			return this.deferred.p;
		});

		this._register(toDisposable(() => this.deferred.complete()));
	}

	report(step: IProgressStep) {
		if (this.reporter) {
			this.reporter.report(step);
		} else {
			this.lastStep = step;
		}
	}
}

export class LongRunningOperation extends Disposable {
	private currentOperationId = 0;
	private readonly currentOperationDisposables = this._register(new DisposableStore());
	private currentProgressRunner: IProgressRunner | undefined;
	private currentProgressTimeout: Timeout | undefined = undefined;

	constructor(
		private progressIndicator: IProgressIndicator
	) {
		super();
	}

	start(progressDelay: number): IOperation {

		// Stop any previous operation
		this.stop();

		// Start new
		const newOperationId = ++this.currentOperationId;
		const newOperationToken = new CancellationTokenSource();
		this.currentProgressTimeout = setTimeout(() => {
			if (newOperationId === this.currentOperationId) {
				this.currentProgressRunner = this.progressIndicator.show(true);
			}
		}, progressDelay);

		this.currentOperationDisposables.add(toDisposable(() => clearTimeout(this.currentProgressTimeout)));
		this.currentOperationDisposables.add(toDisposable(() => newOperationToken.cancel()));
		this.currentOperationDisposables.add(toDisposable(() => this.currentProgressRunner ? this.currentProgressRunner.done() : undefined));

		return {
			id: newOperationId,
			token: newOperationToken.token,
			stop: () => this.doStop(newOperationId),
			isCurrent: () => this.currentOperationId === newOperationId
		};
	}

	stop(): void {
		this.doStop(this.currentOperationId);
	}

	private doStop(operationId: number): void {
		if (this.currentOperationId === operationId) {
			this.currentOperationDisposables.clear();
		}
	}
}

export const IEditorProgressService = createDecorator<IEditorProgressService>('editorProgressService');

/**
 * A progress service that will report progress local to the editor triggered from.
 */
export interface IEditorProgressService extends IProgressIndicator {

	readonly _serviceBrand: undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/protocol/electron-main/protocol.ts]---
Location: vscode-main/src/vs/platform/protocol/electron-main/protocol.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IProtocolMainService = createDecorator<IProtocolMainService>('protocolMainService');

export interface IIPCObjectUrl<T> extends IDisposable {

	/**
	 * A `URI` that a renderer can use to retrieve the
	 * object via `ipcRenderer.invoke(resource.toString())`
	 */
	resource: URI;

	/**
	 * Allows to update the value of the object after it
	 * has been created.
	 *
	 * @param obj the object to make accessible to the
	 * renderer.
	 */
	update(obj: T): void;
}

export interface IProtocolMainService {

	readonly _serviceBrand: undefined;

	/**
	 * Allows to make an object accessible to a renderer
	 * via `ipcRenderer.invoke(resource.toString())`.
	 */
	createIPCObjectUrl<T>(): IIPCObjectUrl<T>;

	/**
	 * Adds a path as root to the list of allowed
	 * resources for file access.
	 *
	 * @param root the path to allow for file access
	 */
	addValidFileRoot(root: string): IDisposable;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/protocol/electron-main/protocolMainService.ts]---
Location: vscode-main/src/vs/platform/protocol/electron-main/protocolMainService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { session } from 'electron';
import { Disposable, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { COI, FileAccess, Schemas, CacheControlheaders, DocumentPolicyheaders } from '../../../base/common/network.js';
import { basename, extname, normalize } from '../../../base/common/path.js';
import { isLinux } from '../../../base/common/platform.js';
import { TernarySearchTree } from '../../../base/common/ternarySearchTree.js';
import { URI } from '../../../base/common/uri.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { validatedIpcMain } from '../../../base/parts/ipc/electron-main/ipcMain.js';
import { INativeEnvironmentService } from '../../environment/common/environment.js';
import { ILogService } from '../../log/common/log.js';
import { IIPCObjectUrl, IProtocolMainService } from './protocol.js';
import { IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';

type ProtocolCallback = { (result: string | Electron.FilePathWithHeaders | { error: number }): void };

export class ProtocolMainService extends Disposable implements IProtocolMainService {

	declare readonly _serviceBrand: undefined;

	private readonly validRoots = TernarySearchTree.forPaths<boolean>(!isLinux);
	private readonly validExtensions = new Set(['.svg', '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.mp4', '.otf', '.ttf']); // https://github.com/microsoft/vscode/issues/119384

	constructor(
		@INativeEnvironmentService private readonly environmentService: INativeEnvironmentService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@ILogService private readonly logService: ILogService
	) {
		super();

		// Define an initial set of roots we allow loading from
		// - appRoot	: all files installed as part of the app
		// - extensions : all files shipped from extensions
		// - storage    : all files in global and workspace storage (https://github.com/microsoft/vscode/issues/116735)
		this.addValidFileRoot(environmentService.appRoot);
		this.addValidFileRoot(environmentService.extensionsPath);
		this.addValidFileRoot(userDataProfilesService.defaultProfile.globalStorageHome.with({ scheme: Schemas.file }).fsPath);
		this.addValidFileRoot(environmentService.workspaceStorageHome.with({ scheme: Schemas.file }).fsPath);

		// Handle protocols
		this.handleProtocols();
	}

	private handleProtocols(): void {
		const { defaultSession } = session;

		// Register vscode-file:// handler
		defaultSession.protocol.registerFileProtocol(Schemas.vscodeFileResource, (request, callback) => this.handleResourceRequest(request, callback));

		// Block any file:// access
		defaultSession.protocol.interceptFileProtocol(Schemas.file, (request, callback) => this.handleFileRequest(request, callback));

		// Cleanup
		this._register(toDisposable(() => {
			defaultSession.protocol.unregisterProtocol(Schemas.vscodeFileResource);
			defaultSession.protocol.uninterceptProtocol(Schemas.file);
		}));
	}

	addValidFileRoot(root: string): IDisposable {

		// Pass to `normalize` because we later also do the
		// same for all paths to check against.
		const normalizedRoot = normalize(root);

		if (!this.validRoots.get(normalizedRoot)) {
			this.validRoots.set(normalizedRoot, true);

			return toDisposable(() => this.validRoots.delete(normalizedRoot));
		}

		return Disposable.None;
	}

	//#region file://

	private handleFileRequest(request: Electron.ProtocolRequest, callback: ProtocolCallback) {
		const uri = URI.parse(request.url);

		this.logService.error(`Refused to load resource ${uri.fsPath} from ${Schemas.file}: protocol (original URL: ${request.url})`);

		return callback({ error: -3 /* ABORTED */ });
	}

	//#endregion

	//#region vscode-file://

	private handleResourceRequest(request: Electron.ProtocolRequest, callback: ProtocolCallback): void {
		const path = this.requestToNormalizedFilePath(request);
		const pathBasename = basename(path);

		let headers: Record<string, string> | undefined;
		if (this.environmentService.crossOriginIsolated) {
			if (pathBasename === 'workbench.html' || pathBasename === 'workbench-dev.html') {
				headers = COI.CoopAndCoep;
			} else {
				headers = COI.getHeadersFromQuery(request.url);
			}
		}

		// In OSS, evict resources from the memory cache in the renderer process
		// Refs https://github.com/microsoft/vscode/issues/148541#issuecomment-2670891511
		if (!this.environmentService.isBuilt) {
			headers = {
				...headers,
				...CacheControlheaders
			};
		}

		// Document-policy header is needed for collecting
		// JavaScript callstacks via https://www.electronjs.org/docs/latest/api/web-frame-main#framecollectjavascriptcallstack-experimental
		// until https://github.com/electron/electron/issues/45356 is resolved.
		if (pathBasename === 'workbench.html' || pathBasename === 'workbench-dev.html') {
			headers = {
				...headers,
				...DocumentPolicyheaders
			};
		}

		// first check by validRoots
		if (this.validRoots.findSubstr(path)) {
			return callback({ path, headers });
		}

		// then check by validExtensions
		if (this.validExtensions.has(extname(path).toLowerCase())) {
			return callback({ path, headers });
		}

		// finally block to load the resource
		this.logService.error(`${Schemas.vscodeFileResource}: Refused to load resource ${path} from ${Schemas.vscodeFileResource}: protocol (original URL: ${request.url})`);

		return callback({ error: -3 /* ABORTED */ });
	}

	private requestToNormalizedFilePath(request: Electron.ProtocolRequest): string {

		// 1.) Use `URI.parse()` util from us to convert the raw
		//     URL into our URI.
		const requestUri = URI.parse(request.url);

		// 2.) Use `FileAccess.asFileUri` to convert back from a
		//     `vscode-file:` URI to a `file:` URI.
		const unnormalizedFileUri = FileAccess.uriToFileUri(requestUri);

		// 3.) Strip anything from the URI that could result in
		//     relative paths (such as "..") by using `normalize`
		return normalize(unnormalizedFileUri.fsPath);
	}

	//#endregion

	//#region IPC Object URLs

	createIPCObjectUrl<T>(): IIPCObjectUrl<T> {
		let obj: T | undefined = undefined;

		// Create unique URI
		const resource = URI.from({
			scheme: 'vscode', // used for all our IPC communication (vscode:<channel>)
			path: generateUuid()
		});

		// Install IPC handler
		const channel = resource.toString();
		const handler = async (): Promise<T | undefined> => obj;
		validatedIpcMain.handle(channel, handler);

		this.logService.trace(`IPC Object URL: Registered new channel ${channel}.`);

		return {
			resource,
			update: updatedObj => obj = updatedObj,
			dispose: () => {
				this.logService.trace(`IPC Object URL: Removed channel ${channel}.`);

				validatedIpcMain.removeHandler(channel);
			}
		};
	}

	//#endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/quickinput/browser/commandsQuickAccess.ts]---
Location: vscode-main/src/vs/platform/quickinput/browser/commandsQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WorkbenchActionExecutedClassification, WorkbenchActionExecutedEvent } from '../../../base/common/actions.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Codicon } from '../../../base/common/codicons.js';
import { toErrorMessage } from '../../../base/common/errorMessage.js';
import { isCancellationError } from '../../../base/common/errors.js';
import { IMatch, matchesBaseContiguousSubString, matchesWords, or } from '../../../base/common/filters.js';
import { createSingleCallFunction } from '../../../base/common/functional.js';
import { Disposable, DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { LRUCache } from '../../../base/common/map.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { TfIdfCalculator, normalizeTfIdfScores } from '../../../base/common/tfIdf.js';
import { localize } from '../../../nls.js';
import { ILocalizedString } from '../../action/common/action.js';
import { ICommandService } from '../../commands/common/commands.js';
import { IConfigurationChangeEvent, IConfigurationService } from '../../configuration/common/configuration.js';
import { IDialogService } from '../../dialogs/common/dialogs.js';
import { IInstantiationService } from '../../instantiation/common/instantiation.js';
import { IKeybindingService } from '../../keybinding/common/keybinding.js';
import { ILogService } from '../../log/common/log.js';
import { FastAndSlowPicks, IPickerQuickAccessItem, IPickerQuickAccessProviderOptions, PickerQuickAccessProvider, Picks, TriggerAction } from './pickerQuickAccess.js';
import { IQuickAccessProviderRunOptions } from '../common/quickAccess.js';
import { IKeyMods, IQuickPickSeparator } from '../common/quickInput.js';
import { IStorageService, StorageScope, StorageTarget, WillSaveStateReason } from '../../storage/common/storage.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { Categories } from '../../action/common/actionCommonCategories.js';

export interface ICommandQuickPick extends IPickerQuickAccessItem {
	readonly commandId: string;
	readonly commandWhen?: string;
	readonly commandAlias?: string;
	readonly commandDescription?: ILocalizedString;
	readonly commandCategory?: string;

	readonly args?: unknown[];

	tfIdfScore?: number;
}

export interface ICommandsQuickAccessOptions extends IPickerQuickAccessProviderOptions<ICommandQuickPick> {
	readonly showAlias: boolean;
	suggestedCommandIds?: Set<string>;
}

export abstract class AbstractCommandsQuickAccessProvider extends PickerQuickAccessProvider<ICommandQuickPick> implements IDisposable {

	static PREFIX = '>';

	private static readonly TFIDF_THRESHOLD = 0.5;
	private static readonly TFIDF_MAX_RESULTS = 5;

	private static WORD_FILTER = or(matchesBaseContiguousSubString, matchesWords);

	private readonly commandsHistory: CommandsHistory;

	protected override readonly options: ICommandsQuickAccessOptions;

	constructor(
		options: ICommandsQuickAccessOptions,
		@IInstantiationService instantiationService: IInstantiationService,
		@IKeybindingService protected readonly keybindingService: IKeybindingService,
		@ICommandService private readonly commandService: ICommandService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IDialogService private readonly dialogService: IDialogService
	) {
		super(AbstractCommandsQuickAccessProvider.PREFIX, options);

		this.commandsHistory = this._register(instantiationService.createInstance(CommandsHistory));

		this.options = options;
	}

	protected async _getPicks(filter: string, _disposables: DisposableStore, token: CancellationToken, runOptions?: IQuickAccessProviderRunOptions): Promise<Picks<ICommandQuickPick> | FastAndSlowPicks<ICommandQuickPick>> {

		// Ask subclass for all command picks
		const allCommandPicks = await this.getCommandPicks(token);

		if (token.isCancellationRequested) {
			return [];
		}

		const runTfidf = createSingleCallFunction(() => {
			const tfidf = new TfIdfCalculator();
			tfidf.updateDocuments(allCommandPicks.map(commandPick => ({
				key: commandPick.commandId,
				textChunks: [this.getTfIdfChunk(commandPick)]
			})));
			const result = tfidf.calculateScores(filter, token);

			return normalizeTfIdfScores(result)
				.filter(score => score.score > AbstractCommandsQuickAccessProvider.TFIDF_THRESHOLD)
				.slice(0, AbstractCommandsQuickAccessProvider.TFIDF_MAX_RESULTS);
		});

		// Filter
		const filteredCommandPicks: ICommandQuickPick[] = [];
		for (const commandPick of allCommandPicks) {
			const labelHighlights = AbstractCommandsQuickAccessProvider.WORD_FILTER(filter, commandPick.label) ?? undefined;

			let aliasHighlights: IMatch[] | undefined;
			if (commandPick.commandAlias) {
				aliasHighlights = AbstractCommandsQuickAccessProvider.WORD_FILTER(filter, commandPick.commandAlias) ?? undefined;
			}

			// Add if matching in label or alias
			if (labelHighlights || aliasHighlights) {
				commandPick.highlights = {
					label: labelHighlights,
					detail: this.options.showAlias ? aliasHighlights : undefined
				};

				filteredCommandPicks.push(commandPick);
			}

			// Also add if we have a 100% command ID match
			else if (filter === commandPick.commandId) {
				filteredCommandPicks.push(commandPick);
			}

			// Handle tf-idf scoring for the rest if there's a filter
			else if (filter.length >= 3) {
				const tfidf = runTfidf();
				if (token.isCancellationRequested) {
					return [];
				}

				// Add if we have a tf-idf score
				const tfidfScore = tfidf.find(score => score.key === commandPick.commandId);
				if (tfidfScore) {
					commandPick.tfIdfScore = tfidfScore.score;
					filteredCommandPicks.push(commandPick);
				}
			}
		}

		// Add description to commands that have duplicate labels
		const mapLabelToCommand = new Map<string, ICommandQuickPick>();
		for (const commandPick of filteredCommandPicks) {
			const existingCommandForLabel = mapLabelToCommand.get(commandPick.label);
			if (existingCommandForLabel) {
				commandPick.description = commandPick.commandId;
				existingCommandForLabel.description = existingCommandForLabel.commandId;
			} else {
				mapLabelToCommand.set(commandPick.label, commandPick);
			}
		}

		// Sort by MRU order and fallback to name otherwise
		filteredCommandPicks.sort((commandPickA, commandPickB) => {

			// If a result came from tf-idf, we want to put that towards the bottom
			if (commandPickA.tfIdfScore && commandPickB.tfIdfScore) {
				if (commandPickA.tfIdfScore === commandPickB.tfIdfScore) {
					return commandPickA.label.localeCompare(commandPickB.label); // prefer lexicographically smaller command
				}

				return commandPickB.tfIdfScore - commandPickA.tfIdfScore; // prefer higher tf-idf score
			} else if (commandPickA.tfIdfScore) {
				return 1; // first command has a score but other doesn't so other wins
			} else if (commandPickB.tfIdfScore) {
				return -1; // other command has a score but first doesn't so first wins
			}

			const commandACounter = this.commandsHistory.peek(commandPickA.commandId);
			const commandBCounter = this.commandsHistory.peek(commandPickB.commandId);

			if (commandACounter && commandBCounter) {
				return commandACounter > commandBCounter ? -1 : 1; // use more recently used command before older
			}

			if (commandACounter) {
				return -1; // first command was used, so it wins over the non used one
			}

			if (commandBCounter) {
				return 1; // other command was used so it wins over the command
			}

			if (this.options.suggestedCommandIds) {
				const commandASuggestion = this.options.suggestedCommandIds.has(commandPickA.commandId);
				const commandBSuggestion = this.options.suggestedCommandIds.has(commandPickB.commandId);
				if (commandASuggestion && commandBSuggestion) {
					return 0; // honor the order of the array
				}

				if (commandASuggestion) {
					return -1; // first command was suggested, so it wins over the non suggested one
				}

				if (commandBSuggestion) {
					return 1; // other command was suggested so it wins over the command
				}
			}

			// if one is Developer and the other isn't, put non-Developer first
			const isDeveloperA = commandPickA.commandCategory === Categories.Developer.value;
			const isDeveloperB = commandPickB.commandCategory === Categories.Developer.value;
			if (isDeveloperA && !isDeveloperB) {
				return 1;
			}
			if (!isDeveloperA && isDeveloperB) {
				return -1;
			}

			// both commands were never used, so we sort by name
			return commandPickA.label.localeCompare(commandPickB.label);
		});

		const commandPicks: Array<ICommandQuickPick | IQuickPickSeparator> = [];

		let addOtherSeparator = false;
		let addSuggestedSeparator = true;
		let addCommonlyUsedSeparator = !!this.options.suggestedCommandIds;
		for (let i = 0; i < filteredCommandPicks.length; i++) {
			const commandPick = filteredCommandPicks[i];
			const isInHistory = !!this.commandsHistory.peek(commandPick.commandId);

			// Separator: recently used
			if (i === 0 && isInHistory) {
				commandPicks.push({ type: 'separator', label: localize('recentlyUsed', "recently used") });
				addOtherSeparator = true;
			}

			if (addSuggestedSeparator && commandPick.tfIdfScore !== undefined) {
				commandPicks.push({ type: 'separator', label: localize('suggested', "similar commands") });
				addSuggestedSeparator = false;
			}

			// Separator: commonly used
			if (addCommonlyUsedSeparator && commandPick.tfIdfScore === undefined && !isInHistory && this.options.suggestedCommandIds?.has(commandPick.commandId)) {
				commandPicks.push({ type: 'separator', label: localize('commonlyUsed', "commonly used") });
				addOtherSeparator = true;
				addCommonlyUsedSeparator = false;
			}

			// Separator: other commands
			if (addOtherSeparator && commandPick.tfIdfScore === undefined && !isInHistory && !this.options.suggestedCommandIds?.has(commandPick.commandId)) {
				commandPicks.push({ type: 'separator', label: localize('morecCommands', "other commands") });
				addOtherSeparator = false;
			}

			// Command
			commandPicks.push(this.toCommandPick(commandPick, runOptions, isInHistory));
		}

		if (!this.hasAdditionalCommandPicks(filter, token)) {
			return commandPicks;
		}

		return {
			picks: commandPicks,
			additionalPicks: (async (): Promise<Picks<ICommandQuickPick>> => {
				const additionalCommandPicks = await this.getAdditionalCommandPicks(allCommandPicks, filteredCommandPicks, filter, token);
				if (token.isCancellationRequested) {
					return [];
				}

				const commandPicks: Array<ICommandQuickPick | IQuickPickSeparator> = additionalCommandPicks.map(commandPick => this.toCommandPick(commandPick, runOptions));
				// Basically, if we haven't already added a separator, we add one before the additional picks so long
				// as one hasn't been added to the start of the array.
				if (addSuggestedSeparator && commandPicks[0]?.type !== 'separator') {
					commandPicks.unshift({ type: 'separator', label: localize('suggested', "similar commands") });
				}
				return commandPicks;
			})()
		};
	}

	private toCommandPick(commandPick: ICommandQuickPick | IQuickPickSeparator, runOptions?: IQuickAccessProviderRunOptions, isRecentlyUsed: boolean = false): ICommandQuickPick | IQuickPickSeparator {
		if (commandPick.type === 'separator') {
			return commandPick;
		}

		const keybinding = this.keybindingService.lookupKeybinding(commandPick.commandId);
		const ariaLabel = keybinding ?
			localize('commandPickAriaLabelWithKeybinding', "{0}, {1}", commandPick.label, keybinding.getAriaLabel()) :
			commandPick.label;

		// Add remove button for recently used items (as the last button, to the right)
		const existingButtons = commandPick.buttons || [];
		const buttons = isRecentlyUsed ? [
			...existingButtons,
			{
				iconClass: ThemeIcon.asClassName(Codicon.close),
				tooltip: localize('removeFromRecentlyUsed', "Remove from Recently Used")
			}
		] : commandPick.buttons;

		return {
			...commandPick,
			ariaLabel,
			detail: this.options.showAlias && commandPick.commandAlias !== commandPick.label ? commandPick.commandAlias : undefined,
			keybinding,
			buttons,
			accept: async () => {

				// Add to history
				this.commandsHistory.push(commandPick.commandId);

				// Telementry
				this.telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', {
					id: commandPick.commandId,
					from: runOptions?.from ?? 'quick open'
				});

				// Run
				try {
					commandPick.args?.length
						? await this.commandService.executeCommand(commandPick.commandId, ...commandPick.args)
						: await this.commandService.executeCommand(commandPick.commandId);
				} catch (error) {
					if (!isCancellationError(error)) {
						this.dialogService.error(localize('canNotRun', "Command '{0}' resulted in an error", commandPick.label), toErrorMessage(error));
					}
				}
			},
			trigger: isRecentlyUsed ? (buttonIndex: number, keyMods: IKeyMods): TriggerAction | Promise<TriggerAction> => {
				// The remove button is now the last button
				const removeButtonIndex = existingButtons.length;
				if (buttonIndex === removeButtonIndex) {
					this.commandsHistory.remove(commandPick.commandId);
					return TriggerAction.REMOVE_ITEM;
				}
				// Handle other buttons (e.g., configure keybinding button)
				if (commandPick.trigger) {
					return commandPick.trigger(buttonIndex, keyMods);
				}
				return TriggerAction.NO_ACTION;
			} : commandPick.trigger
		};
	}

	// TF-IDF string to be indexed
	private getTfIdfChunk({ label, commandAlias, commandDescription }: ICommandQuickPick) {
		let chunk = label;
		if (commandAlias && commandAlias !== label) {
			chunk += ` - ${commandAlias}`;
		}
		if (commandDescription && commandDescription.value !== label) {
			// If the original is the same as the value, don't add it
			chunk += ` - ${commandDescription.value === commandDescription.original ? commandDescription.value : `${commandDescription.value} (${commandDescription.original})`}`;
		}
		return chunk;
	}

	protected abstract getCommandPicks(token: CancellationToken): Promise<Array<ICommandQuickPick>>;

	protected abstract hasAdditionalCommandPicks(filter: string, token: CancellationToken): boolean;
	protected abstract getAdditionalCommandPicks(allPicks: ICommandQuickPick[], picksSoFar: ICommandQuickPick[], filter: string, token: CancellationToken): Promise<Array<ICommandQuickPick | IQuickPickSeparator>>;
}

interface ISerializedCommandHistory {
	readonly usesLRU?: boolean;
	readonly entries: { key: string; value: number }[];
}

interface ICommandsQuickAccessConfiguration {
	readonly workbench: {
		readonly commandPalette: {
			readonly history: number;
			readonly preserveInput: boolean;
		};
	};
}

export class CommandsHistory extends Disposable {

	static readonly DEFAULT_COMMANDS_HISTORY_LENGTH = 50;

	private static readonly PREF_KEY_CACHE = 'commandPalette.mru.cache';
	private static readonly PREF_KEY_COUNTER = 'commandPalette.mru.counter';

	private static cache: LRUCache<string, number> | undefined;
	private static counter = 1;
	private static hasChanges = false;

	private configuredCommandsHistoryLength = 0;

	constructor(
		@IStorageService private readonly storageService: IStorageService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ILogService private readonly logService: ILogService
	) {
		super();

		this.updateConfiguration();
		this.load();

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.configurationService.onDidChangeConfiguration(e => this.updateConfiguration(e)));
		this._register(this.storageService.onWillSaveState(e => {
			if (e.reason === WillSaveStateReason.SHUTDOWN) {
				// Commands history is very dynamic and so we limit impact
				// on storage to only save on shutdown. This helps reduce
				// the overhead of syncing this data across machines.
				this.saveState();
			}
		}));
	}

	private updateConfiguration(e?: IConfigurationChangeEvent): void {
		if (e && !e.affectsConfiguration('workbench.commandPalette.history')) {
			return;
		}

		this.configuredCommandsHistoryLength = CommandsHistory.getConfiguredCommandHistoryLength(this.configurationService);

		if (CommandsHistory.cache && CommandsHistory.cache.limit !== this.configuredCommandsHistoryLength) {
			CommandsHistory.cache.limit = this.configuredCommandsHistoryLength;
			CommandsHistory.hasChanges = true;
		}
	}

	private load(): void {
		const raw = this.storageService.get(CommandsHistory.PREF_KEY_CACHE, StorageScope.PROFILE);
		let serializedCache: ISerializedCommandHistory | undefined;
		if (raw) {
			try {
				serializedCache = JSON.parse(raw);
			} catch (error) {
				this.logService.error(`[CommandsHistory] invalid data: ${error}`);
			}
		}

		const cache = CommandsHistory.cache = new LRUCache<string, number>(this.configuredCommandsHistoryLength, 1);
		if (serializedCache) {
			let entries: { key: string; value: number }[];
			if (serializedCache.usesLRU) {
				entries = serializedCache.entries;
			} else {
				entries = serializedCache.entries.sort((a, b) => a.value - b.value);
			}
			entries.forEach(entry => cache.set(entry.key, entry.value));
		}

		CommandsHistory.counter = this.storageService.getNumber(CommandsHistory.PREF_KEY_COUNTER, StorageScope.PROFILE, CommandsHistory.counter);
	}

	push(commandId: string): void {
		if (!CommandsHistory.cache) {
			return;
		}

		CommandsHistory.cache.set(commandId, CommandsHistory.counter++); // set counter to command
		CommandsHistory.hasChanges = true;
	}

	peek(commandId: string): number | undefined {
		return CommandsHistory.cache?.peek(commandId);
	}

	remove(commandId: string): void {
		if (!CommandsHistory.cache) {
			return;
		}

		CommandsHistory.cache.delete(commandId);
		CommandsHistory.hasChanges = true;
	}

	private saveState(): void {
		if (!CommandsHistory.cache) {
			return;
		}

		if (!CommandsHistory.hasChanges) {
			return;
		}

		const serializedCache: ISerializedCommandHistory = { usesLRU: true, entries: [] };
		CommandsHistory.cache.forEach((value, key) => serializedCache.entries.push({ key, value }));

		this.storageService.store(CommandsHistory.PREF_KEY_CACHE, JSON.stringify(serializedCache), StorageScope.PROFILE, StorageTarget.USER);
		this.storageService.store(CommandsHistory.PREF_KEY_COUNTER, CommandsHistory.counter, StorageScope.PROFILE, StorageTarget.USER);
		CommandsHistory.hasChanges = false;
	}

	static getConfiguredCommandHistoryLength(configurationService: IConfigurationService): number {
		const config = configurationService.getValue<ICommandsQuickAccessConfiguration>();

		const configuredCommandHistoryLength = config.workbench?.commandPalette?.history;
		if (typeof configuredCommandHistoryLength === 'number') {
			return configuredCommandHistoryLength;
		}

		return CommandsHistory.DEFAULT_COMMANDS_HISTORY_LENGTH;
	}

	static clearHistory(configurationService: IConfigurationService, storageService: IStorageService): void {
		const commandHistoryLength = CommandsHistory.getConfiguredCommandHistoryLength(configurationService);
		CommandsHistory.cache = new LRUCache<string, number>(commandHistoryLength);
		CommandsHistory.counter = 1;

		CommandsHistory.hasChanges = true;
	}
}
```

--------------------------------------------------------------------------------

````
